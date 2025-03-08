import express from 'express';
import {
  createAdmin,
  getAdmins,
  getAdminsByRole,
  deleteAdmin,
  loginAdmin,
  updateAdmin
} from '../Controller/adminController.js';

import { authMiddleware, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Public Routes (No authentication needed)
router.post('/login', loginAdmin);

// ✅ Protected Routes (Require Authentication)
router.post('/', authMiddleware, authorizeRole(['superadmin','subadmin']), createAdmin); // Only superadmin can create admins
router.get('/', authMiddleware, getAdmins);
router.get('/role', authMiddleware, getAdminsByRole);
router.delete('/:id', authMiddleware, authorizeRole(['superadmin','subadmin']), deleteAdmin); // Only superadmin can delete
router.put("/:id", authMiddleware, authorizeRole(["superadmin", "subadmin"]), updateAdmin);


export default router;
