import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/setup';
import { toast } from 'react-toastify';

const Stream = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [announcementFile, setAnnouncementFile] = useState(null);
  const [announcementLink, setAnnouncementLink] = useState('');

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

        // Fetch announcements
        const announcementsCollectionRef = collection(db, 'classes', classId, 'announcements');
        const announcementsSnapshot = await getDocs(announcementsCollectionRef);
        const announcementsList = announcementsSnapshot.docs.map(doc => doc.data());
        setAnnouncements(announcementsList);
      } catch (error) {
        console.error('Error fetching class data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  const handleAnnouncementSubmit = async () => {
    if (!newAnnouncement && !announcementFile && !announcementLink) {
      toast.error('Please enter an announcement, add a link, or upload a file.');
      return;
    }

    try {
      const announcement = {
        text: newAnnouncement,
        link: announcementLink,
        fileUrl: announcementFile ? URL.createObjectURL(announcementFile) : null,
        creator: auth.currentUser.email,
        createdAt: new Date(),
      };

      // Add announcement to Firestore
      await addDoc(collection(db, 'classes', classId, 'announcements'), announcement);

      // Update local state
      setAnnouncements([...announcements, announcement]);

      // Reset fields
      setNewAnnouncement('');
      setAnnouncementFile(null);
      setAnnouncementLink('');

      toast.success('Announcement added successfully.');
    } catch (error) {
      toast.error('Failed to add announcement. Please try again.');
      console.error('Error adding announcement:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!classData) {
    return <div>Class not found</div>;
  }

  return (
    <div className='flex flex-col gap-10 px-10 py-5'>
      <div className='bg-blue-600 rounded-lg h-60 p-10 text-white'>
        <h1 className="text-3xl font-semibold mb-1">{classData.className}</h1>
        <h1 className="text-md font-medium ml-1">{classData.section}</h1>
        <h1 className="text-md font-medium ml-1">{classData.subject}</h1>
      </div>
      <div className='flex flex-row gap-5'>
        <div className='w-2/12 border border-gray-400 rounded-lg text-3xl p-5 text-center'>
          <h1 className='font-semibold mb-3 underline'>Class code</h1>
          <h1>{classData.classCode}</h1>
        </div>
        <div className='flex flex-col w-10/12'>
          {auth.currentUser.email === classData.creator && (
            <div className='mb-5'>
              <h1 className="text-xl mb-2">Announce something to the class</h1>
              <textarea
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                className='border border-gray-300 p-2 w-full rounded mb-2'
                placeholder='Enter your announcement...'
              />
              <input
                type='text'
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                className='border border-gray-300 p-2 w-full rounded mb-2'
                placeholder='Add a link (optional)'
              />
              <input
                type='file'
                onChange={(e) => setAnnouncementFile(e.target.files[0])}
                className='mb-2'
              />
              <button
                onClick={handleAnnouncementSubmit}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
              >
                Announce
              </button>
            </div>
          )}
          {announcements.length === 0 ? (
            <div className='border border-gray-400 rounded-lg p-5 text-xl'>No announcements yet.</div>
          ) : (
            announcements.map((announcement, index) => (
              <div key={index} className='flex flex-col mb-5'>
                <span className='flex flex-row items-center gap-5'>
                  <Avatar
                    name={announcement.creator}
                    round={true}
                    size='36'
                    className='cursor-pointer'
                    color='#C81563'
                  />
                  <h1>{announcement.creator}</h1>
                </span>
                <p>{announcement.text}</p>
                {announcement.link && (
                  <a href={announcement.link} target="_blank" rel="noopener noreferrer" className='text-blue-500'>
                    {announcement.link}
                  </a>
                )}
                {announcement.fileUrl && (
                  <a href={announcement.fileUrl} target="_blank" rel="noopener noreferrer" className='text-blue-500'>
                    View File
                  </a>
                )}
                <hr className='mt-2' />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Stream;
