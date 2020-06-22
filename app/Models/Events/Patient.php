<?php
namespace App\Models\Events;

class Patient {
    // DELETE event listener callback
    public function delete($patient) {
        foreach ($patient->results as $results) {
            $results->delete();
        }
    }
}