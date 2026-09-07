/**
 * Moteur d'effets de particules d'ambiance pour « Les Chroniques du Croissant Fertile »
 * Particules contextuelles (eau fluviale, poussière d'épices, encens de ziggourat, sable du désert)
 * Optimisation GPU avec pause lors des modales.
 */

class ParticleCanvas {
    constructor() {
        this.canvas = document.getElementById("particles-canvas");
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.theme = "default"; // "default" | "river" | "market" | "ziggurat" | "egypt"
        this.paused = false;
        this.animFrameId = null;
        this.resize();
        window.addEventListener("resize", () => this.resize());
        this.initParticles();
        this.animate();
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    setTheme(themeName) {
        if (this.theme === themeName) return;
        this.theme = themeName;
        this.initParticles();
    }

    updateThemeFromScene(bgImage) {
        if (!bgImage) {
            this.setTheme("default");
            return;
        }
        if (bgImage.includes("scene_mesopotamia_river")) {
            this.setTheme("river");
        } else if (bgImage.includes("scene_babylon_market")) {
            this.setTheme("market");
        } else if (bgImage.includes("scene_ziggurat_ur")) {
            this.setTheme("ziggurat");
        } else if (bgImage.includes("scene_egypt_nile")) {
            this.setTheme("egypt");
        } else {
            this.setTheme("default");
        }
    }

    pauseParticles() {
        this.paused = true;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    resumeParticles() {
        if (!this.paused) return;
        this.paused = false;
        this.animate();
    }

    initParticles() {
        this.particles = [];
        const count = Math.floor((this.width * this.height) / 24000);

        for (let i = 0; i < count; i++) {
            let p = {
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 2 + 0.6,
                alpha: Math.random() * 0.6 + 0.2
            };

            switch (this.theme) {
                case "river":
                    // Particules bleues lentes d'eau / brume fluviale
                    p.color = Math.random() > 0.4 
                        ? `rgba(96, 165, 250, ${Math.random() * 0.4 + 0.15})` 
                        : `rgba(147, 197, 253, ${Math.random() * 0.35 + 0.1})`;
                    p.shadowColor = 'rgba(59, 130, 246, 0.4)';
                    p.vx = (Math.random() - 0.2) * 0.4 + 0.1; // dérive avec le courant
                    p.vy = -Math.random() * 0.2 - 0.05;
                    break;

                case "market":
                    // Particules ambre rapides de poussière & épices
                    p.color = Math.random() > 0.4 
                        ? `rgba(245, 158, 11, ${Math.random() * 0.45 + 0.2})` 
                        : `rgba(217, 119, 6, ${Math.random() * 0.4 + 0.15})`;
                    p.shadowColor = 'rgba(245, 158, 11, 0.5)';
                    p.vx = (Math.random() - 0.5) * 0.8;
                    p.vy = -Math.random() * 0.5 - 0.15;
                    p.radius = Math.random() * 2.2 + 0.5;
                    break;

                case "ziggurat":
                    // Fumée d'encens et braises sacrées orangées montantes
                    p.color = Math.random() > 0.4 
                        ? `rgba(251, 146, 60, ${Math.random() * 0.45 + 0.2})` 
                        : `rgba(234, 88, 12, ${Math.random() * 0.4 + 0.15})`;
                    p.shadowColor = 'rgba(234, 88, 12, 0.5)';
                    p.vx = (Math.random() - 0.5) * 0.3;
                    p.vy = -Math.random() * 0.6 - 0.2; // monte plus vite
                    break;

                case "egypt":
                    // Particules ocre-doré du Nil et sable doux
                    p.color = Math.random() > 0.5 
                        ? `rgba(224, 185, 115, ${Math.random() * 0.4 + 0.15})` 
                        : `rgba(167, 139, 90, ${Math.random() * 0.35 + 0.1})`;
                    p.shadowColor = 'rgba(212, 175, 55, 0.3)';
                    p.vx = (Math.random() - 0.4) * 0.4;
                    p.vy = -Math.random() * 0.3 - 0.08;
                    break;

                default:
                    // Poussière dorée des scribes
                    p.color = Math.random() > 0.4 
                        ? `rgba(212, 175, 55, ${Math.random() * 0.4 + 0.1})` 
                        : `rgba(247, 224, 137, ${Math.random() * 0.3 + 0.1})`;
                    p.shadowColor = 'rgba(212, 175, 55, 0.4)';
                    p.vx = (Math.random() - 0.5) * 0.3;
                    p.vy = -Math.random() * 0.4 - 0.1;
                    break;
            }

            this.particles.push(p);
        }
    }

    animate() {
        if (this.paused) return;
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.y < 0) {
                p.y = this.height;
                p.x = Math.random() * this.width;
            }
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 6;
            this.ctx.shadowColor = p.shadowColor || 'rgba(212, 175, 55, 0.4)';
            this.ctx.fill();
        }

        this.animFrameId = requestAnimationFrame(() => this.animate());
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.particleCanvas = new ParticleCanvas();
});
