import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const StatusBadge = ({ status }) => {
  const map = {
    pending: 'badge-pending',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
    draft: 'badge-draft',
    active: 'badge-active',
    in_review: 'badge-in_review',
  };
  return <span className={map[status] || 'badge-draft'}>{status?.replace('_', ' ').toUpperCase()}</span>;
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, actRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/activities?limit=8'),
      ]);
      setStats(statsRes.data.data);
      setActivities(actRes.data.data);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Real-time updates
  useEffect(() => {
    if (!socket) return;
    socket.on('stats_update', fetchData);
    socket.on('new_activity', (activity) => {
      setActivities((prev) => [activity, ...prev.slice(0, 7)]);
    });
    return () => {
      socket.off('stats_update', fetchData);
      socket.off('new_activity');
    };
  }, [socket, fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-md text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] animate-spin text-secondary">progress_activity</span>
          <p className="text-body-md">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Build chart data (last 6 months)
  const now = new Date();
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const found = stats?.monthlyData?.find(
      (m) => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1
    );
    return { month: MONTHS[d.getMonth()], total: found?.total || 0, approved: found?.approved || 0 };
  });
  const maxVal = Math.max(...chartData.map((d) => d.total), 1);

  const statCards = [
    {
      label: 'Total Vendors',
      value: stats?.totalVendors ?? 0,
      icon: 'group',
      iconBg: 'bg-tertiary-fixed',
      iconColor: 'text-on-tertiary-fixed',
      bar: 'bg-secondary',
      barWidth: stats?.totalVendors ? Math.min(100, (stats.activeVendors / Math.max(stats.totalVendors, 1)) * 100) : 0,
      trend: null,
    },
    {
      label: 'Active Quotations',
      value: stats?.activeQuotations ?? 0,
      icon: 'pending_actions',
      iconBg: 'bg-primary-fixed',
      iconColor: 'text-on-primary-fixed',
      bar: 'bg-primary',
      barWidth: stats?.totalQuotations ? Math.min(100, (stats.activeQuotations / stats.totalQuotations) * 100) : 0,
      trend: null,
    },
    {
      label: 'Pending Quotations',
      value: stats?.pendingQuotations ?? 0,
      icon: 'hourglass_empty',
      iconBg: 'bg-secondary-fixed',
      iconColor: 'text-on-secondary-fixed',
      bar: 'bg-secondary-container',
      barWidth: stats?.totalQuotations ? Math.min(100, (stats.pendingQuotations / stats.totalQuotations) * 100) : 0,
      trend: null,
    },
    {
      label: 'Approved Quotations',
      value: stats?.approvedQuotations ?? 0,
      icon: 'verified',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-700',
      bar: 'bg-green-500',
      barWidth: stats?.totalQuotations ? Math.min(100, (stats.approvedQuotations / stats.totalQuotations) * 100) : 0,
      trend: null,
    },
  ];

  return (
    <div className="flex flex-col gap-lg animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-headline-md font-bold text-primary">System Overview</h2>
          <p className="text-body-md text-on-surface-variant">Real-time procurement performance and vendor metrics.</p>
        </div>
        <div className="flex gap-sm">
          <button className="flex items-center gap-xs bg-surface-container-lowest border border-outline-variant px-md py-sm rounded-lg text-label-md hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Last 30 Days
          </button>
          <button
            onClick={() => toast.success('Report generation coming soon!')}
            className="flex items-center gap-xs bg-secondary text-on-secondary px-md py-sm rounded-lg text-label-md hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {statCards.map(({ label, value, icon, iconBg, iconColor, bar, barWidth }) => (
          <div key={label} className="stat-card group hover:shadow-md">
            <div className="flex justify-between items-start mb-md">
              <div className={`p-sm ${iconBg} rounded-lg ${iconColor}`}>
                <span className="material-symbols-outlined text-[22px]">{icon}</span>
              </div>
              <span className="text-on-surface-variant text-label-md bg-surface-container px-xs rounded font-mono">
                LIVE
              </span>
            </div>
            <p className="text-label-md text-on-surface-variant">{label}</p>
            <h3 className="text-headline-lg font-bold text-primary mt-xs">{value}</h3>
            <div className="mt-md w-full bg-surface-container h-1 rounded-full overflow-hidden">
              <div className={`${bar} h-full rounded-full transition-all duration-700`} style={{ width: `${barWidth}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Bar Chart */}
        <div className="lg:col-span-2 card flex flex-col gap-lg min-h-[360px]">
          <div className="flex justify-between items-center">
            <h4 className="text-headline-sm font-bold text-primary">Quotation Flow</h4>
            <div className="flex gap-md">
              <div className="flex items-center gap-xs">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="text-label-md text-on-surface-variant">Submitted</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
                <span className="text-label-md text-on-surface-variant">Approved</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-end gap-md pt-lg relative">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-rows-4 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-t border-outline-variant/30 w-full" />
              ))}
            </div>

            {chartData.map(({ month, total, approved }) => (
              <div key={month} className="flex-1 flex flex-col justify-end items-center gap-xs group/bar relative">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-body-sm px-sm py-xs rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {total} submitted, {approved} approved
                </div>

                <div className="w-full flex gap-xs justify-center items-end h-[200px]">
                  {/* Submitted */}
                  <div
                    className="flex-1 max-w-[20px] bg-secondary/30 rounded-t-md group-hover/bar:bg-secondary/50 transition-all duration-300"
                    style={{ height: `${(total / maxVal) * 100}%`, minHeight: total > 0 ? '4px' : '0' }}
                  />
                  {/* Approved */}
                  <div
                    className="flex-1 max-w-[20px] bg-green-300 rounded-t-md group-hover/bar:bg-green-400 transition-all duration-300"
                    style={{ height: `${(approved / maxVal) * 100}%`, minHeight: approved > 0 ? '4px' : '0' }}
                  />
                </div>
                <span className="font-mono text-code-sm text-outline">{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card flex flex-col">
          <div className="flex justify-between items-center mb-lg">
            <h4 className="text-headline-sm font-bold text-primary">Recent Activity</h4>
            <button className="text-secondary text-label-md hover:underline">View All</button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-md pr-xs">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-xl text-on-surface-variant">
                <span className="material-symbols-outlined text-[40px] mb-sm opacity-40">history</span>
                <p className="text-body-sm">No recent activity</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div key={activity._id} className="flex gap-md relative">
                  {index < activities.length - 1 && (
                    <div className="absolute left-[15px] top-10 bottom-[-16px] w-px bg-outline-variant/50" />
                  )}
                  <div className={`z-10 ${activity.iconBg || 'bg-secondary-fixed'} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined text-[16px] ${activity.iconColor || 'text-secondary'}`}>
                      {activity.icon || 'info'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-semibold text-primary">{activity.action?.replace(/_/g, ' ')}</p>
                    <p className="text-body-sm text-on-surface-variant line-clamp-2">{activity.description}</p>
                    <p className="font-mono text-code-sm text-outline mt-xs">
                      {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' · '}
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Priority Quotations Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center">
          <h4 className="text-headline-sm font-bold text-primary">Priority Quotations</h4>
          <div className="flex gap-sm">
            <button className="btn-secondary text-label-md px-md py-xs">Filter</button>
            <button className="btn-secondary text-label-md px-md py-xs">Sort</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                {['Vendor Name', 'RFQ ID', 'Quoted Amount', 'Status', 'Expiration', 'Action'].map((h) => (
                  <th key={h} className="p-md text-label-md text-outline">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {(stats?.priorityQuotations || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-xl text-center text-on-surface-variant text-body-md">
                    No active quotations yet.{' '}
                    <a href="/quotations" className="text-secondary hover:underline">Create one →</a>
                  </td>
                </tr>
              ) : (
                stats.priorityQuotations.map((q) => {
                  const initials = (q.vendor?.companyName || 'V').slice(0, 2).toUpperCase();
                  return (
                    <tr key={q._id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="p-md">
                        <div className="flex items-center gap-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-[12px] flex-shrink-0">
                            {initials}
                          </div>
                          <span className="text-body-md text-primary font-semibold">{q.vendor?.companyName || '-'}</span>
                        </div>
                      </td>
                      <td className="p-md font-mono text-code-sm text-on-surface-variant">{q.rfqId}</td>
                      <td className="p-md font-mono text-code-sm text-primary font-semibold">
                        ${Number(q.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-md"><StatusBadge status={q.status} /></td>
                      <td className="p-md text-body-sm text-on-surface-variant">
                        {q.expirationDate ? new Date(q.expirationDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-md">
                        <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                          more_vert
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-md bg-surface-container-low text-center">
          <a href="/quotations" className="text-secondary text-label-md hover:underline">View Full Pipeline →</a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
