import supabase from '../config/supabaseClient.js';

// Get all recurring expenses
export const getRecurringExpenses = async (req, res) => {
  try {
    const { data, error } = await supabase.from('recurring_expenses').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Create a new recurring expense
export const createRecurringExpense = async (req, res) => {
  try {
    const { title, description, amount, currency, start_date, end_date } = req.body;

    // Ensure the request includes an authenticated admin ID
    if (!req.user || !req.user.admin_id) {
      return res.status(400).json({ error: 'Missing admin_id' });
    }

    const { data, error } = await supabase
      .from('recurring_expenses')
      .insert([{ title, description, amount, currency, start_date, end_date, admin_id: req.user.admin_id }])
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({ message: 'Recurring expense created', expense: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//  Edit Recurring Expense
export const updateRecurringExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, amount, currency, start_date, end_date } = req.body;

    //  Ensure user is Admin or Subadmin
    if (req.user.role !== 'admin' && req.user.role !== 'subadmin') {
      return res.status(403).json({ error: 'Unauthorized: Only admin and subadmin can edit' });
    }

    const { data, error } = await supabase
      .from('recurring_expenses')
      .update({ title, description, amount, currency, start_date, end_date })
      .eq('id', id)
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Recurring expense updated successfully!', expense: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Delete Recurring Expense
export const deleteRecurringExpense = async (req, res) => {
  try {
    const { id } = req.params;

    //  Ensure user is Admin or Subadmin
    if (req.user.role !== 'admin' && req.user.role !== 'subadmin') {
      return res.status(403).json({ error: 'Unauthorized: Only admin and subadmin can delete' });
    }

    const { data, error } = await supabase
      .from('recurring_expenses')
      .delete()
      .eq('id', id)
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Recurring expense deleted successfully!', expense: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

