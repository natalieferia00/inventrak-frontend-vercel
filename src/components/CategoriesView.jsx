import React, { useState } from 'react';
import axios from 'axios';
import { Layers, Trash2, PlusCircle, AlertCircle } from 'lucide-react';

const API = 'https://inventrak-backend.onrender.com/api';

const CategoriesView = ({ categories, onRefresh }) => {
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const categoryName = e.target.catName.value.trim();

    if (!categoryName) return;

    try {
      await axios.post(`${API}/categories`, { name: categoryName });
      onRefresh();
      e.target.reset();
    } catch (err) {
      console.error("Error en el servidor:", err.response?.data || err.message);
      setError("Error 500: El servidor no pudo procesar la categoría. Revisa si el nombre ya existe.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás segura de eliminar esta categoría?")) {
      try {
        await axios.delete(`${API}/categories/${id}`);
        onRefresh();
      } catch (err) {
        setError("No se pudo eliminar: La categoría podría estar en uso por algún producto.");
      }
    }
  };

  return (
    <div className="grid-form animate-fade"> {/* Usamos la rejilla de 2 columnas */}
      
      {/* TABLA DE CATEGORÍAS */}
      <section className="card-table">
        <div className="view-header">
          <h2><Layers size={22} color="var(--accent-cyan)"/> CATEGORÍAS</h2>
        </div>
        
        {error && (
          <div style={{color: 'var(--accent-magenta)', marginBottom: '1rem', fontSize: '0.8rem', display: 'flex', gap: '5px'}}>
            <AlertCircle size={14}/> {error}
          </div>
        )}

        <table className="table-cyberpunk">
          <thead>
            <tr>
              <th style={{width: '70%'}}>NOMBRE</th>
              <th style={{width: '30%', textAlign: 'right'}}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td className="col-name">{c.name}</td>
                <td style={{textAlign: 'right'}}>
                  <button className="action-btn" onClick={() => handleDelete(c.id)}>
                    <Trash2 size={18} color="var(--accent-magenta)"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* FORMULARIO LATERAL */}
      <aside className="form-container" style={{margin: '0'}}>
        <h2>NUEVA CATEGORÍA</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <label>Nombre de Categoría</label>
          <input 
            name="catName" 
            placeholder="Ej: Periféricos" 
            required 
            autoComplete="off"
          />
          <button type="submit" className="btn-primary" style={{marginTop: '1rem'}}>
            <PlusCircle size={18}/> AÑADIR
          </button>
        </form>
      </aside>

    </div>
  );
};

export default CategoriesView;