import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="AlertCircle" size={32} className="text-slate-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-slate-600 mb-4">Page Not Found</h2>
          <p className="text-slate-500 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link to="/" className="block">
            <Button variant="primary" className="w-full">
              <ApperIcon name="Home" size={16} className="mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          
          <Link to="/contacts" className="block">
            <Button variant="secondary" className="w-full">
              <ApperIcon name="Users" size={16} className="mr-2" />
              View Contacts
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;