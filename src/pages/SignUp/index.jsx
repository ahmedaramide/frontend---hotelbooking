import { useState } from "react";
import { BsEyeFill, BsEyeSlashFill, BsFillPhoneFill } from "react-icons/bs";
import { FaLock, FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Spin, message } from "antd";
import * as API from "../../api/index";
import { encode, hotelToken, userData } from "../../utils/helpers";

const SignUp = () => {
  // This is from react to goto a page or route to a page, it monitors the state of the routes
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const verifyStepOne = () => {
    if (formData.firstName === "") {
      message.error("First name is required");
      return false;
    } else if (formData.lastName === "") {
      message.error("Last name is required");
      return false;
    } else if (formData.username === "") {
      message.error("Username is required");
      return false;
    } else if (formData.phone === "") {
      message.error("Phone number is required");
      return false;
    } else if (formData.email === "") {
      message.error("Email is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (step === 1) {
      const res = verifyStepOne();
      if (res === true) {
        setIsLoading(false);
        setStep(2);
      } else {
        setIsLoading(false);
        return;
      }
    } else if (step === 2) {
      if (formData.password !== formData.confirmPassword) {
        message.error("Passwords do not match");
        setIsLoading(false);
        return;
      } else if (formData.password.length === 0) {
        message.error("Password is required");
        setIsLoading(false);
        return;
      }
      await API.signUp(formData)
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
            text: "You have successfully sign up.",
            icon: "success",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed || result.isDenied || result.isDismissed) {
              navigate("/");
            }
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text:
              err?.response?.data?.map((item) => `${item} \n`) ||
              "Error signing up, please try again later.",
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
    }
  };

  return (
    <Spin spinning={isLoading}>
      <section className="text-gray-800 text-center lg:text-left w-[100vw] h-[100vh] max-w-full max-h-full">
        <div className="w-full h-full grid grid-cols-2 xs:block items-center">
          <div className="w-full h-full mr-2 xs:hidden flex flex-col bg-red-800 justify-center items-center">
            {/* <img
            src={logo}
              alt="Hammed logo"
              className="w-[40%] h-[20%] mb-12 xs-w-[80%]"
            /> */}
            <h3 className="mt-6 mb-10 text-2xl text-white font-extrabold">
              Book and lodge in your preferred room
            </h3>
            <p className="text-white text-lg max-w-[500px] text-center">
              Enjoyable hotels for our Users
            </p>
          </div>

          <div className="bg-[#f5f5f5] w-full min-h-full px-8 flex items-center justify-center flex-col xs:flex xs:flex-col xs:justify-center xs:w-full xs:py-10">
            {step === 1 ? (
              <StepOne formData={formData} handleChange={handleChange} />
            ) : step === 2 ? (
              <StepTwo formData={formData} handleChange={handleChange} />
            ) : null}

            {step !== 3 && (
              <div className="flex flex-row justify-between items-center gap-3 w-[65%] xs:w-[80%] sm:w-[80%] md:w-[73%]">
                {step > 1 && (
                  <button
                    onClick={handleGoBack}
                    className="bg-transparent w-[40%] py-5 rounded-lg border-2 border-red-800 text-red-800 mt-6 hover:bg-red-800 hover:text-shades-white transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  className="bg-red-800/90 w-[70%] mx-auto py-5 rounded-lg text-shades-white mt-6 hover:bg-red-800 transition-all"
                >
                  Continue
                </button>
              </div>
            )}

            <p className="text-shades-secondary mt-5">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/sign-in")}
                className="text-shades-primary cursor-pointer"
              >
                Sign In
              </span>{" "}
            </p>
          </div>
        </div>
      </section>
    </Spin>
  );
};

const StepOne = ({ formData, handleChange }) => {
  return (
    <div className="w-[70%] xs:w-[85%] md:w-[80%]">
      <div className="w-full max-w-full mb-3 flex flex-col justify-center items-center">
        {/* <img
          src={greenLogo}
          alt="Hammed logo"
          className="w-[150px] h-[70px] mb-12 hidden xs:block"
        /> */}
        <h3 className="mb-2 text-4xl text-center font-extrabold text-flush-100 xs:text-3xl">
          Create Account
        </h3>
        <p className="mb-12 text-shades-secondary text-sm font-normal">
          How can we contact you ?
        </p>
      </div>
      <form action="">
        <div className="mb-5">
          <div className="relative flex flex-row justify-between items-center w-full h-[60px] text-primary-900 bg-white border rounded-md">
            <span className="absolute pl-3">
              <FaUserAlt size="1.2rem" />
            </span>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              defaultValue={formData.firstName}
              onChange={handleChange}
              className="bg-white xs:text-[14px] w-[100%] pl-10 h-[100%] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
        </div>
        <div className="mb-5">
          <div className="relative flex flex-row justify-between items-center w-full h-[60px] text-primary-900 bg-white border rounded-md">
            <span className="absolute pl-3">
              <FaUserAlt size="1.2rem" />
            </span>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              defaultValue={formData.lastName}
              onChange={handleChange}
              className="bg-white xs:text-[14px] w-[100%] pl-10 h-[100%] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
        </div>
        <div className="mb-5">
          <div className="relative flex flex-row justify-between items-center w-full h-[60px] text-primary-900 bg-white border rounded-md">
            <span className="absolute pl-3">
              <FaUserAlt size="1.2rem" />
            </span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              defaultValue={formData.username}
              onChange={handleChange}
              className="bg-white xs:text-[14px] w-[100%] pl-10 h-[100%] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
        </div>
        <div className="mb-5">
          <div className="relative flex flex-row justify-between items-center w-full h-[60px] text-primary-900 bg-white border rounded-md">
            <span className="absolute pl-3">
              <MdEmail size="1.2rem" />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              defaultValue={formData.email}
              onChange={handleChange}
              className="bg-white xs:text-[14px] w-[100%] pl-10 h-[100%] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

const StepTwo = ({ formData, handleChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-[70%] xs:w-[85%] md:w-[80%]">
      <div className="w-full max-w-full mb-3 flex flex-col justify-center items-center">
        {/* <img
          src={greenLogo}
          alt="Hammed logo"
          className="w-[150px] h-[70px] mb-12 hidden xs:block"
        /> */}
        <h3 className="mb-2 text-4xl text-center font-extrabold text-flush-300 xs:text-3xl">
          Create Account
        </h3>
        <p className="mb-12 text-shades-secondary text-sm font-normal">
          Complete the required registration details
        </p>
      </div>
      <form action="">
        <div className="mb-5">
          <div className="relative flex flex-row justify-between items-center w-full h-[60px] text-primary-900 bg-white border rounded-md">
            <span className="absolute pl-3">
              <FaLock size="1.2rem" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              defaultValue={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-white xs:text-[14px] w-[100%] pl-10 h-[100%] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
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
        <div className="mb-5">
          <div className="relative flex flex-row justify-between items-center w-full h-[60px] text-primary-900 bg-white border rounded-md">
            <span className="absolute pl-3">
              <FaLock size="1.2rem" />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              defaultValue={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="bg-white xs:text-[14px] w-[100%] pl-10 h-[100%] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            <span
              className="absolute pr-2 right-0 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showPassword ? (
                <BsEyeSlashFill size="1.2rem" />
              ) : (
                <BsEyeFill size="1.2rem" />
              )}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
