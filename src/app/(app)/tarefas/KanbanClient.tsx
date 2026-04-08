'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Plus, X, Loader2, AlertCircle, ArrowUp, Minus, ArrowDown, Calendar } from 'lucide-react'

interface Task {
  id: string
  project_id: string
  title: string
  description: string | null
  status: 'backlog' | 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string | null
  linked_type: string | null
  linked_id: string | null
  created_at: string
}

const PROJECT_ID = 'notreglr'

const COLUMNS: { key: Task['status']; label: string; color: string }[] = [
  { key: 'backlog',     label: 'Backlog',      color: '#8a7a6a' },
  { key: 'todo',        label: 'A fazer',      color: '#3b82f6' },
  { key: 'in_progress', label: 'Em andamento', color: '#e47c24' },
  { key: 'done',        label: 'Concluído',    color: '#22c55e' },
]

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgente',  color: '#ef4444', icon: AlertCircle },
  high:   { label: 'Alta',     color: '#e47c24', icon: ArrowUp     },
  medium: { label: 'Média',    color: '#3b82f6', icon: Minus       },
  low:    { label: 'Baixa',    color: '#8a7a6a', icon: ArrowDown   },
}

export function KanbanClient() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState<string | null>(null)
  const [selected, setSelected] = useState<Task | null>(null)
  const [addingTo, setAddingTo] = useState<Task['status'] | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/tasks?project_id=${PROJECT_ID}`)
      if (res.ok) setTasks(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (addingTo) setTimeout(() => inputRef.current?.focus(), 50)
  }, [addingTo])

  async function addTask(status: Task['status']) {
    if (!newTitle.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: PROJECT_ID,
          title: newTitle.trim(),
          status,
          priority: 'medium',
        }),
      })
      if (res.ok) {
        const task = await res.json()
        setTasks(prev => [...prev, task])
        setNewTitle('')
        setAddingTo(null)
      }
    } finally {
      setSaving(false)
    }
  }

  async function moveTask(id: string, status: Task['status']) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    await fetch(`/api/tasks?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...updates } : null)
    await fetch(`/api/tasks?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
  }

  async function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
    setSelected(null)
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
  }

  function onDragStart(e: React.DragEvent, id: string) {
    setDragging(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDrop(e: React.DragEvent, status: Task['status']) {
    e.preventDefault()
    if (dragging) moveTask(dragging, status)
    setDragging(null)
  }

  const taskCount = (status: Task['status']) => tasks.filter(t => t.status === status).length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>Tarefas</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>
          {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''} · arraste para mover entre colunas
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-3)', padding: 40 }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          Carregando...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
          {COLUMNS.map(col => (
            <div
              key={col.key}
              onDragOver={e => e.preventDefault()}
              onDrop={e => onDrop(e, col.key)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Column header */}
              <div style={{
                padding: '12px 14px 10px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: col.color, display: 'inline-block', flexShrink: 0,
                  }} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{col.label}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    background: 'var(--surface-3)', color: 'var(--text-3)',
                    borderRadius: 20, padding: '1px 7px',
                  }}>{taskCount(col.key)}</span>
                </div>
                <button
                  onClick={() => { setAddingTo(col.key); setNewTitle('') }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-3)', padding: 2, borderRadius: 4,
                    display: 'flex', alignItems: 'center',
                  }}
                  title="Adicionar tarefa"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Tasks */}
              <div style={{ padding: '8px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tasks
                  .filter(t => t.status === col.key)
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      dragging={dragging === task.id}
                      onDragStart={e => onDragStart(e, task.id)}
                      onDragEnd={() => setDragging(null)}
                      onClick={() => setSelected(task)}
                    />
                  ))
                }

                {/* Inline add form */}
                {addingTo === col.key && (
                  <div style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 10,
                  }}>
                    <input
                      ref={inputRef}
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') addTask(col.key)
                        if (e.key === 'Escape') { setAddingTo(null); setNewTitle('') }
                      }}
                      placeholder="Título da tarefa..."
                      style={{
                        width: '100%', background: 'var(--surface)',
                        border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                        padding: '6px 10px', fontSize: 13, color: 'var(--text)',
                        fontFamily: 'var(--font)', outline: 'none', marginBottom: 8,
                      }}
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => addTask(col.key)}
                        disabled={saving || !newTitle.trim()}
                        style={{
                          flex: 1, background: 'var(--brand)', color: '#fff',
                          border: 'none', borderRadius: 'var(--radius-sm)',
                          padding: '6px 0', fontSize: 12, fontWeight: 600,
                          cursor: 'pointer', fontFamily: 'var(--font)',
                        }}
                      >
                        {saving ? '...' : 'Adicionar'}
                      </button>
                      <button
                        onClick={() => { setAddingTo(null); setNewTitle('') }}
                        style={{
                          background: 'var(--surface-3)', color: 'var(--text-3)',
                          border: 'none', borderRadius: 'var(--radius-sm)',
                          padding: '6px 8px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center',
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <TaskModal
          task={selected}
          onClose={() => setSelected(null)}
          onUpdate={(updates) => updateTask(selected.id, updates)}
          onDelete={() => deleteTask(selected.id)}
          onMove={(status) => { moveTask(selected.id, status); setSelected(null) }}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function TaskCard({
  task, dragging, onDragStart, onDragEnd, onClick,
}: {
  task: Task
  dragging: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  onClick: () => void
}) {
  const p = PRIORITY_CONFIG[task.priority]
  const PIcon = p.icon

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 12px',
        cursor: 'pointer',
        opacity: dragging ? 0.4 : 1,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--brand)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 8px rgba(228,124,36,0.1)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, marginBottom: 8 }}>
        {task.title}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 11, color: p.color, fontWeight: 600,
        }}>
          <PIcon size={11} />
          {p.label}
        </span>
        {task.due_date && (
          <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Calendar size={10} />
            {new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
        )}
      </div>
    </div>
  )
}

function TaskModal({
  task, onClose, onUpdate, onDelete, onMove,
}: {
  task: Task
  onClose: () => void
  onUpdate: (u: Partial<Task>) => void
  onDelete: () => void
  onMove: (s: Task['status']) => void
}) {
  const [title, setTitle] = useState(task.title)
  const [desc, setDesc] = useState(task.description ?? '')
  const [dueDate, setDueDate] = useState(task.due_date ?? '')

  function save() {
    const updates: Partial<Task> = {}
    if (title !== task.title) updates.title = title
    if (desc !== (task.description ?? '')) updates.description = desc || null
    if (dueDate !== (task.due_date ?? '')) updates.due_date = dueDate || null
    if (Object.keys(updates).length) onUpdate(updates)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
          padding: 28, width: '100%', maxWidth: 520,
          maxHeight: '90dvh', overflowY: 'auto', position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}
        >
          <X size={18} />
        </button>

        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            fontSize: 17, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font)',
            background: 'none', border: 'none', outline: 'none', width: '100%', marginBottom: 16,
            paddingRight: 32,
          }}
        />

        {/* Status + Priority row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <select
            value={task.status}
            onChange={e => onMove(e.target.value as Task['status'])}
            style={selectStyle}
          >
            {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <select
            value={task.priority}
            onChange={e => onUpdate({ priority: e.target.value as Task['priority'] })}
            style={selectStyle}
          >
            {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            style={selectStyle}
          />
        </div>

        {/* Description */}
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
          Descrição
        </label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Detalhes, contexto, links..."
          rows={4}
          style={{
            width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 13,
            color: 'var(--text)', fontFamily: 'var(--font)', outline: 'none',
            resize: 'vertical', marginBottom: 20,
          }}
        />

        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          <button
            onClick={() => { if (confirm('Deletar esta tarefa?')) onDelete() }}
            style={{
              background: 'none', border: '1px solid #ef4444', color: '#ef4444',
              borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontSize: 13,
              fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
            }}
          >
            Deletar
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={btnSecondary}>Cancelar</button>
            <button onClick={save} style={btnPrimary}>Salvar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  background: 'var(--surface-2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: 12,
  color: 'var(--text)', fontFamily: 'var(--font)', outline: 'none', cursor: 'pointer',
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--brand)', color: '#fff', border: '1px solid var(--brand-dark)',
  borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13,
  fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
}

const btnSecondary: React.CSSProperties = {
  background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13,
  fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
}
