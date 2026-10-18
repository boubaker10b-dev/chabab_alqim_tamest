import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SupervisorProfile } from './components/SupervisorProfile';
import { SubscriptionNotice } from './components/SubscriptionNotice';
import { GallerySection } from './components/GallerySection';
import { RegistrationForm } from './components/RegistrationForm';
import { SupervisorsPortal } from './components/SupervisorsPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { api } from './services/api';
import { AuthUser, ActivityPhoto, PublicInfo } from './types';
import { SUPER_ADMIN_EMAIL } from './constants';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('tamest_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [publicInfo, setPublicInfo] = useState<PublicInfo>(() => api.getInitialPublicInfo());
  const [loading, setLoading] = useState(false);

  // Load public info (stats and photos)
  useEffect(() => {
    api.getPublicInfo()
      .then((data) => {
        if (data) {
          setPublicInfo(data);
        }
      })
      .catch((err) => {
        console.error('Error loading public info:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('tamest_auth_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('tamest_auth_user');
    } catch (e) {
      console.error(e);
    }
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Dashboard view
  if (activeTab === 'admin') {
    if (!currentUser) {
      // Guard: prompt to login
      return (
        <div className="min-h-screen bg-[#f7faf8] flex flex-col">
          <Navbar
            activeTab={activeTab}
            setActiveTab={navigateTo}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <main className="flex-1 flex items-center justify-center p-4">
            <SupervisorsPortal onLoginSuccess={handleLoginSuccess} />
          </main>
          <Footer onNavigate={navigateTo} />
        </div>
      );
    }

    return (
      <AdminDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
        onBackToHome={() => navigateTo('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#111e1a] flex flex-col font-sans selection:bg-[#003a29] selection:text-white">
      {/* Global Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateTo}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <div className="flex flex-col w-full">
            <Hero
              onNavigate={navigateTo}
              stats={publicInfo?.stats}
            />
            <SupervisorProfile />
            <SubscriptionNotice />
            {publicInfo?.photos && publicInfo.photos.length > 0 && (
              <GallerySection
                photos={publicInfo.photos}
                isHome={true}
                onNavigate={navigateTo}
              />
            )}
          </div>
        )}

        {activeTab === 'registration' && (
          <RegistrationForm
            onSuccess={() => {
              // Refresh public stats
              api.getPublicInfo().then(setPublicInfo).catch(console.error);
            }}
          />
        )}

        {activeTab === 'gallery' && (
          <div className="py-6">
            <GallerySection photos={publicInfo?.photos || []} />
          </div>
        )}

        {activeTab === 'leadership' && (
          <div className="py-10">
            <SupervisorProfile />
          </div>
        )}

        {activeTab === 'supervisors' && (
          <SupervisorsPortal onLoginSuccess={handleLoginSuccess} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
