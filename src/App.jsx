import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import Quotes from "@/components/pages/Quotes";
import ApperIcon from "@/components/ApperIcon";
import PromptPassword from "@/components/pages/PromptPassword";
import ErrorPage from "@/components/pages/ErrorPage";
import Callback from "@/components/pages/Callback";
import Pipeline from "@/components/pages/Pipeline";
import Dashboard from "@/components/pages/Dashboard";
import ResetPassword from "@/components/pages/ResetPassword";
import ContactDetail from "@/components/pages/ContactDetail";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Contacts from "@/components/pages/Contacts";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import { clearUser, setUser } from "@/store/userSlice";

export const AuthContext = createContext(null);

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createContactTrigger, setCreateContactTrigger] = useState(0);
  const [createDealTrigger, setCreateDealTrigger] = useState(0);
  const [createQuoteTrigger, setCreateQuoteTrigger] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);

  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

const handleCreateContact = () => {
    setCreateContactTrigger(prev => prev + 1);
  };

  const handleCreateDeal = () => {
    setCreateDealTrigger(prev => prev + 1);
  };

  const handleCreateQuote = () => {
    setCreateQuoteTrigger(prev => prev + 1);
  };
if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path>
          <path d="m16.2 7.8 2.9-2.9"></path>
          <path d="M18 12h4"></path>
          <path d="m16.2 16.2 2.9 2.9"></path>
          <path d="M12 18v4"></path>
          <path d="m4.9 19.1 2.9-2.9"></path>
          <path d="M2 12h4"></path>
          <path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Sidebar />
          <MobileSidebar 
            isOpen={mobileMenuOpen} 
            onClose={() => setMobileMenuOpen(false)} 
          />

          <div className="flex-1 flex flex-col min-h-screen">
            <div className="lg:hidden fixed top-4 left-4 z-40">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
              >
                <ApperIcon name="Menu" size={20} />
              </Button>
            </div>

            <Header 
              onCreateContact={handleCreateContact}
              onCreateDeal={handleCreateDeal}
            />

            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route 
                    path="/contacts" 
                    element={
                      <Contacts 
                        onCreateContact={handleCreateContact}
                        createContactTrigger={createContactTrigger}
                      />
                    } 
                  />
                  <Route path="/contacts/:id" element={<ContactDetail />} />
                  <Route 
                    path="/pipeline" 
                    element={
                      <Pipeline 
                        onCreateDeal={handleCreateDeal}
                        createDealTrigger={createDealTrigger}
                      />
} 
                />
                <Route 
                  path="/quotes" 
                  element={
                    <Quotes 
                      onCreateQuote={handleCreateQuote} 
                      createQuoteTrigger={createQuoteTrigger} 
                    /> 
                  } 
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
                <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
              </Routes>
              </div>
            </main>
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;