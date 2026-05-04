# TrueMoneyအတွက် Withdrawal System

## System Overview

RewardHub သည် TrueMoneyအတွက် အပြီးအစီ withdrawal system ပါဝင်ပါသည်။ ဤစနစ်သည် User များ၊ Admin များနဲ့ TrueMoneyအကြား အလယ်အလတ်ပုံစံအဖြစ် အလုပ်လုပ်ပါသည်။

---

## User Withdrawal Flow

### Step 1: User ငွေထုတ်မှုတောင်းဆိုခြင်း
```
User Dashboard → Withdraw Tab
├── Points ထည့်သွင်းခြင်း (Min: 1000)
├── TrueMoneyဖုန်းနံပါတ် ထည့်သွင်းခြင်း
├── TrueMoneyအကောင့်အမည် ထည့်သွင်းခြင်း
├── မှတ်ချက် ထည့်သွင်းခြင်း (ရွေးချယ်ခွင့်)
└── "ငွေထုတ်ခြင်း" ခလုတ်နှိပ်ခြင်း
```

### Step 2: System Processing
```
Validation
├── Points အနည်းဆုံး 1000 ရှိသလား?
├── ဖုန်းနံပါတ် မှန်ကန်သလား?
├── TrueMoneyအကောင့်အမည် ရှိသလား?
└── User ပွင့်လင်းသလား?

If Valid:
├── Points ကဒ်မှ နုတ်ယူခြင်း
├── Withdrawal Record ဖန်တီးခြင်း
├── Status: "pending" အဖြစ်သတ်မှတ်ခြင်း
└── User ကို Confirmation ပြသခြင်း

If Invalid:
└── Error Message ပြသခြင်း
```

### Step 3: User Tracking
```
User History Tab မှ အောက်ပါအချက်အလက်များ ကြည့်နိုင်ပါသည်:
├── ငွေထုတ်မှု အရေအတွက် (Baht)
├── ငွေထုတ်မှုအခါ
├── Status (စောင့်ဆိုင်းနေ / အတည်ပြု / ပယ်ဖျက်)
└── TrueMoneyဖုန်းနံပါတ်
```

---

## Admin Approval Flow

### Admin Dashboard Access
```
Admin Email: admin@rewardhub.com
Access: Admin Panel ခလုတ်မှ
```

### Pending Requests Management
```
Admin Panel → Pending Requests
├── User အကောင့်အမည်
├── ငွေထုတ်မှု အရေအတွက် (Baht & Points)
├── TrueMoneyအကောင့်အမည်
├── TrueMoneyဖုန်းနံပါတ်
├── တောင်းဆိုခြင်းအခါ
└── Actions:
    ├── ✓ အတည်ပြုခြင်း
    └── ✕ ပယ်ဖျက်ခြင်း
```

### Approval Process
```
Admin နှိပ်သည် "✓ အတည်ပြု"
├── Status ကို "completed" သို့ ပြောင်းလဲခြင်း
├── completedAt Timestamp ထည့်သွင်းခြင်း
├── approvedBy Admin Email ရေးသားခြင်း
└── User ကို History တွင် ပြသခြင်း
```

### Rejection Process
```
Admin နှိပ်သည် "✕ ပယ်ဖျက်"
├── Reason Prompt ပြသခြင်း
├── Status ကို "failed" သို့ ပြောင်းလဲခြင်း
├── Points ကို User အကောင့်သို့ ပြန်ထည့်သွင်းခြင်း
├── rejectionReason မှတ်တမ်းတွင် သိမ်းဆည်းခြင်း
└── User ကို ပယ်ဖျက်ခြင်းအကြောင်း အသိပေးခြင်း
```

---

## Firebase Database Structure

### Withdrawals Collection
```
withdrawals/
├── {userId}/
│   ├── {withdrawalId}/
│   │   ├── userId: string
│   │   ├── userName: string
│   │   ├── userEmail: string
│   │   ├── points: number
│   │   ├── baht: number
│   │   ├── status: string (pending/completed/failed)
│   │   ├── truemoneyPhone: string
│   │   ├── truemoneyName: string
│   │   ├── notes: string
│   │   ├── requestedAt: timestamp
│   │   ├── completedAt: timestamp
│   │   ├── approvedBy: string
│   │   └── rejectionReason: string
```

### Status Values
| Status | အဓိပ္ပါယ် | ရေးသားခြင်း |
|--------|---------|----------|
| pending | စောင့်ဆိုင်းနေ | Admin ခွင့်ခံမှီ |
| completed | အတည်ပြုပြီး | Admin အတည်ပြုပြီး |
| failed | ပယ်ဖျက်ပြီး | Admin ပယ်ဖျက်ပြီး |

---

## Conversion Logic

### Points to Baht
```
Formula: Baht = Points ÷ 10

Examples:
├── 1000 pts = 100 Baht
├── 1500 pts = 150 Baht
├── 2000 pts = 200 Baht
└── 5000 pts = 500 Baht
```

### Minimum Withdrawal
```
Minimum: 1000 points = 100 Baht
Maximum: အကန့်အသတ်မရှိ
```

---

## Profit-Safe Features

### 1. Validation Checks
```
✓ Points အနည်းဆုံး 1000 ရှိသလား?
✓ User ပွင့်လင်းသလား?
✓ ဖုန်းနံပါတ် မှန်ကန်သလား? (10 digits)
✓ TrueMoneyအကောင့်အမည် ရှိသလား?
```

### 2. Points Deduction
```
Withdrawal အတည်ပြုလျှင်:
├── Points ကဒ်မှ ချက်ချင်း နုတ်ယူခြင်း
├── User ပြန်မခွင့်ပြုခြင်း
└── Admin ပယ်ဖျက်လျှင် ပြန်ထည့်သွင်းခြင်း
```

### 3. Admin Verification
```
Admin ကသာ ငွေပေးခွင့်ပြုခြင်း:
├── Pending requests ကြည့်ခြင်း
├── User အချက်အလက် အတည်ပြုခြင်း
├── TrueMoneyအကောင့် အတည်ပြုခြင်း
└── အတည်ပြုပြီးမှ ငွေပေးခြင်း
```

### 4. Transaction Logging
```
အားလုံးသော withdrawal မှုများ မှတ်တမ်းတွင် သိမ်းဆည်းခြင်း:
├── User အချက်အလက်
├── ငွေထုတ်မှု အရေအတွက်
├── Status ပြောင်းလဲမှုများ
├── Admin ခွင့်ခံမှုများ
└── Timestamp များ
```

---

## TrueMoney Integration

### User Information Required
```
1. TrueMoneyဖုန်းနံပါတ်
   - Format: 0812345678 (10 digits)
   - Validation: ဖုန်းနံပါတ် မှန်ကန်သည်ကို စစ်ဆေးခြင်း

2. TrueMoneyအကောင့်အမည်
   - Format: အကောင့်အမည် (အဆင့်မြင့်)
   - Validation: အကောင့်အမည် ရှိသည်ကို စစ်ဆေးခြင်း

3. မှတ်ချက် (ရွေးချယ်ခွင့်)
   - Format: အခြားအချက်အလက်များ
   - Example: "အလျင်အမြန်ပေးပါ"
```

### Admin Processing
```
Admin ကအောက်ပါအချက်အလက်များ ကြည့်ပါသည်:
├── User အကောင့်အမည်
├── ငွေထုတ်မှု အရေအတွက် (Baht)
├── TrueMoneyဖုန်းနံပါတ်
├── TrueMoneyအကောင့်အမည်
├── တောင်းဆိုခြင်းအခါ
└── မှတ်ချက်များ

Admin ကပြီးလျှင်:
├── TrueMoneyအတွက် ငွေပေးခြင်း
├── Admin Panel မှ "အတည်ပြုခြင်း" နှိပ်ခြင်း
└── System အလိုအလျောက် Status ကို "completed" သို့ ပြောင်းလဲခြင်း
```

---

## Setup Instructions

### 1. Firebase Configuration
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

### 2. Admin Email Configuration
```javascript
const SYSTEM_CONFIG = {
  ADMIN_EMAIL: "admin@rewardhub.com"
};
```

### 3. Database Initialization
```
Create collections in Firebase:
├── withdrawals/
├── users/
└── transactions/
```

---

## Usage Instructions

### For Users
1. Dashboard သို့ ဝင်ခြင်း
2. "Withdraw" Tab ကို နှိပ်ခြင်း
3. အချက်အလက်များ ထည့်သွင်းခြင်း
4. "ငွေထုတ်ခြင်း" ခလုတ်နှိပ်ခြင်း
5. Admin ခွင့်ခံမှီ စောင့်ဆိုင်းခြင်း
6. History Tab မှ Status ကြည့်ခြင်း

### For Admin
1. Admin Email နဲ့ ဝင်ခြင်း
2. "Admin Panel" ခလုတ်နှိပ်ခြင်း
3. Pending Requests ကြည့်ခြင်း
4. User အချက်အလက် အတည်ပြုခြင်း
5. TrueMoneyအတွက် ငွေပေးခြင်း
6. "အတည်ပြုခြင်း" ခလုတ်နှိပ်ခြင်း

---

## Security Considerations

### Data Protection
```
✓ User အချက်အလက် Firebase မှ ကာကွယ်ခြင်း
✓ Admin Email သာ Admin Panel အသုံးပြုခွင့်
✓ Transaction Logging အားလုံး မှတ်တမ်းတွင် သိမ်းဆည်းခြင်း
✓ Points Deduction ချက်ချင်း ပြုလုပ်ခြင်း
```

### Fraud Prevention
```
✓ ဖုန်းနံပါတ် Validation
✓ အကောင့်အမည် Validation
✓ Admin အတည်ပြုခွင့်လိုအပ်ခြင်း
✓ Points ပြန်မခွင့်ပြုခြင်း
```

---

## Troubleshooting

### Issue: "အချက်အလက်မလုံလောက်ပါ"
```
Solution:
├── Points 1000 ကို အနည်းဆုံးထည့်သွင်းခြင်း
├── ဖုန်းနံပါတ် မှန်ကန်သည်ကို စစ်ဆေးခြင်း
└── TrueMoneyအကောင့်အမည် ထည့သွင်းခြင်း
```

### Issue: "Admin Panel မြင်မရနိုင်ခြင်း"
```
Solution:
├── Admin Email နဲ့ ဝင်ခြင်း စစ်ဆေးခြင်း
├── Firebase Config အတည်ပြုခြင်း
└── Admin Email ကို System Config တွင် အတည်ပြုခြင်း
```

### Issue: "Status ပြောင်းလဲမရနိုင်ခြင်း"
```
Solution:
├── Firebase Rules အတည်ပြုခြင်း
├── Admin အခွင့်အရည်အချင်း အတည်ပြုခြင်း
└── Firebase Connection အတည်ပြုခြင်း
```

---

## Contact & Support

For issues or questions:
- Email: admin@rewardhub.com
- GitHub: https://github.com/daily-Y-App/Dailywage-Share
