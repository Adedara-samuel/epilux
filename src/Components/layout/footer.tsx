// components/layout/Footer.tsx
import { Facebook, Instagram, Mail, Phone, Twitter, Youtube, MessageCircle, Video, MessageSquare, Send } from 'lucide-react'; // Import icons
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
                        <li><Link href="/products" className="hover:text-white transition-colors text-sm">Products</Link></li>
                        <li><Link href="/subscriptions" className="hover:text-white transition-colors text-sm">Subscriptions</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors text-sm">About Us</Link></li>
                        <li><Link href="/contact-us" className="hover:text-white transition-colors text-sm">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Partnership & Admin */}
                <div>
                    <h4 className="font-bold text-lg text-blue-400 mb-5">Partnership</h4>
                    <ul className="space-y-3">
                        <li>
                            <Link href="/affiliate-reg" className="hover:text-white transition-colors text-sm">
                                Become an Affiliate
                            </Link>
                        </li>
                        <li>
                            {/* <Link href="/admin-login" className="hover:text-white transition-colors text-sm">
                                Admin Portal
                            </Link> */}
                        </li>
                    </ul>
                </div>

                {/* Contact & Social */}
                <div>
                    <h4 className="font-bold text-lg text-blue-400 mb-5">Connect With Us</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-300" />
                            <span>epiluxcompany@gmail.com</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-300" />
                            <span>+234 800 000 0000</span>
                        </li>
                    </ul>
                    <div className="flex flex-nowrap gap-4 mt-6">
                        <a href="https://www.facebook.com/share/17UnVMTq9d/" className="text-gray-400 hover:text-white transition-colors">
                            <Facebook className="h-4 w-4 transition-transform duration-200 hover:scale-110 active:scale-95" />
                        </a>
                        <a href="https://x.com/Epilux_NG" className="text-gray-400 hover:text-white transition-colors">
                            <Twitter className="h-4 w-4 transition-transform duration-200 hover:scale-110 active:scale-95" />
                        </a>
                        <a href="https://www.instagram.com/epilux_industries.NG" className="text-gray-400 hover:text-white transition-colors">
                            <Instagram className="h-4 w-4 transition-transform duration-200 hover:scale-110 active:scale-95" />
                        </a>
                        <a href="https://www.youtube.com/EpiluxNg" className="text-gray-400 hover:text-white transition-colors">
                            <Youtube className="h-4 w-4 transition-transform duration-200 hover:scale-110 active:scale-95" />
                        </a>
                        <a href="https://t.me/EpiluxindustriesNG" className="text-gray-400 hover:text-white transition-colors">
                            <MessageCircle className="h-4 w-4 transition-transform duration-200 hover:scale-110 active:scale-95" />
                        </a>
                        <a href="https://www.tiktok.com/@epilux_industries_ng" className="text-gray-400 hover:text-white transition-colors">
                            <Video className="h-4 w-4 transition-transform duration-200 hover:scale-110 active:scale-95" />
                        </a>
                        <a href="https://wa.me/2349136274739?text=Hello%20I%20am%20interested%20in%20Epilux%20Premium%20Products" className="text-gray-400 hover:text-white transition-colors">
                            <MessageSquare className="h-4 w-4 transition-transform duration-200 hover:scale-110 active:scale-95" />
                        </a>
                        <a href="https://whatsapp.com/channel/0029VbBamKa1XqubmzxYlX1F" className="text-gray-400 hover:text-white transition-colors">
                            <Send className="h-4 w-4 transition-transform duration-200 hover:scale-110 active:scale-95" />
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