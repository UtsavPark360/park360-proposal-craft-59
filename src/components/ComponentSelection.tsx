
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ArrowRight, Plus, Minus, Calculator, IndianRupee } from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  unitPrice: number;
  minQuantity: number;
  maxQuantity: number;
  isRequired: boolean;
}

interface SelectedComponent extends ComponentItem {
  quantity: number;
  selected: boolean;
}

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

interface ComponentSelectionProps {
  proposalData: ProposalData;
  onBack: () => void;
  onNext: (selectedComponents: SelectedComponent[]) => void;
}

const ComponentSelection = ({ proposalData, onBack, onNext }: ComponentSelectionProps) => {
  // State for dropdown selections
  const [priceType, setPriceType] = useState<string>('');
  const [tierType, setTierType] = useState<string>('');
  
  // State for software subscription and installation pricing
  const [softwareSubscriptionPrice, setSoftwareSubscriptionPrice] = useState<number>(0);
  const [installationPackagingPrice, setInstallationPackagingPrice] = useState<number>(0);

  // Component catalog based on selected solutions
  const getAvailableComponents = (): ComponentItem[] => {
    const components: ComponentItem[] = [];

    // Authorization components
    if (proposalData.solutions.authorization.includes('UHF-based Authorization')) {
      components.push(
        { id: 'uhf-reader', name: 'UHF RFID Reader', category: 'Authorization', description: 'Long-range UHF RFID reader for vehicle detection', unitPrice: 1200, minQuantity: 1, maxQuantity: 10, isRequired: true },
        { id: 'uhf-tags', name: 'UHF RFID Tags', category: 'Authorization', description: 'Vehicle windshield UHF tags', unitPrice: 5, minQuantity: 100, maxQuantity: 5000, isRequired: true },
        { id: 'uhf-antenna', name: 'UHF Antenna', category: 'Authorization', description: 'External UHF antenna for enhanced range', unitPrice: 300, minQuantity: 1, maxQuantity: 4, isRequired: false }
      );
    }

    if (proposalData.solutions.authorization.includes('RFID-based Authorization')) {
      components.push(
        { id: 'rfid-reader', name: 'RFID Card Reader', category: 'Authorization', description: 'Proximity RFID card reader', unitPrice: 800, minQuantity: 1, maxQuantity: 8, isRequired: true },
        { id: 'rfid-cards', name: 'RFID Access Cards', category: 'Authorization', description: 'Proximity access cards for users', unitPrice: 2, minQuantity: 100, maxQuantity: 10000, isRequired: true }
      );
    }

    if (proposalData.solutions.authorization.includes('ANPR (Automatic Number Plate Recognition)')) {
      components.push(
        { id: 'anpr-camera', name: 'ANPR Camera', category: 'Authorization', description: 'High-resolution camera for license plate recognition', unitPrice: 2500, minQuantity: 1, maxQuantity: 6, isRequired: true },
        { id: 'anpr-software', name: 'ANPR Software License', category: 'Authorization', description: 'AI-powered license plate recognition software', unitPrice: 1500, minQuantity: 1, maxQuantity: 1, isRequired: true }
      );
    }

    // Pay & Park components
    if (proposalData.solutions.payPark.includes('TVM-based (Ticket Vending Machine)')) {
      components.push(
        { id: 'tvm-machine', name: 'Ticket Vending Machine', category: 'Payment', description: 'Self-service ticket vending machine with payment options', unitPrice: 8000, minQuantity: 1, maxQuantity: 5, isRequired: true },
        { id: 'tvm-printer', name: 'Thermal Printer', category: 'Payment', description: 'Replacement thermal printer for TVM', unitPrice: 400, minQuantity: 1, maxQuantity: 3, isRequired: false }
      );
    }

    if (proposalData.solutions.payPark.includes('POS-based (Point of Sale)')) {
      components.push(
        { id: 'pos-terminal', name: 'POS Terminal', category: 'Payment', description: 'Handheld POS terminal for payments', unitPrice: 1200, minQuantity: 1, maxQuantity: 10, isRequired: true },
        { id: 'pos-printer', name: 'Receipt Printer', category: 'Payment', description: 'Portable receipt printer', unitPrice: 300, minQuantity: 1, maxQuantity: 5, isRequired: false }
      );
    }

    if (proposalData.solutions.payPark.includes('FASTag-based Integration')) {
      components.push(
        { id: 'fastag-reader', name: 'FASTag Reader', category: 'Payment', description: 'FASTag RFID reader for automatic payments', unitPrice: 1800, minQuantity: 1, maxQuantity: 4, isRequired: true }
      );
    }

    // Valet components
    if (proposalData.solutions.valet) {
      components.push(
        { id: 'valet-app', name: 'Valet Mobile App License', category: 'Valet', description: 'Mobile application for valet management', unitPrice: 2000, minQuantity: 1, maxQuantity: 1, isRequired: true },
        { id: 'valet-tablet', name: 'Valet Tablet', category: 'Valet', description: 'Rugged tablet for valet attendants', unitPrice: 600, minQuantity: 2, maxQuantity: 20, isRequired: true },
        { id: 'key-management', name: 'Smart Key Management System', category: 'Valet', description: 'Automated key storage and retrieval system', unitPrice: 5000, minQuantity: 1, maxQuantity: 3, isRequired: false }
      );
    }

    // Common infrastructure components
    components.push(
      { id: 'barrier-gate', name: 'Automatic Barrier Gate', category: 'Infrastructure', description: 'Motorized barrier gate for entry/exit control', unitPrice: 3500, minQuantity: 1, maxQuantity: 8, isRequired: true },
      { id: 'loop-detector', name: 'Vehicle Loop Detector', category: 'Infrastructure', description: 'Inductive loop sensor for vehicle detection', unitPrice: 200, minQuantity: 2, maxQuantity: 16, isRequired: true },
      { id: 'led-display', name: 'LED Display Board', category: 'Infrastructure', description: 'LED display for parking guidance', unitPrice: 1500, minQuantity: 1, maxQuantity: 10, isRequired: false },
      { id: 'central-server', name: 'Central Management Server', category: 'Infrastructure', description: 'Server for centralized parking management', unitPrice: 12000, minQuantity: 1, maxQuantity: 1, isRequired: true },
      { id: 'ups-system', name: 'UPS Backup System', category: 'Infrastructure', description: 'Uninterrupted power supply for critical components', unitPrice: 2500, minQuantity: 1, maxQuantity: 3, isRequired: false }
    );

    return components;
  };

  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>(() => {
    return getAvailableComponents().map(component => ({
      ...component,
      quantity: component.isRequired ? component.minQuantity : 0,
      selected: component.isRequired
    }));
  });

  const handleComponentToggle = (componentId: string, checked: boolean) => {
    setSelectedComponents(prev => prev.map(component => {
      if (component.id === componentId) {
        return {
          ...component,
          selected: checked,
          quantity: checked ? Math.max(component.quantity, component.minQuantity) : 0
        };
      }
      return component;
    }));
  };

  const handleQuantityChange = (componentId: string, newQuantity: number) => {
    setSelectedComponents(prev => prev.map(component => {
      if (component.id === componentId) {
        const clampedQuantity = Math.max(
          component.minQuantity,
          Math.min(component.maxQuantity, newQuantity)
        );
        return {
          ...component,
          quantity: clampedQuantity,
          selected: clampedQuantity > 0
        };
      }
      return component;
    }));
  };

  const adjustQuantity = (componentId: string, delta: number) => {
    const component = selectedComponents.find(c => c.id === componentId);
    if (component) {
      handleQuantityChange(componentId, component.quantity + delta);
    }
  };

  const adjustPrice = (type: 'software' | 'installation', delta: number) => {
    if (type === 'software') {
      setSoftwareSubscriptionPrice(prev => Math.max(0, prev + delta));
    } else {
      setInstallationPackagingPrice(prev => Math.max(0, prev + delta));
    }
  };

  const handlePriceChange = (type: 'software' | 'installation', value: string) => {
    const numValue = parseInt(value) || 0;
    if (type === 'software') {
      setSoftwareSubscriptionPrice(Math.max(0, numValue));
    } else {
      setInstallationPackagingPrice(Math.max(0, numValue));
    }
  };

  const calculateTotalCost = () => {
    const componentsCost = selectedComponents
      .filter(component => component.selected)
      .reduce((total, component) => total + (component.unitPrice * component.quantity), 0);
    return componentsCost + softwareSubscriptionPrice + installationPackagingPrice;
  };

  const getSelectedComponentsForNext = () => {
    return selectedComponents.filter(component => component.selected && component.quantity > 0);
  };

  const groupedComponents = selectedComponents.reduce((groups, component) => {
    if (!groups[component.category]) {
      groups[component.category] = [];
    }
    groups[component.category].push(component);
    return groups;
  }, {} as Record<string, SelectedComponent[]>);

  const totalCostWithoutGST = calculateTotalCost();
  const gstAmount = totalCostWithoutGST * 0.18;
  const totalCostWithGST = totalCostWithoutGST + gstAmount;
  const selectedCount = selectedComponents.filter(c => c.selected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Solutions
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Component Selection</h1>
            <p className="text-gray-600">Select and configure components for {proposalData.clientName}</p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {selectedCount} Components Selected
            </Badge>
          </div>
        </div>

        {/* Component Categories - Now at the top */}
        <div className="space-y-6 mb-6">
          {Object.entries(groupedComponents).map(([category, components]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">{category} Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {components.map((component) => (
                    <Card key={component.id} className={`border-2 ${component.selected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={component.id}
                              checked={component.selected}
                              disabled={component.isRequired}
                              onCheckedChange={(checked) => handleComponentToggle(component.id, checked as boolean)}
                            />
                            <div>
                              <Label htmlFor={component.id} className="font-semibold text-gray-900">
                                {component.name}
                                {component.isRequired && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-green-600 flex items-center gap-1">
                              <IndianRupee className="h-4 w-4" />
                              {component.unitPrice.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">per unit</div>
                          </div>
                        </div>

                        {component.selected && (
                          <div className="border-t pt-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">Quantity:</Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => adjustQuantity(component.id, -1)}
                                  disabled={component.quantity <= component.minQuantity}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={component.quantity}
                                  onChange={(e) => handleQuantityChange(component.id, parseInt(e.target.value) || 0)}
                                  className="w-20 text-center"
                                  min={component.minQuantity}
                                  max={component.maxQuantity}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => adjustQuantity(component.id, 1)}
                                  disabled={component.quantity >= component.maxQuantity}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t">
                              <span className="text-sm text-gray-600">Subtotal:</span>
                              <span className="font-bold text-green-600 flex items-center gap-1">
                                <IndianRupee className="h-4 w-4" />
                                {(component.unitPrice * component.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dropdown Menus - Now after component selection */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="priceType">Price Type</Label>
                <Select value={priceType} onValueChange={setPriceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="competitive-retail">Competitive Retail</SelectItem>
                    <SelectItem value="exclusive-partner">Exclusive Partner</SelectItem>
                    <SelectItem value="reseller-price">Reseller Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="tierType">Tier Type</Label>
                <Select value={tierType} onValueChange={setTierType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tier-1">Tier 1</SelectItem>
                    <SelectItem value="tier-2">Tier 2</SelectItem>
                    <SelectItem value="tier-3">Tier 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Software Subscription Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-purple-600">Software Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">Price:</Label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustPrice('software', -500)}
                  disabled={softwareSubscriptionPrice <= 0}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <div className="flex items-center">
                  <IndianRupee className="h-4 w-4 text-gray-600" />
                  <Input
                    type="number"
                    value={softwareSubscriptionPrice}
                    onChange={(e) => handlePriceChange('software', e.target.value)}
                    className="w-32 text-center"
                    min={0}
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustPrice('software', 500)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation and Packaging Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-orange-600">Installation and Packaging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">Price:</Label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustPrice('installation', -500)}
                  disabled={installationPackagingPrice <= 0}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <div className="flex items-center">
                  <IndianRupee className="h-4 w-4 text-gray-600" />
                  <Input
                    type="number"
                    value={installationPackagingPrice}
                    onChange={(e) => handlePriceChange('installation', e.target.value)}
                    className="w-32 text-center"
                    min={0}
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustPrice('installation', 500)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consolidated Pricing Table - Now after component selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600 flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Complete Pricing Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No.</TableHead>
                  <TableHead>Component Name</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Single Component Price</TableHead>
                  <TableHead className="text-right">Cumulative Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedComponents
                  .filter(component => component.selected)
                  .map((component, index) => (
                    <TableRow key={component.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{component.name}</TableCell>
                      <TableCell className="text-right">{component.quantity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <IndianRupee className="h-4 w-4" />
                          {component.unitPrice.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        <div className="flex items-center justify-end gap-1">
                          <IndianRupee className="h-4 w-4" />
                          {(component.unitPrice * component.quantity).toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                
                <TableRow>
                  <TableCell>{selectedComponents.filter(c => c.selected).length + 1}</TableCell>
                  <TableCell className="font-medium">Software Subscription</TableCell>
                  <TableCell className="text-right">1</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {softwareSubscriptionPrice.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <div className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {softwareSubscriptionPrice.toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>{selectedComponents.filter(c => c.selected).length + 2}</TableCell>
                  <TableCell className="font-medium">Installation and Packaging</TableCell>
                  <TableCell className="text-right">1</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {installationPackagingPrice.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <div className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {installationPackagingPrice.toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>

                {/* Client Responsibilities Row */}
                <TableRow className="border-t-2">
                  <TableCell colSpan={5} className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <ul className="text-sm space-y-1">
                          <li>• High Speed Reliable Internet - WiFi & LAN Based</li>
                          <li>• Civil Work</li>
                          <li>• Networking</li>
                          <li>• Cabling</li>
                        </ul>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="text-red-600 font-bold text-lg">To be provided by client</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Total Without GST */}
                <TableRow className="border-t-2 bg-gray-50">
                  <TableCell colSpan={4} className="font-bold text-lg">Total One Time Cost (Without GST)</TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    <div className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-5 w-5" />
                      {totalCostWithoutGST.toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>

                {/* GST Amount */}
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={4} className="font-semibold">GST (18%)</TableCell>
                  <TableCell className="text-right font-semibold">
                    <div className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {gstAmount.toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>

                {/* Total With GST */}
                <TableRow className="border-t-2 bg-green-50">
                  <TableCell colSpan={4} className="font-bold text-xl text-green-700">Total One Time Cost (with 18% GST)</TableCell>
                  <TableCell className="text-right font-bold text-xl text-green-700">
                    <div className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-6 w-6" />
                      {totalCostWithGST.toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => onNext(getSelectedComponentsForNext())}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 flex items-center gap-2"
            disabled={selectedCount === 0}
          >
            Generate Proposal with Selected Components
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComponentSelection;
