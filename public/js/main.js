// Load Projects dynamically from the Backend API
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

async function fetchProjects() {
    const container = document.getElementById('projects-container');

    try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const projects = await response.json();

        if (projects.length === 0) {
            container.innerHTML = '<p>No projects found in database.</p>';
            return;
        }

        container.innerHTML = projects.map(project => `
            <div class="project-card">
                <img src="images/${project.image}" alt="${project.title}" class="project-img" onerror="this.src='images/project1.jpg'">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tech-tags">
                        ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.githubUrl}" target="_blank">GitHub &rarr;</a>
                        <a href="${project.liveUrl}" target="_blank">Live Demo &rarr;</a>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error fetching projects:', error);
        container.innerHTML = '<p style="color: #ef4444;">Failed to load projects from the database.</p>';
    }
}

// Handle Contact Form Submission
async function handleContactSubmit(e) {
    e.preventDefault();

    const feedback = document.getElementById('form-feedback');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    feedback.style.color = '#94a3b8';
    feedback.innerText = 'Sending message...';

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok) {
            feedback.style.color = '#22c55e';
            feedback.innerText = 'Thank you! Your message was saved successfully.';
            document.getElementById('contact-form').reset();
        } else {
            feedback.style.color = '#ef4444';
            feedback.innerText = data.error || 'Something went wrong. Please try again.';
        }
    } catch (error) {
        console.error('Error sending message:', error);
        feedback.style.color = '#ef4444';
        feedback.innerText = 'Server error. Please try again later.';
    }
}