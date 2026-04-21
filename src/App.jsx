import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, Package, ArrowUpDown, Layers, PlusCircle, Menu, X, CloudOff 
} from 'lucide-react';
import './App.css';

// Componentes
import Dashboard from './components/Dashboard';
import ProductsView from './components/ProductsView';
import ProductForm from './components/ProductForm';
import MovementsView from './components/MovementsView';
import CategoriesView from './components/CategoriesView';

const API = 'https://inventrak-backend.onrender.com/api';

function AppContent() {
  // Inicialización desde LocalStorage para carga instantánea
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('it_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('it_categories');
    return saved ? JSON.parse(saved) : [];
  });

  const [refresh, setRefresh] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const navigate = useNavigate();
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
        setIsOffline(false);

        localStorage.setItem('it_products', JSON.stringify(resP.data));
        localStorage.setItem('it_categories', JSON.stringify(resC.data));
      } catch (err) {
        console.error("Modo Local: Servidor no responde.");
        setIsOffline(true);

        // Re-hidratar estados desde local ante fallo del server
        const localP = localStorage.getItem('it_products');
        const localC = localStorage.getItem('it_categories');
        if (localP) setProducts(JSON.parse(localP));
        if (localC) setCategories(JSON.parse(localC));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este artículo?")) {
      try {
        await axios.delete(`${API}/products/${id}`);
        triggerRefresh();
      } catch (err) {
        const updated = products.filter(p => (p.id || p._id) != id);
        setProducts(updated);
        localStorage.setItem('it_products', JSON.stringify(updated));
        setIsOffline(true);
      }
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    navigate('/productos/nuevo');
  };

  const handleAddNewProduct = () => {
    setProductToEdit(null);
    setMenuOpen(false);
    navigate('/productos/nuevo');
  };

  return (
    <div className="app-container">
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <aside className={`sidebar ${menuOpen ? 'active' : ''}`}>
        <div className="logo-section"><h1>InvenTrak</h1></div>
        <nav className="nav-links">
          <CustomLink to="/" icon={<LayoutDashboard size={20}/>} label="DASHBOARD" closeMenu={() => setMenuOpen(false)} />
          <CustomLink to="/productos" icon={<Package size={20}/>} label="PRODUCTOS" closeMenu={() => setMenuOpen(false)} />
          <div className={`nav-item ${useLocation().pathname === '/productos/nuevo' && !productToEdit ? 'active' : ''}`}
               onClick={handleAddNewProduct} style={{ cursor: 'pointer' }}>
            <PlusCircle size={20}/> <span>AÑADIR</span>
          </div>
          <CustomLink to="/movimientos" icon={<ArrowUpDown size={20}/>} label="STOCK" closeMenu={() => setMenuOpen(false)} />
          <CustomLink to="/categorias" icon={<Layers size={20}/>} label="CATEGORÍAS" closeMenu={() => setMenuOpen(false)} />
        </nav>
        <div className="sidebar-footer">
          <span className={`status-dot ${loading ? 'syncing' : isOffline ? 'offline' : 'online'}`}></span>
          <div className="status-info">
            <small>{loading ? 'SYNC...' : isOffline ? 'MODO LOCAL' : 'ONLINE'}</small>
            {isOffline && <CloudOff size={12} color="#ff0055" />}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard products={products} categories={categories} />} />
          <Route path="/productos" element={<ProductsView products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />} />
          <Route path="/productos/nuevo" element={<ProductForm categories={categories} onRefresh={triggerRefresh} editingProduct={productToEdit} setEditingProduct={setProductToEdit} />} />
          <Route path="/categorias" element={<CategoriesView categories={categories} onRefresh={triggerRefresh} />} />
          <Route path="/movimientos" element={<MovementsView products={products} onRefresh={triggerRefresh} />} />
        </Routes>
      </main>
    </div>
  );
}

function App() { return ( <Router><AppContent /></Router> ); }

function CustomLink({ to, icon, label, closeMenu }) {
  const location = useLocation();
  const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
  return (
    <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => { if (window.innerWidth < 768) closeMenu(); }}>
      {icon} <span>{label}</span>
    </Link>
  );
}

export default App;