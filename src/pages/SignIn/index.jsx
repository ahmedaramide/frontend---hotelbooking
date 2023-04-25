import React, { useState, useRef, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { message, Spin } from "antd";
import Swal from "sweetalert2";
import ForgotPassword from "../../components/ForgotPassword";
import * as API from "../../api/index";
import { encode, hotelToken, userData } from "../../utils/helpers";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Function to show the password when they switch
  const [showPassword, setShowPassword] = useState(false);

  // ref to manage te email field
  const emailRef = useRef(null);
  // ref to manage te password field
  const passwordRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);

  const { state } = useLocation();

  // This is from react to goto a page or route to a page, it monitors the state of the routes
  const navigate = useNavigate();

  // This useEffect will run once the page is loaded but before the HTML content is displayed
  useEffect(() => {
    setForgotPasswordStep(1);
  }, [openModal]);

  // Function to handle the sign in button
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (email.length <= 0 || password.length <= 0) {
      message.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    const formData = {
      email,
      password,
    };

    // Send API request
    await API.signIn(formData)
      .then((response) => {
        const encodedToken = encode(response.data?.token);
        window.localStorage.setItem(hotelToken, encodedToken);
        window.localStorage.setItem(
          userData,
          JSON.stringify(response.data?.result)
        );
        // success message
        Swal.fire({
          title: "Success!",
          text: "You have successfully logged in",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDismissed) {
            const path = state ? state?.from : "/";
            navigate(path);
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text:
            err?.response?.data?.message ||
            "Error signing in, please try again later.",
          icon: "error",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDismissed) {
            setIsLoading(false);
          }
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section className="text-gray-800 text-center lg:text-left w-[100vw] h-[100vh] max-w-full max-h-full xxs:h-auto">
      <div className="w-full h-full grid grid-cols-2 xs:block items-center">
        <div className="w-full h-full mr-2 xs:hidden flex flex-col bg-red-800 justify-center items-center">
          {/* <img
            src={logo}
            alt="Hammed logo"
            className="w-[40%] h-[20%] mb-12 xs-w-[80%]"
          /> */}
          <h3 className="mt-6 mb-10 text-2xl text-white font-extrabold">
            Hotel management
          </h3>
          <p className="text-white text-lg max-w-[500px] text-center">
            Book your preferred room with ease.
          </p>
        </div>

        <div className="px-8 w-full h-full flex flex-col items-center justify-center bg-[#f9f9f9] xs:py-6">
          {/* <img
            src={greenLogo}
            alt="Hammed logo"
            className="w-[150px] h-[70px] mb-12 hidden xs:block"
          /> */}
          <h3 className="mb-2 text-4xl text-center font-extrabold text-flush-300">
            Welcome Back
          </h3>
          <p className="mb-12 text-shades-secondary">Login to continue</p>
          <form>
            <div className="mb-5">
              <div className="relative flex flex-row justify-between items-center w-full h-[60px] text-primary-900 bg-white border rounded-md">
                <span className="absolute pl-3">
                  <FaUserAlt size="1.2rem" />
                </span>
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Email address"
                  className="bg-white w-[100%] pl-10 h-[100%] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
            </div>
            <div className="mb-5">
              <div className="relative flex flex-row justify-between items-center w-full h-[60px] text-primary-900 bg-white border rounded-md">
                <span className="absolute pl-3">
                  <FaLock size="1.2rem" />
                </span>
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="bg-white w-[100%] pl-10 h-[100%] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                <span
                  className="absolute pr-2 right-0 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <BsEyeSlashFill size="1.2rem" />
                  ) : (
                    <BsEyeFill size="1.2rem" />
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpenModal(true)}
              className="w-full text-base text-status-danger/70 text-right"
            >
              Forget Password?
            </button>
            <div className="mt-7">
              <Spin spinning={isLoading}>
                <button
                  onClick={handleSubmit}
                  className="w-full px-4 py-2 h-[70px] tracking-wide text-white transition-colors duration-200 transform bg-red-700/90 rounded-md hover:bg-red-700 text-lg"
                >
                  Login
                </button>
              </Spin>
            </div>
          </form>
          <div className="mt-5">
            <p>
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/sign-up")}
                className="text-shades-primary cursor-pointer"
              >
                Register Now
              </span>
            </p>
          </div>
        </div>
      </div>
      {openModal && (
        <ForgotPassword
          openModal={openModal}
          setOpenModal={setOpenModal}
          step={forgotPasswordStep}
          setStep={setForgotPasswordStep}
        />
      )}
    </section>
  );
};

export default SignIn;
