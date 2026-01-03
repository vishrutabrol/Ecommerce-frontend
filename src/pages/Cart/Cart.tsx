import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import CartItemRow from '../../components/Cart/CartItem';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
  //   const { token } = useAuth() as any;
  //   const { logout } = useAuth() as any;
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL;

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}api/v1/cart`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.statusCode === 401 || res.status === 401) {
        localStorage.removeItem('token');
        logout();
        toast.error('Session expired. Please login again.');
        navigate('/login', { replace: true });
        return;
      }
      const data: CartResponse = await res.json();
      setCart(data);
    } catch (err: any) {
      console.error('Error fetching cart:', err);
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId: number, quantity: number) => {
    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE}api/v1/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.statusCode === 401 || res.status === 401) {
        localStorage.removeItem('token');
        logout();
        toast.error('Session expired. Please login again.');
        navigate('/login', { replace: true });
        return;
      }
      const data: CartResponse = await res.json();
      setCart(data);
    } catch (err: any) {
      console.error('Error updating cart:', err);
      setError(err.message || 'Failed to update item');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE}api/v1/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.statusCode === 401 || res.status === 401) {
        localStorage.removeItem('token');
        logout();
        toast.error('Session expired. Please login again.');
        navigate('/login', { replace: true });
        return;
      }
      await fetchCart();
    } catch (err: any) {
      console.error('Error removing item:', err);
      setError(err.message || 'Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE}api/v1/cart`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.statusCode === 401 || res.status === 401) {
        localStorage.removeItem('token');
        logout();
        toast.error('Session expired. Please login again.');
        navigate('/login', { replace: true });
        return;
      }
      setCart(null);
    } catch (err: any) {
      console.error('Error clearing cart:', err);
      setError(err.message || 'Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  const subtotal =
    cart?.items?.reduce(
      (sum, item) => sum + item.quantity * Number(item.priceAtAdd),
      0,
    ) ?? 0;

  return (
    <DashboardLayout>
      <main className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Shopping cart
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review your items and proceed to checkout when you’re ready.
          </p>

          {loading && (
            <div className="mt-8 text-sm text-gray-500">
              Loading your cart...
            </div>
          )}

          {error && !loading && (
            <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !cart && !error && (
            <div className="mt-10 rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
              <p className="text-sm text-gray-600">
                Your cart is empty. Add items from the products page.
              </p>
            </div>
          )}

          {cart && (
            <div className="mt-8 grid gap-8 lg:grid-cols-[2fr,1fr] lg:items-start">
              {/* Left: items */}
              <section>
                <div className="flex items-center justify-between pb-3">
                  <p className="text-sm text-gray-700">
                    {cart.totalQuantity} item
                    {cart.totalQuantity !== 1 ? 's' : ''} in your cart
                  </p>
                  {cart.items.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-xs text-gray-500 hover:text-red-500"
                      disabled={updating}
                    >
                      Clear cart
                    </button>
                  )}
                </div>

                <div className="divide-y divide-gray-200">
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
                    />
                  ))}
                </div>

                {updating && (
                  <p className="mt-2 text-xs text-gray-400">
                    Updating your cart...
                  </p>
                )}
              </section>

              {/* Right: summary */}
              <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h2 className="text-sm font-semibold text-gray-900">
                  Order summary
                </h2>
                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-gray-500">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated tax</span>
                    <span className="text-gray-500">Included</span>
                  </div>
                  <div className="mt-3 border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full rounded-full bg-gray-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-black disabled:opacity-60"
                  disabled={!cart.items.length}
                >
                  Proceed to checkout
                </button>

                <p className="mt-2 text-[11px] text-gray-500">
                  You’ll be able to add address and payment details on the next
                  step.
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Cart;
