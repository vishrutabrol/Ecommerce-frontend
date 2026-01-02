import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import { Toaster } from 'react-hot-toast';
import Products from './pages/Products/Products';
import ProductsListing from './pages/ProductsListing/ProductsListing';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import AboutUs from './pages/About/About';
import ContactUs from './pages/Contact/ContactUs';

const App: React.FC = () => (
  <Router>
    <Toaster position="top-right" />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/products" element={<Products />} />
      <Route path="/product-list" element={<ProductsListing />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />

      {/* Optional: catch-all for 404 */}
      <Route path="*" element={<div>404 - Page not found</div>} />
    </Routes>
  </Router>
);

export default App;

// import React from 'react';
// import CardNav from './components/CardNav/CardNav';
// // import logo from './assets/trekkingImage3.jpg';

// const App = () => {
//   const navItems = [
//     {
//       label: "About",
//       bgColor: "#0D0716",
//       textColor: "#fff",
//       links: [
//         { label: "Company", href: "#company", ariaLabel: "About Company" },
//         { label: "Careers", href: "#careers", ariaLabel: "About Careers" }
//       ]
//     },
//     {
//       label: "Projects",
//       bgColor: "#170D27",
//       textColor: "#fff",
//       links: [
//         { label: "Featured", href: "#featured", ariaLabel: "Featured Projects" },
//         { label: "Case Studies", href: "#case-studies", ariaLabel: "Project Case Studies" }
//       ]
//     },
//     {
//       label: "Contact",
//       bgColor: "#271E37",
//       textColor: "#fff",
//       links: [
//         { label: "Email", href: "#email", ariaLabel: "Email us" },
//         { label: "Twitter", href: "#twitter", ariaLabel: "Twitter" },
//         { label: "LinkedIn", href: "#linkedin", ariaLabel: "LinkedIn" }
//       ]
//     }
//   ];

//   return (
//     <>
//       <CardNav
//         // logo={logo}
//         // logoAlt="My Portfolio Logo"
//         items={navItems}
//         baseColor="#fff"
//         menuColor="#000"
//         buttonBgColor="#111"
//         buttonTextColor="#fff"
//         ease="power3.out"
//       />
//       <div style={{ paddingTop: '120px' }}>
//         <section id="company"><h2>Company</h2></section>
//         <section id="careers"><h2>Careers</h2></section>
//         <section id="featured"><h2>Featured Projects</h2></section>
//         <section id="case-studies"><h2>Case Studies</h2></section>
//         <section id="email"><h2>Email Us</h2></section>
//         <section id="twitter"><h2>Twitter</h2></section>
//         <section id="linkedin"><h2>LinkedIn</h2></section>
//       </div>
//     </>
//   );
// };

// export default App;
