<?php


use Phinx\Migration\AbstractMigration;

class InstitutionMigration extends AbstractMigration
{
    public function change()
    {
        // institutions
        $table = $this->table('institutions')
            ->addColumn('name', 'text')
            ->addColumn('address', 'text')
            ->addColumn('city', 'text')
            ->addColumn('postal_code', 'text')
            ->addColumn('description', 'text', ['null' => true])
            ->addColumn('created_at', 'timestamp')
            ->addColumn('updated_at', 'timestamp', ['null' => true])
            ->addColumn('deleted_at', 'timestamp', ['null' => true])
            ->create();

        $this->table('institutions')->insert([
            'id' => 1,
            'name' => 'SOSW',
            'address' => 'ul. Hajducka 22',
            'city' => 'Chorzów',
            'postal_code' => '41-500',
            'description' => 'SPECJALNY OŚRODEK SZKOLNO-WYCHOWAWCZY DLA MŁODZIEŻY NIEWIDOMEJ I SŁABOWIDZĄCEJ'
        ])->save();
    }
}
