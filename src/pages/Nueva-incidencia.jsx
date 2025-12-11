import React, { useState } from "react";
import { apiClient } from "../components/apiClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function NuevaIncidenciaPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
    category: "mechanical_failure",
    trip_id: "",
    location: "",
    user_phone: "",
    reported_by: "",
    source: "web",
    estimated_cost: "",
    requires_pickup: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.estimated_cost === "") {
        delete dataToSubmit.estimated_cost;
      }
      
      await apiClient.entities.Incident.create(dataToSubmit);
      navigate("/Pendientes");
    } catch (error) {
      console.error('Error creating incident:', error);
      alert('Error al crear la incidencia. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Nueva Incidencia</h1>
              <p className="text-blue-600 font-medium">Registra una nueva incidencia en el sistema</p>
            </div>
          </div>
        </motion.div>

        <Card className="shadow-xl border-blue-200/60">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/60">
            <CardTitle className="text-xl text-blue-900">Detalles de la Incidencia</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-blue-700 font-semibold">
                    Título *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Breve descripción del problema"
                    required
                    className="border-blue-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-blue-700 font-semibold">
                    Descripción *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe el problema en detalle"
                    rows={4}
                    required
                    className="border-blue-200"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-blue-700 font-semibold">
                    Categoría
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                </div>

                <div>
                  <Label htmlFor="priority" className="text-blue-700 font-semibold">
                    Prioridad
                  </Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger className="border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Baja</SelectItem>
                      <SelectItem value="medium">🟡 Media</SelectItem>
                      <SelectItem value="high">🔴 Alta</SelectItem>
                      <SelectItem value="critical">🚨 Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="trip_id" className="text-blue-700 font-semibold">
                    ID de Viaje / Moto
                  </Label>
                  <Input
                    id="trip_id"
                    value={formData.trip_id}
                    onChange={(e) => setFormData({...formData, trip_id: e.target.value})}
                    placeholder="Ej: TRIP-12345 o SCOOTER-123"
                    className="border-blue-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="location" className="text-blue-700 font-semibold">
                    Ubicación
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Dirección o ubicación donde ocurrió"
                    className="border-blue-200"
                  />
                </div>

                <div>
                  <Label htmlFor="reported_by" className="text-blue-700 font-semibold">
                    Reportado por
                  </Label>
                  <Input
                    id="reported_by"
                    value={formData.reported_by}
                    onChange={(e) => setFormData({...formData, reported_by: e.target.value})}
                    placeholder="Nombre de quien reporta"
                    className="border-blue-200"
                  />
                </div>

                <div>
                  <Label htmlFor="user_phone" className="text-blue-700 font-semibold">
                    Teléfono
                  </Label>
                  <Input
                    id="user_phone"
                    value={formData.user_phone}
                    onChange={(e) => setFormData({...formData, user_phone: e.target.value})}
                    placeholder="+34 600 000 000"
                    className="border-blue-200"
                  />
                </div>

                <div>
                  <Label htmlFor="estimated_cost" className="text-blue-700 font-semibold">
                    Coste Estimado (€)
                  </Label>
                  <Input
                    id="estimated_cost"
                    type="number"
                    step="0.01"
                    value={formData.estimated_cost}
                    onChange={(e) => setFormData({...formData, estimated_cost: e.target.value})}
                    placeholder="0.00"
                    className="border-blue-200"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-6">
                  <Switch
                    id="requires_pickup"
                    checked={formData.requires_pickup}
                    onCheckedChange={(checked) => setFormData({...formData, requires_pickup: checked})}
                  />
                  <Label htmlFor="requires_pickup" className="text-blue-700 font-semibold cursor-pointer">
                    🚚 Requiere recogida de moto
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-blue-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/Pendientes")}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Crear Incidencia
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}