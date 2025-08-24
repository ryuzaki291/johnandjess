<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class IncidentReportController extends Controller
{
    /**
     * Display a listing of incident reports
     */
    public function index(): JsonResponse
    {
        try {
            $incidentReports = IncidentReport::with(['vehicle', 'creator'])
                ->orderBy('incident_date', 'desc')
                ->orderBy('incident_time', 'desc')
                ->get();

            Log::info('Incident reports fetched successfully', [
                'count' => $incidentReports->count()
            ]);

            return response()->json([
                'success' => true,
                'data' => $incidentReports
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching incident reports', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching incident reports'
            ], 500);
        }
    }

    /**
     * Store a newly created incident report
     */
    public function store(Request $request): JsonResponse
    {
        try {
            Log::info('Creating new incident report', ['data' => $request->all()]);

            $validator = Validator::make($request->all(), [
                'plate_number' => 'required|string|exists:vehicles,plate_number',
                'incident_type' => 'required|string|max:255',
                'incident_description' => 'required|string',
                'incident_date' => 'required|date',
                'incident_time' => 'required|date_format:H:i',
                'location' => 'required|string|max:255',
                'reporter_name' => 'required|string|max:255',
                'reporter_contact' => 'required|string|max:255',
                'reporter_position' => 'required|string|max:255',
                'damage_description' => 'nullable|string',
                'estimated_cost' => 'nullable|numeric|min:0',
                'severity_level' => ['required', Rule::in(['Low', 'Medium', 'High', 'Critical'])],
                'status' => ['nullable', Rule::in(['Open', 'In Progress', 'Resolved', 'Closed'])],
                'action_taken' => 'nullable|string',
                'notes' => 'nullable|string',
                'incident_images.*' => 'nullable|file|mimes:jpeg,jpg,png,gif|max:5120', // 5MB max
                'incident_documents.*' => 'nullable|file|mimes:pdf,doc,docx,txt|max:10240', // 10MB max
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get vehicle information
            $vehicle = Vehicle::where('plate_number', $request->plate_number)->first();

            // Handle file uploads
            $imagePaths = [];
            $documentPaths = [];

            if ($request->hasFile('incident_images')) {
                foreach ($request->file('incident_images') as $image) {
                    $path = $image->store('incident_reports/images', 'public');
                    $imagePaths[] = $path;
                }
            }

            if ($request->hasFile('incident_documents')) {
                foreach ($request->file('incident_documents') as $document) {
                    $path = $document->store('incident_reports/documents', 'public');
                    $documentPaths[] = $path;
                }
            }

            $incidentReport = IncidentReport::create([
                'plate_number' => $request->plate_number,
                'vehicle_type' => $vehicle ? $vehicle->vehicle_type : null,
                'vehicle_owner' => $vehicle ? $vehicle->vehicle_owner : null,
                'incident_type' => $request->incident_type,
                'incident_description' => $request->incident_description,
                'incident_date' => $request->incident_date,
                'incident_time' => $request->incident_time,
                'location' => $request->location,
                'reporter_name' => $request->reporter_name,
                'reporter_contact' => $request->reporter_contact,
                'reporter_position' => $request->reporter_position,
                'damage_description' => $request->damage_description,
                'estimated_cost' => $request->estimated_cost,
                'severity_level' => $request->severity_level ?? 'Low',
                'incident_images' => $imagePaths,
                'incident_documents' => $documentPaths,
                'status' => $request->status ?? 'Open',
                'action_taken' => $request->action_taken,
                'notes' => $request->notes,
                'created_by' => auth()->id() ?? 1, // Default to user ID 1 if not authenticated
            ]);

            $incidentReport->load(['vehicle', 'creator']);

            Log::info('Incident report created successfully', [
                'incident_report_id' => $incidentReport->id,
                'plate_number' => $incidentReport->plate_number,
                'images_count' => count($imagePaths),
                'documents_count' => count($documentPaths)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Incident report created successfully',
                'data' => $incidentReport
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating incident report', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error creating incident report'
            ], 500);
        }
    }

    /**
     * Display the specified incident report
     */
    public function show(string $id): JsonResponse
    {
        try {
            $incidentReport = IncidentReport::with(['vehicle', 'creator'])->findOrFail($id);

            Log::info('Incident report retrieved successfully', [
                'incident_report_id' => $id
            ]);

            return response()->json([
                'success' => true,
                'data' => $incidentReport
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving incident report', [
                'incident_report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Incident report not found'
            ], 404);
        }
    }

    /**
     * Update the specified incident report
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            Log::info('Updating incident report', [
                'incident_report_id' => $id,
                'data' => $request->all(),
                'method' => $request->method(),
                'has_files' => $request->hasFile('incident_images') || $request->hasFile('incident_documents')
            ]);

            $incidentReport = IncidentReport::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'plate_number' => 'required|string|exists:vehicles,plate_number',
                'incident_type' => 'required|string|max:255',
                'incident_description' => 'required|string',
                'incident_date' => 'required|date',
                'incident_time' => 'required|date_format:H:i',
                'location' => 'required|string|max:255',
                'reporter_name' => 'required|string|max:255',
                'reporter_contact' => 'required|string|max:255',
                'reporter_position' => 'required|string|max:255',
                'damage_description' => 'nullable|string',
                'estimated_cost' => 'nullable|numeric|min:0',
                'severity_level' => ['required', Rule::in(['Low', 'Medium', 'High', 'Critical'])],
                'status' => ['required', Rule::in(['Open', 'In Progress', 'Resolved', 'Closed'])],
                'action_taken' => 'nullable|string',
                'notes' => 'nullable|string',
                'incident_images.*' => 'nullable|file|mimes:jpeg,jpg,png,gif|max:5120',
                'incident_documents.*' => 'nullable|file|mimes:pdf,doc,docx,txt|max:10240',
            ]);

            if ($validator->fails()) {
                Log::error('Incident report update validation failed', [
                    'incident_report_id' => $id,
                    'errors' => $validator->errors()->toArray()
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get vehicle information
            $vehicle = Vehicle::where('plate_number', $request->plate_number)->first();

            // Handle new file uploads
            $existingImages = $incidentReport->incident_images ?? [];
            $existingDocuments = $incidentReport->incident_documents ?? [];

            if ($request->hasFile('incident_images')) {
                foreach ($request->file('incident_images') as $image) {
                    $path = $image->store('incident_reports/images', 'public');
                    $existingImages[] = $path;
                }
            }

            if ($request->hasFile('incident_documents')) {
                foreach ($request->file('incident_documents') as $document) {
                    $path = $document->store('incident_reports/documents', 'public');
                    $existingDocuments[] = $path;
                }
            }

            $incidentReport->update([
                'plate_number' => $request->plate_number,
                'vehicle_type' => $vehicle ? $vehicle->vehicle_type : null,
                'vehicle_owner' => $vehicle ? $vehicle->vehicle_owner : null,
                'incident_type' => $request->incident_type,
                'incident_description' => $request->incident_description,
                'incident_date' => $request->incident_date,
                'incident_time' => $request->incident_time,
                'location' => $request->location,
                'reporter_name' => $request->reporter_name,
                'reporter_contact' => $request->reporter_contact,
                'reporter_position' => $request->reporter_position,
                'damage_description' => $request->damage_description,
                'estimated_cost' => $request->estimated_cost,
                'severity_level' => $request->severity_level,
                'incident_images' => $existingImages,
                'incident_documents' => $existingDocuments,
                'status' => $request->status,
                'action_taken' => $request->action_taken,
                'notes' => $request->notes,
            ]);

            $incidentReport->load(['vehicle', 'creator']);

            Log::info('Incident report updated successfully', [
                'incident_report_id' => $id,
                'plate_number' => $incidentReport->plate_number
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Incident report updated successfully',
                'data' => $incidentReport
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating incident report', [
                'incident_report_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error updating incident report'
            ], 500);
        }
    }

    /**
     * Remove the specified incident report
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $incidentReport = IncidentReport::findOrFail($id);

            // Delete associated files
            if ($incidentReport->incident_images) {
                foreach ($incidentReport->incident_images as $imagePath) {
                    Storage::disk('public')->delete($imagePath);
                }
            }

            if ($incidentReport->incident_documents) {
                foreach ($incidentReport->incident_documents as $documentPath) {
                    Storage::disk('public')->delete($documentPath);
                }
            }

            $incidentReport->delete();

            Log::info('Incident report deleted successfully', [
                'incident_report_id' => $id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Incident report deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting incident report', [
                'incident_report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error deleting incident report'
            ], 500);
        }
    }

    /**
     * Get vehicles for dropdown
     */
    public function getVehicles(): JsonResponse
    {
        try {
            $vehicles = Vehicle::select('plate_number', 'vehicle_type', 'vehicle_owner')
                ->orderBy('plate_number')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $vehicles
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching vehicles for incident reports', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching vehicles'
            ], 500);
        }
    }

    /**
     * Remove a specific file from an incident report
     */
    public function removeFile(Request $request, string $id): JsonResponse
    {
        try {
            $incidentReport = IncidentReport::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'file_path' => 'required|string',
                'file_type' => 'required|in:image,document'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $filePath = $request->file_path;
            $fileType = $request->file_type;

            if ($fileType === 'image') {
                $incidentReport->removeImage($filePath);
            } else {
                $incidentReport->removeDocument($filePath);
            }

            // Delete the file from storage
            Storage::disk('public')->delete($filePath);

            Log::info('File removed from incident report', [
                'incident_report_id' => $id,
                'file_path' => $filePath,
                'file_type' => $fileType
            ]);

            return response()->json([
                'success' => true,
                'message' => 'File removed successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error removing file from incident report', [
                'incident_report_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error removing file'
            ], 500);
        }
    }
}
