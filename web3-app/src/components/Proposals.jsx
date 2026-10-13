import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState, truncate, statusOf, remaining } from '../store';

export default function Proposals() {
  const [proposals] = useGlobalState('proposals');
  const [blockTime] = useGlobalState('blockTime');
  const [snapshot] = useGlobalState('snapshotBlock');
  const [filter, setFilter] = useState('all');
  const list = proposals.filter((p) => filter === 'all' || (filter === 'open' ? statusOf(p, blockTime) === 'Pending' : statusOf(p, blockTime) !== 'Pending'));
  return <section className="proposal-section"><div className="section-heading"><div><span className="eyebrow">CỘNG ĐỒNG QUYẾT ĐỊNH</span><h2>Các đề xuất <span className="count">{proposals.length}</span></h2></div><div className="tabs" role="group" aria-label="Lọc đề xuất">{[['all','Tất cả'],['open','Đang mở'],['closed','Đã đóng']].map(([id,label]) => <button key={id} className={filter === id ? 'selected' : ''} onClick={() => setFilter(id)}>{label}</button>)}</div></div>
    {!list.length ? <div className="empty"><span className="empty-symbol">↗</span><h3>{snapshot ? 'Chưa có đề xuất trong danh sách này' : 'Kết nối để xem hoạt động của quỹ'}</h3><p>{snapshot ? 'Stakeholder có thể tạo đề xuất đầu tiên cho cả nhóm.' : 'Dữ liệu thật sẽ xuất hiện sau khi cấu hình contract và kết nối ví Sepolia.'}</p></div> : <div className="proposal-grid">{list.map((p) => { const status = statusOf(p, blockTime); return <article className="proposal-card" key={p.id}><div className="card-top"><span className="proposal-id">ĐỀ XUẤT #{p.id}</span><span className={`badge ${status.replace(' ', '-').toLowerCase()}`}>{status}</span></div><h3><Link to={`/proposal/${p.id}`}>{p.title}</Link></h3><p className="description">{p.description}</p><div className="proposal-amount">{p.amount}<small> ETH</small></div><div className="vote-summary"><span>✓ {p.upvotes} đồng ý</span><span>× {p.downvotes} từ chối</span></div><div className="card-meta"><span>Tạo bởi {truncate(p.proposer)}</span><span>{remaining(p.duration, blockTime)}</span></div><Link className="card-link" to={`/proposal/${p.id}`}>Xem đề xuất & thao tác <span>↗</span></Link></article>; })}</div>}
  </section>;
}
