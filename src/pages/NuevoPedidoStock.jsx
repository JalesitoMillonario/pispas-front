import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { getPedidos, ESTADOS_PEDIDO } from "@/api/stockService";

export default function NuevoPedidoStock() {
  const [pedidoBorrador, setPedidoBorrador] = useState(null);

  useEffect(() => {
    const pedidos = getPedidos();
    const borrador = pedidos.find(p => p.estado === ESTADOS_PEDIDO.BORRADOR);
    setPedidoBorrador(borrador);
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto w-16 h-16 text-blue-400 mb-4" />
          {pedidoBorrador ? (
            <>
              <p className="text-blue-700 text-xl font-bold">{pedidoBorrador.numero}</p>
              <p className="text-blue-600 mt-2">{pedidoBorrador.lineas.length} líneas de pedido</p>
            </>
          ) : (
            <p className="text-blue-700">No hay pedidos en borrador</p>
          )}
        </div>
      </div>
    </div>
  );
}
