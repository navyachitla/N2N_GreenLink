package com.greenlink.service;

import com.greenlink.dto.CommunityDto.*;
import com.greenlink.entity.Comment;
import com.greenlink.entity.CommunityPost;
import com.greenlink.entity.User;
import com.greenlink.exception.ForbiddenException;
import com.greenlink.exception.ResourceNotFoundException;
import com.greenlink.repository.CommentRepository;
import com.greenlink.repository.CommunityPostRepository;
import com.greenlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    @Autowired
    private CommunityPostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardService rewardService;

    public List<PostResponse> getAllPosts(String category) {
        List<CommunityPost> posts;
        if (category != null && !category.trim().isEmpty()) {
            posts = postRepository.findByCategoryOrderByCreatedAtDesc(category);
        } else {
            posts = postRepository.findAllByOrderByCreatedAtDesc();
        }
        return posts.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public PostResponse getPostById(Long id) {
        CommunityPost post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community post not found with id " + id));
        return mapToResponse(post);
    }

    @Transactional
    public PostResponse createPost(Long userId, PostRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CommunityPost post = new CommunityPost();
        post.setUser(user);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCategory(request.getCategory());

        post = postRepository.save(post);

        // Award points for community contribution
        rewardService.addPoints(user, 15, "COMMUNITY_POST", "Created community post: " + post.getTitle());

        return mapToResponse(post);
    }

    @Transactional
    public PostResponse updatePost(Long postId, Long userId, PostRequest request) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only edit your own posts");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCategory(request.getCategory());

        post = postRepository.save(post);
        return mapToResponse(post);
    }

    @Transactional
    public void deletePost(Long postId, Long userId, boolean isAdmin) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!isAdmin && !post.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only delete your own posts");
        }

        postRepository.delete(post);
    }

    @Transactional
    public CommentResponse addComment(Long postId, Long userId, CommentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(request.getContent());

        comment = commentRepository.save(comment);

        // Award points for commenting
        rewardService.addPoints(user, 5, "COMMUNITY_COMMENT", "Commented on post #" + postId);

        CommentResponse res = new CommentResponse();
        res.setId(comment.getId());
        res.setUserId(user.getId());
        res.setUserName(user.getFullName());
        res.setContent(comment.getContent());
        res.setCreatedAt(comment.getCreatedAt());
        return res;
    }

    @Transactional
    public PostResponse likePost(Long postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        post.setLikesCount(post.getLikesCount() + 1);
        post = postRepository.save(post);
        return mapToResponse(post);
    }

    private PostResponse mapToResponse(CommunityPost post) {
        PostResponse res = new PostResponse();
        res.setId(post.getId());
        if (post.getUser() != null) {
            res.setUserId(post.getUser().getId());
            res.setUserName(post.getUser().getFullName());
        }
        res.setTitle(post.getTitle());
        res.setContent(post.getContent());
        res.setCategory(post.getCategory());
        res.setLikesCount(post.getLikesCount());
        res.setCreatedAt(post.getCreatedAt());

        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(post.getId());
        res.setCommentsCount(comments.size());

        List<CommentResponse> commentResponses = comments.stream().map(c -> {
            CommentResponse cr = new CommentResponse();
            cr.setId(c.getId());
            if (c.getUser() != null) {
                cr.setUserId(c.getUser().getId());
                cr.setUserName(c.getUser().getFullName());
            }
            cr.setContent(c.getContent());
            cr.setCreatedAt(c.getCreatedAt());
            return cr;
        }).collect(Collectors.toList());

        res.setComments(commentResponses);
        return res;
    }
}
