import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const data = await req.json();

        if (!data.userId) {
            data.userId = 'guest_user';
        }

        const newInvoice = await Invoice.create(data);
        return NextResponse.json(newInvoice, { status: 201 });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDB();
        const searchParams = req.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        const query = userId ? { userId } : {};
        const invoices = await Invoice.find(query).sort({ createdAt: -1 });

        return NextResponse.json(invoices, { status: 200 });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }
}
