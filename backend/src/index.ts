import express from "express";
import cors from "cors";
import userroute from "./routes/userroute";
import Questionroute from "./routes/formQuestionRoute";
import foodroute from "./routes/foodRoute";
import  BmiModel  from "./routes/bmiRoute";
import workoutsRoute from "./routes/workoutsRoute";
import workoutFormRoute from "./routes/workoutFormRoute";
import formAnswersRoute from "./routes/formAnswersRoute";
import { ErrorRequestHandler } from "express";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/user", userroute);
app.use("/api/formQuestion", Questionroute);
app.use("/api/food", foodroute);
app.use("/api/bmi", BmiModel);
app.use("/api/workouts", workoutsRoute);
app.use("/api/workout-forms", workoutFormRoute);
app.use("/api/answers", formAnswersRoute);

// Add a global error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Something went wrong",
    details: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};

app.use(errorHandler);

// Add a test endpoint to verify basic functionality
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(
    `Server running on port ${port} and accessible from all interfaces`
  );
});
