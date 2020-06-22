<?php


use Phinx\Migration\AbstractMigration;

class UserInstitutionManyToManyMigration extends AbstractMigration
{
    public function change()
    {
        // institution_user pivot
        $pivot = $this->table('institution_user')
                ->addColumn('institution_id', 'integer')
                ->addColumn('user_id', 'integer')
                ->addForeignKey('user_id', 'users', 'id', ['delete'=> 'CASCADE', 'update'=> 'CASCADE'])
                ->addForeignKey('institution_id', 'institutions', 'id', ['delete'=> 'CASCADE', 'update'=> 'CASCADE'])
                ->addColumn('created_at', 'timestamp')
                ->addColumn('updated_at', 'timestamp', ['null' => true])
                ->addColumn('deleted_at', 'timestamp', ['null' => true])
                ->create();
        
        $this->table('institution_user')->insert([
            'institution_id' => 1,
            'user_id' => 1
        ])->save();
    }
}
