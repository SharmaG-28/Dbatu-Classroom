import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import baba from '../assets/baba.png';
import { SiGoogleclassroom } from 'react-icons/si';

const Landing = () => {

  return (
    <div className='flex flex-row justify-between'>
      <div className='w-14 bg-gray-300 h-screen shadow-xl'></div>
    <div className='flex flex-col'>
      <div className='flex flex-col sm:flex-row md:flex-row lg:flex-row p-5 items-center sm:justify-center md:justify-center lg:justify-center '>
        <img src={logo} alt="Logo" className='sm:h-16 md:h-28 lg:h-32'/>
        <img src={baba} alt="name" className='h-20 sm:h-16 md:h-28 lg:h-32'/>
      </div>

      <span className=' text-8xl flex justify-center py-5'>
        <SiGoogleclassroom className='text-green-800'/>
      </span>
      <h1 className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gray-600 text-center'>Welcome to Dbatu Classroom!</h1>
      <p className='text-md sm:text-lg md:text-xl lg:text-2xl font-thin text-gray-700 text-center py-10'>Classroom lets you communicate with your classes and easily share <br />assignments, materials, messages and solve doubt.</p>
      <div className='flex flex-row gap-10 justify-center'>
        <Link to='/login' className="bg-[#294A70] text-white font-semibold py-2 px-8 rounded hover:bg-[#1f3a57] transition duration-200">
          <h1 className='text-md sm:text-lg md:text-xl lg:text-2xl font-semibold'>Login</h1>
        </Link>
      </div>
    </div>
      <div className='w-14 bg-gray-300 h-screen shadow-xl'></div>
    </div>
  );
};

export default Landing;
