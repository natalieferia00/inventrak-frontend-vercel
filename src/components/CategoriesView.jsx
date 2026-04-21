import React, { useState } from 'react';
import axios from 'axios';
import { Layers, Trash2, PlusCircle, AlertCircle, CloudOff } from 'lucide-react';

const API = 'https://inventrak-backend.onrender.com/api';

const CategoriesView = ({ categories, onRefresh }) => {
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const categoryName = e.target.catName.value.trim();

    if (!categoryName) return;

    try {
      // Intentamos la petición normal
      await axios.post(`${API}/categories`, { name: categoryName });
      onRefresh();
      e.target.reset();
    } catch (err) {
      console.error("Error en el servidor (DB Offline):", err.response?.data || err.message);
      
      // ESTRATEGIA LOCALSTORAGE: Si falla el server, guardamos localmente
      const newLocalCategory = { 
        id: Date.now(), // ID temporal para evitar errores de duplicidad en React
        name: categoryName,
        isLocal: true 
      };

      const saved = JSON.parse(localStorage.getItem('it_categories') || '[]');
      const updated = [...saved, newLocalCategory];
      
      // Actualizamos el almacenamiento
      localStorage.setItem('it_categories', JSON.stringify(updated));
      
      // Mostramos un aviso pero dejamos que la UI siga funcionando
      setError("Nota: El servidor está offline. La categoría se guardó solo en este dispositivo.");
      
      // Forzamos un refresh manual del estado local para que aparezca en la lista
      onRefresh(); 
      e.target.reset();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás segura de eliminar esta categoría?")) {
      try {
        await axios.delete(`${API}/categories/${id}`);
        onRefresh();
      } catch (err) {
        // Si no se puede borrar en server, intentamos borrar en local
        const saved = JSON.parse(localStorage.getItem('it_categories') || '[]');
        const updated = saved.filter(c => c.id !== id);
        localStorage.setItem('it_categories', JSON.stringify(updated));
        
        setError("La categoría se eliminó localmente (Servidor no disponible).");
        onRefresh();
      }
    }
  };

  return (
    <div className="grid-form animate-fade">
      {/* TABLA DE CATEGORÍAS */}
      <section className="card-table">
        <div className="view-header">
          <h2><Layers size={22} color="var(--accent-cyan)" /> CATEGORÍAS</h2>
        </div>

        {error && (
          <div style={{ 
            color: 'var(--accent-magenta)', 
            marginBottom: '1rem', 
            fontSize: '0.8rem', 
            display: 'flex', 
            gap: '8px',
            alignItems: 'center',
            background: 'rgba(255, 68, 68, 0.1)',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid var(--accent-magenta)'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <table className="table-cyberpunk">
          <thead>
            <tr>
              <th style={{ width: '70%' }}>NOMBRE</th>
              <th style={{ width: '30%', textAlign: 'right' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className={c.isLocal ? 'local-row' : ''}>
                <td className="col-name">
                  {c.name} 
                  {c.isLocal && (
                    <span style={{ 
                      fontSize: '10px', 
                      color: 'var(--accent-magenta)', 
                      marginLeft: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <CloudOff size={10} /> LOCAL
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="action-btn" onClick={() => handleDelete(c.id)}>
                    <Trash2 size={18} color="var(--accent-magenta)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* FORMULARIO LATERAL */}
      <aside className="form-container" style={{ margin: '0' }}>
        <h2>NUEVA CATEGORÍA</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <label>Nombre de Categoría</label>
          <input
            name="catName"
            placeholder="Ej: Periféricos"
            required
            autoComplete="off"
          />
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            <PlusCircle size={18} /> AÑADIR
          </button>
        </form>
      </aside>
    </div>
  );
};

export default CategoriesView;