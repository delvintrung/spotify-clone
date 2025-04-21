import { Router } from "express";
import {
  checkAdmin,
  createAlbum,
  createSong,
  updateSong,
  deleteAlbum,
  deleteSong,
  createArtist,
  updatePlaylist,
} from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// router.use(requireAdmin);

router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.put("/songs", updateSong);
router.post("/artists", createArtist);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);
router.put("/playlists/:id", updatePlaylist);

export default router;
