<?php
namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\Institution as Institution;
use App\Includes\ValidationRules as ValidationRules;
use \App\Models\User as User;

class InstitutionController {
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
    
    // GET /institutions
    // Lists all institutions
    public function all(Request $request, Response $response) {
        $this->logger->addInfo('GET institutions');
        $queries = $request->getQueryParams();
        $institutions = null;
        if(array_key_exists('sort', $queries)) {
            $queries['sort'] = str_replace("'","\"", $queries['sort']);
            $queries['sort'] = json_decode($queries['sort'], true);
            $institutions = Institution::orderBy($queries['sort'][0], $queries['sort'][1]);
        }

        if(array_key_exists('filter', $queries)) {
            $queries['filter'] = str_replace("'","\"", $queries['filter']);
            $queries['filter'] = json_decode($queries['filter'], true);
            if(array_key_exists('ids', $queries['filter'])) {
                if($institutions == null) $institutions = Institution::whereIn('id', $queries['filter']['ids']);
                else $institutions = $institutions->whereIn('id', $queries['filter']['ids']);
            } else if(array_key_exists(0, $queries['filter']) && array_key_exists(1, $queries['filter'])) {
                if($institutions == null) $institutions = Institution::where($queries['filter'][0], '==', $queries['filter'][1]);
                else $institutions = $institutions->where($queries['filter'][0], '==', $queries['filter'][1]);
            }
        }

        if(array_key_exists('range', $queries)) {
            $queries['range'] = json_decode($queries['range'], true);
            $count = Institution::count();
            $response = $response->withHeader('content-range', 'institutions '.$queries['range'][0].'-'.$queries['range'][1].'/'.$count);
            if($institutions == null) $institutions = Institution::skip($queries['range'][0])->take($queries['range'][1] - $queries['range'][0]);
            else $institutions = $institutions->skip($queries['range'][0])->take($queries['range'][1] - $queries['range'][0]);
        }

        if(!array_key_exists('sort', $queries) && !array_key_exists('filter', $queries) && !array_key_exists('range', $queries)) {
            $institutions = Institution::all();
        } else {
            $institutions = $institutions->get();
        }

        return $response->withJson(['data' => $institutions], 200);
    }
    
    // GET /institutions/{id}
    // Retrieve institution data by ID
    public function find(Request $request, Response $response, $args) {
        $this->logger->addInfo('GET /institutions/'.$args['id']);
        $user = $request->getAttribute('user');
        $institution = Institution::find($args['id']);
        if ($institution) {
            return $response->withJson([
                'success' => true,
                'data' => $institution
            ], 200);
        } else {
            return $response->withJson([
                'success' => false,
                'errors' => ['institution' => ['Institution not found: '.$args['id']]]
            ], 400);
        }
    }
    
    // POST /institutions
    // Create institution
    public function create(Request $request, Response $response) {
        $this->logger->addInfo('POST /institutions');
        $data = $request->getParsedBody();
        // The validate method returns the validator instance
        $validator = $this->validator->validate($request, ValidationRules::institutionsPost());
        if ($validator->isValid()) {
            // Input is valid, so let's do something...
            $institution = Institution::firstOrCreate([
                'name' => $data['name'],
                'address' => $data['address'],
                'city' => $data['city'],
                'postal_code' => $data['postal_code'],
                'description' => $data['description']
            ]);

            $institution->users()->attach($data['userId']);

            return $response->withJson([
                'success' => true,
                'data' => $institution
            ], 200);
        } else {
            // Validation error
            return $response->withJson([
                'success' => false,
                'errors' => $validator->getErrors()
            ], 400);
        }
    }
    
    // PUT /institutions/{id}
    // Updates institution
    public function update(Request $request, Response $response, $args) {
        $this->logger->addInfo('PUT /institutions/'.$args['id']);
        $data = $request->getParsedBody();
        $errors = [];
        // validate inputs
        $validator = $this->validator->validate($request, ValidationRules::institutionsPost());
        if (!$validator->isValid()) {
            $errors = $validator->getErrors();
        }
        // check category ID exists
        $institution = Institution::find($args['id']);
        if (!$errors && !$institution) {
            $errors = ['institution' => ['Institution not found: '.$args['id']]];
        }
        // check for duplicate
        if (!$errors && isset($data['name']) && Institution::where('name', $data['name'])->where('id', '!=', $institution->id)->first()) {
            $errors = ['institution' => ['Institution with a given name already exists']];
        }
        // No errors? Update DB
        if (!$errors) {
            if (isset($data['name']) && isset($data['address']) && isset($data['city']) && isset($data['postal_code'])) {
                $institution->name = $data['name'];
                $institution->address = $data['address'];
                $institution->city = $data['city'];
                $institution->postal_code = $data['postal_code'];
                $institution->description = $data['description'];
            }
            $institution->save();
            return $response->withJson(['success' => true], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }
    
    // DELETE /institutions/{id}
    // Delete a institution
    public function delete(Request $request, Response $response, $args) {
        $data = $request->getParsedBody();
        $errors = [];
        // check category ID exists
        $institution = Institution::withTrashed()->find($args['id']);
        if (!$errors && !$institution) {
            $errors = ['institution' => ['Institution not found: '.$args['id']]];
        }
        if (!$errors) {
            $deleted = (isset($data['force']) && !empty($data['force'])) ? $institution->forceDelete() : $institution->delete();
            return $response->withJson(['success' => true], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /institutions/{id}/users
    // Get a users that belongs to institutions
    public function users(Request $request, Response $response, $args) {
        $errors = [];
        $users = Institution::find($args['id'])->users()->get();

        if (!$errors && !$users) {
            $errors = ['institution' => ['Institution not found: '.$args['id']]];
        }

        if (!$errors) {
            return $response->withJson(['success' => true, 'data' => $users], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /institutions/{id}/patients
    // Get patients that belongs to institutions
    public function patients(Request $request, Response $response, $args) {
        $queries = $request->getQueryParams();
        $errors = [];
        $patients = Institution::find($args['id'])->patients();
        $count = Institution::find($args['id'])->patients()->count();

        if (!$errors && !$patients) {
            $errors = ['institution' => ['Institution not found: '.$args['id']]];
        }

        if (!$errors) {
            if(array_key_exists('range', $queries)) {
                $queries['range'] = json_decode($queries['range'], true);
                $response = $response->withHeader('content-range', 'patients '.$queries['range'][0].'-'.$queries['range'][1].'/'.$count);
                $patients = $patients->skip($queries['range'][0])->take($queries['range'][1] - $queries['range'][0]);
            }

            return $response->withJson(['success' => true, 'data' => $patients->get(), 'count' => $count], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /institutions/{id}/patients/search
    // Search patients that belongs to institution
    public function search_patients(Request $request, Response $response, $args) {
        $errors = [];
        $query = $request->getQueryParams()['q'];
        
        $patients = Institution::find($args['id'])->patients()->where(function($q) use ($query) {
            $q->where('firstname', 'LIKE', '%' . $query . '%')->orWhere('lastname', 'LIKE', '%' . $query . '%');
        })->latest()->limit(5)->get();

        if (!$errors && !$patients) {
            $errors = ['institution' => ['Institution not found: '.$args['id']]];
        }

        if (!$errors) {
            return $response->withJson(['success' => true, 'data' => $patients], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /institutions/{id}/matrixes
    // Get a matrixes that belongs to institutions
    public function matrixes(Request $request, Response $response, $args) {
        $queries = $request->getQueryParams();
        $errors = [];
        $matrixes = Institution::find($args['id'])->matrixes();
        $count = Institution::find($args['id'])->matrixes()->count();

        if (!$errors && !$matrixes) {
            $errors = ['institution' => ['Institution not found: '.$args['id']]];
        }

        if (!$errors) {
            if(array_key_exists('range', $queries)) {
                $queries['range'] = json_decode($queries['range'], true);
                $response = $response->withHeader('content-range', 'patients '.$queries['range'][0].'-'.$queries['range'][1].'/'.$count);
                $matrixes = $matrixes->skip($queries['range'][0])->take($queries['range'][1] - $queries['range'][0]);
            }

            return $response->withJson(['success' => true, 'data' => $matrixes->get(), 'count' => $count], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /institutions/{id}/matrixes/search
    // Search matrixes that belongs to institution
    public function search_matrixes(Request $request, Response $response, $args) {
        $errors = [];
        $query = $request->getQueryParams()['q'];

        $matrixes = Institution::find($args['id'])->matrixes()->where(function($q) use ($query) {
            $q->where('name', 'LIKE', '%' . $query . '%')->orWhere('difficulty', 'LIKE', '%' . $query . '%');
        })->latest()->limit(5)->get();

        if (!$errors && !$matrixes) {
            $errors = ['matrix' => ['Matrix not found: '.$args['id']]];
        }

        if (!$errors) {
            return $response->withJson(['success' => true, 'data' => $matrixes], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // POST /institutions/{institutionId}/attachUser/{userId}
    // Attach user to instituion
    public function attach_user(Request $request, Response $response, $args) {
        $institutionId = $args['institutionId'];
        $userId = $args['userId'];

        $institution = Institution::find($institutionId);
        $user = User::find($userId);

        if (!$institution) {
            return $response->withJson(['users' => ['Institution not found: ' . $institutionId]]);
        } elseif (!$user) {
            return $response->withJson(['users' => ['User not found: ' . $userId]]);
        } else {
            $institution->users()->attach($userId);
            return $response->withJson(['success' => true, 'data' => $user]);
        }
    }

    // POST /institutions/{institutionId}/dettachUser/{userId}
    // Dettach user from instituion
    public function detach_user(Request $request, Response $response, $args) {
        $institutionId = $args['institutionId'];
        $userId = $args['userId'];
        $this->logger->addInfo('asdasdasdasda');

        $institution = Institution::find($institutionId);
        $user = User::find($userId);

        if (!$institution) {
            return $response->withJson(['users' => ['Institution not found: ' . $institutionId]]);
        } elseif (!$user) {
            return $response->withJson(['users' => ['User not found: ' . $userId]]);
        } else {
            $institution->users()->detach($userId);
            return $response->withJson(['success' => true, 'data' => $user]);
        }
    }

    // GET /institutions/{id}/results
    // Get institution results
    public function results(Request $request, Response $response, $args) {
        $errors = [];
        $results = Institution::find($args['id']);

        if (!$errors && !$results) {
            $errors = ['institution' => ['Institution not found: '.$args['id']]];
        } else {
            $queries = $request->getQueryParams();

            if(array_key_exists('latest', $queries)) {
                $count = $queries['latest'];
                $results = $results->results()->latest()->take($count)->with('matrix')->with('patient')->get();
            } else {
                $results = $results->results()->with('matrix')->with('patient')->get();
            }
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
}