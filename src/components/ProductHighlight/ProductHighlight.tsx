import React from 'react';

interface HighlightBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryImage: string;
  secondaryImage: string;
  align?: 'left' | 'right';
}

const HighlightBanner: React.FC<HighlightBannerProps> = ({
  title,
  subtitle,
  description,
  primaryImage,
  secondaryImage,
  align = 'left',
}) => {
  const textBlock = (
    <div className="flex-1">
      <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm font-medium uppercase tracking-wide text-amber-600">
          {subtitle}
        </p>
      )}
      {description && (
        <p className="mt-4 text-sm text-gray-700 md:text-base">
          {description}
        </p>
      )}
    </div>
  );

  const imageBlock = (
    <div className="flex flex-1 flex-col gap-3 md:flex-row">
      <div className="flex-1 overflow-hidden rounded-lg">
        <img
          src={primaryImage}
          alt="Primary highlight"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 overflow-hidden rounded-lg">
        <img
          src={secondaryImage}
          alt="Secondary highlight"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );

  return (
    <section className="w-full bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center">
        {align === 'left' ? (
          <>
            {textBlock}
            {imageBlock}
          </>
        ) : (
          <>
            {imageBlock}
            {textBlock}
          </>
        )}
      </div>
    </section>
  );
};

export default HighlightBanner;
