// server.js (ESM style)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware.js';

import adminRoutes from './Routes/adminRoutes.js';
import incomesRoutes from './Routes/incomesRoutes.js';
import expensesRoutes from './Routes/expensesRoutes.js';
import recurringExpensesRoutes from './Routes/recurringExpensesRoutes.js';
import recurringIncomesRoutes from './Routes/recurringIncomesRoutes.js';
import profitGoalRoutes from './Routes/profitGoalRoutes.js';
import reportsRoutes from './Routes/reportsRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173", 
   "https://finance-web-front-end.vercel.app", 
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,  
  })
);

// 🔹 Enforce HTTPS in production
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// ✅ Public routes (No auth required)
app.use('/admins', adminRoutes);

// ✅ Protected routes (Require JWT auth)
app.use('/incomes', authMiddleware, incomesRoutes);
app.use('/expenses', authMiddleware, expensesRoutes);
app.use('/recurring_expenses', authMiddleware, recurringExpensesRoutes);
app.use('/recurring_incomes', authMiddleware, recurringIncomesRoutes);
app.use('/profit_goals', authMiddleware, profitGoalRoutes);
app.use('/reports', authMiddleware, reportsRoutes);


app.get('/', (req, res) => {
  res.send('Backend is running with JWT auth!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
