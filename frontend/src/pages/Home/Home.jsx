import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/common/Hero";
import Features from "../../components/common/Features";
import About from "../../components/common/About";
import HowItWorks from "../../components/common/HowItWorks";
import Testimonials from "../../components/common/Testimonials";
import Footer from "../../components/layout/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </>
  );
}

export default Home;