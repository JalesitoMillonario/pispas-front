import React, { useState, useEffect, useCallback } from "react";
import { apiClient } from "../components/apiClient";
import { AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, FileText, AlertTriangle } from "lucide-react";

import IncidentCard from "../components/incidents/IncidentCard";
import IncidentDetail from "../components/incidents/IncidentDetail";
import PageHeader from "../components/incidents/PageHeader";

const mechanicalCategories = ['mechanical_failure', 'flat_tire', 'battery_issue', 'electrical_problem', 'accident', 'theft'];
const billingCategories = ['billing_issue'];

export default function PendientesPage() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadIncidents = useCallback(async () => {
    setIsLoading(true);
    const data = await apiClient.entities.Incident.filter({ status: 'open' }, "-created_date");
    setIncidents(data);
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

  const mechanicalIncidents = filteredIncidents.filter(i => mechanicalCategories.includes(i.category));
  const billingIncidents = filteredIncidents.filter(i => billingCategories.includes(i.category));
  const otherIncidents = filteredIncidents.filter(i => !mechanicalCategories.includes(i.category) && !billingCategories.includes(i.category));

  const renderIncidentList = (list) => {
    if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-blue-200/60 animate-pulse h-48"></div>
          ))}
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div className="text-center py-12 text-blue-700">
          <AlertTriangle className="mx-auto w-10 h-10 mb-2 text-blue-400" />
          <p>No hay incidencias de este tipo.</p>
        </div>
      );
    }
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {list.map((incident) => (
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
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="Incidencias Pendientes"
          description="Nuevas incidencias que requieren atención inmediata."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <Tabs defaultValue="mecanica" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-fit md:grid-cols-3 bg-blue-200/60">
            <TabsTrigger value="mecanica" className="gap-2">
              <Wrench className="w-4 h-4"/>
              Fallos de Moto
              {!isLoading && (
                <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">
                  {mechanicalIncidents.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="facturacion" className="gap-2">
              <FileText className="w-4 h-4"/>
              Facturación
              {!isLoading && (
                <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">
                  {billingIncidents.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="otros" className="gap-2">
              Otros
              {!isLoading && (
                <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">
                  {otherIncidents.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="mecanica" className="mt-6">{renderIncidentList(mechanicalIncidents)}</TabsContent>
          <TabsContent value="facturacion" className="mt-6">{renderIncidentList(billingIncidents)}</TabsContent>
          <TabsContent value="otros" className="mt-6">{renderIncidentList(otherIncidents)}</TabsContent>
        </Tabs>
        
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