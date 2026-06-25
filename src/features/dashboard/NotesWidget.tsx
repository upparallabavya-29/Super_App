'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotesStore } from '@/store/notesSlice';
import { Note } from '@/types/note.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatTimeAgo } from '@/utils/formatters';

const noteColors = [
  { bg: 'rgba(99,102,241,0.07)', border: 'rgba(99,102,241,0.18)', accent: '#6366f1', label: 'Indigo' },
  { bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.18)', accent: '#8b5cf6', label: 'Violet' },
  { bg: 'rgba(20,184,166,0.07)', border: 'rgba(20,184,166,0.18)', accent: '#14b8a6', label: 'Teal' },
  { bg: 'rgba(251,191,36,0.07)', border: 'rgba(251,191,36,0.18)', accent: '#fbbf24', label: 'Amber' },
  { bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.18)', accent: '#f87171', label: 'Rose' },
];

function getNoteStyle(index: number) {
  return noteColors[index % noteColors.length];
}

interface NoteCardItemProps {
  note: Note;
  index: number;
  onUpdate: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void;
  onDelete: (id: string) => void;
}

function NoteCardItem({ note, index, onUpdate, onDelete }: NoteCardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const titleRef = useRef<HTMLInputElement>(null);
  const style = getNoteStyle(index);

  const handleSave = () => {
    if (editTitle.trim() || editContent.trim()) {
      onUpdate(note.id, { title: editTitle, content: editContent });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditTitle(note.title);
      setEditContent(note.content);
      setIsEditing(false);
    }
    if (e.key === 'Enter' && e.ctrlKey) handleSave();
  };

  const startEdit = () => {
    setIsEditing(true);
    setTimeout(() => titleRef.current?.focus(), 50);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="relative rounded-xl overflow-hidden group"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
      }}
      aria-label={`Note: ${note.title || 'Untitled'}`}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl"
        style={{ background: style.accent }}
        aria-hidden="true"
      />

      <div className="p-3.5 pl-4">
        {isEditing ? (
          <div className="space-y-2" onKeyDown={handleKeyDown}>
            <input
              ref={titleRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Note title…"
              className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-white/30 outline-none border-b border-white/15 pb-1"
              aria-label="Note title"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Write something…"
              rows={3}
              className="w-full bg-transparent text-sm text-white/75 placeholder:text-white/30 outline-none resize-none leading-relaxed"
              aria-label="Note content"
            />
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setEditTitle(note.title); setEditContent(note.content); setIsEditing(false); }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>Save</Button>
            </div>
          </div>
        ) : (
          <div>
            {note.title && (
              <h3 className="text-sm font-semibold text-white mb-1 truncate">{note.title}</h3>
            )}
            {note.content && (
              <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{note.content}</p>
            )}
            <div className="flex items-center justify-between mt-2.5">
              <time className="text-[11px] text-white/30" dateTime={note.updatedAt}>
                {formatTimeAgo(note.updatedAt)}
              </time>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={startEdit}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  aria-label={`Edit: ${note.title}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  aria-label={`Delete: ${note.title}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function NotesWidget() {
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    addNote(newTitle.trim() || 'Untitled', newContent.trim());
    setNewTitle('');
    setNewContent('');
    setShowNew(false);
  };

  return (
    <Card className="h-full flex flex-col relative overflow-hidden" glow="violet">
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[20px]"
        style={{ background: 'linear-gradient(90deg, #8b5cf6, #a78bfa, #c4b5fd)' }}
        aria-hidden="true"
      />

      {/* Background decoration */}
      <div
        className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-sm">
            📝
          </div>
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Notes</h2>
          {notes.length > 0 && (
            <motion.span
              key={notes.length}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="px-2 py-0.5 text-xs bg-violet-500/18 text-violet-300 rounded-lg font-bold font-mono border border-violet-500/20"
            >
              {notes.length}
            </motion.span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowNew((s) => !s)}
          aria-expanded={showNew}
          aria-label="Create new note"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
          style={showNew
            ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }
            : { background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', boxShadow: '0 4px 14px rgba(139,92,246,0.35)' }
          }
        >
          {showNew ? (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </>
          )}
        </motion.button>
      </div>

      {/* New note form */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden flex-shrink-0 relative z-10"
          >
            <div className="p-4 rounded-xl bg-violet-500/6 border border-violet-500/20 space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Note title…"
                className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-white/30 outline-none border-b border-white/12 pb-2"
                aria-label="New note title"
                autoFocus
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your thoughts…"
                rows={3}
                className="w-full bg-transparent text-sm text-white/75 placeholder:text-white/30 outline-none resize-none leading-relaxed"
                aria-label="New note content"
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleAdd(); }}
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-white/20">Ctrl+Enter to save</span>
                <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim() && !newContent.trim()}>
                  Save Note
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 min-h-0 relative z-10" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {notes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-28 text-center gap-2"
            >
              <span className="text-4xl" aria-hidden="true">📝</span>
              <p className="text-sm text-white/30">No notes yet. Hit + New Note!</p>
            </motion.div>
          ) : (
            notes.map((note, i) => (
              <NoteCardItem
                key={note.id}
                note={note}
                index={i}
                onUpdate={updateNote}
                onDelete={deleteNote}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
