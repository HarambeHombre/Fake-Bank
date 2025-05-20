// Removed firebase/firestore imports as we use v8 syntax
import { db } from '../firebase';

export const initializeBank = async () => {
  try {
    const bankSnapshot = await db.collection('users').where('firstName', '==', 'Bank').get();
    
    if (bankSnapshot.empty) {
      const bankData = {
        firstName: 'Bank',
        lastName: 'System',
        userId: 'bank-system',
        accountId: 'bank-master-account',
        balance: 1000000,
        accountTransactions: []
      };
      const bankDoc = await db.collection('users').add(bankData);
      return { id: bankDoc.id, ...bankData };
    } else {
      const bankDoc = bankSnapshot.docs[0];
      return { id: bankDoc.id, ...bankDoc.data() };
    }
  } catch (error) {
    console.error('Error initializing bank:', error);
    return null;
  }
};


