import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/molecules/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { format } from "date-fns";

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [contactData, dealsData, activitiesData] = await Promise.all([
        contactService.getById(id),
        dealService.getByContactId(id),
        activityService.getByEntityId("contact", id)
      ]);
      setContact(contactData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load contact details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!contact) return <Error message="Contact not found" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate("/contacts")}>
          <ApperIcon name="ArrowLeft" size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-slate-800">Contact Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
<Avatar name={contact.name_c || contact.Name || "Unknown"} size="lg" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{contact.name_c || contact.Name || "Unknown"}</h2>
                  <p className="text-sm text-secondary">{contact.company_c || "No Company"}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate(`/contacts`)}>
                <ApperIcon name="Edit" size={16} className="mr-2" />
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Mail" size={20} className="text-secondary" />
                <div>
                  <p className="text-xs text-secondary">Email</p>
<p className="text-sm text-slate-800">{contact.email_c || "No Email"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ApperIcon name="Phone" size={20} className="text-secondary" />
                <div>
                  <p className="text-xs text-secondary">Phone</p>
<p className="text-sm text-slate-800">{contact.phone_c || "No Phone"}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
{(contact.tags_c ? contact.tags_c.split(",") : []).map((tag) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))}
            </div>

{contact.notes_c && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-2">Notes</h3>
                <p className="text-sm text-slate-600">{contact.notes}</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Related Deals</h3>
            {deals.length === 0 ? (
              <p className="text-sm text-secondary text-center py-8">No deals associated with this contact</p>
            ) : (
              <div className="space-y-3">
{deals.map((deal) => (
                  <div key={deal.Id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-800">{deal.title_c || deal.Name || "Untitled Deal"}</h4>
                      <Badge variant="primary">{deal.stage_c || "Lead"}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-accent">${(deal.value_c || 0).toLocaleString()}</span>
                      {deal.expected_close_date_c && (
                        <span className="text-xs text-secondary">
                          Close: {format(new Date(deal.expected_close_date_c), "MMM dd, yyyy")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Activity</h3>
            {activities.length === 0 ? (
              <p className="text-sm text-secondary text-center py-8">No activity yet</p>
            ) : (
              <div className="space-y-4">
{activities.map((activity) => (
                  <div key={activity.Id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="Activity" size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700">{activity.description_c || "Activity"}</p>
                      <p className="text-xs text-secondary mt-1">
{(() => {
                          if (!activity.timestamp_c) return 'No date';
                          const date = new Date(activity.timestamp_c);
                          if (isNaN(date.getTime())) return 'No date';
                          return format(date, "MMM dd, yyyy 'at' h:mm a");
                        })()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;