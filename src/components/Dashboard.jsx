import React from 'react';
import { Package, Layers, DollarSign, AlertTriangle, Activity } from 'lucide-react';

const Dashboard = ({ products, categories }) => {
  // Cálculos lógicos
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalStock = products.reduce((acc, p) => acc + (p.current_stock || 0), 0);
  const lowStockProducts = products.filter(p => p.current_stock <= p.min_stock_level).length;

  // Cálculo de porcentaje de stock (ejemplo basado en una meta de 1000 unidades)
  const stockGoal = 1000;
  const stockPercentage = Math.min(Math.round((totalStock / stockGoal) * 100), 100);

  return (
    <div className="dashboard-container">
      <div className="welcome-msg">
        <p>Terminal de Control v1.0.4</p>
        <h2>Panel de Inventario</h2>
      </div>

      <div className="dashboard-grid">
        
        {/* Card 1: Total Productos */}
        <div className="kpi-card">
          <h3>Total Productos</h3>
          <div className="kpi-value">{totalProducts}</div>
          <div className="kpi-unit">SKUs Registrados</div>
          <div className="progress-container">
             <div className="progress-bar high" style={{ width: '100%' }}></div>
          </div>
          <Package className="card-icon-bg" size={80} />
        </div>

        {/* Card 2: Stock Total con Barra Dinámica */}
        <div className="kpi-card">
          <h3>Stock Total</h3>
          <div className="kpi-value">{totalStock}</div>
          <div className="kpi-unit">Capacidad: {stockPercentage}%</div>
          <div className="progress-container">
             <div 
                className={`progress-bar ${stockPercentage > 50 ? 'high' : 'medium'}`} 
                style={{ width: `${stockPercentage}%` }}
             ></div>
          </div>
          <Layers className="card-icon-bg" size={80} />
        </div>

        {/* Card 3: Categorías */}
        <div className="kpi-card">
          <h3>Categorías</h3>
          <div className="kpi-value">{totalCategories}</div>
          <div className="kpi-unit">Segmentos Activos</div>
          <div className="progress-container">
             <div className="progress-bar high" style={{ width: '100%', opacity: 0.5 }}></div>
          </div>
          <DollarSign className="card-icon-bg" size={80} />
        </div>

        {/* Card 4: Alertas Críticas (Barra Magenta) */}
        <div className="kpi-card danger">
          <h3>Alertas de Stock</h3>
          <div className="kpi-value" style={{ color: '#ff00ff' }}>{lowStockProducts}</div>
          <div className="kpi-unit">Requieren Acción</div>
          <div className="progress-container">
             <div 
                className="progress-bar low" 
                style={{ width: lowStockProducts > 0 ? '100%' : '0%' }}
             ></div>
          </div>
          <AlertTriangle className="card-icon-bg" size={80} />
        </div>

      </div>

      <div className="dashboard-lower-section">
        <div className="activity-card">
          <div className="card-header">
            <Activity size={20} color="#00f2ff" />
            <h3>Estado del Sistema</h3>
          </div>
          <div className="activity-item">
            <span>Base de Datos Railway:</span>
            <span className="status-text">CONECTADO</span>
          </div>
          <div className="activity-item">
            <span>Sincronización Render:</span>
            <span className="status-text">OPTIMA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;