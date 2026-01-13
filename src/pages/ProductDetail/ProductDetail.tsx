import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

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

interface CartItem {
  id: string;
  productId: number;
  quantity: number;
  product: Partial<Product>;
}

interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCart, setUserCart] = useState<Cart | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantityInput, setQuantityInput] = useState(1);

  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const quantityRef = useRef<HTMLInputElement>(null);

  // Fetch user cart
  const fetchUserCart = useCallback(async (): Promise<Cart | null> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}api/v1/cart`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.statusCode === 401) {
        localStorage.removeItem('token');
        logout();
        toast.error('Session expired. Please login again.');
        navigate('/login', { replace: true });
        return null;
      }

      if (res.ok) {
        const data = await res.json();
        setUserCart(data);
        return data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching cart:', err);
      return null;
    }
  }, [token, logout, navigate]);

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
        console.log('DATA', data);
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

  // 🎯 SET QUANTITY IN CART (Replaces existing quantity)
  const handleSetQuantityInCart = useCallback(
    async (qty: number) => {
      if (!product?.id || !token || qty < 1) {
        toast.error('Invalid quantity');
        return;
      }

      setCartLoading(true);
      setCartSuccess(false);
      setError(null);

      try {
        // API CALL: SETS quantity to EXACT value (replaces existing)
        const setRes = await fetch(
          `${import.meta.env.VITE_API_URL}api/v1/cart`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: parseInt(product.id),
              quantity: qty, // ← Backend SETS to this EXACT quantity
            }),
          },
        );

        if (setRes.status === 401 || setRes.statusCode === 401) {
          localStorage.removeItem('token');
          logout();
          toast.error('Session expired. Please login again.');
          navigate('/login', { replace: true });
          return;
        }

        if (!setRes.ok) {
          const errorData = await setRes.json();
          throw new Error(errorData.message || `API error: ${setRes.status}`);
        }

        // Refetch updated cart
        await fetchUserCart();
        console.log('✅ Cart SET to quantity:', qty);

        toast.success(`Updated to ${qty} item${qty > 1 ? 's' : ''}!`);
        setCartSuccess(true);
        setTimeout(() => setCartSuccess(false), 2000);

        // Reset input
        setQuantityInput(1);
        quantityRef.current?.focus();
      } catch (err: any) {
        console.error('Set cart quantity error:', err);
        setError(err.message || 'Failed to update cart');
        toast.error(err.message || 'Failed to update cart');
      } finally {
        setCartLoading(false);
      }
    },
    [product?.id, token, fetchUserCart, logout, navigate],
  );

  // Get current quantity from cart
  const getCartQuantity = useCallback(() => {
    if (!userCart?.items || !product?.id) return 0;
    const cartItem = userCart.items.find(
      (item: CartItem) => item.productId === parseInt(product.id),
    );
    return cartItem?.quantity || 0;
  }, [userCart?.items, product?.id]);

  // Quick actions
  const handleQuickAdd = () => handleSetQuantityInCart(1);
  const handleAddFromInput = () => {
    const qty = parseInt(quantityInput.toString()) || 1;
    handleSetQuantityInCart(qty);
  };

  // Fetch cart on mount
  useEffect(() => {
    fetchUserCart();
  }, [fetchUserCart]);

  // Image handlers
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

  const handleWishlist = () => {
    console.log('Wishlist:', product?.id);
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

  const currentQuantity = getCartQuantity();

  return (
    <DashboardLayout>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Main layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,1fr] lg:items-start">
            {/* LEFT: Images */}
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
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-all"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-all"
                      aria-label="Next image"
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
                      className={`h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        currentImageIndex === idx
                          ? 'border-gray-900 ring-2 ring-gray-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-label={`View image ${idx + 1}`}
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

            {/* RIGHT: Product Details */}
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
                <p className="text-2xl font-bold text-gray-900">
                  ₹{product.price}
                </p>
                <p className="text-xs text-gray-500">
                  Prices include all taxes. Free shipping on orders above ₹999.
                </p>
              </div>

              {/* 🎯 QUANTITY SELECTOR + SET BUTTON */}
              <div className="space-y-4">
                {/* Current quantity badge */}
                {currentQuantity > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>In cart:</span>
                    <span className="font-bold">{currentQuantity}</span>
                  </div>
                )}

                {/* Quantity input controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantityInput((prev) => Math.max(1, prev - 1))
                      }
                      className="h-9 w-9 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center transition-all disabled:opacity-50"
                      disabled={cartLoading}
                    >
                      −
                    </button>

                    <input
                      ref={quantityRef}
                      type="number"
                      min="1"
                      value={quantityInput}
                      onChange={(e) =>
                        setQuantityInput(
                          Math.max(1, parseInt(e.target.value) || 1),
                        )
                      }
                      className="w-20 border-0 p-0 text-center text-xl font-bold text-gray-900 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      disabled={cartLoading}
                    />

                    <button
                      type="button"
                      onClick={() => setQuantityInput((prev) => prev + 1)}
                      className="h-9 w-9 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center transition-all disabled:opacity-50"
                      disabled={cartLoading}
                    >
                      +
                    </button>
                  </div>

                  {/* 🎯 MAIN SET BUTTON */}
                  <button
                    onClick={handleAddFromInput}
                    disabled={cartLoading}
                    className={`flex-1 rounded-xl px-6 py-4 text-sm font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${
                      cartLoading
                        ? 'cursor-not-allowed bg-gray-400 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl active:scale-[0.98]'
                    } h-14`}
                  >
                    {cartLoading ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Updating...
                      </>
                    ) : currentQuantity > 0 ? (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        ADD {quantityInput} QUANTITY
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.6 9.8A2 2 0 006.8 22h10.4a2 2 0 001.6-2.2L19 13m0 0l-1.6-9.8"
                          />
                        </svg>
                        Add to cart
                      </>
                    )}
                  </button>
                </div>

                {/* Quick add single item */}
                {!currentQuantity && (
                  <button
                    onClick={handleQuickAdd}
                    disabled={cartLoading}
                    className="w-full rounded-lg bg-gray-900 hover:bg-black text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    Quick Add 1 Item
                  </button>
                )}
              </div>

              {/* Success/Error Messages */}
              {cartSuccess && (
                <div className="rounded-xl bg-green-50 px-4 py-4 border border-green-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-green-800">
                      Updated successfully! Check your{' '}
                      <Link
                        to="/cart"
                        className="font-semibold underline hover:no-underline"
                      >
                        cart
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              )}

              {error && !cartLoading && (
                <div className="rounded-xl bg-red-50 px-4 py-4 border border-red-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Product details */}
              <div className="border-t border-gray-200 pt-6 text-sm text-gray-700">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Product details
                </p>
                <ul className="space-y-2">
                  <li>
                    Category:{' '}
                    <span className="font-medium">
                      {product.category?.name || 'No category'}
                    </span>
                  </li>
                  <li>
                    Product Owner:{' '}
                    <span className="font-medium">
                      {product.owner?.fullName || 'Unknown'}
                    </span>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          {/* SIMILAR PRODUCTS */}
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
              <p className="text-sm text-gray-500">
                Loading similar products...
              </p>
            )}
            {similarProducts.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {similarProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="group flex w-32 flex-shrink-0 flex-col hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-50 group-hover:ring-2 group-hover:ring-blue-200">
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
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{p.price}
                      </p>
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
