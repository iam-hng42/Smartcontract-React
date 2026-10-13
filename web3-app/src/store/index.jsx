import { createGlobalState } from 'react-hooks-global-state';

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
  connectedAccount: '',
  chainId: null,
  walletReady: false,
  configured: false,
  isStakeholder: false,
  balance: '0',
  mybalance: '0',
  proposals: [],
  snapshotBlock: null,
  blockTime: 0,
  busy: false,
  notice: null,
  error: '',
});

export const truncate = (value = '') => value ? `${value.slice(0, 6)}…${value.slice(-4)}` : '—';
export const remaining = (deadline, now = Math.floor(Date.now() / 1000)) => {
  const seconds = Math.max(0, Number(deadline) - now);
  return seconds ? `${Math.floor(seconds / 60)} phút ${seconds % 60} giây` : 'Đã hết hạn';
};
export const statusOf = (proposal, blockTime) => {
  if (proposal.paid) return 'Paid';
  if (Number(blockTime) < proposal.duration) return 'Pending';
  return proposal.upvotes > proposal.downvotes ? 'Passed' : 'Not Passed';
};
export { setGlobalState, useGlobalState, getGlobalState };
