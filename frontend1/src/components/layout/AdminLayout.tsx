import { Outlet, Navigate } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';

const AdminSidebar = lazy(() => import('./AdminSidebar'));
const AdminHeader = lazy(() => import('./AdminHeader'));

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <AdminSidebar />
      </Suspense>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <AdminHeader />
        </Suspense>
        
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;