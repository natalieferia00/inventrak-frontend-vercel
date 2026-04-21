import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpDown, History, PlusCircle, Eye, EyeOff, MessageSquare, CloudOff } from 'lucide-react';

const API = 'https://inventrak-backend.onrender.com/api';

const MovementsView = ({ products, onRefresh }) => {
  const [history, setHistory] = useState(() => {
    // Carga inicial desde local para evitar flashes en blanco
    const saved = localStorage.getItem('it_movements');
    return saved ? JSON.parse(saved) : [];
  });
  const [expandedId, setExpandedId] = useState(null);
  const [isLocalMode, setIsLocalMode] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/movements`);
      setHistory(res.data);
      setIsLocalMode(false);
      localStorage.setItem('it_movements', JSON.stringify(res.data));
    } catch (err) {
      console.warn("Fallo al conectar con el historial. Usando datos locales.");
      setIsLocalMode(true);
      const saved = localStorage.getItem('it_movements');
      if (saved) setHistory(JSON.parse(saved));
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [products]);

  const toggleNote = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMovement = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    
    // Preparar objeto para posible guardado local
    const selectedProd = products.find(p => p.id == formData.product_id);
    const newMovement = {
      id: Date.now(),
      product_name: selectedProd?.name || 'Producto Desconocido',
      type: formData.type,
      quantity: formData.quantity,
      reason: formData.reason,
      movement_date: new Date().toISOString(),
      isLocal: true
    };

    try {
      await axios.post(`${API}/movements`, formData);
      await fetchHistory();
      onRefresh();
      e.target.reset();
      alert("Movimiento sincronizado en la nube");
    } catch (err) {
      console.error("Error de red. Registrando movimiento localmente.");
      
      // 1. Guardar en historial local
      const updatedHistory = [newMovement, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('it_movements', JSON.stringify(updatedHistory));

      // 2. Actualizar stock del producto localmente en el espejo de productos
      const savedProducts = JSON.parse(localStorage.getItem('it_products') || '[]');
      const updatedProducts = savedProducts.map(p => {
        if (p.id == formData.product_id) {
          const qty = parseInt(formData.quantity);
          const newStock = formData.type === 'IN' ? p.current_stock + qty : p.current_stock - qty;
          return { ...p, current_stock: newStock };
        }
        return p;
      });

      localStorage.setItem('it_products', JSON.stringify(updatedProducts));
      
      // 3. Notificar y limpiar
      onRefresh(); 
      e.target.reset();
      alert("Servidor Offline: Movimiento registrado en memoria local.");
    }
  };

  return (
    <div className="dashboard-grid animate-fade">
      {/* SECCIÓN IZQUIERDA: TABLA */}
      <section className="table-card">
        <div className="view-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={24} color="var(--accent-cyan)" />
            <h2 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>HISTORIAL RECIENTE</h2>
          </div>
          {isLocalMode && (
            <div className="offline-badge" style={{ color: 'var(--accent-magenta)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CloudOff size={14} /> MODO LOCAL
            </div>
          )}
        </div>

        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>FECHA</th>
                <th>PRODUCTO</th>
                <th>TIPO</th>
                <th style={{ textAlign: 'center' }}>NOTA</th>
              </tr>
            </thead>
            <tbody>
              {history.map((m) => (
                <React.Fragment key={m.id}>
                  <tr className={m.isLocal ? 'local-row' : ''}>
                    <td style={{ fontSize: '0.7rem', color: 'var(--text-ghost)' }}>
                      {new Date(m.movement_date).toLocaleDateString()}
                    </td>
                    <td className="col-name">
                      {m.product_name}
                      {m.isLocal && <span style={{ color: 'var(--accent-magenta)', fontSize: '8px', display: 'block' }}>SIN SYNC</span>}
                    </td>
                    <td>
                      <span className={`badge ${m.type === 'IN' || m.type === 'ENTRADA' ? 'ok' : 'low'}`}>
                        {m.type === 'IN' ? 'ENTRADA' : 'SALIDA'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => toggleNote(m.id)}
                        className="btn-icon"
                        style={{ color: expandedId === m.id ? 'var(--accent-cyan)' : 'var(--text-ghost)' }}
                      >
                        {expandedId === m.id ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </td>
                  </tr>

                  {expandedId === m.id && (
                    <tr className="note-row-animation">
                      <td colSpan="4" style={{ padding: '10px 15px', background: 'rgba(0, 242, 255, 0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                          <MessageSquare size={14} />
                          <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>MOTIVO:</span>
                          <span style={{ color: 'var(--text-bright)', fontStyle: 'italic' }}>
                            {m.reason || "Sin observaciones registradas."}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECCIÓN DERECHA: FORMULARIO */}
      <aside className="form-card">
        <div className="view-header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PlusCircle size={20} color="var(--accent-cyan)" />
          <h4 style={{ margin: 0 }}>REGISTRAR STOCK</h4>
        </div>
        <form onSubmit={handleMovement} className="inventory-form">
           <div className="form-group">
            <label>Seleccionar Producto</label>
            <select name="product_id" required className="cyber-input">
              <option value="">Buscar item...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.current_stock})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tipo de Operación</label>
            <select name="type" className="cyber-input" required>
              <option value="IN">ENTRADA (+)</option>
              <option value="OUT">SALIDA (-)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Cantidad</label>
            <input name="quantity" type="number" min="1" required className="cyber-input" />
          </div>
          <div className="form-group">
            <label>Motivo o Nota</label>
            <input name="reason" placeholder="Ej: Venta directa" required className="cyber-input" />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            <ArrowUpDown size={18} /> EJECUTAR TRANSACCIÓN
          </button>
        </form>
      </aside>
    </div>
  );
};

export default MovementsView;