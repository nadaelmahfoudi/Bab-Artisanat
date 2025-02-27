import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import registerImage from "../assets/SignZelij.png";
import doorImage from "../assets/Door.png";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await axios.post("http://localhost:3000/auth/register", formData);
      
      if (response.status === 201 || response.status === 200) { 
        navigate("/login"); 
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };
  

  return (
    <section className="ezy__signup14 light flex items-center justify-center py-14 md:py-24 text-black bg-cover bg-right bg-no-repeat relative">
      {/* Blurred background image */}
      <div
        className="absolute inset-0 bg-cover bg-right bg-no-repeat"
        style={{
          backgroundImage: `url(${registerImage})`,
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
                    <h2 className="text-[26px] leading-none font-bold mb-2">REGISTER</h2>
                    <p className="text-sm mb-4">This is your door to discover Moroccan heritage.</p>

                    {error && <p className="text-red-500">{error}</p>}

                    <form className="w-full mt-6" onSubmit={handleSubmit}>
                      <div className="w-full relative mb-4">
                        <input
                          type="text"
                          className="border-b border-black focus:outline-none focus:border-blue-600 text-sm w-full py-2"
                          id="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
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
                        Register
                      </button>
                      <div className="text-center mt-4">
                        <p className="mb-0 text-sm">
                          I already have an account?{" "}
                          <span onClick={() => navigate("/login")} className="hover:text-blue-600 cursor-pointer">
                            Login
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

export default Register;
