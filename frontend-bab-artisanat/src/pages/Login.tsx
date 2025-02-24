import { useNavigate } from "react-router-dom";
import loginImage from "../assets/SignZelij.png";
import doorImage from "../assets/Door.png";

const Login = () => {
  const navigate = useNavigate();

  return (
    <section className="ezy__signup14 light flex items-center justify-center py-14 md:py-24 text-black bg-cover bg-right bg-no-repeat relative">
      {/* Blurred background image */}
      <div
        className="absolute inset-0 bg-cover bg-right bg-no-repeat"
        style={{
          backgroundImage: `url(${loginImage})`,
          filter: "blur(4px)",
          zIndex: "-1",
        }}
      ></div>

      {/* Content Container */}
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3">
            <div className="bg-white shadow-xl p-4">
              <div className="flex flex-wrap items-center">
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={doorImage}
                      alt="Moroccan Door"
                      className="max-h-[300px] w-full lg:max-h-full lg:h-full object-cover"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 mt-6 lg:mt-0 lg:pl-6">
                  <div className="flex flex-col justify-center items-center text-center h-full p-2">
                    <h2 className="text-[26px] leading-none font-bold mb-2">LOGIN</h2>
                    <form className="w-full mt-6">
                      <div className="w-full relative mb-4">
                        <input
                          type="email"
                          className="border-b border-black focus:outline-none focus:border-blue-600 text-sm w-full py-2"
                          id="email"
                          placeholder="Email Address"
                        />
                        <i className="fas fa-envelope absolute top-1/2 -translate-y-1/2 right-2 opacity-80"></i>
                      </div>
                      <div className="w-full relative mb-4">
                        <input
                          type="password"
                          className="border-b border-black focus:outline-none focus:border-blue-600 text-sm w-full py-2"
                          id="password"
                          placeholder="Password"
                        />
                        <i className="fas fa-lock absolute top-1/2 -translate-y-1/2 right-2 opacity-80"></i>
                      </div>
                      <button type="submit" className="bg-gray-700 py-4 px-10 text-white hover:bg-opacity-95 mt-4">
                        Login <i className="fas fa-arrow-right"></i>
                      </button>
                      <div className="text-center mt-4">
                        <p className="mb-0 text-sm">
                          I don't have an account?{" "}
                          <a onClick={() => navigate("/register")} className="hover:text-blue-600 cursor-pointer">
                            Register
                          </a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
