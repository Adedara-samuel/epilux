'use client';

import { useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';

interface WithdrawalReceiptProps {
  withdrawal: {
    id: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
    status: string;
    createdAt: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawalReceipt({ withdrawal, isOpen, onClose }: WithdrawalReceiptProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReceipt = async () => {
    setIsGenerating(true);

    try {
      // Create a canvas element for the receipt
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (A4-like dimensions)
      canvas.width = 794; // 8.27 inches at 96 DPI
      canvas.height = 1123; // 11.69 inches at 96 DPI

      // Set background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      let yPosition = 80;

      // Company Logo/Name (simulated)
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('EPILUX WATER', canvas.width / 2, yPosition);
      yPosition += 40;

      ctx.font = '16px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Premium Water Solutions', canvas.width / 2, yPosition);
      yPosition += 60;

      // Receipt Title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('WITHDRAWAL RECEIPT', canvas.width / 2, yPosition);
      yPosition += 50;

      // Receipt details
      ctx.textAlign = 'left';
      ctx.font = '16px Arial';
      ctx.fillStyle = '#374151';

      const details = [
        { label: 'Receipt Number:', value: withdrawal.id.slice(-8).toUpperCase() },
        { label: 'Date:', value: new Date(withdrawal.createdAt).toLocaleDateString() },
        { label: 'Time:', value: new Date(withdrawal.createdAt).toLocaleTimeString() },
        { label: 'Amount:', value: `₦${withdrawal.amount.toLocaleString()}` },
        { label: 'Bank Name:', value: withdrawal.bankName },
        { label: 'Account Number:', value: withdrawal.accountNumber },
        { label: 'Account Name:', value: withdrawal.accountName },
        { label: 'Status:', value: withdrawal.status.toUpperCase() },
      ];

      details.forEach(detail => {
        ctx.fillText(detail.label, 80, yPosition);
        ctx.fillText(detail.value, 300, yPosition);
        yPosition += 30;
      });

      yPosition += 40;

      // Footer
      ctx.textAlign = 'center';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Thank you for being part of the Epilux Affiliate Program!', canvas.width / 2, yPosition);
      yPosition += 20;
      ctx.fillText('For any inquiries, contact support@epiluxwater.com', canvas.width / 2, yPosition);

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `withdrawal-receipt-${withdrawal.id.slice(-8)}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        setIsGenerating(false);
      }, 'image/png');

    } catch (error) {
      console.error('Error generating receipt:', error);
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl animate-scaleIn">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Withdrawal Receipt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Receipt Preview */}
          <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">EPILUX WATER</h2>
              <p className="text-gray-600">Premium Water Solutions</p>
              <div className="border-t-2 border-gray-300 mt-4 pt-4">
                <h3 className="text-xl font-semibold text-gray-800">WITHDRAWAL RECEIPT</h3>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Receipt Number:</span>
                <span className="text-gray-900">{withdrawal.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Date:</span>
                <span className="text-gray-900">{new Date(withdrawal.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Time:</span>
                <span className="text-gray-900">{new Date(withdrawal.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Amount:</span>
                <span className="text-gray-900 font-bold text-lg">₦{withdrawal.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Bank Name:</span>
                <span className="text-gray-900">{withdrawal.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Account Number:</span>
                <span className="text-gray-900">{withdrawal.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Account Name:</span>
                <span className="text-gray-900">{withdrawal.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                  withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {withdrawal.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-300 mt-6 pt-4 text-center">
              <p className="text-gray-600 text-sm">
                Thank you for being part of the Epilux Affiliate Program!
              </p>
              <p className="text-gray-500 text-xs mt-1">
                For any inquiries, contact support@epiluxwater.com
              </p>
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button onClick={generateReceipt} disabled={isGenerating}>
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download Receipt'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}