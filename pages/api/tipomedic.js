import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const tipos = await prisma.tipoMedic.findMany()
      return res.status(200).json(tipos)
    } else {
      res.setHeader('Allow', ['GET'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error en /api/tipomedic:', error)
    return res.status(500).json({ error: 'Error en el servidor', detalles: error.message })
  }
}
