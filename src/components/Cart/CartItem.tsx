import React from 'react';

interface CartItemRowProps {
  id: number;
  productId: number;
  name: string;
  brand: string;
  imageUrl: string;
  price: number;
  quantity: number;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  updating?: boolean;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  productId,
  name,
  brand,
  imageUrl,
  price,
  quantity,
  onQuantityChange,
  onRemove,
  updating = false,
}) => {
  const handleIncrease = () => {
    onQuantityChange(productId, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(productId, quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(productId);
  };

  return (
    <div className="flex gap-4 border-b border-gray-200 py-4 last:border-b-0 hover:bg-gray-50 p-2 rounded-lg transition-colors">
      {/* Image */}
      <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            {brand}
          </p>
          <p className="text-sm font-medium text-gray-900 line-clamp-2">
            {name}
          </p>
          <p className="mt-1 text-xs font-semibold text-gray-900">
            ₹{price.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {/* Quantity controls */}
          <div className="inline-flex items-center rounded-full border border-gray-300 bg-white shadow-sm">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={updating}
              className="h-10 w-10 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              −
            </button>
            <span className="mx-3 min-w-[2rem] text-center text-sm font-semibold text-gray-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              disabled={updating}
              className="h-10 w-10 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              +
            </button>
          </div>

          {/* Remove & Total */}
          <div className="flex flex-col items-end gap-1">
            <p className="text-sm font-semibold text-gray-900">
              ₹{(price * quantity).toLocaleString('en-IN')}
            </p>
            <button
              type="button"
              onClick={handleRemove}
              disabled={updating}
              className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
