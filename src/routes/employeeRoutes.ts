// routes/employeeRoutes.js
import { Router } from 'express';
import { chekingTokenAdmin,checkingTokenEmployee } from '../Middleware';
import AdminEmployeeController from '../Controllers/Employee';
import { GCLOUD ,upload} from '../utils/multerConfig';

const router = Router();

// Employee management routes
router.get('/perfil',checkingTokenEmployee,  AdminEmployeeController.getOneEmployee);


export default router;
