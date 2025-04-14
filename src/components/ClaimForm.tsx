
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

const ClaimForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    policyNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    damageDescription: '',
    incidentType: '',
    claimAmount: '',
    driverAge: '',
    driverExperience: '',
    previousClaims: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select an incident date",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to process claim
    setTimeout(() => {
      setLoading(false);
      
      // Store the form data in localStorage to access on the result page
      const claimData = {
        ...formData,
        incidentDate: date.toISOString(),
        claimId: 'CLM' + Math.floor(100000 + Math.random() * 900000), // Generate a random claim ID
        submissionDate: new Date().toISOString()
      };
      
      localStorage.setItem('currentClaim', JSON.stringify(claimData));
      
      toast({
        title: "Claim submitted successfully",
        description: "Your claim is now being processed.",
      });
      
      // Redirect to assessment page
      navigate('/assessment');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-insurance-navy">Claim Information</CardTitle>
          <CardDescription>
            Please provide accurate information about your claim.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number</Label>
              <Input
                id="policyNumber"
                name="policyNumber"
                placeholder="e.g. POL123456789"
                required
                value={formData.policyNumber}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incidentDate">Incident Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Vehicle Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vehicleMake">Vehicle Make</Label>
              <Input
                id="vehicleMake"
                name="vehicleMake"
                placeholder="e.g. Toyota"
                required
                value={formData.vehicleMake}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Vehicle Model</Label>
              <Input
                id="vehicleModel"
                name="vehicleModel"
                placeholder="e.g. Camry"
                required
                value={formData.vehicleModel}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Vehicle Year</Label>
              <Input
                id="vehicleYear"
                name="vehicleYear"
                placeholder="e.g. 2022"
                required
                type="number"
                min="1900"
                max="2030"
                value={formData.vehicleYear}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Incident Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="incidentType">Type of Incident</Label>
              <Select
                onValueChange={(value) => handleSelectChange('incidentType', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collision">Collision</SelectItem>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="vandalism">Vandalism</SelectItem>
                  <SelectItem value="weather">Weather Damage</SelectItem>
                  <SelectItem value="fire">Fire Damage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Incident Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. 123 Main St, City"
                required
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="damageDescription">Damage Description</Label>
              <Textarea
                id="damageDescription"
                name="damageDescription"
                placeholder="Please describe the damage to your vehicle in detail"
                required
                value={formData.damageDescription}
                onChange={handleChange}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="claimAmount">Estimated Claim Amount ($)</Label>
              <Input
                id="claimAmount"
                name="claimAmount"
                type="number"
                placeholder="e.g. 5000"
                required
                value={formData.claimAmount}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Driver Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="driverAge">Driver Age</Label>
              <Input
                id="driverAge"
                name="driverAge"
                type="number"
                placeholder="e.g. 35"
                required
                min="16"
                max="100"
                value={formData.driverAge}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="driverExperience">Years of Driving Experience</Label>
              <Input
                id="driverExperience"
                name="driverExperience"
                type="number"
                placeholder="e.g. 10"
                required
                min="0"
                max="80"
                value={formData.driverExperience}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="previousClaims">Number of Previous Claims</Label>
              <Input
                id="previousClaims"
                name="previousClaims"
                type="number"
                placeholder="e.g. 1"
                required
                min="0"
                value={formData.previousClaims}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <AlertCircle size={14} />
            <span>All fields are required to process your claim</span>
          </div>
          <Button type="submit" className="bg-insurance-blue hover:bg-insurance-navy" disabled={loading}>
            {loading ? "Processing..." : "Submit Claim"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ClaimForm;
