// ✅ Utils para navegación - Independiente de base44

export function createPageUrl(pageName, params = {}) {
  // Mapeo de nombres de página a rutas
  const pageRoutes = {
    'Dashboard': '/',
    'Pendientes': '/Pendientes',
    'EnProceso': '/En-proceso',
    'Resueltas': '/Resueltas',
    'MisIncidencias': '/Mis-incidencias',
    'NewIncident': '/Nueva-incidencia',
    'Auth': '/auth'
  };

  let url = pageRoutes[pageName] || `/${pageName}`;
  
  // Añadir parámetros de query si existen
  const queryString = new URLSearchParams(params).toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return url;
}