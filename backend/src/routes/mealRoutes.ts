import express from "express";
import { getUserMeals, createMeal, removeMeal } from "../controller/mealController";
import { authenticate } from "../utils/authenticate";

const router = express.Router();

router.get("/meals", authenticate, getUserMeals);
router.post("/meals", authenticate, createMeal);
router.delete("/meals/:id", authenticate, removeMeal);

export default router;
