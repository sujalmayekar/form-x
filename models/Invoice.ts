import mongoose from 'mongoose';

const InvoiceLineItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
});

const InvoiceSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Clerk ID
    invoiceNumber: { type: String, required: true },
    date: { type: Date, default: Date.now },
    dueDate: { type: Date },
    fromDetails: {
        name: { type: String },
        email: { type: String },
        address: { type: String },
    },
    toDetails: {
        name: { type: String },
        email: { type: String },
        address: { type: String },
    },
    lineItems: [InvoiceLineItemSchema],
    currency: { type: String, default: 'USD' },
    taxRate: { type: Number, default: 0 },
    theme: {
        primaryColor: { type: String, default: '#000000' },
        logoUrl: { type: String },
        note: { type: String },
    },
    status: {
        type: String,
        enum: ['draft', 'paid', 'overdue'],
        default: 'draft',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
