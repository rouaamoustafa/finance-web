import express from "express";
import { getYearlyReport, getMonthlyReport, getWeeklyReport } from "../Controller/reportsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/yearly", authMiddleware, getYearlyReport);
router.get("/monthly", authMiddleware, getMonthlyReport);
router.get("/weekly", authMiddleware, getWeeklyReport);

export default router;
