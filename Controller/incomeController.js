// import supabase from '../config/supabaseClient.js';

// // Get all incomes
// export const getIncomes = async (req, res) => {
//     const { data, error } = await supabase.from('income').select('*');
//     if (error) return res.status(500).json({ error: error.message });
//     res.json(data);
// };

// // incomeController.js
// export const createIncome = async (req, res) => {
//   const { description, amount, currency, date_time } = req.body;

//   // Check if all required fields are present
//   if (!description || !amount || !currency || !date_time ) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }



//   // Insert income data (description, amount, currency, date_time)
//   const { data, error } = await supabase
//     .from('income')
//     .insert([
//       {
//         description,
//         amount,
//         currency,
//         date_time,
//       },
//     ]);

//   if (error) {
//     return res.status(500).json({ error: 'Error saving income data', details: error.message });
//   }

//   // Respond with success
//   res.status(200).json({
//     message: 'Income created successfully',
//     data: { description, amount, currency, date_time },
//   });
// };

// // Delete an income entry
// export const deleteIncome = async (req, res) => {
//     const { id } = req.params;
//     const { data, error } = await supabase.from('income').delete().eq('id', id);
//     if (error) return res.status(500).json({ error: error.message });
//     res.json({ message: 'Income deleted successfully', data });
// };
