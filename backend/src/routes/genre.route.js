import { Router } from "express";
import { getAllGenres } from "../controller/genre.controller.js";

const router = Router();
router.get("/", getAllGenres);

export default router;
