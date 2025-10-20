# QuickLink: The All-in-One Link & Community Platform

A modern, fast, and feature-rich platform built with React, TypeScript, and Tailwind CSS. QuickLink has evolved beyond a simple utility into a complete solution for link management, content sharing, and community interaction. This project is now feature-complete, secure, and ready for deployment.

## ✨ Features

- **Advanced URL Shortening**: 
  - Quickly convert long URLs into short, shareable links.
  - Personalize your links with **Custom Aliases** (e.g., `/#my-event`).
  - Set custom expiration dates for links, with extended durations for subscribed users.

- **Comprehensive QR Code Suite**:
  - **Powerful Generator**: A free tool to create a wide variety of static QR codes (URL, Wi-Fi, vCard, Events, Payments, and more).
  - **Deep Customization**: Brand your QR codes by customizing colors and embedding your own logo.
  - **Versatile Scanner**: An integrated scanner that reads QR codes instantly using either the device camera or by uploading an image file.

- **Blog & Community Platform**:
  - **Rich Content Creation**: Users can create and publish blog posts with formatted text, raw HTML, images, and even audio uploads.
  - **Community Interaction**: Engage with content through a system of likes, threaded comments, and social sharing.
  - **Advanced Moderation**: Admins have full control with post-approval workflows, the ability to pin important posts to the top, and deletion rights.
  - **Live User Presence**: User badges (Premium, Owner, Blacklisted) and profile details update in real-time across all their posts and comments.

- **Full Support Ticket System**:
  - **Integrated Helpdesk**: Logged-in users can create support tickets through a dedicated portal.
  - **Threaded Conversations**: Enables persistent, back-and-forth communication between users and administrators.
  - **Admin Management**: Admins can view, reply to, and manage the status of all user tickets directly from the Owner Dashboard.

- **Centralized Notification System**:
  - **User Alerts**: A dedicated notification panel alerts users to important events.
  - **Automated Triggers**: Notifications are automatically generated for replies to support tickets, approval status of blog posts, and changes to account status (e.g., being banned or unbanned).

- **Secure Payment & Donation Integration**:
  - **Flexible Subscriptions**: Securely process one-time payments for link and API subscriptions using Razorpay and Cashfree.
  - **Donation System**: A dedicated page allows the community to support the platform through one-time donations.
  - **Supporter Recognition**: A public leaderboard showcases top contributors, and donors receive a "Premium" badge as a thank-you.

- **Powerful Dashboards & API**:
  - **User Dashboard**: A central hub for users to manage their profile, subscription status, API key, and view their support ticket history.
  - **Owner Dashboard**: An administrative command center to view all users, links, API keys, QR/scan history, and manage the entire support ticket system.
  - **Developer API**: A dedicated portal where users can generate an API key (with a 1-month free trial) and purchase subscriptions to use the URL shortening service in their own applications.

- **Enhanced Security & Analytics**:
  - **User Moderation**: Admins can ban users, which restricts their access to site tools while maintaining their content with a "Blacklisted" status.
  - **Activity Logging**: The system automatically logs a user's IP address, device type, and browser on login and subsequent activity, providing valuable analytics and security insights for the site owner.
  - **Live Status Page**: A public page displaying real-time site metrics and the operational status of all core services, including database connectivity.

- **Server-Side Persistence**: The application uses **MongoDB Atlas** for all data storage, making user accounts, links, blog posts, and history persistent and accessible from any device.

## 🚀 How to Run Locally

1.  **Prerequisites**: Make sure you have Node.js and npm (or yarn) installed.
2.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd quicklink-url-shortener
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Configure Environment Variables**:
    -   Create a file named `.env` in the root of the project.
    -   Copy the contents from the `.env.example` section below and fill in your own values.
5.  **Start the development server**:
    ```bash
    npm run dev
    ```
6.  Open your browser and navigate to the local URL provided by your development server (e.g., `http://localhost:5173`).

## 部署 (Deployment)

This project is optimized for deployment on platforms like Vercel.

### Deploying to Vercel (Recommended)

1.  **Push to GitHub**: Make sure your project code is pushed to a GitHub repository.
2.  **Sign up/Log in to Vercel**: Connect your GitHub account to Vercel.
3.  **Import Project**: From your Vercel dashboard, click "Add New... > Project" and select your GitHub repository.
4.  **Configure Project**:
    -   Vercel should automatically detect that this is a Vite project. If not, set the **Framework Preset** to `Vite`.
    -   The **Build Command** should be `npm run build` and the **Output Directory** should be `dist`.
5.  **Set up MongoDB Atlas Database (Required)**
    -   Follow the **"Setting up MongoDB Atlas"** guide below to create your free database.
6.  **Add Environment Variables**:
    -   Navigate to your Vercel project's **Settings > Environment Variables**.
    -   Add all the required variables from the `.env.example` file, including your new `MONGODB_URI`, `MONGODB_DB_NAME`, and payment gateway secrets.
7.  **Deploy**: Click the "Deploy" button. Vercel will build your site and deploy the serverless functions, which will connect to your MongoDB database.

### Setting up MongoDB Atlas (Required for Deployment)

This application requires a MongoDB database to store all its data. You can get a free database from MongoDB Atlas.

1.  **Create a MongoDB Atlas Account**:
    -   Go to the [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.

2.  **Create a Free Cluster**:
    -   After signing up, you will be prompted to create a new cluster. Choose the **M0 (Free)** option.
    -   Select a cloud provider and region.
    -   Click **"Create Cluster"**.

3.  **Create a Database User**:
    -   In your cluster's dashboard, go to **Database Access** under "Security".
    -   Click **"Add New Database User"**. Enter a **username** and **password** (save these securely).
    -   Grant the user the **"Read and write to any database"** privilege.
    -   Click **"Add User"**.

4.  **Configure Network Access**:
    -   Go to **Network Access** under "Security".
    -   Click **"Add IP Address"** and select **"ALLOW ACCESS FROM ANYWHERE"** (`0.0.0.0/0`). This is necessary for Vercel's serverless functions to connect.
    -   Click **"Confirm"**.

5.  **Get Your Connection String**:
    -   Go to your cluster's **Database** dashboard and click **"Connect"**.
    -   Select the **"Drivers"** option.
    -   Copy the connection string (URI). It will look like:
        `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
    -   **Important**: Replace `<password>` with the actual password you created.

6.  **Add to Vercel Environment Variables**:
    -   In your Vercel project settings, add:
        -   `MONGODB_URI`: Your full connection string.
        -   `MONGODB_DB_NAME`: A name for your database (e.g., `quicklink`).

## ⚙️ Environment Variables

To run this project, you will need to create a `.env` file in the root of your project and add the following environment variables.

***.env.example***
```
# Owner Account Credentials
VITE_OWNER_EMAIL="admin@example.com"
VITE_OWNER_PASSWORD="your_secret_password"

# Razorpay Public Key
VITE_RAZORPAY_KEY_ID="your_razorpay_key_id_here"

# --- SERVER-SIDE ONLY ---
# These should be set in your Vercel deployment environment variables.

# Razorpay Secret Key
RAZORPAY_KEY_SECRET="your_razorpay_key_secret_here"

# Cashfree Credentials
CASHFREE_CLIENT_ID="your_cashfree_client_id"
CASHFREE_CLIENT_SECRET="your_cashfree_client_secret"

# MongoDB Connection Details
MONGODB_URI="your_mongodb_atlas_connection_string"
MONGODB_DB_NAME="your_database_name"
```

## 💻 How to Contribute & Push Code

If you want to contribute to this project or manage your own version, follow these steps:

1.  **Fork the Repository**
    -   Click the "Fork" button at the top-right corner of the original GitHub repository page.

2.  **Clone Your Fork**
    -   Go to your forked repository and copy the URL.
    ```bash
    git clone <your-fork-url>
    cd quicklink-url-shortener
    ```

3.  **Create a New Branch**
    ```bash
    git checkout -b my-awesome-feature
    ```

4.  **Make Your Changes**

5.  **Commit Your Changes**
    ```bash
    git add .
    git commit -m "feat: Add my awesome new feature"
    ```

6.  **Push to Your Fork**
    ```bash
    git push origin my-awesome-feature
    ```

7.  **(Optional) Create a Pull Request**
    -   If you want to merge your changes back into the original repository, go to your fork on GitHub and create a "Pull Request".

## 🔑 Owner Access

The owner account provides access to an administrative dashboard. The credentials are now managed via environment variables. To log in as the owner, ensure you have the `VITE_OWNER_EMAIL` and `VITE_OWNER_PASSWORD` variables set in your `.env` file.

## 💻 Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Payments**: Razorpay, Cashfree
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: **MongoDB Atlas**
- **Icons**: Heroicons (via inline SVG components)
- **State Management**: React Context API
- **Build Tool**: Vite
