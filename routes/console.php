<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Carbon\Carbon;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule vehicle notifications to run daily and check if it's 5 days before the 1st of any month
Schedule::command('vehicles:send-notifications')
    ->daily()
    ->at('09:00')
    ->when(function () {
        $today = now();
        
        // Based on attachment mapping: Last Digit -> Month
        // 1->Jan, 2->Feb, 3->Mar, 4->Apr, 5->May, 6->Jun, 7->Jul, 8->Aug, 9->Sep, 0->Oct
        $digitToMonth = [
            1 => 1, 2 => 2, 3 => 3, 4 => 4, 5 => 5,
            6 => 6, 7 => 7, 8 => 8, 9 => 9, 0 => 10
        ];
        
        foreach ($digitToMonth as $digit => $targetMonth) {
            // Check current year
            $targetDate = Carbon::create($today->year, $targetMonth, 1);
            $notificationDate = $targetDate->copy()->subDays(5);
            
            if ($today->isSameDay($notificationDate)) {
                return true;
            }
            
            // Check next year
            $nextYearTargetDate = Carbon::create($today->year + 1, $targetMonth, 1);
            $nextYearNotificationDate = $nextYearTargetDate->copy()->subDays(5);
            
            if ($today->isSameDay($nextYearNotificationDate)) {
                return true;
            }
        }
        
        return false;
    })
    ->description('Send vehicle notifications 5 days before the 1st of each month based on plate number last digit');

// Alternative command for manual testing
Artisan::command('test-vehicle-notifications {digit?}', function ($digit = null) {
    $this->info('Running vehicle notification test...');
    
    if ($digit !== null) {
        $exitCode = Artisan::call('vehicles:send-notifications', ['--digit' => $digit]);
    } else {
        $exitCode = Artisan::call('vehicles:send-notifications');
    }
    
    $this->info('Test completed with exit code: ' . $exitCode);
    $this->line(Artisan::output());
})->purpose('Test vehicle notifications manually');
