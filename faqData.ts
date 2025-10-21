
export interface FaqItemData {
    question: string;
    answer: string;
}

export const faqData: FaqItemData[] = [
    {
        question: 'What is QuickLink?',
        answer: 'QuickLink is a comprehensive tool that allows you to shorten long URLs into shareable, memorable links and to create a wide variety of custom QR codes for both personal and business use.'
    },
    {
        question: 'Is the URL shortener free to use?',
        answer: 'Yes, the core URL shortening feature is free. Anonymous users can create links that last for 24 hours. By signing up for a free account, your links will last for 7 days. We also offer premium subscription plans for even longer-lasting links and additional features.'
    },
    {
        question: 'What types of QR codes can I create?',
        answer: 'You can create QR codes for URLs, plain text, Wi-Fi network access, vCard contact details, pre-filled emails or SMS messages, phone numbers, geographic locations, calendar events, and even payment information for Bitcoin and UPI.'
    },
    {
        question: 'Can I customize my QR codes?',
        answer: 'Absolutely! You can customize the color of the QR code and its background. You can also add your own logo to the center of the QR code to make it match your brand identity.'
    },
    {
        question: 'How does the QR code scanner work?',
        answer: 'Our scanner can read QR codes in two ways: by using your device\'s camera for a live scan, or by uploading an image file that contains a QR code. It\'s fast, private, and works directly in your browser.'
    },
    {
        question: 'Is my data safe?',
        answer: 'Yes. We take your privacy and security seriously. User data is stored securely in our MongoDB database. Payment information is handled by trusted, industry-standard payment processors like Razorpay and Cashfree; we never store your full credit card details on our servers. Please see our Privacy Policy for more details.'
    },
    {
        question: 'What is a custom alias?',
        answer: 'A custom alias is a personalized keyword you can choose for your short link instead of a random string of characters. For example, you can turn a long URL into `quick.link/my-event`, making it easier for people to remember and type.'
    },
    {
        question: 'Do I need an account to use the service?',
        answer: 'You can use the URL shortener and QR code generator without an account. However, creating a free account allows you to manage your links and QR history in a personal dashboard, get longer expiration dates on links, and access the developer API.'
    }
];
