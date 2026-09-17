import express, { type Request, type Response } from "express";

// import middlewares
import morgan from "morgan";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.ts";
import invalidJsonMiddleware from "./middlewares/invalidJsonMiddleware.ts";

//import routes
import usersRoutes from "./routes/usersRoutes.ts";
import itemsRoutes from "./routes/itemsRoutes.ts";

const app = express();
const port = 3000;

// body parser middleware
app.use(express.json());

// logger middleware
app.use(morgan("dev"));
// app.use(morgan("combined"));

// Endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Quiz #2 - API service");
});

app.get("/me", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Quiz #2 - API service",
  });
});

app.use("/api/v704", usersRoutes);

app.use("/api/v704/cart", itemsRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

app.get("/student", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Student Information",
    data: {
      studentId: "680610704",
      firstName: "Phakin",
      lastName: "Ounruen",
      section: "001",
    },
  });
});

// Export app for vercel deployment
export default app;
