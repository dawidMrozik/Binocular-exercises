<?php


use Phinx\Migration\AbstractMigration;

class MatrixesMigration extends AbstractMigration
{
    public function change()
    {
        $matrixes = $this->table('matrixes')
            ->addColumn('name', 'text')
            ->addColumn('difficulty', 'text')
            ->addColumn('matrixString', 'text')
            ->addColumn('user_id', 'integer')
            ->addColumn('institution_id', 'integer')
            ->addColumn('red_points', 'integer')
            ->addColumn('green_points', 'integer')
            ->addForeignKey('user_id', 'users', 'id', ['delete'=> 'CASCADE', 'update'=> 'CASCADE'])
            ->addForeignKey('institution_id', 'institutions', 'id', ['delete'=> 'CASCADE', 'update'=> 'CASCADE'])
            ->addColumn('created_at', 'timestamp')
            ->addColumn('updated_at', 'timestamp', ['null' => true])
            ->addColumn('deleted_at', 'timestamp', ['null' => true])
            ->create();
    }
}
