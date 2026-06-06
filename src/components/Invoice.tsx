import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Download, Printer, Loader2 } from 'lucide-react';
import type { BookingDetails } from '../types';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const Invoice = ({ details, isPaid }: { details: BookingDetails | null, isPaid?: boolean }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!details) return null;
  
  const tax = details.amount * 0.18; // 18% GST typical in India
  const total = details.amount + tax;
  const invoiceId = `INV-${Math.floor(Math.random() * 1000000)}`;

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);
    
    try {
      const width = invoiceRef.current.offsetWidth;
      const height = invoiceRef.current.offsetHeight;

      const imgData = await toPng(invoiceRef.current, { 
        cacheBust: true, 
        pixelRatio: 2 
      });
      
      const pdf = new jsPDF({
        orientation: height > width ? 'portrait' : 'landscape',
        unit: 'px',
        format: [width, height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`${invoiceId}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-lg mx-auto bg-white"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 text-india-green flex items-center justify-center rounded-full mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-navy">Service Completed</h2>
        <p className="text-slate-500 text-sm mt-1">Thank you for using Servico India</p>
      </div>

      <div ref={invoiceRef} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
        {/* Postal Stamp effect */}
        {isPaid && (
          <div className="absolute top-4 right-4 text-xs font-bold text-slate-300 transform rotate-12 border-2 border-slate-300 px-2 py-1 rounded">PAID VIA UPI</div>
        )}
        
        <div className="flex justify-between items-end mb-6 pb-6 border-b border-dashed border-slate-300">
          <div>
            <p className="text-sm text-slate-500 font-medium">Invoice No.</p>
            <p className="font-bold text-navy">{invoiceId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 font-medium">Date</p>
            <p className="font-bold text-navy">{details.date}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">{details.serviceName} - Base Charge</span>
            <span className="font-semibold">₹{details.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">CGST (9%)</span>
            <span className="font-semibold">₹{(tax / 2).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 font-medium">SGST (9%)</span>
            <span className="font-semibold">₹{(tax / 2).toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-navy text-white rounded-xl p-4 flex justify-between items-center shadow-lg">
          <span className="font-semibold">Total Paid</span>
          <span className="text-2xl font-bold">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={handlePrint} className="flex-1 bg-slate-100 hover:bg-slate-200 text-navy font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Printer className="w-4 h-4" /> Print
        </button>
        <button 
          onClick={handleDownloadPdf} 
          disabled={isGenerating}
          className="flex-1 bg-saffron hover:bg-saffron-dark disabled:opacity-75 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
      </div>
    </motion.div>
  );
};
