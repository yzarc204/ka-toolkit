# 📝 Notes App

A modern, full-stack note-taking application built with Laravel and Vue.js, featuring rich text editing, real-time collaboration, and seamless sharing capabilities.

## ✨ Features

### 📖 Note Management

-   **Create, edit, and delete notes** with a clean, intuitive interface
-   **Rich text editor** with formatting tools (bold, italic, links)
-   **Real-time auto-save** - your changes are saved automatically
-   **Search functionality** - quickly find notes by title or content
-   **Public/Private notes** - control who can access your notes

### 🔗 Link Management

-   **Create hyperlinks** within notes with custom text
-   **Smart link handling** - Ctrl+Click to open links in new tabs
-   **Plain text paste** - paste content without unwanted formatting

### 👥 Sharing & Collaboration

-   **Share notes by email** with other users
-   **Public link sharing** - generate shareable links for public notes
-   **User management** - view and manage shared access

### 🎨 User Experience

-   **Dark/Light theme** support
-   **Responsive design** - works on desktop and mobile
-   **Modern UI** with Tailwind CSS
-   **Toast notifications** for user feedback

## 🛠️ Tech Stack

### Backend

-   **Laravel 10** - PHP framework
-   **MySQL** - Database
-   **Sanctum** - API authentication
-   **Eloquent ORM** - Database management

### Frontend

-   **Vue.js 3** - JavaScript framework
-   **Pinia** - State management
-   **Vue Router** - Client-side routing
-   **Tailwind CSS** - Styling
-   **Axios** - HTTP client

## 🚀 Installation

### Prerequisites

-   PHP 8.1 or higher
-   Composer
-   Node.js 16 or higher
-   MySQL 5.7 or higher

### Backend Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/notes-app.git
    cd notes-app
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. **Database configuration**
   Update your `.env` file with database credentials:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=notes_app
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    ```

5. **Run migrations**

    ```bash
    php artisan migrate
    ```

6. **Start the server**
    ```bash
    php artisan serve
    ```

### Frontend Setup

1. **Install Node.js dependencies**

    ```bash
    npm install
    ```

2. **Build assets**

    ```bash
    npm run build
    ```

3. **For development (with hot reload)**
    ```bash
    npm run dev
    ```

## 📁 Project Structure

```
notes-app/
├── app/
│   ├── Http/Controllers/
│   │   ├── Api/AuthController.php
│   │   └── NoteController.php
│   ├── Models/
│   │   ├── User.php
│   │   └── Note.php
│   └── ...
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   └── Notes/
│   │   │       ├── Editor.vue
│   │   │       ├── ShareModal.vue
│   │   │       └── Sidebar.vue
│   │   ├── Pages/
│   │   │   └── Tools/
│   │   │       └── Notes.vue
│   │   ├── services/
│   │   │   └── api.js
│   │   └── stores/
│   │       └── notes.js
│   └── views/
├── routes/
│   └── api.php
└── database/
    └── migrations/
```

## 🔧 API Endpoints

### Authentication

-   `POST /api/register` - User registration
-   `POST /api/login` - User login
-   `POST /api/logout` - User logout
-   `GET /api/user` - Get current user

### Notes

-   `GET /api/notes` - Get all user notes
-   `POST /api/notes` - Create new note
-   `GET /api/notes/{id}` - Get specific note
-   `PUT /api/notes/{id}` - Update note
-   `DELETE /api/notes/{id}` - Delete note
-   `POST /api/notes/{id}/share` - Share note with user
-   `POST /api/notes/{id}/unshare` - Remove user access

### Users

-   `GET /api/users/by-email/{email}` - Get user by email

## 🎯 Usage

### Creating Notes

1. Click "New Note" in the sidebar
2. Enter a title and start writing
3. Use formatting tools for rich text
4. Notes are auto-saved as you type

### Sharing Notes

1. Click the "Share" button in the editor
2. Enter an email address to share with
3. Toggle public/private status
4. Manage shared users from the modal

### Formatting Text

-   **Bold**: Select text and click Bold button or use Ctrl+B
-   **Italic**: Select text and click Italic button or use Ctrl+I
-   **Links**: Select text and click Link button or use Ctrl+K
-   **Lists**: Use the list buttons in the toolbar

## 🔒 Security Features

-   **Authentication** - Secure user login/logout
-   **Authorization** - Users can only access their own notes
-   **CSRF Protection** - Laravel's built-in CSRF protection
-   **Input Validation** - Server-side validation for all inputs
-   **SQL Injection Prevention** - Eloquent ORM protection

## 🧪 Testing

```bash
# Run PHP tests
php artisan test

# Run frontend tests
npm run test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

-   GitHub: [@yourusername](https://github.com/yourusername)
-   Email: your.email@example.com

## 🙏 Acknowledgments

-   Laravel team for the amazing framework
-   Vue.js team for the reactive framework
-   Tailwind CSS for the utility-first CSS framework
-   All contributors and users who provide feedback

---

⭐ **Star this repository if you found it helpful!**
