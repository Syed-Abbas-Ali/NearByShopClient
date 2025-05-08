import React, { useRef, useEffect, useState } from "react";
import "./otp.scss";
import authUser from "../../../assets/otpNewUser.svg";
import { useNavigate } from "react-router-dom";
import {
  useResendOtpApiMutation,
  useVerifyOtpApiMutation,
} from "../../../apis&state/apis/authenticationApiSlice";
import toast from "react-hot-toast";
import AppBanner from "../../../components/commonComponents/auth&VerificatonComponents/appBanner/AppBanner";
import FormHeader from "../../../components/commonComponents/auth&VerificatonComponents/formHeader/FormHeader";

const correctOTP = "123456";

const Otp = ({ numberOfDigits = 6 }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState(null);
  const otpBoxReference = useRef([]);

  const [verifyOtp] = useVerifyOtpApiMutation();
  const [resendOtp] = useResendOtpApiMutation();

  const [timeLeft, setTimeLeft] = useState(120); 
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsActive(false);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    if (timeLeft > 0) setIsActive(true);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(120); 
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };


  function handleChange(value, index) {
    const newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    // Automatically focus next input
    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  useEffect(() => {
    handleStart()
    if (otp.join("") !== "" && otp.join("") !== correctOTP) {
      setOtpError("❌ Wrong OTP. Please check again.");
    } else {
      setOtpError(null);
    }
  }, [otp]);

  const handleSubmit = async () => {
    try {
      const response = await verifyOtp({
        otp: otp.join(""),
      });
      if (response?.data) {
        if (response.data?.message === "set your new password!") {
          toast.success("OPT Success !");
          navigate("/change-password");
        } else {
          toast.success("Welcome to Near By Shop");
          navigate("/");
        }
      } else if (response?.error) {
        const errorMessage = response?.error.data.errors[0].message;
        toast.error(errorMessage);
      } else {
        toast.error("Please try again!");
      }
    } catch (error) {
      toast.error("Something went wrong !");
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendOtp();
      if (response?.data) {
        toast.success("Resent the OPT!");
        handleReset()
      } else if (response?.error) {
        const errorMessage = response?.error.data.errors[0].message;
        toast.error(errorMessage);
      } else {
        toast.error("Please try again!");
      }
    } catch (error) {
      toast.error("Something went wrong !");
    }
  };

  return (
    <div className="otp-container">
      <AppBanner />
      <div className="otp-card-container">
        <div className="otp-card">
          <FormHeader formName="Enter your OTP" />
          <img src={authUser} alt="user" className="auth-user" />
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                ref={(reference) =>
                  (otpBoxReference.current[index] = reference)
                }
                className={`otp-input ${otpError ? "shake" : ""}`}
              />
            ))}
          </div>
          <div className="timer-card">
            <div className="timer-text">
              <p className="time">Time : {formatTime(timeLeft)}</p>
              <p className="resend" onClick={handleResend}>
                Resend OTP
              </p>
            </div>
            <div className="action-card">
              <button
                className={otp[5] ? "active-submit" : ""}
                onClick={handleSubmit}
                disabled={otp[5].length === 0}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
