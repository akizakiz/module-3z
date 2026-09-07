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
        if (window.gameEngine) {
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
                this.renderWritingTimelineSynthesis();
            }, 1600);
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
        if (window.gameEngine) {
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
    // MINI-JEU 4 : LA BALANCE COMMERCIALE D'UR & LE SCEAU-CYLINDRE
    // =========================================================================
    startTradePuzzle(onComplete) {
        this.onCompleteCallback = onComplete;
        this.currentMinigame = "trade";
        if (!this.attemptCounts["trade"]) this.attemptCounts["trade"] = 0;

        this.exportSlots = [
            { id: "exp_ble", name: "Blé & Surplus Agricoles", selected: false, correct: true, desc: "Produit en immense abondance grâce aux fleuves fertiles." },
            { id: "exp_poterie", name: "Poteries & Céramiques", selected: false, correct: true, desc: "Fabriquées à partir de l'argile omniprésente sur les berges." },
            { id: "exp_bois", name: "Bois de Cèdre du Liban", selected: false, correct: false, desc: "Intrus : Le bois d'œuvre ne poussait pas dans le désert mésopotamien !" }
        ];

        this.importSlots = [
            { id: "imp_pierres", name: "Pierres Précieuses & Lapis-lazuli", selected: false, correct: true, desc: "Achetées aux contrées lointaines d'Orient pour les bijoux royaux." },
            { id: "imp_metaux", name: "Métaux (Cuivre, Étain) & Bois", selected: false, correct: true, desc: "Indispensables pour la métallurgie du bronze et les charpentes." },
            { id: "imp_argile", name: "Argile des Berges Locales", selected: false, correct: false, desc: "Intrus : L'argile était disponible partout en Mésopotamie, pas importée !" }
        ];

        this.renderTradePuzzle();
        this.openOverlay();
    }

    renderTradePuzzle() {
        const container = document.getElementById("minigame-content");
        if (!container) return;

        container.innerHTML = `
            <div class="minigame-header">
                <div>
                    <h3 class="minigame-title">🏺 La Caravane Marchande & la Balance de Troc</h3>
                    <span style="color:var(--gold-light); font-size:0.9rem;">Module 3 • Économie, Troc & Contrats</span>
                </div>
                <button class="hud-btn" style="padding:6px 14px; font-size:0.85rem;" onclick="window.codexManager.openModal('commerce_sciences')">📖 Consulter le Codex</button>
            </div>

            <p class="minigame-instructions">
                Pour équilibrer la balance commerciale de la cité d'Ur, sélectionnez les <strong>2 produits exportés</strong> (produits localement) et les <strong>2 produits importés</strong> (achetés aux pays lointains), puis scellez le contrat avec votre sceau-cylindre.
            </p>

            <div class="trade-scale-container">
                <div class="scale-visual-system">
                    <div class="scale-pan export-pan">
                        <div class="pan-header" style="color:#f59e0b;">
                            <span>🌾</span>
                            <span>Produits EXPORTÉS par la Mésopotamie :</span>
                        </div>
                        <div class="pan-slots">
                            ${this.exportSlots.map(s => `
                                <div class="trade-item-pill ${s.selected ? 'trade-selected-export' : ''}" onclick="window.minigames.toggleTradeItem('export', '${s.id}')">
                                    <span>${s.selected ? '☑️' : '◻️'} ${s.name}</span>
                                    <span style="font-size:0.75rem; color:#cbd5e1;">${s.selected ? 'Chargé' : 'Cliquer pour charger'}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="scale-pan import-pan">
                        <div class="pan-header" style="color:#38bdf8;">
                            <span>💎</span>
                            <span>Produits IMPORTÉS des pays lointains :</span>
                        </div>
                        <div class="pan-slots">
                            ${this.importSlots.map(s => `
                                <div class="trade-item-pill ${s.selected ? 'trade-selected-import' : ''}" onclick="window.minigames.toggleTradeItem('import', '${s.id}')">
                                    <span>${s.selected ? '☑️' : '◻️'} ${s.name}</span>
                                    <span style="font-size:0.75rem; color:#cbd5e1;">${s.selected ? 'Commandé' : 'Cliquer pour commander'}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div id="trade-feedback-area"></div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                <button class="hud-btn" onclick="window.minigames.resetTrade()">🔄 Réinitialiser les Marchandises</button>
                <button class="btn-primary-start" style="padding:10px 24px;" onclick="window.minigames.validateTrade()">
                    Apposer le Sceau-Cylindre & Conclure le Troc ➔
                </button>
            </div>
        `;
    }

    toggleTradeItem(type, itemId) {
        const list = type === 'export' ? this.exportSlots : this.importSlots;
        const item = list.find(it => it.id === itemId);
        if (item) {
            item.selected = !item.selected;
            if (window.soundEngine) window.soundEngine.playCoins();
            this.renderTradePuzzle();
        }
    }

    resetTrade() {
        this.exportSlots.forEach(s => s.selected = false);
        this.importSlots.forEach(s => s.selected = false);
        if (window.soundEngine) window.soundEngine.playChoice();
        this.renderTradePuzzle();
    }

    validateTrade() {
        const feedbackArea = document.getElementById("trade-feedback-area");
        if (!feedbackArea) return;

        this.attemptCounts["trade"] = (this.attemptCounts["trade"] || 0) + 1;

        const selExports = this.exportSlots.filter(s => s.selected);
        const selImports = this.importSlots.filter(s => s.selected);

        if (selExports.length !== 2 || selImports.length !== 2) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-hint">
                    ℹ️ Veuillez sélectionner exactement <strong>2 produits exportés</strong> et <strong>2 produits importés</strong> pour équilibrer la balance commerciale.
                </div>
            `;
            return;
        }

        const exportsCorrect = this.exportSlots.find(s => s.id === "exp_ble").selected &&
                               this.exportSlots.find(s => s.id === "exp_poterie").selected;

        const importsCorrect = this.importSlots.find(s => s.id === "imp_pierres").selected &&
                               this.importSlots.find(s => s.id === "imp_metaux").selected;

        if (exportsCorrect && importsCorrect) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-success">
                    ✨ <strong>Balance Commerciale Équilibrée !</strong> Vos surplus de blé et poteries ont été troqués avec succès contre les métaux, le bois précieux et les pierres précieuses indispensables !
                </div>
            `;
            if (window.soundEngine) {
                window.soundEngine.playCoins();
                window.soundEngine.playSuccess();
            }

            setTimeout(() => {
                this.renderSynthesis(
                    "Le Commerce de Troc, les Échanges & les Surplus",
                    "🏺",
                    [
                        { title: "1. Le Troc en l'Absence de Monnaie", desc: "Les échanges commerciaux reposaient sur le troc direct de denrées et la rédaction de contrats officiels en argile scellés." },
                        { title: "2. Les Produits Exportés (Mésopotamie)", desc: "Blé, orge, poteries et céramiques d'art, produits en abondance grâce à l'agriculture irriguée et l'argile des rives." },
                        { title: "3. Les Produits Importés", desc: "Bois de construction (cèdre), métaux pour le bronze (cuivre, étain) et pierres précieuses (lapis-lazuli) absents du territoire." },
                        { title: "4. Rôle Clé de l'Écriture Commerciale", desc: "Conserver des traces vérifiables des transactions, dettes et accords marchands à travers tout le Proche-Orient." }
                    ]
                );
            }, 1800);
        } else {
            if (this.attemptCounts["trade"] >= 2) {
                feedbackArea.innerHTML = `
                    <div class="formative-feedback feedback-hint">
                        💡 <strong>Indice du Négociant :</strong> La Mésopotamie produit et exporte le <em>Blé</em> et les <em>Poteries</em> (argile locale), et doit importer les <em>Métaux/Bois</em> et les <em>Pierres Précieuses</em>.
                    </div>
                `;
            } else {
                let errorMsg = "La sélection des marchandises contient des confusions entre importations et exportations.";
                if (!exportsCorrect) {
                    errorMsg = "La Mésopotamie n'avait pas de forêts denses : le bois ne pouvait pas être un produit exporté, mais une ressource rare à importer !";
                } else if (!importsCorrect) {
                    errorMsg = "L'argile est omniprésente sur les rives du Tigre et de l'Euphrate, la cité n'avait nullement besoin d'en importer !";
                }

                feedbackArea.innerHTML = `
                    <div class="formative-feedback feedback-error">
                        <span>💡 <strong>Indice Pédagogique :</strong> ${errorMsg} Réajustez vos choix de cargaison.</span>
                    </div>
                `;
            }
            if (window.soundEngine) window.soundEngine.playChoice();
        }
    }

    // =========================================================================
    // MINI-JEU 5 : LA PYRAMIDE SOCIALE DE LA ZIGGOURAT D'UR
    // =========================================================================
    startZigguratPuzzle(onComplete) {
        this.onCompleteCallback = onComplete;
        this.currentMinigame = "ziggurat";
        if (!this.attemptCounts["ziggurat"]) this.attemptCounts["ziggurat"] = 0;
        this.zigguratPlaced = [];

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
                Reconstituez la Ziggourat en plaçant les classes sociales dans l'ordre hiérarchique, <strong>du sommet suprême (Niveau 1) jusqu'à la base (Niveau 5)</strong>.
            </p>

            <div class="ziggurat-structure-view">
                <div class="ziggurat-pyramid-container">
                    ${this.zigguratTiers.map(t => {
                        const isPlaced = this.zigguratPlaced.includes(t.tier);
                        return `
                            <div class="ziggurat-tier tier-${t.tier} ${isPlaced ? 'placed' : 'empty'}">
                                <div class="tier-header">
                                    <span>${t.icon}</span>
                                    <span class="tier-label">Niveau ${t.tier} : ${isPlaced ? t.name : 'Étage Vacant'}</span>
                                </div>
                                <div class="tier-content">
                                    ${isPlaced ? `<span style="font-size:0.8rem; color:#cbd5e1;">${t.desc}</span>` : '<span style="font-size:0.8rem; color:#888;">En attente de placement...</span>'}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <h4 style="color:var(--gold-light); margin-bottom:10px;">Groupes Sociaux à Placer (Cliquez dans l'ordre du sommet à la base) :</h4>
            <div class="cards-pool" id="ziggurat-cards-pool">
                ${this.socialClassesPool.map(card => {
                    const isUsed = this.zigguratPlaced.includes(card.id);
                    return `
                        <button class="draggable-item ${isUsed ? 'used' : ''}" 
                                ${isUsed ? 'disabled' : ''} 
                                onclick="window.minigames.pickZigguratTier(${card.id})">
                            <span>🏛️</span>
                            <span>${card.label}</span>
                        </button>
                    `;
                }).join('')}
            </div>

            <div id="ziggurat-feedback-area"></div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                <button class="hud-btn" onclick="window.minigames.resetZiggurat()">🔄 Recommencer l'Édification</button>
                <button class="btn-primary-start" style="padding:10px 24px;" onclick="window.minigames.validateZiggurat()">
                    Bénir la Ziggourat au Panthéon
                </button>
            </div>
        `;
    }

    pickZigguratTier(classId) {
        if (this.zigguratPlaced.includes(classId)) return;
        if (this.zigguratPlaced.length >= 5) return;

        this.zigguratPlaced.push(classId);
        if (window.soundEngine) window.soundEngine.playChisel();
        this.renderZigguratPuzzle();
    }

    resetZiggurat() {
        this.zigguratPlaced = [];
        if (window.soundEngine) window.soundEngine.playChoice();
        this.renderZigguratPuzzle();
    }

    validateZiggurat() {
        const feedbackArea = document.getElementById("ziggurat-feedback-area");
        if (!feedbackArea) return;

        if (this.zigguratPlaced.length < 5) {
            feedbackArea.innerHTML = `
                <div class="formative-feedback feedback-hint">
                    ℹ️ Veuillez placer les 5 étages de la société sur la Ziggourat avant de valider (${this.zigguratPlaced.length}/5 placés).
                </div>
            `;
            return;
        }

        this.attemptCounts["ziggurat"] = (this.attemptCounts["ziggurat"] || 0) + 1;

        const isCorrect = this.zigguratPlaced[0] === 1 &&
                          this.zigguratPlaced[1] === 2 &&
                          this.zigguratPlaced[2] === 3 &&
                          this.zigguratPlaced[3] === 4 &&
                          this.zigguratPlaced[4] === 5;

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
            if (this.zigguratPlaced[0] !== 1) {
                errorMsg = "Au sommet de la cité-État (Niveau 1) se trouve toujours le <strong>Roi</strong>, détenteur du pouvoir politique, militaire et religieux suprême !";
            } else if (this.zigguratPlaced[1] !== 2) {
                errorMsg = "Au Niveau 2 se trouvent les <strong>Nobles</strong> (famille royale, hauts prêtres, conseillers) qui possèdent l'ensemble des terres.";
            } else if (this.zigguratPlaced[2] !== 3) {
                errorMsg = "Au Niveau 3 se trouvent les <strong>Fonctionnaires & Scribes</strong>, dont la maîtrise de l'écriture les rend indispensables.";
            } else if (this.zigguratPlaced[3] !== 4) {
                errorMsg = "Au Niveau 4 se trouve le <strong>Peuple libre</strong> (paysans, artisans, commerçants, éleveurs) qui produit les biens vitaux.";
            } else {
                errorMsg = "Au Niveau 5 (à la base) se trouvent les <strong>Esclaves</strong>, qui n'ont aucun droit.";
            }

            let hintHtml = `
                <div class="formative-feedback feedback-error">
                    <span>💡 <strong>Indice Pédagogique (Tentative ${this.attemptCounts["ziggurat"]}) :</strong> ${errorMsg}</span>
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
