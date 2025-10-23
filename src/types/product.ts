// types/product.ts

export interface Product {
    id: string; // Required for cart operations
    _id?: string; // MongoDB ID
    name: string;
    image: string;
    price: number;
    originalPrice?: number; // Optional original price for discounts
    description: string;
    category: 'sachet' | 'bottled' | 'dispenser' | 'accessories' | 'bulk'; // Added categories
    stock: number;
    affiliateCommission: number; // For affiliate calculations
    tags?: string[]; // Optional tags for extra info
    isActive?: boolean; // For product status
    createdAt?: string; // Creation timestamp
    updatedAt?: string; // Update timestamp
}

// Sample Product Data (you'd typically fetch this from a database)
export const products: Product[] = [
    {
        id: 'sachet-water-small',
        name: 'Epilux Sachet Water (Small Pack)',
        image: '/images/sachet-water-1.jpeg',
        price: 350,
        originalPrice: 400,
        description: 'A convenient pack of refreshing Epilux sachet water, perfect for individual consumption.',
        category: 'sachet',
        stock: 500,
        affiliateCommission: 50,
        tags: ['popular', 'value-pack']
    },
    {
        id: 'sachet-water-bulk',
        name: 'Epilux Sachet Water (Bulk Order)',
        image: '/images/sachet-water-2.jpeg',
        price: 3200,
        originalPrice: 3500,
        description: 'Economical bulk package of Epilux sachet water for events or large households.',
        category: 'sachet',
        stock: 200,
        affiliateCommission: 250,
        tags: ['bulk', 'discount']
    },
    {
        id: 'bottled-water-500ml',
        name: 'Epilux Bottled Water (500ml)',
        image: '/images/product1.jpeg',
        price: 150,
        description: 'Single serving 500ml Epilux bottled water, ideal for on-the-go hydration.',
        category: 'bottled',
        stock: 800,
        affiliateCommission: 15,
        tags: ['single-serve']
    },
    {
        id: 'bottled-water-15l',
        name: 'Epilux Bottled Water (1.5L)',
        image: '/images/product-2.jpeg',
        price: 300,
        originalPrice: 350,
        description: 'Large 1.5L bottle of Epilux water, perfect for daily hydration needs.',
        category: 'bottled',
        stock: 400,
        affiliateCommission: 30,
        tags: ['family-size']
    },
    {
        id: 'water-dispenser',
        name: 'Premium Water Dispenser',
        image: '/images/product-3.jpeg',
        price: 25000,
        description: 'High-quality water dispenser for home or office, hot and cold options.',
        category: 'dispenser',
        stock: 50,
        affiliateCommission: 1500,
        tags: ['appliance']
    },
    {
        id: 'dispenser-bottle-19l',
        name: '19L Refillable Dispenser Bottle',
        image: '/images/dry-season.jpeg',
        price: 1800,
        description: 'Large 19L bottle, compatible with standard water dispensers.',
        category: 'bulk',
        stock: 150,
        affiliateCommission: 100,
        tags: ['refill', 'bulk']
    },
    {
        id: 'water-filter-set',
        name: 'Epilux Water Filter Set',
        image: '/images/dry-season-2.jpeg',
        price: 7500,
        description: 'Advanced filtration system for purer drinking water at home.',
        category: 'accessories',
        stock: 75,
        affiliateCommission: 500,
        tags: ['filtration', 'home']
    },
];