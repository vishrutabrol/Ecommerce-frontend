import React, { useEffect, useState } from 'react';

interface GalleryImage {
  id: string | number;
  url: string;
  alt?: string;
}

const ProductImageGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}api/v1/products/list`,
        );

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();

        const mapped = Array.isArray(data.data)
          ? data.data.map((item: any) => ({
              id: item.id,
              url: `${import.meta.env.VITE_API_URL}${
                item.images?.[0] || item.url
              }`,
              alt: item.alt || item.name || 'Product image',
            }))
          : [];

        setImages(mapped);
      } catch (err: any) {
        console.error('Error fetching gallery images:', err);
        setError(err.message || 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 flex w-full items-center justify-center">
        <p className="text-sm text-gray-500">Loading images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 flex w-full items-center justify-center">
        <p className="text-sm text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!images.length) {
    return null;
  }

  return (
    <section className="mt-8">
      {/* Title row centered with side breathing space */}
      <div className="mx-auto mb-4 flex max-w-5xl items-center justify-between px-2 sm:px-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Curated Looks For You
        </h3>
        <span className="text-xs uppercase tracking-wide text-gray-400">
          Image inspiration
        </span>
      </div>

      {/* Centered gallery with max 3 images in a row */}
      <div className="mx-auto max-w-5xl px-2 sm:px-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-xs bg-gray-100 shadow-sm"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductImageGallery;
