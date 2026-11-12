import { NavLink } from 'react-router';

function Sidebar() {
  return (
    <nav>
      <NavLink to="/app" end>
        Dashboard
      </NavLink>
      <NavLink to="/app/projects">Projects</NavLink>
      <NavLink to="/app/my-tasks">My Tasks</NavLink>
    </nav>
  );
}

export default Sidebar;
