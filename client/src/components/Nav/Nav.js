import { Link } from 'react-router-dom';
import './Nav.css';

const Nav = ({ active }) => {
  return (
    <div className="nav-links">
      <Link to="/" className={active === 'home' ? 'active' : ''}>Home</Link>
      <Link to="/lists" className={active === 'lists' ? 'active' : ''}>Lists</Link>
      <Link to="/media" className={active === 'media' ? 'active' : ''}>Movies / Shows</Link>
    </div>
  )
}

export default Nav
