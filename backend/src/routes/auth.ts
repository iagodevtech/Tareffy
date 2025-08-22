import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, createError } from '../middleware/errorHandler';
// import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';

const router = Router();
const prisma = new PrismaClient();

// Validation middleware
const validateRegistration = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Register
router.post('/register', validateRegistration, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(errors.array()[0].msg, 400);
  }

  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw createError('User already exists with this email', 409);
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Generate verification token
  const verificationToken = jwt.sign(
    { email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      emailVerified: true,
      createdAt: true
    }
  });

  // Send verification email
  // try {
  //   await sendVerificationEmail(email, verificationToken);
  // } catch (error) {
  //   console.error('Failed to send verification email:', error);
  // }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    user,
    token
  });
}));

// Login
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(errors.array()[0].msg, 400);
  }

  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
      emailVerified: true,
      lastLogin: true
    }
  });

  if (!user) {
    throw createError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw createError('Account is deactivated', 401);
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError('Invalid credentials', 401);
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: 'Login successful',
    user: userWithoutPassword,
    token
  });
}));

// Verify email
router.get('/verify-email/:token', asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const user = await prisma.user.findFirst({
      where: {
        email: decoded.email,
        emailVerificationToken: token
      }
    });

    if (!user) {
      throw createError('Invalid verification token', 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null
      }
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    throw createError('Invalid or expired verification token', 400);
  }
}));

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(errors.array()[0].msg, 400);
  }

  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    // Don't reveal if user exists or not
    return res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );

  // Save reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    }
  });

  // Send reset email
  try {
    // await sendPasswordResetEmail(email, resetToken);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }

  res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
}));

// Reset password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(errors.array()[0].msg, 400);
  }

  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw createError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    throw createError('Invalid or expired reset token', 400);
  }
}));

// Refresh token
router.post('/refresh-token', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw createError('Token is required', 400);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        emailVerified: true
      }
    });

    if (!user || !user.isActive) {
      throw createError('User not found or inactive', 401);
    }

    // Generate new token
    const newToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Token refreshed successfully',
      user,
      token: newToken
    });
  } catch (error) {
    throw createError('Invalid token', 401);
  }
}));

export default router;
