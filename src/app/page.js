import Footer from "./(Footer)/Footer";
import About from "./(Home)/(Sections)/About";
import Melodies from "./(Home)/(Sections)/Melodies";
import Transform from "./(Home)/(Sections)/Transform";
import Tunes from "./(Home)/(Sections)/Tunes";
import Work from "./(Home)/(Sections)/Work";
import Homepage from "./(Home)/Homepage";

export default function Home() {
  return (
    <>
      {/* <AnimatedWaves /> */}
        <Homepage />
      <div className="flex flex-col gap-34 px-15 max-sm:px-0 max-sm:w-full max-sm:gap-32">
        <Work />
        <About />
        <Transform />
        <Tunes />
        <Melodies />
      </div>
        <Footer />
    </>
  );
}
