package com.greenlink.controller;

import com.greenlink.dto.AuthDto.MessageResponse;
import com.greenlink.dto.CommunityDto.*;
import com.greenlink.security.UserPrincipal;
import com.greenlink.service.CommunityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/posts")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(communityService.getAllPosts(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.getPostById(id));
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@AuthenticationPrincipal UserPrincipal currentUser,
                                                    @Valid @RequestBody PostRequest request) {
        return ResponseEntity.ok(communityService.createPost(currentUser.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long id,
                                                    @AuthenticationPrincipal UserPrincipal currentUser,
                                                    @Valid @RequestBody PostRequest request) {
        return ResponseEntity.ok(communityService.updatePost(id, currentUser.getId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deletePost(@PathVariable Long id,
                                                       @AuthenticationPrincipal UserPrincipal currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        communityService.deletePost(id, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(new MessageResponse("Post deleted successfully", true));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long id,
                                                      @AuthenticationPrincipal UserPrincipal currentUser,
                                                      @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(communityService.addComment(id, currentUser.getId(), request));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<PostResponse> likePost(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.likePost(id));
    }
}
