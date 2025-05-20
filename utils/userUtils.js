// Removed firebase/firestore imports as we use v8 syntax
import { db } from '../firebase';
import { hashPassword, generateSalt } from './authUtils';

export const createNewUserInDB = async (userData) => {
  try {
    // Check if user with email already exists
    const existingUser = await db.collection('users').where('email', '==', userData.email).get();
    
    if (!existingUser.empty) {
      throw new Error('User with this email already exists');
    }

    // Generate salt and hash password
    const salt = generateSalt();
    const hashedPassword = hashPassword(userData.password, salt);

    // Remove plain text password and add hashed password and salt
    const { password, ...userDataWithoutPassword } = userData;
    const newUserData = {
      ...userDataWithoutPassword,
      hashedPassword,
      salt,
      balance: 0, // Start with zero balance, will be updated after transaction completes
      accountTransactions: [], // Initialize empty transactions array
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('users').add(newUserData);
    return { id: docRef.id, ...newUserData };
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error;
  }
};

export const authenticateUser = async (email, password) => {
  try {
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    
    if (userSnapshot.empty) {
      throw new Error('User not found');
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    
    const hashedAttempt = hashPassword(password, userData.salt);
    
    if (hashedAttempt !== userData.hashedPassword) {
      throw new Error('Invalid password');
    }

    // Remove sensitive data before returning user object
    const { hashedPassword, salt, ...userWithoutSensitiveData } = userData;
    return { id: userDoc.id, ...userWithoutSensitiveData };
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};
