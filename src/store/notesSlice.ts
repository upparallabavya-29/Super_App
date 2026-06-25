import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Note } from '@/types/note.types';
import { generateId } from '@/utils/formatters';

interface NotesState {
  notes: Note[];
  addNote: (title: string, content: string, color?: string) => void;
  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'color'>>) => void;
  deleteNote: (id: string) => void;
}

const NOTE_COLORS = [
  'from-indigo-500/20 to-purple-500/20',
  'from-blue-500/20 to-cyan-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-orange-500/20 to-amber-500/20',
  'from-pink-500/20 to-rose-500/20',
];

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (title, content, color) => {
        const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
        const note: Note = {
          id: generateId(),
          title,
          content,
          color: color ?? randomColor,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({ notes: [note, ...get().notes] });
      },
      updateNote: (id, updates) => {
        set({
          notes: get().notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
          ),
        });
      },
      deleteNote: (id) => {
        set({ notes: get().notes.filter((n) => n.id !== id) });
      },
    }),
    {
      name: 'super-app-notes',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
