// types/product.ts

export interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number; // Optional original price for discounts
    description: string;
    category: 'sachet' | 'bottled' | 'dispenser' | 'accessories' | 'bulk'; // Added categories
    stock: number;
    affiliateCommission: number; // For affiliate calculations
    tags?: string[]; // Optional tags for extra info
}

// Sample Product Data (you'd typically fetch this from a database)
export const products: Product[] = [
    {
        id: 'sachet-water-small',
        name: 'Epilux Sachet Water (Small Pack)',
        image: 'https://images.pexels.com/photos/6146977/pexels-photo-6146977.jpeg?auto=compress&cs=tinysrgb&w=500&q=60',
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
        image: 'https://images.pexels.com/photos/6146978/pexels-photo-6146978.jpeg?auto=compress&cs=tinysrgb&w=500&q=60',
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
        image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=500&q=60',
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
        image: 'https://images.pexels.com/photos/1028600/pexels-photo-1028600.jpeg?auto=compress&cs=tinysrgb&w=500&q=60',
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
        image: 'https://images.pexels.com/photos/439147/pexels-photo-439147.jpeg?auto=compress&cs=tinysrgb&w=500&q=60',
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
        image: 'https://images.pexels.com/photos/4246102/pexels-photo-4246102.jpeg?auto=compress&cs=tinysrgb&w=500&q=60',
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
        image: 'https://images.pexels.com/photos/373548/pexels-photo-373548.jpeg?auto=compress&cs=tinysrgb&w=500&q=60', // Using factory image as a placeholder
        price: 7500,
        description: 'Advanced filtration system for purer drinking water at home.',
        category: 'accessories',
        stock: 75,
        affiliateCommission: 500,
        tags: ['filtration', 'home']
    },
];