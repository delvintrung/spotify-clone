import { Router } from "express";
import {
  getFavoriteById,
  addToFavorite,
  removeFromFavorites,
} from "../controller/favorite.controller.js";

const router = Router();

router.get("/favorite", getFavoriteById);
router.post("/", addToFavorite);
router.delete("/", removeFromFavorites);

export default router;
