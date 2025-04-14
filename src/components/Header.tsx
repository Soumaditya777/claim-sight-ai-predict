
import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, BarChart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-insurance-blue text-white p-2 rounded-md">
              <FileCheck size={24} />
            </div>
            <span className="text-2xl font-bold text-insurance-navy">ClaimSight</span>
          </Link>
        </div>
        <nav className="flex gap-2">
          <Button asChild variant="ghost">
            <Link to="/" className="flex items-center gap-2">
              <Home size={18} />
              <span>Home</span>
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/submit-claim" className="flex items-center gap-2">
              <FileCheck size={18} />
              <span>Submit Claim</span>
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/dashboard" className="flex items-center gap-2">
              <BarChart size={18} />
              <span>Dashboard</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
