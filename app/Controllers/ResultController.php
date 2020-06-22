<?php
namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\Result as Result;
use App\Includes\ValidationRules as ValidationRules;

class ResultController {
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
    
    // GET /results
    // Lists all results
    public function all(Request $request, Response $response) {
        $this->logger->addInfo('GET /results');
        $queries = $request->getQueryParams();
        $results = null;
        if(array_key_exists('sort', $queries)) {
            $queries['sort'] = str_replace("'","\"", $queries['sort']);
            $queries['sort'] = json_decode($queries['sort'], true);
            $results = Result::orderBy($queries['sort'][0], $queries['sort'][1]);
        }

        if(array_key_exists('filter', $queries)) {
            $queries['filter'] = str_replace("'","\"", $queries['filter']);
            $queries['filter'] = json_decode($queries['filter'], true);
            if(array_key_exists('ids', $queries['filter'])) {
                if($results == null) $results = Result::whereIn('id', $queries['filter']['ids']);
                else $results = $results->whereIn('id', $queries['filter']['ids']);
            } else if(array_key_exists(0, $queries['filter']) && array_key_exists(1, $queries['filter'])) {
                if($results == null) $results = Result::where($queries['filter'][0], '==', $queries['filter'][1]);
                else $results = $results->where($queries['filter'][0], '==', $queries['filter'][1]);
            }
        }

        if(array_key_exists('range', $queries)) {
            $queries['range'] = json_decode($queries['range'], true);
            $count = Result::count();
            $response = $response->withHeader('content-range', 'results '.$queries['range'][0].'-'.$queries['range'][1].'/'.$count);
            if($results == null) $results = Result::skip($queries['range'][0])->take($queries['range'][1] - $queries['range'][0]);
            else $results = $results->skip($queries['range'][0])->take($queries['range'][1] - $queries['range'][0]);
        }

        if(!array_key_exists('sort', $queries) && !array_key_exists('filter', $queries) && !array_key_exists('range', $queries)) {
            $results = Result::all();
        } else {
            $results = $results->get(); 
        }

        return $response->withJson(['data' => $results], 200);
    }
    
    // GET /results/{id}
    // Retrieve result data by ID
    public function find(Request $request, Response $response, $args) {
        $this->logger->addInfo('GET /categories/'.$args['id']);
        $user = $request->getAttribute('user');
        $result = Result::find($args['id']);
        if ($result) {
            return $response->withJson([
                'success' => true,
                'data' => $result
            ], 200);
        } else {
            return $response->withJson([
                'success' => false,
                'errors' => ['results' => ['Results not found: '.$args['id']]]
            ], 400);
        }
    }
    
    // POST /results
    // Create result
    public function create(Request $request, Response $response) {
        $this->logger->addInfo('POST /results');
        $data = $request->getParsedBody();
        // The validate method returns the validator instance
        $validator = $this->validator->validate($request, ValidationRules::resultsPost());
        if ($validator->isValid()) {
            // Input is valid, so let's do something...
            $result = Result::firstOrCreate([
                'duration' => $data['duration'],
                'red_points' => $data['red_points'],
                'green_points' => $data['green_points'],
                'points_missed' => $data['points_missed'],
                'patient_id' => $data['patient_id'],
                'institution_id' => $data['institution_id'],
                'user_id' => $data['user_id'],
                'matrix_id' => $data['matrix_id'],
                'completed' => $data['completed']
            ]);
            return $response->withJson([
                'success' => true,
                'data' => $result
            ], 200);
        } else {
            // Validation error
            return $response->withJson([
                'success' => false,
                'errors' => $validator->getErrors()
            ], 400);
        }
    }
    
    // PUT /results/{id}
    // Updates result
    public function update(Request $request, Response $response, $args) {
        $this->logger->addInfo('PUT /results/'.$args['id']);
        $data = $request->getParsedBody();
        $errors = [];
        // validate inputs
        $validator = $this->validator->validate($request, ValidationRules::resultsPost());
        if (!$validator->isValid()) {
            $errors = $validator->getErrors();
        }
        // check category ID exists
        $result = Result::find($args['id']);
        if (!$errors && !$result) {
            $errors = ['results' => ['Results not found: '.$args['id']]];
        }
        // No errors? Update DB
        if (!$errors) {
            if (isset($data['duration']) && isset($data['green_points']) && isset($data['red_points']) && isset($data['points_missed'])) {
                $result->name = $data['duration'];
                $result->green_points = $data['green_points'];
                $result->red_points = $data['red_points'];
                $result->points_missed = $data['points_missed'];
            }
            $result->save();
            return $response->withJson(['success' => true], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }
    
    // DELETE /results/{id}
    // Delete a result
    public function delete(Request $request, Response $response, $args) {
        $data = $request->getParsedBody();
        $errors = [];
        // check category ID exists
        $result = Result::withTrashed()->find($args['id']);
        if (!$errors && !$result) {
            $errors = ['results' => ['Results not found: '.$args['id']]];
        }
        if (!$errors) {
            $deleted = (isset($data['force']) && !empty($data['force'])) ? $result->forceDelete() : $result->delete();
            return $response->withJson(['success' => true], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /results/{id}/patient
    // Get a results patient
    public function patient(Request $request, Response $response, $args) {
        $errors = [];
        $patient = Result::find($args['id'])->patient()->get();

        if (!$errors && !$patient) {
            $errors = ['results' => ['Results not found: '.$args['id']]];
        }

        if (!$errors) {
            return $response->withJson(['success' => true, 'data' => $patient], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /results/{id}/matrix
    // Get a results matrix
    public function matrix(Request $request, Response $response, $args) {
        $errors = [];
        $matrix = Result::find($args['id'])->matrix()->get();

        if (!$errors && !$matrix) {
            $errors = ['results' => ['Results not found: '.$args['id']]];
        }

        if (!$errors) {
            return $response->withJson(['success' => true, 'data' => $matrix], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /results/{id}/user
    // Get a results user
    public function user(Request $request, Response $response, $args) {
        $errors = [];
        $user = Result::find($args['id'])->user()->get();

        if (!$errors && !$user) {
            $errors = ['results' => ['Results not found: '.$args['id']]];
        }

        if (!$errors) {
            return $response->withJson(['success' => true, 'data' => $user], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }
}