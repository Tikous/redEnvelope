// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 <0.9.0;

contract RedEnvelope {
    address payable public host;
    uint256 public totalAmount;
    uint256 public envelopeCount;
    uint256 public remainingCount;
    string public theme;
    bool public isEqual;
    bool public isActive;
    uint256 public createdAt;
    mapping(address => bool) public isGrabbed;
    mapping(address => uint256) public grabbedAmount;
    address[] public grabbers;

    event EnvelopeGrabbed(address indexed grabber, uint256 amount);
    event EnvelopeFinished();

    constructor(
        address payable _host,
        uint256 _envelopeCount, 
        bool _isEqual, 
        string memory _theme
    ) payable {
        require(msg.value > 0, 'Amount must be greater than 0');
        require(_envelopeCount > 0, 'Envelope count must be greater than 0');
        
        host = _host;
        envelopeCount = _envelopeCount;
        remainingCount = _envelopeCount;
        isEqual = _isEqual;
        theme = _theme;
        totalAmount = msg.value;
        isActive = true;
        createdAt = block.timestamp;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function grabEnvelope() public {
        require(isActive, 'Red envelope is not active');
        require(remainingCount > 0, 'No more envelopes available');
        require(!isGrabbed[msg.sender], 'You have already grabbed an envelope');
        
        uint256 amount;
        
        if (remainingCount == 1) {
            // 最后一个红包，把剩余的全部给出
            amount = address(this).balance;
        } else {
            if (isEqual) {
                amount = totalAmount / envelopeCount;
            } else {
                // 随机金额，确保不会超过剩余平均值的2倍
                uint256 maxAmount = (address(this).balance * 2) / remainingCount;
                uint256 random = uint256(
                    keccak256(
                        abi.encodePacked(
                            msg.sender,
                            block.timestamp,
                            remainingCount,
                            address(this).balance
                        )
                    )
                ) % 100 + 1;
                amount = (maxAmount * random) / 100;
                
                // 确保至少给1 wei，且不超过余额
                if (amount == 0) amount = 1;
                if (amount > address(this).balance) amount = address(this).balance;
            }
        }
        
        isGrabbed[msg.sender] = true;
        grabbedAmount[msg.sender] = amount;
        grabbers.push(msg.sender);
        remainingCount--;
        
        payable(msg.sender).transfer(amount);
        
        emit EnvelopeGrabbed(msg.sender, amount);
        
        if (remainingCount == 0) {
            isActive = false;
            emit EnvelopeFinished();
        }
    }
    
    function getGrabbers() public view returns (address[] memory) {
        return grabbers;
    }
    
    function getEnvelopeInfo() public view returns (
        address,
        uint256,
        uint256,
        uint256,
        string memory,
        bool,
        bool,
        uint256
    ) {
        return (
            host,
            totalAmount,
            envelopeCount,
            remainingCount,
            theme,
            isEqual,
            isActive,
            createdAt
        );
    }
}

contract RedEnvelopeFactory {
    RedEnvelope[] public redEnvelopes;
    mapping(address => RedEnvelope[]) public userEnvelopes;
    
    event RedEnvelopeCreated(
        address indexed creator,
        address envelopeAddress,
        uint256 amount,
        uint256 count,
        string theme
    );
    
    function createRedEnvelope(
        uint256 _envelopeCount,
        bool _isEqual,
        string memory _theme
    ) public payable returns (address) {
        require(msg.value > 0, 'Amount must be greater than 0');
        require(_envelopeCount > 0, 'Envelope count must be greater than 0');
        
        RedEnvelope newEnvelope = new RedEnvelope{value: msg.value}(
            payable(msg.sender),
            _envelopeCount,
            _isEqual,
            _theme
        );
        
        redEnvelopes.push(newEnvelope);
        userEnvelopes[msg.sender].push(newEnvelope);
        
        emit RedEnvelopeCreated(
            msg.sender,
            address(newEnvelope),
            msg.value,
            _envelopeCount,
            _theme
        );
        
        return address(newEnvelope);
    }
    
    function getAllRedEnvelopes() public view returns (RedEnvelope[] memory) {
        return redEnvelopes;
    }
    
    function getUserRedEnvelopes(address user) public view returns (RedEnvelope[] memory) {
        return userEnvelopes[user];
    }
    
    function getRedEnvelopeCount() public view returns (uint256) {
        return redEnvelopes.length;
    }
}