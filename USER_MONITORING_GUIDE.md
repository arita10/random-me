# 👥 User Monitoring Guide - Random Selector

## Quick Links

### **Google Analytics Dashboard:**
👉 https://analytics.google.com/
- **Property ID:** G-XESH8347DY
- **Best for:** Real-time users, page views, traffic sources

### **Firebase Console:**
👉 https://console.firebase.google.com/project/spinning-wheel-app-c80c2
- **Best for:** Authenticated users, database usage, error logs

---

## 📊 Daily Monitoring Routine (5 minutes)

### **Morning Check (Every Day):**

1. **Google Analytics - Real-Time**
   - URL: https://analytics.google.com/ → Real-time
   - Check: How many users online right now?
   - Check: Which pages are they viewing?

2. **Google Analytics - Yesterday's Stats**
   - Path: Reports → Life cycle → Engagement → Overview
   - Check: Total users yesterday
   - Check: Average engagement time
   - Check: Top pages viewed

3. **Firebase Usage**
   - URL: https://console.firebase.google.com/project/spinning-wheel-app-c80c2/usage
   - Check: Firestore reads (should be < 50,000/day)
   - Check: Firestore writes (should be < 20,000/day)
   - ⚠️ If close to limits, consider upgrade

---

## 🔍 Google Analytics - Detailed Guide

### **1. Real-Time Users (See Who's Online NOW)**

**How to access:**
1. Go to https://analytics.google.com/
2. Click on your property (Random Selector)
3. Click "Reports" (left sidebar)
4. Click "Real-time" → "Overview"

**What you'll see:**

```
┌─────────────────────────────────────────┐
│ Users in last 30 minutes: 15           │
├─────────────────────────────────────────┤
│ Views in last 30 minutes: 42           │
│ Views per minute: 1.4                  │
├─────────────────────────────────────────┤
│ Top Active Pages:                       │
│ /spinning-wheel          8 users       │
│ /dice-roller             4 users       │
│ /team-assignment         3 users       │
├─────────────────────────────────────────┤
│ User by Country:                        │
│ 🇺🇸 United States        7 users       │
│ 🇬🇧 United Kingdom       4 users       │
│ 🇮🇳 India                3 users       │
│ 🇨🇦 Canada               1 user        │
└─────────────────────────────────────────┘
```

**When to check:**
- ✅ During promotion campaigns
- ✅ After posting on social media
- ✅ To see immediate impact

---

### **2. Daily Active Users (DAU)**

**How to access:**
1. Reports → Life cycle → Engagement → Overview
2. Look at "Users" card

**What you'll see:**

```
Today:        45 users
Yesterday:    32 users
Last 7 days:  215 users
Last 30 days: 780 users
```

**What's good?**
- ✅ Growing day-over-day
- ✅ 10%+ weekly growth
- ✅ More than 50% returning users (loyal audience)

---

### **3. Most Popular Tools**

**How to access:**
1. Reports → Engagement → Pages and screens
2. Sort by "Views" column

**Example:**

```
Page Path              Views    Users   Avg Time
───────────────────────────────────────────────
/spinning-wheel         2,450    1,320   2:45
/dice-roller            1,230      890   1:30
/team-assignment          890      650   2:15
/card-selector            670      520   1:50
/fortune-sticks           450      380   1:20
/number-generator         320      280   0:45
/coin-flip               210      190   0:30
/yes-no                  180      160   0:25
```

**What to learn:**
- ✅ Which tools to promote more
- ✅ Which tools need improvement
- ✅ Where users spend most time

---

### **4. Traffic Sources (Where Users Come From)**

**How to access:**
1. Reports → Life cycle → Acquisition → Traffic acquisition
2. View by "Session source/medium"

**Example:**

```
Source / Medium         Users    Sessions   New Users
──────────────────────────────────────────────────────
google / organic          450       520        380
(direct) / (none)         320       380        210
facebook.com / referral   180       210        150
reddit.com / referral     120       145        100
twitter.com / social       85       100         75
instagram.com / social     45        55         40
```

**What to learn:**
- ✅ Which promotion channels work best
- ✅ Where to invest more effort
- ✅ SEO performance (organic search)

---

### **5. User Demographics**

**How to access:**
1. Reports → User → Demographics → Overview

**Example:**

```
Top Countries:
🇺🇸 United States    45%
🇮🇳 India            15%
🇬🇧 United Kingdom   12%
🇨🇦 Canada            8%
🇦🇺 Australia         6%

Top Cities:
New York, NY          85 users
London, UK            45 users
Los Angeles, CA       38 users
Toronto, Canada       32 users
Mumbai, India         28 users

Devices:
📱 Mobile            60%
💻 Desktop           35%
📱 Tablet             5%

Browsers:
Chrome               65%
Safari               20%
Firefox              10%
Edge                  5%
```

**What to learn:**
- ✅ Optimize for mobile (if 60%+ mobile users)
- ✅ Test on popular browsers
- ✅ Consider timezone for posting content

---

### **6. User Engagement**

**How to access:**
1. Reports → Engagement → Overview

**Metrics to watch:**

```
Average engagement time per session: 2:15
Engaged sessions per user: 1.5
Event count per session: 8.5
```

**What's good?**
- ✅ Avg time > 2 minutes (users are engaged)
- ✅ Event count > 5 (users interact with tools)
- ✅ Bounce rate < 60% (users don't leave immediately)

---

## 🔥 Firebase Console - Detailed Guide

### **1. Authenticated Users**

**How to access:**
1. Go to https://console.firebase.google.com/project/spinning-wheel-app-c80c2
2. Click "Build" → "Authentication"
3. Click "Users" tab

**What you'll see:**

```
┌──────────────────────────────────────────────────┐
│ Total Users: 127                                 │
├──────────────────────────────────────────────────┤
│ User ID       Email              Created         │
│ ──────────────────────────────────────────────── │
│ abc123xyz     user1@gmail.com    Dec 5, 2:30 PM │
│ def456uvw     user2@gmail.com    Dec 5, 3:45 PM │
│ ghi789rst     user3@gmail.com    Dec 5, 5:20 PM │
└──────────────────────────────────────────────────┘
```

**Information available:**
- ✅ User UID (unique ID)
- ✅ Email address
- ✅ Sign-in provider (Google)
- ✅ Account creation date
- ✅ Last sign-in time

**Note:** This only shows users who signed in, not anonymous visitors!

---

### **2. Database Usage (Stay Within Free Tier)**

**How to access:**
1. Firebase Console → Project Overview
2. Click "Usage and billing" → "Usage" tab

**What you'll see:**

```
Firestore Database
──────────────────────────────────────────
Documents read:     12,450 / 50,000 daily
Documents written:   2,340 / 20,000 daily
Documents deleted:      12

Storage:            234 MB
Network egress:     1.2 GB / month

⚠️ Warning: If you exceed limits, upgrade to Blaze plan
```

**What to monitor:**

| Metric | Free Tier Limit | Warning Level | Action |
|--------|----------------|---------------|--------|
| Reads/day | 50,000 | > 40,000 (80%) | Consider upgrade |
| Writes/day | 20,000 | > 16,000 (80%) | Optimize writes |
| Storage | 1 GB | > 800 MB | Clean old data |

**Cost estimate if you exceed:**
- Reads: $0.06 per 100,000 reads
- Writes: $0.18 per 100,000 writes
- Example: 100,000 extra reads = $0.06

---

### **3. Authentication Activity**

**How to access:**
1. Firebase Console → Authentication → "Usage" tab

**What you'll see:**

```
Sign-in Activity (Last 7 days)
────────────────────────────────
Total sign-ins:     450
New users:          127
Returning users:    323

Sign-in Methods:
Google:             450 (100%)
Email/Password:       0 (0%)
Anonymous:            0 (0%)
```

---

### **4. Error Logs (Debugging)**

**How to access:**
1. Firebase Console → "Firestore Database"
2. If errors occur, you'll see them in the dashboard
3. For detailed logs: Click "☰" menu → "Logs Explorer"

**What to look for:**
- ❌ Permission denied errors
- ❌ Query failures
- ❌ Authentication errors
- ❌ Rate limit exceeded

**Example error log:**
```
Error: Permission denied
Collection: wheels
User: abc123xyz
Time: Dec 5, 3:45 PM
Reason: User tried to access another user's data
```

---

## 📱 Mobile Apps for Monitoring

### **Google Analytics Mobile App:**

**iOS:** https://apps.apple.com/app/google-analytics/id881599038
**Android:** https://play.google.com/store/apps/details?id=com.google.android.apps.giant

**Features:**
- ✅ Real-time notifications
- ✅ Check stats on the go
- ✅ View reports
- ✅ Monitor campaigns

---

### **Firebase Console Mobile App:**

**iOS:** https://apps.apple.com/app/firebase-console/id1343998952
**Android:** https://play.google.com/store/apps/details?id=com.google.firebase.console

**Features:**
- ✅ View project status
- ✅ Check usage quotas
- ✅ View authentication stats
- ✅ Get alerts

---

## 🚨 Alert Setup (Get Notified Automatically)

### **Firebase Budget Alerts:**

1. Go to Firebase Console → "Usage and billing"
2. Click "Details & settings"
3. Click "Set budget"
4. Set budget: $5/month (or your preference)
5. Set alert at: 50%, 90%, 100%
6. You'll get email when limits are reached

---

### **Google Analytics Alerts:**

1. Go to Google Analytics
2. Click "Admin" (bottom left)
3. Click "Custom Alerts"
4. Create alert for:
   - ✅ Traffic spike (> 1000 users/hour)
   - ✅ Traffic drop (< 10 users/hour)
   - ✅ Error rate increase

---

## 📊 Weekly Report Template

Create a weekly report to track progress:

```
Week of: [Date]

📈 Growth
─────────
Total Users:        [number] (↑ X% from last week)
New Users:          [number]
Returning Users:    [number]
Daily Average:      [number]

🎯 Engagement
─────────
Avg Session Time:   [X:XX]
Pages per Session:  [X.X]
Bounce Rate:        [XX%]

🏆 Top Tools
─────────
1. [Tool name]      [XXX users]
2. [Tool name]      [XXX users]
3. [Tool name]      [XXX users]

🌍 Traffic Sources
─────────
1. [Source]         [XXX users]
2. [Source]         [XXX users]
3. [Source]         [XXX users]

💰 Firebase Usage
─────────
Reads:              [XX,XXX / 50,000]
Writes:             [X,XXX / 20,000]
Status:             ✅ Within limits / ⚠️ Close to limit

🎯 Goals for Next Week
─────────
1. [Goal 1]
2. [Goal 2]
3. [Goal 3]
```

---

## 🎯 Key Metrics to Track

### **Daily:**
- [ ] Real-time users (during promotion)
- [ ] Firebase usage (reads/writes)
- [ ] Error logs (any issues?)

### **Weekly:**
- [ ] Total users (growth trend)
- [ ] Top tools (popularity)
- [ ] Traffic sources (what's working)
- [ ] User engagement (time on site)

### **Monthly:**
- [ ] Month-over-month growth
- [ ] Revenue (if monetized)
- [ ] User retention rate
- [ ] Feature requests from users

---

## 💡 Pro Tips

### **1. Set Up Daily Digest Email:**
- Google Analytics → Admin → Account → Email Preferences
- Enable daily email digest
- Get stats delivered to inbox every morning

### **2. Create Custom Dashboard:**
- Google Analytics → Explore
- Create custom dashboard with your favorite metrics
- Add widgets for: Real-time users, daily users, top pages, traffic sources

### **3. Track Custom Events:**
Your app already tracks page views. Add custom events for:
- ✅ Wheel spins
- ✅ Dice rolls
- ✅ Card selections
- ✅ Team assignments

Example in code:
```javascript
logEvent('Tool', 'Spin Wheel', 'Spinning Wheel');
logEvent('Tool', 'Roll Dice', 'Dice Roller');
```

---

## 🆘 Troubleshooting

### **"I don't see any users in Google Analytics"**

**Possible reasons:**
1. Analytics not initialized yet (wait 24 hours)
2. Ad blocker blocking tracking
3. Analytics ID incorrect
4. No visitors yet

**Solution:**
1. Check if `G-XESH8347DY` is correct
2. Visit your site yourself (wait 5 minutes, check real-time)
3. Check browser console for errors (F12)

---

### **"Firebase usage is very high"**

**Possible reasons:**
1. Inefficient queries (reading too much data)
2. Not using query limits
3. Bot traffic
4. Security rules too permissive

**Solution:**
1. Review your Firestore queries
2. Add pagination/limits
3. Optimize security rules
4. Monitor for unusual activity

---

### **"I can't access Google Analytics"**

**Solution:**
1. Make sure you're logged in with the correct Google account
2. Check if you have access to the property
3. Ask the property owner to add you (Analytics Admin → Property Settings → Property Access Management)

---

## 📞 Support Resources

**Google Analytics:**
- Help Center: https://support.google.com/analytics
- Community: https://support.google.com/analytics/community

**Firebase:**
- Documentation: https://firebase.google.com/docs
- Community: https://firebase.google.com/community

---

## ✅ Quick Start Checklist

To start monitoring today:

- [ ] 1. Open Google Analytics: https://analytics.google.com/
- [ ] 2. Bookmark "Real-time" report
- [ ] 3. Open Firebase Console: https://console.firebase.google.com/project/spinning-wheel-app-c80c2
- [ ] 4. Bookmark "Usage" page
- [ ] 5. Install mobile apps (optional)
- [ ] 6. Set up budget alerts
- [ ] 7. Check stats daily for first week

---

**Happy monitoring! 📊🚀**
