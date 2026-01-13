import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import axios from 'axios';

const PaymentSuccess: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const API_BASE = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId && token) {
      // ✅ Call your backend completePayment API
      axios.post(`${API_BASE}api/v1/payment/complete/${sessionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => {
          setPaymentDetails(response.data);
          toast.success('Payment completed successfully! 🎉');
          setLoading(false);
        })
        .catch((error) => {
          console.error('Payment verification failed:', error);
          toast.error('Payment verification failed. Please contact support.');
          setLoading(false);
        });
    } else {
      toast.error('Invalid payment session');
      setLoading(false);
      navigate('/cart');
    }
  }, [searchParams, token, navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Finalizing your order...</h2>
            <p className="text-gray-600">Verifying payment with our secure gateway</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>
          </div>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold">#{paymentDetails.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{new Date(paymentDetails.createdat).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {paymentDetails.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span>₹{Number(paymentDetails.totalAmount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Purchased */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Items Purchased</h2>
                <div className="space-y-3">
                  {paymentDetails.purchasedItems.map((item: any) => (
                    <div key={item.productId} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-500">{item.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center space-y-4 max-w-md mx-auto">
            <button
              onClick={() => navigate('/products')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
            >
              Continue Shopping →
            </button>
            <button
              onClick={() => navigate('/profile/orders')}
              className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-900 font-bold py-4 px-8 rounded-2xl text-lg hover:bg-gray-50 transition-all duration-200"
            >
              View Order Details
            </button>
          </div>

          {/* Footer Message */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact us at <a href="mailto:support@yourstore.com" className="text-indigo-600 hover:underline font-medium">support@yourstore.com</a>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentSuccess;
