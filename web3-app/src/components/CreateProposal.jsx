import { useEffect, useRef, useState } from 'react';
import { useGlobalState, setGlobalState } from '../store';
import { raiseProposal, errorMessage } from '../Blockchain.services';

export default function CreateProposal({ onClose }) {
  const [busy] = useGlobalState('busy');
  const [form, setForm] = useState({ title: '', description: '', beneficiary: '', amount: '0.005' });
  const [formError, setFormError] = useState('');
  const first = useRef(null);
  useEffect(() => { first.current?.focus(); }, []);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setFormError('');
    try { await raiseProposal(form); onClose(); }
    catch (error) { setFormError(errorMessage(error)); setGlobalState('notice', { type: 'error', text: errorMessage(error) }); }
  };
  return <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="section-heading"><div><span className="eyebrow">ĐỀ XUẤT MỚI</span><h2 id="modal-title">Bạn muốn quỹ làm gì?</h2></div><button className="icon-button" onClick={onClose} disabled={busy} aria-label="Đóng">×</button></div><p>Biểu quyết bắt đầu khi giao dịch được ghi vào block và kết thúc sau 5 phút.</p><form onSubmit={submit}>
    <label>Tiêu đề<input ref={first} name="title" value={form.title} onChange={change} maxLength={120} required disabled={busy} placeholder="Ví dụ: Hỗ trợ kinh phí thực hành cho bạn A" /></label>
    <label>Mô tả<textarea name="description" value={form.description} onChange={change} required disabled={busy} rows={3} maxLength={1500} placeholder="Mục đích sử dụng tiền…" /></label>
    <label>Địa chỉ ví người nhận (beneficiary)<input name="beneficiary" value={form.beneficiary} onChange={change} required disabled={busy} placeholder="0x… — địa chỉ ví của bạn A" /></label>
    <label>Số ETH đề nghị<input name="amount" inputMode="decimal" value={form.amount} onChange={change} required disabled={busy} /></label>
    {formError && <div role="alert" className="notice error">{formError}</div>}
    <p className="muted">Tạo đề xuất chỉ trả gas; tiền sẽ được lấy từ quỹ khi Payout thành công.</p><button className="button dark full" disabled={busy}>{busy ? 'Đang chờ xác nhận…' : 'Tạo đề xuất qua MetaMask ↗'}</button>
  </form></section></div>;
}
