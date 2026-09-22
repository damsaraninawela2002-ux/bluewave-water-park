import React, { useEffect, useState } from 'react';
import { ticketService } from '../../services/ticketService';
import { Plus, Edit2, Trash2, Ticket, AlertTriangle } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import FullPageLoader from '../../components/Loader';
import toast from 'react-hot-toast';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  // Delete Confirmation Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketService.getAll();
      setTickets(data);
    } catch (err) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', price: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.price);
    if (!formData.name.trim() || isNaN(priceNum) || priceNum <= 0 || !formData.description.trim()) {
      toast.error('Please enter a valid ticket name, positive price, and description');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        price: priceNum,
        description: formData.description.trim(),
      };

      if (editingItem) {
        await ticketService.update(editingItem.id, payload);
        toast.success('Ticket updated successfully!');
      } else {
        await ticketService.create(payload);
        toast.success('Ticket created successfully!');
      }
      setIsModalOpen(false);
      await fetchTickets();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save ticket';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const promptDelete = (item) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      await ticketService.delete(deletingItem.id);
      toast.success(`Ticket "${deletingItem.name}" deleted successfully!`);
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
      await fetchTickets();
    } catch (err) {
      toast.error('Failed to delete ticket');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <FullPageLoader text="Loading tickets directory..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-50 dark:bg-ocean-950 text-ocean-800 dark:text-aqua-300 border border-ocean-200/80 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider mb-2 font-heading">
            <Ticket className="w-3.5 h-3.5 text-aqua-600 dark:text-aqua-400" />
            <span>Admissions & Pricing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading tracking-tight">
            Manage Tickets
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure admission pass tiers, VIP wristbands, and family discount packages.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={openAddModal}
          className="shadow-coral self-start sm:self-auto"
        >
          Add Ticket
        </Button>
      </div>

      {/* Tickets Data Table */}
      <Card className="p-0 overflow-hidden border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/70 dark:bg-navy-900/80 border-b border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-400 font-heading text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Ticket Pass</th>
                <th className="px-6 py-4">Price ({siteConfig.currency})</th>
                <th className="px-6 py-4">Description & Inclusions</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-navy-800">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400 dark:text-slate-500">
                    No tickets configured yet. Click "Add Ticket" to create one.
                  </td>
                </tr>
              ) : (
                tickets.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-ocean-50 dark:bg-navy-700 text-ocean-700 dark:text-aqua-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          <Ticket className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-ocean-950 dark:text-white font-heading">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-ocean-950 dark:text-white text-base font-heading">
                      {siteConfig.currency} {item.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-md">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-ocean-700 dark:hover:text-aqua-300 hover:bg-ocean-50 dark:hover:bg-navy-700 transition-colors border border-transparent hover:border-ocean-100 dark:hover:border-slate-600"
                        title="Edit Ticket"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => promptDelete(item)}
                        className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-navy-700 transition-colors border border-transparent hover:border-rose-100 dark:hover:border-slate-600"
                        title="Delete Ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Ticket' : 'Add Ticket'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Ticket Name"
            placeholder="e.g. Adult Day Pass"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label={`Price (${siteConfig.currency})`}
            type="number"
            step="1"
            min="1"
            placeholder="e.g. 2500"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5 font-heading">
              Description & Inclusions
            </label>
            <textarea
              rows={3}
              placeholder="Detail age restrictions, locker access, ride inclusions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-aqua-400 font-sans"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={saving}>
              {editingItem ? 'Save Changes' : 'Add Ticket'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Ticket"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 text-rose-900 dark:text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold font-heading">Confirm Ticket Deletion</p>
              <p className="text-rose-700 dark:text-rose-300 mt-1">
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-rose-950 dark:text-white">"{deletingItem?.name}"</span>?
                Park guests will no longer be able to select this ticket for online reservations.
              </p>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Keep Ticket
            </Button>
            <Button variant="danger" size="md" onClick={handleDelete} isLoading={deleting}>
              Delete Ticket
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
