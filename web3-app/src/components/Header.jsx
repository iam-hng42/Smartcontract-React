import { Link } from 'react-router-dom';
import { useGlobalState, setGlobalState, truncate } from '../store';
import { connectWallet, syncWallet, errorMessage, SEPOLIA } from '../Blockchain.services';

export default function Header() {
  const [account] = useGlobalState('connectedAccount');
  const [chain] = useGlobalState('chainId');
  const [busy] = useGlobalState('busy');
  const connect = async () => {
    try { await connectWallet(); await syncWallet(); setGlobalState('error', ''); }
    catch (e) { setGlobalState('notice', { type: 'error', text: errorMessage(e) }); }
  };
  return <header className="header"><div className="header-inner">
    <Link className="brand" to="/"><span className="brand-mark">D<span>·</span></span><span>PTIT <strong>Dominion</strong><small>QUỸ CHUNG · QUYẾT ĐỊNH CHUNG</small></span></Link>
    <nav><span className={`network ${chain === SEPOLIA ? 'online' : ''}`}><i />Ethereum Sepolia</span><button className="button dark" onClick={connect} disabled={busy}>{account && chain === SEPOLIA ? truncate(account) : 'Kết nối / chuyển Sepolia'} <span>↗</span></button></nav>
  </div></header>;
}
