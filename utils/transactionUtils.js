// Removed firebase/firestore imports as we use v8 syntax
import { db } from '../firebase';

export const createBankTransaction = async (bankId, amount, recipientName, type = 'send') => {
  const timestamp = Date.now();
  return {
    id: 'trans-' + timestamp + '-bank',
    type,
    date: new Date().toISOString(),
    amount,
    status: 'pending',
    description: 'Initial deposit to ' + recipientName,
    read: true, // Start as read while pending
    deleted: false
  };
};

export const createUserTransaction = (amount, type = 'receive', description = 'Welcome deposit from Bank') => {
  const timestamp = Date.now();
  return {
    id: 'trans-' + timestamp,
    type,
    date: new Date().toISOString(),
    amount,
    status: 'pending',
    description,
    read: true, // Start as read while pending
    deleted: false
  };
};

export const updateBankBalance = async (bankId, currentBalance, amount, transaction) => {
  const bankDoc = await db.collection('users').doc(bankId).get();
  const currentBankData = bankDoc.data();
  const currentBankTransactions = currentBankData?.accountTransactions || [];
  const freshBalance = currentBankData?.balance || currentBalance;
  
  await db.collection('users').doc(bankId).update({
    balance: freshBalance - amount,
    accountTransactions: [transaction, ...currentBankTransactions]
  });

  return {
    ...currentBankData,
    balance: freshBalance - amount,
    accountTransactions: [transaction, ...currentBankTransactions]
  };
};

export const updateTransactionStatus = async (userId, transactionId, newStatus) => {
  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();

  if (!userData) {
    throw new Error('User not found');
  }

  const updatedTransactions = userData.accountTransactions.map(trans => 
    trans.id === transactionId ? { 
      ...trans, 
      status: newStatus,
      read: newStatus === 'completed' ? false : trans.read // Mark as unread when completed
    } : trans
  );

  await db.collection('users').doc(userId).update({
    accountTransactions: updatedTransactions
  });

  return updatedTransactions;
};

export const createUserToUserTransaction = (amount, senderName, recipientName, type = 'send') => {
  const timestamp = Date.now();
  return {
    id: 'trans-' + timestamp + '-' + type,
    type,
    date: new Date().toISOString(),
    amount,
    status: 'pending',
    description: type === 'send' 
      ? 'Transfer to ' + recipientName
      : 'Transfer from ' + senderName,
    read: true, // Start as read while pending
    deleted: false
  };
};

export const updateUserTransaction = async (userId, transaction) => {
  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();
  const currentTransactions = userData?.accountTransactions || [];

  await db.collection('users').doc(userId).update({
    accountTransactions: [transaction, ...currentTransactions]
  });

  return {
    ...userData,
    accountTransactions: [transaction, ...currentTransactions]
  };
};

export const updateUserBalance = async (userId, amount, isDebit = true) => {
  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();
  const currentBalance = userData?.balance || 0;
  const newBalance = isDebit ? currentBalance - amount : currentBalance + amount;

  await db.collection('users').doc(userId).update({
    balance: newBalance
  });

  return {
    ...userData,
    balance: newBalance
  };
};

export const updateTransactionMessage = async (userId, transactionId, updates) => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const transactions = userData.accountTransactions || [];
    
    const updatedTransactions = transactions.map(trans => 
      trans.id === transactionId 
        ? { ...trans, ...updates }
        : trans
    );

    await db.collection('users').doc(userId).update({
      accountTransactions: updatedTransactions
    });

    return true;
  } catch (error) {
    console.error('Error updating transaction:', error);
    return false;
  }
};

export const markTransactionRead = async (userId, transactionId, isRead = true) => {
  return updateTransactionMessage(userId, transactionId, { read: isRead });
};

export const deleteTransaction = async (userId, transactionId) => {
  return updateTransactionMessage(userId, transactionId, { deleted: true });
};
