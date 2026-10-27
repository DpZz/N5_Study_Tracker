# Test report — Profile selector update

## Implemented
- First visit asks “Who's studying today?” with two round profile choices: Deepak and Guest.
- Deepak requires the shared tracker access code and continues to use the existing `jpN5Journey_v1` local data key and Supabase-backed Demt cloud profile.
- Guest uses a separate `jpN5Journey_guest_v1` local-storage key and never automatically syncs to the shared cloud profile.
- The header includes a Switch profile button.
- Cloud Test connection and Sync now actions are restricted to the Deepak profile.
- Profile selection persists in the browser so the chooser is not shown on every visit.

## Checks performed
- Extracted the main inline JavaScript and ran `node --check`: passed.
- Confirmed profile keys and cloud gating in the source.

## Not verified
- No live Vercel deployment or real Supabase connection was performed in this environment.
- Please deploy the project and test both profiles in a browser. Guest is local to that browser/device; it is not a cloud-backed multi-device guest account.
