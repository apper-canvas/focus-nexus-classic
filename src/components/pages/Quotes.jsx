import { useState, useEffect } from "react";
import QuoteTable from "@/components/organisms/QuoteTable";
import QuoteModal from "@/components/organisms/QuoteModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { quoteService } from "@/services/api/quoteService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";

const Quotes = ({ onCreateQuote, createQuoteTrigger }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const loadQuotes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await quoteService.getAll();
      setQuotes(data);
    } catch (err) {
      setError("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    if (createQuoteTrigger) {
      setModalOpen(true);
      setSelectedQuote(null);
    }
  }, [createQuoteTrigger]);

  const handleCreate = () => {
    setSelectedQuote(null);
    setModalOpen(true);
  };

  const handleEdit = (quote) => {
    setSelectedQuote(quote);
    setModalOpen(true);
  };

  const handleSave = async (quoteData) => {
    try {
      if (selectedQuote) {
        await quoteService.update(selectedQuote.Id, quoteData);
        await activityService.create({
          type: "quote_updated",
          entityType: "quote",
          entityId: selectedQuote.Id,
          description: `Quote ${selectedQuote.quoteNumber} updated`
        });
        toast.success("Quote updated successfully");
      } else {
        const newQuote = await quoteService.create(quoteData);
        await activityService.create({
          type: "quote_created",
          entityType: "quote",
          entityId: newQuote.Id,
          description: `Quote ${newQuote.quoteNumber} created for ${quoteData.customer}`
        });
        toast.success("Quote created successfully");
      }
      loadQuotes();
    } catch (err) {
      toast.error("Failed to save quote");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quote?")) return;
    
    try {
      await quoteService.delete(id);
      toast.success("Quote deleted successfully");
      loadQuotes();
    } catch (err) {
      toast.error("Failed to delete quote");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadQuotes} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quotes</h1>
          <p className="text-sm text-secondary mt-1">
            Manage your sales quotes and proposals
          </p>
        </div>
      </div>

      {quotes.length === 0 ? (
        <Empty
          icon="FileText"
          title="No quotes yet"
          message="Start creating quotes for your customers"
          actionLabel="Create Quote"
          onAction={handleCreate}
        />
      ) : (
        <QuoteTable
          quotes={quotes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <QuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        quote={selectedQuote}
        onSave={handleSave}
      />
    </div>
  );
};

export default Quotes;