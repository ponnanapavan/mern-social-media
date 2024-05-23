import express from 'express';
import protectRoute from '../middlewares/RouteProtect.js';
import { getMessages, getconversations, sendMessage } from '../controllers/messageController.js';

const router=express.Router();
router.get('/conversations', protectRoute, getconversations)
router.post('/', protectRoute, sendMessage)// store the messages in database
router.get("/:otherUserId", protectRoute, getMessages)




export default router;