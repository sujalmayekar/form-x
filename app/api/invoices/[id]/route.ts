import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDB();
        const params = await props.params;
        const { id } = params;

        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json(invoice, { status: 200 });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDB();
        const params = await props.params;
        const { id } = params;
        const data = await req.json();

        const updatedInvoice = await Invoice.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!updatedInvoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json(updatedInvoice, { status: 200 });
    } catch (error) {
        console.error('Error updating invoice:', error);
        return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }
}
