import Modal from "../Overlay";
import React, { useContext, useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { message, Spin } from "antd";
import OtpInput from "react-otp-input";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaLock } from "react-icons/fa";
import PasswordSuccess from "../../assets/passwordSuccess.png";
import Swal from "sweetalert2";
import * as API from "../../api/index";

const ForgotPassword = ({ openModal, setOpenModal, setStep, step }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <Modal isOpen={openModal} closeModal={handleClose}>
        {step === 1 ? (
          <EmailInput setStep={setStep} email={email} setEmail={setEmail} />
        ) : step === 2 ? (
          <InputOtp setStep={setStep} otp={otp} setOtp={setOtp} />
        ) : step === 3 ? (
          <PasswordInput setStep={setStep} email={email} otp={otp} />
        ) : step === 4 ? (
          <Success closeModal={handleClose} />
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
};

const Success = ({ closeModal }) => {
  return (
    <div className="my-4 xs:my-2 xs:mt-2 flex flex-col items-center text-center">
      <h3 className="mb-2 text-3xl font-semibold">Success</h3>
      <div className="my-3 items-center">
        <img src={PasswordSuccess} alt="" />
      </div>
      <p className="text-shades-secondary mb-3">
        Go have some fun! Your password has been reset successfully.
      </p>
      <button
        onClick={closeModal}
        className="w-full px-4 py-2 h-[70px] tracking-wide text-white transition-colors duration-200 transform bg-red-800/90 rounded-md hover:bg-red-800 text-lg"
      >
        Click here to login
      </button>
    </div>
  );
};

const PasswordInput = ({ setStep, email, otp }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    const data = {
      email,
      otpCode: otp,
      password: formData.password,
    };

    API.resetForgotPassword(data).then((res) => {
      if (res.success === true) {
        setStep(4);
        setIsLoading(false);
      } else if (res.success === false) {
        Swal.fire({
          title: "Error!",
          text:
            res.message ||
            "Error changing your password, please try again later.",
          icon: "error",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDismissed) {
            setIsLoading(false);
          }
        });
      }
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="my-5 xs:my-2 xs:mt-5 flex flex-col items-center text-center">
      <h3 className="mb-5 text-lg font-semibold">
        Pick something you will remember this time
      </h3>
      <div className="mb-5">
        <div className="relative flex flex-row justify-between items-center w-full h-[60px] text-primary-900 bg-white border rounded-md">
          <span className="absolute pl-3">
            <FaLock size="1.2rem" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
            defaultValue={formData.password}
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
      <div className="mb-5">
        <div className="relative flex flex-row justify-between items-center w-full h-[60px] text-primary-900 bg-white border rounded-md">
          <span className="absolute pl-3">
            <FaLock size="1.2rem" />
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
            defaultValue={formData.confirmPassword}
            className="bg-white w-[100%] pl-10 h-[100%] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
          />
          <span
            className="absolute pr-2 right-0 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <BsEyeSlashFill size="1.2rem" />
            ) : (
              <BsEyeFill size="1.2rem" />
            )}
          </span>
        </div>
      </div>
      <Spin spinning={isLoading}>
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 h-[70px] tracking-wide text-white transition-colors duration-200 transform bg-red-800/90 rounded-md hover:bg-red-800 text-lg"
        >
          Recover password
        </button>
      </Spin>
      <p onClick={() => setStep(2)} className="mt-4 text-red-800">
        Go back
      </p>
    </div>
  );
};

const InputOtp = ({ setStep, otp, setOtp }) => {
  const [hideOtp, setHideOtp] = React.useState(true);
  const handleChange = (otp) => {
    setOtp(otp);
  };
  const handleOtpHide = (e) => {
    e.preventDefault();

    setHideOtp((prev) => !prev);
  };

  const handleSubmit = () => {
    if (otp.length < 6) {
      message.error("Please enter all the OTP.");
      return;
    }
    setStep(3);
  };

  return (
    <div className="my-5 xs:my-2 xs:mt-5 flex flex-col items-center text-center">
      <h3 className="mb-5 text-lg font-semibold">
        Enter the code sent to your phone Number
      </h3>
      <div className="mb-5">
        <div className="flex flex-col justify-center items-center mb-3">
          <OtpInput
            value={otp}
            onChange={handleChange}
            numInputs={6}
            isInputSecure={hideOtp}
            inputStyle="border bg-white border-[#D0D0D0] font-bold text-[32px] text-center !h-[60px] !w-[65px] xs:font-normal xs:text-base xs:!w-[45px] xs:!h-[40px] rounded-[5px] mt-1 mr-2 mb-5"
            shouldAutoFocus={true}
            placeholder={hideOtp ? "******" : "123456"}
            containerStyle="flex !flex-row flex-wrap items-center justify-center"
          />

          {hideOtp ? (
            <p className="text-2xl cursor-pointer" onClick={handleOtpHide}>
              <AiFillEye />
            </p>
          ) : (
            <p className="text-2xl cursor-pointer" onClick={handleOtpHide}>
              <AiFillEyeInvisible />
            </p>
          )}
        </div>
        <p>
          Didn’t get a code?{" "}
          <span className="text-shades-primary cursor-pointer">Click Here</span>
        </p>
      </div>
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 h-[70px] tracking-wide text-white transition-colors duration-200 transform bg-red-800/90 rounded-md hover:bg-red-800 text-lg"
      >
        Recover password
      </button>
      <p onClick={() => setStep(1)} className="mt-4 text-red-800">
        Go back
      </p>
    </div>
  );
};

const EmailInput = ({ setStep, email, setEmail }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (email.length === 0) {
      message.error("Please input an email address.");
      return;
    }
    setIsLoading(true);
    API.requestForgotPassword({ email }).then((res) => {
      if (res.success === true) {
        // success message
        Swal.fire({
          title: "Success!",
          text: "An OTP has been sent to your email.",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDismissed) {
            setStep(2);
            setIsLoading(false);
          }
        });
      } else if (res.success === false) {
        Swal.fire({
          title: "Error!",
          text:
            res.message ||
            "Error sending an OTP to your email, please try again later.",
          icon: "error",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDismissed) {
            setIsLoading(false);
          }
        });
      }
    });
  };

  return (
    <div className="my-5 xs:my-2 xs:mt-5">
      <h3 className="mb-5 text-lg font-semibold">
        So you forgot your password...
      </h3>
      <form action="">
        <div className="mb-5">
          <div className="relative flex flex-row justify-between items-center w-full h-[60px] text-primary-900 bg-white border rounded-md">
            <span className="absolute pl-3">
              <MdEmail size="1.2rem" />
            </span>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              defaultValue={email}
              placeholder="Email address"
              className="bg-white w-[100%] pl-10 h-[100%] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
        </div>
        <Spin spinning={isLoading}>
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 h-[70px] tracking-wide text-white transition-colors duration-200 transform bg-red-800/90 rounded-md hover:bg-red-800 text-lg"
          >
            Recover password
          </button>
        </Spin>
      </form>
    </div>
  );
};

export default ForgotPassword;
