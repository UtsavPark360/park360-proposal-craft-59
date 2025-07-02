
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import ProposalPreview from '@/components/ProposalPreview';
import ComponentSelection from '@/components/ComponentSelection';
import { Building2, Car, CreditCard, UserCheck, Shield, Smartphone } from 'lucide-react';

interface ProposalData {
  clientName: string;
  companyName: string;
  clientNumber: string;
  clientLocation: string;
  clientType: string;
  clientSize: string;
  painPoints: string[];
  solutions: {
    authorization: string[];
    payPark: string[];
    valet: boolean;
  };
  customRequirements: string;
}

interface SelectedComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  selected: boolean;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'components' | 'preview'>('form');
  const [proposalData, setProposalData] = useState<ProposalData>({
    clientName: '',
    companyName: '',
    clientNumber: '',
    clientLocation: '',
    clientType: '',
    clientSize: '',
    painPoints: [],
    solutions: {
      authorization: [],
      payPark: [],
      valet: false
    },
    customRequirements: ''
  });
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>([]);

  const clientTypes = [
    'Shopping Mall',
    'Office Complex',
    'Hospital',
    'Airport',
    'Hotel',
    'Residential Complex',
    'University',
    'Government Building',
    'Other'
  ];

  const clientSizes = [
    'Small (< 100 spaces)',
    'Medium (100-500 spaces)',
    'Large (500-1000 spaces)',
    'Enterprise (1000+ spaces)'
  ];

  const painPointOptions = [
    'Manual entry/exit causing traffic congestion',
    'Revenue leakage from manual fee collection',
    'Lack of real-time parking availability',
    'Poor customer experience with long wait times',
    'High operational costs with manual attendants',
    'Security concerns with unauthorized access',
    'Difficulty in managing premium valet services',
    'No centralized monitoring and reporting'
  ];

  const authorizationSolutions = [
    'UHF-based Authorization',
    'RFID-based Authorization',
    'ANPR (Automatic Number Plate Recognition)'
  ];

  const payParkSolutions = [
    'TVM-based (Ticket Vending Machine)',
    'POS-based (Point of Sale)',
    'FASTag-based Integration'
  ];

  const handlePainPointChange = (painPoint: string, checked: boolean) => {
    setProposalData(prev => ({
      ...prev,
      painPoints: checked 
        ? [...prev.painPoints, painPoint]
        : prev.painPoints.filter(p => p !== painPoint)
    }));
  };

  const handleSolutionChange = (category: 'authorization' | 'payPark', solution: string, checked: boolean) => {
    setProposalData(prev => ({
      ...prev,
      solutions: {
        ...prev.solutions,
        [category]: checked
          ? [...prev.solutions[category], solution]
          : prev.solutions[category].filter(s => s !== solution)
      }
    }));
  };

  const proceedToComponents = () => {
    setCurrentStep('components');
  };

  const handleComponentsSelected = (components: SelectedComponent[]) => {
    setSelectedComponents(components);
    setCurrentStep('preview');
  };

  const goBackToForm = () => {
    setCurrentStep('form');
  };

  const goBackToComponents = () => {
    setCurrentStep('components');
  };

  if (currentStep === 'components') {
    return (
      <ComponentSelection
        proposalData={proposalData}
        onBack={goBackToForm}
        onNext={handleComponentsSelected}
      />
    );
  }

  if (currentStep === 'preview') {
    return (
      <ProposalPreview
        proposalData={proposalData}
        selectedComponents={selectedComponents}
        onBack={goBackToComponents}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Park360</h1>
          </div>
          <p className="text-xl text-gray-600">Smart Parking Solutions Proposal Generator</p>
        </div>

        {/* Main Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              Client Information
            </CardTitle>
            <CardDescription>
              Tell us about your client to generate a customized proposal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  placeholder="e.g., John Smith"
                  value={proposalData.clientName}
                  onChange={(e) => setProposalData(prev => ({ ...prev, clientName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g., MetroMall Shopping Center"
                  value={proposalData.companyName}
                  onChange={(e) => setProposalData(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientNumber">Client Number</Label>
                <Input
                  id="clientNumber"
                  placeholder="e.g., +1 (555) 123-4567"
                  value={proposalData.clientNumber}
                  onChange={(e) => setProposalData(prev => ({ ...prev, clientNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientLocation">Location</Label>
                <Input
                  id="clientLocation"
                  placeholder="e.g., New York, NY"
                  value={proposalData.clientLocation}
                  onChange={(e) => setProposalData(prev => ({ ...prev, clientLocation: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientType">Client Type</Label>
                <Select value={proposalData.clientType} onValueChange={(value) => setProposalData(prev => ({ ...prev, clientType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client type" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSize">Facility Size</Label>
              <Select value={proposalData.clientSize} onValueChange={(value) => setProposalData(prev => ({ ...prev, clientSize: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility size" />
                </SelectTrigger>
                <SelectContent>
                  {clientSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pain Points */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Current Pain Points
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {painPointOptions.map(painPoint => (
                  <div key={painPoint} className="flex items-center space-x-2">
                    <Checkbox
                      id={painPoint}
                      checked={proposalData.painPoints.includes(painPoint)}
                      onCheckedChange={(checked) => handlePainPointChange(painPoint, checked as boolean)}
                    />
                    <Label htmlFor={painPoint} className="text-sm leading-tight">
                      {painPoint}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-6">
              <Label className="text-lg font-semibold">Recommended Solutions</Label>
              
              {/* Authorization Solutions */}
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    Authorization Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {authorizationSolutions.map(solution => (
                      <div key={solution} className="flex items-center space-x-2">
                        <Checkbox
                          id={solution}
                          checked={proposalData.solutions.authorization.includes(solution)}
                          onCheckedChange={(checked) => handleSolutionChange('authorization', solution, checked as boolean)}
                        />
                        <Label htmlFor={solution} className="font-medium">
                          {solution}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pay & Park Solutions */}
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Pay & Park Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payParkSolutions.map(solution => (
                      <div key={solution} className="flex items-center space-x-2">
                        <Checkbox
                          id={solution}
                          checked={proposalData.solutions.payPark.includes(solution)}
                          onCheckedChange={(checked) => handleSolutionChange('payPark', solution, checked as boolean)}
                        />
                        <Label htmlFor={solution} className="font-medium">
                          {solution}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Valet Management */}
              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    Valet Management System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="valet"
                      checked={proposalData.solutions.valet}
                      onCheckedChange={(checked) => setProposalData(prev => ({
                        ...prev,
                        solutions: { ...prev.solutions, valet: checked as boolean }
                      }))}
                    />
                    <Label htmlFor="valet" className="font-medium">
                      Include Premium Valet Management System
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="customRequirements">Notes (Optional)</Label>
              <Textarea
                id="customRequirements"
                placeholder="Any specific notes about the client..."
                value={proposalData.customRequirements}
                onChange={(e) => setProposalData(prev => ({ ...prev, customRequirements: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={proceedToComponents} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
              disabled={!proposalData.clientName || !proposalData.clientType}
            >
              Proceed to Component Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
