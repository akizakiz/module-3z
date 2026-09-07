/**
 * Mini-Jeux et Puzzles Pédagogiques pour « Les Chroniques du Croissant Fertile »
 * Conforme à 100 % aux notions du Module 3 (Histoire 1re Secondaire - Québec)
 * Intègre 6 mécaniques interactives distinctes, feedbacks formatifs guidés avec indices 💡 et fiches synthèses consultables dans le Codex.
 */

class MiniGamesManager {
    constructor() {
        this.currentMinigame = null;
        this.onCompleteCallback = null;
        this.attemptCounts = {};
    }

    openOverlay() {
        const overlay = document.getElementById("minigame-overlay");
        if (overlay) {
            overlay.style.display = "flex";
            overlay.scrollTop = 0;
            if (window.particleCanvas) window.particleCanvas.pauseParticles();
        }
    }

    closeOverlay() {
        const overlay = document.getElementById("minigame-overlay");
        if (overlay) {
            overlay.style.display = "none";
            if (window.particleCanvas) window.particleCanvas.resumeParticles();
        }
    }

    renderSynthesis(title, icon, items, continueBtnText = "Continuer l'Aventure ➔") {
        const container = document.getElementById("minigame-content");
        if (!container) return;

        if (window.soundEngine) window.soundEngine.playFanfare();

        // Enregistrer automatiquement la fiche synthèse dans le Codex
        if (window.codexManager) {
            window.codexManager.addSynthesis({
                id: this.currentMinigame,
                title: title,
                icon: icon,
                items: items
            });
        }

        // Enregistrer la complétion dans le moteur de jeu
        if (window.gameEngine && typeof window.gameEngine.recordMinigameCompletion === "function") {
            const isFirstTry = (this.attemptCounts[this.currentMinigame] || 1) <= 1;
            window.gameEngine.recordMinigameCompletion(this.currentMinigame, isFirstTry);
        }

        container.innerHTML = `
            <div class="synthesis-card">
                <div class="synthesis-header">
                    <span style="font-size:2rem;">${icon}</span>
                    <div>
                        <h3 class="synthesis-title">${title}</h3>
                        <span style="color:var(--gold-light); font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">
                            Fiche Synthèse Pédagogique • Module 3 (Conservée dans le Codex)
                        </span>
                    </div>
                </div>

                <p style="font-size:1rem; color:var(--text-primary); margin-bottom:12px;">
                    ✨ <strong>Bravo ! Défi relevé avec succès.</strong> Cette fiche est désormais enregistrée dans votre <strong>Codex</strong> pour révision :
                </p>

                <div class="synthesis-grid">
                    ${items.map(it => `
                        <div class="synthesis-item">
                            <strong>${it.title}</strong>
                            <span>${it.desc}</span>
                        </div>
                    `).join('')}
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:20px;">
                    <button class="btn-primary-start" style="padding:12px 28px; font-size:1.05rem;" onclick="window.minigames.finishCurrentGame()">
                        ${continueBtnText}
                    </button>
                </div>
            </div>
        `;
    }

    finishCurrentGame() {
        this.closeOverlay();
        if (this.onCompleteCallback) {
            const cb = this.onCompleteCallback;
            this.onCompleteCallback = null;
            cb(true);
        }
    }

    // =========================================================================
    // MINI-JEU 1 : L'ATELIER DU SCRIBE (TABLETTE D'ARGILE & ÉVOLUTION DES SIGNES)
    // =========================================================================
    startWritingPuzzle(onComplete) {
        this.onCompleteCallback = onComplete;
        this.currentMinigame = "writing";
        if (!this.attemptCounts["writing"]) this.attemptCounts["writing"] = 0;
        this.writingSelected = [null, null, null, null, null];
        this.selectedSlotIndex = null;
        this.selectedCardId = null;

        this.writingStagesData = [
            { id: 1, name: "1. Calculis", hint: "Petites boules d'argile servant à dénombrer les troupeaux et grains (Comptabilité primitive)." },
            { id: 2, name: "2. Pictogrammes", hint: "Dessins réalistes représentant directement des êtres vivants ou des objets concrets." },
            { id: 3, name: "3. Idéogrammes", hint: "Combinaison de symboles illustrant des idées abstraites, des actions et des concepts." },
            { id: 4, name: "4. Cunéiforme & Phonèmes", hint: "Signes en forme de coins gravés au calame dans l'argile représentant les sons de la langue." },
            { id: 5, name: "5. Alphabet Phénicien (1200 av. J.-C.)", hint: "Système de 22 lettres simples : mémorisation ultra-rapide et diffusion universelle." }
        ];

        this.writingPool = [
            { id: 3, label: "Idéogrammes (Symboles représentant des idées et des concepts abstraits)" },
            { id: 1, label: "Calculis (Boules d'argile servant à compter les surplus agricoles)" },
            { id: 5, label: "Alphabet Phénicien (1200 av. J.-C. - 22 lettres simples fondées sur les sons)" },
            { id: 2, label: "Pictogrammes (Dessins concrets d'objets réels et d'animaux)" },
            { id: 4, label: "Cunéiforme (Signes en forme de coins gravés sur tablettes d'argile)" }
        ];

        this.renderWritingPuzzle();
        this.openOverlay();
    }

    renderWritingPuzzle() {
        const container = document.getElementById("minigame-content");
        if (!container) return;

        const placedCount = this.writingSelected.filter(id => id !== null).length;

        container.innerHTML = `
            <div class="minigame-header">
                <div>
                    <h3 class="minigame-title">📜 L'Atelier du Scribe : L'Évolution des Signes</h3>
                    <span style="color:var(--gold-light); font-size:0.9rem;">Module 3 • Section Écriture</span>
                </div>
                <button class="hud-btn" style="padding:6px 14px; font-size:0.85rem;" onclick="window.codexManager.openModal('evolution_ecriture')">📖 Consulter le Codex</button>
            </div>

            <p class="minigame-instructions">
                En tant que jeune scribe de la cité d'Ur, vous devez graver la <strong>ligne du temps exacte de l'invention et de l'évolution de l'écriture</strong>.
                Placez les 5 étapes dans les cases correspondantes (du plus ancien au plus récent).
            </p>

            <div class="clay-tablet-view">
                <div style="font-family:var(--font-title); color:var(--gold-light); margin-bottom:12px; font-size:1.1rem; display:flex; justify-content:space-between; align-items:center;">
                    <span>🏛️ Tablette d'Argile de la Ligne du Temps :</span>
                    <span style="font-size:0.85rem; color:#d4af37;">${placedCount} / 5 étapes placées</span>
                </div>

                <div class="writing-stages-container" id="writing-slots-grid">
                    ${[0, 1, 2, 3, 4].map(idx => {
                        const step = idx + 1;
                        const filledId = this.writingSelected[idx];
                        const stageInfo = filledId ? this.writingStagesData.find(s => s.id === filledId) : null;
                        const isSlotSelected = this.selectedSlotIndex === idx;
                        const isTargetWaiting = this.selectedCardId !== null && !filledId;
                        
                        let slotClasses = "stage-slot";
                        if (filledId) slotClasses += " filled";
                        if (isSlotSelected) slotClasses += " slot-selected";
                        if (isTargetWaiting) slotClasses += " slot-can-drop";

                        return `
                            <div class="${slotClasses}" id="slot-step-${step}" onclick="window.minigames.handleSlotClick(${idx})" title="${filledId ? 'Cliquer pour sélectionner/déplacer ou retirer' : 'Cliquer pour placer l\'élément sélectionné'}">
                                <div style="color:var(--gold-light); font-weight:bold; font-size:0.85rem; margin-bottom:4px; display:flex; justify-content:space-between; width:100%;">
                                    <span>Étape ${step}</span>
                                    ${filledId ? `<button class="slot-remove-btn" title="Retirer de la case" onclick="event.stopPropagation(); window.minigames.removeWritingFromSlot(${idx})">✕</button>` : ''}
                                </div>
                                ${stageInfo ? `
                                    <div style="font-size:0.85rem; color:#fff; font-weight:600;">${stageInfo.name}</div>
                                    <div style="font-size:0.75rem; color:#cbd5e1; margin-top:4px;">${stageInfo.hint}</div>
                                ` : `
                                    <div style="font-size:0.8rem; color:#888; margin-top:10px;">
                                        ${isTargetWaiting ? '⬇️ Cliquer pour déposer ici' : 'Case vide (cliquez sur une carte ci-dessous)'}
                                    </div>
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div style="margin-top:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h4 style="color:var(--gold-light); margin:0;">Cartes d'Écritures Disponibles :</h4>
                    ${this.selectedCardId ? `<span style="font-size:0.85rem; color:#93c5fd;">👉 Carte sélectionnée : cliquez sur une case vide pour la déposer</span>` : ''}
                </div>
                
                <div class="cards-pool" id="writing-cards-pool">
                    ${this.writingPool.map(card => {
                        const isPlaced = this.writingSelected.includes(card.id);
                        const isSelected = this.selectedCardId === card.id;
                        
                        let cardClasses = "draggable-item";
                        if (isPlaced) cardClasses += " used";
                        if (isSelected) cardClasses += " card-selected";

                        return `
                            <button class="${cardClasses}" 
                                    ${isPlaced ? 'disabled' : ''} 
                                    onclick="window.minigames.handleCardClick(${card.id})"
                                    title="${isPlaced ? 'Déjà placée sur la tablette' : 'Cliquer pour sélectionner ou placer automatiquement'}">
                                <span>📜</span>
                                <span>${card.label}</span>
                                ${isSelected ? `<span style="margin-left:auto; font-size:0.75rem; color:#f7e089;">(Sélectionnée)</span>` : ''}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <div id="writing-feedback-area"></div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; flex-wrap:wrap; gap:10px;">
                <button class="hud-btn" onclick="window.minigames.resetWritingPuzzle()">🔄 Réinitialiser la Tablette</button>
                <button class="btn-primary-start" style="padding:10px 24px;" onclick="window.minigames.validateWritingSequence()">
                    Sceller la Tablette au Calame ➔
                </button>
            </div>
        `;
    }

    handleCardClick(cardId) {
        if (this.writingSelected.includes(cardId)) return;

        if (this.selectedSlotIndex !== null) {
            this.writingSelected[this.selectedSlotIndex] = cardId;
            this.selectedSlotIndex = null;
            this.selectedCardId = null;
            if (window.soundEngine) window.soundEngine.playClay();
            this.renderWritingPuzzle();
            return;
        }

        const firstEmptyIndex = this.writingSelected.findIndex(id => id === null);
        if (firstEmptyIndex !== -1) {
            this.writingSelected[firstEmptyIndex] = cardId;
            this.selectedCardId = null;
            if (window.soundEngine) window.soundEngine.playClay();
            this.renderWritingPuzzle();
        } else {
            this.selectedCardId = (this.selectedCardId === cardId) ? null : cardId;
            if (window.soundEngine) window.soundEngine.playChoice();
            this.renderWritingPuzzle();
        }
    }

    handleSlotClick(slotIdx) {
        const currentInSlot = this.writingSelected[slotIdx];

        if (this.selectedCardId !== null) {
            this.writingSelected[slotIdx] = this.selectedCardId;
            this.selectedCardId = null;
            if (window.soundEngine) window.soundEngine.playClay();
            this.renderWritingPuzzle();
            return;
        }

        if (this.selectedSlotIndex !== null) {
            if (this.selectedSlotIndex === slotIdx) {
                this.selectedSlotIndex = null;
            } else {
                const temp = this.writingSelected[slotIdx];
                this.writingSelected[slotIdx] = this.writingSelected[this.selectedSlotIndex];
                this.writingSelected[this.selectedSlotIndex] = temp;
                this.selectedSlotIndex = null;
                if (window.soundEngine) window.soundEngine.playClay();
            }
            this.renderWritingPuzzle();
            return;
        }

        if (currentInSlot !== null) {
            this.selectedSlotIndex = slotIdx;
            if (window.soundEngine) window.soundEngine.playChoice();
            this.renderWritingPuzzle();
        }
    }

    removeWritingFromSlot(slotIdx) {
        if (this.writingSelected[slotIdx] !== null) {
            this.writingSelected[slotIdx] = null;
            if (this.selectedSlotIndex === slotIdx) {
                this.selectedSlotIndex = null;
            }
            if (window.soundEngine) window.soundEngine.playChoice();
            this.renderWritingPuzzle();
        }
    }

    resetWritingPuzzle() {
        this.writingSelected = [null, null, null, null, null];
        this.selectedSlotIndex = null;
        this.selectedCardId = null;
        if (window.soundEngine) window.soundEngine.playChoice();
        this.renderWritingPuzzle();
    }

    validateWritingSequence() {
        const feedbackArea = document.getElementById("writing-feedback-area");
        if (!feedbackArea) return;

        const placedCount = this.writingSelected.filter(id => id !== null).length;
        if (placedCount < 5) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-hint">
                    ℹ️ Veuillez remplir les 5 cases de la tablette avant de sceller votre travail (${placedCount}/5 complétées).
                </div>
            `;
            return;
        }

        this.attemptCounts["writing"] = (this.attemptCounts["writing"] || 0) + 1;

        const isCorrect = this.writingSelected[0] === 1 &&
                          this.writingSelected[1] === 2 &&
                          this.writingSelected[2] === 3 &&
                          this.writingSelected[3] === 4 &&
                          this.writingSelected[4] === 5;

        if (isCorrect) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-success">
                    ✨ <strong>Ordre Historique Parfait !</strong> Vous avez fidèlement reconstitué l'aventure des signes : Calculis (3500 av. J.-C.) ➔ Pictogrammes ➔ Idéogrammes ➔ Écriture Cunéiforme & Phonèmes ➔ Révolution de l'Alphabet Phénicien (1200 av. J.-C.) !
                </div>
            `;
            if (window.soundEngine) {
                window.soundEngine.playClay();
                window.soundEngine.playSuccess();
            }

            setTimeout(() => {
                this.renderCuneiformCarvingWorkshop();
            }, 1400);
        } else {
            let errorDetail = "";
            if (this.writingSelected[0] !== 1) {
                errorDetail = "Rappelez-vous : avant de dessiner, les humains ont d'abord utilisé de petites boules d'argile (<strong>calculis</strong>, ~3500 av. J.-C.) pour dénombrer les récoltes et le bétail.";
            } else if (this.writingSelected[4] !== 5) {
                errorDetail = "L'<strong>alphabet</strong> a été inventé beaucoup plus tard (1200 av. J.-C.) par les Phéniciens pour simplifier les cunéiformes avec seulement 22 lettres !";
            } else if (this.writingSelected[1] !== 2) {
                errorDetail = "Le premier stade du dessin est le <strong>pictogramme</strong> (~3300 av. J.-C.), représentant directement un objet concret ou être vivant.";
            } else if (this.writingSelected[2] !== 3) {
                errorDetail = "Le deuxième stade est l'<strong>idéogramme</strong> (~3100 av. J.-C.), représentant une idée abstraite ou une action.";
            } else {
                errorDetail = "Le troisième stade est le <strong>phonème</strong> (cunéiforme en forme de coins/clous, ~2900 av. J.-C.), représentant les sons de la voix humaine.";
            }

            let hintHtml = `
                <div class="formative-feedback feedback-error">
                    <span>💡 <strong>Indice Pédagogique (Tentative ${this.attemptCounts["writing"]}) :</strong> ${errorDetail} Déplacez les cartes sur la tablette pour corriger l'ordre.</span>
            `;

            if (this.attemptCounts["writing"] >= 2) {
                hintHtml += `
                    <div style="margin-top:10px; font-size:0.9rem; color:#fde047; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
                        <span>📖 <em>Consultez le Codex pour relire la fiche complète sur l'évolution de l'écriture :</em></span>
                        <button class="hud-btn" style="padding:4px 12px; font-size:0.82rem;" onclick="window.codexManager.openModal('evolution_ecriture')">Ouvrir le Codex ➔</button>
                    </div>
                `;
            }

            hintHtml += `</div>`;
            feedbackArea.innerHTML = hintHtml;
            if (window.soundEngine) window.soundEngine.playChoice();
        }
    }

    // =========================================================================
    // ÉTAPE TACTILE GESTUELLE : GRAVURE DU CUNÉIFORME AU CALAME DANS L'ARGILE
    // =========================================================================
    renderCuneiformCarvingWorkshop() {
        const container = document.getElementById("minigame-content");
        if (!container) return;

        // Le signe sumérien sacré 𒀭 (DINGIR : Ciel, Dieu) composé de 4 clous cunéiformes
        this.cuneiformStrokes = [
            { id: 0, name: "Clou Horizontal (Terre/Horizon)", head: { x: 170, y: 160 }, tail: { x: 390, y: 160 }, angle: 0, completed: false },
            { id: 1, name: "Clou Vertical (Axe Céleste)", head: { x: 280, y: 55 }, tail: { x: 280, y: 265 }, angle: Math.PI / 2, completed: false },
            { id: 2, name: "Clou Oblique Descendant", head: { x: 195, y: 75 }, tail: { x: 365, y: 245 }, angle: Math.PI / 4, completed: false },
            { id: 3, name: "Clou Oblique Montant", head: { x: 195, y: 245 }, tail: { x: 365, y: 75 }, angle: -Math.PI / 4, completed: false }
        ];

        this.cuneiIsCarving = false;
        this.cuneiActiveStroke = null;
        this.cuneiCarvingProgress = 0;

        container.innerHTML = `
            <div class="minigame-header">
                <div>
                    <h3 class="minigame-title">🖋️ L'Atelier du Scribe : Gravure Gestuelle au Calame</h3>
                    <span style="color:var(--gold-light); font-size:0.9rem;">Module 3 • Maniement du roseau biseauté dans l'argile fraîche</span>
                </div>
                <button class="hud-btn" style="padding:6px 14px; font-size:0.85rem;" onclick="window.codexManager.openModal('evolution_ecriture')">📖 Codex</button>
            </div>

            <div class="clay-carving-studio">
                <p class="minigame-instructions" style="margin-top:0;">
                    L'écriture cunéiforme (<em>cuneus</em> = « coin » en latin) se réalisait en deux gestes tangibles :
                    <strong>enfoncer la pointe triangulaire</strong> du roseau dans l'argile humide pour imprimer la tête du coin,
                    puis <strong>glisser</strong> fermement pour inciser la tige rectiligne.
                    Gravez le signe sacré <strong>𒀭 (DINGIR)</strong> (le Ciel / le Divin) en suivant les 4 repères dorés.
                </p>

                <div class="clay-canvas-frame">
                    <canvas id="clay-tablet-canvas" width="560" height="320"></canvas>
                </div>

                <div class="clay-carving-toolbar">
                    <div class="cuneiform-progress-tracker" id="cuneiform-tracker">
                        <span style="color:var(--gold-light); font-size:0.88rem; font-weight:bold;">Coins gravés :</span>
                        <div class="cuneiform-badge" id="cunei-badge-0">1</div>
                        <div class="cuneiform-badge" id="cunei-badge-1">2</div>
                        <div class="cuneiform-badge" id="cunei-badge-2">3</div>
                        <div class="cuneiform-badge" id="cunei-badge-3">4</div>
                    </div>

                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="hud-btn" onclick="window.minigames.resetCuneiformCanvas()">🔄 Lisser l'Argile</button>
                        <button class="hud-btn" style="background:rgba(212,175,55,0.25); border-color:var(--gold-primary);" onclick="window.minigames.carveNextWedgeAuto()">
                            🖋️ Enfoncer le Calame (Aide)
                        </button>
                    </div>
                </div>

                <div id="cuneiform-feedback-area" style="margin-top:14px;">
                    <div class="formative-feedback feedback-hint">
                        💡 <strong>Geste du scribe :</strong> Cliquez ou touchez l'un des cercles dorés pour enfoncer la tête du coin, puis glissez le calame vers l'autre extrémité pour marquer l'argile.
                    </div>
                </div>
            </div>
        `;

        this.initCuneiformCanvas();
    }

    initCuneiformCanvas() {
        const canvas = document.getElementById("clay-tablet-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        this.cuneiCanvas = canvas;
        this.cuneiCtx = ctx;

        this.drawCuneiformScene();

        const getCanvasCoords = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        };

        canvas.onpointerdown = (e) => {
            canvas.setPointerCapture(e.pointerId);
            const pos = getCanvasCoords(e);

            // Rechercher si le clic touche la tête d'un clou non complété (rayon 38px)
            const targetStroke = this.cuneiformStrokes.find(st => {
                if (st.completed) return false;
                const dx = pos.x - st.head.x;
                const dy = pos.y - st.head.y;
                return Math.sqrt(dx * dx + dy * dy) < 38;
            });

            if (targetStroke) {
                this.cuneiIsCarving = true;
                this.cuneiActiveStroke = targetStroke;
                this.cuneiCarvingProgress = 0.15;
                if (window.soundEngine) {
                    window.soundEngine.playClay();
                    window.soundEngine.playChisel();
                }
                this.drawCuneiformScene(pos);
            }
        };

        canvas.onpointermove = (e) => {
            if (!this.cuneiIsCarving || !this.cuneiActiveStroke) return;
            const pos = getCanvasCoords(e);
            const st = this.cuneiActiveStroke;

            const totalDist = Math.hypot(st.tail.x - st.head.x, st.tail.y - st.head.y);
            const curDist = Math.hypot(pos.x - st.head.x, pos.y - st.head.y);
            this.cuneiCarvingProgress = Math.min(1, Math.max(0.15, curDist / totalDist));

            this.drawCuneiformScene(pos);
        };

        canvas.onpointerup = (e) => {
            if (!this.cuneiIsCarving || !this.cuneiActiveStroke) return;
            const pos = getCanvasCoords(e);
            const st = this.cuneiActiveStroke;

            const totalDist = Math.hypot(st.tail.x - st.head.x, st.tail.y - st.head.y);
            const curDist = Math.hypot(pos.x - st.head.x, pos.y - st.head.y);
            const tailDist = Math.hypot(pos.x - st.tail.x, pos.y - st.tail.y);

            // Succès si étiré à plus de 60% ou relâché près de la queue
            if (curDist / totalDist >= 0.55 || tailDist < 40) {
                st.completed = true;
                if (window.soundEngine) {
                    window.soundEngine.playClay();
                }
                this.updateCuneiformBadges();
                this.checkCuneiformCompletion();
            }

            this.cuneiIsCarving = false;
            this.cuneiActiveStroke = null;
            this.cuneiCarvingProgress = 0;
            this.drawCuneiformScene();
        };

        canvas.onpointercancel = () => {
            this.cuneiIsCarving = false;
            this.cuneiActiveStroke = null;
            this.drawCuneiformScene();
        };
    }

    drawCuneiformScene(activePointerPos = null) {
        if (!this.cuneiCanvas || !this.cuneiCtx) return;
        const ctx = this.cuneiCtx;
        const w = this.cuneiCanvas.width;
        const h = this.cuneiCanvas.height;

        // 1. Texture de la motte d'argile fraîche
        ctx.save();
        const grad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w / 1.7);
        grad.addColorStop(0, "#b87a38");
        grad.addColorStop(0.5, "#935a22");
        grad.addColorStop(1, "#542e0f");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Micro-fissures et grains d'argile
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        for (let i = 0; i < 40; i++) {
            const rx = (i * 37) % w;
            const ry = (i * 53) % h;
            ctx.beginPath();
            ctx.arc(rx, ry, (i % 3) + 1, 0, Math.PI * 2);
            ctx.fill();
        }

        // Cadre biseauté d'enfoncement de tablette
        ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, w - 20, h - 20);
        ctx.strokeStyle = "rgba(255, 230, 160, 0.25)";
        ctx.lineWidth = 2;
        ctx.strokeRect(14, 14, w - 28, h - 28);
        ctx.restore();

        // 2. Tracé des repères et des coins cunéiformes
        this.cuneiformStrokes.forEach((st) => {
            if (st.completed) {
                this.drawCuneiformWedge(ctx, st, 1.0);
            } else {
                // Guideline subtile
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash([6, 6]);
                ctx.strokeStyle = "rgba(253, 224, 71, 0.4)";
                ctx.lineWidth = 3;
                ctx.moveTo(st.head.x, st.head.y);
                ctx.lineTo(st.tail.x, st.tail.y);
                ctx.stroke();

                // Tête de clou cible
                ctx.setLineDash([]);
                ctx.fillStyle = "rgba(245, 158, 11, 0.35)";
                ctx.strokeStyle = "#fde047";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(st.head.x, st.head.y, 14, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Point central
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                ctx.arc(st.head.x, st.head.y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });

        // 3. Clou en cours de gravure active
        if (this.cuneiIsCarving && this.cuneiActiveStroke) {
            this.drawCuneiformWedge(ctx, this.cuneiActiveStroke, this.cuneiCarvingProgress);
        }
    }

    drawCuneiformWedge(ctx, st, progress) {
        ctx.save();
        const head = st.head;
        const angle = Math.atan2(st.tail.y - st.head.y, st.tail.x - st.head.x);
        const totalDist = Math.hypot(st.tail.x - st.head.x, st.tail.y - st.head.y);
        const curLength = totalDist * progress;

        ctx.translate(head.x, head.y);
        ctx.rotate(angle);

        // Tête triangulaire (empreinte du biseau du roseau)
        const headW = 24;
        const headL = 26;

        // Ombre portée profonde dans l'argile
        ctx.fillStyle = "#221105";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-headL, -headW / 2);
        ctx.lineTo(-headL, headW / 2);
        ctx.closePath();
        ctx.fill();

        // Facette éclairée en relief
        ctx.fillStyle = "#3d1f0a";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-headL, 0);
        ctx.lineTo(-headL, headW / 2);
        ctx.closePath();
        ctx.fill();

        // Tige creusée (sillon s'étirant et s'effilant)
        if (curLength > 0) {
            const furrowW = 8;
            ctx.fillStyle = "#1e0e04";
            ctx.beginPath();
            ctx.moveTo(0, -furrowW / 2);
            ctx.lineTo(curLength, 0);
            ctx.lineTo(0, furrowW / 2);
            ctx.closePath();
            ctx.fill();

            // Liseré clair sur le bord de l'argile refoulée
            ctx.strokeStyle = "rgba(245, 215, 160, 0.4)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, furrowW / 2);
            ctx.lineTo(curLength, 0);
            ctx.stroke();
        }

        ctx.restore();
    }

    updateCuneiformBadges() {
        this.cuneiformStrokes.forEach((st, idx) => {
            const badge = document.getElementById(`cunei-badge-${idx}`);
            if (badge) {
                if (st.completed) {
                    badge.className = "cuneiform-badge done";
                    badge.innerHTML = "✓";
                } else if (this.cuneiformStrokes.findIndex(s => !s.completed) === idx) {
                    badge.className = "cuneiform-badge active";
                    badge.innerHTML = `${idx + 1}`;
                }
            }
        });
    }

    carveNextWedgeAuto() {
        const nextStroke = this.cuneiformStrokes.find(st => !st.completed);
        if (!nextStroke) return;

        nextStroke.completed = true;
        if (window.soundEngine) {
            window.soundEngine.playClay();
            window.soundEngine.playChisel();
        }

        this.updateCuneiformBadges();
        this.drawCuneiformScene();
        this.checkCuneiformCompletion();
    }

    resetCuneiformCanvas() {
        this.cuneiformStrokes.forEach(st => st.completed = false);
        if (window.soundEngine) window.soundEngine.playClay();
        this.updateCuneiformBadges();
        this.drawCuneiformScene();
        const fb = document.getElementById("cuneiform-feedback-area");
        if (fb) {
            fb.innerHTML = `
                <div class="formative-feedback feedback-hint">
                    🔄 <em>L'argile a été relissée avec de l'eau.</em> Prenez à nouveau le calame et gravez les 4 coins du signe divin.
                </div>
            `;
        }
    }

    checkCuneiformCompletion() {
        const allCompleted = this.cuneiformStrokes.every(st => st.completed);
        if (!allCompleted) return;

        // Déverrouillage de l'artefact calame et médaille
        if (window.gameEngine) {
            window.gameEngine.unlockArtifact("calame");
            window.gameEngine.unlockMedal("master_scribe");
        }

        if (window.soundEngine) {
            window.soundEngine.playSuccess();
        }

        // Halo d'or sur le canvas
        if (this.cuneiCtx && this.cuneiCanvas) {
            const ctx = this.cuneiCtx;
            ctx.save();
            ctx.fillStyle = "rgba(253, 224, 71, 0.15)";
            ctx.fillRect(0, 0, this.cuneiCanvas.width, this.cuneiCanvas.height);
            ctx.strokeStyle = "rgba(253, 224, 71, 0.8)";
            ctx.lineWidth = 4;
            ctx.strokeRect(8, 8, this.cuneiCanvas.width - 16, this.cuneiCanvas.height - 16);
            ctx.restore();
        }

        const feedbackArea = document.getElementById("cuneiform-feedback-area");
        if (feedbackArea) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-success" style="animation: inspectorPop 0.4s ease-out;">
                    <div style="font-size:1.05rem; margin-bottom:8px;">
                        ✨ <strong>Gravure Accomplie avec Précision de Maître Scribe !</strong>
                    </div>
                    <p style="margin:0 0 10px; line-height:1.5;">
                        Vous avez parfaitement incisé le signe sumérien <strong>𒀭 (DINGIR)</strong> dans l'argile humide.
                        Le <strong>Calame en Roseau</strong> a été déposé dans votre <strong>Sacoche d'Artefacts</strong> !
                    </p>
                    <button class="btn-primary-start" style="padding:10px 24px; font-size:0.95rem;" onclick="window.minigames.renderWritingTimelineSynthesis()">
                        Contempler la Tablette & Voir la Synthèse Pédagogique ➔
                    </button>
                </div>
            `;
        }
    }

    renderWritingTimelineSynthesis() {
        const container = document.getElementById("minigame-content");
        if (!container) return;

        if (window.soundEngine) window.soundEngine.playFanfare();

        const timelineStages = [
            {
                date: "~3500 av. J.-C.",
                stage: "Origine Comptable",
                title: "Les Calculis",
                icon: "⚪",
                desc: "Petites boules ou jetons d'argile de formes géométriques insérés dans des bulles scellées.",
                keyNote: "Utilisés pour dénombrer les troupeaux et les récoltes (comptabilité primitive sans écriture graphique)."
            },
            {
                date: "~3300 av. J.-C.",
                stage: "Stade 1",
                title: "Les Pictogrammes",
                icon: "🌾",
                desc: "Dessins figuratifs gravés représentant directement des êtres vivants (animaux, personnes) ou des objets concrets (épis, jarres).",
                keyNote: "Chaque signe correspond à une chose réelle visible dans la vie quotidienne."
            },
            {
                date: "~3100 av. J.-C.",
                stage: "Stade 2",
                title: "Les Idéogrammes",
                icon: "💡",
                desc: "Combinaisons de symboles abstraits pour exprimer des actions, des émotions ou des idées complexes (ex. bouche + pain = « manger »).",
                keyNote: "Permet de dépasser la simple représentation d'objets pour traduire des concepts abstraits."
            },
            {
                date: "~2900 av. J.-C.",
                stage: "Stade 3",
                title: "Cunéiforme & Phonèmes",
                icon: "📐",
                desc: "Signes stylisés en forme de coins/clous gravés au calame biseauté dans l'argile fraîche représentant les sons (syllabes) de la langue parlée.",
                keyNote: "L'écriture officielle de la Mésopotamie pour archiver les lois, le commerce et les mythes."
            },
            {
                date: "1200 av. J.-C.",
                stage: "Révolution Phénicienne",
                title: "L'Alphabet Phénicien",
                icon: "🔤",
                desc: "Système révolutionnaire composé de seulement 22 lettres consonantiques simples représentant chacune un son élémentaire.",
                keyNote: "Beaucoup moins de signes à mémoriser : apprentissage grandement facilité et diffusion commerciale fulgurante !"
            }
        ];

        // Enregistrement dans le Codex
        if (window.codexManager) {
            window.codexManager.addSynthesis({
                id: "writing",
                title: "L'Évolution des Signes & de l'Écriture",
                icon: "📜",
                items: timelineStages.map(s => ({ title: `${s.date} — ${s.title}`, desc: `${s.desc} (${s.keyNote})` }))
            });
        }
        if (window.gameEngine && typeof window.gameEngine.recordMinigameCompletion === "function") {
            window.gameEngine.recordMinigameCompletion("writing", (this.attemptCounts["writing"] || 1) <= 1);
        }

        container.innerHTML = `
            <div class="synthesis-card timeline-synthesis-card">
                <div class="synthesis-header">
                    <span style="font-size:2.2rem;">📜</span>
                    <div>
                        <h3 class="synthesis-title">Ligne du Temps : L'Évolution des Signes & de l'Écriture</h3>
                        <span style="color:var(--gold-light); font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">
                            Fiche Synthèse Visuelle • Module 3 (Enregistrée dans votre Codex)
                        </span>
                    </div>
                </div>

                <p style="font-size:0.95rem; color:var(--text-primary); margin-bottom:16px;">
                    ✨ <strong>Bravo Scribe d'Ur !</strong> Voici la chronologie complète et les définitions fondamentales à retenir pour votre examen :
                </p>

                <!-- FRISE CHRONOLOGIQUE HORIZONTALE -->
                <div class="timeline-visual-track">
                    ${timelineStages.map((st, i) => `
                        <div class="timeline-stage-card">
                            <div class="timeline-stage-top">
                                <span class="timeline-badge-date">${st.date}</span>
                                <span class="timeline-badge-stage">${st.stage}</span>
                            </div>
                            <div class="timeline-icon-circle">
                                <span>${st.icon}</span>
                            </div>
                            <h4 class="timeline-stage-title">${st.title}</h4>
                            <p class="timeline-stage-desc">${st.desc}</p>
                            <div class="timeline-stage-key">
                                <strong>💡 À retenir :</strong> ${st.keyNote}
                            </div>
                            ${i < timelineStages.length - 1 ? '<div class="timeline-connector-arrow">➔</div>' : ''}
                        </div>
                    `).join('')}
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:22px;">
                    <button class="btn-primary-start" style="padding:12px 28px; font-size:1.05rem;" onclick="window.minigames.finishCurrentGame()">
                        Continuer l'Aventure ➔
                    </button>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // MINI-JEU 2 : LE TRIBUNAL DE BABYLONE & CODE D'HAMMOURABI (1750 av. J.-C.)
    // =========================================================================
    startHammurabiTrial(onComplete) {
        this.onCompleteCallback = onComplete;
        this.currentMinigame = "hammurabi";
        if (!this.attemptCounts["hammurabi"]) this.attemptCounts["hammurabi"] = 0;

        this.trialCases = [
            {
                id: 1,
                title: "Affaire I : Litige commercial sur les quais d'Ur",
                scenario: "Un grand marchand a vendu 40 jarres d'huile d'olive à un boulanger sans établir de contrat écrit scellé par un scribe. Après réception, le marchand exige le double du paiement convenu verbalement.",
                options: [
                    {
                        text: "Annuler la transaction : Sans contrat écrit ni sceau officiel de scribe, l'accord n'a aucune valeur légale et le vendeur est débouté.",
                        correct: true,
                        rationale: "Exact ! Le Code d'Hammourabi stipule qu'une transaction sans contrat écrit ni témoins est nulle, protégeant ainsi contre la fraude."
                    },
                    {
                        text: "Donner raison au marchand car la parole d'un noble a toujours préséance sur celle d'un artisan.",
                        correct: false,
                        rationale: "Le Code d'Hammourabi a justement été rédigé pour que la règle écrite s'applique à tous et ne dépende pas de l'arbitraire ou du rang social."
                    },
                    {
                        text: "Faire emprisonner le boulanger sans examiner de preuve.",
                        correct: false,
                        rationale: "La justice babylonienne exige des preuves tangibles et des traces écrites."
                    }
                ]
            },
            {
                id: 2,
                title: "Affaire II : Rupture de digue d'irrigation à Babylone",
                scenario: "Un propriétaire terrien a négligé d'entretenir la digue de son canal. Sous la pression de la crue, la digue s'est rompue et a inondé les champs de blé de son voisin, anéantissant sa récolte de l'année.",
                options: [
                    {
                        text: "Déclarer la perte comme une fatalité divine due à la volonté des dieux du fleuve.",
                        correct: false,
                        rationale: "La société mésopotamienne repose sur des devoirs civiques stricts concernant l'entretien des réseaux d'irrigation."
                    },
                    {
                        text: "Condamner le propriétaire négligent à rembourser intégralement sur ses propres réserves le blé détruit chez son voisin.",
                        correct: true,
                        rationale: "Excellente décision ! Selon la stèle d'Hammourabi, quiconque néglige sa digue et cause un dommage au champ d'autrui doit indemniser la victime en grains."
                    },
                    {
                        text: "Ordonner au voisin inondé de reconstruire la digue à ses frais exclusifs.",
                        correct: false,
                        rationale: "La loi protège la victime et sanctionne l'auteur de la négligence."
                    }
                ]
            },
            {
                id: 3,
                title: "Affaire III : La portée de la loi écrite dans la cité-État",
                scenario: "Un magistrat provincial demande pourquoi le Roi Hammourabi a fait graver ses lois sur une immense stèle de diorite noire au centre de la place publique plutôt que de laisser les juges décider oralement.",
                options: [
                    {
                        text: "Pour que les lois soient diffusées, connues de tous et appliquées de la même façon pour tous, instaurant l'égalité devant la règle écrite.",
                        correct: true,
                        rationale: "Brillant ! C'est le fondement de la justice antique : la loi écrite est fixe, publique, universelle et prévisible."
                    },
                    {
                        text: "Uniquement pour décorer la place centrale de la cité-État avec de la belle pierre noire.",
                        correct: false,
                        rationale: "La stèle a une fonction juridique et politique essentielle : diffuser le droit et limiter l'arbitraire."
                    },
                    {
                        text: "Pour cacher les lois au peuple et les réserver aux prêtres.",
                        correct: false,
                        rationale: "La stèle est dressée sur la place publique précisément pour que chacun puisse consulter la loi du Roi."
                    }
                ]
            }
        ];

        this.currentTrialIndex = 0;
        this.renderTrialCase();
        this.openOverlay();
    }

    renderTrialCase() {
        const container = document.getElementById("minigame-content");
        const c = this.trialCases[this.currentTrialIndex];
        if (!c) return;

        container.innerHTML = `
            <div class="minigame-header">
                <div>
                    <h3 class="minigame-title">⚖️ Le Tribunal Royal de Babylone (1750 av. J.-C.)</h3>
                    <span style="color:var(--gold-light); font-size:0.9rem;">Procès ${this.currentTrialIndex + 1} / ${this.trialCases.length} • Code de Lois Écrites</span>
                </div>
                <button class="hud-btn" style="padding:6px 14px; font-size:0.85rem;" onclick="window.codexManager.openModal('code_hammourabi')">📖 Consulter le Codex</button>
            </div>

            <div class="stele-container">
                <div class="stele-visual">
                    <div class="stele-cuneiform-banner">𒀭 𒄩 𒄠 𒈬 𒊏 𒁉</div>
                    <h4 style="color:var(--gold-light); margin-bottom:8px;">🏛️ Stèle du Code d'Hammourabi</h4>
                    <p style="font-size:0.88rem; font-style:italic; line-height:1.5; color:#cbd5e1; margin-bottom:12px;">
                        « Afin que le fort n'opprime pas le faible, pour faire justice à l'orphelin et à la veuve, j'ai gravé mes précieuses paroles sur ma stèle... »
                    </p>
                </div>

                <div class="trial-cases-box">
                    <div class="case-card">
                        <h4 style="color:var(--gold-light); margin-bottom:8px;">${c.title}</h4>
                        <p style="font-size:1.02rem; line-height:1.6; color:#fff; margin-bottom:16px;">${c.scenario}</p>

                        <div style="font-size:0.9rem; color:#93c5fd; margin-bottom:10px; font-weight:600;">
                            Choisissez le verdict conforme au Code d'Hammourabi :
                        </div>

                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${c.options.map((opt, idx) => `
                                <button class="choice-btn" onclick="window.minigames.resolveTrialOption(${idx})">
                                    <span class="choice-bullet">${String.fromCharCode(65 + idx)}</span>
                                    <span>${opt.text}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div id="trial-feedback-area"></div>
        `;
    }

    resolveTrialOption(optionIndex) {
        const c = this.trialCases[this.currentTrialIndex];
        const selected = c.options[optionIndex];
        const feedbackArea = document.getElementById("trial-feedback-area");
        if (!feedbackArea) return;

        if (selected.correct) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-success">
                    <span>✨ <strong>Jugement Conforme :</strong> ${selected.rationale}</span>
                </div>
            `;
            if (window.soundEngine) {
                window.soundEngine.playChisel();
                window.soundEngine.playSuccess();
            }

            setTimeout(() => {
                this.currentTrialIndex++;
                if (this.currentTrialIndex < this.trialCases.length) {
                    this.renderTrialCase();
                } else {
                    this.renderSynthesis(
                        "Le Code d'Hammourabi & les Cités-États",
                        "⚖️",
                        [
                            { title: "1. La Première Loi de l'Histoire", desc: "Rédigée en 1750 av. J.-C. par le Roi Hammourabi de Babylone et gravée dans une stèle en diorite noire." },
                            { title: "2. Les Cités-États Autonomes", desc: "Ur, Babylone et Lagash possédaient leur propre gouvernement autonome et étaient dirigées par un roi." },
                            { title: "3. Avantages des Lois Écrites", desc: "1) Application uniforme pour tous (apparition de l'égalité devant la sanction), 2) Diffusion claire des règles connues de la population." },
                            { title: "4. Le Roi Arbitre Suprême", desc: "Avec l'essor du commerce et la croissance territoriale, le roi arbitrait les litiges économiques, de propriété et d'irrigation." }
                        ]
                    );
                }
            }, 1800);
        } else {
            this.attemptCounts["hammurabi"] = (this.attemptCounts["hammurabi"] || 0) + 1;
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-error">
                    <span>💡 <strong>Indice de Justice :</strong> ${selected.rationale} Relisez le principe de la stèle et choisissez le verdict équitable.</span>
                </div>
            `;
            if (window.soundEngine) window.soundEngine.playChoice();
        }
    }

    // =========================================================================
    // MINI-JEU 3 : LE RÉSEAU HYDRAULIQUE DU TIGRE, DE L'EUPHRATE & DU NIL
    // =========================================================================
    startNileIrrigationPuzzle(onComplete) {
        this.onCompleteCallback = onComplete;
        this.currentMinigame = "nile";
        if (!this.attemptCounts["nile"]) this.attemptCounts["nile"] = 0;

        this.gatesData = [
            { id: 1, name: "Canal des Maraîchers (Fruits & Légumes)", icon: "🥬", open: false, target: true, role: "Nourrit les cultures horticoles fertiles grâce au limon." },
            { id: 2, name: "Canal des Champs de Céréales (Blé & Lin)", icon: "🌾", open: false, target: true, role: "Irrigue les grands champs de céréales nécessaires à la subsistance." },
            { id: 3, name: "Bassin de Dérivation du Village des Artisans", icon: "🛡️", open: false, target: true, role: "Canalise le surplus d'eau pour protéger les habitations des inondations." },
            { id: 4, name: "Vanne Perdue vers le Désert Aride", icon: "🏜️", open: false, target: false, role: "Gaspille l'eau précieuse dans les sables sans fertiliser de culture." }
        ];

        this.renderNilePuzzle();
        this.openOverlay();
    }

    renderNilePuzzle() {
        const container = document.getElementById("minigame-content");
        if (!container) return;

        const openCount = this.gatesData.filter(g => g.open).length;

        container.innerHTML = `
            <div class="minigame-header">
                <div>
                    <h3 class="minigame-title">🌊 Maître des Crues Fluviales (Tigre, Euphrate & Nil)</h3>
                    <span style="color:var(--gold-light); font-size:0.9rem;">Module 3 • Crues, Limon & Systèmes d'Irrigation</span>
                </div>
                <button class="hud-btn" style="padding:6px 14px; font-size:0.85rem;" onclick="window.codexManager.openModal('civilisation_nil')">📖 Consulter le Codex</button>
            </div>

            <p class="minigame-instructions">
                La <strong>crue annuelle</strong> des grands fleuves apporte le <strong>limon noir fertilisant</strong>.
                Régulez les vannes pour acheminer l'eau vers les cultures vitales et sécuriser les habitations des artisans sans gaspiller la ressource !
            </p>

            <div class="hydraulic-simulator">
                <div class="river-header-status">
                    <div>
                        <span style="color:#60a5fa; font-weight:bold;">🌊 Débit de la Crue : Fort</span>
                        <span style="color:#cbd5e1; font-size:0.85rem; margin-left:10px;">(Transport abondant de limon fertile)</span>
                    </div>
                    <div>
                        <span style="color:var(--gold-light); font-weight:bold;">Vannes Ouvertes : ${openCount} / 4</span>
                    </div>
                </div>

                <div class="water-flow-grid">
                    ${this.gatesData.map(g => `
                        <div class="gate-control-card ${g.open ? 'open' : ''}" onclick="window.minigames.toggleGate(${g.id})">
                            <div class="gate-icon">${g.open ? '🌊' : g.icon}</div>
                            <h4 style="color:var(--gold-light); font-size:0.95rem; margin-bottom:6px;">${g.name}</h4>
                            <p style="font-size:0.8rem; color:#cbd5e1; line-height:1.4; min-height:40px;">${g.role}</p>
                            <span class="gate-badge ${g.open ? 'badge-open' : 'badge-closed'}">
                                ${g.open ? '✓ Vanne Ouverte' : '✕ Vanne Fermée'}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div id="nile-feedback-area"></div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                <button class="hud-btn" onclick="window.minigames.resetGates()">🔄 Réinitialiser les Vannes</button>
                <button class="btn-primary-start" style="padding:10px 24px;" onclick="window.minigames.verifyHydraulicFlow()">
                    Déclencher la Crue Fertile ➔
                </button>
            </div>
        `;
    }

    toggleGate(gateId) {
        const gate = this.gatesData.find(g => g.id === gateId);
        if (gate) {
            gate.open = !gate.open;
            if (window.soundEngine) window.soundEngine.playWater();
            this.renderNilePuzzle();
        }
    }

    resetGates() {
        this.gatesData.forEach(g => g.open = false);
        if (window.soundEngine) window.soundEngine.playChoice();
        this.renderNilePuzzle();
    }

    verifyHydraulicFlow() {
        const feedbackArea = document.getElementById("nile-feedback-area");
        if (!feedbackArea) return;

        this.attemptCounts["nile"] = (this.attemptCounts["nile"] || 0) + 1;

        const g1 = this.gatesData.find(g => g.id === 1).open;
        const g2 = this.gatesData.find(g => g.id === 2).open;
        const g3 = this.gatesData.find(g => g.id === 3).open;
        const g4 = this.gatesData.find(g => g.id === 4).open;

        if (g1 && g2 && g3 && !g4) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-success">
                    ✨ <strong>Régulation Hydraulique Parfaite !</strong> Le limon fertile a enrichi les parcelles de fruits, légumes et céréales, tandis que le bassin de dérivation a empêché l'inondation du village des artisans !
                </div>
            `;
            if (window.soundEngine) {
                window.soundEngine.playWater();
                window.soundEngine.playSuccess();
            }

            setTimeout(() => {
                this.renderSynthesis(
                    "Les Fleuves, Crues & Systèmes Complexes d'Irrigation",
                    "🌊",
                    [
                        { title: "1. Les 6 Points Communs des Civilisations Fluviales", desc: "1) Proximité d'un fleuve, 2) Écriture, 3) Grandes constructions, 4) Structuration sociale, 5) Irrigation complexe, 6) Métallurgie." },
                        { title: "2. Les Grands Fleuves Antiques", desc: "Le Tigre et l'Euphrate en Mésopotamie, le Nil en Égypte, l'Indus en Inde et le Fleuve Jaune en Chine." },
                        { title: "3. La Crue et le Limon Fertile", desc: "La crue est l'élévation du cours d'eau qui dépose une boue organique ultra-fertile (le limon) essentielle pour cultiver fruits et légumes." },
                        { title: "4. Rôle Vital des Canaux et Digues", desc: "Contrôler l'eau, prévenir les inondations destructrices et acheminer la nourriture à toute la population." }
                    ]
                );
            }, 1800);
        } else {
            if (this.attemptCounts["nile"] >= 2) {
                feedbackArea.innerHTML = `
                    <div class="formative-feedback feedback-hint">
                        💡 <strong>Indice de l'Ingénieur :</strong> Ouvrez les 3 premières vannes (Maraîchers, Céréales, Bassin de dérivation) et laissez la vanne du désert fermée pour ne pas gaspiller l'eau !
                    </div>
                `;
            } else {
                let errorMsg = "La répartition des flots n'est pas optimale.";
                if (g4) {
                    errorMsg = "Attention : La vanne vers le désert aride est ouverte, gaspillant inutilement l'eau précieuse sans nourrir personne !";
                } else if (!g3) {
                    errorMsg = "Danger d'inondation : Le bassin de dérivation n'est pas ouvert, les eaux de crue menacent le village des artisans !";
                } else if (!g1 || !g2) {
                    errorMsg = "Pénurie agricole : Les canaux des cultures de fruits, légumes ou céréales n'ont pas reçu le limon indispensable !";
                }

                feedbackArea.innerHTML = `
                    <div class="formative-feedback feedback-error">
                        <span>💡 <strong>Indice Pédagogique :</strong> ${errorMsg} Ajustez vos vannes et réessayez.</span>
                    </div>
                `;
            }
            if (window.soundEngine) window.soundEngine.playChoice();
        }
    }

    // =========================================================================
    // MINI-JEU 4 : LA VRAIE BALANCE COMMERCIALE À DEUX PLATEAUX & SCEAU-CYLINDRE
    // =========================================================================
    startTradePuzzle(onComplete) {
        this.onCompleteCallback = onComplete;
        this.currentMinigame = "trade";
        if (!this.attemptCounts["trade"]) this.attemptCounts["trade"] = 0;

        // Catalogue historique des marchandises tangibles
        this.tradeGoods = [
            { id: "exp_ble_1", name: "Sac d'Orge des Canaux", weight: 10, icon: "🌾", category: "export", isIntruder: false, desc: "Surplus agricole fluvial d'Ur" },
            { id: "exp_ble_2", name: "Sac de Blé Moissonné", weight: 10, icon: "🌾", category: "export", isIntruder: false, desc: "Surplus agricole fluvial d'Ur" },
            { id: "exp_poterie", name: "Jarre de Céramique & Huile", weight: 15, icon: "🏺", category: "export", isIntruder: false, desc: "Artisanat d'argile des rives" },
            { id: "exp_cedre_intrus", name: "Grume de Bois de Cèdre", weight: 20, icon: "🪵", category: "export", isIntruder: true, desc: "Intrus : Le désert mésopotamien n'a pas de forêts de cèdre !" },
            { id: "imp_metaux", name: "Lingots de Cuivre & Étain", weight: 20, icon: "⛏️", category: "import", isIntruder: false, desc: "Métaux indispensables pour le bronze" },
            { id: "imp_lapis", name: "Parure de Lapis-Lazuli", weight: 15, icon: "💎", category: "import", isIntruder: false, desc: "Gemmes précieuses rapportées d'Orient" },
            { id: "imp_argile_intrus", name: "Brique d'Argile Fluviale", weight: 15, icon: "🧱", category: "import", isIntruder: true, desc: "Intrus : L'argile est omniprésente sur place !" }
        ];

        this.leftPanItems = [];
        this.rightPanItems = [];

        this.renderTradePuzzle();
        this.openOverlay();
    }

    renderTradePuzzle() {
        const container = document.getElementById("minigame-content");
        if (!container) return;

        container.innerHTML = `
            <div class="minigame-header">
                <div>
                    <h3 class="minigame-title">🏺 La Caravane Marchande & la Balance à Deux Plateaux</h3>
                    <span style="color:var(--gold-light); font-size:0.9rem;">Module 3 • Économie, Troc & Contrats Scellés</span>
                </div>
                <button class="hud-btn" style="padding:6px 14px; font-size:0.85rem;" onclick="window.codexManager.openModal('commerce_sciences')">📖 Consulter le Codex</button>
            </div>

            <p class="minigame-instructions">
                En l'absence de pièces de monnaie, le commerce reposait sur le <strong>troc équitable</strong> pesé au trébuchet.
                Chargez le <strong>Plateau Gauche</strong> avec les surplus mésopotamiens (grains et poteries)
                et le <strong>Plateau Droit</strong> avec les ressources rares importées d'Orient.
                Trouvez l'<strong>équilibre parfait des masses (35 kg = 35 kg)</strong> sans charger les intrus géographiques !
            </p>

            <!-- ÉTAPE 1 : LA BALANCE PHYSIQUE À DEUX PLATEAUX -->
            <div class="physical-balance-stage" id="balance-stage-area">
                <div class="scale-fulcrum-zone">
                    <div class="scale-base-pedestal"></div>
                    <div class="scale-column-stand"></div>
                    <div class="scale-pivot-hub"></div>
                    <div class="scale-pointer-needle" id="scale-needle"></div>
                    <div class="scale-equilibrium-dial" id="scale-dial-badge">
                        <span>⚖️</span>
                        <span id="scale-dial-text">Plateaux Vides (0° - Équilibre à vide)</span>
                    </div>

                    <!-- FLÉAU BASCULANT -->
                    <div class="scale-beam-bar" id="scale-beam">
                        <!-- PLATEAU GAUCHE (EXPORT) -->
                        <div class="scale-pan-assembly left-assembly" id="left-assembly">
                            <div class="scale-suspension-chains"></div>
                            <div class="scale-pan-dish" id="left-pan-dish">
                                <div class="pan-label-tag">🌾 EXPORT (G)</div>
                                <div id="left-pan-content" style="display:flex; flex-direction:column; gap:4px; width:100%;"></div>
                            </div>
                        </div>

                        <!-- PLATEAU DROIT (IMPORT) -->
                        <div class="scale-pan-assembly right-assembly" id="right-assembly">
                            <div class="scale-suspension-chains"></div>
                            <div class="scale-pan-dish" id="right-pan-dish">
                                <div class="pan-label-tag">💎 IMPORT (D)</div>
                                <div id="right-pan-content" style="display:flex; flex-direction:column; gap:4px; width:100%;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CARGO DES MARCHANDISES EN ENTREPÔT -->
                <div class="trade-warehouse-stage">
                    <!-- DÉPÔT GAUCHE (EXPORTATION LOCALE) -->
                    <div class="warehouse-depot">
                        <div class="depot-header" style="color:#f59e0b;">
                            <span>🌾 Surplus Locaux (Mésopotamie)</span>
                            <span style="font-size:0.75rem; color:#cbd5e1;">Cliquer pour charger sur plateau Gauche</span>
                        </div>
                        <div class="depot-items-list" id="warehouse-export-list">
                            ${this.renderWarehouseCategoryHtml("export")}
                        </div>
                    </div>

                    <!-- DÉPÔT DROIT (IMPORTATION LOINTAINE) -->
                    <div class="warehouse-depot">
                        <div class="depot-header" style="color:#38bdf8;">
                            <span>💎 Ressources Rares (Importations)</span>
                            <span style="font-size:0.75rem; color:#cbd5e1;">Cliquer pour charger sur plateau Droit</span>
                        </div>
                        <div class="depot-items-list" id="warehouse-import-list">
                            ${this.renderWarehouseCategoryHtml("import")}
                        </div>
                    </div>
                </div>
            </div>

            <div id="trade-feedback-area" style="margin-top:14px;"></div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; flex-wrap:wrap; gap:10px;">
                <button class="hud-btn" onclick="window.minigames.resetTradeScale()">🔄 Vider les Plateaux</button>
                <div style="display:flex; gap:10px;">
                    <button class="hud-btn" style="background:rgba(212,175,55,0.25); border-color:var(--gold-primary);" onclick="window.minigames.autoBalanceTrade()">
                        💡 Aide au Pesage
                    </button>
                    <button class="btn-primary-start" style="padding:10px 24px;" onclick="window.minigames.validateTradeScale()">
                        ⚖️ Vérifier la Balance & Sceller le Contrat ➔
                    </button>
                </div>
            </div>

            <!-- ZONE DU WORKSHOP SCEAU-CYLINDRE (RÉVÉLÉE APRÈS ÉQUILIBRE) -->
            <div id="seal-workshop-container"></div>
        `;

        this.updateBalanceScaleDOM();
    }

    renderWarehouseCategoryHtml(category) {
        return this.tradeGoods
            .filter(g => g.category === category)
            .map(item => {
                const isLoaded = this.leftPanItems.includes(item.id) || this.rightPanItems.includes(item.id);
                return `
                    <div class="trade-tangible-item ${isLoaded ? 'placed' : ''}" 
                         id="item-card-${item.id}"
                         onclick="window.minigames.togglePhysicalTradeItem('${item.id}')">
                        <div class="item-left-meta">
                            <span class="item-icon-em">${item.icon}</span>
                            <div>
                                <div class="item-title-txt">${item.name}</div>
                                <div style="font-size:0.72rem; color:#cbd5e1;">${item.desc}</div>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="item-weight-badge">${item.weight} kg</span>
                            <span style="font-size:0.8rem; color:${isLoaded ? '#ef4444' : '#fde047'}; font-weight:bold;">
                                ${isLoaded ? '✕ Retirer' : '+ Charger'}
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
    }

    togglePhysicalTradeItem(itemId) {
        const item = this.tradeGoods.find(g => g.id === itemId);
        if (!item) return;

        // Si déjà dans le plateau gauche, on le retire
        if (this.leftPanItems.includes(itemId)) {
            this.leftPanItems = this.leftPanItems.filter(id => id !== itemId);
        }
        // Si déjà dans le plateau droit, on le retire
        else if (this.rightPanItems.includes(itemId)) {
            this.rightPanItems = this.rightPanItems.filter(id => id !== itemId);
        }
        // Sinon on le place dans son plateau respectif
        else {
            if (item.category === "export") {
                this.leftPanItems.push(itemId);
            } else {
                this.rightPanItems.push(itemId);
            }
        }

        if (window.soundEngine) {
            window.soundEngine.playCoins();
            window.soundEngine.playBalanceTilt();
        }

        this.updateBalanceScaleDOM();
    }

    updateBalanceScaleDOM() {
        const beam = document.getElementById("scale-beam");
        const needle = document.getElementById("scale-needle");
        const leftAssembly = document.getElementById("left-assembly");
        const rightAssembly = document.getElementById("right-assembly");
        const dialText = document.getElementById("scale-dial-text");
        const dialBadge = document.getElementById("scale-dial-badge");
        const leftContent = document.getElementById("left-pan-content");
        const rightContent = document.getElementById("right-pan-content");

        if (!beam || !leftContent || !rightContent) return;

        // Calcul des masses totales
        const leftGoods = this.tradeGoods.filter(g => this.leftPanItems.includes(g.id));
        const rightGoods = this.tradeGoods.filter(g => this.rightPanItems.includes(g.id));

        const weightLeft = leftGoods.reduce((sum, g) => sum + g.weight, 0);
        const weightRight = rightGoods.reduce((sum, g) => sum + g.weight, 0);

        // Physique de bascule
        const diff = weightRight - weightLeft;
        const tiltAngle = Math.max(-16, Math.min(16, diff * 1.1));
        const needleAngle = Math.max(-24, Math.min(24, diff * 1.5));

        // Application des rotations
        beam.style.transform = `rotate(${tiltAngle}deg)`;
        if (needle) needle.style.transform = `rotate(${needleAngle}deg)`;

        // Contre-rotation des plateaux pour qu'ils restent parfaitement horizontaux
        if (leftAssembly) leftAssembly.style.transform = `rotate(${-tiltAngle}deg)`;
        if (rightAssembly) rightAssembly.style.transform = `rotate(${-tiltAngle}deg)`;

        // Rendu des puces sur le plateau gauche
        leftContent.innerHTML = leftGoods.length > 0 
            ? leftGoods.map(g => `
                <div class="pan-item-chip" onclick="event.stopPropagation(); window.minigames.togglePhysicalTradeItem('${g.id}')">
                    <span>${g.icon} ${g.name} (${g.weight} kg)</span>
                    <span style="font-weight:bold; color:#fca5a5;">✕</span>
                </div>
            `).join('')
            : `<span style="font-size:0.75rem; color:#fde047; opacity:0.8;">Plateau vide</span>`;

        // Rendu des puces sur le plateau droit
        rightContent.innerHTML = rightGoods.length > 0 
            ? rightGoods.map(g => `
                <div class="pan-item-chip" onclick="event.stopPropagation(); window.minigames.togglePhysicalTradeItem('${g.id}')">
                    <span>${g.icon} ${g.name} (${g.weight} kg)</span>
                    <span style="font-weight:bold; color:#fca5a5;">✕</span>
                </div>
            `).join('')
            : `<span style="font-size:0.75rem; color:#7dd3fc; opacity:0.8;">Plateau vide</span>`;

        // État du cadran central
        if (dialText && dialBadge) {
            if (weightLeft === 0 && weightRight === 0) {
                dialText.innerHTML = `Plateaux Vides (0 kg)`;
                dialBadge.style.color = "#cbd5e1";
            } else if (weightLeft === weightRight) {
                dialText.innerHTML = `✨ <strong>Équilibre Parfait : ${weightLeft} kg = ${weightRight} kg</strong>`;
                dialBadge.style.color = "#86efac";
                dialBadge.style.borderColor = "#22c55e";
            } else if (weightLeft > weightRight) {
                dialText.innerHTML = `⚖️ Export Trop Lourd : Gauche ${weightLeft} kg > Droite ${weightRight} kg (Diff. -${weightLeft - weightRight} kg)`;
                dialBadge.style.color = "#f59e0b";
                dialBadge.style.borderColor = "rgba(245, 158, 11, 0.5)";
            } else {
                dialText.innerHTML = `⚖️ Import Trop Lourd : Gauche ${weightLeft} kg < Droite ${weightRight} kg (Diff. +${weightRight - weightLeft} kg)`;
                dialBadge.style.color = "#38bdf8";
                dialBadge.style.borderColor = "rgba(56, 189, 248, 0.5)";
            }
        }

        // Rafraîchir les états d'entrepôt
        this.tradeGoods.forEach(g => {
            const card = document.getElementById(`item-card-${g.id}`);
            if (card) {
                const isLoaded = this.leftPanItems.includes(g.id) || this.rightPanItems.includes(g.id);
                if (isLoaded) {
                    card.classList.add("placed");
                } else {
                    card.classList.remove("placed");
                }
            }
        });
    }

    autoBalanceTrade() {
        this.leftPanItems = ["exp_ble_1", "exp_ble_2", "exp_poterie"];
        this.rightPanItems = ["imp_metaux", "imp_lapis"];
        if (window.soundEngine) {
            window.soundEngine.playCoins();
            window.soundEngine.playSuccess();
        }
        this.updateBalanceScaleDOM();
        const fb = document.getElementById("trade-feedback-area");
        if (fb) {
            fb.innerHTML = `
                <div class="formative-feedback feedback-hint">
                    💡 <em>Cargaison équilibrée :</em> 20 kg de grains + 15 kg de poteries (35 kg d'exportations) équilibrent 20 kg de métaux + 15 kg de lapis-lazuli (35 kg d'importations).
                </div>
            `;
        }
    }

    resetTradeScale() {
        this.leftPanItems = [];
        this.rightPanItems = [];
        if (window.soundEngine) window.soundEngine.playChoice();
        this.updateBalanceScaleDOM();
        const fb = document.getElementById("trade-feedback-area");
        if (fb) fb.innerHTML = "";
    }

    validateTradeScale() {
        const feedbackArea = document.getElementById("trade-feedback-area");
        if (!feedbackArea) return;

        this.attemptCounts["trade"] = (this.attemptCounts["trade"] || 0) + 1;

        const leftGoods = this.tradeGoods.filter(g => this.leftPanItems.includes(g.id));
        const rightGoods = this.tradeGoods.filter(g => this.rightPanItems.includes(g.id));

        const weightLeft = leftGoods.reduce((sum, g) => sum + g.weight, 0);
        const weightRight = rightGoods.reduce((sum, g) => sum + g.weight, 0);

        const hasCedarIntruder = this.leftPanItems.includes("exp_cedre_intrus");
        const hasClayIntruder = this.rightPanItems.includes("imp_argile_intrus");

        if (hasCedarIntruder) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-error">
                    ⚠️ <strong>Erreur Historique : Le Bois de Cèdre est un intrus à l'exportation !</strong>
                    Le désert mésopotamien était dépourvu de forêts d'arbres droits. Le cèdre devait être <em>importé</em> du Liban pour bâtir les toits des temples.
                </div>
            `;
            if (window.soundEngine) window.soundEngine.playChoice();
            return;
        }

        if (hasClayIntruder) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-error">
                    ⚠️ <strong>Erreur Historique : L'Argile est un intrus à l'importation !</strong>
                    L'argile fluviale était disponible à volonté sur les berges du Tigre et de l'Euphrate. Les marchands d'Ur n'en importaient jamais !
                </div>
            `;
            if (window.soundEngine) window.soundEngine.playChoice();
            return;
        }

        if (weightLeft === 0 || weightRight === 0) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-hint">
                    ℹ️ Veuillez charger à la fois le <strong>Plateau Gauche</strong> (produits exportés) et le <strong>Plateau Droit</strong> (ressources importées) pour négocier.
                </div>
            `;
            return;
        }

        if (weightLeft === 35 && weightRight === 35 && !hasCedarIntruder && !hasClayIntruder) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-success">
                    ✨ <strong>Équilibre Parfait de la Balance Commerciale (35 kg = 35 kg) !</strong>
                    Vos surplus agricoles et vos céramiques fines compensent exactement la valeur des métaux et du lapis-lazuli.
                </div>
            `;
            if (window.soundEngine) {
                window.soundEngine.playCoins();
                window.soundEngine.playSuccess();
            }

            // Déclencher la phase gestuelle du sceau-cylindre
            setTimeout(() => {
                this.renderCylinderSealWorkshop();
            }, 1200);
        } else {
            const diff = Math.abs(weightRight - weightLeft);
            let hint = `La balance est déséquilibrée de ${diff} kg.`;
            if (this.attemptCounts["trade"] >= 2) {
                hint = `<strong>Indice :</strong> Chargez les 2 sacs de grains (10+10 kg) et la poterie (15 kg) à gauche (total 35 kg), puis les métaux (20 kg) et le lapis-lazuli (15 kg) à droite (total 35 kg).`;
            }
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-error">
                    <span>⚖️ <strong>Déséquilibre :</strong> ${hint} Retirez ou ajoutez des marchandises pour atteindre l'équivalence.</span>
                </div>
            `;
            if (window.soundEngine) window.soundEngine.playChoice();
        }
    }

    // =========================================================================
    // ÉTAPE TACTILE GESTUELLE : RATIFICATION AU SCEAU-CYLINDRE
    // =========================================================================
    renderCylinderSealWorkshop() {
        const container = document.getElementById("seal-workshop-container");
        if (!container) return;

        container.innerHTML = `
            <div class="cylinder-seal-workshop">
                <div class="pan-header" style="color:#f59e0b; justify-content:center; font-size:1.2rem;">
                    <span>📜 Ratification Officielle : Déroulez le Sceau-Cylindre</span>
                </div>
                <p style="font-size:0.9rem; line-height:1.5; color:#cbd5e1; max-width:650px; margin:8px auto 14px;">
                    En Mésopotamie, pour donner force de loi à un accord de troc, les négociants faisaient
                    <strong>rouler un sceau-cylindre en pierre gravée</strong> sur une bande d'argile encore fraîche.
                    L'empreinte continue en bas-relief garantissait l'authenticité infalsifiable de la transaction.
                </p>

                <div class="clay-frieze-strip-box">
                    <canvas id="seal-frieze-canvas" width="560" height="120" class="clay-frieze-canvas"></canvas>
                </div>

                <div class="seal-slider-control">
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#fde047; margin-bottom:6px;">
                        <span>🏺 Cylindre au point de départ</span>
                        <span id="seal-roll-pct">Progression : 0%</span>
                        <span>Sceau imprimé ➔</span>
                    </div>
                    <input type="range" id="seal-roll-slider" min="0" max="100" value="0" style="width:100%; cursor:pointer;">
                </div>

                <div id="seal-success-msg" style="margin-top:14px;"></div>
            </div>
        `;

        this.initSealCanvas();
    }

    initSealCanvas() {
        const canvas = document.getElementById("seal-frieze-canvas");
        const slider = document.getElementById("seal-roll-slider");
        const pctLabel = document.getElementById("seal-roll-pct");
        if (!canvas || !slider) return;

        const ctx = canvas.getContext("2d");
        this.sealCanvas = canvas;
        this.sealCtx = ctx;
        this.sealProgress = 0;

        this.drawSealFrieze(0);

        slider.oninput = (e) => {
            const val = parseInt(e.target.value, 10);
            this.sealProgress = val;
            if (pctLabel) pctLabel.innerText = `Progression : ${val}%`;
            this.drawSealFrieze(val / 100);

            if (val > 0 && val % 20 === 0 && window.soundEngine) {
                window.soundEngine.playSealRoll();
            }

            if (val >= 100) {
                this.finishSealRolling();
            }
        };
    }

    drawSealFrieze(progress) {
        if (!this.sealCanvas || !this.sealCtx) return;
        const ctx = this.sealCtx;
        const w = this.sealCanvas.width;
        const h = this.sealCanvas.height;

        // Bande d'argile humide
        ctx.fillStyle = "#78350f";
        ctx.fillRect(0, 0, w, h);

        // Texture d'argile
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        for (let i = 0; i < 30; i++) {
            ctx.fillRect((i * 41) % w, (i * 29) % h, 3, 2);
        }

        // Zone imprimée par le rouleau
        const rolledWidth = w * progress;
        if (rolledWidth > 0) {
            ctx.save();
            const imprintedGrad = ctx.createLinearGradient(0, 0, 0, h);
            imprintedGrad.addColorStop(0, "#92400e");
            imprintedGrad.addColorStop(0.5, "#b45309");
            imprintedGrad.addColorStop(1, "#542508");
            ctx.fillStyle = imprintedGrad;
            ctx.fillRect(0, 10, rolledWidth, h - 20);

            // Frise en bas-relief (motifs mésopotamiens répétés)
            ctx.strokeStyle = "#fde047";
            ctx.fillStyle = "#fef08a";
            ctx.lineWidth = 2;

            const segmentW = 140;
            const segments = Math.ceil(rolledWidth / segmentW);

            for (let s = 0; s < segments; s++) {
                const sx = s * segmentW;
                if (sx < rolledWidth) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(0, 0, rolledWidth, h);
                    ctx.clip();

                    // 1. Étoile d'Ishtar / Ciel
                    ctx.font = "24px sans-serif";
                    ctx.fillText("𒀭", sx + 20, 48);

                    // 2. Taureau ailé / Épi de blé
                    ctx.fillText("🌾", sx + 60, 52);
                    ctx.fillText("🐂", sx + 95, 52);

                    // 3. Vagues du Tigre et de l'Euphrate
                    ctx.beginPath();
                    ctx.strokeStyle = "rgba(253, 224, 71, 0.6)";
                    ctx.lineWidth = 2;
                    ctx.moveTo(sx + 10, 85);
                    ctx.bezierCurveTo(sx + 35, 75, sx + 55, 95, sx + 80, 85);
                    ctx.bezierCurveTo(sx + 105, 75, sx + 125, 95, sx + 140, 85);
                    ctx.stroke();

                    // 4. Inscription cunéiforme du contrat
                    ctx.font = "12px monospace";
                    ctx.fillStyle = "#fef08a";
                    ctx.fillText("𒁹 𒀭 𒂗 𒆠", sx + 30, 104);

                    ctx.restore();
                }
            }
            ctx.restore();
        }

        // Le cylindre lui-même (roulant au front d'avancement)
        if (progress < 1) {
            const cx = Math.max(16, Math.min(w - 16, rolledWidth));
            ctx.save();
            const cylinderGrad = ctx.createLinearGradient(cx - 14, 0, cx + 14, 0);
            cylinderGrad.addColorStop(0, "#1e293b");
            cylinderGrad.addColorStop(0.3, "#64748b");
            cylinderGrad.addColorStop(0.7, "#94a3b8");
            cylinderGrad.addColorStop(1, "#0f172a");
            ctx.fillStyle = cylinderGrad;
            ctx.strokeStyle = "#d4af37";
            ctx.lineWidth = 2;

            ctx.fillRect(cx - 14, 5, 28, h - 10);
            ctx.strokeRect(cx - 14, 5, 28, h - 10);

            // Gravures en creux sur le cylindre de pierre
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(cx - 8, 25, 16, 4);
            ctx.fillRect(cx - 10, 55, 20, 4);
            ctx.fillRect(cx - 6, 85, 12, 4);
            ctx.restore();
        }
    }

    finishSealRolling() {
        if (this.sealFinished) return;
        this.sealFinished = true;

        if (window.soundEngine) {
            window.soundEngine.playSealRoll();
            window.soundEngine.playSuccess();
        }

        // Déverrouillage de l'artefact sceau-cylindre et de la médaille
        if (window.gameEngine) {
            window.gameEngine.unlockArtifact("sceau_cylindre");
            window.gameEngine.unlockMedal("trade_baron");
        }

        const msgBox = document.getElementById("seal-success-msg");
        if (msgBox) {
            msgBox.innerHTML = `
                <div class="formative-feedback feedback-success" style="animation: inspectorPop 0.4s ease-out;">
                    <div style="font-size:1.05rem; margin-bottom:6px;">
                        ✨ <strong>Contrat Ratifié & Gravé dans l'Argile !</strong>
                    </div>
                    <p style="margin:0 0 10px; line-height:1.5;">
                        Le sceau-cylindre a déroulé son motif protecteur. L'accord commercial d'Ur est scellé pour l'éternité !
                        Le <strong>Sceau-Cylindre Royal</strong> a été déposé dans votre <strong>Sacoche d'Artefacts</strong>.
                    </p>
                    <button class="btn-primary-start" style="padding:10px 24px; font-size:0.95rem;" onclick="window.minigames.proceedToTradeSynthesis()">
                        Consulter la Synthèse sur le Troc & les Échanges ➔
                    </button>
                </div>
            `;
        }
    }

    proceedToTradeSynthesis() {
        this.renderSynthesis(
            "Le Commerce de Troc, les Échanges & les Surplus",
            "🏺",
            [
                { title: "1. Le Troc en l'Absence de Monnaie", desc: "Les échanges commerciaux reposaient sur le troc direct de denrées pesées au trébuchet et la rédaction de contrats officiels en argile scellés." },
                { title: "2. Les Produits Exportés (Mésopotamie)", desc: "Blé, orge, poteries et céramiques d'art, produits en abondance grâce à l'agriculture irriguée et l'argile des rives." },
                { title: "3. Les Produits Importés", desc: "Bois de construction (cèdre), métaux pour le bronze (cuivre, étain) et pierres précieuses (lapis-lazuli) absents du territoire." },
                { title: "4. Rôle Clé de l'Écriture Commerciale", desc: "Conserver des traces vérifiables des transactions, dettes et accords marchands à travers tout le Proche-Orient." }
            ]
        );
    }

    // =========================================================================
    // MINI-JEU 5 : LA PYRAMIDE SOCIALE DE LA ZIGGOURAT D'UR
    // =========================================================================
    startZigguratPuzzle(onComplete) {
        this.onCompleteCallback = onComplete;
        this.currentMinigame = "ziggurat";
        if (!this.attemptCounts["ziggurat"]) this.attemptCounts["ziggurat"] = 0;
        this.zigguratSlots = [null, null, null, null, null];
        this.selectedZigguratSlotIndex = null;
        this.selectedZigguratCardId = null;
        this.zigguratDragData = null;

        this.zigguratTiers = [
            { tier: 1, name: "1. Le Roi", icon: "👑", desc: "Pouvoir absolu, commande l'armée, promulgue les lois et perçoit les taxes." },
            { tier: 2, name: "2. Les Nobles", icon: "💎", desc: "Haut clergé, conseillers royaux, famille du roi ; possèdent les terres." },
            { tier: 3, name: "3. Fonctionnaires & Scribes", icon: "📜", desc: "Maîtrisent l'écriture, rédigent les actes officiels et contrats commerciaux." },
            { tier: 4, name: "4. Le Peuple Libre", icon: "🌾", desc: "Artisans, commerçants, paysans, éleveurs qui produisent les richesses." },
            { tier: 5, name: "5. Les Esclaves", icon: "⛓️", desc: "Aucun droit politique ou juridique, prisonniers de guerre ou esclaves pour dettes." }
        ];

        this.socialClassesPool = [
            { id: 4, label: "4. Le Peuple (Artisans, Commerçants, Paysans, Éleveurs)" },
            { id: 1, label: "1. Le Roi (Commandant suprême, législateur et chef religieux)" },
            { id: 5, label: "5. Les Esclaves (Dépourvus de droits, propriété du roi et des nobles)" },
            { id: 2, label: "2. Les Nobles (Conseillers royaux, hauts prêtres, propriétaires fonciers)" },
            { id: 3, label: "3. Les Fonctionnaires & Scribes (Administrateurs de l'écriture et des impôts)" }
        ];

        this.renderZigguratPuzzle();
        this.openOverlay();
    }

    renderZigguratPuzzle() {
        const container = document.getElementById("minigame-content");
        if (!container) return;

        const placedCount = this.zigguratSlots.filter(id => id !== null).length;

        container.innerHTML = `
            <div class="minigame-header">
                <div>
                    <h3 class="minigame-title">🏛️ L'Édification de la Ziggourat & la Hiérarchie Sociale</h3>
                    <span style="color:var(--gold-light); font-size:0.9rem;">Module 3 • Structure de la Société Mésopotamienne</span>
                </div>
                <button class="hud-btn" style="padding:6px 14px; font-size:0.85rem;" onclick="window.codexManager.openModal('hierarchie_sociale')">📖 Consulter le Codex</button>
            </div>

            <p class="minigame-instructions">
                La société mésopotamienne est hiérarchisée en <strong>5 niveaux stricts</strong> selon la <em>naissance</em> et la <em>spécialisation du travail</em>.
                Reconstituez la Ziggourat en <strong>glissant-déposant</strong> chaque classe sociale sur son étage, <strong>du sommet suprême (Niveau 1) jusqu'à la base (Niveau 5)</strong>.
                <em>💡 Astuce : En cas d'erreur, glissez un étage sur un autre pour les échanger, ou cliquez sur ✕ pour libérer la place !</em>
            </p>

            <div class="ziggurat-structure-view">
                <div style="font-family:var(--font-title); color:var(--gold-light); margin-bottom:12px; font-size:1.05rem; display:flex; justify-content:space-between; align-items:center;">
                    <span>🏛️ Étages de la Ziggourat (Glissez-déposez ici) :</span>
                    <span style="font-size:0.85rem; color:#d4af37;">${placedCount} / 5 étages bâtis</span>
                </div>

                <div class="ziggurat-pyramid-container ziggurat-tiers-wrapper" id="ziggurat-tiers-container">
                    ${this.zigguratTiers.map((t, slotIdx) => {
                        const filledClassId = this.zigguratSlots[slotIdx];
                        const classInfo = filledClassId ? this.zigguratTiers.find(item => item.tier === filledClassId) : null;
                        const isSlotSelected = this.selectedZigguratSlotIndex === slotIdx;
                        const isTargetWaiting = this.selectedZigguratCardId !== null && !filledClassId;

                        let tierClasses = `ziggurat-tier tier-${t.tier}`;
                        if (filledClassId) tierClasses += " placed";
                        else tierClasses += " empty";
                        if (isSlotSelected) tierClasses += " slot-selected";
                        if (isTargetWaiting) tierClasses += " slot-can-drop";

                        return `
                            <div class="${tierClasses}"
                                 id="ziggurat-tier-slot-${slotIdx}"
                                 draggable="${filledClassId !== null}"
                                 ondragstart="window.minigames.handleZigguratDragStart(event, 'tier', ${slotIdx})"
                                 ondragover="window.minigames.handleZigguratDragOver(event)"
                                 ondragleave="window.minigames.handleZigguratDragLeave(event)"
                                 ondrop="window.minigames.handleZigguratDropOnTier(event, ${slotIdx})"
                                 onclick="window.minigames.handleZigguratSlotClick(${slotIdx})"
                                 title="${filledClassId ? 'Glisser pour déplacer/échanger ou cliquer' : 'Déposer ici une classe sociale'}">
                                <div class="tier-header" style="display:flex; align-items:center; justify-content:space-between; width:100%; gap:8px;">
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <span style="font-size:1.25rem;">${classInfo ? classInfo.icon : t.icon}</span>
                                        <span class="tier-label">Niveau ${t.tier} : ${classInfo ? classInfo.name : 'Étage Vacant'}</span>
                                    </div>
                                    ${filledClassId ? `
                                        <div style="display:flex; align-items:center; gap:6px;">
                                            <span style="font-size:0.75rem; color:#f7e089; opacity:0.85; user-select:none;">✥ Glisser</span>
                                            <button class="slot-remove-btn" title="Retirer de cet étage" onclick="event.stopPropagation(); window.minigames.removeZigguratSlot(${slotIdx})">✕</button>
                                        </div>
                                    ` : `
                                        <span style="font-size:0.75rem; color:#94a3b8; font-style:italic;">${isTargetWaiting ? '⬇️ Déposer ici' : 'Vacant'}</span>
                                    `}
                                </div>
                                <div class="tier-content" style="width:100%; margin-top:4px;">
                                    ${classInfo ? `
                                        <span style="font-size:0.82rem; color:#cbd5e1; line-height:1.35; display:block;">${classInfo.desc}</span>
                                    ` : `
                                        <span style="font-size:0.78rem; color:#888; font-style:italic; display:block;">
                                            ${isTargetWaiting ? '👉 Cliquez ou glissez la classe sélectionnée ici' : 'Glissez-déposez la classe sociale correspondant à cet étage'}
                                        </span>
                                    `}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div style="margin-top:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                    <h4 style="color:var(--gold-light); margin:0;">Groupes Sociaux Disponibles (Glissez vers un étage ou cliquez) :</h4>
                    ${this.selectedZigguratCardId ? `<span style="font-size:0.85rem; color:#93c5fd;">👉 Carte sélectionnée : cliquez sur un étage pour la déposer</span>` : ''}
                    ${this.selectedZigguratSlotIndex !== null ? `<span style="font-size:0.85rem; color:#fde047;">👉 Étage sélectionné : cliquez sur un autre étage pour échanger</span>` : ''}
                </div>

                <div class="cards-pool" id="ziggurat-cards-pool"
                     ondragover="window.minigames.handleZigguratDragOver(event)"
                     ondragleave="window.minigames.handleZigguratDragLeave(event)"
                     ondrop="window.minigames.handleZigguratDropOnPool(event)"
                     title="Zone de réserve (vous pouvez y redéposer un étage pour le libérer)">
                    ${this.socialClassesPool.map(card => {
                        const isUsed = this.zigguratSlots.includes(card.id);
                        const isSelected = this.selectedZigguratCardId === card.id;

                        let cardClasses = "draggable-item";
                        if (isUsed) cardClasses += " used";
                        if (isSelected) cardClasses += " card-selected";

                        return `
                            <button class="${cardClasses}" 
                                    ${isUsed ? 'disabled' : ''} 
                                    draggable="${!isUsed}"
                                    ondragstart="window.minigames.handleZigguratDragStart(event, 'pool', ${card.id})"
                                    onclick="window.minigames.handleZigguratCardClick(${card.id})"
                                    title="${isUsed ? 'Déjà placée sur la Ziggourat' : 'Glisser sur un étage ou cliquer pour sélectionner'}">
                                <span>🏛️</span>
                                <span>${card.label}</span>
                                ${isUsed ? `<span style="margin-left:auto; font-size:0.72rem; color:#86efac;">(Sur la Ziggourat)</span>` : `<span style="margin-left:auto; font-size:0.72rem; color:#93c5fd;">(Glisser ✥)</span>`}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <div id="ziggurat-feedback-area"></div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; flex-wrap:wrap; gap:10px;">
                <button class="hud-btn" onclick="window.minigames.resetZiggurat()">🔄 Recommencer l'Édification</button>
                <button class="btn-primary-start" style="padding:10px 24px;" onclick="window.minigames.validateZiggurat()">
                    Bénir la Ziggourat au Panthéon
                </button>
            </div>
        `;
    }

    handleZigguratDragStart(event, sourceType, idOrIndex) {
        this.zigguratDragData = { sourceType, value: idOrIndex };
        if (event && event.dataTransfer) {
            event.dataTransfer.setData("text/plain", JSON.stringify(this.zigguratDragData));
            event.dataTransfer.effectAllowed = "move";
        }
        if (event && event.currentTarget) {
            event.currentTarget.classList.add("dragging");
        }
    }

    handleZigguratDragOver(event) {
        if (event) {
            event.preventDefault();
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "move";
            }
            const tierEl = event.currentTarget.closest(".ziggurat-tier");
            if (tierEl) {
                tierEl.classList.add("drag-over");
            } else if (event.currentTarget.id === "ziggurat-cards-pool") {
                event.currentTarget.classList.add("pool-drag-over");
            }
        }
    }

    handleZigguratDragLeave(event) {
        if (event) {
            const tierEl = event.currentTarget.closest(".ziggurat-tier");
            if (tierEl) {
                tierEl.classList.remove("drag-over");
            } else if (event.currentTarget.id === "ziggurat-cards-pool") {
                event.currentTarget.classList.remove("pool-drag-over");
            }
        }
    }

    handleZigguratDropOnTier(event, targetSlotIndex) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            const tierEl = event.currentTarget.closest(".ziggurat-tier");
            if (tierEl) tierEl.classList.remove("drag-over");
        }

        let dragData = this.zigguratDragData;
        if ((!dragData || !dragData.sourceType) && event && event.dataTransfer) {
            try {
                const raw = event.dataTransfer.getData("text/plain");
                if (raw) dragData = JSON.parse(raw);
            } catch (e) {}
        }

        if (!dragData) return;

        if (dragData.sourceType === "pool") {
            const cardId = dragData.value;
            const targetCurrent = this.zigguratSlots[targetSlotIndex];
            const prevSlot = this.zigguratSlots.indexOf(cardId);

            if (prevSlot !== -1) {
                this.zigguratSlots[prevSlot] = targetCurrent;
            }
            this.zigguratSlots[targetSlotIndex] = cardId;
            this.selectedZigguratCardId = null;
            this.selectedZigguratSlotIndex = null;
            if (window.soundEngine) window.soundEngine.playChisel();
        } else if (dragData.sourceType === "tier") {
            const sourceSlotIndex = dragData.value;
            if (sourceSlotIndex !== targetSlotIndex) {
                // Échange (SWAP) entre deux étages
                const temp = this.zigguratSlots[targetSlotIndex];
                this.zigguratSlots[targetSlotIndex] = this.zigguratSlots[sourceSlotIndex];
                this.zigguratSlots[sourceSlotIndex] = temp;
                this.selectedZigguratCardId = null;
                this.selectedZigguratSlotIndex = null;
                if (window.soundEngine) window.soundEngine.playChisel();
            }
        }

        this.zigguratDragData = null;
        this.renderZigguratPuzzle();
    }

    handleZigguratDropOnPool(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.classList.remove("pool-drag-over");
        }

        let dragData = this.zigguratDragData;
        if ((!dragData || !dragData.sourceType) && event && event.dataTransfer) {
            try {
                const raw = event.dataTransfer.getData("text/plain");
                if (raw) dragData = JSON.parse(raw);
            } catch (e) {}
        }

        if (dragData && dragData.sourceType === "tier") {
            const sourceSlotIndex = dragData.value;
            this.zigguratSlots[sourceSlotIndex] = null;
            this.selectedZigguratSlotIndex = null;
            if (window.soundEngine) window.soundEngine.playChoice();
        }

        this.zigguratDragData = null;
        this.renderZigguratPuzzle();
    }

    removeZigguratSlot(slotIndex) {
        if (this.zigguratSlots[slotIndex] !== null) {
            this.zigguratSlots[slotIndex] = null;
            if (this.selectedZigguratSlotIndex === slotIndex) {
                this.selectedZigguratSlotIndex = null;
            }
            if (window.soundEngine) window.soundEngine.playChoice();
            this.renderZigguratPuzzle();
        }
    }

    handleZigguratCardClick(cardId) {
        if (this.zigguratSlots.includes(cardId)) return;

        // Si un étage était sélectionné, déposer directement la carte dedans
        if (this.selectedZigguratSlotIndex !== null) {
            const currentInSlot = this.zigguratSlots[this.selectedZigguratSlotIndex];
            this.zigguratSlots[this.selectedZigguratSlotIndex] = cardId;
            this.selectedZigguratSlotIndex = null;
            this.selectedZigguratCardId = null;
            if (window.soundEngine) window.soundEngine.playChisel();
            this.renderZigguratPuzzle();
            return;
        }

        // Sinon, remplir le premier étage vacant
        const firstEmptyIndex = this.zigguratSlots.findIndex(id => id === null);
        if (firstEmptyIndex !== -1) {
            this.zigguratSlots[firstEmptyIndex] = cardId;
            this.selectedZigguratCardId = null;
            if (window.soundEngine) window.soundEngine.playChisel();
            this.renderZigguratPuzzle();
        } else {
            // Sélectionner la carte pour la déposer manuellement
            this.selectedZigguratCardId = (this.selectedZigguratCardId === cardId) ? null : cardId;
            if (window.soundEngine) window.soundEngine.playChoice();
            this.renderZigguratPuzzle();
        }
    }

    handleZigguratSlotClick(slotIdx) {
        const currentInSlot = this.zigguratSlots[slotIdx];

        // 1. Si une carte était sélectionnée dans la réserve
        if (this.selectedZigguratCardId !== null) {
            const prevSlot = this.zigguratSlots.indexOf(this.selectedZigguratCardId);
            if (prevSlot !== -1) {
                this.zigguratSlots[prevSlot] = currentInSlot;
            }
            this.zigguratSlots[slotIdx] = this.selectedZigguratCardId;
            this.selectedZigguratCardId = null;
            this.selectedZigguratSlotIndex = null;
            if (window.soundEngine) window.soundEngine.playChisel();
            this.renderZigguratPuzzle();
            return;
        }

        // 2. Si un autre étage était déjà sélectionné : ÉCHANGE (SWAP)
        if (this.selectedZigguratSlotIndex !== null) {
            if (this.selectedZigguratSlotIndex === slotIdx) {
                this.selectedZigguratSlotIndex = null;
            } else {
                const temp = this.zigguratSlots[slotIdx];
                this.zigguratSlots[slotIdx] = this.zigguratSlots[this.selectedZigguratSlotIndex];
                this.zigguratSlots[this.selectedZigguratSlotIndex] = temp;
                this.selectedZigguratSlotIndex = null;
                if (window.soundEngine) window.soundEngine.playChisel();
            }
            this.renderZigguratPuzzle();
            return;
        }

        // 3. Sélectionner l'étage actuel s'il contient une classe
        if (currentInSlot !== null) {
            this.selectedZigguratSlotIndex = slotIdx;
            if (window.soundEngine) window.soundEngine.playChoice();
            this.renderZigguratPuzzle();
        }
    }

    pickZigguratTier(classId) {
        this.handleZigguratCardClick(classId);
    }

    resetZiggurat() {
        this.zigguratSlots = [null, null, null, null, null];
        this.selectedZigguratSlotIndex = null;
        this.selectedZigguratCardId = null;
        this.zigguratDragData = null;
        if (window.soundEngine) window.soundEngine.playChoice();
        this.renderZigguratPuzzle();
    }

    validateZiggurat() {
        const feedbackArea = document.getElementById("ziggurat-feedback-area");
        if (!feedbackArea) return;

        const placedCount = this.zigguratSlots.filter(id => id !== null).length;
        if (placedCount < 5) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-hint">
                    ℹ️ Veuillez placer les 5 étages de la société sur la Ziggourat avant de valider (${placedCount}/5 placés).
                </div>
            `;
            return;
        }

        this.attemptCounts["ziggurat"] = (this.attemptCounts["ziggurat"] || 0) + 1;

        const isCorrect = this.zigguratSlots[0] === 1 &&
                          this.zigguratSlots[1] === 2 &&
                          this.zigguratSlots[2] === 3 &&
                          this.zigguratSlots[3] === 4 &&
                          this.zigguratSlots[4] === 5;

        if (isCorrect) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-success">
                    ✨ <strong>Structure Sociale Respectée !</strong> Du Roi au sommet jusqu'aux esclaves à la base, vous maîtrisez parfaitement les 5 niveaux de la hiérarchie mésopotamienne !
                </div>
            `;
            if (window.soundEngine) {
                window.soundEngine.playChisel();
                window.soundEngine.playSuccess();
            }

            setTimeout(() => {
                this.renderSynthesis(
                    "La Société, la Religion Polythéiste & les Sciences Antiques",
                    "🏛️",
                    [
                        { title: "1. Les 5 Niveaux Hiérarchiques", desc: "1) Roi, 2) Nobles (terres et pouvoir partagé), 3) Fonctionnaires & Scribes (écriture), 4) Peuple (artisans, paysans, éleveurs), 5) Esclaves (aucun droit)." },
                        { title: "2. Les 2 Déterminants Sociaux", desc: "La Naissance (famille d'origine) et la Spécialisation du travail (métier exercé)." },
                        { title: "3. La Religion Polythéiste & le Panthéon", desc: "Croyance en plusieurs dieux incarnant les forces de la nature et les attitudes/sentiments ; culte dans les Ziggourats." },
                        { title: "4. L'Épopée de Gilgamesh", desc: "La plus vieille histoire de l'humanité, relatant la quête héroïque de Gilgamesh." },
                        { title: "5. Les Deux Sciences Inventées", desc: "Les Mathématiques et l'Astronomie, développées par les savants mésopotamiens." },
                        { title: "6. La Société Égyptienne & le Pharaon", desc: "Le Pharaon est un dieu vivant cumulant 5 rôles : chef de société, chef de l'administration, chef d'armée, grand prêtre et juge suprême. Ses tombeaux sont les Pyramides (Khéops, Amenemhat Ier, Lepsius)." }
                    ]
                );
            }, 1800);
        } else {
            let errorMsg = "La hiérarchie sociale comporte des erreurs de placement.";
            if (this.zigguratSlots[0] !== 1) {
                errorMsg = "Au sommet de la cité-État (Niveau 1) se trouve toujours le <strong>Roi</strong>, détenteur du pouvoir politique, militaire et religieux suprême !";
            } else if (this.zigguratSlots[1] !== 2) {
                errorMsg = "Au Niveau 2 se trouvent les <strong>Nobles</strong> (famille royale, hauts prêtres, conseillers) qui possèdent l'ensemble des terres.";
            } else if (this.zigguratSlots[2] !== 3) {
                errorMsg = "Au Niveau 3 se trouvent les <strong>Fonctionnaires & Scribes</strong>, dont la maîtrise de l'écriture les rend indispensables.";
            } else if (this.zigguratSlots[3] !== 4) {
                errorMsg = "Au Niveau 4 se trouve le <strong>Peuple libre</strong> (paysans, artisans, commerçants, éleveurs) qui produit les biens vitaux.";
            } else {
                errorMsg = "Au Niveau 5 (à la base) se trouvent les <strong>Esclaves</strong>, qui n'ont aucun droit.";
            }

            let hintHtml = `
                <div class="formative-feedback feedback-error">
                    <span>💡 <strong>Indice Pédagogique (Tentative ${this.attemptCounts["ziggurat"]}) :</strong> ${errorMsg} Glissez un étage sur un autre pour échanger leurs positions ou retirez les erreurs avec ✕.</span>
            `;

            if (this.attemptCounts["ziggurat"] >= 2) {
                hintHtml += `
                    <div style="margin-top:10px; font-size:0.9rem; color:#fde047; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
                        <span>📖 <em>Consultez le Codex pour relire la fiche sur la hiérarchie sociale :</em></span>
                        <button class="hud-btn" style="padding:4px 12px; font-size:0.82rem;" onclick="window.codexManager.openModal('hierarchie_sociale')">Ouvrir le Codex ➔</button>
                    </div>
                `;
            }

            hintHtml += `</div>`;
            feedbackArea.innerHTML = hintHtml;
            if (window.soundEngine) window.soundEngine.playChoice();
        }
    }

    // =========================================================================
    // MINI-JEU 6 : LA GRANDE LIGNE DU TEMPS CHRONOLOGIQUE DE L'ANTIQUITÉ
    // =========================================================================
    startTimelinePuzzle(onComplete) {
        this.onCompleteCallback = onComplete;
        this.currentMinigame = "timeline";
        if (!this.attemptCounts["timeline"]) this.attemptCounts["timeline"] = 0;
        this.timelineSelected = [null, null, null, null, null, null];
        this.selectedTimelineSlot = null;
        this.selectedTimelineCard = null;

        this.timelineEventsData = [
            { id: 1, date: "~3500 av. J.-C.", name: "Invention des Calculis", desc: "Premiers jetons d'argile de comptabilité dans les bourses scellées." },
            { id: 2, date: "~3300 av. J.-C.", name: "Premiers Pictogrammes", desc: "Dessins figuratifs gravés représentant directement des objets réels." },
            { id: 3, date: "~3000 av. J.-C.", name: "Naissance des Cités-États", desc: "Ur, Babylone et Lagash s'érigent en gouvernements autonomes avec un roi." },
            { id: 4, date: "1750 av. J.-C.", name: "Code d'Hammourabi", desc: "Premier recueil de lois écrites gravé sur la stèle en diorite de Babylone." },
            { id: 5, date: "1200 av. J.-C.", name: "Alphabet Phénicien", desc: "Révolution des 22 lettres simples basées sur les sons." },
            { id: 6, date: "476 apr. J.-C.", name: "Fin de l'Antiquité", desc: "Chute de Rome et transition vers le Moyen Âge." }
        ];

        // Pool mélangé
        this.timelinePool = [
            { id: 4, date: "1750 av. J.-C.", label: "Code d'Hammourabi (Première loi écrite gravée sur stèle à Babylone)" },
            { id: 1, date: "~3500 av. J.-C.", label: "Invention des Calculis (Jetons d'argile pour la comptabilité primitive)" },
            { id: 6, date: "476 apr. J.-C.", label: "Fin de l'Antiquité (Chute de l'Empire romain d'Occident)" },
            { id: 2, date: "~3300 av. J.-C.", label: "Premiers Pictogrammes (Dessins concrets gravés sur tablettes d'argile)" },
            { id: 5, date: "1200 av. J.-C.", label: "Alphabet Phénicien (Système de 22 lettres facilitant la diffusion)" },
            { id: 3, date: "~3000 av. J.-C.", label: "Naissance des Cités-États (Villes fortifiées indépendantes d'Ur, Babylone, Lagash)" }
        ];

        this.renderTimelinePuzzle();
        this.openOverlay();
    }

    renderTimelinePuzzle() {
        const container = document.getElementById("minigame-content");
        if (!container) return;

        const placedCount = this.timelineSelected.filter(id => id !== null).length;

        container.innerHTML = `
            <div class="minigame-header">
                <div>
                    <h3 class="minigame-title">⏳ La Grande Frise Chronologique de l'Antiquité</h3>
                    <span style="color:var(--gold-light); font-size:0.9rem;">Module 3 • Repères Temporels Majeurs (3500 av. J.-C. à 476 apr. J.-C.)</span>
                </div>
                <button class="hud-btn" style="padding:6px 14px; font-size:0.85rem;" onclick="window.codexManager.openModal('points_communs')">📖 Consulter le Codex</button>
            </div>

            <p class="minigame-instructions">
                L'Antiquité s'étend de l'<strong>invention de l'écriture (~3500 av. J.-C.)</strong> jusqu'à la <strong>fin de l'Antiquité (476 apr. J.-C.)</strong>.
                Placez les 6 événements majeurs sur l'axe chronologique dans l'ordre exact du temps !
            </p>

            <div class="timeline-game-board">
                <div style="font-family:var(--font-title); color:var(--gold-light); margin-bottom:12px; font-size:1.05rem; display:flex; justify-content:space-between; align-items:center;">
                    <span>📜 Axe Chronologique de l'Antiquité :</span>
                    <span style="font-size:0.85rem; color:#d4af37;">${placedCount} / 6 repères placés</span>
                </div>

                <div class="timeline-slots-grid" id="timeline-slots-grid">
                    ${[0, 1, 2, 3, 4, 5].map(idx => {
                        const filledId = this.timelineSelected[idx];
                        const eventInfo = filledId ? this.timelineEventsData.find(e => e.id === filledId) : null;
                        const dateHint = this.timelineEventsData[idx].date;
                        const isSlotSelected = this.selectedTimelineSlot === idx;

                        return `
                            <div class="timeline-game-slot ${filledId ? 'filled' : ''} ${isSlotSelected ? 'slot-selected' : ''}" 
                                 onclick="window.minigames.handleTimelineSlotClick(${idx})"
                                 title="${filledId ? 'Cliquer pour déplacer ou retirer' : 'Cliquer pour placer l\'événement sélectionné'}">
                                <div class="timeline-slot-badge-date">${dateHint}</div>
                                ${eventInfo ? `
                                    <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%;">
                                        <strong style="color:#f7e089; font-size:0.88rem;">${eventInfo.name}</strong>
                                        <button class="slot-remove-btn" title="Retirer" onclick="event.stopPropagation(); window.minigames.removeTimelineSlot(${idx})">✕</button>
                                    </div>
                                    <p style="font-size:0.75rem; color:#cbd5e1; margin-top:4px; line-height:1.3;">${eventInfo.desc}</p>
                                ` : `
                                    <div style="color:#888; font-size:0.8rem; margin-top:8px;">Case vide</div>
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div style="margin-top:16px;">
                <h4 style="color:var(--gold-light); margin-bottom:10px;">Événements à Placer :</h4>
                <div class="cards-pool" id="timeline-cards-pool">
                    ${this.timelinePool.map(card => {
                        const isPlaced = this.timelineSelected.includes(card.id);
                        const isSelected = this.selectedTimelineCard === card.id;

                        return `
                            <button class="draggable-item ${isPlaced ? 'used' : ''} ${isSelected ? 'card-selected' : ''}"
                                    ${isPlaced ? 'disabled' : ''}
                                    onclick="window.minigames.handleTimelineCardClick(${card.id})">
                                <span>⏳</span>
                                <span><strong>${card.date}</strong> — ${card.label}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <div id="timeline-feedback-area"></div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; flex-wrap:wrap; gap:10px;">
                <button class="hud-btn" onclick="window.minigames.resetTimelinePuzzle()">🔄 Réinitialiser la Frise</button>
                <button class="btn-primary-start" style="padding:10px 24px;" onclick="window.minigames.validateTimelinePuzzle()">
                    Graver la Frise Historique ➔
                </button>
            </div>
        `;
    }

    handleTimelineCardClick(cardId) {
        if (this.timelineSelected.includes(cardId)) return;

        if (this.selectedTimelineSlot !== null) {
            this.timelineSelected[this.selectedTimelineSlot] = cardId;
            this.selectedTimelineSlot = null;
            this.selectedTimelineCard = null;
            if (window.soundEngine) window.soundEngine.playChisel();
            this.renderTimelinePuzzle();
            return;
        }

        const firstEmptyIndex = this.timelineSelected.findIndex(id => id === null);
        if (firstEmptyIndex !== -1) {
            this.timelineSelected[firstEmptyIndex] = cardId;
            this.selectedTimelineCard = null;
            if (window.soundEngine) window.soundEngine.playChisel();
            this.renderTimelinePuzzle();
        } else {
            this.selectedTimelineCard = (this.selectedTimelineCard === cardId) ? null : cardId;
            if (window.soundEngine) window.soundEngine.playChoice();
            this.renderTimelinePuzzle();
        }
    }

    handleTimelineSlotClick(slotIdx) {
        if (this.selectedTimelineCard !== null) {
            this.timelineSelected[slotIdx] = this.selectedTimelineCard;
            this.selectedTimelineCard = null;
            if (window.soundEngine) window.soundEngine.playChisel();
            this.renderTimelinePuzzle();
            return;
        }

        if (this.selectedTimelineSlot !== null) {
            if (this.selectedTimelineSlot === slotIdx) {
                this.selectedTimelineSlot = null;
            } else {
                const temp = this.timelineSelected[slotIdx];
                this.timelineSelected[slotIdx] = this.timelineSelected[this.selectedTimelineSlot];
                this.timelineSelected[this.selectedTimelineSlot] = temp;
                this.selectedTimelineSlot = null;
                if (window.soundEngine) window.soundEngine.playChisel();
            }
            this.renderTimelinePuzzle();
            return;
        }

        if (this.timelineSelected[slotIdx] !== null) {
            this.selectedTimelineSlot = slotIdx;
            if (window.soundEngine) window.soundEngine.playChoice();
            this.renderTimelinePuzzle();
        }
    }

    removeTimelineSlot(slotIdx) {
        this.timelineSelected[slotIdx] = null;
        if (this.selectedTimelineSlot === slotIdx) this.selectedTimelineSlot = null;
        if (window.soundEngine) window.soundEngine.playChoice();
        this.renderTimelinePuzzle();
    }

    resetTimelinePuzzle() {
        this.timelineSelected = [null, null, null, null, null, null];
        this.selectedTimelineSlot = null;
        this.selectedTimelineCard = null;
        if (window.soundEngine) window.soundEngine.playChoice();
        this.renderTimelinePuzzle();
    }

    validateTimelinePuzzle() {
        const feedbackArea = document.getElementById("timeline-feedback-area");
        if (!feedbackArea) return;

        const placedCount = this.timelineSelected.filter(id => id !== null).length;
        if (placedCount < 6) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-hint">
                    ℹ️ Veuillez placer les 6 événements de la frise avant de valider (${placedCount}/6 placés).
                </div>
            `;
            return;
        }

        this.attemptCounts["timeline"] = (this.attemptCounts["timeline"] || 0) + 1;

        const isCorrect = this.timelineSelected[0] === 1 &&
                          this.timelineSelected[1] === 2 &&
                          this.timelineSelected[2] === 3 &&
                          this.timelineSelected[3] === 4 &&
                          this.timelineSelected[4] === 5 &&
                          this.timelineSelected[5] === 6;

        if (isCorrect) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-success">
                    ✨ <strong>Chronologie de l'Antiquité Parfaite !</strong> De 3500 av. J.-C. à 476 apr. J.-C., vous dominez la frise temporelle du programme d'Histoire de 1re Secondaire !
                </div>
            `;
            if (window.soundEngine) {
                window.soundEngine.playChisel();
                window.soundEngine.playSuccess();
            }

            setTimeout(() => {
                this.renderSynthesis(
                    "La Chronologie de l'Antiquité (3500 av. J.-C. à 476 apr. J.-C.)",
                    "⏳",
                    [
                        { title: "1. ~3500 av. J.-C. — Calculis", desc: "Début de la période antique avec les premiers jetons de comptabilité en Mésopotamie." },
                        { title: "2. ~3300 av. J.-C. — Pictogrammes", desc: "Première forme graphique de l'écriture représentant directement des objets réels." },
                        { title: "3. ~3000 av. J.-C. — Cités-États", desc: "Fondation des cités indépendantes gouvernées par un roi (Ur, Babylone, Lagash)." },
                        { title: "4. 1750 av. J.-C. — Code d'Hammourabi", desc: "Première grande stèle de lois écrites unifiant la justice royale à Babylone." },
                        { title: "5. 1200 av. J.-C. — Alphabet Phénicien", desc: "Simplification majeure en 22 lettres simples pour démocratiser l'écriture." },
                        { title: "6. 476 apr. J.-C. — Fin de l'Antiquité", desc: "Chute de Rome marquant la fin de l'Antiquité et le début du Moyen Âge." }
                    ]
                );
            }, 1800);
        } else {
            let errorMsg = "La frise chronologique contient des erreurs de datation.";
            if (this.timelineSelected[0] !== 1) {
                errorMsg = "L'Antiquité commence vers ~3500 av. J.-C. avec l'invention des <strong>Calculis</strong> (boules d'argile de comptabilité).";
            } else if (this.timelineSelected[5] !== 6) {
                errorMsg = "La fin de l'Antiquité a lieu en <strong>476 apr. J.-C.</strong> avec la chute de l'Empire romain d'Occident.";
            } else if (this.timelineSelected[3] !== 4) {
                errorMsg = "Le <strong>Code d'Hammourabi</strong> date de <strong>1750 av. J.-C.</strong>, avant l'alphabet phénicien.";
            } else if (this.timelineSelected[4] !== 5) {
                errorMsg = "L'<strong>Alphabet Phénicien</strong> a été inventé en <strong>1200 av. J.-C.</strong> pour simplifier les écritures.";
            }

            let hintHtml = `
                <div class="formative-feedback feedback-error">
                    <span>💡 <strong>Indice Chronologique (Tentative ${this.attemptCounts["timeline"]}) :</strong> ${errorMsg}</span>
            `;

            if (this.attemptCounts["timeline"] >= 2) {
                hintHtml += `
                    <div style="margin-top:10px; font-size:0.9rem; color:#fde047; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
                        <span>📖 <em>Consultez le Codex pour relire les dates clés du Croissant Fertile :</em></span>
                        <button class="hud-btn" style="padding:4px 12px; font-size:0.82rem;" onclick="window.codexManager.openModal('points_communs')">Ouvrir le Codex ➔</button>
                    </div>
                `;
            }

            hintHtml += `</div>`;
            feedbackArea.innerHTML = hintHtml;
            if (window.soundEngine) window.soundEngine.playChoice();
        }
    }
}

// =========================================================================
// INSTANCIATION GLOBALE DU GESTIONNAIRE DES MINI-JEUX
// =========================================================================
window.minigames = new MiniGamesManager();

