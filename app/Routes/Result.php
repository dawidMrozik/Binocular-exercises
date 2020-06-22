<?php
namespace App\Routes;

use \App\Config\Config;

class Result {
    function __construct($app) {
        $prefix = Config::prefix();

        $app->get($prefix . '/results', '\App\Controllers\ResultController:all');
        $app->get($prefix . '/results/{id}', '\App\Controllers\ResultController:find');
        $app->post($prefix . '/results', '\App\Controllers\ResultController:create');
        $app->put($prefix . '/results/{id}', '\App\Controllers\ResultController:update');
        $app->delete($prefix . '/results/{id}', '\App\Controllers\ResultController:delete');
        $app->get($prefix . '/results/{id}/patient', '\App\Controllers\ResultController:patient');
        $app->get($prefix . '/results/{id}/user', '\App\Controllers\ResultController:user');
        $app->get($prefix . '/results/{id}/matrix', '\App\Controllers\ResultController:matrix');
    }
}