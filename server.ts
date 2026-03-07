import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("pala.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    lawyer_id INTEGER,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    type TEXT DEFAULT 'free',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
      const result = stmt.run(name, email, password);
      res.json({ success: true, userId: result.lastInsertRowid });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  app.get("/api/lawyers", (req, res) => {
    // Mock lawyers data
    const lawyers = [
      { id: 1, name: "Budi Santoso, S.H.", specialty: "Hukum Pidana", rating: 4.8, image: "https://i.pravatar.cc/150?u=1" },
      { id: 2, name: "Siti Aminah, S.H., M.H.", specialty: "Hukum Perdata", rating: 4.9, image: "https://i.pravatar.cc/150?u=2" },
      { id: 3, name: "Andi Wijaya, S.H.", specialty: "Hukum Keluarga", rating: 4.7, image: "https://i.pravatar.cc/150?u=3" },
    ];
    res.json(lawyers);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
