// components/layout/Footer.tsx
import { Facebook, Instagram, Mail, Phone, Twitter } from 'lucide-react'; // Import icons
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Company Info */}
                <div>
                    <h3 className="font-bold text-xl text-blue-400 mb-5">Epilux Water</h3>
                    <p className="text-sm leading-relaxed">
                        Providing premium quality sachet and table water with convenient delivery and rewarding partnership opportunities. Your trusted source for hydration.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold text-lg text-blue-400 mb-5">Quick Links</h4>
                    <ul className="space-y-3">
                        <li><Link href="/" className="hover:text-white transition-colors text-sm">Home</Link></li>
                        <li><Link href="/login?redirect=/products" className="hover:text-white transition-colors text-sm">Products</Link></li>
                        <li><Link href="/login?redirect=/subscription" className="hover:text-white transition-colors text-sm">Subscriptions</Link></li>
                        <li><Link href="/login?redirect=/about" className="hover:text-white transition-colors text-sm">About Us</Link></li>
                        <li><Link href="/login?redirect=/contact" className="hover:text-white transition-colors text-sm">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Partnership & Admin */}
                <div>
                    <h4 className="font-bold text-lg text-blue-400 mb-5">Partnership</h4>
                    <ul className="space-y-3">
                        <li>
                            <Link href="/affiliate" className="hover:text-white transition-colors text-sm">
                                Become an Affiliate
                            </Link>
                        </li>
                        <li>
                            <Link href="/login?redirect=/admin" className="hover:text-white transition-colors text-sm">
                                Admin Portal
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact & Social */}
                <div>
                    <h4 className="font-bold text-lg text-blue-400 mb-5">Connect With Us</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-300" />
                            <span>info@epiluxwater.com</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-300" />
                            <span>+234 800 000 0000</span>
                        </li>
                    </ul>
                    <div className="flex space-x-4 mt-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Facebook className="h-6 w-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Twitter className="h-6 w-6" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Instagram className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-10 pt-8 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Epilux Water. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;