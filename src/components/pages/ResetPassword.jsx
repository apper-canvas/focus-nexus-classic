import { useEffect } from 'react';

const ResetPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showResetPassword('#authentication-reset-password');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div id="authentication-reset-password" className="w-full max-w-md p-8 bg-surface rounded-lg shadow-md"></div>
    </div>
  );
};

export default ResetPassword;