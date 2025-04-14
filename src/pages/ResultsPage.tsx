
import React from 'react';
import Header from '@/components/Header';
import ResultsDisplay from '@/components/ResultsDisplay';

const ResultsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="page-container">
          <h1 className="text-3xl font-bold mb-6 text-insurance-navy">Assessment Results</h1>
          <p className="text-lg mb-8 text-muted-foreground">
            Below is the detailed assessment of your claim with prediction results and recommendations.
          </p>
          
          <ResultsDisplay />
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

export default ResultsPage;
