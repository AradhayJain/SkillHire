import express from "express";

import {getChatForSideBar,getMessages,sendMessage,newChat} from "../controllers/message.controller.js";
const router = express.Router();

router.route("/users").get(getChatForSideBar);
router.route("/:id").get(getMessages);
router.route("/send/:id").post(sendMessage);
router.route("/new_chat").post(newChat);

export default router;
