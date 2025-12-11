import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Trash2, Send, Package } from "lucide-react";
import { getPedidos, cursarPedido, deletePedido, ESTADOS_PEDIDO } from "@/api/stockService";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PedidosStock() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const data = await getPedidos();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPedidos();
  }, []);

  const handleCursar = async (pedidoId) => {
    try {
      await cursarPedido(pedidoId);
      toast.success('Pedido cursado correctamente');
      loadPedidos();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (pedidoId) => {
    if (confirm('¿Seguro que quieres eliminar este pedido?')) {
      try {
        await deletePedido(pedidoId);
        toast.success('Pedido eliminado');
        loadPedidos();
      } catch (error) {
        toast.error('Error eliminando pedido');
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      [ESTADOS_PEDIDO.BORRADOR]: <Badge className="bg-gray-500">Borrador</Badge>,
      [ESTADOS_PEDIDO.CURSADO]: <Badge className="bg-orange-500">Cursado</Badge>,
      [ESTADOS_PEDIDO.RECIBIDO]: <Badge className="bg-green-600">Recibido</Badge>,
    };
    return badges[estado] || <Badge>-</Badge>;
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando pedidos...</div>;
  }

  if (!pedidos || pedidos.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <FileText className="mx-auto w-16 h-16 text-blue-400 mb-4" />
            <p className="text-blue-700 text-xl">No hay pedidos creados</p>
            <p className="text-blue-500 mt-2">Añade piezas desde el catálogo para crear un pedido</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pedidos.map((pedido) => {
            const lineasCount = pedido.lineas?.length || 0;
            const totalAmount = pedido.total || 0;
            
            return (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold text-blue-900">
                            {pedido.numero || 'Sin número'}
                          </CardTitle>
                          <p className="text-xs text-blue-600">
                            {pedido.fecha_creacion ? new Date(pedido.fecha_creacion).toLocaleDateString() : '-'}
                          </p>
                        </div>
                      </div>
                      {getEstadoBadge(pedido.estado)}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">Líneas</p>
                        <p className="text-lg font-bold text-blue-900">{lineasCount}</p>
                      </div>
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        <p className="text-xs text-indigo-600 font-medium">Total</p>
                        <p className="text-lg font-bold text-indigo-900">{totalAmount.toFixed(2)}€</p>
                      </div>
                    </div>

                    {pedido.notas && (
                      <p className="text-xs text-gray-600 italic truncate">{pedido.notas}</p>
                    )}

                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/Pedido-Stock/${pedido.id}`)}
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalle
                      </Button>

                      <div className="flex gap-2">
                        {pedido.estado === ESTADOS_PEDIDO.BORRADOR && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleCursar(pedido.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
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
                            onClick={() => navigate(`/Pedido-Stock/${pedido.id}`)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Package className="w-4 h-4 mr-1" />
                            Recibir Mercancía
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
