import { useState, useEffect } from "react";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealModal from "@/components/organisms/DealModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { salesRepService } from "@/services/api/salesRepService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";

const Pipeline = ({ onCreateDeal, createDealTrigger }) => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dealsData, contactsData, salesRepsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        salesRepService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
      setSalesReps(salesRepsData);
    } catch (err) {
      setError("Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (createDealTrigger) {
      setModalOpen(true);
      setSelectedDeal(null);
    }
  }, [createDealTrigger]);

  const handleCreate = () => {
    setSelectedDeal(null);
    setModalOpen(true);
  };

  const handleEdit = (deal) => {
    setSelectedDeal(deal);
    setModalOpen(true);
  };

  const handleSave = async (dealData) => {
    try {
      if (selectedDeal) {
await dealService.update(selectedDeal.Id, dealData);
        await activityService.create({
          type: "deal_updated",
          entityType: "deal",
          entityId: selectedDeal.Id,
          description: `Deal '${dealData.title || "Untitled"}' updated`
        });
        toast.success("Deal updated successfully");
} else {
        const newDeal = await dealService.create(dealData);
        await activityService.create({
          type: "deal_created",
          entityType: "deal",
          entityId: newDeal.Id,
          description: `Deal '${dealData.title}' created`
        });
        toast.success("Deal created successfully");
      }
      loadData();
    } catch (err) {
      toast.error("Failed to save deal");
      throw err;
    }
  };

  const handleUpdateStage = async (dealId, newStage) => {
    try {
      const deal = deals.find(d => d.Id === dealId);
      await dealService.updateStage(dealId, newStage);
      await activityService.create({
        type: "deal_stage_updated",
        entityType: "deal",
        entityId: dealId,
        description: `Deal moved to ${newStage} stage`
      });
      toast.success(`Deal moved to ${newStage}`);
      loadData();
    } catch (err) {
      toast.error("Failed to update deal stage");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales Pipeline</h1>
          <p className="text-sm text-secondary mt-1">
            Track and manage your deals through each stage
          </p>
        </div>
      </div>

      {deals.length === 0 ? (
        <Empty
          icon="TrendingUp"
          title="No deals yet"
          message="Start tracking your sales opportunities by creating your first deal"
          actionLabel="Create Deal"
          onAction={handleCreate}
        />
      ) : (
        <PipelineBoard
          deals={deals}
          contacts={contacts}
          onUpdateStage={handleUpdateStage}
          onEdit={handleEdit}
        />
      )}

<DealModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        deal={selectedDeal}
        contacts={contacts}
        salesReps={salesReps}
        onSave={handleSave}
      />
    </div>
  );
};

export default Pipeline;