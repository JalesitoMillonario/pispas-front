import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, X, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function IncidentFilters({ onFilterChange, filters, onClearFilters }) {
  const handleFilterChange = (type, value) => {
    onFilterChange({ ...filters, [type]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== "all");

  return (
    <div className="bg-white rounded-xl border border-green-200/60 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Filtros de Búsqueda</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              Activos
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-green-500 hover:text-green-700 hover:bg-green-50"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-green-400" />
          <Input
            placeholder="Buscar por moto, ubicación..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-9 border-green-200 focus:border-green-500"
          />
        </div>

        <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="border-green-200 focus:border-green-500">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🔍 Todos los Estados</SelectItem>
            <SelectItem value="open">🔴 Abiertas</SelectItem>
            <SelectItem value="in_progress">🔧 En Reparación</SelectItem>
            <SelectItem value="resolved">✅ Resueltas</SelectItem>
            <SelectItem value="closed">⚫ Cerradas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.priority || "all"} onValueChange={(value) => handleFilterChange("priority", value)}>
          <SelectTrigger className="border-green-200 focus:border-green-500">
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🔍 Todas las Prioridades</SelectItem>
            <SelectItem value="critical">🚨 Crítica</SelectItem>
            <SelectItem value="high">🔴 Alta</SelectItem>
            <SelectItem value="medium">🟡 Media</SelectItem>
            <SelectItem value="low">🟢 Baja</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.category || "all"} onValueChange={(value) => handleFilterChange("category", value)}>
          <SelectTrigger className="border-green-200 focus:border-green-500">
            <SelectValue placeholder="Tipo de Incidencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🔍 Todas las Categorías</SelectItem>
            <SelectItem value="mechanical_failure">🔧 Avería Mecánica</SelectItem>
            <SelectItem value="flat_tire">🛞 Pinchazo</SelectItem>
            <SelectItem value="battery_issue">🔋 Problema Batería</SelectItem>
            <SelectItem value="electrical_problem">⚡ Problema Eléctrico</SelectItem>
            <SelectItem value="accident">💥 Accidente</SelectItem>
            <SelectItem value="billing_issue">💳 Problema Cobro</SelectItem>
            <SelectItem value="theft">🚨 Robo</SelectItem>
            <SelectItem value="user_error">👤 Error Usuario</SelectItem>
            <SelectItem value="maintenance">🔧 Mantenimiento</SelectItem>
            <SelectItem value="other">📋 Otro</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.requires_pickup || "all"} onValueChange={(value) => handleFilterChange("requires_pickup", value)}>
          <SelectTrigger className="border-green-200 focus:border-green-500">
            <SelectValue placeholder="Recoger Moto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🔍 Todas</SelectItem>
            <SelectItem value="true">🚚 Necesita Recogida</SelectItem>
            <SelectItem value="false">📍 En Ubicación</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}