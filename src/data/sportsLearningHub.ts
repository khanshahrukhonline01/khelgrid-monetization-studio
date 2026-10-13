export type LearningSourceType = "book" | "video" | "text" | "audio" | "quiz" | "diagram";

export type LearningLevel = "Beginner" | "Intermediate" | "Advanced" | "Coach & Referee";

export interface LearningChapter {
  title: string;
  timestamp?: string; // for videos (e.g., "02:15")
  page?: string; // for books
  summary: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningResource {
  id: string;
  title: string;
  sport: string;
  sportEmoji: string;
  sourceType: LearningSourceType;
  level: LearningLevel;
  authorOrCreator: string;
  organizationOrPublisher?: string;
  estimatedTime: string; // e.g. "18 min watch", "240 pages", "12 min read"
  summary: string;
  coverImage?: string;
  videoEmbedUrl?: string; // or demo streaming embed
  videoDurationSeconds?: number;
  keyTakeaways: string[];
  chapters?: LearningChapter[];
  fullTextContent?: string;
  quiz?: QuizQuestion[];
  equipmentRequired?: string[];
  fieldSpecs?: {
    length: string;
    width: string;
    boundaryNote: string;
    keyLines: string[];
  };
  externalLink?: string;
  featured?: boolean;
  tags: string[];
}

export interface SportLearningOverview {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  governingBody: string;
  governingBodyIndia: string;
  olympicStatus: string;
  quickRulesSummary: string[];
  courtOrFieldSummary: string;
  scoringSummary: string;
  keyEquipment: string[];
}

export const SPORT_OVERVIEWS: Record<string, SportLearningOverview> = {
  Cricket: {
    slug: "cricket",
    name: "Cricket",
    emoji: "🏏",
    tagline: "Batting mechanics, bowling variations, pitch craft & tactical field placements",
    governingBody: "International Cricket Council (ICC)",
    governingBodyIndia: "Board of Control for Cricket in India (BCCI)",
    olympicStatus: "Returning at Los Angeles 2028 Olympic Games (T20 format)",
    quickRulesSummary: [
      "2 teams of 11 players; 1 innings per side in limited overs (T20: 20 overs, ODI: 50 overs).",
      "Pitch length is exactly 22 yards (20.12m) with stumps 9 inches wide.",
      "Dismissals include Bowled, Caught, LBW (Leg Before Wicket), Run Out, Stumped, and Hit Wicket.",
      "Powerplay rules govern field placements inside the 30-yard circle to incentivize aggressive strokeplay.",
    ],
    courtOrFieldSummary:
      "Oval field (boundary 65–85m from pitch center). 22-yard turf/mat pitch with popping, bowling, and return creases.",
    scoringSummary:
      "Runs scored by running between wickets or hitting boundaries (4 runs on bounce, 6 runs on the full). Extras include No-balls, Wides, Byes, and Leg-byes.",
    keyEquipment: [
      "Willow Cricket Bat",
      "Leather Ball (156g)",
      "Pads & Gloves",
      "Helmet with Grille",
      "Spiked Shoes",
      "Abdominal Guard",
    ],
  },
  Football: {
    slug: "football",
    name: "Football (Soccer)",
    emoji: "⚽",
    tagline: "Passing geometry, pressing structures, positional play & transition speed",
    governingBody: "Fédération Internationale de Football Association (FIFA)",
    governingBodyIndia: "All India Football Federation (AIFF)",
    olympicStatus: "Summer Olympic Sport (U-23 tournament with 3 overage players)",
    quickRulesSummary: [
      "11 players per team including 1 goalkeeper; match duration is two 45-minute halves.",
      "Offside rule: An attacking player is offside if closer to opponent goal line than both the ball and second-last opponent when ball is played.",
      "No handling the ball with hands/arms except the goalkeeper inside their own 18-yard penalty area.",
      "Direct/indirect free kicks, yellow cards (caution) and red cards (dismissal).",
    ],
    courtOrFieldSummary:
      "Rectangular pitch 100-110m long by 64-75m wide. Goalposts are 7.32m wide by 2.44m high.",
    scoringSummary:
      "1 goal scored when the whole ball crosses the goal line between the posts and under the crossbar.",
    keyEquipment: [
      "Size 5 Football (410–450g)",
      "Studded Cleats (Moulded/Metal)",
      "Shin Guards",
      "Team Jersey & Shorts",
      "Goalkeeper Padded Gloves",
    ],
  },
  Badminton: {
    slug: "badminton",
    name: "Badminton",
    emoji: "🏸",
    tagline: "Footwork split-steps, wrist pronation, deception & rapid net interchanges",
    governingBody: "Badminton World Federation (BWF)",
    governingBodyIndia: "Badminton Association of India (BAI)",
    olympicStatus: "Summer Olympic Sport since Barcelona 1992",
    quickRulesSummary: [
      "Best of 3 games to 21 points (rally point scoring system); at 20-all, must lead by 2 points (capped at 30).",
      "Serve must be hit below 1.15m waist height from the surface and travel diagonally into the receiver's court.",
      "Faults include shuttle hitting outside the court lines, shuttle passing through or under net, and racket crossing the net line.",
      "Singles uses the long and narrow court boundary; doubles uses the wide and short serve court boundary.",
    ],
    courtOrFieldSummary:
      "Court is 13.4m long by 6.1m wide (doubles) or 5.18m wide (singles). Net height is 1.55m at posts and 1.524m at center.",
    scoringSummary:
      "1 point on every rally won. Service changes to whichever player or pair won the preceding point.",
    keyEquipment: [
      "Graphite Racket (75–88g)",
      "Feather (Goose/Duck) or Nylon Shuttlecock",
      "Gum-Sole Non-Marking Badminton Shoes",
      "Overgrip Tape",
    ],
  },
  Athletics: {
    slug: "athletics",
    name: "Athletics (Track & Field)",
    emoji: "🏃",
    tagline: "Sprint mechanics, hurdle clearance, endurance pacing & explosive field events",
    governingBody: "World Athletics",
    governingBodyIndia: "Athletics Federation of India (AFI)",
    olympicStatus: "Core Summer Olympic Foundation Sport since 1896",
    quickRulesSummary: [
      "Sprint starts require starting blocks; one false start results in immediate disqualification.",
      "Runners must stay entirely within their assigned lane during 100m, 200m, 400m, and hurdle events.",
      "Field events allow 3 preliminary attempts plus 3 final attempts for the top 8 qualifiers.",
      "Relay baton exchanges must occur strictly inside the 30-meter exchange zone.",
    ],
    courtOrFieldSummary:
      "Standard 400m outdoor synthetic oval track with 8 lanes (each 1.22m wide), infield for throws and jumps.",
    scoringSummary:
      "Finishing order decided by torso crossing the finish line. Electronic photo-finish timing to thousandths of a second.",
    keyEquipment: [
      "Track Spike Shoes",
      "Starting Blocks",
      "Relay Batons",
      "Fiberglass Vaulting Poles / Throwing Implements",
      "High Jump Foam Mats",
    ],
  },
  Tennis: {
    slug: "tennis",
    name: "Tennis",
    emoji: "🎾",
    tagline: "Topspin forehand kinetic chain, slice variation, serve trajectory & court coverage",
    governingBody: "International Tennis Federation (ITF)",
    governingBodyIndia: "All India Tennis Association (AITA)",
    olympicStatus: "Summer Olympic Sport (Re-introduced Seoul 1988)",
    quickRulesSummary: [
      "Scoring progresses 15, 30, 40, Game. At 40-40 (Deuce), player must win 2 consecutive points (Advantage).",
      "Sets are won by reaching 6 games with a 2-game margin, or via a 7-point Tiebreak at 6-6.",
      "Server gets 2 serves per point; ball must land in opposite diagonal service box without touching net on landing.",
      "Players switch sides of the net on odd game totals (after 1st game, 3rd game, etc.).",
    ],
    courtOrFieldSummary:
      "Court is 23.77m long by 8.23m wide (singles) or 10.97m wide (doubles). Net is 0.914m high at center.",
    scoringSummary: "Points form Games, Games form Sets, Sets form Matches (Best of 3 or 5 sets).",
    keyEquipment: [
      "Composite Graphite Racket (280–320g)",
      "Pressurized Felt Tennis Balls",
      "Hard-Court or Clay-Court Tennis Shoes",
      "Vibration Dampener",
    ],
  },
  Basketball: {
    slug: "basketball",
    name: "Basketball",
    emoji: "🏀",
    tagline: "Pick-and-roll reads, shooting arc mechanics, transition defense & spatial spacing",
    governingBody: "International Basketball Federation (FIBA)",
    governingBodyIndia: "Basketball Federation of India (BFI)",
    olympicStatus: "Summer Olympic Sport (5v5 since 1936, 3x3 since Tokyo 2020)",
    quickRulesSummary: [
      "5 players on court; four 10-minute quarters (FIBA) or four 12-minute quarters (NBA).",
      "24-second shot clock to attempt a basket that touches the ring; 8 seconds to cross half-court.",
      "Dribbling violations include Traveling (moving pivot foot without dribbling) and Double Dribble.",
      "5 personal fouls (FIBA) disqualify a player from returning to the game.",
    ],
    courtOrFieldSummary:
      "Hardwood/polyurethane court 28m long by 15m wide. Rim height is 3.05m (10 feet) with backboard 1.8m x 1.05m.",
    scoringSummary:
      "2 points for field goals inside 3-point arc (6.75m FIBA), 3 points beyond arc, 1 point per free throw.",
    keyEquipment: [
      "Size 7 Basketball (Men) / Size 6 (Women)",
      "High-Top Basketball Shoes with Ankle Support",
      "Compression Sleeve",
      "Mouthguard",
    ],
  },
  Kabaddi: {
    slug: "kabaddi",
    name: "Kabaddi",
    emoji: "🤼",
    tagline: "Raid cant discipline, toe-touch execution, ankle hold locks & corner coordination",
    governingBody: "International Kabaddi Federation (IKF)",
    governingBodyIndia: "Amateur Kabaddi Federation of India (AKFI)",
    olympicStatus: "Asian Games Regular Sport; Active Campaign for 2036 Olympic inclusion",
    quickRulesSummary: [
      "7 players per side on court; match consists of two 20-minute halves.",
      "A raider enters the opponent half chanting continuous 'Kabaddi' within a 30-second raid clock.",
      "The raider must touch at least one defender and return past the mid-line safely to score touch points.",
      "Defenders score 1 tackle point by pinning the raider down inside their half before mid-line return.",
      "Do-or-Die Raid: If a team has 2 successive empty raids, the 3rd raid must yield a point or raider is declared out.",
    ],
    courtOrFieldSummary:
      "Synthetic EVA foam mat measuring 13m x 10m (Men) or 12m x 8m (Women), divided into two halves by a mid-line, with baulk line and bonus line.",
    scoringSummary:
      "Touch points, Tackle points, Bonus point (crossing bonus line with trailing foot in air when 6+ defenders present), and 2-point All-Out bonus.",
    keyEquipment: [
      "High-Traction Wrestling/Kabaddi Mat Shoes",
      "Knee & Elbow Protective Sleeves",
      "Breathable Technical Jersey",
    ],
  },
  "Table Tennis": {
    slug: "table-tennis",
    name: "Table Tennis",
    emoji: "🏓",
    tagline: "Loop drive spin revolutions, pendulum service variations & lightning reflexes",
    governingBody: "International Table Tennis Federation (ITTF)",
    governingBodyIndia: "Table Tennis Federation of India (TTFI)",
    olympicStatus: "Summer Olympic Sport since Seoul 1988",
    quickRulesSummary: [
      "Best of 5 or 7 games to 11 points; service alternates every 2 points (or every point in deuce at 10-10).",
      "Service toss must rise at least 16cm vertically from an open, flat palm behind the table end-line.",
      "Ball must bounce once on server's side then once on receiver's side during serve; must clear net cleanly.",
      "No touching the table surface with free hand during live rally.",
    ],
    courtOrFieldSummary: "Table is 2.74m long, 1.525m wide, and 76cm high. Net height is 15.25cm.",
    scoringSummary: "1 point per rally. Must win by 2 clear points to claim game.",
    keyEquipment: [
      "Laminated Wood Blade with Inverted Pimpled Rubbers",
      "40mm+ Plastic Poly Balls (3-Star)",
      "Low-Profile Court Shoes",
    ],
  },
  Boxing: {
    slug: "boxing",
    name: "Boxing",
    emoji: "🥊",
    tagline: "Jab distance management, slip & weave defense, pivot angles & combination punching",
    governingBody: "World Boxing / IBA",
    governingBodyIndia: "Boxing Federation of India (BFI)",
    olympicStatus: "Core Olympic Combat Sport",
    quickRulesSummary: [
      "Olympic boxing consists of three 3-minute rounds (Men & Women) with 1-minute rest intervals.",
      "Punch must land cleanly with the knuckled part of the closed glove on the front or sides of head/body above belt.",
      "Fouls include holding, hitting behind the head (rabbit punch), low blows, hitting with inner glove or elbow.",
      "Five judges score each round on a 10-point must system (10-9 for clear winner, 10-8 with knockdown).",
    ],
    courtOrFieldSummary:
      "Elevated ring 6.1m square inside ropes, canvas floor over high-density foam padding.",
    scoringSummary:
      "10-Point Must scoring by 5 ringside judges, Knockout (KO), Referee Stops Contest (RSC), or Disqualification.",
    keyEquipment: [
      "10oz or 12oz Competition Gloves",
      "Hand Wraps (4.5m)",
      "Custom Fitted Mouthguard",
      "Headgear (Amateur Youth/Women)",
      "Boxing Boots",
    ],
  },
  Swimming: {
    slug: "swimming",
    name: "Swimming",
    emoji: "🏊",
    tagline: "Freestyle catch & pull, streamline hydrodynamics, flip turns & breath regulation",
    governingBody: "World Aquatics",
    governingBodyIndia: "Swimming Federation of India (SFI)",
    olympicStatus: "Core Summer Olympic Foundation Sport",
    quickRulesSummary: [
      "Four competitive strokes: Freestyle, Backstroke, Breaststroke, and Butterfly; Medley combines all four.",
      "Swimmers must touch the wall at every turn and at the finish with specific rules per stroke (e.g. 2-hand touch in Breaststroke & Fly).",
      "Underwater dolphin kicks are limited to 15 meters after starts and turns.",
      "False start on the starting platform results in disqualification.",
    ],
    courtOrFieldSummary:
      "Olympic pool is 50m long, 25m wide, 2-3m deep, with 10 lanes (each 2.5m wide) and water temperature at 25–28°C.",
    scoringSummary:
      "Fastest time from starter horn to wall pad touch recorded via electronic touchpads.",
    keyEquipment: [
      "Silicone Swimming Cap",
      "Low-Profile Hydrodynamic Goggles",
      "FINA-Approved Racing Jammers/Kneeskin",
      "Kickboard & Pull Buoy for Training",
    ],
  },
  Hockey: {
    slug: "hockey",
    name: "Field Hockey",
    emoji: "🏑",
    tagline:
      "Reverse stick slap-shots, aerial reception, penalty corner drag-flicks & zonal pressing",
    governingBody: "International Hockey Federation (FIH)",
    governingBodyIndia: "Hockey India (HI)",
    olympicStatus: "Summer Olympic Sport (India holds 8 historic Olympic Gold Medals)",
    quickRulesSummary: [
      "11 players per team; match played in four 15-minute quarters (60 minutes total).",
      "Players can only use the flat face side of the stick; no rounded back side allowed.",
      "Goals can only be scored from inside the 23-meter striking circle (the 'D').",
      "Penalty Corners awarded for defensive fouls inside the circle or intentional fouls inside 23m.",
    ],
    courtOrFieldSummary:
      "Synthetic watered turf 91.4m long by 55m wide. Goal cage is 3.66m wide by 2.14m high.",
    scoringSummary:
      "1 goal scored when the ball is legally struck inside the D and crosses the goal line.",
    keyEquipment: [
      "Composite Hockey Stick",
      "Dimpled Hard Plastic Ball (156–163g)",
      "Turf Astroturf Shoes",
      "Shin Guards",
      "Face Mask (for Penalty Corner Defence)",
    ],
  },
  Chess: {
    slug: "chess",
    name: "Chess",
    emoji: "♟️",
    tagline: "Opening repertoire preparation, middle-game pawn structures & endgame calculation",
    governingBody: "International Chess Federation (FIDE)",
    governingBodyIndia: "All India Chess Federation (AICF)",
    olympicStatus: "FIDE Chess Olympiad; Recognized by IOC",
    quickRulesSummary: [
      "2 players on an 8x8 checkered board of 64 squares; White moves first.",
      "Ultimate objective is Checkmate: placing opponent king in inescapable attack.",
      "Special rules include Castling (king safety & rook activation) and En Passant pawn capture.",
      "Touch-move rule: If a player touches a piece that has legal moves, they must move that piece.",
      "Draw conditions: Stalemate, 3-fold repetition, 50-move rule without pawn move or capture, insufficient mating material.",
    ],
    courtOrFieldSummary: "64-square board (32 light, 32 dark). Standard square size 50–60mm.",
    scoringSummary: "1 win = 1 point, Draw = 0.5 points, Loss = 0 points.",
    keyEquipment: [
      "Staunton Pattern Chess Set (King height ~95mm)",
      "Digital DGT Chess Clock with Fischer Increment",
      "Scorebook for Notation",
    ],
  },
  Archery: {
    slug: "archery",
    name: "Archery",
    emoji: "🏹",
    tagline: "Recurve & compound anchor mechanics, wind drift correction & mental bullseye focus",
    governingBody: "World Archery Federation (WA)",
    governingBodyIndia: "Archery Association of India (AAI)",
    olympicStatus: "Summer Olympic Sport (Recurve Men & Women Individual / Team / Mixed)",
    quickRulesSummary: [
      "Shooters fire arrows at a 122cm target face set at exactly 70m (Olympic recurve).",
      "Olympic set system: Sets of 3 arrows per archer. 2 set points for win, 1 for tie. First to 6 set points wins match.",
      "Archers have 20 seconds per arrow (or 80s for 4-arrow ends in team events).",
      "Arrow touching target ring dividing line scores higher value.",
    ],
    courtOrFieldSummary:
      "Outdoor shooting range 70m distance (Recurve) or 50m (Compound). Target butt set at 15-degree tilt.",
    scoringSummary:
      "Target has 10 concentric scoring zones (1 to 10 points), plus inner-10 'X' ring used for tie-breaks.",
    keyEquipment: [
      "Recurve / Compound Bow",
      "Carbon Fiber Arrows with Vanes",
      "Finger Tab (Recurve) or Mechanical Release Aid (Compound)",
      "Chest Guard & Arm Guard",
      "Bow Sight & Long Rod Stabilizer System",
      "Quiver",
    ],
  },
  Shooting: {
    slug: "shooting",
    name: "Shooting",
    emoji: "🎯",
    tagline: "Trigger control, respiratory pacing, optical alignment & ballistic precision",
    governingBody: "International Shooting Sport Federation (ISSF)",
    governingBodyIndia: "National Rifle Association of India (NRAI)",
    olympicStatus: "Summer Olympic Sport (Rifle, Pistol & Shotgun Disciplines)",
    quickRulesSummary: [
      "10m Air Rifle and Air Pistol athletes shoot 60 qualification shots in 75 minutes at electronic targets.",
      "Top 8 qualification athletes progress to elimination final rounds.",
      "Finals format: Series of shots followed by cumulative elimination every 2 shots until Gold/Silver duel.",
      "Strict trigger weight specifications (e.g. minimum 500g for air pistol).",
    ],
    courtOrFieldSummary:
      "Enclosed indoor range with Sius Ascor electronic scoring targets. Distances: 10m, 25m, 50m, and outdoor shotgun layout.",
    scoringSummary:
      "Decimal scoring in 10m finals (10.0 to 10.9 per inner ring). Highest cumulative score secures championship.",
    keyEquipment: [
      "PCP Air Rifle (0.177 caliber / 4.5mm) or Air Pistol",
      "Stiff Canvas / Leather Shooting Jacket & Trousers",
      "Flat-soled Shooting Boots",
      "Shooting Glasses with Iris Blinder",
      "Ear Defenders / Sound Attenuating Plugs",
    ],
  },
  Volleyball: {
    slug: "volleyball",
    name: "Volleyball",
    emoji: "🏐",
    tagline:
      "Rotation patterns, spike approaches, libero serve reception & tactical block formations",
    governingBody: "Fédération Internationale de Volleyball (FIVB)",
    governingBodyIndia: "Volleyball Federation of India (VFI)",
    olympicStatus: "Summer Olympic Sport (Indoor & Beach Volleyball)",
    quickRulesSummary: [
      "6 players per team on court; teams rotate clockwise when winning serve from opponent.",
      "Maximum 3 touches per side (excluding block contact) before sending ball over net.",
      "No carrying, catching, or double contacting the ball.",
      "Libero is a defensive specialist who wears contrasting jersey and cannot attack or serve (under standard rules).",
    ],
    courtOrFieldSummary:
      "18m x 9m court divided into 9m x 9m halves. Net height: 2.43m (Men), 2.24m (Women). Attack line 3m from net.",
    scoringSummary:
      "Rally point system. Best of 5 sets. First 4 sets played to 25 points; 5th deciding set to 15 points (must win by 2).",
    keyEquipment: [
      "FIVB Approved Volleyball (65–67cm circumference, 260–280g)",
      "High-grip Indoor Court Shoes",
      "Padded Knee Pads",
      "Net Antennas (80cm height above net)",
    ],
  },
  Gymnastics: {
    slug: "gymnastics",
    name: "Gymnastics",
    emoji: "🤸",
    tagline: "Artistic tumbling, apparatus dismounts, kinetic rotational control & aesthetic form",
    governingBody: "Fédération Internationale de Gymnastique (FIG)",
    governingBodyIndia: "Gymnastics Federation of India (GFI)",
    olympicStatus: "Core Summer Olympic Sport (Artistic, Rhythmic & Trampoline)",
    quickRulesSummary: [
      "Judged on two scores: Difficulty (D-score, open-ended) and Execution (E-score, starts at 10.0 with deductions).",
      "Men compete on 6 apparatus: Floor, Pommel Horse, Still Rings, Vault, Parallel Bars, Horizontal Bar.",
      "Women compete on 4 apparatus: Vault, Uneven Bars, Balance Beam, Floor Exercise.",
      "Deductions applied for steps on landing, bent knees, flexed toes, pauses, or falls off apparatus (1.00 deduction for fall).",
    ],
    courtOrFieldSummary:
      "Spring floor arena (12m x 12m), vault runway (25m), and regulated safety landing mats (20cm thick).",
    scoringSummary:
      "Total Score = D-Score + E-Score - Neutral Deductions (e.g. stepping out of bounds or time violations).",
    keyEquipment: [
      "Gymnastics Leotard & Singlet",
      "Leather Dowel Grips with Wrist Straps",
      "Magnesium Carbonate (Gymnastics Chalk)",
      "Ankle & Wrist Support Straps",
    ],
  },
  Handball: {
    slug: "handball",
    name: "Handball",
    emoji: "🤾",
    tagline:
      "Explosive jump shots, rapid fast-breaks, pivot screening & aggressive 6-0 zone defence",
    governingBody: "International Handball Federation (IHF)",
    governingBodyIndia: "Handball Federation of India (HFI)",
    olympicStatus: "Summer Olympic Sport",
    quickRulesSummary: [
      "7 players per team (6 court players + 1 goalkeeper). 2 halves of 30 minutes each.",
      "Players can hold ball for maximum 3 seconds and take maximum 3 steps without bouncing.",
      "No field player allowed inside the 6-meter goal area (crease); airborne players must release shot before landing.",
      "Passive play warning given if attacking team makes no recognizable attempt to shoot.",
    ],
    courtOrFieldSummary:
      "40m x 20m rectangular indoor court. Goal size 3m wide x 2m high. 6m goal line crease and 9m free throw line.",
    scoringSummary:
      "1 goal awarded when whole ball crosses goal line. Games typically feature 50–70 total goals.",
    keyEquipment: [
      "Handball (Size 3 for Men, Size 2 for Women) with resin glue for grip",
      "Indoor Court Pivot Shoes",
      "Goalkeeper Padded Sweats",
      "Knee & Elbow Protective Guards",
    ],
  },
  Judo: {
    slug: "judo",
    name: "Judo",
    emoji: "🥋",
    tagline:
      "Maximum efficiency with minimum effort: kuzushi off-balancing, throws & ground submission",
    governingBody: "International Judo Federation (IJF)",
    governingBodyIndia: "Judo Federation of India (JFI)",
    olympicStatus: "Summer Olympic Sport (Men & Women 7 weight divisions each + Mixed Team)",
    quickRulesSummary: [
      "Contest duration: 4 minutes of active contest time.",
      "Ippon (instant victory) scored by throwing opponent on back with speed, force, and control, or 20s pin (osaekomi), or armlock / choke surrender.",
      "Waza-ari (half point) scored for throw lacking one element or 10-19s pin. Two Waza-ari equal Ippon (Waza-ari-awasete-ippon).",
      "Penalties (Shido) given for passivity, gripping violations, or stepping outside mat. 3 Shido equals Hansoku-make (disqualification).",
    ],
    courtOrFieldSummary:
      "Tatami mat arena: Contest area 8m x 8m (or 10m x 10m) surrounded by 3m safety border.",
    scoringSummary:
      "Ippon = Immediate victory. If time expires, highest score (Waza-ari) wins. In a tie, Golden Score sudden-death applies.",
    keyEquipment: [
      "IJF Approved Judogi (Cotton Gi in White and Blue)",
      "Obi (Rank/Competition Belt)",
      "Tatami Foam Shock-Absorbing Mats",
    ],
  },
  Karate: {
    slug: "karate",
    name: "Karate",
    emoji: "🥋",
    tagline: "Precision distance control (Ma-ai), explosive strikes (Kime) & Kata synchronicity",
    governingBody: "World Karate Federation (WKF)",
    governingBodyIndia: "Karate India Organisation (KIO)",
    olympicStatus: "Recognized International Martial Art (World Games / Asian Games)",
    quickRulesSummary: [
      "Two competitive disciplines: Kumite (sparring) and Kata (demonstration of solo choreographed forms).",
      "Kumite duration: 3 minutes. Points scored when technique lands on valid target area with good form, attitude, and zanshin (awareness).",
      "Ippon (3 points): Jodan kicks to head or sweeps/throws followed by scoring strike.",
      "Waza-ari (2 points): Chudan kicks to torso. Yuko (1 point): Chudan or Jodan punches.",
      "Senshu (first uncontested score advantage) breaks ties if bout finishes level.",
    ],
    courtOrFieldSummary: "8m x 8m non-slip matted competition tatami with 1m safety perimeter.",
    scoringSummary:
      "Match won by achieving an 8-point lead or highest score at end of regulation time.",
    keyEquipment: [
      "White Karate Gi",
      "Red (Aka) and Blue (Ao) Belts, Gloves & Shin/Foot Guards",
      "Mouthguard (Gumshield)",
      "Body Protector & Female Chest Guard",
    ],
  },
  Taekwondo: {
    slug: "taekwondo",
    name: "Taekwondo",
    emoji: "🥋",
    tagline:
      "The way of the foot and fist: high-speed head kicks, spinning back kicks & electronic PSS scoring",
    governingBody: "World Taekwondo (WT)",
    governingBodyIndia: "India Taekwondo",
    olympicStatus: "Summer Olympic Sport (Kyorugi Sparring 4 weight categories per gender)",
    quickRulesSummary: [
      "Bout consists of best-of-3 rounds (2 minutes per round). Round winner decided independently.",
      "Electronic Protector and Scoring System (PSS) with magnet sensors in socks triggers points on impact threshold.",
      "Points: 1 point for punch, 2 points for body kick, 3 points for head kick, 4 points for turning body kick, 5 points for turning head kick.",
      "Gam-jeom (penalty) awarded for stepping out of boundary, falling, holding, or hitting below waist. 5 Gam-jeom in a round forfeits that round.",
    ],
    courtOrFieldSummary: "8m x 8m octagonal competition mat with 2m surrounding safety margin.",
    scoringSummary:
      "Round won by athlete with more points. Match won by winning 2 out of 3 rounds.",
    keyEquipment: [
      "WT Approved Dobok Uniform",
      "Electronic Sensor Chest Guard (Hogu) & Sensor Headgear",
      "Sensor Foot Socks (Electronic E-socks)",
      "Forearm Guards, Shin Guards & Mouthguard",
    ],
  },
  "Water Sports": {
    slug: "water-sports",
    name: "Water Sports (Canoeing, Kayaking & Rowing)",
    emoji: "🛶",
    tagline:
      "Hydrodynamic hull glide, synchronized stroke cadence, catch efficiency & sprint regattas",
    governingBody: "International Canoe Federation (ICF) & World Rowing (FISA)",
    governingBodyIndia:
      "Indian Kayaking and Canoeing Association (IKCA) & Rowing Federation of India (RFI)",
    olympicStatus: "Summer Olympic Core Disciplines (Canoe Sprint, Canoe Slalom & Rowing)",
    quickRulesSummary: [
      "Sprint racing contested in designated buoyed lanes over 200m, 500m, 1000m, and 2000m (Rowing).",
      "In Kayak (K1, K2, K4), athletes sit forward-facing and paddle with double-bladed paddle.",
      "In Canoe (C1, C2), athletes kneel on one knee and use single-bladed paddle.",
      "In Rowing (Single Scull, Double, Coxless Four, Eight), athletes face backward using sliding seats with oars attached to outriggers.",
      "False start rules strictly enforced; false start triggers restart, second violation causes disqualification.",
    ],
    courtOrFieldSummary:
      "Albano-buoyed 8-lane regatta course, minimum 2000m length and 3m water depth.",
    scoringSummary: "First bow-ball of boat crossing finish line timer photofinish beam wins.",
    keyEquipment: [
      "Carbon Fiber Racing Kayak / Canoe / Rowing Shell",
      "Wing Blade Carbon Paddles / Sculling Oars",
      "ISO Approved Racing Lifejacket / PFD",
      "GPS SpeedCoach / Stroke Rate Sensor",
    ],
  },
  Weightlifting: {
    slug: "weightlifting",
    name: "Weightlifting",
    emoji: "🏋️",
    tagline: "Pure explosive power: Snatch speed under the bar, Clean & Jerk overhead lockouts",
    governingBody: "International Weightlifting Federation (IWF)",
    governingBodyIndia: "Indian Weightlifting Federation (IWLF)",
    olympicStatus: "Core Summer Olympic Sport",
    quickRulesSummary: [
      "Competition contested in two lifts: The Snatch (one continuous movement overhead) and The Clean & Jerk (two phases: to shoulders then overhead).",
      "Athletes have 3 attempts in Snatch followed by 3 attempts in Clean & Jerk.",
      "1 minute clock to start lift after barbell is loaded (2 minutes if taking consecutive attempts).",
      "Referees (3 judges) signal Good Lift (white lights) or No Lift (red lights). 2 out of 3 white lights required.",
      "Disallowed: Press-out (bending and re-extending elbows), touching platform with knees, dropping bar before down signal.",
    ],
    courtOrFieldSummary: "4m x 4m wooden lifting platform raised 10cm above competition floor.",
    scoringSummary:
      "Total Score = Best Snatch + Best Clean & Jerk (measured in kilograms). Tied totals broken by who achieved total first.",
    keyEquipment: [
      "IWF Standard Men's Bar (20kg, 28mm) / Women's Bar (15kg, 25mm)",
      "Calibrated Urethane Bumper Plates & Metal Collars (2.5kg each)",
      "Weightlifting Singlet & Stiff Heel Lifting Shoes",
      "Lifting Belt (max width 12cm)",
      "Wrist Wraps & Knee Sleeves",
    ],
  },
  Wushu: {
    slug: "wushu",
    name: "Wushu",
    emoji: "🥋",
    tagline: "Sanda full-contact kickboxing throws & Taolu acrobatic martial artistry",
    governingBody: "International Wushu Federation (IWUF)",
    governingBodyIndia: "Wushu Association of India (WAI)",
    olympicStatus: "Youth Olympic Games Sport; Asian Games & World Games Feature",
    quickRulesSummary: [
      "Sanda (combat): Full-contact striking (punches, kicks) combined with wrestling takedowns on a raised platform (Lei Tai).",
      "Taolu (forms): Choreographed routines judged on quality of movements, degree of difficulty (Nandu), and overall performance.",
      "In Sanda: Forcing opponent off Lei Tai platform scores 2 points; clean takedown with thrower remaining standing scores 2 points.",
      "Sanda matches are best-of-3 rounds, each round lasting 2 minutes.",
    ],
    courtOrFieldSummary:
      "Sanda: 8m x 8m raised Lei Tai platform (60cm height) surrounded by safety cushions. Taolu: 14m x 8m carpeted spring floor.",
    scoringSummary:
      "Sanda round awarded to fighter winning more points. Taolu scored out of 10.0 points by panel of judges.",
    keyEquipment: [
      "Sanda Boxing Gloves, Headguard & Chest Protector",
      "Shin Guards, Groin Guard & Mouthguard",
      "Taolu Competition Uniform & Traditional Weapons (Daoshu, Jianshu, Qiang, Gun)",
    ],
  },
  Wrestling: {
    slug: "wrestling",
    name: "Wrestling (Freestyle & Greco-Roman)",
    emoji: "🤼",
    tagline: "Takedown leverage, gut wrenches, par terre turns & pinning power",
    governingBody: "United World Wrestling (UWW)",
    governingBodyIndia: "Wrestling Federation of India (WFI)",
    olympicStatus: "Ancient & Modern Summer Olympic Core Sport (Freestyle & Greco-Roman)",
    quickRulesSummary: [
      "Match consists of two 3-minute periods with a 30-second break.",
      "In Freestyle: Wrestlers can use legs for offense and defense. In Greco-Roman: Touching or holding opponent below belt is forbidden.",
      "Fall (Pin): Holding opponent's shoulders flat to mat for instantaneous count results in immediate victory.",
      "Points: Takedown (2-4 pts), Reversal (1 pt), Exposing back past 90 degrees (2 pts), Passivity violation (1 pt).",
      "Technical Superiority: 10-point lead in Freestyle or 8-point lead in Greco-Roman ends match immediately.",
    ],
    courtOrFieldSummary:
      "Circular competition mat of 9m diameter. Central wrestling circle (7m) surrounded by 1m red passivity zone and 1m protection border.",
    scoringSummary:
      "Highest cumulative technical points wins if no fall occurred. Ties broken by highest-value move or last point scored.",
    keyEquipment: [
      "UWW Approved Singlet (Red or Blue)",
      "High-top Wrestling Shoes with concealed laces",
      "Ear Guards / Wrestling Headgear (Optional/Allowed)",
      "Knee Pads",
    ],
  },
  Yoga: {
    slug: "yoga",
    name: "Yoga & Yogasana Sports",
    emoji: "🧘",
    tagline:
      "Biomechanics of stillness, spinal flexibility, balance stability & artistic yogasana flow",
    governingBody: "World Yogasana Sports Federation (WYSF)",
    governingBodyIndia: "National Yogasana Sports Federation (NYSF) & Yogasana Bharat",
    olympicStatus: "Officially Recognized Indian National Sport (Khelo India & National Games)",
    quickRulesSummary: [
      "Competitive disciplines: Traditional Yogasana, Artistic Yogasana (Solo & Pair), Rhythmic Yogasana (Pair & Group).",
      "In Traditional Yogasana: Athletes perform 7 mandatory and optional asanas from specified syllabus categories (forward bend, backward bend, twist, hand balance, leg balance).",
      "Mandatory hold time: Each posture must be held motionless for 15 seconds.",
      "Deductions applied for shaking, foot adjustments during hold, loss of balance, or failing to maintain final posture.",
    ],
    courtOrFieldSummary:
      "Non-slip certified competition yoga mat (minimum 6mm thickness) on raised wooden stage.",
    scoringSummary:
      "Each asana scored for difficulty index and perfection of execution (alignment, breath control, grace, hold stillness) by technical judges.",
    keyEquipment: [
      "Regulation Non-Slip Yogasana Mat",
      "Compression Form-Fitting Yogasana Uniform",
      "Digital Hold Timer Screen",
    ],
  },
  "Table Tennis": {
    slug: "table-tennis",
    name: "Table Tennis",
    emoji: "🏓",
    tagline: "Topspin brush speed, deceptive reverse pendulums, counter-looping & footwork agility",
    governingBody: "International Table Tennis Federation (ITTF)",
    governingBodyIndia: "Table Tennis Federation of India (TTFI)",
    olympicStatus: "Summer Olympic Sport (Men & Women Singles, Teams & Mixed Doubles)",
    quickRulesSummary: [
      "Games played to 11 points (must win by 2). Matches best of 5 or 7 games.",
      "Service: Ball must rest freely on open palm, tossed vertically at least 16cm, and struck as it descends behind endline.",
      "Servers alternate every 2 points (or every point if score reaches 10-10 deuce).",
      "Ball must bounce once on server's side then cross net and bounce on receiver's side during serve.",
      "Touching table with free hand during rally is a fault.",
    ],
    courtOrFieldSummary:
      "Table dimensions: 2.74m length x 1.525m width x 76cm height. Net height: 15.25cm. Court playing area min 14m x 7m.",
    scoringSummary:
      "1 point awarded to opponent on any failed return, ball hit off table, double bounce, or net fault.",
    keyEquipment: [
      "ITTF Approved 40+ Plastic Ball (40mm diameter, 2.7g)",
      "Custom Wooden Blade with Red/Black Pimpled / Inverted Rubber Sheets",
      "High-grip Low-profile Court Shoes",
    ],
  },
  Fencing: {
    slug: "fencing",
    name: "Fencing",
    emoji: "🤺",
    tagline: "Speed of thought: Piste footwork, parry-riposte timing & electronic weapon tip hits",
    governingBody: "Fédération Internationale d'Escrime (FIE)",
    governingBodyIndia: "Fencing Association of India (FAI)",
    olympicStatus: "Core Summer Olympic Sport (Foil, Épée & Sabre)",
    quickRulesSummary: [
      "Three distinct weapons with different target areas and rules:",
      "1. Foil: Torso only. Thrust only. Right-of-way (priority) rules apply.",
      "2. Épée: Entire body (head to toes). Thrust only. No right-of-way (double touches awarded simultaneously).",
      "3. Sabre: Entire body above waist (including arms and mask). Cuts and thrusts score. Right-of-way rules apply.",
      "Bouts contested in 3 periods of 3 minutes up to 15 points (direct elimination) or 5 points in poules.",
    ],
    courtOrFieldSummary: "Conductive metallic mesh Piste (strip): 14m long by 1.5m to 2.0m wide.",
    scoringSummary:
      "Electronic wireless or reel-tethered apparatus registers hits. Green/red light indicates valid touch; white light indicates off-target hit in Foil.",
    keyEquipment: [
      "FIE Homologated 800N Kevlar/Dyneema Fencing Jacket, Breeches & Plastron",
      "1600N Steel Mesh Mask with Electric Bib",
      "Electric Foil, Épée, or Sabre Weapon",
      "Conductive Lame Vest (Foil and Sabre)",
      "Body Cord & Glove",
    ],
  },
  Equestrian: {
    slug: "equestrian",
    name: "Equestrian",
    emoji: "🏇",
    tagline:
      "Horse-athlete harmony: Show jumping stadium clears, dressage test precision & eventing endurance",
    governingBody: "Fédération Équestre Internationale (FEI)",
    governingBodyIndia: "Equestrian Federation of India (EFI)",
    olympicStatus:
      "Summer Olympic Sport (Jumping, Dressage & Eventing - completely gender-neutral)",
    quickRulesSummary: [
      "Jumping: Horse and rider navigate course of 12-16 obstacles up to 1.65m height. Faults given for knockdown (4 faults), refusal/disobedience (4 faults), or exceeding time limit.",
      "Dressage: Horse and rider perform predetermined sequence of artistic movements (piaffe, passage, pirouette, half-pass) scored on 0-10 scale by 5 to 7 judges.",
      "Eventing: Three-day triathlon comprising Dressage, Cross-Country endurance course with solid fences, and Show Jumping.",
      "Fall of horse or rider results in immediate elimination for rider safety.",
    ],
    courtOrFieldSummary:
      "Sand/fiber arena 60m x 20m for Dressage; jumping arena minimum 2,500 sq meters; cross-country course 5,700m length.",
    scoringSummary:
      "In Jumping: Lowest penalties wins; jump-off against clock decides ties. In Dressage: Highest total percentage score wins.",
    keyEquipment: [
      "Show Jumping / Dressage Saddle with Girth & Stirrups",
      "Snaffle / Double Bridle with Bits",
      "Certified Safety Riding Helmet & Protective Body Vest",
      "Tall Riding Boots with Spurs (optional)",
      "Protective Horse Boots / Bandages",
    ],
  },
};

export const LEARNING_RESOURCES: LearningResource[] = [
  // ===================== BOOKS =====================
  {
    id: "book-cricket-art",
    title: "The Art of Cricket",
    sport: "Cricket",
    sportEmoji: "🏏",
    sourceType: "book",
    level: "Intermediate",
    authorOrCreator: "Sir Donald Bradman",
    organizationOrPublisher: "Hodder & Stoughton / Sports Classics",
    estimatedTime: "240 pages (Definitive Masterwork)",
    summary:
      "Regarded as the greatest instructional coaching manual in cricket history. Written with meticulous precision by Don Bradman himself, exploring biomechanics of the grip, backlift, foot positioning, hook shot, cover drive, and bowling spin deception.",
    keyTakeaways: [
      "The 'rotary' backlift versus straight backlift: why Bradman's circular arc generates effortless bat speed.",
      "Weight transfer principles: never commit footwork before reading length from the bowler's hand.",
      "Field placement geometry: how fielders dictate where gaps open up when striking through the line.",
      "Running between wickets as an aggressive psychological weapon against fielding sides.",
    ],
    chapters: [
      {
        page: "Ch 1–4",
        title: "Grip, Stance & The Backlift",
        summary: "Detailed diagrams of the V-grip and weight distribution on balls of feet.",
      },
      {
        page: "Ch 5–9",
        title: "Attacking & Defensive Strokes",
        summary:
          "Forward defence, back-foot punch, off-drive, leg glance, and pull shot mechanics.",
      },
      {
        page: "Ch 10–14",
        title: "Bowling Fundamentals & Spin Craft",
        summary: "Seam positioning, wrist release for leg-spin, flight, and drift dynamics.",
      },
      {
        page: "Ch 15–18",
        title: "Captaincy & Tactical Geometry",
        summary: "Field placings for pace vs spin and managing game tempo in crunch phases.",
      },
    ],
    tags: ["Batting", "Masterclass", "Biomechanics", "History", "Coaching"],
    featured: true,
  },
  {
    id: "book-football-pyramid",
    title: "Inverting the Pyramid: The History of Football Tactics",
    sport: "Football",
    sportEmoji: "⚽",
    sourceType: "book",
    level: "Advanced",
    authorOrCreator: "Jonathan Wilson",
    organizationOrPublisher: "Orion Publishing Group",
    estimatedTime: "464 pages (Tactical Bible)",
    summary:
      "The undisputed classic on the tactical evolution of football — from 1-2-7 in 19th-century Victorian England to the Hungarian Golden Team, Dutch Total Football, Italian Catenaccio, and modern high-pressing 4-3-3 & 3-2-4-1 shapes.",
    keyTakeaways: [
      "How tactical innovations occur as defensive counters to dominant attacking systems.",
      "The role of spatial pressing pioneered by Ernst Happel, Valeriy Lobanovskyi, and Arrigo Sacchi.",
      "Why the modern inverted full-back and false nine evolved to overwhelm central midfield overload zones.",
      "Positional play (Juego de Posición): dividing the pitch into 5 vertical corridors to ensure numerical superiority.",
    ],
    chapters: [
      {
        page: "Ch 1–5",
        title: "Origins: From Chaos to Formations",
        summary:
          "The evolution from Victorian dribbling games to passing combinations and the 2-3-5 Pyramid.",
      },
      {
        page: "Ch 6–10",
        title: "The W-M, Danubian School & Hungary 1953",
        summary:
          "Herbert Chapman's defensive revolution and Nandor Hidegkuti's deep-lying center-forward role.",
      },
      {
        page: "Ch 11–15",
        title: "Total Football & Italian Pragmatism",
        summary:
          "Rinus Michels' interchangeable roles, Cruyff's leadership, and Rocco's libero sweepers.",
      },
      {
        page: "Ch 16–20",
        title: "Modern Pressing & Spatial Overloads",
        summary:
          "Gegenpressing, half-spaces, inverted full-backs, and data analytics in match planning.",
      },
    ],
    tags: ["Tactics", "History", "Formations", "Coaching", "Positional Play"],
    featured: true,
  },
  {
    id: "book-badminton-steps",
    title: "Badminton: Steps to Success (Master Guide)",
    sport: "Badminton",
    sportEmoji: "🏸",
    sourceType: "book",
    level: "Beginner",
    authorOrCreator: "Tony Grice & BWF Master Coaches",
    organizationOrPublisher: "Human Kinetics",
    estimatedTime: "192 pages (Illustrated)",
    summary:
      "A complete progression curriculum for players and academy coaches. Covers grip correction, explosive split-step footwork, overhead clears, drop shots, smashes, deceptive net tumbles, and singles/doubles court positioning.",
    keyTakeaways: [
      "Pronation and supination of the forearm: why power comes from rotational snap rather than arm swing.",
      "Split-step timing: landing precisely as the opponent strikes the shuttlecock to minimize reaction latency.",
      "The 6-point court corner coverage grid: base recovery position in singles vs doubles.",
      "Doubles rotational system: attacking (front-to-back) transitioning smoothly into defensive (side-by-side).",
    ],
    chapters: [
      {
        page: "Step 1–3",
        title: "Grips, Stances & The Split-Step",
        summary: "Forehand, backhand, bevel, and panhandle grips; balance recovery routines.",
      },
      {
        page: "Step 4–6",
        title: "High Clear, Drop Shot & Smash",
        summary: "Kinetic chain overhead strokes with steep downward trajectory training.",
      },
      {
        page: "Step 7–9",
        title: "Net Play, Tumbling Drops & Lifts",
        summary: "Subtle touch at the tape, deception holds, and cross-court hairpin lifts.",
      },
      {
        page: "Step 10–12",
        title: "Singles Strategy & Doubles Rotation",
        summary: "Exploiting backhand corners, building pressure, and front-court interception.",
      },
    ],
    tags: ["Footwork", "Technique", "Drills", "BWF", "Singles & Doubles"],
    featured: true,
  },
  {
    id: "book-tennis-winning-ugly",
    title: "Winning Ugly: Mental Warfare in Tennis",
    sport: "Tennis",
    sportEmoji: "🎾",
    sourceType: "book",
    level: "Intermediate",
    authorOrCreator: "Brad Gilbert & Steve Jamison",
    organizationOrPublisher: "Fireside / Simon & Schuster",
    estimatedTime: "224 pages (Mental Strategy)",
    summary:
      "Written by former World No. 4 and Andre Agassi's coach Brad Gilbert. Teaches club and competitive tennis players how to defeat opponents who possess superior raw strokes through tactical preparation, mental composure, and pattern disruption.",
    keyTakeaways: [
      "Most matches are not won by hitting winners; they are lost by unforced errors under scoreboard pressure.",
      "The 'First 15 Minutes' rule: scout an opponent's backhand depth, footwork habits, and temperament immediately.",
      "Destroying rhythm: using moonballs, slice changes, and body serves against aggressive ball-strikers.",
      "Managing critical points: 30-15 and 15-30 swings, serving first percentage in tiebreaks.",
    ],
    chapters: [
      {
        page: "Part 1",
        title: "Thinking Before You Step on Court",
        summary:
          "Equipment check, pre-match warmup observation, and emotional energy conservation.",
      },
      {
        page: "Part 2",
        title: "Destroying the Opponent's Rhythm",
        summary: "Playing to weaknesses, altering ball height, and changing court pacing.",
      },
      {
        page: "Part 3",
        title: "Clutch Points & Closing Sets",
        summary: "Breaks of serve, protecting leads, and navigating tiebreak psychology.",
      },
    ],
    tags: ["Mental Toughness", "Tactics", "Match Play", "Coaching"],
  },
  {
    id: "book-athletics-science-running",
    title: "The Science of Running: Analyses of Runner's Mechanics & Training",
    sport: "Athletics",
    sportEmoji: "🏃",
    sourceType: "book",
    level: "Advanced",
    authorOrCreator: "Steve Magness",
    organizationOrPublisher: "Origin Press",
    estimatedTime: "368 pages (Biomechanics & Physiology)",
    summary:
      "Comprehensive breakdown of modern running physiology, lactate threshold dynamics, VO2 max optimization, stride cadence biomechanics, and periodization frameworks for track and distance athletes.",
    keyTakeaways: [
      "The myth of arbitrary target cadence: optimal stride frequency depends on velocity and leg length.",
      "Lactate is not a waste product; it is an energetic fuel recycled through oxidative muscle fibers.",
      "High-power neuromuscular sprints (flying 30s) recruit Type IIx motor units without metabolic fatigue.",
      "Peaking and tapering: balancing training volume reduction while maintaining high-intensity stimuli.",
    ],
    chapters: [
      {
        page: "Section 1",
        title: "Biomechanics of the Running Gait",
        summary:
          "Foot strike patterns, hip extension, vertical oscillation, and ground reaction forces.",
      },
      {
        page: "Section 2",
        title: "Cardiorespiratory Physiology & Energy Systems",
        summary: "Aerobic enzymes, mitochondrial density, and lactate buffering capacity.",
      },
      {
        page: "Section 3",
        title: "Training Design & Periodization",
        summary: "Building microcycles, mesocycles, tempo runs, and track interval progressions.",
      },
    ],
    tags: ["Biomechanics", "Physiology", "Endurance", "Sprints", "Periodization"],
  },
  {
    id: "book-relentless-mindset",
    title: "Relentless: From Good to Great to Unstoppable",
    sport: "Basketball",
    sportEmoji: "🏀",
    sourceType: "book",
    level: "Intermediate",
    authorOrCreator: "Tim S. Grover",
    organizationOrPublisher: "Scribner",
    estimatedTime: "256 pages (Athletic Mindset)",
    summary:
      "Tim Grover, legendary trainer to Michael Jordan, Kobe Bryant, and Dwyane Wade, breaks down the relentless mental code required to dominate high-pressure sporting environments.",
    keyTakeaways: [
      "The 'Cleaner' mindset: refusing to seek praise, thriving under adversity, and delivering clutch execution.",
      "Physical conditioning is the prerequisite for mental confidence in the final two minutes.",
      "Eliminating overthinking: training instinct until execution happens without conscious hesitation.",
    ],
    chapters: [
      {
        page: "Ch 1–4",
        title: "When You're a Cleaner...",
        summary: "The three tiers of performers: Coolers, Closers, and Cleaners.",
      },
      {
        page: "Ch 5–8",
        title: "Pushing Beyond Physical Pain",
        summary: "Conditioning regimens that turn fourth quarters into dominant displays.",
      },
      {
        page: "Ch 9–13",
        title: "The Dark Side of Focus",
        summary: "Channelling internal drive and handling championship expectations.",
      },
    ],
    tags: ["Mindset", "Conditioning", "Basketball", "Clutch Performance"],
  },
  {
    id: "book-kabaddi-techniques",
    title: "Kabaddi: Modern Techniques & Tactical Formations",
    sport: "Kabaddi",
    sportEmoji: "🤼",
    sourceType: "book",
    level: "Beginner",
    authorOrCreator: "E. Prasad Rao (Dronacharya Awardee)",
    organizationOrPublisher: "National Institute of Sports (NIS) Patiala",
    estimatedTime: "180 pages (Standard Textbook)",
    summary:
      "The definitive Indian manual on competitive mat Kabaddi by legendary coach E. Prasad Rao. Covers raid hand-touches, lion jumps, dubki escapes, ankle holds, chain tackles, and 3-defender bonus defense formations.",
    keyTakeaways: [
      "The continuous 'Cant' rhythm: breath regulation during high-intensity 30-second raid intervals.",
      "Corner coordination: why the right and left corners dictate defensive trap triggers.",
      "The Dubki mechanism: ducking beneath an oncoming defender's outstretched arm with forward momentum.",
      "Thigh and ankle locks: leverage principles using bodyweight and mat traction.",
    ],
    chapters: [
      {
        page: "Ch 1–3",
        title: "History, Mat Dimensions & Rules",
        summary: "Baulk line, bonus line, out zones, and match timing guidelines.",
      },
      {
        page: "Ch 4–7",
        title: "Offensive Skills (Raiding)",
        summary: "Hand touch, toe touch, side kick, dubki, frog jump, and back kick execution.",
      },
      {
        page: "Ch 8–11",
        title: "Defensive Skills (Catching)",
        summary: "Ankle hold, thigh hold, waist hold, dash, and chain tackle coordination.",
      },
      {
        page: "Ch 12–14",
        title: "Team Strategy & Match Situations",
        summary: "Do-or-Die raid tactics, super tackle scenarios, and bonus line prevention.",
      },
    ],
    tags: ["Kabaddi", "NIS", "Raiding", "Tackling", "Mat Rules"],
    featured: true,
  },

  // ===================== VIDEOS =====================
  {
    id: "video-cricket-cover-drive",
    title: "Batting Masterclass: The Perfect Cover Drive & Head Position",
    sport: "Cricket",
    sportEmoji: "🏏",
    sourceType: "video",
    level: "Beginner",
    authorOrCreator: "NCA Master Coaches / Cricket Academy Online",
    organizationOrPublisher: "BCCI National Cricket Academy Curriculum",
    estimatedTime: "16 min masterclass",
    videoDurationSeconds: 960,
    summary:
      "A step-by-step biomechanical breakdown of the classical cover drive. Demonstrates how head alignment over the front knee prevents aerial edges and transfers maximum power through the off-side field.",
    keyTakeaways: [
      "Initial trigger movement: weight slightly on balls of feet, eyes level with the horizon.",
      "Front foot stride direction: step toward the pitch of the ball, not straight down the wicket.",
      "High front elbow: the steering wheel that ensures the bat face comes down strictly perpendicular.",
      "Follow-through completion: holding pose to maintain spinal posture and balance.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Introduction & Common Flaws",
        summary: "Why reaching with hands without moving feet causes outside edges.",
      },
      {
        timestamp: "03:15",
        title: "Stance & Eye Line Alignment",
        summary: "Ensuring dominant eye remains directly over off-stump.",
      },
      {
        timestamp: "07:30",
        title: "Stride Length & Knee Bend",
        summary: "Preventing over-striding so the head remains over the ball.",
      },
      {
        timestamp: "11:45",
        title: "The High Elbow & Downward Swing",
        summary: "Top hand grip control vs bottom hand snap on impact.",
      },
      {
        timestamp: "14:10",
        title: "Three Progressive Drills",
        summary: "Drop-ball drill, throwdown cone drill, and bowling machine progression.",
      },
    ],
    equipmentRequired: ["Cricket Bat", "3 Cones", "Tennis or Leather Ball", "Batting Gloves"],
    tags: ["Cover Drive", "Batting Drills", "Biomechanics", "Video Clinic"],
    featured: true,
  },
  {
    id: "video-football-rondo",
    title: "The Positional Rondo Masterclass: 4v2 to 7v4 Overloads",
    sport: "Football",
    sportEmoji: "⚽",
    sourceType: "video",
    level: "Intermediate",
    authorOrCreator: "UEFA Pro Coaching Series",
    organizationOrPublisher: "La Masia & European Football Lab",
    estimatedTime: "22 min clinic",
    videoDurationSeconds: 1320,
    summary:
      "How elite academies use rondos to train scanning frequency, open body orientation, disguise passing, and immediate counter-pressing within a 3-second recovery window.",
    keyTakeaways: [
      "Body shape: never face square to the passer; open hips at 45 degrees to see 3 progressive passing options.",
      "Head scanning: taking 3 to 5 micro-scans per 5 seconds before receiving the ball.",
      "Weight of pass: striking the ball into the teammate's back foot to direct their next touch forward.",
      "The 3-second counter-press trigger upon losing possession in the middle zone.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Why Rondos are Football's DNA",
        summary: "Translating small-sided rondos into 11v11 match patterns.",
      },
      {
        timestamp: "04:30",
        title: "The Classic 4v2 Setup & Rules",
        summary: "Grid dimensions 10x10m, 1-touch and 2-touch constraints.",
      },
      {
        timestamp: "09:45",
        title: "Line-Breaking Passes",
        summary: "Splitting the two central pressing defenders with pace.",
      },
      {
        timestamp: "15:20",
        title: "The 7v4 Positional Grid",
        summary: "Adding center-backs, pivot (No. 6), and wingers with transition goals.",
      },
      {
        timestamp: "19:50",
        title: "Coaching Points & Key Metrics",
        summary: "Turnover counts, pass completion streaks, and transition speed.",
      },
    ],
    equipmentRequired: ["8 Cones", "Size 5 Balls", "Bibs (2 Colors)"],
    tags: ["Rondo", "Passing", "Tactics", "Scanning", "Pressing"],
    featured: true,
  },
  {
    id: "video-badminton-deceptive-drop",
    title: "Badminton Trick Shots & Deceptive Net Tumbling Drops",
    sport: "Badminton",
    sportEmoji: "🏸",
    sourceType: "video",
    level: "Intermediate",
    authorOrCreator: "BWF World Tour Analysis",
    organizationOrPublisher: "Badminton Masters Academy",
    estimatedTime: "14 min clinic",
    videoDurationSeconds: 840,
    summary:
      "Learn how World Champions disguise the cross-court slice and slow drop from the exact same preparation as a 400 km/h jump smash.",
    keyTakeaways: [
      "Identical full-body preparation: racket drawn back fully behind head, shoulders turned 90 degrees.",
      "Last-millisecond racket head deceleration or slice angle alteration across the feathers.",
      "Recovering to the 'T' immediately after playing the drop to punish the opponent's defensive lift.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "The Concept of Stroke Disguise",
        summary: "Why identical setup freezes the defender's legs.",
      },
      {
        timestamp: "03:10",
        title: "Forehand Cross-Court Reverse Slice",
        summary: "Brushing the right side of the shuttle feathers.",
      },
      {
        timestamp: "07:20",
        title: "Backhand Net Hold & Flick",
        summary: "Holding racket stationary at net tape before flicking to rear court.",
      },
      {
        timestamp: "11:30",
        title: "Solo & Partner Feed Drills",
        summary: "Multi-shuttle feeding to master consistent feather contact.",
      },
    ],
    equipmentRequired: ["Badminton Racket", "Tube of Feather Shuttles", "Feeder Partner"],
    tags: ["Deception", "Drop Shot", "Net Play", "Smash", "BWF"],
  },
  {
    id: "video-tennis-serve-kinetic-chain",
    title: "Tennis Serve Mechanics: Leg Drive, Pronation & Trophy Pose",
    sport: "Tennis",
    sportEmoji: "🎾",
    sourceType: "video",
    level: "Beginner",
    authorOrCreator: "ATP Tour Biomechanics Clinic",
    organizationOrPublisher: "Global Tennis Performance Center",
    estimatedTime: "20 min masterclass",
    videoDurationSeconds: 1200,
    summary:
      "The serve is the most important shot in tennis. Master the 7 stages of the kinetic chain: platform vs pinpoint stance, toss location at 1 o'clock, knee bend coil, racket drop, upward explosive drive, forearm pronation, and landing balance.",
    keyTakeaways: [
      "Continental grip is mandatory: never use an eastern forehand grip for serving.",
      "The toss: place the ball into the air with straight arm, landing 30cm inside the baseline.",
      "Forearm pronation snaps the racket face through the ball at the highest contact apex.",
      "Landing on the front foot inside the court to initiate forward court momentum.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Grip & The Trophy Pose",
        summary: "Continental grip alignment and coil angle of hips.",
      },
      {
        timestamp: "05:15",
        title: "Toss Placement & Left Arm Discipline",
        summary: "Holding the tossing arm up to maintain shoulder tilt.",
      },
      {
        timestamp: "10:00",
        title: "Racket Drop & Shoulder-over-Shoulder",
        summary: "Letting racket scratch the back for maximal elastic stretch.",
      },
      {
        timestamp: "14:40",
        title: "Pronation & Contact Point",
        summary: "High contact point with internal shoulder rotation.",
      },
      {
        timestamp: "18:00",
        title: "Target Practice Targets",
        summary: "Aiming for T, body, and wide out-wide service cones.",
      },
    ],
    equipmentRequired: ["Tennis Racket", "Tennis Balls", "4 Cones on Service Box"],
    tags: ["Serve", "Pronation", "Kinetic Chain", "Trophy Pose"],
  },
  {
    id: "video-kabaddi-ankle-hold",
    title: "Kabaddi Defense: Perfect Corner Ankle Hold & Chain Coordination",
    sport: "Kabaddi",
    sportEmoji: "🤼",
    sourceType: "video",
    level: "Beginner",
    authorOrCreator: "PKL Pro Coaches Masterclass",
    organizationOrPublisher: "Pro Kabaddi Training Camp",
    estimatedTime: "18 min clinic",
    videoDurationSeconds: 1080,
    summary:
      "A complete guide to executing the match-winning corner ankle hold against swift raiders. Breakdown of timing, grip around Achilles tendon, lifting opponent leg, and the supporting chain tackle rush.",
    keyTakeaways: [
      "Never dive at the ankle while the raider is balanced on both feet; wait for the outstretched leading toe touch.",
      "Clamp fingers tightly behind the ankle bone, pulling the foot upward and toward your chest.",
      "Cover defenders must rush in within 0.8 seconds to secure upper body containment.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Corner Stance & Stride Reading",
        summary: "Low center of gravity and staying on balls of feet.",
      },
      {
        timestamp: "04:15",
        title: "The Attack Moment (Baiting the Raider)",
        summary: "Feigning vulnerability to invite the toe touch.",
      },
      {
        timestamp: "08:50",
        title: "Hand Clamp & Leg Lift Mechanics",
        summary: "Leverage principles to prevent raider from lunging to mid-line.",
      },
      {
        timestamp: "13:20",
        title: "In-Cover & Center Support Rush",
        summary: "Team chain tackle locking techniques.",
      },
    ],
    equipmentRequired: ["Kabaddi Mat / Soft Turf", "Knee Pads"],
    tags: ["Kabaddi", "Ankle Hold", "Defense", "PKL", "Chain Tackle"],
  },
  {
    id: "video-basketball-shooting-form",
    title: "Pure Basketball Shooting Form: BEEF Principles & Arc Dynamics",
    sport: "Basketball",
    sportEmoji: "🏀",
    sourceType: "video",
    level: "Beginner",
    authorOrCreator: "NBA Shooting Coaches Lab",
    organizationOrPublisher: "Pure Sweat Basketball",
    estimatedTime: "15 min clinic",
    videoDurationSeconds: 900,
    summary:
      "Unlock high-percentage jump shooting using the timeless BEEF system: Balance, Eyes, Elbow under the ball, and Follow-through. Includes slow-motion analysis of Steph Curry's 1-motion fluid shot release.",
    keyTakeaways: [
      "1-motion release: energy flows continuously from feet to fingertips without pausing at the top.",
      "Guide hand discipline: thumb flick on non-shooting hand causes errant spin and misses.",
      "Optimal entry arc of 45 to 50 degrees increases the basket's effective surface area by 40%.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "The BEEF Shooting Foundation",
        summary: "Balance, Eyes, Elbow, Follow-through breakdown.",
      },
      {
        timestamp: "03:45",
        title: "Footwork: 1-2 Step vs Hop",
        summary: "Catch-and-shoot preparations under defensive pressure.",
      },
      {
        timestamp: "07:30",
        title: "The Set Point & Release Angle",
        summary: "Elbow tucked directly below wrist; release apex.",
      },
      {
        timestamp: "11:20",
        title: "Form Shooting Progression Drills",
        summary: "1-handed close shots building out to 3-point line.",
      },
    ],
    equipmentRequired: ["Basketball", "Hoop", "Smartphone Camera for Form Review"],
    tags: ["Shooting Form", "BEEF", "Jump Shot", "Basketball Drills"],
  },

  // ===================== TEXT GUIDES & RULEBOOKS =====================
  {
    id: "text-cricket-official-laws",
    title: "MCC Laws of Cricket Explained: Dismissals, Crease Lines & DRS",
    sport: "Cricket",
    sportEmoji: "🏏",
    sourceType: "text",
    level: "Beginner",
    authorOrCreator: "Marylebone Cricket Club (MCC) & ICC Umpires Panel",
    organizationOrPublisher: "Official Laws of Cricket (Code 2017 / 3rd Edition 2022)",
    estimatedTime: "12 min read (Comprehensive Guide)",
    summary:
      "An authoritative yet accessible guide to the 42 Laws of Cricket. Understand tricky rules including Mankad run-outs at non-striker's end, LBW pitching and impact zones, umpire's call in DRS ball-tracking, and dead ball scenarios.",
    keyTakeaways: [
      "Law 36 (LBW): Three criteria must be satisfied — ball must not pitch outside leg stump, impact must be in line with stumps (unless no stroke offered), and ball must be hitting stumps.",
      "Law 38 (Run Out Non-Striker): The bowler is legally permitted to attempt a run-out prior to entering their delivery stride if non-striker backs up excessively.",
      "Law 31 (Timed Out): Incoming batter must be in position to receive the ball within 3 minutes (or 2 minutes in T20I) of dismissal.",
      "Crease measurements: Popping crease is 4 feet in front of bowling crease; return creases extend at right angles.",
    ],
    fullTextContent: `### Foundational Pitch Dimensions & Creases
Cricket is played on a 22-yard (20.12m) pitch framed by bowling, popping, and return creases.
- **Bowling Crease:** The line passing through the centers of the stumps (8 feet 8 inches / 2.64m wide).
- **Popping Crease:** The line 4 feet (1.22m) in front of the bowling crease and parallel to it. To be 'safe' from stumpings and run-outs, a batter must have some part of their bat or body grounded behind this line.
- **Return Creases:** Lines drawn at right angles to the bowling and popping creases, 4 feet 4 inches on either side of the middle stump.

### The 10 Primary Methods of Dismissal
1. **Bowled (Law 32):** The ball hits and dislodges at least one bail from the stumps.
2. **Caught (Law 33):** The ball hits bat or glove holding the bat and is cleanly caught before touching the ground.
3. **Leg Before Wicket / LBW (Law 36):** A delivered ball that does not pitch outside leg stump strikes the batter's pad/body and would have hit the stumps.
4. **Run Out (Law 38):** A fielder breaks the wicket with the ball while the batter is out of their ground.
5. **Stumped (Law 39):** The wicketkeeper breaks the wicket when the batter is out of ground while playing a shot and not attempting a run.
6. **Hit Wicket (Law 35):** Batter dislodges bails with bat, body, or gear during delivery or initial run.
7. **Handled the Ball / Obstructing the Field (Law 37):** Willfully deflecting the ball or obstructing a fielder's throw.
8. **Hit the Ball Twice (Law 34):** Striking the ball a second time unless purely defending stumps without scoring.
9. **Timed Out (Law 40):** Batter fails to arrive on field within the time limit.
10. **Retired Out:** Leaving the field without umpire permission and without injury.

### Decision Review System (DRS) & Umpire's Call
When teams challenge an on-field decision, ultra-edge (snickometer) checks for bat contact first. If reviewing LBW, Hawk-Eye ball tracking plots pitch point, impact point, and trajectory into stumps. If less than 50% of the ball is projected to hit the stump zone, the ruling defaults to 'Umpire's Call', preserving the on-field decision and the reviewing team's challenge.`,
    tags: ["Rules", "MCC Laws", "LBW", "DRS", "Crease Dimensions"],
    featured: true,
  },
  {
    id: "text-football-fifa-laws",
    title: "IFAB Laws of the Game: Offside Rule, VAR & Handball Interpretations",
    sport: "Football",
    sportEmoji: "⚽",
    sourceType: "text",
    level: "Beginner",
    authorOrCreator: "International Football Association Board (IFAB)",
    organizationOrPublisher: "IFAB Official Rulebook",
    estimatedTime: "14 min read",
    summary:
      "Clear, detailed breakdowns of Law 11 (Offside), Law 12 (Fouls and Misconduct), and VAR protocols. Explains the difference between deliberate play vs deflection in offside situations, and the silhouette body enlargement rule for handballs.",
    keyTakeaways: [
      "Offside is assessed at the exact moment the ball is played, not when the attacker receives it.",
      "A player is NOT offside if they are in their own half, or level with the second-to-last opponent, or receive the ball directly from a throw-in, corner, or goal kick.",
      "Handball offenses require deliberate movement or the arm making the player's body unnaturally bigger above the T-shirt sleeve line.",
      "The DOGSO (Denial of an Obvious Goal-Scoring Opportunity) rule in the penalty box: yellow card if genuine attempt for the ball, red card if pulling/pushing.",
    ],
    fullTextContent: `### Law 11: The Complete Offside Rule
A player is in an **offside position** if:
- Any part of their head, body, or feet is in the opponents' half (excluding the halfway line); and
- Any part of their head, body, or feet is nearer to the opponents' goal line than both the ball and the second-last opponent.

*Crucial note:* Hands and arms of all players (including goalkeepers) are NOT considered when judging offside position.

#### When is an offside position penalized?
A player in an offside position at the moment the ball is played or touched by a teammate is only penalized on becoming involved in active play by:
1. **Interfering with play:** playing or touching the ball passed or touched by a teammate.
2. **Interfering with an opponent:** preventing an opponent from playing or being able to play the ball by clearly obstructing their line of vision, or challenging for the ball.
3. **Gaining an advantage:** playing the ball or interfering with an opponent when it has rebounded or deflected off the goalpost, crossbar, or an opponent.

### Law 12: Modern Handball Criteria
It is an offense if a player:
- Deliberately touches the ball with their hand/arm (e.g., moving hand toward ball).
- Touches the ball with their hand/arm when it has made their body **unnaturally bigger**. A player is considered to have made their body unnaturally bigger when the position of their hand/arm is not a consequence of, or justifiable by, the player's body movement for that specific situation.
- Scores in the opponents' goal directly from their hand/arm, even if accidental.`,
    tags: ["FIFA", "IFAB", "Offside", "Handball", "VAR"],
    featured: true,
  },
  {
    id: "text-badminton-court-specs",
    title: "Official BWF Badminton Court Dimensions & Service Line Specifications",
    sport: "Badminton",
    sportEmoji: "🏸",
    sourceType: "diagram",
    level: "Beginner",
    authorOrCreator: "BWF Technical Committee",
    organizationOrPublisher: "Badminton World Federation Facilities Handbook",
    estimatedTime: "8 min read & blueprints",
    summary:
      "Interactive specifications and diagrams for standard BWF badminton courts. Learn all lines: short service line, long service line for doubles, center line, singles side lines, and net height calibrations.",
    keyTakeaways: [
      "Total court length: 13.40 meters (44 feet); Total court width: 6.10 meters (20 feet) for doubles.",
      "Singles court width: 5.18 meters (17 feet) using inside boundary lines.",
      "Short service line is 1.98 meters (6.5 feet) from the net.",
      "Net height must be exactly 1.55 meters at the side posts and 1.524 meters (5 feet) at center.",
    ],
    fieldSpecs: {
      length: "13.40 meters (44 feet)",
      width: "6.10m (Doubles) / 5.18m (Singles)",
      boundaryNote:
        "Lines must be 40mm wide, easily distinguishable (usually white or yellow) on synthetic court mat.",
      keyLines: [
        "Short Service Line: 1.98m from net",
        "Doubles Long Service Line: 0.76m inside back boundary line",
        "Center Line: divides left and right service courts from short service line to back line",
        "Post height: 1.55m placed firmly on doubles side lines",
      ],
    },
    tags: ["Court Dimensions", "BWF Specs", "Lines", "Net Height"],
  },
  {
    id: "text-kabaddi-mat-specs",
    title: "IKF Kabaddi Mat Layout: Baulk Line, Bonus Line & Lobby Rules",
    sport: "Kabaddi",
    sportEmoji: "🤼",
    sourceType: "diagram",
    level: "Beginner",
    authorOrCreator: "Amateur Kabaddi Federation of India (AKFI)",
    organizationOrPublisher: "International Kabaddi Federation Mat Rulebook",
    estimatedTime: "7 min read & diagrams",
    summary:
      "Detailed breakdown of standard EVA synthetic Kabaddi mat dimensions for Men and Women, explaining the crucial purpose of the Baulk line, Bonus line, 1-meter lobbies, and sitting blocks.",
    keyTakeaways: [
      "Men's court dimensions: 13 meters x 10 meters; divided into two equal halves of 6.5m x 10m by the mid-line.",
      "Baulk line is located 3.75 meters from mid-line; raider must cross it with at least one foot over and trailing foot in the air to make the raid valid.",
      "Bonus line is located 4.75 meters from mid-line (1 meter past the baulk line); bonus is awarded when 6 or 7 defenders are on court.",
      "Side lobbies are 1 meter wide on each flank; become active for movement ONLY after a touch has been established.",
    ],
    fieldSpecs: {
      length: "13.0 meters (Men) / 12.0 meters (Women)",
      width: "10.0 meters (Men) / 8.0 meters (Women)",
      boundaryNote: "Surrounded by a 4-meter safety clearance zone on all sides.",
      keyLines: [
        "Mid Line: Divides the two 6.5m halves",
        "Baulk Line: 3.75m from Mid Line",
        "Bonus Line: 4.75m from Mid Line (1.0m past Baulk)",
        "Lobby: 1.0m yellow side corridors active post-touch",
      ],
    },
    tags: ["Kabaddi Mat", "Baulk Line", "Bonus Line", "Lobby Rules", "AKFI"],
  },

  // ===================== PODCASTS / AUDIO =====================
  {
    id: "audio-coaching-pullela-gopichand",
    title: "The Architecture of Olympic Champions: Gopichand on Discipline & Grit",
    sport: "Badminton",
    sportEmoji: "🏸",
    sourceType: "audio",
    level: "Intermediate",
    authorOrCreator: "Pullela Gopichand (Chief National Coach)",
    organizationOrPublisher: "India Sports Excellence Audio Archives",
    estimatedTime: "32 min audio masterclass",
    summary:
      "Dronacharya awardee and national coach Pullela Gopichand discusses the daily training structure that produced Saina Nehwal, PV Sindhu, and Kidambi Srikanth. Insights into 4:15 AM court sessions, multi-shuttle endurance, and managing psychological tournament peaks.",
    keyTakeaways: [
      "Physical conditioning must outstrip match demands by at least 25% to maintain composure in 3rd-set deuces.",
      "Removing smartphone distractions during competitive training blocks.",
      "How to convert unforced errors into immediate tactical adjustments rather than self-chastisement.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "The 4:00 AM Routine & Mental Fortitude",
        summary: "Why early morning court sessions create an irreplaceable psychological edge.",
      },
      {
        timestamp: "11:20",
        title: "Multi-Shuttle Drill Progression",
        summary: "Feeding 40 shuttles in 30 seconds to push VO2 thresholds.",
      },
      {
        timestamp: "22:45",
        title: "Handling Olympic & World Championship Pressure",
        summary: "De-escalating athlete anxiety before final matches.",
      },
    ],
    tags: ["Coaching", "Pullela Gopichand", "Olympic Mindset", "Discipline"],
  },
  {
    id: "audio-tactics-cricket-captaincy",
    title: "Fielding Geometry & Match Tempo: Reading Batting Wagon Wheels",
    sport: "Cricket",
    sportEmoji: "🏏",
    sourceType: "audio",
    level: "Intermediate",
    authorOrCreator: "Elite Indian First-Class Captains Panel",
    organizationOrPublisher: "Cricket Strategy & Tactics Network",
    estimatedTime: "25 min audio",
    summary:
      "In-depth discussion on captaincy strategy: setting ring fields vs boundary catchers, using non-regular bowlers in transitional overs, and manipulating run rate pressure in multi-day and limited overs matches.",
    keyTakeaways: [
      "How an extra cover fielder positioned 5 yards deeper stops 1s while tempting aerial mistakes.",
      "Fielding positions must match bowler strengths rather than generic textbook charts.",
      "Bowler captain dialogue: agreeing on dismissal plans over 6 consecutive balls.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Reading the Pitch on Morning of Day 1",
        summary: "Moisture, crack lines, and early bounce analysis.",
      },
      {
        timestamp: "08:30",
        title: "Death Overs Field Placement in T20s",
        summary: "Protecting the short boundary with sweeper cover and deep square leg.",
      },
      {
        timestamp: "17:15",
        title: "Setting Traps for Set Batters",
        summary: "Starving singles to provoke aggressive shots against spin.",
      },
    ],
    tags: ["Captaincy", "Fielding", "Cricket Strategy", "Audio"],
  },

  // ===================== INTERACTIVE QUIZZES =====================
  {
    id: "quiz-cricket-rules",
    title: "ICC Laws & Match Scenarios: Test Your Umpire Knowledge",
    sport: "Cricket",
    sportEmoji: "🏏",
    sourceType: "quiz",
    level: "Intermediate",
    authorOrCreator: "KhelGrid Umpiring Academy",
    organizationOrPublisher: "ICC Certified Match Officials Program",
    estimatedTime: "5 questions (3 mins)",
    summary:
      "Put your rule knowledge to the test! Can you answer scenarios on non-striker run-outs, LBW ball-tracking, boundary catches with airborne fielders, and dead ball rulings?",
    keyTakeaways: [
      "Instant feedback with official MCC Law references.",
      "Learn nuances that distinguish club cricket from international match decisions.",
    ],
    quiz: [
      {
        question: "When is a non-striker legally run out by the bowler during their approach?",
        options: [
          "Only after warning the batter once verbally",
          "At any time before the bowler enters their delivery stride",
          "Only when the bowler stops completely at the crease",
          "It is never allowed under official MCC laws",
        ],
        correctIndex: 1,
        explanation:
          "Under MCC Law 38.3, the bowler is permitted to attempt a run-out of the non-striker at any point prior to entering their delivery stride if the batter is out of their ground. No prior warning is legally required.",
      },
      {
        question:
          "For an LBW appeal to succeed, where must the ball NOT pitch under any circumstance?",
        options: [
          "Outside off stump",
          "In line with stumps",
          "Outside leg stump",
          "Inside the bowler's half of the pitch",
        ],
        correctIndex: 2,
        explanation:
          "Law 36 states that if the ball pitches outside leg stump, the batter CANNOT be given out LBW, even if the ball would have gone on to hit middle stump.",
      },
      {
        question:
          "A boundary fielder airborne outside the boundary cushion taps the ball back into play. What was their last point of ground contact required to be?",
        options: [
          "Anywhere inside or outside the field",
          "Completely inside the boundary line",
          "Touching the boundary rope",
          "On both feet simultaneously",
        ],
        correctIndex: 1,
        explanation:
          "Under Law 19, an airborne fielder's first contact with the ball is only legal if their last contact with the ground was inside the boundary playing area.",
      },
      {
        question:
          "In T20 internationals, what is the maximum time allowed for an incoming batter to be ready to face the next ball?",
        options: ["90 seconds", "120 seconds (2 minutes)", "180 seconds (3 minutes)", "60 seconds"],
        correctIndex: 1,
        explanation:
          "In T20 International cricket, the incoming batter must be ready to receive the ball within 2 minutes (120 seconds). In Test cricket, the limit is 3 minutes.",
      },
      {
        question:
          "If a delivery strikes a fielding helmet placed on the turf behind the wicketkeeper, how many penalty runs are awarded to the batting side?",
        options: ["1 run", "4 runs", "5 penalty runs", "No penalty runs"],
        correctIndex: 2,
        explanation:
          "Under Law 28.3, if the ball in play touches protective equipment placed on the ground, 5 penalty runs are awarded to the batting side and the ball immediately becomes dead.",
      },
    ],
    tags: ["Quiz", "Cricket Laws", "Umpiring", "Interactive"],
    featured: true,
  },
  {
    id: "quiz-football-rules",
    title: "IFAB Laws of the Game Scenario Challenge: Referee Exam",
    sport: "Football",
    sportEmoji: "⚽",
    sourceType: "quiz",
    level: "Intermediate",
    authorOrCreator: "AIFF / IFAB Referee Development",
    organizationOrPublisher: "Referee Certification Board",
    estimatedTime: "5 questions (3 mins)",
    summary:
      "Scenario-based refereeing test covering offside deflections vs deliberate play, denial of obvious goalscoring opportunities (DOGSO), and penalty kick encroachment.",
    keyTakeaways: [
      "Master the subtle distinction between a deflection and deliberate play in offside situations.",
      "Understand the double jeopardy rule inside the penalty box.",
    ],
    quiz: [
      {
        question:
          "An attacker in an offside position receives the ball directly from an opponent who intentionally played the ball. Is the attacker penalized for offside?",
        options: [
          "Yes, always offside",
          "No, because the opponent deliberately played the ball",
          "Yes, unless the opponent scored an own goal",
          "It depends on the referee's discretion",
        ],
        correctIndex: 1,
        explanation:
          "Under IFAB Law 11, a player in an offside position receiving the ball from an opponent who deliberately plays the ball is NOT considered to have gained an advantage, unless it was a deliberate save.",
      },
      {
        question: "Can a player score a valid goal directly from a throw-in?",
        options: [
          "Yes, if it crosses the goal line cleanly",
          "No; if it goes into the opponent's goal, a goal kick is awarded",
          "Yes, in amateur football only",
          "No; it results in a penalty kick",
        ],
        correctIndex: 1,
        explanation:
          "Under Law 15, a goal cannot be scored directly from a throw-in. If the ball enters the opponent's goal without touching any other player, a goal kick is awarded to the defending team.",
      },
      {
        question:
          "Inside the penalty area, a defender accidentally trips an attacker while genuinely attempting to challenge for the ball, stopping an obvious goal. What is the sanction?",
        options: [
          "Penalty kick and Red Card (DOGSO)",
          "Penalty kick and Yellow Card (Double Jeopardy prevention)",
          "Direct free kick only",
          "Indirect free kick and Yellow Card",
        ],
        correctIndex: 1,
        explanation:
          "To avoid 'triple punishment' (penalty, red card, suspension), when a foul inside the box denies an obvious goal opportunity but is a genuine attempt to play the ball, the sanction is downgraded to a Yellow Card + Penalty.",
      },
      {
        question:
          "Can a goalkeeper handle the ball inside their own penalty box if passed back by a teammate using their foot?",
        options: [
          "Yes, whenever they choose",
          "No; handling a deliberate kick back from a teammate results in an indirect free kick",
          "Yes, if passed from outside the half-way line",
          "No; it results in a penalty kick",
        ],
        correctIndex: 1,
        explanation:
          "Under the back-pass rule (Law 12), a goalkeeper cannot touch the ball with their hands if it was deliberately kicked to them by a teammate. An indirect free kick is awarded.",
      },
      {
        question:
          "How many players must a team have at minimum to start or continue a competitive 11-a-side match?",
        options: ["9 players", "8 players", "7 players", "6 players"],
        correctIndex: 2,
        explanation:
          "Under Law 3, a match may not start or continue if either team has fewer than 7 players (including the goalkeeper).",
      },
    ],
    tags: ["Football Quiz", "IFAB", "Referee Exam", "Interactive"],
    featured: true,
  },
  {
    id: "quiz-badminton-rules",
    title: "BWF Rally Point & Service Rule Quiz: Test Your Court IQ",
    sport: "Badminton",
    sportEmoji: "🏸",
    sourceType: "quiz",
    level: "Beginner",
    authorOrCreator: "BWF Umpire Certification Hub",
    organizationOrPublisher: "Badminton World Federation",
    estimatedTime: "4 questions (2 mins)",
    summary:
      "Sharpen your understanding of rally scoring, the fixed height service rule (1.15m), receiver readiness, and service court rotation in doubles.",
    keyTakeaways: [
      "Understand where to stand for service based on score parity (even vs odd).",
      "Learn what constitutes a legal service height under contemporary BWF standards.",
    ],
    quiz: [
      {
        question:
          "When the server's score is an EVEN number (0, 2, 4, 6...), from which service court must they serve?",
        options: [
          "Right-hand service court",
          "Left-hand service court",
          "Whichever court they choose",
          "Center of the court",
        ],
        correctIndex: 0,
        explanation:
          "In both singles and doubles, the server serves from the right-hand service court when their score is even (or 0), and from the left-hand service court when their score is odd.",
      },
      {
        question:
          "Under the modern BWF fixed-height service rule, the entire shuttlecock must be below what height at the instant of being hit?",
        options: [
          "Waist height of the server",
          "1.15 meters from the court surface",
          "1.00 meters from the court surface",
          "The top of the net tape",
        ],
        correctIndex: 1,
        explanation:
          "BWF Law 9.1.5 mandates that the whole shuttlecock shall be below 1.15 meters from the surface of the court at the instant of being hit by the server's racket.",
      },
      {
        question: "If a badminton game reaches 29-all, what score wins the game?",
        options: [
          "Must lead by 2 points (e.g. 31-29)",
          "The side scoring the 30th point wins (30-29)",
          "A tiebreaker shootout is played",
          "A coin toss determines the winner",
        ],
        correctIndex: 1,
        explanation:
          "Under BWF rules, if the score reaches 29-all, the side scoring the 30th point wins that game (capped strictly at 30 points).",
      },
      {
        question:
          "During a doubles rally, the shuttlecock touches one player's racket and then their partner's racket before going over the net. What is the call?",
        options: [
          "Legal play if in one motion",
          "Fault: double hit by partners",
          "Let: point is replayed",
          "Only allowed if returning a smash",
        ],
        correctIndex: 1,
        explanation:
          "Under Law 13.3.8, it is a Fault if the shuttlecock is hit by a player and their partner successively during a rally.",
      },
    ],
    tags: ["Badminton Quiz", "BWF Rules", "Service Height", "Doubles Rotation"],
  },
  // ===================== NEW NOTIFICATION SPORTS RESOURCES =====================
  {
    id: "book-archery-total",
    title: "Total Archery: Inside the Archer",
    sport: "Archery",
    sportEmoji: "🏹",
    sourceType: "book",
    level: "Advanced",
    authorOrCreator: "Coach Kisik Lee & Tyler Benner",
    organizationOrPublisher: "World Archery / Astra Archery",
    estimatedTime: "280 pages (Biomechanics Bible)",
    summary:
      "The definitive manual on the KSL Shot Cycle, developed by legendary Olympic coach Kisik Lee. Breaks down the 12 steps of the shot cycle: stance, setup, draw, anchor, transfer, expansion, release, and follow-through using angular biomechanics and angular acceleration.",
    keyTakeaways: [
      "Linear vs Angular movement: Using rotational back tension rather than linear pulling muscles.",
      "Anchor point consistency: Bone-on-bone contact at the jawline and string alignment with chin/nose.",
      "Transfer and expansion: Shifting holding force completely onto scapular rhomboid muscles.",
      "Wind drift adaptation: Reading flag angles and micro-adjusting sight windage pins during gusts.",
    ],
    chapters: [
      {
        page: "Step 1–4",
        title: "Stance, Grip & Nocking",
        summary: "Biomechanical base, open stance stability, and pressure point in bow grip.",
      },
      {
        page: "Step 5–8",
        title: "Setup, Draw & Anchor",
        summary: "Maintaining relaxed forearm and establishing absolute anchor repeatability.",
      },
      {
        page: "Step 9–12",
        title: "Expansion, Release & Follow-through",
        summary: "Dynamic release without finger pluck and maintaining line of sight through shot.",
      },
    ],
    tags: ["Archery", "KSL Shot Cycle", "Recurve", "Olympic", "Biomechanics"],
    featured: true,
  },
  {
    id: "text-shooting-issf-handbook",
    title: "ISSF Official 10m Air Rifle & Pistol Regulations & Precision Shooting Manual",
    sport: "Shooting",
    sportEmoji: "🎯",
    sourceType: "text",
    level: "Intermediate",
    authorOrCreator: "ISSF Technical Committee & NRAI",
    organizationOrPublisher: "International Shooting Sport Federation",
    estimatedTime: "22 min read (Complete Guidelines)",
    summary:
      "Comprehensive regulatory and technical breakdown of 10m Air Rifle and Air Pistol competition shooting. Covers zeroing, natural point of aim (NPA), sight alignment vs sight picture, diaphragm breath staging, trigger sear release, and electronic target calibration.",
    keyTakeaways: [
      "Natural Point of Aim: Aligning body posture so sights settle on the target center without muscular tension.",
      "Trigger release dynamics: Steady, subconscious squeeze directly parallel to barrel axis to avoid muzzle cant.",
      "Follow-through: Maintaining sight alignment and mental focus for 1.5 seconds post pellet exit.",
      "Breathing cycle: Firing during respiratory pause between inhalation and exhalation.",
    ],
    fullTextContent: `### Foundational Stance & Natural Point of Aim
In precision target shooting, muscular effort generates tremors. The skeletal frame must support the rifle or pistol.

#### The 5 Pillars of the 10m Shot:
1. **Stance**: Feet shoulder-width apart, weight balanced 50/50 across ball and heel.
2. **Breathing**: Inhale deeply, exhale halfway into the comfortable natural respiratory pause (holding for 4–6 seconds maximum).
3. **Sight Picture**: Focus razor-sharp on the front aperture / front blade; target is intentionally allowed to appear slightly blurred.
4. **Trigger Squeeze**: Progressive, uniform pressure on the trigger shoe without jerking or anticipating recoil.
5. **Follow-Through**: Retain position, cheek weld, and eye focus for 1 full second after shot acoustic signature.`,
    tags: ["Shooting", "ISSF", "10m Air Rifle", "Air Pistol", "NRAI"],
    featured: true,
  },
  {
    id: "video-weightlifting-snatch-mechanics",
    title: "Olympic Weightlifting: Snatch & Clean & Jerk Technical Masterclass",
    sport: "Weightlifting",
    sportEmoji: "🏋️",
    sourceType: "video",
    level: "Advanced",
    authorOrCreator: "SAI NCOE & IWLF Elite Coaching Panel",
    organizationOrPublisher: "Indian Weightlifting Federation (IWLF)",
    estimatedTime: "24 min watch",
    videoDurationSeconds: 1440,
    summary:
      "Frame-by-frame biomechanical film breakdown of the Olympic Snatch and Clean & Jerk. Explores the 1st pull off the platform, knee transition (double knee bend), triple extension of ankles-knees-hips, turnover velocity, and squat catch recovery.",
    keyTakeaways: [
      "First pull speed discipline: Do not rip bar off floor; accelerate progressively to maintain upright spine angle.",
      "Barbell proximity: Keep bar within millimeters of shins and thighs to maximize vertical kinetic transfer.",
      "Triple extension: Simultaneous violent extension of ankles, knees, and hips creates weightless barbell window.",
      "Split jerk footwork: Front foot lands flat pointing slightly inward; back foot lands on ball with knee bent.",
    ],
    chapters: [
      {
        timestamp: "00:00",
        title: "Snatch Setup & Grip Width",
        summary: "Hook grip security and hip-crease measurement for optimal bar height.",
      },
      {
        timestamp: "06:15",
        title: "The Double Knee Bend Transition",
        summary: "Re-bending knees under the bar at mid-thigh to harness the stretch reflex.",
      },
      {
        timestamp: "14:20",
        title: "The Clean: Catch & Front Squat Recovery",
        summary: "High elbow rack position, core bracing, and driving out of the deep squat.",
      },
      {
        timestamp: "19:40",
        title: "Split Jerk Overhead Lockout",
        summary: "Head through the window, active shoulders, and recovering front foot first.",
      },
    ],
    tags: ["Weightlifting", "Snatch", "Clean & Jerk", "IWLF", "SAI NCOE"],
    featured: true,
  },
  {
    id: "book-wrestling-takedown-leverage",
    title: "Championship Freestyle Wrestling: Takedowns, Par Terre & Mat Strategy",
    sport: "Wrestling",
    sportEmoji: "🤼",
    sourceType: "book",
    level: "Intermediate",
    authorOrCreator: "WFI Technical Commission & SAI Patiala",
    organizationOrPublisher: "Wrestling Federation of India & Sports Authority of India",
    estimatedTime: "220 pages (Illustrated Mat Manual)",
    summary:
      "A comprehensive technical blueprint on Olympic freestyle wrestling. Covers penetration steps, head-inside single leg, double leg drive, high crotch finishes, duck-unders, ankle picks, gut-wrench rotations in par terre, and defense against lace locks.",
    keyTakeaways: [
      "Level changes before penetration: Drop your hips before shooting rather than bending at the waist.",
      "Head position as a steering wheel: Where your forehead drives against the opponent's temple dictates takedown control.",
      "Par terre defense: Keep hips heavy to the mat, elbows tight to ribs, and never give space under chest.",
      "Tactical pacing across 2x3 minute periods: Pushing pace to force 30-second shot-clock passivity warnings.",
    ],
    chapters: [
      {
        page: "Ch 1–3",
        title: "Stance, Hand-Fighting & Tie-Ups",
        summary: "Underhook, collar tie, and 2-on-1 Russian tie control.",
      },
      {
        page: "Ch 4–7",
        title: "Primary Leg Attacks",
        summary: "Double leg, sweep single, and high-crotch with corner turn finishes.",
      },
      {
        page: "Ch 8–10",
        title: "Throws & Upper Body Attacks",
        summary: "Fireman's carry, lateral drop, and arm throw mechanics.",
      },
      {
        page: "Ch 11–14",
        title: "Par Terre Scoring & Pinning",
        summary: "Gut wrench torque, leg lace entrapment, and cradle holds.",
      },
    ],
    tags: ["Wrestling", "Freestyle", "Takedowns", "WFI", "Akharas", "SAI"],
    featured: true,
  },
  {
    id: "text-gymnastics-fig-code",
    title: "FIG Code of Points & Artistic Gymnastics Movement Foundations",
    sport: "Gymnastics",
    sportEmoji: "🤸",
    sourceType: "text",
    level: "Coach & Referee",
    authorOrCreator: "Gymnastics Federation of India & FIG",
    organizationOrPublisher: "Fédération Internationale de Gymnastique",
    estimatedTime: "18 min read (Technical Rules)",
    summary:
      "Complete operational breakdown of the FIG Code of Points for Artistic Gymnastics. Explains D-score calculation (Difficulty value of 8 highest elements + Connection Value + Composition Requirements) and E-score deduction scales for posture, dynamics, amplitude, and landings.",
    keyTakeaways: [
      "Difficulty element values: Scaled alphabetically from A (0.1) to J (1.0).",
      "Landing deductions: Small step (0.10), large step > 1 meter (0.30), fall to knees or hands (1.00).",
      "Composition requirements: Each apparatus routine must satisfy 4 specific elemental groups (0.50 each).",
      "Neutral deductions: Stepping outside boundary line (0.10 one foot, 0.30 two feet), coach spotting touch (0.50).",
    ],
    tags: ["Gymnastics", "FIG", "Code of Points", "Artistic Gymnastics", "GFI"],
  },
  {
    id: "quiz-volleyball-rules-iq",
    title: "FIVB Volleyball Rules & Court IQ Certification Quiz",
    sport: "Volleyball",
    sportEmoji: "🏐",
    sourceType: "quiz",
    level: "Intermediate",
    authorOrCreator: "VFI Referee Board",
    organizationOrPublisher: "Volleyball Federation of India & FIVB",
    estimatedTime: "8 min quiz",
    summary:
      "Challenge your understanding of modern volleyball rules: Libero restrictions, rotational overlap faults, net touch infractions, back-row attack regulations, and antenna boundary calls.",
    keyTakeaways: [
      "Understand when a block contact counts towards the team's 3 allowable touches (it does not count).",
      "Clarify the exact rule for net contact (only contact during action of playing ball or interfering with play is a fault).",
      "Master back-row attack regulations regarding the 3-meter line.",
    ],
    quiz: [
      {
        question:
          "Can a player in the back row jump from behind the 3-meter attack line and spike the ball above the height of the net into the opponent's court?",
        options: [
          "No, back-row players can never attack above net height",
          "Yes, provided their take-off foot did not touch or cross the 3-meter line",
          "Only if the Libero set the ball with bump pass",
          "Only during set 5 tiebreaker",
        ],
        correctIndex: 1,
        explanation:
          "Under FIVB Rule 13.2.2, a back-row player may complete an attack hit at any height from behind the front zone, as long as their feet do not touch or cross the attack line at take-off.",
      },
      {
        question:
          "During a block attempt, a blocker touches the ball at the top of the net. Does this touch count as the first of the team's three allowable hits?",
        options: [
          "Yes, all contacts count as team hits",
          "No, a block contact is not counted as a team hit",
          "Only if two blockers touch it simultaneously",
          "It counts as half a touch",
        ],
        correctIndex: 1,
        explanation:
          "Under FIVB Rule 14.4.1, a block contact is NOT counted as a team hit. Consequently, after a block, the team still has three hits to return the ball.",
      },
      {
        question:
          "Can the designated Libero serve the ball under standard international FIVB rules?",
        options: [
          "Yes, in any rotation position",
          "No, under FIVB standard rules, the Libero is not allowed to serve",
          "Only once per set",
          "Only if the captain is substituted",
        ],
        correctIndex: 1,
        explanation:
          "Under standard international FIVB rules (Rule 19.3.1.1), the Libero is restricted to perform as a back-row player and is not allowed to complete an attack hit from anywhere or to serve.",
      },
    ],
    tags: ["Volleyball Quiz", "FIVB Rules", "Libero", "Rotation", "VFI"],
  },
  {
    id: "text-yoga-yogasana-competition-syllabus",
    title: "Yogasana Bharat: Official National Sports Syllabus & Scoring Guidelines",
    sport: "Yoga",
    sportEmoji: "🧘",
    sourceType: "text",
    level: "Intermediate",
    authorOrCreator: "National Yogasana Sports Federation (NYSF)",
    organizationOrPublisher: "Yogasana Bharat & Ministry of Youth Affairs & Sports",
    estimatedTime: "15 min read",
    summary:
      "The official technical competition rulebook for competitive Yogasana in India. Codifies the 5 categories of competitive postures: Forward Bending (Paschimottanasana), Backward Bending (Chakrasana), Twisting (Ardha Matsyendrasana), Hand Balance (Bakasana / Mayurasana), and Leg Balance (Natarajasana) with strict 15-second holding criteria.",
    keyTakeaways: [
      "The 15-second mandatory static hold rule: Timing begins once the posture is fully expressed.",
      "Base of stability: Zero micro-twitches or foot readjustments during the timed hold.",
      "Grading scale: Base Difficulty (A, B, C, D tiers) multiplied by Execution accuracy (alignment, breathing, grace).",
      "Artistic Pair and Rhythmic Yogasana synchronicity protocols set to soothing instrumental classical compositions.",
    ],
    tags: ["Yoga", "Yogasana", "NYSF", "Khelo India", "Yogasana Bharat"],
    featured: true,
  },
  {
    id: "book-judo-kodokan-foundations",
    title: "Kodokan Judo: The Definitive Guide by Jigoro Kano",
    sport: "Judo",
    sportEmoji: "🥋",
    sourceType: "book",
    level: "Beginner",
    authorOrCreator: "Jigoro Kano (Founder of Judo)",
    organizationOrPublisher: "Kodokan Judo Institute / Kodansha",
    estimatedTime: "264 pages (Foundational Classic)",
    summary:
      "The foundational text written by the founder of Judo, Jigoro Kano. Outlines the philosophies of Seiryoku Zenyo (maximum efficiency) and Jita Kyoei (mutual welfare). Details the Gokyo no Waza (40 throws of the Kodokan), foot sweeps, hip throws, shoulder throws, ground holds (Osaekomi-waza), and joint locks (Kansetsu-waza).",
    keyTakeaways: [
      "Kuzushi (off-balancing): A throw succeeds not by muscle strength, but by directing the opponent's momentum.",
      "Tsukuri (fitting in) & Kake (execution): Entering the throw seamlessly as the opponent loses equilibrium.",
      "Ukemi (breakfalling): The non-negotiable prerequisite to prevent injury during dynamic throws.",
      "Transition from Tachi-waza (standing) to Ne-waza (groundwork): Capitalizing on failed throws to secure pins.",
    ],
    tags: ["Judo", "Kodokan", "Martial Arts", "JFI", "Throws", "Olympic"],
  },
  {
    id: "video-taekwondo-olympic-kicks",
    title: "World Taekwondo Olympic Sparring: High-Speed Kicks & Electronic PSS Mastery",
    sport: "Taekwondo",
    sportEmoji: "🥋",
    sourceType: "video",
    level: "Advanced",
    authorOrCreator: "India Taekwondo Technical Staff & World Taekwondo",
    organizationOrPublisher: "India Taekwondo",
    estimatedTime: "20 min watch",
    videoDurationSeconds: 1200,
    summary:
      "High-speed video analysis of modern electronic scoring sparring (Kyorugi). Demonstrates the front-leg cut kick, back kick counter (Dwi Chagi), tornado turning kick (Dollyo Chagi), spinning hook kick to the head (Huryeo Chagi), and footwork clashing strategies inside the 8-meter octagon.",
    keyTakeaways: [
      "Electronic sock contact angle: Hitting with the instep and heel sensors directly on the hogu magnet zones.",
      "Front leg fencing: Controlling distance with the cut kick while concealing intentions.",
      "Counter timing: Firing the turning back kick when the opponent initiates their forward push.",
      "Avoiding Gam-jeom: Staying within the boundary lines while under relentless offensive pressure.",
    ],
    tags: ["Taekwondo", "Kyorugi", "World Taekwondo", "Olympic", "Martial Arts"],
  },
  {
    id: "text-water-sports-kayak-rowing-guide",
    title: "Sprint Kayaking & Olympic Rowing: Hydrodynamics, Stroke Rates & 2000m Race Strategy",
    sport: "Water Sports",
    sportEmoji: "🛶",
    sourceType: "text",
    level: "Intermediate",
    authorOrCreator: "IKCA & Rowing Federation of India",
    organizationOrPublisher: "Indian Kayaking & Canoeing Association / RFI",
    estimatedTime: "16 min read",
    summary:
      "Technical manual covering sprint kayak paddle biomechanics and Olympic rowing stroke phases: The Catch, The Drive, The Finish, and The Recovery. Outlines energy system distribution across 200m, 500m, 1000m, and 2000m championship races.",
    keyTakeaways: [
      "The Catch in Rowing: Squaring the blade in air and placing it smoothly into water before driving with the legs.",
      "Leg drive power: In rowing, 65% of power comes from the leg drive, 25% from hip swing, 10% from arm pull.",
      "Wing paddle mechanics in Kayaking: Slicing the paddle outward away from the boat hull to generate lift like an airplane wing.",
      "Pacing strategy: High cadence start (42–46 strokes/min), settling into cruising rhythm (34–36 strokes/min), and final 250m sprint surge.",
    ],
    tags: ["Water Sports", "Kayaking", "Rowing", "IKCA", "RFI", "Regatta"],
  },
];
