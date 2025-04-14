
import React from 'react';
import Header from '@/components/Header';
import AssessmentVisualizer from '@/components/AssessmentVisualizer';

const AssessmentPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="page-container">
          <h1 className="text-3xl font-bold mb-6 text-insurance-navy">Claim Assessment</h1>
          <p className="text-lg mb-8 text-muted-foreground">
            Our AI system is analyzing your claim data. This process typically takes about 15 seconds.
          </p>
          
          <AssessmentVisualizer />
        </div>
      </main>
      
      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ClaimSight AI Prediction. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AssessmentPage;
