import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const VendorModal = ({ vendor, onClose, onSuccess }) => {
  const isEdit = Boolean(vendor);
  const [form, setForm] = useState({
    vendorName: vendor?.vendorName || '',
    companyName: vendor?.companyName || '',
    email: vendor?.email || '',
    contactNumber: vendor?.contactNumber || '',
    businessAddress: vendor?.businessAddress || '',
    status: vendor?.status || 'active',
    notes: vendor?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.vendorName.trim()) errs.vendorName = 'Vendor name is required';
    if (!form.companyName.trim()) errs.companyName = 'Company name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.contactNumber.trim()) errs.contactNumber = 'Contact number is required';
    if (!form.businessAddress.trim()) errs.businessAddress = 'Business address is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/vendors/${vendor._id}`, form);
        toast.success('Vendor updated successfully');
      } else {
        await api.post('/vendors', form);
        toast.success('Vendor added successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex justify-between items-center p-lg border-b border-outline-variant">
          <div className="flex items-center gap-sm">
            <span className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary text-[19px]">{isEdit ? 'edit' : 'add_business'}</span>
            </span>
            <h2 className="text-headline-sm font-bold text-primary">{isEdit ? 'Edit Vendor' : 'Add New Vendor'}</h2>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary p-xs rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-lg flex flex-col gap-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div>
              <label className="text-label-md text-on-surface-variant block mb-xs">VENDOR NAME *</label>
              <input
                type="text"
                className={`input-field ${errors.vendorName ? 'border-error' : ''}`}
                value={form.vendorName}
                onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
                placeholder="John Doe"
              />
              {errors.vendorName && <p className="text-error text-body-sm mt-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.vendorName}</p>}
            </div>

            <div>
              <label className="text-label-md text-on-surface-variant block mb-xs">COMPANY NAME *</label>
              <input
                type="text"
                className={`input-field ${errors.companyName ? 'border-error' : ''}`}
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="Acme Corp"
              />
              {errors.companyName && <p className="text-error text-body-sm mt-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.companyName}</p>}
            </div>
          </div>

          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">EMAIL ADDRESS *</label>
            <input
              type="email"
              className={`input-field ${errors.email ? 'border-error' : ''}`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contact@vendor.com"
            />
            {errors.email && <p className="text-error text-body-sm mt-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.email}</p>}
          </div>

          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">CONTACT NUMBER *</label>
            <input
              type="text"
              className={`input-field ${errors.contactNumber ? 'border-error' : ''}`}
              value={form.contactNumber}
              onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />
            {errors.contactNumber && <p className="text-error text-body-sm mt-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.contactNumber}</p>}
          </div>

          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">BUSINESS ADDRESS *</label>
            <input
              type="text"
              className={`input-field ${errors.businessAddress ? 'border-error' : ''}`}
              value={form.businessAddress}
              onChange={(e) => setForm({ ...form, businessAddress: e.target.value })}
              placeholder="123 Main St, City, Country"
            />
            {errors.businessAddress && <p className="text-error text-body-sm mt-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.businessAddress}</p>}
          </div>

          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">STATUS</label>
            <select
              className="input-field"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">NOTES (OPTIONAL)</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Additional notes about this vendor..."
            />
          </div>

          <div className="flex gap-sm pt-sm">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-xs">
              {loading ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">save</span>
              )}
              {loading ? 'Saving...' : isEdit ? 'Update Vendor' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorModal;