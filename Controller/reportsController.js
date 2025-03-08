import supabase from "../config/supabaseClient.js";

// 🟢 Get Yearly Report (from incomes & expenses)
export const getYearlyReport = async (req, res) => {
  try {
    console.log("📢 Fetching Yearly Report...");

    const { year } = req.query;
    if (!year) return res.status(400).json({ error: "Year is required" });

    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    // Fetch incomes
    const { data: incomes, error: incomeError } = await supabase
      .from("incomes")
      .select("amount, date_time")
      .gte("date_time", startDate)
      .lte("date_time", endDate);

    if (incomeError) {
      console.error("❌ Supabase Income Error:", incomeError.message);
      return res.status(500).json({ error: incomeError.message });
    }

    // Fetch expenses
    const { data: expenses, error: expenseError } = await supabase
      .from("expenses")
      .select("amount, date_time")
      .gte("date_time", startDate)
      .lte("date_time", endDate);

    if (expenseError) {
      console.error("❌ Supabase Expense Error:", expenseError.message);
      return res.status(500).json({ error: expenseError.message });
    }

    console.log("✅ Yearly Report Fetched!");
    
    res.json({
      totalIncome: incomes.reduce((sum, inc) => sum + inc.amount, 0),
      totalExpense: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    });
  } catch (err) {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get Monthly Report (from incomes & expenses)
export const getMonthlyReport = async (req, res) => {
  try {
    console.log("📢 Fetching Monthly Report...");

    const { year, month } = req.query;
    if (!year || !month) return res.status(400).json({ error: "Year and month are required" });

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

    // Fetch incomes
    const { data: incomes, error: incomeError } = await supabase
      .from("incomes")
      .select("amount, date_time")
      .gte("date_time", startDate)
      .lte("date_time", endDate);

    if (incomeError) {
      console.error("❌ Supabase Income Error:", incomeError.message);
      return res.status(500).json({ error: incomeError.message });
    }

    // Fetch expenses
    const { data: expenses, error: expenseError } = await supabase
      .from("expenses")
      .select("amount, date_time")
      .gte("date_time", startDate)
      .lte("date_time", endDate);

    if (expenseError) {
      console.error("❌ Supabase Expense Error:", expenseError.message);
      return res.status(500).json({ error: expenseError.message });
    }

    console.log("✅ Monthly Report Fetched!");

    res.json({
      totalIncome: incomes.reduce((sum, inc) => sum + inc.amount, 0),
      totalExpense: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    });
  } catch (err) {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get Weekly Report (from incomes & expenses)
export const getWeeklyReport = async (req, res) => {
  try {
    console.log("📢 Fetching Weekly Report...");

    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) return res.status(400).json({ error: "Start date and end date are required" });

    // Fetch incomes
    const { data: incomes, error: incomeError } = await supabase
      .from("incomes")
      .select("amount, date_time")
      .gte("date_time", start_date)
      .lte("date_time", end_date);

    if (incomeError) {
      console.error("❌ Supabase Income Error:", incomeError.message);
      return res.status(500).json({ error: incomeError.message });
    }

    // Fetch expenses
    const { data: expenses, error: expenseError } = await supabase
      .from("expenses")
      .select("amount, date_time")
      .gte("date_time", start_date)
      .lte("date_time", end_date);

    if (expenseError) {
      console.error("❌ Supabase Expense Error:", expenseError.message);
      return res.status(500).json({ error: expenseError.message });
    }

    console.log("✅ Weekly Report Fetched!");

    res.json({
      totalIncome: incomes.reduce((sum, inc) => sum + inc.amount, 0),
      totalExpense: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    });
  } catch (err) {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
