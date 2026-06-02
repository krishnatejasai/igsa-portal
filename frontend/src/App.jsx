import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";

function Placeholder({ title }) {
  return (
    <div className="min-h-screen pt-32 px-6 bg-slate-50">
      <h1 className="text-4xl font-bold text-blue-950">
        {title}
      </h1>
    </div>
  );
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<Placeholder title="About" />} />

        <Route path="/board" element={<Placeholder title="Board" />} />

        <Route path="/events" element={<Placeholder title="Events" />} />

        <Route path="/gallery" element={<Placeholder title="Gallery" />} />

        <Route path="/contact" element={<Placeholder title="Contact" />} />

        <Route path="/admin/login" element={<Placeholder title="Board Login" />} />

      </Routes>
    </>
  );
}

export default App;