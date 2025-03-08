
import supabase from '../config/supabaseClient.js';

export const getIncomes = async (req, res) => {
  try {
    const { data, error } = await supabase.from('incomes').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createIncome = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'subadmin') {
        return res.status(403).json({ error: 'Only admin or subadmin can add incomes' });
      }

    const { title, description, amount, currency } = req.body;
    if (!title || !amount || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('incomes')
      .insert([
        {
          title,
          description,
          amount,
          currency,
          admin_id: req.user.admin_id,
        },
      ])
      .select('*');
      console.log('Creating income with admin_id:', req.user.admin_id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: 'Income created', income: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateIncome = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, amount, currency } = req.body;
  
      if (!title || !amount || !currency) {
        return res.status(400).json({ error: 'Missing fields' });
      }
  
      // Fetch the income first
      const { data: findData, error: findError } = await supabase
        .from('incomes')
        .select('*')
        .eq('id', id)
        .single();
  
      if (findError) return res.status(500).json({ error: findError.message });
      if (!findData) {
        return res.status(404).json({ error: 'Income not found' });
      }
  
      //  Remove Restriction - Allow Both Admin and Subadmin to Edit Any Income
      if (req.user.role !== 'admin' && req.user.role !== 'subadmin') {
        return res.status(403).json({ error: 'You do not have permission to edit this income' });
      }
  
      // Update income
      const { data, error } = await supabase
        .from('incomes')
        .update({ title, description, amount, currency })
        .eq('id', id)
        .select('*');
  
      if (error) return res.status(500).json({ error: error.message });
  
      res.json({ message: 'Income updated', income: data[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}; 

export const deleteIncome = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the income first
      const { data: findData, error: findError } = await supabase
        .from('incomes')
        .select('*')
        .eq('id', id)
        .single();
  
      if (findError) return res.status(500).json({ error: findError.message });
      if (!findData) {
        return res.status(404).json({ error: 'Income not found' });
      }
  
      // 🚀 Remove Restriction - Allow Both Admin and Subadmin to Delete Any Income
      if (req.user.role !== 'admin' && req.user.role !== 'subadmin') {
        return res.status(403).json({ error: 'You do not have permission to delete this income' });
      }
  
      // Delete income
      const { data, error } = await supabase
        .from('incomes')
        .delete()
        .eq('id', id)
        .select('*');
  
      if (error) return res.status(500).json({ error: error.message });
  
      res.json({ message: 'Income deleted', income: data[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  
  

  
