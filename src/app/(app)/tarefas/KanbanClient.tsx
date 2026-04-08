'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Plus, X, Loader2, AlertCircle, ArrowUp, Minus, ArrowDown, ChevronRight, ChevronDown } from 'lucide-react'

interface Task {
  id: string
  project_id: string
  title: string
  description: string | null
  status: 'backlog' | 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string | null
  due_time: string | null
  assignee: string | null
  tags: string[]
  parent_id: string | null
  linked_type: string | null
  linked_id: string | null
  created_at: string
}

const PROJECT_ID = 'notreglr'

const COLUMNS: { key: Task['status']; label: string }[] = [
  { key: 'backlog',     label: 'Backlog'      },
  { key: 'todo',        label: 'A fazer'      },
  { key: 'in_progress', label: 'Em andamento' },
  { key: 'done',        label: 'Concluído'    },
]

const STATUS_COLOR: Record<Task['status'], string> = {
  backlog:     '#71717a',
  todo:        '#3b82f6',
  in_progress: '#f59e0b',
  done:        '#22c55e',
}

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgente', color: '#ef4444', Icon: AlertCircle },
  high:   { label: 'Alta',    color: '#f59e0b', Icon: ArrowUp     },
  medium: { label: 'Média',   color: '#3b82f6', Icon: Minus       },
  low:    { label: 'Baixa',   color: '#71717a', Icon: ArrowDown   },
}

function btn(variant: 'primary' | 'secondary' | 'ghost' | 'danger'): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 'var(--radius-sm)',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    border: '1px solid transparent', fontFamily: 'var(--font)',
    whiteSpace: 'nowrap',
  }
  if (variant === 'primary')   return { ...base, background: 'var(--brand)',     color: 'var(--bg-dark)',  border: '1px solid var(--brand-dark)' }
  if (variant === 'secondary') return { ...base, background: 'var(--surface-2)', color: 'var(--text-2)',  border: '1px solid var(--border)' }
  if (variant === 'danger')    return { ...base, background: 'transparent',      color: 'var(--error)',   border: '1px solid var(--error)' }
  return { ...base, background: 'transparent', color: 'var(--text-3)' }
}

export function KanbanClient() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<Task['status'] | null>(null)
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
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { if (addingTo) setTimeout(() => inputRef.current?.focus(), 50) }, [addingTo])

  async function addTask(status: Task['status'], parentId?: string) {
    if (!newTitle.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: PROJECT_ID, title: newTitle.trim(),
          status, priority: 'medium',
          parent_id: parentId ?? null,
        }),
      })
      if (res.ok) {
        const task = await res.json()
        setTasks(prev => [...prev, task])
        setNewTitle('')
        setAddingTo(null)
      }
    } finally { setSaving(false) }
  }

  async function moveTask(id: string, status: Task['status']) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    await fetch(`/api/tasks?id=${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    if (selected?.id === id) setSelected(p => p ? { ...p, ...updates } : null)
    await fetch(`/api/tasks?id=${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
  }

  async function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id && t.parent_id !== id))
    setSelected(null)
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
  }

  const rootTasks = (status: Task['status']) =>
    tasks.filter(t => t.status === status && !t.parent_id)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Tarefas</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 2 }}>
          {tasks.filter(t => !t.parent_id).length} tarefas · arraste para mover
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-3)', padding: 40 }}>
          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Carregando...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, alignItems: 'start' }}>
          {COLUMNS.map(col => (
            <div
              key={col.key}
              onDragOver={e => { e.preventDefault(); setDragOver(col.key) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => { e.preventDefault(); if (dragging) moveTask(dragging, col.key); setDragging(null); setDragOver(null) }}
              style={{
                background: dragOver === col.key ? 'var(--surface-2)' : 'var(--surface)',
                border: `1px solid ${dragOver === col.key ? 'var(--border-2)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                minHeight: 160,
                display: 'flex',
                flexDirection: 'column',
                transition: 'background 0.1s, border-color 0.1s',
              }}
            >
              {/* Column header */}
              <div style={{
                padding: '11px 12px 10px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[col.key], flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--text)' }}>{col.label}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, background: 'var(--surface-3)',
                    color: 'var(--text-3)', borderRadius: 20, padding: '1px 6px',
                  }}>{rootTasks(col.key).length}</span>
                </div>
                <button
                  onClick={() => { setAddingTo(col.key); setNewTitle('') }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-3)', padding: '2px 4px', borderRadius: 4,
                    display: 'flex', alignItems: 'center', lineHeight: 1,
                  }}
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Tasks */}
              <div style={{ padding: '6px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {rootTasks(col.key).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    subtasks={tasks.filter(t => t.parent_id === task.id)}
                    dragging={dragging === task.id}
                    onDragStart={() => setDragging(task.id)}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => setSelected(task)}
                    allTasks={tasks}
                  />
                ))}

                {addingTo === col.key && (
                  <div style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', padding: 9,
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
                      style={{ ...input(), marginBottom: 7 }}
                    />
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button
                        onClick={() => addTask(col.key)}
                        disabled={saving || !newTitle.trim()}
                        style={{ ...btn('primary'), flex: 1, justifyContent: 'center', padding: '6px 0', fontSize: 12 }}
                      >
                        {saving ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : 'Adicionar'}
                      </button>
                      <button
                        onClick={() => { setAddingTo(null); setNewTitle('') }}
                        style={{ ...btn('secondary'), padding: '6px 8px' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <TaskModal
          task={selected}
          subtasks={tasks.filter(t => t.parent_id === selected.id)}
          onClose={() => setSelected(null)}
          onUpdate={u => updateTask(selected.id, u)}
          onDelete={() => deleteTask(selected.id)}
          onAddSubtask={async (title) => {
            setSaving(true)
            try {
              const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  project_id: PROJECT_ID, title,
                  status: selected.status, priority: 'medium',
                  parent_id: selected.id,
                }),
              })
              if (res.ok) {
                const sub = await res.json()
                setTasks(prev => [...prev, sub])
              }
            } finally { setSaving(false) }
          }}
          onDeleteSubtask={deleteTask}
          onUpdateSubtask={updateTask}
          onOpenSubtask={t => setSelected(t)}
        />
      )}
    </div>
  )
}

function TaskCard({ task, subtasks, dragging, onDragStart, onDragEnd, onClick, allTasks }: {
  task: Task; subtasks: Task[]; dragging: boolean
  onDragStart: () => void; onDragEnd: () => void; onClick: () => void; allTasks: Task[]
}) {
  const [expanded, setExpanded] = useState(false)
  const p = PRIORITY_CONFIG[task.priority]
  const PIcon = p.Icon
  const done = subtasks.filter(s => s.status === 'done').length

  return (
    <div>
      <div
        draggable
        onDragStart={e => { onDragStart(); e.dataTransfer.effectAllowed = 'move' }}
        onDragEnd={onDragEnd}
        onClick={onClick}
        style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', padding: '9px 11px',
          cursor: 'pointer', opacity: dragging ? 0.35 : 1,
          transition: 'border-color 0.1s', userSelect: 'none',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-2)'}
        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
      >
        <p style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, marginBottom: 7 }}>
          {task.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: p.color, fontWeight: 600 }}>
            <PIcon size={10} /> {p.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {task.due_date && (
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                {new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </span>
            )}
            {subtasks.length > 0 && (
              <button
                onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontFamily: 'var(--font)' }}
              >
                {expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                {done}/{subtasks.length}
              </button>
            )}
          </div>
        </div>
        {task.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
            {task.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 20, background: 'var(--surface-3)', color: 'var(--text-3)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* Subtasks inline */}
      {expanded && subtasks.length > 0 && (
        <div style={{ marginLeft: 12, marginTop: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {subtasks.map(sub => (
            <div key={sub.id} style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '6px 10px',
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12,
              color: sub.status === 'done' ? 'var(--text-3)' : 'var(--text)',
              textDecoration: sub.status === 'done' ? 'line-through' : 'none',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[sub.status], flexShrink: 0 }} />
              {sub.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TaskModal({ task, subtasks, onClose, onUpdate, onDelete, onAddSubtask, onDeleteSubtask, onUpdateSubtask, onOpenSubtask }: {
  task: Task; subtasks: Task[]
  onClose: () => void
  onUpdate: (u: Partial<Task>) => void
  onDelete: () => void
  onAddSubtask: (title: string) => void
  onDeleteSubtask: (id: string) => void
  onUpdateSubtask: (id: string, u: Partial<Task>) => void
  onOpenSubtask: (t: Task) => void
}) {
  const [title, setTitle] = useState(task.title)
  const [desc, setDesc] = useState(task.description ?? '')
  const [dueDate, setDueDate] = useState(task.due_date ?? '')
  const [dueTime, setDueTime] = useState(task.due_time ?? '')
  const [assignee, setAssignee] = useState(task.assignee ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(task.tags)
  const [newSubtask, setNewSubtask] = useState('')
  const [addingSub, setAddingSub] = useState(false)

  function save() {
    const updates: Partial<Task> = {}
    if (title !== task.title) updates.title = title
    if (desc !== (task.description ?? '')) updates.description = desc || null
    if (dueDate !== (task.due_date ?? '')) updates.due_date = dueDate || null
    if (dueTime !== (task.due_time ?? '')) updates.due_time = dueTime || null
    if (assignee !== (task.assignee ?? '')) updates.assignee = assignee || null
    if (JSON.stringify(tags) !== JSON.stringify(task.tags)) updates.tags = tags
    if (Object.keys(updates).length) onUpdate(updates)
    onClose()
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags(p => [...p, t])
    setTagInput('')
  }

  async function submitSubtask() {
    if (!newSubtask.trim()) return
    setAddingSub(true)
    await onAddSubtask(newSubtask.trim())
    setNewSubtask('')
    setAddingSub(false)
  }

  const label: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: 'var(--text-3)',
    textTransform: 'uppercase', letterSpacing: 0.5,
    display: 'block', marginBottom: 5,
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 28, width: '100%', maxWidth: 580, maxHeight: '92dvh', overflowY: 'auto', position: 'relative', animation: 'fadeIn 0.15s ease' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
          <X size={17} />
        </button>

        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', background: 'none', border: 'none', outline: 'none', width: '100%', marginBottom: 18, paddingRight: 32, fontFamily: 'var(--font)' }}
        />

        {/* Status + Priority */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          <select value={task.status} onChange={e => onUpdate({ status: e.target.value as Task['status'] })} style={sel}>
            {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <select value={task.priority} onChange={e => onUpdate({ priority: e.target.value as Task['priority'] })} style={sel}>
            {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {/* Due date + time + assignee */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div>
            <label style={label}>Prazo</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={input()} />
          </div>
          <div>
            <label style={label}>Hora</label>
            <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} style={input()} />
          </div>
          <div>
            <label style={label}>Responsável</label>
            <input value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Nathan" style={input()} />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label style={label}>Descrição</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Detalhes, contexto, links..."
            rows={3}
            style={{ ...input(), resize: 'vertical' as const }}
          />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 18 }}>
          <label style={label}>Tags</label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 7, flexWrap: 'wrap' }}>
            {tags.map(tag => (
              <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '3px 9px', borderRadius: 20, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
                {tag}
                <button onClick={() => setTags(p => p.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', lineHeight: 1, padding: 0 }}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
              placeholder="Adicionar tag..."
              style={{ ...input(), width: 'auto', flex: 1 }}
            />
            <button onClick={addTag} style={btn('secondary')}>+</button>
          </div>
        </div>

        {/* Subtasks */}
        <div style={{ marginBottom: 22 }}>
          <label style={label}>Subtarefas ({subtasks.length})</label>
          {subtasks.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
              {subtasks.map(sub => (
                <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <input
                    type="checkbox"
                    checked={sub.status === 'done'}
                    onChange={e => onUpdateSubtask(sub.id, { status: e.target.checked ? 'done' : 'todo' })}
                    style={{ cursor: 'pointer', flexShrink: 0 }}
                  />
                  <span
                    onClick={() => onOpenSubtask(sub)}
                    style={{ fontSize: 13, flex: 1, cursor: 'pointer', textDecoration: sub.status === 'done' ? 'line-through' : 'none', color: sub.status === 'done' ? 'var(--text-3)' : 'var(--text)' }}
                  >
                    {sub.title}
                  </span>
                  <button onClick={() => onDeleteSubtask(sub.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: 2 }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitSubtask() }}
              placeholder="Nova subtarefa..."
              style={{ ...input(), flex: 1 }}
            />
            <button onClick={submitSubtask} disabled={addingSub || !newSubtask.trim()} style={btn('secondary')}>
              {addingSub ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={13} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px solid var(--border)' }}>
          <button onClick={() => { if (confirm('Deletar tarefa e subtarefas?')) onDelete() }} style={btn('danger')}>
            Deletar
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={btn('secondary')}>Cancelar</button>
            <button onClick={save} style={btn('primary')}>Salvar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const sel: React.CSSProperties = {
  background: 'transparent', border: '1px solid var(--border-input)',
  borderRadius: 'var(--radius-sm)', padding: '6px 10px',
  fontSize: 12, color: 'var(--text)', outline: 'none', cursor: 'pointer',
  fontFamily: 'var(--font)',
}

function input(extra?: React.CSSProperties): React.CSSProperties {
  return {
    background: 'transparent', border: '1px solid var(--border-input)',
    borderRadius: 'var(--radius-sm)', padding: '8px 11px',
    fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font)',
    outline: 'none', width: '100%', ...extra,
  }
}
