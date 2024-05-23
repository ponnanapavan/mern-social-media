import express from 'express';
import { createPost, deletePost, getPost, getUserPosts, postLikedUnliked, replyToPost } from '../controllers/postController.js';
import protectRoute from '../middlewares/RouteProtect.js';
const router=express.Router();

router.get('/:postId',getPost);// dpends on id we can acces the post 
router.get('/users/:username',getUserPosts);// dpends on id we can acces the post 
router.post('/create', protectRoute ,createPost)// to create post i have to return 
router.delete('/:id',protectRoute,deletePost)
router.put('/like/:id',protectRoute,postLikedUnliked)
router.put('/reply/:id',protectRoute,replyToPost)
export default router;