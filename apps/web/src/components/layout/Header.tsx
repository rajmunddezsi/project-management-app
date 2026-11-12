import { Link } from 'react-router';

function Header() {
  return (
    <header>
      <Link to="/app">Project Management App</Link>
      <div>Welcome back!</div>
    </header>
  );
}

export default Header;
