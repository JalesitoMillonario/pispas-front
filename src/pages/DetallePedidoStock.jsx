import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Package, ArrowLeft, CheckCircle2 } from "lucide-react";
import { getPedidoById, recibirPedido, ESTADOS_PEDIDO } from "@/api/stockService";
import { toast } from "sonner";

export default function DetallePedidoStock() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);

  const loadPedido = () => {
    const pedidoData = getPedidoById(parseInt(id));
    setPedido(pedidoData);
  };

  useEffect(() => {
    loadPedido();
  }, [id]);

  const handleRecibirMercancia = () => {
    try {
      // Recibir todas las líneas con la cantidad pedida
      const lineasRecibidas = pedido.lineas.map(linea => ({
        piezaId: linea.piezaId,
        cantidadRecibida: linea.cantidad - (linea.cantidad_recibida || 0)
      }));

      recibirPedido(pedido.id, lineasRecibidas);
      toast.success("Mercancía recibida correctamente");
      loadPedido();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      [ESTADOS_PEDIDO.BORRADOR]: { className: "bg-gray-500", label: "Borrador" },
      [ESTADOS_PEDIDO.CURSADO]: { className: "bg-blue-500", label: "Cursado" },
      [ESTADOS_PEDIDO.RECIBIDO]: { className: "bg-green-600", label: "Recibido" }
    };
    return badges[estado] || badges[ESTADOS_PEDIDO.BORRADOR];
  };

  if (!pedido) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <Package className="mx-auto w-16 h-16 text-blue-400 mb-4" />
          <p className="text-blue-700 text-xl">Pedido no encontrado</p>
          <Button
            onClick={() => navigate("/Pedidos-Stock")}
            className="mt-6 bg-blue-600 hover:bg-blue-700"
          >
            Volver a Pedidos
          </Button>
        </div>
      </div>
    );
  }

  const estadoBadge = getEstadoBadge(pedido.estado);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Botón volver */}
        <Button
          variant="outline"
          onClick={() => navigate("/Pedidos-Stock")}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Pedidos
        </Button>

        {/* Header Card */}
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-900">{pedido.numero}</CardTitle>
                  <p className="text-sm text-blue-600">
                    Creado el {new Date(pedido.fecha_creacion).toLocaleDateString()}
                  </p>
                  {pedido.fecha_cursado && (
                    <p className="text-sm text-blue-600">
                      Cursado el {new Date(pedido.fecha_cursado).toLocaleDateString()}
                    </p>
                  )}
                  {pedido.fecha_recibido && (
                    <p className="text-sm text-green-600">
                      Recibido el {new Date(pedido.fecha_recibido).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <Badge className={estadoBadge.className}>{estadoBadge.label}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600 font-medium">Líneas</p>
                <p className="text-3xl font-bold text-blue-900">{pedido.lineas.length}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-sm text-indigo-600 font-medium">Total</p>
                <p className="text-3xl font-bold text-indigo-900">{pedido.total.toFixed(2)}€</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600 font-medium">Unidades</p>
                <p className="text-3xl font-bold text-blue-900">
                  {pedido.lineas.reduce((sum, l) => sum + l.cantidad, 0)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-600 font-medium">Recibidas</p>
                <p className="text-3xl font-bold text-green-900">
                  {pedido.lineas.reduce((sum, l) => sum + (l.cantidad_recibida || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        {pedido.notas && (
          <Card className="border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-blue-900">Notas del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-wrap">{pedido.notas}</p>
            </CardContent>
          </Card>
        )}

        {/* Líneas del Pedido */}
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-blue-900">Líneas del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-100 border-b border-blue-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Código</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Unidad</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase">PVP</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Cantidad</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Recibida</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {pedido.lineas.map((linea) => (
                    <tr key={linea.piezaId} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-blue-800">{linea.codigo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{linea.nombre}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-700">{linea.unidad}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{linea.pvp.toFixed(2)}€</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className="bg-blue-600">{linea.cantidad}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={linea.cantidad_recibida >= linea.cantidad ? "bg-green-600" : "bg-orange-500"}>
                          {linea.cantidad_recibida || 0}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-blue-900">
                        {(linea.cantidad * linea.pvp).toFixed(2)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        {pedido.estado === ESTADOS_PEDIDO.CURSADO && (
          <div className="flex justify-end">
            <Button
              onClick={handleRecibirMercancia}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Recibir Mercancía Completa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
