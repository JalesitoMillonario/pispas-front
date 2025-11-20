import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Box, Search, Package } from "lucide-react";
import { getStock } from "@/api/stockService";
import { PIEZAS } from "@/data/piezas";

export default function StockInventario() {
  const [stock, setStock] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const currentStock = getStock();
    setStock(currentStock);
  }, []);

  const totalUnidades = Object.values(stock).reduce((sum, cant) => sum + cant, 0);
  const piezasConStock = Object.keys(stock).filter(id => stock[id] > 0).length;

  // Filtrar piezas por búsqueda y stock disponible
  const piezasFiltradas = PIEZAS.filter(pieza => {
    const stockPieza = stock[pieza.id] || 0;
    const tieneStock = stockPieza > 0;

    if (!tieneStock) return false;

    if (!searchTerm) return true;
    return (
      pieza.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pieza.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Resumen */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Unidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{totalUnidades}</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Referencias en Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{piezasConStock}</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Catálogo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{PIEZAS.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar pieza por código o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>

        {/* Tabla de Stock */}
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Inventario Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-100 border-b border-blue-200">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase">NUM</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Código</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Categoría</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Unidad</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase">PVP</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {piezasFiltradas.map((pieza) => {
                    const stockPieza = stock[pieza.id] || 0;
                    const hasStock = stockPieza > 0;

                    return (
                      <tr key={pieza.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-center">
                          {pieza.num ? (
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                              #{pieza.num}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-blue-800">{pieza.codigo}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{pieza.nombre}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{pieza.categoria.split(' ')[0]}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-700">{pieza.unidad}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{pieza.pvp.toFixed(2)}€</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={hasStock ? "bg-green-600" : "bg-gray-400"}>
                            {stockPieza}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
