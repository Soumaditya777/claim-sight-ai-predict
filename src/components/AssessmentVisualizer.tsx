
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, X } from 'lucide-react';

type AssessmentStep = {
  name: string;
  description: string;
  durationMs: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
};

const AssessmentVisualizer = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [steps, setSteps] = useState<AssessmentStep[]>([
    {
      name: 'Data Validation',
      description: 'Verifying the submitted information',
      durationMs: 2500,
      status: 'pending',
    },
    {
      name: 'Risk Assessment',
      description: 'Calculating risk factors based on claim data',
      durationMs: 3000,
      status: 'pending',
    },
    {
      name: 'Fraud Detection',
      description: 'Running AI analysis for potential fraud indicators',
      durationMs: 3500,
      status: 'pending',
    },
    {
      name: 'Coverage Verification',
      description: 'Checking policy terms and coverage limits',
      durationMs: 2000,
      status: 'pending',
    },
    {
      name: 'Final Assessment',
      description: 'Generating approval prediction and recommendations',
      durationMs: 2500,
      status: 'pending',
    },
  ]);

  useEffect(() => {
    // Check if claim data exists
    const claimData = localStorage.getItem('currentClaim');
    if (!claimData) {
      navigate('/submit-claim');
      return;
    }
    
    // Start assessment process
    processSteps();
  }, [navigate]);

  const processSteps = async () => {
    let cumulativeTime = 0;
    const totalSteps = steps.length;
    
    // Process each step sequentially
    for (let i = 0; i < totalSteps; i++) {
      setCurrentStepIndex(i);
      
      // Update the current step to "processing"
      setSteps(prev => {
        const updated = [...prev];
        updated[i] = { ...updated[i], status: 'processing' };
        return updated;
      });
      
      // Wait for the step's processing time
      await new Promise(resolve => setTimeout(resolve, steps[i].durationMs));
      
      // Generate a random status (mostly complete, sometimes error)
      const stepStatus = Math.random() > 0.9 ? 'error' : 'complete';
      
      // Mark the step as complete
      setSteps(prev => {
        const updated = [...prev];
        updated[i] = { ...updated[i], status: stepStatus };
        return updated;
      });
      
      // Update progress bar
      cumulativeTime += steps[i].durationMs;
      const progressPercentage = ((i + 1) / totalSteps) * 100;
      setProgress(progressPercentage);
    }
    
    // Navigate to results page after a short delay
    setTimeout(() => {
      // Generate a random prediction score
      const claimData = localStorage.getItem('currentClaim');
      if (claimData) {
        const parsedData = JSON.parse(claimData);
        
        // Calculate approval likelihood based on claim details
        // This is a simplified model - in a real application, this would be more sophisticated
        let baseScore = 75; // Start with a reasonable baseline
        
        // Adjust based on claim amount (higher amounts get lower scores)
        const claimAmount = parseInt(parsedData.claimAmount);
        if (claimAmount > 10000) baseScore -= 15;
        else if (claimAmount > 5000) baseScore -= 8;
        else if (claimAmount <= 1000) baseScore += 10;
        
        // Adjust based on driver age (younger drivers are higher risk)
        const driverAge = parseInt(parsedData.driverAge);
        if (driverAge < 25) baseScore -= 12;
        else if (driverAge > 60) baseScore += 5;
        
        // Adjust based on previous claims (more claims = higher risk)
        const previousClaims = parseInt(parsedData.previousClaims);
        baseScore -= (previousClaims * 8);
        
        // Add some randomness
        const finalScore = Math.max(0, Math.min(100, baseScore + (Math.random() * 20 - 10)));
        
        // Store the prediction score
        localStorage.setItem('predictionScore', finalScore.toString());
        
        navigate('/results');
      } else {
        navigate('/submit-claim');
      }
    }, 1000);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <Check size={18} className="text-green-500" />;
      case 'error':
        return <X size={18} className="text-red-500" />;
      case 'processing':
        return (
          <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse"></div>
        );
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300"></div>;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-insurance-navy">Claim Assessment in Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progress} className="h-2" />
        
        <div className="mt-8 space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getStepIcon(step.status)}
                  </div>
                  <div>
                    <h3 className={`font-medium ${index === currentStepIndex && step.status === 'processing' ? 'text-insurance-blue' : ''}`}>
                      {step.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div>
                  {step.status === 'error' && (
                    <div className="flex items-center text-sm text-red-500 gap-1">
                      <AlertCircle size={14} />
                      <span>Reviewing</span>
                    </div>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="ml-2 pl-5 border-l border-dashed border-gray-200 h-6"></div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentVisualizer;
