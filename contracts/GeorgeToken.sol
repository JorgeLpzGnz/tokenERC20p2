// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GeorgeToken is ERC20 {

    uint256 public mintCost;

    address public owner;

    event withdrawal(address indexed to, uint256 amount);

    event georgeCoinMinted( address indexed to, uint256 amount);

    constructor (uint256 _amount) ERC20("GeorgeCoin", "GC") {

        _mint(msg.sender, _amount);

        mintCost = 0.1 ether;

        owner = msg.sender;

    }

    function mintGeorgeCoin( uint256 _amount) external payable {

        require(msg.value == mintCost, 'incorect value check mintCost');

        _mint(msg.sender, _amount);

        emit georgeCoinMinted(msg.sender, _amount);

    }

    function decimals() public view virtual override returns ( uint8 ) {

        return 6;

    }

    function withdraw() external onlyOwner {

        uint256 balace = address(this).balance;

        require(balace > 0, 'Not founds to transfer');

        payable(msg.sender).transfer(balace);

        emit withdrawal(msg.sender, balace);

    }

    modifier onlyOwner{

        require(msg.sender == owner, 'OnlyOwner Access');

        _;

    }

}
