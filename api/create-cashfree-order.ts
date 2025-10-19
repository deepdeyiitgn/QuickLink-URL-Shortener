// Vercel Serverless Function: /api/create-cashfree-order
// Handles creating a payment order with the Cashfree API.

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing.' });
        }
        const { amount, currency, user } = req.body;

        if (!amount || !currency || !user) {
            return res.status(400).json({ error: 'Amount, currency, and user details are required.' });
        }

        const clientId = process.env.CASHFREE_CLIENT_ID;
        const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.error("Cashfree credentials are not configured on the server.");
            return res.status(500).json({ error: 'Payment gateway is not configured correctly.' });
        }
        
        const orderId = `order_${Date.now()}`;

        const options = {
            order_id: orderId,
            order_amount: amount,
            order_currency: currency,
            customer_details: {
                customer_id: user.id,
                customer_email: user.email,
                // Cashfree requires a phone number. Using a placeholder as it's not in the User model.
                customer_phone: '9999999999' 
            },
            order_meta: {
                // Return URL is not strictly needed for frontend SDK flow but good practice to have
                return_url: `https://quick-link-url-shortener.vercel.app/dashboard?order_id={order_id}` 
            }
        };

        const cashfreeResponse = await fetch('https://api.cashfree.com/pg/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': clientId,
                'x-client-secret': clientSecret,
                'x-api-version': '2022-09-01'
            },
            body: JSON.stringify(options),
        });

        const orderData = await cashfreeResponse.json();

        if (!cashfreeResponse.ok) {
            console.error('Cashfree API Error:', orderData);
            throw new Error(orderData.message || 'Failed to create Cashfree order.');
        }

        res.status(200).json(orderData);

    } catch (error: any) {
        console.error('Error creating Cashfree order:', error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
