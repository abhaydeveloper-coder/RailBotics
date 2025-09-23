import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { 
  TrendingUp, 
  Clock, 
  Train, 
  Target,
  Calendar,
  BarChart3,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

export const KPIsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Generate dynamic data based on time range
  const generateData = () => {
    const baseData = {
      punctuality: Math.floor(Math.random() * 10) + 85,
      avgDelay: Math.floor(Math.random() * 5) + 6,
      throughput: Math.floor(Math.random() * 4) + 22,
      utilization: Math.floor(Math.random() * 15) + 70
    };

    const punctualityTrend = Array.from({ length: timeRange === 'today' ? 12 : 7 }, (_, i) => ({
      time: timeRange === 'today' ? `${8 + i}:00` : `Day ${i + 1}`,
      punctuality: Math.floor(Math.random() * 15) + 80,
      target: 90
    }));

    const delaysByType = [
      { type: 'Express', delay: Math.floor(Math.random() * 5) + 3, count: Math.floor(Math.random() * 10) + 15 },
      { type: 'Local', delay: Math.floor(Math.random() * 8) + 5, count: Math.floor(Math.random() * 15) + 20 },
      { type: 'Freight', delay: Math.floor(Math.random() * 12) + 10, count: Math.floor(Math.random() * 8) + 5 }
    ];

    const sectionUtilization = [
      { name: 'Express', value: Math.floor(Math.random() * 10) + 40, color: '#3B82F6' },
      { name: 'Local', value: Math.floor(Math.random() * 10) + 30, color: '#10B981' },
      { name: 'Freight', value: Math.floor(Math.random() * 5) + 15, color: '#F59E0B' },
      { name: 'Special', value: Math.floor(Math.random() * 3) + 3, color: '#8B5CF6' }
    ];

    const hourlyThroughput = Array.from({ length: 12 }, (_, i) => ({
      hour: `${8 + i}:00`,
      trains: Math.floor(Math.random() * 6) + 18,
      capacity: 30,
      efficiency: Math.floor(Math.random() * 20) + 70
    }));

    return { baseData, punctualityTrend, delaysByType, sectionUtilization, hourlyThroughput };
  };

  const [data, setData] = useState(generateData());

  // Update data when time range changes
  useEffect(() => {
    setData(generateData());
  }, [timeRange]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  const getPunctualityColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDelayColor = (delay: number) => {
    if (delay <= 5) return 'text-green-600';
    if (delay <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KPIs & Analytics</h1>
          <p className="text-gray-600">Performance metrics and operational insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Metrics</option>
              <option value="punctuality">Punctuality</option>
              <option value="delays">Delays</option>
              <option value="throughput">Throughput</option>
              <option value="utilization">Utilization</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Punctuality</p>
                <p className={`text-2xl font-bold ${getPunctualityColor(data.baseData.punctuality)}`}>
                  {data.baseData.punctuality}%
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Target: 90%
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Delay</p>
                <p className={`text-2xl font-bold ${getDelayColor(data.baseData.avgDelay)}`}>
                  {data.baseData.avgDelay} min
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Target: &lt;5 min
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Throughput</p>
                <p className="text-2xl font-bold text-blue-600">{data.baseData.throughput}/hr</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Train className="w-3 h-3 mr-1" />
                  Capacity: 30/hr
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Train className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization</p>
                <p className="text-2xl font-bold text-purple-600">{data.baseData.utilization}%</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Optimal: 75-85%
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Punctuality Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Punctuality Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.punctualityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="punctuality" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#EF4444" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Delays by Train Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Average Delays by Train Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.delaysByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="delay" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Section Utilization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Section Utilization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.sectionUtilization}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.sectionUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {data.sectionUtilization.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-gray-600">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Hourly Throughput */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Hourly Throughput vs Capacity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.hourlyThroughput}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="trains" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Actual Trains"
                />
                <Line 
                  type="monotone" 
                  dataKey="capacity" 
                  stroke="#EF4444" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="Capacity"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">🟢 Performing Well</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Express train punctuality above target</li>
                <li>• Signal response times optimal</li>
                <li>• Platform utilization efficient</li>
                <li>• Conflict resolution time decreased</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-yellow-600">🟡 Needs Attention</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Local train delays increasing</li>
                <li>• Peak hour bottlenecks</li>
                <li>• Weekend schedule optimization</li>
                <li>• Passenger loading time</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-red-600">🔴 Critical Issues</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Freight train delays exceeding limits</li>
                <li>• Track utilization near capacity</li>
                <li>• Emergency response coordination</li>
                <li>• Weather impact mitigation</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};