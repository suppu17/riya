# Apply Supabase Migration for Enhanced Profile Fields

To update your Supabase database with the new profile fields, you have a few options:

## Option 1: Using Supabase CLI (Recommended)

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project (if not already done):
   ```bash
   supabase init
   ```

3. Link to your Supabase project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. Apply the migration:
   ```bash
   supabase db push
   ```

## Option 2: Manual SQL Execution

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250102000000_add_profile_fields.sql`
4. Execute the SQL

## Option 3: Using the provided script

Run the following command to execute the migration SQL directly:

```bash
node apply-migration.js
```

## What this migration adds:

- `bio`: User biography/description
- `location`: User location (city, country)
- `join_date`: Date when user joined the platform
- `membership_type`: Type of membership (standard, premium, etc.)
- `social_links`: Social media links and handles (JSON)
- `stats`: User statistics like posts count, followers, etc. (JSON)
- Sample data for demonstration

## After applying the migration:

The ProfilePage component will now display real data from your Supabase database instead of hardcoded sample data. Users will see:

- Their actual profile information
- Dynamic membership status
- Real bio and location data
- Proper join dates
- Social links and statistics when available

The sample user "Supriya Korukonda" will be created with ID `00000000-0000-0000-0000-000000000001` for demonstration purposes.