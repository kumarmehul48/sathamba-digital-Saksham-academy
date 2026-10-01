import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import { StudentLayout, AdminLayout } from './layouts/PortalLayout';
import { StudentRoute, StaffRoute } from './lib/rbac';
import { useAuth } from './lib/auth';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Course from './pages/public/Course';
import Curriculum from './pages/public/Curriculum';
import WeekDetail from './pages/public/WeekDetail';
import StudentLife from './pages/public/StudentLife';
import Gallery from './pages/public/Gallery';
import Faq from './pages/public/Faq';
import Contact from './pages/public/Contact';
import Apply from './pages/public/Apply';
import VerifyCertificate from './pages/public/VerifyCertificate';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';

import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import SDashboard from './pages/student/Dashboard';
import SProfile from './pages/student/Profile';
import SCourse from './pages/student/MyCourse';
import SWorkbooks from './pages/student/Workbooks';
import SAssignments from './pages/student/Assignments';
import SAttendance from './pages/student/Attendance';
import SAssessments from './pages/student/Assessments';
import SResults from './pages/student/Results';
import SPortfolio from './pages/student/Portfolio';
import SCertificates from './pages/student/Certificates';
import SAnnouncements from './pages/student/Announcements';
import SSupport from './pages/student/Support';

import ADashboard from './pages/admin/Dashboard';
import AStudents from './pages/admin/Students';
import AAdmissions from './pages/admin/Admissions';
import ABatches from './pages/admin/Batches';
import ATrainers from './pages/admin/Trainers';
import ACurriculum from './pages/admin/Curriculum';
import AWorkbooks from './pages/admin/Workbooks';
import AAssignments from './pages/admin/Assignments';
import AAttendance from './pages/admin/Attendance';
import AAssessments from './pages/admin/Assessments';
import AResults from './pages/admin/Results';
import APortfolio from './pages/admin/Portfolio';
import ACertificates from './pages/admin/Certificates';
import AAnnouncements from './pages/admin/Announcements';
import AGallery from './pages/admin/Gallery';
import AContent from './pages/admin/Content';
import AEnquiries from './pages/admin/Enquiries';
import AReports from './pages/admin/Reports';
import ASettings from './pages/admin/Settings';

function LoginRouter() {
  const { profile, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-primary font-semibold">Loading…</div>;
  if (!profile) return <Login />;
  if (profile.role === 'admin' || profile.role === 'super_admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/course" element={<Course />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/curriculum/week/:weekNumber" element={<WeekDetail />} />
        <Route path="/student-life" element={<StudentLife />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/verify-certificate" element={<VerifyCertificate />} />
        <Route path="/verify-certificate/:certificateId" element={<VerifyCertificate />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* AUTH & ALIASES */}
      <Route path="/login" element={<LoginRouter />} />
      <Route path="/student/login" element={<LoginRouter />} />
      <Route path="/admin/login" element={<LoginRouter />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/student/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/student/reset-password" element={<ResetPassword />} />

      {/* STUDENT PORTAL - students only */}
      <Route path="/student" element={<StudentRoute><StudentLayout /></StudentRoute>}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<SDashboard />} />
        <Route path="profile" element={<SProfile />} />
        <Route path="course" element={<SCourse />} />
        <Route path="workbooks" element={<SWorkbooks />} />
        <Route path="assignments" element={<SAssignments />} />
        <Route path="attendance" element={<SAttendance />} />
        <Route path="assessments" element={<SAssessments />} />
        <Route path="results" element={<SResults />} />
        <Route path="portfolio" element={<SPortfolio />} />
        <Route path="certificates" element={<SCertificates />} />
        <Route path="announcements" element={<SAnnouncements />} />
        <Route path="support" element={<SSupport />} />
      </Route>

      {/* ADMIN - staff (admin/super_admin) only; trainer access on specific routes */}
      <Route path="/admin" element={<StaffRoute><AdminLayout /></StaffRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<ADashboard />} />
        <Route path="students" element={<AStudents />} />
        <Route path="admissions" element={<AAdmissions />} />
        <Route path="batches" element={<ABatches />} />
        <Route path="trainers" element={<ATrainers />} />
        <Route path="curriculum" element={<ACurriculum />} />
        <Route path="workbooks" element={<AWorkbooks />} />
        <Route path="assignments" element={<AAssignments />} />
        <Route path="attendance" element={<AAttendance />} />
        <Route path="assessments" element={<AAssessments />} />
        <Route path="results" element={<AResults />} />
        <Route path="portfolio" element={<APortfolio />} />
        <Route path="certificates" element={<ACertificates />} />
        <Route path="announcements" element={<AAnnouncements />} />
        <Route path="gallery" element={<AGallery />} />
        <Route path="content" element={<AContent />} />
        <Route path="enquiries" element={<AEnquiries />} />
        <Route path="reports" element={<AReports />} />
        <Route path="settings" element={<ASettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
