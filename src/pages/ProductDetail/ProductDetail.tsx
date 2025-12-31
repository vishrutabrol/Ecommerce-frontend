import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // track which image is currently shown
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${import.meta.env.VITE_API_URL}api/v1/products/${id}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Internal server error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handlePrev = () => {
    if (!product?.images) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (!product?.images) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {loading && <p>Loading product...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {product && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side: image carousel */}
            <div className="relative flex flex-col items-center">
              <img
                src={`${import.meta.env.VITE_API_URL}${product.images?.[currentImageIndex]}`}
                alt={product.name}
                className="w-full max-h-[500px] object-contain rounded-lg"
              />

              {/* Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow p-2"
              >
                ◀
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow p-2"
              >
                ▶
              </button>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4">
                {product.images?.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={`${import.meta.env.VITE_API_URL}${img}`}
                    alt={`${product.name} ${idx + 1}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                      currentImageIndex === idx
                        ? 'border-indigo-500'
                        : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right side: product info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
              <p className="text-indigo-600 font-bold text-xl mb-4">₹{product.price}</p>

              <div className="space-y-2 text-sm text-gray-700">
                <p>Type: {product.type || 'N/A'}</p>
                <p>Category ID: {product.categoryid}</p>
                <p>Owner ID: {product.ownerid}</p>
                <p>Created At: {new Date(product.createdat).toLocaleString()}</p>
                <p>Updated At: {new Date(product.updatedat).toLocaleString()}</p>
              </div>

              <div className="mt-6 flex gap-4">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Add to Cart
                </button>
                <button className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition">
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
