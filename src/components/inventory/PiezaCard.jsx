import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { getStockPieza } from "@/api/stockService";

export default function PiezaCard({ pieza, onAddToPedido }) {
  const stock = getStockPieza(pieza.id);
  const hasStock = stock > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white hover:shadow-xl transition-all duration-300 border-blue-200/60">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold text-blue-900 leading-tight">
                  {pieza.nombre}
                </CardTitle>
                <p className="text-xs text-blue-600 mt-1 font-mono">{pieza.codigo}</p>
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
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="text-xs text-blue-600 font-medium">Precio</p>
              <p className="text-base font-bold text-blue-900">{pieza.pvp.toFixed(2)}€</p>
            </div>
            <div className="bg-indigo-50 p-2 rounded-lg">
              <p className="text-xs text-indigo-600 font-medium">Unidad</p>
              <p className="text-base font-bold text-indigo-900">{pieza.unidad}</p>
            </div>
          </div>

          <Button
            onClick={() => onAddToPedido(pieza)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
