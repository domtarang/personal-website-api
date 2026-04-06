import type { RequestHandler } from 'express';
import * as authService from '../services/auth.service';
import * as adminService from '../services/admin.service';
import type { LoginBody, PasswordUpdateBody } from '../types/auth';

export const login: RequestHandler = async (req, res) => {
  const { password } = req.body as LoginBody;
  const session = await authService.login(password);

  res.status(200).json({
    token: session.token,
    expiresAt: session.expiresAt,
  });
};

export const getSession: RequestHandler = async (req, res) => {
  res.status(200).json({
    authenticated: true,
    expiresAt: req.auth!.expiresAt,
  });
};

export const logout: RequestHandler = async (req, res) => {
  await authService.logout(req.headers.authorization ?? '');

  res.status(200).json({
    message: 'Logged out successfully.',
  });
};

export const updatePassword: RequestHandler = async (req, res) => {
  await adminService.updatePassword(req.body as PasswordUpdateBody);

  res.status(200).json({
    message: 'Admin password updated successfully. Please log in again.',
    reauthRequired: true,
  });
};
