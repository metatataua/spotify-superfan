# Spotify Superfan Prototype Specification

## Technical Constraints (For Token Economy)
- Build a monolithic architecture primarily in `app/page.tsx` using responsive React components.
- Use local React `useState` for all data simulation and page routing. No backend/database needed.
- Fully responsive layout via Tailwind CSS (desktop 3-column Spotify grid vs mobile single column).
- Language: Strict English UI. No Cyrillic.

## Application State Machine & Navigation Flow (Strict English)
The prototype must operate as a seamless, fully native single-page-application (SPA) experience using standard React `useState` hooks to manage the interface layout dynamically. No mock developer panels or state-switching buttons should be rendered on screen. All transitions must happen naturally via native UI elements.

### 🔄 Active Interface States:
1. `onboarding` — Triggered automatically on the very first application load. Renders a premium overlay modal with step-by-step introduction tooltips. Completing the tour automatically switches state to `role_selection`.
2. `role_selection` — Opened automatically after the onboarding tour. Displays two native choice cards: "I am a Creator" and "I am a Fan". 
3. `fan_unsubscribed` — Active if "I am a Fan" is selected. Displays the standard Spotify dark UI framework with a blurred, blocked view of the premium Artist Feed.
4. `fan_subscribed` — Triggered automatically only after clicking the native "Become a Superfan for $4.99" button and completing the simulated payment modal sheets. Unlocks full access, clears the blur, and applies the custom Artist Color Palette.
5. `creator_hub` — Active if "I am a Creator" is selected from the initial role screen. Opens the comprehensive B2B Spotify Admin CRM panel containing interactive calculators and analytics graphs.

## User Journey Flow
- **STEP 0: ONBOARDING TOUR**
  - Auto-trigger on initial load: Premium pop-up modal "Meet Spotify Superfan!".
  - "Next" button drives a step-by-step interactive UI tooltip tour: Step 1: Home Page -> Step 2: Sidebar -> Step 3: Go to Superfan Hub.
- **STEP 1: MAIN HOMEPAGE & SIDEBAR**
  - Standard Spotify dark UI shell (`#121212`, `#1DB954`, white text, gray descriptions).
  - Sidebar or Profile dropdown contains a new branded section: "Superfan Hub".
  - Clicking it leads to the Role Selector Screen (`role_selection`).
- **STEP 2: HUB SHOWCASE & ARTISTS BY GENRE**
  - If the user is on the Fan path, open the Hub Showcase.
  - Section title: "Recommended artists based on your taste (Rock, Pop, Indie)".
  - Display 2-3 dynamic artist cards with custom subscription tiers (e.g., Artist A (DIY/Indie) at $4.99/mo, Artist B (Pop Star) at $9.99/mo).

- **STEP 3: ARTIST PROFILE PREVIEW (BEFORE SUBSCRIPTION)**
  - Clicking any artist card opens their custom profile page.
  - **Premium Content Gate:** All exclusive tabs and modules (News Feed, Direct Messenger, Interactive Polls) must be heavily obscured using a Tailwind CSS blur overlay (`backdrop-blur-xl` or `blur-md`).
  - **Superfan Benefits Showcase:** A prominent, high-contrast section must display the 4 core perks of becoming a Superfan:
    1. *Exclusive News Feed:* Early access to artist thoughts, raw photos, unreleased audio demos, and behind-the-scenes vlogs.
    2. *Co-Creation & Voting:* Direct participation in official app polls (e.g., choosing tracks for the next live setlist, voting on album cover art, selecting tour cities).
    3. *Priority Comments:* ONLY Superfans can comment on the artist's tracks. Comments feature glowing custom color outlines based on fan tier and are pinned to the top.
    4. *Priority E-commerce:* Early access to ultra-limited merchandise drops, 48-hour presale tickets for concert tours, and subscriber-only discounts.
  - **Dynamic Call to Action (CTA):** At the bottom of the blurred view, render a large, glowing action button reflecting the artist's price tier: "Become a Superfan for $4.99/mo" (or $9.99/mo respectively).

- **STEP 4: SEAMLESS 1-CLICK PAYMENT & VIRAL POP-UP**
  - **Native Payment Sheet:** Clicking "Become a Superfan" opens a native-looking Spotify payment pop-up modal.
  - **Billing Copy:** Interface text must state: *"Payment via saved Spotify Premium card (•••• 1234)"*. No typing required.
  - **Required Gray Disclaimer (Fine Print):** Display a small but highly readable gray text block at the bottom of the checkout sheet:
    "🔁 Monthly recurring subscription. The next automatic charge of $4.99 will occur exactly in one month. You can cancel anytime in your profile settings. 🔒 Since digital content access and priority comments are unlocked instantly, cancellation applies to the next billing period, and no refunds are issued for the current month in accordance with creator protection policies."
  - **Loading & Success State:** The "Confirm & Pay" button triggers a smooth visual loading spinner animation for 1.5 seconds, then closes the sheet.
  - **Viral Share Card Modal:** Instantly after payment, pop up a beautiful vertical card styled as a template for Instagram Stories or TikTok:
    - Heading: "I have officially joined the Superfan Pool for [Artist Name]!"
    - Fan Badge: "My Personal Number: #1,245"
    - Perk Badges: "Exclusive Demos 🎧 | Early Tickets 🎫 | Music Voting 🗳️"
    - CTA Button: "[Share to Instagram Stories]" — clicking it shows a brief, realistic "Shared Successfully!" popup animation.

- **STEP 5: UNLOCKED SUPERFAN PROFILE & CONTENT SYNCHRONIZATION**
  - **Superfan Theme Engine:** Immediately upon unlock, dynamically inject the artist's custom aesthetic accent colors across the UI components.
  - **Interactive Audio & Badging:** The persistent Spotify music player now displays a custom colored [Superfan #18] status badge right text-aligned with the currently playing track.
  - **Dynamic Post-Unlock Tabs:** Implement 2 fast-switching navigation tabs:
    1. *Tab 1: Superfan Feed*
       - *Thought Post:* Text micro-blog update from the artist with an exclusive back-stage photo grid.
       - *Interactive Poll:* Active UI block asking: "Which city should we tour next? [Kyiv] [Lviv] [London]". Clicking a city option must run a smooth CSS transition animation revealing live percentage votes.
       - *Audio Preview:* Functional UI card player with Play/Pause animation simulating a raw demo track leak.
       - *Priority Comments Block:* An open text area. Typing and submitting a message pushes it directly into a top-pinned position, rendering with a glowing, vibrant gradient outline unique to the active user's superfan tier.
    2. *Tab 2: Spotify Messages (Broadcast CRM Channel)*
       - Render a native-looking direct chat viewport styled like an artist broadcast room.
       - *Cross-Channel Sync:* Content from the Superfan Feed must automatically mirror inside the chat dialogue feed:
         - The artist's thought posts appear as simulated incoming message speech bubbles.
         - The city poll must remain fully operational and sync state directly with Tab 1 (voting in chat updates the feed poll percent instantly, and vice versa).

- **STEP 6: CREATOR DASHBOARD (B2B SPOTIFY ADMIN PANEL)**
  - **Eligibility Gate Notice:** Clearly display a prominent info banner or warning state in the Superfan module stating: "🔒 Superfan features unlock only if the artist has reached a minimum of 1,000 quarterly active streams from unique listeners." Include a progress indicator showing this status is active/verified.
  - **Interface Modules & Logic:**
    1. *Top Workspace Switcher:* Clean sub-navigation tabs to switch between "Music", "Podcasts", "Video Shows", and the currently active "Superfan Management".
    2. *Interactive Revenue Calculator:* An operational UI Slider component ranging from 50 to 10,000 superfans. Moving the slider must dynamically calculate and display:
       - Total Gross Revenue (based on a base $4.99/mo tier).
       - Spotify's 20% Platform Fee deduction.
       - The Net Monthly Recurring Revenue (MRR) remaining for the artist.
    3. *AI Actionable Insights Module:* Next to the calculator, render dynamic smart recommendation cards tailored to target data: "How to reach your goal? Your audience currently listens to Demo tracks during commutes. Start by publishing a hidden draft track or launch an exclusive poll."

- **STEP 7: ADVANCED CREATOR HUB ANALYTICS & SMART A/B TESTING**
  - **Premium Heatmap Data Table:** Render an interactive analytical layout showing Spotify Premium density by core geographic markets:
    1. Paris — 45% Premium Core Density
    2. New York — 40% Premium Core Density
    3. Kyiv — 35% Premium Core Density
  - **Demographic Core Insights:** Visual distribution cards showcasing demographic peaks: "Age & Gender: Women 18–24 (54%), Men 25–34 (30%)", further breakable by Top Cities and Countries.
  - **Viral Loops Conversion Widget:** A statistics metric module visualizing organic growth via fan sharing loops: "Social Sharing Rate: 84% of your superfans published their personal badge number to Stories. Organic external reach gained via fan stories: +45,000 unique listeners."
  - **Dynamic Smart Pricing Suggestion:** A dedicated algorithmic advisory box: "Recommended subscription price for your profile: $4.99. Validation: 65% of your monetizable listeners are concentrated in regions where the average Meta/Spotify premium standard checkout sits at this optimal tier."
  - **Localized AI Strategy Card:** Smart insights card showing custom promotional playbooks: "AI STRATEGY: Your demographic core (Women 18-24) listens to your tracks late at night on headphones. Action: Drop an exclusive acoustic demo file tonight at 9:00 PM. Alternate Action: Your most loyal fans live in Ukraine. Launch an exclusive tour poll allowing them to crowdsource and vote for the live concert setlist." Include a preview trigger for this exact survey card template.
  - **Smart A/B Testing Modules:** Visual toggle grid demonstrating AI-driven creative testing (e.g., Template Variant A vs Variant B for Instagram Stories) showing real-time simulated click-through rates (CTR) and customer acquisition conversion spikes.

- **STEP 8: AI FAN TASTE ANALYTICS & SMART TEMPLATE SELECTOR (CANVA INTEGRATION)**
  - **Core AI Taste Insight Box:** Display a structured analytical breakdown card stating: 
    *"Taste Analytics: Your listeners are 78% more interested in voting for vinyl options and priority tickets than listening to raw demo recordings. The standard Call-To-Action 'Listen to my first demo' will yield low conversions."*
  - **Interactive Template Selector (A/B Conversion Logic):** Build an active selection layout showcasing two distinct card strategies based on AI forecasting:
    1. *Variant 1 (Low Priority):* "Join now and listen to early track demos." (AI Projected Conversion Rate: 2.1%).
    2. *Variant 2 (AI RECOMMENDED — High Priority):* "Become my Superfan and decide which city I tour next and which poster design I launch!" (AI Projected Conversion Rate: 14.8%).
  - **Canva Integration Success Feedback:** Clicking **Variant 2** must trigger a smooth visual state change, rendering a green success banner or tag that flashes: *"Template activated and synchronized with Canva Integration."*


- **STEP 9: ENGAGEMENT SUITE & REFERRAL INVITES**
  - **Superfan Theme Engine Selector:** Render a row of interactive color dots (e.g., Spotify Green, Neon Purple, Cyberpunk Green). Clicking a dot must dynamically update a global theme context, instantly transforming the visual accents across the application to match the creator's aesthetic.
  - **Promo Content Generator:** Add a "Generate Promo Content" button. Clicking it displays a mock overlay showcasing a vertical Instagram/TikTok Story template with an animated Spotify Canvas video background and text: "Become my Spotify Superfan and unlock early access now!".
  - **Referral Invites Module:** Build an interactive B2B growth widget.
    - Display an active counter: "Available monthly invites: [ ✉️ 3 / 3 remaining ]".
    - Implement a "[Generate Unique Invite Link]" button.
    - **Click Logic:** Clicking the button must decrease the available counter by one (e.g., from 3/3 to 2/3) and trigger a clean pop-up toast notification: "Unique invite link copied! Send it to a fellow artist to grant them priority free access to the Superfan Hub ecosystem."

- **STEP 10: ECOSYSTEM COMMERCE, PAYOUTS & ANTI-FRAUD VAULT**
  - **Ecosystem Commerce Modules:**
    1. *Concert Tickets Module (Ticketmaster/Dice):* Toggle switch: "[Activate 48-Hour Superfan Presale]". Checkbox options: "Generate unique, single-use promo codes automatically dispatched via email".
    2. *Merchandise Module (Shopify Gate):* Action button: "[Create Superfan Exclusive Merch]". Settings selector: "Configure permanent 20% automated subscriber discounts linked to registered emails".
  - **Payout & Financial Settings Module:**
    - Visual layout for account bonding: Interactive selectors for "[Link IBAN / Business Registration Account]" and "[Connect Stripe / PayPal]".
    - Active payout status display card: *"Next Payout: Coming Tuesday. Available for withdrawal: $420.00 (Minimum $10 payout threshold cleared)."*
  - **Anti-Fraud & Content Vault Security Widget:**
    - Live safety indicators: "Shield Status: Active | No-Refund Policy Enforcement: Enabled | Media Stream Encryption: Enabled (Screen-recording and rip protection initialized)."
    - Platform Legal Copy: "Users canceling mid-month retain access until the next billing cycle. Current month refunds are blocked at the architecture level to protect creators from fraudulent chargebacks."


