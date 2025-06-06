import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const id = req.query.id ? Number(req.query.id) : null

  try {
    if (req.method === 'GET') {
      if (id) {
        // Obtener un producto por id
        const producto = await prisma.producto.findUnique({
          where: { id },
          include: { categoria: true },
        })
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' })
        return res.status(200).json(producto)
      } else {
        // Obtener todos los productos
        const productos = await prisma.producto.findMany({
          include: { categoria: true },
        })
        return res.status(200).json(productos)
      }
    } else if (req.method === 'POST') {
      // Crear producto
      const { nombre, descripcion, precio, categoriaId } = req.body
      if (!nombre || !descripcion || !precio || !categoriaId) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' })
      }
      const producto = await prisma.producto.create({
        data: { nombre, descripcion, precio, categoriaId },
      })
      return res.status(201).json(producto)
    } else if (req.method === 'PUT') {
      // Actualizar producto
      if (!id) return res.status(400).json({ error: 'Falta id para actualizar' })

      const { nombre, descripcion, precio, categoriaId } = req.body
      if (!nombre || !descripcion || !precio || !categoriaId) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' })
      }
      const productoActualizado = await prisma.producto.update({
        where: { id },
        data: { nombre, descripcion, precio, categoriaId },
      })
      return res.status(200).json(productoActualizado)
    } else if (req.method === 'DELETE') {
      // Borrar producto
      if (!id) return res.status(400).json({ error: 'Falta id para eliminar' })
      await prisma.producto.delete({ where: { id } })
      return res.status(204).end()
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error en el servidor' })
  }
}
