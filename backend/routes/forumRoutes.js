const express = require('express');
// Load in the mongoose models, import everyt at once
const User = require("../models/User")
const ForumPost = require('../models/ForumPost');

const router = express.Router(); // use router for better modularisation 
 
// Create a new forum post
router.post("/", async (req, res) => {
    try {
        const { title, content, author } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({ error: "Title, content, and author are required." });
        }

        const newForumPost = new ForumPost({
            title,
            content,
            author,
        });

        const savedPost = await newForumPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all forum posts
router.get("/forumPosts", async (req, res) => {
    try {
        const forumPosts = await ForumPost.find().populate("author", "name email");
        res.json(forumPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific forum post by ID
router.get("forumPosts/:forumPostId", async (req, res) => {
    try {
        const forumPost = await ForumPost.findById(req.params.forumPostId).populate("author", "name email");
        if (!forumPost) {
            return res.status(404).json({ error: "Forum post not found." });
        }
        res.json(forumPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a forum post
router.put("forumPosts/:forumPostId", async (req, res) => {
    try {
        const { title, content } = req.body;

        const updatedPost = await ForumPost.findByIdAndUpdate(
            req.params.forumPostId,
            { title, content },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "Forum post not found." });
        }

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a forum post --> include cascading for comments deletion
router.delete("forumPosts/:forumPostId", async (req, res) => {
    try {
        const deletedPost = await ForumPost.findByIdAndDelete(req.params.forumPostId);
        if (!deletedPost) {
            return res.status(404).json({ error: "Forum post not found." });
        }
        res.json({ message: "Forum post deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




/* nested part: comments within a post */

router.get('/forumPost/:forumPostId/comments',(req, res) => {
    //get all the comments under a specific forum post
});

router.post('/forumPost/:forumPostId/comments',(req, res) => {
    //create a new comment in a specific post
   
});

router.put('/forumPost/:forumPostId/comments/:commentId',(req, res) => {
    
});

router.delete('forumPost/:forumPostId/comments/:commentId',(req, res) => {
    
});

module.exports= router;


