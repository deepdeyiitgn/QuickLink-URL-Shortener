import React from "react";
import { LinkIcon, QrCodeScannerIcon } from "./icons/IconComponents";

const AboutPage: React.FC = () => {
  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in space-y-12">
      {/* --- Header --- */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white animate-aurora">
          About QuickLink
        </h2>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          Your all-in-one solution for smart, shareable links and QR codes,
          built for the modern web.
        </p>
      </div>

      {/* --- Mission --- */}
      <section className="space-y-8 text-gray-300 max-w-4xl mx-auto">
        <div>
          <h3 className="text-2xl font-semibold text-brand-primary mb-3">
            Our Mission
          </h3>
          <p className="text-lg leading-relaxed">
            In a digital world overflowing with information, clarity and
            simplicity are paramount. Long, cumbersome URLs are not only
            difficult to remember and share, but they also dilute brand identity
            and create friction for users. QuickLink was born from a simple yet
            powerful idea: to make sharing information as seamless, secure, and
            efficient as possible. We provide a fast, reliable, and feature-rich
            platform to shorten URLs and generate dynamic QR codes for everyone
            — from individuals sharing content with friends, to businesses
            engaging with customers on a global scale.
          </p>
        </div>

        {/* --- Features --- */}
        <div>
          <h3 className="text-2xl font-semibold text-brand-primary mb-4">
            What We Offer
          </h3>
          <div className="space-y-6">
            {/* URL Shortening */}
            <div className="flex items-start gap-4">
              <LinkIcon className="h-10 w-10 text-brand-secondary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white text-xl">
                  Powerful URL Shortening
                </h4>
                <p>
                  Instantly convert any long link into a short, manageable one.
                  But we don't stop there. Our service includes:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-400 space-y-1">
                  <li>
                    <strong>Custom Aliases:</strong> Create branded, memorable
                    links that stand out and increase trust.
                  </li>
                  <li>
                    <strong>Link Expiration:</strong> Free users get 24-hour
                    links, registered users get 7-day links, and subscribers can
                    create links that last for months or a full year.
                  </li>
                  <li>
                    <strong>Secure Redirects:</strong> All links pass through
                    our branded interstitial page for added safety.
                  </li>
                </ul>
              </div>
            </div>

            {/* QR Code Suite */}
            <div className="flex items-start gap-4">
              <QrCodeScannerIcon className="h-10 w-10 text-brand-secondary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white text-xl">
                  Comprehensive QR Code Suite
                </h4>
                <p>
                  Go beyond simple links. Bridge the physical and digital worlds
                  with our versatile QR code tools:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-400 space-y-1">
                  <li>
                    <strong>Multiple Data Types:</strong> Generate codes for
                    Websites, Wi-Fi, vCard, SMS/Phone, events, locations, and
                    payments (UPI, Bitcoin, etc.).
                  </li>
                  <li>
                    <strong>Deep Customization:</strong> Change colors, add
                    logos, and make QR codes match your brand.
                  </li>
                  <li>
                    <strong>Integrated Scanner:</strong> Built-in reader for all
                    QR codes via camera or uploaded images.
                  </li>
                </ul>
              </div>
            </div>

            {/* Dashboard & API */}
            <div className="flex items-start gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-brand-secondary flex-shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <h4 className="font-bold text-white text-xl">
                  User-Friendly Dashboards & API
                </h4>
                <p>Take control of your digital assets with our tools:</p>
                <ul className="list-disc list-inside mt-2 text-gray-400 space-y-1">
                  <li>
                    <strong>Personal Dashboard:</strong> Sign up to manage links,
                    view history, and track subscriptions.
                  </li>
                  <li>
                    <strong>Developer API:</strong> Integrate QuickLink’s
                    shortening power directly into your apps.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* --- Target Users --- */}
        <div>
          <h3 className="text-2xl font-semibold text-brand-primary mb-3">
            Who Is QuickLink For?
          </h3>
          <p className="mb-4">
            Our platform is designed to be versatile for a wide range of users:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>
              <strong>Marketers:</strong> Create clean, branded links and track
              performance.
            </li>
            <li>
              <strong>Content Creators:</strong> Simplify links in bios and
              videos.
            </li>
            <li>
              <strong>Businesses:</strong> Share Wi-Fi, menus, or contact details
              with QR codes.
            </li>
            <li>
              <strong>Developers:</strong> Automate link creation via our API.
            </li>
            <li>
              <strong>Everyday Users:</strong> Shorten long links for easy
              sharing.
            </li>
          </ul>
        </div>

        {/* --- Commitment --- */}
        <div>
          <h3 className="text-2xl font-semibold text-brand-primary mb-3">
            Our Commitment
          </h3>
          <p>
            We are committed to providing a secure, fast, and intuitive service.
            Our core features will always remain free. Built with privacy and
            innovation at heart, QuickLink ensures your data is handled
            responsibly while continuously improving for the future.
          </p>
        </div>
      </section>

      {/* --- Author --- */}
      <div className="border-t border-gray-700 pt-10">
        <h3 className="text-2xl font-semibold text-brand-primary mb-3">
          About the Author
        </h3>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src="https://i.postimg.cc/Ss0GyCZ5/Ufffffffffntitled-design.png"
            alt="Deep Dey - Founder of QuickLink"
            className="w-40 h-40 rounded-full object-cover border-2 border-brand-secondary shadow-md"
          />
          <div className="text-gray-300 text-lg leading-relaxed">
            <p className="mb-3">
              <strong>Deep Dey</strong> — the creator and visionary mind behind{" "}
              <strong>QuickLink</strong>. A student and JEE aspirant driven by
              curiosity, precision, and the belief that small ideas can grow
              into impactful tools. QuickLink wasn’t built from a business plan
              — it was born from frustration.
            </p>
            <p className="mb-3">
              Starting as a small experiment in web development, QuickLink
              evolved into a full-fledged platform. Every feature — from secure
              redirects to QR customization — reflects a single question he kept
              asking: <em>“How can sharing information feel effortless and smart
              at the same time?”</em>
            </p>
            <p>
              When he’s not writing code or improving QuickLink, Deep spends
              time learning AI, building projects, and motivating others chasing
              their own IIT or tech dreams. QuickLink is proof that persistence
              can turn an idea into something real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

