import { Router } from 'express';
import adminRoutes from './adminRoutes';
import userRoutes from './userRoutes';
import employeeRoutes from './employeeRoutes';
import paymentRoutes from './paymentsRoutes';
import publicRoutes from './publicRoutes';
import authRoutes from './authRoutes';
import serverRoutes from  "./serverRoutes"

const router = Router();

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/employee', employeeRoutes);
router.use('/payment', paymentRoutes);
router.use('/public', publicRoutes);
router.use('/auth', authRoutes);
router.use('/server', serverRoutes);

export default router;