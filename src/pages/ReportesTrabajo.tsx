import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ClipboardCheck, Trash2, Eye } from 'lucide-react';

interface Reporte {
  id: string;
  orden_id: string;
  descripcion_trabajo: string;
  costo_total: number;
  cobro_total: number;
  ganancia: number;
  created_at: string;
  ordenes_trabajo?: {
    id: string;
    vehiculos?: {
      patente: string;
      clientes?: {
        nombre: string;
      }
    }
  }
}

export const ReportesTrabajo = () => {
  const navigate = useNavigate();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchReportes = async () => {
    setLoading(true);
    let query = supabase
      .from('reportes_trabajo')
      .select('*, ordenes_trabajo(id, vehiculos(patente, clientes(nombre)))')
      .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (!error && data) {
      setReportes(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReportes();
  }, [search]);

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      await supabase.from('reportes_trabajo').delete().eq('id', id);
      fetchReportes();
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={32} className="text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Reportes de Trabajo</h1>
        </div>
        <button 
          onClick={() => navigate('/reportes/nuevo')}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Crear Reporte
        </button>
      </div>

      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text"
              placeholder="Buscar reporte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Fecha / ID OT</th>
                <th className="px-6 py-4 font-semibold">Cliente y Vehículo</th>
                <th className="px-6 py-4 font-semibold text-right">Costo</th>
                <th className="px-6 py-4 font-semibold text-right">Cobro</th>
                <th className="px-6 py-4 font-semibold text-right">Ganancia</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Cargando reportes...</td></tr>
              ) : reportes.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No se encontraron reportes.</td></tr>
              ) : (
                reportes.map((reporte) => (
                  <tr key={reporte.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="text-xs">{new Date(reporte.created_at).toLocaleDateString('es-CL')}</div>
                      <div className="font-mono text-xs mt-1">OT: {reporte.orden_id?.split('-')[0]}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary">{reporte.ordenes_trabajo?.vehiculos?.clientes?.nombre}</div>
                      <div className="text-muted-foreground text-xs uppercase">{reporte.ordenes_trabajo?.vehiculos?.patente}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{formatMoney(reporte.costo_total)}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatMoney(reporte.cobro_total)}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-500">{formatMoney(reporte.ganancia)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        className="text-blue-500 hover:text-blue-400 p-2 hover:bg-blue-500/10 rounded-md transition-colors"
                        title="Ver Detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(reporte.id)}
                        className="text-destructive hover:text-destructive/80 p-2 hover:bg-destructive/10 rounded-md transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
