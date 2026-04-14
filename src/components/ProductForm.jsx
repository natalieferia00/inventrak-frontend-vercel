import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, XCircle } from 'lucide-react';

const API = 'https://inventrak-backend.onrender.com/api';

const ProductForm = ({ categories, onRefresh, editingProduct, setEditingProduct }) => {
  const navigate = useNavigate();
  
  // Estado inicial
  const initialState = {
    sku: '',
    name: '',
    description: '',
    current_stock: 0,
    min_stock_level: 5,
    category_id: ''
  };

  const [product, setProduct] = useState(initialState);

  // EFECTO PARA CARGAR DATOS: Si editingProduct tiene algo, llenamos el formulario
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
  
  // LOG PARA DEPURAR: Mira en la consola qué ID tiene el objeto
  console.log("Producto a editar:", editingProduct);

  try {
    if (editingProduct) {
      // Intenta con _id si id sale undefined, o viceversa
      const id = editingProduct.id || editingProduct._id; 
      
      if (!id) {
        alert("Error: No se encontró el ID del producto para actualizar.");
        return;
      }

      await axios.put(`${API}/products/${id}`, product);
      alert("Producto actualizado correctamente");
    } else {
      await axios.post(`${API}/products`, product);
      alert("Producto guardado correctamente");
    }
    
    if (onRefresh) onRefresh();
    setEditingProduct(null);
    navigate('/productos'); 
  } catch (err) {
    console.error("Error al procesar el producto:", err);
    // Esto te dirá si el error es porque la ruta no existe (404)
    alert("Error 404: No se encontró la ruta en el servidor. Revisa el endpoint del backend.");
  }
};
  return (
    <div className="form-container card animate-fade">
      <div className="view-header">
        <h2>{editingProduct ? 'EDITAR ARTÍCULO' : 'REGISTRAR NUEVO ARTÍCULO'}</h2>
      </div>

      <form className="form-cyber" onSubmit={handleSubmit}>
        <div className="grid-form">
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
          
          <div className="form-group">
            <label>SKU / Código</label>
            <input 
              type="text" 
              required 
              value={product.sku}
              onChange={(e) => setProduct({...product, sku: e.target.value})}
              placeholder="INV-001" 
              autoComplete="off"
              // Opcional: Deshabilitar SKU en edición si no permites cambiarlo
              disabled={!!editingProduct} 
            />
          </div>

          <div className="form-group full-width">
            <label>Descripción Detallada</label>
            <textarea 
              rows="3"
              value={product.description}
              onChange={(e) => setProduct({...product, description: e.target.value})}
              placeholder="Ingrese las especificaciones técnicas..." 
            />
          </div>

          <div className="form-group">
            <label>Stock Actual</label>
            <input 
              type="number" 
              min="0"
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
            <span>{editingProduct ? 'ACTUALIZAR CAMBIOS' : 'GUARDAR EN BASE DE DATOS'}</span>
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