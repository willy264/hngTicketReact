import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Modal from "../components/ui/Modal";
import type { Ticket } from "../lib/types";
import { mockTicketsApi, setCurrentUser } from "../lib/utils";
import { validateTicket, type ValidationError } from "../lib/validation";
import { useAuth } from "../hooks/useAuth";

const TicketPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});
  const [formData, setFormData] = useState<Omit<Ticket, "id">>({
    userId: user?.id || "",
    title: "",
    description: "",
    status: "open",
    priority: "medium",
  });

  const resetForm = () => {
    setFormData({
      userId: user?.id || "",
      title: "",
      description: "",
      status: "open",
      priority: "medium",
    });
    setSelectedTicket(null);
    setValidationErrors({});
  };

  const fetchTickets = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setCurrentUser(user.id);
      const fetchedTickets = await mockTicketsApi.list();
      setTickets(fetchedTickets);
    } catch (error) {
      toast.error(
        error instanceof Error && error.message === "No user logged in"
          ? "Your session has expired — please log in again."
          : "Failed to load tickets. Please retry."
      );
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateTicket(formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    try {
      if (selectedTicket) {
        await mockTicketsApi.update(selectedTicket.id, formData);
        toast.success("Ticket updated successfully");
      } else {
        await mockTicketsApi.create(formData);
        toast.success("Ticket created successfully");
      }
      await fetchTickets();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error && error.message === "No user logged in"
          ? "Your session has expired — please log in again."
          : error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
      console.error("Error submitting ticket:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;
    try {
      await mockTicketsApi.delete(selectedTicket.id);
      toast.success("Ticket deleted successfully");
      await fetchTickets();
      setIsDeleteModalOpen(false);
      setSelectedTicket(null);
    } catch (error) {
      toast.error(
        error instanceof Error && error.message === "No user logged in"
          ? "Your session has expired — please log in again."
          : "Failed to delete ticket. Please try again."
      );
      console.error("Error deleting ticket:", error);
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      userId: ticket.userId,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
    });
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleFieldChange = (
    field: keyof Omit<Ticket, "id">,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const getStatusBadge = (status: Ticket["status"]) => {
    const config = {
      open: { style: "bg-green-100 text-green-800", label: "Open" },
      in_progress: {
        style: "bg-yellow-100 text-yellow-800",
        label: "In Progress",
      },
      closed: { style: "bg-gray-100 text-gray-800", label: "Closed" },
    };
    const { style, label } = config[status];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${style}`}>
        {label}
      </span>
    );
  };

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    const config = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-blue-100 text-blue-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config[priority]}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const renderFormField = (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    type: "text" | "textarea" | "select",
    options?: { value: string; label: string }[],
    required = false
  ) => {
    const error = validationErrors[id as keyof ValidationError];
    const commonProps = {
      id,
      value,
      onChange: (e: any) => onChange(e.target.value),
      className: `${error ? "border-red-500" : "border-gray-300"}`,
      "aria-invalid": !!error,
      "aria-describedby": error ? `${id}-error` : undefined,
    };

    return (
      <div>
        <Label htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {type === "text" && (
          <Input
            type="text"
            {...commonProps}
            className={`mt-1 ${commonProps.className}`}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
        {type === "textarea" && (
          <textarea
            {...commonProps}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${commonProps.className}`}
            rows={3}
            placeholder={`Enter ${label.toLowerCase()} (optional)`}
          />
        )}
        {type === "select" && (
          <select
            {...commonProps}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${commonProps.className}`}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {error && (
          <div
            id={`${id}-error`}
            className="text-red-500 text-sm mt-1 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" />
            {error[0]}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tickets</h1>
          <p className="text-gray-600 mt-2">Manage your support tickets</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Ticket
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="text-xl font-medium text-gray-900">
            No tickets found
          </h3>
          <p className="mt-2 text-gray-500">
            Get started by creating a new ticket
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {ticket.title}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="p-2"
                    onClick={() => handleEdit(ticket)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    className="p-2"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {ticket.description}
              </p>
              <div className="flex justify-between items-center">
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            {selectedTicket ? "Edit Ticket" : "Create New Ticket"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderFormField(
              "title",
              "Title",
              formData.title,
              (value) => handleFieldChange("title", value),
              "text",
              undefined,
              true
            )}
            {renderFormField(
              "description",
              "Description",
              formData.description,
              (value) => handleFieldChange("description", value),
              "textarea"
            )}
            {renderFormField(
              "status",
              "Status",
              formData.status,
              (value) => handleFieldChange("status", value),
              "select",
              [
                { value: "open", label: "Open" },
                { value: "in_progress", label: "In Progress" },
                { value: "closed", label: "Closed" },
              ],
              true
            )}
            {renderFormField(
              "priority",
              "Priority",
              formData.priority,
              (value) => handleFieldChange("priority", value),
              "select",
              [
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]
            )}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedTicket ? "Update Ticket" : "Create Ticket"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen && !!selectedTicket}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTicket(null);
        }}
      >
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Delete Ticket</h2>
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedTicket?.title}"? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedTicket(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TicketPage;