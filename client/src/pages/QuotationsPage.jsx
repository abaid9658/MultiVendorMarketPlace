import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import QuotationModal from '../components/quotations/QuotationModal';
import { exportQuotationPDF } from '../utils/pdf';

const STATUS_CONFIG = {
  draft: { label: 'DRAFT', cls: 'badge-draft' },
  pending: { label: 'PENDING', cls: 'badge-pending' },
  active: { label: 'ACTIVE', cls: 'badge-active' },
  in_review: { label: 'IN REVIEW', cls: 'badge-in_review' },
  approved: { label: 'APPROVED', cls: 'badge-approved' },
  rejected: { label: 'REJECTED', cls: 'badge-rejected' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return <span className={cfg.cls}>{cfg.label}</span>;
};

const QuotationsPage = () => {
  const [searchParams] = useSearchParams();
  const [quotations, setQuotations] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(searchParams.get('new') === 'true');
  const [editQuotation, setEditQuotation] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);

  const fetchQuotations = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/quotations', {
        params: { search, status: statusFilter, page, limit: 10 },
      });
      setQuotations(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load quotations');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchQuotations(1), 300);
    return () => clearTimeout(timer);
  }, [fetchQuotations]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/quotations/${id}`, { status });
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
      setActionMenu(null);
      fetchQuotations();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/quotations/${id}`);
      toast.success('Quotation deleted');
      setDeleteConfirm(null);
      fetchQuotations();
    } catch {
      toast.error('Failed to delete quotation');
    }
  };

  const handleExportPDF = async (quotation) => {
    try {
      // Get full quotation with vendor details
      const res = await api.get(`/quotations/${quotation._id}`);
      exportQuotationPDF(res.data.data);
      toast.success('PDF exported!');
    } catch {
      toast.error('PDF export failed');
    }
  };

  return (
    <div className="flex flex-col gap-lg animate-fade-in" onClick={() => setActionMenu(null)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-md">
        <div>
          <h2 className="text-headline-md font-bold text-primary tracking-tight">Quotation Management</h2>
          <p className="text-body-md text-on-surface-variant mt-0.5">{pagination.total} quotations total</p>
        </div>
        <button
          onClick={() => { setEditQuotation(null); setShowModal(true); }}
          className="btn-primary flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New RFQ
        </button>
      </div>

      {/* Filters */}
      <div className="card flex flex-col sm:flex-row gap-md !py-md">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            type="text"
            className="input-field pl-[44px]"
            placeholder="Search by title, RFQ ID, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field w-full sm:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-sm">
        {Object.entries(STATUS_CONFIG).map(([status, { label, cls }]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
            className={`card !p-md text-center transition-all hover:border-secondary hover:shadow-card-hover ${statusFilter === status ? '!border-secondary ring-2 ring-secondary/15' : ''}`}
          >
            <span className={`${cls} text-[10px] mb-xs`}>{label}</span>
            <p className="text-headline-sm font-bold text-primary mt-1">
              {quotations.filter((q) => q.status === status).length}
            </p>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                {['RFQ ID', 'Title', 'Vendor', 'Amount', 'Status', 'Submission Date', 'Expiry', 'Actions'].map((h) => (
                  <th key={h} className="p-md text-label-md text-outline whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-xl text-center">
                    <span className="material-symbols-outlined text-[36px] animate-spin text-secondary">progress_activity</span>
                  </td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-2xl text-center">
                    <div className="flex flex-col items-center gap-sm text-on-surface-variant">
                      <div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center mb-xs">
                        <span className="material-symbols-outlined text-[32px] text-secondary">request_quote</span>
                      </div>
                      <p className="text-body-lg font-semibold text-primary">No quotations found</p>
                      <p className="text-body-sm opacity-70">Create your first RFQ to get started</p>
                      <button
                        onClick={() => { setEditQuotation(null); setShowModal(true); }}
                        className="btn-primary mt-sm"
                      >
                        Create First RFQ
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                quotations.map((q) => (
                  <tr key={q._id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="p-md font-mono text-code-sm text-secondary font-semibold">{q.rfqId}</td>
                    <td className="p-md">
                      <p className="text-body-md font-semibold text-primary max-w-[180px] truncate">{q.title}</p>
                      <p className="text-code-sm text-outline max-w-[180px] truncate">{q.description}</p>
                    </td>
                    <td className="p-md text-body-sm text-on-surface-variant">
                      {q.vendor?.companyName || '—'}
                    </td>
                    <td className="p-md font-mono text-code-sm text-primary font-semibold">
                      ${Number(q.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-md"><StatusBadge status={q.status} /></td>
                    <td className="p-md text-body-sm text-on-surface-variant whitespace-nowrap">
                      {new Date(q.submissionDate).toLocaleDateString()}
                    </td>
                    <td className="p-md text-body-sm text-on-surface-variant whitespace-nowrap">
                      {q.expirationDate ? new Date(q.expirationDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-md">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActionMenu(actionMenu === q._id ? null : q._id)}
                          className="p-xs text-outline hover:text-secondary hover:bg-secondary-container rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>

                        {actionMenu === q._id && (
                          <div className="absolute right-0 top-9 bg-white border border-outline-variant rounded-xl shadow-elevated z-20 w-52 animate-scale-in overflow-hidden">
                            <button
                              onClick={() => { setEditQuotation(q); setShowModal(true); setActionMenu(null); }}
                              className="flex items-center gap-sm px-md py-sm hover:bg-surface-container-low transition-colors w-full text-left text-body-sm"
                            >
                              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">edit</span> Edit
                            </button>
                            <button
                              onClick={() => handleExportPDF(q)}
                              className="flex items-center gap-sm px-md py-sm hover:bg-surface-container-low transition-colors w-full text-left text-body-sm"
                            >
                              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">picture_as_pdf</span> Export PDF
                            </button>
                            <div className="border-t border-outline-variant my-1" />
                            <p className="px-md py-xs text-label-md text-outline">Change Status</p>
                            {Object.entries(STATUS_CONFIG).map(([status, { label }]) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(q._id, status)}
                                disabled={q.status === status}
                                className="flex items-center gap-sm px-md py-sm hover:bg-surface-container-low transition-colors w-full text-left text-body-sm disabled:opacity-40"
                              >
                                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">radio_button_{q.status === status ? 'checked' : 'unchecked'}</span>
                                {label}
                              </button>
                            ))}
                            <div className="border-t border-outline-variant my-1" />
                            <button
                              onClick={() => { setDeleteConfirm(q); setActionMenu(null); }}
                              className="flex items-center gap-sm px-md py-sm hover:bg-error-container/40 text-error transition-colors w-full text-left text-body-sm"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="p-md bg-surface-container-low flex items-center justify-between border-t border-outline-variant">
            <p className="text-body-sm text-on-surface-variant">
              Showing {quotations.length} of {pagination.total} quotations
            </p>
            <div className="flex gap-xs">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchQuotations(p)}
                  className={`w-8 h-8 rounded-lg text-body-sm font-medium transition-colors ${p === pagination.page
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-white border border-outline-variant hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <QuotationModal
          quotation={editQuotation}
          onClose={() => { setShowModal(false); setEditQuotation(null); }}
          onSuccess={() => { setShowModal(false); setEditQuotation(null); fetchQuotations(); }}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box max-w-sm">
            <div className="p-lg flex flex-col items-center text-center gap-md">
              <div className="w-14 h-14 bg-error-container rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-[28px]">delete_forever</span>
              </div>
              <h3 className="text-headline-sm font-bold text-primary">Delete Quotation?</h3>
              <p className="text-body-md text-on-surface-variant">
                Delete <strong className="text-primary">{deleteConfirm.rfqId}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-sm w-full">
                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm._id)} className="btn-danger flex-1">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsPage;