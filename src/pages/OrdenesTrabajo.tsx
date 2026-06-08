import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Search, Wrench, CheckCircle, Clock } from 'lucide-react';

interface Vehiculo {
  id: string;
  patente: string;
  marca: string;
  modelo: string;
  clientes?: { nombre: string };
}

interface OrdenTrabajo {
  id: string;
  vehiculo_id: string;
  estado: string;
  descripcion: string;
  created_at: string;
  vehiculos?: Vehiculo;
}

export const OrdenesTrabajo = () => {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [vehiculosList, setVehiculosList] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    vehiculo_id: '', 
    estado: 'Abierta', 
    descripcion: '' 
  });

  const fetchOrdenes = async () => {
    setLoading(true);
    let query = supabase
      .from('ordenes_trabajo')
      .select('*, vehiculos(id, patente, marca, modelo, clientes(nombre))')
      .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (!error && data) {
      // Filtrado simple en cliente
      const filtered = search ? data.filter((o: any) => 
        o.vehiculos?.patente?.toLowerCase().includes(search.toLowerCase()) || 
        o.vehiculos?.clientes?.nombre?.toLowerCase().includes(search.toLowerCase())
      ) : data;
      setOrdenes(filtered as any);
    }
    setLoading(false);
  };

  const fetchVehiculos = async () => {
    const { data } = await supabase.from('vehiculos').select('id, patente, marca, modelo, clientes(nombre)').order('patente');
    if (data) setVehiculosList(data as any);
  };

  useEffect(() => {
    fetchOrdenes();
    fetchVehiculos();
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('ordenes_trabajo').update(formData).eq('id', editingId);
    } else {
      await supabase.from('ordenes_trabajo').insert([formData]);
    }
    setIsModalOpen(false);
    fetchOrdenes();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta orden de trabajo?')) {
      await supabase.from('ordenes_trabajo').delete().eq('id', id);
      fetchOrdenes();
    }
  };

  const handleChangeEstado = async (id: string, nuevoEstado: string) => {
    await supabase.from('ordenes_trabajo').update({ estado: nuevoEstado }).eq('id', id);
    fetchOrdenes();
  };

  const openModal = (orden?: OrdenTrabajo) => {
    if (orden) {
      setEditingId(orden.id);
      setFormData({ 
        vehiculo_id: orden.vehiculo_id, 
        estado: orden.estado, 
        descripcion: orden.descripcion 
      });
    } else {
      setEditingId(null);
      setFormData({ vehiculo_id: vehiculosList.length > 0 ? vehiculosList[0].id : '', estado: 'Abierta', descripcion: '' });
    }
    setIsModalOpen(true);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Abierta':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 flex items-center gap-1 w-max"><Wrench size={14}/> Abierta</span>;
      case 'En Progreso':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 flex items-center gap-1 w-max"><Clock size={14}/> En Progreso</span>;
      case 'Cerrada':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 flex items-center gap-1 w-max"><CheckCircle size={14}/> Cerrada</span>;
      default:
        return <span>{estado}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Wrench size={32} className="text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Órdenes de Trabajo</h1>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nueva Orden
        </button>
      </div>

      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text"
              placeholder="Buscar por patente o cliente..."
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
                <th className="px-6 py-4 font-semibold">ID / Fecha</th>
                <th className="px-6 py-4 font-semibold">Cliente y Vehículo</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Descripción</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Cargando órdenes...</td></tr>
              ) : ordenes.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No se encontraron órdenes de trabajo.</td></tr>
              ) : (
                ordenes.map((orden) => (
                  <tr key={orden.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      <div className="font-mono text-xs">{orden.id.split('-')[0]}</div>
                      <div className="text-xs">{new Date(orden.created_at).toLocaleDateString('es-CL')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary">{orden.vehiculos?.clientes?.nombre}</div>
                      <div className="text-muted-foreground text-xs uppercase">{orden.vehiculos?.patente} - {orden.vehiculos?.marca} {orden.vehiculos?.modelo}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getEstadoBadge(orden.estado)}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={orden.descripcion}>
                      {orden.descripcion}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {orden.estado !== 'Cerrada' && (
                        <select 
                          className="bg-background border border-border text-xs rounded p-1 mr-2 cursor-pointer"
                          value={orden.estado}
                          onChange={(e) => handleChangeEstado(orden.id, e.target.value)}
                        >
                          <option value="Abierta">Abierta</option>
                          <option value="En Progreso">En Progreso</option>
                          <option value="Cerrada">Cerrada</option>
                        </select>
                      )}
                      
                      <button 
                        onClick={() => openModal(orden)}
                        className="text-blue-500 hover:text-blue-400 p-2 hover:bg-blue-500/10 rounded-md transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(orden.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-bold">{editingId ? 'Editar Orden' : 'Nueva Orden de Trabajo'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vehículo</label>
                <select 
                  required
                  value={formData.vehiculo_id} 
                  onChange={e => setFormData({...formData, vehiculo_id: e.target.value})} 
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" disabled>Seleccione un vehículo</option>
                  {vehiculosList.map(v => (
                    <option key={v.id} value={v.id}>{v.patente.toUpperCase()} - {v.clientes?.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select 
                  required
                  value={formData.estado} 
                  onChange={e => setFormData({...formData, estado: e.target.value})} 
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Abierta">Abierta</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Cerrada">Cerrada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción del Problema</label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.descripcion} 
                  onChange={e => setFormData({...formData, descripcion: e.target.value})} 
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none" 
                  placeholder="Detalle el problema o trabajo a realizar..."
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
