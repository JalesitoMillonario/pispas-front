import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Send, Trash2, Plus, Minus, FileText, PackageX } from "lucide-react";
import { getPedidos, ESTADOS_PEDIDO, updatePedido, removeLineaPedido, cursarPedido, deletePedido } from "@/api/stockService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function NuevoPedidoStock() {
  const [pedidoBorrador, setPedidoBorrador] = useState(null);
  const [notas, setNotas] = useState("");
  const navigate = useNavigate();

  const loadPedidoBorrador = () => {
    const pedidos = getPedidos();
    const borrador = pedidos.find(p => p.estado === ESTADOS_PEDIDO.BORRADOR);
    setPedidoBorrador(borrador);
    if (borrador) {
      setNotas(borrador.notas || "");
    }
  };

  useEffect(() => {
    loadPedidoBorrador();
  }, []);

  const handleUpdateCantidad = (piezaId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      handleRemoveLinea(piezaId);
      return;
    }

    const lineaIndex = pedidoBorrador.lineas.findIndex(l => l.piezaId === piezaId);
    if (lineaIndex !== -1) {
      const lineasActualizadas = [...pedidoBorrador.lineas];
      lineasActualizadas[lineaIndex].cantidad = nuevaCantidad;

      const nuevoTotal = lineasActualizadas.reduce((sum, linea) => sum + (linea.cantidad * linea.pvp), 0);

      updatePedido(pedidoBorrador.id, {
        lineas: lineasActualizadas,
        total: nuevoTotal
      });

      loadPedidoBorrador();
      toast.success("Cantidad actualizada");
    }
  };

  const handleRemoveLinea = (piezaId) => {
    try {
      removeLineaPedido(pedidoBorrador.id, piezaId);
      loadPedidoBorrador();
      toast.success("Línea eliminada del pedido");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateNotas = () => {
    try {
      updatePedido(pedidoBorrador.id, { notas });
      toast.success("Notas guardadas");
    } catch (error) {
      toast.error("Error al guardar notas");
    }
  };

  const handleCursarPedido = () => {
    try {
      cursarPedido(pedidoBorrador.id, notas);
      toast.success("Pedido cursado correctamente");
      navigate("/Pedidos-Stock");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeletePedido = () => {
    if (confirm("¿Seguro que quieres eliminar este pedido?")) {
      try {
        deletePedido(pedidoBorrador.id);
        toast.success("Pedido eliminado");
        loadPedidoBorrador();
      } catch (error) {
        toast.error("Error al eliminar pedido");
      }
    }
  };

  if (!pedidoBorrador) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto w-16 h-16 text-blue-400 mb-4" />
            <p className="text-blue-700 text-xl">No hay pedidos en borrador</p>
            <p className="text-blue-500 mt-2">Añade piezas desde el catálogo para crear un pedido</p>
            <Button
              onClick={() => navigate("/Catalogo-Stock")}
              className="mt-6 bg-blue-600 hover:bg-blue-700"
            >
              Ir al Catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">{pedidoBorrador.numero}</CardTitle>
                  <p className="text-sm text-blue-600">
                    Creado el {new Date(pedidoBorrador.fecha_creacion).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge className="bg-gray-500">Borrador</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600 font-medium">Líneas</p>
                <p className="text-3xl font-bold text-blue-900">{pedidoBorrador.lineas.length}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-sm text-indigo-600 font-medium">Total</p>
                <p className="text-3xl font-bold text-indigo-900">{pedidoBorrador.total.toFixed(2)}€</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600 font-medium">Unidades</p>
                <p className="text-3xl font-bold text-blue-900">
                  {pedidoBorrador.lineas.reduce((sum, l) => sum + l.cantidad, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Líneas del Pedido */}
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-blue-900">Líneas del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pedidoBorrador.lineas.length === 0 ? (
              <div className="text-center py-12">
                <PackageX className="mx-auto w-12 h-12 text-blue-400 mb-3" />
                <p className="text-blue-700">El pedido no tiene líneas</p>
                <Button
                  onClick={() => navigate("/Catalogo-Stock")}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Añadir Piezas
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-100 border-b border-blue-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Código</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Nombre</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Unidad</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase">PVP</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Cantidad</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase">Subtotal</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    {pedidoBorrador.lineas.map((linea) => (
                      <tr key={linea.piezaId} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-blue-800">{linea.codigo}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{linea.nombre}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-700">{linea.unidad}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{linea.pvp.toFixed(2)}€</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0 border-blue-300 hover:bg-blue-100"
                              onClick={() => handleUpdateCantidad(linea.piezaId, linea.cantidad - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={linea.cantidad}
                              onChange={(e) => handleUpdateCantidad(linea.piezaId, parseInt(e.target.value) || 1)}
                              className="w-16 h-7 text-center border-blue-200 focus:border-blue-400"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 w-7 p-0 border-blue-300 hover:bg-blue-100"
                              onClick={() => handleUpdateCantidad(linea.piezaId, linea.cantidad + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-blue-900">
                          {(linea.cantidad * linea.pvp).toFixed(2)}€
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 w-7 p-0"
                            onClick={() => handleRemoveLinea(linea.piezaId)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notas */}
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-blue-900">Notas del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Textarea
              placeholder="Añade notas o comentarios sobre este pedido..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              onBlur={handleUpdateNotas}
              className="min-h-[100px] border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
            <p className="text-xs text-blue-600 mt-2">Las notas se guardan automáticamente</p>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleDeletePedido}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar Pedido
          </Button>
          <Button
            onClick={() => navigate("/Catalogo-Stock")}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Más Piezas
          </Button>
          <Button
            onClick={handleCursarPedido}
            disabled={pedidoBorrador.lineas.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Cursar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}
