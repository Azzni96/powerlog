import { Request, Response } from "express";
import {
  getProfileByUserId,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../model/profileModel";

/**
 * @api {get} /api/profile Get User Profile
 * @apiName GetUserProfile
 * @apiGroup Profile
 * @apiDescription Retrieves the profile for the authenticated user.
 *
 * @apiSuccess {Object} profile User profile data
 * @apiSuccess {Number} profile.id Profile ID
 * @apiSuccess {Number} profile.user_id User ID
 * @apiSuccess {String} profile.gender User gender
 * @apiSuccess {Number} profile.age User age
 * @apiSuccess {Number} profile.height User height
 * @apiSuccess {Number} profile.weight User weight
 * @apiSuccess {Number} profile.workout_days Weekly workout days
 * @apiSuccess {Number} profile.calorie_target Daily calorie target
 *
 * @apiError {Object} error Error message
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const profile = await getProfileByUserId(userId);

    if (!profile) {
      // Return 404 if no profile found
      res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {post} /api/profile Create User Profile
 * @apiName CreateUserProfile
 * @apiGroup Profile
 * @apiDescription Creates a new profile for the authenticated user.
 *
 * @apiBody {String} gender User gender
 * @apiBody {Number} age User age
 * @apiBody {Number} height User height
 * @apiBody {Number} weight User weight
 * @apiBody {Number} workout_days Number of workout days per week
 * @apiBody {Number} calorie_target Daily calorie target
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
export const createUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Check if user already has a profile
    const existingProfile = await getProfileByUserId(userId);
    if (existingProfile) {
      res.status(409).json({ error: "User already has a profile" });
    }

    const { gender, age, height, weight, workout_days, calorie_target } =
      req.body;
    await createProfile(
      userId,
      gender,
      age,
      height,
      weight,
      workout_days,
      calorie_target
    );
    res.status(201).json({ message: "Profile created" });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {put} /api/profile Update User Profile
 * @apiName UpdateUserProfile
 * @apiGroup Profile
 * @apiDescription Updates the profile for the authenticated user.
 *
 * @apiBody {String} gender Updated gender
 * @apiBody {Number} age Updated age
 * @apiBody {Number} height Updated height
 * @apiBody {Number} weight Updated weight
 * @apiBody {Number} workout_days Updated number of workout days
 * @apiBody {Number} calorie_target Updated calorie target
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { gender, age, height, weight, workout_days, calorie_target } =
      req.body;
    await updateProfile(userId, {
      gender,
      age,
      height,
      weight,
      workout_days,
      calorie_target,
    });
    res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @api {delete} /api/profile Delete User Profile
 * @apiName DeleteUserProfile
 * @apiGroup Profile
 * @apiDescription Deletes the profile for the authenticated user.
 *
 * @apiSuccess {Object} result Result object
 * @apiSuccess {String} result.message Success message
 *
 * @apiError {Object} error Error message
 */
export const deleteUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await deleteProfile(userId);
    res.status(200).json({ message: "Profile deleted" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};
