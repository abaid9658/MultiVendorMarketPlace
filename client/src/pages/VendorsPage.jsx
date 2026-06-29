import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import VendorModal from '../components/vendors/VendorModal';

const StatusBadge = ({ status }) => (
  <span className={status === 'active' ? 'badge-active' : 'badge-draft'}>
    {status?.toUpperCase()}
  </span>
);

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchVendors = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/vendors', {
        params: { search, status: statusFilter, page, limit: 10 },
      });
      setVendors(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchVendors(1), 300);
    return () => clearTimeout(timer);
  }, [fetchVendors]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/vendors/${id}`);
      toast.success('Vendor deleted');
      setDeleteConfirm(null);
      fetchVendors();
    } catch {
      toast.error('Failed to delete vendor');
    }
  };

  const initials = (name) => name?.slice(0, 2).toUpperCase() || 'V';
  const colors = ['bg-secondary', 'bg-tertiary-container', 'bg-primary-container', 'bg-green-700', 'bg-blue-600', 'bg-purple-700'];
  const getColor = (str) => colors[(str?.charCodeAt(0) || 0) % colors.length];

  return (
    <div className="flex flex-col gap-lg animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-headline-md font-bold text-primary">Vendor Directory</h2>
          <p className="text-body-md text-on-surface-variant">{pagination.total} vendors registered</p>
        </div>
        <button
          onClick={() => { setEditVendor(null); setShowModal(true); }}
          className="btn-primary flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="card flex flex-col sm:flex-row gap-md">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            type="text"
            className="input-field pl-[44px]"
            placeholder="Search by name, company, email..."
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                {['Vendor', 'Company', 'Email', 'Contact', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="p-md text-label-md text-outline whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-xl text-center">
                    <span className="material-symbols-outlined text-[36px] animate-spin text-secondary">progress_activity</span>
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-xl text-center">
                    <div className="flex flex-col items-center gap-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[48px] opacity-30">factory</span>
                      <p className="text-body-md">No vendors found</p>
                      <button
                        onClick={() => { setEditVendor(null); setShowModal(true); }}
                        className="btn-primary mt-sm"
                      >
                        Add First Vendor
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                vendors.map((v) => (
                  <tr key={v._id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="p-md">
                      <div className="flex items-center gap-sm">
                        <div className={`w-9 h-9 rounded-lg ${getColor(v.vendorName)} text-white flex items-center justify-center font-bold text-[12px] flex-shrink-0`}>
                          {initials(v.vendorName)}
                        </div>
                        <div>
                          <p className="text-body-md font-semibold text-primary">{v.vendorName}</p>
                          <p className="text-code-sm text-outline">{v.businessAddress.slice(0, 25)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-md text-body-md text-primary">{v.companyName}</td>
                    <td className="p-md text-body-sm text-on-surface-variant">{v.email}</td>
                    <td className="p-md font-mono text-code-sm text-on-surface-variant">{v.contactNumber}</td>
                    <td className="p-md"><StatusBadge status={v.status} /></td>
                    <td className="p-md text-body-sm text-on-surface-variant">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-md">
                      <div className="flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditVendor(v); setShowModal(true); }}
                          className="p-xs text-on-surface-variant hover:text-secondary hover:bg-secondary-fixed/30 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(v)}
                          className="p-xs text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-md bg-surface-container-low flex items-center justify-between">
            <p className="text-body-sm text-on-surface-variant">
              Showing {vendors.length} of {pagination.total} vendors
            </p>
            <div className="flex gap-sm">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchVendors(p)}
                  className={`w-8 h-8 rounded-lg text-body-sm transition-colors ${
                    p === pagination.page
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vendor Modal */}
      {showModal && (
        <VendorModal
          vendor={editVendor}
          onClose={() => { setShowModal(false); setEditVendor(null); }}
          onSuccess={() => { setShowModal(false); setEditVendor(null); fetchVendors(); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box max-w-sm">
            <div className="p-lg flex flex-col items-center text-center gap-md">
              <div className="w-14 h-14 bg-error-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-[28px]">delete_forever</span>
              </div>
              <h3 className="text-headline-sm font-bold">Delete Vendor?</h3>
              <p className="text-body-md text-on-surface-variant">
                Are you sure you want to remove <strong>{deleteConfirm.companyName}</strong>? This action cannot be undone.
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

export default VendorsPage;
