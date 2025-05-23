const API_BASE_URL = 'https://notes-app-backend-production-1e2f.up.railway.app'; // URL backend API

// === Notas ===

export async function fetchNotes({ archived = false, title = '', tagId = '' } = {}) {
    let url = `${API_BASE_URL}/notes`;

    const queryParams = new URLSearchParams();
    if (title) queryParams.append('q', title);
    if (tagId) queryParams.append('tagId', tagId);
    queryParams.append('archived', archived); // ← AÑADIR ESTO

    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Error fetching notes');
    return res.json();
}


// Notas activas (sin filtros)
export async function fetchActiveNotes() {
    const res = await fetch(`${API_BASE_URL}/notes/active`);
    if (!res.ok) throw new Error('Error fetching active notes');
    return res.json();
}

export async function createNote(data) {
    const res = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creating note');
    return res.json();
}

export async function updateNote(id, data) {
    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error updating note');
    return res.json();
}

export async function archiveNote(id) {
    const res = await fetch(`${API_BASE_URL}/notes/${id}/archive`, {
        method: 'PATCH',
    });
    if (!res.ok) throw new Error('Error archiving note');
    return res.json();
}

export async function unarchiveNote(id) {
    const res = await fetch(`${API_BASE_URL}/notes/${id}/unarchive`, {
        method: 'PATCH',
    });
    if (!res.ok) throw new Error('Error unarchiving note');
    return res.json();
}

export async function deleteNote(id) {
    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error deleting note');
    return res.json();
}

// Tags

export async function createTag(data) {
    const res = await fetch(`${API_BASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creating tag');
    return res.json();
}

export async function updateTag(id, data) {
    const res = await fetch(`${API_BASE_URL}/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error updating tag');
    return res.json();
}

export async function deleteTag(id) {
    const res = await fetch(`${API_BASE_URL}/tags/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error deleting tag');
    return res.json();
}

// Categories

export async function fetchCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Error fetching categories');
    return res.json();
}

export async function createCategory(data) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creating category');
    return res.json();
}

export async function updateCategory(id, data) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error updating category');
    return res.json();
}

export async function deleteCategory(id) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error deleting category');
    return res.json();
}

export async function fetchCategory(id) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!res.ok) throw new Error('Error fetching category');
    return res.json();
}
