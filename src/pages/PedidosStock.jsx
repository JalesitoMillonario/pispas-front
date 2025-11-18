import React, { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { getPedidos } from "@/api/stockService";

export default function PedidosStock() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const data = getPedidos();
    setPedidos(data);
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Package className="mx-auto w-16 h-16 text-blue-400 mb-4" />
          <p className="text-blue-700 text-xl">Total de pedidos: {pedidos.length}</p>
        </div>
      </div>
    </div>
  );
}
