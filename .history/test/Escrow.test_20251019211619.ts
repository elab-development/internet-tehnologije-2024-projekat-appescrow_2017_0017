import { expect } from "chai";
import { ethers } from "hardhat";
import { Escrow } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Escrow Contract", function () {
  let escrow: Escrow;
  let buyer: SignerWithAddress;
  let seller: SignerWithAddress;
  let arbiter: SignerWithAddress;

  beforeEach(async function () {
    // Get test accounts
    [buyer, seller, arbiter] = await ethers.getSigners();

    // Deploy contract
    const EscrowFactory = await ethers.getContractFactory("Escrow");
    escrow = await EscrowFactory.deploy();
  });

  describe("Create Escrow", function () {
    it("Should create an escrow with payment", async function () {
      const amount = ethers.parseEther("1.0");
      
      await escrow.connect(buyer).createEscrow(
        seller.address,
        arbiter.address,
        "Test product",
        { value: amount }
      );

      const escrowData = await escrow.getEscrow(0);
      expect(escrowData.buyer).to.equal(buyer.address);
      expect(escrowData.seller).to.equal(seller.address);
      expect(escrowData.amount).to.equal(amount);
    });

    it("Should fail if no ETH sent", async function () {
      await expect(
        escrow.connect(buyer).createEscrow(
          seller.address,
          arbiter.address,
          "Test product"
        )
      ).to.be.revertedWith("Must send ETH to create escrow");
    });
  });

  describe("Happy Path - Complete Transaction", function () {
    beforeEach(async function () {
      const amount = ethers.parseEther("1.0");
      await escrow.connect(buyer).createEscrow(
        seller.address,
        arbiter.address,
        "Test product",
        { value: amount }
      );
    });

    it("Should complete full escrow flow", async function () {
      // Seller confirms delivery
      await escrow.connect(seller).confirmDelivery(0);
      
      // Check seller confirmed
      let escrowData = await escrow.getEscrow(0);
      expect(escrowData.sellerDelivered).to.be.true;

      // Buyer releases payment
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      await escrow.connect(buyer).releasePayment(0);
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);

      // Check payment received
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(ethers.parseEther("1.0"));
      
      // Check state is COMPLETE
      escrowData = await escrow.getEscrow(0);
      expect(escrowData.state).to.equal(2); // COMPLETE = 2
    });
  });

  describe("Refund", function () {
    it("Should allow buyer to request refund if seller hasn't delivered", async function () {
      const amount = ethers.parseEther("1.0");
      await escrow.connect(buyer).createEscrow(
        seller.address,
        arbiter.address,
        "Test product",
        { value: amount }
      );

      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
      const tx = await escrow.connect(buyer).requestRefund(0);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);

      // Balance should increase by amount minus gas
      expect(buyerBalanceAfter - buyerBalanceBefore + gasUsed).to.equal(amount);
    });
  });

  describe("Dispute Resolution", function () {
    beforeEach(async function () {
      const amount = ethers.parseEther("1.0");
      await escrow.connect(buyer).createEscrow(
        seller.address,
        arbiter.address,
        "Test product",
        { value: amount }
      );
      await escrow.connect(seller).confirmDelivery(0);
    });

    it("Should allow raising a dispute", async function () {
      await escrow.connect(buyer).raiseDispute(0);
      const escrowData = await escrow.getEscrow(0);
      expect(escrowData.state).to.equal(3); // DISPUTED = 3
    });

    it("Should allow arbiter to resolve in favor of buyer", async function () {
      await escrow.connect(buyer).raiseDispute(0);
      
      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
      await escrow.connect(arbiter).resolveDispute(0, true); // favor buyer
      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);

      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(ethers.parseEther("1.0"));
    });

    it("Should allow arbiter to resolve in favor of seller", async function () {
      await escrow.connect(buyer).raiseDispute(0);
      
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      await escrow.connect(arbiter).resolveDispute(0, false); // favor seller
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);

      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(ethers.parseEther("1.0"));
    });
  });
});