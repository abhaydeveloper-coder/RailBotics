import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { 
  Train, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Play,
  Pause,
} from 'lucide-react';
import trainsData from '../data/trains.json';
import conflictsData from '../data/conflicts.json';
import { Train as TrainType, Conflict } from '../types';
import { useToast } from '../hooks/useToast';

export const SchedulePage: React.FC = () => {
  const [trains] = useState<TrainType[]>(trainsData as TrainType[]);
  const [] = useState<Conflict[]>(conflictsData as Conflict[]);
  const [] = useState<Conflict | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  useToast();
  
  // NEW: State to track expanded rows by train ID
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  // NEW: Handler to toggle a row's expanded state
  const handleToggleRow = (trainId: string) => {
    setExpandedRows(current => 
      current.includes(trainId)
        ? current.filter(id => id !== trainId)
        : [...current, trainId]
    );
  };
  
  // Other handlers and functions remain the same...
  const getLiveTrainPosition = (train: TrainType) => {
    // Mock implementation: position is a function of its speed and a time factor.
    // This is a placeholder for a more complex calculation.
    const timeFactor = (currentTime.getMinutes() * 60 + currentTime.getSeconds()) / 3600;
    return (train.speed * timeFactor * 5) % 250;
  };

  return (
    <div className="space-y-6">
      {/* Timeline View */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Live Timeline</h2>
            <span className="text-sm font-mono text-gray-500">{currentTime.toLocaleTimeString()}</span>
          </div>
          <button 
            onClick={() => setIsPlaying(prev => !prev)} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={isPlaying ? "Pause timeline" : "Play timeline"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="relative pt-8">
          {/* ... Timeline Track and Conflict Markers ... */}
          
          {/* Trains List */}
          <div className="relative mt-4 space-y-1"> {/* Reduced space-y for tighter packing */}
            {trains.slice(0, 8).map(train => {
              const isExpanded = expandedRows.includes(train.id);
              const position = Math.max(0, Math.min(100, (getLiveTrainPosition(train) / 250) * 100));
              const isDelayed = train.delay > 5;
              const isCritical = train.delay > 15;

              return (
                <React.Fragment key={train.id}>
                  {/* Clickable Train Row */}
                  <div
                    onClick={() => handleToggleRow(train.id)}
                    className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="w-24 text-sm font-medium truncate">{train.name}</div>
                    <div className="flex-1 relative h-8 bg-gray-100 rounded-lg">
                      <motion.div
                        animate={{ left: `${position}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        className="absolute top-1 -ml-6"
                      >
                        <div className={`w-12 h-6 rounded-lg flex items-center justify-center text-white text-xs ${
                          isCritical ? 'bg-red-500' : isDelayed ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          <Train className="w-4 h-4" />
                        </div>
                      </motion.div>
                    </div>
                    <div className="w-20 text-sm text-right">
                      <span className={`font-medium ${
                        isCritical ? 'text-red-600' : isDelayed ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {train.delay === 0 ? 'On time' : `-${train.delay}m`}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="bg-gray-50/80 p-4 mx-2 rounded-b-lg border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                            <div className="font-semibold text-gray-500">Train ID: <span className="font-normal text-gray-800">{train.id}</span></div>
                            <div className="font-semibold text-gray-500">Route: <span className="font-normal text-gray-800">{train.origin} → {train.destination}</span></div>
                            <div className="font-semibold text-gray-500">Speed: <span className="font-normal text-gray-800">{train.speed} km/h</span></div>
                            <div className="font-semibold text-gray-500">Next Station: <span className="font-normal text-gray-800">{train.nextStation}</span></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </Card>


      {/* Schedule Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Schedule Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-lg mb-3">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-green-600">{trains.filter(t => t.delay <= 5).length}</p>
            <p className="text-sm text-gray-600">On Time Trains</p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 p-4 rounded-lg mb-3">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{trains.filter(t => t.delay > 5 && t.delay <= 15).length}</p>
            <p className="text-sm text-gray-600">Minor Delays</p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-lg mb-3">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-red-600">{trains.filter(t => t.delay > 15).length}</p>
            <p className="text-sm text-gray-600">Major Delays</p>
          </div>
        </div>
      </Card>
    </div>
  );
};