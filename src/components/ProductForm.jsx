import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, XCircle } from 'lucide-react';

const API = 'https://inventrak-backend.onrender.com/api';

const ProductForm = ({ categories, onRefresh }) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    sku: '',
    name: '',
    description: '',
    current_stock: 0,
    min_stock_level: 5,
    category_id: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/products`, product);
      onRefresh(); // Refresca los datos globales en App.jsx
      navigate('/productos'); // Te devuelve a la tabla automáticamente
    } catch (err) {
      console.error("Error al guardar el producto:", err);
      alert("Error al conectar con el servidor de Render");
    }
  };

  return (
    <div className="form-container card">
      <h2>➕ REGISTRAR NUEVO ARTÍCULO</h2>
      <form className="grid-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Producto</label>
          <input 
            type="text" 
            required 
            value={product.name}
            onChange={(e) => setProduct({...product, name: e.target.value})}
            placeholder="Ej: Sensor Pro X" 
          />
        </div>
        
        <div className="form-group">
          <label>SKU / Código</label>
          <input 
            type="text" 
            required 
            value={product.sku}
            onChange={(e) => setProduct({...product, sku: e.target.value})}
            placeholder="INV-001" 
          />
        </div>

        <div className="form-group full-width">
          <label>Descripción Detallada</label>
          <textarea 
            value={product.description}
            onChange={(e) => setProduct({...product, description: e.target.value})}
            placeholder="Ingrese las especificaciones técnicas..." 
          />
        </div>

        <div className="form-group">
          <label>Stock Inicial</label>
          <input 
            type="number" 
            value={product.current_stock}
            onChange={(e) => setProduct({...product, current_stock: parseInt(e.target.value)})}
          />
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <select 
            required
            value={product.category_id}
            onChange={(e) => setProduct({...product, category_id: e.target.value})}
          >
            <option value="">Seleccione...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group full-width" style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-save">
            <Save size={18} /> GUARDAR EN BASE DE DATOS
          </button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/productos')}>
            <XCircle size={18} /> CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;