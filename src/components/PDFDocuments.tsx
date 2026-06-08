import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Configurar estilos
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 20 },
  brand: { fontSize: 24, fontWeight: 'bold', color: '#2563eb' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 20 },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: 100, fontSize: 10, color: '#6b7280', fontWeight: 'bold' },
  value: { flex: 1, fontSize: 10, color: '#111827' },
  
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 5, marginBottom: 8, marginTop: 5 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingTop: 6, paddingBottom: 6 },
  
  // Columnas para tablas de insumos
  colDesc: { width: '45%', fontSize: 9, color: '#111827' },
  colCant: { width: '15%', fontSize: 9, color: '#111827', textAlign: 'center' },
  colPrec: { width: '20%', fontSize: 9, color: '#111827', textAlign: 'right' },
  colSub: { width: '20%', fontSize: 9, color: '#111827', textAlign: 'right' },
  
  colDescHeader: { width: '45%', fontSize: 9, fontWeight: 'bold', color: '#6b7280' },
  colCantHeader: { width: '15%', fontSize: 9, fontWeight: 'bold', color: '#6b7280', textAlign: 'center' },
  colPrecHeader: { width: '20%', fontSize: 9, fontWeight: 'bold', color: '#6b7280', textAlign: 'right' },
  colSubHeader: { width: '20%', fontSize: 9, fontWeight: 'bold', color: '#6b7280', textAlign: 'right' },

  total: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginTop: 20, color: '#111827' },
  
  financials: { marginTop: 20, alignSelf: 'flex-end', width: '45%', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10 },
  finRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  finLabel: { fontSize: 10, color: '#6b7280' },
  finValue: { fontSize: 10, fontWeight: 'bold', color: '#111827' },
  
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, textAlign: 'center', color: '#9ca3af', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10 }
});

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

// 1. PDF para Cotizaciones
export const CotizacionPDF = ({ cotizacion }: { cotizacion: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Egaña Automotriz</Text>
          <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>Servicio Mecánico Profesional</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>COTIZACIÓN</Text>
          <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>
            Fecha: {new Date(cotizacion.created_at).toLocaleDateString('es-CL')}
          </Text>
          <Text style={{ fontSize: 10, color: '#6b7280' }}>
            ID: {cotizacion.id.split('-')[0].toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{cotizacion.clientes?.nombre}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>RUT:</Text>
          <Text style={styles.value}>{cotizacion.clientes?.rut || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Vehículo:</Text>
          <Text style={styles.value}>{cotizacion.vehiculos?.patente?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>Descripción del Servicio</Text>
        <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{cotizacion.descripcion}</Text>
      </View>

      <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10 }}>
        <Text style={styles.total}>Total: {formatMoney(cotizacion.total)}</Text>
      </View>

      <Text style={styles.footer}>
        Esta cotización tiene una validez de 15 días desde la fecha de emisión. Valores incluyen IVA.
      </Text>
    </Page>
  </Document>
);

// 2. PDF para Órdenes de Trabajo (OT)
export const OrdenTrabajoPDF = ({ orden }: { orden: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Egaña Automotriz</Text>
          <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>Servicio Mecánico Profesional</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>ORDEN DE TRABAJO (OT)</Text>
          <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>
            Fecha: {new Date(orden.created_at).toLocaleDateString('es-CL')}
          </Text>
          <Text style={{ fontSize: 10, color: '#6b7280' }}>
            Nº OT: {orden.id.split('-')[0].toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 10 }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#2563eb' }}>DATOS DEL CLIENTE</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{orden.vehiculos?.clientes?.nombre}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>RUT:</Text>
          <Text style={styles.value}>{orden.vehiculos?.clientes?.rut || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.value}>{orden.vehiculos?.clientes?.correo || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{orden.vehiculos?.clientes?.telefono || 'N/A'}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 10 }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#2563eb' }}>DATOS DEL VEHÍCULO</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Patente:</Text>
          <Text style={[styles.value, { textTransform: 'uppercase' }]}>{orden.vehiculos?.patente}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Marca / Modelo:</Text>
          <Text style={styles.value}>{orden.vehiculos?.marca} {orden.vehiculos?.modelo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Año:</Text>
          <Text style={styles.value}>{orden.vehiculos?.anio || 'N/A'}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#2563eb' }}>DETALLES DEL SERVICIO SOLICITADO</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Estado OT:</Text>
          <Text style={[styles.value, { fontWeight: 'bold' }]}>{orden.estado}</Text>
        </View>
        <View style={{ marginTop: 10, backgroundColor: '#f9fafb', padding: 10, borderRadius: 4 }}>
          <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>{orden.descripcion}</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Documento informativo de recepción de vehículo. Egaña Automotriz - Servicio de Calidad.
      </Text>
    </Page>
  </Document>
);

// 3. PDF para Reportes de Trabajo (RT)
export const ReporteTrabajoPDF = ({ reporte }: { reporte: any }) => {
  // Calcular cobro de mano de obra
  const cobroInsumos = reporte.insumos_reporte?.reduce((acc: number, curr: any) => acc + (curr.precio_unitario * curr.cantidad), 0) || 0;
  const manoObra = Math.max(0, reporte.cobro_total - cobroInsumos);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Egaña Automotriz</Text>
            <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>Servicio Mecánico Profesional</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>REPORTE DE TRABAJO (RT)</Text>
            <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>
              Fecha Emisión: {new Date(reporte.created_at).toLocaleDateString('es-CL')}
            </Text>
            <Text style={{ fontSize: 10, color: '#6b7280' }}>
              Ref. OT: {reporte.ordenes_trabajo?.id?.split('-')[0].toUpperCase() || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20 }}>
          <View style={{ flex: 1, borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4, padding: 10 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#2563eb', marginBottom: 5 }}>CLIENTE</Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{reporte.ordenes_trabajo?.vehiculos?.clientes?.nombre}</Text>
            <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 3 }}>RUT: {reporte.ordenes_trabajo?.vehiculos?.clientes?.rut || 'N/A'}</Text>
            <Text style={{ fontSize: 9, color: '#6b7280' }}>Tel: {reporte.ordenes_trabajo?.vehiculos?.clientes?.telefono || 'N/A'}</Text>
          </View>
          
          <View style={{ flex: 1, borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4, padding: 10 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#2563eb', marginBottom: 5 }}>VEHÍCULO</Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>PATENTE: {reporte.ordenes_trabajo?.vehiculos?.patente}</Text>
            <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 3 }}>{reporte.ordenes_trabajo?.vehiculos?.marca} {reporte.ordenes_trabajo?.vehiculos?.modelo}</Text>
            <Text style={{ fontSize: 9, color: '#6b7280' }}>Año: {reporte.ordenes_trabajo?.vehiculos?.anio || 'N/A'}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#2563eb', marginBottom: 5 }}>DESCRIPCIÓN DEL TRABAJO REALIZADO</Text>
          <View style={{ backgroundColor: '#f9fafb', padding: 10, borderRadius: 4 }}>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.4 }}>{reporte.descripcion_trabajo}</Text>
          </View>
        </View>

        {/* Tabla de Repuestos/Insumos */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#2563eb', marginBottom: 8 }}>INSUMOS Y REPUESTOS UTILIZADOS</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colDescHeader}>Repuesto / Insumo</Text>
            <Text style={styles.colCantHeader}>Cant.</Text>
            <Text style={styles.colPrecHeader}>P. Unitario</Text>
            <Text style={styles.colSubHeader}>Subtotal</Text>
          </View>

          {(!reporte.insumos_reporte || reporte.insumos_reporte.length === 0) ? (
            <Text style={{ fontSize: 10, color: '#6b7280', fontStyle: 'italic', paddingVertical: 10 }}>No se registraron insumos en este reporte.</Text>
          ) : (
            reporte.insumos_reporte.map((insumo: any) => (
              <View key={insumo.id} style={styles.tableRow}>
                <Text style={styles.colDesc}>{insumo.inventario?.nombre || 'Insumo Eliminado'}</Text>
                <Text style={styles.colCant}>{insumo.cantidad}</Text>
                <Text style={styles.colPrec}>{formatMoney(insumo.precio_unitario)}</Text>
                <Text style={styles.colSub}>{formatMoney(insumo.cantidad * insumo.precio_unitario)}</Text>
              </View>
            ))
          )}
        </View>

        {/* Resumen Financiero */}
        <View style={styles.financials}>
          <View style={styles.finRow}>
            <Text style={styles.finLabel}>Mano de Obra:</Text>
            <Text style={styles.finValue}>{formatMoney(manoObra)}</Text>
          </View>
          <View style={styles.finRow}>
            <Text style={styles.finLabel}>Total Insumos:</Text>
            <Text style={styles.finValue}>{formatMoney(cobroInsumos)}</Text>
          </View>
          <View style={[styles.finRow, { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 5, marginTop: 5 }]}>
            <Text style={[styles.finLabel, { fontWeight: 'bold', color: '#111827' }]}>Total Cobrado:</Text>
            <Text style={[styles.finValue, { fontSize: 11, color: '#2563eb' }]}>{formatMoney(reporte.cobro_total)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Documento de entrega de trabajo realizado. Egaña Automotriz.
        </Text>
      </Page>
    </Document>
  );
};
