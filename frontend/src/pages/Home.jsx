import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import EventsSection from "../components/EventsSection";
import BoardSection from "../components/BoardSection";
import GallerySection from "../components/GallerySection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import AnnouncementSection from "../components/AnnouncementSection";

function Home() {
  return (
    <>
  <Hero />
<AboutSection />
<EventsSection />
<AnnouncementSection />
<BoardSection />
<GallerySection />
<ContactSection />
<Footer />
</>
  );
}

export default Home;