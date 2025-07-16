// SPDX-License-Identifier: MIT
// Ağ: Base (Ethereum L2)
// Token Name: Hungerium Token
// Token Symbol: HUNGX
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

// Module Interfaces - Ready for external development
interface IDAOModule {
    function proposeCharacterPriceChange(uint256 characterId, uint256 newPrice) external;
    function vote(uint256 proposalId, bool support) external;
    function executeProposal(uint256 proposalId) external;
    function getVotingPower(address user) external view returns (uint256);
}

interface INFTModule {
    function migrateCharacterToNFT(address user, uint256 characterId, uint256 amount) external returns (uint256[] memory nftIds);
    function getNFTMultiplier(address user, uint256 nftId) external view returns (uint256);
    function isNFTActive() external view returns (bool);
}

interface ISocialModule {
    function processStepReward(address user, uint256 steps, uint256 characterMultiplier) external;
    function processSnapReward(address user, uint256 photos, uint256 characterMultiplier) external;
    function getDailyLimit(address user) external view returns (uint256);
}

/**
 * @title Hungerium Token - Modular Core
 * @dev Lightweight core with module support for DAO, NFT, and Social features
 */
contract HungeriumToken is ERC20, AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MODULE_ROLE = keccak256("MODULE_ROLE");

    // Token Distribution - 15B Total
    uint256 public constant TOTAL_SUPPLY = 15_000_000_000 * 1e18;
    uint256 public constant TREASURY_ALLOCATION = (TOTAL_SUPPLY * 25) / 100;
    uint256 public constant LIQUIDITY_ALLOCATION = (TOTAL_SUPPLY * 20) / 100;
    uint256 public constant COMMUNITY_ALLOCATION = (TOTAL_SUPPLY * 35) / 100;
    uint256 public constant TEAM_ALLOCATION = (TOTAL_SUPPLY * 10) / 100;
    uint256 public constant MARKETING_ALLOCATION = (TOTAL_SUPPLY * 10) / 100;

    // Core Constants
    uint256 public constant MAX_WEEKLY_CLAIM = 35000 * 1e18; // 7x günlük limit
    uint256 public constant MIN_CLAIM_BALANCE = 100000 * 1e18;
    uint256 public constant MIN_BALANCE_FOR_ACCUMULATION = 10000 * 1e18;
    uint256 public constant PENDING_REWARD_EXPIRY = 60 days;
    uint256 public constant MIN_WALLET_AGE = 3 days;
    uint256 public constant MIN_ACTIVITY_DURATION = 1 minutes;
    // Enflasyon oranı: 6 ayda bir %1 (yılda %2)
    uint256 public constant SEMIANNUAL_INFLATION_RATE = 100; // 1% per 6 months, 2% annual

    // Staking System - Enhanced with minimum stake requirement
    struct Stake {
        uint128 amount;
        uint64 startTime;
        uint64 lastClaim;
    }
    mapping(address => Stake) public stakes;
    uint256 public totalStaked;
    uint256 public constant ANNUAL_RATE = 500; // 5%
    uint256 public constant EARLY_UNSTAKE_PENALTY = 500; // 5% penalty

    // Security & Trading
    mapping(address => bool) public isDEXPair;
    uint16 public constant DEX_TAX = 200; // 2%

    // Core Addresses - Const wallets that can trigger inflation
    address public treasury;
    address public liquidity;
    address public community;
    address public team;
    address public marketing;
    
    // Const wallets mapping for inflation trigger
    mapping(address => bool) public isConstWallet;

    // Module System - Enhanced with deauthorization timelock
    mapping(address => bool) public authorizedModules;
    
    // Module addresses
    address public daoModule;
    address public nftModule;
    address public socialModule;
    
    // Weekly tracking for combined limits
    mapping(address => uint256) public weeklyRewards;
    mapping(address => uint256) public lastRewardWeek;

    // Game rewards tracking
    mapping(address => uint256) public lastClaimWeek;
    mapping(address => uint256) public claimedThisWeek;

    // Pending Rewards System
    mapping(address => uint256) public pendingGameRewards;
    mapping(address => uint256) public pendingStepRewards;
    mapping(address => uint256) public pendingSnapRewards;
    mapping(address => uint256) public lastPendingUpdate;

    // Sybil Protection
    mapping(address => uint256) public walletCreatedAt;
    mapping(address => uint256) public lastGameStart;
    mapping(address => uint256) public lastStepStart;

    // Game Statistics - Simplified
    struct GameStats {
        uint256 totalGamesPlayed;
        uint256 totalRewardsClaimed;
        uint256 lastGameTimestamp;
    }
    mapping(address => GameStats) public gameStats;

    // Inflation System
    uint256 public lastInflationTime;

    // Mobile App Integration
    address public mobileAppBackend;
    mapping(address => string) public userProfiles;
    mapping(string => address) public profileToWallet;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event GameRewardsClaimed(address indexed user, uint256 amount);
    event ModuleSet(string moduleType, address module);
    event ModuleEnabled(string moduleType);
    event TradingEnabled();
    event PendingRewardAdded(address indexed user, uint256 amount, string rewardType);
    event PendingRewardsClaimed(address indexed user, uint256 totalAmount);
    event InflationMinted(uint256 amount, uint256 time);
    event UserProfileLinked(address indexed wallet, string profileId);
    event GlobalModuleMint(address indexed module, address indexed to, uint256 amount, uint256 totalMintedThisYear);
    event GlobalModuleBurn(address indexed module, address indexed from, uint256 amount, uint256 totalBurnedThisYear);
    event EarlyUnstakePenalty(address indexed user, uint256 amount, uint256 penalty);
    event CrossChainModuleSet(address indexed module);
    event CrossChainEnabled(bool enabled);
    event BridgeModuleSet(address indexed module);

    constructor(
        address _treasury,
        address _liquidity,
        address _community,
        address _team,
        address _marketing
    ) ERC20("Hungerium Token", "HUNGX") {
        require(_treasury != address(0) && _liquidity != address(0) && 
                _community != address(0) && _team != address(0) && 
                _marketing != address(0), "Invalid addresses");
        
        treasury = _treasury;
        liquidity = _liquidity;
        community = _community;
        team = _team;
        marketing = _marketing;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);

        // Mint initial supply
        _mint(_treasury, TREASURY_ALLOCATION);
        _mint(_liquidity, LIQUIDITY_ALLOCATION);
        _mint(_community, COMMUNITY_ALLOCATION);
        _mint(_team, TEAM_ALLOCATION);
        _mint(_marketing, MARKETING_ALLOCATION);

        // Set const wallets for inflation trigger
        isConstWallet[_treasury] = true;
        isConstWallet[_liquidity] = true;
        isConstWallet[_community] = true;
        isConstWallet[_team] = true;
        isConstWallet[_marketing] = true;

        // Initialize inflation timer
        lastInflationTime = block.timestamp;
    }

    // STAKING SYSTEM
    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, address(this), amount);
        Stake storage userStake = stakes[msg.sender];
        if (userStake.amount > 0) {
            uint256 reward = _calculateReward(msg.sender);
            if (reward > 0) _mint(msg.sender, reward);
        }
        userStake.amount += uint128(amount);
        userStake.startTime = uint64(block.timestamp);
        userStake.lastClaim = uint64(block.timestamp);
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }

    function _calculateReward(address user) internal view returns (uint256) {
        Stake memory userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        uint256 duration = block.timestamp - userStake.lastClaim;
        uint256 apy = ANNUAL_RATE;
        return (userStake.amount * apy * duration) / (10000 * 365 days);
    }

    function emergencyUnstake() external nonReentrant whenNotPaused {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "Nothing staked");
        uint256 stakedAmount = userStake.amount;
        uint256 reward = _calculateReward(msg.sender);
        if (reward > 0) _mint(msg.sender, reward);
        uint256 penalty = (stakedAmount * EARLY_UNSTAKE_PENALTY) / 10000;
        uint256 finalAmount = stakedAmount - penalty;
        userStake.amount = 0;
        totalStaked -= stakedAmount;
        userStake.lastClaim = uint64(block.timestamp);
        _transfer(address(this), treasury, penalty);
        _transfer(address(this), msg.sender, finalAmount);
        emit EarlyUnstakePenalty(msg.sender, stakedAmount, penalty);
        emit Unstaked(msg.sender, finalAmount);
    }

    function unstake() external nonReentrant whenNotPaused {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "Nothing staked");
        require(block.timestamp >= userStake.startTime + 7 days, "Unstake available after 7 days or use emergencyUnstake");
        uint256 stakedAmount = userStake.amount;
        uint256 reward = _calculateReward(msg.sender);
        if (reward > 0) _mint(msg.sender, reward);
        userStake.amount = 0;
        totalStaked -= stakedAmount;
        userStake.lastClaim = uint64(block.timestamp);
        _transfer(address(this), msg.sender, stakedAmount);
        emit Unstaked(msg.sender, stakedAmount);
    }

    function partialUnstake(uint256 amount) external nonReentrant whenNotPaused {
        Stake storage userStake = stakes[msg.sender];
        require(amount > 0, "Amount must be greater than 0");
        require(userStake.amount >= amount, "Insufficient staked amount");
        require(block.timestamp >= userStake.startTime + 7 days, "Partial unstake available after 7 days or use emergencyUnstake");
        uint256 reward = _calculateReward(msg.sender);
        if (reward > 0) _mint(msg.sender, reward);
        userStake.amount -= uint128(amount);
        totalStaked -= amount;
        userStake.lastClaim = uint64(block.timestamp);
        _transfer(address(this), msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    function getUnstakePenalty(address user) external view returns (uint256 penalty, bool hasPenalty) {
        Stake memory userStake = stakes[user];
        if (userStake.amount == 0) return (0, false);
        if (block.timestamp < userStake.startTime + 7 days) {
            penalty = (userStake.amount * EARLY_UNSTAKE_PENALTY) / 10000;
            hasPenalty = true;
        } else {
            penalty = 0;
            hasPenalty = false;
        }
    }

    // GAME REWARDS - Pending system only
    function claimGameRewards(uint256 baseAmount) external nonReentrant whenNotPaused {
        require(baseAmount > 0, "Invalid amount");
        require(walletCreatedAt[msg.sender] > 0 && 
                block.timestamp - walletCreatedAt[msg.sender] >= MIN_WALLET_AGE, "Wallet too young");
        uint256 finalAmount = baseAmount;
        uint256 maxWeeklyClaim = MAX_WEEKLY_CLAIM;
        require(finalAmount <= maxWeeklyClaim, "Amount exceeds weekly limit");
        uint256 currentWeek = block.timestamp / 1 weeks;
        if (lastRewardWeek[msg.sender] < currentWeek) {
            weeklyRewards[msg.sender] = 0;
            lastRewardWeek[msg.sender] = currentWeek;
        }
        require(weeklyRewards[msg.sender] + finalAmount <= maxWeeklyClaim, "Weekly limit exceeded");
        uint256 userBalance = balanceOf(msg.sender);
        _updateGameStats(msg.sender, finalAmount);
        if (userBalance >= MIN_CLAIM_BALANCE) {
            weeklyRewards[msg.sender] += finalAmount;
            lastGameStart[msg.sender] = 0;
            _transfer(treasury, msg.sender, finalAmount);
            emit GameRewardsClaimed(msg.sender, finalAmount);
        }
        else if (userBalance >= MIN_BALANCE_FOR_ACCUMULATION) {
            pendingGameRewards[msg.sender] += finalAmount;
            weeklyRewards[msg.sender] += finalAmount;
            lastPendingUpdate[msg.sender] = block.timestamp;
            lastGameStart[msg.sender] = 0;
            emit PendingRewardAdded(msg.sender, finalAmount, "game");
        }
        else {
            revert("Insufficient balance for rewards");
        }
    }

    // Helper function for statistics
    function _updateGameStats(address user, uint256 rewardAmount) internal {
        GameStats storage stats = gameStats[user];
        stats.totalGamesPlayed += 1;
        stats.totalRewardsClaimed += rewardAmount;
        stats.lastGameTimestamp = block.timestamp;
    }

    // Claim accumulated pending rewards (max 5K daily, respects combined limit)
    function claimPendingRewards(uint256 amount) external nonReentrant whenNotPaused {
        require(balanceOf(msg.sender) >= MIN_CLAIM_BALANCE, "Need 100K HUNGX to claim");
        require(amount > 0 && amount <= MAX_WEEKLY_CLAIM, "Invalid amount");
        uint256 totalPending = pendingGameRewards[msg.sender] + pendingStepRewards[msg.sender] + pendingSnapRewards[msg.sender];
        require(totalPending > 0, "No pending rewards");
        require(amount <= totalPending, "Amount exceeds pending rewards");
        require(lastPendingUpdate[msg.sender] > 0 && 
                block.timestamp - lastPendingUpdate[msg.sender] <= PENDING_REWARD_EXPIRY, 
                "Rewards expired after 30 days");
        uint256 currentWeek = block.timestamp / 1 weeks;
        if (lastRewardWeek[msg.sender] < currentWeek) {
            weeklyRewards[msg.sender] = 0;
            lastRewardWeek[msg.sender] = currentWeek;
        }
        require(weeklyRewards[msg.sender] + amount <= MAX_WEEKLY_CLAIM, "Weekly limit exceeded");
        uint256 gameShare = (pendingGameRewards[msg.sender] * amount) / totalPending;
        uint256 stepShare = (pendingStepRewards[msg.sender] * amount) / totalPending;
        uint256 snapShare = amount - gameShare - stepShare;
        pendingGameRewards[msg.sender] -= gameShare;
        pendingStepRewards[msg.sender] -= stepShare;
        pendingSnapRewards[msg.sender] -= snapShare;
        weeklyRewards[msg.sender] += amount;
        if (pendingGameRewards[msg.sender] + pendingStepRewards[msg.sender] + pendingSnapRewards[msg.sender] == 0) {
            lastPendingUpdate[msg.sender] = 0;
        }
        _transfer(treasury, msg.sender, amount);
        emit PendingRewardsClaimed(msg.sender, amount);
    }

    // PUBLIC VIEW FUNCTIONS FOR STATISTICS AND INFORMATION
    function getGameStats(address user) external view returns (
        uint256 totalGamesPlayed,
        uint256 totalRewardsClaimed,
        uint256 lastGameTimestamp
    ) {
        GameStats memory stats = gameStats[user];
        return (
            stats.totalGamesPlayed,
            stats.totalRewardsClaimed,
            stats.lastGameTimestamp
        );
    }

    // MODULE SYSTEM - Timelock protected
    function setDAOModule(address _module) external onlyRole(ADMIN_ROLE) {
        require(_module != address(0), "Invalid module address");
        daoModule = _module;
        authorizedModules[_module] = true;
        emit ModuleSet("DAO", _module);
    }

    function setNFTModule(address _module) external onlyRole(ADMIN_ROLE) {
        require(_module != address(0), "Invalid module address");
        nftModule = _module;
        authorizedModules[_module] = true;
        emit ModuleSet("NFT", _module);
    }

    function setSocialModule(address _module) external onlyRole(ADMIN_ROLE) {
        require(_module != address(0), "Invalid module address");
        socialModule = _module;
        authorizedModules[_module] = true;
        emit ModuleSet("Social", _module);
    }

    // MODULE INTERACTION FUNCTIONS
    function migrateToNFT(uint256 /*_characterId*/, uint256 /*_amount*/) external nonReentrant whenNotPaused {
        require(nftModule != address(0), "NFT module not set");
        // Karakter sistemi kaldırıldığı için bu fonksiyonun içeriği boş bırakıldı veya kaldırılabilir.
    }

    function processSocialReward(address user, uint256 amount) external whenNotPaused {
        require(msg.sender == socialModule, "Unauthorized");
        require(amount <= MAX_WEEKLY_CLAIM, "Amount too high");
        require(lastStepStart[user] > 0, "No step activity started");
        require(block.timestamp - lastStepStart[user] >= MIN_ACTIVITY_DURATION, 
                "Must be active at least 2 minutes");
        uint256 currentWeek = block.timestamp / 1 weeks;
        if (lastRewardWeek[user] < currentWeek) {
            weeklyRewards[user] = 0;
            lastRewardWeek[user] = currentWeek;
        }
        require(weeklyRewards[user] + amount <= MAX_WEEKLY_CLAIM, "Weekly limit");
        uint256 userBalance = balanceOf(user);
        if (userBalance >= MIN_CLAIM_BALANCE) {
            weeklyRewards[user] += amount;
            lastStepStart[user] = 0;
            _transfer(treasury, user, amount);
        } else if (userBalance >= MIN_BALANCE_FOR_ACCUMULATION) {
            pendingStepRewards[user] += amount;
            weeklyRewards[user] += amount;
            lastPendingUpdate[user] = block.timestamp;
            lastStepStart[user] = 0;
            emit PendingRewardAdded(user, amount, "social");
        }
    }

    // MODULE UTILITY FUNCTIONS - WITH GLOBAL LIMITS
    function getFreeBalance(address user) public view returns (uint256) {
        uint256 totalBalance = balanceOf(user);
        uint256 stakedAmount = stakes[user].amount;
        return totalBalance > stakedAmount ? totalBalance - stakedAmount : 0;
    }

    function transferForModule(address from, address to, uint256 amount) external whenNotPaused {
        require(authorizedModules[msg.sender], "Unauthorized");
        require(to != msg.sender, "Module cannot transfer to itself");
        uint256 freeBalance = getFreeBalance(from);
        require(freeBalance >= amount, "Insufficient free balance");
        _transfer(from, to, amount);
    }

    // INFLATION SYSTEM - Only const wallets can trigger
    function triggerInflation() external nonReentrant whenNotPaused {
        require(isConstWallet[msg.sender], "Only const wallets can trigger inflation");
        require(block.timestamp - lastInflationTime >= 180 days, "Too early");
        uint256 currentSupply = totalSupply();
        uint256 totalInflation = (currentSupply * SEMIANNUAL_INFLATION_RATE) / 10000;
        uint256 treasuryShare = (totalInflation * 25) / 100;
        uint256 liquidityShare = (totalInflation * 20) / 100;
        uint256 communityShare = (totalInflation * 35) / 100;
        uint256 teamShare = (totalInflation * 10) / 100;
        uint256 marketingShare = (totalInflation * 10) / 100;
        _mint(treasury, treasuryShare);
        _mint(liquidity, liquidityShare);
        _mint(community, communityShare);
        _mint(team, teamShare);
        _mint(marketing, marketingShare);
        lastInflationTime = block.timestamp;
        emit InflationMinted(totalInflation, block.timestamp);
    }

    // MOBILE APP INTEGRATION
    function setMobileBackend(address _backend) external onlyRole(ADMIN_ROLE) {
        require(_backend != address(0), "Invalid backend");
        mobileAppBackend = _backend;
        authorizedModules[_backend] = true;
    }
    
    function linkUserProfile(string calldata profileId) external {
        require(bytes(profileId).length > 0, "Invalid profile ID");
        require(profileToWallet[profileId] == address(0), "Profile already linked");
        require(bytes(userProfiles[msg.sender]).length == 0, "Wallet already linked");
        userProfiles[msg.sender] = profileId;
        profileToWallet[profileId] = msg.sender;
        walletCreatedAt[msg.sender] = block.timestamp;
        emit UserProfileLinked(msg.sender, profileId);
    }

    function startGame() external whenNotPaused {
        lastGameStart[msg.sender] = block.timestamp;
    }

    function startStep() external whenNotPaused {
        lastStepStart[msg.sender] = block.timestamp;
    }

    // ADMIN FUNCTIONS
    function enableTrading() external onlyRole(ADMIN_ROLE) {
        // Trading enable işlemi kaldırıldı
    }

    function setCoffeeShopModule(address _module) external onlyRole(ADMIN_ROLE) {
        require(_module != address(0), "Invalid module address");
        authorizedModules[_module] = true;
    }

    // OPTIMIZED TRANSFER WITH DEX TAX, REFLECTION AND MAX LIMIT
    function transfer(address to, uint256 amount) public override returns (bool) {
        address owner = _msgSender();
        if (isDEXPair[to]) {
            uint256 fee = (amount * DEX_TAX) / 10000;
            uint256 transferAmount = amount - fee;
            super._transfer(owner, to, transferAmount);
            _distributeReflection(fee);
        } else {
            super._transfer(owner, to, amount);
        }
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        address spender = _msgSender();
        uint256 currentAllowance = allowance(from, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "Insufficient allowance");
            _approve(from, spender, currentAllowance - amount);
        }
        if (isDEXPair[to]) {
            uint256 fee = (amount * DEX_TAX) / 10000;
            uint256 transferAmount = amount - fee;
            super._transfer(from, to, transferAmount);
            _distributeReflection(fee);
        } else {
            super._transfer(from, to, amount);
        }
        return true;
    }

    function _distributeReflection(uint256 amount) private {
        uint256 total = totalSupply();
        if (total == 0) return;
        super._transfer(address(this), community, amount);
    }

    // VIEW FUNCTIONS
    function getInflationInfo() external view returns (uint256 lastTime, uint256 nextTime, bool canTrigger) {
        lastTime = lastInflationTime;
        nextTime = lastInflationTime + 180 days;
        canTrigger = block.timestamp >= nextTime;
    }

    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 pendingReward
    ) {
        Stake memory userStake = stakes[user];
        return (userStake.amount, userStake.startTime, _calculateReward(user));
    }

    function getPendingRewardsStatus(address user) external view returns (
        uint256 totalPending,
        uint256 gameRewards,
        uint256 stepRewards,
        uint256 snapRewards,
        bool canClaim,
        bool hasExpired
    ) {
        gameRewards = pendingGameRewards[user];
        stepRewards = pendingStepRewards[user];
        snapRewards = pendingSnapRewards[user];
        totalPending = gameRewards + stepRewards + snapRewards;
        canClaim = balanceOf(user) >= MIN_CLAIM_BALANCE && totalPending > 0;
        if (lastPendingUpdate[user] > 0) {
            uint256 timeSinceUpdate = block.timestamp - lastPendingUpdate[user];
            hasExpired = timeSinceUpdate > PENDING_REWARD_EXPIRY;
        } else {
            hasExpired = false;
        }
    }

    function getUserProfile(address wallet) external view returns (string memory) {
        return userProfiles[wallet];
    }
    
    function getWalletByProfile(string calldata profileId) external view returns (address) {
        return profileToWallet[profileId];
    }

    function getRemainingDailyLimit(address _user) external view returns (uint256) {
        uint256 currentWeek = block.timestamp / 1 weeks;
        if (lastRewardWeek[_user] < currentWeek) return MAX_WEEKLY_CLAIM;
        return MAX_WEEKLY_CLAIM > weeklyRewards[_user] ? MAX_WEEKLY_CLAIM - weeklyRewards[_user] : 0;
    }

    // Emergency pause fonksiyonları
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // --- AIRDROP ---
    mapping(address => bool) public hasClaimedAirdrop;
    uint256 public airdropAmount = 50000 * 1e18;
    bool public airdropActive = true;

    function setAirdropActive(bool _active) external onlyRole(ADMIN_ROLE) {
        airdropActive = _active;
    }

    function claimAirdrop() external {
        require(airdropActive, "Airdrop is not active");
        require(!hasClaimedAirdrop[msg.sender], "Already claimed");
        require(msg.sender.balance >= 0.01 ether, "Not enough ETH balance");
        hasClaimedAirdrop[msg.sender] = true;
        _transfer(treasury, msg.sender, airdropAmount);
    }
}