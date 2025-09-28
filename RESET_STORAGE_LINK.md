# Reset Storage Link Instructions

## For Local Development Issues

If images are not loading locally, run these commands:

```bash
# 1. Remove existing storage link
Remove-Item public\storage -Force -Recurse

# 2. Create new storage link
php artisan storage:link

# 3. Clear config cache
php artisan config:clear

# 4. Make sure APP_URL is set for local development
# In .env file: APP_URL=http://localhost:8000
```

## For Production Deployment

```bash
# 1. Create storage link
php artisan storage:link

# 2. Set correct permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# 3. Make sure APP_URL is set for production
# In .env file: APP_URL=https://admin.johnjess.com
```

## Test Image Access

After running these commands, test that images are accessible:
- Local: http://127.0.0.1:8000/storage/incident_reports/images/[filename]
- Production: https://admin.johnjess.com/storage/incident_reports/images/[filename]