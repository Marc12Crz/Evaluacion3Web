import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div>
      <Navbar />
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '3rem', 
        marginTop: '2rem' 
      }}>
        Bienvenido a la Farmacia by Cristhian Marcelo C24C
      </h1>
    </div>
  )
}
