import supabase from '../config/supabaseClient.js';

// Fetch all profit goals (Admins & Subadmins)
export const getProfitGoals = async (req, res) => {
  try {
    console.log('📢 Fetching Profit Goals from Supabase...');
    
    const { data, error } = await supabase.from('profit_goal').select('*');

    if (error) {
      console.error('❌ Supabase Error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Profit Goals Fetched:', data);
    return res.json(data);
  } catch (err) {
    console.error('❌ Server Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};



// Create a new profit goal (ONLY Subadmins)
export const createProfitGoal = async (req, res) => {
  try {
    console.log('📢 New Profit Goal Request:', req.body);

    if (req.user.role !== 'subadmin') {
      console.warn('⛔ Unauthorized attempt to add profit goal');
      return res.status(403).json({ error: 'Only subadmins can add profit goals' });
    }

    const { amount, currency, date } = req.body;
    if (!amount || !currency || !date) {
      console.warn('⚠️ Missing required fields:', { amount, currency, date });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('profit_goal')
      .insert([{ amount, currency, date, admin_id: req.user.admin_id }])
      .select('*');

    if (error) {
      console.error('❌ Supabase Insert Error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Profit Goal Created:', data[0]);
    res.status(201).json({ message: 'Profit goal created', profit_goal: data[0] });
  } catch (err) {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};


// Delete a profit goal (ONLY Subadmins)
export const deleteProfitGoal = async (req, res) => {
  try {
    console.log('📢 Deleting Profit Goal ID:', req.params.id);

    if (req.user.role !== 'subadmin') {
      console.warn('⛔ Unauthorized attempt to delete profit goal');
      return res.status(403).json({ error: 'Only subadmins can delete profit goals' });
    }

    const { id } = req.params;
    const { data, error } = await supabase
      .from('profit_goal')
      .delete()
      .eq('profit_goal_id', id);

    if (error) {
      console.error('❌ Supabase Deletion Error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Profit Goal Deleted:', id);
    res.json({ message: 'Profit goal deleted' });
  } catch (err) {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update an existing profit goal (ONLY Subadmins)
export const updateProfitGoal = async (req, res) => {
  try {
    console.log('📢 Updating Profit Goal ID:', req.params.id);

    if (req.user.role !== 'subadmin') {
      console.warn('⛔ Unauthorized attempt to update profit goal');
      return res.status(403).json({ error: 'Only subadmins can update profit goals' });
    }

    const { id } = req.params;
    const { amount, currency, date } = req.body;

    if (!amount || !currency || !date) {
      console.warn('⚠️ Missing required fields:', { amount, currency, date });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('profit_goal')
      .update({ amount, currency, date })
      .eq('profit_goal_id', id)
      .select('*');

    if (error) {
      console.error('❌ Supabase Update Error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Profit Goal Updated:', data[0]);
    res.json({ message: 'Profit goal updated successfully!', profit_goal: data[0] });
  } catch (err) {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
