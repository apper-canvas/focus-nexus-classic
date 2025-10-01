import { useState, useEffect } from "react";
import ContactTable from "@/components/organisms/ContactTable";
import ContactModal from "@/components/organisms/ContactModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";

const Contacts = ({ onCreateContact, createContactTrigger }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (createContactTrigger) {
      setModalOpen(true);
      setSelectedContact(null);
    }
  }, [createContactTrigger]);

  const handleCreate = () => {
    setSelectedContact(null);
    setModalOpen(true);
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
  };

  const handleSave = async (contactData) => {
    try {
      if (selectedContact) {
await contactService.update(selectedContact.Id, contactData);
        await activityService.create({
          type: "contact_updated",
          entityType: "contact",
          entityId: selectedContact.Id,
          description: `Contact ${contactData.name || "Unknown"} updated`
        });
        toast.success("Contact updated successfully");
} else {
        const newContact = await contactService.create(contactData);
        await activityService.create({
          type: "contact_created",
          entityType: "contact",
          entityId: newContact.Id,
          description: `Contact ${contactData.name} created`
        });
        toast.success("Contact created successfully");
      }
      loadContacts();
    } catch (err) {
      toast.error("Failed to save contact");
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    
    try {
      await contactService.delete(id);
      toast.success("Contact deleted successfully");
      loadContacts();
    } catch (err) {
      toast.error("Failed to delete contact");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contacts</h1>
          <p className="text-sm text-secondary mt-1">
            Manage your customer relationships
          </p>
        </div>
      </div>

      {contacts.length === 0 ? (
        <Empty
          icon="Users"
          title="No contacts yet"
          message="Start building your network by adding your first contact"
          actionLabel="Add Contact"
          onAction={handleCreate}
        />
      ) : (
        <ContactTable
          contacts={contacts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contact={selectedContact}
        onSave={handleSave}
      />
    </div>
  );
};

export default Contacts;