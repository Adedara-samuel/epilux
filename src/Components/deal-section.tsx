/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
// components/DealsSection.tsx
import { Button } from './ui/button';
import Link from 'next/link';

const deals = [
    {
        id: 1,
        title: 'Family Pack',
        description: 'Get 20 bottles for the price of 15',
        price: '₦12,000',
        originalPrice: '₦16,000',
        image: '/images/deal-family-pack.jpg',
        expiry: 'Offer ends soon'
    },
    {
        id: 2,
        title: 'Weekend Special',
        description: '50% off on all sachet water packs',
        price: '₦2,500',
        originalPrice: '₦5,000',
        image: '/images/deal-weekend.jpg',
        expiry: 'Today only'
    }
];

export default function DealsSection() {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Today's Best Deals</h2>
                    <Button asChild variant="link" className="text-blue-600">
                        <Link href="/deals">View All</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {deals.map((deal) => (
                        <div key={deal.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="md:flex">
                                <div className="md:flex-shrink-0 md:w-1/3">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={deal.image}
                                        alt={deal.title}
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {deal.expiry}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold mt-2">{deal.title}</h3>
                                    <p className="mt-1 text-gray-500">{deal.description}</p>
                                    <div className="mt-4 flex items-center">
                                        <span className="text-xl font-bold text-gray-900">{deal.price}</span>
                                        <span className="ml-2 text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                                    </div>
                                    <Button asChild size="sm" className="mt-4 bg-blue-600 hover:bg-blue-700">
                                        <Link href={`/deals/${deal.id}`}>Get Deal</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}