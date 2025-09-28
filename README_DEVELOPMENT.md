# Development Setup

## Image Loading Fix

The image loading issue has been resolved by:

1. **Corrected APP_URL**: Changed from `https://admin.johnjess.com` to `http://localhost:8000` in `.env` file
2. **Cleared config cache**: `php artisan config:clear`
3. **Recreated storage link**: `php artisan storage:link`

## How to Run the Application

1. **Start Laravel server**: `php artisan serve` (runs on http://127.0.0.1:8000)
2. **Start Vite dev server**: `npm run dev` (runs on http://localhost:5173)
3. **Access the app**: Navigate to http://127.0.0.1:8000 in your browser

## Image Storage

Images are correctly stored in:
- **Physical path**: `storage/app/public/incident_reports/images/`
- **Public URL**: `/storage/incident_reports/images/`
- **Full URL**: `http://127.0.0.1:8000/storage/incident_reports/images/filename.png`

## Testing

You can test image access directly by visiting:
http://127.0.0.1:8000/storage/incident_reports/images/0f0M2gIZUYzMZfQEI8l23ht9Jy2xXwXkfBnGHTo2.png

## For Production

When deploying to production, change the APP_URL back to:
```
APP_URL=https://admin.johnjess.com
```