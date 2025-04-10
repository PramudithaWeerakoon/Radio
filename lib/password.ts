import crypto from 'crypto';

/**
 * Hashes a password using built-in crypto
 * @param password Plain text password to hash
 */
export function hashPassword(password: string): string {
  // Generate a random salt
  const salt = crypto.randomBytes(16).toString('hex');
  
  // Hash the password with the salt using SHA-256
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  
  // Return both salt and hash combined
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a hash
 * @param password Plain text password to verify
 * @param hashedPassword The stored hashed password
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, storedHash] = hashedPassword.split(':');
  
  // Hash the input password with the same salt
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  
  // Compare the generated hash with the stored hash
  return storedHash === hash;
}
