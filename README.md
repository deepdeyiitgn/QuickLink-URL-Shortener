# QuickLink - URL Shortener, QR Suite, & Community Blog

**QuickLink** is a modern, high-performance, full-stack web application that provides a suite of powerful tools for the modern web, including a top-ranking URL shortener, a versatile QR code generator and scanner, and a dynamic community blog. The project is built with React, TypeScript, and Vite on the frontend, and a serverless backend using Vercel Functions with a MongoDB Atlas database.

This project is now **feature-complete, stable, and ready for deployment**.

## ✨ Final Feature List

- **URL Shortener**: Convert long URLs into short, shareable links with support for custom aliases and expiration dates based on user subscription status.
- **QR Code Suite**:
    - **Generator**: Create custom QR codes for various data types (URL, Wi-Fi, vCard, Text, etc.) with options to add logos and change colors.
    - **Scanner**: Instantly scan QR codes using a device camera or by uploading an image file, all within the browser.
- **E-commerce Shop**: A complete shop system allowing admins to create limited-edition digital products (e.g., subscription extensions) with automated benefit fulfillment.
- **Advanced Coupon System**: Admins can create and manage discount coupons (percentage or flat-rate) with various limits (expiration, quantity, one-per-user).
- **Community Blog**: A user-driven blog where registered users can create posts with rich content (HTML, images, audio).
- **Advanced Admin Controls**:
    - **Comprehensive Dashboard**: Clean, tabbed interfaces for both users and admins.
    - **User Management**: Admins can view all users, manage their roles (Admin, Moderator), grant premium access, and view session analytics (IP, browser, device).
    - **Content Moderation**: Admins can approve/disapprove blog posts and delete individual user-created short links.
    - **Notification System**: Admins can send custom push notifications (with images and templates) to individual users or all users.
- **Dynamic User Badges**: A robust badge system (Normal, Premium, Team, Owner) that displays on all user content and updates retroactively across past posts and comments when a user's status changes.
- **Polished User Experience**:
    - **Festive UI Theme**: A "Diwali & Winter" theme with animated gradients and a subtle snowfall effect.
    - **Responsive Design**: A modern, slide-out mobile menu and fully responsive layouts that fix all previously reported UI bugs.
    - **One-Time Loader**: A full-screen loader appears only on the initial page load for a faster perceived performance.
    - **Live Footer Clock**: The footer features a real-time glowing clock displaying the date, time, and day.
    - **Bug Fixes & Stability**: Addressed initial data loading errors that could occur on some environments, ensuring contexts for URLs, QR History, and Blog Posts initialize reliably.
- **Monetization & Support**:
    - **Subscription Tiers**: Multiple payment gateways (Razorpay, Cashfree) for one-time subscription purchases.
    - **Strategic Ad Placement**: Dismissible Google AdSense units are placed in non-intrusive locations, with core tool areas and dashboards remaining ad-free.
    - **Anti-Adblocker System**: A polite, timed modal encourages users to disable adblockers and provides helpful guides.
- **Security & Analytics**:
    - **User Session Tracking**: Automatically captures user IP, browser, and device type on login for admin review.
    - **Secure API**: Serverless functions protect sensitive operations and validate all incoming data.

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
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

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
6.  Save the changes. The next time you log in with that account, you will have full administrator privileges, including access to the Admin Panel in the dashboard.

## 部署

This project is optimized for deployment on [Vercel](https://vercel.com/). The API has been consolidated to **10 serverless functions**, which is within the 12-function limit of Vercel's free "Hobby" plan.

1.  **Push your code to a Git repository** (e.g., GitHub, GitLab).
2.  **Import the project on Vercel** from your Git repository.
3.  **Configure Environment Variables:** In your Vercel project settings, add the same environment variables from your `.env` file.
4.  **Deploy.** Vercel will automatically detect the Vite frontend and the serverless functions in the `/api` directory and deploy the application.