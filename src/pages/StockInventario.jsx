import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Search, 
  TrendingUp, 
  Minus, 
  Plus, 
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Layers,
  Filter
} from "lucide-react";
import { getStock, updateStock } from "@/api/stockService";
import { PIEZAS } from "@/data/piezas";
import { toast } from "sonner";

export default function StockInventario() {
  const [stock, setStock] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [categoriaFiltro, setCategoriaFiltro] = useState("all");

  const loadStock = async () => {
    const currentStock = await getStock();
    setStock(currentStock);
  };

  useEffect(() => {
    loadStock();
  }, []);

  const handleConsumir = async (pieza, cantidad) => {
    if (!cantidad || cantidad <= 0) {
      toast.error('Cantidad inválida');
      return;
    }

    const stockActual = stock[pieza.id] || 0;
    if (stockActual < cantidad) {
      toast.error(`Stock insuficiente. Disponible: ${stockActual}`);
      return;
    }

    try {
      updateStock(pieza.id, -cantidad);
      toast.success(`✅ ${cantidad} ${pieza.unidad} de ${pieza.nombre} consumidas`);
      loadStock();
    } catch (error) {
      toast.error('Error al consumir pieza');
    }
  };

  const handleAgregar = async (pieza, cantidad) => {
    if (!cantidad || cantidad <= 0) {
      toast.error('Cantidad inválida');
      return;
    }

    try {
      updateStock(pieza.id, cantidad);
      toast.success(`✅ ${cantidad} ${pieza.unidad} de ${pieza.nombre} agregadas al stock`);
      loadStock();
    } catch (error) {
      toast.error('Error al agregar pieza');
    }
  };

  const totalUnidades = Object.values(stock).reduce((sum, cant) => sum + cant, 0);
  const piezasConStock = Object.keys(stock).filter(id => stock[id] > 0).length;
  
  const valorTotal = PIEZAS.reduce((sum, pieza) => {
    const cantidad = stock[pieza.id] || 0;
    return sum + (cantidad * (pieza.pvp || 0));
  }, 0);

  const stockBajo = Object.keys(stock).filter(id => {
    const cantidad = stock[id] || 0;
    return cantidad > 0 && cantidad <= 5;
  }).length;

  const categorias = [...new Set(PIEZAS.map(p => p.categoria || 'Sin categoría'))];

  const piezasFiltradas = PIEZAS.filter(pieza => {
    const stockPieza = stock[pieza.id] || 0;
    const tieneStock = stockPieza > 0;
    const matchSearch = !searchTerm || 
      pieza.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pieza.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pieza.categoria || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === "all" || pieza.categoria === categoriaFiltro;
    return tieneStock && matchSearch && matchCategoria;
  });

  const getStockStatus = (cantidad) => {
    if (cantidad === 0) return { color: 'bg-gray-100 text-gray-800', icon: Package, label: 'Sin stock' };
    if (cantidad <= 3) return { color: 'bg-red-100 text-red-800', icon: AlertTriangle, label: 'Crítico' };
    if (cantidad <= 5) return { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, label: 'Bajo' };
    if (cantidad <= 10) return { color: 'bg-blue-100 text-blue-800', icon: Layers, label: 'Normal' };
    return { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Óptimo' };
  };

  const getCategoryColor = (categoria) => {
    const colors = {
      'Neumáticos': 'bg-slate-100 text-slate-700 border-slate-300',
      'Frenos': 'bg-red-100 text-red-700 border-red-300',
      'Eléctrico': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Suspensión': 'bg-blue-100 text-blue-700 border-blue-300',
      'Motor': 'bg-purple-100 text-purple-700 border-purple-300',
      'Carrocería': 'bg-green-100 text-green-700 border-green-300',
    };
    return colors[categoria] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              Inventario de Stock
            </h1>
            <p className="text-slate-600 mt-1">Gestión y control de piezas disponibles</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Piezas en Stock</CardTitle>
              <Package className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{piezasConStock}</div>
              <p className="text-xs text-slate-500 mt-1">Tipos diferentes</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Unidades</CardTitle>
              <Layers className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{totalUnidades}</div>
              <p className="text-xs text-slate-500 mt-1">Unidades totales</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Stock Bajo</CardTitle>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stockBajo}</div>
              <p className="text-xs text-slate-500 mt-1">Requieren atención</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Valor Total</CardTitle>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">${valorTotal.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Inventario valorado</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por nombre, código o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-500" />
                <select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  className="h-11 px-4 rounded-md border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {piezasFiltradas.map(pieza => {
            const cantidadStock = stock[pieza.id] || 0;
            const cantidad = cantidades[pieza.id] || 1;
            const status = getStockStatus(cantidadStock);
            const StatusIcon = status.icon;

            return (
              <Card 
                key={pieza.id} 
                className={`hover:shadow-xl transition-all duration-300 ${
                  cantidadStock <= 3 ? 'ring-2 ring-red-300 ring-offset-2' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold text-slate-900 truncate">
                        {pieza.nombre}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {pieza.codigo}
                        </code>
                      </div>
                    </div>
                    <Badge className={`${status.color} flex items-center gap-1 px-2 py-1`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">{status.label}</span>
                    </Badge>
                  </div>
                  {pieza.categoria && (
                    <Badge variant="outline" className={`mt-2 w-fit ${getCategoryColor(pieza.categoria)}`}>
                      {pieza.categoria}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stock actual */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-600 font-medium">Stock Disponible</p>
                        <div className="text-3xl font-bold text-blue-900 mt-1">
                          {cantidadStock}
                          <span className="text-lg text-blue-600 ml-2">{pieza.unidad}</span>
                        </div>
                      </div>
                      {pieza.pvp && (
                        <div className="text-right">
                          <p className="text-xs text-blue-600 font-medium">Precio Unit.</p>
                          <p className="text-lg font-bold text-blue-900">${pieza.pvp}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cantidad selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">Cantidad a mover:</label>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCantidades({
                          ...cantidades,
                          [pieza.id]: Math.max(1, cantidad - 1)
                        })}
                        className="h-10 w-10 p-0 hover:bg-slate-100"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidades({
                          ...cantidades,
                          [pieza.id]: parseInt(e.target.value) || 1
                        })}
                        className="text-center text-lg font-semibold h-10"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCantidades({
                          ...cantidades,
                          [pieza.id]: cantidad + 1
                        })}
                        className="h-10 w-10 p-0 hover:bg-slate-100"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleConsumir(pieza, cantidad)}
                      className="h-10 font-medium shadow-sm hover:shadow"
                      disabled={cantidadStock < cantidad}
                    >
                      <Minus className="w-4 h-4 mr-1" />
                      Consumir
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAgregar(pieza, cantidad)}
                      className="h-10 font-medium bg-green-600 hover:bg-green-700 shadow-sm hover:shadow"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </div>

                  {/* Valor total */}
                  {pieza.pvp && (
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Valor en stock:</span>
                        <span className="font-bold text-slate-900">
                          ${(cantidadStock * pieza.pvp).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty state */}
        {piezasFiltradas.length === 0 && (
          <Card>
            <CardContent className="text-center py-16">
              <Package className="mx-auto w-20 h-20 text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No hay piezas en stock</h3>
              <p className="text-slate-600">
                {searchTerm || categoriaFiltro !== "all" 
                  ? "Intenta ajustar los filtros de búsqueda" 
                  : "Agrega piezas al inventario para comenzar"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
