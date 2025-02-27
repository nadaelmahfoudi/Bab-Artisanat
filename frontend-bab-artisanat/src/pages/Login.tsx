import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loginImage from "../assets/SignZelij.png";
import doorImage from "../assets/Door.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  // Gérer la saisie des champs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await axios.post("http://localhost:3000/auth/login", formData);
  
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        throw new Error("Token not received");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  

  return (
    <section className="ezy__signup14 light flex items-center justify-center py-14 md:py-24 text-black bg-cover bg-right bg-no-repeat relative">
      {/* Blurred background image */}
      <div
        className="absolute inset-0 bg-cover bg-right bg-no-repeat"
        style={{ backgroundImage: `url(${loginImage})`, filter: "blur(4px)", zIndex: "-1" }}
      ></div>

      {/* Content Container */}
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3">
            <div className="bg-white shadow-xl p-4">
              <div className="flex flex-wrap items-center">
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center justify-center h-full">
                    <img src={doorImage} alt="Moroccan Door" className="max-h-[300px] w-full lg:max-h-full lg:h-full object-cover" />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 mt-6 lg:mt-0 lg:pl-6">
                  <div className="flex flex-col justify-center items-center text-center h-full p-2">
                    <h2 className="text-[26px] leading-none font-bold mb-2">LOGIN</h2>

                    {/* Affichage des erreurs */}
                    {error && <p className="text-red-500">{error}</p>}

                    <form className="w-full mt-6" onSubmit={handleSubmit}>
                      <div className="w-full relative mb-4">
                        <input
                          type="email"
                          className="border-b border-black focus:outline-none focus:border-blue-600 text-sm w-full py-2"
                          id="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="w-full relative mb-4">
                        <input
                          type="password"
                          className="border-b border-black focus:outline-none focus:border-blue-600 text-sm w-full py-2"
                          id="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <button type="submit" className="bg-gray-700 py-4 px-10 text-white hover:bg-opacity-95 mt-4">
                        Login
                      </button>
                      <div className="text-center mt-4">
                        <p className="mb-0 text-sm">
                          I don't have an account?{" "}
                          <span onClick={() => navigate("/register")} className="hover:text-blue-600 cursor-pointer">
                            Register
                          </span>
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
