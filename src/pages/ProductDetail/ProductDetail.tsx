import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  categoryid?: string;
  type?: string;
  ownerid?: string;
  createdat?: string;
  updatedat?: string;
  category: any;
  owner: any;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const url = `${import.meta.env.VITE_API_URL}api/v1/products/${id}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        console.log("DATA", data);
        setProduct(data);
        setCurrentImageIndex(0);
      } catch (err: any) {
        setError(err.message || 'Internal server error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch similar products
  useEffect(() => {
    const fetchSimilar = async () => {
      if (!product?.categoryid) return;
      try {
        setSimilarLoading(true);
        const url = `${import.meta.env.VITE_API_URL}api/v1/products/list?category=${product.categoryid}&limit=10`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        const list: Product[] = data.data || data;
        setSimilarProducts(list.filter((p) => p.id !== product.id));
      } catch (err) {
        console.error('Error fetching similar products:', err);
      } finally {
        setSimilarLoading(false);
      }
    };
    fetchSimilar();
  }, [product?.categoryid, product?.id]);

  const handlePrev = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', product?.id);
    // your cart logic
  };

  const handleWishlist = () => {
    console.log('Wishlist:', product?.id);
    // your wishlist logic
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-sm text-gray-500">Loading product...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-sm text-red-500">{error || 'Product not found'}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Main layout: images LEFT, details RIGHT */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,1fr] lg:items-start">
            {/* LEFT: images */}
            <section className="space-y-4">
              {/* Main image */}
              <div className="relative overflow-hidden rounded-2xl bg-gray-50">
                <img
                  src={`${import.meta.env.VITE_API_URL}${product.images[currentImageIndex]}`}
                  alt={product.name}
                  className="h-[500px] w-full object-cover lg:h-[550px] xl:h-[600px]"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white"
                    >
                      ‹
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 ${
                        currentImageIndex === idx
                          ? 'border-gray-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}${img}`}
                        alt={`${product.name} ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* RIGHT: details */}
            <section className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  {product.brand}
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500">{product.type}</p>
              </div>

              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>
                <p className="text-xs text-gray-500">
                  Prices include all taxes. Free shipping on orders above ₹999.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  className="min-w-[140px] flex-1 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-black"
                >
                  Add to cart
                </button>
                <button
                  onClick={handleWishlist}
                  className="min-w-[140px] flex-1 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-900 hover:border-gray-500"
                >
                  Wishlist
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6 text-sm text-gray-700">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Product details
                </p>
                <ul className="space-y-2">
                  <li>
                    Category:{' '}
                    <span className="font-medium">{product.category?.name || "No category"}</span>
                  </li>
                  <li>
                    Product Owner:{' '}
                    <span className="font-medium">{product.owner?.fullName || "Unknown"}</span>
                  </li>
                  {/* <li>
                    Created:{' '}
                    <span className="font-medium">
                      {new Date(product.createdat).toLocaleDateString()}
                    </span>
                  </li>
                  <li>
                    Updated:{' '}
                    <span className="font-medium">
                      {new Date(product.updatedat).toLocaleDateString()}
                    </span>
                  </li> */}
                </ul>
              </div>
            </section>
          </div>

          {/* SIMILAR PRODUCTS SCROLLER */}
          <section className="mt-16 border-t border-gray-200 pt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                You might also like
              </h2>
              <span className="text-xs uppercase tracking-[0.18em] text-gray-400">
                Same category
              </span>
            </div>

            {similarLoading && (
              <p className="text-sm text-gray-500">Loading similar products...</p>
            )}

            {similarProducts.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {similarProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="group flex w-32 flex-shrink-0 flex-col hover:shadow-lg"
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-50">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${p.images?.[0]}`}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                        {p.brand}
                      </p>
                      <p className="line-clamp-2 text-xs font-medium text-gray-900">
                        {p.name}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">₹{p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
