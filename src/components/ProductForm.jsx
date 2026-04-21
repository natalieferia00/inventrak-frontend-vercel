import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, XCircle, AlertCircle, CloudOff } from 'lucide-react';

const API = 'https://inventrak-backend.onrender.com/api';

const ProductForm = ({ categories, onRefresh, editingProduct, setEditingProduct }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  const initialState = {
    sku: '',
    name: '',
    description: '',
    current_stock: 0,
    min_stock_level: 5,
    category_id: ''
  };

  const [product, setProduct] = useState(initialState);

  useEffect(() => {
    if (editingProduct) {
      setProduct({
        sku: editingProduct.sku || '',
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        current_stock: editingProduct.current_stock || 0,
        min_stock_level: editingProduct.min_stock_level || 5,
        category_id: editingProduct.category_id || ''
      });
    } else {
      setProduct(initialState);
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const id = editingProduct?.id || editingProduct?._id;

    try {
      if (editingProduct) {
        if (!id) throw new Error("ID no encontrado");
        await axios.put(`${API}/products/${id}`, product);
      } else {
        await axios.post(`${API}/products`, product);
      }
      
      if (onRefresh) onRefresh();
      setEditingProduct(null);
      navigate('/productos');
    } catch (err) {
      console.error("Fallo en servidor, activando persistencia local:", err);

      // --- ESTRATEGIA DE RESPALDO (LOCALSTORAGE) ---
      const savedProducts = JSON.parse(localStorage.getItem('it_products') || '[]');
      
      const newLocalProduct = {
        ...product,
        id: id || Date.now(), // Usamos el ID existente o generamos uno temporal
        category_name: categories.find(c => c.id == product.category_id)?.name || 'Sin categoría',
        isLocal: true // Marca visual para Natalie
      };

      let updatedProducts;
      if (editingProduct) {
        updatedProducts = savedProducts.map(p => (p.id == id || p._id == id) ? newLocalProduct : p);
      } else {
        updatedProducts = [...savedProducts, newLocalProduct];
      }

      // Guardamos en el "espejo" local
      localStorage.setItem('it_products', JSON.stringify(updatedProducts));
      
      // Feedback visual
      setError("Nota: El servidor está offline. Se guardó localmente en este dispositivo.");
      
      // Forzamos actualización de App.jsx y volvemos a la lista
      if (onRefresh) onRefresh();
      
      // Retrasamos la navegación un poco para que alcance a leer el error
      setTimeout(() => {
        setEditingProduct(null);
        navigate('/productos');
      }, 1500);
    }
  };

  return (
    <div className="form-container card animate-fade">
      <div className="view-header">
        <h2>{editingProduct ? 'EDITAR ARTÍCULO' : 'REGISTRAR NUEVO ARTÍCULO'}</h2>
      </div>

      {error && (
        <div className="status-banner offline">
          <AlertCircle size={16} /> {error} <CloudOff size={16} />
        </div>
      )}

      <form className="form-cyber" onSubmit={handleSubmit}>
        <div className="grid-form">
          <div className="form-group">
            <label>Nombre del Producto</label>
            <input 
              type="text" required 
              value={product.name}
              onChange={(e) => setProduct({...product, name: e.target.value})}
              placeholder="Ej: Sensor Pro X" 
            />
          </div>
          
          <div className="form-group">
            <label>SKU / Código</label>
            <input 
              type="text" required 
              value={product.sku}
              onChange={(e) => setProduct({...product, sku: e.target.value})}
              placeholder="INV-001" 
              disabled={!!editingProduct} 
            />
          </div>

          <div className="form-group full-width">
            <label>Descripción Detallada</label>
            <textarea 
              rows="3"
              value={product.description}
              onChange={(e) => setProduct({...product, description: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Stock Actual</label>
            <input 
              type="number" 
              value={product.current_stock}
              onChange={(e) => setProduct({...product, current_stock: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select 
              required
              value={product.category_id}
              onChange={(e) => setProduct({...product, category_id: e.target.value})}
            >
              <option value="">Seleccione una categoría...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-cyber btn-save">
            <Save size={18} /> 
            <span>{editingProduct ? 'ACTUALIZAR CAMBIOS' : 'GUARDAR PRODUCTO'}</span>
          </button>
          
          <button 
            type="button" 
            className="btn-cyber btn-cancel" 
            onClick={() => {
              setEditingProduct(null);
              navigate('/productos');
            }}
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