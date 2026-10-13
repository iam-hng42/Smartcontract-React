import { useGlobalState, setGlobalState, statusOf, remaining } from '../store';
import { voteOnProposal, payoutBeneficiary, errorMessage, explorer } from '../Blockchain.services';

export default function ProposalDetails({ proposal: p, voters }) {
  const [stakeholder] = useGlobalState('isStakeholder');
  const [account] = useGlobalState('connectedAccount');
  const [blockTime] = useGlobalState('blockTime');
  const [busy] = useGlobalState('busy');
  const [balance] = useGlobalState('balance');
  const status = statusOf(p, blockTime);
  const voted = voters?.some((v) => v.voter.toLowerCase() === account);
  const votes = p.upvotes + p.downvotes;
  const execute = async (action) => {
    try { await action(); }
    catch (error) { setGlobalState('notice', { type: 'error', text: errorMessage(error) }); }
  };
  return <section className="detail-layout"><div className="panel detail-main"><div className="card-top"><span className="eyebrow">ĐỀ XUẤT #{p.id}</span><span className={`badge ${status.replace(' ', '-').toLowerCase()}`}>{status}</span></div><h1 className="detail-title">{p.title}</h1><p className="detail-description">{p.description}</p><dl><dt>Người tạo</dt><dd><a href={explorer('address', p.proposer)} target="_blank" rel="noreferrer">{p.proposer} ↗</a></dd><dt>Người nhận tiền</dt><dd><a href={explorer('address', p.beneficiary)} target="_blank" rel="noreferrer">{p.beneficiary} ↗</a></dd><dt>Hạn biểu quyết</dt><dd>{new Date(p.duration * 1000).toLocaleString('vi-VN')} · {remaining(p.duration, blockTime)}</dd>{p.paid && <><dt>Người thực hiện Payout</dt><dd>{p.executor}</dd></>}</dl><div className="ballot"><div className="section-heading"><h2>Kết quả biểu quyết</h2><span>{votes} phiếu</span></div><div className="vote-bar" aria-label={`${p.upvotes} đồng ý, ${p.downvotes} từ chối`}><div style={{ width: `${votes ? p.upvotes / votes * 100 : 0}%` }} /></div><div className="vote-summary"><span>✓ Đồng ý: <strong>{p.upvotes}</strong></span><span>× Từ chối: <strong>{p.downvotes}</strong></span></div></div></div><aside className="panel decision"><span className="eyebrow">SỐ TIỀN ĐỀ NGHỊ</span><div className="decision-amount">{p.amount}<small> ETH</small></div><p>Thanh toán từ quỹ DAO sau khi hết 5 phút và số phiếu đồng ý lớn hơn số phiếu từ chối.</p><hr />
    {status === 'Pending' ? <>{!stakeholder ? <p>Góp đủ 0.01 ETH để có quyền bỏ phiếu.</p> : voters === null ? <p>Đang tải trạng thái phiếu của bạn…</p> : voted ? <div className="notice success">Bạn đã bỏ phiếu cho đề xuất này.</div> : <><button className="button dark full" disabled={busy} onClick={() => execute(() => voteOnProposal(p.id, true))}>✓ Đồng ý / Accept</button><button className="button outline full" disabled={busy} onClick={() => execute(() => voteOnProposal(p.id, false))}>× Từ chối / Reject</button></>}<p className="muted">Mỗi stakeholder được bỏ phiếu một lần. Thời hạn được kiểm tra theo block của blockchain.</p></> : status === 'Passed' ? <><button className="button dark full" disabled={!stakeholder || busy} onClick={() => execute(() => payoutBeneficiary(p.id))}>{busy ? 'Đang xử lý…' : 'Thanh toán / Payout ↗'}</button><p className="muted">Quỹ hiện có {balance} ETH. {stakeholder ? 'Ví thực hiện trả phí gas.' : 'Chỉ stakeholder được thực hiện Payout.'}</p></> : status === 'Paid' ? <div className="notice success">Đã thanh toán cho người nhận. Kiểm tra số dư và giao dịch trên explorer.</div> : <div className="notice warning">Đề xuất không thông qua: phiếu đồng ý không lớn hơn phiếu từ chối.</div>}
  </aside></section>;
}
