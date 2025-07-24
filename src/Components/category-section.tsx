// components/CategorySection.tsx
import Link from 'next/link';
import {  Droplet, Zap, CalendarCheck, BottleWine } from 'lucide-react';

const categories = [
    {
        name: 'Bottled Water',
        href: '/products/bottled',
        icon: BottleWine,
        description: 'Premium bottled water in various sizes'
    },
    {
        name: 'Sachet Water',
        href: '/products/sachet',
        icon: Droplet,
        description: 'Pure water sachets for everyday use'
    },
    {
        name: 'Instant Delivery',
        href: '/express',
        icon: Zap,
        description: 'Get water delivered within 2 hours'
    },
    {
        name: 'Subscriptions',
        href: '/subscriptions',
        icon: CalendarCheck,
        description: 'Regular deliveries on your schedule'
    }
];

export default function CategorySection() {
    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8 text-center">Shop By Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow"
                        >
                            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-50 mb-4 group-hover:bg-blue-100 transition-colors">
                                <category.icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-medium text-lg mb-1">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}