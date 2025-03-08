import supabase from '../config/supabaseClient.js';

// Get all recurring incomes
export const getRecurringIncomes = async (req, res) => {
  try {
    const { data, error } = await supabase.from('recurring_incomes').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Create a recurring income
export const createRecurringIncome = async (req, res) => {
  try {
    const { title, description, amount, currency, start_date, end_date } = req.body;

    // Log admin_id to debug
    console.log('Admin ID in Request:', req.user ? req.user.admin_id : 'No Admin ID');

    if (!req.user || !req.user.admin_id) {
      return res.status(400).json({ error: 'Missing admin_id' });
    }

    const { data, error } = await supabase
      .from('recurring_incomes')
      .insert([{ 
        title, 
        description, 
        amount, 
        currency, 
        start_date, 
        end_date, 
        admin_id: req.user.admin_id // Ensure it is correct
      }])
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({ message: 'Recurring income created', income: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//  Edit Recurring Income
export const updateRecurringIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, amount, currency, start_date, end_date } = req.body;

    // ✅ Ensure user is Admin or Subadmin
    if (req.user.role !== 'admin' && req.user.role !== 'subadmin') {
      return res.status(403).json({ error: 'Unauthorized: Only admin and subadmin can edit' });
    }

    const { data, error } = await supabase
      .from('recurring_incomes')
      .update({ title, description, amount, currency, start_date, end_date })
      .eq('id', id)
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Recurring income updated successfully!', income: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Delete Recurring Income
export const deleteRecurringIncome = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Ensure user is Admin or Subadmin
    if (req.user.role !== 'admin' && req.user.role !== 'subadmin') {
      return res.status(403).json({ error: 'Unauthorized: Only admin and subadmin can delete' });
    }

    const { data, error } = await supabase
      .from('recurring_incomes')
      .delete()
      .eq('id', id)
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Recurring income deleted successfully!', income: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


