import { Router } from "express";
import controllers from "./controllers.js";
const { insertPost, readPost, updatePost, deletePost } = controllers;

const router = Router({ strict: true });

router.post("/insert-post", insertPost);
router.get("/get-all-posts", readPost);
router.get("/get-post/:post_id", readPost);
router.post("/update-post/:post_id", updatePost);
router.post("/delete-post", deletePost);

export default router;
