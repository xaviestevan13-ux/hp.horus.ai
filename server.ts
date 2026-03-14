import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("hp_care.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    country TEXT,
    role TEXT DEFAULT 'user'
  );
`);

// Ensure columns exist if table was created before they were added
try { db.exec("ALTER TABLE users ADD COLUMN country TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'"); } catch (e) {}
try { db.exec("ALTER TABLE inspections ADD COLUMN inspection_type TEXT DEFAULT 'laptop'"); } catch (e) {}

db.exec(`
  CREATE TABLE IF NOT EXISTS inspections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    model TEXT NOT NULL,
    inspection_type TEXT DEFAULT 'laptop',
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    results TEXT NOT NULL,
    summary TEXT NOT NULL,
    overall_health TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inspection_id INTEGER NOT NULL,
    user_id INTEGER,
    is_correct BOOLEAN NOT NULL,
    comment TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inspection_id) REFERENCES inspections (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Routes
  app.post("/api/auth/signup", async (req, res) => {
    const { email, password, name, country } = req.body;
    const role = (email.endsWith('@hp.com') || email === 'roger.torrents@estudiantat.upc.edu') ? 'technician' : 'user';
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO users (email, password, name, country, role) VALUES (?, ?, ?, ?, ?)");
      const result = stmt.run(email, hashedPassword, name, country, role);
      res.json({ id: result.lastInsertRowid, email, name, country, role });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as { id: number, email: string, password: string, name: string, country: string, role: string } | undefined;
    
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ id: user.id, email: user.email, name: user.name, country: user.country, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Inspection Routes
  app.post("/api/inspections", (req, res) => {
    const { user_id, model, results, summary, overall_health, inspection_type } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO inspections (user_id, model, results, summary, overall_health, inspection_type) VALUES (?, ?, ?, ?, ?, ?)");
      const result = stmt.run(user_id, model, JSON.stringify(results), summary, overall_health, inspection_type || 'laptop');
      res.json({ id: result.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/inspections/:userId", (req, res) => {
    const { userId } = req.params;
    const inspections = db.prepare("SELECT * FROM inspections WHERE user_id = ? ORDER BY date DESC").all(userId);
    res.json(inspections.map((i: any) => ({ ...i, results: JSON.parse(i.results) })));
  });

  // Technician Stats Route
  app.get("/api/technician/stats", (req, res) => {
    try {
      const stats = db.prepare(`
        SELECT i.model, i.results, u.country
        FROM inspections i
        LEFT JOIN users u ON i.user_id = u.id
        WHERE i.inspection_type = 'laptop'
      `).all();
      
      const processedStats = stats.map((s: any) => ({
        ...s,
        results: JSON.parse(s.results)
      }));
      
      res.json(processedStats);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Feedback Routes
  app.post("/api/feedback", (req, res) => {
    const { inspection_id, user_id, is_correct, comment } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO feedback (inspection_id, user_id, is_correct, comment) VALUES (?, ?, ?, ?)");
      const result = stmt.run(inspection_id, user_id, is_correct ? 1 : 0, comment);
      res.json({ id: result.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/feedback/recent", (req, res) => {
    try {
      const feedback = db.prepare(`
        SELECT f.*, i.model, i.results, i.summary 
        FROM feedback f 
        JOIN inspections i ON f.inspection_id = i.id 
        ORDER BY f.date DESC 
        LIMIT 10
      `).all();
      res.json(feedback);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
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
