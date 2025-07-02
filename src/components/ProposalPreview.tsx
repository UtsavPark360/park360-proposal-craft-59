
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Car, Phone, Mail, Globe, CheckCircle, Star, Shield, CreditCard, UserCheck, Smartphone, Download, Calendar, DollarSign, Settings } from 'lucide-react';
import { pricingMultipliers, pricingCategoryLabels, tierLabels, PricingCategoryKey, TierKey } from '@/data/pricingData';

interface ProposalData {
  clientName: string;
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
  unitPrice: number;
  quantity: number;
  selected: boolean;
}

interface ProposalPreviewProps {
  proposalData: ProposalData;
  selectedComponents?: SelectedComponent[];
  onBack: () => void;
}

const ProposalPreview = ({ proposalData, selectedComponents = [], onBack }: ProposalPreviewProps) => {
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [additionalPrice, setAdditionalPrice] = useState('');
  const [selectedPricingCategory, setSelectedPricingCategory] = useState<PricingCategoryKey>('competitiveRetail');
  const [selectedTier, setSelectedTier] = useState<TierKey>('tier1');

  const handlePrint = () => {
    window.print();
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSolutionIcon = (solution: string) => {
    if (solution.includes('UHF') || solution.includes('RFID') || solution.includes('ANPR')) {
      return <UserCheck className="h-5 w-5 text-blue-600" />;
    }
    if (solution.includes('TVM') || solution.includes('POS') || solution.includes('FASTag')) {
      return <CreditCard className="h-5 w-5 text-green-600" />;
    }
    return <Shield className="h-5 w-5 text-gray-600" />;
  };

  const getBenefits = (solution: string) => {
    const benefitsMap: { [key: string]: string[] } = {
      'UHF-based Authorization': ['Long-range detection', 'High-speed processing', 'Weather resistant'],
      'RFID-based Authorization': ['Secure authentication', 'Cost-effective', 'Easy integration'],
      'ANPR (Automatic Number Plate Recognition)': ['No physical tags required', 'Advanced AI recognition', 'Blacklist management'],
      'TVM-based (Ticket Vending Machine)': ['24/7 operation', 'Multiple payment options', 'Reduced staff costs'],
      'POS-based (Point of Sale)': ['Real-time transactions', 'Integrated reporting', 'Mobile payments'],
      'FASTag-based Integration': ['Seamless government compliance', 'Instant payments', 'Digital receipts']
    };
    return benefitsMap[solution] || ['Enhanced efficiency', 'Cost reduction', 'Improved security'];
  };

  const calculateAdjustedPrice = (basePrice: number) => {
    const multiplier = pricingMultipliers[selectedPricingCategory][selectedTier];
    return Math.round(basePrice * multiplier);
  };

  const calculateTotalCost = () => {
    const componentsCost = selectedComponents.reduce((total, component) => {
      const adjustedPrice = calculateAdjustedPrice(component.unitPrice);
      return total + (adjustedPrice * component.quantity);
    }, 0);
    const additionalCost = additionalPrice ? parseFloat(additionalPrice) || 0 : 0;
    return componentsCost + additionalCost;
  };

  const groupComponentsByCategory = () => {
    return selectedComponents.reduce((groups, component) => {
      if (!groups[component.category]) {
        groups[component.category] = [];
      }
      groups[component.category].push(component);
      return groups;
    }, {} as Record<string, SelectedComponent[]>);
  };

  const totalCost = calculateTotalCost();
  const advancePayment = Math.round(totalCost * 0.9 * 1.18); // 90% with 18% GST
  const onInstallationPayment = Math.round(totalCost * 0.1 * 1.18); // 10% with 18% GST
  const groupedComponents = groupComponentsByCategory();

  return (
    <div className="min-h-screen bg-white">
      {/* Print Header - Hidden on screen, visible when printed */}
      <div className="hidden print:block border-b-2 border-blue-600 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-full">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Park360</h1>
              <p className="text-sm text-gray-600">Smart Parking Solutions</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Date: {getCurrentDate()}</p>
            <p>Proposal ID: P360-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 print:p-0">
        {/* Screen Header */}
        <div className="print:hidden mb-6 flex items-center justify-between">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Components
          </Button>
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Print/Save PDF
            </Button>
          </div>
        </div>

        {/* Client Type and Tier Type at Top */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-600 text-lg">Client Type</h3>
            <p className="text-gray-700 text-xl font-medium">{proposalData.clientType}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-600 text-lg">Tier Type</h3>
            <p className="text-gray-700 text-xl font-medium">{proposalData.clientSize}</p>
          </div>
        </div>

        {/* Company Header */}
        <div className="text-center mb-8 print:hidden">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-blue-600">Park360</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Smart Parking Solutions</p>
          <Badge variant="secondary" className="text-sm">
            Proposal Generated on {getCurrentDate()}
          </Badge>
        </div>

        {/* Executive Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">
              Business Proposal for {proposalData.clientName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-600">Client Type</h4>
                <p className="text-gray-700">{proposalData.clientType}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-600">Facility Size</h4>
                <p className="text-gray-700">{proposalData.clientSize}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-600">Components</h4>
                <p className="text-gray-700">{selectedComponents.length} Selected</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-600">Total Cost</h4>
                <p className="text-gray-700 font-bold">${totalCost.toLocaleString()}</p>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Park360 is pleased to present this comprehensive smart parking solution proposal for {proposalData.clientName}. 
              As a leading provider of automated parking technologies, we understand the unique challenges faced by {proposalData.clientType.toLowerCase()} facilities 
              and have designed our solutions to address your specific operational needs while maximizing efficiency and revenue.
            </p>
          </CardContent>
        </Card>

        {/* Additional Requirements Section - Print Hidden */}
        <Card className="mb-6 print:hidden">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">Additional Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additionalRequirements">Description</Label>
                <Textarea
                  id="additionalRequirements"
                  placeholder="Enter additional requirements..."
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalPrice">Price</Label>
                <Input
                  id="additionalPrice"
                  placeholder="Enter price"
                  value={additionalPrice}
                  onChange={(e) => setAdditionalPrice(e.target.value)}
                  type="number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Configuration Section - Print Hidden */}
        <Card className="mb-6 print:hidden">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600 flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Pricing Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricingCategory">Price Category</Label>
                <Select 
                  value={selectedPricingCategory} 
                  onValueChange={(value: PricingCategoryKey) => setSelectedPricingCategory(value)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select pricing category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {Object.entries(pricingCategoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier">Tier</Label>
                <Select 
                  value={selectedTier} 
                  onValueChange={(value: TierKey) => setSelectedTier(value)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {Object.entries(tierLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Selected:</strong> {pricingCategoryLabels[selectedPricingCategory]} - {tierLabels[selectedTier]}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Price Multiplier:</strong> {(pricingMultipliers[selectedPricingCategory][selectedTier] * 100).toFixed(0)}% of base price
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Components & Pricing */}
        {selectedComponents.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600 flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                Selected Components & Pricing
                <Badge variant="outline" className="ml-2">
                  {pricingCategoryLabels[selectedPricingCategory]} - {tierLabels[selectedTier]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(groupedComponents).map(([category, components]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-3">{category}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Base Price</TableHead>
                        <TableHead className="text-right">Adjusted Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {components.map((component) => {
                        const adjustedPrice = calculateAdjustedPrice(component.unitPrice);
                        return (
                          <TableRow key={component.id}>
                            <TableCell className="font-medium">{component.name}</TableCell>
                            <TableCell className="text-sm text-gray-600">{component.description}</TableCell>
                            <TableCell className="text-right">{component.quantity}</TableCell>
                            <TableCell className="text-right text-gray-500">${component.unitPrice.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-semibold">${adjustedPrice.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-semibold">
                              ${(adjustedPrice * component.quantity).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ))}

              {/* Smart Parking Management Client License */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">Software Subscription</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Smart Parking Management Client License for 1 Year{' '}
                        <span className="font-bold text-red-600">(Yearly Recurring)</span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">Admin Dashboard & Reports</TableCell>
                      <TableCell className="text-right">1</TableCell>
                      <TableCell className="text-right">Contact for Pricing</TableCell>
                      <TableCell className="text-right font-semibold">Contact for Pricing</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Additional Requirements in Pricing Table */}
              {additionalRequirements && additionalPrice && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-3">Additional Requirements</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Additional Requirements</TableCell>
                        <TableCell className="text-sm text-gray-600">{additionalRequirements}</TableCell>
                        <TableCell className="text-right">1</TableCell>
                        <TableCell className="text-right">${parseFloat(additionalPrice || '0').toLocaleString()}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ${parseFloat(additionalPrice || '0').toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
              
              <div className="border-t-2 pt-4 mt-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Hardware Cost:</span>
                    <span className="text-green-600">${totalCost.toLocaleString()}</span>
                  </div>
                  
                  {/* Payment Schedule */}
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4">Payment Schedule</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-black text-white">Payment Schedule</TableHead>
                          <TableHead className="bg-cyan-400 text-black text-center">Advance Payment</TableHead>
                          <TableHead className="bg-cyan-400 text-black text-center">On Installation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Amount</TableCell>
                          <TableCell className="text-center">₹{advancePayment.toLocaleString()}</TableCell>
                          <TableCell className="text-center">₹{onInstallationPayment.toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <p className="text-sm text-gray-600 mt-2">
                      *Advance Payment: 90% of total one-time cost (with 18% GST)
                    </p>
                    <p className="text-sm text-gray-600">
                      *On Installation: Remaining 10% of total one-time cost (with 18% GST)
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-4">
                  *Prices exclude installation, training, and maintenance services. 
                  Final pricing may vary based on site requirements and customizations.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About Park360 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              About Park360
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-700 mb-4">
                  Park360 is a pioneering technology company specializing in intelligent parking management systems. 
                  With over a decade of experience, we have successfully deployed solutions across various sectors including 
                  retail, healthcare, hospitality, and transportation.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">500+ Successful Installations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">99.9% System Uptime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">24/7 Technical Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">ISO 27001 Certified</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Our Mission</h4>
                <p className="text-gray-700 text-sm">
                  To revolutionize parking management through innovative technology solutions that enhance operational efficiency, 
                  improve customer experience, and maximize revenue potential for our clients.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Challenges */}
        {proposalData.painPoints.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Shield className="h-6 w-6" />
                Current Parking Management Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Based on our analysis, {proposalData.clientName} is likely experiencing the following operational challenges:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {proposalData.painPoints.map((painPoint, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{painPoint}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Proposed Solutions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">
              Park360 Smart Parking Solutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">
              We propose a comprehensive suite of solutions designed to address your specific challenges and transform your parking operations:
            </p>

            {/* Authorization Solutions */}
            {proposalData.solutions.authorization.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
                  <UserCheck className="h-6 w-6" />
                  Authorization Solutions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {proposalData.solutions.authorization.map((solution, index) => (
                    <Card key={index} className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getSolutionIcon(solution)}
                          {solution.split(' ')[0]} Based
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{solution}</p>
                        <ul className="space-y-1">
                          {getBenefits(solution).map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Pay & Park Solutions */}
            {proposalData.solutions.payPark.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                  <CreditCard className="h-6 w-6" />
                  Pay & Park Solutions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {proposalData.solutions.payPark.map((solution, index) => (
                    <Card key={index} className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getSolutionIcon(solution)}
                          {solution.split('-')[0]}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{solution}</p>
                        <ul className="space-y-1">
                          {getBenefits(solution).map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Valet Management */}
            {proposalData.solutions.valet && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
                  <Smartphone className="h-6 w-6" />
                  Premium Valet Management System
                </h3>
                <Card className="border-purple-200">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Mobile Application Features</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Vehicle request by guest via app</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Real-time notification to valet</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Vehicle photos during handover</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">OTP-based vehicle release</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Admin Panel</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Manage valet attendants</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Real-time tracking & monitoring</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Performance analytics</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Access control & restrictions</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Implementation Benefits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">Expected Benefits & ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">40%</div>
                <p className="text-sm text-gray-700">Reduction in Operational Costs</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">60%</div>
                <p className="text-sm text-gray-700">Increase in Revenue</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">85%</div>
                <p className="text-sm text-gray-700">Improvement in Customer Satisfaction</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 mb-2">12-18</div>
                <p className="text-sm text-gray-700">Months Payback Period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {proposalData.customRequirements && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{proposalData.customRequirements}</p>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Parking Operations?</h2>
              <p className="text-lg mb-6 opacity-90">
                Schedule a personalized demonstration and see how Park360 can revolutionize your parking management.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span>+1 (555) 123-PARK</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5" />
                  <span>info@park360.com</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span>www.park360.com</span>
                </div>
              </div>

              <div className="print:hidden">
                <Button 
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Demo Today
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8 pt-6 border-t">
          <p>© 2024 Park360. All rights reserved. | Confidential Business Proposal</p>
          <p className="mt-2">This proposal is valid for 30 days from the date of generation.</p>
        </div>
      </div>
    </div>
  );
};

export default ProposalPreview;
