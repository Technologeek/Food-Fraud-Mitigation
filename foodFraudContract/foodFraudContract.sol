pragma solidity ^0.5.1;

contract FoodFraudMitigation {
    address payable sender;
    address payable receiver;
    mapping(address => uint256) public balances;

    event Purchase(
        address indexed _buyer,
        uint256 _amount
    ); 
    constructor(address payable _sender, address payable _receiver) public {
        sender = _sender;
        receiver = _receiver;
    }

    function() external payable {
        sendToken();
    }

    function sendToken() public payable {
        balances[msg.sender] += 1;
        receiver.transfer(msg.value);
        emit Purchase(msg.sender, 1);
    }

    function receiveToken() public payable {
        emit Purchase(msg.sender, 1);
    }
}