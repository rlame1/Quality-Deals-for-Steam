// Curated metadata for popular Steam games to guarantee 100% accurate Finnish genres and Online Co-op flags
export interface KnownGameMeta {
  genres: string[];
  isCoop: boolean;
  shortDesc?: string;
  shortDescEn?: string;
  releaseYear?: number;
}

export const KNOWN_GAMES: Record<string, KnownGameMeta> = {
  // Classic & Co-op hits
  "550": { genres: ["Toiminta", "Ammunta", "Kauhu"], isCoop: true, shortDesc: "Klassinen 4 pelaajan zombiselviytymispeli yhteistyö- ja PvP-tiloilla.", shortDescEn: "Classic 4-player co-op zombie survival FPS with versus multiplayer modes." }, // Left 4 Dead 2
  "620": { genres: ["Pulmapelit", "Seikkailu", "Toiminta"], isCoop: true, shortDesc: "Nerokas fysiikkapohjainen pulmapeli erillisellä kahden pelaajan yhteistyökampanjalla.", shortDescEn: "Ingenious physics-based puzzle adventure with a dedicated 2-player co-op campaign." }, // Portal 2
  "105600": { genres: ["Toiminta", "Seikkailu", "Roolipelit", "Hiekkalaatikko"], isCoop: true, shortDesc: "2D-hiekkalaatikkoseikkailu, jossa kaivetaan, taistellaan ja rakennetaan yhdessä.", shortDescEn: "2D sandbox adventure game where you dig, fight, explore, and build together." }, // Terraria
  "413150": { genres: ["Roolipelit", "Simulaatio", "Indie"], isCoop: true, shortDesc: "Rentouttava maanviljely- ja elämäsimulaattori jopa neljälle pelaajalle verkossa.", shortDescEn: "Relaxing farming and country-life simulator for up to 4 players online." }, // Stardew Valley
  "548430": { genres: ["Toiminta", "Ammunta", "Avaruus"], isCoop: true, shortDesc: "1-4 hengen kaivos- ja räiskintäseikkailu proseduraalisesti generoiduissa luolastoissa.", shortDescEn: "1-4 player co-op mining and shooter adventure in procedurally generated caves." }, // Deep Rock Galactic
  "219990": { genres: ["Roolipelit", "Toiminta", "Hack and Slash"], isCoop: true, shortDesc: "Synkkä apokalyptinen toimintaroolipeli monipuolisella hahmonkehityksellä ja verkkoyhteistyöllä.", shortDescEn: "Dark apocalyptic action RPG featuring complex character development and online co-op." }, // Grim Dawn
  "289070": { genres: ["Strategia", "Vuoropohjainen"], isCoop: true, shortDesc: "Vuoropohjainen sivilisaationrakennusstrategia moninpelitilalla.", shortDescEn: "Turn-based civilization builder 4X strategy with multiplayer support." }, // Civ VI
  "3900": { genres: ["Strategia", "Vuoropohjainen"], isCoop: true, shortDesc: "Legendaarinen vuoropohjainen strategiaklassikko.", shortDescEn: "Legendary turn-based strategy classic." }, // Civ IV
  "435150": { genres: ["Roolipelit", "Strategia", "Vuoropohjainen"], isCoop: true, shortDesc: "Kriitikoiden ylistämä vuoropohjainen taktinen roolipeli syvällä co-op-tuella.", shortDescEn: "Critically acclaimed tactical turn-based RPG with deep 4-player co-op." }, // Divinity Original Sin 2
  "1086940": { genres: ["Roolipelit", "Strategia", "Seikkailu"], isCoop: true, shortDesc: "Vuoden peli D&D-universumissa uskomattomalla vapaudella ja 4 pelaajan yhteistyöllä.", shortDescEn: "Game of the Year set in the D&D universe with unmatched freedom and 4-player co-op." }, // Baldur's Gate 3
  "252490": { genres: ["Toiminta", "Selviytyminen", "Hiekkalaatikko"], isCoop: true, shortDesc: "Armoton moninpeliselviytyminen avoimessa maailmassa.", shortDescEn: "Ruthless multiplayer open-world survival game." }, // Rust
  "322330": { genres: ["Selviytyminen", "Seikkailu", "Indie"], isCoop: true, shortDesc: "Vedenalainen selviytymisseikkailu vieraalla valtameriplaneetalla.", shortDescEn: "Underwater survival exploration on an alien ocean planet." }, // Subnautica
  "892970": { genres: ["Toiminta", "Roolipelit", "Selviytyminen"], isCoop: true, shortDesc: "Viikinkiteemainen proceduraalinen selviytymisseikkailu 1-10 pelaajalle.", shortDescEn: "Viking-themed procedural survival adventure for 1-10 players." }, // Valheim
  "632360": { genres: ["Toiminta", "Roolipelit", "Roguelike"], isCoop: true, shortDesc: "Nopeatempoinen 3D-roguelike jopa 4 pelaajan verkkomonipelillä.", shortDescEn: "Fast-paced 3D action roguelike with up to 4-player online multiplayer." }, // Risk of Rain 2
  "322170": { genres: ["Toiminta", "Kauhu", "Seikkailu"], isCoop: true, shortDesc: "Ensimmäisen persoonan parkour-zombitoiminta 4 hengen yhteistyöllä.", shortDescEn: "First-person parkour zombie action with 4-player co-op campaign." }, // Dying Light
  "582010": { genres: ["Toiminta", "Roolipelit"], isCoop: true, shortDesc: "Eeppisiä hirviöjahteja jättiläisolentoja vastaan yksin tai ryhmässä.", shortDescEn: "Epic monster hunts against colossal beasts solo or in a 4-player hunting party." }, // Monster Hunter: World
  "552520": { genres: ["Toiminta", "Roolipelit", "Miekka"], isCoop: true, shortDesc: "4 hengen hack-and-slash Warhammer-maailmassa.", shortDescEn: "Visceral 4-player melee action combat set in the Warhammer universe." }, // Vermintide 2
  "239140": { genres: ["Toiminta", "Ammunta", "Ryöstö"], isCoop: true, shortDesc: "Neljän hengen taktinen pankkiryöstö- ja räiskintäpeli.", shortDescEn: "Four-player tactical heist and shooter game." }, // Payday 2
  "730": { genres: ["Ammunta", "Toiminta", "FPS"], isCoop: false, shortDesc: "Klassinen kilpailullinen taktinen ensimmäisen persoonan ammunta.", shortDescEn: "Premier competitive tactical first-person shooter." }, // CS2
  "49520": { genres: ["Toiminta", "Roolipelit", "Ammunta"], isCoop: true, shortDesc: "Ryöstelyä ja räiskintää Pandorassa jopa 4 pelaajan co-opissa.", shortDescEn: "Loot-and-shoot craziness on Pandora for up to 4 co-op players." }, // Borderlands 2
  "427520": { genres: ["Simulaatio", "Strategia"], isCoop: true, shortDesc: "Rakenna ja automatisoi massiivisia tehtaita yksin tai ystävien kanssa.", shortDescEn: "Build and automate massive factory complexes alone or with friends." }, // Factorio
  "962130": { genres: ["Selviytyminen", "Toiminta", "Seikkailu"], isCoop: true, shortDesc: "Kutistuneet teinit selviytyvät takapihan hyönteisiä vastaan ryhmässä.", shortDescEn: "Shrunk teens survive against giant backyard insects in co-op." }, // Grounded
  "648800": { genres: ["Selviytyminen", "Seikkailu", "Moninpeli"], isCoop: true, shortDesc: "Selviytymistä valtamerellä lauttaa laajentaen yhdessä kavereiden kanssa.", shortDescEn: "Ocean survival where you expand your raft together with friends." }, // Raft
  "242760": { genres: ["Kauhu", "Selviytyminen", "Toiminta"], isCoop: true, shortDesc: "Selviytymiskauhua kannibaalien asuttamalla saarella kavereiden kanssa.", shortDescEn: "Survival horror in a cannibal-infested peninsula with friends." }, // The Forest
  "739630": { genres: ["Kauhu", "VR", "Yhteistyö"], isCoop: true, shortDesc: "4 pelaajan psykologinen aavejahti ja haamututkimus.", shortDescEn: "4-player psychological ghost hunting and paranormal investigation." }, // Phasmophobia
  "381210": { genres: ["Kauhu", "Moninpeli", "Toiminta"], isCoop: true, shortDesc: "4vs1 epäsymmetrinen kauhuselviytymismoninpeli.", shortDescEn: "4v1 asymmetrical multiplayer horror survival game." }, // Dead by Daylight
  "1426210": { genres: ["Toiminta", "Seikkailu", "Tasohyppely"], isCoop: true, shortDesc: "Palkittu kahden pelaajan yhteistyöhelmi parisuhteen korjaamisesta.", shortDescEn: "Award-winning pure co-op platform adventure about healing a relationship." }, // It Takes Two
  "728880": { genres: ["Toiminta", "Moninpeli", "Party"], isCoop: true, shortDesc: "Haahtava ja kaoottinen ruoanlaittopeli 1-4 kokille.", shortDescEn: "Chaotic and hilarious culinary co-op game for 1-4 chefs." }, // Overcooked! 2
  "1172470": { genres: ["Roolipelit", "Toiminta", "Ammunta"], isCoop: false, shortDesc: "Tulevaisuuden synkkä megakaupunki täynnä kyberneettisiä tehtäviä.", shortDescEn: "Open-world dystopian action RPG set in the vibrant megacity of Night City." }, // Cyberpunk 2077
  "292030": { genres: ["Roolipelit", "Seikkailu", "Avoimen maailman"], isCoop: false, shortDesc: "Kriitikoiden ylistämä fantasiaroolipeli Geralt Rivialaisen matkasta.", shortDescEn: "Critically acclaimed story-driven dark fantasy RPG featuring monster slayer Geralt." }, // Witcher 3
  "1145360": { genres: ["Toiminta", "Roguelike", "Indie"], isCoop: false, shortDesc: "Kreikkalaiseen mytologiaan sijoittuva vauhdikas roguelike-mestariteos.", shortDescEn: "God-like rogue-like dungeon crawler set in Greek mythology." }, // Hades
  "264710": { genres: ["Tasohyppely", "Metroidvania", "Toiminta"], isCoop: false, shortDesc: "Laaja ja tunnelmallinen maanalainen hyönteiskuningaskunta.", shortDescEn: "Atmospheric 2D action-adventure Metroidvania through a vast ruined insect kingdom." }, // Hollow Knight
  "646570": { genres: ["Roolipelit", "Strategia", "Korttipelit"], isCoop: false, shortDesc: "Pakanrakennus-rogueliken kultastandardi.", shortDescEn: "The definitive deck-building roguelike combining card games and dungeon crawling." }, // Slay the Spire
  "588650": { genres: ["Toiminta", "Roguelike", "Tasohyppely"], isCoop: false, shortDesc: "Sulavaliikkeinen roguelite-toimintapeli jatkuvasti muuttuvassa linnassa.", shortDescEn: "Fast-paced rogue-lite action platformer set in an ever-changing castle." }, // Dead Cells
  "590380": { genres: ["Strategia", "Vuoropohjainen", "Pulmapelit"], isCoop: false, shortDesc: "Taktista mecha-puolustusta vuoropohjaisella miniatyyrikentällä.", shortDescEn: "Tactical turn-based mech strategy on compact 8x8 puzzle-like grids." }, // Into the Breach
  "391540": { genres: ["Roolipelit", "Indie", "Tarinapohjainen"], isCoop: false, shortDesc: "Kulttimaineen saavuttanut roolipeli, jossa ketään ei tarvitse vahingoittaa.", shortDescEn: "Beloved indie RPG where you don't have to destroy anyone to triumph." }, // Undertale
  "752590": { genres: ["Seikkailu", "Hiiviskely", "Toiminta"], isCoop: false, shortDesc: "Koskettava tarinallinen seikkailu ruttorottien ja inkvisition kourissa.", shortDescEn: "Emotional narrative stealth adventure following siblings through plague-torn France." }, // A Plague Tale: Innocence
  "418240": { genres: ["Strategia", "Hiiviskely", "Taktinen"], isCoop: false, shortDesc: "Reaaliaikainen taktinen hiiviskely feodaalisessa Japanissa.", shortDescEn: "Real-time tactical stealth adventure set in feudal Japan." }, // Shadow Tactics
  "1145350": { genres: ["Roolipelit", "Tarinapohjainen", "Etsivä"], isCoop: false, shortDesc: "Mullistava roolipeli muistinmenetyksestä kärsivästä etsivästä.", shortDescEn: "Groundbreaking narrative RPG featuring an amnesiac detective and deep dialogues." }, // Disco Elysium
  "504230": { genres: ["Tasohyppely", "Tarkkuushyppely", "Indie"], isCoop: false, shortDesc: "Vaativa ja palkitseva tasohyppely vuoren huipulle kiipeämisestä.", shortDescEn: "Challenging precision platformer about overcoming anxiety and climbing a mountain." }, // Celeste
  "753640": { genres: ["Seikkailu", "Avaruus", "Mysteeri"], isCoop: false, shortDesc: "Mullistava aurinkokunnan tutkimusmatka 22 minuutin aikasilmukassa.", shortDescEn: "Masterful solar system space exploration caught in a 22-minute time loop." }, // Outer Wilds
  "883710": { genres: ["Toiminta", "Ammunta", "Kauhu"], isCoop: false, shortDesc: "Kiehtova ja brutaali scifi-selviytyminen zombien riivaamassa kaupungissa.", shortDescEn: "Stunning survival horror reimagining set in the zombie-infested Raccoon City." }, // Resident Evil 2
  "367520": { genres: ["Tasohyppely", "Seikkailu", "Metroidvania"], isCoop: false, shortDesc: "Häikäisevän kaunis ja koskettava tasohyppelyseikkailu.", shortDescEn: "Breathtakingly beautiful emotional platform adventure." }, // Hollow Knight / Ori
  "2050650": { genres: ["Toiminta", "Ammunta", "Avaruus"], isCoop: true, shortDesc: "Demokratian levittämistä galaksin ympäri neljän pelaajan tiimissä.", shortDescEn: "Galactic 4-player co-op squad shooter fighting for Managed Democracy." }, // Helldivers 2
  "553850": { genres: ["Toiminta", "Ammunta", "Avaruus"], isCoop: true, shortDesc: "Taktinen neljän pelaajan scifiräiskintä.", shortDescEn: "Top-down tactical 4-player shooter." }, // Helldivers 1
  "223730": { genres: ["Tasohyppely", "Indie", "Pulmapelit"], isCoop: false, shortDesc: "Värikäs ja sulava fysiikkapohjainen pulmatasohyppely.", shortDescEn: "Charming physics-based puzzle platformer." },
  "45760": { genres: ["Taistelu", "Toiminta", "Moninpeli"], isCoop: false, shortDesc: "Klassinen ja tekninen kamppailupelilegenda.", shortDescEn: "Classic deep competitive 2D fighting game legend." }, // Ultra Street Fighter IV
  "389730": { genres: ["Taistelu", "Toiminta", "Moninpeli"], isCoop: false, shortDesc: "Visuaalisesti vaikuttava 3D-taistelupeliklassikko.", shortDescEn: "Visually spectacular 3D fighting game benchmark." }, // TEKKEN 7
  "67370": { genres: ["Toiminta", "FPS", "Kauhu"], isCoop: true, shortDesc: "Tyylitelty sarjakuvamainen demoniräiskintä neljän pelaajan yhteistyötilalla.", shortDescEn: "Stylized comic-book demon FPS with 4-player co-op Vendettas campaign." }, // Darkness II
  "1347780": { genres: ["Toiminta", "Ammunta", "Taktinen"], isCoop: false, shortDesc: "Kulttiklassikko kaupunkisissisodasta ja tiiminjohtamisesta.", shortDescEn: "Cult classic urban guerrilla squad shooter." }, // Freedom Fighters
  "809230": { genres: ["Strategia", "Vuoropohjainen", "Sota"], isCoop: false, shortDesc: "Tyylikäs ja syvällinen toisen maailmansodan vuoropohjainen taktiikkapeli.", shortDescEn: "Turn-based WW2 operational wargame with elegant supply line mechanics." }, // Unity of Command II
  "1449200": { genres: ["Seikkailu", "Mysteeri", "Visuaalinen novelli"], isCoop: false, shortDesc: "Kiehtova sci-fi-etsivämysteeri rinnakkaistodellisuuksilla ja huumorilla.", shortDescEn: "Compelling sci-fi detective mystery with dream investigations and multiple timelines." }, // Somnium Files
  "1619520": { genres: ["Roolipelit", "Strategia", "Korttipelit"], isCoop: false, shortDesc: "Retrohenkinen pikseligrafiikalla varustettu korttitaisteluroolipeli.", shortDescEn: "Retro-styled deck-building RPG with rich pixel art and tactical battles." }, // Cross Blitz
  "477740": { genres: ["Seikkailu", "Mysteeri", "Pulmapelit"], isCoop: false, shortDesc: "Kriitikoiden ylistämä psykologinen pakohuone- ja mysteeripelisarja.", shortDescEn: "Critically acclaimed psychological escape room and visual novel mystery thriller." } // Zero Escape
};

export const KNOWN_RELEASE_YEARS: Record<string, number> = {
  "550": 2009, // Left 4 Dead 2
  "620": 2011, // Portal 2
  "105600": 2011, // Terraria
  "413150": 2016, // Stardew Valley
  "548430": 2020, // Deep Rock Galactic
  "219990": 2016, // Grim Dawn
  "289070": 2016, // Civ VI
  "3900": 2005, // Civ IV
  "435150": 2017, // Divinity Original Sin 2
  "1086940": 2023, // Baldur's Gate 3
  "252490": 2018, // Rust
  "322330": 2018, // Subnautica
  "892970": 2021, // Valheim
  "632360": 2020, // Risk of Rain 2
  "322170": 2015, // Dying Light
  "582010": 2018, // Monster Hunter: World
  "552520": 2018, // Vermintide 2
  "239140": 2013, // Payday 2
  "730": 2023, // CS2
  "49520": 2012, // Borderlands 2
  "427520": 2020, // Factorio
  "962130": 2022, // Grounded
  "648800": 2022, // Raft
  "242760": 2018, // The Forest
  "739630": 2020, // Phasmophobia
  "381210": 2016, // Dead by Daylight
  "1426210": 2021, // It Takes Two
  "728880": 2018, // Overcooked! 2
  "1172470": 2020, // Cyberpunk 2077
  "292030": 2015, // Witcher 3
  "1145360": 2020, // Hades
  "264710": 2017, // Hollow Knight
  "646570": 2019, // Slay the Spire
  "588650": 2018, // Dead Cells
  "590380": 2018, // Into the Breach
  "391540": 2015, // Undertale
  "752590": 2019, // A Plague Tale: Innocence
  "418240": 2016, // Shadow Tactics
  "1145350": 2019, // Disco Elysium
  "504230": 2018, // Celeste
  "753640": 2019, // Outer Wilds
  "883710": 2019, // Resident Evil 2
  "367520": 2015, // Ori
  "2050650": 2024, // Helldivers 2
  "553850": 2015, // Helldivers 1
  "223730": 2013,
  "45760": 2009, // Ultra Street Fighter IV
  "389730": 2017, // TEKKEN 7
  "67370": 2012, // Darkness II
  "1347780": 2003, // Freedom Fighters
  "809230": 2019, // Unity of Command II
  "1449200": 2019, // Somnium Files
  "1619520": 2023, // Cross Blitz
  "477740": 2017, // Zero Escape
};

// Genre translations and normalization helper
export const GENRE_CATEGORIES = [
  "Kaikki",
  "Toiminta",
  "Roolipelit",
  "Strategia",
  "Seikkailu",
  "Simulaatio",
  "Roguelike",
  "Indie",
  "Kauhu",
  "Ammunta",
  "Pulmapelit",
  "Tasohyppely",
  "Selviytyminen"
];

// Helper to determine genres from text tags or title
export function inferGenres(title: string, rawGenres?: string[]): string[] {
  const genres = new Set<string>();
  
  if (rawGenres && Array.isArray(rawGenres)) {
    for (const g of rawGenres) {
      const lower = g.toLowerCase();
      if (lower.includes("action") || lower.includes("toiminta")) genres.add("Toiminta");
      if (lower.includes("rpg") || lower.includes("role") || lower.includes("roolipel")) genres.add("Roolipelit");
      if (lower.includes("strategy") || lower.includes("strategia")) genres.add("Strategia");
      if (lower.includes("adventure") || lower.includes("seikkailu")) genres.add("Seikkailu");
      if (lower.includes("simulation") || lower.includes("simulaatio") || lower.includes("sim")) genres.add("Simulaatio");
      if (lower.includes("rogue")) genres.add("Roguelike");
      if (lower.includes("indie")) genres.add("Indie");
      if (lower.includes("horror") || lower.includes("kauhu")) genres.add("Kauhu");
      if (lower.includes("shooter") || lower.includes("ammunta") || lower.includes("fps")) genres.add("Ammunta");
      if (lower.includes("puzzle") || lower.includes("pulma")) genres.add("Pulmapelit");
      if (lower.includes("platform") || lower.includes("tasohyppely")) genres.add("Tasohyppely");
      if (lower.includes("survival") || lower.includes("selviytyminen")) genres.add("Selviytyminen");
    }
  }

  const t = title.toLowerCase();
  if (t.includes("rpg") || t.includes("fantasy") || t.includes("scrolls") || t.includes("witcher") || t.includes("dawn") || t.includes("dragon")) {
    genres.add("Roolipelit");
  }
  if (t.includes("civilization") || t.includes("tactics") || t.includes("command") || t.includes("strategy") || t.includes("age of") || t.includes("war")) {
    genres.add("Strategia");
  }
  if (t.includes("horror") || t.includes("dead") || t.includes("resident") || t.includes("darkness") || t.includes("evil")) {
    genres.add("Kauhu");
  }
  if (t.includes("shooter") || t.includes("strike") || t.includes("hitman") || t.includes("bullet") || t.includes("gun") || t.includes("sniper")) {
    genres.add("Ammunta");
    genres.add("Toiminta");
  }
  if (t.includes("sim") || t.includes("tycoon") || t.includes("builder") || t.includes("truck") || t.includes("railway") || t.includes("flight")) {
    genres.add("Simulaatio");
  }

  if (genres.size === 0) {
    genres.add("Toiminta");
    genres.add("Indie");
  }

  return Array.from(genres);
}

// Helper to check if a game supports online co-op
export function checkIsCoop(appId: string, title: string, steamCategories?: string[]): boolean {
  if (KNOWN_GAMES[appId]?.isCoop) return true;
  
  if (steamCategories && Array.isArray(steamCategories)) {
    const isCoopCategory = steamCategories.some((c) => {
      const lower = c.toLowerCase();
      return lower.includes("yhteistyö") || lower.includes("co-op") || lower.includes("coop");
    });
    if (isCoopCategory) return true;
  }

  const t = title.toLowerCase();
  const coopKeywords = [
    "co-op", "coop", "together", "civilization", "divinity", 
    "grim dawn", "left 4 dead", "portal 2", "deep rock", "borderlands", 
    "remnant", "valheim", "darkness ii", "payday", "vermintide", "warhammer", 
    "don't starve together", "it takes two", "we were here", "raft", 
    "phasmophobia", "overcooked", "helldivers", "sniper elite", "dying light", 
    "killing floor", "risk of rain", "unravel two", "trine", "broforce", 
    "magicka", "castle crashers", "battleblock", "speedrunners", "for the king", 
    "barotrauma", "terraria", "core keeper", "v rising", "satisfactory", 
    "factorio", "generation zero", "green hell", "wasteland 3", "alien swarm",
    "dead by daylight", "sea of thieves", "sons of the forest", "the forest",
    "monster hunter", "monhun", "stardew valley", "halo", "destiny", "division",
    "ghost recon", "streets of rage 4", "tmnt", "outriders"
  ];
  return coopKeywords.some((kw) => t.includes(kw));
}

