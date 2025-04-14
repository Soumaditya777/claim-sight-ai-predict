
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { FileText, BarChart, ShieldCheck, TrendingUp, Clock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-br from-insurance-blue to-insurance-navy text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">ClaimSight AI Prediction</h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Advanced AI-powered assessment for faster, more accurate insurance claim predictions
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-insurance-navy hover:bg-gray-100">
                  <Link to="/submit-claim">Submit a Claim</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <TrendingUp className="h-6 w-6 text-insurance-blue" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Accurate Predictions</h3>
                  <p className="text-muted-foreground">
                    Our AI model has a 92% accuracy rate in predicting claim outcomes
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <Clock className="h-6 w-6 text-insurance-blue" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Faster Processing</h3>
                  <p className="text-muted-foreground">
                    Reduce claim processing time by up to 70% with our automated system
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <ShieldCheck className="h-6 w-6 text-insurance-blue" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Fraud Detection</h3>
                  <p className="text-muted-foreground">
                    Advanced algorithms identify potential fraud indicators with high precision
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <BarChart className="h-6 w-6 text-insurance-blue" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Data Insights</h3>
                  <p className="text-muted-foreground">
                    Comprehensive analytics dashboard to track and monitor claim patterns
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-insurance-navy">How It Works</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Our AI-powered system analyzes your claim data and provides instant assessment 
              and prediction of approval likelihood based on multiple risk factors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center">
              <div className="bg-insurance-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-medium mb-2">Submit Your Claim</h3>
              <p className="text-muted-foreground">
                Fill out our detailed form with information about your incident and vehicle
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-insurance-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-medium mb-2">AI Assessment</h3>
              <p className="text-muted-foreground">
                Our system analyzes your data using advanced machine learning algorithms
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-insurance-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-medium mb-2">Get Results</h3>
              <p className="text-muted-foreground">
                Receive instant prediction results with detailed risk assessment
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="bg-insurance-blue hover:bg-insurance-navy">
              <Link to="/submit-claim" className="inline-flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Start Your Claim Assessment
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ClaimSight AI Prediction. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
