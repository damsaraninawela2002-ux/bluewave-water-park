import React, { useEffect, useState } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  AlertTriangle,
} from 'lucide-react';
import { contactService } from '../../services/contactService';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import FullPageLoader from '../../components/Loader';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'new' | 'read'

  // View modal state
  const [viewTarget, setViewTarget] = useState(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllMessages();
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to load contact messages:', err);
      toast.error('Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleOpenMessage = async (msg) => {
    setViewTarget(msg);
    if (msg.status === 'new') {
      try {
        const updated = await contactService.markAsRead(msg.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
        );
        setViewTarget(updated);
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await contactService.deleteMessage(deleteTarget.id);
      toast.success('Inquiry deleted successfully.');
      setDeleteTarget(null);
      if (viewTarget?.id === deleteTarget.id) setViewTarget(null);
      await loadMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
      toast.error(err.response?.data?.detail || 'Failed to delete message.');
    } finally {
      setDeleting(false);
    }
  };

  const unreadCount = messages.filter((m) => m.status === 'new').length;

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <FullPageLoader text="Loading guest inquiries..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-50 dark:bg-ocean-950 text-ocean-700 dark:text-aqua-300 border border-ocean-200/80 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider mb-2 font-heading">
            <Mail className="w-3.5 h-3.5 text-aqua-600 dark:text-aqua-400" />
            <span>Customer Inquiries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ocean-950 dark:text-white font-heading tracking-tight">
            Guest Messages
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review incoming inquiries, corporate booking requests, and visitor questions.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold font-heading shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{unreadCount} Unread {unreadCount === 1 ? 'Message' : 'Messages'}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-navy-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-soft">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, subject, or message content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-navy-850 focus:outline-none focus:ring-2 focus:ring-ocean-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-xs font-bold text-slate-400 font-heading uppercase mr-1">Status:</span>
          {[
            { key: 'all', label: `All (${messages.length})` },
            { key: 'new', label: `New (${unreadCount})` },
            { key: 'read', label: 'Read' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-heading transition ${
                statusFilter === tab.key
                  ? 'bg-ocean-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Table Card */}
      <Card className="p-0 overflow-hidden border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-navy-800 shadow-soft">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
            No contact messages found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/70 dark:bg-navy-900/80 border-b border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-400 font-heading text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Sender</th>
                  <th className="px-6 py-3.5">Subject</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-navy-800">
                {filtered.map((msg) => {
                  const isNew = msg.status === 'new';
                  return (
                    <tr
                      key={msg.id}
                      className={`hover:bg-slate-50/60 dark:hover:bg-navy-750 transition-colors ${
                        isNew ? 'bg-ocean-50/30 dark:bg-navy-850/50 font-medium' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isNew ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>New</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                            <MailOpen className="w-3 h-3 text-slate-400" />
                            <span>Read</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-ocean-950 dark:text-white font-heading block">
                          {msg.name}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                          {msg.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        <p className="text-slate-800 dark:text-slate-200 font-semibold truncate">
                          {msg.subject}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {msg.message}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenMessage(msg)}
                            className="p-2 rounded-xl text-ocean-600 dark:text-aqua-400 hover:bg-ocean-50 dark:hover:bg-navy-700 transition"
                            title="View Message"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(msg)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                            title="Delete Message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* View Message Modal */}
      <Modal
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Visitor Inquiry Details"
      >
        {viewTarget && (
          <div className="space-y-5">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-100 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
                  Sender Details
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {viewTarget.createdAt ? new Date(viewTarget.createdAt).toLocaleString() : ''}
                </span>
              </div>
              <p className="text-sm font-bold text-ocean-950 dark:text-white font-heading">
                {viewTarget.name}
              </p>
              <a
                href={`mailto:${viewTarget.email}`}
                className="text-xs text-ocean-600 dark:text-aqua-400 font-mono hover:underline block"
              >
                {viewTarget.email}
              </a>
            </div>

            {/* Subject */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading mb-1">
                Subject
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                {viewTarget.subject}
              </p>
            </div>

            {/* Message Body */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading mb-1">
                Inquiry Message
              </span>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-100 dark:border-slate-700/80 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {viewTarget.message}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={`mailto:${viewTarget.email}?subject=Re: ${encodeURIComponent(viewTarget.subject)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white text-xs font-bold font-heading shadow-xs transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(viewTarget)}
                  className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-bold font-heading transition"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setViewTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold font-heading hover:bg-slate-100 dark:hover:bg-navy-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Inquiry Message"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
            <p>
              Are you sure you want to delete the message from{' '}
              <strong>{deleteTarget?.name}</strong> regarding "{deleteTarget?.subject}"?
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
            >
              {deleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
