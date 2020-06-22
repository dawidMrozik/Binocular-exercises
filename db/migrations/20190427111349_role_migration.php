<?php


use Phinx\Migration\AbstractMigration;

class RoleMigration extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('roles')
            ->addColumn('name', 'text')
            ->addColumn('created_at', 'timestamp')
            ->addColumn('updated_at', 'timestamp', ['null' => true])
            ->addColumn('deleted_at', 'timestamp', ['null' => true])
            ->create();
        
        $this->table('roles')->insert([
            ['id' => 1, 'name' => 'admin'],
            ['id' => 2, 'name' => 'user']
        ])->save();
    }
}
