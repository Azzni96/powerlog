import { Request, Response } from "express";
import {
  getAllWorkoutForms,
  createWorkoutForm,
  updateWorkoutForm,
  deleteWorkoutForm,
} from "../model/workoutFormsModel";

/**
 * @api {get} /api/workout-forms Get All Workout Forms
 * @apiName GetWorkoutForms
 * @apiGroup WorkoutForms
 * @apiDescription Retrieves all workout forms available in the system.
 *
 * @apiSuccess {Object[]} forms List of workout forms
 * @apiSuccess {Number} forms.id Form ID
 * @apiSuccess {String} forms.title Form title
 * @apiSuccess {String} forms.description Form description
 * @apiSuccess {String} forms.category Workout category
 * @apiSuccess {String} forms.equipment Required equipment
 * @apiSuccess {String} forms.difficulty Difficulty level
 * @apiSuccess {String} [forms.photo] Photo filename
 * @apiSuccess {String} [forms.video] Video filename
 * @apiSuccess {Number} forms.duration Workout duration in minutes
 *
 * @apiError {Object} error Error message
 */
export const fetchWorkoutForms = async (req: Request, res: Response) => {
  try {
    const forms = await getAllWorkoutForms();
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching workout forms:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {post} /api/workout-forms Create Workout Form
 * @apiName CreateWorkoutForm
 * @apiGroup WorkoutForms
 * @apiDescription Creates a new workout form with optional media upload.
 *
 * @apiBody {String} title Form title
 * @apiBody {String} description Form description
 * @apiBody {String} category Workout category
 * @apiBody {String} equipment Required equipment
 * @apiBody {String} difficulty Difficulty level
 * @apiBody {Number} duration Workout duration in minutes
 * @apiBody {File} [media] Photo or video file to upload
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 * @apiSuccess {Number} result.id ID of the newly created workout form
 *
 * @apiError {Object} error Error message
 */
export const addWorkoutForm = async (req: Request, res: Response) => {
  try {
    const file = req.file ? req.file.filename : null;

    const workoutData = {
      ...req.body,
      photo: file?.match(/\.(jpg|jpeg|png|gif)$/) ? file : null,
      video: file?.match(/\.(mp4|avi|mkv)$/) ? file : null,
    };
    const id = await createWorkoutForm(workoutData);
    res.status(201).json({ message: "Workout form created", id });
  } catch (error) {
    console.error("Error adding workout form:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {put} /api/workout-forms/:id Update Workout Form
 * @apiName UpdateWorkoutForm
 * @apiGroup WorkoutForms
 * @apiDescription Updates an existing workout form with optional media upload.
 *
 * @apiParam {Number} id Workout form ID to update
 *
 * @apiBody {String} [title] Updated form title
 * @apiBody {String} [description] Updated form description
 * @apiBody {String} [category] Updated workout category
 * @apiBody {String} [equipment] Updated required equipment
 * @apiBody {String} [difficulty] Updated difficulty level
 * @apiBody {Number} [duration] Updated workout duration in minutes
 * @apiBody {File} [media] New photo or video file to upload
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
export const modifyWorkoutForm = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const file = req.file ? req.file.filename : null;

    const workoutData = {
      ...req.body,
      photo: file?.match(/\.(jpg|jpeg|png|gif)$/) ? file : null,
      video: file?.match(/\.(mp4|avi|mkv)$/) ? file : null,
    };

    await updateWorkoutForm(id, workoutData);
    res.status(200).json({ message: "Workout form updated" });
  } catch (error) {
    console.error("Error updating workout form:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {delete} /api/workout-forms/:id Delete Workout Form
 * @apiName DeleteWorkoutForm
 * @apiGroup WorkoutForms
 * @apiDescription Deletes a workout form.
 *
 * @apiParam {Number} id Workout form ID to delete
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
export const removeWorkoutForm = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteWorkoutForm(id);
    res.status(200).json({ message: "Workout form deleted" });
  } catch (error) {
    console.error("Error deleting workout form:", error);
    res.status(500).json({ error: "Server error" });
  }
};
