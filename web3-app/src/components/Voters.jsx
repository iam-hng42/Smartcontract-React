import { useState } from 'react';
import { explorer } from '../Blockchain.services';
import { truncate } from '../store';
export default function Voters({ voters, error }) {
  const [filter, setFilter] = useState('all');
  const list = (voters || []).filter((v) => filter === 'all' || (filter === 'yes' ? v.choosen : !v.choosen));
  return <section className="panel voters"><div className="section-heading"><h2>Danh sách người bỏ phiếu</h2><div className="tabs">{[['all','Tất cả'],['yes','Đồng ý'],['no','Từ chối']].map(([id,label]) => <button key={id} onClick={() => setFilter(id)} className={filter === id ? 'selected' : ''}>{label}</button>)}</div></div>{error ? <div className="notice error">{error}</div> : voters === null ? <p>Đang tải…</p> : !list.length ? <p className="muted">Chưa có phiếu trong nhóm này.</p> : <div className="table-scroll"><table><thead><tr><th>Ví thành viên</th><th>Thời gian</th><th>Lựa chọn</th></tr></thead><tbody>{list.map((v) => <tr key={v.voter}><td><a title={v.voter} href={explorer('address', v.voter)} target="_blank" rel="noreferrer">{truncate(v.voter)} ↗</a></td><td>{new Date(v.timestamp * 1000).toLocaleString('vi-VN')}</td><td><span className={`badge ${v.choosen ? 'passed' : 'not-passed'}`}>{v.choosen ? 'Accepted' : 'Rejected'}</span></td></tr>)}</tbody></table></div>}</section>;
}
