import { apiClient } from '../components/apiClient';

export const ESTADOS_PEDIDO = {
  BORRADOR: 'borrador',
  CURSADO: 'cursado',
  RECIBIDO: 'recibido'
};

export const getPedidos = async () => {
  try {
    return await apiClient.request('/purchase-orders', { method: 'GET' }) || [];
  } catch { return []; }
};

export const getPedidoById = async (id) => {
  try {
    return await apiClient.request(`/purchase-orders/${id}`, { method: 'GET' });
  } catch { return null; }
};

export const createPedido = async (data) => apiClient.request('/purchase-orders', { method: 'POST', body: JSON.stringify(data) });
export const updatePedido = async (id, data) => apiClient.request(`/purchase-orders/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePedido = async (id) => apiClient.request(`/purchase-orders/${id}`, { method: 'DELETE' });

export const addLineaPedido = async (pedidoId, pieza, cantidad) => {
  return apiClient.request(`/purchase-orders/${pedidoId}/lineas`, {
    method: 'POST',
    body: JSON.stringify({ 
      pieza_id: String(pieza.id), 
      codigo: pieza.codigo, 
      nombre: pieza.nombre, 
      unidad: pieza.unidad, 
      cantidad, 
      pvp: pieza.pvp 
    })
  });
};

export const removeLineaPedido = async (pedidoId, lineaId) => apiClient.request(`/purchase-orders/${pedidoId}/lineas/${lineaId}`, { method: 'DELETE' });
export const cursarPedido = async (pedidoId, notas = '') => updatePedido(pedidoId, { estado: ESTADOS_PEDIDO.CURSADO, fecha_cursado: new Date().toISOString(), notas });
export const recibirPedido = async (pedidoId, lineasRecibidas) => {
  const pedido = await getPedidoById(pedidoId);
  for (const { lineaId, cantidadRecibida } of lineasRecibidas) {
    const linea = pedido.lineas.find(l => l.id === lineaId);
    if (linea) updateStock(linea.pieza_id, cantidadRecibida);
  }
  return updatePedido(pedidoId, { fecha_ultima_recepcion: new Date().toISOString() });
};

export const getStock = () => {
  const stock = localStorage.getItem('pispas_stock');
  return Promise.resolve(stock ? JSON.parse(stock) : {});
};

export const getStockPieza = (id) => {
  const stock = localStorage.getItem('pispas_stock');
  const data = stock ? JSON.parse(stock) : {};
  return data[id] || 0;
};

export const updateStock = (id, cantidad) => {
  const stock = localStorage.getItem('pispas_stock');
  const data = stock ? JSON.parse(stock) : {};
  data[id] = (data[id] || 0) + cantidad;
  localStorage.setItem('pispas_stock', JSON.stringify(data));
  return data[id];
};
