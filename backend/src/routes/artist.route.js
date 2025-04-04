import { Router } from "express";
import { getAllArtist } from "../controller/artist.controller.js";

const router = Router();

router.get("/", getAllArtist);
// router.get("/featured", getFeaturedSongs);
// router.get("/made-for-you", getMadeForYouSongs);
// router.get("/trending", getTrendingSongs);

export default router;
