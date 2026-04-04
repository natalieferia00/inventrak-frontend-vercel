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
      // Enviamos el objeto product al backend de Render
      await axios.post(`${API}/products`, product);
      
      if (onRefresh) onRefresh(); // Refresca los datos si la función existe
      
      alert("✅ Producto guardado correctamente");
      navigate('/productos'); // Redirección automática a la tabla
    } catch (err) {
      console.error("Error al guardar el producto:", err);
      alert("❌ Error: Verifica que el SKU sea único o revisa la conexión con Render.");
    }
  };

  return (
    <div className="form-container card animate-fade">
      <div className="view-header">
        <h2>➕ REGISTRAR NUEVO ARTÍCULO</h2>
      </div>

      <form className="form-cyber" onSubmit={handleSubmit}>
        <div className="grid-form">
          {/* NOMBRE */}
          <div className="form-group">
            <label>Nombre del Producto</label>
            <input 
              type="text" 
              required 
              value={product.name}
              onChange={(e) => setProduct({...product, name: e.target.value})}
              placeholder="Ej: Sensor Pro X" 
              autoComplete="off"
            />
          </div>
          
          {/* SKU */}
          <div className="form-group">
            <label>SKU / Código</label>
            <input 
              type="text" 
              required 
              value={product.sku}
              onChange={(e) => setProduct({...product, sku: e.target.value})}
              placeholder="INV-001" 
              autoComplete="off"
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div className="form-group full-width">
            <label>Descripción Detallada</label>
            <textarea 
              rows="3"
              value={product.description}
              onChange={(e) => setProduct({...product, description: e.target.value})}
              placeholder="Ingrese las especificaciones técnicas del artículo..." 
            />
          </div>

          {/* STOCK INICIAL */}
          <div className="form-group">
            <label>Stock Inicial</label>
            <input 
              type="number" 
              min="0"
              value={product.current_stock}
              onChange={(e) => setProduct({...product, current_stock: parseInt(e.target.value) || 0})}
            />
          </div>

          {/* CATEGORÍA */}
          <div className="form-group">
            <label>Categoría</label>
            <select 
              required
              value={product.category_id}
              onChange={(e) => setProduct({...product, category_id: e.target.value})}
            >
              <option value="">Seleccione una categoría...</option>
              {categories.map(cat => (
                // Usamos cat.id porque así lo confirmamos en tu base de datos de Railway
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ACCIONES DEL FORMULARIO */}
        <div className="form-actions">
          <button type="submit" className="btn-cyber btn-save">
            <Save size={18} /> 
            <span>GUARDAR EN BASE DE DATOS</span>
          </button>
          
          <button 
            type="button" 
            className="btn-cyber btn-cancel" 
            onClick={() => navigate('/productos')}
          >
            <XCircle size={18} /> 
            <span>CANCELAR</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;