import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { getRouteConfig } from './route.utils';
import Root from '@/layouts/Root';
import MainLayout from '@/layouts/MainLayout';

// Lazy load components
const Dashboard = lazy(() => import('@/components/pages/Dashboard'));
const Login = lazy(() => import('@/components/pages/Login'));
const Signup = lazy(() => import('@/components/pages/Signup'));
const Contacts = lazy(() => import('@/components/pages/Contacts'));
const ContactDetail = lazy(() => import('@/components/pages/ContactDetail'));
const Companies = lazy(() => import('@/components/pages/Companies'));
const Pipeline = lazy(() => import('@/components/pages/Pipeline'));
const Callback = lazy(() => import('@/components/pages/Callback'));
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'));
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'));
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
);

// createRoute helper
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  const configPath = index ? "/" : (path?.startsWith('/') ? path : `/${path}`);
  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;
  
  return {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingSpinner />}>{element}</Suspense> : element,
    handle: { access: finalAccess, ...meta },
    ...(children && { children })
  };
};

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />, // Layout component - NO createRoute wrapper
    children: [
      // Auth routes (public)
      createRoute({
        path: 'login',
        element: <Login />,
        title: 'Login'
      }),
      createRoute({
        path: 'signup',
        element: <Signup />,
        title: 'Sign Up'
      }),
      createRoute({
        path: 'callback',
        element: <Callback />,
        title: 'Authentication Callback'
      }),
      createRoute({
        path: 'error',
        element: <ErrorPage />,
        title: 'Error'
      }),
      createRoute({
        path: 'reset-password/:appId/:fields',
        element: <ResetPassword />,
        title: 'Reset Password'
      }),
      createRoute({
        path: 'prompt-password/:appId/:emailAddress/:provider',
        element: <PromptPassword />,
        title: 'Set Password'
      }),
      
      // Main app routes (protected by authentication)
      {
        path: '/',
        element: <MainLayout />, // Layout with sidebar/header - NO createRoute wrapper
        children: [
          createRoute({
            index: true,
            element: <Dashboard />,
            title: 'Dashboard'
          }),
          createRoute({
            path: 'contacts',
            element: <Contacts />,
            title: 'Contacts'
          }),
          createRoute({
            path: 'contacts/:id',
            element: <ContactDetail />,
            title: 'Contact Details'
          }),
          createRoute({
            path: 'companies',
            element: <Companies />,
            title: 'Companies'
          }),
          createRoute({
            path: 'pipeline',
            element: <Pipeline />,
            title: 'Pipeline'
          })
        ]
      },
      
      // Catch-all route for 404
      createRoute({
        path: '*',
        element: <NotFound />,
        title: 'Page Not Found'
      })
    ]
  }
]);