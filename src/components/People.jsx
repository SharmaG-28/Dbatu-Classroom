import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/setup';
import Avatar from 'react-avatar';

const People = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        // Fetch class data
        const classDocRef = doc(db, 'classes', classId);
        const classDoc = await getDoc(classDocRef);
        if (classDoc.exists()) {
          setClassData(classDoc.data());
        } else {
          throw new Error('Class not found');
        }

        // Fetch class members
        const membersCollectionRef = collection(db, 'classes', classId, 'members');
        const membersSnapshot = await getDocs(membersCollectionRef);
        const membersList = membersSnapshot.docs.map(doc => doc.data());
        setMembers(membersList);
      } catch (error) {
        console.error('Error fetching class data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!classData) {
    return <div>Class not found</div>;
  }

  return (
    <div className='flex flex-col gap-16 p-10'>
      {classData && (
        <div>
          <h1 className='text-5xl text-blue-700'>Teacher</h1>
          <hr className='mt-5' />
          <span className='flex flex-row gap-5 items-center py-5'>
            <Avatar
              name={classData.creator}
              round={true}
              size='36'
              className='cursor-pointer'
              color='#C81563'
            />
            <h1>{classData.creator}</h1>
          </span>
        </div>
      )}
      <div>
        <h1 className='text-5xl text-blue-700'>Students</h1>
        <hr className='mt-5' />
        {members.length === 1 ? (
          <div className='py-5 text-xl'>No students have joined this class yet.</div>
        ) : (
          members
            .filter(member => member.email !== classData.creator) // Exclude the creator from the list
            .map((member, index) => (
              <span key={index} className='flex flex-row gap-5 items-center mt-5'>
                <Avatar
                  name={member.displayName || 'Unknown'}
                  round={true}
                  size='36'
                  className='cursor-pointer'
                  color='#C81563'
                />
                <h1>{member.email || 'Unknown email'}</h1>
              </span>
            ))
        )}
      </div>
    </div>
  );
};

export default People;
