import SHA256 from 'crypto-js/sha256';
import encHex from 'crypto-js/enc-hex';

const SALT_ROUNDS = 3;

export const hashPassword = (password, salt) => {
  let hashedPassword = password;
  for (let i = 0; i < SALT_ROUNDS; i++) {
    hashedPassword = SHA256(hashedPassword + salt).toString(encHex);
  }
  return hashedPassword;
};

export const generateSalt = () => {
  // Generate a timestamp-based salt with some random elements
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
};

export const verifyPassword = (password, hashedPassword, salt) => {
  const hashedAttempt = hashPassword(password, salt);
  return hashedAttempt === hashedPassword;
};
