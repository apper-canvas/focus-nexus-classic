import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const CompanyModal = ({ isOpen, onClose, company, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    website: "",
    industry: "",
    notes: "",
    numEmployees: "",
    annualRevenue: "",
    parentCompanyId: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name_c || company.Name || "",
        address: company.address_c || "",
        city: company.city_c || "",
        state: company.state_c || "",
        zipCode: company.zip_code_c || "",
        phone: company.phone_c || "",
        website: company.website_c || "",
        industry: company.industry_c || "",
        notes: company.notes_c || "",
        numEmployees: company.num_employees_c || "",
        annualRevenue: company.annual_revenue_c || "",
        parentCompanyId: company.parent_company_id_c || ""
      });
    } else {
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        website: "",
        industry: "",
        notes: "",
        numEmployees: "",
        annualRevenue: "",
        parentCompanyId: ""
      });
    }
    setErrors({});
  }, [company, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (formData.website && !formData.website.match(/^https?:\/\//)) {
      if (!formData.website.includes('.')) {
        newErrors.website = "Invalid website format";
      }
    }
    if (formData.numEmployees && isNaN(Number(formData.numEmployees))) {
      newErrors.numEmployees = "Number of employees must be a number";
    }
    if (formData.annualRevenue && isNaN(Number(formData.annualRevenue))) {
      newErrors.annualRevenue = "Annual revenue must be a number";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const companyData = {
      ...formData,
      numEmployees: formData.numEmployees ? parseInt(formData.numEmployees) : null,
      annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : null,
      parentCompanyId: formData.parentCompanyId ? parseInt(formData.parentCompanyId) : null
    };

    try {
      await onSave(companyData);
      onClose();
    } catch (error) {
      toast.error("Failed to save company");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-[200]"
          >
            <div className="w-full max-w-4xl bg-surface rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-surface border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">
                  {company ? "Edit Company" : "New Company"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    label="Company Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />
                  <FormField
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    error={errors.industry}
                  />
                </div>

                <div className="mb-4">
                  <FormField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                  />
                  <FormField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    error={errors.state}
                  />
                  <FormField
                    label="Zip Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    error={errors.zipCode}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                  />
                  <FormField
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    error={errors.website}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormField
                    label="Number of Employees"
                    name="numEmployees"
                    type="number"
                    value={formData.numEmployees}
                    onChange={handleChange}
                    error={errors.numEmployees}
                  />
                  <FormField
                    label="Annual Revenue ($)"
                    name="annualRevenue"
                    type="number"
                    step="0.01"
                    value={formData.annualRevenue}
                    onChange={handleChange}
                    error={errors.annualRevenue}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400"
                    placeholder="Add any additional notes about this company..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {company ? "Update Company" : "Create Company"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CompanyModal;