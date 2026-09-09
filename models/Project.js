const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    techStack: [String],
    image: {
        type: String,
        default: 'project1.jpg'
    },
    githubUrl: {
        type: String,
        default: '#'
    },
    liveUrl: {
        type: String,
        default: '#'
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);