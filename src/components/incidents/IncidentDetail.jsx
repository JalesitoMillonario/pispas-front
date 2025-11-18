import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar,
  User,
  Clock,
  Tag,
  MessageSquare,
  Save,
  X,
  MapPin,
  Phone,
  Zap,
  Euro,
  Truck,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Wrench,
  Users
} from "lucide-react";
import { apiClient } from "../apiClient";

const statusConfig = {
  open: { label: "Abierta", color: "bg-red-50 text-red-700 border-red-200", icon: AlertCircle },
  in_progress: { label: "En Reparación", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Wrench },
  resolved: { label: "Resuelta", color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2 },
  closed: { label: "Cerrada", color: "bg-gray-50 text-gray-700 border-gray-200", icon: XCircle }
};

const priorityConfig = {
  low: { label: "Baja", color: "bg-slate-100 text-slate-700 border-slate-200" },
  medium: { label: "Media", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  high: { label: "Alta", color: "bg-orange-100 text-orange-800 border-orange-200" },
  critical: { label: "Crítica", color: "bg-red-100 text-red-800 border-red-200" }
};

const categoryConfig = {
  mechanical_failure: { label: "Avería Mecánica", icon: "🔧" },
  flat_tire: { label: "Pinchazo", icon: "🛞" },
  battery_issue: { label: "Batería", icon: "🔋" },
  electrical_problem: { label: "Eléctrico", icon: "⚡" },
  accident: { label: "Accidente", icon: "💥" },
  billing_issue: { label: "Facturación", icon: "💳" },
  theft: { label: "Robo", icon: "🚨" },
  user_error: { label: "Error Usuario", icon: "👤" },
  maintenance: { label: "Mantenimiento", icon: "🔧" },
  other: { label: "Otro", icon: "📋" }
};

const sourceConfig = {
  app_user: { label: "App Usuario", icon: "📱" },
  call_center: { label: "Call Center", icon: "📞" },
  technician: { label: "Técnico", icon: "🔧" },
  automatic: { label: "Automático", icon: "🤖" },
  web: { label: "Web", icon: "🌐" },
  whatsapp_bot: { label: "WhatsApp Bot", icon: "💬" }
};

export default function IncidentDetail({ incident, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [editData, setEditData] = useState({
    status: incident.status,
    assigned_to: incident.assigned_to || "",
    resolution_notes: incident.resolution_notes || ""
  });

  useEffect(() => {
    if (isEditing && users.length === 0) {
      loadUsers();
    }
  }, [isEditing]);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const usersList = await apiClient.entities.User.list();
      setUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSave = async () => {
    const updateData = { ...editData };
    if (editData.status === "resolved" || editData.status === "closed") {
      updateData.resolution_date = new Date().toISOString().split('T')[0];
    }
    
    await apiClient.entities.Incident.update(incident.id, updateData);
    onUpdate();
    setIsEditing(false);
  };

  if (!incident) return null;

  const currentStatus = statusConfig[incident.status] || statusConfig.open;
  const currentPriority = priorityConfig[incident.priority] || priorityConfig.medium;
  const currentCategory = categoryConfig[incident.category] || categoryConfig.other;
  const currentSource = sourceConfig[incident.source] || sourceConfig.app_user;
  const StatusIcon = currentStatus.icon;

  // Encontrar el usuario asignado para mostrar su nombre
  const assignedUser = users.find(u => u.email === incident.assigned_to);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
        <Card className="border-none shadow-none">
          {/* Header */}
          <CardHeader className="border-b border-gray-200 pb-6 bg-white sticky top-0 z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${currentStatus.color} border`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      #{incident.number}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`${currentStatus.color} border`}>
                        {currentStatus.label}
                      </Badge>
                      <Badge className={`${currentPriority.color} border`}>
                        {currentPriority.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* ID de Viaje - PRIMERO */}
            {incident.trip_id && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-600 font-semibold mb-1">ID DE VIAJE</p>
                <p className="text-3xl font-bold text-blue-900">{incident.trip_id}</p>
              </div>
            )}

            {/* Título */}
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">Título</p>
              <h2 className="text-xl font-bold text-gray-900">{incident.title}</h2>
            </div>

            {/* Descripción */}
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">Descripción</p>
              <p className="text-base text-gray-700 leading-relaxed">{incident.description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1">Categoría</p>
                <p className="text-base font-semibold text-gray-900">
                  {currentCategory.icon} {currentCategory.label}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1">Origen</p>
                <p className="text-base font-semibold text-gray-900">
                  {currentSource.icon} {currentSource.label}
                </p>
              </div>

              {incident.scooter_id && (
                <div>
                  <p className="text-sm text-gray-500 font-semibold mb-1">ID Moto</p>
                  <p className="text-base font-semibold text-gray-900">{incident.scooter_id}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1">Fecha Creación</p>
                <p className="text-base font-semibold text-gray-900">
                  {format(new Date(incident.created_date), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
            </div>

            {/* Ubicación */}
            {incident.location && (
              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Ubicación
                </p>
                <p className="text-base text-gray-900">{incident.location}</p>
              </div>
            )}

            {/* Usuario */}
            {(incident.reported_by || incident.user_phone) && (
              <div className="grid grid-cols-2 gap-4">
                {incident.reported_by && (
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Reportado por</p>
                    <p className="text-base text-gray-900">{incident.reported_by}</p>
                  </div>
                )}
                {incident.user_phone && (
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Teléfono
                    </p>
                    <p className="text-base text-gray-900">{incident.user_phone}</p>
                  </div>
                )}
              </div>
            )}

            {/* Coste y Recogida */}
            {(incident.estimated_cost || incident.requires_pickup) && (
              <div className="grid grid-cols-2 gap-4">
                {incident.estimated_cost && (
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                      <Euro className="w-4 h-4" />
                      Coste Estimado
                    </p>
                    <p className="text-2xl font-bold text-orange-600">{incident.estimated_cost}€</p>
                  </div>
                )}

                {incident.requires_pickup && (
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Recogida
                    </p>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-base px-3 py-1">
                      🚚 Requiere recogida
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Asignación - CON SELECTOR */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-700 font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Asignada a
              </p>
              {isEditing ? (
                <Select 
                  value={editData.assigned_to} 
                  onValueChange={(value) => setEditData({...editData, assigned_to: value})}
                  disabled={isLoadingUsers}
                >
                  <SelectTrigger className="bg-white border-purple-300">
                    <SelectValue placeholder={isLoadingUsers ? "Cargando mecánicos..." : "Seleccionar mecánico"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Sin asignar</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.email} value={user.email}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user.full_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span>{user.full_name || user.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-3">
                  {incident.assigned_to ? (
                    <>
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {assignedUser?.full_name?.[0]?.toUpperCase() || incident.assigned_to[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-base font-bold text-gray-900">
                          {assignedUser?.full_name || incident.assigned_to}
                        </p>
                        <p className="text-sm text-gray-500">{incident.assigned_to}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-base text-gray-500 italic">Sin asignar</p>
                  )}
                </div>
              )}
            </div>

            {/* Estado (solo en modo edición) */}
            {isEditing && (
              <div>
                <Label className="text-sm text-gray-500 font-semibold mb-2 block">Cambiar Estado</Label>
                <Select value={editData.status} onValueChange={(value) => setEditData({...editData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">🔴 Abierta</SelectItem>
                    <SelectItem value="in_progress">🔧 En Reparación</SelectItem>
                    <SelectItem value="resolved">✅ Resuelta</SelectItem>
                    <SelectItem value="closed">⚫ Cerrada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Notas de Resolución */}
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-2 flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                Notas de Resolución
              </p>
              {isEditing ? (
                <Textarea
                  value={editData.resolution_notes}
                  onChange={(e) => setEditData({...editData, resolution_notes: e.target.value})}
                  placeholder="Agregar notas sobre cómo se resolvió la incidencia..."
                  rows={5}
                  className="border-gray-300"
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 min-h-[80px] border border-gray-200">
                  <p className="text-base text-gray-700">
                    {incident.resolution_notes || "Sin notas de resolución"}
                  </p>
                </div>
              )}
            </div>

            {/* Botones */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}