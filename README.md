# QuickLink URL Shortener

A modern, fast, and easy-to-use URL shortener built with React, TypeScript, and Tailwind CSS. Create custom, memorable short links for any website. This project is now feature-complete, secure, and ready for deployment.

## ✨ Features

- **Instant URL Shortening**: Quickly convert long URLs into short, shareable links.
- **Custom Aliases**: Personalize your short links with a custom alias (e.g., `/#my-event`).
- **Live Payments with Vercel**: Securely process one-time payments for subscriptions using Razorpay, powered by Vercel Serverless Functions.
- **Developer API**: A dedicated developer portal where users can generate an API key (with a 1-month free trial) and purchase subscriptions to use the URL shortening service in their own applications.
- **Powerful QR Code Suite**:
    - **Generator**: A powerful, free tool to create a wide variety of static and custom-themed QR codes (URL, Wi-Fi, vCard, Events, Payments, and more) with custom logos and colors.
    - **Scanner**: An integrated scanner that can read QR codes using either the device camera or by uploading an image file.
- **Branded Redirection Page**: Short links first lead to a branded, user-friendly interstitial page, enhancing security and brand visibility before redirecting.
- **User & Owner Dashboards**:
  - **User Dashboard**: Logged-in users can view and manage their created links and subscription status.
  - **Owner Dashboard**: An administrative panel for the site owner to view all users, links, API keys, QR code history, and scan history in an organized, tabbed interface.
- **Live Status Page**: A public status page displaying real-time site metrics and the operational status of all core services.
- **Server-Side Persistence**: The application now uses **MongoDB Atlas** for all data storage, making user accounts, links, and history persistent and accessible from any device.

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
    -   Add all the required variables from the `.env.example` file, including your new `MONGODB_URI`, `MONGODB_DB_NAME`, and `RAZORPAY_KEY_SECRET`.
7.  **Deploy**: Click the "Deploy" button. Vercel will build your site and deploy the serverless functions, which will connect to your MongoDB database.

### Setting up MongoDB Atlas (Required for Deployment)

This application requires a MongoDB database to store user and URL data. You can get a free database from MongoDB Atlas.

1.  **Create a MongoDB Atlas Account**:
    -   Go to the [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.

2.  **Create a Free Cluster**:
    -   After signing up, you will be prompted to create a new cluster. Choose the **M0 (Free)** option.
    -   Select a cloud provider and region (choose one close to your users). You can leave the other settings as default.
    -   Click **"Create Cluster"**. It will take a few minutes to provision.

3.  **Create a Database User**:
    -   In your cluster's dashboard, go to **Database Access** under the "Security" section.
    -   Click **"Add New Database User"**.
    -   Enter a **username** and **password**. Make sure to save these securely, as you will need the password for your connection string.
    -   Grant the user the **"Read and write to any database"** privilege.
    -   Click **"Add User"**.

4.  **Configure Network Access**:
    -   Go to **Network Access** under the "Security" section.
    -   Click **"Add IP Address"**.
    -   Select **"ALLOW ACCESS FROM ANYWHERE"**. This will enter `0.0.0.0/0` in the IP address field. This is necessary for Vercel's serverless functions to connect.
    -   Click **"Confirm"**.

5.  **Get Your Connection String**:
    -   Go back to your cluster's **Database** dashboard and click the **"Connect"** button.
    -   Select the **"Drivers"** option.
    -   You will see a connection string (URI). Copy it. It will look like this:
        `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
    -   **Important**: Replace `<password>` with the actual password you created for your database user.

6.  **Add to Vercel Environment Variables**:
    -   In your Vercel project settings, add the following environment variables:
        -   `MONGODB_URI`: Paste your full connection string from the previous step.
        -   `MONGODB_DB_NAME`: Enter a name for your database, for example, `quicklink`.

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

# MongoDB Connection Details
MONGODB_URI="your_mongodb_atlas_connection_string"
MONGODB_DB_NAME="your_database_name"
```

## 💻 How to Contribute & Push Code

If you want to contribute to this project or manage your own version, follow these steps:

1.  **Fork the Repository**
    -   Click the "Fork" button at the top-right corner of the original GitHub repository page. This creates a copy of the repository under your own GitHub account.

2.  **Clone Your Fork**
    -   Go to your forked repository on GitHub and click the "Code" button. Copy the URL.
    -   Open your terminal and run the following command, replacing `<your-fork-url>` with the URL you copied:
    ```bash
    git clone <your-fork-url>
    cd quicklink-url-shortener
    ```

3.  **Create a New Branch**
    -   It's best practice to create a new branch for each new feature or fix you're working on.
    ```bash
    git checkout -b my-awesome-feature
    ```

4.  **Make Your Changes**
    -   Now you can open the code in your favorite editor and make your changes.

5.  **Commit Your Changes**
    -   Once you're happy with your changes, you need to stage and commit them.
    ```bash
    # Stage all changes for the next commit
    git add .

    # Commit the changes with a descriptive message
    git commit -m "feat: Add my awesome new feature"
    ```

6.  **Push to Your Fork**
    -   Push your committed changes from your local branch to your remote repository on GitHub.
    ```bash
    git push origin my-awesome-feature
    ```

7.  **(Optional) Create a Pull Request**
    -   If you want to merge your changes back into the original repository, go to your fork on GitHub. You should see a prompt to create a "Pull Request". Click it, fill out the details, and submit it for review.

## ⚠️ Important Security Note

This project's data persistence has been refactored to simulate a secure, server-side API. The original `public/users.json` and `public/shortened_urls.json` files are **no longer used** and represent a security risk.

**After cloning, please DELETE the following files:**
- `public/users.json`
- `public/shortened_urls.json`

## 🔑 Owner Access

The owner account provides access to an administrative dashboard. The credentials are now managed via environment variables. To log in as the owner, ensure you have the `VITE_OWNER_EMAIL` and `VITE_OWNER_PASSWORD` variables set in your `.env` file.

## 💻 Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Payments**: Razorpay
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: **MongoDB Atlas**
- **Icons**: Heroicons (via inline SVG components)
- **State Management**: React Context API
- **Build Tool**: Vite