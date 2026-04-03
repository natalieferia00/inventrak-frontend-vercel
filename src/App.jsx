import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Package, 
  ArrowUpDown, 
  Layers, 
  PlusCircle, 
  Menu, 
  X 
} from 'lucide-react';
import './App.css';

// --- IMPORTACIÓN DE COMPONENTES ---
import Dashboard from './components/Dashboard';
import ProductsView from './components/ProductsView';
import ProductForm from './components/ProductForm';
import MovementsView from './components/MovementsView';
import CategoriesView from './components/CategoriesView';

// URL API
const API = 'https://inventrak-backend.onrender.com/api';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(0); 
  const [loading, setLoading] = useState(true);

  // ✅ Estado del menú móvil
  const [menuOpen, setMenuOpen] = useState(false);

  const triggerRefresh = () => setRefresh(prev => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resP, resC] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/categories`)
        ]);
        setProducts(resP.data);
        setCategories(resC.data);
      } catch (err) {
        console.error("Error al sincronizar con el servidor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  return (
    <Router>
      <div className="app-container">

        {/* ✅ BOTÓN HAMBURGUESA (Configurado pequeño a la izquierda) */}
        <button 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* SIDEBAR */}
        <aside className={`sidebar ${menuOpen ? 'active' : ''}`}>
          <div className="logo-section">
            <h1>InvenTrak</h1>
          </div>

          <nav className="nav-links">
            <CustomLink to="/" icon={<LayoutDashboard size={20}/>} label="DASHBOARD" closeMenu={() => setMenuOpen(false)} />
            <CustomLink to="/productos" icon={<Package size={20}/>} label="PRODUCTOS" closeMenu={() => setMenuOpen(false)} />
            <CustomLink to="/productos/nuevo" icon={<PlusCircle size={20}/>} label="AÑADIR" closeMenu={() => setMenuOpen(false)} />
            <CustomLink to="/movimientos" icon={<ArrowUpDown size={20}/>} label="STOCK" closeMenu={() => setMenuOpen(false)} />
            <CustomLink to="/categorias" icon={<Layers size={20}/>} label="CATEGORÍAS" closeMenu={() => setMenuOpen(false)} />
          </nav>
          
          <div className="sidebar-footer">
            <span className={`status-dot ${loading ? 'syncing' : 'online'}`}></span>
            {loading ? 'SINCRONIZANDO...' : 'SISTEMA ONLINE'}
          </div>
        </aside>

        {/* CONTENIDO */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <Dashboard products={products} categories={categories} />
            } />

            <Route path="/productos" element={
              <ProductsView 
                products={products} 
                categories={categories} 
                onRefresh={triggerRefresh} 
              />
            } />

            <Route path="/productos/nuevo" element={
              <ProductForm 
                categories={categories} 
                onRefresh={triggerRefresh} 
              />
            } />

            <Route path="/categorias" element={
              <CategoriesView 
                categories={categories} 
                onRefresh={triggerRefresh} 
              />
            } />
            
            <Route path="/movimientos" element={
              <MovementsView 
                products={products} 
                onRefresh={triggerRefresh} 
              />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

/**
 * LINK PERSONALIZADO CON LÓGICA DE CIERRE AUTOMÁTICO
 */
function CustomLink({ to, icon, label, closeMenu }) {
  const location = useLocation();

  // Comprobar si la ruta actual coincide con el link
  const isActive = to === "/" 
    ? location.pathname === "/" 
    : location.pathname.startsWith(to);

  return (
    <Link 
      to={to} 
      className={`nav-item ${isActive ? 'active' : ''}`}
      onClick={() => {
        // Cerramos el menú solo si estamos en resolución móvil
        if (window.innerWidth < 768) {
          closeMenu();
        }
      }}
    >
      {icon} <span>{label}</span>
    </Link>
  );
}

export default App;