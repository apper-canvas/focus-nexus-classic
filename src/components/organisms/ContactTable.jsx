import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/molecules/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const ContactTable = ({ contacts, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;
    return aVal > bVal ? modifier : -modifier;
  });

  return (
    <div className="bg-surface rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-600 uppercase hover:text-slate-800"
                >
                  <span>Contact</span>
                  <ApperIcon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort("company")}
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-600 uppercase hover:text-slate-800"
                >
                  <span>Company</span>
                  <ApperIcon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                Tags
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedContacts.map((contact, index) => (
              <motion.tr
                key={contact.Id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/contacts/${contact.Id}`)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
<Avatar name={contact.name_c || contact.Name || "Unknown"} size="md" />
                    <span className="text-sm font-medium text-slate-800">{contact.name_c || contact.Name || "Unknown"}</span>
                  </div>
                </td>
<td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{contact.company_c?.name_c || contact.company_c?.Name || "No Company"}</span>
                </td>
                <td className="px-6 py-4">
<span className="text-sm text-slate-600">{contact.email_c || "No Email"}</span>
                </td>
                <td className="px-6 py-4">
<span className="text-sm text-slate-600">{contact.phone_c || "No Phone"}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
{(contact.tags_c ? contact.tags_c.split(",") : []).slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))}
                    {(contact.tags_c?.split(",").length || 0) > 2 && (
                      <Badge variant="default">+{(contact.tags_c?.split(",").length || 0) - 2}</Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(contact);
                      }}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(contact.Id);
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

export default ContactTable;