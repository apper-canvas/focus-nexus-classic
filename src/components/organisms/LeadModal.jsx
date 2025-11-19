import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';
import { salesRepService } from '@/services/api/salesRepService';

const LeadModal = ({ isOpen, onClose, onSave, lead = null }) => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [salesReps, setSalesReps] = useState([]);
  const [salesRepsLoading, setSalesRepsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [formData, setFormData] = useState({
    lead_name_c: '',
    email_c: '',
    phone_c: '',
    lead_source_c: '',
    lead_status_c: 'New',
    priority_c: 'Medium',
    assigned_to_c: ''
  });
  const [errors, setErrors] = useState({});

  const leadSources = ['Website', 'Referral', 'Cold Call', 'Social Media', 'Event', 'Advertisement', 'Other'];
  const leadStatuses = ['New', 'Contacted', 'Qualified', 'Unqualified'];
  const priorities = [
    { value: 'High', label: 'High', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'Medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'Low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadSalesReps();
      if (lead) {
        setFormData({
          lead_name_c: lead.lead_name_c || '',
          email_c: lead.email_c || '',
          phone_c: lead.phone_c || '',
          lead_source_c: lead.lead_source_c || '',
          lead_status_c: lead.lead_status_c || 'New',
          priority_c: lead.priority_c || 'Medium',
          assigned_to_c: lead.assigned_to_c?.Id || ''
        });
        setShowMore(true); // Show full form for editing
      } else {
        // Reset form for new lead
        setFormData({
          lead_name_c: '',
          email_c: '',
          phone_c: '',
          lead_source_c: '',
          lead_status_c: 'New',
          priority_c: 'Medium',
          assigned_to_c: user?.userId || ''
        });
        setShowMore(false); // Start with quick add view
      }
      setErrors({});
    }
  }, [isOpen, lead, user]);

  const loadSalesReps = async () => {
    try {
      setSalesRepsLoading(true);
      const reps = await salesRepService.getAll();
      setSalesReps(reps || []);
    } catch (error) {
      console.error('Error loading sales reps:', error);
      setSalesReps([]);
    } finally {
      setSalesRepsLoading(false);
    }
  };

  const validateForm = () => {
const newErrors = {};

    // Required fields validation with proper null checking
    if (!formData.lead_name_c?.trim()) {
      newErrors.lead_name_c = 'Lead name is required';
    }

    if (!formData.email_c?.trim()) {
      newErrors.email_c = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c.trim())) {
      newErrors.email_c = 'Please enter a valid email address';
    }

    if (!formData.phone_c?.trim()) {
      newErrors.phone_c = 'Phone is required';
    }

    // For quick add, only require minimal fields
    if (!showMore) {
      if (!formData.lead_source_c?.trim()) {
        newErrors.lead_source_c = 'Lead source is required';
      }
      if (!formData.assigned_to_c) {
        newErrors.assigned_to_c = 'Assigned to is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getPriorityStyle = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {lead ? 'Edit Lead' : 'Create New Lead'}
            </h2>
            {!lead && (
              <p className="text-sm text-gray-500 mt-1">
                {showMore ? 'Complete lead information' : 'Quick add - essential details only'}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information - Always shown */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <ApperIcon name="User" size={20} className="mr-2" />
              Basic Information
            </h3>
            
            <FormField
              label="Lead Name"
              error={errors.lead_name_c}
              required
            >
              <Input
                value={formData.lead_name_c}
                onChange={(e) => handleChange('lead_name_c', e.target.value)}
                placeholder="Enter lead name"
                className={errors.lead_name_c ? 'border-red-500' : ''}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Email"
                error={errors.email_c}
                required
              >
                <Input
                  type="email"
                  value={formData.email_c}
                  onChange={(e) => handleChange('email_c', e.target.value)}
                  placeholder="Enter email address"
                  className={errors.email_c ? 'border-red-500' : ''}
                />
              </FormField>

              <FormField
                label="Phone"
                error={errors.phone_c}
                required
              >
                <Input
                  type="tel"
                  value={formData.phone_c}
                  onChange={(e) => handleChange('phone_c', e.target.value)}
                  placeholder="Enter phone number"
                  className={errors.phone_c ? 'border-red-500' : ''}
                />
              </FormField>
            </div>
          </div>

          {/* Quick Add Essential Fields */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Lead Source"
                error={errors.lead_source_c}
                required={!showMore}
              >
                <select
                  value={formData.lead_source_c}
                  onChange={(e) => handleChange('lead_source_c', e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                    errors.lead_source_c ? 'border-red-500' : ''
                  )}
                >
                  <option value="">Select lead source</option>
                  {leadSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Assigned To"
                error={errors.assigned_to_c}
                required={!showMore}
              >
                <select
                  value={formData.assigned_to_c}
                  onChange={(e) => handleChange('assigned_to_c', e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                    errors.assigned_to_c ? 'border-red-500' : ''
                  )}
                  disabled={salesRepsLoading}
                >
                  <option value="">Select assignee</option>
                  {salesReps.map(rep => (
                    <option key={rep.Id} value={rep.Id}>{rep.Name}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>

          {/* Show More Toggle */}
          {!lead && (
            <div className="mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMore(!showMore)}
                className="w-full"
              >
                <ApperIcon name={showMore ? "ChevronUp" : "ChevronDown"} size={16} className="mr-2" />
                {showMore ? "Show Less" : "Show More Fields"}
              </Button>
            </div>
          )}

          {/* Additional Fields - Shown when expanded or editing */}
          {(showMore || lead) && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <ApperIcon name="Settings" size={20} className="mr-2" />
                Lead Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Lead Status">
                  <select
                    value={formData.lead_status_c}
                    onChange={(e) => handleChange('lead_status_c', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {leadStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Priority">
                  <select
                    value={formData.priority_c}
                    onChange={(e) => handleChange('priority_c', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                  {formData.priority_c && (
                    <div className="mt-2">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        getPriorityStyle(formData.priority_c)
                      )}>
                        {formData.priority_c} Priority
                      </span>
                    </div>
                  )}
                </FormField>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  {lead ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  {lead ? 'Update Lead' : 'Create Lead'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;