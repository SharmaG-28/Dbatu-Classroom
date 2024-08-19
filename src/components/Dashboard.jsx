import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/setup';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { FaCircleUser } from "react-icons/fa6";
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error('Error setting persistence:', error);
      }
    };

    const fetchClasses = (user) => {
      try {
        // Fetch classes created by the user
        const createdClassesQuery = query(collection(db, 'classes'), where('creator', '==', user.email));
        const unsubscribeCreatedClasses = onSnapshot(createdClassesQuery, (snapshot) => {
          const createdClasses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setClasses(prevClasses => {
            const joinedClasses = prevClasses.filter(cls => cls.creator !== user.email);
            return [...createdClasses, ...joinedClasses];
          });
        });

        // Fetch classes joined by the user
        const userDocRef = doc(db, 'userClasses', user.uid);
        const unsubscribeUserClasses = onSnapshot(userDocRef, async (userDoc) => {
          if (userDoc.exists()) {
            const joinedClassIds = userDoc.data().joinedClasses;
            const joinedClassesPromises = joinedClassIds.map(classId => getDoc(doc(db, 'classes', classId)));
            const joinedClassesDocs = await Promise.all(joinedClassesPromises);
            const joinedClasses = joinedClassesDocs.map(doc => ({ id: doc.id, ...doc.data() }));

            setClasses(prevClasses => {
              const createdClasses = prevClasses.filter(cls => cls.creator === user.email);
              return [...createdClasses, ...joinedClasses];
            });
          }
        });

        return () => {
          unsubscribeCreatedClasses();
          unsubscribeUserClasses();
        };
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    setAuthPersistence();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchClasses(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCardClick = (classId) => {
    navigate(`/classroom/${classId}`);
  };

  return (
    <>
    <Navbar/>
      <h1 className="text-2xl font-semibold pt-5 px-12 underline">All Classes</h1>
      {classes.length === 0 ? (
        <div className='text-4xl font-thin pt-5 px-12'>No classes created or joined...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 justify-between gap-8 p-10 w-full">
          {classes.map((classData, index) => (
            <div 
              key={index} 
              className="flex flex-col shadow-md rounded-lg border border-gray-200 cursor-pointer"
              onClick={() => handleCardClick(classData.id)}
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

export default Dashboard;
