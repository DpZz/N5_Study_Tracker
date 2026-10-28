# Version 2 Test Report — Japanese N5 Tracker

## Build contents
- `index.html`: study tracker with lesson vocabulary, per-lesson tests, listening lab, kanji practice, progress tracking and local backup controls.
- `api/tracker.js`: server-side Supabase API for the Deepak profile.
- `README.md`: Vercel/Supabase setup and deployment instructions.

## Automated checks
- Inline JavaScript block 1: **PASS**
- 25 lesson vocabulary arrays: **PASS**
- each lesson has vocabulary entries: **PASS**
- lesson test selectors and controls: **PASS**
- missed-word review saved per profile: **PASS**
- listening exercise controls: **PASS**
- profile selector and cloud API present: **PASS**
- 200-kanji deck present: **PASS** (array contains 200 entries)
- local backup import/export controls: **PASS**

## Vocabulary coverage snapshot

| Lesson | Entries in practice bank |
|---:|---:|
| 1 | 31 |
| 2 | 45 |
| 3 | 42 |
| 4 | 43 |
| 5 | 50 |
| 6 | 44 |
| 7 | 44 |
| 8 | 49 |
| 9 | 44 |
| 10 | 38 |
| 11 | 45 |
| 12 | 51 |
| 13 | 35 |
| 14 | 34 |
| 15 | 26 |
| 16 | 36 |
| 17 | 33 |
| 18 | 27 |
| 19 | 30 |
| 20 | 27 |
| 21 | 31 |
| 22 | 21 |
| 23 | 28 |
| 24 | 21 |
| 25 | 23 |

Total entries across lesson banks (duplicates across different lessons may occur): **898**.

## Important source and testing limitations
- Vocabulary was compiled from the lesson-page images supplied in this conversation, with additional entries added for all 25 lessons. The app provides lesson-specific tests that draw from the current lesson bank.
- This is **not certified as a complete word-for-word transcription of every vocabulary item and every dialogue expression on all textbook pages**. Some small or unclear print may be omitted or need checking against the physical book. The per-lesson counts above are the actual current practice-bank counts.
- Listening Lab currently uses browser Japanese speech synthesis and in-page comprehension prompts; it does not yet map the supplied MP3 collection to specific lesson numbers. Browser Japanese voice availability varies by device.
- Syntax checks and source-level UI checks were performed. No real browser automation, live Vercel deployment, Supabase credentials, or cross-device sync test was available in this build environment.
- Keep a local backup before replacing Version 1. After deployment, test both Deepak and Guest profiles, a lesson test, listening playback, and backup export/import.

## Daily quiz update
- Replaced the fixed Day 1 quiz with five generated vocabulary questions based on the lesson assigned to the selected study date.
- “New questions / clear answers” shuffles a fresh set for the same lesson.
- JavaScript syntax check passed; browser-level testing and live deployment remain unverified.

## Version 3 additions (2026-10-28)
- Added a Grammar Reference tab covering Lessons 1–25 with key patterns, formation/usage notes, sample Japanese sentences, and English translations. Keyword filter applies within the selected lesson.
- Added Hiragana & Katakana recognition flashcards, including mixed practice and voiced/semi-voiced kana, reveal-romaji interaction, known/review marking, and a quick reference chart.
- Both embedded JavaScript blocks pass Node.js syntax compilation (`new Function` check).
- Not verified in a real browser, mobile device, live Vercel deployment, or connected Supabase environment. Deploy to a preview first and test grammar lesson switching/search, kana set/group switching, reveal/known/review buttons, and persistence after refresh.
- Grammar summaries are a compact study reference based on common Minna no Nihongo I lesson progression, not a verified transcription of the user's exact textbook edition. Check exact wording and examples against the textbook.
