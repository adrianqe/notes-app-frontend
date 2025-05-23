import { useEffect, useState } from 'react'
import {
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
} from './api'

function TagsComponent() {
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [newTagName, setNewTagName] = useState('')
    const [deleteConfirmId, setDeleteConfirmId] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadTags()
    }, [])

    async function loadTags() {
        setLoading(true)
        try {
            const data = await fetchTags()
            setTags(data)
            setError(null)
        } catch (err) {
            setError(err.message || 'Error loading tags')
        } finally {
            setLoading(false)
        }
    }

    async function handleCreateTag(e) {
        e.preventDefault()
        if (!newTagName.trim()) {
            alert('Please enter a tag name')
            return
        }
        try {
            const created = await createTag({ name: newTagName })
            setTags((prev) => [created, ...prev])
            setNewTagName('')
        } catch (err) {
            alert(err.message || 'Error creating tag')
        }
    }

    async function handleDelete() {
        try {
            await deleteTag(deleteConfirmId)
            setTags((prev) => prev.filter((tag) => tag.id !== deleteConfirmId))
            setDeleteConfirmId(null)
        } catch (err) {
            alert(err.message || 'Error deleting tag')
            setDeleteConfirmId(null)
        }
    }

    function startEditing(tag) {
        setEditingId(tag.id)
        setEditName(tag.name)
    }

    function cancelEditing() {
        setEditingId(null)
        setEditName('')
    }

    async function saveEditing(id) {
        if (!editName.trim()) {
            alert('Please enter a tag name')
            return
        }
        try {
            const updated = await updateTag(id, { name: editName })
            setTags((prev) => prev.map((tag) => (tag.id === id ? updated : tag)))
            cancelEditing()
        } catch (err) {
            alert(err.message || 'Error updating tag')
        }
    }

    const filteredTags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gradient-to-r from-emerald-50 via-white to-teal-50 font-sans">
            <div className="min-h-screen flex items-center justify-center py-8 px-4">
                <div className="w-full max-w-4xl mx-auto flex flex-col justify-center">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 tracking-wide drop-shadow-md mb-4">
                            🏷️ Tags Manager
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                        <input
                            type="text"
                            placeholder="Search tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-lg p-3 w-full sm:w-64 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                            aria-label="Search tags"
                        />

                        <div className="text-center sm:text-right">
                            <p className="text-gray-700 font-medium flex items-center gap-2 text-lg justify-center sm:justify-end">
                                Total:{' '}
                                <span className="text-emerald-600 font-bold text-xl bg-emerald-100 px-3 py-1 rounded-full">
                                    {filteredTags.length}
                                </span>{' '}
                                {filteredTags.length === 1 ? 'tag' : 'tags'} 🏷️
                            </p>
                        </div>
                    </div>

                    {!editingId && (
                        <form
                            onSubmit={handleCreateTag}
                            className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/70 rounded-lg p-4 shadow"
                        >
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    placeholder="New tag name"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    className="border border-emerald-300 rounded-lg p-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                                    aria-label="New tag name"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-emerald-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 whitespace-nowrap"
                            >
                                ✨ Create Tag
                            </button>
                        </form>
                    )}

                    {
                        loading && (
                            <div className="text-center py-8">
                                <p className="text-emerald-600 font-semibold text-lg flex items-center justify-center gap-2">
                                    <span className="animate-spin">⏳</span> Loading tags...
                                </p>
                            </div>
                        )
                    }

                    {
                        error && (
                            <div className="text-center mb-6">
                                <p className="text-red-600 font-semibold bg-red-100 p-4 rounded-lg border-red-200">
                                    ❌ {error}
                                </p>
                            </div>
                        )
                    }

                    {
                        !loading && filteredTags.length === 0 && tags.length === 0 && (
                            <div className="text-center py-12">
                                <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
                                    <p className="text-gray-600 text-xl italic mb-2">
                                        🏷️ No tags found. Create your first tag!
                                    </p>
                                </div>
                            </div>
                        )
                    }

                    {
                        !loading && filteredTags.length === 0 && tags.length > 0 && (
                            <div className="text-center py-12">
                                <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
                                    <p className="text-gray-600 text-xl italic mb-2">
                                        🔍 No tags match your search "{searchTerm}"
                                    </p>
                                </div>
                            </div>
                        )
                    }

                    {
                        filteredTags.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTags.map((tag) => (
                                    <div
                                        key={tag.id}
                                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-gray-100 hover:border-emerald-200 transform hover:scale-105"
                                    >
                                        {editingId === tag.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="border border-emerald-300 rounded-md w-full mb-4 p-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                                    aria-label="Edit tag name"
                                                    autoFocus
                                                />
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => saveEditing(tag.id)}
                                                        className="bg-emerald-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-700 transition-colors"
                                                    >
                                                        💾 Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-400 transition-colors"
                                                    >
                                                        ❌ Cancel
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
                                                        🏷️ {tag.name}
                                                    </h3>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        ID: {tag.id}
                                                    </span>
                                                </div>

                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => startEditing(tag)}
                                                        className="text-yellow-600 hover:text-yellow-800 font-semibold transition-colors flex items-center gap-1"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(tag.id)}
                                                        className="text-red-600 hover:text-red-800 font-semibold transition-colors flex items-center gap-1"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    }

                    {
                        deleteConfirmId && (
                            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-lg border-red-300">
                                    <h2 className="text-xl font-bold mb-4 text-red-600">
                                        🗑️ Confirm Deletion
                                    </h2>
                                    <p className="mb-6 text-gray-700">
                                        Are you sure you want to delete this tag? This action cannot be undone.
                                    </p>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => setDeleteConfirmId(null)}
                                            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div >
            </div >
        </div >
    )
}

export default TagsComponent