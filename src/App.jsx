import React from "react";
import {
  About,
  Contact,
  Experience,
  Footer,
  Header,
  Nav,
  Testimonials,
} from "./components";

const App = () => {
  return (
    <>
      <Header />
      <Nav />
      <About />
      <Experience />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
};

export default App;
