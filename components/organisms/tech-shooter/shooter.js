import { TECH_DATA, createAsteroidElement, createInventoryItemElement } from '../../moleculs/tech-icon/tech-icon.js';

export class TechShooter {
    constructor() {
        this.area = document.getElementById('shooter-area');
        this.inventoryList = document.getElementById('inventory-list');
        
        this.asteroids = [];
        this.collected = new Set();
        this.barrel = null;
        this.animationFrameId = null;

        if (this.area && this.inventoryList) {
            this.init();
        }
    }

    init() {
        this.area.innerHTML = '';
        this.inventoryList.innerHTML = '';

        this.setupTurret();

        TECH_DATA.forEach(tech => {
            this.spawnAsteroid(tech);
        });

        this.startPhysicsLoop();
        this.area.addEventListener('mousemove', (e) => this.aimTurret(e));
        this.area.addEventListener('click', (e) => this.fireLaser(e));
        this.setupDragAndDrop();
    }

    setupTurret() {
        const base = document.createElement('div');
        base.className = 'cannon-base';
        
        const barrel = document.createElement('div');
        barrel.className = 'cannon-barrel';
        
        this.area.appendChild(base);
        this.area.appendChild(barrel);
        this.barrel = barrel;
    }

    spawnAsteroid(tech, startX = null, startY = null) {
        const el = createAsteroidElement(tech);
        this.area.appendChild(el);

        const rect = this.area.getBoundingClientRect();
        const size = 65; // Width/height of asteroid
        
        const x = startX !== null ? Math.max(0, Math.min(startX - rect.left - size/2, rect.width - size)) : Math.random() * (rect.width - size);
        const y = startY !== null ? Math.max(0, Math.min(startY - rect.top - size/2, rect.height - size - 40)) : Math.random() * (rect.height - size - 80);

        const asteroid = {
            id: tech.id,
            tech: tech,
            el: el,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2, // speed x
            vy: (Math.random() - 0.5) * 2, // speed y
            size: size,
            angle: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 1.5
        };

        this.asteroids.push(asteroid);
        this.updateElementPosition(asteroid);
    }

    updateElementPosition(ast) {
        ast.el.style.left = `${ast.x}px`;
        ast.el.style.top = `${ast.y}px`;
        ast.el.style.transform = `rotate(${ast.angle}deg)`;
    }

    startPhysicsLoop() {
        const update = () => {
            const rect = this.area.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            this.asteroids.forEach(ast => {
                ast.x += ast.vx;
                ast.y += ast.vy;
                ast.angle += ast.rotSpeed;

                // Bounce X boundaries
                if (ast.x <= 0) {
                    ast.x = 0;
                    ast.vx = -ast.vx;
                } else if (ast.x >= width - ast.size) {
                    ast.x = width - ast.size;
                    ast.vx = -ast.vx;
                }

                // Bounce Y boundaries (leave room for turret at bottom)
                if (ast.y <= 0) {
                    ast.y = 0;
                    ast.vy = -ast.vy;
                } else if (ast.y >= height - ast.size - 40) {
                    ast.y = height - ast.size - 40;
                    ast.vy = -ast.vy;
                }

                this.updateElementPosition(ast);
            });

            this.animationFrameId = requestAnimationFrame(update);
        };
        this.animationFrameId = requestAnimationFrame(update);
    }

    aimTurret(e) {
        if (!this.barrel) return;
        const rect = this.area.getBoundingClientRect();
        
        const pivotX = rect.left + rect.width / 2;
        const pivotY = rect.top + rect.height;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const angleRad = Math.atan2(mouseX - pivotX, pivotY - mouseY);
        let angleDeg = angleRad * (180 / Math.PI);
        
        angleDeg = Math.max(-75, Math.min(75, angleDeg));

        this.barrel.style.transform = `rotate(${angleDeg}deg)`;
    }

    fireLaser(e) {
        if (e.target.closest('.tech-asteroid')) return;

        const rect = this.area.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const startX = rect.width / 2;
        const startY = rect.height;

        const beam = document.createElement('div');
        beam.className = 'laser-beam';
        
        const dx = clickX - startX;
        const dy = clickY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dx, -dy) * (180 / Math.PI);

        beam.style.height = `${length}px`;
        beam.style.left = `${startX - 1.5}px`; // center beam
        beam.style.bottom = '0px';
        beam.style.transform = `rotate(${angle}deg)`;

        this.area.appendChild(beam);
        setTimeout(() => beam.remove(), 200);

        let hitIndex = -1;
        for (let i = 0; i < this.asteroids.length; i++) {
            const ast = this.asteroids[i];
            const centerX = ast.x + ast.size / 2;
            const centerY = ast.y + ast.size / 2;
            const radius = ast.size / 2;

            const dist = Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2);
            if (dist <= radius) {
                hitIndex = i;
                break;
            }
        }

        if (hitIndex !== -1) {
            const hitAsteroid = this.asteroids[hitIndex];
            this.explodeAsteroid(hitAsteroid);
            this.collectTech(hitAsteroid.tech);
            
            hitAsteroid.el.remove();
            this.asteroids.splice(hitIndex, 1);
        }
    }

    explodeAsteroid(ast) {
        const particleCount = 15;
        const container = this.area;
        const centerX = ast.x + ast.size / 2;
        const centerY = ast.y + ast.size / 2;

        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.width = `${Math.random() * 6 + 3}px`;
            p.style.height = p.style.width;
            p.style.background = ast.tech.color;
            p.style.boxShadow = `0 0 8px ${ast.tech.color}`;
            p.style.left = `${centerX}px`;
            p.style.top = `${centerY}px`;

            container.appendChild(p);

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            let opacity = 1;
            const updateParticle = () => {
                const px = parseFloat(p.style.left) + vx;
                const py = parseFloat(p.style.top) + vy;
                opacity -= 0.03;

                p.style.left = `${px}px`;
                p.style.top = `${py}px`;
                p.style.opacity = opacity;

                if (opacity <= 0) {
                    p.remove();
                } else {
                    requestAnimationFrame(updateParticle);
                }
            };
            requestAnimationFrame(updateParticle);
        }
    }

    collectTech(tech) {
        if (this.collected.has(tech.id)) return;
        this.collected.add(tech.id);

        const el = createInventoryItemElement(tech, (id) => this.releaseTech(id));
        
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', tech.id);
            e.dataTransfer.effectAllowed = 'move';
        });

        this.inventoryList.appendChild(el);
    }

    releaseTech(techId) {
        if (!this.collected.has(techId)) return;
        this.collected.delete(techId);

        const itemEl = document.getElementById(`inventory-${techId}`);
        if (itemEl) itemEl.remove();

        const tech = TECH_DATA.find(t => t.id === techId);
        if (tech) {
            this.spawnAsteroid(tech);
        }
    }

    setupDragAndDrop() {
        this.area.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.area.classList.add('drag-over');
        });

        this.area.addEventListener('dragleave', () => {
            this.area.classList.remove('drag-over');
        });

        this.area.addEventListener('drop', (e) => {
            e.preventDefault();
            this.area.classList.remove('drag-over');
            
            const techId = e.dataTransfer.getData('text/plain');
            if (techId && this.collected.has(techId)) {
                this.collected.delete(techId);
                const itemEl = document.getElementById(`inventory-${techId}`);
                if (itemEl) itemEl.remove();

                const tech = TECH_DATA.find(t => t.id === techId);
                if (tech) {
                    this.spawnAsteroid(tech, e.clientX, e.clientY);
                }
            }
        });
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}
