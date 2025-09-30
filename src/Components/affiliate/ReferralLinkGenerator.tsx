import React, { useState, useCallback } from 'react';
import { Link, Copy } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ReferralLinkGeneratorProps {
    userId: string;
}

export const ReferralLinkGenerator = ({ userId }: ReferralLinkGeneratorProps) => {
    const referralLink = `https://epiluxwater.com/join?ref=${userId}`;
    const [copyStatus, setCopyStatus] = useState('idle');

    // Function to handle link copy
    const handleCopy = useCallback((text: string) => {
        // Fallback for clipboard access issues in iframes
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand('copy');
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
        document.body.removeChild(tempInput);
    }, []);

    return (
        <Card className="p-6 h-full border-t-4 border-yellow-500 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Link className="h-5 w-5 mr-2 text-yellow-600" /> Share Your Link</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Instantly generate and share your unique referral link to track commissions and bonuses.
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Your Partner ID</label>
                        <Input type="text" value={userId} readOnly className="font-mono text-xs bg-gray-100" />
                    </div>
                    <div className="relative">
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Shareable Link</label>
                        <Input type="text" value={referralLink} readOnly className="pr-12" />
                        <Button
                            onClick={() => handleCopy(referralLink)}
                            className="absolute right-0 top-6 bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg transition-colors"
                        >
                            <Copy className="h-5 w-5" />
                        </Button>
                        {copyStatus === 'copied' && (
                            <span className="absolute -top-6 right-0 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full animate-pulse">
                                Copied!
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <a href="#" className="mt-4 text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center justify-end">
                Go to Marketing Assets &rarr;
            </a>
        </Card>
    );
};
