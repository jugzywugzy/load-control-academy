'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ResponsiveContainer } from 'recharts';
import { FlightState } from '../types/aviation.types';
import { calculateTotalCG, calculateMAC } from '../engine/math';

interface TrimChartProps {
  flight: FlightState;
  zfw: number;
  tow: number;
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null; 
  return (
    <circle cx={cx} cy={cy} r={6} fill={payload.fill} stroke="#1e293b" strokeWidth={2} />
  );
};

export default function TrimChart({ flight, zfw, tow }: TrimChartProps) {
  if (!flight.aircraft) return null;

  const emptyArm = flight.aircraft.trim.referenceArm - 0.5; 
  const zfwCG = calculateTotalCG(flight.aircraft.dow, emptyArm, flight.payload || []);
  const zfwMAC = calculateMAC(zfwCG, flight.aircraft.trim);

  const fuelArm = 14.8;
  const towCG = calculateTotalCG(
    zfw, 
    zfwCG, 
    // Actually fixed: only weight and arm are passed to the math engine
    [{ weight: flight.takeoffFuel || 0, arm: fuelArm }] 
  );
  const towMAC = calculateMAC(towCG, flight.aircraft.trim);

  const data = [
    { name: 'Zero Fuel Wt', mac: zfwMAC, weight: zfw, fill: '#f59e0b' },
    { name: 'Takeoff Wt', mac: towMAC, weight: tow, fill: '#3b82f6' }
  ];

  return (
    <div className="h-72 w-full bg-slate-900 rounded border border-slate-700 p-4 mt-4">
      <h4 className="text-sm text-slate-400 mb-2 font-semibold">Live Trim Envelope (%MAC)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          
          <XAxis 
            type="number" 
            dataKey="mac" 
            domain={[10, 40]} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickCount={7}
          />
          <YAxis 
            type="number" 
            dataKey="weight" 
            domain={[40000, 80000]} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            width={60}
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
            formatter={(value: any, name: any) => name === 'weight' ? [`${value} kg`, 'Weight'] : [`${Number(value).toFixed(2)}%`, 'CG']}
            labelFormatter={(label) => `MAC: ${Number(label).toFixed(2)}%`}
          />
          
          <ReferenceArea x1={18} x2={33} y1={40000} y2={80000} fill="#10b981" fillOpacity={0.15} />
          <ReferenceArea x1={10} x2={18} y1={40000} y2={80000} fill="#ef4444" fillOpacity={0.1} />
          <ReferenceArea x1={33} x2={40} y1={40000} y2={80000} fill="#ef4444" fillOpacity={0.1} />
          
          <Line 
            type="linear" 
            dataKey="weight" 
            stroke="#94a3b8" 
            strokeWidth={2} 
            isAnimationActive={false} 
            dot={<CustomDot />} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}