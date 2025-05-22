// App.jsx
import { useEffect, useState } from 'react'
import {
  fetchNotes,
  createNote,
  archiveNote,
  unarchiveNote,
  deleteNote,
  updateNote,
} from './api'

function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadNotes()
  }, [showArchived, searchTerm])

  async function loadNotes() {
    setLoading(true)
    try {
      const data = await fetchNotes({ archived: showArchived, title: searchTerm })
      setNotes(data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Error loading notes')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateNote(e) {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please enter a title and content')
      return
    }
    try {
      const created = await createNote({ title: newTitle, content: newContent })
      setNotes((prev) => [created, ...prev])
      setNewTitle('')
      setNewContent('')
    } catch {
      alert('Error creating note')
    }
  }

  async function toggleArchive(id, isArchived) {
    try {
      if (isArchived) {
        await unarchiveNote(id)
      } else {
        await archiveNote(id)
      }
      loadNotes()
    } catch {
      alert('Error updating note archive status')
    }
  }

  async function handleDelete() {
    try {
      await deleteNote(deleteConfirmId)
      setNotes((prev) => prev.filter((note) => note.id !== deleteConfirmId))
      setDeleteConfirmId(null)
    } catch {
      alert('Error deleting note')
      setDeleteConfirmId(null)
    }
  }

  function startEditing(note) {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditTitle('')
    setEditContent('')
  }

  async function saveEditing(id) {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Please enter a title and content')
      return
    }
    try {
      const updated = await updateNote(id, { title: editTitle, content: editContent })
      setNotes((prev) => prev.map((note) => (note.id === id ? updated : note)))
      cancelEditing()
    } catch {
      alert('Error updating note')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 via-white to-blue-50 font-sans">
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-4xl mx-auto flex flex-col justify-center">

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 tracking-wide drop-shadow-md mb-4">
              📒 My Notes
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto hover:shadow-lg transform hover:scale-105"
              aria-label={showArchived ? 'View active notes' : 'View archived notes'}
            >
              {showArchived ? '📝 View Active Notes' : '📦 View Archived Notes'}
            </button>

            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full sm:w-64 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
              aria-label="Search notes by title"
            />

            <div className="text-center sm:text-right">
              <p className="text-gray-700 font-medium flex items-center gap-2 text-lg justify-center sm:justify-end">
                {showArchived ? 'Archived' : 'Active'}:{' '}
                <span className="text-indigo-600 font-bold text-xl bg-indigo-100 px-3 py-1 rounded-full">
                  {notes.length}
                </span>{' '}
                {notes.length === 1 ? 'note' : 'notes'} {showArchived ? '📦' : '📝'}
              </p>
            </div>
          </div>

          {!showArchived && !editingId && (
            <div className="mb-8">
              <form
                onSubmit={handleCreateNote}
                className="bg-white rounded-xl p-6 shadow-lg border-indigo-100"
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="border border-gray-300 rounded-lg p-4 w-full text-gray-800"
                  />
                  <textarea
                    placeholder="Note content..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="border border-gray-300 rounded-lg p-4 w-full resize-none h-32 text-gray-800"
                  />
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300"
                  >
                    ✨ Create Note
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <p className="text-indigo-600 font-semibold text-lg flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Loading notes...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center mb-6">
              <p className="text-red-600 font-semibold bg-red-100 p-4 rounded-lg  border-red-200">
                ❌ {error}
              </p>
            </div>
          )}

          {!loading && notes.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
                <p className="text-gray-600 text-xl italic mb-2">
                  {showArchived ? '📦' : '📝'} No {showArchived ? 'archived' : 'active'} notes found.
                </p>
              </div>
            </div>
          )}

          {notes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-gray-100 hover:border-indigo-200 transform hover:scale-105"
                >
                  {editingId === note.id ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border border-indigo-300 rounded-md w-full mb-2 p-2"
                        aria-label="Edit note title"
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="border border-indigo-300 rounded-md w-full mb-4 p-2 resize-none h-28"
                        aria-label="Edit note content"
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => saveEditing(note.id)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-2 text-indigo-700">{note.title}</h3>
                      <p className="text-gray-700 whitespace-pre-wrap mb-4">{note.content}</p>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => toggleArchive(note.id, note.archived)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          {note.archived ? '📤 Unarchive' : '📦 Archive'}
                        </button>
                        <div className="flex gap-3">
                          <button
                            onClick={() => startEditing(note)}
                            className="text-yellow-600 hover:text-yellow-800 font-semibold"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(note.id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {deleteConfirmId && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-lg border-red-300">
                <h2 className="text-xl font-bold mb-4 text-red-600">
                  Confirm Deletion
                </h2>
                <p className="mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default App
