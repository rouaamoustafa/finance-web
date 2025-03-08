import express from 'express';
import { getSuperAdmins } from '../Controller/superAdminController.js';

const router = express.Router();

// Define the route for SuperAdmins
router.get('/', getSuperAdmins);

export default router;
