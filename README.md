
<div align="center">
  <img src="/public/quicklink-logo.svg" alt="QuickLink Logo" width="128" height="128">
  <h1>QuickLink - URL Shortener, QR Suite, & Community Blog</h1>
  <p>
    <strong>A modern, high-performance, full-stack web application that provides a suite of powerful tools for the modern web.</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/framework-React-blue?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/language-TypeScript-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/backend-Serverless-yellow?style=for-the-badge&logo=vercel" alt="Serverless">
    <img src="https://img.shields.io/badge/database-MongoDB-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB">
  </p>
</div>

**QuickLink** is a feature-complete, stable, and production-ready platform designed to make sharing information as seamless, secure, and efficient as possible. It provides a fast, reliable, and feature-rich suite to shorten URLs, generate dynamic QR codes, and engage with a community for everyone—from individuals sharing content with friends, to businesses engaging with customers on a global scale.

**[➡️ Live Demo](https://quick-link-url-shortener.vercel.app/)**

---

## ✨ Core Features

### 🛠️ Main Tools

*   🔗 **[URL Shortener](/shortener)**: Convert long URLs into short, shareable links.
    *   **Custom Aliases**: Create branded, memorable links that stand out.
    *   **Dynamic Expiration**: Link lifespan is based on user status (24 hours for anonymous, 7 days for registered, up to 1 year for subscribers).
*   🎨 **[QR Code Generator](/qr-generator)**: A versatile suite for creating custom QR codes.
    *   **Multiple Data Types**: Supports URLs, Wi-Fi, vCard, Text, Email, SMS, Phone, Geo-location, Calendar Events, Bitcoin, and UPI.
    *   **Deep Customization**: Change dot and background colors, and add a custom logo to the center.
*   📷 **[QR Code Scanner](/qr-scanner)**: Instantly scan QR codes using a device camera or by uploading an image.
    *   **Multi-Engine Fallback**: Uses a primary in-browser scanner (`html5-qrcode`), a secondary in-browser scanner (`jsQR`), and an optional third-party API for maximum accuracy.
*   ⚙️ **Optional External Fallback**: If both in-browser scanners fail, users are asked for consent to send the image to [api.qrserver.com](https://api.qrserver.com/) for decoding.


### ✍️ Community & Content

*   📰 **[Community Blog](/blog)**: A user-driven blog for sharing stories, updates, and tutorials.
    *   **Rich Content Creation**: Users can create posts with titles, content, images (up to 2), or a single audio file.
    *   **Post Formatting**: Supports both plain text and full HTML for advanced post layouts.
    *   **Social Interaction**: Users can like and comment on posts.
*   **Dynamic User Badges**: A robust badge system (Normal, Premium, Moderator, Owner) that displays on all user content (posts, comments) and updates retroactively when a user's status changes.

### 💰 Monetization & E-commerce

*   💎 **[Subscription Tiers](/dashboard)**: One-time payments for premium plans via Razorpay and Cashfree.
*   🛍️ **[E-commerce Shop](/shop)**: A complete shop system for digital products (e.g., subscription extensions).
*   🎟️ **Advanced Coupon System**: Admins can create and manage discount coupons (percentage or flat-rate) with various limits (expiration, quantity, one-per-user).
*   💸 **[Donation System](/donate)**: A dedicated page for users to support the platform, featuring a live donation leaderboard.
*   **Strategic Ad Placement**: Dismissible Google AdSense units are placed in non-intrusive locations, with core tool areas and dashboards remaining ad-free.
*   **Anti-Adblocker System**: A polite, timed modal encourages users to disable adblockers and provides helpful guides.

### 👑 User & Admin Features

*   **[Comprehensive Dashboard](/dashboard)**: Clean, tabbed interfaces for both users and admins.
*   **User Management**: Admins can view all users, manage their roles (Admin, Moderator), grant premium access, and view session analytics (IP, browser, device).
*   **Content Moderation**: Admins can approve/disapprove blog posts and delete any user-created content (short links, posts, comments).
*   **[Developer API](/api-access)**: A secure API for integrating URL shortening into external applications.
*   **Support Ticket System**: Users can create support tickets, and admins can manage and reply to them from the dashboard.
*   **Notification System**: Admins can send custom push notifications (with optional links) to individual users or all users.

---

## 📸 Screenshots

*(Add screenshots of your application here to showcase the UI. For example:)*
*   `<h2>URL Shortener Page</h2>[![URL Shortener Page](public/screenshot1.jpg)](https://quick-link-url-shortener.vercel.app/shortener)
*   `<h2>QR Generator with Customization</h2> [![QR Generator with Customization](public/screenshot2.jpg)](https://quick-link-url-shortener.vercel.app/qr-generator)
*   `<h2>Admin Dashboard</h2>[![Admin Dashboard](public/screenshot3.jpg)](https://quick-link-url-shortener.vercel.app/dashboard)
*   `<h2>Community Blog</h2>[![Community Blog](public/screenshot4.jpg)](https://quick-link-url-shortener.vercel.app/blog)

---

## 💻 Technology Stack

<details>
<summary><strong>Frontend</strong></summary>

*   **Framework**: [React](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **QR Generation**: [qr-code-styling](https://github.com/kozakdenys/qr-code-styling)
*   **QR Scanning**: [html5-qrcode](https://github.com/mebjas/html5-qrcode) & [jsQR](https://github.com/cozmo/jsQR)

</details>

<details>
<summary><strong>Backend</strong></summary>

*   **Platform**: [Vercel Serverless Functions](https://vercel.com/docs/functions)
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
*   **ODM**: Native [MongoDB Driver](https://www.mongodb.com/docs/drivers/node/current/)

</details>

<details>
<summary><strong>Third-Party Services</strong></summary>

*   **Payments**: [Razorpay](https://razorpay.com/), [Cashfree](https://www.cashfree.com/)
*   **Advertisements**: [Google AdSense](https://www.google.com/adsense/)
*   **Live Chat**: [JivoChat](https://www.jivochat.com/)

</details>

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [Vercel Account](https://vercel.com/signup) for deployment
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register) for the database
- [Razorpay Account](https://razorpay.com/) for payment processing

### Environment Variables

Create a `.env` file in the root of your project and add the following variables. These are crucial for the application to function.

```
# MongoDB Connection
MONGODB_URI="your_mongodb_atlas_connection_string"
MONGODB_DB_NAME="your_database_name"

# Razorpay API Keys (for payment processing)
VITE_RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/deepdeyiitgn/QuickLink-URL-Shortener.git
    cd quick-link-url-shortener
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`. The Vercel CLI can be used to run the serverless functions locally.

---

### 👑 Creating an Owner/Admin Account

The application does not have a public admin registration page for security reasons. To create an owner account, follow these steps:

1.  **Sign up for a regular user account** through the application's UI.
2.  **Connect to your MongoDB Atlas database** using a tool like MongoDB Compass or the online Data Explorer.
3.  Navigate to your database and open the `users` collection.
4.  Find the user document you just created (you can identify it by the email address).
5.  **Manually edit the document** and set the `isAdmin` field to `true`.
    ```json
    {
      "isAdmin": true
    }
    ```
6.  Save the changes. The next time you log in with that account, you will have full administrator privileges.

---

## 🌐 API Documentation

QuickLink provides a simple REST API for developers to programmatically shorten URLs.

*   **Endpoint**: `POST /api/v1/shorten`
*   **Authentication**: `Authorization: Bearer YOUR_API_KEY`

#### Example Request (`curl`)

```bash
curl -X POST https://shorturl.deepdeyiitk.com/api/v1/shorten \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
          "longUrl": "https://example.com/a-very-long-url-to-be-shortened",
          "alias": "custom-alias"
        }'
```

#### Example Success Response

```json
{
    "shortUrl": "https://shorturl.deepdeyiitk.com/custom-alias",
    "longUrl": "https://example.com/a-very-long-url-to-be-shortened",
    "alias": "custom-alias",
    "expiresAt": 1735689600000
}
```

---

## 部署 (Deployment)

This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  **Push your code to a Git repository** (e.g., GitHub, GitLab).
2.  **Import the project on Vercel** from your Git repository.
3.  **Configure Environment Variables:** In your Vercel project settings, add the same environment variables from your `.env` file.
4.  **Deploy.** Vercel will automatically detect the Vite frontend and the serverless functions in the `/api` directory and deploy the application.

---
## 💖 Acknowledgment

This project was built with the invaluable assistance of **Google's Gemini**. Its capabilities in code generation, debugging, and providing architectural insights were instrumental in bringing this complex application to life.
