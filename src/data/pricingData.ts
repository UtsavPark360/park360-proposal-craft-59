
export interface PricingTier {
  tier1: number;
  tier2: number;
  tier3: number;
}

export interface PricingCategory {
  competitiveRetail: PricingTier;
  exclusivePricing: PricingTier;
  resellerNoRegret: PricingTier;
}

export const pricingMultipliers: PricingCategory = {
  competitiveRetail: {
    tier1: 1.0,    // Base price
    tier2: 0.95,   // 5% discount
    tier3: 0.90    // 10% discount
  },
  exclusivePricing: {
    tier1: 1.15,   // 15% premium
    tier2: 1.10,   // 10% premium
    tier3: 1.05    // 5% premium
  },
  resellerNoRegret: {
    tier1: 0.85,   // 15% discount
    tier2: 0.80,   // 20% discount
    tier3: 0.75    // 25% discount
  }
};

export const pricingCategoryLabels = {
  competitiveRetail: 'Competitive Retail Price',
  exclusivePricing: 'Exclusive Pricing',
  resellerNoRegret: 'Reseller No Regret Price'
};

export const tierLabels = {
  tier1: 'Tier 1',
  tier2: 'Tier 2',
  tier3: 'Tier 3'
};

export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  quantity: number;
}

export const allComponents: ComponentItem[] = [
  // Hardware Components
  {
    id: 'hw-001',
    name: 'UHF Reader',
    category: 'Hardware',
    description: 'Long-range UHF RFID reader for vehicle identification',
    basePrice: 25000,
    quantity: 0
  },
  {
    id: 'hw-002',
    name: 'RFID Tag',
    category: 'Hardware',
    description: 'Vehicle RFID tags for authorization',
    basePrice: 150,
    quantity: 0
  },
  {
    id: 'hw-003',
    name: 'Barrier Gate',
    category: 'Hardware',
    description: 'Automated vehicle barrier with motor control',
    basePrice: 45000,
    quantity: 0
  },
  {
    id: 'hw-004',
    name: 'ANPR Camera',
    category: 'Hardware',
    description: 'High-resolution camera for number plate recognition',
    basePrice: 35000,
    quantity: 0
  },
  {
    id: 'hw-005',
    name: 'LED Display',
    category: 'Hardware',
    description: 'Digital signage display for parking information',
    basePrice: 18000,
    quantity: 0
  },
  {
    id: 'hw-006',
    name: 'Loop Detector',
    category: 'Hardware',
    description: 'Vehicle detection sensor for entry/exit points',
    basePrice: 8000,
    quantity: 0
  },
  {
    id: 'hw-007',
    name: 'Controller Unit',
    category: 'Hardware',
    description: 'Central processing unit for parking system',
    basePrice: 55000,
    quantity: 0
  },
  {
    id: 'hw-008',
    name: 'Power Supply Unit',
    category: 'Hardware',
    description: 'Uninterrupted power supply for system components',
    basePrice: 12000,
    quantity: 0
  },
  
  // Software Components
  {
    id: 'sw-001',
    name: 'Parking Management Software',
    category: 'Software',
    description: 'Complete parking management system with dashboard',
    basePrice: 85000,
    quantity: 0
  },
  {
    id: 'sw-002',
    name: 'Mobile App License',
    category: 'Software',
    description: 'Customer mobile application for parking services',
    basePrice: 35000,
    quantity: 0
  },
  {
    id: 'sw-003',
    name: 'ANPR Software',
    category: 'Software',
    description: 'Number plate recognition software license',
    basePrice: 25000,
    quantity: 0
  },
  {
    id: 'sw-004',
    name: 'Reporting Module',
    category: 'Software',
    description: 'Advanced analytics and reporting system',
    basePrice: 15000,
    quantity: 0
  },
  {
    id: 'sw-005',
    name: 'Payment Gateway Integration',
    category: 'Software',
    description: 'Multiple payment options integration',
    basePrice: 20000,
    quantity: 0
  },
  
  // Services
  {
    id: 'svc-001',
    name: 'Installation Service',
    category: 'Services',
    description: 'Professional installation and setup',
    basePrice: 30000,
    quantity: 0
  },
  {
    id: 'svc-002',
    name: 'Training Service',
    category: 'Services',
    description: 'Staff training and system orientation',
    basePrice: 15000,
    quantity: 0
  },
  {
    id: 'svc-003',
    name: 'Annual Maintenance',
    category: 'Services',
    description: 'Yearly maintenance and support contract',
    basePrice: 50000,
    quantity: 0
  },
  {
    id: 'svc-004',
    name: 'Site Survey',
    category: 'Services',
    description: 'Technical site assessment and planning',
    basePrice: 10000,
    quantity: 0
  },
  {
    id: 'svc-005',
    name: '24/7 Support',
    category: 'Services',
    description: 'Round-the-clock technical support',
    basePrice: 40000,
    quantity: 0
  }
];

export type PricingCategoryKey = keyof typeof pricingMultipliers;
export type TierKey = keyof PricingTier;
