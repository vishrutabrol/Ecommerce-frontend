import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import PromotionalCard from '../../components/PromotionalCard/PromotionalCard';

const Home: React.FC = () => {
  // const { name, isLoggedIn } = useAuth();
  interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    [key: string]: any;
  }
  const [products, setproducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}api/v1/products/list?page=1&limit=10`,
        );

        const data = await response.json();
        setproducts(data.data);
        
        // setTotal(data.total);
        console.log('DATA', data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <DashboardLayout>
      <div className="bg-zinc-200 min-h-screen py-8 w-full">
        <div className="m-4"></div>
          <div className='m-4'>
              {products.length > 0 && (
          <PromotionalCard
           imageUrl={`${import.meta.env.VITE_API_URL}${products[8].images[0]}`}
           />
              )}
          </div>
        {/* </div> */}
          <ImageGallery></ImageGallery>
      </div>
    </DashboardLayout>
  );
};

export default Home;
