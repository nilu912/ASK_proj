import { Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));

const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Layout;