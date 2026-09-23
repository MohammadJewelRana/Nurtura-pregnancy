# Motherly – Your Pregnancy Companion
### আপনার মাতৃত্বের বিশ্বস্ত সঙ্গী

Motherly is a premium, private, bilingual (English & বাংলা) pregnancy tracking and gestational calculation web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## ✨ Key Features

1. **Precision Pregnancy Engine (`date-fns`)**
   - Calculates gestational age (Weeks + Days), trimester, progress percentage, days remaining, and milestones.
   - Timezone-safe local calendar arithmetic avoiding typical JavaScript Date offsets.
   - Graceful handling of post-term pregnancies (>40 and >42 weeks) and overdue days.
   - Comprehensive handling of leap years, month boundaries, and edge cases.

2. **Doctor/Ultrasound EDD Prioritization & Due Date Comparison**
   - Allows users to enter LMP, Doctor/Ultrasound Estimated Due Date (EDD), or both.
   - Clearly distinguishes between **Doctor/Ultrasound EDD**, **Calculated EDD**, and **Primary Due Date**.
   - If both dates are provided and differ, Motherly prioritizes the Doctor's date while presenting a side-by-side comparison card.
   - Does NOT fabricate dates or overwrite clinical dates.

3. **Complete Week-by-Week Baby Development (Weeks 1–40)**
   - Approximate baby length (cm) and weight (g).
   - Real-world fruit/vegetable size comparisons in both English and Bangla.
   - Highlights on baby's anatomical development and mother's bodily changes.
   - Self-care wellness tips and practical preparation suggestions.
   - Medical disclaimer emphasizing informational care.

4. **Interactive Pregnancy Calendar**
   - Full month-by-month calendar view.
   - Tap any date to calculate gestational age, trimester, and weekly milestones for that exact day.

5. **Personal Wellness & Tracking Hub**
   - **Baby Kick Tracker**: Tap-to-count active sessions, duration recording, daily history, and essential clinical warning disclaimers.
   - **Daily Hydration Tracker**: Visual glass counters (250ml each), daily goal tracking, and daily resets.
   - **Weight Progression Tracker**: Log weight with notes, historical records, and an SVG trend chart.
   - **Daily Mood Check-in**: Emotion selection (😊, 🙂, 😐, 😔, 😣), symptom tags, and personal reflections.

6. **Pregnancy Journal & Bump Photos (IndexedDB)**
   - Write, edit, search, and delete journal entries.
   - Weekly photo memories stored client-side in **IndexedDB** using `idb-keyval` (preventing `localStorage` quota issues).

7. **Checklists & Hospital Bag Organizer**
   - Trimester 1, 2, and 3 medical and lifestyle checklists.
   - Hospital Bag checklist categorized for Mother, Baby, Documents, and Personal items.
   - Support for custom items and live completion percentages.

8. **Prenatal Appointments Tracker**
   - Record upcoming and past doctor appointments, scans, clinics, and discussion notes.

9. **Bilingual Baby Names Directory**
   - Curated Boy, Girl, and Unisex names with English and Bangla meanings and local favorites persistence.

10. **Pregnancy FAQ**
    - Searchable questions covering LMP calculations, ultrasound variances, kick counting, and nutrition.

11. **100% Privacy & Data Safety**
    - Zero backend, zero tracking, zero cloud databases.
    - All personal data stays on the user's device.
    - Full **Export Data (JSON)**, **Import Data (with validation)**, and **Clear All Data** controls.

12. **Modern Mobile & Desktop UX**
    - Mobile: Ergonomic fixed bottom navigation (`Home`, `Calendar`, `Baby`, `Track`, `More`) with Framer Motion active pill animations and safe-area padding.
    - Tablet / Desktop: Sleek top header navigation and responsive multi-column layouts.
    - Dark mode support via `next-themes`.
    - PWA-ready with `manifest.json`, vector icons, and offline static assets.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## ☁️ Deploying to Vercel

Motherly is 100% client-side with no remote database, which makes it natively optimized for instant deployment to Vercel:

1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), select **Add New Project** and import the repository.
3. Keep default settings (`Next.js` framework preset). No environment variables are required.
4. Click **Deploy**.

---

## ⚕️ Medical Disclaimer
Motherly is designed solely as an informational pregnancy tracking and calculation companion. It does not provide medical diagnoses, treatment, or clinical care recommendations. Users should always consult a licensed healthcare provider, obstetrician, or midwife for medical advice or concerns.
