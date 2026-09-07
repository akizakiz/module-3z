/**
 * Registre des Artefacts Historiques Tangibles pour « Les Chroniques du Croissant Fertile »
 * Conforme aux notions du Module 3 (Histoire 1re Secondaire - Québec)
 */

window.HISTORICAL_ARTIFACTS = {
    calame: {
        id: "calame",
        name: "Calame en Roseau Biseauté",
        period: "~3300 av. J.-C. • Basse Mésopotamie (Sumer)",
        icon: "🖊️",
        category: "Outil Fondateur de l'Écriture",
        soundType: "reed",
        conceptModule3: "L'instrument privilégié des scribes mésopotamiens pour graver l'argile fraîche.",
        lore: "Taillé dans les tiges de roseau séchées qui bordent le Tigre et l'Euphrate. Son extrémité taillée en biseau triangulaire s'enfonce dans l'argile humide pour créer des empreintes en forme de clous (cuneus en latin, d'où le terme cunéiforme).",
        specs: [
            { label: "Matière", val: "Roseau des marais fluviaux (Arundo donax)" },
            { label: "Utilisation", val: "Comptabilité des récoltes, contrats d'argile, lois royales" },
            { label: "Évolution", val: "A remplacé les stylets ronds primitifs des calculi" }
        ],
        svg: `<svg viewBox="0 0 200 200" class="artifact-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="reedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fef08a"/>
                    <stop offset="35%" stop-color="#ca8a04"/>
                    <stop offset="70%" stop-color="#854d0e"/>
                    <stop offset="100%" stop-color="#451a03"/>
                </linearGradient>
                <linearGradient id="tipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#fde047"/>
                    <stop offset="50%" stop-color="#eab308"/>
                    <stop offset="100%" stop-color="#a16207"/>
                </linearGradient>
                <filter id="reedShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="3" dy="5" stdDeviation="4" flood-color="#000" flood-opacity="0.6"/>
                </filter>
            </defs>
            <g filter="url(#reedShadow)">
                <!-- Tige de roseau principale -->
                <path d="M 45,160 L 155,50 L 168,63 L 58,173 Z" fill="url(#reedGrad)" stroke="#713f12" stroke-width="2"/>
                <!-- Anneaux / nœuds du roseau -->
                <line x1="75" y1="130" x2="88" y2="143" stroke="#451a03" stroke-width="3"/>
                <line x1="115" y1="90" x2="128" y2="103" stroke="#451a03" stroke-width="3"/>
                <!-- Pointe taillée en biseau triangulaire cunéiforme -->
                <polygon points="155,50 180,25 168,63 150,45" fill="url(#tipGrad)" stroke="#713f12" stroke-width="1.5"/>
                <polygon points="170,35 180,25 165,40" fill="#fef9c3"/>
                <!-- Éclat de lumière -->
                <path d="M 50,158 L 152,56" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round"/>
            </g>
        </svg>`
    },

    sceau_cylindre: {
        id: "sceau_cylindre",
        name: "Sceau-Cylindre Royal d'Ur",
        period: "~2600 av. J.-C. • Première Dynastie d'Ur",
        icon: "🛢️",
        category: "Signature Juridique & Sceau Commercial",
        soundType: "seal",
        conceptModule3: "Garantie légale infalsifiable apposée par déroulement sur l'argile des contrats et jarres.",
        lore: "Cylindre miniature de pierre dure percé d'un canal central pour être porté en pendentif au cou. Gravé en creux (intaille), il se déroule sur l'argile fraîche des tablettes commerciales ou des bouchons de jarres pour imprimer en relief une frise narrative continue protégeant la transaction.",
        specs: [
            { label: "Matière", val: "Stéatite noire & serpentine gravée en intaille" },
            { label: "Fonction", val: "Signature officielle, validation de contrats, protection des surplus" },
            { label: "Symbole", val: "Emblème royal du Lion et du Taureau céleste d'Ur" }
        ],
        svg: `<svg viewBox="0 0 200 200" class="artifact-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="cylinderStone" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="25%" stop-color="#475569"/>
                    <stop offset="60%" stop-color="#334155"/>
                    <stop offset="90%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="goldCarving" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#fbbf24"/>
                    <stop offset="100%" stop-color="#b45309"/>
                </linearGradient>
                <filter id="sealShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="4" dy="6" stdDeviation="5" flood-color="#000" flood-opacity="0.7"/>
                </filter>
            </defs>
            <g filter="url(#sealShadow)">
                <!-- Corps du cylindre -->
                <rect x="65" y="45" width="70" height="110" rx="6" fill="url(#cylinderStone)" stroke="#94a3b8" stroke-width="1.5"/>
                <!-- Ellipse supérieure (vue 3D) -->
                <ellipse cx="100" cy="45" rx="35" ry="12" fill="#64748b" stroke="#94a3b8" stroke-width="1.5"/>
                <!-- Trou central pour le cordonnet -->
                <ellipse cx="100" cy="45" rx="8" ry="4" fill="#0f172a"/>
                <!-- Ellipse inférieure -->
                <ellipse cx="100" cy="155" rx="35" ry="12" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>
                <!-- Gravures en creux sumériennes sur le cylindre -->
                <g fill="none" stroke="url(#goldCarving)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <!-- Étoile d'Ishtar / Glyphe cunéiforme -->
                    <path d="M 100,70 L 100,90 M 90,80 L 110,80 M 93,73 L 107,87 M 93,87 L 107,73"/>
                    <!-- Taureau sacré stylisé -->
                    <path d="M 75,115 Q 85,105 100,112 Q 115,105 125,115"/>
                    <circle cx="85" cy="125" r="4" fill="#fbbf24"/>
                    <circle cx="115" cy="125" r="4" fill="#fbbf24"/>
                    <!-- Frise d'eau / ondes de l'Euphrate -->
                    <path d="M 72,140 Q 82,136 92,140 T 112,140 T 128,140"/>
                </g>
                <!-- Cordon doré qui traverse le cylindre -->
                <path d="M 100,20 L 100,43 M 100,157 L 100,180" stroke="#d97706" stroke-width="3" stroke-dasharray="2 2"/>
            </g>
        </svg>`
    },

    perle_lapis: {
        id: "perle_lapis",
        name: "Perle de Lapis-Lazuli d'Orient",
        period: "~2500 av. J.-C. • Trésor de la Ziggourat d'Ur",
        icon: "💎",
        category: "Commerce Lointain & Joyau Sacré",
        soundType: "gem",
        conceptModule3: "Symbole des importations lointaines de Mésopotamie troquées contre le blé et l'orge.",
        lore: "Minéral d'un bleu d'azur profond constellé d'inclusions dorées de pyrite rappelant la voûte céleste étoilée. Absente des plaines d'argile de Mésopotamie, cette pierre était acheminée sur plus de 2 500 km par caravanes depuis les montagnes du Badakhchan pour parer les statues divines et les bijoux royaux.",
        specs: [
            { label: "Matière", val: "Lapis-lazuli naturel avec paillettes de pyrite dorée" },
            { label: "Origine", val: "Importation des montagnes orientales (Afghanistan actuel)" },
            { label: "Symbolique", val: "Regard des dieux et puissance royale de la Ziggourat" }
        ],
        svg: `<svg viewBox="0 0 200 200" class="artifact-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="lapisGrad" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="#60a5fa"/>
                    <stop offset="25%" stop-color="#2563eb"/>
                    <stop offset="60%" stop-color="#1d4ed8"/>
                    <stop offset="85%" stop-color="#1e3a8a"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </radialGradient>
                <linearGradient id="goldCap" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fef08a"/>
                    <stop offset="50%" stop-color="#eab308"/>
                    <stop offset="100%" stop-color="#854d0e"/>
                </linearGradient>
                <filter id="gemGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
                    <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#1d4ed8" flood-opacity="0.8"/>
                </filter>
            </defs>
            <g filter="url(#gemGlow)">
                <!-- Perle facettée / sphéroïde ovale de lapis-lazuli -->
                <ellipse cx="100" cy="108" rx="55" ry="46" fill="url(#lapisGrad)" stroke="#38bdf8" stroke-width="1.5"/>
                <!-- Inclusions dorées de pyrite céleste -->
                <circle cx="85" cy="95" r="2.5" fill="#fef08a"/>
                <circle cx="92" cy="120" r="1.8" fill="#fef08a"/>
                <circle cx="115" cy="100" r="2.2" fill="#fef08a"/>
                <circle cx="128" cy="115" r="1.5" fill="#fef08a"/>
                <circle cx="75" cy="112" r="1.7" fill="#fef08a"/>
                <circle cx="105" cy="130" r="2" fill="#fde047"/>
                <!-- Veine minérale blanche de calcite -->
                <path d="M 65,100 Q 85,92 105,102 T 145,110" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none"/>
                <!-- Reflet de lumière rasante -->
                <ellipse cx="80" cy="88" rx="20" ry="10" fill="rgba(255,255,255,0.35)" transform="rotate(-20, 80, 88)"/>
                <!-- Bélière en or ouvragé d'Ur (attache supérieure) -->
                <path d="M 86,64 Q 100,52 114,64 L 110,72 Q 100,66 90,72 Z" fill="url(#goldCap)" stroke="#78350f" stroke-width="1"/>
                <circle cx="100" cy="46" r="12" fill="none" stroke="url(#goldCap)" stroke-width="3.5"/>
            </g>
        </svg>`
    },

    papyrus: {
        id: "papyrus",
        name: "Fragment de Papyrus du Nil",
        period: "~3000 av. J.-C. • Delta du Nil (Égypte Antique)",
        icon: "📜",
        category: "Support Fluvial d'Écriture",
        soundType: "papyrus",
        conceptModule3: "Support végétal souple égyptien, complémentaire aux tablettes d'argile mésopotamiennes.",
        lore: "Feuille d'écriture révolutionnaire confectionnée à partir de la tige triangulaire du souchet (Cyperus papyrus) qui pousse abondamment dans les marais du delta du Nil. Les bandes végétales sont entrecroisées en deux couches perpendiculaires, humidifiées avec l'eau du fleuve puis pressées et séchées au soleil.",
        specs: [
            { label: "Matière", val: "Moelle de tige de roseau Cyperus papyrus entrecroisée" },
            { label: "Caractéristique", val: "Léger, souple, enroulable en volumen (rouleau)" },
            { label: "Écriture", val: "Tracé à l'encre de suie et calame en hiéroglyphes cursifs" }
        ],
        svg: `<svg viewBox="0 0 200 200" class="artifact-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="papyrusPaper" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fef3c7"/>
                    <stop offset="30%" stop-color="#fde68a"/>
                    <stop offset="70%" stop-color="#d97706"/>
                    <stop offset="100%" stop-color="#78350f"/>
                </linearGradient>
                <filter id="papyrusShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="3" dy="5" stdDeviation="5" flood-color="#000" flood-opacity="0.6"/>
                </filter>
            </defs>
            <g filter="url(#papyrusShadow)">
                <!-- Feuille de papyrus aux bords déchiquetés antiques -->
                <path d="M 45,35 L 145,30 Q 155,50 152,75 Q 160,110 150,145 Q 140,165 130,168 L 55,172 Q 40,155 45,135 Q 38,95 44,65 Z"
                      fill="url(#papyrusPaper)" stroke="#92400e" stroke-width="1.8"/>
                <!-- Tissage de fibres horizontales et verticales du papyrus -->
                <g stroke="#b45309" stroke-width="0.8" opacity="0.65">
                    <!-- Fibres horizontales -->
                    <line x1="48" y1="50" x2="148" y2="48"/>
                    <line x1="46" y1="70" x2="152" y2="68"/>
                    <line x1="45" y1="90" x2="154" y2="88"/>
                    <line x1="44" y1="110" x2="151" y2="110"/>
                    <line x1="46" y1="130" x2="147" y2="132"/>
                    <line x1="50" y1="150" x2="138" y2="152"/>
                    <!-- Fibres verticales -->
                    <line x1="65" y1="36" x2="62" y2="170"/>
                    <line x1="85" y1="34" x2="83" y2="171"/>
                    <line x1="105" y1="33" x2="106" y2="170"/>
                    <line x1="125" y1="32" x2="128" y2="168"/>
                </g>
                <!-- Tracés de hiéroglyphes à l'encre noire égyptienne -->
                <g stroke="#1c1917" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.85">
                    <!-- Œil d'Oudjat / Rê stylisé -->
                    <path d="M 70,62 Q 85,54 100,62 Q 85,70 70,62 Z"/>
                    <circle cx="85" cy="62" r="2.5" fill="#1c1917"/>
                    <path d="M 85,68 L 85,76 M 80,72 Q 78,82 72,82"/>
                    <!-- Signe de l'Ânkh (Vie) -->
                    <ellipse cx="125" cy="64" rx="4" ry="6"/>
                    <line x1="125" y1="70" x2="125" y2="85"/>
                    <line x1="118" y1="76" x2="132" y2="76"/>
                    <!-- Ondes du Nil (Eau / Crues fertiles) -->
                    <path d="M 65,105 Q 73,101 81,105 T 97,105 T 113,105 T 129,105"/>
                    <path d="M 65,115 Q 73,111 81,115 T 97,115 T 113,115 T 129,115"/>
                    <!-- Roseau / Pousse de limon -->
                    <path d="M 75,135 L 75,155 M 75,142 Q 82,138 85,145 M 75,148 Q 68,144 65,150"/>
                    <!-- Canard / Oiseau sacré -->
                    <path d="M 110,140 Q 120,135 125,142 Q 130,140 132,135 Q 125,152 110,148 Z"/>
                </g>
            </g>
        </svg>`
    }
};
