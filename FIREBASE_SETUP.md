# Firebase Realtime Database Setup Guide

## Database Structure

```
rewardhub/
├── users/
│   ├── {userId}/
│   │   ├── email: string
│   │   ├── name: string
│   │   ├── points: number
│   │   ├── invites: number
│   │   ├── inviteCode: string
│   │   ├── deviceId: string
│   │   ├── createdAt: timestamp
│   │   ├── lastLogin: timestamp
│   │   └── role: string (user/admin)
│
├── invites/
│   ├── {inviteId}/
│   │   ├── inviterId: string
│   │   ├── inviteeId: string
│   │   ├── inviteCode: string
│   │   ├── status: string (pending/completed)
│   │   ├── pointsAwarded: number
│   │   ├── createdAt: timestamp
│   │   └── completedAt: timestamp
│
├── transactions/
│   ├── {transactionId}/
│   │   ├── userId: string
│   │   ├── type: string (invite/daily/ads/task/milestone)
│   │   ├── points: number
│   │   ├── description: string
│   │   ├── status: string (completed/pending/failed)
│   │   ├── createdAt: timestamp
│   │   └── metadata: object
│
├── withdrawals/
│   ├── {withdrawalId}/
│   │   ├── userId: string
│   │   ├── points: number
│   │   ├── baht: number
│   │   ├── status: string (pending/completed/failed)
│   │   ├── bankAccount: string (encrypted)
│   │   ├── requestedAt: timestamp
│   │   ├── completedAt: timestamp
│   │   └── notes: string
│
├── leaderboard/
│   ├── weekly/
│   │   ├── {weekId}/
│   │   │   ├── {userId}/
│   │   │   │   ├── invites: number
│   │   │   │   ├── points: number
│   │   │   │   ├── rank: number
│   │   │   │   └── bonus: number
│
├── deviceTracking/
│   ├── {deviceId}/
│   │   ├── userId: string
│   │   ├── ipAddress: string
│   │   ├── usedInviteCodes: array
│   │   ├── createdAt: timestamp
│   │   └── lastUsedAt: timestamp
│
└── config/
    ├── conversionRate: 10 (100 pts = 10 Baht)
    ├── minWithdraw: 1000
    ├── dailyLoginPoints: 2
    ├── invitePoints: 5
    ├── watchAdsMin: 3
    ├── watchAdsMax: 5
    ├── taskMin: 5
    ├── taskMax: 10
    └── milestones:
        ├── milestone1: {invites: 10, bonus: 50}
        ├── milestone2: {invites: 20, bonus: 200}
        └── milestone3: {invites: 50, bonus: 700}
```

## Firebase Rules (Security)

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "newData.hasChildren(['email', 'name', 'points', 'invites', 'inviteCode', 'deviceId'])"
      }
    },
    "transactions": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "root.child('users').child($uid).exists()"
      }
    },
    "withdrawals": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "root.child('users').child($uid).exists()"
      }
    },
    "invites": {
      ".read": true,
      ".write": "root.child('users').child(newData.child('inviterId').val()).exists()"
    },
    "leaderboard": {
      ".read": true,
      ".write": false
    },
    "deviceTracking": {
      "$deviceId": {
        ".read": true,
        ".write": true
      }
    },
    "config": {
      ".read": true,
      ".write": false
    }
  }
}
```

## Setup Instructions

### 1. Create Firebase Project
- Go to https://console.firebase.google.com
- Create new project
- Enable Realtime Database
- Choose "Start in test mode"

### 2. Get Firebase Config
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Initialize Config in Database
```
rewardhub/config/
  conversionRate: 10
  minWithdraw: 1000
  dailyLoginPoints: 2
  invitePoints: 5
  watchAdsMin: 3
  watchAdsMax: 5
  taskMin: 5
  taskMax: 10
  milestones:
    milestone1:
      invites: 10
      bonus: 50
    milestone2:
      invites: 20
      bonus: 200
    milestone3:
      invites: 50
      bonus: 700
```

## Data Operations

### Add User
```
POST /users/{userId}
{
  "email": "user@example.com",
  "name": "User Name",
  "points": 0,
  "invites": 0,
  "inviteCode": "CODE123456",
  "deviceId": "DEVICE_ID",
  "createdAt": timestamp,
  "lastLogin": timestamp,
  "role": "user"
}
```

### Add Transaction
```
POST /transactions/{userId}/{transactionId}
{
  "userId": "user_id",
  "type": "invite",
  "points": 5,
  "description": "Invite reward",
  "status": "completed",
  "createdAt": timestamp,
  "metadata": {}
}
```

### Add Withdrawal
```
POST /withdrawals/{userId}/{withdrawalId}
{
  "userId": "user_id",
  "points": 1000,
  "baht": 100,
  "status": "pending",
  "bankAccount": "encrypted_account",
  "requestedAt": timestamp,
  "completedAt": null,
  "notes": ""
}
```

### Track Device
```
POST /deviceTracking/{deviceId}
{
  "userId": "user_id",
  "ipAddress": "192.168.1.1",
  "usedInviteCodes": ["CODE1", "CODE2"],
  "createdAt": timestamp,
  "lastUsedAt": timestamp
}
```

## Anti-Fraud Logic

### Same Device/IP Protection
1. Get device ID from localStorage
2. Check `/deviceTracking/{deviceId}/usedInviteCodes`
3. If invite code already used on this device → REJECT
4. If used, add to array and update lastUsedAt

### Duplicate Prevention
- Check if user already invited this friend
- Check if invite code already used by this user
- Verify device ID matches

## Profit-Safe Logic

### Conditions for Reward
1. ✓ User must be registered
2. ✓ User must have device ID
3. ✓ User must complete 2-3 actions (ads/tasks)
4. ✓ Same device/IP cannot use same code twice

### Withdrawal Conditions
1. ✓ Minimum 1000 points required
2. ✓ User must have valid bank account
3. ✓ Status must be pending before completion
4. ✓ Admin must verify before marking completed

### Loss Prevention
- Min withdrawal: 1000 pts (100 Baht)
- Conditions prevent duplicate rewards
- Device tracking prevents abuse
- Transaction history tracks all changes
