// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Escrow {
    enum EscrowState {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE,
        DISPUTED,
        REFUNDED
    }
    
    struct EscrowTransaction {
        address payable buyer;
        address payable seller;
        address arbiter;
        uint256 amount;
        EscrowState state;
        string description;
        bool buyerApproved;
        bool sellerDelivered;
    }
    
    mapping(uint256 => EscrowTransaction) public escrows;
    uint256 public escrowCount;
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    event EscrowCreated(uint256 escrowId, address buyer, address seller, uint256 amount);
    event PaymentDeposited(uint256 escrowId, address buyer, uint256 amount);
    event DeliveryConfirmed(uint256 escrowId, address seller);
    event PaymentReleased(uint256 escrowId, address seller, uint256 amount);
    event DisputeRaised(uint256 escrowId, address raisedBy);
    event DisputeResolved(uint256 escrowId, address winner, uint256 amount);
    event Refunded(uint256 escrowId, address buyer, uint256 amount);

    function createEscrow(
        address payable _seller,
        address _arbiter,
        string memory _description
    ) public payable returns (uint256) {
        require(msg.value > 0, "Must send ETH to create escrow");
        require(_seller != address(0), "Invalid seller address");
        require(_seller != msg.sender, "Seller cannot be buyer");
        
        uint256 escrowId = escrowCount;
        
        escrows[escrowId] = EscrowTransaction({
            buyer: payable(msg.sender),
            seller: _seller,
            arbiter: _arbiter,
            amount: msg.value,
            state: EscrowState.AWAITING_DELIVERY,
            description: _description,
            buyerApproved: false,
            sellerDelivered: false
        });
        
        escrowCount++;
        
        emit EscrowCreated(escrowId, msg.sender, _seller, msg.value);
        emit PaymentDeposited(escrowId, msg.sender, msg.value);
        
        return escrowId;
    }
    
    function confirmDelivery(uint256 _escrowId) public {
        EscrowTransaction storage escrow = escrows[_escrowId];
        
        require(msg.sender == escrow.seller, "Only seller can confirm delivery");
        require(escrow.state == EscrowState.AWAITING_DELIVERY, "Invalid state");
        
        escrow.sellerDelivered = true;
        
        emit DeliveryConfirmed(_escrowId, msg.sender);
    }
    
    function releasePayment(uint256 _escrowId) public {
        EscrowTransaction storage escrow = escrows[_escrowId];
        
        require(msg.sender == escrow.buyer, "Only buyer can release payment");
        require(escrow.state == EscrowState.AWAITING_DELIVERY, "Invalid state");
        require(escrow.sellerDelivered == true, "Seller must confirm delivery first");
        
        escrow.buyerApproved = true;
        escrow.state = EscrowState.COMPLETE;
        
        uint256 amount = escrow.amount;
        escrow.amount = 0;
        escrow.seller.transfer(amount);
        
        emit PaymentReleased(_escrowId, escrow.seller, amount);
    }
    
    function requestRefund(uint256 _escrowId) public {
        EscrowTransaction storage escrow = escrows[_escrowId];
        
        require(msg.sender == escrow.buyer, "Only buyer can request refund");
        require(escrow.state == EscrowState.AWAITING_DELIVERY, "Invalid state");
        require(escrow.sellerDelivered == false, "Seller already confirmed delivery");
        
        escrow.state = EscrowState.REFUNDED;
        
        uint256 amount = escrow.amount;
        escrow.amount = 0;
        escrow.buyer.transfer(amount);
        
        emit Refunded(_escrowId, escrow.buyer, amount);
    }
    
    function raiseDispute(uint256 _escrowId) public {
        EscrowTransaction storage escrow = escrows[_escrowId];
        
        require(
            msg.sender == escrow.buyer || msg.sender == escrow.seller,
            "Only buyer or seller can raise dispute"
        );
        require(escrow.state == EscrowState.AWAITING_DELIVERY, "Invalid state");
        require(escrow.arbiter != address(0), "No arbiter assigned");
        
        escrow.state = EscrowState.DISPUTED;
        
        emit DisputeRaised(_escrowId, msg.sender);
    }
    
    function resolveDispute(uint256 _escrowId, bool _favorBuyer) public {
        EscrowTransaction storage escrow = escrows[_escrowId];
        
        require(msg.sender == escrow.arbiter, "Only arbiter can resolve");
        require(escrow.state == EscrowState.DISPUTED, "Not in dispute");
        
        uint256 amount = escrow.amount;
        escrow.amount = 0;
        
        if (_favorBuyer) {
            escrow.state = EscrowState.REFUNDED;
            escrow.buyer.transfer(amount);
            emit DisputeResolved(_escrowId, escrow.buyer, amount);
        } else {
            escrow.state = EscrowState.COMPLETE;
            escrow.seller.transfer(amount);
            emit DisputeResolved(_escrowId, escrow.seller, amount);
        }
    }
    
    function getEscrow(uint256 _escrowId) public view returns (
        address buyer,
        address seller,
        address arbiter,
        uint256 amount,
        EscrowState state,
        string memory description,
        bool buyerApproved,
        bool sellerDelivered
    ) {
        EscrowTransaction memory escrow = escrows[_escrowId];
        return (
            escrow.buyer,
            escrow.seller,
            escrow.arbiter,
            escrow.amount,
            escrow.state,
            escrow.description,
            escrow.buyerApproved,
            escrow.sellerDelivered
        );
    }
}