// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-black text-[13px] text-gray-400">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-10 px-6 py-12 md:px-12 lg:px-16">
        {/* Brand + tagline */}
        <div className="flex max-w-sm flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-semibold tracking-[0.16em] text-black">
              CO
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-wide text-white">
                CORE OUTFIT
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                Everyday clothing
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-400">
            Essentials, layers, and statement pieces curated for daily wear. Designed to feel easy,
            look sharp, and stay in your wardrobe beyond one season.
          </p>
        </div>

        {/* Link columns */}
        <div className="flex flex-1 flex-wrap gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-200">
              Shop
            </p>
            <ul className="mt-3 space-y-2">
              <li><a href="/products" className="hover:text-gray-100">All products</a></li>
              <li><a href="/products?type=men" className="hover:text-gray-100">Men</a></li>
              <li><a href="/products?type=women" className="hover:text-gray-100">Women</a></li>
              <li><a href="/products?type=accessories" className="hover:text-gray-100">Accessories</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-200">
              Company
            </p>
            <ul className="mt-3 space-y-2">
              <li><a href="/about" className="hover:text-gray-100">About us</a></li>
              <li><a href="/contact" className="hover:text-gray-100">Contact</a></li>
              <li><a href="/#stories" className="hover:text-gray-100">Our story</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-200">
              Help
            </p>
            <ul className="mt-3 space-y-2">
              <li><a href="/help/shipping" className="hover:text-gray-100">Shipping</a></li>
              <li><a href="/help/returns" className="hover:text-gray-100">Returns & exchanges</a></li>
              <li><a href="/help/faq" className="hover:text-gray-100">FAQ</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-200">
              Legal
            </p>
            <ul className="mt-3 space-y-2">
              <li><a href="/legal/privacy" className="hover:text-gray-100">Privacy policy</a></li>
              <li><a href="/legal/terms" className="hover:text-gray-100">Terms of use</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter + socials */}
        <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-200">
            Stay in the loop
          </p>
          <p className="text-xs text-gray-400">
            Sign up for drops, back‑in‑stock alerts, and styling notes. No spam, just good fits.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center rounded-full border border-gray-600 bg-black/40 px-3 py-1.5"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-transparent text-xs text-gray-100 placeholder-gray-500 outline-none"
            />
            <button
              type="submit"
              className="ml-2 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-black hover:bg-white"
            >
              Join
            </button>
          </form>

          <div className="mt-2 flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-gray-100 text-sm">Instagram</a>
            <a href="#" className="hover:text-gray-100 text-sm">Facebook</a>
            <a href="#" className="hover:text-gray-100 text-sm">Pinterest</a>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 text-[11px] text-gray-500 md:flex-row md:px-12 lg:px-16">
          <p>© {new Date().getFullYear()} Core Outfit. All rights reserved.</p>
          <p className="text-xs">
            Crafted for everyday wear from Himachal Pradesh, India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
