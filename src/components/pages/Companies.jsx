import { useState, useEffect } from "react";
import CompanyTable from "@/components/organisms/CompanyTable";
import CompanyModal from "@/components/organisms/CompanyModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { companyService } from "@/services/api/companyService";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const loadCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreate = () => {
    setSelectedCompany(null);
    setModalOpen(true);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setModalOpen(true);
  };

  const handleSave = async (companyData) => {
    try {
      if (selectedCompany) {
        await companyService.update(selectedCompany.Id, companyData);
        toast.success("Company updated successfully");
      } else {
        await companyService.create(companyData);
        toast.success("Company created successfully");
      }
      loadCompanies();
    } catch (err) {
      toast.error("Failed to save company");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    
    try {
      await companyService.delete(id);
      toast.success("Company deleted successfully");
      loadCompanies();
    } catch (err) {
      toast.error("Failed to delete company");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Companies</h1>
          <p className="text-sm text-secondary mt-1">
            Manage your business relationships
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center space-x-2">
          <ApperIcon name="Plus" size={16} />
          <span>Add Company</span>
        </Button>
      </div>

      {companies.length === 0 ? (
        <Empty
          icon="Building"
          title="No companies yet"
          message="Start building your business network by adding your first company"
          actionLabel="Add Company"
          onAction={handleCreate}
        />
      ) : (
        <CompanyTable
          companies={companies}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CompanyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        company={selectedCompany}
        onSave={handleSave}
      />
    </div>
  );
};

export default Companies;