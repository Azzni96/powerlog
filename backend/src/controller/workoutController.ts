import { Request, Response } from "express";
import {
  getWorkouts,
  assignWorkouts,
  markWorkoutDone,
  deleteWorkout,
} from "../model/workoutModel";

/**
 * @api {get} /api/workouts Get User Workouts
 * @apiName GetUserWorkouts
 * @apiGroup Workout
 * @apiDescription Retrieves workouts for the authenticated user with optional filtering.
 *
 * @apiQuery {String} [is_done] Filter by completion status ("true" or "false")
 *
 * @apiSuccess {Object[]} workouts List of workout entries
 * @apiSuccess {Number} workouts.id Workout ID
 * @apiSuccess {Number} workouts.user_id User ID
 * @apiSuccess {Number} workouts.workout_form_id Workout form ID
 * @apiSuccess {Boolean} workouts.is_done Completion status
 * @apiSuccess {Date} workouts.created_at Creation timestamp
 * @apiSuccess {String} workouts.title Workout title
 * @apiSuccess {String} workouts.description Workout description
 *
 * @apiError {Object} error Error message
 */
export const fetchWorkouts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const isDone = req.query.is_done as string;
    const workouts = await getWorkouts(userId, isDone);
    res.status(200).json(workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {post} /api/workouts Assign Workouts
 * @apiName AssignUserWorkouts
 * @apiGroup Workout
 * @apiDescription Assigns workout forms to the authenticated user.
 *
 * @apiBody {Number[]} workoutFormIds Array of workout form IDs to assign
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
export const assignUserWorkouts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { workoutFormIds } = req.body;

    if (!Array.isArray(workoutFormIds) || workoutFormIds.length === 0) {
      res.status(400).json({ error: "No workoutFormIds provided" });
    }

    await assignWorkouts(userId, workoutFormIds);
    res.status(201).json({ message: "Workouts assigned" });
  } catch (error) {
    console.error("Error assigning workouts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {put} /api/workouts/:id Complete Workout
 * @apiName CompleteWorkout
 * @apiGroup Workout
 * @apiDescription Marks a workout as completed.
 *
 * @apiParam {Number} id Workout ID to mark as completed
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
export const completeWorkout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const workoutId = parseInt(req.params.id);
    await markWorkoutDone(userId, workoutId);
    res.status(200).json({ message: "Workout marked as done" });
  } catch (error) {
    console.error("Error completing workout:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {delete} /api/workouts/:id Delete Workout
 * @apiName DeleteWorkout
 * @apiGroup Workout
 * @apiDescription Deletes a workout assignment.
 *
 * @apiParam {Number} id Workout ID to delete
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
export const removeWorkout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const workoutId = parseInt(req.params.id);
    await deleteWorkout(userId, workoutId);
    res.status(200).json({ message: "Workout deleted" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    res.status(500).json({ error: "Server error" });
  }
};
