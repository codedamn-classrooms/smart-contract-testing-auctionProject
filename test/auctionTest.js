const Auction = artifacts.require("Auction");

contract("Auction", (accounts) => {
  let manager;
  let contract;
  beforeEach(async () => {
    manager = accounts[0];
    contract = await Auction.deployed();
  });
  it("deploys a contract", async () => {
    const auctionManager = await contract.manager();
    assert.equal(
      manager,
      auctionManager,
      "The manager is the one who launched the smart contract."
    );
  });
  it("auctions the item", async () => {
    const seller = accounts[1];
    await contract.auction(2, { from: seller });
    auctionSeller = await contract.seller();

    assert.equal(
      auctionSeller,
      seller,
      "The seller is the one who called the auction method."
    );
    auctionBid = await contract.latestBid();
    assert.equal(
      auctionBid,
      web3.utils.toWei("2", "ether"),
      "The latest bid is the argument sent to auction method converted into wei."
    );
  });
  it("bids the item", async () => {
    bidder = accounts[2];
    await contract.bidFunc({
      from: bidder,
      value: web3.utils.toWei("3", "ether"),
    });
    auctionBid = await contract.latestBid();
    assert.equal(
      auctionBid,
      web3.utils.toWei("3", "ether"),
      "The latest bid is the payment sent to bid method converted into wei."
    );
  });
  it("must bid above the latest bid amount", async () => {
    bidder = accounts[2];
    try {
      await contract.bidFunc({
        from: bidder,
        value: web3.utils.toWei("1", "ether"),
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("only manager can finish the auction", async () => {
    nonmanager = accounts[1];
    try {
      await contract.finishAuction({ from: nonmanager });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("finishes the auction as manager", async () => {
    manager = accounts[0];
    await contract.finishAuction({ from: manager });
    assert(true);
  });
});
