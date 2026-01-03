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
    <div className="flex gap-4 border-b border-gray-200 py-4">
      {/* Image */}
      <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            {brand}
          </p>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="mt-1 text-xs text-gray-500">₹{price}</p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          {/* Quantity controls */}
          <div className="inline-flex items-center rounded-full border border-gray-300 bg-white">
            <button
              type="button"
              onClick={handleDecrease}
              className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              −
            </button>
            <span className="px-3 text-sm text-gray-900">{quantity}</span>
            <button
              type="button"
              onClick={handleIncrease}
              className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-gray-500 hover:text-red-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
