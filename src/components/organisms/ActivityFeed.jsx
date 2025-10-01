import { formatDistanceToNow } from "date-fns";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const getActivityIcon = (type) => {
  const iconMap = {
    contact_created: "UserPlus",
    contact_updated: "UserCheck",
    deal_created: "Plus",
    deal_stage_updated: "TrendingUp",
    note_added: "FileText"
  };
  return iconMap[type] || "Activity";
};

const ActivityFeed = ({ activities }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name={getActivityIcon(activity.type)} size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">{activity.description}</p>
              <p className="text-xs text-secondary mt-1">
{(() => {
                  if (!activity.timestamp) return 'Just now';
                  const date = new Date(activity.timestamp);
                  if (isNaN(date.getTime())) return 'Just now';
                  return formatDistanceToNow(date, { addSuffix: true });
                })()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityFeed;