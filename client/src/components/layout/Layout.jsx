import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import QuotationModal from '../quotations/QuotationModal';

const Layout = () => {
  const [showNewRFQ, setShowNewRFQ] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar onNewRFQ={() => setShowNewRFQ(true)} />
      <TopBar searchValue={search} onSearch={setSearch} />

      <main className="ml-[280px] pt-[64px] min-h-screen">
        <div className="p-lg max-w-[1400px] mx-auto">
          <Outlet context={{ search, setSearch }} />
        </div>
      </main>

      {showNewRFQ && (
        <QuotationModal
          onClose={() => setShowNewRFQ(false)}
          onSuccess={() => {
            setShowNewRFQ(false);
            navigate('/quotations');
          }}
        />
      )}
    </div>
  );
};

export default Layout;
