import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const QuoteModal = ({ isOpen, onClose, quote, onSave }) => {
  const [formData, setFormData] = useState({
    customer: "",
    email: "",
    phone: "",
    amount: "",
    quoteDate: "",
    expiryDate: "",
    status: "Draft",
    products: "",
    terms: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (quote) {
      setFormData({
        customer: quote.customer || "",
        email: quote.email || "",
        phone: quote.phone || "",
        amount: quote.amount || "",
        quoteDate: quote.quoteDate || "",
        expiryDate: quote.expiryDate || "",
        status: quote.status || "Draft",
        products: quote.products || "",
        terms: quote.terms || ""
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setFormData({
        customer: "",
        email: "",
        phone: "",
        amount: "",
        quoteDate: today,
        expiryDate: thirtyDaysLater,
        status: "Draft",
        products: "",
        terms: ""
      });
    }
    setErrors({});
  }, [quote, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customer.trim()) newErrors.customer = "Customer name is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    if (!formData.quoteDate) newErrors.quoteDate = "Quote date is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
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

    const quoteData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    try {
      await onSave(quoteData);
      onClose();
    } catch (error) {
      toast.error("Failed to save quote");
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
            <div className="w-full max-w-3xl bg-surface rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-surface border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">
                  {quote ? "Edit Quote" : "New Quote"}
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
                    label="Customer Name"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    error={errors.customer}
                    required
                  />
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
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
                    label="Amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    error={errors.amount}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormField
                    label="Quote Date"
                    name="quoteDate"
                    type="date"
                    value={formData.quoteDate}
                    onChange={handleChange}
                    error={errors.quoteDate}
                    required
                  />
                  <FormField
                    label="Expiry Date"
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    error={errors.expiryDate}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Status <span className="text-error">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Products / Services
                  </label>
                  <textarea
                    name="products"
                    value={formData.products}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400"
                    placeholder="List products or services included in this quote..."
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Terms & Conditions
                  </label>
                  <textarea
                    name="terms"
                    value={formData.terms}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400"
                    placeholder="Enter payment terms, conditions, and other details..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {quote ? "Update Quote" : "Create Quote"}
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

export default QuoteModal;