import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from "../assets/logo.png";
import batu from "../assets/Batu.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/setup';
import { FaCircleXmark } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const emailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      console.log(auth)

      if (user.emailVerified) {
        toast.success('Successful login');
        const profilePhotoUrl = user.photoURL || 'default_profile_photo_url_here';
        console.log('Profile Photo URL:', profilePhotoUrl); // Log the profile photo URL
        localStorage.setItem('profilePhotoUrl', profilePhotoUrl);
        navigate('/dashboard');
      } else {
        toast.error('Please verify your email before logging in');
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Please check your credentials and try again.');
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
          <h2 className="text-2xl font-bold text-center">Dbatu Classroom Login</h2>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Email ID <span className="text-red-500">*</span>
          </label>
          <input
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
        <button
          onClick={emailLogin}
          className="w-full bg-[#294A70] text-white font-semibold py-2 px-4 rounded hover:bg-[#1f3a57] transition duration-200"
        >
          Login
        </button>
        <h1 className="text-center pt-5">
          Don't have account ?,{" "}
          <Link to="/signup" className="text-xl font-bold text-[#1f3a57] cursor-pointer">
            Signup
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default Login;
