/**
 * Codex Historique Interactif du Module 3 : L'émergence d'une civilisation
 * Conforme au programme d'Histoire de 1re secondaire (Québec)
 * Intègre les fiches de cours, fiches synthèses de mini-jeux, toasts de déblocage et glossaire interactif.
 */

const CODEX_DATA = {
    "points_communs": {
        id: "points_communs",
        title: "1. Les 6 Grands Points Communs des Civilisations Antiques",
        category: "Fondements",
        icon: "🏛️",
        unlocked: true,
        content: `
            <p>L'<strong>Antiquité</strong> est la première période historique de l'humanité (de <strong>3500 av. J.-C. à 476 apr. J.-C.</strong>), car elle débute avec l'<strong>invention de l'écriture</strong>.</p>
            <p>Toutes les premières grandes civilisations partagent <strong>6 caractéristiques majeures</strong> :</p>
            <ul>
                <li><strong>1. Proximité d'un fleuve :</strong> Le Tigre et l'Euphrate (Mésopotamie), le Nil (Égypte), l'Indus (Inde) et le Fleuve Jaune (Chine).</li>
                <li><strong>2. Développement de l'écriture :</strong> Pour gérer les surplus, la loi et les archives.</li>
                <li><strong>3. Grandes constructions :</strong> Ziggourats imposantes, pyramides et temples sacrés.</li>
                <li><strong>4. Structuration de la société :</strong> Hiérarchie sociale organisée et spécialisation des métiers.</li>
                <li><strong>5. Systèmes complexes d'irrigation :</strong> Canaux, digues et réservoirs pour fertiliser les terres.</li>
                <li><strong>6. Utilisation de la métallurgie :</strong> Travail du bronze et des métaux pour les outils et armes.</li>
            </ul>
        `
    },
    "cites_etats": {
        id: "cites_etats",
        title: "2. Les Cités-États Mésopotamiennes",
        category: "Politique",
        icon: "👑",
        unlocked: false,
        content: `
            <p>Une <strong>cité-État</strong> est une ville fortifiée qui possède son propre gouvernement indépendant et contrôle un vaste territoire agricole environnant.</p>
            <ul>
                <li><strong>Autonomie totale :</strong> Chaque cité est indépendante de ses voisines.</li>
                <li><strong>Gouvernée par un roi :</strong> Le roi détient le pouvoir militaire, politique et religieux suprême.</li>
                <li><strong>Grandes cités notables :</strong> <em>Babylone</em>, <em>Ur</em> et <em>Lagash</em>.</li>
                <li><strong>Lois écrites :</strong> Permettent d'appliquer les mêmes règles et conséquences pour tous (apparition d'une forme d'égalité devant la loi).</li>
            </ul>
        `
    },
    "evolution_ecriture": {
        id: "evolution_ecriture",
        title: "3. L'Évolution de l'Écriture",
        category: "Savoir & Écriture",
        icon: "📜",
        unlocked: false,
        content: `
            <p>L'écriture est née en Mésopotamie vers <strong>3500 - 3300 av. J.-C.</strong> pour répondre à des besoins de comptabilité.</p>
            <p>Elle a évolué en <strong>3 grands stades</strong> successifs :</p>
            <ul>
                <li><strong>Stade 1 : Les Calculis & Pictogrammes :</strong> Les calculis sont de petites boules d'argile pour compter. Les pictogrammes sont des dessins représentant directement des objets réels ou êtres vivants.</li>
                <li><strong>Stade 2 : Les Idéogrammes :</strong> Symboles représentant des idées abstraites, des actions ou des concepts plus complexes.</li>
                <li><strong>Stade 3 : Les Phonèmes :</strong> Symboles représentant des sons de la voix humaine. L'écriture devient alors le <strong>cunéiforme</strong> (signes en forme de coins gravés dans l'argile).</li>
            </ul>
            <p><strong>Révolution de l'Alphabet :</strong> En <strong>1200 av. J.-C.</strong>, les <em>Phéniciens</em> inventent l'alphabet. Avec beaucoup moins de signes à mémoriser (22 lettres), il facilite grandement l'apprentissage et la diffusion des idées.</p>
        `
    },
    "utilite_ecriture": {
        id: "utilite_ecriture",
        title: "4. Rôles et Supports de l'Écriture",
        category: "Savoir & Écriture",
        icon: "🖋️",
        unlocked: false,
        content: `
            <p>L'écriture sert principalement à <strong>se souvenir</strong> et à <strong>communiquer de façon uniforme</strong>.</p>
            <ul>
                <li><strong>Niveau politique :</strong> Archiver les discours royaux, diffuser les lois et règlements, planifier la construction des villes.</li>
                <li><strong>Niveau économique :</strong> Compter les récoltes, conserver des traces des transactions commerciales et rédiger des contrats.</li>
                <li><strong>Niveau social et culturel :</strong> Transmettre les traditions, récits légendaires (comme l'<em>Épopée de Gilgamesh</em>, plus vieille histoire de l'humanité) et traités de médecine.</li>
            </ul>
            <p><strong>Supports principaux :</strong> L'<strong>argile</strong> fraîche (Mésopotamie) et le <strong>papyrus</strong> végétal (Égypte).</p>
        `
    },
    "hierarchie_sociale": {
        id: "hierarchie_sociale",
        title: "5. La Hiérarchie Sociale Mésopotamienne",
        category: "Société",
        icon: "⚖️",
        unlocked: false,
        content: `
            <p>La société mésopotamienne est divisée en <strong>5 niveaux stricts</strong> :</p>
            <ol>
                <li><strong>1. Le Roi :</strong> Pouvoir suprême, commande l'armée, perçoit les taxes et édicte les lois.</li>
                <li><strong>2. Les Nobles :</strong> Haut clergé, conseillers royaux, famille royale ; ils possèdent l'ensemble des terres.</li>
                <li><strong>3. Les Fonctionnaires (Scribes & Prêtres) :</strong> Très influents car ils maîtrisent l'écriture ; ils rédigent les actes du roi et les contrats de commerce.</li>
                <li><strong>4. Le Peuple :</strong> Paysans, artisans, commerçants, éleveurs qui produisent les biens nécessaires à la survie.</li>
                <li><strong>5. Les Esclaves :</strong> N'ont aucun droit et appartiennent au roi ou à la noblesse.</li>
            </ol>
            <p><em>Deux critères déterminent la place d'une personne :</em> la <strong>naissance</strong> (famille d'origine) et la <strong>spécialisation du travail</strong>.</p>
        `
    },
    "religion_ziggourats": {
        id: "religion_ziggourats",
        title: "6. Religion, Panthéon et Ziggourats",
        category: "Religion & Croyances",
        icon: "⚡",
        unlocked: false,
        content: `
            <p>La religion mésopotamienne est fondée sur le <strong>polythéisme</strong> (croyance en plusieurs dieux incarnant les forces de la nature et les sentiments humains).</p>
            <ul>
                <li><strong>Le Panthéon :</strong> Temple et ensemble des dieux reconnus par la cité.</li>
                <li><strong>Les Ziggourats :</strong> Temples mésopotamiens pyramidaux à étages servant d'escalier entre le ciel et la terre.</li>
                <li><strong>Les Mythes religieux :</strong> Récits explicatifs sacrés, dont l'<em>Épopée de Gilgamesh</em> qui illustre la quête d'immortalité d'un roi légendaire.</li>
            </ul>
        `
    },
    "commerce_sciences": {
        id: "commerce_sciences",
        title: "7. Commerce, Troc et Sciences",
        category: "Économie & Sciences",
        icon: "🏺",
        unlocked: false,
        content: `
            <p>En l'absence de monnaie métallique standardisée, le commerce reposait sur le troc et les contrats écrits.</p>
            <ul>
                <li><strong>Produits exportés :</strong> Blé, poteries d'art et objets manufacturés.</li>
                <li><strong>Produits importés :</strong> Bois de construction, pierres précieuses, soie, métaux (cuivre, étain) et épices.</li>
                <li><strong>Sciences mésopotamiennes :</strong> Invention des <strong>mathématiques</strong> (système sexagésimal, base 60) et de l'<strong>astronomie</strong> (calendrier lunaire et étude des astres).</li>
            </ul>
        `
    },
    "code_hammourabi": {
        id: "code_hammourabi",
        title: "8. Babylone et le Code d'Hammourabi (1750 av. J.-C.)",
        category: "Justice & Lois",
        icon: "⚖️",
        unlocked: false,
        content: `
            <p>Vers <strong>1750 av. J.-C.</strong>, la cité de <strong>Babylone</strong> devient une superpuissance économique et militaire sous le règne du roi <strong>Hammourabi</strong>.</p>
            <ul>
                <li>Pour régler le nombre croissant de conflits commerciaux et territoriaux, le roi fait graver le <strong>Code d'Hammourabi</strong> sur une immense stèle de pierre basaltique noire.</li>
                <li>C'est le <strong>premier recueil de lois écrites de l'histoire</strong>.</li>
                <li><strong>Importance :</strong> Les règles étant fixées dans la pierre, les jugements ne dépendent plus de l'arbitraire d'un juge et s'appliquent de manière publique et uniforme.</li>
            </ul>
        `
    },
    "civilisation_nil": {
        id: "civilisation_nil",
        title: "9. La Civilisation du Nil et les Pharaons (Égypte)",
        category: "Égypte Antique",
        icon: "🔺",
        unlocked: false,
        content: `
            <p>Développée il y a 5000 ans av. J.-C., la civilisation égyptienne s'épanouit le long du <strong>Nil</strong>.</p>
            <ul>
                <li><strong>Les Crues du Nil :</strong> L'inondation annuelle dépose le <em>limon fertile</em> qui permet une agriculture abondante (fruits, légumes, céréales).</li>
                <li><strong>La Navigation :</strong> Le Nil est une autoroute naturelle permettant le transport des blocs de pierre et le commerce.</li>
                <li><strong>Les Hiéroglyphes :</strong> Système d'écriture complexe constitué de dessins représentant des animaux, objets et divinités, tracé sur papyrus ou gravé sur les monuments.</li>
                <li><strong>Les Pyramides :</strong> Tombeaux monumentaux des rois (ex: pyramide de <em>Khéops</em>, d'<em>Amenemhat Ier</em>, de <em>Lepsius</em>).</li>
                <li><strong>Le Pharaon :</strong> Considéré comme un <strong>dieu vivant</strong> sur Terre. Il cumule tous les rôles : grand chef de l'État, chef de l'administration (impôts), commandant des armées, grand prêtre et juge suprême.</li>
            </ul>
        `
    }
};

const CODEX_GLOSSARY = {
    "calculi": {
        term: "Calculi (ou calculis)",
        def: "Petits jetons ou boules d'argile utilisés dès 3500 av. J.-C. pour compter et archiver les récoltes et troupeaux.",
        codexId: "evolution_ecriture"
    },
    "calculis": {
        term: "Calculis",
        def: "Petits jetons d'argile de comptabilité primitive placés dans des bourses scellées.",
        codexId: "evolution_ecriture"
    },
    "pictogramme": {
        term: "Pictogramme",
        def: "Dessin schématique représentant directement un objet concret ou un être vivant (blé, bœuf, poisson).",
        codexId: "evolution_ecriture"
    },
    "pictogrammes": {
        term: "Pictogrammes",
        def: "Dessins figuratifs concrets marquant la première étape de l'écriture en Mésopotamie vers 3300 av. J.-C.",
        codexId: "evolution_ecriture"
    },
    "ideogramme": {
        term: "Idéogramme",
        def: "Symbole graphique qui représente une idée, un concept abstrait ou une action plutôt qu'un objet physique.",
        codexId: "evolution_ecriture"
    },
    "cuneiforme": {
        term: "Écriture Cunéiforme",
        def: "Écriture mésopotamienne en forme de coins et de clous gravés au calame (tige de roseau) dans l'argile fraîche.",
        codexId: "evolution_ecriture"
    },
    "calame": {
        term: "Calame",
        def: "Tige de roseau taillée en biseau utilisée par les scribes pour imprimer des signes cunéiformes dans l'argile.",
        codexId: "utilite_ecriture"
    },
    "ziggourat": {
        term: "Ziggourat",
        def: "Édifice religieux mésopotamien en forme de pyramide à degrés, considéré comme l'escalier reliant les dieux aux hommes.",
        codexId: "religion_ziggourats"
    },
    "cite_etat": {
        term: "Cité-État",
        def: "Ville fortifiée indépendante avec son propre roi, son armée, ses dieux protecteurs et ses terres agricoles.",
        codexId: "cites_etats"
    },
    "hammurabi": {
        term: "Code d'Hammourabi (1750 av. J.-C.)",
        def: "Premier grand recueil de lois écrites gravé sur une stèle de basalte pour fixer des jugements uniformes et publics.",
        codexId: "code_hammourabi"
    },
    "troc": {
        term: "Troc",
        def: "Échange direct de biens et surplus (blé, poteries) sans utilisation de pièces de monnaie.",
        codexId: "commerce_sciences"
    },
    "limon": {
        term: "Limon",
        def: "Terre noire et fertile déposée par les crues annuelles du Nil en Égypte, indispensable à l'agriculture.",
        codexId: "civilisation_nil"
    },
    "pharaon": {
        term: "Pharaon",
        def: "Souverain de l'Égypte antique, considéré comme un dieu vivant sur Terre et chef suprême de l'État.",
        codexId: "civilisation_nil"
    },
    "polytheisme": {
        term: "Polythéisme",
        def: "Croyance religieuse en plusieurs dieux (forces de la nature, astres, sentiments).",
        codexId: "religion_ziggourats"
    },
    "alphabet": {
        term: "Alphabet Phénicien (1200 av. J.-C.)",
        def: "Révolution de l'écriture avec 22 signes simples basés sur les sons de la voix, rendant l'écriture accessible.",
        codexId: "evolution_ecriture"
    }
};

/**
 * Gestionnaire d'empilement vertical des notifications popup (Toasts)
 * Évite les superpositions, les masquages intempestifs et gère les minuteurs de manière indépendante.
 */
class ToastManager {
    constructor() {
        this.container = null;
        this.maxVisible = 4;
    }

    getContainer() {
        if (!this.container || !document.body.contains(this.container)) {
            this.container = document.getElementById("toast-stack-container");
            if (!this.container) {
                this.container = document.createElement("div");
                this.container.id = "toast-stack-container";
                this.container.className = "toast-stack-container";
                this.container.setAttribute("aria-live", "polite");
                document.body.appendChild(this.container);
            }
        }
        return this.container;
    }

    show({ className = "", icon = "📜", title = "", message = "", extraHtml = "", duration = 5500 }) {
        const container = this.getContainer();

        // Si le conteneur a atteint la limite, retirer le plus ancien proprement
        while (container.children.length >= this.maxVisible) {
            this.dismiss(container.firstChild);
        }

        const toast = document.createElement("div");
        toast.className = `butterfly-toast ${className}`.trim();
        toast.setAttribute("role", "alert");

        toast.innerHTML = `
            <button class="toast-close-btn" aria-label="Fermer la notification" title="Fermer">&times;</button>
            <div class="butterfly-toast-icon">${icon}</div>
            <div class="butterfly-toast-content">
                <strong>${title}</strong>
                <p>${message}</p>
                ${extraHtml ? extraHtml : ""}
            </div>
        `;

        // Événements de fermeture par clic
        const closeBtn = toast.querySelector(".toast-close-btn");
        if (closeBtn) {
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                this.dismiss(toast);
            };
        }
        toast.onclick = () => this.dismiss(toast);

        // Insertion dans le conteneur
        container.appendChild(toast);

        // Animation d'apparition
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add("visible");
            });
        });

        // Minuteur de disparition indépendant par toast
        let timer = setTimeout(() => {
            this.dismiss(toast);
        }, duration);

        // Pause du minuteur au survol
        toast.onmouseenter = () => {
            clearTimeout(timer);
        };
        toast.onmouseleave = () => {
            timer = setTimeout(() => {
                this.dismiss(toast);
            }, 2500);
        };

        return toast;
    }

    dismiss(toast) {
        if (!toast || toast.classList.contains("hiding")) return;
        toast.classList.add("hiding");
        toast.classList.remove("visible");

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 450);
    }
}

if (!window.toastManager) {
    window.toastManager = new ToastManager();
}

class CodexManager {
    constructor() {
        this.entries = CODEX_DATA;
        this.syntheses = [];
        this.activeTab = 'lessons'; // 'lessons' | 'syntheses'
        this.activeEntryId = "points_communs";
        this.newUnlocksCount = 0;
    }

    unlock(id) {
        if (this.entries[id] && !this.entries[id].unlocked) {
            this.entries[id].unlocked = true;
            this.newUnlocksCount++;
            this.updateBadge();
            this.showUnlockToast(this.entries[id].title);
            this.renderSidebar();
        }
    }

    addSynthesis(synth) {
        if (!this.syntheses.some(s => s.id === synth.id)) {
            this.syntheses.push(synth);
            this.newUnlocksCount++;
            this.updateBadge();
            this.showUnlockToast(`Fiche Synthèse : ${synth.title}`);
        }
    }

    updateBadge() {
        const badge = document.getElementById("codex-badge");
        if (badge) {
            if (this.newUnlocksCount > 0) {
                badge.innerText = this.newUnlocksCount;
                badge.style.display = "inline-flex";
            } else {
                badge.style.display = "none";
            }
        }
    }

    showUnlockToast(title) {
        if (window.soundEngine) window.soundEngine.playPapyrus();

        if (window.toastManager) {
            return window.toastManager.show({
                className: "codex-toast",
                icon: "📜",
                title: "Nouveau Savoir Déverrouillé !",
                message: title,
                extraHtml: '<span style="font-size:0.75rem; color:#f7e089; display:block; margin-top:2px;">Consultez le Codex pour approfondir.</span>',
                duration: 5500
            });
        }
    }

    setTab(tab) {
        this.activeTab = tab;
        const tabLessons = document.getElementById("tab-codex-lessons");
        const tabSyntheses = document.getElementById("tab-codex-syntheses");

        if (tabLessons) tabLessons.classList.toggle("active", tab === 'lessons');
        if (tabSyntheses) tabSyntheses.classList.toggle("active", tab === 'syntheses');

        this.renderSidebar();
        if (tab === 'lessons') {
            this.renderEntry(this.activeEntryId);
        } else if (this.syntheses.length > 0) {
            this.renderSynthesisEntry(this.syntheses[0].id);
        } else {
            const titleEl = document.getElementById("codex-entry-title");
            const bodyEl = document.getElementById("codex-entry-body");
            if (titleEl) titleEl.innerText = "⭐ Fiches Synthèses";
            if (bodyEl) bodyEl.innerHTML = `<p style="font-style:italic; color:#c4b59d;">Aucune synthèse débloquée pour l'instant. Réussissez les mini-jeux de l'aventure pour enrichir vos fiches de révision !</p>`;
        }
    }

    renderSidebar() {
        const sidebar = document.getElementById("codex-sidebar-list");
        if (!sidebar) return;
        
        sidebar.innerHTML = "";

        if (this.activeTab === 'lessons') {
            Object.values(this.entries).forEach(entry => {
                const item = document.createElement("div");
                item.className = `codex-nav-item ${entry.id === this.activeEntryId ? 'active' : ''}`;
                item.innerHTML = `
                    <span style="font-size:1.3rem;">${entry.icon}</span>
                    <div style="display:flex; flex-direction:column; gap:2px;">
                        <span style="font-weight:600; font-size:0.9rem;">${entry.title}</span>
                        <span style="font-size:0.75rem; color:${entry.unlocked ? '#4ade80' : '#f87171'}">
                            ${entry.unlocked ? '✓ Débloqué' : '🔒 À découvrir'}
                        </span>
                    </div>
                `;
                item.onclick = () => {
                    if (entry.unlocked) {
                        this.activeEntryId = entry.id;
                        this.renderEntry(entry.id);
                        this.renderSidebar();
                        if (window.soundEngine) window.soundEngine.playPapyrus();
                    } else {
                        alert("Cette notion sera débloquée lors de vos choix et découvertes au cours de l'aventure !");
                    }
                };
                sidebar.appendChild(item);
            });
        } else {
            if (this.syntheses.length === 0) {
                sidebar.innerHTML = `<div style="padding:15px; font-size:0.85rem; color:var(--text-secondary); text-align:center;">Complétez un mini-jeu pour débloquer votre première fiche synthèse !</div>`;
                return;
            }

            this.syntheses.forEach(synth => {
                const item = document.createElement("div");
                item.className = `codex-nav-item ${synth.id === this.activeEntryId ? 'active' : ''}`;
                item.innerHTML = `
                    <span style="font-size:1.3rem;">${synth.icon || '⭐'}</span>
                    <div style="display:flex; flex-direction:column; gap:2px;">
                        <span style="font-weight:600; font-size:0.9rem;">${synth.title}</span>
                        <span style="font-size:0.75rem; color:#f7e089;">Fiche Révision</span>
                    </div>
                `;
                item.onclick = () => {
                    this.activeEntryId = synth.id;
                    this.renderSynthesisEntry(synth.id);
                    this.renderSidebar();
                    if (window.soundEngine) window.soundEngine.playPapyrus();
                };
                sidebar.appendChild(item);
            });
        }
    }

    renderEntry(id) {
        const entry = this.entries[id];
        const titleEl = document.getElementById("codex-entry-title");
        const bodyEl = document.getElementById("codex-entry-body");
        if (!entry || !titleEl || !bodyEl) return;

        titleEl.innerHTML = `${entry.icon} ${entry.title}`;
        bodyEl.innerHTML = entry.content;
    }

    renderSynthesisEntry(id) {
        const synth = this.syntheses.find(s => s.id === id);
        const titleEl = document.getElementById("codex-entry-title");
        const bodyEl = document.getElementById("codex-entry-body");
        if (!synth || !titleEl || !bodyEl) return;

        titleEl.innerHTML = `${synth.icon || '⭐'} ${synth.title}`;
        bodyEl.innerHTML = `
            <div style="margin-bottom:15px; color:var(--gold-light); font-style:italic;">
                Fiche synthèse issue de votre réussite au mini-jeu :
            </div>
            <div class="synthesis-grid" style="grid-template-columns:1fr; gap:12px;">
                ${synth.items.map(it => `
                    <div class="synthesis-item">
                        <strong>${it.title}</strong>
                        <span>${it.desc}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    openModal(targetEntryId = null) {
        const modal = document.getElementById("codex-modal");
        if (modal) {
            modal.style.display = "flex";
            this.newUnlocksCount = 0;
            this.updateBadge();
            if (targetEntryId && this.entries[targetEntryId]) {
                this.activeTab = 'lessons';
                this.activeEntryId = targetEntryId;
            }
            this.renderSidebar();
            this.renderEntry(this.activeEntryId);
            if (window.soundEngine) window.soundEngine.playPapyrus();
            if (window.particleCanvas) window.particleCanvas.pauseParticles();
        }
    }

    closeModal() {
        const modal = document.getElementById("codex-modal");
        if (modal) modal.style.display = "none";
        if (window.particleCanvas) window.particleCanvas.resumeParticles();
    }

    // ==========================================
    // GESTION DU GLOSSAIRE INTERACTIF
    // ==========================================
    openGlossaryBubble(key, targetElement) {
        const info = CODEX_GLOSSARY[key.toLowerCase()];
        if (!info) return;

        const bubble = document.getElementById("glossary-bubble");
        const termEl = document.getElementById("glossary-bubble-term");
        const defEl = document.getElementById("glossary-bubble-def");
        const linkEl = document.getElementById("glossary-bubble-link");

        if (!bubble || !termEl || !defEl || !linkEl) return;

        termEl.innerText = info.term;
        defEl.innerText = info.def;
        linkEl.onclick = () => {
            this.closeGlossaryBubble();
            this.openModal(info.codexId);
        };

        const rect = targetElement.getBoundingClientRect();
        bubble.style.display = "block";
        bubble.style.top = `${Math.min(window.innerHeight - 150, rect.bottom + 8)}px`;
        bubble.style.left = `${Math.max(15, Math.min(window.innerWidth - 300, rect.left - 40))}px`;
    }

    closeGlossaryBubble() {
        const bubble = document.getElementById("glossary-bubble");
        if (bubble) bubble.style.display = "none";
    }
}

window.codexManager = new CodexManager();
