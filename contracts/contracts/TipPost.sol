// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TipPost is ReentrancyGuard {
    // ============ CONSTANTS ============
    uint256 public constant LIKEMINIMUM_COST = 0.0001 ether;
    uint256 public constant MAX_CAPTION_LENGTH = 280;

    // ============ STRUCTS ============
    struct Post {
        uint256 id;
        address creator;
        string imageUrl;
        string caption;
        uint96 tipAmount;
        uint32 timestamp;
    }

    // ============ STATE VARIABLES ============
    uint256 public postCount;
    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    mapping(address => uint256) public totalEarnedByUser;

    // ============ EVENTS ============
    event PostCreated(
        uint256 indexed postId,
        address indexed creator,
        string imageUrl,
        string caption,
        uint256 timestamp
    );

    event PostLiked(
        uint256 indexed postId,
        address indexed liker,
        address indexed creator,
        uint256 amount
    );

    // ============ CUSTOM ERRORS ============
    error ZeroAmount();
    error PostNotFound(uint256 postId);
    error CannotLikeOwnPost();
    error AlreadyLiked(uint256 postId);
    error TransferFailed();
    error CaptionTooLong(uint256 length, uint256 maxLength);
    error EmptyImageUrl();

    // ============ FUNCTIONS ============

    function createPost(string calldata _imageUrl, string calldata _caption) external {
        // CHECKS
        if (bytes(_imageUrl).length == 0) revert EmptyImageUrl();
        if (bytes(_caption).length > MAX_CAPTION_LENGTH) {
            revert CaptionTooLong(bytes(_caption).length, MAX_CAPTION_LENGTH);
        }

        // EFFECTS
        postCount++;
        uint256 newPostId = postCount;

        posts[newPostId] = Post({
            id: newPostId,
            creator: msg.sender,
            imageUrl: _imageUrl,
            caption: _caption,
            tipAmount: 0,
            timestamp: uint32(block.timestamp)
        });

        // Emit event after state changes
        emit PostCreated(
            newPostId,
            msg.sender,
            _imageUrl,
            _caption,
            block.timestamp
        );
    }

    function likePost(uint256 _postId) external payable nonReentrant {
        // CHECKS
        if (msg.value < LIKEMINIMUM_COST) revert ZeroAmount();
        if (_postId == 0 || _postId > postCount) revert PostNotFound(_postId);

        Post storage post = posts[_postId];
        if (post.creator == msg.sender) revert CannotLikeOwnPost();
        if (hasLiked[_postId][msg.sender]) revert AlreadyLiked(_postId);

        // EFFECTS (before interactions)
        hasLiked[_postId][msg.sender] = true;
        post.tipAmount += uint96(msg.value);
        totalEarnedByUser[post.creator] += msg.value;

        // INTERACTIONS (last)
        (bool success, ) = payable(post.creator).call{value: msg.value}("");
        if (!success) revert TransferFailed();

        // Emit event
        emit PostLiked(_postId, msg.sender, post.creator, msg.value);
    }

    function getAllPosts() external view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCount);
        for (uint256 i = 1; i <= postCount; i++) {
            allPosts[i - 1] = posts[i];
        }
        return allPosts;
    }

    function getPost(uint256 _postId) external view returns (Post memory) {
        if (_postId == 0 || _postId > postCount) revert PostNotFound(_postId);
        return posts[_postId];
    }

    function checkLiked(uint256 _postId, address _user) external view returns (bool) {
        return hasLiked[_postId][_user];
    }

    function getTotalEarned(address _user) external view returns (uint256) {
        return totalEarnedByUser[_user];
    }
}
