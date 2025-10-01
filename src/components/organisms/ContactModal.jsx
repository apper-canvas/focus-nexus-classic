import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const ContactModal = ({ isOpen, onClose, contact, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    tags: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
if (contact) {
      setFormData({
        name: contact.name_c || contact.Name || "",
        email: contact.email_c || "",
        phone: contact.phone_c || "",
        company: contact.company_c || "",
        tags: contact.tags_c ? contact.tags_c.split(",").join(", ") : "",
        notes: contact.notes_c || ""
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        tags: "",
        notes: ""
      });
    }
    setErrors({});
  }, [contact, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
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

    const contactData = {
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
    };

    try {
      await onSave(contactData);
      onClose();
    } catch (error) {
      toast.error("Failed to save contact");
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
                {contact ? "Edit Contact" : "New Contact"}
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
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <FormField
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <FormField
                  label="Tags (comma separated)"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g. enterprise, hot-lead, technology"
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
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {contact ? "Update Contact" : "Create Contact"}
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

export default ContactModal;