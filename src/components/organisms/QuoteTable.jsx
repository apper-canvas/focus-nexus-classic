import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const QuoteTable = ({ quotes, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("quoteNumber");
  const [sortDirection, setSortDirection] = useState("desc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;
    return aVal > bVal ? modifier : -modifier;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case "Accepted":
        return "success";
      case "Sent":
        return "default";
      case "Draft":
        return "secondary";
      case "Rejected":
        return "destructive";
      case "Expired":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-surface rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("quoteNumber")}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-600 uppercase hover:text-slate-800"
                >
                  <span>Quote #</span>
                  <ApperIcon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("customer")}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-600 uppercase hover:text-slate-800"
                >
                  <span>Customer</span>
                  <ApperIcon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("amount")}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-600 uppercase hover:text-slate-800"
                >
                  <span>Amount</span>
                  <ApperIcon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Quote Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Expiry Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedQuotes.map((quote, index) => (
              <motion.tr
                key={quote.Id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/quotes/${quote.Id}`)}
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-primary">{quote.quoteNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-800">{quote.customer}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-800">{formatCurrency(quote.amount)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{formatDate(quote.quoteDate)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{formatDate(quote.expiryDate)}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(quote.status)}>
                    {quote.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(quote);
                      }}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(quote.Id);
                      }}
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

export default QuoteTable;