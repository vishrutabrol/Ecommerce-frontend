import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: number;
  name: string;
  brand: string;
  price: number | string;
  imageUrl: string;
}

const ProductListCard: React.FC<ProductCardProps> = ({
   id,
  name,
  brand,
  price,
  imageUrl,
}) => {
  const navigate = useNavigate();
  return (
    <div
    onClick={() => navigate(`/product/${id}`)}
      className="
        group cursor-pointer overflow-hidden rounded-xl bg-white
        shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md
      "
    >
      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <img
          src={`${import.meta.env.VITE_API_URL}${imageUrl}`}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Text */}
      <div className="space-y-1 px-2 pb-3 pt-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-gray-500">
          {brand}
        </p>
        <p className="line-clamp-2 text-sm text-gray-900">{name}</p>
        <p className="text-sm font-medium text-gray-900">₹{price}</p>
      </div>
    </div>
  );
};

export default ProductListCard;
