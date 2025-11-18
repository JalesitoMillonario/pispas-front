import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIAS, getPiezasByCategoria } from "@/data/piezas";
import { createPedido, addLineaPedido, getPedidos, ESTADOS_PEDIDO } from "@/api/stockService";
import PiezaCard from "../components/inventory/PiezaCard";

export default function CatalogoStock() {
  const handleAddToPedido = (pieza) => {
    try {
      const pedidos = getPedidos();
      let pedidoBorrador = pedidos.find(p => p.estado === ESTADOS_PEDIDO.BORRADOR);

      if (!pedidoBorrador) {
        pedidoBorrador = createPedido({ notas: 'Pedido creado desde catálogo' });
      }

      addLineaPedido(pedidoBorrador.id, pieza, 1);
      toast.success(`${pieza.nombre} añadido al pedido`);
    } catch (error) {
      toast.error('Error al añadir pieza al pedido');
    }
  };

  const renderPiezasList = (categoria) => {
    const piezasCategoria = getPiezasByCategoria(categoria);

    if (piezasCategoria.length === 0) {
      return (
        <div className="text-center py-12 text-blue-700">
          <Package className="mx-auto w-10 h-10 mb-2 text-blue-400" />
          <p>No hay piezas en esta categoría.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {piezasCategoria.map((pieza) => (
            <PiezaCard
              key={pieza.id}
              pieza={pieza}
              onAddToPedido={handleAddToPedido}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="CUADRO" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-9 gap-1 bg-blue-200/60">
            {CATEGORIAS.map((categoria) => (
              <TabsTrigger key={categoria} value={categoria} className="text-xs">
                {categoria.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIAS.map((categoria) => (
            <TabsContent key={categoria} value={categoria} className="mt-6">
              {renderPiezasList(categoria)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
