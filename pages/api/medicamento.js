import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const id = req.query.id ? Number(req.query.id) : null

  try {
    // 📌 GET
    if (req.method === 'GET') {
      if (id) {
        const medicamento = await prisma.medicamento.findUnique({
          where: { CodMedicamento: id },
          include: { tipoMedic: true }
        })
        if (!medicamento) return res.status(404).json({ error: 'Medicamento no encontrado' })
        return res.status(200).json(medicamento)
      } else {
        const medicamentos = await prisma.medicamento.findMany({
          include: { tipoMedic: true }
        })
        return res.status(200).json(medicamentos)
      }
    }

    // 📌 POST
    else if (req.method === 'POST') {
      const {
        descripcionMed,
        fechaFabricacion,
        fechaVencimiento,
        presentacion,
        stock,
        precioVentaUni,
        precioVentaPres,
        marca,
        CodTipoMed
      } = req.body

      if (
        !descripcionMed || !fechaFabricacion || !fechaVencimiento ||
        !presentacion || !stock || !precioVentaUni ||
        !precioVentaPres || !marca || !CodTipoMed
      ) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' })
      }

      const nuevo = await prisma.medicamento.create({
        data: {
          descripcionMed,
          fechaFabricacion: new Date(fechaFabricacion),
          fechaVencimiento: new Date(fechaVencimiento),
          presentacion,
          stock: Number(stock),
          precioVentaUni: parseFloat(precioVentaUni),
          precioVentaPres: parseFloat(precioVentaPres),
          marca,
          CodTipoMed: Number(CodTipoMed)
        }
      })

      return res.status(201).json(nuevo)
    }

    // 📌 PUT
    else if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ error: 'Falta id para actualizar' })

      const {
        descripcionMed,
        fechaFabricacion,
        fechaVencimiento,
        presentacion,
        stock,
        precioVentaUni,
        precioVentaPres,
        marca,
        CodTipoMed
      } = req.body

      if (
        !descripcionMed || !fechaFabricacion || !fechaVencimiento ||
        !presentacion || !stock || !precioVentaUni ||
        !precioVentaPres || !marca || !CodTipoMed
      ) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' })
      }

      const actualizado = await prisma.medicamento.update({
        where: { CodMedicamento: id },
        data: {
          descripcionMed,
          fechaFabricacion: new Date(fechaFabricacion),
          fechaVencimiento: new Date(fechaVencimiento),
          presentacion,
          stock: Number(stock),
          precioVentaUni: parseFloat(precioVentaUni),
          precioVentaPres: parseFloat(precioVentaPres),
          marca,
          CodTipoMed: Number(CodTipoMed)
        }
      })

      return res.status(200).json(actualizado)
    }

    // 📌 DELETE
    else if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'Falta id para eliminar' })

      await prisma.medicamento.delete({
        where: { CodMedicamento: id }
      })

      return res.status(204).end()
    }

    // 📌 Método no permitido
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error en la API /api/medicamento:', error)
    return res.status(500).json({ error: 'Error en el servidor', detalles: error.message })
  }
}
