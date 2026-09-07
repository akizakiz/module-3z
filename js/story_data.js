/**
 * Données Narratives & Arborescence des Scénarios : « L'Ombre sur le Croissant Fertile »
 * Format Visual Novel / RPG Interactif adapté aux élèves de 12 ans (1re Secondaire - Québec).
 * Conforme à 100% au Module 3 d'Histoire (L'émergence d'une civilisation).
 * Intègre 4 classes asymétriques, choix exclusifs de rôle, effets papillon et fins multiples.
 */

const STORY_DATA = {
    // Profils des 4 classes de départ avec compétences et jauges initiales
    classes: {
        "scribe": {
            id: "scribe",
            name: "Scribe Royal",
            tagline: "Le Maître du Calame et des Secrets d'Argile",
            avatar: "📜",
            image: "assets/images/char_hero_scribe.jpg",
            avatarImg: "assets/images/char_hero_scribe.jpg",
            startNodeId: "ch1_scribe_start",
            baseStats: { savoir: 65, influence: 50, richesse: 40, destin: 50 },
            description: "Formé dans la prestigieuse école des scribes (l'Édubba) d'Ur. Vous seul savez déchiffrer les calculis, les pictogrammes et les tablettes de lois cunéiformes.",
            specialPerk: "Capacité unique de repérer les faux documents administratifs et de traduire les hiéroglyphes."
        },
        "artisan": {
            id: "artisan",
            name: "Marchand & Artisan Fluvial",
            tagline: "Le Stratège du Troc et des Caravanes",
            avatar: "🏺",
            image: "assets/images/char_hero_artisan.jpg",
            avatarImg: "assets/images/char_hero_artisan.jpg",
            startNodeId: "ch1_artisan_start",
            baseStats: { savoir: 40, influence: 45, richesse: 65, destin: 50 },
            description: "Négociant rusé sur l'Euphrate et le Tigre. Vous maîtrisez le troc des surplus de blé et de poteries contre les métaux rares et le bois précieux.",
            specialPerk: "Flair hors pair pour flairer la contrebande et acheter le silence des comploteurs."
        },
        "soldat": {
            id: "soldat",
            name: "Garde & Défenseur de la Cité",
            tagline: "Le Bouclier des Remparts et des Lois",
            avatar: "🛡️",
            image: "assets/images/char_hero_soldat.jpg",
            avatarImg: "assets/images/char_hero_soldat.jpg",
            startNodeId: "ch1_soldat_start",
            baseStats: { savoir: 35, influence: 65, richesse: 45, destin: 55 },
            description: "Garde d'élite armé d'une lance en bronze. Vous patrouillez sur les remparts de Babylone et faites respecter l'ordre et la justice du Roi.",
            specialPerk: "Intimidation martiale, réflexes au combat et protection des témoins capitaux."
        },
        "batisseur": {
            id: "batisseur",
            name: "Bâtisseur & Maître des Canaux",
            tagline: "L'Ingénieur des Digues et des Ziggourats",
            avatar: "🌾",
            image: "assets/images/char_hero_batisseur.jpg",
            avatarImg: "assets/images/char_hero_batisseur.jpg",
            startNodeId: "ch1_batisseur_start",
            baseStats: { savoir: 45, influence: 35, richesse: 35, destin: 70 },
            description: "Prodige de l'irrigation et de l'architecture. Vous domptez les crues brutales des fleuves et connaissez les passages secrets sous les temples.",
            specialPerk: "Maîtrise des systèmes de canaux hydrauliques et repérage des failles architecturales."
        }
    },

    nodes: {
        // =========================================================================
        // CHAPITRE 1 : L'AUBE DES SIGNES & L'ALERTE DU COMPLOT (3500 av. J.-C.)
        // =========================================================================

        // --- DÉPART SCRIBE ---
        "ch1_scribe_start": {
            id: "ch1_scribe_start",
            chapter: "Chapitre I",
            chapterTitle: "Le Secret des Bourses d'Argile",
            location: "Grande Maison des Archives de la Cité d'Ur",
            bgImage: "assets/images/scene_clay_tablets.jpg",
            bgPlaceholder: "linear-gradient(135deg, #2c1d11, #1c3f6e)",
            character: "Maître Arad-Nanna",
            characterRole: "Chef Archiviste du Palais",
            conceptUnlocked: "evolution_ecriture",
            shake: "light",
            sound: "clay",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speaker"><strong>Maître Arad-Nanna :</strong> « Regarde cette bourse d'argile. Vite ! Elle devait garantir <strong class="vn-concept-highlight">500 sacs d'orge</strong> pour la cité d'Ur. »</p>
                    <p class="vn-speech-action"><em>*Le vieux scribe gratte le sceau brisé d'une main fébrile.*</em></p>
                    <p class="vn-speaker"><strong>Maître Arad-Nanna :</strong> « Le sceau a été falsifié à chaud pour dissimuler le vol des <strong class="vn-concept-highlight" data-glossary="calculis">calculis</strong> ! Si le grenier royal est vidé, notre <strong class="vn-concept-highlight" data-glossary="cite_etat">cité-État</strong> mourra de faim. C'est à toi d'agir, {HERO_ORIGIN_CALL} : {HERO_PAST}, démasque le faussaire ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Briser la bulle d'argile pour compter et authentifier les calculis de comptage.",
                    impact: { savoir: +10, influence: +5 },
                    impactTag: "+10 Savoir, +5 Influence • Analyse matérielle",
                    sound: "clay",
                    shake: "light",
                    setFlags: { found_fake_calculi: true },
                    addClue: "Bourse de calculis truquée (Preuve de détournement de blé)",
                    butterflyEffect: "Cette preuve matérielle sera décisive lors du grand procès royal.",
                    nextNode: "ch1_scribe_puzzle_intro"
                },
                {
                    text: "Graver aussitôt une contre-tablette en pictogrammes pour avertir la garde discrètement.",
                    impact: { savoir: +12, destin: +8 },
                    impactTag: "+12 Savoir, +8 Destin • Message d'alerte",
                    sound: "clay",
                    shake: "light",
                    setFlags: { alerted_guards_early: true },
                    butterflyEffect: "Les sentinelles surveilleront les greniers royaux dès cette nuit.",
                    nextNode: "ch1_scribe_puzzle_intro"
                },
                {
                    text: "Relever la signature du sceau-cylindre pour identifier le haut fonctionnaire corrompu.",
                    impact: { savoir: +8, influence: +12 },
                    impactTag: "+8 Savoir, +12 Influence • Enquête au Palais",
                    sound: "choice",
                    shake: "light",
                    setFlags: { identified_corrupt_seal: true },
                    addClue: "Empreinte du Sceau du Conseiller Lu-Enlil",
                    butterflyEffect: "Vous démasquez un traître haut placé au sein des nobles.",
                    nextNode: "ch1_scribe_puzzle_intro"
                }
            ]
        },

        "ch1_scribe_puzzle_intro": {
            id: "ch1_scribe_puzzle_intro",
            chapter: "Chapitre I",
            chapterTitle: "L'Épreuve du Calame & L'Évolution des Signes",
            location: "L'École des Scribes (l'Édubba) d'Ur",
            bgImage: "assets/images/scene_clay_tablets.jpg",
            character: "Maître Arad-Nanna",
            characterRole: "Chef Archiviste",
            conceptUnlocked: "points_communs",
            sound: "clay",
            shake: "light",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speaker"><strong>Maître Arad-Nanna :</strong> « Rapide et précis, {HERO_NAME} ! Mais les juges exigent un témoignage infalsifiable. Seul un vrai <strong class="vn-concept-highlight" data-glossary="scribe">scribe</strong> peut consigner la vérité ! »</p>
                    <p class="vn-speech-action"><em>*Il te tend un calame en roseau taillé et une tablette d'argile fraîche.*</em></p>
                    <p class="vn-speaker"><strong>Maître Arad-Nanna :</strong> « Du simple jeton d'argile (<strong class="vn-concept-highlight" data-glossary="calculis">calculi</strong>) jusqu'à l'écriture <strong class="vn-concept-highlight" data-glossary="cuneiforme">cunéiforme</strong> et au futur <strong class="vn-concept-highlight" data-glossary="alphabet_phenicien">alphabet</strong> : reconstitue la fresque avant que l'argile ne sèche ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Saisir le calame en roseau et reconstituer la frise de l'évolution de l'écriture.",
                    impact: { savoir: +15 },
                    impactTag: "Défi du Scribe • Énigme de l'Écriture",
                    minigame: "writing_puzzle",
                    nextNode: "ch1_common_transition"
                }
            ]
        },

        // --- DÉPART ARTISAN ---
        "ch1_artisan_start": {
            id: "ch1_artisan_start",
            chapter: "Chapitre I",
            chapterTitle: "Trafic Obscur sur les Quais",
            location: "Port fluvial et quais de déchargement de Lagash",
            bgImage: "assets/images/scene_babylon_market.jpg",
            bgPlaceholder: "linear-gradient(135deg, #3d2514, #1a332a)",
            character: "Sin-Iddinam",
            characterRole: "Batelier et Convoyeur Fluvial",
            conceptUnlocked: "points_communs",
            sound: "coins",
            shake: "light",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Des pas lourds résonnent sur le ponton. Sin-Iddinam te tire vivement derrière les barriques.*</em></p>
                    <p class="vn-speaker"><strong>Sin-Iddinam :</strong> <em>(chuchotant)</em> « {HERO_ORIGIN_CALL}, baisse la tête ! {HERO_PAST}, tu reconnais cette manœuvre suspecte... Regarde vers la grande barge... »</p>
                    <p class="vn-speaker"><strong>Sin-Iddinam :</strong> « Des contrebandiers chargent nos poteries pour voler du bronze sans payer les taxes au Roi ! Leurs registres de <strong class="vn-concept-highlight" data-glossary="calculis">calculis</strong> sont truqués. Tu as l'œil vif : on les prend de vitesse ? »</p>
                </div>
            `,
            choices: [
                {
                    text: "Se faufiler entre les jarres pour subtiliser un échantillon du métal de contrebande.",
                    impact: { richesse: +10, destin: +10 },
                    impactTag: "+10 Richesse, +10 Destin • Infiltration risquée",
                    sound: "coins",
                    shake: "light",
                    setFlags: { stole_contraband_bronze: true },
                    addClue: "Lingot de bronze clandestin frappé d'un lion noir",
                    butterflyEffect: "Cet échantillon prouvera la complicité de marchands étrangers.",
                    nextNode: "ch1_artisan_puzzle_intro"
                },
                {
                    text: "Confronter discrètement le pilote de la barge et lui acheter son silence avec une part de profit.",
                    impact: { influence: +10, richesse: +5 },
                    impactTag: "+10 Influence, +5 Richesse • Négociation",
                    sound: "choice",
                    shake: "light",
                    setFlags: { recruited_barge_pilot: true },
                    butterflyEffect: "Le pilote de barge sera votre allié précieux lors de votre fuite future.",
                    nextNode: "ch1_artisan_puzzle_intro"
                },
                {
                    text: "Mémoriser les symboles et pictogrammes gravés sur leurs poteries pour cartographier leur réseau.",
                    impact: { savoir: +12, influence: +5 },
                    impactTag: "+12 Savoir, +5 Influence • Déduction marchande",
                    sound: "clay",
                    shake: "light",
                    setFlags: { mapped_smuggling_route: true },
                    addClue: "Carte des routes fluviales de contrebande",
                    butterflyEffect: "Vous anticipez les prochains mouvements de la flotte clandestine.",
                    nextNode: "ch1_artisan_puzzle_intro"
                }
            ]
        },

        "ch1_artisan_puzzle_intro": {
            id: "ch1_artisan_puzzle_intro",
            chapter: "Chapitre I",
            chapterTitle: "Le Grand Registre du Troc & des Signes",
            location: "Atelier de poterie et comptoir d'échange de Lagash",
            bgImage: "assets/images/scene_babylon_market.jpg",
            character: "Sin-Iddinam",
            characterRole: "Batelier",
            conceptUnlocked: "evolution_ecriture",
            sound: "clay",
            shake: "light",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speaker"><strong>Sin-Iddinam :</strong> « Joli coup d'œil, {HERO_NAME} ! Mais pour coincer ces voleurs, on doit décoder leurs registres secrets de <strong class="vn-concept-highlight" data-glossary="commerce_troc">troc</strong>. »</p>
                    <p class="vn-speech-action"><em>*Il déplie un rouleau d'argile couvert d'empreintes de roseaux.*</em></p>
                    <p class="vn-speaker"><strong>Sin-Iddinam :</strong> « L'écriture est née pour compter les marchandises ! Reclasse les étapes historiques, des billes d'argile jusqu'à l'alphabet phénicien, et leur combine s'écroule ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Déchiffrer les étapes d'écriture sur la tablette comptable de l'atelier.",
                    impact: { savoir: +15 },
                    impactTag: "Défi Commercial • Énigme de l'Écriture",
                    minigame: "writing_puzzle",
                    nextNode: "ch1_common_transition"
                }
            ]
        },

        // --- DÉPART SOLDAT ---
        "ch1_soldat_start": {
            id: "ch1_soldat_start",
            chapter: "Chapitre I",
            chapterTitle: "Alerte Nocturne sur les Remparts",
            location: "Porte fortifiée de la Cité de Babylone",
            bgImage: "assets/images/scene_mesopotamia_river.jpg",
            bgPlaceholder: "linear-gradient(135deg, #1b263b, #3d0c02)",
            character: "Capitaine Nergal",
            characterRole: "Commandant de la Garde Royale",
            conceptUnlocked: "points_communs",
            sound: "chisel",
            shake: "medium",
            flash: true,
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Une flèche enflammée siffle au-dessus de ta tête et se fiche dans les créneaux !*</em></p>
                    <p class="vn-speaker"><strong>Capitaine Nergal :</strong> « {HERO_ORIGIN_CALL} ! Debout, {HERO_PAST} ! L'ennemi force la poterne ouest pour piller nos réserves de bronze et les ordres du Roi ! »</p>
                    <p class="vn-speech-action"><em>*Le capitaine abat son glaive sur la chaîne d'une herse dans un fracas métallique.*</em></p>
                    <p class="vn-speaker"><strong>Capitaine Nergal :</strong> « Un fuyard vient de lâcher cette tablette codée. Bloque la porte ou pourchasse-les dans les ruelles : pas le temps d'hésiter ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Traquer les saboteurs dans les ruelles étroites pour capturer un prisonnier vivant.",
                    impact: { influence: +12, destin: +10 },
                    impactTag: "+12 Influence, +10 Destin • Poursuite héroïque",
                    sound: "chisel",
                    shake: "medium",
                    setFlags: { captured_live_saboteur: true },
                    addClue: "Aveu arraché à un saboteur blessé",
                    butterflyEffect: "Le suspect capturé témoignera contre ses chefs au tribunal royal.",
                    nextNode: "ch1_soldat_puzzle_intro"
                },
                {
                    text: "Sécuriser immédiatement l'armurerie royale et étudier la tablette d'argile codée.",
                    impact: { savoir: +10, influence: +8 },
                    impactTag: "+10 Savoir, +8 Influence • Vigilance tactique",
                    sound: "clay",
                    shake: "light",
                    setFlags: { secured_armory: true },
                    addClue: "Tablette d'argile codée trouvée sur le saboteur",
                    butterflyEffect: "Les armes métalliques de Babylone sont en sécurité absolue.",
                    nextNode: "ch1_soldat_puzzle_intro"
                },
                {
                    text: "Épargner le saboteur blessé en secret en échange du nom de son commanditaire.",
                    impact: { savoir: +12, destin: +12 },
                    impactTag: "+12 Savoir, +12 Destin • Enquête secrète",
                    sound: "choice",
                    shake: "light",
                    setFlags: { spared_saboteur_informant: true },
                    butterflyEffect: "🦋 Effet Papillon : Cet informateur vous revaudra la vie et interviendra plus tard !",
                    nextNode: "ch1_soldat_puzzle_intro"
                }
            ]
        },

        "ch1_soldat_puzzle_intro": {
            id: "ch1_soldat_puzzle_intro",
            chapter: "Chapitre I",
            chapterTitle: "Le Code Secret des Infiltrés",
            location: "Corps de garde de la Porte Royale",
            bgImage: "assets/images/scene_clay_tablets.jpg",
            character: "Capitaine Nergal",
            characterRole: "Commandant de la Garde",
            conceptUnlocked: "evolution_ecriture",
            sound: "clay",
            shake: "light",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speaker"><strong>Capitaine Nergal :</strong> « Bien combattu, {HERO_NAME} ! Mais ces traîtres ont codé leur itinéraire d'attaque dans une écriture archaïque. »</p>
                    <p class="vn-speech-action"><em>*Nergal essuie la sueur de son front avec son brassard de cuir.*</em></p>
                    <p class="vn-speaker"><strong>Capitaine Nergal :</strong> « Pour sauver notre <strong class="vn-concept-highlight" data-glossary="cite_etat">cité-État</strong>, il faut comprendre l'évolution des signes, des premiers <strong class="vn-concept-highlight" data-glossary="calculis">calculis</strong> au <strong class="vn-concept-highlight" data-glossary="cuneiforme">cunéiforme</strong>. Décode-moi ça, et vite ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Analyser et ordonner les étapes de l'écriture pour décrypter le message des traîtres.",
                    impact: { savoir: +15 },
                    impactTag: "Défi Tactique • Énigme de l'Écriture",
                    minigame: "writing_puzzle",
                    nextNode: "ch1_common_transition"
                }
            ]
        },

        // --- DÉPART BÂTISSEUR ---
        "ch1_batisseur_start": {
            id: "ch1_batisseur_start",
            chapter: "Chapitre I",
            chapterTitle: "Sabotage au Cœur des Canaux",
            location: "Grande Digue Principale de l'Euphrate",
            bgImage: "assets/images/scene_mesopotamia_river.jpg",
            bgPlaceholder: "linear-gradient(135deg, #10302b, #422817)",
            character: "Ur-Zababa",
            characterRole: "Maître Ouvrier des Travaux Hydrauliques",
            conceptUnlocked: "points_communs",
            sound: "flood",
            shake: "heavy",
            flash: true,
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Un grondement sourd fait trembler le sol. L'eau boueuse de l'Euphrate jaillit entre les poutres !*</em></p>
                    <p class="vn-speaker"><strong>Ur-Zababa :</strong> « {HERO_ORIGIN_CALL}, l'eau monte ! Toi, {HERO_PAST}, tu vois bien que cette fissure n'est pas un accident : un traître a saboté la <strong class="vn-concept-highlight" data-glossary="irrigation">digue</strong> au levier de bronze ! »</p>
                    <p class="vn-speech-action"><em>*Un pan de briques s'effondre avec fracas dans le courant tumultueux.*</em></p>
                    <p class="vn-speaker"><strong>Ur-Zababa :</strong> « Si la vanne cède sous nos pieds, tout le quartier et les récoltes sont engloutis ! Colmate la brèche ou intercepte les fuyards, c'est une question de survie ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "S'élancer pour colmater la brèche avec de l'argile et du bitume avant l'effondrement.",
                    impact: { destin: +15, savoir: +5 },
                    impactTag: "+15 Destin, +5 Savoir • Sauvetage d'urgence",
                    sound: "water",
                    shake: "medium",
                    setFlags: { saved_dam_in_extremis: true },
                    butterflyEffect: "Les champs de blé sont sauvés ; les paysans vous acclament en héros.",
                    nextNode: "ch1_batisseur_puzzle_intro"
                },
                {
                    text: "Sécuriser le plan d'architecture abandonné et relever les empreintes cunéiformes.",
                    impact: { savoir: +12, influence: +8 },
                    impactTag: "+12 Savoir, +8 Influence • Indice stratégique",
                    sound: "clay",
                    shake: "light",
                    setFlags: { found_hydraulic_sabotage_plan: true },
                    addClue: "Plan secret de sabotage des canaux d'irrigation",
                    butterflyEffect: "Ce plan dévoile le calendrier des sabotages prévus par les traîtres.",
                    nextNode: "ch1_batisseur_puzzle_intro"
                },
                {
                    text: "Organiser les ouvriers et poser un piège hydraulique pour capturer les saboteurs.",
                    impact: { influence: +12, destin: +8 },
                    impactTag: "+12 Influence, +8 Destin • Piège d'ingénieur",
                    sound: "choice",
                    shake: "light",
                    setFlags: { laid_hydraulic_trap: true },
                    butterflyEffect: "Vous prendrez les comploteurs par surprise au Chapitre II.",
                    nextNode: "ch1_batisseur_puzzle_intro"
                }
            ]
        },

        "ch1_batisseur_puzzle_intro": {
            id: "ch1_batisseur_puzzle_intro",
            chapter: "Chapitre I",
            chapterTitle: "L'Art de Consigner les Plans & l'Écriture",
            location: "Cabane des maîtres d'œuvre au bord du canal",
            bgImage: "assets/images/scene_clay_tablets.jpg",
            character: "Ur-Zababa",
            characterRole: "Maître Ouvrier",
            conceptUnlocked: "evolution_ecriture",
            sound: "clay",
            shake: "light",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speaker"><strong>Ur-Zababa :</strong> « Tu as les nerfs solides, {HERO_NAME} ! On a évité le désastre, mais regarde le plan abandonné par le saboteur. »</p>
                    <p class="vn-speech-action"><em>*Il époussète une tablette d'argile gravée de symboles techniques.*</em></p>
                    <p class="vn-speaker"><strong>Ur-Zababa :</strong> « Pour construire nos canaux d'irrigation sans commettre d'erreur mortelle, nos ancêtres ont inventé l'écriture. Reconstitue la frise des signes pour percer leur plan d'attaque ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Reconstituer la frise de l'écriture pour lire les instructions du complot.",
                    impact: { savoir: +15 },
                    impactTag: "Défi d'Ingénierie • Énigme de l'Écriture",
                    minigame: "writing_puzzle",
                    nextNode: "ch1_common_transition"
                }
            ]
        },

        // --- TRANSITION COMMUNE CH1 -> CH2 ---
        "ch1_common_transition": {
            id: "ch1_common_transition",
            chapter: "Chapitre I",
            chapterTitle: "La Menace se Révèle",
            location: "Grande Esplanade d'Ur",
            bgImage: "assets/images/scene_mesopotamia_river.jpg",
            character: "Le Sage Enki",
            characterRole: "Sage du Conseil des Cités",
            conceptUnlocked: "cite_etat",
            sound: "tension",
            shake: "light",
            flash: true,
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Le vent du désert souffle sur l'esplanade. Le Sage Enki s'avance, le regard grave.*</em></p>
                    <p class="vn-speaker"><strong>Le Sage Enki :</strong> « Splendide déduction, {HERO_ORIGIN_CALL} ! Toi, {HERO_PAST}, tu mesures la gravité de l'heure : le complot menace tout le <strong class="vn-concept-highlight" data-glossary="croissant_fertile">Croissant fertile</strong>. »</p>
                    <p class="vn-speaker"><strong>Le Sage Enki :</strong> « D'Ur à Babylone, chaque <strong class="vn-concept-highlight" data-glossary="cite_etat">cité-État</strong> possède son roi, ses dieux et ses lois. Si elles s'entredéchirent, notre civilisation s'éteint. Prends la barre de la barge : en route pour Babylone ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Prendre la barre d'une barge fluviale et faire voile vers les marchés et forges de Babylone !",
                    impact: { savoir: +5, influence: +5, destin: +10 },
                    impactTag: "Départ vers le Chapitre II ➔",
                    sound: "water",
                    shake: "light",
                    nextNode: "ch2_intro_hub"
                }
            ]
        },

        // =========================================================================
        // CHAPITRE 2 : L'ÉCHIQUIER DES CITÉS-ÉTATS & LE COMMERCE (3000 av. J.-C.)
        // =========================================================================
        "ch2_intro_hub": {
            id: "ch2_intro_hub",
            chapter: "Chapitre II",
            chapterTitle: "Le Carrefour des Cités & le Marché Noir",
            location: "Grand Marché Central & Quais Fluviaux de Babylone",
            bgImage: "assets/images/scene_babylon_market.jpg",
            character: "Gudea le Marchand",
            characterRole: "Émissaire de la Ligue Marchande",
            conceptUnlocked: "commerce_troc",
            sound: "coins",
            shake: "light",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*La clameur du grand marché t'assaille : marchands ambulants, tintements de pesée et senteurs d'épices.*</em></p>
                    <p class="vn-speaker"><strong>Gudea :</strong> « Te voilà enfin, {HERO_ORIGIN_CALL} ! {GUDEA_POSTURE_REMARK} Le cerveau du marché noir se fait appeler <strong>"L'Ombre du Lion"</strong> et manipule le cours des denrées ! »</p>
                    <p class="vn-speaker"><strong>Gudea :</strong> « La Mésopotamie doit exporter son blé pour importer du bois et des métaux rares. Bloque son réseau de <strong class="vn-concept-highlight" data-glossary="commerce_troc">troc</strong> fluvial, et son empire secret s'écroule ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Prendre en main le comptoir fluvial et équilibrer le grand troc des ressources stratégiques.",
                    impact: { richesse: +15, influence: +10 },
                    impactTag: "Défi Économique • Grand Troc Fluvial",
                    minigame: "trade_puzzle",
                    nextNode: "ch2_investigation_branch"
                }
            ]
        },

        "ch2_investigation_branch": {
            id: "ch2_investigation_branch",
            chapter: "Chapitre II",
            chapterTitle: "La Traque dans les Bas-Fonds",
            location: "Quartier des Forgerons & Ruelle des Fonderies de Bronze",
            bgImage: "assets/images/scene_babylon_market.jpg",
            character: "Gudea le Marchand",
            characterRole: "Émissaire",
            conceptUnlocked: "points_communs",
            sound: "tension",
            shake: "medium",
            flash: true,
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*L'étau se resserre dans la ruelle des forgerons. Un homme armé d'un poignard recule contre le fourneau brûlant.*</em></p>
                    <p class="vn-speaker"><strong>Contrebandier :</strong> <em>(paniqué)</em> « Reculez ! Vous croyez que vos lois nous font peur ? Même au sommet de la <strong class="vn-concept-highlight" data-glossary="ziggourat">Ziggourat</strong>, nos complices sont intouchables ! »</p>
                    <p class="vn-speaker"><strong>Gudea :</strong> « Tu es coincé, misérable ! {HERO_NAME}, c'est le moment d'utiliser ton talent pour lui faire cracher toute la vérité ! »</p>
                </div>
            `,
            choices: [
                // Choix exclusif Scribe
                {
                    reqClass: "scribe",
                    text: "Examiner la bourse de documents du suspect et prouver la falsification de son contrat d'argile.",
                    impact: { savoir: +18, influence: +10 },
                    impactTag: "📜 SCRIBE • Falsification démasquée",
                    sound: "clay",
                    shake: "light",
                    setFlags: { scribe_unmasked_fake_contract: true },
                    addClue: "Contrat d'argile falsifié au nom du Temple d'Ur",
                    butterflyEffect: "Cette preuve accable directement les comploteurs cléricaux.",
                    nextNode: "ch2_climax_decision"
                },
                // Choix exclusif Artisan
                {
                    reqClass: "artisan",
                    text: "Repérer la marque de fonderie clandestine sur ses lingots et racheter ses secrets au prix fort.",
                    impact: { richesse: +10, savoir: +15 },
                    impactTag: "🏺 ARTISAN • Accord commercial clandestin",
                    sound: "coins",
                    shake: "light",
                    setFlags: { artisan_bought_smuggler_secrets: true },
                    addClue: "Sceau de fonte illégale et liste des acheteurs",
                    butterflyEffect: "Le contrebandier devient votre espion au cœur de la Ziggourat.",
                    nextNode: "ch2_climax_decision"
                },
                // Choix exclusif Soldat
                {
                    reqClass: "soldat",
                    text: "Désarmer le traître d'un coup de hampe et lui imposer la rigueur martiale de Babylone.",
                    impact: { influence: +18, destin: +10 },
                    impactTag: "🛡️ SOLDAT • Arrestation musclée",
                    sound: "chisel",
                    shake: "medium",
                    setFlags: { soldat_subdued_suspect: true },
                    addClue: "Aveu complet du complot sous la garde royale",
                    butterflyEffect: "La garde royale prend le contrôle des accès à la Ziggourat.",
                    nextNode: "ch2_climax_decision"
                },
                // Choix exclusif Bâtisseur
                {
                    reqClass: "batisseur",
                    text: "Activer la vanne de vidange des forges pour couper sa fuite par les égouts de briques.",
                    impact: { destin: +18, savoir: +10 },
                    impactTag: "🌾 BÂTISSEUR • Piège hydraulique urbain",
                    sound: "water",
                    shake: "medium",
                    setFlags: { batisseur_sewer_trap: true },
                    addClue: "Plan des conduits secrets menant au temple",
                    butterflyEffect: "Vous découvrez le passage dérobé vers le sommet de la Ziggourat.",
                    nextNode: "ch2_climax_decision"
                },
                // Choix universels
                {
                    text: "Lui offrir une promesse d'amnistie en échange des noms des nobles corrompus.",
                    impact: { savoir: +14, influence: +8 },
                    impactTag: "+14 Savoir, +8 Influence • Interrogatoire habile",
                    sound: "coins",
                    shake: "light",
                    setFlags: { bribed_informant_truth: true },
                    addClue: "Liste des traîtres du Conseil Royal",
                    butterflyEffect: "🦋 Effet Papillon : Vous possédez la liste complète pour le procès royal !",
                    nextNode: "ch2_climax_decision"
                },
                {
                    text: "Saisir son sceau-cylindre en lapis-lazuli et ses lettres codées sans un mot.",
                    impact: { savoir: +12, richesse: +8 },
                    impactTag: "+12 Savoir, +8 Richesse • Saisie de pièces",
                    sound: "clay",
                    shake: "light",
                    setFlags: { seized_conspirator_token: true },
                    addClue: "Sceau-cylindre en lapis-lazuli de l'Ombre du Lion",
                    butterflyEffect: "Ce sceau vous ouvrira les portes du sanctuaire de la Ziggourat.",
                    nextNode: "ch2_climax_decision"
                }
            ]
        },

        "ch2_climax_decision": {
            id: "ch2_climax_decision",
            chapter: "Chapitre II",
            chapterTitle: "Le Sanctuaire sous les Étoiles",
            location: "Devant l'escalier monumental de la Ziggourat d'Ur",
            bgImage: "assets/images/scene_ziggurat_ur.jpg",
            bgPlaceholder: "linear-gradient(135deg, #0d1b2a, #415a77)",
            character: "Le Sage Enki",
            characterRole: "Doyen du Conseil",
            conceptUnlocked: "religion_ziggourat",
            sound: "tension",
            shake: "light",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Sous la voûte étoilée, la gigantesque Ziggourat d'Ur dresse ses terrasses colossales de briques séchées.*</em></p>
                    <p class="vn-speaker"><strong>Le Sage Enki :</strong> « {HERO_NAME}, lève les yeux. Ce sanctuaire relie les hommes aux dieux du ciel. Les conspirateurs s'y cachent ! »</p>
                    <p class="vn-speaker"><strong>Le Sage Enki :</strong> « Mais nul ne pénètre ici sans respecter la stricte <strong class="vn-concept-highlight" data-glossary="hierarchie_sociale">hiérarchie sociale</strong> en 5 rangs. Prouve ta maîtrise des classes mésopotamiennes, ou les gardes te jetteront aux fers ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Gravir les marches sacrées et affronter l'épreuve de la Hiérarchie Sociale !",
                    impact: { destin: +10, influence: +5 },
                    impactTag: "Accéder au Chapitre III ➔",
                    sound: "fanfare",
                    shake: "light",
                    nextNode: "ch3_ziggurat_trial"
                }
            ]
        },

        // =========================================================================
        // CHAPITRE 3 : LA ZIGGOURAT, LES DIEUX & LA HIÉRARCHIE (2500 av. J.-C.)
        // =========================================================================
        "ch3_ziggurat_trial": {
            id: "ch3_ziggurat_trial",
            chapter: "Chapitre III",
            chapterTitle: "Le Mystère des Degrés Sacrés",
            location: "Sommet de la Ziggourat d'Ur • Sanctuaire d'Ishtar",
            bgImage: "assets/images/scene_ziggurat_ur.jpg",
            character: "Grande Prêtresse Enheduanna",
            characterRole: "Gardienne du Panthéon et Poétesse Royale",
            conceptUnlocked: "hierarchie_sociale",
            sound: "tension",
            shake: "medium",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Des torches éclairent le sanctuaire d'Ishtar. La Grande Prêtresse t'arrête net d'un geste impérieux.*</em></p>
                    <p class="vn-speaker"><strong>Prêtresse Enheduanna :</strong> « Halte ! Qui ose fouler le domaine sacré ? {HERO_ORIGIN_CALL}, {HERO_PAST}... Crois-tu que ton titre de {HERO_TITLE} suffise devant les dieux ? En Mésopotamie, chaque être humain a un rang immuable fixé par sa naissance et sa fonction ! »</p>
                    <p class="vn-speaker"><strong>Prêtresse Enheduanna :</strong> « Du Roi tout-puissant aux nobles, scribes, artisans libres jusqu'aux esclaves : prouve que tu maîtrises l'ordre de notre <strong class="vn-concept-highlight" data-glossary="hierarchie_sociale">société</strong> en 5 degrés avant de gravir l'escalier céleste ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Relever le Défi Sacré et ordonner la Hiérarchie Sociale mésopotamienne en 5 degrés.",
                    impact: { savoir: +15, influence: +10 },
                    impactTag: "Défi Sacré • Énigme de la Hiérarchie",
                    minigame: "ziggurat_hierarchy",
                    nextNode: "ch3_revelation_sanctuary"
                }
            ]
        },

        "ch3_revelation_sanctuary": {
            id: "ch3_revelation_sanctuary",
            chapter: "Chapitre III",
            chapterTitle: "La Trahison Dévoilée au Sommet",
            location: "Autel d'or au sommet de la Ziggourat",
            bgImage: "assets/images/scene_ziggurat_ur.jpg",
            character: "Conseiller Royal Lu-Enlil",
            characterRole: "Haut Dignitaire Traître",
            conceptUnlocked: "gilgamesh",
            sound: "tension",
            shake: "heavy",
            flash: true,
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Une dalle pivote dans un grincement ! Le Conseiller Lu-Enlil bondit, serrant un coffret royal contre sa poitrine.*</em></p>
                    <p class="vn-speaker"><strong>Conseiller Lu-Enlil :</strong> <em>(ricanant)</em> « Trop tard ! Le Roi <strong class="vn-concept-highlight" data-glossary="hammurabi">Hammurabi</strong> promulgue ses lois écrites à Babylone, mais j'allais faire briser la stèle ! »</p>
                    <p class="vn-speaker"><strong>Conseiller Lu-Enlil :</strong> « Vous n'êtes rien face à un noble du Conseil. Si vous osez, venez m'affronter devant le trône royal ! »</p>
                </div>
            `,
            choices: [
                // Choix exclusif Scribe
                {
                    reqClass: "scribe",
                    text: "Citer l'Épopée de Gilgamesh et les devoirs sacrés des fonctionnaires pour briser son arrogance.",
                    impact: { savoir: +18, influence: +12 },
                    impactTag: "📜 SCRIBE • Sagesse de Gilgamesh",
                    sound: "clay",
                    shake: "light",
                    setFlags: { scribe_recited_gilgamesh: true },
                    addClue: "Manuscrit original de l'Épopée prouvant la loyauté",
                    butterflyEffect: "La Grande Prêtresse soutiendra votre témoignage au procès.",
                    nextNode: "ch4_hammurabi_intro"
                },
                // Choix exclusif Soldat
                {
                    reqClass: "soldat",
                    text: "Bloquer l'escalier avec votre bouclier et confisquer son coffret de documents compromettants.",
                    impact: { influence: +18, destin: +12 },
                    impactTag: "🛡️ SOLDAT • Interception héroïque",
                    sound: "chisel",
                    shake: "medium",
                    setFlags: { soldat_seized_traitor_chest: true },
                    addClue: "Coffret de documents royaux subtilisé au traître",
                    butterflyEffect: "Les preuves matérielles de Lu-Enlil sont directement entre vos mains.",
                    nextNode: "ch4_hammurabi_intro"
                },
                // Choix exclusif Artisan
                {
                    reqClass: "artisan",
                    text: "Identifier les lingots d'or du coffret comme provenant du trésor volé de Lagash.",
                    impact: { richesse: +15, savoir: +12 },
                    impactTag: "🏺 ARTISAN • Expertise métallique",
                    sound: "coins",
                    shake: "light",
                    setFlags: { artisan_identified_royal_gold: true },
                    addClue: "Marque d'or royal de Lagash détourné",
                    butterflyEffect: "La cité de Lagash envoie ses représentants appuyer votre cause.",
                    nextNode: "ch4_hammurabi_intro"
                },
                // Choix exclusif Bâtisseur
                {
                    reqClass: "batisseur",
                    text: "Verrouiller le mécanisme de la trappe secrète de la ziggourat pour empêcher ses complices d'intervenir.",
                    impact: { destin: +18, savoir: +12 },
                    impactTag: "🌾 BÂTISSEUR • Maîtrise des mécanismes",
                    sound: "choice",
                    shake: "light",
                    setFlags: { batisseur_locked_temple_trap: true },
                    addClue: "Mécanisme secret de la Ziggourat sécurisé",
                    butterflyEffect: "Les gardes du temple capturent l'ensemble des complices en fuite.",
                    nextNode: "ch4_hammurabi_intro"
                },
                // Choix universels
                {
                    text: "Prendre en chasse le traître sur la route royale menant à la cour de Babylone !",
                    impact: { influence: +15, destin: +15 },
                    impactTag: "Vers le Grand Jugement d'Hammurabi ➔",
                    sound: "chisel",
                    shake: "light",
                    setFlags: { pursued_traitor_to_court: true },
                    nextNode: "ch4_hammurabi_intro"
                }
            ]
        },

        // =========================================================================
        // CHAPITRE 4 : LE CODE D'HAMMURABI & LE JUGEMENT (1750 av. J.-C.)
        // =========================================================================
        "ch4_hammurabi_intro": {
            id: "ch4_hammurabi_intro",
            chapter: "Chapitre IV",
            chapterTitle: "Le Tribunal de la Grande Stèle Noire",
            location: "Palais Royal de Babylone • Cour de Justice",
            bgImage: "assets/images/scene_babylon_market.jpg",
            character: "Le Roi Hammurabi",
            characterRole: "Souverain de Babylone et Grand Législateur",
            conceptUnlocked: "code_hammurabi",
            sound: "chisel",
            shake: "medium",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Au centre du palais se dresse la stèle de basalte noir de plus de deux mètres, gravée de lois cunéiformes.*</em></p>
                    <p class="vn-speaker"><strong>Le Roi Hammurabi :</strong> « Silence dans mon tribunal ! En <strong>1750 av. J.-C.</strong>, Babylone ne tolère plus la loi du plus fort. La justice doit être <strong class="vn-concept-highlight" data-glossary="code_hammurabi">écrite</strong> pour protéger le faible ! »</p>
                    <p class="vn-speaker"><strong>Le Roi Hammurabi :</strong> « Lu-Enlil t'accuse de trahison, {HERO_ORIGIN_CALL}. Mais moi, je me souviens de ton serment, {HERO_PAST}. En tant que {HERO_TITLE}, avance devant ma stèle de basalte : prouve ta connaissance de mon Code de lois et fais triompher la vérité ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "S'avancer devant la stèle royale et relever l'Épreuve du Procès d'Hammurabi !",
                    impact: { savoir: +15, influence: +15 },
                    impactTag: "Jugement Royal • Procès d'Hammurabi",
                    minigame: "hammurabi_trial",
                    nextNode: "ch4_moral_dilemma_artisan"
                }
            ]
        },

        // --- DILEMME MORAL & ÉTHIQUE DU CODE D'HAMMOURABI ---
        "ch4_moral_dilemma_artisan": {
            id: "ch4_moral_dilemma_artisan",
            chapter: "Chapitre IV",
            chapterTitle: "Le Dilemme Éthique du Code",
            location: "Tribunal Royal de Babylone • Devant la Stèle de Basalte",
            bgImage: "assets/images/scene_babylon_market.jpg",
            character: "Le Roi Hammurabi",
            characterRole: "Souverain et Grand Législateur",
            conceptUnlocked: "code_hammurabi",
            sound: "tension",
            shake: "medium",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Les délibérations s'achèvent, mais le Roi lève la main pour suspendre la séance. Un homme en haillons tremble devant la stèle.*</em></p>
                    <p class="vn-speaker"><strong>Le Roi Hammurabi :</strong> « Regarde cet accusé, {HERO_ORIGIN_CALL}. Il se nomme Nannar, un artisan potier d'Ur. Une crue dévastatrice a anéanti son atelier et toutes ses réserves. Pour sauver ses trois enfants de la famine, il a brisé de nuit le sceau d'un grenier public pour dérober deux mesures d'orge. »</p>
                    <p class="vn-speaker"><strong>Le Roi Hammurabi :</strong> « Mes juges réclament la lettre stricte de mon Code : l'amputation ou la mort pour tout viol de grenier royal. Mais la foule gronde, prête à la sédition. Toi, {HERO_TITLE}, quelle sentence ordonnes-tu au nom de Babylone ? »</p>
                </div>
            `,
            choices: [
                // Option A : « La Loi est la Loi » (Condamnation exemplaire)
                {
                    text: "Appliquer la sentence du Code sans défaillir : la loi écrite doit être égale pour tous, sans exception émotionnelle.",
                    impact: { savoir: +15, destin: +10, influence: -20 },
                    impactTag: "⚖️ LOI STRICTE • +15 Savoir, +10 Destin, -20 Influence Populaire",
                    sound: "chisel",
                    shake: "medium",
                    setFlags: { hammurabi_strict_justice: true, flag_verdict: "strict" },
                    butterflyEffect: "Votre réputation de juge impitoyable gagne Babylone. Le Roi approuve votre rigueur, mais les classes populaires se méfient désormais de vous.",
                    nextNode: "ch4_trial_consequences"
                },
                // Option B : « L'Équité Supérieure » (Grâce motivée par la famine)
                {
                    text: "Commuer la peine corporelle en don d'argile aux greniers : nul ne doit périr pour avoir nourri les siens en temps de crue.",
                    impact: { influence: +20, destin: +10, savoir: -15, richesse: -10 },
                    impactTag: "🕊️ CLÉMENCE • +20 Influence, +10 Destin, -15 Savoir Institutionnel",
                    sound: "clay",
                    shake: "light",
                    setFlags: { hammurabi_clemency_granted: true, flag_verdict: "clemency" },
                    butterflyEffect: "Le peuple de Babylone acclame votre bonté. En revanche, les magistrats conservateurs estiment que vous affaiblissez l'autorité royale.",
                    nextNode: "ch4_trial_consequences"
                },
                // Option C : Choix Exclusifs de Classe
                {
                    reqClass: "scribe",
                    text: "Dénicher un article méconnu du Code d'Ur-Nammu autorisant la compensation pécuniaire différée.",
                    impact: { savoir: +20, influence: +5, richesse: -10 },
                    impactTag: "📜 SCRIBE • Jurisprudence d'Ur-Nammu",
                    sound: "clay",
                    shake: "light",
                    setFlags: { hammurabi_metier_justice: true, flag_verdict: "metier" },
                    butterflyEffect: "Les scribes saluent votre érudition juridique. Le Roi accepte le précédent légal d'Ur-Nammu.",
                    nextNode: "ch4_trial_consequences"
                },
                {
                    reqClass: "artisan",
                    text: "Avancer les deux mesures d'orge sur ses propres bénéfices de troc fluvial.",
                    impact: { richesse: -20, influence: +25, destin: +10 },
                    impactTag: "🏺 ARTISAN • Rachat par guilde & troc",
                    sound: "coins",
                    shake: "light",
                    setFlags: { hammurabi_metier_justice: true, flag_verdict: "metier" },
                    butterflyEffect: "La guilde des artisans vous voue une fidélité éternelle pour avoir racheté la dette de Nannar.",
                    nextNode: "ch4_trial_consequences"
                },
                {
                    reqClass: "soldat",
                    text: "Prendre l'artisan sous sa garde personnelle et l'affecter aux corvées de fortification.",
                    impact: { influence: +12, destin: +15, savoir: -8 },
                    impactTag: "🛡️ SOLDAT • Enrôlement sur les remparts",
                    sound: "chisel",
                    shake: "medium",
                    setFlags: { hammurabi_metier_justice: true, flag_verdict: "metier" },
                    butterflyEffect: "L'artisan sert loyalement sous votre commandement aux remparts pour réparer sa faute.",
                    nextNode: "ch4_trial_consequences"
                },
                {
                    reqClass: "batisseur",
                    text: "Réquisitionner l'homme pour colmater les vannes du canal royal ayant causé la famine.",
                    impact: { destin: +20, richesse: +5, influence: -10 },
                    impactTag: "🌾 BÂTISSEUR • Travaux de digues d'utilité publique",
                    sound: "water",
                    shake: "light",
                    setFlags: { hammurabi_metier_justice: true, flag_verdict: "metier" },
                    butterflyEffect: "Les vannes sont consolidées avec son aide et la cité est protégée contre les crues.",
                    nextNode: "ch4_trial_consequences"
                }
            ]
        },

        "ch4_trial_consequences": {
            id: "ch4_trial_consequences",
            chapter: "Chapitre IV",
            chapterTitle: "Le Verdict de la Justice Gravée",
            location: "Cour de Justice de Babylone",
            bgImage: "assets/images/scene_babylon_market.jpg",
            character: "Le Roi Hammurabi",
            characterRole: "Roi de Babylone",
            conceptUnlocked: "code_hammurabi",
            sound: "chisel",
            shake: "medium",
            flash: true,
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Le Roi frappe le dallage de son sceptre doré. La sentence tombe, glaciale et sans appel.*</em></p>
                    <p class="vn-speaker"><strong>Le Roi Hammurabi :</strong> « Verdict irréfutable, {HERO_NAME} ! Selon la <strong class="vn-concept-highlight" data-glossary="loi_talion">loi du Talion</strong> — œil pour œil —, les coupables perdront leurs biens et leurs titres. Justice est rendue ! »</p>
                    <p class="vn-speech-action"><em>*Enchaîné par les gardes, Lu-Enlil ricane une dernière fois avec haine.*</em></p>
                    <p class="vn-speaker"><strong>Conseiller Lu-Enlil :</strong> « Vous arrivez trop tard... Nos navires font déjà voile vers le <strong class="vn-concept-highlight" data-glossary="nil">Nil</strong> pour embraser toute l'Égypte ! »</p>
                </div>
            `,
            choices: [
                // Choix exclusif Scribe
                {
                    reqClass: "scribe",
                    text: "Préparer un traité d'alliance diplomatique en papyrus scellé pour le Pharaon d'Égypte.",
                    impact: { savoir: +20, influence: +15 },
                    impactTag: "📜 SCRIBE • Traité diplomatique scellé",
                    sound: "papyrus",
                    shake: "light",
                    setFlags: { scribe_pharaoh_treaty: true },
                    addClue: "Traité officiel d'alliance entre les Deux Fleuves",
                    butterflyEffect: "Le Pharaon vous accueillera avec les plus grands honneurs d'État.",
                    nextNode: "ch4_fluvial_departure"
                },
                // Choix exclusif Soldat
                {
                    reqClass: "soldat",
                    text: "Prendre le commandement de l'escadre navale de guerre pour traquer le navire rebelle.",
                    impact: { influence: +20, destin: +15 },
                    impactTag: "🛡️ SOLDAT • Commandement de la flotte",
                    sound: "chisel",
                    shake: "medium",
                    setFlags: { soldat_naval_command: true },
                    addClue: "Étendard de guerre de l'alliance fluviale",
                    butterflyEffect: "Votre flotte intercepte les fuyards dès leur entrée dans le delta du Nil.",
                    nextNode: "ch4_fluvial_departure"
                },
                // Choix exclusif Artisan
                {
                    reqClass: "artisan",
                    text: "Négocier des cargaisons de bois de cèdre et de lin égyptien pour financer l'expédition.",
                    impact: { richesse: +20, influence: +15 },
                    impactTag: "🏺 ARTISAN • Financement maritime",
                    sound: "coins",
                    shake: "light",
                    setFlags: { artisan_egypt_trade_route: true },
                    addClue: "Contrat de monopole commercial avec l'Égypte",
                    butterflyEffect: "Les marchands du Nil vous offrent leurs embarcations les plus rapides.",
                    nextNode: "ch4_fluvial_departure"
                },
                // Choix exclusif Bâtisseur
                {
                    reqClass: "batisseur",
                    text: "Optimiser les voiles et la coque des navires pour naviguer à contre-courant du Nil.",
                    impact: { destin: +20, savoir: +15 },
                    impactTag: "🌾 BÂTISSEUR • Ingénierie navale",
                    sound: "water",
                    shake: "light",
                    setFlags: { batisseur_naval_upgrade: true },
                    addClue: "Plan d'amélioration des bateaux fluviaux",
                    butterflyEffect: "Vos bateaux atteignent l'Égypte avec une avance décisive.",
                    nextNode: "ch4_fluvial_departure"
                },
                // Choix universels
                {
                    text: "Armer une grande expédition fluviale et mettre le cap sur l'Égypte du Nil !",
                    impact: { influence: +15, richesse: +10, destin: +20 },
                    impactTag: "Cap sur l'Égypte Antique (Chapitre V) ➔",
                    sound: "water",
                    shake: "light",
                    setFlags: { royal_mission_egypt: true },
                    nextNode: "ch4_fluvial_departure"
                }
            ]
        },

        // --- DÉPART FLUVIAL & RETENTISSEMENT DU VERDICT ---
        "ch4_fluvial_departure": {
            id: "ch4_fluvial_departure",
            chapter: "Chapitre IV",
            chapterTitle: "Les Quais de Babylone : Le Poids des Actes",
            location: "Port fluvial de Babylone • Quai des Départs vers l'Égypte",
            bgImage: "assets/images/scene_babylon_market.jpg",
            character: "Sin-Iddinam le Batelier",
            characterRole: "Maître des Quais et Batelier Fluvial",
            conceptUnlocked: "commerce_troc",
            sound: "water",
            shake: "light",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Les barges d'expédition sont amarrées le long de l'Euphrate, prêtes pour le long périple vers le Nil.*</em></p>
                    {PORT_VERDICT_ECHO}
                </div>
            `,
            choices: [
                {
                    reqFlag: "hammurabi_strict_justice",
                    text: "Les bateliers refusent de charger les vivres de secours sans ordre royal écrit. Assumer la traversée dans des conditions difficiles.",
                    impact: { destin: -5 },
                    impactTag: "⚠️ RANCŒUR DU PEUPLE • -5 Destin (Rations réduites)",
                    sound: "water",
                    shake: "medium",
                    butterflyEffect: "Les mariniers vous craignent et gardent leurs distances tout au long de la traversée.",
                    nextNode: "ch4_timeline_node"
                },
                {
                    reqFlag: "hammurabi_clemency_granted",
                    text: "Recevoir le talisman d'obsidienne offert en secret par la famille de Nannar et hisser les voiles avec la bénédiction populaire.",
                    impact: { destin: +5, influence: +5 },
                    impactTag: "🕊️ GRATITUDE DU PEUPLE • Amulette protectrice reçue",
                    addClue: "Amulette d'obsidienne de l'artisan gracié",
                    sound: "coins",
                    shake: "light",
                    butterflyEffect: "La bénédiction des artisans et l'amulette d'obsidienne galvanisent l'équipage.",
                    nextNode: "ch4_timeline_node"
                },
                {
                    reqFlag: "hammurabi_metier_justice",
                    text: "Prendre la tête d'une flotte parfaitement ravitaillée grâce à l'accord passé avec les corporations de métier.",
                    impact: { destin: +5, influence: +5 },
                    impactTag: "🤝 RESPECT DES CORPORATIONS • Flotte parée pour le Nil",
                    sound: "water",
                    shake: "light",
                    butterflyEffect: "Les corporations d'artisans et la garde assurent une traversée fluide vers le delta du Nil.",
                    nextNode: "ch4_timeline_node"
                },
                {
                    text: "Larguer les amarres et hisser les voiles en direction du delta du Nil.",
                    impact: { destin: +5 },
                    impactTag: "Cap sur le Nil ➔",
                    sound: "water",
                    shake: "light",
                    nextNode: "ch4_timeline_node"
                }
            ]
        },

        // --- INTERMÈDE CHRONOLOGIQUE ---
        "ch4_timeline_node": {
            id: "ch4_timeline_node",
            chapter: "Intermède Historique",
            chapterTitle: "La Grande Frise du Temps",
            location: "Grande Bibliothèque d'Ur — Tablettes des Âges",
            bgImage: "assets/images/scene_ziggurat_night.jpg",
            character: "Le Grand Chroniqueur",
            characterRole: "Gardien des Mémoires Antiques",
            conceptUnlocked: "chronologie_croissant",
            sound: "papyrus",
            shake: "light",
            mood: "mystery",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Dans la bibliothèque royale, un parchemin immense s'illumine sous les lampes à huile.*</em></p>
                    <p class="vn-speaker"><strong>Le Grand Chroniqueur :</strong> « Avant de cingler vers le Nil, {HERO_ORIGIN_CALL}, toi qui as œuvré comme {HERO_TITLE}, tu dois situer notre épopée dans la grande histoire du monde. »</p>
                    <p class="vn-speaker"><strong>Le Grand Chroniqueur :</strong> « De la naissance de l'agriculture à l'écriture cunéiforme et aux pyramides : ordonne les siècles sur la ligne du temps ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Reconstituer la Grande Frise Chronologique du Croissant Fertile !",
                    impact: { savoir: +20, destin: +10 },
                    impactTag: "Grand Défi Chronologique • Frise Historique",
                    minigame: "timeline_puzzle",
                    nextNode: "ch5_nile_arrival"
                }
            ]
        },

        // =========================================================================
        // CHAPITRE 5 : L'ÉGYPTE DU NIL, PYRAMIDES & DÉNOUEMENT (ÉGYPTE ANTIQUE)
        // =========================================================================
        "ch5_nile_arrival": {
            id: "ch5_nile_arrival",
            chapter: "Chapitre V",
            chapterTitle: "Le Don du Fleuve Sacré",
            location: "Delta et Rives fertiles du Nil en Égypte",
            bgImage: "assets/images/scene_egypt_nile.jpg",
            bgPlaceholder: "linear-gradient(135deg, #0d3b30, #61411b)",
            character: "Le Vizir Rekhmirê",
            characterRole: "Grand Administrateur du Pharaon",
            conceptUnlocked: "egypte_nil",
            sound: "flood",
            shake: "medium",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Ta barge fend les eaux miroitantes du Nil. Au loin se découpent les majestueuses Pyramides sous le soleil couchant.*</em></p>
                    <p class="vn-speaker"><strong>Le Vizir Rekhmirê :</strong> « Gloire au Nil ! Ici en Égypte, notre survie dépend de la <strong class="vn-concept-highlight" data-glossary="crue_nil">crue annuelle</strong> qui dépose le limon noir fertile sur nos champs. »</p>
                    <p class="vn-speaker"><strong>Le Vizir Rekhmirê :</strong> « Mais les rebelles ont fermé les canaux d'irrigation pour assécher la plaine ! {HERO_ORIGIN_CALL}, {VERDICT_REPUTATION} Prends la direction des vannes et sauve nos récoltes ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Prendre la tête des travaux hydrauliques et sécuriser les bassins de crue du Nil !",
                    impact: { destin: +20, savoir: +15 },
                    impactTag: "Grand Défi Fluvial • Irrigation du Nil",
                    minigame: "nile_irrigation",
                    nextNode: "ch5_pharaoh_audience"
                }
            ]
        },

        "ch5_pharaoh_audience": {
            id: "ch5_pharaoh_audience",
            chapter: "Chapitre V",
            chapterTitle: "L'Alliance Éternelle des Deux Fleuves",
            location: "Grande Salle du Trône sous l'ombre des Pyramides",
            bgImage: "assets/images/scene_egypt_nile.jpg",
            character: "Le Grand Pharaon",
            characterRole: "Chef Suprême, Commandant des Armées et Dieu Vivant",
            conceptUnlocked: "alphabet_phenicien",
            sound: "fanfare",
            shake: "light",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Au cœur de la grande salle hypostyle, le Pharaon brandit le sceptre et le fléau royal devant l'assemblée unie.*</em></p>
                    <p class="vn-speaker"><strong>Le Pharaon :</strong> « Les rebelles sont vaincus et les deux fleuves sont en paix ! En tant que roi et dieu vivant, je rends hommage à ton courage, noble {HERO_TITLE} {HERO_NAME}. {VERDICT_REPUTATION} »</p>
                    <p class="vn-speaker"><strong>Le Pharaon :</strong> « Mais avant de recevoir ton titre suprême de Maître du Croissant Fertile, réponds sans faillir aux questions des grands savants. Montre-nous ce que tu as appris ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "S'avancer devant le Conseil et passer le Grand Examen Sommatif du Module 3 !",
                    impact: { savoir: +25, influence: +20, richesse: +20, destin: +25 },
                    impactTag: "Épreuve Finale Sommatif • 12 Questions d'Examen ➔",
                    sound: "fanfare",
                    isExam: true
                }
            ]
        }
    }
};

window.STORY_DATA = STORY_DATA;
