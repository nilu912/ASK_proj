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
const DirectorsManagement = lazy(() => import("./pages/admin/DirectorsManagement"));
const EventsManagement = lazy(() => import("./pages/admin/EventsManagement"));
const GalleryManagement = lazy(() => import("./pages/admin/GalleryManagement"));
const InquiriesManagement = lazy(() => import("./pages/admin/InquiriesManagement"));
const DonationsManagement = lazy(() => import("./pages/admin/DonationsManagement"));
const HandlersManagement = lazy(() => import("./pages/admin/HandlersManagement"));
const EventCreate = lazy(() => import("./pages/admin/EventCreate"));
const EventRegistrations = lazy(() => import("./pages/admin/EventRegistrations"));
const GalleryUpload = lazy(() => import("./pages/admin/GalleryUpload"));
const GalleryEdit = lazy(() => import("./pages/admin/GalleryEdit"));
const HandlersCreate = lazy(() => import("./pages/admin/HandlersCreate"));
const EventEdit = lazy(() => import("./pages/admin/EventEdit"));
const HandlerEdit = lazy(() => import("./pages/admin/HandlerEdit"));

const QueryHandlerLogin = lazy(() => import("./pages/handler/QueryHandlerLogin"));
const QueryHandlerDashboard = lazy(() => import("./pages/handler/QueryHandlerDashboard"))

// Layouts
const Layout = lazy(() => import("./components/layout/Layout"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));

// Route protection
import ProtectedRoute from "./components/ProtectedRoute"; // Updated import

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

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  expectedRole="admin" // Only admins allowed
                  loginPath="/admin/login"
                  unauthorizedRedirectPath="/query-handler" // Redirect wrong role users to handler dashboard
                >
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="directors" element={<DirectorsManagement />} />
              <Route path="events" element={<EventsManagement />} />
              <Route path="events/create" element={<EventCreate />} />
              <Route path="events/:eventId/registrations" element={<EventRegistrations />} />
              <Route path="events/edit/:eventId" element={<EventEdit />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="gallery/upload" element={<GalleryUpload />} />
              <Route path="gallery/edit/:id" element={<GalleryEdit />} />
              <Route path="inquiries" element={<InquiriesManagement />} />
              <Route path="donations" element={<DonationsManagement />} />
              <Route path="handlers" element={<HandlersManagement />} />
              <Route path="handlers/create" element={<HandlersCreate />} />
              <Route path="handlers/edit/:handlerId" element={<HandlerEdit />} />
            </Route>

            {/* Query Handler Login */}
            {/* <Route path="/query-handler/login" element={<QueryHandlerLogin />} /> */}

            {/* Query Handler Protected Routes */}
            <Route
              path="/query-handler"
              element={
                <ProtectedRoute
                  expectedRole="handler" // Only query handlers allowed
                  loginPath="/admin/login"
                  unauthorizedRedirectPath="/admin" // Redirect wrong role users to admin dashboard
                >
                  <QueryHandlerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Optional: Add a general 404 page */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Suspense, lazy } from "react";
// import { HelmetProvider } from "react-helmet-async";
// import "./App.css";
// import "./i18n";

// // Lazy load pages
// const Home = lazy(() => import("./pages/Home"));
// const Gallery = lazy(() => import("./pages/Gallery"));
// const Events = lazy(() => import("./pages/Events"));
// const Donation = lazy(() => import("./pages/Donation"));
// const Inquiry = lazy(() => import("./pages/Inquiry"));
// const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
// const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
// const DirectorsManagement = lazy(() => import("./pages/admin/DirectorsManagement"));
// const EventsManagement = lazy(() => import("./pages/admin/EventsManagement"));
// const GalleryManagement = lazy(() => import("./pages/admin/GalleryManagement"));
// const InquiriesManagement = lazy(() => import("./pages/admin/InquiriesManagement"));
// const DonationsManagement = lazy(() => import("./pages/admin/DonationsManagement"));
// const HandlersManagement = lazy(() => import("./pages/admin/HandlersManagement"));
// const EventCreate = lazy(() => import("./pages/admin/EventCreate"));
// const EventRegistrations = lazy(() => import("./pages/admin/EventRegistrations"));
// const GalleryUpload = lazy(() => import("./pages/admin/GalleryUpload"));
// const GalleryEdit = lazy(() => import("./pages/admin/GalleryEdit"));
// const HandlersCreate = lazy(() => import("./pages/admin/HandlersCreate"));
// const EventEdit = lazy(() => import("./pages/admin/EventEdit"));
// const HandlerEdit = lazy(() => import("./pages/admin/HandlerEdit"));

// const QueryHandlerLogin = lazy(() => import("./pages/handler/QueryHandlerLogin"));
// const QueryHandlerDashboard = lazy(() => import("./pages/handler/QueryHandlerDashboard"))

// // Layouts
// const Layout = lazy(() => import("./components/layout/Layout"));
// const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));

// // Route protection
// import PrivateRoute from "./components/ProtectedRoute";

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
//             <Route
//               path="/admin"
//               element={
//                 <PrivateRoute>
//                   <AdminLayout />
//                 </PrivateRoute>
//               }
//             >
//               <Route index element={<AdminDashboard />} />
//               <Route path="directors" element={<DirectorsManagement />} />
//               <Route path="events" element={<EventsManagement />} />
//               <Route path="events/create" element={<EventCreate />} />
//               <Route path="events/:eventId/registrations" element={<EventRegistrations />} />
//               <Route path="events/edit/:eventId" element={<EventEdit />} />
//               <Route path="gallery" element={<GalleryManagement />} />
//               <Route path="gallery/upload" element={<GalleryUpload />} />
//               <Route path="gallery/edit/:id" element={<GalleryEdit />} />
//               <Route path="inquiries" element={<InquiriesManagement />} />
//               <Route path="donations" element={<DonationsManagement />} />
//               <Route path="handlers" element={<HandlersManagement />} />
//               <Route path="handlers/create" element={<HandlersCreate />} />
//               <Route path="handlers/edit/:handlerId" element={<HandlerEdit />} />
//             </Route>

//             <Route path="/query-handler/login" element={<QueryHandlerLogin />} />
//             <Route path="/query-handler" element={<QueryHandlerDashboard />} />
//           </Routes>
//         </Suspense>
//       </Router>
//     </HelmetProvider>
//   );
// }

// export default App;
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// // import { Suspense, lazy } from "react"
// // import { HelmetProvider } from "react-helmet-async"
// // import "./App.css"
// // import './i18n'


// // // Lazy load components for better performance
// // const Home = lazy(() => import("./pages/Home"))
// // const Gallery = lazy(() => import("./pages/Gallery"))
// // const Events = lazy(() => import("./pages/Events"))
// // const Donation = lazy(() => import("./pages/Donation"))
// // const Inquiry = lazy(() => import("./pages/Inquiry"))
// // const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"))
// // const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"))

// // // Layout components
// // const Layout = lazy(() => import("./components/layout/Layout"))
// // const AdminLayout = lazy(() => import("./components/layout/AdminLayout"))

// // function App() {
// //   return (
// //     <HelmetProvider>
// //       <Router>
// //         <Suspense
// //           fallback={
// //             <div className="flex items-center justify-center h-screen">
// //               Loading...
// //             </div>
// //           }
// //         >
// //           <Routes>
// //             {/* Public Routes */}
// //             <Route path="/" element={<Layout />}>
// //               <Route index element={<Home />} />
// //               <Route path="gallery" element={<Gallery />} />
// //               <Route path="events" element={<Events />} />
// //               <Route path="donate" element={<Donation />} />
// //               <Route path="inquiry" element={<Inquiry />} />
// //             </Route>

// //             {/* Admin Routes */}
// //             <Route path="/admin/login" element={<AdminLogin />} />
// //             <Route path="/admin" element={<AdminLayout />}>
// //               <Route index element={<AdminDashboard />} />
// //               {/* Other admin routes will be added here */}
// //             </Route>
// //           </Routes>
// //         </Suspense>
// //       </Router>
// //     </HelmetProvider>
// //   )
// // }

// // export default App
