import { Router } from 'express';
import { signUp, logIn } from '../controllers/authController';
import { signUpSchema, loginSchema } from '../validation/authValidation';
import validate from '../middlewares/validate';

const router = Router();

router.post('/signup', validate(signUpSchema), signUp);
router.post('/login', validate(loginSchema), logIn);

export default router;