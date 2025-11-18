import React, { useState, useEffect, useCallback } from "react";
import { apiClient } from "../components/apiClient";
import { AnimatePresence } from "framer-motion";
import IncidentCard from "../components/incidents/IncidentCard";
import IncidentDetail from "../components/incidents/IncidentDetail";
import PageHeader from "../components/incidents/PageHeader";

export default function ResueltasPage() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadIncidents = useCallback(async () => {
    setIsLoading(true);
    const resolved = await apiClient.entities.Incident.filter({ status: 'resolved' }, "-resolution_date");
    const closed = await apiClient.entities.Incident.filter({ status: 'closed' }, "-resolution_date");
    setIncidents([...resolved, ...closed]);
    setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="Incidencias Resueltas"
          description="Historial de incidencias completadas y cerradas."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
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

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-blue-200/60 animate-pulse h-48"></div>
            ))}
          </div>
        )}

        {!isLoading && filteredIncidents.length === 0 && (
          <div className="text-center py-20 text-blue-700">
            <p>No hay incidencias resueltas todavía.</p>
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