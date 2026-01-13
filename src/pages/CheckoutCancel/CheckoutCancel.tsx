import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import toast from 'react-hot-toast';

const CheckoutCancel: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reason = searchParams.get('cancelled') ? 'Payment cancelled' : 'Checkout interrupted';

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancel Icon */}
          <div className="mx-auto w-24 h-24 bg-rose-100 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <svg className="w-12 h-12 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Header */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Checkout Cancelled
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
            No worries! Your cart is still waiting for you with all your items.
          </p>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
            <button
              onClick={() => navigate('/cart')}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-5 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1 group-hover:scale-[1.02]"
            >
              Return to Cart
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={() => {
                toast('Returning to cart...');
                navigate('/cart');
              }}
              className="border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-bold py-5 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Edit Cart & Retry
            </button>
          </div>

          {/* Cart Status */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-md mx-auto">
            <h3 className="font-bold text-gray-900 mb-3">Your Cart Status</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Items preserved
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No charges applied
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ready to checkout anytime
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Changed your mind? You can always{' '}
              <button 
                onClick={() => navigate('/products')}
                className="text-indigo-600 hover:underline font-medium"
              >
                continue shopping
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckoutCancel;
