# Anonymous Confession Room Web Application - Requirements Document

## 1. Application Overview

### 1.1 Application Name
Secret Room - Ephemeral Anonymous Chat Platform

### 1.2 Application Description
A web-based anonymous confession platform where users can join temporary chat rooms without any signup. Inspired by WeTransfer's clean interface, this platform creates a 'Digital Confession Box' where people can share thoughts anonymously in time-limited rooms. The application focuses on privacy, urgency, and ephemeral interactions.

## 2. Core Features
\n### 2.1 Room Creation & Management
- Admin can create rooms with customizable settings:\n  - Room size limit (maximum number of participants)
  - Initial time limit (free version: 10 minutes)
  - Generate unique link or QR code for room access
- Admin dashboard with controls: kick/ban users, extend time, manage room settings

### 2.2 Zero-Friction Entry
- No signup or login required
- Users scan QR code or click link to join instantly
- Automatic random avatar assignment (e.g., Ghost-42, Ninja-15, Mask-88)
- Anonymous identity throughout the session

### 2.3 Real-Time Anonymous Chat
- Text-based messaging with complete anonymity
- Messages display with avatar icons instead of real names
- Real-time message delivery using websockets
- AI-powered content moderation to filter inappropriate content

### 2.4 Ticking Clock System
- Live countdown timer visible at top of chat interface
- Visual progress bar changing colors: Green → Yellow → Red
- Timer creates urgency for conversations
- 1-minute warning notification before expiration

### 2.5 Time Extension (Monetization)
- Free tier: 10 minutes chat time
- Extension options when timer expires:
  - Extra 5 minutes: ₹10\n  - Extra 15 minutes: ₹29
  - Extra 1 hour: ₹99
- Admin receives payment prompt 1 minute before expiration
- One-click payment integration\n
### 2.6 Ephemeral Architecture
- All messages and room data automatically deleted when timer reaches 00:00
- No digital footprint or chat history retention
- Self-destructing data ensures complete privacy
\n### 2.7 Advanced Features
- Voice Morphing: Users can send voice notes with AI-altered voice for anonymity
- Reveal & Guess: Pay ₹5 to request hints about message senders (requires mutual consent)
- Live Spectator Mode: Public rooms where viewers can watch confessions (read-only)
- Privacy Blur: Screen automatically blurs when user switches tabs or tilts phone
- Self-Destructing Media: Images visible for only 5 seconds with screenshot blocking

### 2.8 AI Moderation
- Real-time content filtering using Perspective API
- Automatic masking of inappropriate words (***)
- Maintains safe environment while preserving anonymity

### 2.9 Advertisement Integration
- Background aesthetic ads on landing page (WeTransfer style)
- Non-intrusive full-screen wallpaper ads
- Side banner ads during chat sessions

## 3. Design Style

### 3.1 Overall Aesthetic
- Cyberpunk-Minimalist theme with 'Secret Club' atmosphere
- Dark mode by default (Deep Black #0A0A0A background)
- Clean, distraction-free interface
\n### 3.2 Color Scheme
- Primary Background: Deep Black (#0A0A0A)\n- Accent Color: Neon Purple (#BC13FE)
- Timer States: Green (safe) → Yellow (warning) → Red (urgent)
- Glass-morphic transparent cards with subtle blur effects

### 3.3 Visual Elements
- Typography: Inter font for clean readability or Space Mono for techy/mysterious feel
- Dynamic background: Abstract waves or blurred city lights on landing page
- Neon-colored progress bar for timer visualization
- Anonymous avatar icons: 🥷 Ninja, 🎭 Mask, 👻 Ghost style

### 3.4 Animations & Interactions
- 'Thanos Snap' vanish animation when timer expires (CSS particles)
- Smooth transitions using Framer Motion
- Haptic feedback on mobile during last 10 seconds (heartbeat vibration)
- Floating Action Button (FAB) for quick time extension

### 3.5 Mobile-First Design
- One-handed UI with important buttons at bottom
- Optimized QR code scanning experience
- Responsive layout adapting to all screen sizes
- Touch-friendly interface elements

### 3.6 Component Library
- Radix UI or Shadcn/UI for premium feel
- Glass-morphic cards for modern aesthetic
- Minimalist input fields and buttons
\n## 4. Technical Implementation Notes

### 4.1 Technology Stack
- Frontend: Next.js with Tailwind CSS
- Real-time Communication: Supabase Realtime or Socket.io
- Temporary Storage: Redis (Upstash free tier) with TTL
- Deployment: Vercel (free hosting)
- Payment Gateway: Razorpay/Stripe
- AI Moderation: Perspective API (Google)\n
### 4.2 Key Technical Features
- WebSocket-based real-time messaging
- Redis TTL for automatic data expiration
- QR code generation for room access
- Responsive design for mobile and desktop
- Anti-screenshot measures for privacy

## 5. User Flow\n
1. Admin creates room on landing page
2. System generates unique QR code/link
3. Users scan QR or click link\n4. Automatic avatar assignment
5. Enter chat room with visible timer
6. Anonymous real-time conversations
7. Payment prompt before expiration
8. Room and data auto-delete at 00:00

## 6. Monetization Strategy

- Time extensions (micro-transactions)
- Premium avatars and virtual masks
- Ad space on landing page
- VIP room access features
- Reveal/Hint features (₹5 per use)