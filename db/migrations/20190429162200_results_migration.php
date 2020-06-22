<?php


use Phinx\Migration\AbstractMigration;

class ResultsMigration extends AbstractMigration
{
    public function change()
    {
        $results = $this->table('results')
            ->addColumn('patient_id', 'integer')
            ->addColumn('user_id', 'integer')
            ->addColumn('matrix_id', 'integer')
            ->addColumn('institution_id', 'integer')
            ->addColumn('duration', 'text')
            ->addColumn('points_missed', 'integer')
            ->addColumn('red_points', 'integer')
            ->addColumn('green_points', 'integer')
            ->addColumn('completed', 'boolean', ['default' => false])
            ->addForeignKey('user_id', 'users', 'id', ['delete'=> 'CASCADE', 'update'=> 'CASCADE'])
            ->addForeignKey('matrix_id', 'matrixes', 'id', ['delete'=> 'CASCADE', 'update'=> 'CASCADE'])
            ->addForeignKey('patient_id', 'patients', 'id', ['delete'=> 'CASCADE', 'update'=> 'CASCADE'])
            ->addForeignKey('institution_id', 'institutions', 'id', ['delete'=> 'CASCADE', 'update'=> 'CASCADE'])
            ->addColumn('created_at', 'timestamp')
            ->addColumn('updated_at', 'timestamp', ['null' => true])
            ->addColumn('deleted_at', 'timestamp', ['null' => true])
            ->create();
    }
}
