import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import { StudentLayout, AdminLayout, TrustLayout } from './layouts/PortalLayout';
import { StudentRoute, StaffRoute, TrustRoute } from './lib/rbac';
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
import Campaign from './pages/public/Campaign';
import CyberLaw from './pages/public/CyberLaw';
import VerifyCertificate from './pages/public/VerifyCertificate';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';

import Login from './pages/auth/Login';
import TrustLogin from './pages/auth/TrustLogin';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import SDashboard from './pages/student/Dashboard';
import SProfile from './pages/student/Profile';
import SAnnouncements from './pages/student/Announcements';
import SSupport from './pages/student/Support';
import SComingSoon from './pages/student/ComingSoon';
import TrustDashboard from './pages/trust/Dashboard';
import TrustMyPosts from './pages/trust/MyPosts';
import TrustMyCoins from './pages/trust/MyCoins';
import TrustMyProfile from './pages/trust/MyProfile';

import ADashboard from './pages/admin/Dashboard';
import ALogins from './pages/admin/Logins';
import AManagedInExcel from './pages/admin/ManagedInExcel';

function LoginRouter() {
  const { loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-primary font-semibold">Loading…</div>;
  return <Login />;
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
        <Route path="/campaign" element={<Campaign />} />
        <Route path="/cyber-law" element={<CyberLaw />} />
        <Route path="/verify-certificate" element={<VerifyCertificate />} />
        <Route path="/verify-certificate/:certificateId" element={<VerifyCertificate />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* AUTH & ALIASES */}
      <Route path="/login" element={<LoginRouter />} />
      <Route path="/trust/login" element={<TrustLogin />} />
      <Route path="/trust/member/login" element={<TrustLogin />} />
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
        <Route path="course" element={<SComingSoon />} />
        <Route path="workbooks" element={<SComingSoon />} />
        <Route path="assignments" element={<SComingSoon />} />
        <Route path="attendance" element={<SComingSoon />} />
        <Route path="assessments" element={<SComingSoon />} />
        <Route path="results" element={<SComingSoon />} />
        <Route path="portfolio" element={<SComingSoon />} />
        <Route path="certificates" element={<SComingSoon />} />
        <Route path="announcements" element={<SAnnouncements />} />
        <Route path="support" element={<SSupport />} />
      </Route>

      {/* ADMIN - staff (admin/super_admin) only; trainer access on specific routes */}
      {/* TRUST PORTAL - trust members only */}
      <Route path="/trust" element={<TrustRoute><TrustLayout /></TrustRoute>}>
        <Route index element={<Navigate to="/trust/dashboard" replace />} />
        <Route path="dashboard" element={<TrustDashboard />} />
        <Route path="posts" element={<TrustMyPosts />} />
        <Route path="coins" element={<TrustMyCoins />} />
        <Route path="profile" element={<TrustMyProfile />} />
      </Route>

      {/* ADMIN - staff (admin/super_admin) only; trainer access on specific routes */}
      <Route path="/admin" element={<StaffRoute><AdminLayout /></StaffRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<ADashboard />} />
        <Route path="logins" element={<ALogins />} />
        <Route path="students" element={<AManagedInExcel />} />
        <Route path="admissions" element={<AManagedInExcel />} />
        <Route path="batches" element={<AManagedInExcel />} />
        <Route path="trainers" element={<AManagedInExcel />} />
        <Route path="curriculum" element={<AManagedInExcel />} />
        <Route path="workbooks" element={<AManagedInExcel />} />
        <Route path="assignments" element={<AManagedInExcel />} />
        <Route path="attendance" element={<AManagedInExcel />} />
        <Route path="assessments" element={<AManagedInExcel />} />
        <Route path="results" element={<AManagedInExcel />} />
        <Route path="portfolio" element={<AManagedInExcel />} />
        <Route path="certificates" element={<AManagedInExcel />} />
        <Route path="announcements" element={<AManagedInExcel />} />
        <Route path="gallery" element={<AManagedInExcel />} />
        <Route path="content" element={<AManagedInExcel />} />
        <Route path="enquiries" element={<AManagedInExcel />} />
        <Route path="reports" element={<AManagedInExcel />} />
        <Route path="settings" element={<AManagedInExcel />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
