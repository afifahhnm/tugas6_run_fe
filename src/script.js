// ✅ HARUS paling atas sebelum digunakan di bawah
const token = localStorage.getItem('token');

// ✅ Redirect ke login jika belum login
if (
  !token &&
  (window.location.pathname.includes('index.html') ||
    window.location.pathname === '/' ||
    window.location.pathname.endsWith('/'))
) {
  window.location.href = 'login.html';
}

// Ganti sesuai dengan backend kamu (localhost atau URL deployment)
const API_URL = "http://localhost:5000";

// ✅ Ambil semua catatan
async function fetchNotes() {
  try {
    const response = await fetch(`${API_URL}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      alert("Sesi login Anda telah habis. Silakan login kembali.");
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      return;
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const notes = await response.json();
    const noteList = document.getElementById("noteList");
    noteList.innerHTML = "";

    notes.forEach((note) => {
      const li = document.createElement("li");
      li.className = "note-item";
      li.innerHTML = `
        <span class="note-text"><b>${note.judul}</b>: ${note.konten}</span>
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

// ✅ Tambah catatan
async function addNote() {
  const nameInput = document.getElementById("nameInput").value.trim();
  const noteInput = document.getElementById("noteInput").value.trim();

  if (!nameInput || !noteInput) {
    alert("⚠️ Harap isi semua kolom!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ judul: nameInput, konten: noteInput }),
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      return;
    }

    // Bersihkan form input
    document.getElementById("nameInput").value = "";
    document.getElementById("noteInput").value = "";

    // Refresh list catatan
    fetchNotes();
  } catch (error) {
    console.error("Error adding note:", error);
  }
}

// ✅ Edit catatan
async function editNote(id) {
  const newName = prompt("📝 Masukkan judul baru:");
  const newNote = prompt("✏️ Masukkan konten baru:");

  if (!newName || !newNote) return;

  try {
    await fetch(`${API_URL}/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ judul: newName, konten: newNote }),
    });

    fetchNotes();
  } catch (error) {
    console.error("Error editing note:", error);
  }
}

// ✅ Hapus catatan
async function deleteNote(id) {
  if (!confirm("⚠️ Yakin ingin menghapus catatan ini?")) return;

  try {
    await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchNotes();
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

// tombol logout 
window.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.style.position = "fixed";
  logoutBtn.style.top = "24px";
  logoutBtn.style.right = "32px";
  logoutBtn.style.padding = "10px 18px";
  logoutBtn.style.backgroundColor = "#e23636";
  logoutBtn.style.color = "#fff";
  logoutBtn.style.border = "none";
  logoutBtn.style.borderRadius = "8px";
  logoutBtn.style.fontWeight = "bold";
  logoutBtn.style.fontSize = "16px";
  logoutBtn.style.cursor = "pointer";
  logoutBtn.style.zIndex = "1000";
  logoutBtn.onmouseover = () => logoutBtn.style.backgroundColor = "#c01c1c";
  logoutBtn.onmouseout = () => logoutBtn.style.backgroundColor = "#e23636";
  logoutBtn.onclick = function() {
    if (confirm("Yakin ingin logout?")) {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    }
  };
  document.body.appendChild(logoutBtn);
});


fetchNotes();
