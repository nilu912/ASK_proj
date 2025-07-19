import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";
import "./i18n";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Events = lazy(() => import("./pages/Events"));
const Donation = lazy(() => import("./pages/Donation"));
const Inquiry = lazy(() => import("./pages/Inquiry"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

// Layouts
const Layout = lazy(() => import("./components/layout/Layout"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));

// Route protection
import PrivateRoute from "./components/ProtectedRoute";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              Loading...
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="events" element={<Events />} />
              <Route path="donate" element={<Donation />} />
              <Route path="inquiry" element={<Inquiry />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              {/* More protected admin routes here */}
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { Suspense, lazy } from "react"
// import { HelmetProvider } from "react-helmet-async"
// import "./App.css"
// import './i18n'


// // Lazy load components for better performance
// const Home = lazy(() => import("./pages/Home"))
// const Gallery = lazy(() => import("./pages/Gallery"))
// const Events = lazy(() => import("./pages/Events"))
// const Donation = lazy(() => import("./pages/Donation"))
// const Inquiry = lazy(() => import("./pages/Inquiry"))
// const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"))
// const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"))

// // Layout components
// const Layout = lazy(() => import("./components/layout/Layout"))
// const AdminLayout = lazy(() => import("./components/layout/AdminLayout"))

// function App() {
//   return (
//     <HelmetProvider>
//       <Router>
//         <Suspense
//           fallback={
//             <div className="flex items-center justify-center h-screen">
//               Loading...
//             </div>
//           }
//         >
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Layout />}>
//               <Route index element={<Home />} />
//               <Route path="gallery" element={<Gallery />} />
//               <Route path="events" element={<Events />} />
//               <Route path="donate" element={<Donation />} />
//               <Route path="inquiry" element={<Inquiry />} />
//             </Route>

//             {/* Admin Routes */}
//             <Route path="/admin/login" element={<AdminLogin />} />
//             <Route path="/admin" element={<AdminLayout />}>
//               <Route index element={<AdminDashboard />} />
//               {/* Other admin routes will be added here */}
//             </Route>
//           </Routes>
//         </Suspense>
//       </Router>
//     </HelmetProvider>
//   )
// }

// export default App
