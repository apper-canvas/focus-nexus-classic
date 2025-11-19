import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
const Header = ({ onCreateContact, onCreateDeal, onCreateLead }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
const { logout } = useAuth();

  const handleSearch = (query) => {
    setSearchQuery(query);
    // In a real app, this would filter the current view
  };

  return (
    <header className="bg-surface border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Nexus CRM</h1>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <SearchBar 
            placeholder="Search contacts, deals..."
            onSearch={handleSearch}
          />
        </div>

<div className="flex items-center space-x-3">
{location.pathname === "/contacts" && (
            <Button onClick={onCreateContact}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Contact
            </Button>
          )}
          {location.pathname === "/leads" && (
            <Button onClick={onCreateLead}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Lead
            </Button>
          )}
          {location.pathname === "/pipeline" && (
            <Button onClick={onCreateDeal}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Deal
            </Button>
          )}
<Button variant="secondary" onClick={() => {
            if (logout) {
              logout();
            }
          }}>
            <ApperIcon name="LogOut" size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;