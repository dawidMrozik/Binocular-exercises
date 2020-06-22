<?php
namespace App\Routes;

use \App\Config\Config;

class Institution {
    function __construct($app) {
        $prefix = Config::prefix();

        $app->get($prefix . '/institutions', '\App\Controllers\InstitutionController:all');
        $app->get($prefix . '/institutions/{id}', '\App\Controllers\InstitutionController:find');
        $app->post($prefix . '/institutions', '\App\Controllers\InstitutionController:create');
        $app->put($prefix . '/institutions/{id}', '\App\Controllers\InstitutionController:update');
        $app->delete($prefix . '/institutions/{id}', '\App\Controllers\InstitutionController:delete');
        $app->get($prefix . '/institutions/{id}/users', '\App\Controllers\InstitutionController:users');
        $app->get($prefix . '/institutions/{id}/patients', '\App\Controllers\InstitutionController:patients');
        $app->get($prefix . '/institutions/{id}/patients/search', '\App\Controllers\InstitutionController:search_patients');
        $app->get($prefix . '/institutions/{id}/matrixes', '\App\Controllers\InstitutionController:matrixes');
        $app->get($prefix . '/institutions/{id}/matrixes/search', '\App\Controllers\InstitutionController:search_matrixes');
        $app->post($prefix . '/institutions/{institutionId}/attachUser/{userId}', '\App\Controllers\InstitutionController:attach_user');
        $app->post($prefix . '/institutions/{institutionId}/detachUser/{userId}', '\App\Controllers\InstitutionController:detach_user');
        $app->get($prefix . '/institutions/{id}/results', '\App\Controllers\InstitutionController:results');
    }
}