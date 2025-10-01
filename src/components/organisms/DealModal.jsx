import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const STAGES = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];

const DealModal = ({ isOpen, onClose, deal, contacts, salesReps, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    contactId: "",
    salesRepId: "",
    stage: "Lead",
    value: "",
    expectedCloseDate: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

useEffect(() => {
    if (deal) {
setFormData({
        title: deal.title_c || deal.Name || "",
        contactId: (deal.contact_id_c?.Id || deal.contact_id_c)?.toString() || "",
        salesRepId: (deal.sales_rep_id_c?.Id || deal.sales_rep_id_c)?.toString() || "",
        stage: deal.stage_c || "Lead",
        value: deal.value_c?.toString() || "",
        expectedCloseDate: deal.expected_close_date_c || "",
        notes: deal.notes_c || ""
      });
} else {
      setFormData({
        title: "",
        contactId: "",
        salesRepId: "",
        stage: "Lead",
        value: "",
        expectedCloseDate: "",
        notes: ""
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.contactId) newErrors.contactId = "Contact is required";
    if (!formData.value) newErrors.value = "Value is required";
    if (formData.value && isNaN(formData.value)) newErrors.value = "Value must be a number";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
const dealData = {
      ...formData,
      contactId: parseInt(formData.contactId),
      salesRepId: formData.salesRepId ? parseInt(formData.salesRepId) : undefined,
      value: parseFloat(formData.value)
    };

    try {
      await onSave(dealData);
      onClose();
    } catch (error) {
      toast.error("Failed to save deal");
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
            <div className="w-full max-w-2xl bg-surface rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                {deal ? "Edit Deal" : "New Deal"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <FormField
                  label="Deal Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  required
                  placeholder="e.g. Enterprise Package for TechCorp"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Contact
                    <span className="text-error ml-1">*</span>
                  </label>
                  <select
                    name="contactId"
                    value={formData.contactId}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a contact</option>
                    {contacts.map((contact) => (
<option key={contact.Id} value={contact.Id}>
                        {contact.name_c || contact.Name || "Unknown"} - {contact.company_c || "No Company"}
                      </option>
                    ))}
                  </select>
                  {errors.contactId && (
                    <p className="text-xs text-error mt-1">{errors.contactId}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Stage
                  </label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Sales Rep
                </label>
                <select
                  name="salesRepId"
                  value={formData.salesRepId}
                  onChange={handleChange}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a sales rep</option>
                  {salesReps.map((salesRep) => (
<option key={salesRep.Id} value={salesRep.Id}>
                      {salesRep.name_c || salesRep.Name || "Unknown"} - {salesRep.title_c || "No Title"}
                    </option>
                  ))}
</select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Deal Value"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                error={errors.value}
                required
                placeholder="e.g. 45000"
              />
              <FormField
                label="Expected Close Date"
                name="expectedCloseDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={handleChange}
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
                  placeholder="Add any additional notes about this deal..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
{deal ? "Update Deal" : "Create Deal"}
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

export default DealModal;