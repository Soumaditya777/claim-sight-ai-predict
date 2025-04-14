
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface ClaimHistoryItem {
  claimId: string;
  policyNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  incidentType: string;
  claimAmount: string;
  incidentDate: string;
  submissionDate: string;
  assessmentDate: string;
  predictionScore: number;
}

const DashboardView = () => {
  const [claimHistory, setClaimHistory] = useState<ClaimHistoryItem[]>([]);
  
  useEffect(() => {
    // Load claim history from localStorage
    const historyData = localStorage.getItem('claimHistory');
    if (historyData) {
      setClaimHistory(JSON.parse(historyData));
    } else {
      // If no history exists, create sample data for demonstration
      const sampleData = generateSampleData();
      localStorage.setItem('claimHistory', JSON.stringify(sampleData));
      setClaimHistory(sampleData);
    }
  }, []);
  
  const generateSampleData = (): ClaimHistoryItem[] => {
    const incidentTypes = ['collision', 'theft', 'vandalism', 'weather', 'fire'];
    const vehicleMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Tesla'];
    const vehicleModels = ['Camry', 'Accord', 'F-150', 'X5', 'Model 3'];
    
    return Array.from({ length: 12 }).map((_, i) => {
      const submissionDate = new Date();
      submissionDate.setDate(submissionDate.getDate() - Math.floor(Math.random() * 90));
      
      const incidentDate = new Date(submissionDate);
      incidentDate.setDate(incidentDate.getDate() - Math.floor(Math.random() * 30));
      
      const assessmentDate = new Date(submissionDate);
      assessmentDate.setDate(assessmentDate.getDate() + 1);
      
      const predictionScore = Math.floor(Math.random() * 100);
      const incidentType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
      const makeIndex = Math.floor(Math.random() * vehicleMakes.length);
      
      return {
        claimId: `CLM${100000 + i}`,
        policyNumber: `POL${200000 + Math.floor(Math.random() * 99999)}`,
        vehicleMake: vehicleMakes[makeIndex],
        vehicleModel: vehicleModels[makeIndex],
        incidentType,
        claimAmount: ((Math.random() * 15000) + 1000).toFixed(0),
        incidentDate: incidentDate.toISOString(),
        submissionDate: submissionDate.toISOString(),
        assessmentDate: assessmentDate.toISOString(),
        predictionScore
      };
    });
  };
  
  const getPredictionLabel = (score: number) => {
    if (score >= 70) return { text: 'Likely Approved', color: 'bg-green-100 text-green-800' };
    if (score >= 40) return { text: 'Manual Review', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Likely Denied', color: 'bg-red-100 text-red-800' };
  };
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };
  
  // Prepare data for charts
  const totalClaims = claimHistory.length;
  const approvedClaims = claimHistory.filter(claim => claim.predictionScore >= 70).length;
  const reviewClaims = claimHistory.filter(claim => claim.predictionScore >= 40 && claim.predictionScore < 70).length;
  const deniedClaims = claimHistory.filter(claim => claim.predictionScore < 40).length;
  
  const pieData = [
    { name: 'Approved', value: approvedClaims, color: '#4ade80' },
    { name: 'Review', value: reviewClaims, color: '#facc15' },
    { name: 'Denied', value: deniedClaims, color: '#f87171' },
  ];
  
  // Calculate incident type distribution
  const incidentTypeCounts: Record<string, number> = {};
  claimHistory.forEach(claim => {
    incidentTypeCounts[claim.incidentType] = (incidentTypeCounts[claim.incidentType] || 0) + 1;
  });
  
  const barData = Object.entries(incidentTypeCounts).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count
  }));
  
  // Calculate total claim amount
  const totalClaimAmount = claimHistory.reduce((sum, claim) => 
    sum + parseInt(claim.claimAmount), 0);
  
  // Get most recent claims for quick view
  const recentClaims = [...claimHistory]
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClaims}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Claim Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalClaimAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Approval Rate</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold mb-2">{Math.round((approvedClaims / totalClaims) * 100)}%</div>
            <Progress value={(approvedClaims / totalClaims) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="claims">Claims History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Claim Status Distribution</CardTitle>
                <CardDescription>Breakdown of claim prediction results</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pt-4">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Incident Type Distribution</CardTitle>
                <CardDescription>Claims by incident category</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Claims</CardTitle>
                <CardDescription>Latest submitted claims</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2 font-medium">Claim ID</th>
                        <th className="pb-2 font-medium">Date</th>
                        <th className="pb-2 font-medium">Type</th>
                        <th className="pb-2 font-medium">Amount</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentClaims.map((claim) => {
                        const predictionLabel = getPredictionLabel(claim.predictionScore);
                        return (
                          <tr key={claim.claimId} className="border-b">
                            <td className="py-3">{claim.claimId}</td>
                            <td className="py-3">{formatDate(claim.submissionDate)}</td>
                            <td className="py-3 capitalize">{claim.incidentType}</td>
                            <td className="py-3">${parseInt(claim.claimAmount).toLocaleString()}</td>
                            <td className="py-3">
                              <Badge variant="secondary" className={predictionLabel.color}>{predictionLabel.text}</Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>All Claims</CardTitle>
              <CardDescription>Complete history of submitted claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-3 font-medium">Claim ID</th>
                      <th className="pb-3 font-medium">Policy</th>
                      <th className="pb-3 font-medium">Vehicle</th>
                      <th className="pb-3 font-medium">Incident</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claimHistory.map((claim) => {
                      const predictionLabel = getPredictionLabel(claim.predictionScore);
                      return (
                        <tr key={claim.claimId} className="border-b">
                          <td className="py-3">{claim.claimId}</td>
                          <td className="py-3">{claim.policyNumber}</td>
                          <td className="py-3">{claim.vehicleMake} {claim.vehicleModel}</td>
                          <td className="py-3 capitalize">{claim.incidentType}</td>
                          <td className="py-3">{formatDate(claim.incidentDate)}</td>
                          <td className="py-3">${parseInt(claim.claimAmount).toLocaleString()}</td>
                          <td className="py-3">
                            <Badge variant="secondary" className={predictionLabel.color}>{predictionLabel.text}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Claim Amount Distribution</CardTitle>
                <CardDescription>Analysis of claim values</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-64">
                  {/* In a real app, we would have more sophisticated charts here */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">$0 - $2,000</span>
                        <span className="text-sm">{claimHistory.filter(c => parseInt(c.claimAmount) <= 2000).length}</span>
                      </div>
                      <Progress value={(claimHistory.filter(c => parseInt(c.claimAmount) <= 2000).length / claimHistory.length) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">$2,001 - $5,000</span>
                        <span className="text-sm">{claimHistory.filter(c => parseInt(c.claimAmount) > 2000 && parseInt(c.claimAmount) <= 5000).length}</span>
                      </div>
                      <Progress value={(claimHistory.filter(c => parseInt(c.claimAmount) > 2000 && parseInt(c.claimAmount) <= 5000).length / claimHistory.length) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">$5,001 - $10,000</span>
                        <span className="text-sm">{claimHistory.filter(c => parseInt(c.claimAmount) > 5000 && parseInt(c.claimAmount) <= 10000).length}</span>
                      </div>
                      <Progress value={(claimHistory.filter(c => parseInt(c.claimAmount) > 5000 && parseInt(c.claimAmount) <= 10000).length / claimHistory.length) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">$10,001+</span>
                        <span className="text-sm">{claimHistory.filter(c => parseInt(c.claimAmount) > 10000).length}</span>
                      </div>
                      <Progress value={(claimHistory.filter(c => parseInt(c.claimAmount) > 10000).length / claimHistory.length) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
                <CardDescription>Breakdown by risk level</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-md border border-green-100">
                    <div>
                      <div className="text-sm text-muted-foreground">Low Risk</div>
                      <div className="text-2xl font-bold">
                        {claimHistory.filter(c => c.predictionScore >= 70).length}
                      </div>
                    </div>
                    <div className="text-4xl text-green-500">
                      {Math.round((claimHistory.filter(c => c.predictionScore >= 70).length / claimHistory.length) * 100)}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-md border border-yellow-100">
                    <div>
                      <div className="text-sm text-muted-foreground">Medium Risk</div>
                      <div className="text-2xl font-bold">
                        {claimHistory.filter(c => c.predictionScore >= 40 && c.predictionScore < 70).length}
                      </div>
                    </div>
                    <div className="text-4xl text-yellow-500">
                      {Math.round((claimHistory.filter(c => c.predictionScore >= 40 && c.predictionScore < 70).length / claimHistory.length) * 100)}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-md border border-red-100">
                    <div>
                      <div className="text-sm text-muted-foreground">High Risk</div>
                      <div className="text-2xl font-bold">
                        {claimHistory.filter(c => c.predictionScore < 40).length}
                      </div>
                    </div>
                    <div className="text-4xl text-red-500">
                      {Math.round((claimHistory.filter(c => c.predictionScore < 40).length / claimHistory.length) * 100)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardView;
