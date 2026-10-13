import { useState } from 'react';
import { useGlobalState, setGlobalState } from '../store';
import { performContribute, errorMessage, SEPOLIA } from '../Blockchain.services';

export default function Banner({ onPropose }) {
  const [balance] = useGlobalState('balance');
  const [mine] = useGlobalState('mybalance');
  const [stakeholder] = useGlobalState('isStakeholder');
  const [proposals] = useGlobalState('proposals');
  const [blockTime] = useGlobalState('blockTime');
  const [account] = useGlobalState('connectedAccount');
  const [chain] = useGlobalState('chainId');
  const [configured] = useGlobalState('configured');
  const [busy] = useGlobalState('busy');
  const [snapshot] = useGlobalState('snapshotBlock');
  const [amount, setAmount] = useState('0.01');
  const available = account && configured && chain === SEPOLIA && snapshot;
  const contribute = async (e) => {
    e.preventDefault();
    try { await performContribute(amount); }
    catch (err) { setGlobalState('notice', { type: 'error', text: errorMessage(err) }); }
  };
  return <>
    <section className="hero"><div><div className="eyebrow">MỖI LÁ PHIẾU, MỘT QUYẾT ĐỊNH.</div><h1>Cùng góp quỹ.<br /><em>Cùng tạo giá trị.</em></h1><p>Một quỹ minh bạch trên blockchain. Góp vốn, đề xuất mục đích sử dụng và biểu quyết trước khi giải ngân.</p></div><div className="hero-aside"><div className="orbit"><span>DAO</span><i className="dot d1"/><i className="dot d2"/><i className="dot d3"/></div><div className="mini-label">ĐỒNG THUẬN TỪ CỘNG ĐỒNG</div></div></section>
    <section className="stats" aria-label="Thông tin quỹ"><div><span>Số dư quỹ DAO</span><strong>{snapshot ? balance : '—'} <small>ETH</small></strong><p>Sepolia ETH · tiền thử nghiệm</p></div><div><span>Bạn đã đóng góp</span><strong>{snapshot ? mine : '—'} <small>ETH</small></strong><p>{stakeholder ? '● Bạn là stakeholder' : 'Từ 0.01 ETH để có quyền biểu quyết'}</p></div><div><span>Đề xuất đang mở</span><strong>{snapshot ? proposals.filter((p) => p.duration > blockTime && !p.paid).length : '—'} <small>/ {snapshot ? proposals.length : '—'}</small></strong><p>Mỗi đợt biểu quyết kéo dài 5 phút</p></div></section>
    <section className="contribute panel"><div><h2>Tham gia quỹ chung</h2><p>Góp tổng cộng ít nhất 0.01 ETH để tạo đề xuất và bỏ phiếu.<br />Giữ lại ETH trong ví để trả phí gas.</p></div><form onSubmit={contribute}><label htmlFor="contribution">Số ETH đóng góp</label><div className="input-action"><div className="amount-input"><input id="contribution" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} required disabled={busy} /><span>ETH</span></div><button className="button dark" disabled={!available || busy}>{busy ? 'Đang xử lý…' : 'Đóng góp ↗'}</button></div></form>{stakeholder && <button className="button outline" disabled={busy} onClick={onPropose}>+ Tạo đề xuất</button>}</section>
  </>;
}
