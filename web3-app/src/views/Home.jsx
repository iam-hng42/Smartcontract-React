import { useState } from 'react';
import Banner from '../components/Banner';
import Proposals from '../components/Proposals';
import CreateProposal from '../components/CreateProposal';
export default function Home() {
  const [modal, setModal] = useState(false);
  return <><Banner onPropose={() => setModal(true)} /><Proposals />{modal && <CreateProposal onClose={() => setModal(false)} />}</>;
}
