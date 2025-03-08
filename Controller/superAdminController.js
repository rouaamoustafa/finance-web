import supabase from '../config/supabaseClient.js';
import dotenv from 'dotenv';
dotenv.config();  

// Initialize Supabase client here
//const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Controller to get all SuperAdmins
const getSuperAdmins = async (req, res) => {
    try {
        const { data, error } = await supabase.from('SuperAdmin').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export  { getSuperAdmins };
