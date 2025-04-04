import { Router } from "express";
import { getFavoriteById } from "../controller/favorite.controller.js";

const router = Router();

router.get("/favorite", getFavoriteById);

export default router;
