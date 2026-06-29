import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { exportQuotationPDF } from '../utils/pdf';

const STATUS_CONFIG = {
  draft: 'badge-draft',
  pending: 'badge-pending',
  active: 'badge-active',
  in_review: 'badge-in_review',
  approved: 'badge-approved',
  rejected: 'badge-rejected',
};

const ComparisonPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searched, setSearched] = useState(false);

  const handleCompare = async (e) => {
    e?.preventDefault();
    if (!searchTitle.trim()) { toast.error('Enter a quotation title to compare'); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get('/quotations/compare', { params: { title: searchTitle } });
      setQuotations(res.data.data);
      if (res.data.data.length === 0) toast('No quotations found with that title', { icon: 'ℹ️' });
    } catch {
      toast.error('Failed to fetch comparison data');
    } finally {
      setLoading(false);
    }
  };

  // Load all by default
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await api.get('/quotations/compare');
        setQuotations(res.data.data);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const cheapest = quotations.length > 1 ? quotations[0] : null;

  return (
    <div className="flex flex-col gap-lg animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-headline-md font-bold text-primary">Quotation Comparison</h2>
        <p className="text-body-md text-on-surface-variant">Compare vendor quotations side-by-side and identify the best value proposal.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleCompare} className="card flex flex-col sm:flex-row gap-md">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            type="text"
            className="input-field pl-[44px]"
            placeholder="Filter by quotation title (e.g. 'Office Supplies')..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary flex items-center gap-xs whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
          Compare
        </button>
        {searched && (
          <button
            type="button"
            onClick={() => { setSearchTitle(''); setSearched(false); window.location.reload(); }}
            className="btn-secondary flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            Clear
          </button>
        )}
      </form>

      {/* Summary Banner */}
      {quotations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
          <div className="card text-center">
            <p className="text-label-md text-on-surface-variant">Total Proposals</p>
            <h3 className="text-headline-lg font-bold text-primary">{quotations.length}</h3>
          </div>
          <div className="card text-center">
            <p className="text-label-md text-on-surface-variant">Lowest Bid</p>
            <h3 className="text-headline-md font-bold text-green-600">
              {cheapest ? `$${Number(cheapest.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
            </h3>
            {cheapest && <p className="text-code-sm text-outline mt-xs">{cheapest.vendor?.companyName}</p>}
          </div>
          <div className="card text-center">
            <p className="text-label-md text-on-surface-variant">Highest Bid</p>
            <h3 className="text-headline-md font-bold text-error">
              {quotations.length > 0 ? `$${Number(quotations[quotations.length - 1].amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
            </h3>
            {quotations.length > 0 && <p className="text-code-sm text-outline mt-xs">{quotations[quotations.length - 1].vendor?.companyName}</p>}
          </div>
        </div>
      )}

      {/* Comparison Cards */}
      {loading ? (
        <div className="flex justify-center py-2xl">
          <span className="material-symbols-outlined text-[48px] animate-spin text-secondary">progress_activity</span>
        </div>
      ) : quotations.length === 0 ? (
        <div className="card flex flex-col items-center py-2xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[60px] opacity-20 mb-md">compare_arrows</span>
          <p className="text-body-lg font-semibold">No quotations to compare</p>
          <p className="text-body-md opacity-70 mt-xs">Create quotations for the same project and assign to different vendors</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {quotations.map((q, index) => {
            const isCheapest = q.isCheapest && quotations.length > 1;
            const savings = quotations.length > 1
              ? Number(quotations[quotations.length - 1].amount) - Number(q.amount)
              : 0;

            return (
              <div
                key={q._id}
                className={`card relative transition-all hover:shadow-lg ${
                  isCheapest ? 'border-green-400 ring-2 ring-green-200' : 'hover:border-secondary'
                }`}
              >
                {/* Rank badge */}
                <div className="absolute -top-3 left-lg">
                  <span className={`text-label-md px-sm py-xs rounded-full font-bold ${
                    index === 0 ? 'bg-green-500 text-white' :
                    index === 1 ? 'bg-secondary text-on-secondary' :
                    'bg-surface-container text-on-surface-variant'
                  }`}>
                    #{index + 1}
                    {isCheapest ? ' Best Value' : ''}
                  </span>
                </div>

                {isCheapest && (
                  <div className="absolute -top-3 right-lg">
                    <span className="bg-green-500 text-white text-label-md px-sm py-xs rounded-full flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[14px]">emoji_events</span>
                      Recommended
                    </span>
                  </div>
                )}

                <div className="pt-sm">
                  {/* Vendor info */}
                  <div className="flex items-center gap-md mb-md">
                    <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-body-lg flex-shrink-0">
                      {(q.vendor?.companyName || 'V').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-body-md font-bold text-primary">{q.vendor?.companyName || 'Unknown'}</p>
                      <p className="text-code-sm text-outline">{q.vendor?.vendorName}</p>
                      <p className="text-code-sm text-outline">{q.vendor?.email}</p>
                    </div>
                  </div>

                  {/* Title + RFQ */}
                  <h4 className="text-body-md font-semibold text-primary mb-xs">{q.title}</h4>
                  <p className="font-mono text-code-sm text-secondary mb-sm">{q.rfqId}</p>
                  <p className="text-body-sm text-on-surface-variant mb-md line-clamp-2">{q.description}</p>

                  {/* Amount — highlighted */}
                  <div className={`rounded-xl p-md mb-md ${isCheapest ? 'bg-green-50 border border-green-200' : 'bg-surface-container-low'}`}>
                    <p className="text-label-md text-on-surface-variant mb-xs">Quoted Amount</p>
                    <p className={`text-headline-md font-bold ${isCheapest ? 'text-green-600' : 'text-primary'}`}>
                      ${Number(q.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    {isCheapest && savings > 0 && (
                      <p className="text-body-sm text-green-600 mt-xs font-medium">
                        Saves ${savings.toLocaleString('en-US', { minimumFractionDigits: 2 })} vs highest bid
                      </p>
                    )}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-sm mb-md">
                    <div>
                      <p className="text-label-md text-outline mb-xs">Status</p>
                      <span className={STATUS_CONFIG[q.status] || 'badge-draft'}>{q.status?.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-label-md text-outline mb-xs">Submitted</p>
                      <p className="text-body-sm">{new Date(q.submissionDate).toLocaleDateString()}</p>
                    </div>
                    {q.expirationDate && (
                      <div className="col-span-2">
                        <p className="text-label-md text-outline mb-xs">Expires</p>
                        <p className="text-body-sm">{new Date(q.expirationDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-sm">
                    <button
                      onClick={() => exportQuotationPDF(q)}
                      className="btn-secondary flex-1 flex items-center justify-center gap-xs text-body-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                      Export PDF
                    </button>
                    {q.vendor?.email && (
                      <a
                        href={`mailto:${q.vendor.email}?subject=Re: ${q.rfqId}`}
                        className="btn-secondary px-md flex items-center gap-xs text-body-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;
