import { useState, useEffect, useRef } from "react";

// ── Lesson Data ──────────────────────────────────────────────────────────────
const LESSONS = [
  {
    id: 1,
    title: "Greetings",
    subtitle: "Il Saluto",
    free: true,
    keywords: [
      { italian: "Ciao", english: "Hi / Bye (informal)" },
      { italian: "Salve", english: "Hello (neutral/formal)" },
      { italian: "Buongiorno", english: "Good morning / Good day" },
      { italian: "Buonasera", english: "Good evening" },
      { italian: "Arrivederci", english: "Goodbye (formal)" },
      { italian: "Tutto bene", english: "All good / Everything's fine" },
    ],
    dialogue: [
      { speaker: "A", line: "Buongiorno! Salve." },
      { speaker: "B", line: "Ciao! Come stai?" },
      { speaker: "A", line: "Tutto bene, grazie. E tu?" },
      { speaker: "B", line: "Bene, grazie!" },
    ],
    grammar: {
      title: "Come — How / What",
      points: [
        { italian: "Come stai?", english: "How are you? (informal)" },
        { italian: "Come sta?", english: "How are you? (formal)" },
        { italian: "Come va?", english: "How is it going?" },
        { italian: "Come?", english: "What? / Pardon? (also means 'excuse me')" },
      ],
      note: "\"Come\" literally means \"how\" or \"as\" — it's your go-to word for asking about states and situations.",
    },
    aiPrompt: "You are an Italian language tutor. The student just learned Lesson 1: Greetings. Help them practice by having a short greeting conversation in Italian. Keep it simple — only use words from this lesson: Ciao, Salve, Buongiorno, Buonasera, Arrivederci, Tutto bene, Come stai, Come va. After each student reply, gently correct mistakes if any, then continue the conversation. Always respond in a warm, encouraging tone. Keep responses short.",
  },
  {
    id: 2,
    title: "Introducing Yourself",
    subtitle: "Presentarsi",
    free: false,
    keywords: [
      { italian: "Mi chiamo…", english: "My name is…" },
      { italian: "Sono…", english: "I am…" },
      { italian: "Piacere", english: "Nice to meet you" },
      { italian: "Di dove sei?", english: "Where are you from?" },
      { italian: "Sono di…", english: "I'm from…" },
      { italian: "Quanti anni hai?", english: "How old are you?" },
    ],
    dialogue: [
      { speaker: "A", line: "Ciao! Sono Paolo." },
      { speaker: "B", line: "Ciao, Paolo. Sono Monica. Piacere!" },
      { speaker: "A", line: "Piacere mio. Di dove sei?" },
      { speaker: "B", line: "Sono di Firenze. E tu?" },
      { speaker: "A", line: "Sono di Milano." },
    ],
    grammar: {
      title: "Essere — The Verb \"To Be\"",
      points: [
        { italian: "Io sono", english: "I am" },
        { italian: "Tu sei", english: "You are (informal)" },
        { italian: "Lei è", english: "You are (formal) / She is" },
        { italian: "Lui / Lei è", english: "He / She is" },
        { italian: "Noi siamo", english: "We are" },
      ],
      note: "In Italian you rarely need to say \"io\" (I) — the verb ending tells you who is speaking.",
    },
    aiPrompt: "You are an Italian tutor. The student learned Lesson 2: Introducing yourself. Practice introductions with them. Use only: Mi chiamo, Sono, Piacere, Di dove sei, Sono di. Gently correct mistakes and keep it short and warm.",
  },
  {
    id: 3,
    title: "At the Café",
    subtitle: "Al Bar",
    free: false,
    keywords: [
      { italian: "Un caffè, per favore", english: "A coffee, please" },
      { italian: "Vorrei…", english: "I would like…" },
      { italian: "Quanto costa?", english: "How much does it cost?" },
      { italian: "Il conto", english: "The bill" },
      { italian: "Un cornetto", english: "A croissant" },
      { italian: "Grazie mille", english: "Thank you very much" },
    ],
    dialogue: [
      { speaker: "Cliente", line: "Buongiorno! Un caffè, per favore." },
      { speaker: "Barista", line: "Subito! Vuole anche un cornetto?" },
      { speaker: "Cliente", line: "Sì, grazie. Quanto costa?" },
      { speaker: "Barista", line: "Un euro e cinquanta, prego." },
      { speaker: "Cliente", line: "Ecco. Grazie mille!" },
    ],
    grammar: {
      title: "Vorrei — Polite Requests",
      points: [
        { italian: "Vorrei un caffè", english: "I would like a coffee" },
        { italian: "Vorrei il conto", english: "I would like the bill" },
        { italian: "Vorrei prenotare", english: "I would like to book" },
        { italian: "Vorrei un tavolo", english: "I would like a table" },
      ],
      note: "\"Vorrei\" is the conditional of \"volere\" (to want). It's more polite than \"voglio\" (I want) — use it always in shops and restaurants.",
    },
    aiPrompt: "You are an Italian tutor playing a barista. The student is practicing ordering at an Italian café. Use only lesson 3 vocabulary. Be warm, correct gently, keep it short.",
  },
  {
    id: 4,
    title: "At the Gelateria",
    subtitle: "In Gelateria",
    free: false,
    keywords: [
      { italian: "Un gelato", english: "An ice cream" },
      { italian: "Che gusti?", english: "Which flavours?" },
      { italian: "Cono o coppetta?", english: "Cone or cup?" },
      { italian: "Piccolo / medio / grande", english: "Small / medium / large" },
      { italian: "Che buono!", english: "How delicious!" },
      { italian: "Posso assaggiare?", english: "Can I taste?" },
    ],
    dialogue: [
      { speaker: "Cliente", line: "Buonasera! Vorrei un gelato." },
      { speaker: "Gelataio", line: "Certo! Cono o coppetta?" },
      { speaker: "Cliente", line: "Cono, grazie. Posso assaggiare il pistacchio?" },
      { speaker: "Gelataio", line: "Certo, ecco a lei." },
      { speaker: "Cliente", line: "Mmm, che buono! Pistacchio e cioccolato, per favore." },
      { speaker: "Gelataio", line: "Piccolo, medio o grande?" },
      { speaker: "Cliente", line: "Medio. Quanto costa?" },
      { speaker: "Gelataio", line: "Due euro e cinquanta." },
    ],
    grammar: {
      title: "questo / quello — This / That",
      points: [
        { italian: "Questo gelato", english: "This ice cream (nearby)" },
        { italian: "Quello lì", english: "That one (over there)" },
        { italian: "Questo è buono", english: "This is good" },
        { italian: "Qual è il migliore?", english: "Which is the best?" },
      ],
      note: "Use \"questo\" for things close to you and \"quello\" for things further away — same logic as this/that in English.",
    },
    aiPrompt: "You are an Italian tutor playing a gelateria worker in Italy. The student is practicing ordering gelato. Use vocabulary from lesson 4: gelato, gusti, cono, coppetta, assaggiare, buono. Be playful and warm, correct gently, keep responses short.",
  },
  {
    id: 5,
    title: "Asking for Directions",
    subtitle: "Chiedere la Strada",
    free: false,
    keywords: [
      { italian: "Dov'è…?", english: "Where is…?" },
      { italian: "A destra", english: "To the right" },
      { italian: "A sinistra", english: "To the left" },
      { italian: "Sempre dritto", english: "Straight ahead" },
      { italian: "Vicino / lontano", english: "Near / far" },
      { italian: "Scusi!", english: "Excuse me! (formal)" },
    ],
    dialogue: [
      { speaker: "Turista", line: "Scusi! Dov'è il Colosseo?" },
      { speaker: "Passante", line: "Allora… vada sempre dritto, poi a destra." },
      { speaker: "Turista", line: "È lontano?" },
      { speaker: "Passante", line: "No, è vicino. Cinque minuti a piedi." },
      { speaker: "Turista", line: "Grazie mille!" },
      { speaker: "Passante", line: "Prego! Buona visita!" },
    ],
    grammar: {
      title: "C'è / Ci sono — There is / There are",
      points: [
        { italian: "C'è un autobus?", english: "Is there a bus?" },
        { italian: "Ci sono taxi?", english: "Are there taxis?" },
        { italian: "C'è una fermata vicino?", english: "Is there a stop nearby?" },
        { italian: "Non c'è problema", english: "There's no problem" },
      ],
      note: "\"C'è\" and \"ci sono\" are your go-to phrases for asking if something exists or is available — incredibly useful in daily life.",
    },
    aiPrompt: "You are an Italian tutor playing a local Roman. The student needs directions in Italian. Use lesson 5 vocabulary: dov'è, destra, sinistra, dritto, vicino, lontano, scusi. Give directions to famous places. Correct gently and keep it short.",
  },
  {
    id: 6,
    title: "At the Airport",
    subtitle: "All'Aeroporto",
    free: false,
    keywords: [
      { italian: "Il volo", english: "The flight" },
      { italian: "Il passaporto", english: "The passport" },
      { italian: "Il bagaglio", english: "The luggage / baggage" },
      { italian: "Quanti bagagli hai?", english: "How many bags do you have?" },
      { italian: "Il gate", english: "The gate" },
      { italian: "In ritardo / in orario", english: "Delayed / on time" },
    ],
    dialogue: [
      { speaker: "Agente", line: "Buongiorno! Il passaporto, per favore." },
      { speaker: "Passeggero", line: "Eccolo. Ho anche un bagaglio da imbarcare." },
      { speaker: "Agente", line: "Quanti bagagli ha?" },
      { speaker: "Passeggero", line: "Solo uno. Il volo è in orario?" },
      { speaker: "Agente", line: "Sì, parte alle undici. Gate B7." },
      { speaker: "Passeggero", line: "Grazie mille!" },
    ],
    grammar: {
      title: "Avere — The Verb \"To Have\"",
      points: [
        { italian: "Io ho", english: "I have" },
        { italian: "Tu hai", english: "You have (informal)" },
        { italian: "Lei ha", english: "You have (formal) / She has" },
        { italian: "Lui / Lei ha", english: "He / She has" },
        { italian: "Noi abbiamo", english: "We have" },
      ],
      note: "\"Avere\" is one of the two most important verbs in Italian (with \"essere\"). It's also used to express age: \"ho trent'anni\" = I am thirty years old.",
    },
    aiPrompt: "You are an Italian tutor playing an airport check-in agent in Italy. The student is practicing airport Italian from lesson 6. Use: volo, passaporto, bagaglio, gate, in ritardo, in orario, avere. Be professional but warm, correct gently.",
  },
  {
    id: 7,
    title: "At the Restaurant",
    subtitle: "Al Ristorante",
    free: false,
    keywords: [
      { italian: "Un tavolo per due", english: "A table for two" },
      { italian: "Il menù", english: "The menu" },
      { italian: "Il primo / il secondo", english: "The first / second course" },
      { italian: "Sono vegetariano/a", english: "I am vegetarian" },
      { italian: "È compreso?", english: "Is it included?" },
      { italian: "Il coperto", english: "The cover charge" },
    ],
    dialogue: [
      { speaker: "Cliente", line: "Buonasera! Un tavolo per due, per favore." },
      { speaker: "Cameriere", line: "Certo, prego. Ecco il menù." },
      { speaker: "Cliente", line: "Grazie. Sono vegetariana — cosa consiglia?" },
      { speaker: "Cameriere", line: "Ottime le tagliatelle ai funghi!" },
      { speaker: "Cliente", line: "Perfetto. E il coperto è compreso?" },
      { speaker: "Cameriere", line: "Sì, è già incluso. Buon appetito!" },
    ],
    grammar: {
      title: "Mi piace / Mi piacciono — I like",
      points: [
        { italian: "Mi piace la pasta", english: "I like pasta" },
        { italian: "Mi piacciono i funghi", english: "I like mushrooms (plural)" },
        { italian: "Non mi piace", english: "I don't like it" },
        { italian: "Mi piace molto", english: "I like it a lot" },
      ],
      note: "\"Piacere\" works backwards from English — you say \"to me it is pleasing\". Use \"piace\" for one thing, \"piacciono\" for many.",
    },
    aiPrompt: "You are an Italian tutor playing a restaurant waiter in Italy. The student is practicing dining out in Italian. Use lesson 7 vocabulary: tavolo, menù, primo, secondo, vegetariano, coperto, mi piace. Be elegant and warm, correct gently, keep it real.",
  },
  {
    id: 8,
    title: "Shopping",
    subtitle: "Fare Shopping",
    free: false,
    keywords: [
      { italian: "Posso provarlo?", english: "Can I try it on?" },
      { italian: "Che taglia?", english: "What size?" },
      { italian: "È troppo caro", english: "It's too expensive" },
      { italian: "C'è lo sconto?", english: "Is there a discount?" },
      { italian: "Lo prendo", english: "I'll take it" },
      { italian: "Accettate carte?", english: "Do you accept cards?" },
    ],
    dialogue: [
      { speaker: "Cliente", line: "Buongiorno! Posso provare questa giacca?" },
      { speaker: "Commessa", line: "Certo! Che taglia porta?" },
      { speaker: "Cliente", line: "La media, grazie." },
      { speaker: "Cliente", line: "Hmm… quanto costa?" },
      { speaker: "Commessa", line: "Centoventi euro. C'è il 20% di sconto oggi!" },
      { speaker: "Cliente", line: "Perfetto, lo prendo! Accettate carte?" },
      { speaker: "Commessa", line: "Sì, certo." },
    ],
    grammar: {
      title: "Potere — Can / To be able to",
      points: [
        { italian: "Posso provarlo?", english: "Can I try it on?" },
        { italian: "Può aiutarmi?", english: "Can you help me? (formal)" },
        { italian: "Non posso", english: "I can't" },
        { italian: "Si può pagare con carta?", english: "Can one pay by card?" },
      ],
      note: "\"Potere\" is a modal verb — it pairs with the infinitive of another verb. It's your key to asking permission and expressing ability.",
    },
    aiPrompt: "You are an Italian tutor playing a shop assistant in an Italian boutique. The student is practicing shopping in Italian. Use lesson 8 vocabulary: provare, taglia, caro, sconto, prendere, carte, potere. Be helpful and stylish, correct gently.",
  },
  {
    id: 9,
    title: "At the Hotel",
    subtitle: "In Albergo",
    free: false,
    keywords: [
      { italian: "Ho una prenotazione", english: "I have a reservation" },
      { italian: "La camera", english: "The room" },
      { italian: "A che ora è il check-out?", english: "What time is check-out?" },
      { italian: "La colazione è inclusa?", english: "Is breakfast included?" },
      { italian: "C'è il wifi?", english: "Is there wifi?" },
      { italian: "La chiave", english: "The key" },
    ],
    dialogue: [
      { speaker: "Ospite", line: "Buonasera! Ho una prenotazione. Mi chiamo Rossi." },
      { speaker: "Receptionist", line: "Benvenuto! Sì, camera doppia per tre notti." },
      { speaker: "Ospite", line: "Perfetto. La colazione è inclusa?" },
      { speaker: "Receptionist", line: "Sì, dalle sette alle dieci. C'è anche il wifi gratuito." },
      { speaker: "Ospite", line: "Ottimo. A che ora è il check-out?" },
      { speaker: "Receptionist", line: "Alle undici. Ecco la sua chiave. Buona permanenza!" },
    ],
    grammar: {
      title: "Prepositions: a, di, da, in",
      points: [
        { italian: "Sono a Roma", english: "I am in Rome (location)" },
        { italian: "Vengo da Londra", english: "I come from London (origin)" },
        { italian: "Vado in Italia", english: "I'm going to Italy (countries)" },
        { italian: "La chiave di camera", english: "The room key (possession)" },
      ],
      note: "Italian prepositions don't always match English ones. \"In\" is used with countries, \"a\" with cities — this small rule saves a lot of confusion.",
    },
    aiPrompt: "You are an Italian tutor playing a hotel receptionist in Italy. The student is checking in and asking questions in Italian. Use lesson 9 vocabulary: prenotazione, camera, check-out, colazione, wifi, chiave. Be professional and warm, correct gently.",
  },
  {
    id: 10,
    title: "On the Train",
    subtitle: "Sul Treno",
    free: false,
    keywords: [
      { italian: "Un biglietto per…", english: "A ticket to…" },
      { italian: "Andata e ritorno", english: "Return (round trip)" },
      { italian: "Il binario", english: "The platform" },
      { italian: "È occupato?", english: "Is this seat taken?" },
      { italian: "A che ora arriva?", english: "What time does it arrive?" },
      { italian: "Il treno è in ritardo", english: "The train is delayed" },
    ],
    dialogue: [
      { speaker: "Viaggiatore", line: "Buongiorno! Un biglietto per Venezia, per favore." },
      { speaker: "Bigliettaio", line: "Andata e ritorno?" },
      { speaker: "Viaggiatore", line: "Solo andata. A che ora arriva?" },
      { speaker: "Bigliettaio", line: "Alle tredici e venti. Binario 4." },
      { speaker: "Viaggiatore", line: "Grazie. È occupato questo posto?" },
      { speaker: "Passeggero", line: "No, si accomodi!" },
    ],
    grammar: {
      title: "Telling the Time",
      points: [
        { italian: "Sono le tre", english: "It is three o'clock" },
        { italian: "È mezzogiorno", english: "It is noon" },
        { italian: "Alle otto e mezza", english: "At half past eight" },
        { italian: "A che ora?", english: "At what time?" },
      ],
      note: "Italians use the 24-hour clock for transport. \"Sono le tredici\" = 1 PM. For times, always use \"sono le\" except for 1 o'clock: \"è l'una\".",
    },
    aiPrompt: "You are an Italian tutor playing a train station ticket agent and fellow passenger in Italy. The student is buying a train ticket and finding their seat. Use lesson 10 vocabulary: biglietto, andata e ritorno, binario, occupato, orario, ritardo. Correct gently.",
  },
  {
    id: 11,
    title: "At the Market",
    subtitle: "Al Mercato",
    free: false,
    keywords: [
      { italian: "Quanto pesa?", english: "How much does it weigh?" },
      { italian: "Un chilo di…", english: "A kilo of…" },
      { italian: "Fresco / di stagione", english: "Fresh / in season" },
      { italian: "Me ne dà mezzo chilo", english: "Give me half a kilo" },
      { italian: "Basta così", english: "That's enough / that's all" },
      { italian: "Il resto", english: "The change" },
    ],
    dialogue: [
      { speaker: "Cliente", line: "Buongiorno! Questi pomodori sono freschi?" },
      { speaker: "Venditore", line: "Freschissimi! Di stagione. Quanti ne vuole?" },
      { speaker: "Cliente", line: "Me ne dà un chilo, per favore." },
      { speaker: "Cliente", line: "E anche mezzo chilo di mozzarella." },
      { speaker: "Venditore", line: "Basta così?" },
      { speaker: "Cliente", line: "Sì, grazie. Ecco cinque euro." },
      { speaker: "Venditore", line: "Ecco il resto. Grazie, a presto!" },
    ],
    grammar: {
      title: "Ne — The Partitive Pronoun",
      points: [
        { italian: "Ne voglio un chilo", english: "I want a kilo of it" },
        { italian: "Me ne dà due?", english: "Can you give me two of them?" },
        { italian: "Non ne ho", english: "I don't have any" },
        { italian: "Quanti ne vuole?", english: "How many do you want?" },
      ],
      note: "\"Ne\" replaces a noun with a quantity. It has no direct English equivalent but means roughly \"of it\" or \"of them\". Italians use it constantly.",
    },
    aiPrompt: "You are an Italian tutor playing a market vendor in an Italian outdoor market. The student is buying produce and food. Use lesson 11 vocabulary: quanto pesa, chilo, fresco, stagione, basta così, resto, ne. Be lively and authentic, correct gently.",
  },
  {
    id: 12,
    title: "Emergencies & Health",
    subtitle: "Emergenze e Salute",
    free: false,
    keywords: [
      { italian: "Aiuto!", english: "Help!" },
      { italian: "Ho bisogno di un medico", english: "I need a doctor" },
      { italian: "Mi fa male…", english: "…hurts / is hurting me" },
      { italian: "Chiami un'ambulanza!", english: "Call an ambulance!" },
      { italian: "La farmacia", english: "The pharmacy" },
      { italian: "Sono allergico/a a…", english: "I am allergic to…" },
    ],
    dialogue: [
      { speaker: "Turista", line: "Scusi! Ho bisogno di aiuto." },
      { speaker: "Passante", line: "Cosa succede?" },
      { speaker: "Turista", line: "Mi fa molto male la testa. Ho la febbre." },
      { speaker: "Passante", line: "C'è una farmacia qui vicino." },
      { speaker: "Turista", line: "Sono allergico alla penicillina." },
      { speaker: "Passante", line: "Lo dica al farmacista. Venga, l'accompagno." },
    ],
    grammar: {
      title: "Mi fa male — Expressing Pain",
      points: [
        { italian: "Mi fa male la testa", english: "My head hurts" },
        { italian: "Mi fa male lo stomaco", english: "My stomach hurts" },
        { italian: "Mi fanno male i piedi", english: "My feet hurt (plural)" },
        { italian: "Ho la febbre", english: "I have a fever" },
      ],
      note: "\"Mi fa male\" literally means \"it makes pain to me\". Use \"fa male\" for one thing hurting and \"fanno male\" for multiple body parts.",
    },
    aiPrompt: "You are an Italian tutor helping a student practice emergency and health vocabulary from lesson 12. Role-play as a helpful local Italian. Use: aiuto, medico, mi fa male, ambulanza, farmacia, allergico. Be calm and reassuring, correct gently.",
  },
  {
    id: 13,
    title: "At the Pharmacy",
    subtitle: "In Farmacia",
    free: false,
    keywords: [
      { italian: "Ho bisogno di…", english: "I need…" },
      { italian: "Una ricetta", english: "A prescription" },
      { italian: "Il mal di testa", english: "Headache" },
      { italian: "La tosse", english: "A cough" },
      { italian: "Qualcosa per…", english: "Something for…" },
      { italian: "Quante volte al giorno?", english: "How many times a day?" },
    ],
    dialogue: [
      { speaker: "Cliente", line: "Buongiorno. Ho bisogno di qualcosa per il mal di testa." },
      { speaker: "Farmacista", line: "Ha la ricetta?" },
      { speaker: "Cliente", line: "No, è senza ricetta." },
      { speaker: "Farmacista", line: "Allora le do queste compresse. Due volte al giorno." },
      { speaker: "Cliente", line: "Grazie. Ho anche la tosse." },
      { speaker: "Farmacista", line: "Prenda questo sciroppo, tre volte al giorno dopo i pasti." },
    ],
    grammar: {
      title: "Imperativo — Giving Instructions",
      points: [
        { italian: "Prenda queste pillole", english: "Take these pills (formal command)" },
        { italian: "Beva molta acqua", english: "Drink plenty of water" },
        { italian: "Riposi a casa", english: "Rest at home" },
        { italian: "Torni domani", english: "Come back tomorrow" },
      ],
      note: "The formal imperative (Lei form) is used by professionals like doctors and pharmacists. It sounds like the third person singular — just remember it's a polite command.",
    },
    aiPrompt: "You are an Italian tutor playing a pharmacist in Italy. The student needs medication and advice. Use lesson 13 vocabulary: bisogno, ricetta, mal di testa, tosse, qualcosa per, volte al giorno. Be professional and helpful, correct gently, keep it real.",
  },
  {
    id: 14,
    title: "Making a Phone Call",
    subtitle: "Al Telefono",
    free: false,
    keywords: [
      { italian: "Pronto!", english: "Hello! (answering the phone)" },
      { italian: "Con chi parlo?", english: "Who am I speaking with?" },
      { italian: "Posso parlare con…?", english: "Can I speak with…?" },
      { italian: "Un momento", english: "One moment" },
      { italian: "Richiamare", english: "To call back" },
      { italian: "È occupato", english: "The line is busy" },
    ],
    dialogue: [
      { speaker: "A", line: "Pronto?" },
      { speaker: "B", line: "Buongiorno! Posso parlare con la signora Bianchi?" },
      { speaker: "A", line: "Sono io. Con chi parlo?" },
      { speaker: "B", line: "Sono Marco Rossi, chiamo per la prenotazione." },
      { speaker: "A", line: "Un momento, la metto in attesa." },
      { speaker: "B", line: "Grazie." },
      { speaker: "A", line: "Mi dispiace, la linea è occupata. Può richiamare?" },
      { speaker: "B", line: "Certo, richiamo più tardi. Grazie!" },
    ],
    grammar: {
      title: "Potere + Infinitive — Asking Permission",
      points: [
        { italian: "Posso richiamare?", english: "Can I call back?" },
        { italian: "Può aspettare?", english: "Can you wait? (formal)" },
        { italian: "Possiamo parlare?", english: "Can we talk?" },
        { italian: "Non posso sentire", english: "I can't hear" },
      ],
      note: "On the phone, Italians always say \"Pronto!\" when answering — it literally means \"ready\" and has been the standard phone greeting for over a century.",
    },
    aiPrompt: "You are an Italian tutor role-playing phone call scenarios with the student. Use lesson 14 vocabulary: pronto, con chi parlo, posso parlare con, un momento, richiamare, occupato. Practice both answering and making calls. Correct gently and keep it natural.",
  },
  {
    id: 15,
    title: "At the Post Office",
    subtitle: "All'Ufficio Postale",
    free: false,
    keywords: [
      { italian: "Spedire un pacco", english: "To send a parcel" },
      { italian: "Una lettera / una busta", english: "A letter / an envelope" },
      { italian: "Per via aerea", english: "By airmail" },
      { italian: "Quanto ci vuole?", english: "How long does it take?" },
      { italian: "Il francobollo", english: "The stamp" },
      { italian: "Raccomandata", english: "Registered mail" },
    ],
    dialogue: [
      { speaker: "Cliente", line: "Buongiorno! Vorrei spedire questo pacco in Inghilterra." },
      { speaker: "Impiegato", line: "Per via aerea o normale?" },
      { speaker: "Cliente", line: "Aerea. Quanto ci vuole?" },
      { speaker: "Impiegato", line: "Circa cinque giorni lavorativi." },
      { speaker: "Cliente", line: "Va bene. E vorrei anche tre francobolli." },
      { speaker: "Impiegato", line: "Vuole la raccomandata per il pacco?" },
      { speaker: "Cliente", line: "Sì, meglio. Quanto costa in tutto?" },
    ],
    grammar: {
      title: "Ci vuole / Ci vogliono — It takes",
      points: [
        { italian: "Ci vuole un'ora", english: "It takes one hour" },
        { italian: "Ci vogliono tre giorni", english: "It takes three days" },
        { italian: "Quanto ci vuole?", english: "How long does it take?" },
        { italian: "Ci vuole pazienza!", english: "It takes patience!" },
      ],
      note: "\"Ci vuole\" is one of those perfectly practical Italian expressions — use it any time you want to say how long something takes or what is required.",
    },
    aiPrompt: "You are an Italian tutor playing a post office clerk in Italy. The student needs to send mail and parcels. Use lesson 15 vocabulary: spedire, pacco, lettera, aerea, francobollo, raccomandata, ci vuole. Be helpful and patient, correct gently.",
  },
  {
    id: 16,
    title: "Renting a Car",
    subtitle: "Noleggiare un'Auto",
    free: false,
    keywords: [
      { italian: "Noleggiare un'auto", english: "To rent a car" },
      { italian: "La patente", english: "The driving licence" },
      { italian: "Il pieno", english: "Full tank" },
      { italian: "L'assicurazione", english: "The insurance" },
      { italian: "Quanti chilometri?", english: "How many kilometres?" },
      { italian: "Riconsegnare", english: "To return (the car)" },
    ],
    dialogue: [
      { speaker: "Cliente", line: "Buongiorno! Vorrei noleggiare un'auto per tre giorni." },
      { speaker: "Agente", line: "Certo. Ha la patente con sé?" },
      { speaker: "Cliente", line: "Sì, eccola. L'assicurazione è inclusa?" },
      { speaker: "Agente", line: "Sì, quella base è inclusa. Vuole quella completa?" },
      { speaker: "Cliente", line: "Sì, meglio. Il serbatoio è pieno?" },
      { speaker: "Agente", line: "Sì, e deve riconsegnare l'auto col pieno." },
      { speaker: "Cliente", line: "Capito. I chilometri sono illimitati?" },
      { speaker: "Agente", line: "Sì, nessun limite." },
    ],
    grammar: {
      title: "Dovere — Must / To have to",
      points: [
        { italian: "Devo riconsegnare l'auto", english: "I must return the car" },
        { italian: "Deve avere la patente", english: "You must have a licence (formal)" },
        { italian: "Dobbiamo fare il pieno", english: "We must fill the tank" },
        { italian: "Non devo dimenticare", english: "I must not forget" },
      ],
      note: "\"Dovere\" expresses obligation — pair it with an infinitive. It's one of the three key modal verbs in Italian: potere (can), volere (want), dovere (must).",
    },
    aiPrompt: "You are an Italian tutor playing a car rental agent in Italy. The student is renting a car. Use lesson 16 vocabulary: noleggiare, patente, pieno, assicurazione, chilometri, riconsegnare, dovere. Be professional and clear, correct gently.",
  },
  {
    id: 17,
    title: "At the Beach",
    subtitle: "In Spiaggia",
    free: false,
    keywords: [
      { italian: "Un ombrellone", english: "A beach umbrella" },
      { italian: "Una sdraio", english: "A sun lounger" },
      { italian: "La crema solare", english: "Sun cream" },
      { italian: "Il mare è mosso", english: "The sea is rough" },
      { italian: "Fare il bagno", english: "To swim / go in the water" },
      { italian: "Che caldo!", english: "It's so hot!" },
    ],
    dialogue: [
      { speaker: "Turista", line: "Buongiorno! Vorrei un ombrellone e due sdraio." },
      { speaker: "Bagnino", line: "Certo! Prima fila o seconda?" },
      { speaker: "Turista", line: "Seconda va bene. Si può fare il bagno?" },
      { speaker: "Bagnino", line: "Sì, il mare è calmo oggi. Attenzione però al sole — che caldo!" },
      { speaker: "Turista", line: "Sì! Ha una crema solare da comprare?" },
      { speaker: "Bagnino", line: "Sì, al chiosco là. Buona giornata!" },
    ],
    grammar: {
      title: "Fare — The Verb \"To Do / To Make\"",
      points: [
        { italian: "Fare il bagno", english: "To have a swim" },
        { italian: "Fare una passeggiata", english: "To go for a walk" },
        { italian: "Fa caldo / fa freddo", english: "It's hot / it's cold (weather)" },
        { italian: "Cosa fai?", english: "What are you doing?" },
      ],
      note: "\"Fare\" is one of the most versatile Italian verbs. It appears in dozens of fixed expressions — weather, activities, actions. Learn these phrases as blocks.",
    },
    aiPrompt: "You are an Italian tutor playing a beach attendant in Italy. The student is spending a day at the beach. Use lesson 17 vocabulary: ombrellone, sdraio, crema solare, mare mosso, fare il bagno, caldo, fare. Be relaxed and sunny, correct gently.",
  },
  {
    id: 18,
    title: "Talking About Family",
    subtitle: "La Famiglia",
    free: false,
    keywords: [
      { italian: "Il marito / la moglie", english: "Husband / wife" },
      { italian: "I figli", english: "The children" },
      { italian: "Il fratello / la sorella", english: "Brother / sister" },
      { italian: "I genitori", english: "The parents" },
      { italian: "Sei sposato/a?", english: "Are you married?" },
      { italian: "Hai figli?", english: "Do you have children?" },
    ],
    dialogue: [
      { speaker: "A", line: "Sei sposato?" },
      { speaker: "B", line: "Sì, ho una moglie e due figli. E tu?" },
      { speaker: "A", line: "Sono fidanzata. Ci sposiamo l'anno prossimo!" },
      { speaker: "B", line: "Congratulazioni! Hai fratelli o sorelle?" },
      { speaker: "A", line: "Ho una sorella. I miei genitori vivono a Napoli." },
      { speaker: "B", line: "Bella città! La mia famiglia è di Roma." },
    ],
    grammar: {
      title: "Possessives — My, Your, His/Her",
      points: [
        { italian: "Mio marito / mia moglie", english: "My husband / my wife" },
        { italian: "I miei figli", english: "My children" },
        { italian: "Tuo fratello", english: "Your brother" },
        { italian: "La sua famiglia", english: "His/her family" },
      ],
      note: "Italian possessives agree in gender and number with the noun, not the owner. \"Mio fratello\" and \"mia sorella\" — the word changes, not because of who owns it, but because of what is owned.",
    },
    aiPrompt: "You are an Italian tutor having a friendly conversation about family with the student. Use lesson 18 vocabulary: marito, moglie, figli, fratello, sorella, genitori, sposato, possessives. Be warm and curious, correct gently, keep it natural.",
  },
  {
    id: 19,
    title: "At the Doctor",
    subtitle: "Dal Medico",
    free: false,
    keywords: [
      { italian: "Ho un appuntamento", english: "I have an appointment" },
      { italian: "Da quanto tempo?", english: "Since when / how long?" },
      { italian: "Ho la nausea", english: "I feel nauseous" },
      { italian: "La pressione", english: "Blood pressure" },
      { italian: "Fare una visita", english: "To have a check-up" },
      { italian: "La diagnosi", english: "The diagnosis" },
    ],
    dialogue: [
      { speaker: "Paziente", line: "Buongiorno, ho un appuntamento con il dottor Marini." },
      { speaker: "Receptionist", line: "Prego, si accomodi. Come si sente?" },
      { speaker: "Paziente", line: "Non molto bene. Ho mal di stomaco e la nausea." },
      { speaker: "Dottore", line: "Da quanto tempo ha questi sintomi?" },
      { speaker: "Paziente", line: "Da due giorni. Ho anche un po' di febbre." },
      { speaker: "Dottore", line: "Le misuro la pressione. Respiri profondamente." },
      { speaker: "Dottore", line: "Non è grave. Le scrivo una ricetta." },
    ],
    grammar: {
      title: "Da — Since / For (time)",
      points: [
        { italian: "Da due giorni", english: "For two days (ongoing)" },
        { italian: "Da quanto tempo?", english: "How long? / Since when?" },
        { italian: "Vivo qui da un anno", english: "I've lived here for a year" },
        { italian: "Da stamattina", english: "Since this morning" },
      ],
      note: "In Italian, \"da\" + present tense describes something that started in the past and is still happening. English uses \"for\" or \"since\" + past tense. This is one of the most common mistakes learners make.",
    },
    aiPrompt: "You are an Italian tutor playing a doctor in Italy. The student is at a medical appointment. Use lesson 19 vocabulary: appuntamento, da quanto tempo, nausea, pressione, visita, diagnosi, da + time. Be calm and professional, correct gently.",
  },
  {
    id: 20,
    title: "Going Out at Night",
    subtitle: "Uscire la Sera",
    free: false,
    keywords: [
      { italian: "Andiamo a ballare?", english: "Shall we go dancing?" },
      { italian: "Un locale", english: "A venue / club / bar" },
      { italian: "C'è la fila", english: "There's a queue" },
      { italian: "Offro io", english: "It's on me / my treat" },
      { italian: "Fare tardi", english: "To stay out late" },
      { italian: "Che serata!", english: "What a night!" },
    ],
    dialogue: [
      { speaker: "A", line: "Allora, andiamo a ballare stasera?" },
      { speaker: "B", line: "Sì! Conosco un bel locale in centro." },
      { speaker: "A", line: "C'è la fila di solito?" },
      { speaker: "B", line: "A volte sì, ma entriamo con la lista." },
      { speaker: "A", line: "Perfetto. Prendiamo qualcosa prima?" },
      { speaker: "B", line: "Certo! Un aperitivo — offro io!" },
      { speaker: "A", line: "Grazie! Che serata!" },
    ],
    grammar: {
      title: "Andare — To Go (+ places)",
      points: [
        { italian: "Vado al bar", english: "I'm going to the bar" },
        { italian: "Andiamo a ballare", english: "Let's go dancing" },
        { italian: "Vai a casa?", english: "Are you going home?" },
        { italian: "Va bene!", english: "It's fine! / OK! (literally: it goes well)" },
      ],
      note: "\"Andiamo\" (let's go) is one of the most useful words in Italian social life. \"Va bene\" is used constantly — you'll hear it dozens of times a day in Italy.",
    },
    aiPrompt: "You are an Italian tutor playing a friend planning a night out in Italy. Use lesson 20 vocabulary: ballare, locale, fila, offro io, fare tardi, che serata, andare. Be energetic and fun, correct gently, keep it lively.",
  },
  {
    id: 21,
    title: "Food & Cooking",
    subtitle: "Cibo e Cucina",
    free: false,
    keywords: [
      { italian: "La ricetta", english: "The recipe" },
      { italian: "Gli ingredienti", english: "The ingredients" },
      { italian: "Cuocere / cucinare", english: "To cook" },
      { italian: "Aggiungere", english: "To add" },
      { italian: "Mescolare", english: "To stir / mix" },
      { italian: "È pronto!", english: "It's ready!" },
    ],
    dialogue: [
      { speaker: "A", line: "Stai cucinando? Che profumo!" },
      { speaker: "B", line: "Sto facendo la pasta al pomodoro. Vuoi la ricetta?" },
      { speaker: "A", line: "Sì! Quali ingredienti usi?" },
      { speaker: "B", line: "Pomodori freschi, aglio, basilico e olio d'oliva." },
      { speaker: "A", line: "Semplice! Quanto ci vuole?" },
      { speaker: "B", line: "Venti minuti. Aggiungi il sale, mescola e aspetta." },
      { speaker: "A", line: "È pronto? Ho fame!" },
    ],
    grammar: {
      title: "Stare + Gerundio — Present Continuous",
      points: [
        { italian: "Sto cucinando", english: "I am cooking (right now)" },
        { italian: "Sta mangiando", english: "He/she is eating" },
        { italian: "Stiamo aspettando", english: "We are waiting" },
        { italian: "Cosa stai facendo?", english: "What are you doing?" },
      ],
      note: "Italian has a present continuous formed with \"stare\" + gerund (-ando/-endo). Use it for things happening right now. For general habits, just use the present tense.",
    },
    aiPrompt: "You are an Italian tutor playing a friend cooking an Italian meal and sharing the recipe. Use lesson 21 vocabulary: ricetta, ingredienti, cucinare, aggiungere, mescolare, pronto, stare + gerund. Be enthusiastic about food, correct gently.",
  },
  {
    id: 22,
    title: "At the Bank",
    subtitle: "In Banca",
    free: false,
    keywords: [
      { italian: "Aprire un conto", english: "To open an account" },
      { italian: "Il bancomat", english: "ATM / debit card" },
      { italian: "Prelevare", english: "To withdraw" },
      { italian: "Il tasso di cambio", english: "The exchange rate" },
      { italian: "Fare un bonifico", english: "To make a bank transfer" },
      { italian: "Lo sportello", english: "The counter / window" },
    ],
    dialogue: [
      { speaker: "Cliente", line: "Buongiorno. Vorrei prelevare dei contanti." },
      { speaker: "Impiegato", line: "Si accomodi allo sportello tre." },
      { speaker: "Cliente", line: "Grazie. Qual è il tasso di cambio oggi?" },
      { speaker: "Impiegato", line: "Per la sterlina, è uno virgola diciassette." },
      { speaker: "Cliente", line: "Bene. Posso anche fare un bonifico?" },
      { speaker: "Impiegato", line: "Certo. Ha il codice IBAN del destinatario?" },
      { speaker: "Cliente", line: "Sì, eccolo." },
    ],
    grammar: {
      title: "Numbers: Hundreds & Thousands",
      points: [
        { italian: "Cento / duecento", english: "One hundred / two hundred" },
        { italian: "Mille / duemila", english: "One thousand / two thousand" },
        { italian: "Un milione", english: "One million" },
        { italian: "Virgola", english: "Decimal point (comma in Italian)" },
      ],
      note: "In Italian, decimals use a comma, not a point: \"1,17\" is read as \"uno virgola diciassette\". Thousands use a period: \"1.000\" = one thousand. The opposite of English!",
    },
    aiPrompt: "You are an Italian tutor playing a bank teller in Italy. The student needs to handle banking tasks. Use lesson 22 vocabulary: conto, bancomat, prelevare, tasso di cambio, bonifico, sportello, numbers. Be precise and professional, correct gently.",
  },
  {
    id: 23,
    title: "Making Plans",
    subtitle: "Fare Programmi",
    free: false,
    keywords: [
      { italian: "Sei libero/a?", english: "Are you free?" },
      { italian: "Che ne dici di…?", english: "What do you think about…?" },
      { italian: "Mi va!", english: "I'm up for it! / Sounds good!" },
      { italian: "Ci vediamo", english: "See you / let's meet" },
      { italian: "Rimandare", english: "To postpone" },
      { italian: "Non vedo l'ora!", english: "I can't wait!" },
    ],
    dialogue: [
      { speaker: "A", line: "Sei libera sabato?" },
      { speaker: "B", line: "Sì! Che ne dici di andare al museo?" },
      { speaker: "A", line: "Mi va! A che ora ci vediamo?" },
      { speaker: "B", line: "Alle dieci davanti all'ingresso?" },
      { speaker: "A", line: "Perfetto. Non vedo l'ora!" },
      { speaker: "B", line: "Anch'io! Ah, e dopo pranziamo insieme?" },
      { speaker: "A", line: "Certo! Conosco un ottimo posto." },
    ],
    grammar: {
      title: "Future Tense — Quick & Easy",
      points: [
        { italian: "Andrò al museo", english: "I will go to the museum" },
        { italian: "Sarà divertente", english: "It will be fun" },
        { italian: "Ci vediamo domani", english: "See you tomorrow (present used for near future)" },
        { italian: "Cosa farai?", english: "What will you do?" },
      ],
      note: "Italians often use the present tense for near-future plans — just like English. \"Domani vado al cinema\" (Tomorrow I'm going to the cinema) is more natural than the actual future tense in everyday speech.",
    },
    aiPrompt: "You are an Italian tutor playing a friend making weekend plans with the student. Use lesson 23 vocabulary: libero, che ne dici, mi va, ci vediamo, rimandare, non vedo l'ora, future tense. Be friendly and spontaneous, correct gently.",
  },
  {
    id: 24,
    title: "Talking About the Weather",
    subtitle: "Il Tempo",
    free: false,
    keywords: [
      { italian: "Che tempo fa?", english: "What's the weather like?" },
      { italian: "Piove / nevica", english: "It's raining / snowing" },
      { italian: "C'è il sole", english: "It's sunny" },
      { italian: "Afoso", english: "Humid / muggy" },
      { italian: "Le previsioni", english: "The forecast" },
      { italian: "Portare un ombrello", english: "To bring an umbrella" },
    ],
    dialogue: [
      { speaker: "A", line: "Che tempo fa oggi?" },
      { speaker: "B", line: "È nuvoloso stamattina, ma nel pomeriggio c'è il sole." },
      { speaker: "A", line: "E domani? Hai visto le previsioni?" },
      { speaker: "B", line: "Sì, piove di mattina. Porta l'ombrello!" },
      { speaker: "A", line: "Che peccato. Volevo andare al mare." },
      { speaker: "B", line: "Va meglio il weekend. Fa caldo e c'è il sole." },
      { speaker: "A", line: "Ottimo! Andiamo sabato allora." },
    ],
    grammar: {
      title: "Imperfetto — The Past (habits & descriptions)",
      points: [
        { italian: "Volevo andare al mare", english: "I wanted to go to the beach" },
        { italian: "Faceva caldo", english: "It was hot (description in the past)" },
        { italian: "Quando ero piccolo…", english: "When I was young…" },
        { italian: "Di solito prendevo…", english: "I used to take…" },
      ],
      note: "The imperfetto is used for past habits, descriptions, and ongoing states. Think of it as the \"used to\" or \"was doing\" tense — softer and more descriptive than the passato prossimo.",
    },
    aiPrompt: "You are an Italian tutor having a conversation about the weather and making plans based on it. Use lesson 24 vocabulary: che tempo fa, piove, nevica, sole, afoso, previsioni, ombrello, imperfetto. Be conversational and natural, correct gently.",
  },
];

// ── Text-to-Speech ────────────────────────────────────────────────────────────
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

// ── Icons (inline SVG) ────────────────────────────────────────────────────────
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6" />
  </svg>
);
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

// ── AI Chat Component ─────────────────────────────────────────────────────────
function AiChat({ lesson }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Ciao! Pronto a praticare la lezione "${lesson.title}"? Iniziamo! 😊` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: lesson.aiPrompt,
          messages: [...messages, userMsg],
        }),
      });
      const data = await response.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Connection error. Please try again!";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again!" }]);
    }
    setLoading(false);
  }

  return (
    <div style={styles.chatWrap}>
      <div style={styles.chatHeader}>
        <span style={styles.chatHeaderDot} />
        AI Practice — {lesson.title}
      </div>
      <div style={styles.chatMessages}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={m.role === "user" ? styles.bubbleUser : styles.bubbleAI}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
            <div style={styles.bubbleAI}>
              <span style={styles.typingDots}>●&nbsp;●&nbsp;●</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={styles.chatInput}>
        <input
          style={styles.chatInputField}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type in Italian…"
        />
        <button style={styles.chatSend} onClick={sendMessage} disabled={loading}>
          {loading ? "…" : "→"}
        </button>
      </div>
    </div>
  );
}

// ── Lesson View ───────────────────────────────────────────────────────────────
function LessonView({ lesson, onBack }) {
  const [step, setStep] = useState(0); // 0=keywords, 1=dialogue, 2=grammar, 3=ai
  const [kwIndex, setKwIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const steps = ["Words", "Dialogue", "Grammar", "AI Practice"];

  return (
    <div style={styles.lessonWrap}>
      {/* Back */}
      <button style={styles.backBtn} onClick={onBack}>← All Lessons</button>

      {/* Lesson title */}
      <div style={styles.lessonHeader}>
        <span style={styles.lessonNum}>Lesson {lesson.id}</span>
        <h2 style={styles.lessonTitle}>{lesson.title}</h2>
        <p style={styles.lessonSubtitle}>{lesson.subtitle}</p>
      </div>

      {/* Step tabs */}
      <div style={styles.tabs}>
        {steps.map((s, i) => (
          <button key={i} style={i === step ? styles.tabActive : styles.tab} onClick={() => { setStep(i); setKwIndex(0); setFlipped(false); }}>
            {s}
          </button>
        ))}
      </div>

      {/* ── KEYWORDS ── */}
      {step === 0 && (
        <div style={styles.card}>
          <div style={styles.kwCount}>{kwIndex + 1} / {lesson.keywords.length}</div>
          <div style={styles.kwItalian}>{lesson.keywords[kwIndex].italian}</div>
          <div style={styles.kwEnglish}>{lesson.keywords[kwIndex].english}</div>
          <button style={styles.speakBtn} onClick={() => speak(lesson.keywords[kwIndex].italian)}>
            <PlayIcon /> Listen
          </button>
          <div style={styles.kwNav}>
            <button style={styles.navBtn} onClick={() => setKwIndex(i => Math.max(0, i - 1))} disabled={kwIndex === 0}>‹</button>
            <button style={styles.navBtn} onClick={() => setKwIndex(i => Math.min(lesson.keywords.length - 1, i + 1))} disabled={kwIndex === lesson.keywords.length - 1}>›</button>
          </div>
          {kwIndex === lesson.keywords.length - 1 && (
            <button style={styles.nextStepBtn} onClick={() => setStep(1)}>
              Next: Dialogue <ChevronRight />
            </button>
          )}
        </div>
      )}

      {/* ── DIALOGUE ── */}
      {step === 1 && (
        <div style={styles.card}>
          <h3 style={styles.sectionLabel}>Dialogue</h3>
          <div style={styles.dialogueWrap}>
            {lesson.dialogue.map((line, i) => (
              <div key={i} style={styles.dialogueLine}>
                <span style={styles.dialogueSpeaker}>{line.speaker}</span>
                <span style={styles.dialogueText}>{line.line}</span>
                <button style={styles.speakSmall} onClick={() => speak(line.line)} title="Listen">
                  <PlayIcon />
                </button>
              </div>
            ))}
          </div>
          <button style={styles.speakBtn} onClick={() => lesson.dialogue.forEach((l, i) => setTimeout(() => speak(l.line), i * 2200))}>
            <PlayIcon /> Listen All
          </button>
          <button style={styles.nextStepBtn} onClick={() => setStep(2)}>
            Next: Grammar <ChevronRight />
          </button>
        </div>
      )}

      {/* ── GRAMMAR FLASHCARD ── */}
      {step === 2 && (
        <div style={styles.card}>
          <h3 style={styles.sectionLabel}>Grammar</h3>
          <div style={{ ...styles.flashcard, ...(flipped ? styles.flashcardFlipped : {}) }} onClick={() => setFlipped(f => !f)}>
            {!flipped ? (
              <div>
                <div style={styles.flashFront}>{lesson.grammar.title}</div>
                <div style={styles.flashHint}>Tap to see examples</div>
              </div>
            ) : (
              <div>
                {lesson.grammar.points.map((p, i) => (
                  <div key={i} style={styles.grammarRow}>
                    <span style={styles.grammarIT}>{p.italian}</span>
                    <span style={styles.grammarEN}>{p.english}</span>
                  </div>
                ))}
                <div style={styles.grammarNote}>{lesson.grammar.note}</div>
              </div>
            )}
          </div>
          <button style={styles.nextStepBtn} onClick={() => setStep(3)}>
            Next: AI Practice <ChevronRight />
          </button>
        </div>
      )}

      {/* ── AI CHAT ── */}
      {step === 3 && <AiChat lesson={lesson} />}
    </div>
  );
}

// ── Home / Lesson List ────────────────────────────────────────────────────────
function Home({ onSelect }) {
  return (
    <div style={styles.home}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroTag}>Crash Course · Learn Fast · Only What You Need</div>
        <h1 style={styles.heroTitle}>Italia<span style={styles.heroAccent}>Viva</span></h1>
        <p style={styles.heroSub}>
          Situational Italian in minutes — real conversations, essential grammar, nothing extra.
        </p>
      </div>

      {/* Lessons */}
      <div style={styles.lessonList}>
        <h3 style={styles.listHeading}>Module 1 — Travel · Viaggiare</h3>
        {LESSONS.map(lesson => (
          <div key={lesson.id} style={styles.lessonCard} onClick={() => onSelect(lesson)}>
            <div style={styles.lessonCardLeft}>
              <span style={styles.lessonCardNum}>{lesson.id < 10 ? `0${lesson.id}` : lesson.id}</span>
              <div>
                <div style={styles.lessonCardTitle}>{lesson.title}</div>
                <div style={styles.lessonCardSub}>{lesson.subtitle}</div>
              </div>
            </div>
            <div style={styles.lessonCardRight}>
              {lesson.free
                ? <span style={styles.freeBadge}>Gratis</span>
                : <span style={styles.lockBadge}><LockIcon /> €3/mo</span>}
              <ChevronRight />
            </div>
          </div>
        ))}
      </div>

      {/* Pricing nudge */}
      <div style={styles.pricingBox}>
        <div style={styles.pricingTitle}>Unlock the Full Course</div>
        <p style={styles.pricingText}>
          All 24 lessons, AI conversation practice, and grammar flashcards.
        </p>
        <div style={styles.pricingOptions}>
          <div style={styles.pricingOpt}>
            <span style={styles.pricingPrice}>$3</span>
            <span style={styles.pricingPer}>/month</span>
          </div>
          <div style={styles.pricingDivider}>or</div>
          <div style={styles.pricingOpt}>
            <span style={styles.pricingPrice}>$30</span>
            <span style={styles.pricingPer}>/year</span>
            <span style={styles.pricingSave}>Save 17%</span>
          </div>
          <div style={styles.pricingDivider}>or</div>
          <div style={styles.pricingOpt}>
            <span style={styles.pricingPrice}>$49</span>
            <span style={styles.pricingPer}>lifetime</span>
            <span style={styles.pricingSaveBest}>Best Value</span>
          </div>
        </div>
        <button style={styles.ctaBtn}>Start Now →</button>
        <div style={styles.giftLink}>🎁 Give as a gift — <span style={styles.giftLinkText}>Buy a gift card</span></div>
      </div>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeLesson, setActiveLesson] = useState(null);

  return (
    <div style={styles.shell}>
      <div style={styles.container}>
        {activeLesson
          ? <LessonView lesson={activeLesson} onBack={() => setActiveLesson(null)} />
          : <Home onSelect={setActiveLesson} />}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const C = {
  cream: "#FAF7F2",
  sand:  "#EDE8DF",
  terracotta: "#C4622D",
  terracottaLight: "#E8835A",
  brown: "#3D2B1F",
  brownMid: "#6B4C3B",
  gold:  "#B8860B",
  white: "#FFFFFF",
  offWhite: "#F5F0E8",
  border: "#D9D0C4",
  textMuted: "#9A8A7A",
};

const styles = {
  shell: {
    minHeight: "100vh",
    background: C.cream,
    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
    color: C.brown,
  },
  container: {
    maxWidth: 560,
    margin: "0 auto",
    padding: "0 16px 60px",
  },

  // ── Home ──
  home: {},
  hero: {
    textAlign: "center",
    padding: "48px 16px 32px",
    borderBottom: `1px solid ${C.border}`,
    marginBottom: 32,
  },
  heroTag: {
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: C.terracotta,
    marginBottom: 16,
    fontFamily: "'Gill Sans', 'Optima', sans-serif",
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: 700,
    margin: "0 0 12px",
    letterSpacing: "-0.02em",
    lineHeight: 1,
    color: C.brown,
  },
  heroAccent: {
    color: C.terracotta,
  },
  heroSub: {
    fontSize: 15,
    color: C.brownMid,
    lineHeight: 1.6,
    maxWidth: 360,
    margin: "0 auto",
    fontStyle: "italic",
  },

  listHeading: {
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: C.textMuted,
    marginBottom: 14,
    fontFamily: "'Gill Sans', 'Optima', sans-serif",
    fontWeight: 400,
  },
  lessonList: { marginBottom: 36 },
  lessonCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 20px",
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 4,
    marginBottom: 8,
    cursor: "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  lessonCardLeft: { display: "flex", alignItems: "center", gap: 16 },
  lessonCardNum: {
    fontSize: 22,
    color: C.border,
    fontWeight: 300,
    minWidth: 32,
    fontFamily: "'Palatino Linotype', Georgia, serif",
  },
  lessonCardTitle: { fontSize: 16, fontWeight: 600, color: C.brown, marginBottom: 2 },
  lessonCardSub: { fontSize: 12, color: C.textMuted, fontStyle: "italic" },
  lessonCardRight: { display: "flex", alignItems: "center", gap: 10, color: C.textMuted },
  freeBadge: {
    fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
    background: "#E8F5E9", color: "#2E7D32", padding: "3px 8px", borderRadius: 20,
    fontFamily: "sans-serif",
  },
  lockBadge: {
    fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4,
    fontFamily: "sans-serif",
  },

  pricingBox: {
    background: C.brown,
    borderRadius: 6,
    padding: "32px 28px",
    textAlign: "center",
    color: C.cream,
  },
  pricingTitle: { fontSize: 20, fontWeight: 600, marginBottom: 8 },
  pricingText: { fontSize: 13, color: C.sand, fontStyle: "italic", marginBottom: 24, lineHeight: 1.5 },
  pricingOptions: { display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 24 },
  pricingOpt: { display: "flex", alignItems: "baseline", gap: 4, flexDirection: "column", alignItems: "center" },
  pricingPrice: { fontSize: 32, fontWeight: 700, color: C.white },
  pricingPer: { fontSize: 12, color: C.sand, fontFamily: "sans-serif" },
  pricingSave: {
    fontSize: 10, background: C.terracotta, color: C.white, padding: "2px 7px",
    borderRadius: 10, letterSpacing: "0.06em", fontFamily: "sans-serif",
  },
  pricingSaveBest: {
    fontSize: 10, background: C.gold, color: C.white, padding: "2px 7px",
    borderRadius: 10, letterSpacing: "0.06em", fontFamily: "sans-serif",
  },
  giftLink: {
    marginTop: 16, fontSize: 12, color: C.sand, fontFamily: "sans-serif",
  },
  giftLinkText: {
    color: C.terracottaLight, textDecoration: "underline", cursor: "pointer",
  },
  pricingDivider: { color: C.textMuted, fontSize: 12, fontStyle: "italic" },
  ctaBtn: {
    background: C.terracotta,
    color: C.white,
    border: "none",
    borderRadius: 3,
    padding: "13px 36px",
    fontSize: 14,
    fontFamily: "'Gill Sans', 'Optima', sans-serif",
    letterSpacing: "0.08em",
    cursor: "pointer",
    fontWeight: 600,
  },

  // ── Lesson View ──
  lessonWrap: { paddingTop: 24 },
  backBtn: {
    background: "none", border: "none", color: C.terracotta,
    fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 24,
    fontFamily: "'Gill Sans', 'Optima', sans-serif", letterSpacing: "0.06em",
  },
  lessonHeader: { marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.border}` },
  lessonNum: {
    fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
    color: C.terracotta, fontFamily: "sans-serif", display: "block", marginBottom: 6,
  },
  lessonTitle: { fontSize: 32, fontWeight: 700, margin: "0 0 4px", color: C.brown },
  lessonSubtitle: { fontSize: 15, fontStyle: "italic", color: C.brownMid, margin: 0 },

  tabs: {
    display: "flex", gap: 4, marginBottom: 24,
    background: C.sand, borderRadius: 4, padding: 4,
  },
  tab: {
    flex: 1, padding: "8px 4px", border: "none", background: "none",
    color: C.textMuted, fontSize: 11, cursor: "pointer",
    fontFamily: "'Gill Sans', 'Optima', sans-serif",
    letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 3,
  },
  tabActive: {
    flex: 1, padding: "8px 4px", border: "none",
    background: C.white, color: C.terracotta, fontSize: 11, cursor: "pointer",
    fontFamily: "'Gill Sans', 'Optima', sans-serif",
    letterSpacing: "0.08em", textTransform: "uppercase",
    borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    fontWeight: 600,
  },

  card: {
    background: C.white, border: `1px solid ${C.border}`,
    borderRadius: 6, padding: 28,
  },

  // Keywords
  kwCount: { fontSize: 11, color: C.textMuted, letterSpacing: "0.1em", marginBottom: 24, fontFamily: "sans-serif" },
  kwItalian: { fontSize: 36, fontWeight: 700, color: C.brown, marginBottom: 10, letterSpacing: "-0.01em" },
  kwEnglish: { fontSize: 16, color: C.brownMid, fontStyle: "italic", marginBottom: 24 },
  speakBtn: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: C.cream, border: `1px solid ${C.border}`,
    borderRadius: 3, padding: "9px 18px", cursor: "pointer",
    fontSize: 12, color: C.brownMid,
    fontFamily: "'Gill Sans', 'Optima', sans-serif",
    letterSpacing: "0.06em", marginBottom: 24,
  },
  kwNav: { display: "flex", gap: 10, marginBottom: 8 },
  navBtn: {
    width: 42, height: 42, borderRadius: "50%", border: `1px solid ${C.border}`,
    background: C.cream, cursor: "pointer", fontSize: 20, color: C.brownMid,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  nextStepBtn: {
    marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8,
    background: C.terracotta, color: C.white, border: "none",
    borderRadius: 3, padding: "11px 22px", fontSize: 12, cursor: "pointer",
    fontFamily: "'Gill Sans', 'Optima', sans-serif", letterSpacing: "0.08em",
  },

  // Dialogue
  sectionLabel: {
    fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
    color: C.textMuted, fontFamily: "sans-serif", fontWeight: 400, marginBottom: 20,
  },
  dialogueWrap: { marginBottom: 20 },
  dialogueLine: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 0", borderBottom: `1px solid ${C.sand}`,
  },
  dialogueSpeaker: {
    minWidth: 52, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
    color: C.terracotta, fontFamily: "sans-serif",
  },
  dialogueText: { flex: 1, fontSize: 15, color: C.brown, lineHeight: 1.5 },
  speakSmall: {
    background: "none", border: "none", color: C.textMuted, cursor: "pointer",
    padding: 4, display: "flex", alignItems: "center",
  },

  // Grammar flashcard
  flashcard: {
    background: C.offWhite, border: `1px solid ${C.border}`,
    borderRadius: 6, padding: 28, cursor: "pointer",
    minHeight: 140, marginBottom: 20,
    transition: "background 0.3s",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  flashcardFlipped: { background: C.sand },
  flashFront: { fontSize: 22, fontWeight: 600, color: C.brown, textAlign: "center", marginBottom: 12 },
  flashHint: { fontSize: 11, color: C.textMuted, textAlign: "center", fontStyle: "italic", fontFamily: "sans-serif" },
  grammarRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "8px 0", borderBottom: `1px solid ${C.border}`,
  },
  grammarIT: { fontSize: 15, fontWeight: 600, color: C.brown },
  grammarEN: { fontSize: 13, color: C.brownMid, fontStyle: "italic" },
  grammarNote: { fontSize: 12, color: C.textMuted, marginTop: 14, lineHeight: 1.6, fontStyle: "italic", fontFamily: "sans-serif" },

  // Chat
  chatWrap: {
    background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden",
  },
  chatHeader: {
    background: C.brown, color: C.cream, padding: "14px 20px",
    fontSize: 13, display: "flex", alignItems: "center", gap: 10,
    fontFamily: "'Gill Sans', 'Optima', sans-serif", letterSpacing: "0.04em",
  },
  chatHeaderDot: {
    width: 8, height: 8, borderRadius: "50%", background: C.terracottaLight,
    display: "inline-block",
  },
  chatMessages: {
    padding: 20, minHeight: 260, maxHeight: 340, overflowY: "auto",
    background: C.offWhite,
  },
  bubbleAI: {
    background: C.white, border: `1px solid ${C.border}`,
    borderRadius: "4px 16px 16px 16px", padding: "10px 14px",
    fontSize: 14, color: C.brown, maxWidth: "82%", lineHeight: 1.55,
  },
  bubbleUser: {
    background: C.terracotta, color: C.white,
    borderRadius: "16px 4px 16px 16px", padding: "10px 14px",
    fontSize: 14, maxWidth: "82%", lineHeight: 1.55,
  },
  typingDots: { color: C.textMuted, letterSpacing: 3 },
  chatInput: {
    display: "flex", borderTop: `1px solid ${C.border}`, background: C.white,
  },
  chatInputField: {
    flex: 1, border: "none", outline: "none", padding: "14px 18px",
    fontSize: 14, color: C.brown, background: "transparent",
    fontFamily: "'Palatino Linotype', Georgia, serif",
  },
  chatSend: {
    border: "none", background: C.terracotta, color: C.white,
    width: 52, fontSize: 20, cursor: "pointer",
  },
};
