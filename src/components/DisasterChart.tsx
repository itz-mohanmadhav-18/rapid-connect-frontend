
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

// Mock data for disaster prediction
const predictionData = [
  { name: "2 Days Ago", risk: 20, rainfall: 15 },
  { name: "Yesterday", risk: 35, rainfall: 40 },
  { name: "Today", risk: 70, rainfall: 65 },
  { name: "Tomorrow", risk: 80, rainfall: 75, predicted: true },
  { name: "In 2 Days", risk: 60, rainfall: 50, predicted: true },
];

const DisasterChart: React.FC = () => {
  const getCurrentRiskLevel = () => {
    const today = predictionData.find(item => item.name === "Today");
    return today?.risk || 0;
  };
  
  const getRiskStatus = (riskLevel: number) => {
    if (riskLevel < 30) return { level: "Low", color: "text-success" };
    if (riskLevel < 60) return { level: "Moderate", color: "text-alert" };
    return { level: "High", color: "text-emergency" };
  };
  
  const currentRiskLevel = getCurrentRiskLevel();
  const riskStatus = getRiskStatus(currentRiskLevel);
  
  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Disaster Risk Prediction</span>
          <div className={`flex items-center ${riskStatus.color}`}>
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-sm font-bold">
              {riskStatus.level} Risk
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={predictionData}
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#ddd' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#ddd' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
                formatter={(value: number, name: string) => {
                  if (name === 'risk') return [`${value}%`, 'Risk Level'];
                  return [`${value}mm`, 'Rainfall'];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="risk"
                name="Risk Level"
                stroke="#E63946"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                dot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="rainfall"
                name="Rainfall"
                stroke="#457B9D"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>Prediction based on meteorological data and historical patterns</p>
          <p className="font-medium mt-1">Stay alert and follow local authorities' instructions</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisasterChart;
