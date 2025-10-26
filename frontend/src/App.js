import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import JobDetails from './pages/JobDetails';
import CreateJob from './pages/CreateJob';
import ManageJobs from './pages/ManageJobs';
import ViewApplications from './pages/ViewApplications';
import EmployerProfile from './pages/EmployerProfile';
import EditEmployerProfile from './pages/EditEmployerProfile';
import EditJob from './pages/EditJob';
import PublicEmployerProfile from './pages/PublicEmployerProfile';
import AppliedJobs from './pages/SavedJobs';
import UpdateJobSeekerProfile from './pages/UpdateJobSeekerProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import EmployerLayout from './components/EmployerLayout';
import JobSeekerLayout from './components/JobSeekerLayout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <ToastContainer />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/jobseeker" element={<JobSeekerLayout />}>
                <Route path="dashboard" element={<JobSeekerDashboard />} />
                <Route path="saved-jobs" element={<AppliedJobs />} />
                <Route path="profile" element={<UpdateJobSeekerProfile />} />
                <Route path="job/:id" element={<JobDetails />} />
                <Route path="employer-profile/:id" element={<PublicEmployerProfile />} />
              </Route>
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/employer" element={<EmployerLayout />}>
                <Route path="dashboard" element={<EmployerDashboard />} />
                <Route path="create-job" element={<CreateJob />} />
                <Route path="manage-jobs" element={<ManageJobs />} />
                <Route path="view-applications/:jobId" element={<ViewApplications />} />
                <Route path="profile" element={<EmployerProfile />} />
                <Route path="edit-profile" element={<EditEmployerProfile />} />
                <Route path="edit-job/:id" element={<EditJob />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
