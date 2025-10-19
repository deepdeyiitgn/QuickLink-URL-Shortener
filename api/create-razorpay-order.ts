// This is a Vercel serverless function, which will be deployed at the `/api/create-razorpay-order` endpoint.
// It securely handles the creation of a Razorpay order on the backend.

// Vercel automatically provides request and response objects compatible with Node.js.
// We don't need to import any special types like `@vercel/node`.
// We'll use the globally available `fetch` API in the Vercel Node.js 18.x runtime.

export default async function handler(req: any, res: any) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({ error: 'Amount and currency are required.' });
        }

        // Retrieve secrets from environment variables. These are set in the Vercel dashboard.
        const keyId = process.env.VITE_RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            console.error("Razorpay credentials are not configured on the server.");
            return res.status(500).json({ error: 'Payment gateway is not configured correctly.' });
        }

        // Prepare the request for the Razorpay API
        // Fix: Replaced `Buffer.from` with `btoa` to resolve "Cannot find name 'Buffer'" error.
        // `btoa` is globally available in modern Node.js runtimes like the one used by Vercel.
        const auth = btoa(`${keyId}:${keySecret}`);
        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise for INR)
            currency: currency,
            receipt: `receipt_order_${Date.now()}`,
        };

        // Call the Razorpay API to create an order
        const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify(options),
        });

        const orderData = await razorpayResponse.json();

        if (!razorpayResponse.ok) {
            console.error('Razorpay API Error:', orderData);
            throw new Error(orderData.error?.description || 'Failed to create Razorpay order.');
        }

        // Send the created order details back to the frontend
        res.status(200).json(orderData);

    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}
