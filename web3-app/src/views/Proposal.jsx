import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGlobalState } from '../store';
import { listVoters, errorMessage } from '../Blockchain.services';
import ProposalDetails from '../components/ProposalDetails';
import Voters from '../components/Voters';

export default function Proposal() {
  const { id } = useParams();
  const [proposals] = useGlobalState('proposals');
  const [snapshot] = useGlobalState('snapshotBlock');
  const [voters, setVoters] = useState(null);
  const [error, setError] = useState('');
  const proposal = proposals.find((p) => p.id === id);
  useEffect(() => {
    setVoters(null); setError('');
  }, [id]);
  useEffect(() => {
    if (!proposal || !snapshot) return;
    let active = true;
    listVoters(id).then((result) => { if (active) { setVoters(result); setError(''); } })
      .catch((e) => { if (active) { setVoters(null); setError(errorMessage(e)); } });
    return () => { active = false; };
  }, [id, snapshot, proposal]);
  return <><Link className="back-link" to="/">← Quay lại quỹ chung</Link>{proposal ? <><ProposalDetails proposal={proposal} voters={voters} /><Voters voters={voters} error={error} /></> : <section className="panel empty"><h2>{snapshot ? 'Không tìm thấy đề xuất này' : 'Kết nối ví để tải đề xuất'}</h2><p>Kiểm tra địa chỉ hợp đồng chung của nhóm và mạng Sepolia.</p></section>}</>;
}
