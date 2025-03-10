import supabase from '../config/supabaseClient.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// ✅ Login Admin with Hashed Password Check
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    // 🔹 Fetch the user by email
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = data[0];

    // 🔹 Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔹 Generate JWT Token
    const payload = { admin_id: user.admin_id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        admin_id: user.admin_id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Create Admin (Only Superadmin)
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('admins')
      .insert([{ name, email, password: hashedPassword, role }]);

    if (error) {
      return res.status(500).json({ error: 'Error creating admin', details: error.message });
    }

    res.status(201).json({ message: 'Admin created successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Admins (Only for Authenticated Users)
export const getAdmins = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('admin_id, name, email, role');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Admins by Role
export const getAdminsByRole = async (req, res) => {
  try {
    const { role } = req.query;
    if (!role) return res.status(400).json({ error: 'Role is required' });

    const { data, error } = await supabase
      .from('admins')
      .select('admin_id, name, email, role')
      .eq('role', role);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Admin (Only Superadmin)
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing admin ID' });

    const { data, error } = await supabase
      .from('admins')
      .delete()
      .eq('admin_id', id)
      .select('*');

    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Admin (Only Superadmin & Subadmin)
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (!id) return res.status(400).json({ error: "Missing admin ID" });

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const { data, error } = await supabase
      .from("admins")
      .update(updateData)
      .eq("admin_id", id)
      .select("*");

    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ error: "Admin not found" });

    res.status(200).json({ message: "Admin updated successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
