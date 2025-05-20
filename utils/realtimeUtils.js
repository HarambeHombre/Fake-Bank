import { db } from '../firebase';

export const setupRealtimeUpdates = (setUsers, setBankUser) => {
  // Listen to the users collection
  const unsubscribe = db.collection('users').onSnapshot((snapshot) => {
    const updatedUsers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Update users list
    setUsers(updatedUsers);
    
    // Update bank user if it exists
    const bank = updatedUsers.find(user => user.firstName === 'Bank');
    if (bank) {
      setBankUser(bank);
    }
  });

  return unsubscribe;
};
