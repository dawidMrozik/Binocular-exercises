<?php


use Phinx\Migration\AbstractMigration;

class PatientMigration extends AbstractMigration
{
    public function change()
    {
        // patients
        $table = $this->table('patients')
            ->addColumn('firstname', 'text')
            ->addColumn('lastname', 'text')
            ->addColumn('dysfunction', 'text', ['null' => true])
            ->addColumn('description', 'text', ['null' => true])
            ->addColumn('institution_id', 'integer')
            ->addForeignKey('institution_id', 'institutions', 'id', ['delete'=> 'CASCADE', 'update'=> 'CASCADE'])
            ->addColumn('created_at', 'timestamp')
            ->addColumn('updated_at', 'timestamp', ['null' => true])
            ->addColumn('deleted_at', 'timestamp', ['null' => true])
            ->create();
    }
}
