import { Router } from "express";
import {
  checkAdmin,
  createAlbum,
  createSong,
  updateSong,
  deleteAlbum,
  deleteSong,
} from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { createArtist } from "../controller/artist.controller.js";

const router = Router();

router.use(requireAdmin);

router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.put("/songs", updateSong);
router.post("/artists", createArtist);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;
