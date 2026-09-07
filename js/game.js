/**
 * Moteur Principal du Jeu « Les Chroniques du Croissant Fertile »
 * Version Polished & Éducative (1re Secondaire Québec - Module 3)
 * Orchestration des états, scénarios asymétriques, jauges, indices, médailles et diplôme interactif
 */

class GameEngine {
    constructor() {
        this.player = {
            name: "Gilgamesh",
            classId: "scribe",
            stats: { savoir: 50, influence: 50, richesse: 50, destin: 50 },
            currentNodeId: "ch1_scribe_start",
            history: [],
            flags: {},
            clues: [],
            decisions: [],
            completedMinigames: [],
            unlockedMedals: [],
            inventory: []
        };

        this.selectedArtifactId = null;
        this.storyData = window.STORY_DATA;
        this.textSpeed = "normal"; // "normal" | "fast" | "instant"
        this.typewriterInterval = null;
        this.isTyping = false;
        this.textNodesList = [];
        this.onTypewriterComplete = null;
        this.isChoiceLocked = false;

        this.medalsList = [
            { id: "first_step", title: "Premier Pas Antique", desc: "Commencer l'aventure dans le Croissant fertile.", icon: "🌱" },
            { id: "master_scribe", title: "Maître du Calame", desc: "Reconstituer l'évolution des 4 étapes de l'écriture.", icon: "📜" },
            { id: "fair_judge", title: "Juge Équitable", desc: "Appliquer la justice et les lois du Roi Hammourabi.", icon: "⚖️" },
            { id: "trade_baron", title: "Grand Négociant", desc: "Équilibrer les échanges commerciaux fluviaux.", icon: "🏺" },
            { id: "social_architect", title: "Architecte Social", desc: "Replacer les 5 classes de la hiérarchie mésopotamienne.", icon: "🏛️" },
            { id: "time_traveler", title: "Maître du Temps", desc: "Placer correctement les événements sur la frise historique.", icon: "⏳" },
            { id: "nile_master", title: "Dompteur du Nil", desc: "Sécuriser les digues et bassins d'irrigation en Égypte.", icon: "🌊" },
            { id: "diploma_s", title: "Savant Légendaire", desc: "Terminer le jeu avec le rang suprême S (340+ points).", icon: "👑" }
        ];
    }

    init() {
        this.checkDemoMode();
        this.renderClassSelection();
        this.bindGlobalEvents();
        this.initFileSaveHandlers();
        this.initTextSize();
        this.initTextSpeed();
        this.initFontPreference();
        this.initAudioModalEvents();
        this.initMedalsModalEvents();
        this.initInventoryModalEvents();
        if (!window.minigames && typeof MiniGamesManager !== "undefined") {
            window.minigames = new MiniGamesManager();
        }
        this.checkSavedGame();
        this.showMainMenu();
    }

    // ==========================================
    // MODE DÉMO ENSEIGNANT (?mode=demo)
    // ==========================================
    checkDemoMode() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("mode") === "demo" || urlParams.get("demo") === "true") {
            window.isDemoMode = true;
            console.log("🎓 Mode Enseignant / Démo Activé");
            const navBar = document.querySelector(".hud-actions");
            if (navBar) {
                const demoBtn = document.createElement("button");
                demoBtn.className = "hud-btn";
                demoBtn.style.borderColor = "#10b981";
                demoBtn.style.color = "#10b981";
                demoBtn.innerHTML = "⚡ Saut Chapitre";
                demoBtn.onclick = () => {
                    const choice = prompt("Choisir un chapitre à tester (1, 2, 3, 4, 5, frise, fin) :");
                    if (choice === "1") this.goToNode("ch1_scribe_start");
                    else if (choice === "2") this.goToNode("ch2_babylon_entrance");
                    else if (choice === "3") this.goToNode("ch3_ziggurat_arrival");
                    else if (choice === "4") this.goToNode("ch4_trial_court");
                    else if (choice === "frise") this.goToNode("ch4_timeline_node");
                    else if (choice === "5") this.goToNode("ch5_nile_arrival");
                    else if (choice === "fin") this.goToNode("ch5_pharaoh_audience");
                };
                navBar.appendChild(demoBtn);
            }
        }
    }

    // ==========================================
    // GESTION POLICE CONFORT / DYSLEXIE
    // ==========================================
    initFontPreference() {
        const savedFont = localStorage.getItem("antique_font_comfort");
        if (savedFont === "true") {
            const app = document.getElementById("game-app");
            if (app) app.classList.add("font-comfort");
        }
        const fontBtn = document.getElementById("btn-font-toggle");
        if (fontBtn) {
            fontBtn.onclick = () => this.toggleComfortFont();
        }
    }

    toggleComfortFont() {
        const app = document.getElementById("game-app");
        if (!app) return;
        const isComfort = app.classList.toggle("font-comfort");
        localStorage.setItem("antique_font_comfort", isComfort ? "true" : "false");
        const fontBtn = document.getElementById("btn-font-toggle");
        if (fontBtn) fontBtn.classList.toggle("active", isComfort);
        if (window.soundEngine) window.soundEngine.playChoice();
    }

    // ==========================================
    // TAILLE & VITESSE DU TEXTE
    // ==========================================
    initTextSize() {
        const savedSize = localStorage.getItem("antique_text_size") || "md";
        this.setTextSize(savedSize, false);
    }

    setTextSize(size, save = true) {
        const app = document.getElementById("game-app");
        if (!app) return;
        
        app.classList.remove("text-size-sm", "text-size-md", "text-size-lg", "text-size-xl");
        app.classList.add(`text-size-${size}`);
        
        document.querySelectorAll(".text-size-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.size === size);
        });
        
        if (save) {
            localStorage.setItem("antique_text_size", size);
        }
    }

    initTextSpeed() {
        const savedSpeed = localStorage.getItem("antique_text_speed") || "normal";
        this.setTextSpeed(savedSpeed, false);
    }

    setTextSpeed(speed, save = true) {
        this.textSpeed = speed;
        const speedLabel = document.getElementById("speed-label");
        const speedBtn = document.getElementById("btn-text-speed");
        if (speedLabel) {
            const labels = {
                normal: "Normal",
                fast: "Rapide",
                instant: "Instantané"
            };
            speedLabel.innerText = labels[speed] || "Normal";
        }
        if (speedBtn) {
            speedBtn.setAttribute("data-speed", speed);
        }
        if (save) {
            localStorage.setItem("antique_text_speed", speed);
        }
    }

    cycleTextSpeed() {
        const speedOrder = ["normal", "fast", "instant"];
        const currentIndex = speedOrder.indexOf(this.textSpeed);
        const nextSpeed = speedOrder[(currentIndex + 1) % speedOrder.length];
        this.setTextSpeed(nextSpeed, true);

        if (this.isTyping && nextSpeed === "instant") {
            this.skipTypewriter();
        }
    }

    // ==========================================
    // MENU PRINCIPAL & GESTION DES ÉCRANS
    // ==========================================
    showMainMenu() {
        const mainMenu = document.getElementById("main-menu-screen");
        if (mainMenu) mainMenu.style.display = "flex";

        const startScreen = document.getElementById("start-screen");
        if (startScreen) startScreen.style.display = "none";

        const storyScreen = document.getElementById("story-screen");
        if (storyScreen) storyScreen.style.display = "none";

        const hud = document.getElementById("game-hud");
        if (hud) hud.style.display = "none";

        const endgame = document.getElementById("endgame-screen");
        if (endgame) endgame.style.display = "none";

        const progContainer = document.getElementById("chapter-progress-container");
        if (progContainer) progContainer.style.display = "none";

        this.checkSavedGame();
    }

    showClassSelection() {
        const mainMenu = document.getElementById("main-menu-screen");
        if (mainMenu) mainMenu.style.display = "none";

        const startScreen = document.getElementById("start-screen");
        if (startScreen) {
            startScreen.style.display = "flex";
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if (window.soundEngine && window.soundEngine.playChoice) {
            window.soundEngine.playChoice();
        }
    }

    openLoadGameModal() {
        const modal = document.getElementById("load-game-modal");
        if (modal) {
            this.refreshLoadGameModalPreview();
            modal.style.display = "flex";
        }
        if (window.soundEngine && window.soundEngine.playChoice) {
            window.soundEngine.playChoice();
        }
    }

    closeLoadGameModal() {
        const modal = document.getElementById("load-game-modal");
        if (modal) modal.style.display = "none";
    }

    openTutorialModal() {
        const modal = document.getElementById("tutorial-modal");
        if (modal) modal.style.display = "flex";
        if (window.soundEngine && window.soundEngine.playChoice) {
            window.soundEngine.playChoice();
        }
    }

    closeTutorialModal() {
        const modal = document.getElementById("tutorial-modal");
        if (modal) modal.style.display = "none";
    }

    // ==========================================
    // SAUVEGARDE & CHARGEMENT SUR MACBOOK (.JSON)
    // AUCUN AUTO-SAVE : ENREGISTREMENT MANUEL EXCLUSIF
    // ==========================================
    saveGameToFile() {
        try {
            const timestamp = new Date().toLocaleDateString("fr-CA") + " à " + new Date().toLocaleTimeString("fr-CA", { hour: '2-digit', minute: '2-digit' });
            const node = this.storyData?.nodes?.[this.player.currentNodeId];
            const chapterTitle = node ? `${node.chapter || ''} · ${node.chapterTitle || ''}` : "En cours";

            const saveData = {
                game: "Les Chroniques du Croissant Fertile",
                version: 2,
                author: "Philippe Lévesque, M.Éd.",
                exportDate: new Date().toISOString(),
                timestamp: timestamp,
                chapterInfo: chapterTitle,
                player: {
                    name: this.player.name,
                    classId: this.player.classId,
                    stats: { ...this.player.stats },
                    currentNodeId: this.player.currentNodeId,
                    history: [...(this.player.history || [])],
                    flags: { ...(this.player.flags || {}) },
                    clues: [...(this.player.clues || [])],
                    decisions: [...(this.player.decisions || [])],
                    completedMinigames: [...(this.player.completedMinigames || [])],
                    unlockedMedals: [...(this.player.unlockedMedals || [])],
                    inventory: [...(this.player.inventory || [])]
                }
            };

            // Sauvegarde locale de secours en mémoire du navigateur
            localStorage.setItem("chroniques_croissant_save", JSON.stringify(saveData));

            // Téléchargement direct du fichier .json sur le MacBook du joueur
            const jsonStr = JSON.stringify(saveData, null, 2);
            const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
            const safeHeroName = (this.player.name || "Heros").replace(/[^a-zA-Z0-9_\-]/g, "_");
            const filename = `sauvegarde_croissant_fertile_${safeHeroName}.json`;

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(link.href), 1200);

            if (window.soundEngine && window.soundEngine.playCoins) {
                window.soundEngine.playCoins();
            }

            this.showButterflyToast(`💾 Partie enregistrée ! Fichier .json sauvegardé sur votre MacBook.`);
        } catch (e) {
            console.error("Erreur lors de la sauvegarde :", e);
            alert("Erreur lors de l'enregistrement de la partie : " + e.message);
        }
    }

    saveGame() {
        // Sauvegarde locale manuelle de secours
        try {
            const timestamp = new Date().toLocaleDateString("fr-CA") + " à " + new Date().toLocaleTimeString("fr-CA", { hour: '2-digit', minute: '2-digit' });
            const node = this.storyData?.nodes?.[this.player.currentNodeId];
            const chapterTitle = node ? `${node.chapter || ''} · ${node.chapterTitle || ''}` : "En cours";

            const saveData = {
                game: "Les Chroniques du Croissant Fertile",
                version: 2,
                author: "Philippe Lévesque, M.Éd.",
                timestamp: timestamp,
                chapterInfo: chapterTitle,
                player: this.player
            };
            localStorage.setItem("chroniques_croissant_save", JSON.stringify(saveData));
        } catch (e) {
            console.warn("Impossible de sauvegarder localement :", e);
        }
    }

    initFileSaveHandlers() {
        // Input fichier caché
        const fileInput = document.getElementById("macbook-save-file-input");
        if (fileInput) {
            fileInput.addEventListener("change", (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.loadSaveFromFile(e.target.files[0]);
                }
            });
        }

        // Zone de glisser-déposer (Drag & Drop)
        const dropZone = document.getElementById("drop-save-zone");
        if (dropZone) {
            dropZone.addEventListener("dragover", (e) => {
                e.preventDefault();
                dropZone.classList.add("dragover");
            });
            dropZone.addEventListener("dragleave", () => {
                dropZone.classList.remove("dragover");
            });
            dropZone.addEventListener("drop", (e) => {
                e.preventDefault();
                dropZone.classList.remove("dragover");
                if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
                    this.loadSaveFromFile(e.dataTransfer.files[0]);
                }
            });
        }
    }

    loadSaveFromFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const parsed = JSON.parse(text);
                const player = parsed.player || (parsed.currentNodeId ? parsed : null);

                if (!player || !player.currentNodeId || !player.stats) {
                    throw new Error("Le fichier ne contient pas les données requises.");
                }

                // Mettre à jour la sauvegarde locale
                try {
                    localStorage.setItem("chroniques_croissant_save", JSON.stringify({
                        game: "Les Chroniques du Croissant Fertile",
                        version: 2,
                        timestamp: parsed.timestamp || new Date().toLocaleDateString("fr-CA"),
                        player: player
                    }));
                } catch(err){}

                this.closeLoadGameModal();
                this.resumeGame(player);
                this.showButterflyToast("✅ Partie chargée avec succès depuis votre MacBook !");
                if (window.soundEngine && window.soundEngine.playSuccess) {
                    window.soundEngine.playSuccess();
                }
            } catch (err) {
                console.error("Erreur lecture sauvegarde :", err);
                alert("Impossible de charger ce fichier : Veuillez sélectionner un fichier .json de sauvegarde valide de l'aventure.");
            }
        };
        reader.onerror = () => {
            alert("Erreur de lecture du fichier sur votre MacBook.");
        };
        reader.readAsText(file);
    }

    refreshLoadGameModalPreview() {
        const previewContainer = document.getElementById("local-save-preview-card");
        if (!previewContainer) return;

        const raw = localStorage.getItem("chroniques_croissant_save");
        if (!raw) {
            previewContainer.innerHTML = `
                <div class="local-save-empty">
                    <span style="font-size: 1.2rem;">ℹ️</span>
                    <span>Aucune sauvegarde locale trouvée dans le navigateur.</span>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
                        Utilisez l'Option 1 ci-dessus pour importer votre fichier de sauvegarde .json depuis votre MacBook.
                    </p>
                </div>
            `;
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            const player = parsed.player || parsed;
            if (player && player.currentNodeId) {
                const node = this.storyData?.nodes?.[player.currentNodeId];
                const chapterTitle = node ? `${node.chapter || ''} · ${node.chapterTitle || ''}` : "En cours";
                const cls = this.storyData?.classes?.[player.classId] || { name: "Aventurier", avatar: "📜" };
                const heroName = player.name || "Héros";
                const time = parsed.timestamp || "Récemment";

                previewContainer.innerHTML = `
                    <div class="local-save-card-inner">
                        <div class="local-save-hero-avatar">
                            ${cls.avatar || '📜'}
                        </div>
                        <div class="local-save-info">
                            <div class="local-save-name">${heroName} <span class="local-save-class">(${cls.name})</span></div>
                            <div class="local-save-chapter">📍 ${chapterTitle}</div>
                            <div class="local-save-time">🕒 Enregistré le : ${time}</div>
                            <div class="local-save-mini-stats">
                                <span>📖 ${player.stats?.savoir || 50}%</span>
                                <span>👑 ${player.stats?.influence || 50}%</span>
                                <span>🏺 ${player.stats?.richesse || 50}%</span>
                                <span>✨ ${player.stats?.destin || 50}%</span>
                            </div>
                        </div>
                        <button class="btn-resume-start" id="btn-load-local-save">
                            Reprendre cette partie ➔
                        </button>
                    </div>
                `;

                const loadBtn = document.getElementById("btn-load-local-save");
                if (loadBtn) {
                    loadBtn.onclick = () => {
                        this.closeLoadGameModal();
                        this.resumeGame(player);
                    };
                }
            }
        } catch (e) {
            previewContainer.innerHTML = `
                <div class="local-save-empty">
                    <span>Erreur de lecture de la sauvegarde locale.</span>
                </div>
            `;
        }
    }

    checkSavedGame() {
        const raw = localStorage.getItem("chroniques_croissant_save");
        const quickResume = document.getElementById("menu-quick-resume");
        const quickResumeInfo = document.getElementById("menu-quick-resume-info");
        const resumeBox = document.getElementById("resume-game-box");

        if (!raw) {
            if (quickResume) quickResume.style.display = "none";
            if (resumeBox) resumeBox.style.display = "none";
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            const player = parsed.player || parsed;
            if (player && player.currentNodeId) {
                const node = this.storyData?.nodes?.[player.currentNodeId];
                const chapterTitle = node ? `${node.chapter || ''} · ${node.chapterTitle || ''}` : "En cours";
                const heroName = player.name || "Héros";
                const time = parsed.timestamp ? `(${parsed.timestamp})` : "";

                if (quickResume && quickResumeInfo) {
                    quickResume.style.display = "flex";
                    quickResumeInfo.innerHTML = `${heroName} — ${chapterTitle} <em>${time}</em>`;
                }

                if (resumeBox) {
                    resumeBox.style.display = "flex";
                    const detailsText = document.getElementById("resume-details-text");
                    if (detailsText) {
                        detailsText.innerHTML = `${heroName} — ${chapterTitle} <em>${time}</em>`;
                    }
                    const btn = document.getElementById("btn-resume-game");
                    if (btn) {
                        btn.onclick = () => this.resumeGame(player);
                    }
                }
            }
        } catch (e) {
            console.warn("Erreur chargement sauvegarde :", e);
        }
    }

    loadSavedGame() {
        const raw = localStorage.getItem("chroniques_croissant_save");
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                const player = parsed.player || parsed;
                if (player && player.currentNodeId) {
                    this.resumeGame(player);
                }
            } catch(e) {}
        }
    }

    resumeGame(savedPlayer) {
        this.player = savedPlayer;
        if (!this.player.inventory) {
            this.player.inventory = [];
        }
        if (window.soundEngine) {
            window.soundEngine.startAtmosphere();
        }

        const mainMenu = document.getElementById("main-menu-screen");
        if (mainMenu) mainMenu.style.display = "none";

        document.getElementById("start-screen").style.display = "none";
        document.getElementById("story-screen").style.display = "flex";
        document.getElementById("game-hud").style.display = "flex";

        const loadModal = document.getElementById("load-game-modal");
        if (loadModal) loadModal.style.display = "none";

        const tutModal = document.getElementById("tutorial-modal");
        if (tutModal) tutModal.style.display = "none";

        this.updateHUD();
        this.goToNode(this.player.currentNodeId, false);
    }

    // ==========================================
    // GESTION DU PLEIN ÉCRAN & ÉVÉNEMENTS GLOBAUX
    // ==========================================
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        }
    }

    bindGlobalEvents() {
        // Plein écran
        const fullscreenBtn = document.getElementById("btn-fullscreen") || document.getElementById("btn-fullscreen-toggle");
        if (fullscreenBtn) {
            fullscreenBtn.onclick = () => this.toggleFullscreen();
        }

        // Codex
        const codexBtn = document.getElementById("btn-codex");
        if (codexBtn) {
            codexBtn.onclick = () => {
                if (window.codexManager) window.codexManager.openModal();
            };
        }

        const closeCodexBtn = document.getElementById("btn-close-codex");
        if (closeCodexBtn) {
            closeCodexBtn.onclick = () => {
                if (window.codexManager) window.codexManager.closeModal();
            };
        }

        // Relire / Rewind dialogue
        const rewindBtn = document.getElementById("btn-dialogue-rewind");
        if (rewindBtn) {
            rewindBtn.onclick = () => this.replayCurrentDialogue();
        }

        // Clic sur conteneur dialogue pour accélérer
        const dialogueContainer = document.getElementById("dialogue-container");
        if (dialogueContainer) {
            dialogueContainer.addEventListener("click", (e) => {
                if (e.target.closest("button") || e.target.closest(".text-size-controls") || e.target.closest("[data-glossary]")) {
                    return;
                }
                if (this.isTyping) {
                    this.skipTypewriter();
                }
            });
        }

        // Raccourcis clavier (Espace/Entrée pour passer texte, 1-4 pour choix)
        window.addEventListener("keydown", (e) => {
            const loadModal = document.getElementById("load-game-modal");
            if (loadModal && loadModal.style.display !== "none") {
                if (e.code === "Escape") this.closeLoadGameModal();
                return;
            }

            const tutModal = document.getElementById("tutorial-modal");
            if (tutModal && tutModal.style.display !== "none") {
                if (e.code === "Escape") this.closeTutorialModal();
                return;
            }

            const audioModal = document.getElementById("audio-settings-modal");
            if (audioModal && audioModal.style.display !== "none") {
                if (e.code === "Escape") this.closeAudioModal();
                return;
            }

            const mainMenu = document.getElementById("main-menu-screen");
            if (mainMenu && mainMenu.style.display !== "none") return;

            const minigameOverlay = document.getElementById("minigame-overlay");
            if (minigameOverlay && minigameOverlay.style.display !== "none") return;

            const examOverlay = document.getElementById("exam-overlay");
            if (examOverlay && examOverlay.style.display !== "none") return;

            const startScreen = document.getElementById("start-screen");
            if (startScreen && startScreen.style.display !== "none") {
                if (e.code === "Escape") this.showMainMenu();
                return;
            }

            const activeInput = document.activeElement;
            if (activeInput && (activeInput.tagName === "INPUT" || activeInput.tagName === "TEXTAREA")) return;
            
            if (e.code === "Space" || e.code === "Enter") {
                if (this.isTyping) {
                    e.preventDefault();
                    this.skipTypewriter();
                }
            } else if (["Digit1", "Digit2", "Digit3", "Digit4", "Numpad1", "Numpad2", "Numpad3", "Numpad4"].includes(e.code)) {
                if (!this.isTyping && !this.isChoiceLocked) {
                    const keyNum = parseInt(e.key, 10);
                    const choicesContainer = document.getElementById("dialogue-choices-container");
                    if (choicesContainer && choicesContainer.children.length >= keyNum) {
                        const targetBtn = choicesContainer.children[keyNum - 1];
                        if (targetBtn) targetBtn.click();
                    }
                }
            }
        });
    }

    // ==========================================
    // MODALES AUDIO & MÉDAILLES
    // ==========================================
    initAudioModalEvents() {
        const modalToggle = document.getElementById("btn-audio-modal-toggle");
        const modal = document.getElementById("audio-settings-modal");
        const closeBtn = document.getElementById("btn-close-audio");
        const musicSlider = document.getElementById("vol-music");
        const sfxSlider = document.getElementById("vol-sfx");

        if (modalToggle) {
            modalToggle.onclick = () => this.openAudioModal();
        }
        if (closeBtn) {
            closeBtn.onclick = () => this.closeAudioModal();
        }
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) this.closeAudioModal();
            });
        }
        if (musicSlider) {
            musicSlider.oninput = (e) => {
                if (window.soundEngine) window.soundEngine.setMusicVolume(e.target.value);
            };
        }
        if (sfxSlider) {
            sfxSlider.oninput = (e) => {
                if (window.soundEngine) window.soundEngine.setSfxVolume(e.target.value);
            };
        }
    }

    openAudioModal() {
        const modal = document.getElementById("audio-settings-modal");
        if (!modal) return;

        if (window.soundEngine) {
            const musicInput = document.getElementById("vol-music");
            const sfxInput = document.getElementById("vol-sfx");
            const musicLabel = document.getElementById("vol-music-val");
            const sfxLabel = document.getElementById("vol-sfx-val");
            const muteText = document.getElementById("modal-mute-text");

            if (musicInput && typeof window.soundEngine.musicVolume === "number") {
                musicInput.value = window.soundEngine.musicVolume;
            }
            if (sfxInput && typeof window.soundEngine.sfxVolume === "number") {
                sfxInput.value = window.soundEngine.sfxVolume;
            }
            if (musicLabel && typeof window.soundEngine.musicVolume === "number") {
                musicLabel.innerText = `${Math.round(window.soundEngine.musicVolume * 100)}%`;
            }
            if (sfxLabel && typeof window.soundEngine.sfxVolume === "number") {
                sfxLabel.innerText = `${Math.round(window.soundEngine.sfxVolume * 100)}%`;
            }
            if (muteText) {
                muteText.innerText = window.soundEngine.isMuted ? "🔊 Rétablir le son" : "🔇 Couper tout le son";
            }
        }

        modal.style.display = "flex";
        if (window.soundEngine && window.soundEngine.playChoice) {
            window.soundEngine.playChoice();
        }
    }

    closeAudioModal() {
        const modal = document.getElementById("audio-settings-modal");
        if (modal) modal.style.display = "none";
    }

    toggleMuteFromModal() {
        if (!window.soundEngine) return;
        const isMuted = window.soundEngine.toggleMute();
        const muteText = document.getElementById("modal-mute-text");
        if (muteText) {
            muteText.innerText = isMuted ? "🔊 Rétablir le son" : "🔇 Couper tout le son";
        }
        const audioIcon = document.getElementById("audio-icon-span");
        if (audioIcon) {
            audioIcon.innerText = isMuted ? "🔇" : "🔊";
        }
    }

    initMedalsModalEvents() {
        const modalBtn = document.getElementById("btn-medals");
        const modal = document.getElementById("medals-modal");
        const closeBtn = document.getElementById("btn-close-medals");

        if (modalBtn && modal) {
            modalBtn.onclick = () => {
                this.renderMedalsGrid();
                modal.style.display = "flex";
            };
        }
        if (closeBtn && modal) {
            closeBtn.onclick = () => { modal.style.display = "none"; };
        }
    }

    renderMedalsGrid() {
        const grid = document.getElementById("medals-grid-container");
        if (!grid) return;
        grid.innerHTML = "";

        this.medalsList.forEach(m => {
            const isUnlocked = this.player.unlockedMedals.includes(m.id);
            const card = document.createElement("div");
            card.className = `medal-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="medal-icon">${m.icon}</div>
                <div class="medal-info">
                    <h4>${m.title} ${isUnlocked ? '✓' : '🔒'}</h4>
                    <p>${m.desc}</p>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    unlockMedal(id) {
        if (!this.player.unlockedMedals.includes(id)) {
            this.player.unlockedMedals.push(id);
            const medal = this.medalsList.find(m => m.id === id);
            if (medal) {
                this.showButterflyToast(`🏅 Médaille débloquée : ${medal.title} !`);
                if (window.soundEngine) window.soundEngine.playSuccess();
            }
        }
    }

    // ==========================================
    // SACOCHE DES ARTEFACTS HISTORIQUES (MODULE 3)
    // ==========================================
    initInventoryModalEvents() {
        const modalBtn = document.getElementById("btn-inventory");
        const modal = document.getElementById("inventory-modal");
        const closeBtn = document.getElementById("btn-close-inventory");

        if (modalBtn) {
            modalBtn.onclick = () => this.openInventoryModal();
        }
        if (closeBtn) {
            closeBtn.onclick = () => this.closeInventoryModal();
        }
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) this.closeInventoryModal();
            });
        }
    }

    openInventoryModal() {
        if (!this.player.inventory) this.player.inventory = [];
        const modal = document.getElementById("inventory-modal");
        if (!modal) return;

        this.renderInventory();
        modal.style.display = "flex";
        if (window.soundEngine && window.soundEngine.playChoice) {
            window.soundEngine.playChoice();
        }
    }

    closeInventoryModal() {
        const modal = document.getElementById("inventory-modal");
        if (modal) modal.style.display = "none";
    }

    unlockArtifact(artifactId) {
        if (!this.player.inventory) this.player.inventory = [];

        // Normalisation d'identifiants (supporte les variantes courtes sans régression)
        const idMap = {
            "calame": "calame_roseau",
            "calame_roseau": "calame_roseau",
            "sceau": "sceau_cylindre",
            "sceau_cylindre": "sceau_cylindre",
            "papyrus": "fragment_papyrus",
            "fragment_papyrus": "fragment_papyrus",
            "lapis": "perle_lapis",
            "perle_lapis": "perle_lapis"
        };
        const canonicalId = idMap[artifactId] || artifactId;

        if (this.player.inventory.includes(canonicalId)) return;

        const artifact = window.HISTORICAL_ARTIFACTS?.[canonicalId];
        if (!artifact) return;

        this.player.inventory.push(canonicalId);
        this.updateInventoryHUD();

        // Sonorité spécifique à la matière de l'artefact
        if (window.soundEngine) {
            if (artifact.soundType === "reed" && window.soundEngine.playClay) {
                window.soundEngine.playClay();
            } else if (artifact.soundType === "seal" && window.soundEngine.playSealRoll) {
                window.soundEngine.playSealRoll();
            } else if (artifact.soundType === "gem" && window.soundEngine.playGemChime) {
                window.soundEngine.playGemChime();
            } else if (artifact.soundType === "papyrus" && window.soundEngine.playPapyrus) {
                window.soundEngine.playPapyrus();
            } else if (window.soundEngine.playSuccess) {
                window.soundEngine.playSuccess();
            }
        }

        if (window.toastManager) {
            window.toastManager.show({
                className: "artifact-toast",
                icon: artifact.icon || "🏺",
                title: "Nouvel Artefact Découvert !",
                message: `<strong>${artifact.name}</strong> a rejoint votre sacoche d'archéologue !`,
                duration: 6500
            });
        }
    }

    updateInventoryHUD() {
        if (!this.player.inventory) this.player.inventory = [];
        const count = this.player.inventory.length;
        const countEl = document.getElementById("hud-inventory-count");
        if (countEl) {
            countEl.innerText = count;
            countEl.style.display = count > 0 ? "inline-flex" : "none";
        }
        const collectedPill = document.getElementById("inventory-collected-count");
        if (collectedPill) {
            collectedPill.innerText = count;
        }
    }

    renderInventory() {
        const grid = document.getElementById("inventory-grid");
        if (!grid || !window.HISTORICAL_ARTIFACTS) return;

        const artifacts = Object.values(window.HISTORICAL_ARTIFACTS);
        const collected = this.player.inventory || [];

        // Si aucun sélectionné, choisir le premier débloqué ou le premier slot
        if (!this.selectedArtifactId || !window.HISTORICAL_ARTIFACTS[this.selectedArtifactId]) {
            const firstUnlocked = artifacts.find(a => collected.includes(a.id));
            this.selectedArtifactId = firstUnlocked ? firstUnlocked.id : artifacts[0].id;
        }

        grid.innerHTML = artifacts.map(a => {
            const isUnlocked = collected.includes(a.id);
            const isSelected = this.selectedArtifactId === a.id;
            let cardClasses = "inventory-slot-card";
            if (isUnlocked) cardClasses += " unlocked";
            else cardClasses += " locked";
            if (isSelected) cardClasses += " selected";

            return `
                <div class="${cardClasses}" onclick="window.gameEngine.inspectArtifact('${a.id}')" role="button" tabindex="0">
                    <div class="inv-slot-badge">${isUnlocked ? '✨ Acquis' : '🔒 Verrouillé'}</div>
                    <div class="inv-slot-icon">${isUnlocked ? a.icon : '❓'}</div>
                    <div class="inv-slot-info">
                        <div class="inv-slot-title">${isUnlocked ? a.name : 'Artefact Mystère'}</div>
                        <div class="inv-slot-period">${isUnlocked ? a.period : 'À découvrir dans votre aventure'}</div>
                    </div>
                </div>
            `;
        }).join('');

        this.inspectArtifact(this.selectedArtifactId);
    }

    inspectArtifact(id) {
        this.selectedArtifactId = id;
        const artifact = window.HISTORICAL_ARTIFACTS?.[id];
        const panel = document.getElementById("inventory-inspector-panel");
        if (!artifact || !panel) return;

        // Mise à jour de la sélection visuelle dans la grille
        const cards = document.querySelectorAll(".inventory-slot-card");
        cards.forEach(c => c.classList.remove("selected"));
        const artifacts = Object.values(window.HISTORICAL_ARTIFACTS);
        const idx = artifacts.findIndex(a => a.id === id);
        if (cards[idx]) cards[idx].classList.add("selected");

        const isUnlocked = (this.player.inventory || []).includes(id);

        if (!isUnlocked) {
            panel.innerHTML = `
                <div class="inspector-locked-view">
                    <div class="locked-silhouette-icon">🔒</div>
                    <h3 style="font-family:var(--font-title); color:var(--gold-light); margin-bottom:8px;">Relique Non Encore Découverte</h3>
                    <p style="color:var(--text-secondary); max-width:420px; margin:0 auto 16px; font-size:0.95rem; line-height:1.6;">
                        Cet artefact historique repose encore dans les strates archéologiques du Croissant Fertile.
                        Poursuivez vos missions et vos choix historiques pour le retrouver !
                    </p>
                    <div class="inspector-unlock-hint">
                        💡 <em>Indice : Poursuivez votre aventure et accomplissez les mini-jeux pour enrichir votre sacoche !</em>
                    </div>
                </div>
            `;
            return;
        }

        panel.innerHTML = `
            <div class="inspector-content-view">
                <div class="inspector-visual-stage">
                    <div class="inspector-svg-container" id="inspector-svg-stage">
                        ${artifact.svg || `<div style="font-size:5rem;">${artifact.icon}</div>`}
                    </div>
                    <div class="inspector-audio-action">
                        <button class="btn-inspect-sound" onclick="window.gameEngine.playArtifactSound('${artifact.soundType}')" title="Écouter le son de la matière">
                            <span>🔊</span> Écouter la matière antique
                        </button>
                    </div>
                </div>

                <div class="inspector-meta-box">
                    <div class="inspector-tags-row">
                        <span class="inspector-period-tag">${artifact.period}</span>
                        <span class="inspector-category-tag">${artifact.category}</span>
                    </div>

                    <h3 class="inspector-artifact-name">${artifact.name}</h3>

                    <div class="inspector-concept-card">
                        <div class="inspector-concept-header">
                            <span>🏛️ Notion Pédagogique Clé (Module 3)</span>
                        </div>
                        <p class="inspector-concept-text">${artifact.conceptModule3}</p>
                    </div>

                    <p class="inspector-lore-text">${artifact.lore}</p>

                    <div class="inspector-specs-table">
                        ${(artifact.specs || []).map(s => `
                            <div class="inspector-spec-row">
                                <span class="spec-label">${s.label} :</span>
                                <span class="spec-val">${s.val}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        const svgStage = document.getElementById("inspector-svg-stage");
        if (svgStage) {
            svgStage.classList.add("inspector-pop-in");
        }
    }

    playArtifactSound(soundType) {
        if (!window.soundEngine) return;
        if (soundType === "reed" && window.soundEngine.playClay) {
            window.soundEngine.playClay();
        } else if (soundType === "seal" && window.soundEngine.playSealRoll) {
            window.soundEngine.playSealRoll();
        } else if (soundType === "gem" && window.soundEngine.playGemChime) {
            window.soundEngine.playGemChime();
        } else if (soundType === "papyrus" && window.soundEngine.playPapyrus) {
            window.soundEngine.playPapyrus();
        } else if (window.soundEngine.playCoins) {
            window.soundEngine.playCoins();
        }
    }

    recordMinigameCompletion(minigameId, isFirstTry = false) {
        if (!this.player.completedMinigames) {
            this.player.completedMinigames = [];
        }
        if (!this.player.completedMinigames.includes(minigameId)) {
            this.player.completedMinigames.push(minigameId);
        }
        this.saveGame();
    }

    // ==========================================
    // ÉCRAN DE DÉPART : SÉLECTION DE LA CLASSE
    // ==========================================
    renderClassSelection() {
        const grid = document.getElementById("class-selection-grid");
        if (!grid) return;

        grid.innerHTML = "";
        Object.values(this.storyData.classes).forEach(cls => {
            const card = document.createElement("div");
            card.className = `class-card ${cls.id === this.player.classId ? 'selected' : ''}`;
            card.id = `class-card-${cls.id}`;
            card.innerHTML = `
                <div class="class-card-img-wrap">
                    <img src="${cls.image || 'assets/images/char_hero_scribe.jpg'}" alt="${cls.name}" class="class-hero-img">
                    <div class="class-avatar-badge">${cls.avatar}</div>
                </div>
                <h3 class="class-card-title">${cls.name}</h3>
                <div class="class-card-subtitle">${cls.tagline}</div>
                <p class="class-card-desc">${cls.description}</p>
                <div class="class-stats-preview">
                    <span class="stat-chip" title="Savoir">📖 ${cls.baseStats.savoir}</span>
                    <span class="stat-chip" title="Influence">👑 ${cls.baseStats.influence}</span>
                    <span class="stat-chip" title="Richesse">🏺 ${cls.baseStats.richesse}</span>
                    <span class="stat-chip" title="Destin">✨ ${cls.baseStats.destin}</span>
                </div>
            `;
            card.onclick = () => this.selectClass(cls.id);
            grid.appendChild(card);
        });
    }

    selectClass(classId) {
        this.player.classId = classId;
        const cards = document.querySelectorAll(".class-card");
        cards.forEach(c => c.classList.remove("selected"));
        const target = document.getElementById(`class-card-${classId}`);
        if (target) target.classList.add("selected");
        if (window.soundEngine) window.soundEngine.playChoice();
    }

    startGame() {
        const nameInput = document.getElementById("hero-name-input");
        if (nameInput && nameInput.value.trim() !== "") {
            this.player.name = nameInput.value.trim();
        }

        const selectedClass = this.storyData.classes[this.player.classId];
        this.player.stats = { ...selectedClass.baseStats };
        this.player.currentNodeId = selectedClass.startNodeId || "ch1_scribe_start";
        this.player.flags = {};
        this.player.clues = [];
        this.player.decisions = [];
        this.player.history = [];
        this.player.unlockedMedals = [];

        this.unlockMedal("first_step");

        if (window.soundEngine) {
            window.soundEngine.startAtmosphere();
        }

        const mainMenu = document.getElementById("main-menu-screen");
        if (mainMenu) mainMenu.style.display = "none";

        document.getElementById("start-screen").style.display = "none";
        document.getElementById("story-screen").style.display = "flex";
        document.getElementById("game-hud").style.display = "flex";

        this.updateHUD();
        this.goToNode(this.player.currentNodeId, false);
    }

    updateHUD() {
        const heroNameEl = document.getElementById("hud-hero-name");
        const heroClassEl = document.getElementById("hud-hero-class");
        const heroAvatarImg = document.getElementById("hud-hero-avatar-img");

        const cls = this.storyData.classes[this.player.classId];

        if (heroNameEl) heroNameEl.innerText = this.player.name;
        if (heroClassEl) heroClassEl.innerText = cls.name;
        if (heroAvatarImg && (cls.avatarImg || cls.image)) {
            heroAvatarImg.src = cls.avatarImg || cls.image;
        }

        this.updateGauge("savoir", this.player.stats.savoir);
        this.updateGauge("influence", this.player.stats.influence);
        this.updateGauge("richesse", this.player.stats.richesse);
        this.updateGauge("destin", this.player.stats.destin);

        this.updateCluesHUD();
        this.updateInventoryHUD();
    }

    updateCluesHUD() {
        let cluesCountEl = document.getElementById("hud-clues-count");
        if (!cluesCountEl) {
            const hudActions = document.querySelector(".hud-actions");
            if (hudActions) {
                const clueBadge = document.createElement("div");
                clueBadge.id = "hud-clues-badge";
                clueBadge.className = "hud-clues-badge";
                clueBadge.title = "Pièces à conviction et indices découverts";
                clueBadge.innerHTML = `🔍 <span id="hud-clues-count">0</span> indice(s)`;
                hudActions.insertBefore(clueBadge, hudActions.firstChild);
            }
        }
        cluesCountEl = document.getElementById("hud-clues-count");
        if (cluesCountEl) {
            cluesCountEl.innerText = this.player.clues.length;
        }
    }

    updateGauge(statName, value) {
        const clamped = Math.max(0, Math.min(100, value));
        const fillEl = document.getElementById(`gauge-fill-${statName}`);
        const valEl = document.getElementById(`gauge-val-${statName}`);

        if (fillEl) fillEl.style.width = `${clamped}%`;
        if (valEl) valEl.innerText = `${clamped}%`;
    }

    updateChapterProgress(chapterStr) {
        let currentChapNum = 1;
        if (chapterStr.includes("II") || chapterStr.includes("2")) currentChapNum = 2;
        else if (chapterStr.includes("III") || chapterStr.includes("3")) currentChapNum = 3;
        else if (chapterStr.includes("IV") || chapterStr.includes("4")) currentChapNum = 4;
        else if (chapterStr.includes("V") || chapterStr.includes("5")) currentChapNum = 5;

        for (let i = 1; i <= 5; i++) {
            const stepEl = document.getElementById(`chapter-step-${i}`) || document.getElementById(`ch-step-${i}`);
            if (stepEl) {
                stepEl.classList.remove("active", "completed");
                if (i < currentChapNum) stepEl.classList.add("completed");
                else if (i === currentChapNum) stepEl.classList.add("active");
            }
        }

        // Mise à jour des lignes de liaison entre les perles
        const beadConnectors = document.querySelectorAll(".bead-connector");
        beadConnectors.forEach((conn, idx) => {
            if (idx + 1 < currentChapNum) {
                conn.classList.add("completed");
            } else {
                conn.classList.remove("completed");
            }
        });

        const beadsContainer = document.getElementById("cartouche-progress-beads");
        if (beadsContainer) {
            beadsContainer.setAttribute("aria-valuenow", currentChapNum);
        }

        const barContainer = document.getElementById("chapter-progress-container");
        if (barContainer) barContainer.style.display = "none";

        if (window.soundEngine && window.soundEngine.setChapter) {
            window.soundEngine.setChapter(currentChapNum);
        }
    }

    resolveCharacterSprite(node, nodeId) {
        if (node.characterSprite) return node.characterSprite;

        const charName = node.character;
        if (!charName || charName === "Narrateur") return null;

        if (charName === "Maître Arad-Nanna") {
            return nodeId === "ch1_scribe_start" 
                ? "assets/images/char_arad_nanna_worried.jpg" 
                : "assets/images/char_arad_nanna_neutral.jpg";
        }
        if (charName === "Capitaine Nergal" || charName === "Le Roi Hammurabi" || charName === "Le Roi Hammourabi") {
            return "assets/images/char_nergal_neutral.jpg";
        }
        if (charName === "Sin-Iddinam" || charName === "Gudea le Marchand" || charName === "Conseiller Royal Lu-Enlil") {
            return "assets/images/char_hero_artisan.jpg";
        }
        if (charName === "Ur-Zababa") {
            return "assets/images/char_hero_batisseur.jpg";
        }
        if (charName === "Grande Prêtresse Enheduanna" || charName === "Le Grand Pharaon" || charName === "Le Grand Chroniqueur") {
            return "assets/images/char_priestess_enheduanna.jpg";
        }
        if (charName === "Le Sage Enki") {
            return "assets/images/char_arad_nanna_neutral.jpg";
        }
        if (charName === "Le Vizir Rekhmirê") {
            return "assets/images/char_hero_scribe.jpg";
        }
        if (charName === this.player.name) {
            return this.storyData.classes[this.player.classId]?.image;
        }
        return "assets/images/char_arad_nanna_neutral.jpg";
    }

    showButterflyToast(message) {
        let title = "Conséquence dans le Temps";
        let icon = "🦋";

        if (typeof message === "string") {
            if (message.includes("💾") || message.includes("enregistrée")) {
                title = "Sauvegarde";
                icon = "💾";
            } else if (message.includes("✅") || message.includes("chargée")) {
                title = "Partie Chargée";
                icon = "✅";
            } else if (message.includes("🏅") || message.includes("Médaille")) {
                title = "Médaille Débloquée";
                icon = "🏅";
            }
        }

        if (window.toastManager) {
            return window.toastManager.show({
                className: "butterfly-toast",
                icon: icon,
                title: title,
                message: message,
                duration: 5500
            });
        }
    }

    showClueToast(clueText) {
        if (window.toastManager) {
            return window.toastManager.show({
                className: "clue-toast",
                icon: "🔍",
                title: "Nouvelle Pièce à Conviction",
                message: clueText,
                duration: 5000
            });
        }
    }

    // ==========================================
    // FORMATION DYNAMIQUE DU TEXTE & PERSONNALISATION PNJ
    // ==========================================
    formatDynamicText(str) {
        if (!str || typeof str !== "string") return str;
        const name = this.player?.name || "Aventurier";
        const classId = this.player?.classId || "scribe";

        const pastMap = {
            scribe: "toi qui as usé tes calames sur les tablettes d'argile de l'Édubba d'Ur",
            soldat: "toi qui as tenu la lance de bronze et monté la garde sur les remparts sous le soleil de plomb",
            artisan: "toi qui as négocié le blé et manœuvré les barques de troc le long de l'Euphrate",
            batisseur: "toi qui as calculé la pente des canaux et damé la terre glaise des grandes digues"
        };

        const titleMap = {
            scribe: "Érudit(e) des Textes",
            soldat: "Sentinelle des Portes",
            artisan: "Négociant(e) du Fleuve",
            batisseur: "Architecte des Eaux"
        };

        const originCallMap = {
            scribe: `${name}, enfant de l'Édubba`,
            soldat: `${name}, sentinelle des remparts`,
            artisan: `${name}, maître du troc`,
            batisseur: `${name}, bâtisseur des digues`
        };

        const gudeaPostureMap = {
            soldat: "« Un soldat comme toi connaît le poids de la discipline, mais ici, c'est l'or qui dicte sa loi ! »",
            artisan: "« Toi qui as le flair d'un marchand, tu sais bien qu'ici sur les quais, c'est l'or qui dicte sa loi ! »",
            scribe: "« Toi qui as l'habitude du silence des archives, ouvre grand les yeux : ici, c'est l'or qui dicte sa loi ! »",
            batisseur: "« Toi qui bâtis digues et canaux, prends garde aux pièges de la cité : ici, c'est l'or qui dicte sa loi ! »"
        };

        let verdictRep = "une grande sagacité";
        if (this.player?.flags?.flag_verdict === "strict") {
            verdictRep = "une sévérité d'airain";
        } else if (this.player?.flags?.flag_verdict === "clemency") {
            verdictRep = "une clémence et une humanité audacieuses";
        } else if (this.player?.flags?.flag_verdict === "metier") {
            verdictRep = "un arbitrage d'expert digne de ton rang";
        }

        let portVerdictEcho = "";
        if (this.player?.flags?.hammurabi_strict_justice) {
            portVerdictEcho = `
                <p class="vn-speech-action"><em>*Une rumeur hostile parcourt les pontons. Les bateliers et portefaix évitent votre regard.*</em></p>
                <p class="vn-speaker"><strong>Sin-Iddinam le Batelier :</strong> « Votre sévérité d'airain envers l'artisan Nannar a glacé les cœurs, {HERO_NAME}, {HERO_TITLE}. Les bateliers du peuple murmurent avec amertume. Par défiance, ils refusent de charger les vivres de secours sans un ordre écrit du Roi : le voyage vers l'Égypte sera rude et les rations rationnées ! »</p>
            `;
        } else if (this.player?.flags?.hammurabi_clemency_granted) {
            portVerdictEcho = `
                <p class="vn-speech-action"><em>*Sur les berges de Babylone, un jeune garçon timide fend la foule et glisse un objet poli dans votre paume.*</em></p>
                <p class="vn-speaker"><strong>Fils de l'Artisan Nannar :</strong> « {HERO_ORIGIN_CALL} ! Ma famille te bénit chaque jour. Grâce à ta clémence, mon père a la vie sauve et mes frères ont du pain. Prends ce talisman d'obsidienne protecteur gravé par mon père : qu'il veille sur toi sur les flots du Nil ! »</p>
            `;
        } else if (this.player?.flags?.hammurabi_metier_justice) {
            portVerdictEcho = `
                <p class="vn-speech-action"><em>*Les artisans et les sentinelles des quais forment une haie d'honneur solidaire le long du fleuve.*</em></p>
                <p class="vn-speaker"><strong>Sin-Iddinam le Batelier :</strong> « {HERO_ORIGIN_CALL}, votre arbitrage éclairé au tribunal royal a réconcilié la justice et les travailleurs. Les corporations se sont cotisées pour équiper notre nef avec les meilleurs agrès ! »</p>
            `;
        } else {
            portVerdictEcho = `
                <p class="vn-speech-action"><em>*Le vent gonfle les voiles des barges royales tandis que les mariniers hissent les amarres.*</em></p>
                <p class="vn-speaker"><strong>Sin-Iddinam le Batelier :</strong> « Toutes les voiles sont parées, {HERO_NAME} ! Cap sur le delta du Nil et le domaine de Pharaon ! »</p>
            `;
        }

        let res = str.replace(/\{PORT_VERDICT_ECHO\}/g, portVerdictEcho);
        res = res
            .replace(/\{HERO_NAME\}/g, name)
            .replace(/\{HERO_PAST\}/g, pastMap[classId] || pastMap.scribe)
            .replace(/\{HERO_TITLE\}/g, titleMap[classId] || titleMap.scribe)
            .replace(/\{HERO_ORIGIN_CALL\}/g, originCallMap[classId] || `${name}, enfant d'Ur`)
            .replace(/\{GUDEA_POSTURE_REMARK\}/g, gudeaPostureMap[classId] || gudeaPostureMap.artisan)
            .replace(/\{VERDICT_REPUTATION\}/g, verdictRep);

        return res;
    }

    // ==========================================
    // TRANSITION VISUELLE & AFFICHAGE DU NŒUD
    // ==========================================
    goToNode(nodeId, triggerSave = false) {
        const node = this.storyData.nodes[nodeId];
        if (!node) return;

        this.player.currentNodeId = nodeId;
        this.player.history.push(nodeId);

        // Zéro auto-save : la sauvegarde s'effectue manuellement via l'icône de disquette sur le MacBook
        // (Préservation totale de l'état sans écrasement automatique)

        // Déblocage automatique de concepts dans le Codex
        if (node.conceptUnlocked && window.codexManager) {
            window.codexManager.unlock(node.conceptUnlocked);
        }

        // Déblocage chirurgical des 4 artefacts tangibles aux jalons narratifs
        if (node.artifactUnlocked) {
            this.unlockArtifact(node.artifactUnlocked);
        } else if (nodeId === "ch1_scribe_start" || nodeId === "ch1_artisan_start" || nodeId === "ch1_soldat_start" || nodeId === "ch1_batisseur_start") {
            this.unlockArtifact("calame");
        } else if (nodeId === "ch2_babylon_entrance") {
            this.unlockArtifact("sceau_cylindre");
        } else if (nodeId === "ch3_ziggurat_arrival") {
            this.unlockArtifact("perle_lapis");
        } else if (nodeId === "ch5_nile_arrival") {
            this.unlockArtifact("papyrus");
        }

        if (node.isEndgame) {
            this.showEndgame();
            return;
        }

        // Mise à jour de la barre de chapitres
        this.updateChapterProgress(node.chapter || "Chapitre I");

        // Mise à jour de l'environnement de la scène
        const chapterTag = document.getElementById("scene-chapter-tag");
        const locationTitle = document.getElementById("scene-location-title");
        const speakerName = document.getElementById("dialogue-speaker-name");
        const speakerRole = document.getElementById("dialogue-speaker-role");
        const dialogueText = document.getElementById("dialogue-text-body");
        const choicesContainer = document.getElementById("dialogue-choices-container");
        const sceneViewport = document.getElementById("scene-viewport");
        const dialogueBox = document.getElementById("dialogue-box");

        if (chapterTag) {
            let chapStr = node.chapter || "Chapitre I";
            if (chapStr.startsWith("Chapitre ") && !chapStr.includes(" sur ")) {
                chapStr = `${chapStr} sur V`;
            } else if (chapStr === "Intermède Historique") {
                chapStr = "Intermède • Vers le Chapitre V";
            }
            chapterTag.innerText = chapStr;
        }
        if (locationTitle) {
            const locText = node.chapterTitle ? `${node.chapterTitle} • ${node.location || ""}` : (node.location || "");
            locationTitle.innerText = locText;
            locationTitle.title = locText;
        }
        if (speakerName) speakerName.innerText = node.character || "Narrateur";
        if (speakerRole) speakerRole.innerText = node.characterRole || "";

        // Stylisation dynamique selon l'orateur
        if (dialogueBox) {
            const roleStr = (node.characterRole || "").toLowerCase();
            const nameStr = (node.character || "").toLowerCase();
            if (roleStr.includes("prêtre") || nameStr.includes("prêtresse")) dialogueBox.setAttribute("data-speaker", "prêtre");
            else if (roleStr.includes("roi") || nameStr.includes("hammurabi") || nameStr.includes("hammourabi")) dialogueBox.setAttribute("data-speaker", "roi");
            else if (roleStr.includes("marchand") || nameStr.includes("marchand")) dialogueBox.setAttribute("data-speaker", "marchand");
            else if (roleStr.includes("garde") || roleStr.includes("défenseur") || nameStr.includes("nergal")) dialogueBox.setAttribute("data-speaker", "guerrier");
            else dialogueBox.removeAttribute("data-speaker");
        }

        // Ambiance de fond et mood vignette
        if (sceneViewport) {
            const container = sceneViewport.closest(".scene-container") || sceneViewport;
            if (node.mood) container.setAttribute("data-mood", node.mood);
            else container.removeAttribute("data-mood");

            if (node.bgImage) {
                sceneViewport.style.backgroundImage = `linear-gradient(0deg, rgba(15, 12, 8, 0.85) 0%, rgba(15, 12, 8, 0.25) 50%, rgba(15, 12, 8, 0.65) 100%), url('${node.bgImage}')`;
                sceneViewport.style.backgroundSize = "cover";
                sceneViewport.style.backgroundPosition = "center";
                sceneViewport.classList.add("kenburns");
                
                // Mettre à jour l'ambiance sonore continue
                if (window.soundEngine && window.soundEngine.updateSceneAmbience) {
                    window.soundEngine.updateSceneAmbience(node.bgImage);
                }
                // Mettre à jour les particules d'ambiance
                if (window.particlesCanvas && window.particlesCanvas.updateThemeFromScene) {
                    window.particlesCanvas.updateThemeFromScene(node.bgImage);
                }
            } else if (node.bgPlaceholder) {
                sceneViewport.style.background = node.bgPlaceholder;
            }
        }

        // AXE 2 & 3 : Retours d'impact visuels et sonores immédiats (Game Feel)
        if (node.shake) {
            this.triggerScreenShake(node.shake);
        }
        if (node.flash) {
            this.triggerFlashAlert();
        }
        if (node.sound) {
            this.playDiegeticSound(node.sound);
        }

        // Gestion du sprite de personnage et de l'avatar de dialogue
        const charSprite = this.resolveCharacterSprite(node, nodeId);
        const speakerAvatarFrame = document.getElementById("speaker-avatar-frame");
        const speakerAvatarImg = document.getElementById("speaker-avatar-img");
        const charWrapper = document.getElementById("scene-character-wrapper");
        const charSpriteImg = document.getElementById("scene-character-sprite");

        if (charSprite) {
            if (speakerAvatarImg) speakerAvatarImg.src = charSprite;
            if (speakerAvatarFrame) speakerAvatarFrame.style.display = "block";

            if (charSpriteImg) {
                charSpriteImg.src = charSprite;
                charSpriteImg.style.display = "block";
            }
            if (charWrapper) {
                charWrapper.style.display = "flex";
                charWrapper.classList.remove("character-enter");
                void charWrapper.offsetWidth;
                charWrapper.classList.add("character-enter");
            }
        } else {
            if (speakerAvatarFrame) speakerAvatarFrame.style.display = "none";
            if (charWrapper) charWrapper.style.display = "none";
        }

        // Remplacement dynamique du nom du héros et des balises contextuelles
        let processedText = this.formatDynamicText(node.text);

        // Construction des choix (masqués durant le typewriter)
        if (choicesContainer) {
            choicesContainer.innerHTML = "";
            choicesContainer.style.display = "none";
            choicesContainer.classList.remove("choices-revealed");
            this.isChoiceLocked = false;

            if (node.choices && node.choices.length > 0) {
                let displayedIndex = 0;
                node.choices.forEach((choice) => {
                    if (choice.reqClass) {
                        const isMatch = Array.isArray(choice.reqClass) 
                            ? choice.reqClass.includes(this.player.classId) 
                            : choice.reqClass === this.player.classId;
                        if (!isMatch) return;
                    }

                    if (choice.reqFlag) {
                        if (!this.player.flags || !this.player.flags[choice.reqFlag]) return;
                    }

                    if (choice.excludeFlag) {
                        if (this.player.flags && this.player.flags[choice.excludeFlag]) return;
                    }

                    const btn = document.createElement("button");
                    const isExclusive = !!choice.reqClass;
                    btn.className = `choice-btn ${isExclusive ? 'choice-class-exclusive' : ''}`;
                    
                    const roleLabel = isExclusive ? (this.storyData.classes[this.player.classId]?.avatar + " SPÉCIAL " + this.storyData.classes[this.player.classId]?.name.toUpperCase() + " : ") : "";
                    const keyNumber = displayedIndex + 1;

                    const choiceText = this.formatDynamicText(choice.text);
                    const impactTagText = choice.impactTag ? this.formatDynamicText(choice.impactTag) : '';

                    btn.innerHTML = `
                        <span class="choice-bullet">${String.fromCharCode(65 + displayedIndex)} <small style="opacity:0.6; font-size:0.7em;">[${keyNumber}]</small></span>
                        <span>${isExclusive ? `<strong>${roleLabel}</strong>` : ''}${choiceText}</span>
                        ${impactTagText ? `<span class="choice-impact-tag">${impactTagText}</span>` : ''}
                    `;
                    btn.onclick = () => {
                        if (this.isChoiceLocked) return;
                        this.isChoiceLocked = true;
                        try {
                            this.handleChoice(choice);
                        } catch (err) {
                            console.error("Erreur lors de la sélection du choix :", err);
                            this.isChoiceLocked = false;
                        }
                    };
                    choicesContainer.appendChild(btn);
                    displayedIndex++;
                });

                // Sécurité : Si aucun choix n'est affiché suite au filtrage, afficher un bouton de continuation
                if (displayedIndex === 0 && node.choices.length > 0) {
                    const fallbackChoice = node.choices[0];
                    const btn = document.createElement("button");
                    btn.className = "choice-btn";
                    btn.innerHTML = `
                        <span class="choice-bullet">A <small style="opacity:0.6; font-size:0.7em;">[1]</small></span>
                        <span>${this.formatDynamicText(fallbackChoice.text)}</span>
                    `;
                    btn.onclick = () => {
                        if (this.isChoiceLocked) return;
                        this.isChoiceLocked = true;
                        this.handleChoice(fallbackChoice);
                    };
                    choicesContainer.appendChild(btn);
                }
            }
        }

        // Lancement du typewriter fluide
        if (dialogueText) {
            this.typewriteText(dialogueText, processedText, () => {
                if (choicesContainer && choicesContainer.children.length > 0) {
                    choicesContainer.style.display = "flex";
                    void choicesContainer.offsetWidth;
                    choicesContainer.classList.add("choices-revealed");
                }
                this.bindGlossaryTerms(dialogueText);
            });
        }
    }

    replayCurrentDialogue() {
        if (!this.player.currentNodeId) return;
        this.goToNode(this.player.currentNodeId, false);
    }

    bindGlossaryTerms(container) {
        const terms = container.querySelectorAll("[data-glossary]");
        terms.forEach(termEl => {
            termEl.onclick = (e) => {
                e.stopPropagation();
                const key = termEl.getAttribute("data-glossary");
                if (window.codexManager) {
                    window.codexManager.openGlossaryBubble(key, termEl);
                }
            };
        });
    }

    // ==========================================
    // AXE 2 & 3 : RETOURS VISUELS & SONORES D'IMPACT (GAME FEEL)
    // ==========================================
    triggerScreenShake(intensity = 'light') {
        const viewport = document.getElementById("scene-viewport");
        const app = document.getElementById("game-app");
        const targets = [viewport, app].filter(Boolean);

        const className = (intensity === 'heavy' || intensity === 'rumble') ? 'shake-heavy' :
                          (intensity === 'medium' ? 'shake-medium' : 'shake-light');

        const duration = (intensity === 'heavy' || intensity === 'rumble') ? 850 :
                         (intensity === 'medium' ? 450 : 250);

        targets.forEach(el => {
            el.classList.remove("shake-light", "shake-medium", "shake-heavy", "shake-rumble");
            void el.offsetWidth;
            el.classList.add(className);
            setTimeout(() => {
                el.classList.remove(className);
            }, duration);
        });
    }

    triggerFlashAlert() {
        const target = document.getElementById("scene-viewport") || document.getElementById("game-app");
        if (!target) return;
        target.classList.remove("flash-alert");
        void target.offsetWidth;
        target.classList.add("flash-alert");
        setTimeout(() => {
            target.classList.remove("flash-alert");
        }, 250);
    }

    showFloatingStat(statKey, diff) {
        if (!diff || diff === 0) return;
        const box = document.getElementById(`gauge-box-${statKey}`);
        if (!box) return;

        const statMetadata = {
            savoir: { label: "Savoir", icon: "📖" },
            influence: { label: "Influence", icon: "👑" },
            richesse: { label: "Richesse", icon: "💰" },
            destin: { label: "Destin", icon: diff < 0 ? "⚠️" : "⚖️" }
        };

        const meta = statMetadata[statKey] || { label: statKey, icon: "✨" };
        const badge = document.createElement("div");
        badge.className = `gauge-float-badge ${diff > 0 ? 'positive' : 'negative'}`;
        const prefix = diff > 0 ? `+${diff}` : `${diff}`;
        badge.innerText = `${prefix} ${meta.label} ${meta.icon}`;

        box.appendChild(badge);
        setTimeout(() => {
            if (badge.parentNode) badge.parentNode.removeChild(badge);
        }, 1350);
    }

    playDiegeticSound(soundType) {
        if (!window.soundEngine) return;
        switch (soundType) {
            case "clay":
                window.soundEngine.playClay();
                break;
            case "chisel":
                window.soundEngine.playChisel();
                break;
            case "papyrus":
                window.soundEngine.playPapyrus();
                break;
            case "water":
                window.soundEngine.playWater();
                break;
            case "flood":
                if (window.soundEngine.playFloodRumble) window.soundEngine.playFloodRumble();
                else window.soundEngine.playWater();
                break;
            case "coins":
                window.soundEngine.playCoins();
                break;
            case "tension":
                if (window.soundEngine.playTensionChord) window.soundEngine.playTensionChord();
                else window.soundEngine.playChoice();
                break;
            case "fanfare":
                window.soundEngine.playFanfare();
                break;
            case "success":
                window.soundEngine.playSuccess();
                break;
            default:
                window.soundEngine.playChoice();
                break;
        }
    }

    // ==========================================
    // TYPEWRITER FLUIDE & SÉCURISÉ
    // ==========================================
    typewriteText(container, htmlContent, onComplete) {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }

        this.onTypewriterComplete = onComplete;
        const skipHint = document.getElementById("dialogue-skip-hint");

        if (this.textSpeed === "instant") {
            container.innerHTML = htmlContent;
            this.isTyping = false;
            if (skipHint) skipHint.style.display = "none";
            if (onComplete) onComplete();
            return;
        }

        container.innerHTML = htmlContent;
        this.isTyping = true;
        if (skipHint) skipHint.style.display = "flex";

        const textNodes = [];
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        let n;
        while ((n = walker.nextNode())) {
            textNodes.push({
                node: n,
                fullText: n.nodeValue
            });
            n.nodeValue = "";
        }

        this.textNodesList = textNodes;

        if (textNodes.length === 0) {
            this.isTyping = false;
            if (skipHint) skipHint.style.display = "none";
            if (onComplete) onComplete();
            return;
        }

        let nodeIndex = 0;
        let charIndex = 0;
        let totalCharsTyped = 0;
        const speedInterval = this.textSpeed === "fast" ? 9 : 22;
        const soundFrequency = this.textSpeed === "fast" ? 4 : 3;

        this.typewriterInterval = setInterval(() => {
            if (!this.isTyping || nodeIndex >= textNodes.length) {
                this.finishTypewriter();
                return;
            }

            const current = textNodes[nodeIndex];
            if (charIndex < current.fullText.length) {
                current.node.nodeValue += current.fullText[charIndex];
                charIndex++;
                totalCharsTyped++;

                if (totalCharsTyped % soundFrequency === 0 && window.soundEngine) {
                    window.soundEngine.playParchmentTypewriter();
                }
            } else {
                nodeIndex++;
                charIndex = 0;
            }
        }, speedInterval);
    }

    skipTypewriter() {
        if (!this.isTyping) return;
        this.finishTypewriter();
    }

    finishTypewriter() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }

        if (this.textNodesList && this.textNodesList.length > 0) {
            this.textNodesList.forEach(item => {
                item.node.nodeValue = item.fullText;
            });
        }

        this.isTyping = false;
        const skipHint = document.getElementById("dialogue-skip-hint");
        if (skipHint) skipHint.style.display = "none";

        if (this.onTypewriterComplete) {
            const cb = this.onTypewriterComplete;
            this.onTypewriterComplete = null;
            cb();
        }
    }

    // ==========================================
    // GESTION DES CHOIX & CONSÉQUENCES
    // ==========================================
    handleChoice(choice) {
        // Appliquer les modificateurs de stats avec animations de flash
        if (choice.impact) {
            let gained = false;
            let lost = false;
            Object.keys(choice.impact).forEach(k => {
                const diff = choice.impact[k];
                this.player.stats[k] = Math.max(0, Math.min(100, this.player.stats[k] + diff));
                const fillEl = document.getElementById(`gauge-fill-${k}`);
                if (fillEl) {
                    fillEl.classList.remove("gauge-up", "gauge-down");
                    void fillEl.offsetWidth;
                    fillEl.classList.add(diff >= 0 ? "gauge-up" : "gauge-down");
                }
                // AXE 2.2 : Badges flottants de jauges (Floating Combat Text)
                this.showFloatingStat(k, diff);

                if (diff > 0) gained = true;
                if (diff < 0) lost = true;
            });

            if (gained && window.soundEngine && window.soundEngine.playStatGain) window.soundEngine.playStatGain();
            else if (lost && window.soundEngine && window.soundEngine.playStatLoss) window.soundEngine.playStatLoss();

            this.updateHUD();
        }

        if (choice.setFlags) {
            Object.assign(this.player.flags, choice.setFlags);
        }

        if (choice.addClue) {
            if (!this.player.clues.includes(choice.addClue)) {
                this.player.clues.push(choice.addClue);
                this.showClueToast(choice.addClue);
                this.triggerFlashAlert();
            }
        }

        if (choice.butterflyEffect) {
            this.player.decisions.push({
                text: choice.text,
                effect: choice.butterflyEffect
            });
            this.showButterflyToast(choice.butterflyEffect);
            this.triggerFlashAlert();
        }

        // AXE 2.1 & 3 : Retours d'impact (Secousse d'écran & SFX diégétiques)
        if (choice.shake) {
            this.triggerScreenShake(choice.shake);
        } else if (choice.sound === "chisel" || choice.sound === "clay") {
            this.triggerScreenShake("light");
        } else if (choice.sound === "flood" || choice.sound === "tension") {
            this.triggerScreenShake("heavy");
        }

        if (choice.flash) {
            this.triggerFlashAlert();
        }

        if (choice.sound) {
            this.playDiegeticSound(choice.sound);
        } else {
            if (window.soundEngine) window.soundEngine.playChoice();
        }

        // Déclencher un mini-jeu si spécifié
        if (choice.minigame) {
            if (!window.minigames && typeof MiniGamesManager !== "undefined") {
                window.minigames = new MiniGamesManager();
            }
            if (window.minigames) {
                const nextCb = () => this.goToNode(choice.nextNode);
                if (choice.minigame === "writing_puzzle") {
                    this.unlockMedal("master_scribe");
                    window.minigames.startWritingPuzzle(nextCb);
                } else if (choice.minigame === "hammurabi_trial") {
                    this.unlockMedal("fair_judge");
                    window.minigames.startHammurabiTrial(nextCb);
                } else if (choice.minigame === "nile_irrigation") {
                    this.unlockMedal("nile_master");
                    window.minigames.startNileIrrigationPuzzle(nextCb);
                } else if (choice.minigame === "trade_puzzle") {
                    this.unlockMedal("trade_baron");
                    window.minigames.startTradePuzzle(nextCb);
                } else if (choice.minigame === "ziggurat_hierarchy") {
                    this.unlockMedal("social_architect");
                    window.minigames.startZigguratPuzzle(nextCb);
                } else if (choice.minigame === "timeline_puzzle") {
                    this.unlockMedal("time_traveler");
                    window.minigames.startTimelinePuzzle(nextCb);
                } else if (choice.nextNode) {
                    this.goToNode(choice.nextNode);
                }
                return;
            }
        } else if (choice.isExam) {
            this.startGrandExam();
        } else if (choice.isEndgame) {
            this.showEndgame();
        } else if (choice.nextNode) {
            this.goToNode(choice.nextNode);
        }
    }

    // ==========================================
    // GRAND EXAMEN SOMMATIF DU MODULE 3 (12 QUESTIONS)
    // ==========================================
    startGrandExam() {
        this.examQuestions = [
            {
                id: 1,
                question: "1. Pourquoi l'Antiquité est-elle considérée comme la toute première période historique de l'humanité ?",
                options: [
                    { text: "Parce qu'elle correspond à l'invention de l'agriculture et de l'élevage.", correct: false },
                    { text: "Parce qu'elle correspond à l'invention de l'écriture (vers 3500 av. J.-C.).", correct: true },
                    { text: "Parce qu'elle correspond à la construction de la première pyramide d'Égypte.", correct: false },
                    { text: "Parce que les humains ont découvert la maîtrise du feu.", correct: false }
                ],
                concept: "evolution_ecriture",
                explanation: "L'Antiquité débute avec l'invention de l'écriture (~3500 av. J.-C.), marquant le passage de la Préhistoire à l'Histoire grâce aux traces écrites."
            },
            {
                id: 2,
                question: "2. Parmi les propositions suivantes, lequel N'EST PAS l'un des 6 grands points communs aux civilisations antiques ?",
                options: [
                    { text: "Elles sont toutes installées à proximité d'un grand fleuve.", correct: false },
                    { text: "Elles développent des systèmes complexes d'irrigation et l'écriture.", correct: false },
                    { text: "Elles inventent la démocratie et le vote secret des citoyens.", correct: true },
                    { text: "Elles réalisent de grandes constructions et utilisent la métallurgie.", correct: false }
                ],
                concept: "points_communs",
                explanation: "Les 6 points communs sont : proximité d'un fleuve, écriture, grandes constructions, structuration sociale, irrigation complexe et métallurgie."
            },
            {
                id: 3,
                question: "3. Qu'est-ce qu'un « calculi » (ou calculis) et quelle était son utilité première en Mésopotamie vers 3500 av. J.-C. ?",
                options: [
                    { text: "Une arme de jet en bronze utilisée par les fantassins de Babylone.", correct: false },
                    { text: "Une boule ou jeton d'argile servant à compter et quantifier les récoltes et le bétail.", correct: true },
                    { text: "Un sceau royal servant à signer les édits officiels du souverain.", correct: false },
                    { text: "Un outil en bois pour creuser les canaux d'irrigation.", correct: false }
                ],
                concept: "evolution_ecriture",
                explanation: "Le calculi est une boule d'argile de comptabilité primitive utilisée dans des bourses scellées avant l'apparition des signes écrits."
            },
            {
                id: 4,
                question: "4. Dans quel ordre chronologique et logique l'écriture s'est-elle développée en Mésopotamie ?",
                options: [
                    { text: "1. Phonèmes ➔ 2. Idéogrammes ➔ 3. Pictogrammes", correct: false },
                    { text: "1. Pictogrammes (dessins d'objets) ➔ 2. Idéogrammes (idées) ➔ 3. Phonèmes (sons cunéiformes)", correct: true },
                    { text: "1. Alphabet ➔ 2. Hiéroglyphes ➔ 3. Calculis", correct: false },
                    { text: "1. Idéogrammes ➔ 2. Alphabet ➔ 3. Pictogrammes", correct: false }
                ],
                concept: "evolution_ecriture",
                explanation: "L'écriture évolue du dessin concret (pictogramme) à l'idée abstraite (idéogramme), puis aux sons de la langue parlée (phonème / cunéiforme)."
            },
            {
                id: 5,
                question: "5. Quels sont les deux grands avantages de l'Alphabet inventé par les Phéniciens en 1200 av. J.-C. par rapport aux cunéiformes ?",
                options: [
                    { text: "Il s'écrit uniquement sur l'or et comporte des milliers de hiéroglyphes.", correct: false },
                    { text: "Il comporte beaucoup moins de signes à mémoriser (22 lettres) et permet d'illustrer des idées abstraites.", correct: true },
                    { text: "Il remplace la parole et interdit formellement les lois écrites.", correct: false },
                    { text: "Il était réservé exclusivement aux dieux et aux rois.", correct: false }
                ],
                concept: "alphabet_phenicien",
                explanation: "Avec seulement 22 lettres simples fondées sur les sons, l'alphabet phénicien a grandement facilité l'apprentissage et permis d'exprimer toute pensée abstraite."
            },
            {
                id: 6,
                question: "6. Quelles sont les caractéristiques fondamentales d'une « cité-État » mésopotamienne (comme Ur, Babylone ou Lagash) ?",
                options: [
                    { text: "Une tribu nomade qui se déplace chaque saison le long des fleuves.", correct: false },
                    { text: "Une ville autonome avec son propre territoire, gouvernée par un roi et régie par des lois écrites.", correct: true },
                    { text: "Un village de pêcheurs sans aucune division du travail ni hiérarchie.", correct: false },
                    { text: "Une province soumise à un empire mondial sans gouvernement local.", correct: false }
                ],
                concept: "cites_etats",
                explanation: "Une cité-État est autonome (indépendante), gouvernée par un roi et régie par des lois écrites publiques."
            },
            {
                id: 7,
                question: "7. Pourquoi le Roi Hammurabi a-t-il fait graver son Code de lois sur une stèle de basalte noir en 1750 av. J.-C. ?",
                options: [
                    { text: "Pour appliquer la loi de la même façon pour tous (apparition de l'égalité) et diffuser clairement les règles.", correct: true },
                    { text: "Pour accorder tous les privilèges aux nobles et supprimer le droit de défense.", correct: false },
                    { text: "Pour interdire l'apprentissage de l'écriture aux scribes.", correct: false },
                    { text: "Uniquement pour décorer l'entrée du palais royal de Babylone.", correct: false }
                ],
                concept: "code_hammourabi",
                explanation: "La loi écrite protège contre l'arbitraire : elle est publique, connue de tous et s'applique de manière uniforme à chaque citoyen."
            },
            {
                id: 8,
                question: "8. Quel est l'ordre exact des 5 niveaux de la hiérarchie sociale mésopotamienne (du sommet vers la base) ?",
                options: [
                    { text: "1. Roi ➔ 2. Scribes ➔ 3. Nobles ➔ 4. Esclaves ➔ 5. Peuple", correct: false },
                    { text: "1. Roi ➔ 2. Nobles ➔ 3. Fonctionnaires & Scribes ➔ 4. Peuple (artisans/paysans) ➔ 5. Esclaves", correct: true },
                    { text: "1. Nobles ➔ 2. Roi ➔ 3. Peuple ➔ 4. Fonctionnaires ➔ 5. Esclaves", correct: false },
                    { text: "1. Scribes ➔ 2. Prêtres ➔ 3. Roi ➔ 4. Esclaves ➔ 5. Artisans", correct: false }
                ],
                concept: "hierarchie_sociale",
                explanation: "L'ordre strict est : 1. Le Roi, 2. Les Nobles (terres et pouvoir), 3. Les Fonctionnaires & Scribes (écriture), 4. Le Peuple libre, 5. Les Esclaves (aucun droit)."
            },
            {
                id: 9,
                question: "9. Quels sont les 2 éléments qui déterminent la place d'une personne dans la société mésopotamienne ?",
                options: [
                    { text: "La force physique et l'âge de la personne.", correct: false },
                    { text: "La naissance (famille d'origine) et la spécialisation du travail (métier exercé).", correct: true },
                    { text: "La taille de sa maison et le nombre d'armes en bronze possédées.", correct: false },
                    { text: "Le nombre de voyages fluviaux effectués sur l'Euphrate.", correct: false }
                ],
                concept: "hierarchie_sociale",
                explanation: "La place dans la société dépend de la naissance (famille noble ou modeste) et du métier spécialisé (scribe, forgeron, paysan, etc.)."
            },
            {
                id: 10,
                question: "10. Dans le commerce mésopotamien (troc), que devaient principalement exporter et importer les cités-États ?",
                options: [
                    { text: "Exportaient : surplus de blé et poteries / Importaient : métaux (cuivre, étain), bois précieux et pierres.", correct: true },
                    { text: "Exportaient : du bois de cèdre et du fer / Importaient : de l'argile et de l'eau douce.", correct: false },
                    { text: "Exportaient : uniquement des armes / N'importaient aucune ressource extérieure.", correct: false },
                    { text: "Exportaient : de l'or pur / Importaient : des céréales et du bétail.", correct: false }
                ],
                concept: "commerce_sciences",
                explanation: "Riche en blé et en argile mais pauvre en métaux, bois d'œuvre et pierres dures, la Mésopotamie troquait ses surplus contre ces matières premières indispensables."
            },
            {
                id: 11,
                question: "11. Pourquoi les crues annuelles des fleuves (Tigre, Euphrate, Nil) étaient-elles indispensables à la survie des civilisations ?",
                options: [
                    { text: "Elles refroidissaient l'atmosphère et noyaient les prédateurs.", correct: false },
                    { text: "Elles déposaient une boue organique ultra-fertile (le limon), essentielle pour cultiver céréales, fruits et légumes.", correct: true },
                    { text: "Elles amenaient directement des pierres taillées pour bâtir les ziggourats.", correct: false },
                    { text: "Elles servaient uniquement à fabriquer l'argile des tablettes de lois.", correct: false }
                ],
                concept: "civilisation_nil",
                explanation: "La crue dépose le limon fertile sur les parcelles irriguées par digues et canaux, permettant des récoltes abondantes nourrissant les cités."
            },
            {
                id: 12,
                question: "12. Comment se caractérise la religion mésopotamienne et quelle est la plus ancienne histoire écrite de l'humanité ?",
                options: [
                    { text: "Croyance en un dieu unique et l'Odyssée d'Homère.", correct: false },
                    { text: "Polythéisme (plusieurs dieux liés à la nature/sentiments), culte dans les Ziggourats et l'Épopée de Gilgamesh.", correct: true },
                    { text: "Culte exclusif des animaux du désert et le Livre des Morts égyptien.", correct: false },
                    { text: "Absence complète de culte, de panthéon et de temples.", correct: false }
                ],
                concept: "religion_ziggourats",
                explanation: "La religion mésopotamienne est polythéiste (panthéon de dieux vénérés dans les Ziggourats) et a inspiré l'Épopée de Gilgamesh."
            }
        ];

        this.examCurrentIndex = 0;
        this.examScore = 0;
        this.examAnswers = [];

        const overlay = document.getElementById("exam-overlay");
        if (overlay) overlay.style.display = "flex";

        if (window.soundEngine) window.soundEngine.playPapyrus();
        this.renderExamQuestion();
    }

    renderExamQuestion() {
        const container = document.getElementById("exam-content");
        if (!container) return;

        const q = this.examQuestions[this.examCurrentIndex];
        const progressPct = Math.round(((this.examCurrentIndex) / this.examQuestions.length) * 100);

        container.innerHTML = `
            <div class="exam-header">
                <div>
                    <h3 class="exam-title">🏛️ Grand Examen d'Histoire • Module 3</h3>
                    <span style="color:var(--gold-light); font-size:0.9rem;">
                        Question ${this.examCurrentIndex + 1} / ${this.examQuestions.length} • Évaluation Finale du Conseil
                    </span>
                </div>
                <button class="hud-btn" style="padding:6px 14px; font-size:0.85rem;" onclick="window.codexManager.openModal('${q.concept || 'points_communs'}')">
                    📖 Consulter le Codex
                </button>
            </div>

            <div class="exam-progress-bar">
                <div class="exam-progress-fill" style="width: ${progressPct}%;"></div>
            </div>

            <div class="exam-question-box">
                <div class="exam-question-text">${q.question}</div>
                <div class="exam-choices-list">
                    ${q.options.map((opt, idx) => `
                        <button class="exam-choice-btn" id="exam-opt-${idx}" onclick="window.gameEngine.handleExamAnswer(${idx})">
                            <span class="exam-bullet">${String.fromCharCode(65 + idx)}</span>
                            <span>${opt.text}</span>
                        </button>
                    `).join('')}
                </div>
            </div>

            <div id="exam-feedback-area"></div>
        `;
    }

    handleExamAnswer(optionIndex) {
        const q = this.examQuestions[this.examCurrentIndex];
        const selected = q.options[optionIndex];
        const feedbackArea = document.getElementById("exam-feedback-area");
        if (!feedbackArea) return;

        // Désactiver les boutons de choix pour éviter double-clic
        const buttons = document.querySelectorAll(".exam-choice-btn");
        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (q.options[idx].correct) btn.classList.add("correct");
            else if (idx === optionIndex && !selected.correct) btn.classList.add("incorrect");
        });

        const isCorrect = selected.correct;
        if (isCorrect) {
            this.examScore++;
            if (window.soundEngine) {
                window.soundEngine.playChisel();
                window.soundEngine.playSuccess();
            }
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-success">
                    ✨ <strong>Excellente Réponse !</strong> ${q.explanation}
                </div>
            `;
        } else {
            if (window.soundEngine) window.soundEngine.playChoice();
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-error">
                    💡 <strong>Notion à retenir :</strong> ${q.explanation}
                </div>
            `;
        }

        this.examAnswers.push({
            questionId: q.id,
            isCorrect: isCorrect,
            concept: q.concept,
            explanation: q.explanation
        });

        setTimeout(() => {
            this.examCurrentIndex++;
            if (this.examCurrentIndex < this.examQuestions.length) {
                this.renderExamQuestion();
            } else {
                this.renderExamSummary();
            }
        }, 2200);
    }

    renderExamSummary() {
        const container = document.getElementById("exam-content");
        if (!container) return;

        const total = this.examQuestions.length;
        const pct = Math.round((this.examScore / total) * 100);
        this.examPercentage = pct;

        if (window.soundEngine) window.soundEngine.playFanfare();

        let gradeTitle = "";
        let gradeColor = "";
        if (pct >= 90) {
            gradeTitle = "Maîtrise Parfaite & Érudit Suprême (Mention Très Grande Distinction)";
            gradeColor = "#22c55e";
            this.unlockMedal("diploma_s");
        } else if (pct >= 75) {
            gradeTitle = "Excellente Compréhension Historique (Mention Grande Distinction)";
            gradeColor = "#60a5fa";
        } else if (pct >= 60) {
            gradeTitle = "Connaissances Solides & Apprentissage Validé (Mention Réussite)";
            gradeColor = "#fbbf24";
        } else {
            gradeTitle = "Initiation Historique (Des notions restent à approfondir dans le Codex)";
            gradeColor = "#f87171";
        }

        container.innerHTML = `
            <div class="exam-summary-card">
                <span style="font-size: 3.5rem;">📜</span>
                <h3 class="exam-title" style="font-size: 1.8rem; margin: 10px 0;">Résultats du Grand Examen du Module 3</h3>
                <div class="exam-score-badge" style="color: ${gradeColor};">${pct}%</div>
                <p style="font-size: 1.15rem; font-weight: bold; color: var(--gold-light); margin-bottom: 8px;">
                    ${this.examScore} / ${total} questions réussies
                </p>
                <div style="font-size: 1.05rem; color: #fff; margin-bottom: 20px;">
                    Distinction Royale : <strong>${gradeTitle}</strong>
                </div>

                <div style="background: rgba(28, 20, 14, 0.9); border: 1px solid var(--gold-primary); border-radius: 12px; padding: 18px; text-align: left; max-height: 250px; overflow-y: auto; margin-bottom: 25px;">
                    <h4 style="color:var(--gold-light); margin-bottom:10px;">📋 Synthèse de vos Réponses :</h4>
                    ${this.examAnswers.map((ans, idx) => `
                        <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:8px; font-size:0.9rem;">
                            <span>${ans.isCorrect ? '✅' : '❌'}</span>
                            <div>
                                <strong>Question ${idx + 1} :</strong> ${ans.isCorrect ? 'Parfaitement maîtrisée.' : `À réviser : ${ans.explanation}`}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <button class="btn-primary-start" style="padding: 14px 32px; font-size: 1.1rem;" onclick="window.gameEngine.finishExamAndShowEndgame()">
                    Découvrir mon Diplôme Royal Officiel ➔
                </button>
            </div>
        `;
    }

    finishExamAndShowEndgame() {
        const overlay = document.getElementById("exam-overlay");
        if (overlay) overlay.style.display = "none";
        this.showEndgame();
    }

    // ==========================================
    // ÉCRAN DE FIN, DIPLÔME & RADAR DE COMPÉTENCES
    // ==========================================
    showEndgame() {
        document.getElementById("story-screen").style.display = "none";
        document.getElementById("game-hud").style.display = "none";
        const endgameScreen = document.getElementById("endgame-screen");
        if (endgameScreen) endgameScreen.style.display = "flex";

        if (window.soundEngine) window.soundEngine.playFanfare();

        const examPct = this.examPercentage !== undefined ? this.examPercentage : 100;
        const totalScore = this.player.stats.savoir + this.player.stats.influence + this.player.stats.richesse + this.player.stats.destin;
        
        let rankTitle = "Grand Vizir de la Connaissance & Maître de l'Histoire";
        if (examPct >= 90 && totalScore >= 300) {
            rankTitle = "Légende Vivante du Croissant Fertile & Protecteur de l'Empire (Rang S)";
            this.unlockMedal("diploma_s");
        } else if (examPct >= 75 || totalScore >= 260) {
            rankTitle = "Haut Conseiller Royal & Maître Scribe Impérial (Rang A)";
        } else {
            rankTitle = "Bâtisseur Émérite & Explorateur des Cités Fluviales (Rang B)";
        }

        const cls = this.storyData.classes[this.player.classId];
        let epilogueStory = "";

        if (this.player.classId === "scribe") {
            epilogueStory = `En tant que Scribe Royal, vous avez percé le secret des calculis falsifiés et déchiffré les codes secrets du complot. Le Roi Hammurabi vous a confié la gravure officielle des annales et des lois sur la grande stèle noire de Babylone.`;
        } else if (this.player.classId === "artisan") {
            epilogueStory = `Maître des routes fluviales et du troc stratégique, vous avez démantelé la contrebande de métaux et négocié l'alliance commerciale entre la Mésopotamie et l'Égypte antique. Vos navires marchands naviguent librement sur le Tigre, l'Euphrate et le Nil.`;
        } else if (this.player.classId === "soldat") {
            epilogueStory = `Bouclier infaillible de Babylone, vous avez neutralisé les traîtres aux portes de la cité et protégé la cour de justice royale. Le Pharaon et le Roi vous nomment Général de l'Alliance des Cités Fluviales.`;
        } else {
            epilogueStory = `Génie hydraulique et bâtisseur du peuple, vous avez sauvé les récoltes de l'inondation criminelle et perfectionné l'irrigation des bassins du Nil. Votre nom est honoré par les paysans et célébré au sommet des Ziggourats.`;
        }

        const heroNameEl = document.getElementById("diploma-hero-name");
        const rankTitleEl = document.getElementById("diploma-rank-title");
        const statsSummaryEl = document.getElementById("diploma-stats-summary");

        if (heroNameEl) heroNameEl.innerText = `${this.player.name} (${cls.name})`;
        if (rankTitleEl) rankTitleEl.innerText = rankTitle;
        if (statsSummaryEl) {
            let moralTitle = "";
            let moralBadgeColor = "#451a03";
            let moralDesc = "";
            if (this.player.flags && this.player.flags.flag_verdict === "strict") {
                moralTitle = "Titre d'honneur : Justicier Inflexible";
                moralBadgeColor = "#1e3a8a";
                moralDesc = "Fidélité absolue à la lettre de la loi écrite et rigueur royale intransigeante.";
            } else if (this.player.flags && this.player.flags.flag_verdict === "clemency") {
                moralTitle = "Titre d'honneur : Protecteur des Humbles";
                moralBadgeColor = "#15803d";
                moralDesc = "Équité supérieure, bienveillance envers les démunis et primauté de la vie humaine.";
            } else if (this.player.flags && this.player.flags.flag_verdict === "metier") {
                moralTitle = "Titre d'honneur : Arbitre Éclairé des Métiers";
                moralBadgeColor = "#b45309";
                moralDesc = "Arbitrage pragmatique fondé sur l'expertise, la médiation et la solidarité des corps de métier.";
            }

            statsSummaryEl.innerHTML = `
                <div style="background: rgba(212, 175, 55, 0.15); border: 2px solid var(--gold-primary); border-radius: 10px; padding: 14px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 0.9rem; color: #451a03; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                        Résultat Officiel à l'Examen d'Histoire du Module 3
                    </div>
                    <div style="font-size: 2.2rem; font-weight: 900; font-family: var(--font-title); color: #1c3f6e; margin: 4px 0;">
                        ${examPct}% <span style="font-size: 1.1rem; font-weight: normal; color:#451a03;">(${this.examScore !== undefined ? this.examScore : 12}/12 questions réussies)</span>
                    </div>
                    <div style="font-size: 0.95rem; font-weight: bold; color: #7c2d12;">
                        ${examPct >= 90 ? '⭐⭐⭐ Mention d\'Honneur Suprême' : examPct >= 75 ? '⭐⭐ Mention d\'Excellence' : '⭐ Mention Réussite'}
                    </div>
                </div>

                ${moralTitle ? `
                <div style="background: rgba(212, 175, 55, 0.22); border: 2px solid var(--gold-primary); border-radius: 10px; padding: 12px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 0.85rem; color: #5c432d; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                        Bilan Moral du Tribunal d'Hammourabi
                    </div>
                    <div style="font-size: 1.22rem; font-weight: bold; color: ${moralBadgeColor}; margin: 4px 0;">
                        ⚖️ ${moralTitle}
                    </div>
                    <div style="font-size: 0.88rem; font-style: italic; color: #3d2b1a;">
                        « ${moralDesc} »
                    </div>
                </div>
                ` : ''}

                <div style="background: rgba(212, 175, 55, 0.12); border: 1px solid var(--gold-primary); border-radius: 8px; padding: 12px; margin-bottom: 15px; font-style: italic; color: #2c1d11;">
                    « ${epilogueStory} »
                </div>
                <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-bottom: 12px;">
                    <span style="color:#1c3f6e; font-weight:bold;">📖 Savoir : ${this.player.stats.savoir}%</span>
                    <span style="color:#8c6d1f; font-weight:bold;">👑 Influence : ${this.player.stats.influence}%</span>
                    <span style="color:#1f6b3e; font-weight:bold;">🏺 Richesse : ${this.player.stats.richesse}%</span>
                    <span style="color:#7c2d12; font-weight:bold;">✨ Destin : ${this.player.stats.destin}%</span>
                </div>
            `;
        }

        this.renderCompetencyRadar();

        // Section timeline des choix & indices
        let timelineContainer = document.getElementById("diploma-timeline-container");
        if (!timelineContainer) {
            timelineContainer = document.createElement("div");
            timelineContainer.id = "diploma-timeline-container";
            timelineContainer.className = "diploma-timeline-container";
            const diplomaCard = document.querySelector(".diploma-card");
            if (diplomaCard) {
                const masteryGrid = diplomaCard.querySelector(".mastery-grid");
                if (masteryGrid) {
                    diplomaCard.insertBefore(timelineContainer, masteryGrid.nextSibling);
                }
            }
        }

        if (timelineContainer) {
            const cluesListHtml = this.player.clues.length > 0 
                ? this.player.clues.map(c => `<li>🔍 ${c}</li>`).join('') 
                : `<li>Aucun indice physique supplémentaire collecté.</li>`;

            const decisionsListHtml = this.player.decisions.length > 0
                ? this.player.decisions.map(d => `<li>🦋 <strong>Choix :</strong> ${d.text.substring(0, 70)}... <br><span style="color:#7c2d12;">➔ ${d.effect}</span></li>`).join('')
                : `<li>Parcours héroïque direct sans compromis clandestin.</li>`;

            const artifacts = window.HISTORICAL_ARTIFACTS ? Object.values(window.HISTORICAL_ARTIFACTS) : [];
            const collectedCount = (this.player.inventory || []).length;
            const artifactsHtml = artifacts.map(a => {
                const isOwned = (this.player.inventory || []).includes(a.id);
                return `
                    <div style="display:inline-flex; align-items:center; gap:6px; background:${isOwned ? 'rgba(212,175,55,0.2)' : 'rgba(0,0,0,0.05)'}; border:1px solid ${isOwned ? '#d4af37' : '#ccc'}; border-radius:18px; padding:4px 10px; font-size:0.8rem; color:${isOwned ? '#451a03' : '#888'};">
                        <span>${isOwned ? a.icon : '🔒'}</span>
                        <span style="font-weight:${isOwned ? 'bold' : 'normal'};">${a.name}</span>
                    </div>
                `;
            }).join('');

            timelineContainer.innerHTML = `
                <div style="margin-top: 15px; border-top: 1px dashed #a38b6d; padding-top: 12px; text-align: left;">
                    <div style="margin-bottom: 12px; background: rgba(212, 175, 55, 0.1); border: 1px solid var(--gold-primary); border-radius: 8px; padding: 10px;">
                        <div style="font-weight:bold; color:#5c432d; font-size:0.88rem; margin-bottom:6px;">🏺 Artefacts Historiques Réunis (${collectedCount}/4) :</div>
                        <div style="display:flex; flex-wrap:wrap; gap:8px;">${artifactsHtml}</div>
                    </div>
                    <h4 style="color:#5c432d; font-family: var(--font-title); font-size: 1rem; margin-bottom: 6px;">
                        📜 Registre de vos Enquêtes & Effets Papillon :
                    </h4>
                    <ul style="font-size: 0.88rem; color: #3d2b1a; line-height: 1.5; margin-left: 18px; margin-bottom: 10px;">
                        ${decisionsListHtml}
                    </ul>
                    <h4 style="color:#5c432d; font-family: var(--font-title); font-size: 1rem; margin-bottom: 6px;">
                        🗝️ Pièces à Conviction Présentées au Roi Hammurabi :
                    </h4>
                    <ul style="font-size: 0.88rem; color: #3d2b1a; line-height: 1.5; margin-left: 18px;">
                        ${cluesListHtml}
                    </ul>
                </div>
            `;
        }
    }

    renderCompetencyRadar() {
        const canvas = document.getElementById("diploma-radar-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 40;

        ctx.clearRect(0, 0, width, height);

        const categories = [
            { label: "Écriture & Calculis", val: Math.min(100, this.player.stats.savoir + 10) },
            { label: "Cités-États & Troc", val: Math.min(100, this.player.stats.richesse + 10) },
            { label: "Code d'Hammourabi", val: Math.min(100, this.player.stats.influence + 10) },
            { label: "Agriculture & Fleuves", val: Math.min(100, this.player.stats.destin + 10) },
            { label: "Hiérarchie Sociale", val: Math.min(100, (this.player.stats.savoir + this.player.stats.influence) / 2) }
        ];

        const numSides = categories.length;
        const angleStep = (Math.PI * 2) / numSides;

        // Grille polygonale
        for (let level = 1; level <= 4; level++) {
            const r = (radius / 4) * level;
            ctx.beginPath();
            for (let i = 0; i < numSides; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = "rgba(140, 109, 31, 0.25)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Rayons
        for (let i = 0; i < numSides; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = "rgba(140, 109, 31, 0.35)";
            ctx.stroke();

            // Labels
            const labelX = centerX + (radius + 24) * Math.cos(angle);
            const labelY = centerY + (radius + 18) * Math.sin(angle);
            ctx.font = "bold 11px sans-serif";
            ctx.fillStyle = "#451a03";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(categories[i].label, labelX, labelY);
        }

        // Polygone des compétences
        ctx.beginPath();
        for (let i = 0; i < numSides; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const scoreRatio = categories[i].val / 100;
            const r = radius * scoreRatio;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(212, 175, 55, 0.45)";
        ctx.fill();
        ctx.strokeStyle = "#8c6d1f";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Points
        for (let i = 0; i < numSides; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const scoreRatio = categories[i].val / 100;
            const r = radius * scoreRatio;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#d4af37";
            ctx.fill();
            ctx.strokeStyle = "#451a03";
            ctx.stroke();
        }
    }

    restart() {
        document.getElementById("endgame-screen").style.display = "none";
        document.getElementById("start-screen").style.display = "none";
        document.getElementById("story-screen").style.display = "none";
        document.getElementById("game-hud").style.display = "none";

        this.showMainMenu();
        this.player.stats = { savoir: 50, influence: 50, richesse: 50, destin: 50 };
        this.player.flags = {};
        this.player.clues = [];
        this.player.decisions = [];
        this.renderClassSelection();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.gameEngine = new GameEngine();
    window.gameEngine.init();
});

