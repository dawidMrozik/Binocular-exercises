<?php
namespace App\Includes;

use Respect\Validation\Validator as V;

class ValidationRules {
    // POST /users
    function usersPost() {
        return [
            'firstname' => [
                'rules' => V::length(2, 25)->alnum('ąężźćśłóĄĘŻŹĆŚŁÓ')->noWhitespace(),
                'message' => 'Incorrect firstname'
            ],
            'lastname' => [
                'rules' => V::length(2, 25)->alnum('-ąężźćśłóĄĘŻŹĆŚŁÓ')->noWhitespace(),
                'message' => 'Incorrect lastname'
            ],
            'email' => [
                'rules' => V::email(),
                'message' => 'Incorrect email address'
            ],
            'password' => [
                'rules' => V::length(5, 25)->noWhitespace(),
                'message' => 'Incorrect password (5 - 25 characters)'
            ]
        ];
    }
    
    // POST /auth
    function authPost() {
        return [
            'email' => [
                'rules' => V::email(),
                'message' => 'Incorrect email address'
            ],
            'password' => [
                'rules' => V::length(5, 25)->noWhitespace(),
                'message' => 'Incorrect password'
            ]
        ];
    }

    // POST /patients
    function patientsPost() {
        return [
            'firstname' => [
                'rules' => V::length(3, 25)->alnum(),
                'message' => 'Incorrect firstname'
            ],
            'lastname' => [
                'rules' => V::length(2, 25)->alnum('-ąężźćśłóĄĘŻŹĆŚŁÓ'),
                'message' => 'Incorrect lastname'
            ]
        ];
    }

    // POST /matrixes
    function matrixesPost() {
        return [
            'name' => [
                'rules' => V::length(3, 50),
                'message' => 'Incorrect matrix name'
            ],
            'difficulty' => [
                'rules' => V::length(3, 25),
                'message' => 'Incorrect matrix difficulty'
            ],
            'matrixString' => [
                'rules' => V::length(3, 4750)->startsWith('@')->endsWith('@'),
                'message' => 'Incorrect matrix string'
            ],
        ];
    }

    // POST /results
    function resultsPost() {
        return [
            'duration' => [
                'rules' => V::length(3, 15),
                'message' => 'Incorrect exercise duration'
            ],
            'red_points' => [
                'rules' => V::numeric(),
                'message' => 'Incorrect red points count'
            ],
            'green_points' => [
                'rules' => V::numeric(),
                'message' => 'Incorrect green points count'
            ],
            'points_missed' => [
                'rules' => V::numeric(),
                'message' => 'Incorrect points missed count'
            ],
        ];
    }

    // POST /institutions
    function institutionsPost() {
        return [
            'name' => [
                'rules' => V::length(2, 50)->alnum('-ąężźćśłóĄĘŻŹĆŚŁÓ'),
                'message' => 'Incorrect institution name'
            ],
            'address' => [
                'rules' => V::length(5, 50),
                'message' => 'Incorrect institution address'
            ],
            'city' => [
                'rules' => V::length(2, 50)->alnum('-ąężźćśłóĄĘŻŹĆŚŁÓ'),
                'message' => 'Incorrect city'
            ],
            'postal_code' => [
                'rules' => V::postalCode('PL'),
                'message' => 'Incorrect postal code'
            ],
        ];
    }

    // PUT /institutions
    function institutionsPut() {
        return [
            'name' => [
                'rules' => V::length(2, 50)->alnum('-ąężźćśłóĄĘŻŹĆŚŁÓ'),
                'message' => 'Incorrect institution name'
            ],
            'address' => [
                'rules' => V::length(5, 50),
                'message' => 'Incorrect institution address'
            ],
            'city' => [
                'rules' => V::length(2, 50)->alnum('-ąężźćśłóĄĘŻŹĆŚŁÓ'),
                'message' => 'Incorrect city'
            ],
            'postal_code' => [
                'rules' => V::postalCode('PL'),
                'message' => 'Incorrect postal code'
            ],
        ];
    }
}
?>