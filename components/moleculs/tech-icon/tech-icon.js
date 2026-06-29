export const TECH_DATA = [
    { id: 'html', name: 'HTML5', icon: 'devicon-html5-plain', color: '#e34f26', rgb: '227, 79, 38' },
    { id: 'css', name: 'CSS3', icon: 'devicon-css3-plain', color: '#1572b6', rgb: '21, 114, 182' },
    { id: 'js', name: 'JavaScript', icon: 'devicon-javascript-plain', color: '#f7df1e', rgb: '247, 223, 30' },
    { id: 'vue', name: 'Vue.js', icon: 'devicon-vuejs-plain', color: '#4fc08d', rgb: '79, 192, 141' },
    { id: 'laravel', name: 'Laravel', icon: 'devicon-laravel-original', color: '#ff2d20', rgb: '255, 45, 32' },
    { id: 'rust', name: 'Rust', icon: 'devicon-rust-line', color: '#e05d44', rgb: '224, 93, 68' },
    { id: 'go', name: 'Go (Golang)', icon: 'devicon-go-original-wordmark', color: '#00add8', rgb: '0, 173, 216' },
    { id: 'sql', name: 'PostgreSQL', icon: 'devicon-postgresql-plain', color: '#336791', rgb: '51, 103, 145' },
    { id: 'git', name: 'Git', icon: 'devicon-git-plain', color: '#f05032', rgb: '240, 80, 50' },
    { id: 'linux', name: 'Linux', icon: 'devicon-linux-plain', color: '#f8b739', rgb: '248, 183, 57' },
    { id: 'docker', name: 'Docker', icon: 'devicon-docker-plain', color: '#2496ed', rgb: '36, 150, 237' }
];

export function createAsteroidElement(tech) {
    const div = document.createElement('div');
    div.className = 'tech-asteroid';
    div.id = `asteroid-${tech.id}`;
    div.dataset.id = tech.id;
    div.style.setProperty('--theme-color', tech.color);
    div.style.setProperty('--theme-color-rgb', tech.rgb);

    const i = document.createElement('i');
    i.className = tech.icon;
    div.appendChild(i);

    return div;
}

export function createInventoryItemElement(tech, onRelease) {
    const li = document.createElement('li');
    li.className = 'inventory-item';
    li.id = `inventory-${tech.id}`;
    li.dataset.id = tech.id;
    li.style.setProperty('--theme-color', tech.color);
    li.style.setProperty('--theme-color-rgb', tech.rgb);
    li.setAttribute('draggable', 'true');

    const i = document.createElement('i');
    i.className = tech.icon;
    li.appendChild(i);

    const span = document.createElement('span');
    span.textContent = tech.name;
    li.appendChild(span);

    const btn = document.createElement('button');
    btn.className = 'release-btn';
    btn.innerHTML = '⏏'; // eject/release icon
    btn.title = 'Kembalikan melayang';
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onRelease(tech.id);
    });
    li.appendChild(btn);

    return li;
}
