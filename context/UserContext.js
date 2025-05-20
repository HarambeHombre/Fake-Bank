import { createContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { initializeBank } from '../utils/bankUtils';
import { 
  createBankTransaction,
  createUserTransaction, 
  updateBankBalance, 
  updateTransactionStatus, 
  createUserToUserTransaction, 
  updateUserBalance, 
  updateUserTransaction 
} from '../utils/transactionUtils';
import { createNewUserInDB, authenticateUser } from '../utils/userUtils';
import { setupRealtimeUpdates } from '../utils/realtimeUtils';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [bankUser, setBankUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Keep currentUser in sync with realtime updates
  useEffect(() => {
    if (currentUser && users.length > 0) {
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users, currentUser]);

  // Initialize bank and set up real-time updates
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check for bank first
        const bankSnapshot = await db.collection('users').where('firstName', '==', 'Bank').get();
        
        if (bankSnapshot.empty) {
          // No bank exists, create it
          const newBankUser = await initializeBank();
          if (newBankUser) {
            setBankUser(newBankUser);
          }
        } else {
          // Bank exists, set it
          const bankDoc = bankSnapshot.docs[0];
          setBankUser({ id: bankDoc.id, ...bankDoc.data() });
        }
        
        // Only set up real-time updates after bank is initialized
        const unsubscribe = setupRealtimeUpdates(setUsers, setBankUser);
        setIsInitialized(true);
        return unsubscribe;
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsInitialized(true); // Set to true even on error to prevent infinite loading
      }
    };

    initialize();
  }, []);

  const createUser = async (userData) => {
    try {
      if (!isInitialized) {
        throw new Error('App is not fully initialized yet');
      }
      
      if (!bankUser || bankUser.balance < 1000) {
        throw new Error('Bank is not ready or has insufficient funds');
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create initial transaction for the welcome deposit
      const initialTransaction = createUserTransaction(1000);
      
      // Create new user in database without initial balance
      const newUserData = {
        ...userData,
        balance: 0 // Start with 0 balance, will be updated after transaction completes
      };
      const newUser = await createNewUserInDB(newUserData);
      
      // Add initial transaction to new user's history
      await updateUserTransaction(newUser.id, initialTransaction);

      // Create bank transaction
      const bankTransaction = await createBankTransaction(
        bankUser.id,
        1000,
        `${userData.firstName} ${userData.lastName}`
      );

      // Add pending transaction to bank's history without updating balance yet
      await updateUserTransaction(bankUser.id, bankTransaction);

      // Schedule status updates and balance changes after processing delay
      const updateStatusesAndBalances = async () => {
        try {
          // Update transaction statuses
          await updateTransactionStatus(newUser.id, initialTransaction.id, 'completed');
          await updateTransactionStatus(bankUser.id, bankTransaction.id, 'completed');
          
          // Update balances only after transactions are completed
          await updateUserBalance(newUser.id, 1000, false); // credit new user
          await updateUserBalance(bankUser.id, 1000, true); // debit bank
        } catch (error) {
          console.error('Error updating transaction statuses and balances:', error);
        }
      };
      
      setTimeout(updateStatusesAndBalances, 5000); // 5 second delay for processing

      // No need to manually update state as realtime updates will handle it
      return newUser.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const transferMoney = async (fromUserId, toUserId, amount) => {
    try {
      if (!isInitialized) {
        throw new Error('App is not fully initialized yet');
      }

      const sender = users.find(u => u.id === fromUserId);
      const recipient = users.find(u => u.id === toUserId);

      if (!sender || !recipient) {
        throw new Error('Sender or recipient not found');
      }

      if (sender.balance < amount) {
        throw new Error('Insufficient funds');
      }

      // Create transactions for both parties
      const senderTransaction = createUserToUserTransaction(
        amount,
        sender.firstName + ' ' + sender.lastName,
        recipient.firstName + ' ' + recipient.lastName,
        'send'
      );

      const recipientTransaction = createUserToUserTransaction(
        amount,
        sender.firstName + ' ' + sender.lastName,
        recipient.firstName + ' ' + recipient.lastName,
        'receive'
      );

      // Add pending transactions to both users
      await updateUserTransaction(fromUserId, senderTransaction);
      await updateUserTransaction(toUserId, recipientTransaction);

      // Schedule status updates and balance changes after processing delay
      const updateStatusesAndBalances = async () => {
        try {
          // Update transaction statuses
          await updateTransactionStatus(fromUserId, senderTransaction.id, 'completed');
          await updateTransactionStatus(toUserId, recipientTransaction.id, 'completed');
          
          // Update balances only after transaction is completed
          await updateUserBalance(fromUserId, amount, true); // debit sender
          await updateUserBalance(toUserId, amount, false); // credit recipient
        } catch (error) {
          console.error('Error updating transaction statuses and balances:', error);
        }
      };
      
      setTimeout(updateStatusesAndBalances, 5000); // 5 second delay for processing

      return true;
    } catch (error) {
      console.error('Error transferring money:', error);
      return false;
    }
  };

  // Function to refresh users - might not be needed with realtime updates,
  // but keeping it for manual refresh functionality
  const refreshUsers = useCallback(async () => {
    // Real-time updates will handle this automatically
  }, []);

  if (!isInitialized) {
    return null; // or return a loading component
  }

  const login = async ({ email, password }) => {
    try {
      const user = await authenticateUser(email, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      createUser, 
      bankUser, 
      refreshUsers, 
      transferMoney,
      currentUser,
      login,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

