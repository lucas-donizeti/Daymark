import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'daymark-tasks'

const navigation = [
  { id: 'all', label: 'Todas as tarefas', icon: 'inbox' },
  { id: 'today', label: 'Hoje', icon: 'calendar' },
  { id: 'upcoming', label: 'Próximas', icon: 'upcoming' },
  { id: 'completed', label: 'Concluídas', icon: 'check' },
  { id: 'overdue', label: 'Atrasadas', icon: null }
]

function loadTasks() {
  try {
    const savedTasks = window.localStorage.getItem(STORAGE_KEY)
    if (!savedTasks) return []

    const parsedTasks = JSON.parse(savedTasks)
    if (!Array.isArray(parsedTasks)) {
      throw new Error('Saved tasks must be an array.')
    }

    return parsedTasks
  } catch (error) {
    console.error('Could not load saved tasks:', error)
    return []
  }
}

function Icon({ name, size = 18 }) {
  const sharedProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  switch (name) {
    case 'plus':
      return <svg {...sharedProps}><path d="M12 5v14M5 12h14" /></svg>
    case 'inbox':
      return <svg {...sharedProps}><path d="M4 4h16v16H4z" /><path d="M4 13h4l2 3h4l2-3h4" /></svg>
    case 'calendar':
      return <svg {...sharedProps}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M8 3v4M16 3v4M3.5 9.5h17" /></svg>
    case 'upcoming':
      return <svg {...sharedProps}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
    case 'check':
      return <svg {...sharedProps}><path d="m5 12 4 4L19 6" /></svg>
    case 'trash':
      return <svg {...sharedProps}><path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 13h11l1-13M9 7V4h6v3" /></svg>
    case 'close':
      return <svg {...sharedProps}><path d="m6 6 12 12M18 6 6 18" /></svg>
    case 'search':
      return <svg {...sharedProps}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
    case 'arrow':
      return <svg {...sharedProps}><path d="M7 17 17 7M8 7h9v9" /></svg>
    default:
      return null
  }
}

function formatDueDate(date) {
  if (!date) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(`${date}T00:00:00`)
  const difference = Math.round((due - today) / 86400000)

  if (difference < 0) return due.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }) + " - Atrasada"
  if (difference === 0) return 'Hoje'
  if (difference === 1) return 'Amanhã'

  return due.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Sidebar({ activeFilter, onFilterChange, tasks, onCreate, today }) {
  const activeCount = tasks.filter((task) => !task.completed).length

  function countFor(filter) {
    if (filter === 'all') return activeCount
    if (filter === 'today') {
      return tasks.filter((task) => !task.completed && task.dueDate === today).length
    }
    if (filter === 'upcoming') {
      return tasks.filter((task) => !task.completed && task.dueDate && task.dueDate > today).length
    }
    if (filter === 'overdue') {
      return tasks.filter((task) => !task.completed && task.dueDate < today).length
    }
    return tasks.filter((task) => task.completed).length
  }

  return (
    <aside className="sidebar">
      <a className="brand" href="#" aria-label="Daymark home">
        <span className="brand-mark"><span /></span>
        <span>daymark<span className="brand-period">.</span></span>
      </a>

      <button className="sidebar-create" onClick={onCreate}>
        <Icon name="plus" size={17} />
        <span>Nova tarefa</span>
        <span className="shortcut">N</span>
      </button>

      <div className="sidebar-label">Área de trabalho</div>
      <nav className="navigation" aria-label="Task views">
        {navigation.map((item) => (
          <button
            className={`nav-item ${activeFilter === item.id ? 'is-active' : ''}`}
            key={item.id}
            onClick={() => onFilterChange(item.id)}
            aria-current={activeFilter === item.id ? 'page' : undefined}
          >
            <Icon name={item.icon} size={17} />
            <span>{item.label}</span>
            <span className="nav-count">{countFor(item.id)}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

function Task({ task, onToggle, onDelete }) {
  const dueLabel = formatDueDate(task.dueDate)

  return (
    <article className={`task-row ${task.completed ? 'is-completed' : ''}`}>
      <button
        className="task-check"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? `Reativar ${task.title}` : `Concluir ${task.title}`}
        aria-pressed={task.completed}
      >
        {task.completed && <Icon name="check" size={14} />}
      </button>
      <div className="task-copy">
        <h3>{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
        {dueLabel && (
          <span className={`task-due ${dueLabel === 'Hoje' && !task.completed ? 'due-today' : ''}`}>
            <Icon name="calendar" size={13} />
            {dueLabel}
          </span>
        )}
      </div>
      <span className={`priority-tag priority-${task.priority}`}>
        <span />
        {{ low: 'Baixa', normal: 'Normal', high: 'Alta' }[task.priority] ?? 'Normal'}
      </span>
      <button
        className="task-delete"
        onClick={() => onDelete(task.id)}
        aria-label={`Excluir ${task.title}`}
      >
        <Icon name="trash" size={16} />
      </button>
    </article>
  )
}

function ModalAddTask({ onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('normal')

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    // otimização
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleSubmit(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return

    onAdd({
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      title: cleanTitle,
      description: description.trim(),
      dueDate,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div>
            <h2 id="modal-title">Nova tarefa</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="task-title">Nome da tarefa</label>
          <input
            autoFocus
            id="task-title"
            className="form-input"
            placeholder="O que você precisa fazer?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={120}
          />

          <label className="field-label" htmlFor="task-description">Observação <span>Opcional</span></label>
          <textarea
            id="task-description"
            className="form-input form-textarea"
            placeholder="Adicione alguns detalhes..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            maxLength={300}
          />

          <div className="form-row">
            <div className="form-group">
              <label className="field-label" htmlFor="task-date">Data limite</label>
              <input
                id="task-date"
                className="form-input"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="field-label" htmlFor="task-priority">Prioridade</label>
              <select
                id="task-priority"
                className="form-input"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                <option value="low">Baixa</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button className="button-secondary" type="button" onClick={onClose}>Cancelar</button>
            <button className="button-primary" type="submit">
              <Icon name="plus" size={16} />
              Criar tarefa
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [activeFilter, setActiveFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const searchInputRef = useRef(null)
  const [today] = useState(getLocalDateString)
  const [todayLabel] = useState(() => new Date().toLocaleDateString('pt-BR', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }))

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error('Could not save tasks:', error)
    }
  }, [tasks])

  useEffect(() => {
    function handleShortcut(event) {
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping) {
        event.preventDefault()
        searchInputRef.current?.focus()
        return
      }
      if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey &&
        !event.altKey && !isTyping) {
        event.preventDefault()
        setIsModalOpen(true)
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  const activeTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)
  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return tasks.filter((task) => {
      if (activeFilter === 'today' && (task.completed || task.dueDate !== today)) return false
      if (activeFilter === 'upcoming' &&
        (task.completed || !task.dueDate || task.dueDate <= today)) return false
      if (activeFilter === 'completed' && !task.completed) return false
      if (normalizedQuery &&
        !`${task.title} ${task.description}`.toLowerCase().includes(normalizedQuery)) return false
      if (activeFilter === 'overdue' && task.dueDate >= today) return false
      return true
    })
  }, [tasks, activeFilter, query, today])

  const titles = {
    all: 'Todas as tarefas',
    today: 'Hoje',
    upcoming: 'Próximas',
    completed: 'Concluídas',
    overdue: "Atrasadas"
  }

  function addTask(task) {
    setTasks((currentTasks) => [...currentTasks, task])
    setIsModalOpen(false)
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )))
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        tasks={tasks}
        onCreate={() => setIsModalOpen(true)}
        today={today}
      />

      <main className="main-content">
        <header className="topbar">
          <a className="mobile-brand" href="#" aria-label="Daymark home">
            <span className="brand-mark"><span /></span>
          </a>

          <div className="topbar-right">
            <span className="today-date">{todayLabel}</span>
            <button className="topbar-create" onClick={() => setIsModalOpen(true)}>
              <Icon name="plus" size={16} />
              <span>Nova tarefa</span>
            </button>
          </div>
        </header>

        <section className="workspace">
          <div className="page-intro">
            <div>
              <h1>{titles[activeFilter]}<span className="title-period"></span></h1>
            </div>
          </div>

          <div className="list-toolbar">
            <div className="task-count">
              <span className="count-dot" />
              {activeFilter === 'completed' ? completedTasks.length : activeTasks.length}{' '}
              {activeFilter === 'completed' ? 'concluídas' : 'ativas'}
            </div>
            <label className="search-box">
              <Icon name="search" size={16} />
              <input
                ref={searchInputRef}
                type="search"
                aria-label="Buscar tarefas"
                placeholder="Buscar tarefa"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <kbd>/</kbd>
            </label>
          </div>

          <div className="task-list">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <Task key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-mark"><Icon name={query ? 'search' : 'check'} size={21} /></span>
                <h2>{query ? 'Nenhum resultado' : activeFilter === 'completed' ? 'Nada concluído por enquanto' : 'Um espaço para respirar'}</h2>
                <p>{query ? 'Tente outra busca ou limpe o campo.' : 'Não há tarefas nesta lista agora. Adicione uma quando quiser.'}</p>
                {!query && activeFilter !== 'completed' && (
                  <button className="empty-create" onClick={() => setIsModalOpen(true)}>
                    <Icon name="plus" size={16} />
                    Adicionar primeira tarefa
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {isModalOpen && <ModalAddTask onClose={() => setIsModalOpen(false)} onAdd={addTask} />}
    </div>
  )
}

export default App
