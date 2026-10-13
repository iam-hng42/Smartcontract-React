const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const eth = ethers.utils.parseEther;
async function rejected(action, message) {
  let error;
  try { const tx = await action; if (tx && tx.wait) await tx.wait(); } catch (e) { error = e; }
  expect(error, "Expected a revert: " + message).not.to.equal(undefined);
  expect(error.message).to.include(message);
}
async function expire() {
  await network.provider.send("evm_increaseTime", [301]);
  await network.provider.send("evm_mine");
}
describe("DominionDAO: practical assignment", function () {
  let dao, a, b, c, receiver, outsider;
  beforeEach(async function () {
    [a, b, c, receiver, outsider] = await ethers.getSigners();
    dao = await (await ethers.getContractFactory("DominionDAO")).deploy();
    await dao.deployed();
  });
  async function fund() {
    for (const wallet of [a, b, c]) await (await dao.connect(wallet).contribute({ value: eth("0.01") })).wait();
  }
  async function proposal(amount = "0.005") {
    await (await dao.createProposal("Ho tro A", "Kinh phi thuc hanh", receiver.address, eth(amount))).wait();
  }
  it("FirstSmartContract stores the assigned value", async function () {
    const first = await (await ethers.getContractFactory("FirstSmartContract")).deploy();
    await first.deployed();
    expect((await first.getBalance()).toString()).to.equal("0");
    await (await first.setBalance(500000000)).wait();
    expect((await first.getBalance()).toString()).to.equal("500000000");
  });
  it("accumulates contributions and grants stakeholder at 0.01 ETH", async function () {
    await dao.contribute({ value: eth("0.004") });
    expect(await dao.isStakeholder()).to.equal(false);
    expect(await dao.isContributor()).to.equal(true);
    await dao.contribute({ value: eth("0.006") });
    expect(await dao.isStakeholder()).to.equal(true);
    expect((await dao.getBalance()).toString()).to.equal(eth("0.01").toString());
    await rejected(dao.contribute({ value: 0 }), "Contributing zero");
  });
  it("requires stakeholder rights for creation, voting and payout", async function () {
    await fund(); await proposal();
    await rejected(dao.connect(outsider).createProposal("x", "y", receiver.address, 1), "Stakeholders only");
    await rejected(dao.connect(outsider).performVote(0, true), "Stakeholders only");
    await rejected(dao.connect(outsider).payBeneficiary(0), "Stakeholders only");
  });
  it("checks proposal data and nonexistent IDs", async function () {
    await fund();
    await rejected(dao.createProposal("", "y", receiver.address, 1), "Title is required");
    await rejected(dao.createProposal("x", "", receiver.address, 1), "Description is required");
    await rejected(dao.createProposal("x", "y", ethers.constants.AddressZero, 1), "Invalid beneficiary");
    await rejected(dao.createProposal("x", "y", receiver.address, 0), "Amount must be positive");
    await rejected(dao.createProposal("x", "y", receiver.address, eth("1")), "Insufficient fund");
    await rejected(dao.performVote(999, true), "Proposal does not exist");
    await rejected(dao.payBeneficiary(999), "Proposal does not exist");
    await rejected(dao.getProposal(999), "Proposal does not exist");
  });
  it("sets a 300-second deadline and rejects duplicate or late votes", async function () {
    await fund(); await proposal();
    const p = await dao.getProposal(0);
    const block = await ethers.provider.getBlock("latest");
    expect(p.duration.toNumber() - block.timestamp).to.equal(300);
    await dao.performVote(0, true);
    await rejected(dao.performVote(0, false), "Double voting not allowed");
    expect(await dao.hasVoted(0, a.address)).to.equal(true);
    expect((await dao.getVotesOf(0)).length).to.equal(1);
    await expire();
    await rejected(dao.connect(b).performVote(0, true), "Proposal duration expired");
  });
  it("rejects early payout, pays A after expiry, accounts correctly, rejects repeat", async function () {
    await fund(); await proposal();
    await dao.performVote(0, true);
    await dao.connect(b).performVote(0, true);
    await dao.connect(c).performVote(0, false);
    await rejected(dao.payBeneficiary(0), "Voting is still open");
    await expire();
    expect((await dao.getProposal(0)).passed).to.equal(true);
    const before = await ethers.provider.getBalance(receiver.address);
    await (await dao.connect(b).payBeneficiary(0)).wait();
    const after = await ethers.provider.getBalance(receiver.address);
    expect(after.sub(before).toString()).to.equal(eth("0.005").toString());
    expect((await dao.daoBalance()).toString()).to.equal(eth("0.025").toString());
    expect((await ethers.provider.getBalance(dao.address)).toString()).to.equal(eth("0.025").toString());
    expect((await dao.getProposal(0)).paid).to.equal(true);
    expect((await dao.getProposal(0)).executor).to.equal(b.address);
    await rejected(dao.payBeneficiary(0), "Payment sent before");
  });
  it("rejects payout for a tie or no votes", async function () {
    await fund(); await proposal(); await proposal();
    await dao.performVote(0, true); await dao.connect(b).performVote(0, false);
    await expire();
    expect((await dao.getProposal(0)).passed).to.equal(false);
    await rejected(dao.payBeneficiary(0), "Insufficient votes");
    await rejected(dao.payBeneficiary(1), "Insufficient votes");
  });
  it("rechecks funds if another proposal spends the treasury first", async function () {
    await fund(); await proposal("0.025"); await proposal("0.025");
    await dao.performVote(0, true); await dao.performVote(1, true);
    await expire(); await dao.payBeneficiary(0);
    await rejected(dao.payBeneficiary(1), "Insufficient fund");
    expect((await dao.getProposal(1)).paid).to.equal(false);
  });
});
