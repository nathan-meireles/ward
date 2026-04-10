'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, X, Loader2, AlertCircle, ArrowUp, Minus, ArrowDown, ChevronRight, ChevronDown, Trash2 } from 'lucide-react'

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

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────

function ConfirmModal({ title, body, confirmLabel = 'Confirmar', onConfirm, onCancel }: {
  title: string; body: string; confirmLabel?: string
  onConfirm: () => void; onCancel: () => void
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onCancel])

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 20, backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="modal" style={{ maxWidth: 400, width: '100%' }}>
        <h3 style={{ fontFamily: 'var(--font-alt)', fontSize: 20, fontWeight: 400, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>
          {title}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 22, lineHeight: 1.6 }}>{body}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn btn-secondary">Cancelar</button>
          <button onClick={onConfirm} className="btn btn-destructive">
            <Trash2 size={12} /> {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ADD TASK MODAL ───────────────────────────────────────────────────────────

function AddTaskModal({ status, onClose, onCreate }: {
  status: Task['status']
  onClose: () => void
  onCreate: (data: Record<string, unknown>) => Promise<void>
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [taskStatus, setTaskStatus] = useState(status)
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [assignee, setAssignee] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    try {
      await onCreate({
        title: title.trim(),
        description: description || null,
        status: taskStatus,
        priority,
        due_date: dueDate || null,
        due_time: dueTime || null,
        assignee: assignee || null,
        tags,
        parent_id: null,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags(p => [...p, t])
    setTagInput('')
  }

  return (
    <div
      className="modal-backdrop"
      style={{ zIndex: 400 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal" style={{ width: '100%', maxWidth: 540 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-alt)', fontSize: 24, fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1 }}>
              Nova Tarefa
            </h2>
            <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Preencha os detalhes da tarefa
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px 6px', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Título</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSave() }}
            placeholder="Título da tarefa..."
            autoFocus
            className="form-input"
          />
        </div>

        {/* Status + Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <label className="form-label">Status</label>
            <select value={taskStatus} onChange={e => setTaskStatus(e.target.value as Task['status'])} className="form-input" style={{ cursor: 'pointer' }}>
              {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Prioridade</label>
            <select value={priority} onChange={e => setPriority(e.target.value as Task['priority'])} className="form-input" style={{ cursor: 'pointer' }}>
              {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        {/* Due date + time + assignee */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <label className="form-label">Prazo</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Hora</label>
            <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Responsável</label>
            <input value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Nathan" className="form-input" />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Descrição</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Detalhes, contexto, links..."
            rows={3}
            className="form-input"
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 22 }}>
          <label className="form-label">Tags</label>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: 5, marginBottom: 7, flexWrap: 'wrap' }}>
              {tags.map(tag => (
                <span key={tag} className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {tag}
                  <button onClick={() => setTags(p => p.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)', lineHeight: 1, padding: 0, fontSize: 14, marginLeft: 1 }}>×</button>
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
              placeholder="Adicionar tag..."
              className="form-input"
            />
            <button onClick={addTag} className="btn btn-secondary" style={{ flexShrink: 0 }}>+</button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving || !title.trim()} className="btn btn-primary">
            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
            Criar Tarefa
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── TASK CARD ────────────────────────────────────────────────────────────────

function TaskCard({ task, subtasks, dragging, onDragStart, onDragEnd, onClick }: {
  task: Task; subtasks: Task[]; dragging: boolean
  onDragStart: () => void; onDragEnd: () => void; onClick: () => void
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
          borderRadius: 'var(--radius-sm)', padding: '10px 12px',
          cursor: 'pointer', opacity: dragging ? 0.3 : 1,
          transition: 'border-color 0.1s, box-shadow 0.1s', userSelect: 'none',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border-2)'
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border)'
          el.style.boxShadow = 'none'
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 500, fontFamily: 'var(--font)', color: 'var(--text)', lineHeight: 1.45, marginBottom: 8 }}>
          {task.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: p.color, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <PIcon size={10} /> {p.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {task.due_date && (
              <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                {new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </span>
            )}
            {subtasks.length > 0 && (
              <button
                onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontFamily: 'var(--font-mono)' }}
              >
                {expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                {done}/{subtasks.length}
              </button>
            )}
          </div>
        </div>
        {task.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 7 }}>
            {task.tags.slice(0, 3).map(tag => (
              <span key={tag} className="badge badge-neutral">{tag}</span>
            ))}
          </div>
        )}
      </div>
      {/* Inline subtasks */}
      {expanded && subtasks.length > 0 && (
        <div style={{ marginLeft: 10, marginTop: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {subtasks.map(sub => (
            <div key={sub.id} style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '6px 10px',
              display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
              color: sub.status === 'done' ? 'var(--text-3)' : 'var(--text)',
              textDecoration: sub.status === 'done' ? 'line-through' : 'none',
              fontFamily: 'var(--font)',
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

// ─── TASK MODAL ───────────────────────────────────────────────────────────────

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
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && !showConfirm) onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose, showConfirm])

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

  return (
    <>
      <div
        className="modal-backdrop"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="modal" style={{ width: '100%', maxWidth: 580 }}>
          {/* Close */}
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)' }}>
            <X size={17} />
          </button>

          {/* Title input */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              fontFamily: 'var(--font-alt)',
              fontSize: 20, fontWeight: 400,
              color: 'var(--text)', background: 'none',
              border: 'none', outline: 'none', width: '100%',
              marginBottom: 18, paddingRight: 32,
            }}
          />

          {/* Status + Priority */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            <select
              value={task.status}
              onChange={e => onUpdate({ status: e.target.value as Task['status'] })}
              className="form-input"
              style={{ width: 'auto', cursor: 'pointer', fontSize: 12 }}
            >
              {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <select
              value={task.priority}
              onChange={e => onUpdate({ priority: e.target.value as Task['priority'] })}
              className="form-input"
              style={{ width: 'auto', cursor: 'pointer', fontSize: 12 }}
            >
              {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          {/* Due date + time + assignee */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div>
              <label className="form-label">Prazo</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="form-label">Hora</label>
              <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} className="form-input" />
            </div>
            <div>
              <label className="form-label">Responsável</label>
              <input value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Nathan" className="form-input" />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Descrição</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Detalhes, contexto, links..."
              rows={3}
              className="form-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 18 }}>
            <label className="form-label">Tags</label>
            <div style={{ display: 'flex', gap: 5, marginBottom: 7, flexWrap: 'wrap' }}>
              {tags.map(tag => (
                <span key={tag} className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {tag}
                  <button onClick={() => setTags(p => p.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)', lineHeight: 1, padding: 0, fontSize: 14 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
                placeholder="Adicionar tag..."
                className="form-input"
              />
              <button onClick={addTag} className="btn btn-secondary" style={{ flexShrink: 0 }}>+</button>
            </div>
          </div>

          {/* Subtasks */}
          <div style={{ marginBottom: 22 }}>
            <label className="form-label">Subtarefas ({subtasks.length})</label>
            {subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
                {subtasks.map(sub => (
                  <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <input
                      type="checkbox"
                      checked={sub.status === 'done'}
                      onChange={e => onUpdateSubtask(sub.id, { status: e.target.checked ? 'done' : 'todo' })}
                      style={{ cursor: 'pointer', flexShrink: 0, accentColor: 'var(--brand)' }}
                    />
                    <span
                      onClick={() => onOpenSubtask(sub)}
                      style={{ fontSize: 13, flex: 1, cursor: 'pointer', fontFamily: 'var(--font)', textDecoration: sub.status === 'done' ? 'line-through' : 'none', color: sub.status === 'done' ? 'var(--text-3)' : 'var(--text)' }}
                    >
                      {sub.title}
                    </span>
                    <button onClick={() => onDeleteSubtask(sub.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: 2, display: 'flex' }}>
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
                className="form-input"
              />
              <button onClick={submitSubtask} disabled={addingSub || !newSubtask.trim()} className="btn btn-secondary" style={{ flexShrink: 0 }}>
                {addingSub ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={13} />}
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <button onClick={() => setShowConfirm(true)} className="btn btn-ghost" style={{ color: 'var(--error)', borderColor: 'rgba(248,113,113,0.25)' }}>
              <Trash2 size={12} /> Deletar
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onClose} className="btn btn-secondary">Cancelar</button>
              <button onClick={save} className="btn btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Deletar tarefa"
          body="Esta ação removerá a tarefa e todas as subtarefas associadas. Não pode ser desfeita."
          confirmLabel="Deletar"
          onConfirm={() => { onDelete(); onClose() }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export function KanbanClient() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<Task['status'] | null>(null)
  const [selected, setSelected] = useState<Task | null>(null)
  const [addModalStatus, setAddModalStatus] = useState<Task['status'] | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/tasks?project_id=${PROJECT_ID}`)
      if (res.ok) setTasks(await res.json())
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function createTask(data: Record<string, unknown>) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: PROJECT_ID, ...data }),
    })
    if (res.ok) {
      const task = await res.json()
      setTasks(prev => [...prev, task])
    }
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
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-alt)', fontSize: 36, fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1 }}>
          Tarefas
        </h1>
        <p style={{ color: 'var(--text-4)', fontSize: 11, marginTop: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {tasks.filter(t => !t.parent_id).length} tarefas · arraste para mover
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-4)', padding: 48, fontFamily: 'var(--font-mono)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand)' }} /> Carregando...
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
                borderRadius: 'var(--radius-lg)',
                minHeight: 160,
                display: 'flex',
                flexDirection: 'column',
                transition: 'background 0.1s, border-color 0.1s',
              }}
            >
              {/* Column header */}
              <div style={{
                padding: '12px 14px 10px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[col.key], flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{col.label}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, background: 'var(--surface-3)',
                    color: 'var(--text-3)', borderRadius: 20, padding: '1px 6px',
                    fontFamily: 'var(--font-mono)',
                  }}>{rootTasks(col.key).length}</span>
                </div>
                <button
                  onClick={() => setAddModalStatus(col.key)}
                  className="btn btn-ghost"
                  style={{ padding: '3px 5px', minHeight: 'auto' }}
                  title="Adicionar tarefa"
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
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add task modal */}
      {addModalStatus && (
        <AddTaskModal
          status={addModalStatus}
          onClose={() => setAddModalStatus(null)}
          onCreate={createTask}
        />
      )}

      {/* Task detail modal */}
      {selected && (
        <TaskModal
          task={selected}
          subtasks={tasks.filter(t => t.parent_id === selected.id)}
          onClose={() => setSelected(null)}
          onUpdate={u => updateTask(selected.id, u)}
          onDelete={() => deleteTask(selected.id)}
          onAddSubtask={async (title) => {
            await createTask({ title, status: selected.status, priority: 'medium', parent_id: selected.id })
          }}
          onDeleteSubtask={deleteTask}
          onUpdateSubtask={updateTask}
          onOpenSubtask={t => setSelected(t)}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
