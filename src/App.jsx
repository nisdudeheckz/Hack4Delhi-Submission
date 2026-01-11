import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './context/ProtectedRoute';
import Login from './pages/Login';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';

// New Pages
import Departments from './pages/Departments';
import NoticeBoard from './pages/NoticeBoard';
import RTI from './pages/RTI';
import ContactUs from './pages/ContactUs';
import Search from './pages/Search';
import AIMonitor from './pages/AIMonitor';


const MainLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname.includes('/ai-monitor');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />

          {/* New Routes */}
          <Route path="/departments" element={<Departments />} />
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/rti" element={<RTI />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ai-monitor" element={<AIMonitor />} />

        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <LanguageProvider>
            <Routes>

              <Route path="/login" element={<Login />} />

              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              />

            </Routes>
          </LanguageProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
