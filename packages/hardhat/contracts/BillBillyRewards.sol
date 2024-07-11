// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BillBuddyRewards {
    IERC20 public cUsdToken;
    address public owner;

    struct User {
        string email;
        bytes32 passwordHash;
        bool isShopper;
        bool isBusinessOwner;
        uint256 totalPoints;
        uint256 tier; // 0: Bronze, 1: Silver, 2: Gold
        uint256 referrals;
        mapping(address => uint256) storePoints;
    }

    struct Store {
        string name;
        address owner;
        bool isActive;
    }

    struct GiftCard {
        uint256 id;
        address storeAddress;
        uint256 value;
        uint256 pointCost;
        bool isActive;
    }

    mapping(address => User) public users;
    mapping(address => Store) public stores;
    mapping(uint256 => GiftCard) public giftCards;
    uint256 public giftCardCounter;

    event UserRegistered(
        address userAddress,
        bool isShopper,
        bool isBusinessOwner
    );
    event StoreRegistered(address storeAddress, string name, address owner);
    event PointsAwarded(address user, address store, uint256 points);
    event GiftCardCreated(
        uint256 giftCardId,
        address store,
        uint256 value,
        uint256 pointCost
    );
    event GiftCardAwarded(
        uint256 giftCardId,
        address recipient,
        uint256 pointsDeducted
    );
    event RewardEarned(address user, uint256 amount);
    event TierUpgraded(address user, uint256 newTier);
    event ReferralMade(address referrer, address referred);

    constructor(address _cUsdTokenAddress) {
        cUsdToken = IERC20(_cUsdTokenAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function registerUser(
        string memory _email,
        string memory _password,
        bool _isShopper,
        bool _isBusinessOwner
    ) public {
        require(
            users[msg.sender].passwordHash == bytes32(0),
            "User already registered"
        );
        User storage newUser = users[msg.sender];
        newUser.email = _email;
        newUser.passwordHash = keccak256(abi.encodePacked(_password));
        newUser.isShopper = _isShopper;
        newUser.isBusinessOwner = _isBusinessOwner;
        newUser.totalPoints = 0;
        newUser.tier = 0;
        newUser.referrals = 0;
        emit UserRegistered(msg.sender, _isShopper, _isBusinessOwner);
    }

    function registerStore(string memory _name) public {
        require(
            users[msg.sender].isBusinessOwner,
            "Only business owners can register stores"
        );
        require(!stores[msg.sender].isActive, "Store already registered");
        stores[msg.sender] = Store({
            name: _name,
            owner: msg.sender,
            isActive: true
        });
        emit StoreRegistered(msg.sender, _name, msg.sender);
    }

    function purchaseAndEarnRewards(address _store, uint256 amount) external {
        require(
            cUsdToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        uint256 rewardAmount = calculateReward(amount);
        users[msg.sender].totalPoints += rewardAmount;
        users[msg.sender].storePoints[_store] += rewardAmount;

        emit RewardEarned(msg.sender, rewardAmount);
        emit PointsAwarded(msg.sender, _store, rewardAmount);

        updateTier(msg.sender);
    }

    function referProduct(address referredUser) external {
        require(referredUser != msg.sender, "Cannot refer yourself");
        users[msg.sender].referrals++;
        users[msg.sender].totalPoints += 10; // 10 reward points for referral

        emit ReferralMade(msg.sender, referredUser);
        emit RewardEarned(msg.sender, 10);

        updateTier(msg.sender);
    }

    function createGiftCard(uint256 _value, uint256 _pointCost) public {
        require(
            stores[msg.sender].isActive,
            "Only active stores can create gift cards"
        );
        require(
            cUsdToken.transferFrom(msg.sender, address(this), _value),
            "Transfer failed"
        );

        giftCardCounter++;
        giftCards[giftCardCounter] = GiftCard({
            id: giftCardCounter,
            storeAddress: msg.sender,
            value: _value,
            pointCost: _pointCost,
            isActive: true
        });
        emit GiftCardCreated(giftCardCounter, msg.sender, _value, _pointCost);
    }

    function awardGiftCard(uint256 _giftCardId, address _recipient) public {
        GiftCard storage giftCard = giftCards[_giftCardId];
        require(
            stores[msg.sender].isActive,
            "Only active stores can award gift cards"
        );
        require(giftCard.isActive, "Gift card is not active");
        require(
            giftCard.storeAddress == msg.sender,
            "You can only award your own gift cards"
        );
        require(
            users[_recipient].storePoints[msg.sender] >= giftCard.pointCost,
            "Recipient doesn't have enough points for this store"
        );

        uint256 pointsDeducted = giftCard.pointCost;
        users[_recipient].storePoints[msg.sender] -= pointsDeducted;
        users[_recipient].totalPoints -= pointsDeducted;
        giftCard.isActive = false;

        require(
            cUsdToken.transfer(_recipient, giftCard.value),
            "Transfer failed"
        );

        emit GiftCardAwarded(_giftCardId, _recipient, pointsDeducted);
    }

    function calculateReward(
        uint256 purchaseAmount
    ) internal view returns (uint256) {
        uint256 baseReward = purchaseAmount / 100; // 1% base reward
        uint256 tierBonus = users[msg.sender].tier * 5; // 5% bonus per tier
        return baseReward + ((baseReward * tierBonus) / 100);
    }

    function updateTier(address user) internal {
        uint256 currentTier = users[user].tier;
        uint256 newTier = currentTier;

        if (users[user].referrals >= 10 && users[user].totalPoints >= 1000) {
            newTier = 2; // Gold
        } else if (
            users[user].referrals >= 5 && users[user].totalPoints >= 500
        ) {
            newTier = 1; // Silver
        }

        if (newTier > currentTier) {
            users[user].tier = newTier;
            emit TierUpgraded(user, newTier);
        }
    }

    function getStorePoints(
        address _user,
        address _store
    ) public view returns (uint256) {
        return users[_user].storePoints[_store];
    }

    function getTotalPoints(address _user) public view returns (uint256) {
        return users[_user].totalPoints;
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = cUsdToken.balanceOf(address(this));
        require(cUsdToken.transfer(owner, balance), "Transfer failed");
    }
    // Add these functions to the BillBillyRewards contract

// Read User Details
function getUserDetails(address _user) public view returns (
    string memory email,
    bool isShopper,
    bool isBusinessOwner,
    uint256 totalPoints,
    uint256 tier,
    uint256 referrals
) {
    User storage user = users[_user];
    return (
        user.email,
        user.isShopper,
        user.isBusinessOwner,
        user.totalPoints,
        user.tier,
        user.referrals
    );
}

// Read Store Details
function getStoreDetails(address _store) public view returns (
    string memory name,
    address owner,
    bool isActive
) {
    Store storage store = stores[_store];
    return (store.name, store.owner, store.isActive);
}

// Read Gift Card Details
function getGiftCardDetails(uint256 _giftCardId) public view returns (
    address storeAddress,
    uint256 value,
    uint256 pointCost,
    bool isActive
) {
    GiftCard storage giftCard = giftCards[_giftCardId];
    return (
        giftCard.storeAddress,
        giftCard.value,
        giftCard.pointCost,
        giftCard.isActive
    );
}

// List User's Gift Cards (returns up to 10 active gift cards for a user)
function listUserGiftCards(address _user) public view returns (uint256[] memory) {
    uint256[] memory userGiftCards = new uint256[](10);
    uint256 count = 0;
    
    for (uint256 i = 1; i <= giftCardCounter && count < 10; i++) {
        if (giftCards[i].isActive && users[_user].storePoints[giftCards[i].storeAddress] >= giftCards[i].pointCost) {
            userGiftCards[count] = i;
            count++;
        }
    }
    
    // Resize the array to the actual count
    assembly { mstore(userGiftCards, count) }
    
    return userGiftCards;
}

// Get User Tier
function getUserTier(address _user) public view returns (uint256) {
    return users[_user].tier;
}
}
