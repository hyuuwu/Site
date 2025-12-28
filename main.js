document.addEventListener('DOMContentLoaded', () => {
    const lines = [
        { id: 'greeting', text: 'Hello, World!', delay: 500 },
        { id: 'intro', text: '> I am a Full Stack Developer & Creative Coder.', delay: 1500 },
        { id: 'loading', text: 'Loading bio...', delay: 3000 }
    ];

    // Simple typing effect can be expanded here
    // For now, we utilize CSS animations and class toggling for the "terminal flow"

    // We will progressively reveal sections to simulate "loading" or "rendering"
    const sections = document.querySelectorAll('section');

    // Initial delay for the first section
    setTimeout(() => {
        document.getElementById('hero').style.opacity = '1';
    }, 500);

    // Staggered reveal for other sections
    let delay = 2000;
    sections.forEach((section, index) => {
        if (section.id === 'hero') return;

        setTimeout(() => {
            section.style.opacity = '1';
            // Scroll to bottom if needed, or keep top
        }, delay);
        delay += 1000; // 1 second between sections
    });


    // Custom Cursor Logic
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.classList.add('active');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('active');
    });

    // Hover effects for links
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });

    // Glitch Effect (Every 15s)
    setInterval(() => {
        const container = document.querySelector('.terminal-container');
        console.log("Glitch triggered!");
        container.classList.add('glitch-active');

        // Remove after a burst (1s)
        setTimeout(() => {
            container.classList.remove('glitch-active');
        }, 1000);
    }, 15000);
});

// Optional: Add a real character-by-character typing function if requested
// For now, simple fade-ins with CSS are cleaner and faster for the user to read
