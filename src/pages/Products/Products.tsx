import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import CategoryNavbar from '../../components/Navbar/CategoryNavbar';
import CategoryMarquee from '../../components/CategoryCards/categoryCardSlider';
import HighlightBanner from '../../components/ProductHighlight/ProductHighlight';
import ProductImageGallery from '../../components/ProductImageGallery/ProductImageGallery';

export default function Products() {
  const [error, setError] = React.useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}api/v1/products/list?page=1&limit=5${
          selectedCategory ? `&type=${selectedCategory}` : 'men'
        }`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        console.log('PRODUCTS ARE:', data);
        setProducts(data.data);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'API fetch error occurred');
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  return (
    <DashboardLayout>
      <CategoryNavbar onCategorySelect={handleCategorySelect} />
      <div className="p-4">
        {/* <h1 className="text-2xl font-bold">Product Listing</h1> */}
        <p className="text-gray-600 mt-2">LOOK FOR THESE</p>
        {/* <hr /> */}

        <div className='h-[60vh] w-full flex items-center justify-center'>
          <CategoryMarquee type={selectedCategory}/>
        </div>
        {/* <hr /> */}


            <HighlightBanner
      title="Featured Winter Apparels"
      subtitle="Handpicked for you"
      description="Explore premium winter and semi-winter apparels that suits you. High quality, warm and cozzy."
      primaryImage="http://localhost:3000/public/images/winter1.avif"
      secondaryImage="http://localhost:3000/public/images/winter2.avif"
      align="left"
    />

                <HighlightBanner
      title="Featured Summer Apparels"
      subtitle="Handpicked for you"
      description="Explore premium summer apparels apparels for your next vacation. Feel free and easy."
      primaryImage="http://localhost:3000/public/images/winter1.avif"
      secondaryImage="http://localhost:3000/public/images/winter2.avif"
      align="right"
    />

     <ProductImageGallery type={selectedCategory} />

        {/* {error && <p className="text-red-500 mt-4">Error: {error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mt-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                imageUrl={
                  Array.isArray(product.images)
                    ? `${import.meta.env.VITE_API_URL}${product.images[0]}`
                    : `${import.meta.env.VITE_API_URL}${product.images}`
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <h2 className="text-xl font-semibold text-gray-700">
                No products found
              </h2>
              <p className="text-gray-500 mt-2">
                Try selecting another category or check back later.
              </p>
            </div>
          )}
        </div> */}
      </div>
    </DashboardLayout>
  );
}
