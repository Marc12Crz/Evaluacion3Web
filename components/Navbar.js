import Link from 'next/link'
import styles from './Navbar.module.css'

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>Farmacia</div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/" legacyBehavior>
            <a>Inicio</a>
          </Link>
        </li>
        <li>
          <Link href="/productos" legacyBehavior>
            <a>Productos</a>
          </Link>
        </li>
        <li>
          <Link href="#" legacyBehavior>
            <a>Contacto</a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
