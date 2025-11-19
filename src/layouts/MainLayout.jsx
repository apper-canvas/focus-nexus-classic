import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const MainLayout = () => {
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createContactTrigger, setCreateContactTrigger] = useState(0);
  const [createDealTrigger, setCreateDealTrigger] = useState(0);
  const [createLeadTrigger, setCreateLeadTrigger] = useState(0);
const handleCreateContact = () => {
    setCreateContactTrigger(prev => prev + 1);
  };

  const handleCreateDeal = () => {
    setCreateDealTrigger(prev => prev + 1);
  };

  const handleCreateLead = () => {
    setCreateLeadTrigger(prev => prev + 1);
  };
  // Context to pass to page components via Outlet
const outletContext = {
    onCreateContact: handleCreateContact,
    onCreateDeal: handleCreateDeal,
    onCreateLead: handleCreateLead,
    createContactTrigger,
    createDealTrigger,
    createLeadTrigger
  };

  return (
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
              <Outlet context={outletContext} />
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
  );
};

export default MainLayout;