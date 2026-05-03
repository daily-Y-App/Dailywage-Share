# RewardHub - Reward System

A simple, elegant points-reward web application built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools required.

## Features

✨ **Core Features:**
- 🎁 User Authentication (Sign In/Sign Out)
- 💰 Points Dashboard with balance display
- 👥 Invite System with unique referral codes
- 📊 Invite Progress tracking with milestones
- 📈 Daily Login Rewards (2 points/day)
- 📺 Watch Ads earning (3-5 points)
- ✓ Complete Tasks earning (5-10 points)
- 💸 Withdrawal System (minimum 1000 points = 100 Baht)
- 📋 Transaction History
- 🏆 Weekly Leaderboard

## Conversion Rate
**100 pts = 10 Baht**

## Milestone Bonuses
- 10 invites → +50 points
- 20 invites → +200 points
- 50 invites → +700 points

## File Structure

```
reward-system-static/
├── index.html          # Main HTML file
├── style.css           # All styling
├── script.js           # All functionality
└── README.md          # This file
```

## Getting Started

### Option 1: Local Development
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start using the application

### Option 2: GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Select `main` branch as source
4. Your site will be live at `https://yourusername.github.io/reward-system-static/`

### Option 3: Any Web Server
Simply upload the three files to any web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Usage

### For Users
1. Click "Sign In" to create an account
2. Share your invite code with friends
3. Earn points by:
   - Inviting friends (5 pts each)
   - Daily login (2 pts)
   - Watching ads (3-5 pts)
   - Completing tasks (5-10 pts)
4. Track your progress on the dashboard
5. Withdraw points when you reach 1000 points

### For Developers

The application is built with:
- **HTML5** - Semantic markup
- **CSS3** - Responsive design with CSS Grid and Flexbox
- **Vanilla JavaScript** - No dependencies

Key JavaScript functions:
```javascript
login()                    // Authenticate user
logout()                   // Sign out
watchAds()                // Earn points from ads
completeTask()            // Earn points from tasks
applyInviteCode()         // Use friend's invite code
copyInviteCode()          // Copy your invite code
updateDashboard()         // Refresh dashboard data
```

## Customization

### Change Colors
Edit the CSS variables at the top of `style.css`:
```css
:root {
    --primary-color: #3b82f6;      /* Blue */
    --secondary-color: #8b5cf6;    /* Purple */
    --accent-color: #ec4899;       /* Pink */
    /* ... more colors ... */
}
```

### Modify Points
Edit the point values in `script.js`:
```javascript
function watchAds() {
    const points = Math.floor(Math.random() * 3) + 3; // Change 3 and 3 for range
}

function completeTask() {
    const points = Math.floor(Math.random() * 6) + 5; // Change 6 and 5 for range
}
```

### Add More Features
Simply add HTML elements and corresponding JavaScript functions. The structure is simple and easy to extend.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **No build process** - Instant loading
- **No dependencies** - Lightweight (< 50KB total)
- **Responsive design** - Works on all devices
- **Smooth animations** - CSS transitions only

## Deployment

### GitHub Pages (Recommended)
```bash
git push origin main
# Site automatically deployed to GitHub Pages
```

### Netlify
1. Connect your GitHub repository
2. Set build command to empty
3. Set publish directory to root
4. Deploy!

### Vercel
1. Import your GitHub repository
2. No build configuration needed
3. Deploy!

### Traditional Hosting
Upload these three files to any web server:
- `index.html`
- `style.css`
- `script.js`

## Data Storage

Currently, all data is stored in browser memory. To persist data:

### Option 1: LocalStorage (Simple)
```javascript
// Save data
localStorage.setItem('userData', JSON.stringify(userData));

// Load data
userData = JSON.parse(localStorage.getItem('userData'));
```

### Option 2: Backend API
Connect to a backend server to store data in a database.

### Option 3: Firebase
Integrate Firebase for real-time data sync.

## License

MIT License - Feel free to use and modify for your projects.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## Support

For issues or questions:
1. Check the code comments
2. Review the JavaScript functions
3. Open an issue on GitHub

## Future Enhancements

- [ ] Backend API integration
- [ ] User authentication with real database
- [ ] Payment processing
- [ ] Mobile app version
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Advanced analytics

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**

No React. No TypeScript. No build tools. Just pure web technologies.
