<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Todo;
use App\Models\User;

class TodoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user or create one
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        // Create sample todos
        $todos = [
            [
                'title' => 'Hoàn thành báo cáo tuần',
                'description' => 'Viết báo cáo tổng kết công việc tuần này',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(2),
                'order' => 1,
            ],
            [
                'title' => 'Học Vue.js',
                'description' => 'Tìm hiểu về Vue 3 Composition API',
                'status' => 'todo',
                'priority' => 'medium',
                'due_date' => now()->addDays(7),
                'order' => 2,
            ],
            [
                'title' => 'Mua sắm cuối tuần',
                'description' => 'Mua đồ ăn và các vật dụng cần thiết',
                'status' => 'todo',
                'priority' => 'low',
                'due_date' => now()->addDays(3),
                'order' => 3,
            ],
            [
                'title' => 'Tập thể dục',
                'description' => 'Chạy bộ 30 phút mỗi ngày',
                'status' => 'completed',
                'priority' => 'medium',
                'due_date' => now()->subDays(1),
                'order' => 4,
            ],
            [
                'title' => 'Đọc sách',
                'description' => 'Đọc ít nhất 20 trang sách mỗi ngày',
                'status' => 'todo',
                'priority' => 'low',
                'due_date' => null,
                'order' => 5,
            ],
        ];

        foreach ($todos as $todoData) {
            $todoData['user_id'] = $user->id;
            Todo::create($todoData);
        }
    }
}
