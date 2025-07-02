
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ArrowRight, Plus, Minus, Calculator, IndianRupee } from 'lucide-react';
import { allComponents, pricingMultipliers, PricingCategoryKey, TierKey } from '@/data/pricingData';

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
  basePrice: number;
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
  priceType: string;
  tierType: string;
}

interface ComponentSelectionProps {
  proposalData: ProposalData;
  onBack: () => void;
  onNext: (selectedComponents: SelectedComponent[]) => void;
}

const ComponentSelection = ({ proposalData, onBack, onNext }: ComponentSelectionProps) => {
  // State for software subscription and installation pricing
  const [softwareSubscriptionPrice, setSoftwareSubscriptionPrice] = useState<number>(0);
  const [installationPackagingPrice, setInstallationPackagingPrice] = useState<number>(0);

  // Get pricing multiplier from proposal data
  const getPriceMultiplier = () => {
    const categoryKey = proposalData.priceType as PricingCategoryKey;
    const tierKey = proposalData.tierType as TierKey;
    return pricingMultipliers[categoryKey]?.[tierKey] || 1.0;
  };

  // Convert all components from pricing data to ComponentItem format
  const getAvailableComponents = (): ComponentItem[] => {
    const multiplier = getPriceMultiplier();
    
    return allComponents.map(component => ({
      id: component.id,
      name: component.name,
      category: component.category,
      description: component.description,
      unitPrice: Math.round(component.basePrice * multiplier),
      minQuantity: 0,
      maxQuantity: 100,
      isRequired: false
    }));
  };

  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>(() => {
    return getAvailableComponents().map(component => ({
      ...component,
      basePrice: component.unitPrice,
      quantity: 0,
      selected: false
    }));
  });

  // Update prices when proposal data changes
  useEffect(() => {
    const multiplier = getPriceMultiplier();
    const updatedComponents = getAvailableComponents();
    
    setSelectedComponents(prev => prev.map(component => {
      const updatedComponent = updatedComponents.find(c => c.id === component.id);
      if (updatedComponent) {
        return {
          ...component,
          unitPrice: updatedComponent.unitPrice,
          basePrice: updatedComponent.unitPrice
        };
      }
      return component;
    }));
  }, [proposalData.priceType, proposalData.tierType]);

  const handleComponentToggle = (componentId: string, checked: boolean) => {
    setSelectedComponents(prev => prev.map(component => {
      if (component.id === componentId) {
        return {
          ...component,
          selected: checked,
          quantity: checked ? Math.max(component.quantity, 1) : 0
        };
      }
      return component;
    }));
  };

  const handleQuantityChange = (componentId: string, newQuantity: number) => {
    setSelectedComponents(prev => prev.map(component => {
      if (component.id === componentId) {
        const clampedQuantity = Math.max(0, Math.min(component.maxQuantity, newQuantity));
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

  // Get price category display name
  const getPriceCategoryLabel = () => {
    const labels = {
      competitiveRetail: 'Competitive Retail Price',
      exclusivePricing: 'Exclusive Pricing',
      resellerNoRegret: 'Reseller No Regret Price'
    };
    return labels[proposalData.priceType as keyof typeof labels] || proposalData.priceType;
  };

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
            <Badge variant="secondary" className="mt-2">
              {getPriceCategoryLabel()} - {proposalData.tierType.toUpperCase()}
            </Badge>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {selectedCount} Components Selected
            </Badge>
          </div>
        </div>

        {/* Component Categories */}
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
                              onCheckedChange={(checked) => handleComponentToggle(component.id, checked as boolean)}
                            />
                            <div>
                              <Label htmlFor={component.id} className="font-semibold text-gray-900">
                                {component.name}
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
                                  disabled={component.quantity <= 0}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={component.quantity}
                                  onChange={(e) => handleQuantityChange(component.id, parseInt(e.target.value) || 0)}
                                  className="w-20 text-center"
                                  min={0}
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

        {/* Consolidated Pricing Table */}
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
