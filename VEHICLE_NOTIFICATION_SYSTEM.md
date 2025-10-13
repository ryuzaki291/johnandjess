# Vehicle Notification System

## Overview
This system automatically sends email notifications to `karloabina@gmail.com` based on vehicle plate numbers' last digit. The notifications are sent 5 days before every 1st of the month, yearly.

## How It Works

### Scheduling Logic
- The system runs daily at 9:00 AM
- It checks if today is exactly 5 days before the 1st of the next month
- If it is a scheduled day, it processes vehicles based on the current month number
- The target digit is determined by: `current_month % 10`

### Month-to-Digit Mapping
Based on the provided attachment, the mapping is exactly as follows:
- **Last Digit 1** → January
- **Last Digit 2** → February  
- **Last Digit 3** → March
- **Last Digit 4** → April
- **Last Digit 5** → May
- **Last Digit 6** → June
- **Last Digit 7** → July
- **Last Digit 8** → August
- **Last Digit 9** → September
- **Last Digit 0** → October

### Notification Schedule
Notifications are sent **5 days before the 1st** of each corresponding month:
- **Digit 1 (January)**: December 27th
- **Digit 2 (February)**: January 27th
- **Digit 3 (March)**: February 24th/25th (depending on leap year)
- **Digit 4 (April)**: March 27th
- **Digit 5 (May)**: April 26th
- **Digit 6 (June)**: May 27th
- **Digit 7 (July)**: June 26th
- **Digit 8 (August)**: July 27th
- **Digit 9 (September)**: August 27th
- **Digit 0 (October)**: September 26th

## Components

### 1. Mailable Class
- **File**: `app/Mail/VehicleNotificationMail.php`
- **Purpose**: Formats and sends the notification email
- **Features**: 
  - Professional HTML email template
  - Vehicle details table
  - Summary information
  - Responsive design

### 2. Email Template
- **File**: `resources/views/emails/vehicle-notification.blade.php`
- **Features**:
  - Clean, professional design
  - Vehicle information table
  - Summary statistics
  - Mobile-responsive layout

### 3. Artisan Command
- **File**: `app/Console/Commands/SendVehicleNotifications.php`
- **Command**: `php artisan vehicles:send-notifications`
- **Options**:
  - `--digit=X`: Force send notifications for specific digit (0-9)
- **Features**:
  - Automatic scheduling detection
  - Vehicle filtering by plate number last digit
  - Email sending with error handling
  - Detailed console output with tables

### 4. Vehicle Model Enhancement
- **File**: `app/Models/Vehicle.php`
- **New Methods**:
  - `getPlateLastDigitAttribute()`: Get last digit of plate number
  - `scopeWhereLastDigit()`: Filter vehicles by last digit
  - `scopeWithNumericLastDigit()`: Get vehicles with numeric endings

### 5. Scheduling Configuration
- **File**: `routes/console.php`
- **Schedule**: Daily at 9:00 AM with date validation
- **Test Command**: `php artisan test-vehicle-notifications [digit]`

## Usage

### Manual Testing
```bash
# Test with specific digit
php artisan vehicles:send-notifications --digit=0

# Test with convenience command
php artisan test-vehicle-notifications 0

# Check if today is scheduled day
php artisan vehicles:send-notifications
```

### Production Setup
1. Ensure mail configuration is properly set in `.env`:
   ```
   MAIL_MAILER=smtp
   MAIL_HOST=your.smtp.host
   MAIL_PORT=587
   MAIL_USERNAME=your-email@domain.com
   MAIL_PASSWORD=your-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=your-email@domain.com
   MAIL_FROM_NAME="Vehicle Management System"
   ```

2. Set up Laravel scheduler in cron:
   ```bash
   * * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
   ```

3. Monitor logs for successful email sends

### Email Content
The notification email includes:
- Header with notification purpose
- Summary section with date, digit filter, and vehicle count
- Detailed vehicle table with:
  - Plate number (highlighted)
  - Vehicle type
  - Brand
  - Owner
  - Company name
  - Status
  - Date added to company
- Footer with automatic generation note

## Scheduled Dates (Current Year Example - 2025)
Based on 5 days before the 1st of each corresponding month:
- **September 26, 2025** → October 1st (digit 0)
- **December 27, 2025** → January 1st (digit 1)
- **January 27, 2026** → February 1st (digit 2)
- **February 24, 2026** → March 1st (digit 3)
- **March 27, 2026** → April 1st (digit 4)
- **April 26, 2026** → May 1st (digit 5)
- **May 27, 2026** → June 1st (digit 6)
- **June 26, 2026** → July 1st (digit 7)
- **July 27, 2026** → August 1st (digit 8)
- **August 27, 2026** → September 1st (digit 9)

**Note**: Since we're currently on October 13, 2025, the next scheduled notification will be December 27, 2025 (for January - digit 1).

## Error Handling
- Invalid digit parameters (must be 0-9)
- Email sending failures (logged with error messages)
- Empty vehicle lists (graceful handling with informational message)
- Non-scheduled day execution (informational message with next date)

## Security Notes
- Email address is hardcoded for security (`karloabina@gmail.com`)
- No user input for email addresses prevents spam/injection
- Command validation prevents invalid parameters