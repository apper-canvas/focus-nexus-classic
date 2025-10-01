import { useState, useEffect } from "react";
import MetricCard from "@/components/organisms/MetricCard";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/molecules/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll(10)
      ]);
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

const activeDeals = deals.filter(d => d.stage_c !== "Closed");
  const totalPipelineValue = activeDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0);
  const closedDeals = deals.filter(d => d.stage_c === "Closed");
  const conversionRate = deals.length > 0 ? ((closedDeals.length / deals.length) * 100).toFixed(1) : 0;

  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.CreatedOn) - new Date(a.CreatedOn))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon="Users"
          label="Total Contacts"
          value={contacts.length}
          trend="+12%"
          trendUp={true}
          index={0}
        />
        <MetricCard
          icon="TrendingUp"
          label="Active Deals"
          value={activeDeals.length}
          trend="+5"
          trendUp={true}
          index={1}
        />
        <MetricCard
          icon="DollarSign"
          label="Pipeline Value"
          value={`$${(totalPipelineValue / 1000).toFixed(0)}K`}
          trend="+18%"
          trendUp={true}
          index={2}
        />
        <MetricCard
          icon="Target"
          label="Conversion Rate"
          value={`${conversionRate}%`}
          trend="+2.3%"
          trendUp={true}
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Contacts</h3>
            <div className="space-y-3">
{recentContacts.map((contact) => (
                <div
                  key={contact.Id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar name={contact.name_c || contact.Name || "Unknown"} size="md" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{contact.name_c || contact.Name || "Unknown"}</p>
                      <p className="text-xs text-secondary">{contact.company_c || "No Company"}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {contact.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ActivityFeed activities={activities} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Pipeline Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
{["Lead", "Qualified", "Proposal", "Negotiation", "Closed"].map((stage) => {
              const stageDeals = deals.filter(d => d.stage_c === stage);
              const stageValue = stageDeals.reduce((sum, d) => sum + (d.value_c || 0), 0);
              return (
                <div key={stage} className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs font-medium text-secondary mb-2">{stage}</p>
                  <p className="text-2xl font-bold text-slate-800 mb-1">{stageDeals.length}</p>
                  <p className="text-xs text-accent font-semibold">
                    ${(stageValue / 1000).toFixed(0)}K
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;