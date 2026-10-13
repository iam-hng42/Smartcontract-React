import Web3 from 'web3';
import artifact from './abis/DominionDAO.json';
import { getGlobalState, setGlobalState } from './store';

export const CONTRACT_ADDRESS = (process.env.REACT_APP_CONTRACT_ADDRESS || '').trim();
export const SEPOLIA = 11155111;
export const explorer = (kind, value) => `https://sepolia.etherscan.io/${kind}/${value}`;
let checkedAddress = false;
let refreshInFlight = null;

function provider() {
  const injected = window.ethereum;
  if (!injected) throw new Error('Chưa tìm thấy MetaMask. Hãy cài tiện ích, sau đó tải lại trang.');
  // Prefer MetaMask when multiple injected browser wallets exist.
  return injected.providers?.find((p) => p.isMetaMask) || injected;
}
export function errorMessage(error) {
  if (error?.code === 4001 || error?.code === 'ACTION_REJECTED') return 'Bạn đã hủy yêu cầu trong ví. Chưa có giao dịch thành công.';
  if (error?.code === -32002) return 'MetaMask đang có yêu cầu chờ xử lý. Hãy mở tiện ích để xác nhận hoặc hủy.';
  return error?.data?.message || error?.reason || error?.message || 'Không thực hiện được thao tác.';
}
export async function syncWallet() {
  setGlobalState('walletReady', Boolean(window.ethereum));
  setGlobalState('configured', Web3.utils.isAddress(CONTRACT_ADDRESS));
  if (!window.ethereum) return false;
  const p = provider();
  const [accounts, chain] = await Promise.all([
    p.request({ method: 'eth_accounts' }), p.request({ method: 'eth_chainId' }),
  ]);
  setGlobalState('connectedAccount', accounts[0]?.toLowerCase() || '');
  setGlobalState('chainId', Number(chain));
  return Boolean(accounts[0]) && Number(chain) === SEPOLIA;
}
export const isWallectConnected = syncWallet;
export async function connectWallet() {
  const p = provider();
  if (Number(await p.request({ method: 'eth_chainId' })) !== SEPOLIA) {
    await p.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xaa36a7' }] });
  }
  await p.request({ method: 'eth_requestAccounts' });
  await syncWallet();
}
export function subscribeWallet() {
  if (!window.ethereum) return () => {};
  const p = provider();
  const reset = () => window.location.reload();
  p.on('accountsChanged', reset);
  p.on('chainChanged', reset);
  return () => {
    p.removeListener('accountsChanged', reset);
    p.removeListener('chainChanged', reset);
  };
}
async function context() {
  const p = provider();
  const web3 = new Web3(p);
  if (!Web3.utils.isAddress(CONTRACT_ADDRESS)) throw new Error('Chưa cấu hình địa chỉ DAO. Điền REACT_APP_CONTRACT_ADDRESS trong web3-app/.env.local rồi khởi động lại web.');
  const [accounts, chain] = await Promise.all([web3.eth.getAccounts(), web3.eth.getChainId()]);
  if (chain !== SEPOLIA) throw new Error('Hãy chuyển MetaMask sang Ethereum Sepolia (11155111).');
  if (!accounts[0]) throw new Error('Hãy kết nối ví trước.');
  if (!checkedAddress) {
    if ((await web3.eth.getCode(CONTRACT_ADDRESS)) === '0x') throw new Error('Địa chỉ này không có smart contract trên Sepolia. Kiểm tra lại địa chỉ DominionDAO.');
    checkedAddress = true;
  }
  return { web3, account: accounts[0], contract: new web3.eth.Contract(artifact.abi, CONTRACT_ADDRESS) };
}
const normalizeProposal = (p) => ({
  id: String(p.id), amount: Web3.utils.fromWei(p.amount, 'ether'), amountWei: p.amount,
  duration: Number(p.duration), upvotes: Number(p.upvotes), downvotes: Number(p.downvotes),
  title: p.title, description: p.description, paid: p.paid, passed: p.passed,
  beneficiary: p.beneficiary, proposer: p.proposer, executor: p.executor,
});
export function refreshDAO() {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const { web3, account, contract } = await context();
    const block = await web3.eth.getBlock('latest');
    const [balance, mine, stakeholder, proposals] = await Promise.all([
      contract.methods.daoBalance().call({}, block.number),
      contract.methods.getBalance().call({ from: account }, block.number),
      contract.methods.isStakeholder().call({ from: account }, block.number),
      contract.methods.getProposals().call({}, block.number),
    ]);
    setGlobalState('balance', web3.utils.fromWei(balance, 'ether'));
    setGlobalState('mybalance', web3.utils.fromWei(mine, 'ether'));
    setGlobalState('isStakeholder', stakeholder);
    setGlobalState('proposals', proposals.map(normalizeProposal).reverse());
    setGlobalState('snapshotBlock', Number(block.number));
    setGlobalState('blockTime', Number(block.timestamp));
    setGlobalState('error', '');
  })().finally(() => { refreshInFlight = null; });
  return refreshInFlight;
}
export const getInfo = refreshDAO;
export const getProposals = refreshDAO;
function toAmount(amount) {
  const value = String(amount).trim();
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,18})?$/.test(value)) throw new Error('Nhập số ETH hợp lệ, dùng dấu chấm thập phân, tối đa 18 chữ số sau dấu chấm.');
  const wei = Web3.utils.toWei(value, 'ether');
  if (Web3.utils.toBN(wei).isZero()) throw new Error('Số tiền phải lớn hơn 0.');
  return wei;
}
async function transact(label, factory, value) {
  if (getGlobalState('busy')) throw new Error('Một giao dịch đang chờ xử lý.');
  setGlobalState('busy', true);
  setGlobalState('notice', { type: 'pending', text: 'Kiểm tra và xác nhận giao dịch trong MetaMask…' });
  try {
    const { account, contract } = await context();
    const receipt = await factory(contract).send({ from: account, ...(value ? { value } : {}) })
      .on('transactionHash', (hash) => setGlobalState('notice', { type: 'pending', text: 'Đã gửi giao dịch, đang chờ block xác nhận…', hash }));
    if (!receipt.status || receipt.status === '0x0') throw new Error('Giao dịch đã bị hoàn tác.');
    setGlobalState('notice', { type: 'success', text: label, hash: receipt.transactionHash });
    try {
      // Finish any older read, then fetch data after the receipt.
      if (refreshInFlight) await refreshInFlight;
      await refreshDAO();
    } catch (error) {
      setGlobalState('error', 'Giao dịch đã thành công nhưng chưa tải lại được dữ liệu: ' + errorMessage(error));
    }
    return receipt;
  } catch (error) {
    setGlobalState('notice', { type: 'error', text: errorMessage(error) });
    throw error;
  } finally { setGlobalState('busy', false); }
}
export const performContribute = (amount) => transact('Đóng góp thành công.', (c) => c.methods.contribute(), toAmount(amount));
export const raiseProposal = ({ title, description, beneficiary, amount }) => {
  if (!title.trim() || !description.trim()) throw new Error('Điền tiêu đề và mô tả đề xuất.');
  if (!Web3.utils.isAddress(beneficiary) || /^0x0{40}$/i.test(beneficiary)) throw new Error('Địa chỉ ví người nhận không hợp lệ.');
  const wei = toAmount(amount);
  return transact('Đã tạo đề xuất. Thời gian biểu quyết là 5 phút.', (c) => c.methods.createProposal(title.trim(), description.trim(), beneficiary, wei));
};
export const voteOnProposal = (id, choice) => transact('Đã ghi nhận phiếu biểu quyết.', (c) => c.methods.performVote(id, choice));
export const payoutBeneficiary = (id) => transact('Thanh toán thành công. Kiểm tra ví người nhận và giao dịch trên explorer.', (c) => c.methods.payBeneficiary(id));
export async function listVoters(id) {
  const { contract } = await context();
  const votes = await contract.methods.getVotesOf(id).call();
  return votes.map((v) => ({ voter: v.voter, timestamp: Number(v.timestamp), choosen: v.choosen }));
}
export const getProposal = (id) => getGlobalState('proposals').find((p) => p.id === String(id));
