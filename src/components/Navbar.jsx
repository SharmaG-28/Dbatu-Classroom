import React, { useState } from 'react';
import { SiGoogleclassroom } from "react-icons/si";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import Avatar from 'react-avatar';
import { auth, db } from '../firebase/setup';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'; // Added getDoc and setDoc
import { v4 as uuidv4 } from 'uuid';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Use this to get the current location

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(prevVisible => !prevVisible);
  };

  const handleJoinClass = () => {
    setJoinModalVisible(true);
    setDropdownVisible(false);
  };

  const handleCreateClass = () => {
    setCreateModalVisible(true);
    setDropdownVisible(false);
  };

  const handleCancelJoin = () => {
    setJoinModalVisible(false);
    navigate('/dashboard');
  };

  const handleJoin = async () => {
    try {
      const q = query(collection(db, "classes"), where("classCode", "==", classCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Class code not found");
        return;
      }

      const classDoc = querySnapshot.docs[0];
      const classData = classDoc.data();
      const classId = classDoc.id;

      // Add class to user's joined classes
      const userRef = doc(db, 'userClasses', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          joinedClasses: [...userDoc.data().joinedClasses, classId]
        });
      } else {
        await setDoc(userRef, { joinedClasses: [classId] });
      }

      // Add user to the class's members subcollection
      const classMembersRef = collection(db, 'classes', classId, 'members');
      await addDoc(classMembersRef, {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName || auth.currentUser.email,
        photoURL: auth.currentUser.photoURL || ''
      });

      setJoinModalVisible(false);
      toast.success('Joined class successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to join class. Please try again.');
      console.error('Join class error:', error);
    }
  };

  const handleCancelCreate = () => {
    setCreateModalVisible(false);
    navigate('/dashboard');
  };

  const handleCreate = async () => {
    try {
      const classCode = uuidv4().slice(0, 8); // Generate random class code
      const classDocRef = await addDoc(collection(db, "classes"), {
        className,
        section,
        subject,
        classCode,
        creator: auth.currentUser.email
      });

      // Add the creator to the class's members subcollection
      const classMembersRef = collection(db, 'classes', classDocRef.id, 'members');
      await addDoc(classMembersRef, {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName || auth.currentUser.email,
        photoURL: auth.currentUser.photoURL || ''
      });

      toast.success('Class created successfully');
      setCreateModalVisible(false);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create class. Please try again.');
      console.error('Create class error:', error);
    }
  };

  return (
    <div className='flex flex-row p-4 px-10 items-center justify-between bg-gray-50 shadow-md'>
      <div className='flex flex-row items-center gap-3'>
        <Link to='/dashboard'>
          <SiGoogleclassroom className='text-3xl text-[#137333]'/>
        </Link>
        <Link to='/dashboard'>
          <h1 className='text-2xl font-serif text-[#137333]'>Dbatu Classroom</h1>
        </Link>
      </div>
      <div className='flex flex-row gap-10 text-xl font-semibold text-[#727677]'>
        <Link to='/dashboard'>
          <h1 className={`hover:underline hover:text-gray-700 ${location.pathname === '/dashboard' ? 'underline' : ''}`}>Home</h1>
        </Link>
        <Link to='/teaching'>
          <h1 className={`hover:underline hover:text-gray-700 ${location.pathname === '/teaching' ? 'underline' : ''}`}>Teaching</h1>
        </Link>
        <Link to='/enrolled'>
          <h1 className={`hover:underline hover:text-gray-700 ${location.pathname === '/enrolled' ? 'underline' : ''}`}>Enrolled</h1>
        </Link>
        <h1
          className='hover:underline hover:text-gray-700 cursor-pointer'
          onClick={handleLogout}
        >
          Logout
        </h1>
        <div className='relative'>
          <FiPlus
            className='text-3xl text-black hover:bg-gray-200 rounded-full cursor-pointer'
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg'>
              <div
                className='py-2 px-4 hover:bg-gray-100 cursor-pointer'
                onClick={handleJoinClass}
              >
                Join Class
              </div>
              <div
                className='py-2 px-4 hover:bg-gray-100 cursor-pointer'
                onClick={handleCreateClass}
              >
                Create Class
              </div>
            </div>
          )}
        </div>
        <div className='flex flex-row gap-10 px-10'>
          {auth?.currentUser?.photoURL ? (
            <div className="relative group">
              <Avatar
                src={auth?.currentUser?.photoURL}
                round={true}
                size='32'
                className='cursor-pointer'
              />
              <span className="absolute bottom-0 right-0 mb-1 mr-1 text-xs text-gray-500 hidden group-hover:block">
                {auth?.currentUser?.email}
              </span>
            </div>
          ) : auth?.currentUser?.email ? (
            <Avatar
              name={auth?.currentUser?.displayName ?? auth?.currentUser?.email}
              round={true}
              size='32'
              className='cursor-pointer'
            />
          ) : (
            ''
          )}
        </div>
      </div>
      {joinModalVisible && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-md shadow-lg'>
            <h2 className='text-xl mb-4 text-gray-800'>Join Class</h2>
            <div className='items-center mb-4 border border-gray-300 rounded-md p-5'>
              <h1 className='pb-3 text-xl text-gray-800'>You're currently signed in as:</h1>
              <Avatar
                src={auth?.currentUser?.photoURL}
                name={auth?.currentUser?.displayName ?? auth?.currentUser?.email}
                round={true}
                size='40'
                className='mr-4'
              />
              <span className='text-lg'>{auth?.currentUser?.email}</span>
            </div>
            <div className='items-center mb-4 border border-gray-300 rounded-md p-5 '>
              <h1 className='pb-2 text-xl text-gray-800'>Class code</h1>
              <h1 className='text-lg mb-5 text-gray-600'>Ask your teacher for the class code, then enter it here.</h1>
              <input
                type='text'
                placeholder='Enter class code'
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                className='border border-gray-500 p-3 mb-4 w-full rounded-md'
              />
            </div>
            <div className='flex justify-end gap-4'>
              <button
                onClick={handleCancelJoin}
                className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
      {createModalVisible && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-md shadow-lg w-1/3'>
            <h2 className='text-xl mb-4 text-gray-800'>Create Class</h2>
            <div className='items-center mb-4 border border-gray-300 rounded-md p-5 w-full'>
              <h1 className='pb-2 text-xl text-gray-800'>Class Name <span className='text-red-500'>*</span></h1>
              <input
                type='text'
                placeholder='Enter class name'
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className='border border-gray-300 p-3 mb-4 w-full rounded-md'
                required
              />
              <h1 className='pb-2 text-xl text-gray-800'>Section</h1>
              <input
                type='text'
                placeholder='Enter section'
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className='border border-gray-300 p-3 mb-4 w-full rounded-md'
              />
              <h1 className='pb-2 text-xl text-gray-800'>Subject</h1>
              <input
                type='text'
                placeholder='Enter subject'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className='border border-gray-300 p-3 mb-4 w-full rounded-md'
              />
            </div>
            <div className='flex justify-end gap-4'>
              <button
                onClick={handleCancelCreate}
                className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
