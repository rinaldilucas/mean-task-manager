import { Router } from 'express';
import { check } from 'express-validator';

import Controller from '@api/controllers/auth.controller';
import refreshMiddleware from '@api/middlewares/refresh.middleware';
import { bruteforce } from '@api/middlewares/security.middleware';
import { verifyValidations } from '@api/middlewares/validator.middleware';

const routes = Router();

// authenticate
routes.post(
  '/api/auth/authenticate',
  check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({ min: 5 }).isLength({ max: 150 }).not().isEmpty().normalizeEmail().trim(),
  check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
  bruteforce.prevent,
  verifyValidations,
  Controller.authenticate,
);

// register
routes.post(
  '/api/auth/register',
  check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({ min: 5 }).isLength({ max: 150 }).not().isEmpty().normalizeEmail().trim(),
  check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
  verifyValidations,
  Controller.register,
);

// get by email
routes.get('/api/auth/email-exists/:email', Controller.checkIfEmailExists);

// change password
routes.put(
  '/api/auth/changePassword',
  check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
  verifyValidations,
  Controller.changePassword,
);

// refresh token
routes.post('/api/auth/refresh', refreshMiddleware, Controller.refreshToken);

// logout
routes.post('/api/auth/logout', Controller.logout);

export default routes;
