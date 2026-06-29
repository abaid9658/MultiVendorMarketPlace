import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const QuotationModal = ({ quotation, onClose, onSuccess }) => {
  const isEdit = Boolean(quotation);
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    title: quotation?.title || '',
    description: quotation?.description || '',
    vendor: quotation?.vendor?._id || quotation?.vendor || '',
    amount: quotation?.amount || '',
    submissionDate: quotation?.submissionDate ? quotation.submissionDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    expirationDate: quotation?.expirationDate ? quotation.expirationDate.slice(0, 10) : '',
    status: quotation?.status || 'pending',
    notes: quotation?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/vendors?limit=100').then((res) => setVendors(res.data.data)).catch(() => { });
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.vendor) errs.vendor = 'Vendor is required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Valid amount is required';
    if (!form.submissionDate) errs.submissionDate = 'Submission date is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/quotations/${quotation._id}`, form);
        toast.success('Quotation updated');
      } else {
        await api.post('/quotations', form);
        toast.success('Quotation created');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving quotation');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = ['draft', 'pending', 'active', 'in_review', 'approved', 'rejected'];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex justify-between items-center p-lg border-b border-outline-variant">
          <div className="flex items-center gap-sm">
            <span className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary text-[19px]">{isEdit ? 'edit_document' : 'request_quote'}</span>
            </span>
            <h2 className="text-headline-sm font-bold text-primary">{isEdit ? 'Edit Quotation' : 'Create New RFQ'}</h2>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary p-xs rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-lg flex flex-col gap-md">
          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">QUOTATION TITLE *</label>
            <input
              type="text"
              className={`input-field ${errors.title ? 'border-error' : ''}`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Office Supplies Q3 2025"
            />
            {errors.title && <p className="text-error text-body-sm mt-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.title}</p>}
          </div>

          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">DESCRIPTION *</label>
            <textarea
              className={`input-field resize-none ${errors.description ? 'border-error' : ''}`}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detailed description of the quotation request..."
            />
            {errors.description && <p className="text-error text-body-sm mt-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.description}</p>}
          </div>

          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">ASSIGN VENDOR *</label>
            <select
              className={`input-field ${errors.vendor ? 'border-error' : ''}`}
              value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}
            >
              <option value="">Select a vendor...</option>
              {vendors.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.companyName} ({v.vendorName})
                </option>
              ))}
            </select>
            {errors.vendor && <p className="text-error text-body-sm mt-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.vendor}</p>}
          </div>

          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">QUOTED AMOUNT (USD) *</label>
            <div className="relative">
              <span className="absolute left-md top-1/2 -translate-y-1/2 text-outline font-mono text-body-md">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className={`input-field pl-[28px] ${errors.amount ? 'border-error' : ''}`}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="text-error text-body-sm mt-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.amount}</p>}
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="text-label-md text-on-surface-variant block mb-xs">SUBMISSION DATE *</label>
              <input
                type="date"
                className={`input-field ${errors.submissionDate ? 'border-error' : ''}`}
                value={form.submissionDate}
                onChange={(e) => setForm({ ...form, submissionDate: e.target.value })}
              />
              {errors.submissionDate && <p className="text-error text-body-sm mt-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.submissionDate}</p>}
            </div>
            <div>
              <label className="text-label-md text-on-surface-variant block mb-xs">EXPIRATION DATE</label>
              <input
                type="date"
                className="input-field"
                value={form.expirationDate}
                onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">STATUS</label>
            <select
              className="input-field"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-label-md text-on-surface-variant block mb-xs">NOTES (OPTIONAL)</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-sm pt-sm">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-xs">
              {loading ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">{isEdit ? 'save' : 'send'}</span>
              )}
              {loading ? 'Saving...' : isEdit ? 'Update RFQ' : 'Submit RFQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotationModal;