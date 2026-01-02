import toast from 'react-hot-toast';
import ProductListCard from '../../components/ProductListCard/ProductListCard';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ProductsListing() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const limit = 8;
  const [type, setType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setCategoryId(categoryFromUrl);
      setPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${import.meta.env.VITE_API_URL}api/v1/products/list?page=${page}&limit=${limit}&type=${type}&category=${categoryId}&priceRange=${priceRange}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setProducts(data.data);
        setTotalPages(data.totalPages || 1);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        setError(error.message || 'Internal server error');
        toast.error(error.message || 'Internal server error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, type, categoryId, priceRange]);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${import.meta.env.VITE_API_URL}api/v1/category/list`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setCategories(data.data);
        console.log('CATEGORY', data);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast.error(error.message || 'Internal server error');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Type Filter */}
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Types</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Price Range Filter */}
          <select
            value={priceRange}
            onChange={(e) => {
              setPriceRange(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Prices</option>
            <option value="0-1000">₹0 - ₹1000</option>
            <option value="1000-5000">₹1000 - ₹5000</option>
            <option value="5000-10000">₹5000 - ₹10000</option>
            <option value="10000+">₹10000+</option>
          </select>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-indigo-600">Loading products...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center text-red-500 py-4">
            <p>{error}</p>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductListCard
                key={p.id}
                id={p.id}
                name={p.name}
                brand={p.brand}
                price={p.price}
                imageUrl={p.images[0]}
              />
            ))}
          </div>
        )}

        {/* No products found */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No products found for the selected filters.
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && products.length > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
