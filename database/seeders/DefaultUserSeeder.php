<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if user already exists
        $existingUser = User::where('email', 'karloabina@gmail.com')->first();
        
        if ($existingUser) {
            // Update existing user
            $existingUser->update([
                'name' => 'James Karlo Abina',
                'password' => Hash::make('Jkabina29'),
            ]);
            
            $this->command->info('Default user updated: James Karlo Abina (karloabina@gmail.com)');
        } else {
            // Create new user
            User::create([
                'name' => 'James Karlo Abina',
                'email' => 'karloabina@gmail.com',
                'password' => Hash::make('Jkabina29'),
            ]);
            
            $this->command->info('Default user created: James Karlo Abina (karloabina@gmail.com)');
        }
    }
}
