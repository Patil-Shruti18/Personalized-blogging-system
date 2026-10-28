// server.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
app.use(express.json());

// ✅ Serve static files from 'public'
app.use(express.static(path.join(__dirname, "public")));

// ✅ Ensure uploads folder exists
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
//mongod --port 27018 --dbpath "C:\data\db" (use it to run mongodb)

// ✅ MongoDB Connection
mongoose
    .connect("mongodb://127.0.0.1:27018/blogDB")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Blog Schema
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    bannerImage: { type: String, default: "" },
    publishedAt: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

// ✅ Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ✅ Routes

// Serve homepage (home.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Serve blog page
app.get("/blog", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "blog.html"));
});

// Serve editor page
app.get("/editor", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "editor.html"));
});

// Upload image
app.post("/upload", upload.single("image"), (req, res) => {
    res.json({ filePath: `uploads/${req.file.filename}` });
});

// UPDATE blog
app.put("/api/blogs/:id", async(req, res) => {
    try {
        const updated = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true } // return the updated document
        );
        if (!updated) return res.status(404).json({ error: "Blog not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE blog
app.delete("/api/blogs/:id", async(req, res) => {
    try {
        const deleted = await Blog.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Blog not found" });
        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all blogs
app.get("/api/blogs", async(req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

// Get one blog
app.get("/api/blogs/:id", async(req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(400).json({ error: "Invalid blog ID" });
    }
});

// Create a blog
app.post("/api/blogs", async(req, res) => {
    try {
        const newBlog = new Blog(req.body);
        await newBlog.save();
        res.json(newBlog);
    } catch (err) {
        res.status(400).json({ error: "Failed to save blog" });
    }
});

// Catch-all for undefined routes
app.use((req, res) => {
    res.status(404).send("❌ Route not found");
});


// Catch-all for undefined routes
app.use((req, res) => {
    res.status(404).send("Route not found");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});