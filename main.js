document.addEventListener('DOMContentLoaded', () => {
    const lines = [
        { id: 'greeting', text: 'hello', delay: 500 },
        { id: 'intro', text: 'i am hyu', delay: 1500 },
        { id: 'loading', text: 'yo pc is very slow like damnnn', delay: 3000 }
    ];

    const sections = document.querySelectorAll('section');

    setTimeout(() => {
        document.getElementById('hero').style.opacity = '1';
    }, 500);

    let delay = 2000;
    sections.forEach((section, index) => {
        if (section.id === 'hero') return;

        setTimeout(() => {
            section.style.opacity = '1';
        }, delay);
        delay += 1000;
    });

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

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });

    setInterval(() => {
        const container = document.querySelector('.terminal-container');
        console.log("Glitch triggered!");
        container.classList.add('glitch-active');

        setTimeout(() => {
            container.classList.remove('glitch-active');
        }, 1000);
    }, 15000);
});
