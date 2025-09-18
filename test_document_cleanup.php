<?php
/**
 * Test script to verify document cleanup on record deletion
 * This is a temporary test file - should be removed after testing
 */

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\Log;

// This would be run in the Laravel environment to test the functionality
echo "Document cleanup test setup complete.\n";
echo "\nTo test document cleanup:\n";
echo "1. Create a record with documents in any module (Contract, MainMaintenance, or DriversMaintenance)\n";
echo "2. Delete the record through the UI or API\n";
echo "3. Check the logs for document deletion messages\n";
echo "4. Verify that the physical files have been removed from storage\n";
echo "\nLog messages to look for:\n";
echo "- 'Deleting documents for [module] ID: {id}'\n";
echo "- 'Document deletion result' with path and deleted status\n";

echo "\nStorage paths to check:\n";
echo "- storage/app/public/contract_documents/\n";
echo "- storage/app/public/maintenance_documents/\n";
echo "- storage/app/public/drivers_maintenance_documents/\n";