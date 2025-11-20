
import React, { useState, useEffect } from "react";
import { apiClient } from "../components/apiClient";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertTriangle, Wrench, CheckSquare, Zap, Clock, TrendingUp, Calendar, MapPin, ArrowRight, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAutoRefresh } from "../components/hooks/useAutoRefresh";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    byCategory: [],
    byDay: [],
    byPriority: [],
    byStatus: [],
    avgResolutionTime: 0,
    totalIncidents: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  // Auto-refresh cada 30 segundos
  useAutoRefresh(() => {
    loadStats(true);
  }, 30);

  const handleCardClick = (route) => {
    navigate(route);
  };

  const loadStats = async (isAutoRefresh = false) => {
    if (isAutoRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const incidents = await apiClient.entities.Incident.list();
      
      const open = incidents.filter(i => i.status === 'open').length;
      const inProgress = incidents.filter(i => i.status === 'in_progress').length;
      const resolved = incidents.filter(i => i.status === 'resolved' || i.status === 'closed').length;
      const critical = incidents.filter(i => i.priority === 'critical').length;

      // Categorías
      const byCategory = incidents.reduce((acc, i) => {
        const category = i.category || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      // Por día (últimos 7 días)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      });

      const byDay = last7Days.map(day => {
        const count = incidents.filter(i => {
          const incidentDate = new Date(i.created_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
          return incidentDate === day;
        }).length;
        return { name: day, incidencias: count };
      });

      // Por prioridad
      const byPriority = [
        { name: 'Crítica', value: incidents.filter(i => i.priority === 'critical').length, color: '#ef4444' },
        { name: 'Alta', value: incidents.filter(i => i.priority === 'high').length, color: '#f97316' },
        { name: 'Media', value: incidents.filter(i => i.priority === 'medium').length, color: '#eab308' },
        { name: 'Baja', value: incidents.filter(i => i.priority === 'low').length, color: '#64748b' }
      ].filter(item => item.value > 0);

      // Por estado
      const byStatus = [
        { name: 'Abiertas', value: open, color: '#ef4444' },
        { name: 'En Proceso', value: inProgress, color: '#3b82f6' },
        { name: 'Resueltas', value: resolved, color: '#10b981' }
      ].filter(item => item.value > 0);

      // Tiempo promedio de resolución
      const resolvedIncidents = incidents.filter(i => i.resolution_date);
      let avgResolutionTime = 0;
      if (resolvedIncidents.length > 0) {
        const totalTime = resolvedIncidents.reduce((sum, i) => {
          const created = new Date(i.created_date);
          const resolved = new Date(i.resolution_date);
          const hours = (resolved - created) / (1000 * 60 * 60);
          return sum + hours;
        }, 0);
        avgResolutionTime = Math.round(totalTime / resolvedIncidents.length);
      }

      // Esta semana
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const thisWeek = incidents.filter(i => new Date(i.created_date) > weekAgo).length;

      // Este mes
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const thisMonth = incidents.filter(i => new Date(i.created_date) > monthAgo).length;

      setStats({
        open,
        inProgress,
        resolved,
        critical,
        byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, incidencias: value })),
        byDay,
        byPriority,
        byStatus,
        avgResolutionTime,
        totalIncidents: incidents.length,
        thisWeek,
        thisMonth
      });
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error loading stats:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const categoryLabels = {
    mechanical_failure: "Mecánica",
    flat_tire: "Pinchazo",
    battery_issue: "Batería",
    electrical_problem: "Eléctrico",
    accident: "Accidente",
    billing_issue: "Facturación",
    theft: "Robo",
    user_error: "Usuario",
    maintenance: "Mantenimiento",
    other: "Otro"
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Error al cargar estadísticas</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header optimizado móvil */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d79d68248f2c4c7c55e84e/4fa695163_images.jpeg"
              alt="Pispas Motos"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-blue-900 truncate">Panel de Control</h1>
              <p className="text-xs sm:text-base text-blue-600 font-medium truncate">Vista general del sistema</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards Row 1 - Grid optimizado móvil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
          <StatCard 
            title="Pendientes" 
            value={stats.open} 
            icon={AlertTriangle} 
            color="red" 
            subtitle="Requieren atención"
            isLoading={isLoading}
            onClick={() => handleCardClick("/Pendientes")}
          />
          <StatCard 
            title="Total Incidencias" 
            value={stats.totalIncidents} 
            icon={Zap} 
            color="purple"
            subtitle="Todas las incidencias"
            isLoading={isLoading}
            onClick={() => handleCardClick("/Pendientes")}
          />
          <StatCard 
            title="En Proceso" 
            value={stats.inProgress} 
            icon={Wrench} 
            color="blue" 
            subtitle="Siendo gestionadas"
            isLoading={isLoading}
            onClick={() => handleCardClick("/En-proceso")}
          />
          <StatCard 
            title="Resueltas" 
            value={stats.resolved} 
            icon={CheckSquare} 
            color="green" 
            subtitle="Completadas"
            isLoading={isLoading}
            onClick={() => handleCardClick("/Resueltas")}
          />
        </div>

        {/* Stats Cards Row 2 - Grid optimizado móvil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
          <StatCard 
            title="Críticas" 
            value={stats.critical} 
            icon={Zap} 
            color="orange" 
            subtitle="Prioridad máxima"
            isLoading={isLoading} 
          />
          <StatCard 
            title="Esta Semana" 
            value={stats.thisWeek} 
            icon={Calendar} 
            color="cyan" 
            subtitle="Últimos 7 días"
            isLoading={isLoading} 
          />
          <StatCard 
            title="Tiempo Promedio" 
            value={stats.avgResolutionTime > 0 ? `${stats.avgResolutionTime}h` : '-'} 
            icon={Clock} 
            color="indigo" 
            subtitle="Resolución"
            isLoading={isLoading} 
          />
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-blue-200/60 shadow-sm">
            <TabsTrigger value="general" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
              Vista General
            </TabsTrigger>
            <TabsTrigger value="categorias" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
              Por Categoría
            </TabsTrigger>
            <TabsTrigger value="tendencias" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
              Tendencias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Distribución por Estado" description="Estado actual de las incidencias" isLoading={isLoading}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.byStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.byStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Distribución por Prioridad" description="Urgencia de las incidencias" isLoading={isLoading}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.byPriority}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.byPriority.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </TabsContent>

          <TabsContent value="categorias" className="mt-6">
            <ChartCard 
              title="Incidencias por Tipo" 
              description="Categorías más frecuentes" 
              isLoading={isLoading}
              fullWidth
            >
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.byCategory} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => categoryLabels[value] || value}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Incidencias']}
                    labelFormatter={(value) => categoryLabels[value] || value}
                  />
                  <Bar dataKey="incidencias" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </TabsContent>

          <TabsContent value="tendencias" className="mt-6">
            <ChartCard 
              title="Tendencia Semanal" 
              description="Incidencias en los últimos 7 días" 
              isLoading={isLoading}
              fullWidth
            >
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={stats.byDay} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Incidencias']}/>
                  <Line 
                    type="monotone" 
                    dataKey="incidencias" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 6, fill: '#3b82f6' }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, color, subtitle, isLoading, onClick }) => {
  const colors = {
    red: { bg: 'from-red-500 to-red-600', light: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    blue: { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    green: { bg: 'from-green-500 to-green-600', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    orange: { bg: 'from-orange-500 to-orange-600', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    purple: { bg: 'from-purple-500 to-purple-600', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    cyan: { bg: 'from-cyan-500 to-cyan-600', light: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
    indigo: { bg: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  };
  const selectedColor = colors[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)", scale: 1.02 }}
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-md border ${selectedColor.border} relative overflow-hidden cursor-pointer transition-all duration-200`}
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${selectedColor.bg} opacity-10 rounded-full -mr-16 -mt-16`} />
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      ) : (
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm font-semibold ${selectedColor.text} uppercase tracking-wide`}>{title}</p>
            <div className={`p-3 bg-gradient-to-br ${selectedColor.bg} rounded-lg shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            {subtitle}
            {onClick && <ArrowRight className="w-3 h-3" />}
          </p>
        </div>
      )}
    </motion.div>
  );
};

const ChartCard = ({ title, description, children, isLoading, fullWidth = false }) => (
  <Card className={`bg-white shadow-lg border-blue-200/60 ${fullWidth ? '' : ''}`}>
    <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
        {title}
      </CardTitle>
      {description && (
        <CardDescription className="text-blue-600">{description}</CardDescription>
      )}
    </CardHeader>
    <CardContent className="pt-6">
      {isLoading ? (
        <div className="animate-pulse h-[300px] bg-gray-200 rounded-md"></div>
      ) : (
        children
      )}
    </CardContent>
  </Card>
);
