import { Router } from 'express';

import { check } from 'express-validator';

import Controller from '@api/controllers/user.controller';
import authMiddleware from '@api/middlewares/auth.middleware';
import refreshMiddleware from '@api/middlewares/refresh.middleware';
import { bruteforce } from '@api/middlewares/security.middleware';
import { verifyValidations } from '@api/middlewares/validator.middleware';

const routes = Router();

// get all
routes.get('/api/users', authMiddleware, Controller.getAll);

// create
routes.post(
  '/api/users',
  check('title', 'Must be at least 2 and lesser than 100 chars long.').isLength({ min: 2 }).isLength({ max: 100 }).not().isEmpty().trim(),
  check('description', 'Must be lesser than 300 chars long').isLength({ max: 300 }).trim(),
  verifyValidations,
  authMiddleware,
  Controller.create,
);

// update
routes.put('/api/users', authMiddleware, Controller.update);

// delete
routes.delete('/api/users/:_id', authMiddleware, Controller.remove);

// authenticate
routes.post(
  '/api/users/authenticate',
  check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({ min: 5 }).isLength({ max: 150 }).not().isEmpty().normalizeEmail().trim(),
  check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
  bruteforce.prevent,
  verifyValidations,
  Controller.authenticate,
);

// register
routes.post(
  '/api/users/register',
  check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long').isEmail().isLength({ min: 5 }).isLength({ max: 150 }).not().isEmpty().normalizeEmail().trim(),
  check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(),
  verifyValidations,
  Controller.create,
);

// check if email is already registered
routes.get('/api/users/exists/:email', Controller.checkIfEmailExists);

// change password
routes.put('/api/users/changePassword', check('password', 'Must be at least 8 and lesser than 150 chars long').isLength({ min: 8 }).isLength({ max: 150 }).not().isEmpty().trim(), verifyValidations, Controller.changePassword);

// refresh token
routes.post('/api/users/refresh', refreshMiddleware, Controller.refreshToken);

// logout
routes.post('/api/users/logout', Controller.logout);

// todo tirar export default
export default routes;
