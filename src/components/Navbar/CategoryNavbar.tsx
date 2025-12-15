import React from 'react';

interface CategoryNavbarProps {
  onCategorySelect: (category: string) => void;
}

const categories = ['home', 'men', 'women', 'kids'];

export default function CategoryNavbar({
  onCategorySelect,
}: CategoryNavbarProps) {
  return (
    <nav className="w-full bg-white shadow-sm">
      <ul className="flex items-center justify-center gap-8 py-4">
        {categories.map((item) => (
          <li
            key={item}
            onClick={() => onCategorySelect(item.toLowerCase())}
            className="
              cursor-pointer 
              text-gray-700 
              font-medium 
              transition-all 
              hover:text-blue-600 
              hover:scale-105
            "
          >
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
}
