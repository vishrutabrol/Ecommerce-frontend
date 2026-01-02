import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
interface Category {
  id: string;
  name: string;
  images: string[];
}
const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Category[]>([]);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}api/v1/category/list?search=${value}&page=1&count=2`,
        );
        const data = await res.json();
        setResults(data.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    } else {
      setResults([]);
    }
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/product-list?search=${query}`);
    }
  };
  return (
    <nav className="relative border-b border-gray-200 bg-white">
      {' '}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {' '}
        {/* Logo */}{' '}
        <Link to="/" className="flex items-center gap-2">
          {' '}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold tracking-[0.12em] text-white">
            {' '}
            CO{' '}
          </div>{' '}
          <div className="flex flex-col leading-tight">
            {' '}
            <span className="text-sm font-semibold tracking-wide text-gray-900">
              {' '}
              CORE OUTFIT{' '}
            </span>{' '}
            <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
              {' '}
              Everyday clothing{' '}
            </span>{' '}
          </div>{' '}
        </Link>{' '}
        {/* Desktop navigation + search + actions */}{' '}
        <div className="hidden flex-1 items-center justify-end gap-6 sm:flex">
          {' '}
          {/* Links */}{' '}
          <div className="flex items-center gap-6 text-sm text-gray-700">
            {' '}
            <Link to="/" className="hover:text-gray-900">
              {' '}
              Home{' '}
            </Link>{' '}
            <Link to="/products" className="hover:text-gray-900">
              {' '}
              Products{' '}
            </Link>{' '}
            <Link to="/about" className="hover:text-gray-900">
              {' '}
              About{' '}
            </Link>{' '}
            <Link to="/contact" className="hover:text-gray-900">
              {' '}
              Contact{' '}
            </Link>{' '}
          </div>{' '}
          {/* Search */}{' '}
          <div className="relative hidden w-64 items-center rounded-full border border-gray-300 px-3 text-sm text-gray-700 lg:flex">
            {' '}
            <form onSubmit={handleSearch} className="flex w-full items-center">
              {' '}
              <input
                className="w-full bg-transparent py-1.5 text-sm outline-none placeholder-gray-500"
                type="text"
                placeholder="Search products"
                value={query}
                onChange={handleChange}
              />{' '}
              <button type="submit">
                {' '}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  {' '}
                  <path
                    d="M10.836 10.615 15 14.695"
                    stroke="#7A7B7D"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{' '}
                  <path
                    d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
                    stroke="#7A7B7D"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />{' '}
                </svg>{' '}
              </button>{' '}
            </form>{' '}
            {/* Suggestions */}{' '}
            {results.length > 0 && (
              <ul className="absolute top-full left-0 z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                {' '}
                {results.map((category: any) => (
                  <li
                    key={category.id}
                    className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={() =>
                      navigate(`/product-list?category=${category.id}`)
                    }
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}${category.images?.[0] ?? ''}`}
                      alt={category.name}
                      className="h-9 w-9 rounded object-cover"
                    />
                    <span className="line-clamp-1">{category.name}</span>
                  </li>
                ))}{' '}
              </ul>
            )}{' '}
          </div>{' '}
          {/* Right actions: cart + auth */}{' '}
          <div className="flex items-center gap-3">
            {' '}
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:border-gray-500"
                aria-label="Cart"
              >
                {' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.7"
                  stroke="currentColor"
                >
                  {' '}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l2-7H5.4M7 13L5.4 5M7 13l-2 7m2-7h10m0 0l2 7M9 21h.01M15 21h.01"
                  />{' '}
                </svg>{' '}
              </button>
            )}{' '}
            {!isLoggedIn ? (
              <>
                {' '}
                <Link
                  to="/login"
                  className="rounded-full bg-gray-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-black"
                >
                  {' '}
                  Login{' '}
                </Link>{' '}
                <Link
                  to="/signup"
                  className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-800 hover:border-gray-500"
                >
                  {' '}
                  Signup{' '}
                </Link>{' '}
              </>
            ) : (
              <button
                onClick={logout}
                className="rounded-full bg-red-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-red-600"
              >
                {' '}
                Logout{' '}
              </button>
            )}{' '}
          </div>{' '}
        </div>{' '}
        {/* Mobile toggle */}{' '}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="inline-flex items-center justify-center rounded-md p-2 sm:hidden"
        >
          {' '}
          <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
            {' '}
            <rect width="21" height="1.5" rx=".75" fill="#111827" />{' '}
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#111827" />{' '}
            <rect
              x="6"
              y="13"
              width="15"
              height="1.5"
              rx=".75"
              fill="#111827"
            />{' '}
          </svg>{' '}
        </button>{' '}
      </div>{' '}
      {/* Mobile menu */}{' '}
      <div
        className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-16 z-30 flex-col gap-3 border-b border-gray-200 bg-white px-5 pb-4 pt-3 text-sm sm:hidden`}
      >
        {' '}
        <Link to="/" className="block py-1" onClick={() => setOpen(false)}>
          {' '}
          Home{' '}
        </Link>{' '}
        <Link
          to="/products"
          className="block py-1"
          onClick={() => setOpen(false)}
        >
          {' '}
          Products{' '}
        </Link>{' '}
        <Link to="/about" className="block py-1" onClick={() => setOpen(false)}>
          {' '}
          About{' '}
        </Link>{' '}
        <Link
          to="/contact"
          className="block py-1"
          onClick={() => setOpen(false)}
        >
          {' '}
          Contact{' '}
        </Link>
        {isLoggedIn && (
          <button
            onClick={() => {
              setOpen(false);
              navigate('/cart');
            }}
            className="mt-2 flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide"
          >
            <span>View cart</span>
          </button>
        )}
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-gray-900 px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-gray-200 px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-800"
            >
              Signup
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="mt-2 rounded-full bg-red-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
