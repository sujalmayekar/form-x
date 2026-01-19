'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Invoice } from '@/lib/types';
import { Printer, Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function PublicInvoicePage() {
    const params = useParams();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await fetch(`/api/invoices/${params.id}`);
                if (!res.ok) throw new Error('Invoice not found');
                const data = await res.json();
                setInvoice(data);
            } catch (err) {
                setError('Failed to load invoice');
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchInvoice();
    }, [params.id]);

    const handlePrint = () => {
        window.print();
    };

    const exportPDF = async () => {
        if (!invoiceRef.current) return;
        try {
            const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice-${invoice?.invoiceNumber}.pdf`);
        } catch (error) {
            console.error('Export failed', error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    if (error || !invoice) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;

    const subtotal = invoice.lineItems.reduce((acc, item) => acc + item.amount, 0);
    const taxAmount = subtotal * ((invoice.taxRate || 0) / 100);
    const total = subtotal + taxAmount;

    return (
        <div className="min-h-screen bg-zinc-900 py-12 px-4 print:bg-white print:p-0">
            {/* Action Bar - Hidden on Print */}
            <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <a href="/" className="text-zinc-400 hover:text-white transition-colors text-sm">← Create your own</a>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors text-sm font-medium"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button
                        onClick={exportPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded transition-colors text-sm font-medium"
                    >
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Invoice Paper */}
            <div
                ref={invoiceRef}
                className="max-w-3xl mx-auto bg-white text-slate-900 shadow-2xl overflow-hidden print:shadow-none print:max-w-none"
                style={{ minHeight: '1123px' }} // Approx A4 height in px
            >
                <div className="p-12 md:p-16">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div className="flex flex-col gap-4">
                            {invoice.theme?.logoUrl && (
                                <img src={invoice.theme.logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
                            )}
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{invoice.fromDetails?.name}</h3>
                                <p className="text-sm text-slate-500 whitespace-pre-line">{invoice.fromDetails?.address}</p>
                                <p className="text-sm text-slate-500">{invoice.fromDetails?.email}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h1 className="text-5xl font-serif text-slate-900 tracking-tight" style={{ color: invoice.theme?.primaryColor }}>INVOICE</h1>
                            <p className="text-slate-500 font-mono mt-2 text-lg">#{invoice.invoiceNumber}</p>
                            <div className="mt-6 space-y-1">
                                <p className="text-sm text-slate-600"><span className="text-slate-400 w-24 inline-block font-medium">Date:</span> {String(invoice.date)}</p>
                                {invoice.dueDate && <p className="text-sm text-slate-600"><span className="text-slate-400 w-24 inline-block font-medium">Due Date:</span> {String(invoice.dueDate)}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Grid for Bill To */}
                    <div className="mb-16 grid grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 border-b pb-2">Bill To</h2>
                            <h3 className="text-xl font-bold text-slate-800">{invoice.toDetails?.name}</h3>
                            <p className="text-sm text-slate-500 whitespace-pre-line mt-2 leading-relaxed">{invoice.toDetails?.address}</p>
                            <p className="text-sm text-slate-500 mt-1">{invoice.toDetails?.email}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mb-8">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-slate-100 text-xs font-bold uppercase text-slate-400">
                                    <th className="pb-4 w-[45%] pl-2">Description</th>
                                    <th className="pb-4 text-right">Qty</th>
                                    <th className="pb-4 text-right">Rate</th>
                                    <th className="pb-4 text-right pr-2">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {invoice.lineItems?.map(item => (
                                    <tr key={item.id} className="text-sm text-slate-700">
                                        <td className="py-4 pl-2 font-medium">{item.description}</td>
                                        <td className="py-4 text-right">{item.quantity}</td>
                                        <td className="py-4 text-right">{invoice.currency} {item.rate.toFixed(2)}</td>
                                        <td className="py-4 text-right font-bold pr-2">{invoice.currency} {item.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-16">
                        <div className="w-1/2 space-y-3">
                            <div className="flex justify-between text-sm text-slate-500 border-b border-slate-50 pb-2">
                                <span>Subtotal</span>
                                <span>{invoice.currency} {subtotal.toFixed(2)}</span>
                            </div>
                            {taxAmount > 0 && (
                                <div className="flex justify-between text-sm text-slate-500 border-b border-slate-50 pb-2">
                                    <span>Tax ({invoice.taxRate}%)</span>
                                    <span>{invoice.currency} {taxAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold text-slate-900 pt-2">
                                <span>Total</span>
                                <span style={{ color: invoice.theme?.primaryColor }}>{invoice.currency} {total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    {(invoice.theme?.note) && (
                        <div className="text-center mt-auto pt-12 border-t border-slate-100">
                            <p className="text-slate-800 font-serif italic text-lg">{invoice.theme.note}</p>
                        </div>
                    )}

                    <div className="text-center mt-12 mb-8">
                        <p className="text-xs text-slate-300 font-mono">Generated by Form-X Invoice</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
