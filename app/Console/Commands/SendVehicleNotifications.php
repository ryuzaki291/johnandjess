<?php

namespace App\Console\Commands;

use App\Mail\VehicleNotificationMail;
use App\Models\Vehicle;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendVehicleNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vehicles:send-notifications {--digit= : Specific last digit to send notifications for (0-9)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send vehicle notifications to karloabina@gmail.com based on plate number last digit';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $notificationDate = Carbon::now()->format('Y-m-d H:i:s');
        $recipientEmail = 'karloabina@gmail.com';
        
        $today = Carbon::now();
        
        // Determine which digit to process
        if ($this->option('digit') !== null) {
            $targetDigit = (int) $this->option('digit');
            if ($targetDigit < 0 || $targetDigit > 9) {
                $this->error('Digit must be between 0 and 9');
                return 1;
            }
            $this->info("Manual mode: Processing vehicles with plate numbers ending in: {$targetDigit}");
        } else {
            // Check if today is a scheduled notification day
            $scheduledDigit = $this->getScheduledDigitForToday($today);
            
            if ($scheduledDigit === null) {
                $nextScheduledInfo = $this->getNextScheduledDateWithDigit($today);
                $this->info('Today is not a scheduled notification day. Use --digit option to force send for a specific digit.');
                $this->info("Today: " . $today->format('Y-m-d'));
                $this->info("Next scheduled day: " . $nextScheduledInfo['date']->format('Y-m-d') . " (for digit " . $nextScheduledInfo['digit'] . " - " . $this->getMonthForDigit($nextScheduledInfo['digit']) . ")");
                return 0;
            }
            
            $targetDigit = $scheduledDigit;
            $targetMonth = $this->getMonthForDigit($targetDigit);
            $this->info("Scheduled mode: Processing vehicles with plate numbers ending in: {$targetDigit} (for {$targetMonth} notifications)");
        }
        
        // Get all vehicles and filter by last digit of plate number
        $allVehicles = Vehicle::all();
        $filteredVehicles = $allVehicles->filter(function ($vehicle) use ($targetDigit) {
            $plateNumber = $vehicle->plate_number;
            $lastChar = substr($plateNumber, -1);
            
            // Check if last character is a digit and matches target
            if (is_numeric($lastChar)) {
                return (int) $lastChar === $targetDigit;
            }
            return false;
        });
        
        $this->info("Found {$filteredVehicles->count()} vehicles with plate numbers ending in {$targetDigit}");
        
        if ($filteredVehicles->count() > 0) {
            // Display vehicles that will be included in notification
            $this->table(
                ['Plate Number', 'Type', 'Brand', 'Owner', 'Status'],
                $filteredVehicles->map(function ($vehicle) {
                    return [
                        $vehicle->plate_number,
                        $vehicle->vehicle_type ?? 'N/A',
                        $vehicle->vehicle_brand ?? 'N/A',
                        $vehicle->vehicle_owner ?? 'N/A',
                        $vehicle->vehicle_status ?? 'N/A',
                    ];
                })->toArray()
            );
            
            try {
                // Send the notification email
                Mail::to($recipientEmail)->send(new VehicleNotificationMail(
                    $filteredVehicles,
                    $targetDigit,
                    $notificationDate
                ));
                
                $this->info("✅ Notification sent successfully to {$recipientEmail}");
                $this->info("📧 Email contains {$filteredVehicles->count()} vehicles with plate numbers ending in {$targetDigit}");
                
            } catch (\Exception $e) {
                $this->error("❌ Failed to send notification: " . $e->getMessage());
                return 1;
            }
        } else {
            $this->info("No vehicles found with plate numbers ending in {$targetDigit}. No notification sent.");
        }
        
        return 0;
    }

    /**
     * Check if today is a scheduled notification day and return the digit if so.
     *
     * @param Carbon $today
     * @return int|null The digit to process, or null if not a scheduled day
     */
    private function getScheduledDigitForToday(Carbon $today): ?int
    {
        // Based on the attachment mapping: Last Digit -> Month
        // 1 -> January, 2 -> February, 3 -> March, 4 -> April, 5 -> May
        // 6 -> June, 7 -> July, 8 -> August, 9 -> September, 0 -> October
        $digitToMonth = [
            1 => 1,  // January
            2 => 2,  // February
            3 => 3,  // March
            4 => 4,  // April
            5 => 5,  // May
            6 => 6,  // June
            7 => 7,  // July
            8 => 8,  // August
            9 => 9,  // September
            0 => 10  // October
        ];
        
        foreach ($digitToMonth as $digit => $targetMonth) {
            // For current year
            $targetDate = Carbon::create($today->year, $targetMonth, 1);
            $notificationDate = $targetDate->copy()->subDays(5);
            
            if ($today->isSameDay($notificationDate)) {
                return $digit;
            }
            
            // For next year (if we're checking months and we're late in current year)
            $nextYearTargetDate = Carbon::create($today->year + 1, $targetMonth, 1);
            $nextYearNotificationDate = $nextYearTargetDate->copy()->subDays(5);
            
            if ($today->isSameDay($nextYearNotificationDate)) {
                return $digit;
            }
        }
        
        return null;
    }

    /**
     * Get the next scheduled notification date with digit info.
     *
     * @param Carbon $today
     * @return array
     */
    private function getNextScheduledDateWithDigit(Carbon $today): array
    {
        $digitToMonth = [
            1 => 1,  // January
            2 => 2,  // February
            3 => 3,  // March
            4 => 4,  // April
            5 => 5,  // May
            6 => 6,  // June
            7 => 7,  // July
            8 => 8,  // August
            9 => 9,  // September
            0 => 10  // October
        ];
        
        $upcomingDates = [];
        
        foreach ($digitToMonth as $digit => $targetMonth) {
            // Current year
            $targetDate = Carbon::create($today->year, $targetMonth, 1);
            $notificationDate = $targetDate->copy()->subDays(5);
            
            if ($notificationDate->gt($today)) {
                $upcomingDates[] = ['date' => $notificationDate, 'digit' => $digit];
            }
            
            // Next year
            $nextYearTargetDate = Carbon::create($today->year + 1, $targetMonth, 1);
            $nextYearNotificationDate = $nextYearTargetDate->copy()->subDays(5);
            $upcomingDates[] = ['date' => $nextYearNotificationDate, 'digit' => $digit];
        }
        
        // Sort by date and return the earliest
        usort($upcomingDates, function($a, $b) {
            return $a['date']->lt($b['date']) ? -1 : ($a['date']->gt($b['date']) ? 1 : 0);
        });
        
        return $upcomingDates[0];
    }

    /**
     * Get the next scheduled notification date.
     *
     * @param Carbon $today
     * @return Carbon
     */
    private function getNextScheduledDate(Carbon $today): Carbon
    {
        $result = $this->getNextScheduledDateWithDigit($today);
        return $result['date'];
    }

    /**
     * Get the month name for a given digit based on the attachment mapping.
     *
     * @param int $digit
     * @return string
     */
    private function getMonthForDigit(int $digit): string
    {
        // Based on the attachment: Last Digit -> Month
        $months = [
            1 => 'January',
            2 => 'February', 
            3 => 'March',
            4 => 'April',
            5 => 'May',
            6 => 'June',
            7 => 'July',
            8 => 'August',
            9 => 'September',
            0 => 'October'
        ];
        
        return $months[$digit] ?? 'Unknown';
    }
}
