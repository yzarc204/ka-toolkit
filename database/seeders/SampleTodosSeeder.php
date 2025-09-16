<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Todo;

class SampleTodosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get test user
        $user = User::where('email', 'test@gmail.com')->first();

        if (!$user) {
            $this->command->error('Test user not found. Please run TestUserSeeder first.');
            return;
        }

        // Create sample todos
        $todos = [
            [
                'title' => 'Design new homepage',
                'description' => 'Create wireframes and mockups for the new homepage design',
                'status' => 'todo',
                'priority' => 'high',
                'due_date' => now()->addDays(3),
                'order' => 1,
            ],
            [
                'title' => 'Implement user authentication',
                'description' => 'Add login and registration functionality',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(1),
                'order' => 2,
            ],
            [
                'title' => 'Write API documentation',
                'description' => 'Document all API endpoints and their usage',
                'status' => 'todo',
                'priority' => 'medium',
                'due_date' => now()->addDays(5),
                'order' => 3,
            ],
            [
                'title' => 'Fix responsive design issues',
                'description' => 'Resolve mobile layout problems',
                'status' => 'completed',
                'priority' => 'medium',
                'due_date' => now()->subDays(1),
                'order' => 4,
            ],
            [
                'title' => 'Database optimization',
                'description' => 'Optimize database queries and add indexes',
                'status' => 'deadline',
                'priority' => 'high',
                'due_date' => now()->addDays(2),
                'order' => 5,
            ],
            [
                'title' => 'Code review',
                'description' => 'Review pull requests and provide feedback',
                'status' => 'in_progress',
                'priority' => 'low',
                'due_date' => now()->addDays(1),
                'order' => 6,
            ],
            [
                'title' => 'Update dependencies',
                'description' => 'Update all npm and composer dependencies',
                'status' => 'todo',
                'priority' => 'low',
                'due_date' => now()->addDays(7),
                'order' => 7,
            ],
            [
                'title' => 'Performance testing',
                'description' => 'Run load tests and optimize performance',
                'status' => 'completed',
                'priority' => 'medium',
                'due_date' => now()->subDays(2),
                'order' => 8,
            ],
        ];

        foreach ($todos as $todoData) {
            Todo::create(array_merge($todoData, [
                'user_id' => $user->id,
            ]));
        }

        $this->command->info('Sample todos created for test user');
    }
}