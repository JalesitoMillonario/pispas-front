import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Package, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIAS, CATEGORIA_DIAGRAMS, getPiezasByCategoria, searchPiezas } from "@/data/piezas";
import { createPedido, addLineaPedido, getPedidos, ESTADOS_PEDIDO } from "@/api/stockService";
import PiezaCard from "../components/inventory/PiezaCard";

export default function CatalogoStock() {
  const [searchTerm, setSearchTerm] = useState("");

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
    let piezasCategoria = getPiezasByCategoria(categoria);

    // Filtrar por búsqueda si hay término
    if (searchTerm) {
      piezasCategoria = piezasCategoria.filter(p =>
        p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const diagramUrl = CATEGORIA_DIAGRAMS[categoria];

    if (piezasCategoria.length === 0) {
      return (
        <div className="space-y-4 sm:space-y-6">
          {/* Diagrama de explosión optimizado móvil */}
          {diagramUrl && (
            <Card className="p-3 sm:p-4 bg-white border-blue-200">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h3 className="text-sm sm:text-base font-semibold text-blue-900">Diagrama de Explosión</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 sm:p-4 flex justify-center">
                <img
                  src={diagramUrl}
                  alt={`Diagrama de ${categoria}`}
                  className="max-w-full h-auto max-h-64 sm:max-h-96 object-contain"
                />
              </div>
            </Card>
          )}
          <div className="text-center py-8 sm:py-12 text-blue-700">
            <Package className="mx-auto w-8 h-8 sm:w-10 sm:h-10 mb-2 text-blue-400" />
            <p className="text-sm sm:text-base">No hay piezas que coincidan con la búsqueda.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Diagrama de explosión optimizado móvil */}
        {diagramUrl && (
          <Card className="p-3 sm:p-4 bg-white border-blue-200">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h3 className="text-sm sm:text-base font-semibold text-blue-900 truncate">
                Diagrama - {categoria.split(' ')[0]}
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 sm:p-4 flex justify-center">
              <img
                src={diagramUrl}
                alt={`Diagrama de ${categoria}`}
                className="max-w-full h-auto max-h-64 sm:max-h-96 object-contain cursor-pointer active:scale-95 sm:hover:scale-105 transition-transform"
                onClick={() => window.open(diagramUrl, '_blank')}
                title="Toca para ver en tamaño completo"
              />
            </div>
          </Card>
        )}

        {/* Grid de piezas optimizado móvil: 1 col móvil, 2 tablet, 3 desktop */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Buscador optimizado móvil */}
        <div className="mb-4 sm:mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
          <Input
            type="text"
            placeholder="Buscar pieza..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 sm:pl-10 h-11 sm:h-10 text-sm sm:text-base border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>

        <Tabs defaultValue="CUADRO" className="w-full">
          {/* Tabs optimizadas para móvil - scrollables */}
          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 pb-2">
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-9 gap-1 bg-blue-100 h-auto">
              {CATEGORIAS.map((categoria) => (
                <TabsTrigger
                  key={categoria}
                  value={categoria}
                  className="text-xs px-2 sm:px-3 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-shrink-0"
                >
                  {categoria.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {CATEGORIAS.map((categoria) => (
            <TabsContent key={categoria} value={categoria} className="mt-4 sm:mt-6">
              {renderPiezasList(categoria)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
