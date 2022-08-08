// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GeorgeToken is ERC20 {

    uint256 public mintCost;

    address public owner;

    event withdrawal(address indexed to, uint256 amount);

    event georgeCoinMinted( address indexed to, uint256 amount);

    constructor () ERC20("GeorgeCoin", "GC") {

        mintCost = 0.1 ether;

        owner = msg.sender;

    }

    function mintGeorgeCoin( uint256 _amount) external payable {

        require(msg.value == mintCost);

        _mint(msg.sender, _amount);

        emit georgeCoinMinted(msg.sender, _amount);

    }

    function withdraw() external onlyOwner {

        uint256 balace = address(this).balance;

        require(balace > 0, 'insuficents found');

        payable(msg.sender).transfer(balace);

        emit withdrawal(msg.sender, balace);

    }

    modifier onlyOwner{

        require(msg.sender == owner);

        _;

    }

}
