import Layout from "./Layout.jsx";
import Dashboard from "./Dashboard";
import Auth from "./Auth";
import Pendientes from "./Pendientes";
import Resueltas from "./Resueltas";

// Importar con los nombres de archivo REALES (con guiones)
import EnProceso from "./En-proceso";
import MisIncidencias from "./Mis-incidencias";
import NuevaIncidencia from "./Nueva-incidencia";

// Páginas de Stock
import CatalogoStock from "./CatalogoStock";
import PedidosStock from "./PedidosStock";
import StockInventario from "./StockInventario";
import NuevoPedidoStock from "./NuevoPedidoStock";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Dashboard,
    Auth,
    Pendientes,
    EnProceso,
    Resueltas,
    MisIncidencias,
    NuevaIncidencia,
    CatalogoStock,
    PedidosStock,
    StockInventario,
    NuevoPedidoStock,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) url = url.slice(0, -1);
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) urlLastPart = urlLastPart.split('?')[0];
    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                <Route path="/" element={<Dashboard />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Auth" element={<Auth />} />
                <Route path="/Pendientes" element={<Pendientes />} />
                
                {/* Rutas con ambos formatos (con y sin guiones) */}
                <Route path="/EnProceso" element={<EnProceso />} />
                <Route path="/En-proceso" element={<EnProceso />} />
                
                <Route path="/Resueltas" element={<Resueltas />} />
                
                <Route path="/MisIncidencias" element={<MisIncidencias />} />
                <Route path="/Mis-incidencias" element={<MisIncidencias />} />
                
                <Route path="/NuevaIncidencia" element={<NuevaIncidencia />} />
                <Route path="/Nueva-incidencia" element={<NuevaIncidencia />} />

                {/* Rutas de Stock */}
                <Route path="/Catalogo-Stock" element={<CatalogoStock />} />
                <Route path="/Pedidos-Stock" element={<PedidosStock />} />
                <Route path="/Stock-Inventario" element={<StockInventario />} />
                <Route path="/Nuevo-Pedido-Stock" element={<NuevoPedidoStock />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
