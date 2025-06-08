import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'

export default function MedicamentoPage() {
  const [medicamentos, setMedicamentos] = useState([])
  const [tipos, setTipos] = useState([])
  const [form, setForm] = useState({
    id: null,
    descripcionMed: '',
    fechaFabricacion: '',
    fechaVencimiento: '',
    presentacion: '',
    stock: '',
    precioVentaUni: '',
    precioVentaPres: '',
    marca: '',
    CodTipoMed: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMedicamentos()
    fetchTipos()
  }, [])

  const fetchMedicamentos = async () => {
    const res = await fetch('/api/medicamento')
    const data = await res.json()
    setMedicamentos(data)
  }

  const fetchTipos = async () => {
    const res = await fetch('/api/tipomedic')
    const data = await res.json()
    setTipos(data)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const required = [
      'descripcionMed', 'fechaFabricacion', 'fechaVencimiento',
      'presentacion', 'stock', 'precioVentaUni', 'precioVentaPres', 'marca', 'CodTipoMed'
    ]

    if (required.some(key => !form[key])) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      const payload = {
        ...form,
        stock: parseInt(form.stock),
        precioVentaUni: parseFloat(form.precioVentaUni),
        precioVentaPres: parseFloat(form.precioVentaPres),
        CodTipoMed: parseInt(form.CodTipoMed),
        fechaFabricacion: new Date(form.fechaFabricacion),
        fechaVencimiento: new Date(form.fechaVencimiento)
      }

      if (isEditing) {
        await fetch(`/api/medicamento?id=${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        await fetch('/api/medicamento', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      setForm({
        id: null, descripcionMed: '', fechaFabricacion: '', fechaVencimiento: '',
        presentacion: '', stock: '', precioVentaUni: '', precioVentaPres: '', marca: '', CodTipoMed: ''
      })
      setIsEditing(false)
      fetchMedicamentos()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (med) => {
    setForm({
      id: med.CodMedicamento,
      descripcionMed: med.descripcionMed,
      fechaFabricacion: med.fechaFabricacion.split('T')[0],
      fechaVencimiento: med.fechaVencimiento.split('T')[0],
      presentacion: med.presentacion,
      stock: med.stock,
      precioVentaUni: med.precioVentaUni,
      precioVentaPres: med.precioVentaPres,
      marca: med.marca,
      CodTipoMed: med.CodTipoMed
    })
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar medicamento?')) return
    await fetch(`/api/medicamento?id=${id}`, { method: 'DELETE' })
    fetchMedicamentos()
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Medicamentos</h1>

        <form onSubmit={handleSubmit} style={{ background: '#f1f1f1', padding: '1rem', marginBottom: '2rem', borderRadius: '8px' }}>
          <h3>{isEditing ? 'Editar' : 'Nuevo'} Medicamento</h3>

          <input name="descripcionMed" placeholder="Descripción" value={form.descripcionMed} onChange={handleInputChange} required style={inputStyle} />
          <input name="fechaFabricacion" type="date" value={form.fechaFabricacion} onChange={handleInputChange} required style={inputStyle} />
          <input name="fechaVencimiento" type="date" value={form.fechaVencimiento} onChange={handleInputChange} required style={inputStyle} />
          <input name="presentacion" placeholder="Presentación" value={form.presentacion} onChange={handleInputChange} required style={inputStyle} />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleInputChange} required style={inputStyle} />
          <input name="precioVentaUni" type="number" step="0.01" placeholder="Precio Unitario" value={form.precioVentaUni} onChange={handleInputChange} required style={inputStyle} />
          <input name="precioVentaPres" type="number" step="0.01" placeholder="Precio Presentación" value={form.precioVentaPres} onChange={handleInputChange} required style={inputStyle} />
          <input name="marca" placeholder="Marca" value={form.marca} onChange={handleInputChange} required style={inputStyle} />

          <select name="CodTipoMed" value={form.CodTipoMed} onChange={handleInputChange} required style={inputStyle}>
            <option value="">Selecciona tipo</option>
            {tipos.map(t => (
              <option key={t.CodTipoMed} value={t.CodTipoMed}>{t.descripcion}</option>
            ))}
          </select>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" style={buttonStyle}>
            {isEditing ? 'Actualizar' : 'Crear'}
          </button>
          {isEditing && (
            <button type="button" onClick={() => {
              setForm({ id: null, descripcionMed: '', fechaFabricacion: '', fechaVencimiento: '', presentacion: '', stock: '', precioVentaUni: '', precioVentaPres: '', marca: '', CodTipoMed: '' })
              setIsEditing(false)
            }} style={{ ...buttonStyle, background: '#999', marginLeft: '1rem' }}>
              Cancelar
            </button>
          )}
        </form>

        <ul style={{ padding: 0, listStyle: 'none' }}>
          {medicamentos.map((med) => (
            <li key={med.CodMedicamento} style={{ background: '#f9f9f9', marginBottom: '1rem', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <strong>{med.descripcionMed}</strong> ({med.marca})<br />
              <small>Tipo: {med.tipoMedic?.descripcion || 'N/A'}</small><br />
              <small>Precio: S/. {med.precioVentaUni.toFixed(2)} - Stock: {med.stock}</small><br />
              <small>Vence: {new Date(med.fechaVencimiento).toLocaleDateString()}</small><br />

              <button onClick={() => handleEdit(med)} style={smallBtnStyle}>Editar</button>
              <button onClick={() => handleDelete(med.CodMedicamento)} style={{ ...smallBtnStyle, background: '#e74c3c' }}>Eliminar</button>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

const inputStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  padding: '0.5rem',
  width: '100%',
  borderRadius: '4px',
  border: '1px solid #ccc'
}

const buttonStyle = {
  padding: '0.6rem 1.2rem',
  backgroundColor: '#2c3e50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
}

const smallBtnStyle = {
  marginTop: '0.5rem',
  marginRight: '0.5rem',
  padding: '0.4rem 0.8rem',
  background: '#3498db',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
}
