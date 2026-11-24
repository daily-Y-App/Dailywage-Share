# DailyWage Share

DailyWage app ကို သူငယ်ချင်းများထံ မျှဝေရန်နှင့် Referral reward campaign ကို သီးသန့်လုပ်ဆောင်ရန် အသုံးပြုသော single-page repository ဖြစ်သည်။ DailyWage Home app ၏ အမြဲတမ်း Referral bottom tab ကို ဖယ်ရှားပြီး ဤ Share page သို့သာ link ချိတ်ထားသည်။

## အသုံးပြုရန် URL

- ပိုင်ရှင်၏ Share page: `https://daily-y-app.github.io/Dailywage-Share/?code=PROFILECODE`
- Referral landing link: `https://daily-y-app.github.io/Dailywage-Share/?ref=PROFILECODE`
- Share page မှ APK URL တွင်လည်း `?ref=PROFILECODE` ကို ဆက်လက်ထည့်ပေးသည်။

Share message တွင် `ဖိတ်ခေါ်လိုက်ရုံနဲ့ ၂၀ဘတ်ရယူပါ`, APK download link, RC, လက်ကျန်နှင့် Referral Link ပါဝင်သည်။ Campaign တစ်ကြိမ်လျှင် ၂၀฿ ဖြစ်ပြီး referrer တစ်ဦးအတွက် အများဆုံး ၁၀၀฿ ဖြစ်သည်။ Reward ကို Admin စိစစ်ပြီး `referralBalances/{PROFILECODE}.availableBalance` ထဲသို့ ထည့်ပေးပြီးမှ User က ငွေထုတ်တောင်းနိုင်သည်။

## Firestore collections

- `shareReferrals/{deviceId}` — Share landing page ဝင်ရောက်မှု၊ referrer code၊ first/last seen၊ download time နှင့် status
- `shareReferralDevices/{deviceId}` — Device တစ်ခုကို Referral Code တစ်ခုတည်းနှင့်သာ ချိတ်ထားရန် unique registry
- `referralBalances/{profileCode}` — Admin အတည်ပြုပြီးရရှိထားသော လက်ကျန်ဆုငွေ
- `referralWithdrawals/{withdrawalId}` — ဖုန်းနံပါတ်၊ Email၊ amount ပါသော Pending withdrawal request
- `adminNotifications/{withdrawalId}` — Admin Panel အတွက် `Unread` withdrawal notification
- `withdraw_requests/{requestId}` — Share Count ပြည့်ပြီးမှ တင်နိုင်သော request (`userId`, `profileCode`, `userName`, `phoneNumber`, `email`, `payoutAccount`, `shareCountAtRequest`, `referredSummary`, `deviceId`, `amount`, `status: pending`, `createdAt`)
- `withdraw_request_phones/{phoneKey}` — Phone number တစ်ခုတည်းဖြင့် request ထပ်မတင်နိုင်ရန် immutable reservation
- `withdraw_request_devices/{deviceId}` — Device တစ်ခုတည်းဖြင့် request ထပ်မတင်နိုင်ရန် immutable reservation
- `referralPayoutProfiles/{profileCode}` — လက်ကျန်/Share Count မပြည့်ခင် ကြိုသိမ်းထားနိုင်သော အမည်၊ ဖုန်း၊ `TrueMoney`/`WavePay`/`KPay` နှင့် account အချက်အလက်

Share page သည် self-referral နှင့် device တစ်ခုကို Referral Code မတူဘဲ ထပ်အသုံးပြုခြင်းကို client-side transaction ဖြင့် တားဆီးထားသည်။ Client fingerprint သည် best-effort ဖြစ်သောကြောင့် အပြည့်အဝ anti-fraud အတွက် Firebase Auth, App Check နှင့် server-side validation ကို production တွင် ထည့်သွင်းသင့်သည်။

## Share Count eligibility

လက်ရှိ valid count သည် raw share-button tap မဟုတ်ပါ။ Admin က `referralClaims` ထဲမှ အမှန်တကယ် စစ်ဆေးပြီး `Paid` လုပ်သော claim တစ်ခုစီအတွက် `referralBalances/{profileCode}.shareCount` ကို ၁ တိုးပေးသည်။ Share page ၏ `minShareCount = 5` target ပြည့်မှသာ “ဆု/ငွေထုတ် လျှောက်လွှာတင်မည်” ခလုတ်ကို ဖွင့်သည်။ မပြည့်သေးပါက လိုအပ်သည့် share အရေအတွက်ကို ပြထားသည်။

Request ကို Admin Panel က `withdraw_requests` ကို Firestore `onSnapshot()` ဖြင့် real-time စောင့်ကြည့်ပြီး `approved_paid` သို့မဟုတ် `rejected` ပြောင်းနိုင်သည်။ Approved/Paid လုပ်ချိန်တွင် Admin transaction က `referralBalances.availableBalance` မှ amount ကိုနုတ်ပြီး payout audit record သိမ်းသည်။

Payout profile form ကို balance ၀ ဖြစ်နေသေးချိန်နှင့် Share Count target မပြည့်သေးချိန်တွင်လည်း ဖြည့်ပြီး ကြိုသိမ်းနိုင်သည်။ Local device storage နှင့် `referralPayoutProfiles` နှစ်ခုလုံးတွင် သိမ်းပြီး နောက်ပိုင်း withdrawal form ထဲသို့ အလိုအလျောက် ဖြည့်ပေးသည်။

## Security

Admin Panel repository ရှိ `firestore.rules` တွင် Share collections အတွက် rules ထည့်ထားသည်။ လက်ရှိ rules သည် Firebase Authentication နှင့် `admin == true` custom claim ကို အခြေခံထားသော production နမူနာဖြစ်သည်။ Static Admin PIN တစ်ခုတည်းကို Firestore security အဖြစ် မသုံးသင့်ပါ။
`withdraw_requests` rules သည် request ဖန်တီးသူ၏ Firebase Auth UID နှင့် `userId` တူရန်၊ count အနည်းဆုံး ၅ ဖြစ်ရန်နှင့် status သည် `pending` ဖြစ်ရန် စစ်သည်။ Rules ကို အသုံးမပြုမီ Share/Home app တွင် Firebase Auth UID ကို profile identity နှင့် မှန်ကန်စွာ ချိတ်ပေးပါ။ Client-side device fingerprint နှင့် phone uniqueness သည် အပိုကာကွယ်မှုသာဖြစ်ပြီး Cloud Functions/App Check ဖြင့် server-side စစ်ဆေးခြင်းကို production တွင် ထပ်ထည့်သင့်သည်။
