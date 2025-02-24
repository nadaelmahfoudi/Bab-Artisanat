import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faPinterest, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white">
      <div className="bg-stone-300 text-white py-8">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col items-center lg:flex-row lg:justify-between space-y-6 lg:space-y-0">

            {/* Copyright Section */}
            <div className="text-center lg:text-left">
              <p className="text-amber-950 font-medium">© All rights reserved</p>
            </div>

            {/* Centered Navigation Links */}
            <div>
              <ul className="flex justify-center space-x-8 text-amber-950 font-medium">
                <li>
                  <a href="#" className="hover:underline">Home</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">About</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Contact</a>
                </li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div>
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="hover:opacity-80">
                    <FontAwesomeIcon icon={faFacebook} className="text-amber-950 text-2xl" />
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-80">
                    <FontAwesomeIcon icon={faTwitter} className="text-amber-950 text-2xl" />
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-80">
                    <FontAwesomeIcon icon={faPinterest} className="text-amber-950 text-2xl" />
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-80">
                    <FontAwesomeIcon icon={faLinkedin} className="text-amber-950 text-2xl" />
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
