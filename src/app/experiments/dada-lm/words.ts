const nouns = [
  "time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand",
  "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government",
  "company", "number", "group", "problem", "fact", "be", "have", "do", "say", "get",
  "make", "go", "know", "take", "see", "come", "think", "look", "want", "give",
  "use", "find", "tell", "ask", "work", "seem", "feel", "try", "leave", "call",
  "good", "new", "first", "last", "long", "great", "little", "own", "other", "old",
  "right", "big", "high", "different", "small", "large", "next", "early", "young", "important",
  "public", "bad", "same", "able", "school", "state", "family", "student", "group", "country",
  "problem", "hand", "part", "place", "case", "week", "company", "system", "program", "question",
  "work", "government", "number", "night", "point", "home", "water", "room", "mother", "area",
  "money", "story", "fact", "month", "lot", "right", "study", "book", "eye", "job",
  "word", "business", "issue", "side", "kind", "head", "house", "service", "friend", "father",
  "power", "hour", "game", "line", "end", "member", "law", "car", "city", "community",
  "name", "president", "team", "minute", "idea", "kid", "body", "information", "back", "parent",
  "face", "others", "level", "office", "door", "health", "person", "art", "war", "history",
  "party", "result", "change", "morning", "reason", "research", "girl", "guy", "moment", "air",
  "teacher", "force", "education", "foot", "boy", "age", "policy", "everything", "process", "music",
  "market", "sense", "nation", "plan", "college", "interest", "death", "experience", "effect", "use",
  "class", "control", "care", "field", "development", "role", "effort", "rate", "heart", "drug",
  "show", "leader", "light", "voice", "wife", "police", "mind", "price", "report", "decision",
  "son", "view", "relationship", "town", "road", "arm", "difference", "value", "building", "action",
  "model", "season", "society", "tax", "director", "position", "player", "record", "paper", "space",
  "ground", "form", "event", "official", "matter", "center", "couple", "site", "project", "activity",
  "star", "table", "need", "court", "oil", "situation", "cost", "industry", "figure", "street",
  "image", "phone", "data", "picture", "practice", "piece", "land", "product", "doctor", "wall",
  "patient", "worker", "news", "test", "movie", "north", "love", "support", "technology", "step",
  "baby", "computer", "type", "attention", "film", "tree", "source", "organization", "hair", "look",
  "century", "evidence", "window", "culture", "chance", "brother", "energy", "period", "course", "summer",
  "less", "real", "hundred", "available", "plant", "likely", "opportunity", "term", "letter", "condition",
  "choice", "place", "single", "rule", "daughter", "administration", "south", "husband", "congress", "floor",
  "campaign", "material", "population", "economy", "medical", "hospital", "church", "fire", "security", "bank",
  "west", "sport", "board", "subject", "officer", "rest", "behavior", "deal", "performance", "fight",
  "throw", "top", "goal", "second", "bed", "order", "author", "fill", "represent", "focus",
  "foreign", "drop", "plan", "blood", "agency", "push", "nature", "color", "store", "reduce",
  "sound", "note", "fine", "near", "movement", "page", "enter", "share", "common", "poor",
  "natural", "race", "concern", "series", "significant", "similar", "hot", "language", "usually", "response",
  "dead", "rise", "animal", "factor", "decade", "article", "shoot", "east", "save", "seven",
  "artist", "scene", "stock", "career", "despite", "central", "eight", "thus", "treatment", "beyond",
  "happy", "exactly", "protect", "approach", "lie", "size", "dog", "fund", "serious", "occur"
];

const verbs = [
  "be", "am", "is", "are", "was", "were", "being", "been", "have", "has", "had", "having", "do", "does", "did", "doing", "done",
  "say", "says", "said", "saying",   "go", "goes", "went", "gone", "going", "can", "could",
  "get", "gets", "got", "gotten", "getting", "make", "makes", "made", "making", "know", "knows", "knew", "known", "knowing",
  "think", "thinks", "thought", "thinking", "take", "takes", "took", "taken", "taking",
  "see", "sees", "saw", "seen", "seeing", "come", "comes", "came", "coming",
  "want", "wants", "wanted", "wanting", "look", "looks", "looked", "looking", "use", "uses", "used", "using",
  "find", "finds", "found", "finding", "give", "gives", "gave", "given", "giving", "tell", "tells", "told", "telling",
  "work", "works", "worked", "working", "call", "calls", "called", "calling", "try", "tries", "tried", "trying",
  "ask", "asks", "asked", "asking", "need", "needs", "needed", "needing", "feel", "feels", "felt", "feeling",
  "become", "becomes", "became", "becoming", "leave", "leaves", "left", "leaving", "put", "puts", "putting",
  "keep", "keeps", "kept", "keeping", "let", "lets", "letting", "begin", "begins", "began", "begun", "beginning",
  "seem", "seems", "seemed", "seeming", "help", "helps", "helped", "helping", "talk", "talks", "talked", "talking",
  "turn", "turns", "turned", "turning", "start", "starts", "started", "starting", "show", "shows", "showed", "shown", "showing",
  "hear", "hears", "heard", "hearing", "play", "plays", "played", "playing", "run", "runs", "ran", "running",
  "move", "moves", "moved", "moving", "live", "lives", "lived", "living", "believe", "believes", "believed", "believing",
  "bring", "brings", "brought", "bringing", "happen", "happens", "happened", "happening", "write", "writes", "wrote", "written", "writing",
  "provide", "provides", "provided", "providing", "sit", "sits", "sat", "sitting", "stand", "stands", "stood", "standing",
  "lose", "loses", "lost", "losing", "pay", "pays", "paid", "paying", "meet", "meets", "met", "meeting",
  "include", "includes", "included", "including", "continue", "continues", "continued", "continuing",
  "set", "sets", "setting", "learn", "learns", "learned", "learning", "change", "changes", "changed", "changing",
  "lead", "leads", "led", "leading", "understand", "understands", "understood", "understanding", "watch", "watches", "watched", "watching",
  "follow", "follows", "followed", "following", "stop", "stops", "stopped", "stopping", "create", "creates", "created", "creating",
  "speak", "speaks", "spoke", "spoken", "speaking",   "read", "reads", "reading", "allow", "allows", "allowed", "allowing",
  "add", "adds", "added", "adding", "spend", "spends", "spent", "spending", "grow", "grows", "grew", "grown", "growing",
  "open", "opens", "opened", "opening", "walk", "walks", "walked", "walking", "win", "wins", "won", "winning",
  "offer", "offers", "offered", "offering", "remember", "remembers", "remembered", "remembering", "love", "loves", "loved", "loving",
  "consider", "considers", "considered", "considering", "appear", "appears", "appeared", "appearing", "buy", "buys", "bought", "buying",
  "wait", "waits", "waited", "waiting", "serve", "serves", "served", "serving", "die", "dies", "died", "dying",
  "send", "sends", "sent", "sending",   "expect", "expects", "expected", "expecting", "build", "builds", "built", "building",
  "stay", "stays", "stayed", "staying", "fall", "falls", "fell", "fallen", "falling", "cut", "cuts", "cutting",
  "reach", "reaches", "reached", "reaching", "kill", "kills", "killed", "killing", "remain", "remains", "remained", "remaining"
];

const prepositions = [
  "about", "above", "across", "after", "against", "along", "among", "around", "as", "at",
  "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "but", "by",
  "concerning", "considering", "despite", "down", "during", "except", "for", "from", "in", "inside",
  "into", "like", "near", "of", "off", "on", "onto", "out", "outside", "over",
  "past", "regarding", "since", "through", "throughout", "till", "to", "toward", "under", "underneath",
  "until", "up", "upon", "with", "within", "without",
  "according to", "ahead of", "along with", "apart from", "as for", "as of", "as per", "as well as",
  "because of", "close to", "due to", "except for", "far from", "in addition to", "in case of",
  "in front of", "in place of", "in spite of", "instead of", "on behalf of", "on top of", "out of",
  "owing to", "prior to", "regardless of", "thanks to", "up to", "with regard to"
];

const conjunctions = [
  "and", "but", "or", "yet", "so", "although", "however", "meanwhile", "therefore", "unless"
];

const adjectives = [
  "adorable", "adventurous", "aggressive", "alert", "alive", "amused", "angry", "annoyed", "anxious", "arrogant",
  "ashamed", "attractive", "average", "awful", "bad", "beautiful", "better", "bewildered", "black", "bloody",
  "blue", "bold", "bored", "brave", "bright", "broad", "broken", "busy", "calm", "careful",
  "careless", "charming", "cheerful", "clean", "clear", "clever", "cloudy", "clumsy", "cold", "colorful",
  "comfortable", "confused", "cool", "crazy", "creepy", "crowded", "cruel", "curious", "cute", "dangerous",
  "dark", "dead", "deaf", "deep", "defeated", "delicious", "delightful", "depressed", "determined", "different",
  "difficult", "dirty", "disgusted", "distinct", "disturbed", "dizzy", "doubtful", "drab", "dry", "dull",
  "eager", "early", "easy", "elated", "elegant", "embarrassed", "empty", "enchanting", "encouraging", "energetic",
  "enthusiastic", "envious", "evil", "excited", "expensive", "faint", "fair", "faithful", "famous", "fancy",
  "fantastic", "far", "fast", "fat", "fearful", "fertile", "fierce", "filthy", "fine", "flat",
  "fluffy", "foolish", "fragile", "frail", "free", "fresh", "friendly", "frightened", "funny", "fuzzy",
  "gentle", "giant", "gifted", "gigantic", "glamorous", "gleaming", "glorious", "good", "gorgeous", "graceful",
  "grumpy", "guilty", "handsome", "happy", "hard", "harsh", "healthy", "heavy", "helpful", "helpless",
  "high", "hilarious", "hollow", "homeless", "honest", "horrible", "hot", "huge", "hungry", "hurt",
  "icy", "ideal", "important", "impossible", "incredible", "innocent", "intelligent", "interesting", "itchy", "jealous",
  "jittery", "jolly", "joyful", "juicy", "kind", "large", "late", "lazy", "legal", "light",
  "lively", "lonely", "long", "loose", "loud", "lovely", "lucky", "magnificent", "massive", "melancholy",
  "messy", "mighty", "modern", "moist", "motionless", "muddy", "mysterious", "narrow", "nasty", "naughty",
  "nervous", "new", "nice", "noisy", "nutty", "obedient", "obnoxious", "odd", "old", "orange",
  "ordinary", "outgoing", "outrageous", "outstanding", "pale", "perfect", "plain", "pleasant", "poised", "poor",
  "powerful", "precious", "prickly", "proud", "puny", "purple", "puzzled", "quaint", "quick", "quiet",
  "quirky", "rapid", "rare", "real", "red", "relieved", "repulsive", "rich", "ripe", "rotten",
  "rough", "round", "sad", "safe", "salty", "sane", "scary", "selfish", "serious", "shallow",
  "sharp", "shiny", "short", "shy", "silly", "simple", "skinny", "sleepy", "slimy", "slow",
  "small", "smart", "smelly", "smooth", "soft", "sore", "sour", "sparkling", "spicy", "splendid",
  "spotless", "square", "squeaky", "stale", "steep", "sticky", "strange", "strong", "stupid", "successful",
  "sweet", "swift", "tall", "tame", "tasty", "tender", "tense", "terrible", "thankful", "thin",
  "thoughtful", "tight", "tiny", "tired", "tough", "transparent", "ugly", "uninterested", "unusual", "upset",
  "vast", "victorious", "violent", "warm", "weary", "weird", "wet", "whimsical", "white", "wicked",
  "wide", "wild", "witty", "wonderful", "worried", "wrong", "yellow", "young", "yummy", "zany", "zealous"
];

export function buildSentence(words?: string[]): string {
  let text = ``;
  const paragraphs = Math.ceil(Math.random() * 4);

  for (let i = 0; i < paragraphs; i++) {
    const w1 = nouns[Math.floor(Math.random() * nouns.length)];
    const w2 = nouns[Math.floor(Math.random() * nouns.length)];
    const w3 = nouns[Math.floor(Math.random() * nouns.length)];
    const w4 = verbs[Math.floor(Math.random() * verbs.length)];
    const w5 = verbs[Math.floor(Math.random() * verbs.length)];
    const w6 = verbs[Math.floor(Math.random() * verbs.length)];
    const w7 = prepositions[Math.floor(Math.random() * prepositions.length)];
    const w8 = prepositions[Math.floor(Math.random() * prepositions.length)];
    const w9 = prepositions[Math.floor(Math.random() * prepositions.length)];
    const w10 = prepositions[Math.floor(Math.random() * prepositions.length)];
    const w11 = prepositions[Math.floor(Math.random() * prepositions.length)];
    const w12 = prepositions[Math.floor(Math.random() * prepositions.length)];
    const w13 = prepositions[Math.floor(Math.random() * prepositions.length)];
    const w14 = conjunctions[Math.floor(Math.random() * conjunctions.length)];
    const w15 = conjunctions[Math.floor(Math.random() * conjunctions.length)];
    const w16 = conjunctions[Math.floor(Math.random() * conjunctions.length)];
    const w17 = adjectives[Math.floor(Math.random() * adjectives.length)];
    const w18 = adjectives[Math.floor(Math.random() * adjectives.length)];
    const w19 = adjectives[Math.floor(Math.random() * adjectives.length)];
    const w20 = words?.length ? words[Math.floor(Math.random() * words.length)] : nouns[Math.floor(Math.random() * nouns.length)];

    text += `\t${w17} ${w1} ${w4} ${w7} the ${w18} ${w2}, ${w14} ${w5} ${w8} ${w20}. `;
    text += `${w3} ${w6} ${w9} ${w19} ${w1} ${w15} ${w4} ${w10} ${w2}. `;
    text += `Then ${w20} ${w16} ${w5} ${w11} ${w3} ${w12} ${w6} ${w13} the ${w17} ${w2}.\n\n`;
  }

  return text;
};
