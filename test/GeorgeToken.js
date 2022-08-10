const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { waffle, ethers } = require("hardhat");
const { expect } = require("chai");

describe("GeorgeToken", function () {

  async function deployConntract(){

    const GeorgeToken = await ethers.getContractFactory('GeorgeToken')

    const [ owner, account ] = await ethers.getSigners()

    const initialSupply = 100000000

    const deploy = await GeorgeToken.deploy(`${initialSupply}`)

    const mintCost = await deploy.mintCost()

    const provider = ethers.provider

    return { deploy, initialSupply, mintCost, owner, account, provider}

  }

  describe('Contract creation', async() => {

    it('Owner must be contract creator', async() => {

      const { deploy, owner } = await loadFixture( deployConntract )

      expect( await deploy.owner()).to.equal( owner.address )

    })

    it('initial supply must be the correct', async() => {

      const { deploy, initialSupply } = await loadFixture( deployConntract )

      expect( await deploy.totalSupply()).to.equal( initialSupply )

    })
  })

  describe('mintGeorgeCoin', async() => {

    it('should mint more tokens', async() => {

      const { deploy, initialSupply, mintCost } = await loadFixture(deployConntract)

      await deploy.mintGeorgeCoin(initialSupply, { value: mintCost})
      
      expect(await deploy.totalSupply()).to.equal(initialSupply + initialSupply)

    })

    it('it should recive user ether', async() => {

      const { deploy, mintCost, initialSupply, provider } = await loadFixture( deployConntract )

      await deploy.mintGeorgeCoin( initialSupply, { value: mintCost })

      const balance = await provider.getBalance( deploy.address )

      expect( ethers.utils.formatEther(balance) ).to.equal( ethers.utils.formatEther(mintCost) )

    })

    it('should emit a mint event', async() => {

      const { deploy, initialSupply, mintCost, account } = await loadFixture( deployConntract )
      
      expect( await deploy.mintGeorgeCoin(initialSupply, { value: mintCost}))

          .to.emit(account.address, initialSupply)

    })

    it('should fail with diferent mint cost', async() => {

      const { deploy, initialSupply} = await loadFixture( deployConntract )

      await expect( deploy.mintGeorgeCoin( initialSupply ) ).to.be.revertedWith( 
        'incorect value check mintCost' 
        )

    })

  })

  describe('Widthdraw', async() => {

    it('It sholud fail when is not the owner', async() => {

      const { deploy, account } = await loadFixture( deployConntract )

      await expect( deploy.connect(account).withdraw() ).to.be.revertedWith( 'OnlyOwner Access' )

    })

    it('It sholud fail, Not Fonds To Tranfer', async() => {

      const { deploy } = await loadFixture( deployConntract )

      await expect( deploy.withdraw() ).to.be.revertedWith( 'Not founds to transfer' )

    })

    it('It sholud withdraw all the contract founds', async() => {

      const { deploy, mintCost, initialSupply, provider } = await loadFixture( deployConntract )

      await deploy.mintGeorgeCoin( initialSupply, { value: mintCost })

      await deploy.withdraw()

      const balance = await provider.getBalance( deploy.address )

      expect( ethers.utils.formatEther(balance) ).to.equal( '0.0' )

    })

  })

});
