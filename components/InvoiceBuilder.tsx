'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Invoice, InvoiceLineItem } from '@/lib/types';
import { Plus, Trash, Download, Save, Printer, ArrowLeft, LayoutTemplate } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModernTemplate, DarkTemplate, GeometricTemplate, MinimalTemplate } from './InvoiceTemplates';

interface InvoiceBuilderProps {
    onBack: () => void;
}

type TemplateType = 'modern' | 'dark' | 'geometric' | 'minimal';

export default function InvoiceBuilder({ onBack }: InvoiceBuilderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');

    useEffect(() => {
        const templateParam = searchParams?.get('template');
        if (templateParam && ['modern', 'dark', 'geometric', 'minimal'].includes(templateParam)) {
            setSelectedTemplate(templateParam as TemplateType);
        }
    }, [searchParams]);

    const [invoice, setInvoice] = useState<Partial<Invoice>>({
        invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fromDetails: { name: '', email: '', address: '' },
        toDetails: { name: '', email: '', address: '' },
        lineItems: [
            { id: '1', description: 'Web Development Services', quantity: 1, rate: 100, amount: 100 },
        ],
        currency: 'USD',
        taxRate: 0,
        theme: {
            primaryColor: '#2b2b2b',
            logoUrl: '',
            note: 'Thank you for your business!',
        },
        status: 'draft',
    });

    // Calculate totals
    const subtotal = (invoice.lineItems || []).reduce((acc, item) => acc + item.amount, 0);
    const taxAmount = subtotal * ((invoice.taxRate || 0) / 100);
    const total = subtotal + taxAmount;

    const handleLineItemChange = (index: number, field: keyof InvoiceLineItem, value: string | number) => {
        const newItems = [...(invoice.lineItems || [])];
        const item = { ...newItems[index], [field]: value };

        // Recalculate amount if qty or rate changes
        if (field === 'quantity' || field === 'rate') {
            const qty = field === 'quantity' ? Number(value) : item.quantity;
            const rate = field === 'rate' ? Number(value) : item.rate;
            item.amount = qty * rate;
        }

        newItems[index] = item;
        setInvoice({ ...invoice, lineItems: newItems });
    };

    const addLineItem = () => {
        setInvoice({
            ...invoice,
            lineItems: [
                ...(invoice.lineItems || []),
                { id: Date.now().toString(), description: '', quantity: 1, rate: 0, amount: 0 },
            ],
        });
    };

    const removeLineItem = (index: number) => {
        const newItems = [...(invoice.lineItems || [])];
        newItems.splice(index, 1);
        setInvoice({ ...invoice, lineItems: newItems });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...invoice, userId: 'guest_user' }), // Mock userId
            });

            if (res.ok) {
                const data = await res.json();
                alert('Invoice saved! Redirecting to public view...');
                router.push(`/invoice/${data._id}`);
            } else {
                alert('Failed to save invoice.');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving invoice.');
        } finally {
            setLoading(false);
        }
    };

    const exportPDF = async () => {
        if (!previewRef.current) return;
        try {
            const canvas = await html2canvas(previewRef.current, {
                scale: 2,
                useCORS: true,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
        } catch (error) {
            console.error('Export failed', error);
        }
    };

    const exportPNG = async () => {
        if (!previewRef.current) return;
        try {
            const canvas = await html2canvas(previewRef.current, { scale: 2 });
            const link = document.createElement('a');
            link.download = `invoice-${invoice.invoiceNumber}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('Export failed', error);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInvoice(prev => ({ ...prev, theme: { ...prev.theme!, logoUrl: reader.result as string } }));
            };
            reader.readAsDataURL(file);
        }
    };

    const renderTemplate = () => {
        const props = { invoice, subtotal, taxAmount, total, previewRef };
        switch (selectedTemplate) {
            case 'dark': return <DarkTemplate {...props} />;
            case 'geometric': return <GeometricTemplate {...props} />;
            case 'minimal': return <MinimalTemplate {...props} />;
            default: return <ModernTemplate {...props} />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-background text-foreground overflow-hidden">
            {/* LEFT: Editor */}
            <div className="w-full lg:w-1/2 flex flex-col border-r-2 border-zinc-800 h-full overflow-y-auto custom-scrollbar">
                <header className="p-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-serif text-white">Invoice Editor</h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Invoice'}
                        </button>
                    </div>
                </header>

                <div className="p-6 space-y-8">
                    {/* Template Selector */}
                    <section className="glass-card p-6 rounded-xl space-y-4 border border-zinc-800">
                        <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <LayoutTemplate className="w-4 h-4" /> Selected Template
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['modern', 'dark', 'geometric', 'minimal'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTemplate(t as TemplateType)}
                                    className={`px-3 py-2 rounded text-sm capitalize transition-all border ${selectedTemplate === t
                                            ? 'bg-zinc-800 border-zinc-600 text-white shadow-lg'
                                            : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Invoice Details */}
                    <section className="glass-card p-6 rounded-xl space-y-4">
                        <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-4">Invoice Metadata</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-zinc-500 mb-1 block">Invoice No.</label>
                                <input
                                    type="text"
                                    value={invoice.invoiceNumber}
                                    onChange={e => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-white outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 mb-1 block">Date</label>
                                <input
                                    type="date"
                                    value={String(invoice.date)}
                                    onChange={e => setInvoice({ ...invoice, date: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-white outline-none transition-colors invert-calendar"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 mb-1 block">Due Date</label>
                                <input
                                    type="date"
                                    value={String(invoice.dueDate)}
                                    onChange={e => setInvoice({ ...invoice, dueDate: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-white outline-none transition-colors invert-calendar"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 mb-1 block">Currency</label>
                                <select
                                    value={invoice.currency}
                                    onChange={e => setInvoice({ ...invoice, currency: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-white outline-none transition-colors"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="INR">INR (₹)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* From / To */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="glass-card p-6 rounded-xl space-y-3">
                            <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-2">Bill From</h3>
                            <input
                                placeholder="Business Name"
                                value={invoice.fromDetails?.name}
                                onChange={e => setInvoice({ ...invoice, fromDetails: { ...invoice.fromDetails!, name: e.target.value } })}
                                className="w-full bg-transparent border-b border-zinc-700 py-2 text-sm focus:border-white outline-none placeholder:text-zinc-600"
                            />
                            <input
                                placeholder="Email"
                                value={invoice.fromDetails?.email}
                                onChange={e => setInvoice({ ...invoice, fromDetails: { ...invoice.fromDetails!, email: e.target.value } })}
                                className="w-full bg-transparent border-b border-zinc-700 py-2 text-sm focus:border-white outline-none placeholder:text-zinc-600"
                            />
                            <textarea
                                placeholder="Address"
                                value={invoice.fromDetails?.address}
                                onChange={e => setInvoice({ ...invoice, fromDetails: { ...invoice.fromDetails!, address: e.target.value } })}
                                className="w-full bg-transparent border-b border-zinc-700 py-2 text-sm focus:border-white outline-none placeholder:text-zinc-600 resize-none h-20"
                            />
                        </section>

                        <section className="glass-card p-6 rounded-xl space-y-3">
                            <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-2">Bill To</h3>
                            <input
                                placeholder="Client Name"
                                value={invoice.toDetails?.name}
                                onChange={e => setInvoice({ ...invoice, toDetails: { ...invoice.toDetails!, name: e.target.value } })}
                                className="w-full bg-transparent border-b border-zinc-700 py-2 text-sm focus:border-white outline-none placeholder:text-zinc-600"
                            />
                            <input
                                placeholder="Client Email"
                                value={invoice.toDetails?.email}
                                onChange={e => setInvoice({ ...invoice, toDetails: { ...invoice.toDetails!, email: e.target.value } })}
                                className="w-full bg-transparent border-b border-zinc-700 py-2 text-sm focus:border-white outline-none placeholder:text-zinc-600"
                            />
                            <textarea
                                placeholder="Billing Address"
                                value={invoice.toDetails?.address}
                                onChange={e => setInvoice({ ...invoice, toDetails: { ...invoice.toDetails!, address: e.target.value } })}
                                className="w-full bg-transparent border-b border-zinc-700 py-2 text-sm focus:border-white outline-none placeholder:text-zinc-600 resize-none h-20"
                            />
                        </section>
                    </div>

                    {/* Line Items */}
                    <section className="glass-card p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">Line Items</h3>
                            <button onClick={addLineItem} className="text-xs flex items-center gap-1 hover:text-white transition-colors">
                                <Plus className="w-3 h-3" /> Add Item
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-zinc-500 border-b border-zinc-800">
                                        <th className="pb-2 w-[40%]">Description</th>
                                        <th className="pb-2 w-[15%]">Qty</th>
                                        <th className="pb-2 w-[20%]">Rate</th>
                                        <th className="pb-2 w-[20%]">Amount</th>
                                        <th className="pb-2 w-[5%]"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {invoice.lineItems?.map((item, idx) => (
                                        <tr key={item.id} className="group">
                                            <td className="py-2 pr-2">
                                                <input
                                                    value={item.description}
                                                    onChange={e => handleLineItemChange(idx, 'description', e.target.value)}
                                                    placeholder="Item description"
                                                    className="w-full bg-transparent outline-none placeholder:text-zinc-700"
                                                />
                                            </td>
                                            <td className="py-2 pr-2">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={e => handleLineItemChange(idx, 'quantity', e.target.value)}
                                                    className="w-full bg-transparent outline-none text-zinc-300"
                                                />
                                            </td>
                                            <td className="py-2 pr-2">
                                                <input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={e => handleLineItemChange(idx, 'rate', e.target.value)}
                                                    className="w-full bg-transparent outline-none text-zinc-300"
                                                />
                                            </td>
                                            <td className="py-2 pr-2 font-mono text-zinc-400">
                                                {Number(item.amount).toFixed(2)}
                                            </td>
                                            <td className="py-2 text-right">
                                                <button onClick={() => removeLineItem(idx)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-zinc-800 p-1 rounded transition-all">
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <div className="w-48 space-y-2">
                                <div className="flex justify-between text-sm text-zinc-400">
                                    <span>Subtotal</span>
                                    <span>{Number(subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-zinc-400 items-center">
                                    <span>Tax Rate (%)</span>
                                    <input
                                        type="number"
                                        value={invoice.taxRate}
                                        onChange={e => setInvoice({ ...invoice, taxRate: Number(e.target.value) })}
                                        className="w-12 bg-zinc-900 border border-zinc-800 rounded px-1 text-right outline-none focus:border-zinc-600"
                                    />
                                </div>
                                <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-zinc-800">
                                    <span>Total</span>
                                    <span>{invoice.currency} {Number(total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Theme Settings */}
                    <section className="glass-card p-6 rounded-xl space-y-4">
                        <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-4">Branding</h3>
                        <div className="flex gap-6 items-start">
                            <div>
                                <label className="text-xs text-zinc-500 mb-2 block">Brand Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={invoice.theme?.primaryColor}
                                        onChange={e => setInvoice({ ...invoice, theme: { ...invoice.theme!, primaryColor: e.target.value } })}
                                        className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
                                    />
                                    <span className="text-xs font-mono text-zinc-500">{invoice.theme?.primaryColor}</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <label className="text-xs text-zinc-500 mb-2 block">Logo</label>
                                <div className="flex items-center gap-4">
                                    {invoice.theme?.logoUrl && (
                                        <img src={invoice.theme.logoUrl} alt="Logo" className="h-10 w-auto object-contain border border-zinc-700 rounded bg-white" />
                                    )}
                                    <label className="cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors">
                                        Upload Image
                                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-500 mb-1 block">Footer Note</label>
                            <input
                                type="text"
                                value={invoice.theme?.note}
                                onChange={e => setInvoice({ ...invoice, theme: { ...invoice.theme!, note: e.target.value } })}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm focus:border-white outline-none transition-colors"
                            />
                        </div>
                    </section>
                </div>
            </div>

            {/* RIGHT: Live Preview */}
            <div className="w-full lg:w-1/2 bg-[#525659] h-full flex flex-col">
                <header className="p-3 bg-[#323639] flex justify-between items-center shadow-md z-10">
                    <span className="text-xs text-zinc-400 font-mono pl-4">LIVE PREVIEW (A4) - {selectedTemplate.toUpperCase()}</span>
                    <div className="flex gap-2">
                        <button onClick={exportPNG} className="p-2 hover:bg-white/10 rounded text-zinc-300 hover:text-white transition-colors" title="Export PNG">
                            <Download className="w-4 h-4" />
                        </button>
                        <button onClick={exportPDF} className="p-2 hover:bg-white/10 rounded text-zinc-300 hover:text-white transition-colors" title="Export PDF">
                            <Printer className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 flex justify-center custom-scrollbar">
                    {renderTemplate()}
                </div>
            </div>
        </div>
    );
}
