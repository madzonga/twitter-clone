/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt from 'jsonwebtoken';
// Helper function to generate a JWT token
export const generateToken = (user: any) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: '1h'
  });
  return token;
};
