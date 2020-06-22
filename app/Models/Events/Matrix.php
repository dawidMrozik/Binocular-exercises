<?php
namespace App\Models\Events;

class Matrix {
    // DELETE event listener callback
    public function delete($matrix) {
        foreach ($matrix->results as $results) {
            $results->delete();
        }
    }
}