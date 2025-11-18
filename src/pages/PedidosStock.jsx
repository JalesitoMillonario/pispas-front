import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Trash2, Send, Package } from "lucide-react";
import { getPedidos, cursarPedido, deletePedido, ESTADOS_PEDIDO } from "@/api/stockService";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PedidosStock() {
  const [pedidos, setPedidos] = useState([]);

  const loadPedidos = () => {
    const data = getPedidos();
    setPedidos(data);
  };

  useEffect(() => {
    loadPedidos();
  }, []);

  const handleCursar = async (pedidoId) => {
    try {
      cursarPedido(pedidoId);
      toast.success('Pedido cursado correctamente');
      loadPedidos();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = (pedidoId) => {
    if (confirm('¿Seguro que quieres eliminar este pedido?')) {
      deletePedido(pedidoId);
      toast.success('Pedido eliminado');
      loadPedidos();
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      [ESTADOS_PEDIDO.BORRADOR]: <Badge className="bg-gray-500">Borrador</Badge>,
      [ESTADOS_PEDIDO.CURSADO]: <Badge className="bg-orange-500">Cursado</Badge>,
      [ESTADOS_PEDIDO.RECIBIDO]: <Badge className="bg-green-600">Recibido</Badge>,
    };
    return badges[estado];
  };

  if (pedidos.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <FileText className="mx-auto w-16 h-16 text-purple-400 mb-4" />
            <p className="text-purple-700 text-xl">No hay pedidos creados</p>
            <p className="text-purple-500 mt-2">Añade piezas desde el catálogo para crear un pedido</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pedidos.map((pedido) => (
            <motion.div
              key={pedido.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-600 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-purple-900">
                          {pedido.numero}
                        </CardTitle>
                        <p className="text-xs text-purple-600">
                          {new Date(pedido.fecha_creacion).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getEstadoBadge(pedido.estado)}
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <p className="text-xs text-purple-600 font-medium">Líneas</p>
                      <p className="text-lg font-bold text-purple-900">{pedido.lineas.length}</p>
                    </div>
                    <div className="bg-indigo-50 p-2 rounded-lg">
                      <p className="text-xs text-indigo-600 font-medium">Total</p>
                      <p className="text-lg font-bold text-indigo-900">{pedido.total.toFixed(2)}€</p>
                    </div>
                  </div>

                  {pedido.notas && (
                    <p className="text-xs text-gray-600 italic">{pedido.notas}</p>
                  )}

                  <div className="flex gap-2">
                    {pedido.estado === ESTADOS_PEDIDO.BORRADOR && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleCursar(pedido.id)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Cursar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(pedido.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {pedido.estado === ESTADOS_PEDIDO.CURSADO && (
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Recibir Mercancía
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
