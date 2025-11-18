import React, { useState, useEffect } from "react";
import { Box } from "lucide-react";
import { getStock } from "@/api/stockService";
import { PIEZAS } from "@/data/piezas";

export default function StockInventario() {
  const [stock, setStock] = useState({});

  useEffect(() => {
    const currentStock = getStock();
    setStock(currentStock);
  }, []);

  const totalUnidades = Object.values(stock).reduce((sum, cant) => sum + cant, 0);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Box className="mx-auto w-16 h-16 text-blue-400 mb-4" />
          <p className="text-blue-700 text-2xl font-bold">{totalUnidades} unidades en stock</p>
          <p className="text-blue-600 mt-2">{PIEZAS.length} referencias en catálogo</p>
        </div>
      </div>
    </div>
  );
}
