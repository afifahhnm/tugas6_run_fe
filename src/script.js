const API_URL = "http://localhost:5000"; // Sesuaikan dengan backend

// Ambil semua catatan dari backend dan tampilkan
async function fetchNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`);
        const notes = await response.json();
        const noteList = document.getElementById("noteList");
        noteList.innerHTML = "";  

        notes.forEach(note => {
            const li = document.createElement("li");
            li.className = "note-item";

            li.innerHTML = `
                <span class="note-text"><b>${note.nama}</b>: ${note.catatan}</span>
                <div class="button-container">
                    <button class="edit-btn" onclick="editNote(${note.id})">✏️ Edit</button>
                    <button class="delete-btn" onclick="deleteNote(${note.id})">🗑️ Hapus</button>
                </div>
            `;

            noteList.appendChild(li);
        });

    } catch (error) {
        console.error("Error fetching notes:", error);
    }
}

// Tambah catatan baru
async function addNote() {
    const nameInput = document.getElementById("nameInput").value.trim();
    const noteInput = document.getElementById("noteInput").value.trim();

    if (!nameInput || !noteInput) {
        alert("⚠️ Harap isi semua kolom!");
        return;
    }

    try {
        await fetch(`${API_URL}/add-note`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama: nameInput, catatan: noteInput })
        });

        document.getElementById("nameInput").value = "";
        document.getElementById("noteInput").value = "";

        fetchNotes(); // Refresh daftar catatan
    } catch (error) {
        console.error("Error adding note:", error);
    }
}

// Edit catatan
async function editNote(id) {
    const newName = prompt("📝 Masukkan nama baru:");
    const newNote = prompt("✏️ Masukkan catatan baru:");

    if (!newName || !newNote) return;

    try {
        await fetch(`${API_URL}/notes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama: newName, catatan: newNote }),
        });

        fetchNotes();
    } catch (error) {
        console.error("Error editing note:", error);
    }
}

// Hapus catatan
async function deleteNote(id) {
    if (!confirm("⚠️ Yakin ingin menghapus catatan ini?")) return;

    try {
        await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });

        fetchNotes();
    } catch (error) {
        console.error("Error deleting note:", error);
    }
}

// Load catatan saat halaman pertama kali dibuka
fetchNotes();