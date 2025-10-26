import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const EditEmployerProfile = () => {
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    company: '',
    logo: null,
    removeLogo: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setFormData({
          name: res.data.name,
          bio: res.data.profile?.bio || '',
          company: res.data.profile?.company || '',
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
    setFormData({ ...formData, logo: e.target.files[0], removeLogo: false });
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: null, removeLogo: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('bio', formData.bio);
    data.append('company', formData.company);
    if (formData.logo) data.append('logo', formData.logo);
    if (formData.removeLogo) data.append('removeLogo', 'true');

    console.log('FormData contents:');
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      await api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Profile updated successfully!');
      // Refresh the user data in context
      // Update the user in context - we need to access the context
      window.location.reload(); // Temporary solution to refresh the page and get updated data
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Employer Profile</h1>
      <form onSubmit={handleSubmit} className={`p-6 rounded shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className={`border p-2 rounded w-full mb-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} required />
        <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" className={`border p-2 rounded w-full mb-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" className={`border p-2 rounded w-full mb-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
        <input type="file" onChange={handleFileChange} className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
        <button type="button" onClick={handleRemoveLogo} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Remove Logo</button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Profile</button>
      </form>
    </div>
  );
};

export default EditEmployerProfile;
