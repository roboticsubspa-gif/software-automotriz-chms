import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Configurar estilos
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 20 },
  brand: { fontSize: 24, fontWeight: 'bold', color: '#2563eb' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 20 },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: 100, fontSize: 10, color: '#6b7280', fontWeight: 'bold' },
  value: { flex: 1, fontSize: 10, color: '#111827' },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 5, marginBottom: 10 },
  col1: { width: '50%', fontSize: 10, fontWeight: 'bold', color: '#6b7280' },
  col2: { width: '50%', fontSize: 10, fontWeight: 'bold', color: '#6b7280', textAlign: 'right' },
  total: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginTop: 20, color: '#111827' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, textAlign: 'center', color: '#9ca3af', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10 }
});

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

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
