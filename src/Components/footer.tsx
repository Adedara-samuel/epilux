import Link from 'next/link';
import { JSX } from 'react';

export function Footer(): JSX.Element {
    return (
        <footer className="bg-epilux-blue text-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold">Epilux Premium Water</h3>
                        <p className="mt-2 text-sm">Providing clean, affordable water with rewarding affiliate opportunities.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="mt-2 space-y-2">
                            <li><Link href="/affiliate" className="text-sm hover:underline">Affiliate Program</Link></li>
                            <li><Link href="/subscriptions" className="text-sm hover:underline">Subscriptions</Link></li>
                            <li><Link href="/bulk-sales" className="text-sm hover:underline">Bulk Sales</Link></li>
                            <li><Link href="/reseller" className="text-sm hover:underline">Reseller</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <p className="mt-2 text-sm">Email: support@epiluxwater.com</p>
                        <p className="text-sm">Phone: +234 123 456 7890</p>
                    </div>
                </div>
                <div className="mt-6 text-center text-sm">
                    © 2025 Epilux Premium Water. All rights reserved.
                </div>
            </div>
        </footer>
    );
}