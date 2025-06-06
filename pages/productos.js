import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')

  // Cargar productos y categorías al inicio
  useEffect(() => {
    fetchProductos()
    fetchCategorias()
  }, [])

  const fetchProductos = async () => {
    const res = await fetch('/api/productos')
    const data = await res.json()
    setProductos(data)
  }

  // Asumo que tienes una API para categorías, si no ajusta según tu modelo
  const fetchCategorias = async () => {
    const res = await fetch('/api/categorias')
    if (res.ok) {
      const data = await res.json()
      setCategorias(data)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.nombre || !form.descripcion || !form.precio || !form.categoriaId) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        categoriaId: parseInt(form.categoriaId)
      }

      if (isEditing) {
        // Editar producto
        const res = await fetch(`/api/productos?id=${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Error actualizando producto')
      } else {
        // Crear producto
        const res = await fetch('/api/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Error creando producto')
      }

      // Limpiar formulario y recargar lista
      setForm({ id: null, nombre: '', descripcion: '', precio: '', categoriaId: '' })
      setIsEditing(false)
      fetchProductos()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (producto) => {
    setForm({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoriaId: producto.categoriaId
    })
    setIsEditing(true)
    setError('')
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return

    try {
      const res = await fetch(`/api/productos?id=${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Error eliminando producto')
      fetchProductos()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '1.5rem' }}>Productos</h1>

        <form 
          onSubmit={handleSubmit} 
          style={{ 
            marginBottom: '2rem', 
            padding: '1rem', 
            backgroundColor: '#ecf0f1', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>

          <div style={{ marginBottom: '0.5rem' }}>
            <label>Nombre:</label><br />
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label>Descripción:</label><br />
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleInputChange}
              rows={3}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label>Precio:</label><br />
            <input
              type="number"
              step="0.01"
              name="precio"
              value={form.precio}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label>Categoría:</label><br />
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button 
            type="submit"
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isEditing ? 'Actualizar' : 'Crear'}
          </button>

          {isEditing && (
            <button 
              type="button"
              onClick={() => {
                setForm({ id: null, nombre: '', descripcion: '', precio: '', categoriaId: '' })
                setIsEditing(false)
                setError('')
              }}
              style={{
                marginLeft: '1rem',
                padding: '0.6rem 1.2rem',
                backgroundColor: '#999',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          )}
        </form>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {productos.map((producto) => (
            <li 
              key={producto.id} 
              style={{
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'transform 0.2s ease',
              }}
            >
              <div>
                <span style={{ fontWeight: '600', color: '#34495e' }}>{producto.nombre}</span><br />
                <small style={{ fontStyle: 'italic', color: '#7f8c8d' }}>
                  {producto.categoria?.nombre || 'Sin categoría'}
                </small><br />
                <small>{producto.descripcion}</small><br />
                <small><b>Precio:</b> ${producto.precio.toFixed(2)}</small>
              </div>

              <div>
                <button
                  onClick={() => handleEdit(producto)}
                  style={{
                    marginRight: '0.5rem',
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#2980b9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(producto.id)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#c0392b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
