import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from "../assets/logo.png";
import batu from "../assets/Batu.jpg";
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { FaCircleXmark } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../firebase/setup';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfPasswordVisibility = () => {
    setShowConfPassword((prevShowConfPassword) => !prevShowConfPassword);
  };

  const emailSignup = async () => {
    if (!email || !password || !confPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential)
      const user = userCredential.user;
      await sendEmailVerification(user);
      toast.success('A verification link has been sent to your email. Please verify.');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        toast.error('Email is already in use.');
      } else if (err.code === 'auth/invalid-email') {
        toast.error('Invalid email.');
      } else if (err.code === 'auth/weak-password') {
        toast.error('Weak password.');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-center relative">
      <div
        className="absolute inset-0 bg-cover bg-center filter opacity-60"
        style={{ backgroundImage: `url(${batu})` }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative w-full max-w-md bg-white py-5 px-8 border border-gray-300 rounded-lg shadow-lg bg-opacity-90">
        <span className='flex justify-end pb-5'>
          <Link to="/"><FaCircleXmark className='text-2xl text-gray-500'/></Link>
        </span>
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="logo" className="h-16 mb-4" />
          <h2 className="text-2xl font-bold text-center">Dbatu Classroom Signup</h2>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Email ID <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter Email"
            required
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter Password"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-10 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5 text-gray-500" />
            ) : (
              <FaEye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showConfPassword ? "text" : "password"}
            onChange={(e) => setConfPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter Password"
            required
          />
          <button
            type="button"
            onClick={toggleConfPasswordVisibility}
            className="absolute top-10 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showConfPassword ? (
              <FaEyeSlash className="h-5 w-5 text-gray-500" />
            ) : (
              <FaEye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        <button
          onClick={emailSignup}
          className="w-full bg-[#294A70] text-white font-semibold py-2 px-4 rounded hover:bg-[#1f3a57] transition duration-200"
        >
          Signup
        </button>
        <h1 className="text-center pt-5">
          Already have an account?,{" "}
          <Link to="/login" className="text-xl font-bold text-[#1f3a57] cursor-pointer">
            Login
          </Link>
        </h1>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
