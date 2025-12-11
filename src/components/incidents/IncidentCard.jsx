import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  MapPin,
  Wrench,
  Euro,
  Trash2,
  Phone,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusConfig = {
  open: { 
    label: "Abierta", 
    color: "bg-red-50 text-red-700 border-red-200", 
    icon: AlertCircle,
    dotColor: "bg-red-500",
    accentColor: "from-red-500 to-red-600"
  },
  in_progress: { 
    label: "En Reparación", 
    color: "bg-blue-50 text-blue-700 border-blue-200", 
    icon: Wrench,
    dotColor: "bg-blue-500",
    accentColor: "from-blue-500 to-blue-600"
  },
  resolved: { 
    label: "Resuelta", 
    color: "bg-green-50 text-green-700 border-green-200", 
    icon: CheckCircle2,
    dotColor: "bg-green-500",
    accentColor: "from-green-500 to-green-600"
  },
  closed: { 
    label: "Cerrada", 
    color: "bg-gray-50 text-gray-700 border-gray-200", 
    icon: XCircle,
    dotColor: "bg-gray-500",
    accentColor: "from-gray-500 to-gray-600"
  }
};

const priorityConfig = {
  low: { label: "Baja", color: "bg-slate-100 text-slate-700 border-slate-200", borderAccent: "border-l-slate-400" },
  medium: { label: "Media", color: "bg-yellow-100 text-yellow-800 border-yellow-200", borderAccent: "border-l-yellow-500" },
  high: { label: "Alta", color: "bg-orange-100 text-orange-800 border-orange-200", borderAccent: "border-l-orange-500" },
  critical: { label: "Crítica", color: "bg-red-100 text-red-800 border-red-200", borderAccent: "border-l-red-600" }
};

const categoryConfig = {
  mechanical_failure: { label: "Avería Mecánica", color: "bg-red-100 text-red-800", icon: "🔧" },
  flat_tire: { label: "Pinchazo", color: "bg-orange-100 text-orange-800", icon: "🛞" },
  battery_issue: { label: "Batería", color: "bg-yellow-100 text-yellow-800", icon: "🔋" },
  electrical_problem: { label: "Eléctrico", color: "bg-purple-100 text-purple-800", icon: "⚡" },
  accident: { label: "Accidente", color: "bg-red-100 text-red-800", icon: "💥" },
  billing_issue: { label: "Facturación", color: "bg-blue-100 text-blue-800", icon: "💳" },
  theft: { label: "Robo", color: "bg-red-100 text-red-800", icon: "🚨" },
  user_error: { label: "Error Usuario", color: "bg-gray-100 text-gray-800", icon: "👤" },
  maintenance: { label: "Mantenimiento", color: "bg-green-100 text-green-800", icon: "🔧" },
  other: { label: "Otro", color: "bg-gray-100 text-gray-800", icon: "📋" }
};

const sourceConfig = {
  app_user: { label: "App", icon: "📱" },
  call_center: { label: "Call Center", icon: "📞" },
  technician: { label: "Técnico", icon: "🔧" },
  automatic: { label: "Automático", icon: "🤖" },
  web: { label: "Web", icon: "🌐" },
  whatsapp_bot: { label: "WhatsApp", icon: "💬" }
};

export default function IncidentCard({ incident, onStatusChange, onView, onDelete }) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  
  const currentStatus = statusConfig[incident.status] || statusConfig.open;
  const currentPriority = priorityConfig[incident.priority] || priorityConfig.medium;
  const currentCategory = categoryConfig[incident.category] || categoryConfig.other;
  const currentSource = sourceConfig[incident.source] || sourceConfig.app_user;
  
  const StatusIcon = currentStatus.icon;

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(incident);
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`bg-white hover:shadow-xl transition-all duration-300 border-blue-200/60 border-l-4 ${currentPriority.borderAccent} overflow-hidden h-full flex flex-col`}>
          {/* Header con ID de Viaje prominente */}
          <CardHeader className={`pb-3 bg-gradient-to-r ${currentStatus.accentColor} text-white border-b border-white/20`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {/* ID de Viaje como referencia principal */}
                <div className="mb-2">
                  <p className="text-xs text-white/70 font-medium mb-1">VIAJE</p>
                  <p className="text-2xl font-bold text-white tracking-wide">
                    {incident.trip_id || '—'}
                  </p>
                </div>
                
                {/* Estado y número */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                    #{incident.number}
                  </span>
                  <Badge className="bg-white/90 text-gray-900 border-0 font-medium text-xs">
                    {currentStatus.label}
                  </Badge>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onStatusChange(incident, "open")}>
                    <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                    Marcar como Abierta
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(incident, "in_progress")}>
                    <Wrench className="w-4 h-4 mr-2 text-blue-500" />
                    En Reparación
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(incident, "resolved")}>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    Marcar como Resuelta
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(incident, "closed")}>
                    <XCircle className="w-4 h-4 mr-2 text-gray-500" />
                    Cerrar Incidencia
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pt-4 flex-1 flex flex-col">
            {/* Título y descripción */}
            <div className="mb-4">
              <h3 className="font-bold text-blue-900 text-base mb-2 line-clamp-2">
                {incident.title}
              </h3>
              <p className="text-blue-600 text-sm line-clamp-2 mb-3">
                {incident.description}
              </p>
            </div>

            {/* Badges de categoría y prioridad */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`${currentCategory.color} font-medium text-xs border`}>
                <span className="mr-1">{currentCategory.icon}</span>
                {currentCategory.label}
              </Badge>
              <Badge className={`${currentPriority.color} font-medium text-xs border-2`}>
                {currentPriority.label}
              </Badge>
              {incident.requires_pickup && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 text-xs font-medium">
                  🚚 Recoger
                </Badge>
              )}
            </div>

            {/* Información detallada */}
            <div className="space-y-2 mb-4 flex-1">
              {/* Ubicación */}
              {incident.location && (
                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-blue-600 line-clamp-1">{incident.location}</span>
                </div>
              )}

              {/* Usuario */}
              {incident.reported_by && (
                <div className="flex items-start gap-2 text-xs">
                  <User className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-blue-600">{incident.reported_by}</span>
                    {incident.user_phone && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500">{incident.user_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Coste estimado */}
              {incident.estimated_cost && (
                <div className="flex items-center gap-2 text-xs">
                  <Euro className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-semibold text-orange-700">{incident.estimated_cost}€</span>
                  <span className="text-gray-500">estimado</span>
                </div>
              )}
            </div>

            {/* Footer con fecha y origen */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-blue-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(incident.created_date), "d MMM", { locale: es })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{currentSource.icon}</span>
                  <span className="font-medium text-blue-600">{currentSource.label}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onView(incident)}
                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-xs px-3 h-7"
              >
                Ver Más
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-700">
              <Trash2 className="w-5 h-5" />
              ¿Eliminar incidencia?
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar la incidencia <span className="font-bold">#{incident.number}</span> del viaje <span className="font-bold">{incident.trip_id}</span>?
              <br />
              <span className="text-red-600 font-semibold">Esta acción no se puede deshacer.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}