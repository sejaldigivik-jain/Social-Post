# Social Post — working split

This project was copied from the current Loomic commit `180d6d8` and intentionally keeps the existing `.env` values so it can use the same live users, workspaces, clients, Instagram account records, encrypted tokens, Supabase Storage bucket, Meta app configuration and other configured services.

**Purpose:** Scheduling and publishing

Important: because this copy currently uses the same live Loomic backend, database/storage changes made from this project can also be visible in Loomic. This is intentional for the requested “all accounts, all keys and everything as it is” working copy.

The original Loomic project is not modified by this split. The `.git` directory is intentionally excluded so this project can be initialized as a new repository without accidentally pushing to Loomic.

Windows local start:

```powershell
npm.cmd install
npm.cmd run dev
```

Then open `http://localhost:3000`. Existing Loomic login credentials and connected accounts come from the shared live database.
