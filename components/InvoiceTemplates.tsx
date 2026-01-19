import React from 'react';
import { Invoice } from '@/lib/types';

export interface InvoiceTemplateProps {
    invoice: Partial<Invoice>;
    subtotal: number;
    taxAmount: number;
    total: number;
    previewRef: React.RefObject<HTMLDivElement | null>;
}

// 1. MODERN TEMPLATE (Existing Default)
export const ModernTemplate: React.FC<InvoiceTemplateProps> = ({ invoice, subtotal, taxAmount, total, previewRef }) => {
    return (
        <div
            ref={previewRef}
            className="bg-[#ffffff] text-[#0f172a] shadow-2xl relative"
            style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm',
                boxSizing: 'border-box'
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
                <div className="flex flex-col gap-4">
                    {invoice.theme?.logoUrl ? (
                        <img src={invoice.theme.logoUrl} alt="Brand Logo" className="h-16 w-auto object-contain" />
                    ) : (
                        <div className="h-16 w-16 bg-[#f4f4f5] rounded flex items-center justify-center text-[#a1a1aa] text-xs">
                            NO LOGO
                        </div>
                    )}
                    <div>
                        <h3 className="font-bold text-[#1e293b]">{invoice.fromDetails?.name || 'Your Business'}</h3>
                        <p className="text-sm text-[#64748b] whitespace-pre-line">{invoice.fromDetails?.address}</p>
                        <p className="text-sm text-[#64748b]">{invoice.fromDetails?.email}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-5xl font-serif text-[#0f172a] tracking-tight" style={{ color: invoice.theme?.primaryColor }}>INVOICE</h1>
                    <p className="text-[#64748b] font-mono mt-2">#{invoice.invoiceNumber}</p>
                    <div className="mt-4 space-y-1">
                        <p className="text-sm text-[#475569]"><span className="text-[#94a3b8] w-20 inline-block font-medium">Date:</span> {String(invoice.date)}</p>
                        <p className="text-sm text-[#475569]"><span className="text-[#94a3b8] w-20 inline-block font-medium">Due Date:</span> {String(invoice.dueDate)}</p>
                    </div>
                </div>
            </div>

            {/* Bill To */}
            <div className="mb-12">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3 border-b pb-1">Bill To</h2>
                <h3 className="text-xl font-bold text-[#1e293b]">{invoice.toDetails?.name || 'Client Name'}</h3>
                <p className="text-sm text-[#64748b] whitespace-pre-line mt-1">{invoice.toDetails?.address}</p>
                <p className="text-sm text-[#64748b]">{invoice.toDetails?.email}</p>
            </div>

            {/* Items Table */}
            <div className="mb-8">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-[#f1f5f9] text-xs font-bold uppercase text-[#94a3b8]">
                            <th className="pb-3 w-[45%]">Description</th>
                            <th className="pb-3 text-right">Qty</th>
                            <th className="pb-3 text-right">Rate</th>
                            <th className="pb-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f8fafc]">
                        {invoice.lineItems?.map(item => (
                            <tr key={item.id} className="text-sm text-[#334155]">
                                <td className="py-4 font-medium">{item.description}</td>
                                <td className="py-4 text-right">{item.quantity}</td>
                                <td className="py-4 text-right">{invoice.currency} {Number(item.rate).toFixed(2)}</td>
                                <td className="py-4 text-right font-bold">{invoice.currency} {Number(item.amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-1/2 space-y-3">
                    <div className="flex justify-between text-sm text-[#64748b]">
                        <span>Subtotal</span>
                        <span>{invoice.currency} {Number(subtotal).toFixed(2)}</span>
                    </div>
                    {taxAmount > 0 && (
                        <div className="flex justify-between text-sm text-[#64748b]">
                            <span>Tax ({invoice.taxRate}%)</span>
                            <span>{invoice.currency} {Number(taxAmount).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-[#0f172a] border-t-2 border-[#f1f5f9] pt-3">
                        <span>Total</span>
                        <span style={{ color: invoice.theme?.primaryColor }}>{invoice.currency} {Number(total).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-20 left-20 right-20 text-center">
                <p className="text-[#1e293b] font-serif italic mb-2">{invoice.theme?.note}</p>
                <div className="h-1 w-12 mx-auto bg-[#e2e8f0]" style={{ backgroundColor: invoice.theme?.primaryColor }}></div>
                <p className="text-xs text-[#94a3b8] mt-6">Thank you for your business</p>
            </div>
        </div>
    );
};

// 2. DARK TEMPLATE
export const DarkTemplate: React.FC<InvoiceTemplateProps> = ({ invoice, subtotal, taxAmount, total, previewRef }) => {
    return (
        <div
            ref={previewRef}
            className="bg-[#09090b] text-[#ffffff] shadow-2xl relative"
            style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm',
                boxSizing: 'border-box'
            }}
        >
            {/* Header */}
            <div className="flex flex-col items-center mb-16 text-center">
                <h1 className="text-7xl font-serif text-[#ffffff] tracking-tighter mb-4">Invoice.</h1>
                <div className="w-24 h-1 bg-white mb-8" style={{ backgroundColor: invoice.theme?.primaryColor }}></div>

                {invoice.theme?.logoUrl && (
                    <img src={invoice.theme.logoUrl} alt="Logo" className="h-16 w-auto object-contain mb-6 grayscale invert" />
                )}
            </div>

            <div className="flex justify-between items-start mb-16 border-t border-b border-[#27272a] py-8">
                <div>
                    <h3 className="text-xs font-mono text-[#a1a1aa] uppercase tracking-widest mb-2">Issued By</h3>
                    <h4 className="text-xl font-bold font-serif mb-1">{invoice.fromDetails?.name || 'Your Business'}</h4>
                    <p className="text-sm text-[#71717a] whitespace-pre-line">{invoice.fromDetails?.address}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-xs font-mono text-[#a1a1aa] uppercase tracking-widest mb-2">Issued To</h3>
                    <h4 className="text-xl font-bold font-serif mb-1">{invoice.toDetails?.name || 'Client Name'}</h4>
                    <p className="text-sm text-[#71717a] whitespace-pre-line">{invoice.toDetails?.address}</p>
                </div>
            </div>

            {/* Meta */}
            <div className="flex justify-between mb-12">
                <div>
                    <span className="text-xs text-[#52525b] block uppercase tracking-wider">Invoice No</span>
                    <span className="text-lg font-mono">{invoice.invoiceNumber}</span>
                </div>
                <div>
                    <span className="text-xs text-[#52525b] block uppercase tracking-wider">Date Issued</span>
                    <span className="text-lg">{String(invoice.date)}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs text-[#52525b] block uppercase tracking-wider">Total Due</span>
                    <span className="text-lg font-bold" style={{ color: invoice.theme?.primaryColor }}>{invoice.currency} {Number(total).toFixed(2)}</span>
                </div>
            </div>

            {/* Items */}
            <div className="mb-12">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-[#27272a]">
                            <th className="pb-4 font-serif text-lg font-normal w-[45%]">Item</th>
                            <th className="pb-4 font-serif text-lg font-normal text-right">Quantity</th>
                            <th className="pb-4 font-serif text-lg font-normal text-right">Price</th>
                            <th className="pb-4 font-serif text-lg font-normal text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a]">
                        {invoice.lineItems?.map(item => (
                            <tr key={item.id} className="text-[#d4d4d8]">
                                <td className="py-6">{item.description}</td>
                                <td className="py-6 text-right font-mono text-sm">{item.quantity}</td>
                                <td className="py-6 text-right font-mono text-sm">{invoice.currency} {Number(item.rate).toFixed(2)}</td>
                                <td className="py-6 text-right font-mono text-sm text-white">{invoice.currency} {Number(item.amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-20">
                <div className="w-1/2 space-y-4">
                    <div className="flex justify-between items-center text-[#a1a1aa]">
                        <span>Subtotal</span>
                        <span>{invoice.currency} {Number(subtotal).toFixed(2)}</span>
                    </div>
                    {taxAmount > 0 && (
                        <div className="flex justify-between items-center text-[#a1a1aa]">
                            <span>Tax ({invoice.taxRate}%)</span>
                            <span>{invoice.currency} {Number(taxAmount).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center text-3xl font-serif text-white pt-6 border-t border-[#27272a]">
                        <span>Total</span>
                        <span>{invoice.currency} {Number(total).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-[#27272a] pt-8">
                <div>
                    <p className="text-xs text-[#52525b] uppercase tracking-wider mb-1">Contact</p>
                    <p className="text-sm text-[#a1a1aa]">{invoice.fromDetails?.email}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-serif italic text-[#71717a]">{invoice.theme?.note}</p>
                </div>
            </div>
        </div>
    );
};

// 3. GEOMETRIC TEMPLATE
export const GeometricTemplate: React.FC<InvoiceTemplateProps> = ({ invoice, subtotal, taxAmount, total, previewRef }) => {
    return (
        <div
            ref={previewRef}
            className="bg-[#ffffff] text-[#1e293b] shadow-2xl relative overflow-hidden"
            style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm',
                boxSizing: 'border-box'
            }}
        >
            {/* Geometric Shapes */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0f766e] transform translate-x-1/3 -translate-y-1/2 rotate-45 opacity-10" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#ec4899] transform translate-x-1/2 -translate-y-1/3 rotate-12 opacity-10" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#0f766e] transform -translate-x-1/3 translate-y-1/2 rotate-45 opacity-5" />

            {/* Header */}
            <div className="flex justify-between items-start mb-20 relative z-10">
                <div>
                    <h1 className="text-6xl font-black text-[#1e293b] tracking-tight uppercase" style={{ color: invoice.theme?.primaryColor }}>INVOICE</h1>
                    <p className="text-[#64748b] font-medium tracking-widest uppercase mt-2">NO. {invoice.invoiceNumber}</p>
                </div>

                {invoice.theme?.logoUrl ? (
                    <img src={invoice.theme.logoUrl} alt="Logo" className="h-24 w-auto object-contain" />
                ) : (
                    <div className="w-20 h-20 bg-[#f1f5f9] rounded-full flex items-center justify-center font-bold text-[#cbd5e1]">LOGO</div>
                )}
            </div>

            {/* Grid Info */}
            <div className="grid grid-cols-2 gap-12 mb-16 relative z-10">
                <div>
                    <h3 className="text-xs font-bold uppercase text-[#94a3b8] mb-4">Emitted To</h3>
                    <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e2e8f0]">
                        <h4 className="font-bold text-lg text-[#334155] mb-2">{invoice.toDetails?.name || 'Client Name'}</h4>
                        <p className="text-sm text-[#64748b]">{invoice.toDetails?.email}</p>
                        <p className="text-sm text-[#64748b] whitespace-pre-line mt-1">{invoice.toDetails?.address}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase text-[#94a3b8] mb-4">Dates</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0]">
                            <span className="block text-xs text-[#94a3b8] uppercase">Issued</span>
                            <span className="block font-medium text-[#334155]">{String(invoice.date)}</span>
                        </div>
                        <div className="bg-[#f0fdfa] p-4 rounded-lg border border-[#ccfbf1]">
                            <span className="block text-xs text-[#2dd4bf] uppercase font-bold">Due</span>
                            <span className="block font-bold text-[#0f766e]">{String(invoice.dueDate)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mb-8 relative z-10">
                <table className="w-full">
                    <thead className="bg-[#1e293b] text-white">
                        <tr>
                            <th className="py-3 px-4 text-left font-bold text-xs uppercase tracking-wider rounded-l-lg">Description</th>
                            <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-wider">Qty</th>
                            <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-wider">Rate</th>
                            <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-wider rounded-r-lg">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                        {invoice.lineItems?.map((item, i) => (
                            <tr key={item.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}>
                                <td className="py-4 px-4 font-medium text-[#334155]">{item.description}</td>
                                <td className="py-4 px-4 text-right text-[#64748b]">{item.quantity}</td>
                                <td className="py-4 px-4 text-right text-[#64748b]">{invoice.currency} {Number(item.rate).toFixed(2)}</td>
                                <td className="py-4 px-4 text-right font-bold text-[#334155]">{invoice.currency} {Number(item.amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Summary */}
            <div className="flex justify-between items-center bg-[#f8fafc] p-8 rounded-xl border border-[#e2e8f0] relative z-10">
                <div className="text-[#64748b] text-sm italic w-1/2">
                    {invoice.theme?.note}
                </div>
                <div className="w-1/3">
                    <div className="flex justify-between mb-2 text-sm text-[#64748b]">
                        <span>Subtotal</span>
                        <span>{invoice.currency} {Number(subtotal).toFixed(2)}</span>
                    </div>
                    {taxAmount > 0 && (
                        <div className="flex justify-between mb-2 text-sm text-[#64748b]">
                            <span>Tax</span>
                            <span>{invoice.currency} {Number(taxAmount).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between pt-4 border-t border-[#e2e8f0] text-xl font-black text-[#1e293b]">
                        <span>Total</span>
                        <span style={{ color: invoice.theme?.primaryColor }}>{invoice.currency} {Number(total).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-12 left-0 right-0 text-center text-[#94a3b8] text-xs uppercase tracking-widest">
                From {invoice.fromDetails?.name} • {invoice.fromDetails?.email}
            </div>
        </div>
    );
};


// 4. MINIMAL TEMPLATE
export const MinimalTemplate: React.FC<InvoiceTemplateProps> = ({ invoice, subtotal, taxAmount, total, previewRef }) => {
    return (
        <div
            ref={previewRef}
            className="bg-[#ffffff] text-[#171717] shadow-2xl relative"
            style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm',
                boxSizing: 'border-box'
            }}
        >
            <div className="text-center mb-16">
                {invoice.theme?.logoUrl ? (
                    <img src={invoice.theme.logoUrl} alt="Logo" className="h-16 w-auto object-contain mx-auto mb-6" />
                ) : null}
                <h1 className="text-3xl font-light tracking-[0.2em] text-[#171717] uppercase mb-2">Invoice</h1>
                <p className="text-[#a3a3a3] font-mono text-sm tracking-widest">{invoice.invoiceNumber}</p>
            </div>

            <div className="flex justify-center gap-20 mb-20 text-center">
                <div>
                    <span className="block text-xs uppercase tracking-widest text-[#a3a3a3] mb-2">Issued</span>
                    <span className="block font-medium">{String(invoice.date)}</span>
                </div>
                <div>
                    <span className="block text-xs uppercase tracking-widest text-[#a3a3a3] mb-2">Due</span>
                    <span className="block font-medium">{String(invoice.dueDate)}</span>
                </div>
            </div>

            <div className="flex justify-between gap-12 mb-16 px-12">
                <div className="text-left w-1/3">
                    <span className="block text-xs uppercase tracking-widest text-[#a3a3a3] mb-4 border-b pb-2">From</span>
                    <p className="font-semibold">{invoice.fromDetails?.name}</p>
                    <p className="text-sm text-[#525252] mt-1">{invoice.fromDetails?.email}</p>
                </div>
                <div className="text-right w-1/3">
                    <span className="block text-xs uppercase tracking-widest text-[#a3a3a3] mb-4 border-b pb-2">To</span>
                    <p className="font-semibold">{invoice.toDetails?.name}</p>
                    <p className="text-sm text-[#525252] mt-1">{invoice.toDetails?.email}</p>
                </div>
            </div>

            <div className="mb-20">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-xs uppercase tracking-widest text-[#a3a3a3] pb-6 font-normal">Item Description</th>
                            <th className="text-right text-xs uppercase tracking-widest text-[#a3a3a3] pb-6 font-normal w-20">Qty</th>
                            <th className="text-right text-xs uppercase tracking-widest text-[#a3a3a3] pb-6 font-normal w-32">Price</th>
                            <th className="text-right text-xs uppercase tracking-widest text-[#a3a3a3] pb-6 font-normal w-32">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.lineItems?.map(item => (
                            <tr key={item.id} className="border-b border-[#f5f5f5]">
                                <td className="py-6 font-medium">{item.description}</td>
                                <td className="py-6 text-right text-[#737373]">{item.quantity}</td>
                                <td className="py-6 text-right text-[#737373]">{invoice.currency} {Number(item.rate).toFixed(2)}</td>
                                <td className="py-6 text-right">{invoice.currency} {Number(item.amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end">
                <div className="w-1/3 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-[#a3a3a3]">Subtotal</span>
                        <span>{invoice.currency} {Number(subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium pt-4 border-t border-[#171717]">
                        <span>Total Due</span>
                        <span>{invoice.currency} {Number(total).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-20 left-0 right-0 text-center px-20">
                <div className="border-t border-[#f5f5f5] pt-8">
                    <p className="text-sm text-[#737373]">{invoice.theme?.note}</p>
                </div>
            </div>
        </div>
    );
};
