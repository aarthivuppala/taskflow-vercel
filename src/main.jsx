import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const starterTasks = [
  { id: 1, title: 'Complete React frontend', category: 'Development', priority: 'High', done: true },
  { id: 2, title: 'Push project to GitHub', category: 'Work', priority: 'High', done: false },
  { id: 3, title: 'Create Vercel deployment', category: 'Deployment', priority: 'Medium', done: false },
  { id: 4, title: 'Test preview environment', category: 'Testing', priority: 'Low', done: false }
]

function App() {
  const [tasks, setTasks] = useState(starterTasks)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Development')
  const [priority, setPriority] = useState('Medium')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const environment = import.meta.env.VITE_ENVIRONMENT || 'Development'

  const addTask = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: title.trim(),
        category,
        priority,
        done: false
      }
    ])
    setTitle('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Active' && !task.done) ||
        (filter === 'Completed' && task.done)

      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())

      return matchesFilter && matchesSearch
    })
  }, [tasks, filter, search])

  const completed = tasks.filter(t => t.done).length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">✓</div>
          <div>
            <strong>TaskFlow</strong>
            <span>Workspace</span>
          </div>
        </div>

        <nav>
          <button className="nav-item active"><span>▦</span> Dashboard</button>
          <button className="nav-item"><span>✓</span> My Tasks</button>
          <button className="nav-item"><span>◷</span> Upcoming</button>
        </nav>

        <div className="side-bottom">
          <div className="environment-card">
            <span className="live-dot"></span>
            <div>
              <small>Current environment</small>
              <strong>{environment}</strong>
            </div>
          </div>
          <p>React frontend · Vercel ready</p>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <p className="greeting">Good evening from Preview 👋</p>
            <h1>My Dashboard</h1>
            <p className="muted">Stay organized and keep your work moving.</p>
          </div>
          <div className="avatar">A</div>
        </header>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon purple">▦</div>
            <div><span>Total tasks</span><strong>{tasks.length}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">◷</div>
            <div><span>In progress</span><strong>{tasks.length - completed}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div><span>Completed</span><strong>{completed}</strong></div>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel tasks-panel">
            <div className="panel-head">
              <div>
                <h2>Tasks</h2>
                <p>{completed} of {tasks.length} completed</p>
              </div>
              <div className="progress">
                <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
                <span>{progress}%</span>
              </div>
            </div>

            <div className="toolbar">
              <div className="search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                />
              </div>
              <div className="filters">
                {['All', 'Active', 'Completed'].map(item => (
                  <button
                    key={item}
                    className={filter === item ? 'filter active-filter' : 'filter'}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="task-list">
              {filteredTasks.length === 0 && (
                <div className="empty">No tasks found.</div>
              )}

              {filteredTasks.map(task => (
                <div className={`task-row ${task.done ? 'completed-row' : ''}`} key={task.id}>
                  <button className={`check ${task.done ? 'checked' : ''}`} onClick={() => toggleTask(task.id)}>
                    {task.done ? '✓' : ''}
                  </button>
                  <div className="task-info">
                    <strong>{task.title}</strong>
                    <div>
                      <span className="tag">{task.category}</span>
                      <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                    </div>
                  </div>
                  <button className="trash" onClick={() => deleteTask(task.id)}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="right-column">
            <div className="panel add-panel">
              <div className="panel-title">
                <div className="plus">＋</div>
                <div>
                  <h2>Add a task</h2>
                  <p>Create something new.</p>
                </div>
              </div>

              <form onSubmit={addTask}>
                <label>Task name</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Review deployment"
                />

                <div className="two-fields">
                  <div>
                    <label>Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                      <option>Development</option>
                      <option>Deployment</option>
                      <option>Testing</option>
                      <option>Work</option>
                    </select>
                  </div>
                  <div>
                    <label>Priority</label>
                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <button className="add-button">Add task <span>→</span></button>
              </form>
            </div>

            <div className="panel progress-panel">
              <div className="mini-head">
                <h2>Weekly progress</h2>
                <span>Current</span>
              </div>
              <div className="big-progress">{progress}%</div>
              <p>Great work! Keep going to finish your tasks.</p>
              <div className="mini-track"><div style={{ width: `${progress}%` }} /></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)