// components/Hero.tsx
import { Button } from './ui/button';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <div className="container mx-auto px-4 py-24 md:py-32">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Premium Water Delivered to Your Doorstep
                    </h1>
                    <p className="text-xl mb-8">
                        Enjoy the purest drinking water with our convenient delivery service and exclusive subscription plans.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                            <Link href="/products">Shop Now</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                            <Link href="/subscriptions">View Subscriptions</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </section>
    );
}