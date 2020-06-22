<?php


use Phinx\Migration\AbstractMigration;

class UserWithRoleUpdateMigration extends AbstractMigration
{
    public function up()
    {
        $this->table('users')->drop()->save();
    }

    public function change()
    {
        // users
        $table = $this->table('users')
                ->addColumn('firstname', 'text')
                ->addColumn('lastname', 'text')
                ->addColumn('email', 'text')
                ->addColumn('password', 'text')
                ->addColumn('role_id', 'integer', ['default' => 2])
                ->addForeignKey('role_id', 'roles', 'id', ['delete'=> 'CASCADE', 'update'=> 'CASCADE'])
                ->addColumn('created_at', 'timestamp')
                ->addColumn('updated_at', 'timestamp', ['null' => true])
                ->addColumn('deleted_at', 'timestamp', ['null' => true])
                ->create();
        
        $this->table('users')->insert([
            'id' => 1,
            'firstname' => 'Jan',
            'lastname' => 'Kowalski',
            'email' => 'jan.kowalski@gmail.com',
            'password' => password_hash('1234', \App\Config\Config::auth()['hash']),
        ])->save();
    }
}
