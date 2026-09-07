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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*La porte en cèdre massif claque lourdement. L'odeur d'argile fraîche et d'encens emplit la pénombre.*</em></p>
                    <p class="vn-speaker"><strong>Maître Arad-Nanna :</strong> « Regarde cette bourse d'argile scellée... Elle arrive du temple d'Ur et doit contenir les <strong>calculis</strong> attestant de <strong>500 sacs d'orge</strong> pour la cité ! »</p>
                    <p class="vn-speech-action"><em>*Le vieux scribe approche la torche de la bulle d'argile. Ses mains tremblent.*</em></p>
                    <p class="vn-speaker"><strong>Maître Arad-Nanna :</strong> « Quelqu'un a altéré le sceau officiel avant la cuisson de l'argile ! Si les réserves de céréales sont pillées, la famine déclenchera une guerre entre nos <strong>cités-États</strong>. Tu es mon meilleur apprenti : prouve la fraude avant que les traîtres ne reviennent ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Briser la bulle d'argile pour compter et authentifier les calculis de comptage.",
                    impact: { savoir: +10, influence: +5 },
                    impactTag: "+10 Savoir, +5 Influence • Analyse matérielle",
                    sound: "clay",
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
                    setFlags: { alerted_guards_early: true },
                    butterflyEffect: "Les sentinelles surveilleront les greniers royaux dès cette nuit.",
                    nextNode: "ch1_scribe_puzzle_intro"
                },
                {
                    text: "Relever la signature du sceau-cylindre pour identifier le haut fonctionnaire corrompu.",
                    impact: { savoir: +8, influence: +12 },
                    impactTag: "+8 Savoir, +12 Influence • Enquête au Palais",
                    sound: "choice",
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speaker"><strong>Maître Arad-Nanna :</strong> « Bien joué ! Mais pour consigner cette trahison de manière infalsifiable devant les juges de la cité, tu dois maîtriser parfaitement les étapes de notre écriture ! »</p>
                    <p class="vn-speaker"><strong>Maître Arad-Nanna :</strong> « Du simple <strong>calculi</strong> d'argile servant à compter jusqu'à notre écriture <strong>cunéiforme</strong> en forme de clous, et au futur <strong>alphabet</strong> des Phéniciens... Reconstitue la fresque de l'histoire humaine ! »</p>
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Le clapotis des eaux du fleuve heurte les coques des barges marchandes chargées de poteries.*</em></p>
                    <p class="vn-speaker"><strong>Sin-Iddinam :</strong> <em>(à voix basse)</em> « Psitt ! Cache-toi derrière ces jarres d'huile d'olive ! Regarde vers le ponton nord... »</p>
                    <p class="vn-speech-action"><em>*Des silhouettes masquées transbordent des lingots métalliques sous des bâches de lin.*</em></p>
                    <p class="vn-speaker"><strong>Sin-Iddinam :</strong> « Ils exportent clandestinement notre blé et nos poteries pour importer du bronze illégal sans payer les taxes au Roi ! Et ils utilisent de fausses bourses de <strong>calculis</strong> pour effacer les traces du troc. Ils préparent un soulèvement ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Se faufiler entre les jarres pour subtiliser un échantillon du métal de contrebande.",
                    impact: { richesse: +10, destin: +10 },
                    impactTag: "+10 Richesse, +10 Destin • Infiltration risquée",
                    sound: "coins",
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
                    setFlags: { recruited_barge_pilot: true },
                    butterflyEffect: "Le pilote de barge sera votre allié précieux lors de votre fuite future.",
                    nextNode: "ch1_artisan_puzzle_intro"
                },
                {
                    text: "Mémoriser les symboles et pictogrammes gravés sur leurs poteries pour cartographier leur réseau.",
                    impact: { savoir: +12, influence: +5 },
                    impactTag: "+12 Savoir, +5 Influence • Déduction marchande",
                    sound: "clay",
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speaker"><strong>Sin-Iddinam :</strong> « Pour retracer leurs transactions frauduleuses, nous devons décoder leurs contrats ! L'écriture est née précisément pour enregistrer le <strong>commerce et le troc</strong>. »</p>
                    <p class="vn-speaker"><strong>Sin-Iddinam :</strong> « Remets en ordre les étapes historiques, des boules de calculis d'argile jusqu'aux signes cunéiformes et à l'alphabet ! »</p>
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Un cri de sentinelle déchire la nuit au sommet des murailles de briques séchées.*</em></p>
                    <p class="vn-speaker"><strong>Capitaine Nergal :</strong> <em>(glaive au clair)</em> « Garde, aux armes ! Trois intrus ont forcé la poterne ouest ! Ils tentaient de dérober l'armurerie en bronze et les registres d'impôts du Roi ! »</p>
                    <p class="vn-speech-action"><em>*Le capitaine pointe sa torche vers une silhouette qui s'enfuit dans les ruelles sombres.*</em></p>
                    <p class="vn-speaker"><strong>Capitaine Nergal :</strong> « L'un des fuyards a laissé tomber une tablette d'argile fraîche portant un ordre d'attaque. Rattrape-les ou sécurise la porte de la cité ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Traquer les saboteurs dans les ruelles étroites pour capturer un prisonnier vivant.",
                    impact: { influence: +12, destin: +10 },
                    impactTag: "+12 Influence, +10 Destin • Poursuite héroïque",
                    sound: "chisel",
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speaker"><strong>Capitaine Nergal :</strong> « Les conspirateurs utilisent des écritures anciennes pour masquer leurs ordres de guerre. »</p>
                    <p class="vn-speaker"><strong>Capitaine Nergal :</strong> « Pour déchiffrer leur plan d'attaque contre nos <strong>cités-États</strong>, nous devons maîtriser l'évolution historique des signes : des calculis d'argile au cunéiforme ! »</p>
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Les eaux boueuses de l'Euphrate grondent avec fureur contre les batardeaux de roseaux.*</em></p>
                    <p class="vn-speaker"><strong>Ur-Zababa :</strong> <em>(désignant un pilier fendu)</em> « Regarde cette entaille ! Ce n'est pas la force du fleuve, c'est un coup de levier en bronze ! »</p>
                    <p class="vn-speech-action"><em>*Une fissure s'élargit le long de la vanne maîtresse d'irrigation.*</em></p>
                    <p class="vn-speaker"><strong>Ur-Zababa :</strong> « Si la digue cède cette nuit, les crues détruiront toutes les récoltes de blé et la cité sera condamnée à la famine ! Les coupables ont fui en laissant tomber un plan d'architecture hydraulique et un stylet d'écriture ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "S'élancer pour colmater la brèche avec de l'argile et du bitume avant l'effondrement.",
                    impact: { destin: +15, savoir: +5 },
                    impactTag: "+15 Destin, +5 Savoir • Sauvetage d'urgence",
                    sound: "water",
                    setFlags: { saved_dam_in_extremis: true },
                    butterflyEffect: "Les champs de blé sont sauvés ; les paysans vous acclament en héros.",
                    nextNode: "ch1_batisseur_puzzle_intro"
                },
                {
                    text: "Sécuriser le plan d'architecture abandonné et relever les empreintes cunéiformes.",
                    impact: { savoir: +12, influence: +8 },
                    impactTag: "+12 Savoir, +8 Influence • Indice stratégique",
                    sound: "clay",
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speaker"><strong>Ur-Zababa :</strong> « Pour concevoir nos canaux d'irrigation et transmettre des plans précis sans erreurs, l'écriture a été notre plus grande invention technique ! »</p>
                    <p class="vn-speaker"><strong>Ur-Zababa :</strong> « Démontre ta maîtrise de l'histoire des signes pour déchiffrer les instructions des conjurés ! »</p>
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Les clameurs s'élèvent sur la grande esplanade alors que le mystère s'épaissit.*</em></p>
                    <p class="vn-speaker"><strong>Le Sage Enki :</strong> « Bravo ! Grâce à ta perspicacité, le premier voile est levé. Mais la conjuration est immense ! »</p>
                    <p class="vn-speaker"><strong>Le Sage Enki :</strong> « Le complot s'étend à travers tout le Croissant Fertile : d'<strong>Ur</strong> à <strong>Lagash</strong>, jusqu'à la puissante <strong>Babylone</strong> ! Chacune de nos <strong>cités-États</strong> est autonome, gouvernée par son roi et ses lois écrites... Si elles entrent en guerre, notre civilisation s'effondrera ! Embarque sur le fleuve vers Babylone sans perdre une seconde ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Prendre la barre d'une barge fluviale et faire voile vers les marchés et forges de Babylone !",
                    impact: { savoir: +5, influence: +5, destin: +10 },
                    impactTag: "Départ vers le Chapitre II ➔",
                    sound: "water",
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Une foule cosmopolite grouille sur les quais de Babylone. L'odeur des épices se mêle à celle de la poussière des caravanes.*</em></p>
                    <p class="vn-speaker"><strong>Gudea :</strong> « Te voilà enfin ! Le cerveau de la conspiration se fait appeler <strong>"L'Ombre du Lion"</strong>. Il contrôle une flotte secrète et manipule les cours du troc. »</p>
                    <p class="vn-speaker"><strong>Gudea :</strong> « Pour l'acculer, nous devons bloquer ses cargaisons ! Rappelle-toi : la Mésopotamie <strong>exporte</strong> ses surplus (blé, poteries, objets fabriqués) pour <strong>importer</strong> ce qui lui manque cruellement : les métaux, le bois précieux et les pierres ! »</p>
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Les forges de bronze crépitent. Les marchands clandestins, pris au piège par le blocus de leurs cargaisons, paniquent.*</em></p>
                    <p class="vn-speaker"><strong>Gudea :</strong> « Nous en tenons un ! C'est le contrebandier en chef de l'Ombre du Lion ! »</p>
                    <p class="vn-speech-action"><em>*L'homme est acculé contre le fourneau incandescent, son poignard tiré.*</em></p>
                    <p class="vn-speaker"><strong>Contrebandier :</strong> « Vous n'empêcherez rien ! Les lois de vos rois ne valent rien face aux Dieux ! Même le grand prêtre au sommet de la Ziggourat nous protège ! »</p>
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*La gigantesque pyramide à degrés — la Ziggourat — découpe sa masse imposante dans le ciel nocturne.*</em></p>
                    <p class="vn-speaker"><strong>Le Sage Enki :</strong> « Regarde ces terrasses colossales... Ce temple relie le monde des mortels à la demeure des Dieux du Panthéon mésopotamien (Anu, Enlil, Ishtar). »</p>
                    <p class="vn-speaker"><strong>Le Sage Enki :</strong> « Les conspirateurs se rassemblent au sommet ! Mais attention : en Mésopotamie, l'accès au temple obéit à une <strong>hiérarchie sociale stricte en 5 niveaux</strong>. Seul celui qui maîtrise cet ordre sacré pourra franchir les gardes sans commettre de sacrilège ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "Gravir les marches sacrées et affronter l'épreuve de la Hiérarchie Sociale !",
                    impact: { destin: +10, influence: +5 },
                    impactTag: "Accéder au Chapitre III ➔",
                    sound: "fanfare",
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Au sommet de la Ziggourat, des brasiers embrasent l'obscurité. La Grande Prêtresse se dresse avec majesté.*</em></p>
                    <p class="vn-speaker"><strong>Prêtresse Enheduanna :</strong> « Halte ! Qui ose troubler la paix des Dieux ? En Mésopotamie, le rang de chaque âme est fixé par sa <strong>naissance</strong> et la <strong>spécialisation de son travail</strong> ! »</p>
                    <p class="vn-speaker"><strong>Prêtresse Enheduanna :</strong> « Du <strong>Roi</strong> absolu, en passant par les <strong>Nobles</strong>, les <strong>Fonctionnaires & Scribes</strong>, le <strong>Peuple</strong> d'artisans et paysans, jusqu'aux <strong>Esclaves</strong>... Prouve ta connaissance de l'ordre social pour démasquer les imposteurs ! »</p>
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Un panneau secret de l'autel divin s'ouvre brusquement. Un homme drapé de soie pourpre et d'or tente de s'enfuir avec un coffret !*</em></p>
                    <p class="vn-speaker"><strong>Conseiller Lu-Enlil :</strong> <em>(sourire narquois)</em> « Trop tard, vermisseaux ! Le Roi Hammurabi vient de promulguer ses <strong>lois écrites</strong> à Babylone. J'allais faire effacer les gravures de la stèle pour que nos vols restent impunis ! »</p>
                    <p class="vn-speaker"><strong>Conseiller Lu-Enlil :</strong> « Si vous osez me défier, retrouvez-moi devant le trône royal de Babylone. La parole d'un noble écrasera la vôtre ! »</p>
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Au centre de la cour royale se dresse une imposante stèle de basalte noir haute de plus de deux mètres, gravée de centaines de lois en cunéiforme.*</em></p>
                    <p class="vn-speaker"><strong>Conseiller Lu-Enlil :</strong> <em>(à genoux devant le trône)</em> « Majesté ! Cet insolent m'accuse faussement ! Selon votre loi sacrée, l'accusateur sans preuve doit subir la peine capitale ! »</p>
                    <p class="vn-speaker"><strong>Le Roi Hammurabi :</strong> <em>(voix puissante et posée)</em> « Silence ! En cette année <strong>1750 av. J.-C.</strong>, Babylone est puissante. Mais la force ne fait pas le droit : la loi doit être <strong>écrite</strong> pour s'appliquer de la même façon à tous et protéger le faible contre le fort ! »</p>
                    <p class="vn-speaker"><strong>Le Roi Hammurabi :</strong> « Avance, et prouve ta maîtrise de mon <strong>Code de lois</strong> face à cette assemblée ! »</p>
                </div>
            `,
            choices: [
                {
                    text: "S'avancer devant la stèle royale et relever l'Épreuve du Procès d'Hammurabi !",
                    impact: { savoir: +15, influence: +15 },
                    impactTag: "Jugement Royal • Procès d'Hammurabi",
                    minigame: "hammurabi_trial",
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Le Roi Hammurabi frappe le sol de son sceptre doré. La foule retient son souffle.*</em></p>
                    <p class="vn-speaker"><strong>Le Roi Hammurabi :</strong> « Ta plaidoirie est irréfutable ! Les lois gravées dans la pierre protègent l'ordre et l'équité. Les traîtres sont déchus, leurs terres restituées aux paysans et leurs crimes châtiés selon la <strong>loi du Talion</strong> ! »</p>
                    <p class="vn-speech-action"><em>*Tandis que les gardes enchaînent Lu-Enlil, ce dernier crache un ultime défi.*</em></p>
                    <p class="vn-speaker"><strong>Conseiller Lu-Enlil :</strong> « Vous n'avez rien gagné... Notre navire amiral cingle déjà vers le <strong>Nil</strong> avec nos trésors pour soulever l'<strong>Égypte ancienne</strong> contre vous ! »</p>
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
                    setFlags: { scribe_pharaoh_treaty: true },
                    addClue: "Traité officiel d'alliance entre les Deux Fleuves",
                    butterflyEffect: "Le Pharaon vous accueillera avec les plus grands honneurs d'État.",
                    nextNode: "ch4_timeline_node"
                },
                // Choix exclusif Soldat
                {
                    reqClass: "soldat",
                    text: "Prendre le commandement de l'escadre navale de guerre pour traquer le navire rebelle.",
                    impact: { influence: +20, destin: +15 },
                    impactTag: "🛡️ SOLDAT • Commandement de la flotte",
                    sound: "chisel",
                    setFlags: { soldat_naval_command: true },
                    addClue: "Étendard de guerre de l'alliance fluviale",
                    butterflyEffect: "Votre flotte intercepte les fuyards dès leur entrée dans le delta du Nil.",
                    nextNode: "ch4_timeline_node"
                },
                // Choix exclusif Artisan
                {
                    reqClass: "artisan",
                    text: "Négocier des cargaisons de bois de cèdre et de lin égyptien pour financer l'expédition.",
                    impact: { richesse: +20, influence: +15 },
                    impactTag: "🏺 ARTISAN • Financement maritime",
                    sound: "coins",
                    setFlags: { artisan_egypt_trade_route: true },
                    addClue: "Contrat de monopole commercial avec l'Égypte",
                    butterflyEffect: "Les marchands du Nil vous offrent leurs embarcations les plus rapides.",
                    nextNode: "ch4_timeline_node"
                },
                // Choix exclusif Bâtisseur
                {
                    reqClass: "batisseur",
                    text: "Optimiser les voiles et la coque des navires pour naviguer à contre-courant du Nil.",
                    impact: { destin: +20, savoir: +15 },
                    impactTag: "🌾 BÂTISSEUR • Ingénierie navale",
                    sound: "water",
                    setFlags: { batisseur_naval_upgrade: true },
                    addClue: "Plan d'amélioration des bateaux fluviaux",
                    butterflyEffect: "Vos bateaux atteignent l'Égypte avec une avance décisive.",
                    nextNode: "ch4_timeline_node"
                },
                // Choix universels
                {
                    text: "Armer une grande expédition fluviale et mettre le cap sur l'Égypte du Nil !",
                    impact: { influence: +15, richesse: +10, destin: +20 },
                    impactTag: "Cap sur l'Égypte Antique (Chapitre V) ➔",
                    sound: "water",
                    setFlags: { royal_mission_egypt: true },
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
            mood: "mystery",
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Avant d'embarquer pour le long périple vers le Nil, le grand chroniqueur déroule une magnifique fresque sur papyrus et tablettes.*</em></p>
                    <p class="vn-speaker"><strong>Le Grand Chroniqueur :</strong> « {HERO_NAME}, pour comprendre la puissance de nos civilisations fluviales, tu dois maîtriser l'ordre des grandes dates du <strong data-glossary="croissant_fertile">Croissant fertile</strong> et de l'histoire universelle ! »</p>
                    <p class="vn-speaker"><strong>Le Grand Chroniqueur :</strong> « Remets chaque événement clé à sa place sur la ligne du temps, des premiers villages jusqu'à l'Antiquité tardive ! »</p>
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Votre navire glisse sur les eaux dorées du Nil. À l'horizon s'élèvent les Pyramides colossales de Khéops et d'Amenemhat Ier, tombeaux éternels des rois.*</em></p>
                    <p class="vn-speaker"><strong>Le Vizir Rekhmirê :</strong> « Bienvenue en terre d'Égypte ! Ici, toute vie dépend de la <strong>crue des eaux</strong> qui dépose le limon noir fertilisant nos terres. »</p>
                    <p class="vn-speaker"><strong>Le Vizir Rekhmirê :</strong> « Les rebelles que vous pourchassez ont bloqué nos bassins de retenue pour affamer le pays ! Aidez-nous à sécuriser les canaux et à déchiffrer leurs messages en <strong>hiéroglyphes</strong> ! »</p>
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
            text: `
                <div class="vn-dialogue">
                    <p class="vn-speech-action"><em>*Dans la grandiose salle hypostyle baignée de lumière, le Pharaon trône avec le sceptre et le fouet d'or devant les scribes et grands dignitaires des deux civilisations.*</em></p>
                    <p class="vn-speaker"><strong>Le Pharaon :</strong> « Les traîtres sont neutralisés et nos récoltes sont sauvées ! En tant que <strong>dieu vivant</strong>, chef des armées, juge suprême et maître de l'administration, je salue ta bravoure ! »</p>
                    <p class="vn-speaker"><strong>Le Pharaon :</strong> « Avant de recevoir les honneurs suprêmes et ton Diplôme d'Élite du Croissant Fertile, tu dois prouver devant le Conseil des Scribes ta maîtrise complète des savoirs du <strong>Module 3 d'Histoire</strong>. L'assemblée royale t'écoute ! »</p>
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
