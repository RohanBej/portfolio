/* =========================================
   Rohan Bej — Portfolio JavaScript
   Interactivity, Canvas Hero, Filters
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

    // ── Theme Toggle ──
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('rb-theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('rb-theme', next);
    });


    // ── Mobile Nav Toggle ──
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on nav link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // ── Scroll Progress Bar ──
    const scrollProgress = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
        navbar.classList.toggle('scrolled', scrollTop > 50);
    }, { passive: true });

    // ── Active Nav Section Highlight ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(section => observerNav.observe(section));

    // ── Scroll Fade-In Animations ──
    const animateElements = document.querySelectorAll('.animate-in');
    const observerAnim = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    animateElements.forEach(el => observerAnim.observe(el));

    // Make hero content visible immediately
    document.querySelectorAll('.hero .animate-in').forEach(el => el.classList.add('visible'));

    // ── Skills Filter ──
    const skillFilters = document.querySelectorAll('.skills-filter .filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    skillFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            skillFilters.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            const filter = btn.dataset.filter;
            skillCards.forEach(card => {
                card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
            });
        });
    });

    // ── Project Filters ──
    const projectFilters = document.querySelectorAll('.project-filters .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    projectFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            projectFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.pfilter;
            projectCards.forEach(card => {
                const tags = card.dataset.tags || '';
                card.classList.toggle('hidden', filter !== 'all' && !tags.includes(filter));
            });
        });
    });

    // ── Expandable Project Details ──
    document.querySelectorAll('.project-detail-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.project-card');
            const isExpanded = card.classList.toggle('expanded');
            btn.textContent = isExpanded ? 'Hide Details' : 'View Details';
        });
    });

    // ── Contact Form (visual only) ──
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Message Sent! ✓';
            btn.disabled = true;
            btn.style.background = 'var(--accent4, #4ade80)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ── Smooth Scroll for anchors ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Hero Canvas — Vibrant Hand-Drawn Color-Pencil Visualization ──
    // roundRect polyfill for older browsers
    if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
            if (typeof r === 'number') r = [r, r, r, r];
            const [tl, tr, br, bl] = r;
            this.moveTo(x + tl, y);
            this.lineTo(x + w - tr, y);
            this.quadraticCurveTo(x + w, y, x + w, y + tr);
            this.lineTo(x + w, y + h - br);
            this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
            this.lineTo(x + bl, y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - bl);
            this.lineTo(x, y + tl);
            this.quadraticCurveTo(x, y, x + tl, y);
            this.closePath();
            return this;
        };
    }

    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, dpr;
        let mouse = { x: -1000, y: -1000 };
        let time = 0;

        // Vibrant color palette — color-pencil style
        const pencilColors = [
            '#f0925a', '#e06b8f', '#6ec2f7', '#a78bfa',
            '#4ade80', '#fbbf24', '#f472b6', '#34d399',
            '#fb923c', '#818cf8', '#22d3ee', '#facc15',
            '#c084fc', '#f87171', '#38bdf8', '#a3e635'
        ];

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            dpr = window.devicePixelRatio || 1;
            W = rect.width;
            H = rect.height;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        // Floating doodles with hand-drawn style
        const codeSnippets = [
            'Creative!', 'Design', 'Idea', 'Wow!',
            'Build', 'Sketch', 'Creative', 'Develop',
            'Hello!', 'Art', 'Code', 'Doodle',
            'Fun', 'Joy', 'Dream', 'Play',
        ];

        class SketchElement {
            constructor() {
                this.x = Math.random() * 800;
                this.y = Math.random() * 500;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
                this.color = pencilColors[Math.floor(Math.random() * pencilColors.length)];
                this.borderColor = pencilColors[Math.floor(Math.random() * pencilColors.length)];
                // hand-drawn misalignment
                this.skewX = (Math.random() - 0.5) * 4;
                this.skewY = (Math.random() - 0.5) * 3;
                this.rotation = (Math.random() - 0.5) * 0.12; // slight tilt
                this.size = 11 + Math.random() * 3;
                this.opacity = 0.5 + Math.random() * 0.4;
                // multiple border offsets for color-pencil look
                this.borderOffsets = [];
                const borderCount = 2 + Math.floor(Math.random() * 2); // 2-3 borders
                for (let i = 0; i < borderCount; i++) {
                    this.borderOffsets.push({
                        dx: (Math.random() - 0.5) * 3,
                        dy: (Math.random() - 0.5) * 3,
                        color: pencilColors[Math.floor(Math.random() * pencilColors.length)],
                        width: 1 + Math.random() * 1.5
                    });
                }
                this.wobblePhase = Math.random() * Math.PI * 2;
                this.wobbleSpeed = 0.3 + Math.random() * 0.5;
            }

            update(t) {
                this.x += this.vx;
                this.y += this.vy;
                // Subtle wobble
                this.x += Math.sin(t * this.wobbleSpeed + this.wobblePhase) * 0.15;
                this.y += Math.cos(t * this.wobbleSpeed * 0.7 + this.wobblePhase) * 0.1;

                // Mouse repulsion
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120 * 0.8;
                    this.x += (dx / dist) * force;
                    this.y += (dy / dist) * force;
                }

                // Wrap around
                if (this.x < -80) this.x = W + 40;
                if (this.x > W + 80) this.x = -40;
                if (this.y < -40) this.y = H + 20;
                if (this.y > H + 40) this.y = -20;
            }

            draw(ctx, t) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation + Math.sin(t * 0.5 + this.wobblePhase) * 0.03);
                ctx.globalAlpha = this.opacity;
                ctx.font = `700 ${this.size * 1.5}px 'Kalam', cursive`;
                const textW = ctx.measureText(this.text).width;
                const boxX = -textW / 2 - 10;
                const boxY = -12;
                const boxW = textW + 20;
                const boxH = 26;

                // Draw multiple sketchy borders (color-pencil misaligned look)
                this.borderOffsets.forEach(border => {
                    ctx.strokeStyle = border.color;
                    ctx.lineWidth = border.width;
                    ctx.lineJoin = 'round';
                    ctx.globalAlpha = this.opacity * 0.45;
                    ctx.beginPath();
                    // Draw slightly wobbly rectangles for hand-drawn look
                    const wo = 1.5; // wobble amount
                    ctx.moveTo(boxX + border.dx + (Math.random() - 0.5) * wo, boxY + border.dy + (Math.random() - 0.5) * wo);
                    ctx.lineTo(boxX + boxW + border.dx + (Math.random() - 0.5) * wo, boxY + border.dy + (Math.random() - 0.5) * wo);
                    ctx.lineTo(boxX + boxW + border.dx + (Math.random() - 0.5) * wo, boxY + boxH + border.dy + (Math.random() - 0.5) * wo);
                    ctx.lineTo(boxX + border.dx + (Math.random() - 0.5) * wo, boxY + boxH + border.dy + (Math.random() - 0.5) * wo);
                    ctx.closePath();
                    ctx.stroke();
                });

                // Fill background with subtle tinted color
                ctx.globalAlpha = this.opacity * 0.1;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.roundRect(boxX, boxY, boxW, boxH, 4);
                ctx.fill();

                // Draw text
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text, 0, 2);

                ctx.restore();
            }
        }

        // Floating colored nodes (dots with pencil halos)
        class SketchNode {
            constructor() {
                this.x = Math.random() * 800;
                this.y = Math.random() * 500;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = 3 + Math.random() * 5;
                this.color = pencilColors[Math.floor(Math.random() * pencilColors.length)];
                this.haloColors = [];
                const haloCount = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < haloCount; i++) {
                    this.haloColors.push({
                        color: pencilColors[Math.floor(Math.random() * pencilColors.length)],
                        offset: this.radius + 3 + i * 3 + (Math.random() - 0.5) * 2,
                        width: 1 + Math.random() * 1.2
                    });
                }
                this.wobblePhase = Math.random() * Math.PI * 2;
            }

            update(t) {
                this.x += this.vx + Math.sin(t * 0.4 + this.wobblePhase) * 0.1;
                this.y += this.vy + Math.cos(t * 0.3 + this.wobblePhase) * 0.08;

                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    const force = (100 - dist) / 100 * 0.5;
                    this.x += (dx / dist) * force;
                    this.y += (dy / dist) * force;
                }

                if (this.x < -20) this.x = W + 10;
                if (this.x > W + 20) this.x = -10;
                if (this.y < -20) this.y = H + 10;
                if (this.y > H + 20) this.y = -10;
            }

            draw(ctx, t) {
                ctx.save();

                // Draw multiple colored halos (misaligned pencil circles)
                this.haloColors.forEach((halo, i) => {
                    ctx.strokeStyle = halo.color;
                    ctx.lineWidth = halo.width;
                    ctx.globalAlpha = 0.3;
                    ctx.beginPath();
                    // Slightly off-center for hand-drawn feel
                    const ox = Math.sin(t + i * 1.5) * 1.2;
                    const oy = Math.cos(t + i * 1.2) * 1.0;
                    ctx.arc(this.x + ox, this.y + oy, halo.offset, 0, Math.PI * 2);
                    ctx.stroke();
                });

                // Core dot
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        // Create elements
        const snippetCount = Math.min(14, Math.max(8, Math.floor(window.innerWidth / 100)));
        const nodeCount = Math.min(20, Math.max(10, Math.floor(window.innerWidth / 80)));
        const sketches = [];
        const nodes = [];

        function initElements() {
            sketches.length = 0;
            nodes.length = 0;
            for (let i = 0; i < snippetCount; i++) {
                const s = new SketchElement();
                s.x = Math.random() * W;
                s.y = Math.random() * H;
                sketches.push(s);
            }
            for (let i = 0; i < nodeCount; i++) {
                const n = new SketchNode();
                n.x = Math.random() * W;
                n.y = Math.random() * H;
                nodes.push(n);
            }
        }

        // Draw sketchy connection lines between nearby nodes
        function drawConnections(ctx, t) {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const alpha = (1 - dist / 150) * 0.18;
                        ctx.globalAlpha = alpha;
                        // Use gradient between the two node colors
                        const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                        grad.addColorStop(0, nodes[i].color);
                        grad.addColorStop(1, nodes[j].color);
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        // Slightly wobbly line for hand-drawn effect
                        const midX = (nodes[i].x + nodes[j].x) / 2 + Math.sin(t + i) * 2;
                        const midY = (nodes[i].y + nodes[j].y) / 2 + Math.cos(t + j) * 2;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.quadraticCurveTo(midX, midY, nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation loop
        let animId;
        function animate() {
            time += 0.016;
            ctx.clearRect(0, 0, W, H);

            // Draw connections first (behind everything)
            drawConnections(ctx, time);

            // Update and draw nodes
            nodes.forEach(n => {
                n.update(time);
                n.draw(ctx, time);
            });

            // Update and draw code snippets
            sketches.forEach(s => {
                s.update(time);
                s.draw(ctx, time);
            });

            animId = requestAnimationFrame(animate);
        }

        // Mouse tracking (relative to canvas)
        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.parentElement.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        // Init
        resize();
        initElements();
        animate();

        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resize();
                initElements();
            }, 200);
        });

        // Pause when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animId);
            } else {
                animate();
            }
        });
    }

    // ── Background Technical Network Particles ──
    const bgCanvas = document.getElementById('bgCanvas');
    if (bgCanvas) {
        const ctxBg = bgCanvas.getContext('2d');
        let bw, bh;
        const particles = [];
        const numParticles = 60; // adjust for density
        const dotColors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#845ec2', '#00dfb2'];
        const techSnippets = [
            'const x = 42;', '<div>', 'SELECT *', 'for(let i)',
            'npm start', 'git status', 'class Node {', 'return true;',
            'import sys', '#!/bin/bash', 'async () =>', 'console.log()',
            'while(true)', '.then(res)', '<canvas>', 'padding: 0;'
        ];

        function resizeBg() {
            bw = window.innerWidth;
            bh = window.innerHeight;
            bgCanvas.width = bw;
            bgCanvas.height = bh;
        }
        window.addEventListener('resize', resizeBg);
        resizeBg();

        class Particle {
            constructor() {
                this.x = Math.random() * bw;
                this.y = Math.random() * bh;
                this.vx = (Math.random() - 0.5) * 1.2;
                this.vy = (Math.random() - 0.5) * 1.2;

                this.isText = Math.random() > 0.85; // 15% chance to be a code text snippet
                if (this.isText) {
                    this.text = techSnippets[Math.floor(Math.random() * techSnippets.length)];
                    this.fontSize = 10 + Math.random() * 6; // 10px to 16px
                }

                this.r = 1.5 + Math.random() * 2;
                this.color = dotColors[Math.floor(Math.random() * dotColors.length)];
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < -100) this.x = bw + 50;
                if (this.x > bw + 100) this.x = -50;
                if (this.y < -50) this.y = bh + 20;
                if (this.y > bh + 50) this.y = -20;
            }
        }
        for (let i = 0; i < numParticles; i++) particles.push(new Particle());

        function drawBg() {
            ctxBg.clearRect(0, 0, bw, bh);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const baseLineColor = isDark ? '255, 255, 255' : '15, 23, 42';

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 160) {
                        ctxBg.beginPath();
                        ctxBg.moveTo(p.x, p.y);
                        ctxBg.lineTo(p2.x, p2.y);
                        ctxBg.lineWidth = 1;
                        ctxBg.strokeStyle = `rgba(${baseLineColor}, ${0.15 * (1 - dist / 160)})`;
                        ctxBg.stroke();
                    }
                }

                // Draw node or text
                if (p.isText) {
                    ctxBg.font = `600 ${p.fontSize}px 'JetBrains Mono', monospace`;
                    ctxBg.fillStyle = `rgba(${baseLineColor}, ${isDark ? 0.4 : 0.6})`;
                    ctxBg.textAlign = 'center';
                    ctxBg.textBaseline = 'middle';
                    ctxBg.fillText(p.text, p.x, p.y);
                } else {
                    ctxBg.beginPath();
                    ctxBg.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctxBg.fillStyle = p.color;
                    ctxBg.fill();
                }
            }
            requestAnimationFrame(drawBg);
        }
        drawBg();
    }
});
