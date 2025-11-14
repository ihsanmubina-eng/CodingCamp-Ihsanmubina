
        // Elemen DOM
        const taskInput = document.getElementById('taskInput');
        const addButton = document.getElementById('addButton');
        const taskList = document.getElementById('taskList');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const totalTasksSpan = document.getElementById('totalTasks');
        const completedTasksSpan = document.getElementById('completedTasks');
        
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let currentFilter = 'all';
        
        // Fungsi untuk menambah tugas
        function addTask() {
            const taskText = taskInput.value.trim();
            
            if (taskText === '') {
                alert('Silakan masukkan tugas!');
                return;
            }
            
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskInput.value = '';
            taskInput.focus();
        }
        
        // Fungsi untuk menghapus tugas
        function deleteTask(id) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }
        
        // Fungsi untuk menandai tugas selesai
        function toggleTask(id) {
            tasks = tasks.map(task => {
                if (task.id === id) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            });
            
            saveTasks();
            renderTasks();
        }
        
        // Fungsi untuk menyimpan tugas ke localStorage
        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        
        // Fungsi untuk merender tugas
        function renderTasks() {
            // Filter tugas berdasarkan status
            let filteredTasks = tasks;
            if (currentFilter === 'active') {
                filteredTasks = tasks.filter(task => !task.completed);
            } else if (currentFilter === 'completed') {
                filteredTasks = tasks.filter(task => task.completed);
            }
            
            // Kosongkan daftar
            taskList.innerHTML = '';
            
            // Tambahkan tugas ke daftar
            filteredTasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                
                taskItem.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button class="delete-btn">×</button>
                    </div>
                `;
                
                // Event listener untuk checkbox
                const checkbox = taskItem.querySelector('.task-checkbox');
                checkbox.addEventListener('change', () => toggleTask(task.id));
                
                // Event listener untuk tombol hapus
                const deleteBtn = taskItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => deleteTask(task.id));
                
                taskList.appendChild(taskItem);
            });
            
            // Update statistik
            updateStats();
        }
        
        // Fungsi untuk memperbarui statistik
        function updateStats() {
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.completed).length;
            
            totalTasksSpan.textContent = totalTasks;
            completedTasksSpan.textContent = completedTasks;
        }
        
        // Event listener untuk tombol tambah
        addButton.addEventListener('click', addTask);
        
        // Event listener untuk menekan Enter di input
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });
        
        // Event listener untuk filter
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Hapus kelas active dari semua tombol
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Tambah kelas active ke tombol yang diklik
                button.classList.add('active');
                
                // Update filter
                currentFilter = button.getAttribute('data-filter');
                
                // Render ulang tugas
                renderTasks();
            });
        });
        
        // Render tugas saat pertama kali dimuat
        renderTasks();
    