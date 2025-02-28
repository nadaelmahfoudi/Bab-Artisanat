import headerImage from "../assets/Zelij1.png";
import ProductList from "../components/ProductList";

const HomePage = () => {
  return (
    <>
      <section className="relative text-white py-32 md:py-52 overflow-hidden">
        {/* Blurred Background with Less Blur (2px) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url(${headerImage})`,
            filter: "blur(2px)", // Custom blur effect
          }}
        ></div>

        {/* Content (Ensures Text is Not Blurred) */}
        <div className="relative z-10 container px-4 mx-auto">
          <div className="md:max-w-5xl mx-auto flex justify-center items-center text-center">
            <div>
              <h1
                className="text-3xl font-bold text-neutral-50 leading-tight md:text-[62px] mb-2"
                style={{
                  textShadow: "2px 2px 6px rgba(0, 0, 0, 0.8)", // Black blur shadow effect
                }}
              >
                Discover the Beauty of Moroccan Artisanat
              </h1>
              <p
                className="text-xl opacity-80 text-neutral-50 leading-snug px-12 py-6"
                style={{
                  textShadow: "2px 2px 6px rgba(0, 0, 0, 0.8)", // Black blur shadow effect
                }}
              >
                Explore the rich heritage of handcrafted Moroccan treasures, from
                intricate zellij tiles to beautifully woven carpets. Each piece
                tells a story of tradition, skill, and timeless artistry.
              </p>

              {/* Discover More Button */}
              <div className="sm:max-w-lg mx-auto flex justify-center">
                <button className="bg-lime-800 hover:bg-lime-900 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300">
                  Discover More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product List Section */}
      <ProductList />
    </>
  );
};

export default HomePage;
