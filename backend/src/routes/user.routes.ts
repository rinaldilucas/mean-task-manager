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

// get by id
routes.get('/api/users/:_id', authMiddleware, Controller.getOne);

// create
routes.post(
  '/api/users',
  check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long')
    .isEmail()
    .isLength({ min: 5 })
    .isLength({ max: 150 })
    .not()
    .isEmpty()
    .normalizeEmail()
    .trim(),
  check('password', 'Must be at least 8 and lesser than 150 chars long')
    .isLength({ min: 8 })
    .isLength({ max: 150 })
    .not()
    .isEmpty()
    .trim(),
  verifyValidations,
  Controller.create,
);

// update
routes.put('/api/users/:_id', authMiddleware, Controller.update);

// delete
routes.delete('/api/users/:_id', authMiddleware, Controller.remove);

// authenticate
routes.post(
  '/api/users/authenticate',
  check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long')
    .isEmail()
    .isLength({ min: 5 })
    .isLength({ max: 150 })
    .not()
    .isEmpty()
    .normalizeEmail()
    .trim(),
  check('password', 'Must be at least 8 and lesser than 150 chars long')
    .isLength({ min: 8 })
    .isLength({ max: 150 })
    .not()
    .isEmpty()
    .trim(),
  bruteforce.prevent,
  verifyValidations,
  Controller.authenticate,
);

// register
routes.post(
  '/api/users/register',
  check('email', 'Must be a valid email address, with at least 5 and lesser than 150 chars long')
    .isEmail()
    .isLength({ min: 5 })
    .isLength({ max: 150 })
    .not()
    .isEmpty()
    .normalizeEmail()
    .trim(),
  check('password', 'Must be at least 8 and lesser than 150 chars long')
    .isLength({ min: 8 })
    .isLength({ max: 150 })
    .not()
    .isEmpty()
    .trim(),
  verifyValidations,
  Controller.create,
);

// check if email is already registered
routes.get('/api/users/exists/:email', Controller.checkIfEmailExists);

// change password
routes.put(
  '/api/users/changePassword/:_id', //
  check('password', 'Must be at least 8 and lesser than 150 chars long')
    .isLength({ min: 8 })
    .isLength({ max: 150 })
    .not()
    .isEmpty()
    .trim(),
  verifyValidations,
  authMiddleware,
  Controller.changePassword,
);

// refresh token
routes.post('/api/users/refreshToken', refreshMiddleware, Controller.refreshToken);

// logout
routes.post('/api/users/logout', Controller.logout);

export default routes;
