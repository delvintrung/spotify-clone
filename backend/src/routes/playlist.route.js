import { Router } from "express";
import {
  addSongToPlaylist,
  createPlaylist,
  getPlaylists,
  getPlaylistsById,
} from "../controller/playlist.controller.js";

const router = Router();

router.post("/", createPlaylist);
router.get("/", getPlaylists);
router.get("/:playlistId", getPlaylistsById);
router.patch("/add_song", addSongToPlaylist);

export default router;
