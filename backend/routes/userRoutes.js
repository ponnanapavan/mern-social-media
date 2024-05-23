import express from 'express'
import {FreezeAccount, followUnFollowUser, getUserSuggestion, logoutUser, signupUser, updateUser, userGetProfile} from '../controllers/userController.js';
import { loginUser } from '../controllers/userController.js';
import protectRoute from '../middlewares/RouteProtect.js';
import {  getData } from '../controllers/userController.js';

const router=express.Router();

router.get("/suggested",protectRoute, getUserSuggestion)
router.get('/profile/:query',userGetProfile)// get the user profile by using username
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post('/follow/:id',protectRoute, followUnFollowUser);
router.put('/update/:id',protectRoute, updateUser)
router.get('/getuser',protectRoute, getData);// it will give posts 
router.put('/freeze',protectRoute,FreezeAccount)


export default router