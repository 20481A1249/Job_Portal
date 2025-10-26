import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const UpdateJobSeekerProfile = () => {
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    experience: '',
    resume: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setFormData({
          name: res.data.name,
          bio: res.data.profile?.bio || '',
          skills: res.data.profile?.skills?.join(', ') || '',
          experience: res.data.profile?.experience || '',
          resume: null,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('bio', formData.bio);
    data.append('skills', formData.skills);
    data.append('experience', formData.experience);
    if (formData.resume) data.append('resume', formData.resume);

    console.log('FormData contents:');
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      await api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Profile updated successfully!');
      // Refresh the profile data
      const profileRes = await api.get('/users/profile');
      setProfile(profileRes.data);
      setFormData({
        name: profileRes.data.name,
        bio: profileRes.data.profile?.bio || '',
        skills: profileRes.data.profile?.skills?.join(', ') || '',
        experience: profileRes.data.profile?.experience || '',
        resume: null,
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    }
  };

  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data);
        setFormData({
          name: res.data.name,
          bio: res.data.profile?.bio || '',
          skills: res.data.profile?.skills?.join(', ') || '',
          experience: res.data.profile?.experience || '',
          resume: null,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Job Seeker Profile</h1>
      <div className={`p-6 rounded shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h2 className="text-2xl font-semibold">{profile.name}</h2>
        <p>Email: {profile.email}</p>
        <p>Bio: {profile.profile?.bio}</p>
        <p>Skills: {profile.profile?.skills?.join(', ')}</p>
        <p>Experience: {profile.profile?.experience}</p>
        <p>Resume: {profile.profile?.resume ? <a href={`http://localhost:5000${profile.profile.resume}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View/Download Resume</a> : 'No resume uploaded'}</p>
      </div>
      <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Update Profile</h1>
        <form onSubmit={handleSubmit} className={`p-6 rounded shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className={`border p-2 rounded w-full mb-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} required />
          <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" className={`border p-2 rounded w-full mb-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
          <input name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills (comma-separated)" className={`border p-2 rounded w-full mb-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
          <textarea name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience" className={`border p-2 rounded w-full mb-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
          <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upload Resume</label>
          <input type="file" onChange={handleFileChange} className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateJobSeekerProfile;
