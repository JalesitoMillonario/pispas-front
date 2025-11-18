

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "../components/utils";
import { apiClient } from "../components/apiClient";
import {
  BarChart2,
  ClipboardList,
  Wrench,
  CheckSquare,
  Plus,
  LogOut,
  User,
  Menu,
  Package,
  FileText,
  Box,
  ShoppingCart
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Estadísticas",
    url: "/",
    icon: BarChart2,
  },
  {
    title: "Pendientes",
    url: "/Pendientes",
    icon: ClipboardList,
  },
  {
    title: "En Proceso",
    url: "/En-proceso",
    icon: Wrench,
  },
  {
    title: "Resueltas",
    url: "/Resueltas",
    icon: CheckSquare,
  }
];

const secondaryNavItems = [
  {
    title: "Nueva Incidencia",
    url: "/Nueva-incidencia",
    icon: Plus,
  }
];

const stockNavItems = [
  {
    title: "Catálogo",
    url: "/Catalogo-Stock",
    icon: Package,
  },
  {
    title: "Pedidos",
    url: "/Pedidos-Stock",
    icon: FileText,
  },
  {
    title: "Stock",
    url: "/Stock-Inventario",
    icon: Box,
  },
  {
    title: "Nuevo Pedido",
    url: "/Nuevo-Pedido-Stock",
    icon: ShoppingCart,
  },
];

function SidebarToggleButton() {
  const { toggleSidebar } = useSidebar();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className="border-blue-300 hover:bg-blue-100 hover:border-blue-400 text-blue-700 shadow-sm"
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
}

function AppSidebar({ user, onLogout, onNavigate }) {
  const location = useLocation();
  
  return (
    <Sidebar className="border-r border-blue-200/60">
      <SidebarHeader className="border-b border-blue-200/60 p-6">
        <div className="flex items-center gap-3">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d79d68248f2c4c7c55e84e/4fa695163_images.jpeg"
            alt="Pispas Motos"
            className="w-14 h-14 rounded-full shadow-lg object-cover"
          />
          <div>
            <h2 className="font-bold text-blue-900 text-xl">Pispas Motos</h2>
            <p className="text-sm text-blue-600 font-semibold">Incidencias</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-3">
        {/* Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-3 py-3">
            Incidencias
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl py-3 px-3 ${
                      location.pathname === item.url ? 'bg-blue-100 text-blue-800 shadow-sm font-semibold border border-blue-200' : 'text-blue-700'
                    }`}
                  >
                    <Link to={item.url} onClick={onNavigate} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Stock */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-3 py-3">
            Stock
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {stockNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl py-3 px-3 ${
                      location.pathname === item.url ? 'bg-blue-100 text-blue-800 shadow-sm font-semibold border border-blue-200' : 'text-blue-700'
                    }`}
                  >
                    <Link to={item.url} onClick={onNavigate} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Acciones */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-semibold text-green-600 uppercase tracking-wider px-3 py-3">
            Acciones
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="hover:bg-green-50 hover:text-green-700 text-green-700 transition-all duration-300 rounded-xl py-3 px-3 font-medium"
                  >
                    <Link to={item.url} onClick={onNavigate} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-blue-200/60 p-4">
        <div className="flex items-center gap-3 mb-3 p-3 bg-blue-50/50 rounded-xl">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {user?.full_name?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-blue-900 text-sm truncate">
              {user?.full_name || 'Usuario'}
            </p>
            <p className="text-xs text-blue-600 truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          onClick={onLogout}
          variant="outline" 
          className="w-full justify-start gap-3 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!apiClient.auth.isAuthenticated()) {
        navigate(createPageUrl("Auth"));
        return;
      }

      try {
        const userData = await apiClient.auth.me();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
        navigate(createPageUrl("Auth"));
      } finally {
        setIsLoadingUser(false);
      }
    };

    if (currentPageName !== "auth" && currentPageName !== "Auth") {
      checkAuth();
    } else {
      setIsLoadingUser(false);
    }
  }, [currentPageName, navigate]);

  const handleLogout = async () => {
    try {
      await apiClient.auth.logout();
      navigate(createPageUrl("Auth"));
    } catch (error) {
      console.error('Error logging out:', error);
      apiClient.clearToken();
      navigate(createPageUrl("Auth"));
    }
  };

  if (currentPageName === "auth" || currentPageName === "Auth") {
    return children;
  }

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <LayoutContent 
        user={user} 
        onLogout={handleLogout}
        currentPageName={currentPageName}
      >
        {children}
      </LayoutContent>
    </SidebarProvider>
  );
}

function LayoutContent({ children, user, onLogout, currentPageName }) {
  const { setOpenMobile } = useSidebar();

  const handleNavigate = () => {
    setOpenMobile(false);
  };

  const pageTitles = {
    'Dashboard': 'Estadísticas',
    'Pendientes': 'Incidencias Pendientes',
    'En-proceso': 'En Proceso',
    'Resueltas': 'Resueltas',
    'Nueva-incidencia': 'Nueva Incidencia',
    'Mis-incidencias': 'Mis Incidencias',
    'CatalogoStock': 'Catálogo',
    'PedidosStock': 'Pedidos',
    'StockInventario': 'Stock',
    'NuevoPedidoStock': 'Nuevo Pedido',
    'DetallePedidoStock': 'Detalle Pedido',
    'auth': 'Iniciar Sesión',
    'Auth': 'Iniciar Sesión'
  };

  const pageTitle = pageTitles[currentPageName] || currentPageName;

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <AppSidebar user={user} onLogout={onLogout} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200/60 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          <SidebarToggleButton />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-blue-900">
              {pageTitle}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

