import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminEvents from "./pages/AdminEvents";
import CreateEvent from "./pages/CreateEvent";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminGallery from "./pages/AdminGallery";
import AdminBoard from "./pages/AdminBoard";
import EventRegistration from "./pages/EventRegistration";
import EditEvent from "./pages/EditEvent";
import UploadGallery from "./pages/UploadGallery";
import CreateBoardMember from "./pages/CreateBoardMember";
import Board from "./pages/Board";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminMessages from "./pages/AdminMessages";
import About from "./pages/About";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import GalleryAlbum from "./pages/GalleryAlbum";
import AdminUsers from "./pages/AdminUsers";
const AdminCheckIn = lazy(() => import("./pages/AdminCheckIn"));

function App() {
  const { pathname } = useLocation();
  return (
    <>
      {!pathname.startsWith("/admin") && <Navbar />}

      <Suspense fallback={<main className="p-10 pt-32" role="status">Loading page…</main>}>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/board" element={<Board />} />
  <Route path="/events" element={<Events />} />
  <Route path="/gallery" element={<Gallery />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/gallery/:id" element={<GalleryAlbum />} />
  

  {/* Public */}
  <Route path="/events/register/:id" element={<EventRegistration />} />
  <Route path="/admin/login" element={<AdminLogin />} />

  {/* Protected Admin Routes */}
  <Route
  path="/admin/check-in"
  element={
    <ProtectedRoute>
      <AdminCheckIn />
    </ProtectedRoute>
  }
/>
  <Route
  path="/admin/users"
  element={
    <ProtectedRoute>
      <AdminUsers />
    </ProtectedRoute>
  }
/>
  <Route
    path="/admin/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/events"
    element={
      <ProtectedRoute>
        <AdminEvents />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/events/create"
    element={
      <ProtectedRoute>
        <CreateEvent />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/events/edit/:id"
    element={
      <ProtectedRoute>
        <EditEvent />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/registrations"
    element={
      <ProtectedRoute>
        <AdminRegistrations />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/gallery"
    element={
      <ProtectedRoute>
        <AdminGallery />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/gallery/upload"
    element={
      <ProtectedRoute>
        <UploadGallery />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/board"
    element={
      <ProtectedRoute>
        <AdminBoard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/board/create"
    element={
      <ProtectedRoute>
        <CreateBoardMember />
      </ProtectedRoute>
    }
  />




  <Route
    path="/admin/messages"
    element={
      <ProtectedRoute>
        <AdminMessages />
      </ProtectedRoute>
    }
  />
  <Route path="/admin/board/edit/:id" element={<ProtectedRoute><CreateBoardMember /></ProtectedRoute>} />
  <Route path="/admin/gallery/edit/:id" element={<ProtectedRoute><UploadGallery /></ProtectedRoute>} />
  <Route path="*" element={<main className="min-h-screen pt-40 px-6 text-center"><h1 className="text-4xl font-bold text-blue-950">Page not found</h1><p className="my-5 text-slate-600">This page may have moved or the link is incorrect.</p><Link to="/" className="text-blue-800 underline">Return to IGSA home</Link></main>} />
</Routes>
      </Suspense>
    </>
  );
}

export default App;