
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, ShieldAlert, Shield, Clock, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

interface ClaimData {
  claimId: string;
  policyNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  incidentDate: string;
  incidentType: string;
  damageDescription: string;
  claimAmount: string;
  location: string;
  submissionDate: string;
}

const ResultsDisplay = () => {
  const navigate = useNavigate();
  const [predictionScore, setPredictionScore] = useState<number | null>(null);
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  
  useEffect(() => {
    // Retrieve the prediction score and claim data
    const score = localStorage.getItem('predictionScore');
    const claim = localStorage.getItem('currentClaim');
    
    if (!score || !claim) {
      navigate('/submit-claim');
      return;
    }
    
    setPredictionScore(parseFloat(score));
    setClaimData(JSON.parse(claim));
    
    // Save to claim history
    saveToClaimHistory(JSON.parse(claim), parseFloat(score));
  }, [navigate]);
  
  const saveToClaimHistory = (claim: ClaimData, score: number) => {
    // Get existing history or initialize empty array
    const existingHistory = localStorage.getItem('claimHistory');
    let claimHistory = existingHistory ? JSON.parse(existingHistory) : [];
    
    // Add this claim with prediction score
    claimHistory.push({
      ...claim,
      predictionScore: score,
      assessmentDate: new Date().toISOString()
    });
    
    // Save back to localStorage
    localStorage.setItem('claimHistory', JSON.stringify(claimHistory));
  };
  
  const handleViewDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleNewClaim = () => {
    navigate('/submit-claim');
  };
  
  const handlePrintReport = () => {
    toast({
      title: "Report Preparation",
      description: "Your detailed report is being prepared for printing.",
    });
    
    // In a real app, this would generate a PDF or prepare a printable view
    setTimeout(() => {
      window.print();
    }, 500);
  };
  
  if (!predictionScore || !claimData) return null;
  
  const getApprovalStatus = (score: number) => {
    if (score >= 70) return { status: 'Likely Approved', color: 'text-insurance-low', icon: <CheckCircle className="h-6 w-6" /> };
    if (score >= 40) return { status: 'Manual Review', color: 'text-insurance-medium', icon: <AlertTriangle className="h-6 w-6" /> };
    return { status: 'Likely Denied', color: 'text-insurance-high', icon: <ShieldAlert className="h-6 w-6" /> };
  };
  
  const approvalInfo = getApprovalStatus(predictionScore);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-insurance-navy">Claim Assessment Results</CardTitle>
            <CardDescription>
              Claim ID: {claimData.claimId} • Submitted on {formatDate(claimData.submissionDate)}
            </CardDescription>
          </div>
          <div className="bg-insurance-gray rounded-lg p-4 text-center">
            <div className="text-sm font-medium text-muted-foreground mb-1">Approval Likelihood</div>
            <div className="text-3xl font-bold" style={{
              color: predictionScore >= 70 
                ? '#4ade80' 
                : predictionScore >= 40 
                  ? '#facc15' 
                  : '#f87171'
            }}>
              {Math.round(predictionScore)}%
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          predictionScore >= 70 
            ? 'bg-green-50 border border-green-200' 
            : predictionScore >= 40 
              ? 'bg-yellow-50 border border-yellow-200' 
              : 'bg-red-50 border border-red-200'
        }`}>
          <div className={approvalInfo.color}>
            {approvalInfo.icon}
          </div>
          <div>
            <h3 className="font-medium">
              {approvalInfo.status}
            </h3>
            <p className="text-sm text-muted-foreground">
              {predictionScore >= 70 
                ? 'Your claim is likely to be approved based on our assessment.' 
                : predictionScore >= 40 
                  ? 'Your claim requires additional review by our specialists.' 
                  : 'Your claim may be denied based on our initial assessment.'}
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Claim Details</TabsTrigger>
            <TabsTrigger value="factors">Risk Factors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-insurance-blue" />
                    <CardTitle className="text-sm">Policy</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{claimData.policyNumber}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-insurance-blue" />
                    <CardTitle className="text-sm">Incident Date</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{formatDate(claimData.incidentDate)}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-insurance-blue" />
                    <CardTitle className="text-sm">Claim Amount</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">${parseInt(claimData.claimAmount).toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {predictionScore >= 70 ? (
                    <>
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                        <span>Your claim is being processed. Expect approval within 3-5 business days.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                        <span>An adjuster may contact you for additional verification.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
                        <span>Payment will be issued after final approval.</span>
                      </li>
                    </>
                  ) : predictionScore >= 40 ? (
                    <>
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-500" />
                        <span>Additional documentation is required for review.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-500" />
                        <span>A claims specialist will contact you within 2 business days.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-500" />
                        <span>Please have vehicle repair estimates ready for review.</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500" />
                        <span>Your claim requires comprehensive review due to risk factors.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500" />
                        <span>A senior claims specialist will contact you within 24 hours.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500" />
                        <span>Please prepare all incident documentation for detailed review.</span>
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Vehicle Information</h3>
                      <p className="text-lg">{claimData.vehicleYear} {claimData.vehicleMake} {claimData.vehicleModel}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Incident Type</h3>
                      <p className="text-lg capitalize">{claimData.incidentType}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Incident Location</h3>
                    <p className="text-lg">{claimData.location}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Damage Description</h3>
                    <p className="text-lg">{claimData.damageDescription}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="factors">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* These factors would normally be calculated from actual data - using placeholders here */}
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>Claim Amount</span>
                      <span className={parseInt(claimData.claimAmount) > 5000 ? "text-insurance-high font-medium" : "text-insurance-low font-medium"}>
                        {parseInt(claimData.claimAmount) > 5000 ? "High Risk" : "Low Risk"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>Incident Type</span>
                      <span className={claimData.incidentType === 'theft' || claimData.incidentType === 'fire' ? "text-insurance-high font-medium" : "text-insurance-medium font-medium"}>
                        {claimData.incidentType === 'theft' || claimData.incidentType === 'fire' ? "High Risk" : "Medium Risk"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>Vehicle Age</span>
                      <span className={(parseInt(new Date().getFullYear().toString()) - parseInt(claimData.vehicleYear)) > 10 ? "text-insurance-medium font-medium" : "text-insurance-low font-medium"}>
                        {(parseInt(new Date().getFullYear().toString()) - parseInt(claimData.vehicleYear)) > 10 ? "Medium Risk" : "Low Risk"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>Policy History</span>
                      <span className="text-insurance-low font-medium">Low Risk</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>Documentation</span>
                      <span className="text-insurance-medium font-medium">Medium Risk</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>Fraud Indicators</span>
                      <span className="text-insurance-low font-medium">Low Risk</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-md mt-4">
                    <h3 className="font-medium mb-2">Risk Assessment Notes</h3>
                    <p className="text-sm text-muted-foreground">
                      This risk assessment is based on AI analysis of the claim details, policy history, 
                      and industry data. Factors like claim amount, incident type, and vehicle details 
                      are weighted according to our predictive model. The final approval decision will be 
                      made by our claims department.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrintReport}>
          Generate Report
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleNewClaim}>
            New Claim
          </Button>
          <Button className="bg-insurance-blue hover:bg-insurance-navy" onClick={handleViewDashboard}>
            View Dashboard
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResultsDisplay;
