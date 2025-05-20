# Fake-Bank &nbsp;![JavaScript](https://img.shields.io/badge/language-JavaScript-yellow?style=flat-square) ![Open Issues](https://img.shields.io/github/issues/HarambeHombre/Fake-Bank?style=flat-square) ![Last Commit](https://img.shields.io/github/last-commit/HarambeHombre/Fake-Bank?style=flat-square)

A modern, feature-rich, full-stack simulated banking platform for learning and demonstration purposes. Fake-Bank provides user onboarding, authentication, account management, peer-to-peer transfers, transaction history, and real-time updates with a focus on backend logic and realistic financial flows.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [API Concepts](#api-concepts)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Simulated Banking System:** Includes a central “Bank” account and user accounts with balances and transaction histories.
- **User Management:** Sign up, log in, and authentication (passwords are hashed and salted).
- **Initial Deposit:** New users receive a “welcome deposit” from the bank with transparent transaction records.
- **Peer-to-Peer Transfers:** Users can transfer funds to other users, with transaction and balance updates.
- **Transaction Status & Delays:** Transactions are processed with simulated delays and status updates for realism.
- **Real-Time Updates:** Leveraging a Firestore-like database, all account and transaction changes propagate in real time.
- **Transaction Messaging:** Users have a clear view of their most recent transactions, including read/unread status and soft-deletion.
- **Testable & Extensible:** Structure supports easy extension for new features, API endpoints, or a frontend.

---

## Project Structure

```
Fake-Bank/
├── components/
│   └── LatestTransactionMessages.js
├── context/
│   └── UserContext.js
├── screens/
│   └── HomeScreen.js
├── utils/
│   ├── bankUtils.js
│   ├── userUtils.js
│   ├── transactionUtils.js
│   └── realtimeUtils.js
├── firebase.js
├── UserContext.js
└── ...
```

- **components/**: UI components, e.g., transaction lists.
- **context/**: Application state and logic (React Context API).
- **utils/**: Core business logic for users, bank, and transactions.
- **screens/**: Example UI screens (if used in React Native or web).
- **firebase.js**: Database and backend setup.

---

## How It Works

### User Creation Flow

1. **Initialization:** The app creates a central bank account if it doesn’t exist.
2. **Sign-Up:** When a user signs up, their password is securely hashed and salted.
3. **Welcome Transaction:** The user receives an initial deposit (default: 1000 units) from the bank, recorded as a transaction for both the user and the bank.
4. **Real-Time Updates:** All changes are instantly reflected for all users.

### Transaction Flow

- Transfers and deposits are initiated with a “pending” status.
- After a short delay, statuses update to “completed” and balances are adjusted.
- All transactions are stored in account histories.
- Transactions can be marked as read/unread and soft-deleted.

---

## Getting Started

### Prerequisites

- Node.js (>= 14)
- npm or yarn
- (Optional) Firebase account for real database

### Installation

```bash
git clone https://github.com/HarambeHombre/Fake-Bank.git
cd Fake-Bank
npm install
# or
yarn install
```

### Configuration

1. Copy and configure your Firebase credentials in `firebase.js`:

```js
// Example firebase.js
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  // ...etc
};

const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore();
```

2. (Optional) Adjust initial bank or user parameters in `utils/bankUtils.js` or `context/UserContext.js`.

### Running the Project

```bash
npm start
# or
yarn start
```

If using React Native, use:
```bash
npx expo start
```

---

## API Concepts

While this repo is primarily front- and logic-focused, the following internal methods are central (see `utils/`):

- **createNewUserInDB(userData)**: Registers a new user, hashes password, stores in DB.
- **initializeBank()**: Ensures central bank account exists.
- **createBankTransaction() / createUserTransaction()**: Generates transaction entries.
- **updateUserBalance(userId, amount, isDebit)**: Modifies user balances after transaction completion.
- **setupRealtimeUpdates()**: Subscribes to user and bank changes for UI reactivity.

---

## Example Usage

```js
import { createNewUserInDB } from './utils/userUtils';

const user = {
  firstName: 'Alice',
  lastName: 'Doe',
  email: 'alice@example.com',
  password: 'supersecure'
};

createNewUserInDB(user).then((userObj) => {
  console.log('User created:', userObj);
});
```

---

## Contributing

Pull requests and issues are welcome! Please open an issue first to discuss major changes.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request

---

## License

This project is licensed under the MIT License.

---

> **Fake-Bank is designed for learning and demonstration only. Do not use for real financial transactions.**
