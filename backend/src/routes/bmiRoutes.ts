import express from "express";
import {
  fetchAllBMI,
  fetchLatestBMI,
  addBMI,
  deleteBMIRecord,
} from "../controller/bmiController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.get("/bmi", authenticate, fetchAllBMI);
router.get("/bmi/latest", authenticate, fetchLatestBMI);
router.post("/bmi", authenticate, addBMI);
router.delete("/bmi/:id", authenticate, deleteBMIRecord);

export default router;
