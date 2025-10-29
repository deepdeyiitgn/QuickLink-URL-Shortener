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
    <img src="https://api.netlify.com/api/v1/badges/200f5c40-1521-4812-a0b1-e0549f7e8871/deploy-status" alt="Netlify Status" href="https://app.netlify.com/projects/quicklinkurl/deploys">
    <img src="https://deploy-badge.vercel.app/vercel/qlynk" alt="Vercel Deploy"></img>
  </p>
</div>
<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&duration=3000&pause=800&color=3A0CA3&center=true&vCenter=true&width=450&lines=QuickLink;URL+Shortener;QR+Suite;Community+Blog;Made+with+%F0%9F%A9%B7+Deep;Helped+by+Gemini+%F0%9F%92%99;We+Are+Here+%F0%9F%A7%BF;Saiyaara+%26+Aashiqui+2+%E2%9C%A8;Feminist+%E2%9C%A8;Jee+Aspirant+2027+%F0%9F%8E%AF" alt="Typing SVG">
</p>


**QuickLink** is a feature-complete, stable, and production-ready platform designed to make sharing information as seamless, secure, and efficient as possible. It provides a fast, reliable, and feature-rich suite to shorten URLs, generate dynamic QR codes, and engage with a community for everyone—from individuals sharing content with friends, to businesses engaging with customers on a global scale.

**[➡️ Live Demo](https://quick-link-url-shortener.vercel.app/)**

---

**[🩷 Support](https://www.chatbase.co/z1dBVS3yYaFm-L9FJnbAT/help)**

---

**[📞 Contact](https://api.whatsapp.com/send/?phone=15558946957&text=Hello%2C+this+is+a+test+message&type=phone_number&app_absent=0)**

---
<p align="center">
  <img src="https://komarev.com/ghpvc/?username=deepdeyiitgn" alt="deepdeyiitgn's profile views" />
</p>

---

## ✨ Core Features

### 🛠️ Main Tools

*   🔗 **[URL Shortener](https://qlynk.vercel.app/shortener)**: Convert long URLs into short, shareable links.
    *   **Custom Aliases**: Create branded, memorable links that stand out.
    *   **Dynamic Expiration**: Link lifespan is based on user status (24 hours for anonymous, 7 days for registered, up to 1 year for subscribers).
*   🎨 **[QR Code Generator](https://qlynk.vercel.app/qr-generator)**: A versatile suite for creating custom QR codes.
    *   **Multiple Data Types**: Supports URLs, Wi-Fi, vCard, Text, Email, SMS, Phone, Geo-location, Calendar Events, Bitcoin, and UPI.
    *   **Deep Customization**: Change dot and background colors, and add a custom logo to the center.
*   📷 **[QR Code Scanner](https://qlynk.vercel.app/qr-scanner)**: Instantly scan QR codes using a device camera or by uploading an image.
    *   **Multi-Engine Fallback**: Uses a primary in-browser scanner (`html5-qrcode`), a secondary in-browser scanner (`jsQR`), and an optional third-party API for maximum accuracy.

### ✍️ Community & Content

*   📰 **[Community Blog](https://qlynk.vercel.app/blog)**: A user-driven blog for sharing stories, updates, and tutorials.
    *   **Rich Content Creation**: Users can create posts with titles, content, images (up to 2), or a single audio file.
    *   **Post Formatting**: Supports both plain text and full HTML for advanced post layouts.
    *   **Social Interaction**: Users can like and comment on posts.
*   **Dynamic User Badges**: A robust badge system (Normal, Premium, Moderator, Owner) that displays on all user content (posts, comments) and updates retroactively when a user's status changes.

### 💰 Monetization & E-commerce

*   💎 **[Subscription Tiers](https://qlynk.vercel.app/dashboard)**: One-time payments for premium plans via Razorpay and Cashfree.
*   🛍️ **[E-commerce Shop](https://qlynk.vercel.app/shop)**: A complete shop system for digital products (e.g., subscription extensions).
*   🎟️ **Advanced Coupon System**: Admins can create and manage discount coupons (percentage or flat-rate) with various limits (expiration, quantity, one-per-user).
*   💸 **[Donation System](https://qlynk.vercel.app/donate)**: A dedicated page for users to support the platform, featuring a live donation leaderboard and a "Buy Me a Coffee" link.
*   **Strategic Ad Placement**: Dismissible Google AdSense units are placed in non-intrusive locations, with core tool areas and dashboards remaining ad-free.
*   **Anti-Adblocker System**: A polite, timed modal encourages users to disable adblockers and provides helpful guides.

### 👑 User & Admin Features

*   **[Comprehensive Dashboard](https://qlynk.vercel.app/dashboard)**: Clean, tabbed interfaces for both users and admins.
*   **Secure Authentication & Password Recovery**:
    *   **Google Sign-In**: One-click sign-in/sign-up using your Google account, bypassing email verification.
    *   **Email Verification**: New user signups are protected by a mandatory email verification step to prevent spam and ensure account authenticity.
    *   **Robust Password Hashing**: Utilizes pbkdf2 with a strong salt for secure password storage.
    *   **"Forgot Password" Flow**: A complete password recovery process that sends a secure, one-time reset link to the user's email.
*   **Multi-Layered Bot Protection**: A sophisticated, multi-step CAPTCHA system on the verification page to filter out bots, featuring Google reCAPTCHA with a custom math and text puzzle as a fallback.
*   **User Management**: Admins can view all users, manage their roles (Admin, Moderator), grant premium access, and view session analytics (IP, browser, device).
*   **Content Moderation**: Admins can approve/disapprove blog posts and delete any user-created content (short links, posts, comments).
*   **[Developer API](https://qlynk.vercel.app/api-access)**: A secure API for integrating URL shortening into external applications.
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
*   **Email**: [Nodemailer](https://nodemailer.com/) for sending transactional emails.

</details>

<details>
<summary><strong>Third-Party Services</strong></summary>

*   **Payments**: [Razorpay](https://razorpay.com/), [Cashfree](https://www.cashfree.com/)
*   **Advertisements**: [Google AdSense](https://www.google.com/adsense/)
*   **Authentication**: [Google Identity Services](https://developers.google.com/identity)
*   **Bot Protection**: [Google reCAPTCHA v2](https://www.google.com/recaptcha/about/)
*   **Live Chat**: [JivoChat](https://www.jivochat.com/)
*   **Email SMTP**: [Brevo (formerly Sendinblue)](https://www.brevo.com/)

</details>

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [Vercel Account](https://vercel.com/signup) for deployment
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register) for the database
- [Razorpay Account](https://razorpay.com/) for payment processing
- [Brevo Account](https://www.brevo.com/) for SMTP email service
- [Google Cloud Account](https://cloud.google.com/) for reCAPTCHA and Google Sign-In credentials

### Environment Variables

Create a `.env` file in the root of your project and add the following variables. These are crucial for the application to function.

```
# MongoDB Connection
MONGODB_URI="your_mongodb_atlas_connection_string"
MONGODB_DB_NAME="your_database_name"

# Razorpay API Keys (for payment processing)
VITE_RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

# Brevo SMTP Configuration (for password reset emails)
BREVO_HOST="smtp-relay.brevo.com"
BREVO_PORT="587"
BREVO_USER="your_brevo_login_email"
BREVO_PASS="your_brevo_master_password"
BREVO_SENDER="Your App Name<no-reply@yourdomain.com>"

# Google Services
# Get these from the Google Cloud Console (APIs & Services -> Credentials)
VITE_GOOGLE_CLIENT_ID="your_google_oauth_client_id" # For Google Sign-In on frontend
GOOGLE_CLIENT_ID="your_google_oauth_client_id" # Same value as above, for backend validation
VITE_RECAPTCHA_SITE_KEY="your_recaptcha_v2_site_key" # For reCAPTCHA on frontend
RECAPTCHA_SECRET_KEY="your_recaptcha_v2_secret_key" # For backend validation
```

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Deep-Dey/quick-link-url-shortener.git
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

---
<div align="center"> 
  
 [![Deep's GitHub stats](https://github-readme-stats.vercel.app/api?username=deepdeyiitgn&show_icons=true)](https://github.com/deepdeyiitgn/deepdey-discord_bot/)
</div>

---
<div align="center"> 
  
  [![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=deepdeyiitgn&layout=pie)](https://github.com/deepdeyiitgn)
</div>

---
<div align="center"> 
  
  [![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=deepdeyiitgn&stats_format=bytes)](https://deepdeyiitk.com/)
</div>

---
<div align="center"> 
  
<p align="center">
 
  <img src="https://komarev.com/ghpvc/?username=deepdeyiitgn" alt="deepdeyiitgn's profile views" />
</p>
</div>


<p align="center">
  <em>Made with ❤️, AI power, and relentless focus by <b>Deep Dey</b></em>
</p>



<div align="center"> 
  
  [![](https://raw.githubusercontent.com/deepdeyiitgn/deepdeyiitgn/9168ffe0ea26017a66cb396f5329afcc4a77c586/snake.svg)](https://www.youtube.com/channel/UCrh1Mx5CTTbbkgW5O6iS2Tw/)
</div>


---

---

---

<p>22/10/2025 || 13:05:65pm</p>
<h1>24/10/2025 || 13:35:65pm</h1>

---

![An_HtWVS-iXRkVhAQwnzxTTlDxJf6fSRgyT7UNkYJZOxnoK5QND_ZeS9-gMG7kbR0aNbqBroVU_F-6XgQ05pDql_LVCPtWZyEejC6F_xUzPlncVI](https://github.com/user-attachments/assets/f60cb949-c051-4a36-83c1-b8bc70e6e156)
![Top URL Shortener, QR Generator   Scanner API _ Free Blog for JEE 2027 Prep by Deep Dey - QuickLink_page-0001 (3)](https://github.com/user-attachments/assets/8643992f-deb6-40a3-ab92-2f7a2d302332)
![Top URL Shortener, QR Generator   Scanner API _ Free Blog for JEE 2027 Prep by Deep Dey - QuickLink_page-0001 (2)](https://github.com/user-attachments/assets/c9a98a1c-8a5a-4ecb-9304-1be20cdede26)
![Top URL Shortener, QR Generator   Scanner API _ Free Blog for JEE 2027 Prep by Deep Dey - QuickLink_page-0001 (1)](https://github.com/user-attachments/assets/5dfdb3ed-cc10-412a-844f-6c32c86b9eca)
![Top URL Shortener, QR Generator   Scanner API _ Free Blog for JEE 2027 Prep by Deep Dey - QuickLink_page-0001](https://github.com/user-attachments/assets/cad4f259-2742-4fd5-9cfa-54261185038c)
<img width="258" height="262" alt="Pi7_cropper (1)" src="https://github.com/user-attachments/assets/797549ae-ed49-404a-b6fa-6bed8e69f12c" />
![AAAABSk1SolJAORWwO-Vb1FBZnY1ySrpEXzo1Aio6lWXwtolsQ8GklIWSCdxziGZYV1Z0OrcRvgUrwv5BIKQ9kiS8pzDtzgBbS12HIU- (1)](https://github.com/user-attachments/assets/3f3ca3b7-3646-40fa-b3d5-23c977d0cb03)
![AAAABRMOUiK7Xick1Xt4599-WzV4z6XRv2pk6ikoyKq90VA5npKCVaZfa2zeyHLQ9ZH7_7p-h1fMYve8Lj2nauBfnxu0cENzFIAxcv3o](https://github.com/user-attachments/assets/7d26939b-d0ba-44d7-8593-ad1639a6cf70)
![AAAABSUzKnX_BeqckNqKhudc0Pq8CjBUu04s1PZEgE28jdafAD-71k5T2V1YDjZFoOqs1vZtK0aeoccdPDu6DIWtGFUDF6D8ZITJplJf](https://github.com/user-attachments/assets/12343866-95b2-4317-a2a4-e307eb341f4f)
![AAAABT14_uucHpazOdJBoZNEYOctGmwMJtnXvVHWlNvrwkbih_MKYFd28TliPHEVoh4tKJvKpMPw6yRmax1TGrKF7oQP_Yqe9ynzo6ca](https://github.com/user-attachments/assets/d190b389-1a5e-42cf-9097-26898415b2e1)
![blue-maximalist-winter-wonderland-background-design-template-56b30f8eef163e2075a3407fca8bf413_screen](https://github.com/user-attachments/assets/3c7788e7-c733-448c-a348-d50dba999b54)
![winter_wonderland_illustration-wallpaper-3840x2160](https://github.com/user-attachments/assets/3245ef79-63f1-484c-98db-b98137c50873)
![240_F_232218361_z40uofkN5zfL0SJ0GlnRaxRrp1GqCBR2](https://github.com/user-attachments/assets/875ea33c-8018-4994-b141-6c406478c197)
