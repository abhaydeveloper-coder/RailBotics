import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Clock,
  Train,
  AlertTriangle,
  CloudRain,
  Settings,
  BarChart3,
  CheckCircle,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

// --- Helper Components & Hooks (Placeholders) ---
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>{children}</div>
);
const Button: React.FC<{ children: React.ReactNode; onClick?: () => void; disabled?: boolean; variant?: 'outline'; size?: 'sm'; className?: string; }> = ({ children, onClick, disabled, variant, size, className }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base';
  const variantClasses = variant === 'outline' ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  return <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}>{children}</button>;
};
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'lg'; }> = ({ isOpen, onClose, title, children, size }) => {
  if (!isOpen) return null;
  const sizeClass = size === 'lg' ? 'max-w-3xl' : 'max-w-md';
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`bg-white rounded-lg shadow-xl w-full ${sizeClass} relative`}>
        <div className="flex justify-between items-center p-4 border-b"><h2 className="text-xl font-semibold text-gray-800">{title}</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button></div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};
const useToast = () => {
  const showToast = ({ type, title, message }: { type: string, title: string, message: string }) => { console.log(`[Toast: ${type}] ${title}: ${message}`); };
  return { showToast };
};

// --- Simulation Results Sub-Component ---
interface SimulationResultsProps { results: any; }
const SimulationResults: React.FC<SimulationResultsProps> = ({ results }) => {
  const getChangeIcon = (before: number, after: number, lowerIsBetter = false) => {
    if (before === after) return null;
    const improved = lowerIsBetter ? after < before : after > before;
    return improved ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />;
  };
  const getChangeColor = (before: number, after: number, lowerIsBetter = false) => {
    if (before === after) return 'text-gray-600';
    const improved = lowerIsBetter ? after < before : after > before;
    return improved ? 'text-green-600' : 'text-red-600';
  };
  const formatChange = (before: number, after: number, unit = '') => {
    const change = after - before;
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(0)}${unit}`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg"><CheckCircle className="w-8 h-8 text-green-600" /></div>
          <div><h2 className="text-2xl font-bold text-gray-900">Simulation Complete</h2><p className="font-semibold text-gray-700">Scenario: {results.scenarioTitle}</p></div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Performance Impact Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {(['Punctuality', 'Avg Delay', 'Throughput', 'Utilization'] as const).map(key => {
            const lowerIsBetter = key === 'Avg Delay';
            const unit = (key === 'Punctuality' || key === 'Utilization' || key === 'Throughput') ? '%' : ' min';

            let dataKey: string;
            if (key === 'Avg Delay') {
              dataKey = 'averageDelay';
            } else if (key === 'Throughput') {
              dataKey = 'throughputPercentage';
            } else {
              dataKey = key.toLowerCase();
            }

            const before = results.before[dataKey as keyof typeof results.before];
            const after = results.after[dataKey as keyof typeof results.after];

            return (
              <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-gray-700 mb-2">{key}</h4>
                <p className="text-3xl font-bold text-gray-900">{after.toFixed(0)}{unit}</p>
                <div className={`flex items-center justify-center space-x-1 font-semibold ${getChangeColor(before, after, lowerIsBetter)}`}>
                  {getChangeIcon(before, after, lowerIsBetter)}
                  <span>{formatChange(before, after, unit)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">from {before.toFixed(0)}{unit}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Delay Impact by Train Type (mins)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results.delaysByType} margin={{ top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="before" fill="#10B981" name="Before" radius={[4, 4, 0, 0]} />
              <Bar dataKey="after" fill="#EF4444" name="After (Simulated)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Punctuality Trend (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={results.punctualityTrend} margin={{ top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[50, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="before" stroke="#10B981" strokeWidth={2} name="Before" />
              <Line type="monotone" dataKey="after" stroke="#EF4444" strokeWidth={2} name="After (Simulated)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">AI-Generated Action Plan</h3>
        <div className="space-y-3">
          {results.recommendations.map((rec: string, index: number) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="bg-blue-100 p-2 rounded-full h-8 w-8 flex items-center justify-center"><span className="text-blue-600 font-bold text-sm">{index + 1}</span></div>
              <div className="flex-1"><p className="text-blue-900 font-medium">{rec}</p></div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

// --- Main Simulation Page Component ---

export const SimulationPage: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [scenarioModal, setScenarioModal] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const { showToast } = useToast();

  const scenarios = [
    { id: 'delay', title: 'Express Train Delay (20 min)', description: 'Simulate major express train delay and analyze cascading effects on schedule', icon: <Clock className="w-6 h-6" />, color: 'text-yellow-600', bgColor: 'bg-yellow-100', impact: 'High impact on punctuality' },
    { id: 'breakdown', title: 'Engine Breakdown Emergency', description: 'Critical engine failure requiring immediate track clearance and rerouting', icon: <AlertTriangle className="w-6 h-6" />, color: 'text-red-600', bgColor: 'bg-red-100', impact: 'Critical impact on capacity' },
    { id: 'weather', title: 'Heavy Monsoon Impact', description: 'Severe weather conditions affecting visibility and track conditions', icon: <CloudRain className="w-6 h-6" />, color: 'text-blue-600', bgColor: 'bg-blue-100', impact: 'Moderate impact on speed' },
    { id: 'maintenance', title: 'Emergency Track Maintenance', description: 'Urgent track repair requiring section closure and traffic diversion', icon: <Settings className="w-6 h-6" />, color: 'text-purple-600', bgColor: 'bg-purple-100', impact: 'High impact on routing' },
    { id: 'signal', title: 'Signal System Failure', description: 'Multiple signal failures requiring manual control and reduced speeds', icon: <AlertTriangle className="w-6 h-6" />, color: 'text-orange-600', bgColor: 'bg-orange-100', impact: 'Critical impact on operations' },
    { id: 'passenger', title: 'Medical Emergency', description: 'Passenger medical emergency requiring immediate station stop', icon: <AlertTriangle className="w-6 h-6" />, color: 'text-pink-600', bgColor: 'bg-pink-100', impact: 'Moderate impact on schedule' }
  ];

  const priorityWeights = { Express: 10, Local: 4, Freight: 2, Special: 7 };
  const mockActiveTrains = [
    { id: 'T1', type: 'Express', speed: 110, delay: 0 }, { id: 'T2', type: 'Express', speed: 120, delay: 5 },
    { id: 'T3', type: 'Local', speed: 60, delay: 10 }, { id: 'T4', type: 'Local', speed: 55, delay: 0 },
    { id: 'T5', type: 'Local', speed: 65, delay: 2 }, { id: 'T6', type: 'Freight', speed: 45, delay: 20 },
    { id: 'T7', type: 'Freight', speed: 50, delay: 15 }
  ];

  const calculateThroughputScore = (trains: typeof mockActiveTrains) => {
    return trains.reduce((score, train) => {
      const weight = priorityWeights[train.type as keyof typeof priorityWeights] || 0;
      const delayPenalty = Math.max(0, 1 - (train.delay / 60));
      return score + (weight * train.speed * delayPenalty);
    }, 0);
  };

  const maxThroughputScore = useMemo(() => {
    return mockActiveTrains.reduce((score, train) => {
      const weight = priorityWeights[train.type as keyof typeof priorityWeights] || 0;
      return score + (weight * train.speed);
    }, 0);
  }, []);

  const baselineData = {
    punctuality: 92,
    averageDelay: 8,
    throughputPercentage: maxThroughputScore > 0 ? Math.round((calculateThroughputScore(mockActiveTrains) / maxThroughputScore) * 100) : 0,
    utilization: 76,
    delaysByType: [
      { type: 'Express', before: 6 },
      { type: 'Local', before: 5 },
      { type: 'Freight', before: 15 }
    ],
    punctualityTrend: [
      { time: '08:00', before: 95 }, { time: '10:00', before: 92 }, { time: '12:00', before: 90 },
      { time: '14:00', before: 88 }, { time: '16:00', before: 91 }, { time: '18:00', before: 89 }
    ]
  };

  const scenarioRecommendations = {
    delay: ['Prioritize high-speed trains and adjust local train schedules to minimize platform congestion.', 'Communicate revised ETAs to passengers and connecting stations immediately.', 'Analyze the root cause of the delay to prevent future occurrences.', 'Temporarily increase headway between following trains to create buffer time.'],
    breakdown: ['Dispatch the nearest emergency engineering team to the breakdown location.', 'Reroute all approaching traffic to alternative tracks or loop lines.', 'Arrange for a rescue locomotive to tow the failed train to the nearest yard.', 'Provide clear updates to affected passengers regarding the rescue operation timeline.'],
    weather: ['Impose a temporary speed restriction across the entire affected section.', 'Increase patrol frequency to monitor track conditions, signals, and overhead lines.', 'Activate contingency plans for potential waterlogging at low-lying stations.', 'Advise passengers of potential widespread delays and offer ticket flexibility.'],
    maintenance: ['Establish a clear block corridor for the maintenance crew with safety protocols.', 'Divert all traffic using pre-defined alternative routes for the duration of the repair.', 'Coordinate with station masters to manage passenger flow and platform changes.', 'Conduct a post-repair inspection and speed test before resuming normal operations.'],
    signal: ['Switch to manual authorization protocols for train movement in the affected area.', 'Deploy technical staff to the nearest signal cabin for on-site diagnosis.', 'Instruct locomotive pilots to proceed with extreme caution and reduced visibility rules.', 'Run a full system diagnostic after the fault is rectified to ensure system integrity.'],
    passenger: ['Arrange for paramedics and station staff to meet the train at the next designated stop.', 'Make onboard announcements to inform other passengers of the unscheduled stop.', 'Coordinate with control to minimize the delay to the schedule post-emergency.', 'Log the incident and the total delay incurred for performance review.']
  };

  const getRandomInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const runSimulation = (scenarioId: string) => {
    setIsSimulating(true);
    setScenarioModal(false);
    showToast({ type: 'info', title: 'Simulation Started', message: `Running ${scenarios.find(s => s.id === scenarioId)?.title} scenario...` });

    setTimeout(() => {
      const results = generateSimulationResults(scenarioId);
      setSimulationResults(results);
      setIsSimulating(false);
      showToast({ type: 'success', title: 'Simulation Complete', message: 'Results are ready for analysis.' });
    }, 2500);
  };

  const generateSimulationResults = (scenarioId: string) => {
    const impacts = {
      delay: { punctuality: [-20, -12], delay: [10, 18], utilization: [8, 15], speedFactor: { Express: 0.8, Local: 0.9, Freight: 1.0 }, delayImpactFactor: { Express: 1.8, Local: 1.3, Freight: 1.1 } },
      breakdown: { punctuality: [-30, -20], delay: [15, 25], utilization: [15, 20], speedFactor: { Express: 0.6, Local: 0.7, Freight: 0.5 }, delayImpactFactor: { Express: 2.5, Local: 1.8, Freight: 1.5 } },
      weather: { punctuality: [-25, -15], delay: [12, 20], utilization: [10, 18], speedFactor: { Express: 0.7, Local: 0.7, Freight: 0.6 }, delayImpactFactor: { Express: 1.5, Local: 2.0, Freight: 2.2 } },
      maintenance: { punctuality: [-22, -14], delay: [14, 22], utilization: [12, 18], speedFactor: { Express: 0.75, Local: 0.8, Freight: 0.6 }, delayImpactFactor: { Express: 1.9, Local: 1.9, Freight: 1.9 } },
      signal: { punctuality: [-35, -25], delay: [20, 30], utilization: [18, 25], speedFactor: { Express: 0.5, Local: 0.6, Freight: 0.6 }, delayImpactFactor: { Express: 2.8, Local: 2.2, Freight: 1.8 } },
      passenger: { punctuality: [-15, -8], delay: [8, 15], utilization: [5, 10], speedFactor: { Express: 0.9, Local: 0.95, Freight: 1.0 }, delayImpactFactor: { Express: 1.4, Local: 1.1, Freight: 1.0 } }
    };

    const impact = impacts[scenarioId as keyof typeof impacts];

    const simulatedTrains = mockActiveTrains.map(train => ({
      ...train,
      speed: Math.round(train.speed * (impact.speedFactor[train.type as keyof typeof impact.speedFactor] || 1)),
      delay: train.delay + getRandomInRange(impact.delay[0], impact.delay[1] / 2) // Also increase delay in simulation
    }));

    const newThroughputScore = calculateThroughputScore(simulatedTrains);

    const afterMetrics = {
      punctuality: Math.max(0, baselineData.punctuality + getRandomInRange(impact.punctuality[0], impact.punctuality[1])),
      averageDelay: baselineData.averageDelay + getRandomInRange(impact.delay[0], impact.delay[1]),
      throughputPercentage: maxThroughputScore > 0 ? Math.round((newThroughputScore / maxThroughputScore) * 100) : 0,
      utilization: Math.min(100, baselineData.utilization + getRandomInRange(impact.utilization[0], impact.utilization[1])),
    };

    const newDelaysByType = baselineData.delaysByType.map(train => ({
      type: train.type,
      before: train.before,
      after: Math.round(train.before * impact.delayImpactFactor[train.type as keyof typeof impact.delayImpactFactor]) + getRandomInRange(1, 5)
    }));
    const newPunctualityTrend = baselineData.punctualityTrend.map(point => ({
      ...point,
      after: Math.max(50, point.before + getRandomInRange(impact.punctuality[0], impact.punctuality[1]))
    }));

    const recommendations = scenarioRecommendations[scenarioId as keyof typeof scenarioRecommendations];

    return {
      scenario: scenarioId,
      scenarioTitle: scenarios.find(s => s.id === scenarioId)?.title,
      before: baselineData,
      after: afterMetrics,
      delaysByType: newDelaysByType,
      punctualityTrend: newPunctualityTrend,
      recommendations: recommendations
    };
  };

  const resetSimulation = () => {
    setSimulationResults(null);
    showToast({ type: 'info', title: 'Simulation Reset', message: 'Ready for a new scenario.' });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div><h1 className="text-3xl font-bold text-gray-900">What-If Simulation</h1><p className="text-gray-600 mt-1">Test scenarios and analyze system response</p></div>
          <div className="flex space-x-3">
            <Button onClick={() => setScenarioModal(true)} disabled={isSimulating}><Play className="w-4 h-4 mr-2" />Run Simulation</Button>
            {simulationResults && <Button onClick={resetSimulation} variant="outline"><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>}
          </div>
        </div>

        {isSimulating && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 bg-blue-50 border-blue-200"><div className="flex items-center space-x-4"><div className="animate-spin"><Settings className="w-8 h-8 text-blue-600" /></div><div><h3 className="font-semibold text-blue-900">Simulation Running...</h3><p className="text-blue-700">Processing scenario and optimizing schedules</p></div></div></Card>
        </motion.div>}

        {!simulationResults && !isSimulating && <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Available Simulation Scenarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((scenario, index) => (
                <motion.div key={scenario.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => runSimulation(scenario.id)} className="cursor-pointer border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className={`${scenario.bgColor} p-3 rounded-lg`}><div className={scenario.color}>{scenario.icon}</div></div>
                    <div className="flex-1"><h3 className="font-semibold text-gray-900 mb-2">{scenario.title}</h3><p className="text-gray-600 text-sm mb-3">{scenario.description}</p><div className="mt-auto p-2 bg-gray-50 rounded text-xs text-gray-500"><strong>Impact:</strong> {scenario.impact}</div></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Current System Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center"><div className="bg-green-100 p-4 rounded-lg mb-3 inline-block"><Target className="w-8 h-8 text-green-600" /></div><p className="text-2xl font-bold text-gray-900">{baselineData.punctuality}%</p><p className="text-sm text-gray-600">Punctuality</p></div>
              <div className="text-center"><div className="bg-yellow-100 p-4 rounded-lg mb-3 inline-block"><Clock className="w-8 h-8 text-yellow-600" /></div><p className="text-2xl font-bold text-gray-900">{baselineData.averageDelay} min</p><p className="text-sm text-gray-600">Avg Delay</p></div>
              <div className="text-center"><div className="bg-blue-100 p-4 rounded-lg mb-3 inline-block"><Train className="w-8 h-8 text-blue-600" /></div><p className="text-2xl font-bold text-gray-900">{baselineData.throughputPercentage}%</p><p className="text-sm text-gray-600">Throughput</p></div>
              <div className="text-center"><div className="bg-purple-100 p-4 rounded-lg mb-3 inline-block"><BarChart3 className="w-8 h-8 text-purple-600" /></div><p className="text-2xl font-bold text-gray-900">{baselineData.utilization}%</p><p className="text-sm text-gray-600">Utilization</p></div>
            </div>
          </Card>
        </div>}

        {simulationResults && !isSimulating && <SimulationResults results={simulationResults} />}

        <Modal isOpen={scenarioModal} onClose={() => setScenarioModal(false)} title="Select Simulation Scenario" size="lg">
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <div key={scenario.id} onClick={() => runSimulation(scenario.id)} className="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all duration-200">
                <div className={`${scenario.bgColor} p-3 rounded-lg`}><div className={scenario.color}>{scenario.icon}</div></div>
                <div className="flex-1"><h3 className="font-semibold">{scenario.title}</h3><p className="text-gray-600 text-sm">{scenario.description}</p></div>
                <Button size="sm" className="ml-auto">Select</Button>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};
