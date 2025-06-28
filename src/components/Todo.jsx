import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all'); // all | completed | pending

  // Load from localStorage
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) setTodos(savedTodos);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (task.trim() === '') return;
    setTodos([...todos, { text: task, completed: false }]);
    setTask('');
  };

  const handleDelete = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setIsEditing(index);
    setEditText(todos[index].text);
  };

  const handleSave = () => {
    if (editText.trim() === '') return;
    const updated = todos.map((t, i) =>
      i === isEditing ? { ...t, text: editText } : t
    );
    setTodos(updated);
    setIsEditing(null);
    setEditText('');
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditText('');
  };

  const toggleComplete = (index) => {
    setTodos(
      todos.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      setTodos([]);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo App (All Features)</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border px-2 py-1 w-full"
          placeholder="Enter a task"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-1 rounded">
          Add
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-2 py-1 rounded ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
            All
          </button>
          <button onClick={() => setFilter('completed')} className={`px-2 py-1 rounded ${filter === 'completed' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
            Completed
          </button>
          <button onClick={() => setFilter('pending')} className={`px-2 py-1 rounded ${filter === 'pending' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
            Pending
          </button>
        </div>
        <button onClick={handleClearAll} className="bg-red-500 text-white px-2 py-1 rounded">
          Clear All
        </button>
      </div>

      <ul>
        {filteredTodos.map((item, index) => (
          <li key={index} className="flex items-center justify-between mb-2">
            {isEditing === index ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border px-2 py-1 w-full mr-2"
                />
                <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded mr-1">
                  Save
                </button>
                <button onClick={handleCancel} className="bg-gray-400 text-white px-2 py-1 rounded">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleComplete(index)}
                  />
                  <span className={item.completed ? 'line-through text-gray-500' : ''}>
                    {item.text}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(index)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(index)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
