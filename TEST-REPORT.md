# Japanese N5 Tracker — test report

## Checks completed on the project files
- JavaScript syntax check passed for `index.html`'s main script using `node --check`.
- JavaScript syntax check passed for `api/tracker.js` using `node --check`.
- Confirmed the daily task renderer has its required date/phase/lesson helper functions and `taskSet()` implementation.
- Confirmed the new N5 Kanji tab, flashcard controls, 89 kanji records, review/known tracking, and table are present in the main script and HTML.
- Confirmed the JavaScript is inside the HTML script element; no app JavaScript is appended after `</html>`.
- Corrected the Supabase setup SQL in the README to enable RLS on `tracker_shared_data` (the table the API actually uses).

## Live deployment status
The currently published URL was inspected separately and its returned page content still shows JavaScript such as `function renderStats()` after the closing HTML content. That indicates the live deployment is still serving the broken build. I cannot publish a new Vercel deployment from this chat, and I could not perform a full interactive test against your live deployment or your Supabase instance. Upload this project and redeploy it, then verify the checklist below.

## Post-deploy acceptance checklist
1. Open the site and confirm Today displays six study tasks.
2. Click `Mark as done`; confirm the task and today's percentage update.
3. Click `Full plan`, `Lessons`, `Flashcards`, and `N5 Kanji`; confirm each tab opens.
4. In `N5 Kanji`, reveal/hide details, mark a kanji known, mark one for review, and check that status updates.
5. In Backup, test the cloud connection and confirm the status says Connected. If not, inspect Vercel function logs and verify the environment variables and Supabase table.
6. Export a local JSON backup before using Reset.
