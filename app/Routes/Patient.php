<?php
namespace App\Routes;

use \App\Config\Config;

class Patient {
    function __construct($app) {
        $prefix = Config::prefix();

        $app->get($prefix . '/patients', '\App\Controllers\PatientController:all');
        $app->get($prefix . '/patients/{id}', '\App\Controllers\PatientController:find');
        $app->post($prefix . '/patients', '\App\Controllers\PatientController:create');
        $app->put($prefix . '/patients/{id}', '\App\Controllers\PatientController:update');
        $app->delete($prefix . '/patients/{id}', '\App\Controllers\PatientController:delete');
        $app->get($prefix . '/patients/{id}/institution', '\App\Controllers\PatientController:institution');
        $app->get($prefix . '/patients/{id}/results', '\App\Controllers\PatientController:results');
        $app->get($prefix . '/patients/{id}/results/report', '\App\Controllers\PatientController:resultsReport');
    }
}