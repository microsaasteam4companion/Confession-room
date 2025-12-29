# Secret Room - Anonymous Confession Platform Requirements Document

## 1. Application Overview

### 1.1 Application Name\nSecret Room - Ephemeral Anonymous Chat Platform

### 1.2 Application Description\nA web-based anonymous confession platform where users can join temporary chat rooms without any signup. Inspired by WeTransfer's clean interface, this platform creates a 'Digital Confession Box' where people can share thoughts anonymously in time-limited rooms. The application focuses on privacy, urgency, and ephemeral interactions.

## 2. Landing Page Structure

### 2.1 Hero Section
- Bold headline: 'Speak Freely. Vanish Completely.'
- Subheadline explaining the core concept: 'Anonymous chat rooms that self-destruct. No signup. No traces.'
- Primary CTA button: 'Create Your Secret Room'
- Secondary CTA: 'How It Works' (smooth scroll to explanation section)
- Animated background: Subtle particle effects or gradient waves
- Hero image/illustration: Abstract representation of anonymous masks or disappearing messages

### 2.2 How It Works Section
- Step-by-step visual guide with icons:\n  1. Create Room - Admin sets time limit and room size
  2. Share Link - Generate QR code or unique URL
  3. Join Anonymously - Users enter without signup
  4. Chat Freely - Real-time anonymous conversations
  5. Auto-Delete - Everything vanishes when timer expires
- Interactive timeline or animated flow diagram
- Each step with brief description (1-2 sentences)
\n### 2.3 Features Showcase
- Grid or card layout highlighting key features:\n  - **Zero-Friction Entry**: No signup required, instant access via QR/link
  - **Complete Anonymity**: Random avatar assignment, no identity tracking
  - **Ticking Clock**: Visual countdown creates urgency
  - **Ephemeral by Design**: All data auto-deletes at expiration
  - **AI Moderation**: Safe environment with real-time content filtering
  - **Voice Morphing**: Send voice notes with altered voice\n  - **Reveal & Guess**: Optional hint system for sender identity
  - **Privacy Blur**: Auto-blur when switching tabs\n  - **Self-Destructing Media**: Images visible for 5 seconds only
  - **Spectator Mode**: Watch public confessions (read-only)
- Each feature with icon, title, and 2-3 line description
- Hover effects revealing more details

### 2.4 Pricing Section
- Clean pricing table with three tiers:
\n**Free Tier**
- 10 minutes chat time
- Up to 10 participants
- Basic anonymous avatars
- AI moderation included
- Price: ₹0\n
**Time Extensions** (Pay-as-you-go)
- +5 minutes: ₹10
- +15 minutes: ₹29
- +1 hour: ₹99
- All free tier features
- Flexible payment during session

**Premium Add-ons**
- Voice Morphing: ₹15/session
- Reveal & Guess: ₹5/hint
- Custom Avatar Packs: ₹49 one-time
- VIP Room Badge: ₹199/month
\n- Toggle switch for currency (INR/USD)
- Highlighted 'Most Popular' badge on recommended tier
- FAQ accordion below pricing: 'How do extensions work?', 'Can I get refunds?', etc.

### 2.5 Use Cases Section
- Real-world scenarios with illustrations:\n  - **Team Feedback**: Anonymous employee surveys
  - **Event Confessions**: Wedding/party confession boxes
  - **Support Groups**: Safe space for sensitive discussions
  - **Creative Brainstorming**: Judgment-free idea sharing
  - **Social Experiments**: Research and community projects
- Each use case with icon and brief description

### 2.6 Trust & Safety Section
- Security badges and certifications
- Key privacy points:
  - 'No data retention policy'
  - 'End-to-end ephemeral architecture'
  - 'AI-powered content moderation'
  - 'No IP logging or tracking'
- Testimonial or trust indicators

### 2.7 FAQ Section
- Expandable accordion with common questions:\n  - How anonymous am I really?
  - What happens to my messages?
  - Can I extend time after it expires?
  - Is my payment information stored?
  - How does AI moderation work?
  - Can I create private rooms?
\n### 2.8 Footer
- Quick links: About, Privacy Policy, Terms of Service, Contact
- Social media icons\n- Newsletter signup (optional)
- Copyright and legal information

## 3. Core Chat Application Features

### 3.1 Room Creation & Management
- Admin can create rooms with customizable settings:
  - Room size limit (maximum number of participants)
  - Initial time limit (free version: 10 minutes)
  - Generate unique link or QR code for room access\n- Admin dashboard with controls: kick/ban users, extend time, manage room settings

### 3.2 Zero-Friction Entry
- No signup or login required
- Users scan QR code or click link to join instantly\n- Automatic random avatar assignment (e.g., Ghost-42, Ninja-15, Mask-88)
- Anonymous identity throughout the session

### 3.3 Real-Time Anonymous Chat
- Text-based messaging with complete anonymity
- Messages display with avatar icons instead of real names\n- Real-time message delivery using websockets
- AI-powered content moderation to filter inappropriate content\n
### 3.4 Ticking Clock System
- Live countdown timer visible at top of chat interface
- Visual progress bar changing colors: Green → Yellow → Red
- Timer creates urgency for conversations
- 1-minute warning notification before expiration
\n### 3.5 Time Extension (Monetization)
- Free tier: 10 minutes chat time
- Extension options when timer expires:
  - Extra 5 minutes: ₹10\n  - Extra 15 minutes: ₹29
  - Extra 1 hour: ₹99
- Admin receives payment prompt 1 minute before expiration
- One-click payment integration

### 3.6 Ephemeral Architecture
- All messages and room data automatically deleted when timer reaches 00:00
- No digital footprint or chat history retention
- Self-destructing data ensures complete privacy\n
### 3.7 Advanced Features
- Voice Morphing: Users can send voice notes with AI-altered voice for anonymity
- Reveal & Guess: Pay ₹5 to request hints about message senders (requires mutual consent)
- Live Spectator Mode: Public rooms where viewers can watch confessions (read-only)\n- Privacy Blur: Screen automatically blurs when user switches tabs or tilts phone
- Self-Destructing Media: Images visible for only 5 seconds with screenshot blocking\n
### 3.8 AI Moderation
- Real-time content filtering using Perspective API
- Automatic masking of inappropriate words (***)
- Maintains safe environment while preserving anonymity

### 3.9 Advertisement Integration
- Background aesthetic ads on landing page (WeTransfer style)
- Non-intrusive full-screen wallpaper ads
- Side banner ads during chat sessions

## 4. Design Style

### 4.1 Dark Mode & Light Mode
- **Dark Mode (Default)**:
  - Primary Background: Deep Black (#0A0A0A)
  - Secondary Background: Charcoal Gray (#1A1A1A)
  - Text: Off-White (#F5F5F5)
  - Accent: Neon Purple (#BC13FE)
  - Cyberpunk-minimalist aesthetic with glowing elements

- **Light Mode (Optional Toggle)**:
  - Primary Background: Pure White (#FFFFFF)
  - Secondary Background: Light Gray (#F8F8F8)
  - Text: Dark Charcoal (#2A2A2A)
  - Accent: Deep Purple (#8B00FF)
  - Clean, airy feel with subtle shadows

- Mode toggle switch in top-right corner of landing page and chat interface
- Smooth transition animation between modes (0.3s ease)

### 4.2 Landing Page Aesthetics
- **Layout**: Single-page scroll with distinct sections separated by subtle dividers
- **Typography**: \n  - Headlines: Space Grotesk (bold, modern)
  - Body: Inter (clean readability)
  - Accent text: Space Mono (techy feel for technical details)
- **Spacing**: Generous whitespace, breathing room between sections
- **Visual Hierarchy**: Large hero text (72px) scaling down to body (16px)\n
### 4.3 Color Scheme
- Timer States: Green (#00FF88) → Yellow (#FFD700) → Red (#FF3366)
- Glass-morphic cards: Semi-transparent with backdrop blur (rgba(255,255,255,0.05) in dark mode)
- Gradient accents: Purple-to-pink gradients for CTAs and highlights
- Hover states: Subtle glow effects on interactive elements

### 4.4 Visual Elements
- **Icons**: Phosphor Icons or Lucide Icons for consistency
- **Illustrations**: Abstract, geometric style with neon outlines
- **Background**: \n  - Landing page: Animated gradient mesh or particle field
  - Chat interface: Subtle noise texture overlay
- **Cards**: Rounded corners (12px), soft shadows in light mode, neon borders in dark mode
- **Buttons**: Pill-shaped with gradient fills, hover lift effect (translateY(-2px))
\n### 4.5 Animations & Interactions
- **Landing Page**:
  - Parallax scrolling on hero section
  - Fade-in animations for sections on scroll (Intersection Observer)
  - Hover scale effects on feature cards (scale: 1.05)\n  - Smooth scroll navigation\n\n- **Chat Interface**:
  - 'Thanos Snap' vanish animation when timer expires (CSS particles)
  - Message bubble slide-in from left/right
  - Typing indicator with bouncing dots
  - Haptic feedback on mobile during last 10 seconds

### 4.6 Responsive Design
- **Desktop** (1440px+): Multi-column layouts, side-by-side feature showcases
- **Tablet** (768px-1439px): Two-column grids, stacked sections
- **Mobile** (320px-767px): Single column, bottom navigation, thumb-friendly buttons
- Hamburger menu for mobile navigation
- Touch-optimized button sizes (minimum 44px tap targets)

### 4.7 Component Library
- Radix UI or Shadcn/UI for accessible, premium components
- Glass-morphic cards with backdrop-filter blur
- Floating Action Button (FAB) for quick actions in chat
- Toast notifications for system messages
- Modal overlays for payment and settings

## 5. Technical Implementation Notes

### 5.1 Technology Stack\n- Frontend: Next.js 14 with App Router, Tailwind CSS
- Real-time Communication: Supabase Realtime or Socket.io\n- Temporary Storage: Redis (Upstash free tier) with TTL
- Deployment: Vercel (free hosting)
- Payment Gateway: Razorpay/Stripe
- AI Moderation: Perspective API (Google)
- Animation: Framer Motion
\n### 5.2 Key Technical Features
- WebSocket-based real-time messaging
- Redis TTL for automatic data expiration
- QR code generation using qrcode.react
- Dark/light mode with next-themes
- Responsive design with Tailwind breakpoints
- Anti-screenshot measures (CSS user-select, context menu blocking)
- SEO optimization with Next.js metadata API

## 6. User Flow

### 6.1 Landing Page Flow
1. User lands on homepage
2. Scrolls through features, pricing, and how-it-works sections
3. Clicks 'Create Your Secret Room' CTA
4. Redirected to room creation interface
\n### 6.2 Chat Flow
1. Admin creates room with settings
2. System generates unique QR code/link
3. Users scan QR or click link
4. Automatic avatar assignment
5. Enter chat room with visible timer
6. Anonymous real-time conversations
7. Payment prompt before expiration (if extension desired)
8. Room and data auto-delete at 00:00\n
## 7. Monetization Strategy\n
- Time extensions (micro-transactions: ₹10-₹99)
- Premium features (voice morphing, reveal hints)\n- Custom avatar packs (₹49 one-time)
- VIP room badges (₹199/month)
- Ad space on landing page (WeTransfer-style aesthetic ads)
- Affiliate partnerships with privacy tools

## 8. Success Metrics

- Room creation rate
- Average session duration
- Time extension conversion rate
- User retention (repeat room creators)
- Payment completion rate
- Landing page bounce rate and scroll depth