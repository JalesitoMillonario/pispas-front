// Servicio de inventario usando localStorage
// TODO: Migrar a tu API (apiClient) cuando tengas endpoints de stock

const STORAGE_KEYS = {
  PEDIDOS: 'pispas_pedidos',
  STOCK: 'pispas_stock',
  PEDIDO_COUNTER: 'pispas_pedido_counter'
};

// Estados de pedidos
export const ESTADOS_PEDIDO = {
  BORRADOR: 'borrador',
  CURSADO: 'cursado',
  RECIBIDO: 'recibido'
};

// ============= PEDIDOS =============

export const getPedidos = () => {
  const pedidos = localStorage.getItem(STORAGE_KEYS.PEDIDOS);
  return pedidos ? JSON.parse(pedidos) : [];
};

export const getPedidoById = (id) => {
  const pedidos = getPedidos();
  return pedidos.find(p => p.id === id);
};

export const createPedido = (pedidoData) => {
  const pedidos = getPedidos();
  const counter = parseInt(localStorage.getItem(STORAGE_KEYS.PEDIDO_COUNTER) || '0') + 1;
  localStorage.setItem(STORAGE_KEYS.PEDIDO_COUNTER, counter.toString());

  const nuevoPedido = {
    id: counter,
    numero: `PED-${String(counter).padStart(5, '0')}`,
    fecha_creacion: new Date().toISOString(),
    estado: ESTADOS_PEDIDO.BORRADOR,
    lineas: [],
    total: 0,
    notas: '',
    ...pedidoData
  };

  pedidos.push(nuevoPedido);
  localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
  return nuevoPedido;
};

export const updatePedido = (id, updateData) => {
  const pedidos = getPedidos();
  const index = pedidos.findIndex(p => p.id === id);

  if (index === -1) {
    throw new Error('Pedido no encontrado');
  }

  pedidos[index] = {
    ...pedidos[index],
    ...updateData,
    fecha_modificacion: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
  return pedidos[index];
};

export const addLineaPedido = (pedidoId, pieza, cantidad) => {
  const pedido = getPedidoById(pedidoId);

  if (!pedido) {
    throw new Error('Pedido no encontrado');
  }

  const lineaExistente = pedido.lineas.find(l => l.piezaId === pieza.id);

  if (lineaExistente) {
    lineaExistente.cantidad += cantidad;
  } else {
    pedido.lineas.push({
      piezaId: pieza.id,
      codigo: pieza.codigo,
      nombre: pieza.nombre,
      unidad: pieza.unidad,
      cantidad: cantidad,
      cantidad_recibida: 0,
      pvp: pieza.pvp
    });
  }

  pedido.total = pedido.lineas.reduce((sum, linea) => sum + (linea.cantidad * linea.pvp), 0);

  return updatePedido(pedidoId, pedido);
};

export const removeLineaPedido = (pedidoId, piezaId) => {
  const pedido = getPedidoById(pedidoId);

  if (!pedido) {
    throw new Error('Pedido no encontrado');
  }

  pedido.lineas = pedido.lineas.filter(l => l.piezaId !== piezaId);
  pedido.total = pedido.lineas.reduce((sum, linea) => sum + (linea.cantidad * linea.pvp), 0);

  return updatePedido(pedidoId, pedido);
};

export const cursarPedido = (pedidoId, notasAdicionales = '') => {
  const pedido = getPedidoById(pedidoId);

  if (!pedido) {
    throw new Error('Pedido no encontrado');
  }

  if (pedido.lineas.length === 0) {
    throw new Error('No se puede cursar un pedido sin líneas');
  }

  return updatePedido(pedidoId, {
    estado: ESTADOS_PEDIDO.CURSADO,
    fecha_cursado: new Date().toISOString(),
    notas: notasAdicionales || pedido.notas
  });
};

export const recibirPedido = (pedidoId, lineasRecibidas) => {
  const pedido = getPedidoById(pedidoId);

  if (!pedido) {
    throw new Error('Pedido no encontrado');
  }

  lineasRecibidas.forEach(({ piezaId, cantidadRecibida }) => {
    const linea = pedido.lineas.find(l => l.piezaId === piezaId);
    if (linea) {
      linea.cantidad_recibida = (linea.cantidad_recibida || 0) + cantidadRecibida;
      updateStock(piezaId, cantidadRecibida);
    }
  });

  const totalmenteRecibido = pedido.lineas.every(
    l => l.cantidad_recibida >= l.cantidad
  );

  const updateData = {
    fecha_ultima_recepcion: new Date().toISOString()
  };

  if (totalmenteRecibido) {
    updateData.estado = ESTADOS_PEDIDO.RECIBIDO;
    updateData.fecha_recibido = new Date().toISOString();
  }

  return updatePedido(pedidoId, updateData);
};

export const deletePedido = (pedidoId) => {
  const pedidos = getPedidos();
  const filteredPedidos = pedidos.filter(p => p.id !== pedidoId);
  localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(filteredPedidos));
  return true;
};

// ============= STOCK =============

export const getStock = () => {
  const stock = localStorage.getItem(STORAGE_KEYS.STOCK);
  return stock ? JSON.parse(stock) : {};
};

export const getStockPieza = (piezaId) => {
  const stock = getStock();
  return stock[piezaId] || 0;
};

export const updateStock = (piezaId, cantidad) => {
  const stock = getStock();
  stock[piezaId] = (stock[piezaId] || 0) + cantidad;

  if (stock[piezaId] < 0) {
    stock[piezaId] = 0;
  }

  localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stock));
  return stock[piezaId];
};
