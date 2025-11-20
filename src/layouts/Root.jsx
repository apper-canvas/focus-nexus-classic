import React, { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setInitialized } from '@/store/userSlice';
import { getRouteConfig, verifyRouteAccess } from '@/router/route.utils';

// Create AuthContext
const AuthContext = createContext(null);

// useAuth hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContext.Provider');
  }
  return context;
};

const Root = () => {
  const [authInitialized, setAuthInitialized] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isInitialized } = useSelector((state) => state.user);

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!window.ApperSDK) {
          console.error('ApperSDK not loaded');
          return;
        }

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
            if (user) {
              dispatch(setUser(JSON.parse(JSON.stringify(user))));
            } else {
              dispatch(clearUser());
            }
            dispatch(setInitialized(true));
            setAuthInitialized(true);
            
            // Handle post-authentication navigation
            handleNavigation(user);
          },
          onError: function(error) {
            console.error("Authentication failed:", error);
            dispatch(clearUser());
            dispatch(setInitialized(true));
            setAuthInitialized(true);
          }
        });
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        dispatch(setInitialized(true));
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Handle post-authentication navigation
  const handleNavigation = (user) => {
    const urlParams = new URLSearchParams(location.search);
    const redirectPath = urlParams.get("redirect");
    const authPages = ["/login", "/signup", "/callback"];
    const isOnAuthPage = authPages.some(page => location.pathname.includes(page));

    if (user) {
      if (redirectPath) {
        navigate(redirectPath);
      } else if (isOnAuthPage) {
        navigate("/");
      }
      // If not on auth page and no redirect, stay on current page
    }
  };

  // Route guard effect
  useEffect(() => {
    if (!isInitialized) return; // Don't run route guards until auth is initialized

    const config = getRouteConfig(location.pathname);
    if (!config) return; // No specific config, allow access

    const accessCheck = verifyRouteAccess(config, user);
    
    if (!accessCheck.allowed && accessCheck.redirectTo) {
      const redirectUrl = accessCheck.excludeRedirectQuery 
        ? accessCheck.redirectTo 
        : `${accessCheck.redirectTo}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
      
      navigate(redirectUrl);
    }
  }, [isInitialized, user, location.pathname, location.search, navigate]);

  // Auth context methods
  const logout = async () => {
    try {
      const { ApperUI } = window.ApperSDK;
      await ApperUI.logout();
      dispatch(clearUser());
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show loading spinner until auth is initialized
  if (!authInitialized) {
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
    <AuthContext.Provider value={{ logout, isInitialized, user }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export default Root;