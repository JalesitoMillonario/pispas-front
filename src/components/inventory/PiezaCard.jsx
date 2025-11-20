import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus, PackageOpen, ChevronDown, ChevronUp } from "lucide-react";
import { getStockPieza } from "@/api/stockService";
import { isKit, getKitInfo } from "@/data/piezas";

export default function PiezaCard({ pieza, onAddToPedido }) {
  const stock = getStockPieza(pieza.id);
  const hasStock = stock > 0;
  const esKit = isKit(pieza);
  const kitInfo = esKit ? getKitInfo(pieza) : null;
  const [mostrarKitInfo, setMostrarKitInfo] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`bg-white hover:shadow-xl transition-all duration-300 ${esKit ? 'border-amber-300 border-2' : 'border-blue-200/60'}`}>
        <CardHeader className={`bg-gradient-to-r ${esKit ? 'from-amber-50 to-orange-50' : 'from-blue-50 to-indigo-50'} border-b ${esKit ? 'border-amber-100' : 'border-blue-100'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className={`${esKit ? 'bg-amber-600' : 'bg-blue-600'} p-2 rounded-lg`}>
                {esKit ? (
                  <PackageOpen className="w-5 h-5 text-white" />
                ) : (
                  <Package className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className={`text-base font-semibold ${esKit ? 'text-amber-900' : 'text-blue-900'} leading-tight`}>
                    {pieza.nombre}
                  </CardTitle>
                  {esKit && (
                    <Badge className="bg-amber-600 text-white text-xs">KIT</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {pieza.num && (
                    <Badge variant="outline" className={`${esKit ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-blue-100 text-blue-700 border-blue-300'} text-xs`}>
                      #{pieza.num}
                    </Badge>
                  )}
                  <p className={`text-xs ${esKit ? 'text-amber-600' : 'text-blue-600'} font-mono`}>{pieza.codigo}</p>
                </div>
              </div>
            </div>
            <Badge
              variant={hasStock ? "default" : "secondary"}
              className={hasStock ? "bg-green-600" : "bg-gray-400"}
            >
              Stock: {stock}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          {esKit && kitInfo && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-amber-900">
                  {kitInfo.descripcion}
                </p>
                <button
                  onClick={() => setMostrarKitInfo(!mostrarKitInfo)}
                  className="text-amber-700 hover:text-amber-900 transition-colors"
                >
                  {mostrarKitInfo ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
              {mostrarKitInfo && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-amber-800 mb-1">Incluye:</p>
                  <ul className="space-y-1">
                    {kitInfo.incluye.map((item, idx) => (
                      <li key={idx} className="text-xs text-amber-700 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className={`${esKit ? 'bg-amber-50' : 'bg-blue-50'} p-2 rounded-lg`}>
              <p className={`text-xs ${esKit ? 'text-amber-600' : 'text-blue-600'} font-medium`}>Precio</p>
              <p className={`text-base font-bold ${esKit ? 'text-amber-900' : 'text-blue-900'}`}>{pieza.pvp.toFixed(2)}€</p>
            </div>
            <div className={`${esKit ? 'bg-orange-50' : 'bg-indigo-50'} p-2 rounded-lg`}>
              <p className={`text-xs ${esKit ? 'text-orange-600' : 'text-indigo-600'} font-medium`}>Unidad</p>
              <p className={`text-base font-bold ${esKit ? 'text-orange-900' : 'text-indigo-900'}`}>{pieza.unidad}</p>
            </div>
          </div>

          <Button
            onClick={() => onAddToPedido(pieza)}
            className={`w-full ${esKit ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Añadir a pedido
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
