import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/Home';
import Proposal from './views/Proposal';
import { useGlobalState, setGlobalState } from './store';
import { syncWallet, subscribeWallet, refreshDAO, errorMessage, explorer, CONTRACT_ADDRESS, SEPOLIA } from './Blockchain.services';

export default function App() {
  const [ready, setReady] = useState(false);
  const [account] = useGlobalState('connectedAccount');
  const [configured] = useGlobalState('configured');
  const [chain] = useGlobalState('chainId');
  const [walletReady] = useGlobalState('walletReady');
  const [notice] = useGlobalState('notice');
  const [error] = useGlobalState('error');
  const [block] = useGlobalState('snapshotBlock');
  useEffect(() => {
    let active = true;
    syncWallet().catch((e) => setGlobalState('error', errorMessage(e))).finally(() => { if (active) setReady(true); });
    const unsubscribe = subscribeWallet();
    return () => { active = false; unsubscribe(); };
  }, []);
  useEffect(() => {
    if (!account || !configured || chain !== SEPOLIA) return;
    let active = true;
    const load = () => refreshDAO().catch((e) => { if (active) setGlobalState('error', errorMessage(e)); });
    load();
    const timer = setInterval(load, 10000);
    return () => { active = false; clearInterval(timer); };
  }, [account, configured, chain]);
  return <>
    <Header />
    <main>
      <div className="breadcrumb"><span>THỰC HÀNH BLOCKCHAIN</span><span>01 / DOMINION DAO</span></div>
      {notice && <div className={`notice ${notice.type}`} role="status"><span>{notice.text}</span>{notice.hash && <a href={explorer('tx', notice.hash)} target="_blank" rel="noreferrer">Xem giao dịch ↗</a>}<button className="icon-button" aria-label="Đóng thông báo" onClick={() => setGlobalState('notice', null)}>×</button></div>}
      {error && <div className="notice error" role="alert">{error}</div>}
      {!ready ? <div className="panel">Đang kiểm tra kết nối ví…</div> : <>
        {!walletReady && <div className="notice warning">Chưa cài MetaMask. <a href="https://metamask.io/" target="_blank" rel="noreferrer">Cài tiện ích MetaMask ↗</a></div>}
        {!configured && <div className="notice warning"><strong>Chưa có địa chỉ hợp đồng.</strong> Deploy DominionDAO hoặc điền địa chỉ chung của nhóm vào <code>web3-app/.env.local</code>, sau đó chạy lại web. Xem hướng dẫn trong ZIP.</div>}
        {walletReady && chain !== SEPOLIA && <div className="notice warning">Chọn Ethereum Sepolia trong MetaMask hoặc bấm “Kết nối / chuyển Sepolia”.</div>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proposal/:id" element={<Proposal />} />
          <Route path="*" element={<div className="panel">Trang không tồn tại. <Link to="/">Về trang chủ</Link></div>} />
        </Routes>
      </>}
      <footer><span>PTIT Dominion · Bài thực hành smart contract & React</span><span>{block ? `Dữ liệu block #${block.toLocaleString('vi-VN')}` : 'Chưa tải dữ liệu on-chain'}</span></footer>
      {configured && <div className="contract-line">Hợp đồng chung: <a href={explorer('address', CONTRACT_ADDRESS)} target="_blank" rel="noreferrer">{CONTRACT_ADDRESS} ↗</a></div>}
    </main>
  </>;
}
