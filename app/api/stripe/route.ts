import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request) {
    try {
        const body = await request.json();
        const { hireId } = body; // Get amount from request

        const stripe = new Stripe("sk_test_51RE3Nx4N6RvwXaQv1LVr0xwDYNrRK7tOPqO5yK615TRb3RsII4xjG119QbZOq8epjZbHeo4LMHuZmaD1HZoqnOQa00gcyOTivt");

        const product = await stripe.products.create({
            name: 'Hire Ticket',
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: 100 * 100,
            currency: 'usd',
        });

        // Use this price ID in your checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${request.headers.get('origin')}/hire/payment/success?session_id={CHECKOUT_SESSION_ID}&hireId=${hireId}`,
            cancel_url: `${request.headers.get('origin')}/hire/payment/canceled`,
        });

        return NextResponse.json({ id: session.id });
    } catch (err) {
        console.error('Stripe error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}