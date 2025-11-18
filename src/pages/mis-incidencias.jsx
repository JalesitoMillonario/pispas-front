import React, { useState, useEffect, useCallback } from "react";
import { apiClient } from "../components/apiClient";
import { AnimatePresence } from "framer-motion";
import { User, AlertTriangle } from "lucide-react";
import IncidentCard from "../components/incidents/IncidentCard";
import IncidentDetail from "../components/incidents/IncidentDetail";
import PageHeader from "../components/incidents/PageHeader";

export default function MisIncidenciasPage() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const loadIncidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await apiClient.auth.me();
      setCurrentUser(user);
      
      if (user && user.email) {
        const data = await apiClient.entities.Incident.filter(
          { assigned_to: user.email }, 
          "-updated_date"
        );
        setIncidents(data);
      } else {
        console.log('Usuario sin email, no se pueden cargar incidencias');
        setIncidents([]);
      }
    } catch (error) {
      console.error('Error loading my incidents:', error);
      setIncidents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  useEffect(() => {
    let filtered = incidents;
    if (searchTerm) {
      filtered = incidents.filter(incident =>
        Object.values(incident).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredIncidents(filtered);
  }, [searchTerm, incidents]);

  const handleStatusChange = async (incident, newStatus) => {
    await apiClient.entities.Incident.update(incident.id, { status: newStatus });
    loadIncidents();
  };

  const handleDelete = async (incident) => {
    try {
      await apiClient.entities.Incident.delete(incident.id);
      loadIncidents();
      if (selectedIncident && selectedIncident.id === incident.id) {
        setSelectedIncident(null);
      }
    } catch (error) {
      console.error('Error al eliminar incidencia:', error);
      alert('Error al eliminar la incidencia. Por favor, intenta de nuevo.');
    }
  };

  const openIncidents = filteredIncidents.filter(i => i.status === 'open');
  const inProgressIncidents = filteredIncidents.filter(i => i.status === 'in_progress');
  const otherIncidents = filteredIncidents.filter(i => i.status !== 'open' && i.status !== 'in_progress');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {currentUser && (
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {currentUser.full_name?.[0]?.toUpperCase() || <User className="w-8 h-8" />}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Mis Incidencias</h1>
              <p className="text-blue-600 font-medium">
                {currentUser?.full_name || 'Cargando...'} - {filteredIncidents.length} incidencias asignadas
              </p>
            </div>
          </div>
          
          <PageHeader 
            title=""
            description=""
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-red-600 font-semibold text-sm mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-red-700">{openIncidents.length}</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-blue-600 font-semibold text-sm mb-1">En Proceso</p>
            <p className="text-3xl font-bold text-blue-700">{inProgressIncidents.length}</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <p className="text-green-600 font-semibold text-sm mb-1">Otras</p>
            <p className="text-3xl font-bold text-green-700">{otherIncidents.length}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-blue-200/60 animate-pulse h-48"></div>
            ))}
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="text-center py-20">
            <AlertTriangle className="w-16 h-16 mx-auto text-purple-300 mb-4" />
            <p className="text-xl font-semibold text-purple-900 mb-2">No tienes incidencias asignadas</p>
            <p className="text-purple-600">Cuando se te asignen incidencias, aparecerán aquí.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onStatusChange={handleStatusChange}
                  onView={setSelectedIncident}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {selectedIncident && (
          <IncidentDetail
            incident={selectedIncident}
            onClose={() => setSelectedIncident(null)}
            onUpdate={() => {
              loadIncidents();
              setSelectedIncident(null);
            }}
            onDelete={() => {
              handleDelete(selectedIncident);
            }}
          />
        )}
      </div>
    </div>
  );
}