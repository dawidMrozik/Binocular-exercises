<?php
namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\Patient as Patient;
use \App\Models\Result as Result;
use App\Includes\ValidationRules as ValidationRules;
use LangleyFoxall\EloquentReportGenerator\ReportFormats\PdfReportFormat;

class PatientController {
    private $logger;
    private $db;
    private $validator;
    
    private $table;

    // Dependency injection via constructor
    public function __construct($depLogger, $depDB, $depValidator) {
        $this->logger = $depLogger;
        $this->db = $depDB;
        $this->validator = $depValidator;
    }
    
    // GET /patients
    // Lists all patients
    public function all(Request $request, Response $response) {
        $this->logger->addInfo('GET patients');
        $queries = $request->getQueryParams();
        $count = Patient::count();
        $patients = null;
        if(array_key_exists('sort', $queries)) {
            $queries['sort'] = str_replace("'","\"", $queries['sort']);
            $queries['sort'] = json_decode($queries['sort'], true);
            $patients = Patient::orderBy($queries['sort'][0], $queries['sort'][1]);
        }

        if(array_key_exists('filter', $queries)) {
            $queries['filter'] = str_replace("'","\"", $queries['filter']);
            $queries['filter'] = json_decode($queries['filter'], true);
            if(array_key_exists('ids', $queries['filter'])) {
                if($patients == null) $patients = Patient::whereIn('id', $queries['filter']['ids']);
                else $patients = $patients->whereIn('id', $queries['filter']['ids']);
            } else if(array_key_exists(0, $queries['filter']) && array_key_exists(1, $queries['filter'])) {
                if($patients == null) $patients = Patient::where($queries['filter'][0], '==', $queries['filter'][1]);
                else $patients = $patients->where($queries['filter'][0], '==', $queries['filter'][1]);
            }
        }

        if(array_key_exists('range', $queries)) {
            $queries['range'] = json_decode($queries['range'], true);
            $response = $response->withHeader('content-range', 'patients '.$queries['range'][0].'-'.$queries['range'][1].'/'.$count);
            if($patients == null) $patients = Patient::skip($queries['range'][0])->take($queries['range'][1] - $queries['range'][0]);
            else $patients = $patients->skip($queries['range'][0])->take($queries['range'][1] - $queries['range'][0]);
        }

        if(!array_key_exists('sort', $queries) && !array_key_exists('filter', $queries) && !array_key_exists('range', $queries)) {
            $patients = Patient::all();
        } else {
            $patients = $patients->get();
        }

        return $response->withJson(['data' => $patients, 'count' => $count], 200);
    }
    
    // GET /patients/{id}
    // Retrieve patient data by ID
    public function find(Request $request, Response $response, $args) {
        $this->logger->addInfo('GET /categories/'.$args['id']);
        $user = $request->getAttribute('user');
        $patient = Patient::find($args['id']);
        if ($patient) {
            return $response->withJson([
                'success' => true,
                'data' => $patient
            ], 200);
        } else {
            return $response->withJson([
                'success' => false,
                'errors' => ['patient' => ['Patient not found: '.$args['id']]]
            ], 400);
        }
    }
    
    // POST /patients
    // Create patient
    public function create(Request $request, Response $response) {
        $this->logger->addInfo('POST /patients');
        $data = $request->getParsedBody();
        // The validate method returns the validator instance
        $validator = $this->validator->validate($request, ValidationRules::patientsPost());
        if ($validator->isValid()) {
            // Input is valid, so let's do something...
            $patient = Patient::firstOrCreate([
                'firstname' => $data['firstname'],
                'lastname' => $data['lastname'],
                'dysfunction' => $data['dysfunction'],
                'description' => $data['description'],
                'institution_id' => $data['institution_id']
            ]);
            return $response->withJson([
                'success' => true,
                'data' => $patient
            ], 200);
        } else {
            // Validation error
            return $response->withJson([
                'success' => false,
                'errors' => $validator->getErrors()
            ], 400);
        }
    }
    
    // PUT /patients/{id}
    // Updates patient
    public function update(Request $request, Response $response, $args) {
        $this->logger->addInfo('PUT /patients/'.$args['id']);
        $data = $request->getParsedBody();
        $errors = [];
        // validate inputs
        $validator = $this->validator->validate($request, ValidationRules::patientsPost());
        if (!$validator->isValid()) {
            $errors = $validator->getErrors();
        }
        // check category ID exists
        $patient = Patient::find($args['id']);
        if (!$errors && !$patient) {
            ['patient' => ['Patient not found: '.$args['id']]];
        }
        // No errors? Update DB
        if (!$errors) {
            if (isset($data['firstname']) && isset($data['lastname']) && isset($data['dysfunction'])) {
                $patient->firstname = $data['firstname'];
                $patient->lastname = $data['lastname'];
                $patient->dysfunction = $data['dysfunction'];
                $patient->description = $data['description'];
            }
            $patient->save();
            return $response->withJson(['success' => true], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }
    
    // DELETE /patients/{id}
    // Delete a patient
    public function delete(Request $request, Response $response, $args) {
        $data = $request->getParsedBody();
        $errors = [];
        // check category ID exists
        $patient = Patient::withTrashed()->find($args['id']);
        if (!$errors && !$patient) {
            $errors = ['patient' => ['Patient not found: '.$args['id']]];
        }
        if (!$errors) {
            $deleted = (isset($data['force']) && !empty($data['force'])) ? $patient->forceDelete() : $patient->delete();
            return $response->withJson(['success' => true, 'id' => $args['id']], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /patients/{id}/institution
    // Get a patients institution
    public function institution(Request $request, Response $response, $args) {
        $errors = [];
        $institution = Patient::find($args['id'])->institution()->get();

        if (!$errors && !$institution) {
            $errors = ['patient' => ['Patient not found: '.$args['id']]];
        }

        if (!$errors) {
            return $response->withJson(['success' => true, 'data' => $institution], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /patients/{id}/results
    // Get a patients results
    public function results(Request $request, Response $response, $args) {
        $errors = [];
        $results = Patient::find($args['id'])->results()->with('matrix')->with('patient')->latest()->get();

        if (!$errors && !$results) {
            $errors = ['patient' => ['Patient not found: '.$args['id']]];
        }

        if (!$errors) {
            return $response->withJson(['success' => true, 'data' => $results], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /patients/{id}/results/report
    // Get a patients results report
    public function resultsReport(Request $request, Response $response, $args) {
        $id = $args['id'];
        // Report format
        $format = (new PdfReportFormat());

        // Report generation
        Result::generateReport()
            ->format($format)
            ->query(function ($query) use ($id) {
                // Restrict the records used in the report
                $query->where('patient_id', '=', $id);  
            })
            ->fields(['patient_id', 'user_id', 'matrix_id', 'duration', 'points_missed', 'red_points', 'green_points', 'created_at'])
            ->fieldMap([
                // Change how fields appear in the report
                'patient_id' => 'Pacjent',
                'user_id' => 'Badajacy',
                'matrix_id' => 'Plansza',
                'duration' => 'Czas badania',
                'points_missed' => 'Pudla',
                'red_points' => 'Czerwone punkty',
                'green_points' => 'Zielone punkty',
                'created_at' => 'Dnia',
            ])
            ->save('reports/report.pdf');
                
        $file = $_SERVER["DOCUMENT_ROOT"] . '/reports/report.pdf';
        $fh = fopen($file, 'rb');

        $stream = new \Slim\Http\Stream($fh); // create a stream instance for the response body

        return $response->withHeader('Content-Type', 'application/force-download')
                        ->withHeader('Content-Type', 'application/octet-stream')
                        ->withHeader('Content-Type', 'application/download')
                        ->withHeader('Content-Description', 'File Transfer')
                        ->withHeader('Content-Transfer-Encoding', 'binary')
                        ->withHeader('Content-Disposition', 'attachment; filename="' . basename($file) . '"')
                        ->withHeader('Expires', '0')
                        ->withHeader('Cache-Control', 'must-revalidate, post-check=0, pre-check=0')
                        ->withHeader('Pragma', 'public')
                        ->withBody($stream); // all stream contents will be sent to the response
    }
}