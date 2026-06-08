import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Car, 
  Wrench, 
  FileText, 
  Package,
  LogOut,
  ClipboardCheck
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Clientes', path: '/clientes', icon: Users },
    { name: 'Vehículos', path: '/vehiculos', icon: Car },
    { name: 'Órdenes de Trabajo', path: '/ordenes', icon: Wrench },
    { name: 'Reportes', path: '/reportes', icon: ClipboardCheck },
    { name: 'Inventario', path: '/inventario', icon: Package },
    { name: 'Cotizaciones', path: '/cotizaciones', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-secondary text-secondary-foreground flex flex-col h-screen border-r border-border">
      <div className="p-6 font-bold text-2xl tracking-wider text-primary">
        EGAÑA
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
                  : 'hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left hover:bg-destructive hover:text-destructive-foreground transition-colors">
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};
