<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use LangleyFoxall\EloquentReportGenerator\Traits\Reportable;

class Patient extends Model {
    use Reportable;
    use SoftDeletes; // toggle soft deletes
    protected $table = 'patients';
    protected $fillable = ['firstname', 'lastname', 'institution_id', 'dysfunction', 'description']; // for mass creation
    protected $hidden = ['deleted_at']; // hidden columns from select results
    protected $dates = ['deleted_at']; // the attributes that should be mutated to dates
    public static function boot() {
        parent::boot();
        // setup model event listeners
        static::setEventDispatcher(new \Illuminate\Events\Dispatcher());
        static::deleting(['\App\Models\Events\Patient', 'delete']);
    }
    
    public function institution() {
        return $this->belongsTo('\App\Models\Institution');
    }

    public function results() {
        return $this->hasMany('\App\Models\Result', 'patient_id');
    }
}