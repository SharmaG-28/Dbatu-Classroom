import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/setup';
import { onAuthStateChanged } from 'firebase/auth';
import { FaCircleUser } from 'react-icons/fa6';
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Teaching = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // useNavigate hook for navigation

  useEffect(() => {
    const fetchClasses = async (email) => {
      try {
        const q = query(collection(db, "classes"), where("creator", "==", email));
        const querySnapshot = await getDocs(q);
        const classesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching classes: ", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        fetchClasses(user.email);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCardClick = (classId) => {
    navigate(`/classroom/${classId}`);
  };

  return (
    <>
    <Navbar/>
      <h1 className="text-2xl font-semibold pt-5 px-12 underline">Teaching Classes</h1>
      {classes.length === 0 ? (
        <div className='text-4xl font-thin pt-5 px-12'>No classes created by you.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 justify-between gap-8 p-10 w-full">
          {classes.map((classData, index) => (
            <div 
              key={index} 
              className="flex flex-col shadow-md rounded-lg border border-gray-200 cursor-pointer"
              onClick={() => handleCardClick(classData.id)} // Add onClick event
            >
              <div className="bg-blue-600 p-5 text-white rounded-t-lg flex flex-col justify-center">
                <h1 className="text-3xl font-semibold mb-1">{classData.className}</h1>
                <h1 className="text-md font-medium ml-1">{classData.section}</h1>
                <h1 className="text-md font-medium ml-1">{classData.subject}</h1>
              </div>
              <span className='-mt-10 flex justify-end mr-10'>
                <Avatar
                  name={classData.creator}
                  round={true}
                  size='80'
                  className='cursor-pointer'
                  color='#C81563'
                />
              </span>
              <div className='bg-white rounded-b-lg p-5 flex items-end justify-between'>
                <span className='flex flex-row gap-2 items-center bg-gray-100 p-2 px-4 rounded-3xl text-gray-600'>
                  <FaCircleUser />
                  <h1 className='text-md font-medium text-center'>{classData.creator}</h1>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Teaching;
