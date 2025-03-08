import supabase from '../config/supabaseClient.js';

//  Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const { data, error } = await supabase.from('expenses').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//  Create expense
export const createExpense = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'subadmin') {
      return res.status(403).json({ error: 'Only admin or subadmin can add expenses' });
    }

    const { title, description, amount, currency } = req.body;
    if (!title || !amount || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ title, description, amount, currency, admin_id: req.user.admin_id }])
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({ message: 'Expense created', expense: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🟢 Update expense
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, amount, currency } = req.body;

    if (!title || !amount || !currency) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { data: findData, error: findError } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (findError) return res.status(500).json({ error: findError.message });
    if (!findData) return res.status(404).json({ error: 'Expense not found' });

    // ✅ Allow only Admin & Subadmin to edit any expense
    if (req.user.role !== 'admin' && req.user.role !== 'subadmin') {
      return res.status(403).json({ error: 'You do not have permission to edit this expense' });
    }

    const { data, error } = await supabase
      .from('expenses')
      .update({ title, description, amount, currency })
      .eq('id', id)
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Expense updated', expense: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the expense first
    const { data: findData, error: findError } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (findError) return res.status(500).json({ error: findError.message });
    if (!findData) return res.status(404).json({ error: 'Expense not found' });

    // ✅ Allow both Admin and Subadmin to delete any expense
    if (req.user.role !== 'admin' && req.user.role !== 'subadmin') {
      return res.status(403).json({ error: 'You do not have permission to delete this expense' });
    }

    // Delete expense
    const { data, error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Expense deleted successfully', expense: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

