import { useEffect, useState } from 'react'
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from './api'

function CategoriesComponent() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [deleteConfirmId, setDeleteConfirmId] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadCategories()
    }, [])

    async function loadCategories() {
        setLoading(true)
        try {
            const data = await fetchCategories()
            setCategories(data)
            setError(null)
        } catch (err) {
            setError(err.message || 'Error loading categories')
        } finally {
            setLoading(false)
        }
    }

    async function handleCreateCategory(e) {
        e.preventDefault()
        if (!newCategoryName.trim()) {
            alert('Please enter a category name')
            return
        }
        try {
            const created = await createCategory({ name: newCategoryName })
            setCategories((prev) => [created, ...prev])
            setNewCategoryName('')
        } catch (err) {
            alert(err.message || 'Error creating category')
        }
    }

    async function handleDelete() {
        try {
            await deleteCategory(deleteConfirmId)
            setCategories((prev) => prev.filter((category) => category.id !== deleteConfirmId))
            setDeleteConfirmId(null)
        } catch (err) {
            alert(err.message || 'Error deleting category')
            setDeleteConfirmId(null)
        }
    }

    function startEditing(category) {
        setEditingId(category.id)
        setEditName(category.name)
    }

    function cancelEditing() {
        setEditingId(null)
        setEditName('')
    }

    async function saveEditing(id) {
        if (!editName.trim()) {
            alert('Please enter a category name')
            return
        }
        try {
            const updated = await updateCategory(id, { name: editName })
            setCategories((prev) => prev.map((category) => (category.id === id ? updated : category)))
            cancelEditing()
        } catch (err) {
            alert(err.message || 'Error updating category')
        }
    }

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-indigo-50 font-sans">
            <div className="min-h-screen flex items-center justify-center py-8 px-4">
                <div className="w-full max-w-4xl mx-auto flex flex-col justify-center">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 tracking-wide drop-shadow-md mb-4">
                            📂 Categories Manager
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-lg p-3 w-full sm:w-64 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                            aria-label="Search categories"
                        />

                        <div className="text-center sm:text-right">
                            <p className="text-gray-700 font-medium flex items-center gap-2 text-lg justify-center sm:justify-end">
                                Total:{' '}
                                <span className="text-blue-600 font-bold text-xl bg-blue-100 px-3 py-1 rounded-full">
                                    {filteredCategories.length}
                                </span>{' '}
                                {filteredCategories.length === 1 ? 'category' : 'categories'} 📂
                            </p>
                        </div>
                    </div>

                    {!editingId && (
                        <div className="mb-8">
                            <div className="bg-white rounded-xl p-6 shadow-lg border-blue-100">
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label htmlFor="categoryName" className="block text-gray-700 font-semibold mb-2">
                                            New Category Name
                                        </label>
                                        <input
                                            id="categoryName"
                                            type="text"
                                            placeholder="Enter category name..."
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory(e)}
                                            className="border border-gray-300 rounded-lg p-4 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={handleCreateCategory}
                                        className="bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 whitespace-nowrap"
                                    >
                                        ✨ Create Category
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-8">
                            <p className="text-blue-600 font-semibold text-lg flex items-center justify-center gap-2">
                                <span className="animate-spin">⏳</span> Loading categories...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center mb-6">
                            <p className="text-red-600 font-semibold bg-red-100 p-4 rounded-lg border-red-200">
                                ❌ {error}
                            </p>
                        </div>
                    )}

                    {!loading && filteredCategories.length === 0 && categories.length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
                                <p className="text-gray-600 text-xl italic mb-2">
                                    📂 No categories found. Create your first category!
                                </p>
                            </div>
                        </div>
                    )}

                    {!loading && filteredCategories.length === 0 && categories.length > 0 && (
                        <div className="text-center py-12">
                            <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
                                <p className="text-gray-600 text-xl italic mb-2">
                                    🔍 No categories match your search "{searchTerm}"
                                </p>
                            </div>
                        </div>
                    )}

                    {filteredCategories.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-gray-100 hover:border-blue-200 transform hover:scale-105"
                                >
                                    {editingId === category.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="border border-blue-300 rounded-md w-full mb-4 p-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                aria-label="Edit category name"
                                                autoFocus
                                            />
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => saveEditing(category.id)}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
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
                                                <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                                                    📂 {category.name}
                                                </h3>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                    ID: {category.id}
                                                </span>
                                            </div>

                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => startEditing(category)}
                                                    className="text-yellow-600 hover:text-yellow-800 font-semibold transition-colors flex items-center gap-1"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(category.id)}
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
                    )}

                    {deleteConfirmId && (
                        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-lg border-red-300">
                                <h2 className="text-xl font-bold mb-4 text-red-600">
                                    🗑️ Confirm Deletion
                                </h2>
                                <p className="mb-6 text-gray-700">
                                    Are you sure you want to delete this category? This action cannot be undone.
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
                    )}

                </div>
            </div>
        </div>
    )
}

export default CategoriesComponent