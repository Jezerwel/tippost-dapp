import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { TipPost } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TipPost", function () {
  // Fixture to deploy the contract and get signers
  async function deployTipPostFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const TipPostFactory = await ethers.getContractFactory("TipPost");
    const contract = await TipPostFactory.deploy();

    return { contract, owner, addr1, addr2 };
  }

  describe("Post Creation", function () {
    it("should create a post and emit PostCreated event", async function () {
      const { contract, addr1 } = await loadFixture(deployTipPostFixture);
      
      const imageUrl = "https://example.com/image.jpg";
      const caption = "Test caption";

      // Expect the transaction to emit PostCreated event
      await expect(contract.connect(addr1).createPost(imageUrl, caption))
        .to.emit(contract, "PostCreated")
        .withArgs(1, addr1.address, imageUrl, caption, await time.latest());

      // Verify the post was stored correctly
      const post = await contract.getPost(1);
      expect(post.creator).to.equal(addr1.address);
      expect(post.imageUrl).to.equal(imageUrl);
      expect(post.caption).to.equal(caption);
      expect(post.id).to.equal(1);
    });
  });

  describe("Post Liking", function () {
    it("should allow liking a post with ETH tip", async function () {
      const { contract, addr1, addr2 } = await loadFixture(deployTipPostFixture);
      
      // First, create a post
      await contract.connect(addr1).createPost("https://example.com/image.jpg", "Test caption");
      
      const tipAmount = ethers.parseEther("0.0001");
      
      // Like the post with ETH tip
      await expect(contract.connect(addr2).likePost(1, { value: tipAmount }))
        .to.emit(contract, "PostLiked")
        .withArgs(1, addr2.address, addr1.address, tipAmount);

      // Verify the post tip amount was updated
      const post = await contract.getPost(1);
      expect(post.tipAmount).to.equal(tipAmount);
    });

    it("should revert when user tries to like own post", async function () {
      const { contract, addr1 } = await loadFixture(deployTipPostFixture);
      
      // Create a post
      await contract.connect(addr1).createPost("https://example.com/image.jpg", "Test caption");
      
      // Try to like own post - should revert
      await expect(
        contract.connect(addr1).likePost(1, { value: ethers.parseEther("0.0001") })
      ).to.be.revertedWithCustomError(contract, "CannotLikeOwnPost");
    });

    it("should revert when user tries to like twice", async function () {
      const { contract, addr1, addr2 } = await loadFixture(deployTipPostFixture);
      
      // Create a post
      await contract.connect(addr1).createPost("https://example.com/image.jpg", "Test caption");
      
      // Like the post once
      await contract.connect(addr2).likePost(1, { value: ethers.parseEther("0.0001") });
      
      // Try to like again - should revert
      await expect(
        contract.connect(addr2).likePost(1, { value: ethers.parseEther("0.0001") })
      ).to.be.revertedWithCustomError(contract, "AlreadyLiked");
    });
  });
});
