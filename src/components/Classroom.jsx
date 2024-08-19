import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import Stream from './Stream';
import Classwork from './Classwork';
import People from './People';
import Grades from './Grades';

const Classroom = () => {
  const { classId } = useParams();
  const [activeTab, setActiveTab] = useState('Stream');

  const renderContent = () => {
    switch (activeTab) {
      case 'Stream':
        return <Stream/>;
      case 'Classwork':
        return <Classwork/>;
      case 'People':
        return <People/>;
      case 'Grades':
        return <Grades/>;
      default:
        return <Stream/>;
    }
  };

  return (
    <div>
      <div className='flex flex-row justify-between py-4 px-10 border-b-2 border-gray-400'>
        <span className='flex flex-row gap-10 text-lg font-semibold text-[#727677]'>
          <h1 
            className={`cursor-pointer hover:underline hover:text-gray-700 ${activeTab === 'Stream' ? 'underline text-gray-700' : ''}`} 
            onClick={() => setActiveTab('Stream')}
          >
            Stream
          </h1>
          <h1 
            className={`cursor-pointer hover:underline hover:text-gray-700 ${activeTab === 'Classwork' ? 'underline text-gray-700' : ''}`} 
            onClick={() => setActiveTab('Classwork')}
          >
            Classwork
          </h1>
          <h1 
            className={`cursor-pointer hover:underline hover:text-gray-700 ${activeTab === 'People' ? 'underline text-gray-700' : ''}`} 
            onClick={() => setActiveTab('People')}
          >
            People
          </h1>
          <h1 
            className={`cursor-pointer hover:underline hover:text-gray-700 ${activeTab === 'Grades' ? 'underline text-gray-700' : ''}`} 
            onClick={() => setActiveTab('Grades')}
          >
            Grades
          </h1>
        </span>
        <span className='text-2xl flex flex-row items-center gap-10 mr-20'>
            <Link to="/dashboard"><h1 className='text-lg cursor-pointer text-[#727677] font-semibold hover:underline hover:text-gray-700 '>Dashboard</h1></Link>
            <IoSettingsOutline />
        </span>
      </div>
      <div className='p-10'>
        {renderContent()}
      </div>
    </div>
  );
};

export default Classroom;
