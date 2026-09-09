const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Project = require('./models/Project');
const Message = require('./models/Message');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolioDB';

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch((err) => {
        console.log('Running in Offline Mode (MongoDB not connected):', err.message);
    });

// Fallback Projects (Agar DB connect na ho to yeh screen pe dikhenge)
const defaultProjects = [
    {
        title: "E-Commerce Web App",
        description: "A full-featured responsive online store with cart and checkout integration.",
        techStack: ["Node.js", "Express", "MongoDB", "CSS"],
        image: "project1.jpg",
        githubUrl: "https://github.com",
        liveUrl: "#"
    },
    {
        title: "Task Management Tool",
        description: "Productivity tracker to organize daily tasks, set deadlines, and monitor progress.",
        techStack: ["JavaScript", "HTML5", "REST APIs"],
        image: "project2.jpg",
        githubUrl: "https://github.com",
        liveUrl: "#"
    },
    {
        title: "Realtime Chat Platform",
        description: "Interactive chat application enabling direct communication between users.",
        techStack: ["WebSockets", "Node.js", "Express"],
        image: "project3.jpg",
        githubUrl: "https://github.com",
        liveUrl: "#"
    }
];

// Routes
// 1. Get Projects Route
app.get('/api/projects', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const projects = await Project.find().sort({ createdAt: -1 });
            if (projects && projects.length > 0) {
                return res.status(200).json(projects);
            }
        }
        return res.status(200).json(defaultProjects);
    } catch (err) {
        return res.status(200).json(defaultProjects);
    }
});

// 2. Contact Route
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (mongoose.connection.readyState === 1) {
            const newMessage = new Message({ name, email, message });
            await newMessage.save();
        } else {
            console.log('Received Message (Offline Mode):', { name, email, message });
        }

        res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Serve frontend for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
});