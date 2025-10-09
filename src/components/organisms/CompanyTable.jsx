import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const CompanyTable = ({ companies, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState("name_c");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    const modifier = sortDirection === "asc" ? 1 : -1;
    return aVal > bVal ? modifier : -modifier;
  });

  const formatRevenue = (revenue) => {
    if (!revenue) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(revenue);
  };

  const formatEmployeeCount = (count) => {
    if (!count) return "N/A";
    return new Intl.NumberFormat('en-US').format(count);
  };

  return (
    <div className="bg-surface rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("name_c")}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-600 uppercase hover:text-slate-800"
                >
                  <span>Company</span>
                  <ApperIcon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("industry_c")}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-600 uppercase hover:text-slate-800"
                >
                  <span>Industry</span>
                  <ApperIcon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Phone
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("num_employees_c")}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-600 uppercase hover:text-slate-800"
                >
                  <span>Employees</span>
                  <ApperIcon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("annual_revenue_c")}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-600 uppercase hover:text-slate-800"
                >
                  <span>Revenue</span>
                  <ApperIcon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedCompanies.map((company, index) => (
              <motion.tr
                key={company.Id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-800">
                      {company.name_c || company.Name || "Unknown Company"}
                    </span>
                    {company.website_c && (
                      <a
                        href={company.website_c.startsWith('http') ? company.website_c : `https://${company.website_c}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {company.website_c}
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">
                    {company.industry_c || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">
                    {[company.city_c, company.state_c].filter(Boolean).join(', ') || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">
                    {company.phone_c || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">
                    {formatEmployeeCount(company.num_employees_c)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">
                    {formatRevenue(company.annual_revenue_c)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(company)}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(company.Id)}
                    >
                      <ApperIcon name="Trash2" size={16} className="text-error" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTable;