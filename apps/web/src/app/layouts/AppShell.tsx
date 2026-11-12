import { Outlet } from 'react-router';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';

import styles from './AppShell.module.css';

function AppShell() {
  return (
    <div className={styles.appShell}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>

      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>

      <div className={styles.page}>
        <Header />
        <main id="main-content" className={styles.main} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
