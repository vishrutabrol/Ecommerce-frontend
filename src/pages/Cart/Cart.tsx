import React, { useEffect, useCallback, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import CartItemRow from '../../components/Cart/CartItem';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface CartProduct {
  id: number;
  name: string;
  price: string;
  brand: string;
  images: string[];
}

interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  priceAtAdd: number;
  createdAt: string;
  updatedAt: string;
  product: CartProduct;
}

interface CartResponse {
  id: number;
  userId: number;
  totalQuantity: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const API_BASE = import.meta.env.VITE_API_URL as string;

  // ✅ FIXED: Proper fetchCart with status checks
  const fetchCart = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}api/v1/cart`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ FIXED: Use res.status (not statusCode)
      if (res.status === 401 || res.statusCode === 401 ) {
        localStorage.removeItem('token');
        logout();
        toast.error('Session expired. Please login again.');
        navigate('/login', { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data: CartResponse = await res.json();
      setCart(data);
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      setError(err.message || 'Failed to load cart');
      toast.error(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [token, logout, navigate]);

  // FIXED: Quantity change
  const handleQuantityChange = async (productId: number, quantity: number) => {
    if (!token) return;

    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE}api/v1/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (res.status === 401 || res.statusCode === 401) {
        localStorage.removeItem('token');
        logout();
        navigate('/login', { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: CartResponse = await res.json();
      setCart(data);
      toast.success('Cart updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update cart');
    } finally {
      setUpdating(false);
    }
  };

  // FIXED: Remove item
  const handleRemoveItem = async (productId: number) => {
    if (!token || !confirm('Remove this item?')) return;

    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE}api/v1/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.statusCode === 401) {
        localStorage.removeItem('token');
        logout();
        navigate('/login', { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      await fetchCart();
      toast.success('Item removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  // ✅ FIXED: Checkout - Working Stripe integration
  const handleCheckout = async () => {
    if (!cart?.id || !token) {
      toast.error('Please login to continue');
      return;
    }

    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE}api/v1/payment/checkout/${cart.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.statusCode === 401) {
        localStorage.removeItem('token');
        logout();
        navigate('/login', { replace: true });
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }

      const data = await res.json();

      // ✅ Redirect to Stripe Checkout
      window.location.href = data.stripeSessionUrl;
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Checkout failed. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // FIXED: Clear cart
  const handleClearCart = async () => {
    if (!token || !confirm('Clear entire cart? This cannot be undone.')) return;

    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE}api/v1/cart`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.statusCode === 401) {
        localStorage.removeItem('token');
        logout();
        navigate('/login', { replace: true });
        return;
      }

      if (res.ok) {
        setCart(null);
        toast.success('Cart cleared');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Payment success handling
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && token) {
      fetch(`${API_BASE}api/v1/payment/complete/${sessionId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            toast.success('Payment completed successfully! 🎉');
            fetchCart();
          }
        })
        .catch(() => {
          toast.error('Payment verification failed');
        });
    }
  }, [searchParams, token, fetchCart]);

  // Initial load
  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart]);

  const subtotal =
    cart?.items?.reduce(
      (sum, item) => sum + item.quantity * Number(item.priceAtAdd),
      0,
    ) ?? 0;

  return (
    <DashboardLayout>
      <main className="bg-white min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Shopping Cart
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl">
              Review your items below. When you're ready, proceed to checkout.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <span className="ml-3 text-sm text-gray-500">
                Loading cart...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                    <button
                      onClick={fetchCart}
                      className="mt-2 text-sm text-red-700 hover:text-red-600 font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty Cart */}
          {!loading && !cart?.items?.length && !error && token && (
            <div className="text-center py-24 max-w-md mx-auto">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.6 9.8A2 2 0 006.8 22h10.4a2 2 0 001.6-2.2L19 13m0 0l-1.6-9.8"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="rounded-xl bg-gray-900 hover:bg-black text-white px-8 py-3 font-semibold text-sm transition-all shadow-lg hover:shadow-xl"
              >
                Start Shopping →
              </button>
            </div>
          )}

          {/* Cart Content */}
          {cart?.items?.length > 0 && (
            <>
              <div className="grid gap-x-8 gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
                {/* Items List */}
                <section className="lg:col-span-2 xl:col-span-3">
                  <div className="flex items-center justify-between pb-6 mb-8 border-b-2 border-gray-200">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Your Items ({cart.totalQuantity})
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {cart.items.length} unique item
                        {cart.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {cart.items.length > 1 && (
                      <button
                        onClick={handleClearCart}
                        disabled={updating}
                        className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <CartItemRow
                        key={item.id}
                        id={item.id}
                        productId={item.productId}
                        name={item.product.name}
                        brand={item.product.brand}
                        imageUrl={`${API_BASE}${item.product.images?.[0] ?? ''}`}
                        price={Number(item.priceAtAdd)}
                        quantity={item.quantity}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                        updating={updating}
                      />
                    ))}
                  </div>

                  {updating && (
                    <div className="mt-6 flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                      <span className="text-sm text-gray-500">
                        Updating cart...
                      </span>
                    </div>
                  )}
                </section>

                {/* Order Summary */}
                <section className="lg:sticky lg:top-6 lg:h-screen lg:overflow-y-auto">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Order Summary
                    </h3>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">
                          Subtotal
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{subtotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Shipping</span>
                        <span className="text-gray-500">
                          Calculated at checkout
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Tax</span>
                        <span className="text-gray-500">Included</span>
                      </div>
                    </div>

                    <div className="border-t pt-6 mb-8">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xl font-bold text-gray-900">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{subtotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={!cart.items.length || updating}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {updating ? (
                        <>
                          <div className="inline-flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Processing...
                          </div>
                        </>
                      ) : (
                        'Checkout →'
                      )}
                    </button>

                    <p className="mt-4 text-xs text-gray-500 text-center">
                      Secure checkout. We'll collect shipping and payment
                      details next.
                    </p>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Cart;
