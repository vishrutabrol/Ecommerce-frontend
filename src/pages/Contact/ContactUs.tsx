import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const ContactUs = () => {
  return (
    <DashboardLayout>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8 space-y-3">
          <p className="text-xs font-semibold tracking-[0.25em] text-gray-400">
            CONTACT
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            We are here to help.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Questions about sizing, orders, or styling? Send a message and the team will get
            back within 24–48 hours. Your feedback helps improve every collection.
          </p>
        </section>

        {/* Content grid: info + form */}
        <section className="grid gap-10 md:grid-cols-[1.1fr,1.2fr] md:items-start">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                Contact details
              </h2>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <p>Email: <span className="font-medium">support@yourstore.com</span></p>
                <p>Phone: <span className="font-medium">+91-98765-43210</span></p>
                <p>Hours: Mon – Sat, 10:00 AM – 7:00 PM (IST)</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                Store & shipping
              </h3>
              <p className="mt-3 text-sm text-gray-700">
                Based in Himachal Pradesh, India — shipping across the country with trusted
                delivery partners. For exchanges, fits, or material questions, feel free to ask.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                Social
              </h3>
              <div className="mt-3 flex gap-4 text-sm text-gray-700">
                <a href="#" className="hover:text-gray-900">Instagram</a>
                <a href="#" className="hover:text-gray-900">Facebook</a>
                <a href="#" className="hover:text-gray-900">Pinterest</a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold text-gray-900">
              Send us a message
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Share as many details as you can so the team can respond quickly.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Integrate with your API / email service here
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none ring-0 transition focus:border-gray-400 focus:bg-white"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Subject
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  placeholder="Order, sizing, returns…"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-gray-600">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white"
                  placeholder="Tell us how we can help."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gray-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-black"
              >
                Submit message
              </button>

              <p className="pt-1 text-[11px] text-gray-500">
                By submitting, you agree that we may contact you regarding your request.
              </p>
            </form>
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
};

export default ContactUs;
