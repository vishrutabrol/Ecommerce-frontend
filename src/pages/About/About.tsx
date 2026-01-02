import DashboardLayout from '../../layouts/DashboardLayout';
import React from 'react';

const AboutUs = () => {
  return (
    <DashboardLayout>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero section */}
        <section className="mb-10 space-y-4">
          <p className="text-xs font-semibold tracking-[0.25em] text-gray-400">
            ABOUT US
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Everyday clothing, thoughtfully made.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            This store was created with a simple idea: clothes should feel good, look effortless,
            and last beyond one season. From daily basics to statement pieces, every item is
            curated to fit real people with real lives.
          </p>
        </section>

        {/* Story + image */}
        <section className="mb-12 grid gap-8 md:grid-cols-2 md:items-start">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Our story
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              We started as a small team of friends who were tired of choosing between comfort
              and style. Fast fashion moved too quickly, and timeless pieces were hard to find.
              So we began building a collection of essentials that feel easy to wear and easy
              to style every day.
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              Today, we partner with trusted manufacturers and fabric suppliers to bring you
              pieces that are soft, well‑fitting, and made to be worn on repeat—whether you are
              heading to work, stepping out with friends, or staying in.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <div className="h-64 w-full bg-[url('https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg')] bg-cover bg-center md:h-72" />
          </div>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            What we care about
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                Comfort first
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                Soft fabrics, clean silhouettes, and relaxed fits you can move in all day, not
                just for a photo.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                Thoughtful design
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                Versatile pieces that pair easily together, so building outfits feels simple,
                not overwhelming.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                Honest pricing
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                Quality you can feel, at prices that stay fair—no constant markups or complicated
                discounts.
              </p>
            </div>
          </div>
        </section>

        {/* CTA / closing */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Built for your everyday wardrobe.
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Browse our latest drops and find pieces you will keep reaching for season after season.
              </p>
            </div>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-black"
            >
              Shop collection
            </a>
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
};

export default AboutUs;
