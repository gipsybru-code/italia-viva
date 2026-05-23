import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL || "https://placeholder.supabase.co",
  typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY || "placeholder"
);

// ── UI Translations ───────────────────────────────────────────────────────────
const UI = {
  en: { flag:"🇬🇧", name:"English", tagline:"Crash Course · Learn Fast · Only What You Need", subtitle:"Situational Italian in minutes — real conversations, essential grammar, nothing extra.", mod1:"Module 1 — Travel · Viaggiare", mod2:"Module 2 — Everyday Life · La Vita Quotidiana", mod3:"Module 3 — Deeper Conversations · Conversazioni Più Profonde", free:"Free", subscribe:"Subscribe", words:"Words", dialogue:"Dialogue", grammar:"Grammar", ai:"AI Practice", listen:"Listen", listenAll:"Listen All", nextDia:"Next: Dialogue", nextGram:"Next: Grammar", nextAI:"Next: AI Practice", tapSee:"Tap to see examples", unlockTitle:"Unlock the Full Course", unlockText:"All 45 lessons, AI conversation practice, and grammar flashcards.", monthly:"Monthly — $3", yearly:"Yearly — $30", lifetime:"Lifetime — $49", login:"Log in", logout:"Log out", manage:"Manage", noAccount:"No account?", signUp:"Sign up free", haveAccount:"Have an account?", forgot:"Forgot password?", sendReset:"Send reset link", resetSent:"Reset link sent — check your email if it is associated with a Parlissimo account.", welcome:"Welcome back", create:"Create account", newPw:"New password", confirmPw:"Confirm new password", updatePw:"Update password", allLessons:"← All Lessons", lesson:"Lesson", typeItalian:"Type in Italian…", aiLimit:"You have reached your 20 message daily limit for this lesson. Come back tomorrow! 🇮🇹", aiSub:"AI conversation practice is unlocked with a subscription. Subscribe from $3/month! 🇮🇹", install:"📲 Add Parlissimo to your home screen for the best experience!", installBtn:"Install App", iosHint:"📲 On iPhone: tap Share ↑ then Add to Home Screen to install Parlissimo!", back:"← Back to Parlissimo", loading:"Loading..." },
  es: { flag:"🇪🇸", name:"Español", tagline:"Curso Intensivo · Aprende Rápido · Solo lo Necesario", subtitle:"Italiano situacional en minutos — conversaciones reales, gramática esencial, nada más.", mod1:"Módulo 1 — Viajes · Viaggiare", mod2:"Módulo 2 — Vida Cotidiana · La Vita Quotidiana", mod3:"Módulo 3 — Conversaciones Profundas · Conversazioni Più Profonde", free:"Gratis", subscribe:"Suscribirse", words:"Palabras", dialogue:"Diálogo", grammar:"Gramática", ai:"Práctica IA", listen:"Escuchar", listenAll:"Escuchar Todo", nextDia:"Siguiente: Diálogo", nextGram:"Siguiente: Gramática", nextAI:"Siguiente: Práctica IA", tapSee:"Toca para ver ejemplos", unlockTitle:"Desbloquea el Curso Completo", unlockText:"45 lecciones, práctica de conversación con IA y tarjetas de gramática.", monthly:"Mensual — $3", yearly:"Anual — $30", lifetime:"De por vida — $49", login:"Iniciar sesión", logout:"Cerrar sesión", manage:"Gestionar", noAccount:"¿Sin cuenta?", signUp:"Regístrate gratis", haveAccount:"¿Ya tienes cuenta?", forgot:"¿Olvidaste tu contraseña?", sendReset:"Enviar enlace", resetSent:"Enlace enviado — revisa tu email si está asociado a una cuenta de Parlissimo.", welcome:"Bienvenido/a", create:"Crear cuenta", newPw:"Nueva contraseña", confirmPw:"Confirmar contraseña", updatePw:"Actualizar contraseña", allLessons:"← Todas las lecciones", lesson:"Lección", typeItalian:"Escribe en italiano…", aiLimit:"Has alcanzado el límite de 20 mensajes diarios. ¡Vuelve mañana! 🇮🇹", aiSub:"La práctica con IA se desbloquea con una suscripción. ¡Suscríbete desde $3/mes! 🇮🇹", install:"📲 ¡Añade Parlissimo a tu pantalla de inicio!", installBtn:"Instalar App", iosHint:"📲 En iPhone: toca Compartir ↑ y luego Añadir a inicio.", back:"← Volver a Parlissimo", loading:"Cargando..." },
  pt: { flag:"🇵🇹", name:"Português", tagline:"Curso Intensivo · Aprenda Rápido · Só o Necessário", subtitle:"Italiano situacional em minutos — conversas reais, gramática essencial, nada mais.", mod1:"Módulo 1 — Viagens · Viaggiare", mod2:"Módulo 2 — Vida Quotidiana · La Vita Quotidiana", mod3:"Módulo 3 — Conversas Profundas · Conversazioni Più Profonde", free:"Grátis", subscribe:"Subscrever", words:"Palavras", dialogue:"Diálogo", grammar:"Gramática", ai:"Prática IA", listen:"Ouvir", listenAll:"Ouvir Tudo", nextDia:"Seguinte: Diálogo", nextGram:"Seguinte: Gramática", nextAI:"Seguinte: Prática IA", tapSee:"Toca para ver exemplos", unlockTitle:"Desbloqueia o Curso Completo", unlockText:"45 lições, prática de conversação com IA e fichas de gramática.", monthly:"Mensal — $3", yearly:"Anual — $30", lifetime:"Vitalício — $49", login:"Entrar", logout:"Sair", manage:"Gerir", noAccount:"Sem conta?", signUp:"Regista-te grátis", haveAccount:"Já tens conta?", forgot:"Esqueceste a senha?", sendReset:"Enviar link", resetSent:"Link enviado — verifica o teu email se estiver associado a uma conta Parlissimo.", welcome:"Bem-vindo/a", create:"Criar conta", newPw:"Nova senha", confirmPw:"Confirmar senha", updatePw:"Atualizar senha", allLessons:"← Todas as lições", lesson:"Lição", typeItalian:"Escreve em italiano…", aiLimit:"Atingiste o limite de 20 mensagens diárias. Volta amanhã! 🇮🇹", aiSub:"A prática com IA é desbloqueada com subscrição. A partir de $3/mês! 🇮🇹", install:"📲 Adiciona Parlissimo ao ecrã inicial!", installBtn:"Instalar App", iosHint:"📲 No iPhone: toca Partilhar ↑ e depois Adicionar ao início.", back:"← Voltar ao Parlissimo", loading:"A carregar..." },
  de: { flag:"🇩🇪", name:"Deutsch", tagline:"Intensivkurs · Schnell lernen · Nur das Wesentliche", subtitle:"Situatives Italienisch in Minuten — echte Gespräche, wesentliche Grammatik.", mod1:"Modul 1 — Reisen · Viaggiare", mod2:"Modul 2 — Alltag · La Vita Quotidiana", mod3:"Modul 3 — Tiefere Gespräche · Conversazioni Più Profonde", free:"Kostenlos", subscribe:"Abonnieren", words:"Wörter", dialogue:"Dialog", grammar:"Grammatik", ai:"KI-Übung", listen:"Anhören", listenAll:"Alles anhören", nextDia:"Weiter: Dialog", nextGram:"Weiter: Grammatik", nextAI:"Weiter: KI-Übung", tapSee:"Tippen für Beispiele", unlockTitle:"Vollzugang freischalten", unlockText:"45 Lektionen, KI-Konversationsübung und Grammatikkarten.", monthly:"Monatlich — $3", yearly:"Jährlich — $30", lifetime:"Lebenslang — $49", login:"Anmelden", logout:"Abmelden", manage:"Verwalten", noAccount:"Kein Konto?", signUp:"Kostenlos registrieren", haveAccount:"Schon ein Konto?", forgot:"Passwort vergessen?", sendReset:"Link senden", resetSent:"Link gesendet — prüfe deine E-Mail wenn sie mit einem Parlissimo-Konto verknüpft ist.", welcome:"Willkommen zurück", create:"Konto erstellen", newPw:"Neues Passwort", confirmPw:"Passwort bestätigen", updatePw:"Passwort aktualisieren", allLessons:"← Alle Lektionen", lesson:"Lektion", typeItalian:"Auf Italienisch schreiben…", aiLimit:"Du hast das Tageslimit von 20 Nachrichten erreicht. Komm morgen wieder! 🇮🇹", aiSub:"KI-Übung wird mit einem Abonnement freigeschaltet. Ab $3/Monat! 🇮🇹", install:"📲 Füge Parlissimo zu deinem Startbildschirm hinzu!", installBtn:"App installieren", iosHint:"📲 Auf iPhone: Teilen ↑ tippen, dann Zum Home-Bildschirm.", back:"← Zurück zu Parlissimo", loading:"Laden..." },
  da: { flag:"🇩🇰", name:"Dansk", tagline:"Intensivkursus · Lær Hurtigt · Kun det Nødvendige", subtitle:"Situationsbestemt italiensk på minutter — rigtige samtaler, vigtig grammatik.", mod1:"Modul 1 — Rejser · Viaggiare", mod2:"Modul 2 — Hverdagsliv · La Vita Quotidiana", mod3:"Modul 3 — Dybere Samtaler · Conversazioni Più Profonde", free:"Gratis", subscribe:"Abonnér", words:"Ord", dialogue:"Dialog", grammar:"Grammatik", ai:"AI Øvelse", listen:"Lyt", listenAll:"Lyt til alt", nextDia:"Næste: Dialog", nextGram:"Næste: Grammatik", nextAI:"Næste: AI Øvelse", tapSee:"Tryk for at se eksempler", unlockTitle:"Lås hele kurset op", unlockText:"45 lektioner, AI-samtaleøvelse og grammatikkort.", monthly:"Månedlig — $3", yearly:"Årlig — $30", lifetime:"Livstid — $49", login:"Log ind", logout:"Log ud", manage:"Administrer", noAccount:"Ingen konto?", signUp:"Tilmeld dig gratis", haveAccount:"Har du allerede en konto?", forgot:"Glemt adgangskode?", sendReset:"Send link", resetSent:"Link sendt — tjek din email hvis den er tilknyttet en Parlissimo-konto.", welcome:"Velkommen tilbage", create:"Opret konto", newPw:"Ny adgangskode", confirmPw:"Bekræft adgangskode", updatePw:"Opdater adgangskode", allLessons:"← Alle lektioner", lesson:"Lektion", typeItalian:"Skriv på italiensk…", aiLimit:"Du har nået grænsen på 20 beskeder om dagen. Kom tilbage i morgen! 🇮🇹", aiSub:"AI-samtaleøvelse låses op med et abonnement. Fra $3/måned! 🇮🇹", install:"📲 Tilføj Parlissimo til din startskærm!", installBtn:"Installer app", iosHint:"📲 På iPhone: tryk Del ↑ og derefter Føj til hjemmeskærm.", back:"← Tilbage til Parlissimo", loading:"Indlæser..." },
  fr: { flag:"🇫🇷", name:"Français", tagline:"Cours Intensif · Apprenez Vite · Seulement l'Essentiel", subtitle:"L'italien situationnel en minutes — vraies conversations, grammaire essentielle.", mod1:"Module 1 — Voyages · Viaggiare", mod2:"Module 2 — Vie Quotidienne · La Vita Quotidiana", mod3:"Module 3 — Conversations Profondes · Conversazioni Più Profonde", free:"Gratuit", subscribe:"S'abonner", words:"Mots", dialogue:"Dialogue", grammar:"Grammaire", ai:"Pratique IA", listen:"Écouter", listenAll:"Tout écouter", nextDia:"Suivant: Dialogue", nextGram:"Suivant: Grammaire", nextAI:"Suivant: Pratique IA", tapSee:"Appuyez pour voir les exemples", unlockTitle:"Débloquer le cours complet", unlockText:"45 leçons, pratique de conversation IA et fiches de grammaire.", monthly:"Mensuel — $3", yearly:"Annuel — $30", lifetime:"À vie — $49", login:"Se connecter", logout:"Se déconnecter", manage:"Gérer", noAccount:"Pas de compte?", signUp:"S'inscrire gratuitement", haveAccount:"Déjà un compte?", forgot:"Mot de passe oublié?", sendReset:"Envoyer le lien", resetSent:"Lien envoyé — vérifiez votre email s'il est associé à un compte Parlissimo.", welcome:"Bon retour", create:"Créer un compte", newPw:"Nouveau mot de passe", confirmPw:"Confirmer le mot de passe", updatePw:"Mettre à jour", allLessons:"← Toutes les leçons", lesson:"Leçon", typeItalian:"Écrivez en italien…", aiLimit:"Vous avez atteint la limite de 20 messages par jour. Revenez demain! 🇮🇹", aiSub:"La pratique IA est débloquée avec un abonnement. À partir de $3/mois! 🇮🇹", install:"📲 Ajoutez Parlissimo à votre écran d'accueil!", installBtn:"Installer l'app", iosHint:"📲 Sur iPhone: appuyez sur Partager ↑ puis Ajouter à l'écran d'accueil.", back:"← Retour à Parlissimo", loading:"Chargement..." },
};
const LANGUAGES = ["en","es","pt","de","da","fr"];


// ── Lesson Data ──────────────────────────────────────────────────────────────
const LESSONS = [
  { id:1, title:"Greetings", subtitle:"Il Saluto", free:true, keywords:[{italian:"Ciao",english:"Hi / Bye (informal)"},{italian:"Salve",english:"Hello (neutral/formal)"},{italian:"Buongiorno",english:"Good morning / Good day"},{italian:"Buonasera",english:"Good evening"},{italian:"Arrivederci",english:"Goodbye (formal)"},{italian:"Tutto bene",english:"All good / Everything's fine"}], dialogue:[{speaker:"A",line:"Buongiorno! Salve.",translation:"Good morning! Hello."},{speaker:"B",line:"Ciao! Come stai?",translation:"Hi! How are you?"},{speaker:"A",line:"Tutto bene, grazie. E tu?",translation:"All good, thank you. And you?"},{speaker:"B",line:"Bene, grazie!",translation:"Well, thank you!"}], grammar:{title:"Come — How / What",points:[{italian:"Come stai?",english:"How are you? (informal)"},{italian:"Come sta?",english:"How are you? (formal)"},{italian:"Come va?",english:"How is it going?"},{italian:"Come?",english:"What? / Pardon?"}],note:"Come literally means how — your go-to word for asking about states and situations."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, but use Italian words and phrases from the lesson. You are an Italian language tutor. The student learned Lesson 1: Greetings. Practice: Ciao, Salve, Buongiorno, Buonasera, Arrivederci, Tutto bene, Come stai, Come va. Be warm and encouraging. Keep responses short."},
  { id:2, title:"Introducing Yourself", subtitle:"Presentarsi", free:false, keywords:[{italian:"Mi chiamo…",english:"My name is…"},{italian:"Sono…",english:"I am…"},{italian:"Piacere",english:"Nice to meet you"},{italian:"Di dove sei?",english:"Where are you from?"},{italian:"Sono di…",english:"I'm from…"},{italian:"Quanti anni hai?",english:"How old are you?"}], dialogue:[{speaker:"A",line:"Ciao! Sono Paolo.",translation:"Hi! I'm Paolo."},{speaker:"B",line:"Ciao, Paolo. Sono Monica. Piacere!",translation:"Hi, Paolo. I'm Monica. Nice to meet you!"},{speaker:"A",line:"Piacere mio. Di dove sei?",translation:"Nice to meet you too. Where are you from?"},{speaker:"B",line:"Sono di Firenze. E tu?",translation:"I'm from Florence. And you?"},{speaker:"A",line:"Sono di Milano.",translation:"I'm from Milan."}], grammar:{title:"Essere — To Be",points:[{italian:"Io sono",english:"I am"},{italian:"Tu sei",english:"You are (informal)"},{italian:"Lei è",english:"You are (formal) / She is"},{italian:"Lui è",english:"He is"},{italian:"Noi siamo",english:"We are"},{italian:"Voi siete",english:"You guys are"},{italian:"Loro sono",english:"They are"}],note:"In Italian you rarely need to say io (I) — the verb ending tells you who is speaking."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor. Practice introductions: Mi chiamo, Sono, Piacere, Di dove sei, Sono di. Correct gently."},
  { id:3, title:"At the Café", subtitle:"Al Bar", free:false, keywords:[{italian:"Un caffè, per favore",english:"A coffee, please"},{italian:"Vorrei…",english:"I would like…"},{italian:"Quanto costa?",english:"How much does it cost?"},{italian:"Il conto",english:"The bill"},{italian:"Un cornetto",english:"A croissant"},{italian:"Grazie mille",english:"Thank you very much"}], dialogue:[{speaker:"Cliente",line:"Buongiorno! Un caffè, per favore.",translation:"Good morning! A coffee, please."},{speaker:"Barista",line:"Subito! Vuole anche un cornetto?",translation:"Right away! Would you like a croissant too?"},{speaker:"Cliente",line:"Sì, grazie. Quanto costa?",translation:"Yes, thank you. How much is it?"},{speaker:"Barista",line:"Un euro e cinquanta, prego.",translation:"One euro fifty, please."},{speaker:"Cliente",line:"Ecco. Grazie mille!",translation:"Here you go. Thank you very much!"}], grammar:{title:"Vorrei — Polite Requests",points:[{italian:"Vorrei un caffè",english:"I would like a coffee"},{italian:"Vorrei il conto",english:"I would like the bill"},{italian:"Vorrei prenotare",english:"I would like to book"},{italian:"Vorrei un tavolo",english:"I would like a table"}],note:"Vorrei is the conditional of volere. More polite than voglio — use it always in shops and restaurants."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a barista. Use lesson 3 vocabulary. Be warm, correct gently."},
  { id:4, title:"At the Gelateria", subtitle:"In Gelateria", free:false, keywords:[{italian:"Un gelato",english:"An ice cream"},{italian:"Che gusti?",english:"Which flavours?"},{italian:"Cono o coppetta?",english:"Cone or cup?"},{italian:"Piccolo / medio / grande",english:"Small / medium / large"},{italian:"Che buono!",english:"How delicious!"},{italian:"Posso assaggiare?",english:"Can I taste?"}], dialogue:[{speaker:"Cliente",line:"Buonasera! Vorrei un gelato.",translation:"Good evening! I would like an ice cream."},{speaker:"Gelataio",line:"Certo! Cono o coppetta?",translation:"Of course! Cone or cup?"},{speaker:"Cliente",line:"Cono, grazie. Posso assaggiare il pistacchio?",translation:"Cone please. Can I taste the pistachio?"},{speaker:"Gelataio",line:"Certo, ecco a lei.",translation:"Of course, here you go."},{speaker:"Cliente",line:"Mmm, che buono! Pistacchio e cioccolato, per favore.",translation:"Mmm, how delicious! Pistachio and chocolate, please."},{speaker:"Gelataio",line:"Piccolo, medio o grande?",translation:"Small, medium or large?"},{speaker:"Cliente",line:"Medio. Quanto costa?",translation:"Medium. How much is it?"},{speaker:"Gelataio",line:"Due euro e cinquanta.",translation:"Two euros fifty."}], grammar:{title:"questo / quello — This / That",points:[{italian:"Questo gelato",english:"This ice cream (nearby)"},{italian:"Quello lì",english:"That one (over there)"},{italian:"Questo è buono",english:"This is good"},{italian:"Qual è il migliore?",english:"Which is the best?"}],note:"Use questo for things close to you and quello for things further away."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a gelateria worker. Use lesson 4 vocabulary. Be playful and warm."},
  { id:5, title:"Asking for Directions", subtitle:"Chiedere la Strada", free:false, keywords:[{italian:"Dov'è…?",english:"Where is…?"},{italian:"A destra",english:"To the right"},{italian:"A sinistra",english:"To the left"},{italian:"Sempre dritto",english:"Straight ahead"},{italian:"Vicino / lontano",english:"Near / far"},{italian:"Scusi!",english:"Excuse me! (formal)"}], dialogue:[{speaker:"Turista",line:"Scusi! Dov'è il Colosseo?",translation:"Excuse me! Where is the Colosseum?"},{speaker:"Passante",line:"Allora… vada sempre dritto, poi a destra.",translation:"Go straight ahead, then turn right."},{speaker:"Turista",line:"È lontano?",translation:"Is it far?"},{speaker:"Passante",line:"No, è vicino. Cinque minuti a piedi.",translation:"No, it's nearby. Five minutes on foot."},{speaker:"Turista",line:"Grazie mille!",translation:"Thank you very much!"},{speaker:"Passante",line:"Prego! Buona visita!",translation:"You're welcome! Enjoy your visit!"}], grammar:{title:"C'è / Ci sono — There is / There are",points:[{italian:"C'è un autobus?",english:"Is there a bus?"},{italian:"Ci sono taxi?",english:"Are there taxis?"},{italian:"C'è una fermata vicino?",english:"Is there a stop nearby?"},{italian:"Non c'è problema",english:"There's no problem"}],note:"C'è and ci sono — your go-to phrases for asking if something exists or is available."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a local Roman giving directions. Use lesson 5 vocabulary."},
  { id:6, title:"At the Airport", subtitle:"All'Aeroporto", free:false, keywords:[{italian:"Il volo",english:"The flight"},{italian:"Il passaporto",english:"The passport"},{italian:"Il bagaglio",english:"The luggage"},{italian:"Quanti bagagli hai?",english:"How many bags do you have?"},{italian:"Il gate",english:"The gate"},{italian:"In ritardo / in orario",english:"Delayed / on time"}], dialogue:[{speaker:"Agente",line:"Buongiorno! Il passaporto, per favore.",translation:"Good morning! Your passport, please."},{speaker:"Passeggero",line:"Eccolo. Ho anche un bagaglio da imbarcare.",translation:"Here it is. I also have a bag to check in."},{speaker:"Agente",line:"Quanti bagagli ha?",translation:"How many bags do you have?"},{speaker:"Passeggero",line:"Solo uno. Il volo è in orario?",translation:"Just one. Is the flight on time?"},{speaker:"Agente",line:"Sì, parte alle undici. Gate B7.",translation:"Yes, it departs at eleven. Gate B7."},{speaker:"Passeggero",line:"Grazie mille!",translation:"Thank you very much!"}], grammar:{title:"Avere — To Have",points:[{italian:"Io ho",english:"I have"},{italian:"Tu hai",english:"You have (informal)"},{italian:"Lei ha",english:"You have (formal)"},{italian:"Lui ha",english:"He has"},{italian:"Noi abbiamo",english:"We have"},{italian:"Voi avete",english:"You guys have"},{italian:"Loro hanno",english:"They have"}],note:"Avere is one of the two most important verbs in Italian. Also used for age: ho trent'anni = I am thirty."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing an airport check-in agent. Use lesson 6 vocabulary."},
  { id:7, title:"At the Restaurant", subtitle:"Al Ristorante", free:false, keywords:[{italian:"Un tavolo per due",english:"A table for two"},{italian:"Il menù",english:"The menu"},{italian:"Il primo / il secondo",english:"The first / second course"},{italian:"Sono vegetariano/a",english:"I am vegetarian"},{italian:"È compreso?",english:"Is it included?"},{italian:"Il coperto",english:"The cover charge"}], dialogue:[{speaker:"Cliente",line:"Buonasera! Un tavolo per due, per favore.",translation:"Good evening! A table for two, please."},{speaker:"Cameriere",line:"Certo, prego. Ecco il menù.",translation:"Of course. Here is the menu."},{speaker:"Cliente",line:"Grazie. Sono vegetariana — cosa consiglia?",translation:"Thank you. I'm vegetarian — what do you recommend?"},{speaker:"Cameriere",line:"Ottime le tagliatelle ai funghi!",translation:"The tagliatelle with mushrooms is excellent!"},{speaker:"Cliente",line:"Perfetto. E il coperto è compreso?",translation:"Perfect. Is the cover charge included?"},{speaker:"Cameriere",line:"Sì, è già incluso. Buon appetito!",translation:"Yes, it's included. Enjoy your meal!"}], grammar:{title:"Mi piace / Mi piacciono — I like",points:[{italian:"Mi piace la pasta",english:"I like pasta"},{italian:"Mi piacciono i funghi",english:"I like mushrooms (plural)"},{italian:"Non mi piace",english:"I don't like it"},{italian:"Mi piace molto",english:"I like it a lot"}],note:"Piacere works backwards — to me it is pleasing. Use piace for one thing, piacciono for many."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a waiter. Use lesson 7 vocabulary."},
  { id:8, title:"Shopping", subtitle:"Fare Shopping", free:false, keywords:[{italian:"Posso provarlo?",english:"Can I try it on?"},{italian:"Che taglia?",english:"What size?"},{italian:"È troppo caro",english:"It's too expensive"},{italian:"C'è lo sconto?",english:"Is there a discount?"},{italian:"Lo prendo",english:"I'll take it"},{italian:"Accettate carte di credito?",english:"Do you accept credit cards?"}], dialogue:[{speaker:"Cliente",line:"Buongiorno! Posso provare questa giacca?",translation:"Good morning! Can I try on this jacket?"},{speaker:"Commessa",line:"Certo! Che taglia porta?",translation:"Of course! What size do you wear?"},{speaker:"Cliente",line:"La media, grazie.",translation:"Medium, thank you."},{speaker:"Cliente",line:"Hmm… quanto costa?",translation:"Hmm… how much does it cost?"},{speaker:"Commessa",line:"Centoventi euro. C'è il 20% di sconto oggi!",translation:"One hundred and twenty euros. There's 20% off today!"},{speaker:"Cliente",line:"Perfetto, lo prendo! Accettate carte?",translation:"Perfect, I'll take it! Do you accept cards?"},{speaker:"Commessa",line:"Sì, certo.",translation:"Yes, of course."}], grammar:{title:"Potere — Can / To be able to",points:[{italian:"Posso provarlo?",english:"Can I try it on?"},{italian:"Puoi aiutarmi?",english:"Can you help me?"},{italian:"Non potete fumare",english:"You cannot smoke"},{italian:"Possiamo pagare con la carta?",english:"Can we pay by card?"}],note:"Potere is a modal verb — pairs with the infinitive. Key to asking permission and expressing ability."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a shop assistant. Use lesson 8 vocabulary."},
  { id:9, title:"At the Hotel", subtitle:"In Albergo", free:false, keywords:[{italian:"Ho una prenotazione",english:"I have a reservation"},{italian:"La camera",english:"The room"},{italian:"A che ora è il check-out?",english:"What time is check-out?"},{italian:"La colazione è inclusa?",english:"Is breakfast included?"},{italian:"C'è il wifi?",english:"Is there wifi?"},{italian:"La chiave",english:"The key"}], dialogue:[{speaker:"Ospite",line:"Buonasera! Ho una prenotazione. Mi chiamo Rossi.",translation:"Good evening! I have a reservation. My name is Rossi."},{speaker:"Receptionist",line:"Benvenuto! Sì, camera doppia per tre notti.",translation:"Welcome! Yes, double room for three nights."},{speaker:"Ospite",line:"Perfetto. La colazione è inclusa?",translation:"Perfect. Is breakfast included?"},{speaker:"Receptionist",line:"Sì, dalle sette alle dieci. C'è anche il wifi gratuito.",translation:"Yes, from seven to ten. There's also free wifi."},{speaker:"Ospite",line:"Ottimo. A che ora è il check-out?",translation:"Excellent. What time is check-out?"},{speaker:"Receptionist",line:"Alle undici. Ecco la sua chiave. Buona permanenza!",translation:"At eleven. Here is your key. Enjoy your stay!"}], grammar:{title:"Prepositions: a, di, da, in",points:[{italian:"Sono a Roma",english:"I am in Rome (location)"},{italian:"Vengo da Londra",english:"I come from London (origin)"},{italian:"Vado in Italia",english:"I'm going to Italy (countries)"},{italian:"La chiave di Maria",english:"Maria's key (possession)"}],note:"In is used with countries, a with cities — this small rule saves a lot of confusion."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a hotel receptionist. Use lesson 9 vocabulary."},
  { id:10, title:"On the Train", subtitle:"Sul Treno", free:false, keywords:[{italian:"Un biglietto per…",english:"A ticket to…"},{italian:"Andata e ritorno",english:"Return (round trip)"},{italian:"Il binario",english:"The platform"},{italian:"È occupato?",english:"Is this seat taken?"},{italian:"A che ora arriva?",english:"What time does it arrive?"},{italian:"Il treno è in ritardo",english:"The train is delayed"}], dialogue:[{speaker:"Viaggiatore",line:"Buongiorno! Un biglietto per Venezia, per favore.",translation:"Good morning! A ticket to Venice, please."},{speaker:"Bigliettaio",line:"Andata e ritorno?",translation:"Return trip?"},{speaker:"Viaggiatore",line:"Solo andata. A che ora arriva?",translation:"One way only. What time does it arrive?"},{speaker:"Bigliettaio",line:"Alle tredici e venti. Binario 4.",translation:"At thirteen twenty. Platform 4."},{speaker:"Viaggiatore",line:"Grazie. È occupato questo posto?",translation:"Thank you. Is this seat taken?"},{speaker:"Passeggero",line:"No, si accomodi!",translation:"No, please sit down!"}], grammar:{title:"Telling the Time",points:[{italian:"Sono le tre",english:"It is three o'clock"},{italian:"È mezzogiorno",english:"It is noon"},{italian:"Alle otto e mezza",english:"At half past eight"},{italian:"A che ora?",english:"At what time?"}],note:"Italians use the 24-hour clock for transport. Sono le tredici = 1 PM. Use è l'una for 1 o'clock."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a train station agent. Use lesson 10 vocabulary."},
  { id:11, title:"At the Market", subtitle:"Al Mercato", free:false, keywords:[{italian:"Quanto pesa?",english:"How much does it weigh?"},{italian:"Un chilo di…",english:"A kilo of…"},{italian:"Fresco / di stagione",english:"Fresh / in season"},{italian:"Me ne dà mezzo chilo",english:"Give me half a kilo"},{italian:"Basta così",english:"That's enough"},{italian:"Il resto",english:"The change"}], dialogue:[{speaker:"Cliente",line:"Buongiorno! Questi pomodori sono freschi?",translation:"Good morning! Are these tomatoes fresh?"},{speaker:"Venditore",line:"Freschissimi! Di stagione. Quanti ne vuole?",translation:"Very fresh! In season. How many do you want?"},{speaker:"Cliente",line:"Me ne dà un chilo, per favore.",translation:"Give me a kilo, please."},{speaker:"Cliente",line:"E anche mezzo chilo di mozzarella.",translation:"And also half a kilo of mozzarella."},{speaker:"Venditore",line:"Basta così?",translation:"Is that all?"},{speaker:"Cliente",line:"Sì, grazie. Ecco cinque euro.",translation:"Yes, thank you. Here's five euros."},{speaker:"Venditore",line:"Ecco il resto. Grazie, a presto!",translation:"Here's the change. Thank you, see you soon!"}], grammar:{title:"Ne — The Partitive Pronoun",points:[{italian:"Ne voglio un chilo",english:"I want a kilo of it"},{italian:"Me ne dà due?",english:"Can you give me two of them?"},{italian:"Non ne ho",english:"I don't have any"},{italian:"Quanti ne vuole?",english:"How many do you want?"}],note:"Ne replaces a noun with a quantity. No direct English equivalent but means roughly of it or of them."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a market vendor. Use lesson 11 vocabulary."},
  { id:12, title:"Emergencies & Health", subtitle:"Emergenze e Salute", free:false, keywords:[{italian:"Aiuto!",english:"Help!"},{italian:"Ho bisogno di un medico",english:"I need a doctor"},{italian:"Mi fa male…",english:"…hurts / is hurting me"},{italian:"Chiami un'ambulanza!",english:"Call an ambulance!"},{italian:"La farmacia",english:"The pharmacy"},{italian:"Sono allergico/a a…",english:"I am allergic to…"}], dialogue:[{speaker:"Turista",line:"Scusi! Ho bisogno di aiuto.",translation:"Excuse me! I need help."},{speaker:"Passante",line:"Cosa succede?",translation:"What's happening?"},{speaker:"Turista",line:"Mi fa molto male la testa. Ho la febbre.",translation:"My head hurts a lot. I have a fever."},{speaker:"Passante",line:"C'è una farmacia qui vicino.",translation:"There's a pharmacy nearby."},{speaker:"Turista",line:"Sono allergico alla penicillina.",translation:"I'm allergic to penicillin."},{speaker:"Passante",line:"Lo dica al farmacista. Venga, l'accompagno.",translation:"Tell the pharmacist. Come, I'll take you there."}], grammar:{title:"Mi fa male — Expressing Pain",points:[{italian:"Mi fa male la testa",english:"My head hurts"},{italian:"Mi fa male lo stomaco",english:"My stomach hurts"},{italian:"Mi fanno male i piedi",english:"My feet hurt (plural)"},{italian:"Ho la febbre",english:"I have a fever"}],note:"Mi fa male literally means it makes pain to me. Use fanno male for multiple body parts."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor helping practice emergency vocabulary. Be calm and reassuring."},
  { id:13, title:"At the Pharmacy", subtitle:"In Farmacia", free:false, keywords:[{italian:"Ho bisogno di…",english:"I need…"},{italian:"Una ricetta",english:"A prescription"},{italian:"Il mal di testa",english:"Headache"},{italian:"La tosse",english:"A cough"},{italian:"Qualcosa per…",english:"Something for…"},{italian:"Quante volte al giorno?",english:"How many times a day?"}], dialogue:[{speaker:"Cliente",line:"Buongiorno. Ho bisogno di qualcosa per il mal di testa.",translation:"Good morning. I need something for a headache."},{speaker:"Farmacista",line:"Ha la ricetta?",translation:"Do you have a prescription?"},{speaker:"Cliente",line:"No, è senza ricetta.",translation:"No, it's over the counter."},{speaker:"Farmacista",line:"Allora le do queste compresse. Due volte al giorno.",translation:"Then I'll give you these tablets. Twice a day."},{speaker:"Cliente",line:"Grazie. Ho anche la tosse.",translation:"Thank you. I also have a cough."},{speaker:"Farmacista",line:"Prenda questo sciroppo, tre volte al giorno dopo i pasti.",translation:"Take this syrup, three times a day after meals."}], grammar:{title:"Imperativo — Giving Instructions",points:[{italian:"Prenda queste pillole",english:"Take these pills (formal command)"},{italian:"Beva molta acqua",english:"Drink plenty of water"},{italian:"Riposi a casa",english:"Rest at home"},{italian:"Torni domani",english:"Come back tomorrow"}],note:"The formal imperative (Lei form) is used by professionals. It sounds like the third person singular."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a pharmacist. Use lesson 13 vocabulary."},
  { id:14, title:"Making a Phone Call", subtitle:"Al Telefono", free:false, keywords:[{italian:"Pronto!",english:"Hello! (answering the phone)"},{italian:"Con chi parlo?",english:"Who am I speaking with?"},{italian:"Posso parlare con…?",english:"Can I speak with…?"},{italian:"Un momento",english:"One moment"},{italian:"Richiamare",english:"To call back"},{italian:"È occupato",english:"The line is busy"}], dialogue:[{speaker:"A",line:"Pronto?",translation:"Hello?"},{speaker:"B",line:"Buongiorno! Posso parlare con la signora Bianchi?",translation:"Good morning! Can I speak with Mrs Bianchi?"},{speaker:"A",line:"Sono io. Con chi parlo?",translation:"Speaking. Who am I talking to?"},{speaker:"B",line:"Sono Marco Rossi, chiamo per la prenotazione.",translation:"I'm Marco Rossi, calling about the reservation."},{speaker:"A",line:"Un momento, la metto in attesa.",translation:"One moment, I'll put you on hold."},{speaker:"A",line:"Mi dispiace, la linea è occupata. Può richiamare?",translation:"I'm sorry, the line is busy. Can you call back?"},{speaker:"B",line:"Certo, richiamo più tardi. Grazie!",translation:"Of course, I'll call back later. Thank you!"}], grammar:{title:"Potere + Infinitive — Asking Permission",points:[{italian:"Posso richiamare?",english:"Can I call back?"},{italian:"Può aspettare?",english:"Can you wait? (formal)"},{italian:"Possiamo parlare?",english:"Can we talk?"},{italian:"Non posso sentire",english:"I can't hear"}],note:"On the phone, Italians always say Pronto! when answering — it literally means ready."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor role-playing phone calls. Use lesson 14 vocabulary."},
  { id:15, title:"At the Post Office", subtitle:"All'Ufficio Postale", free:false, keywords:[{italian:"Spedire un pacco",english:"To send a parcel"},{italian:"Una lettera / una busta",english:"A letter / an envelope"},{italian:"Per via aerea",english:"By airmail"},{italian:"Quanto ci vuole?",english:"How long does it take?"},{italian:"Il francobollo",english:"The stamp"},{italian:"Raccomandata",english:"Registered mail"}], dialogue:[{speaker:"Cliente",line:"Buongiorno! Vorrei spedire questo pacco in Inghilterra.",translation:"Good morning! I'd like to send this parcel to England."},{speaker:"Impiegato",line:"Per via aerea o normale?",translation:"By airmail or standard?"},{speaker:"Cliente",line:"Aerea. Quanto ci vuole?",translation:"Airmail. How long does it take?"},{speaker:"Impiegato",line:"Circa cinque giorni lavorativi.",translation:"About five working days."},{speaker:"Cliente",line:"Va bene. E vorrei anche tre francobolli.",translation:"That's fine. And I'd also like three stamps."},{speaker:"Impiegato",line:"Vuole la raccomandata per il pacco?",translation:"Would you like registered mail for the parcel?"}], grammar:{title:"Ci vuole / Ci vogliono — It takes",points:[{italian:"Ci vuole un'ora",english:"It takes one hour"},{italian:"Ci vogliono tre giorni",english:"It takes three days"},{italian:"Quanto ci vuole?",english:"How long does it take?"},{italian:"Ci vuole pazienza!",english:"It takes patience!"}],note:"Ci vuole — use it any time you want to say how long something takes or what is required."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a post office clerk. Use lesson 15 vocabulary."},
  { id:16, title:"Renting a Car", subtitle:"Noleggiare un'Auto", free:false, keywords:[{italian:"Noleggiare un'auto",english:"To rent a car"},{italian:"La patente",english:"The driving licence"},{italian:"Il pieno",english:"Full tank"},{italian:"L'assicurazione",english:"The insurance"},{italian:"Quanti chilometri?",english:"How many kilometres?"},{italian:"Riconsegnare",english:"To return (the car)"}], dialogue:[{speaker:"Cliente",line:"Buongiorno! Vorrei noleggiare un'auto per tre giorni.",translation:"Good morning! I'd like to rent a car for three days."},{speaker:"Agente",line:"Certo. Ha la patente con sé?",translation:"Of course. Do you have your licence with you?"},{speaker:"Cliente",line:"Sì, eccola. L'assicurazione è inclusa?",translation:"Yes, here it is. Is insurance included?"},{speaker:"Agente",line:"Sì, quella base è inclusa. Vuole quella completa?",translation:"Yes, the basic one is included. Would you like full coverage?"},{speaker:"Cliente",line:"Sì, meglio. Il serbatoio è pieno?",translation:"Yes, better. Is the tank full?"},{speaker:"Agente",line:"Sì, e deve riconsegnare l'auto col pieno.",translation:"Yes, and you must return the car with a full tank."}], grammar:{title:"Dovere — Must / To have to",points:[{italian:"Devo riconsegnare l'auto",english:"I must return the car"},{italian:"Devi pagare un deposito",english:"You must pay a deposit"},{italian:"Deve avere la patente",english:"He/She must have a licence"},{italian:"Dobbiamo fare il pieno",english:"We must fill the tank"},{italian:"Non dovete dimenticare la cintura!",english:"You must not forget the seatbelt!"},{italian:"I bambini devono usare il seggiolino!",english:"Kids must use a child seat!"}],note:"Dovere expresses obligation — pair it with an infinitive. One of three key modal verbs: potere (can), volere (want), dovere (must)."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a car rental agent. Use lesson 16 vocabulary."},
  { id:17, title:"At the Beach", subtitle:"In Spiaggia", free:false, keywords:[{italian:"Un ombrellone",english:"A beach umbrella"},{italian:"Una sdraio",english:"A sun lounger"},{italian:"La crema solare",english:"Sun cream"},{italian:"Il mare è mosso",english:"The sea is rough"},{italian:"Fare il bagno",english:"To swim / go in the water"},{italian:"Che caldo!",english:"It's so hot!"}], dialogue:[{speaker:"Turista",line:"Buongiorno! Vorrei un ombrellone e due sdraio.",translation:"Good morning! I'd like a beach umbrella and two sun loungers."},{speaker:"Bagnino",line:"Certo! Prima fila o seconda?",translation:"Of course! First row or second?"},{speaker:"Turista",line:"Seconda va bene. Si può fare il bagno?",translation:"Second is fine. Can we swim?"},{speaker:"Bagnino",line:"Sì, il mare è calmo oggi. Che caldo!",translation:"Yes, the sea is calm today. It's so hot!"},{speaker:"Turista",line:"Sì! Ha una crema solare da comprare?",translation:"Yes! Do you have sun cream to buy?"},{speaker:"Bagnino",line:"Sì, al chiosco là. Buona giornata!",translation:"Yes, at the kiosk over there. Have a great day!"}], grammar:{title:"Fare — To Do / To Make",points:[{italian:"Faccio una passeggiata",english:"I go for a walk"},{italian:"Fai il bagno?",english:"Are you having a swim?"},{italian:"Fa caldo / fa freddo",english:"It's hot / it's cold (weather)"},{italian:"Facciamo una passeggiata",english:"We go for a walk"},{italian:"Cosa fate?",english:"What are you guys doing?"},{italian:"Fanno un castello di sabbia",english:"They make a sand castle"}],note:"Fare is one of the most versatile Italian verbs — dozens of fixed expressions for weather, activities, actions."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a beach attendant. Use lesson 17 vocabulary."},
  { id:18, title:"Talking About Family", subtitle:"La Famiglia", free:false, keywords:[{italian:"Il marito / la moglie",english:"Husband / wife"},{italian:"I figli",english:"The children"},{italian:"Il fratello / la sorella",english:"Brother / sister"},{italian:"I genitori",english:"The parents"},{italian:"Sei sposato/a?",english:"Are you married?"},{italian:"Hai figli?",english:"Do you have children?"}], dialogue:[{speaker:"A",line:"Sei sposato?",translation:"Are you married?"},{speaker:"B",line:"Sì, ho una moglie e due figli. E tu?",translation:"Yes, I have a wife and two children. And you?"},{speaker:"A",line:"Sono fidanzata. Ci sposiamo l'anno prossimo!",translation:"I'm engaged. We're getting married next year!"},{speaker:"B",line:"Congratulazioni! Hai fratelli o sorelle?",translation:"Congratulations! Do you have brothers or sisters?"},{speaker:"A",line:"Ho una sorella. I miei genitori vivono a Napoli.",translation:"I have a sister. My parents live in Naples."},{speaker:"B",line:"Bella città! La mia famiglia è di Roma.",translation:"Beautiful city! My family is from Rome."}], grammar:{title:"Possessives — My, Your, His/Her",points:[{italian:"Il mio gatto",english:"My cat"},{italian:"Il tuo gelato",english:"Your ice-cream"},{italian:"La sua mamma e il suo papà",english:"His/her mum and his/her dad"},{italian:"I nostri vicini",english:"Our neighbours"},{italian:"Le loro sorelle",english:"Their sisters"}],note:"Italian possessives agree with the noun, not the owner. Words ending in O are masculine, A are feminine."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor having a friendly conversation about family. Use lesson 18 vocabulary."},
  { id:19, title:"At the Doctor", subtitle:"Dal Medico", free:false, keywords:[{italian:"Ho un appuntamento",english:"I have an appointment"},{italian:"Da quanto tempo?",english:"Since when / how long?"},{italian:"Ho la nausea",english:"I feel nauseous"},{italian:"La pressione",english:"Blood pressure"},{italian:"Fare una visita",english:"To have a check-up"},{italian:"La diagnosi",english:"The diagnosis"}], dialogue:[{speaker:"Paziente",line:"Buongiorno, ho un appuntamento con il dottor Marini.",translation:"Good morning, I have an appointment with Doctor Marini."},{speaker:"Receptionist",line:"Prego, si accomodi. Come si sente?",translation:"Please, have a seat. How are you feeling?"},{speaker:"Paziente",line:"Non molto bene. Ho mal di stomaco e la nausea.",translation:"Not very well. I have a stomach ache and nausea."},{speaker:"Dottore",line:"Da quanto tempo ha questi sintomi?",translation:"How long have you had these symptoms?"},{speaker:"Paziente",line:"Da due giorni. Ho anche un po' di febbre.",translation:"For two days. I also have a slight fever."},{speaker:"Dottore",line:"Non è grave. Le scrivo una ricetta.",translation:"It's not serious. I'll write you a prescription."}], grammar:{title:"Da — Since / For (time)",points:[{italian:"Da due giorni",english:"For two days (ongoing)"},{italian:"Da quanto tempo?",english:"How long? / Since when?"},{italian:"Vivo qui da un anno",english:"I've lived here for a year"},{italian:"Da stamattina",english:"Since this morning"}],note:"Da + present tense describes something started in the past and still happening. One of the most common learner mistakes."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a doctor. Use lesson 19 vocabulary."},
  { id:20, title:"Going Out at Night", subtitle:"Uscire la Sera", free:false, keywords:[{italian:"Andiamo a ballare?",english:"Shall we go dancing?"},{italian:"Un locale",english:"A venue / club / bar"},{italian:"C'è la fila",english:"There's a queue"},{italian:"Offro io",english:"It's on me / my treat"},{italian:"Fare tardi",english:"To stay out late"},{italian:"Che serata!",english:"What a night!"}], dialogue:[{speaker:"A",line:"Allora, andiamo a ballare stasera?",translation:"So, shall we go dancing tonight?"},{speaker:"B",line:"Sì! Conosco un bel locale in centro.",translation:"Yes! I know a nice venue in the centre."},{speaker:"A",line:"C'è la fila di solito?",translation:"Is there usually a queue?"},{speaker:"B",line:"A volte sì, ma entriamo con la lista.",translation:"Sometimes yes, but we're on the guest list."},{speaker:"A",line:"Certo! Un aperitivo — offro io!",translation:"Of course! An aperitif — my treat!"},{speaker:"A",line:"Grazie! Che serata!",translation:"Thank you! What a night!"}], grammar:{title:"Andare — To Go (+ places)",points:[{italian:"Vado al bar",english:"I'm going to the bar"},{italian:"Vai a casa?",english:"Are you going home?"},{italian:"Va bene!",english:"It's fine! / OK!"},{italian:"Andiamo a ballare",english:"Let's go dancing"},{italian:"Andate via?",english:"Are you leaving?"}],note:"Andiamo (let's go) is one of the most useful words in Italian social life. Va bene — you'll hear it dozens of times a day."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a friend planning a night out. Use lesson 20 vocabulary. Be energetic and fun."},
  { id:21, title:"Food & Cooking", subtitle:"Cibo e Cucina", free:false, keywords:[{italian:"La ricetta",english:"The recipe"},{italian:"Gli ingredienti",english:"The ingredients"},{italian:"Cuocere / cucinare",english:"To cook"},{italian:"Aggiungere",english:"To add"},{italian:"Mescolare",english:"To stir / mix"},{italian:"È pronto!",english:"It's ready!"}], dialogue:[{speaker:"A",line:"Stai cucinando? Che profumo!",translation:"Are you cooking? What a lovely smell!"},{speaker:"B",line:"Sto facendo la pasta al pomodoro. Vuoi la ricetta?",translation:"I'm making tomato pasta. Do you want the recipe?"},{speaker:"A",line:"Sì! Quali ingredienti usi?",translation:"Yes! What ingredients do you use?"},{speaker:"B",line:"Pomodori freschi, aglio, basilico e olio d'oliva.",translation:"Fresh tomatoes, garlic, basil and olive oil."},{speaker:"B",line:"Venti minuti. Aggiungi il sale, mescola e aspetta.",translation:"Twenty minutes. Add the salt, stir and wait."},{speaker:"A",line:"È pronto? Ho fame!",translation:"Is it ready? I'm hungry!"}], grammar:{title:"Stare + Gerundio — Present Continuous",points:[{italian:"Sto cucinando",english:"I am cooking (right now)"},{italian:"Stai bevendo",english:"You are drinking (right now)"},{italian:"Sta mangiando",english:"He/she is eating"},{italian:"Stiamo aspettando",english:"We are waiting"},{italian:"Cosa state facendo?",english:"What are you guys doing?"},{italian:"Stanno arrivando",english:"They are coming"}],note:"Italian present continuous: stare + gerund (-ando/-endo). Use for things happening right now. For general habits, use the present tense."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor cooking with the student. Use lesson 21 vocabulary. Be enthusiastic about food."},
  { id:22, title:"At the Bank", subtitle:"In Banca", free:false, keywords:[{italian:"Aprire un conto",english:"To open an account"},{italian:"Il bancomat",english:"ATM / debit card"},{italian:"Prelevare",english:"To withdraw"},{italian:"Il tasso di cambio",english:"The exchange rate"},{italian:"Fare un bonifico",english:"To make a bank transfer"},{italian:"Lo sportello",english:"The counter / window"}], dialogue:[{speaker:"Cliente",line:"Buongiorno. Vorrei prelevare dei contanti.",translation:"Good morning. I'd like to withdraw some cash."},{speaker:"Impiegato",line:"Si accomodi allo sportello tre.",translation:"Please go to counter three."},{speaker:"Cliente",line:"Grazie. Qual è il tasso di cambio oggi?",translation:"Thank you. What is today's exchange rate?"},{speaker:"Impiegato",line:"Per la sterlina, è uno virgola diciassette.",translation:"For the pound, it's one point seventeen."},{speaker:"Cliente",line:"Bene. Posso anche fare un bonifico?",translation:"Good. Can I also make a bank transfer?"},{speaker:"Impiegato",line:"Certo. Ha il codice IBAN del destinatario?",translation:"Of course. Do you have the recipient's IBAN code?"}], grammar:{title:"Numbers",points:[{italian:"Uno, due, tre, quattro, cinque, sei, sette, otto, nove, dieci",english:"1-10"},{italian:"Undici, dodici, tredici, quattordici, quindici, sedici, diciassette, diciotto, diciannove, venti",english:"11-20"},{italian:"Trenta, quaranta, cinquanta, sessanta, settanta, ottanta, novanta",english:"30-90"},{italian:"Cento / mille / un milione",english:"100 / 1000 / 1,000,000"},{italian:"Virgola",english:"Decimal point (comma in Italian)"}],note:"In Italian, decimals use a comma: 1,17 is uno virgola diciassette. Thousands use a period: 1.000 = one thousand."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a bank teller. Use lesson 22 vocabulary."},
  { id:23, title:"Making Plans", subtitle:"Fare Programmi", free:false, keywords:[{italian:"Sei libero/a?",english:"Are you free?"},{italian:"Che ne dici di…?",english:"What do you think about…?"},{italian:"Mi va!",english:"I'm up for it! / Sounds good!"},{italian:"Ci vediamo",english:"See you / let's meet"},{italian:"Rimandare",english:"To postpone"},{italian:"Non vedo l'ora!",english:"I can't wait!"}], dialogue:[{speaker:"A",line:"Sei libera sabato?",translation:"Are you free on Saturday?"},{speaker:"B",line:"Sì! Che ne dici di andare al museo?",translation:"Yes! What do you think about going to the museum?"},{speaker:"A",line:"Mi va! A che ora ci vediamo?",translation:"Sounds good! What time shall we meet?"},{speaker:"B",line:"Alle dieci davanti all'ingresso?",translation:"At ten in front of the entrance?"},{speaker:"A",line:"Perfetto. Non vedo l'ora!",translation:"Perfect. I can't wait!"},{speaker:"B",line:"Anch'io! E dopo pranziamo insieme?",translation:"Me neither! And shall we have lunch together after?"}], grammar:{title:"Future Tense — Quick & Easy",points:[{italian:"Andrò al museo",english:"I will go to the museum"},{italian:"Sarà divertente",english:"It will be fun"},{italian:"Ci vediamo domani",english:"See you tomorrow (present used for near future)"},{italian:"Cosa farai?",english:"What will you do?"}],note:"Italians often use the present tense for near-future plans. Domani vado al cinema is more natural than the actual future tense."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a friend making plans. Use lesson 23 vocabulary."},
  { id:24, title:"Talking About the Weather", subtitle:"Il Tempo", free:false, keywords:[{italian:"Che tempo fa?",english:"What's the weather like?"},{italian:"Piove / nevica",english:"It's raining / snowing"},{italian:"C'è il sole",english:"It's sunny"},{italian:"Afoso",english:"Humid / muggy"},{italian:"Le previsioni",english:"The forecast"},{italian:"Portare un ombrello",english:"To bring an umbrella"}], dialogue:[{speaker:"A",line:"Che tempo fa oggi?",translation:"What's the weather like today?"},{speaker:"B",line:"È nuvoloso stamattina, ma nel pomeriggio c'è il sole.",translation:"It's cloudy this morning, but sunny in the afternoon."},{speaker:"A",line:"E domani? Hai visto le previsioni?",translation:"And tomorrow? Have you seen the forecast?"},{speaker:"B",line:"Sì, piove di mattina. Porta l'ombrello!",translation:"Yes, it rains in the morning. Bring an umbrella!"},{speaker:"A",line:"Che peccato. Volevo andare al mare.",translation:"What a shame. I wanted to go to the beach."},{speaker:"B",line:"Va meglio il weekend. Andiamo sabato allora.",translation:"It gets better at the weekend. Let's go Saturday then."}], grammar:{title:"Imperfetto — Past Habits & Descriptions",points:[{italian:"Volevo andare al mare",english:"I wanted to go to the beach"},{italian:"Faceva caldo",english:"It was hot (description in the past)"},{italian:"Quando ero piccolo…",english:"When I was young…"},{italian:"Di solito prendevo…",english:"I used to take…"}],note:"The imperfetto is used for past habits, descriptions, and ongoing states — the used to or was doing tense."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor talking about weather and plans. Use lesson 24 vocabulary."},
  { id:25, title:"At the Park", subtitle:"Al Parco", free:false, keywords:[{italian:"Il fiore",english:"The flower"},{italian:"L'albero",english:"The tree"},{italian:"Il cane",english:"The dog"},{italian:"La panchina",english:"The bench"},{italian:"Bello / bella",english:"Beautiful / lovely"},{italian:"Guarda!",english:"Look!"}], dialogue:[{speaker:"A",line:"Guarda quel cane!",translation:"Look at that dog!"},{speaker:"B",line:"Che bello! E' tuo?",translation:"How lovely! Is it yours?"},{speaker:"A",line:"No, ma vorrei averne uno.",translation:"No, but I'd love to have one."},{speaker:"B",line:"Mi piace quel fiore rosso la'.",translation:"I like that red flower over there."},{speaker:"A",line:"Si', e quegli alberi sono bellissimi.",translation:"Yes, and those trees are gorgeous."},{speaker:"B",line:"Sediamoci sulla panchina?",translation:"Shall we sit on the bench?"}], grammar:{title:"I Colori — Colours",points:[{italian:"Rosso / rossa",english:"Red (m/f)"},{italian:"Verde",english:"Green"},{italian:"Blu",english:"Blue (invariable)"},{italian:"Giallo / gialla",english:"Yellow (m/f)"},{italian:"Bianco / nero",english:"White / black"}],note:"Colours are adjectives and must agree with the noun. Blu and rosa are exceptions — they never change."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor walking in a park. Practice colours and park vocabulary."},
  { id:26, title:"Talking About People", subtitle:"Parlare delle Persone", free:false, keywords:[{italian:"Alto / basso",english:"Tall / short"},{italian:"Magro / robusto",english:"Thin / sturdy"},{italian:"Simpatico / antipatico",english:"Friendly / unfriendly"},{italian:"Timido / estroverso",english:"Shy / outgoing"},{italian:"I capelli",english:"The hair"},{italian:"Gli occhi",english:"The eyes"}], dialogue:[{speaker:"A",line:"Conosci Marco?",translation:"Do you know Marco?"},{speaker:"B",line:"Si'! E' alto e molto simpatico.",translation:"Yes! He's tall and very friendly."},{speaker:"A",line:"Ha i capelli scuri, vero?",translation:"He has dark hair, right?"},{speaker:"B",line:"Si', e gli occhi verdi. E' bello.",translation:"Yes, and green eyes. He's handsome."},{speaker:"A",line:"E sua sorella?",translation:"And his sister?"},{speaker:"B",line:"Lei e' timida ma molto simpatica.",translation:"She's shy but very friendly."}], grammar:{title:"Essere + Adjectives for Descriptions",points:[{italian:"E' alto e magro",english:"He is tall and slim"},{italian:"E' simpatica",english:"She is friendly"},{italian:"Sono timidi",english:"They are shy (plural)"},{italian:"Ha i capelli biondi",english:"She/he has blonde hair"},{italian:"Ha gli occhi azzurri",english:"She/he has blue eyes"}],note:"Physical descriptions use essere for qualities and avere for features like hair and eyes."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor helping describe people. Use lesson 26 vocabulary."},
  { id:27, title:"Talking with the Neighbours", subtitle:"Con i Vicini", free:false, keywords:[{italian:"Come va?",english:"How's it going?"},{italian:"Stanco / stanca",english:"Tired (m/f)"},{italian:"Come mai?",english:"How come? / Why?"},{italian:"Ho dormito poco",english:"I slept little"},{italian:"Tutto bene?",english:"Everything OK?"},{italian:"La settimana",english:"The week"}], dialogue:[{speaker:"A",line:"Buongiorno! Come va?",translation:"Good morning! How's it going?"},{speaker:"B",line:"Un po' stanca oggi.",translation:"A bit tired today."},{speaker:"A",line:"Come mai?",translation:"How come?"},{speaker:"B",line:"Ho dormito poco stanotte.",translation:"I slept little last night."},{speaker:"A",line:"Mi dispiace. E' stata una settimana difficile?",translation:"I'm sorry. Has it been a tough week?"},{speaker:"B",line:"Abbastanza. Ma domani e' venerdi'!",translation:"Quite. But tomorrow is Friday!"},{speaker:"A",line:"Meno male! Buona giornata!",translation:"Thank goodness! Have a good day!"}], grammar:{title:"Everyday Conversational Expressions",points:[{italian:"Come va?",english:"How's it going?"},{italian:"Come mai?",english:"How come? / Why is that?"},{italian:"Meno male!",english:"Thank goodness!"},{italian:"Abbastanza",english:"Quite / fairly / enough"},{italian:"Mi dispiace",english:"I'm sorry"}],note:"Come mai is softer than perche'. Meno male literally means less bad — one of the most satisfying Italian expressions."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a friendly neighbour. Practice polite small talk."},
  { id:28, title:"Talking About Your Day", subtitle:"Parlare della Giornata", free:false, keywords:[{italian:"Ieri / oggi / domani",english:"Yesterday / today / tomorrow"},{italian:"Stamattina / stasera",english:"This morning / this evening"},{italian:"Ho lavorato",english:"I worked (past)"},{italian:"Sono partito/a",english:"I left / departed (past)"},{italian:"Cosa hai fatto?",english:"What did you do?"},{italian:"Tutto il giorno",english:"All day long"}], dialogue:[{speaker:"A",line:"Cosa hai fatto ieri?",translation:"What did you do yesterday?"},{speaker:"B",line:"Ho lavorato tutto il giorno.",translation:"I worked all day."},{speaker:"A",line:"E la sera?",translation:"And in the evening?"},{speaker:"B",line:"Sono andato al cinema con Marco.",translation:"I went to the cinema with Marco."},{speaker:"A",line:"Bello! E domani?",translation:"Nice! And tomorrow?"},{speaker:"B",line:"Domani partiamo per Roma. Buon viaggio!",translation:"Tomorrow we leave for Rome. Have a good trip!"}], grammar:{title:"Passato Prossimo — The Recent Past",points:[{italian:"Ho lavorato",english:"I worked (avere + past participle)"},{italian:"Ho mangiato",english:"I ate"},{italian:"Sono andato/a",english:"I went (essere + past participle)"},{italian:"Sei partito/a?",english:"Did you leave?"},{italian:"Abbiamo fatto",english:"We did"}],note:"Passato prossimo: avere or essere + past participle. Motion verbs take essere, participle agrees with subject."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor talking about the student's day. Practice passato prossimo."},
  { id:29, title:"Asking for Explanations", subtitle:"Chiedere Spiegazioni", free:false, keywords:[{italian:"Perche'?",english:"Why?"},{italian:"Come mai?",english:"How come?"},{italian:"Allora",english:"So / then / well"},{italian:"Quindi",english:"Therefore / so"},{italian:"Non capisco",english:"I don't understand"},{italian:"Uno sciopero",english:"A strike"}], dialogue:[{speaker:"A",line:"Perche' il treno e' in ritardo?",translation:"Why is the train delayed?"},{speaker:"B",line:"Perche' c'e' uno sciopero.",translation:"Because there's a strike."},{speaker:"A",line:"Ah, capisco. E quindi quando parte?",translation:"Ah, I understand. So when does it depart?"},{speaker:"B",line:"Non lo so. Forse tra un'ora.",translation:"I don't know. Maybe in an hour."},{speaker:"A",line:"Non capisco — c'e' un altro treno?",translation:"I don't understand — is there another train?"},{speaker:"B",line:"Allora, provi l'autobus.",translation:"Well then, try the bus."}], grammar:{title:"Perche' — Why and Because",points:[{italian:"Perche' sei in ritardo?",english:"Why are you late?"},{italian:"Perche' c'e' traffico",english:"Because there's traffic"},{italian:"Quindi / allora",english:"So / therefore"},{italian:"Non lo so",english:"I don't know"},{italian:"Forse",english:"Maybe / perhaps"}],note:"Perche' is both why and because in Italian. Allora fills pauses and signals a conclusion — you'll hear it constantly."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor role-playing situations needing explanations. Be patient and clear."},
  { id:30, title:"Dreams & Wishes", subtitle:"Sogni e Desideri", free:false, keywords:[{italian:"Vorrei...",english:"I would like... / I wish..."},{italian:"Mi piacerebbe",english:"I would like (lit. it would please me)"},{italian:"Magari",english:"Maybe / if only / I wish"},{italian:"Forse",english:"Perhaps / maybe"},{italian:"Un giorno",english:"One day / someday"},{italian:"Davvero?",english:"Really?"}], dialogue:[{speaker:"A",line:"Vorrei vivere in Italia.",translation:"I would like to live in Italy."},{speaker:"B",line:"Davvero? In quale citta'?",translation:"Really? In which city?"},{speaker:"A",line:"Firenze. Mi piacerebbe molto.",translation:"Florence. I would really like that."},{speaker:"B",line:"Magari vengo anch'io!",translation:"Maybe I'll come too!"},{speaker:"A",line:"Forse un giorno si puo'.",translation:"Perhaps one day it's possible."},{speaker:"B",line:"Si'! Magari!",translation:"Yes! If only!"}], grammar:{title:"Conditional — Vorrei and Mi piacerebbe",points:[{italian:"Vorrei andare a Roma",english:"I would like to go to Rome"},{italian:"Vorresti venire?",english:"Would you like to come?"},{italian:"Mi piacerebbe molto",english:"I would like that very much"},{italian:"Magari!",english:"If only! / I wish!"},{italian:"Sarebbe bello",english:"It would be lovely"}],note:"Magari can mean maybe, if only, or I wish — all depending on tone. Magari! alone expresses wistful longing."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor having a dreamy conversation about wishes. Be warm and imaginative."},
  { id:31, title:"At Home", subtitle:"A Casa", free:false, keywords:[{italian:"Il soggiorno",english:"The living room"},{italian:"La cucina",english:"The kitchen"},{italian:"Il divano",english:"The sofa"},{italian:"Cucinare",english:"To cook"},{italian:"Pulire",english:"To clean"},{italian:"Rilassarsi",english:"To relax"}], dialogue:[{speaker:"A",line:"Sei a casa?",translation:"Are you at home?"},{speaker:"B",line:"Si', sto cucinando in cucina.",translation:"Yes, I'm cooking in the kitchen."},{speaker:"A",line:"Che profumo! Cosa fai?",translation:"What a lovely smell! What are you making?"},{speaker:"B",line:"Una pasta al forno. Poi devo pulire il soggiorno.",translation:"A baked pasta. Then I need to clean the living room."},{speaker:"A",line:"Dopo ti rilassi un po'?",translation:"Will you relax a bit afterwards?"},{speaker:"B",line:"Spero! Mi butto sul divano.",translation:"I hope so! I'm going to throw myself on the sofa."}], grammar:{title:"Reflexive Verbs — Verbi Riflessivi",points:[{italian:"Mi rilasso",english:"I relax (myself)"},{italian:"Ti svegli?",english:"Do you wake up?"},{italian:"Si chiama",english:"He/she is called"},{italian:"Ci divertiamo",english:"We enjoy ourselves"},{italian:"Mi butto sul divano",english:"I throw myself on the sofa"}],note:"Reflexive verbs use a pronoun (mi, ti, si, ci, vi, si) referring back to the subject. Very common in Italian daily life."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor having a cosy conversation about being at home. Use lesson 31 vocabulary."},
  { id:32, title:"Daily Routine", subtitle:"La Routine Quotidiana", free:false, keywords:[{italian:"Mi sveglio",english:"I wake up"},{italian:"Faccio colazione",english:"I have breakfast"},{italian:"Mi vesto",english:"I get dressed"},{italian:"Torno a casa",english:"I come back home"},{italian:"Di solito",english:"Usually"},{italian:"Mi addormento",english:"I fall asleep"}], dialogue:[{speaker:"A",line:"A che ora ti svegli di solito?",translation:"What time do you usually wake up?"},{speaker:"B",line:"Mi sveglio alle sette. Faccio colazione e poi mi vesto.",translation:"I wake up at seven. I have breakfast and then get dressed."},{speaker:"A",line:"E a che ora torni a casa?",translation:"And what time do you get home?"},{speaker:"B",line:"Verso le sei. Poi cucino e mi rilasso.",translation:"Around six. Then I cook and relax."},{speaker:"A",line:"E vai a letto tardi?",translation:"And do you go to bed late?"},{speaker:"B",line:"No, mi addormento verso le undici.",translation:"No, I fall asleep around eleven."}], grammar:{title:"Reflexive Verbs — Daily Life",points:[{italian:"Mi sveglio alle 7",english:"I wake up at 7"},{italian:"Mi lavo",english:"I wash myself"},{italian:"Mi vesto",english:"I get dressed"},{italian:"Mi trucco",english:"I put on makeup"},{italian:"Mi addormento",english:"I fall asleep"}],note:"Daily routine in Italian is full of reflexive verbs. Pronoun always goes before the conjugated verb."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor asking about the student's daily routine. Practice reflexive verbs."},
  { id:33, title:"At the Supermarket", subtitle:"Al Supermercato", free:false, keywords:[{italian:"Il carrello",english:"The trolley / cart"},{italian:"Il reparto",english:"The aisle / department"},{italian:"La cassa",english:"The checkout"},{italian:"Mezzo chilo",english:"Half a kilo"},{italian:"In offerta",english:"On offer / on sale"},{italian:"Dov'e' il reparto...?",english:"Where is the... aisle?"}], dialogue:[{speaker:"A",line:"Scusi, dov'e' il reparto latticini?",translation:"Excuse me, where is the dairy aisle?"},{speaker:"B",line:"E' in fondo a destra.",translation:"It's at the back on the right."},{speaker:"A",line:"Grazie. E il pane?",translation:"Thank you. And the bread?"},{speaker:"B",line:"Al reparto panetteria, vicino all'entrata.",translation:"At the bakery section, near the entrance."},{speaker:"A",line:"Questo formaggio e' in offerta?",translation:"Is this cheese on offer?"},{speaker:"B",line:"Si', prenda due e risparmia il 20%.",translation:"Yes, take two and save 20%."}], grammar:{title:"Partitives — Expressing Some",points:[{italian:"Un chilo di pasta",english:"A kilo of pasta"},{italian:"Mezzo litro di latte",english:"Half a litre of milk"},{italian:"Del pane",english:"Some bread (partitive)"},{italian:"Delle mele",english:"Some apples (partitive)"}],note:"Italian uses del/della/dei/delle (partitives) to mean some. Vorrei del pane = I'd like some bread."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a supermarket assistant. Use lesson 33 vocabulary."},
  { id:34, title:"On the Bus", subtitle:"Sull'Autobus", free:false, keywords:[{italian:"Il biglietto",english:"The ticket"},{italian:"La fermata",english:"The stop"},{italian:"Scendere",english:"To get off"},{italian:"Salire",english:"To get on"},{italian:"Quante fermate?",english:"How many stops?"},{italian:"Devo cambiare?",english:"Do I need to change?"}], dialogue:[{speaker:"A",line:"Scusi, questo autobus va al centro?",translation:"Excuse me, does this bus go to the centre?"},{speaker:"B",line:"Si', ma deve cambiare alla fermata San Marco.",translation:"Yes, but you need to change at San Marco stop."},{speaker:"A",line:"Quante fermate sono?",translation:"How many stops is it?"},{speaker:"B",line:"Quattro fermate. Poi scende e aspetta il 14.",translation:"Four stops. Then get off and wait for the 14."},{speaker:"A",line:"Grazie! Dove compro il biglietto?",translation:"Thank you! Where do I buy the ticket?"},{speaker:"B",line:"Deve comprarlo alla tabaccheria.",translation:"You need to buy it at the tobacconist."}], grammar:{title:"Dovere + Infinitive on Public Transport",points:[{italian:"Devo scendere qui",english:"I need to get off here"},{italian:"Deve cambiare",english:"You need to change (formal)"},{italian:"Posso salire?",english:"Can I get on?"},{italian:"Devi comprare il biglietto",english:"You need to buy a ticket"}],note:"On public transport, dovere (must) and potere (can) are essential. Always pair with an infinitive verb."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a fellow passenger on a bus. Use lesson 34 vocabulary."},
  { id:35, title:"Free Time", subtitle:"Il Tempo Libero", free:false, keywords:[{italian:"Leggere",english:"To read"},{italian:"Guardare un film",english:"To watch a film"},{italian:"Passeggiare",english:"To go for a walk"},{italian:"Ascoltare musica",english:"To listen to music"},{italian:"Nel tempo libero",english:"In my free time"},{italian:"Mi annoio",english:"I'm bored"}], dialogue:[{speaker:"A",line:"Cosa fai nel tempo libero?",translation:"What do you do in your free time?"},{speaker:"B",line:"Mi piace leggere e ascoltare musica.",translation:"I like reading and listening to music."},{speaker:"A",line:"Guardi film italiani?",translation:"Do you watch Italian films?"},{speaker:"B",line:"Si'! E' il modo migliore per imparare.",translation:"Yes! It's the best way to learn."},{speaker:"A",line:"E quando ti annoi?",translation:"And when you're bored?"},{speaker:"B",line:"Vado a passeggiare. Mi rilassa molto.",translation:"I go for a walk. It really relaxes me."}], grammar:{title:"Infinitive Verbs as Nouns",points:[{italian:"Mi piace leggere",english:"I like reading"},{italian:"Preferisco guardare film",english:"I prefer watching films"},{italian:"Adoro cucinare",english:"I love cooking"},{italian:"Odio aspettare",english:"I hate waiting"},{italian:"Ho voglia di uscire",english:"I feel like going out"}],note:"Use the infinitive directly after mi piace, preferisco, adoro etc. No need for -ing forms."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor chatting about hobbies and free time. Use lesson 35 vocabulary."},
  { id:36, title:"Making and Refusing Invitations", subtitle:"Inviti e Rifiuti", free:false, keywords:[{italian:"Ti va di...?",english:"Do you fancy...?"},{italian:"Volentieri!",english:"With pleasure! / Love to!"},{italian:"Non posso",english:"I can't"},{italian:"Peccato",english:"What a shame"},{italian:"Un'altra volta",english:"Another time"},{italian:"Magari la prossima",english:"Maybe next time"}], dialogue:[{speaker:"A",line:"Ti va di venire a cena stasera?",translation:"Do you fancy coming to dinner tonight?"},{speaker:"B",line:"Volentieri! A che ora?",translation:"Love to! What time?"},{speaker:"A",line:"Alle otto. E Marco, viene?",translation:"At eight. And Marco, is he coming?"},{speaker:"B",line:"Gli chiedo. Lui di solito non puo' il venerdi'.",translation:"I'll ask him. He usually can't on Fridays."},{speaker:"A",line:"Se non puo', peccato — un'altra volta.",translation:"If he can't, what a shame — another time."},{speaker:"B",line:"Si', magari la prossima settimana.",translation:"Yes, maybe next week."}], grammar:{title:"Modal Verbs — Invitations and Refusals",points:[{italian:"Non posso venire",english:"I can't come"},{italian:"Vuoi uscire?",english:"Do you want to go out?"},{italian:"Dovrei restare",english:"I should stay"},{italian:"Potremmo andare",english:"We could go"},{italian:"Ti va di...?",english:"Do you feel like...?"}],note:"Ti va di...? is one of the most useful Italian invitation phrases. Volentieri is the perfect positive response."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor role-playing invitations. Use lesson 36 vocabulary."},
  { id:37, title:"My City", subtitle:"La Mia Città", free:false, keywords:[{italian:"Ciò che mi piace di più",english:"What I like most"},{italian:"La cosa più interessante",english:"The most interesting thing"},{italian:"Quello che non mi piace tanto",english:"What I don't like much"},{italian:"Il quartiere",english:"The neighbourhood"},{italian:"Vivace / tranquillo",english:"Lively / quiet"},{italian:"Mi manca",english:"I miss it"}], dialogue:[{speaker:"A",line:"Di dove sei?",translation:"Where are you from?"},{speaker:"B",line:"Sono di Napoli. Tu conosci?",translation:"I'm from Naples. Do you know it?"},{speaker:"A",line:"Un po'. Cosa ti piace di più?",translation:"A little. What do you like most about it?"},{speaker:"B",line:"Ciò che mi piace di più è il mare e il cibo.",translation:"What I like most is the sea and the food."},{speaker:"A",line:"E la cosa più interessante?",translation:"And the most interesting thing?"},{speaker:"B",line:"La storia. È una città antichissima.",translation:"The history. It's a very ancient city."},{speaker:"A",line:"C'è qualcosa che non ti piace tanto?",translation:"Is there anything you don't like much?"},{speaker:"B",line:"Il traffico! Quello che non sopporto è il caos.",translation:"The traffic! What I can't stand is the chaos."}], grammar:{title:"Relative Clauses — Ciò che / Quello che",points:[{italian:"Ciò che mi piace",english:"What I like (that which pleases me)"},{italian:"Quello che voglio",english:"What I want"},{italian:"La cosa che preferisco",english:"The thing that I prefer"},{italian:"Non è quello che pensavo",english:"It's not what I thought"}],note:"Ciò che and quello che both mean what in the sense of the thing that. Interchangeable. Use them to sound sophisticated."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor discussing cities and preferences. Use lesson 37 vocabulary."},
  { id:38, title:"In a Hurry", subtitle:"Di Fretta", free:false, keywords:[{italian:"Siamo in ritardo!",english:"We're late!"},{italian:"Aspettami!",english:"Wait for me!"},{italian:"Forza!",english:"Come on! / Hurry up!"},{italian:"Sbrigati!",english:"Hurry up!"},{italian:"Prendo la valigia",english:"I'll grab the suitcase"},{italian:"Corri!",english:"Run!"}], dialogue:[{speaker:"A",line:"Sbrigati! Siamo in ritardo!",translation:"Hurry up! We're late!"},{speaker:"B",line:"Aspettami, prendo la valigia.",translation:"Wait for me, I'll grab the suitcase."},{speaker:"A",line:"Prendila e vieni, forza!",translation:"Grab it and come, come on!"},{speaker:"B",line:"Aiutami con questa borsa!",translation:"Help me with this bag!"},{speaker:"A",line:"Dai, corri! Il treno parte tra cinque minuti.",translation:"Come on, run! The train leaves in five minutes."},{speaker:"B",line:"Ok ok, vengo! Non perdere la calma!",translation:"OK OK, I'm coming! Don't lose your cool!"}], grammar:{title:"Informal Imperative — Commands with Pronouns",points:[{italian:"Aspetta! / Aspettami!",english:"Wait! / Wait for me!"},{italian:"Sbrigati!",english:"Hurry up! (reflexive imperative)"},{italian:"Corri!",english:"Run!"},{italian:"Prendila!",english:"Take it! (pronoun attached to verb)"},{italian:"Aiutami!",english:"Help me!"}],note:"In informal commands, object pronouns attach to the end: prendila (take it), aspettami (wait for me). Very common in fast conversation."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor role-playing a rushed situation. Practice urgent commands."},
  { id:39, title:"Sunday with Friends", subtitle:"Domenica con gli Amici", free:false, keywords:[{italian:"Vi va di...?",english:"Do you all fancy...?"},{italian:"Preferirei",english:"I would prefer"},{italian:"L'agriturismo",english:"Country restaurant / farm stay"},{italian:"E' affollato",english:"It's crowded"},{italian:"Non si trova parcheggio",english:"You can't find parking"},{italian:"Che ne dite?",english:"What do you all think?"}], dialogue:[{speaker:"A",line:"Vi va di andare al mare domenica?",translation:"Do you fancy going to the sea on Sunday?"},{speaker:"B",line:"Preferirei andare a mangiare in un agriturismo.",translation:"I'd prefer to go eat at a country restaurant."},{speaker:"C",line:"Anch'io — la spiaggia e' sempre affollata.",translation:"Me too — the beach is always crowded."},{speaker:"A",line:"E' vero, e non si trova mai parcheggio.",translation:"True, and you can never find parking."},{speaker:"B",line:"Conosco un posto bellissimo in collina. Che ne dite?",translation:"I know a beautiful place in the hills. What do you think?"},{speaker:"C",line:"Perfetto! Prenotiamo?",translation:"Perfect! Shall we book?"}], grammar:{title:"Si Impersonale — The Impersonal Si",points:[{italian:"Non si trova parcheggio",english:"You can't find parking"},{italian:"Si mangia bene qui",english:"One eats well here"},{italian:"Come si dice?",english:"How do you say?"},{italian:"Non si sa mai",english:"You never know"}],note:"The impersonal si is used when there's no specific subject — like one or you in English. Come si dice? is one of the most useful phrases!"}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor role-playing a group of friends planning an outing. Be social and fun."},
  { id:40, title:"It Seems and I Remember", subtitle:"Mi Sembra e Mi Ricordo", free:false, keywords:[{italian:"Mi sembra che",english:"It seems to me that"},{italian:"Mi pare",english:"It appears / it seems"},{italian:"Ti ricordi?",english:"Do you remember?"},{italian:"Mi ricordo",english:"I remember"},{italian:"Non mi ricordo",english:"I don't remember"},{italian:"Mi sembra ieri",english:"It seems like yesterday"}], dialogue:[{speaker:"A",line:"Ti ricordi di quella vacanza a Capri?",translation:"Do you remember that holiday in Capri?"},{speaker:"B",line:"Certo! Mi sembra ieri.",translation:"Of course! It seems like yesterday."},{speaker:"A",line:"Ti ricordi quel ristorante sul mare?",translation:"Do you remember that restaurant by the sea?"},{speaker:"B",line:"Mi pare di si', ma non mi ricordo il nome.",translation:"I think so, but I don't remember the name."},{speaker:"A",line:"Mi sembrava cosi' romantico.",translation:"It seemed so romantic to me."},{speaker:"B",line:"Si'! Dobbiamo tornarci un giorno.",translation:"Yes! We must go back there one day."}], grammar:{title:"Reflexive Verbs — Memory and Perception",points:[{italian:"Mi ricordo",english:"I remember"},{italian:"Ti ricordi?",english:"Do you remember?"},{italian:"Si ricorda",english:"He/she remembers"},{italian:"Mi sembra / mi pare",english:"It seems to me (interchangeable)"},{italian:"Mi sembra ieri",english:"It seems like yesterday"}],note:"Ricordarsi is reflexive: mi ricordo, ti ricordi, si ricorda, ci ricordiamo. Mi sembra and mi pare are interchangeable."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor having a nostalgic conversation about memories. Be warm and reflective."},
  { id:41, title:"Talking About the Past", subtitle:"Parlare del Passato", free:false, keywords:[{italian:"Ho fatto",english:"I did / I have done"},{italian:"Ho mangiato",english:"I ate / I have eaten"},{italian:"Sono andato/a",english:"I went"},{italian:"Siamo arrivati",english:"We arrived"},{italian:"L'anno scorso",english:"Last year"},{italian:"La settimana scorsa",english:"Last week"}], dialogue:[{speaker:"A",line:"Come hai passato il weekend?",translation:"How did you spend the weekend?"},{speaker:"B",line:"Sono andato a Venezia con mia moglie.",translation:"I went to Venice with my wife."},{speaker:"A",line:"Che bello! Avete mangiato bene?",translation:"How lovely! Did you eat well?"},{speaker:"B",line:"Benissimo! Ho mangiato il miglior risotto della mia vita.",translation:"Wonderfully! I ate the best risotto of my life."},{speaker:"A",line:"E siete arrivati senza problemi?",translation:"And did you arrive without problems?"},{speaker:"B",line:"Si', il treno era in orario per una volta!",translation:"Yes, the train was on time for once!"}], grammar:{title:"Passato Prossimo — Avere vs Essere",points:[{italian:"Ho mangiato (avere)",english:"I ate — most verbs use avere"},{italian:"Sono andato/a (essere)",english:"I went — motion verbs use essere"},{italian:"Siamo arrivati (essere)",english:"We arrived — participle agrees with subject"},{italian:"Hai fatto?",english:"Did you do?"},{italian:"Non ho capito",english:"I didn't understand"}],note:"Motion verbs (andare, venire, arrivare, partire) use essere. Everything else uses avere. Participle changes: andato (m), andata (f)."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor asking about recent events. Practice passato prossimo."},
  { id:42, title:"Childhood Memories", subtitle:"Ricordi d'Infanzia", free:false, keywords:[{italian:"Quando ero piccolo/a",english:"When I was young"},{italian:"Giocavo",english:"I used to play"},{italian:"La scuola",english:"School"},{italian:"D'estate",english:"In the summer"},{italian:"Ogni giorno",english:"Every day"},{italian:"Mi piaceva",english:"I used to like"}], dialogue:[{speaker:"A",line:"Com'era la tua infanzia?",translation:"What was your childhood like?"},{speaker:"B",line:"Bellissima! D'estate giocavo sempre fuori.",translation:"Wonderful! In summer I always played outside."},{speaker:"A",line:"E la scuola? Ti piaceva?",translation:"And school? Did you like it?"},{speaker:"B",line:"Abbastanza. Mi piaceva la matematica.",translation:"Quite. I liked maths."},{speaker:"A",line:"Quando ero piccola, volevo fare la ballerina.",translation:"When I was young, I wanted to be a dancer."},{speaker:"B",line:"Davvero? Anch'io avevo grandi sogni!",translation:"Really? I had big dreams too!"}], grammar:{title:"Imperfetto — Habits and States in the Past",points:[{italian:"Giocavo ogni giorno",english:"I used to play every day"},{italian:"Quando ero piccolo...",english:"When I was young..."},{italian:"Mi piaceva la scuola",english:"I used to like school"},{italian:"Volevo fare...",english:"I wanted to be / do..."},{italian:"Era bellissimo",english:"It was wonderful"}],note:"The imperfetto describes ongoing past states and habits. Compare: Ho mangiato la pizza (once) vs Mangiavo la pizza ogni venerdi (used to)."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor having a nostalgic conversation about childhood. Practice the imperfetto."},
  { id:43, title:"Expressing Opinions", subtitle:"Esprimere Opinioni", free:false, keywords:[{italian:"Secondo me",english:"In my opinion"},{italian:"Penso che",english:"I think that"},{italian:"Mi sembra",english:"It seems to me"},{italian:"Mi pare",english:"It appears to me"},{italian:"Sono d'accordo",english:"I agree"},{italian:"Hai ragione",english:"You're right"}], dialogue:[{speaker:"A",line:"Secondo te, qual e' la citta' piu' bella d'Italia?",translation:"In your opinion, which is the most beautiful city in Italy?"},{speaker:"B",line:"Secondo me, Firenze. Mi sembra unica.",translation:"In my opinion, Florence. It seems unique to me."},{speaker:"A",line:"Penso che Roma sia piu' interessante.",translation:"I think Rome is more interesting."},{speaker:"B",line:"Hai ragione, Roma e' straordinaria.",translation:"You're right, Rome is extraordinary."},{speaker:"A",line:"Sei d'accordo che il cibo e' meglio al sud?",translation:"Do you agree that the food is better in the south?"},{speaker:"B",line:"Assolutamente! Non c'e' dubbio.",translation:"Absolutely! There's no doubt."}], grammar:{title:"Opinion Structures",points:[{italian:"Secondo me...",english:"In my opinion..."},{italian:"Mi sembra che",english:"It seems to me that"},{italian:"Mi pare che",english:"It appears to me that"},{italian:"Sono / non sono d'accordo",english:"I agree / I disagree"}],note:"Secondo me is the easiest way to give an opinion. Mi sembra and mi pare are interchangeable and very natural."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor having a lively discussion about Italian culture. Practice opinion structures."},
  { id:44, title:"Giving Advice", subtitle:"Dare Consigli", free:false, keywords:[{italian:"Dovresti",english:"You should"},{italian:"Ti consiglio di",english:"I advise you to"},{italian:"E' meglio che",english:"It's better that"},{italian:"Al posto tuo",english:"In your position / if I were you"},{italian:"Perche' non...?",english:"Why don't you...?"},{italian:"Prova a",english:"Try to"}], dialogue:[{speaker:"A",line:"Non riesco a dormire bene.",translation:"I can't sleep well."},{speaker:"B",line:"Dovresti andare a letto prima.",translation:"You should go to bed earlier."},{speaker:"A",line:"Ho provato, ma non funziona.",translation:"I've tried, but it doesn't work."},{speaker:"B",line:"Ti consiglio di evitare il caffe' la sera.",translation:"I advise you to avoid coffee in the evening."},{speaker:"A",line:"Al posto tuo, cosa faresti?",translation:"If you were me, what would you do?"},{speaker:"B",line:"Perche' non provi una camomilla prima di dormire?",translation:"Why don't you try chamomile before sleeping?"}], grammar:{title:"Conditional for Advice",points:[{italian:"Dovresti riposare",english:"You should rest"},{italian:"Potresti provare",english:"You could try"},{italian:"Al posto tuo, andrei",english:"In your position, I would go"},{italian:"Perche' non parli con lui?",english:"Why don't you talk to him?"},{italian:"Ti consiglio di aspettare",english:"I advise you to wait"}],note:"Dovresti (you should) and potresti (you could) are conditional forms — perfect for giving advice without being too forceful."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor playing a wise friend giving advice. Be warm and helpful."},
  { id:45, title:"Real and Hypothetical", subtitle:"Reale e Ipotetico", free:false, keywords:[{italian:"Se ho i soldi, vado",english:"If I have the money, I'll go (real possibility)"},{italian:"Se avessi i soldi, andrei",english:"If I had the money, I would go (hypothetical)"},{italian:"Magari potessi!",english:"If only I could!"},{italian:"Nel caso in cui",english:"In the event that"},{italian:"Dipende da",english:"It depends on"},{italian:"Chissà",english:"Who knows / maybe someday"}], dialogue:[{speaker:"A",line:"Cosa fai a luglio?",translation:"What are you doing in July?"},{speaker:"B",line:"Se ho i soldi, vado in Sicilia.",translation:"If I have the money, I'll go to Sicily."},{speaker:"A",line:"E se non li hai?",translation:"And if you don't have them?"},{speaker:"B",line:"Resto a casa. Ma tu?",translation:"I'll stay home. But you?"},{speaker:"A",line:"Io sogno in grande — se avessi i soldi, andrei in Giappone!",translation:"I dream big — if I had the money, I'd go to Japan!"},{speaker:"B",line:"Magari potessi anch'io! Chissà, un giorno.",translation:"If only I could too! Who knows, one day."},{speaker:"A",line:"Se vincessi alla lotteria, ci andremmo insieme!",translation:"If I won the lottery, we'd go together!"}], grammar:{title:"Conditionals — Real vs Hypothetical",points:[{italian:"Se ho tempo, vengo",english:"If I have time, I'll come (real)"},{italian:"Se avessi tempo, verrei",english:"If I had time, I would come (hypothetical)"},{italian:"Se fosse possibile",english:"If it were possible"},{italian:"Se vincessi alla lotteria",english:"If I won the lottery"},{italian:"Chissà",english:"Who knows"}],note:"Real: se + present = something that might happen. Hypothetical: se + imperfect subjunctive + conditional = something unlikely or imaginary."}, aiPrompt:"STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. Never break character. Always reply in English using Italian from the lesson. You are an Italian tutor exploring real and hypothetical situations. Be imaginative and warm."},
];

// ── Text-to-Speech ────────────────────────────────────────────────────────────
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT"; u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlayIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>);
const ChevronRight = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6" /></svg>);
const LockIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>);

// ── AI Chat ───────────────────────────────────────────────────────────────────
function AiChat({ lesson, t }) {
  const DAILY_LIMIT = 20;
  const storageKey = `msgCount_${lesson.id}_${new Date().toDateString()}`;
  const [messages, setMessages] = useState([{ role:"assistant", content:`Ciao! Ready to practise "${lesson.title}"? Let's go! 😊 (${DAILY_LIMIT} messages today)` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(() => { try { return parseInt(localStorage.getItem(storageKey) || "0"); } catch { return 0; } });
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    if (msgCount >= DAILY_LIMIT) { setMessages(prev => [...prev, { role:"assistant", content:t.aiLimit }]); return; }
    const userMsg = { role:"user", content:input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput(""); setLoading(true);
    const newCount = msgCount + 1; setMsgCount(newCount);
    try { localStorage.setItem(storageKey, newCount.toString()); } catch {}
    if (lesson.free) {
      await new Promise(r => setTimeout(r, 600));
      setMessages(prev => [...prev, { role:"assistant", content:t.aiSub }]);
      setLoading(false); return;
    }
    const langName = t.name || "English";
    const systemPrompt = lesson.aiPrompt.replace("Always reply in English", `Always reply in ${langName}`);
    try {
      const response = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, system:systemPrompt, messages:[...messages, userMsg] }) });
      const data = await response.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Connection error. Please try again!";
      setMessages(prev => [...prev, { role:"assistant", content:reply }]);
    } catch { setMessages(prev => [...prev, { role:"assistant", content:"Connection error. Please try again!" }]); }
    setLoading(false);
  }

  return (
    <div style={styles.chatWrap}>
      <div style={styles.chatHeader}><span style={styles.chatHeaderDot} />{t.ai} — {lesson.title}</div>
      <div style={styles.chatMessages}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:10 }}>
            <div style={m.role==="user"?styles.bubbleUser:styles.bubbleAI}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ display:"flex", justifyContent:"flex-start", marginBottom:10 }}><div style={styles.bubbleAI}><span style={styles.typingDots}>●&nbsp;●&nbsp;●</span></div></div>}
        <div ref={bottomRef} />
      </div>
      <div style={styles.chatInput}>
        <input style={styles.chatInputField} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMessage()} placeholder={t.typeItalian} />
        <button style={styles.chatSend} onClick={sendMessage} disabled={loading}>{loading ? "…" : "→"}</button>
      </div>
    </div>
  );
}

// ── Lesson View ───────────────────────────────────────────────────────────────
function LessonView({ lesson, onBack, t }) {
  const [step, setStep] = useState(0);
  const [kwIndex, setKwIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const steps = [t.words, t.dialogue, t.grammar, t.ai];

  return (
    <div style={styles.lessonWrap}>
      <button style={styles.backBtn} onClick={onBack}>{t.allLessons}</button>
      <div style={styles.lessonHeader}>
        <span style={styles.lessonNum}>{t.lesson} {lesson.id}</span>
        <h2 style={styles.lessonTitle}>{lesson.title}</h2>
        <p style={styles.lessonSubtitle}>{lesson.subtitle}</p>
      </div>
      <div style={styles.tabs}>
        {steps.map((s, i) => (<button key={i} style={i===step?styles.tabActive:styles.tab} onClick={() => { setStep(i); setKwIndex(0); setFlipped(false); }}>{s}</button>))}
      </div>
      {step === 0 && (
        <div style={styles.card}>
          <div style={styles.kwCount}>{kwIndex+1} / {lesson.keywords.length}</div>
          <div style={styles.kwItalian}>{lesson.keywords[kwIndex].italian}</div>
          <div style={styles.kwEnglish}>{lesson.keywords[kwIndex].english}</div>
          <button style={styles.speakBtn} onClick={() => speak(lesson.keywords[kwIndex].italian)}><PlayIcon /> {t.listen}</button>
          <div style={styles.kwNav}>
            <button style={styles.navBtn} onClick={() => setKwIndex(i => Math.max(0,i-1))} disabled={kwIndex===0}>‹</button>
            <button style={styles.navBtn} onClick={() => setKwIndex(i => Math.min(lesson.keywords.length-1,i+1))} disabled={kwIndex===lesson.keywords.length-1}>›</button>
          </div>
          {kwIndex===lesson.keywords.length-1 && (<button style={styles.nextStepBtn} onClick={() => setStep(1)}>{t.nextDia} <ChevronRight /></button>)}
        </div>
      )}
      {step === 1 && (
        <div style={styles.card}>
          <h3 style={styles.sectionLabel}>{t.dialogue}</h3>
          <div style={styles.dialogueWrap}>
            {lesson.dialogue.map((line, i) => (
              <div key={i} style={styles.dialogueLine}>
                <span style={styles.dialogueSpeaker}>{line.speaker}</span>
                <div style={{flex:1}}><div style={styles.dialogueText}>{line.line}</div>{line.translation && <div style={styles.dialogueTranslation}>{line.translation}</div>}</div>
                <button style={styles.speakSmall} onClick={() => speak(line.line)}><PlayIcon /></button>
              </div>
            ))}
          </div>
          <button style={styles.speakBtn} onClick={() => lesson.dialogue.forEach((l,i) => setTimeout(() => speak(l.line), i*2200))}><PlayIcon /> {t.listenAll}</button>
          <button style={styles.nextStepBtn} onClick={() => setStep(2)}>{t.nextGram} <ChevronRight /></button>
        </div>
      )}
      {step === 2 && (
        <div style={styles.card}>
          <h3 style={styles.sectionLabel}>{t.grammar}</h3>
          <div style={{...styles.flashcard,...(flipped?styles.flashcardFlipped:{})}} onClick={() => setFlipped(f => !f)}>
            {!flipped ? (<div><div style={styles.flashFront}>{lesson.grammar.title}</div><div style={styles.flashHint}>{t.tapSee}</div></div>)
            : (<div>{lesson.grammar.points.map((p,i) => (<div key={i} style={styles.grammarRow}><span style={styles.grammarIT}>{p.italian}</span><span style={styles.grammarEN}>{p.english}</span></div>))}<div style={styles.grammarNote}>{lesson.grammar.note}</div></div>)}
          </div>
          <button style={styles.nextStepBtn} onClick={() => setStep(3)}>{t.nextAI} <ChevronRight /></button>
        </div>
      )}
      {step === 3 && <AiChat lesson={lesson} t={t} />}
    </div>
  );
}

// ── Checkout ──────────────────────────────────────────────────────────────────
async function handleCheckout(plan) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch("/api/create-checkout", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ plan, userId:session?.user?.id }) });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
  } catch { alert("Something went wrong. Please try again."); }
}

// ── Home ──────────────────────────────────────────────────────────────────────
function Home({ onSelect, isSubscribed, onLegal, t }) {
  return (
    <div style={styles.home}>
      <div style={styles.hero}>
        <div style={styles.heroTag}>{t.tagline}</div>
        <h1 style={styles.heroTitle}>Parli<span style={styles.heroAccent}>ssimo</span></h1>
        <p style={styles.heroSub}>{t.subtitle}</p>
      </div>
      <div style={styles.lessonList}>
        <h3 style={styles.listHeading}>{t.mod1}</h3>
        {LESSONS.filter(l => l.id <= 20).map(lesson => (
          <div key={lesson.id} style={styles.lessonCard} onClick={() => onSelect(lesson)}>
            <div style={styles.lessonCardLeft}><span style={styles.lessonCardNum}>{lesson.id<10?`0${lesson.id}`:lesson.id}</span><div><div style={styles.lessonCardTitle}>{lesson.title}</div><div style={styles.lessonCardSub}>{lesson.subtitle}</div></div></div>
            <div style={styles.lessonCardRight}>{lesson.free?<span style={styles.freeBadge}>{t.free}</span>:isSubscribed?<span style={styles.freeBadge}>✓</span>:<span style={styles.lockBadge}><LockIcon /> {t.subscribe}</span>}<ChevronRight /></div>
          </div>
        ))}
        <h3 style={{...styles.listHeading, marginTop:28}}>{t.mod2}</h3>
        {LESSONS.filter(l => l.id>=21 && l.id<=40).map(lesson => (
          <div key={lesson.id} style={styles.lessonCard} onClick={() => onSelect(lesson)}>
            <div style={styles.lessonCardLeft}><span style={styles.lessonCardNum}>{lesson.id<10?`0${lesson.id}`:lesson.id}</span><div><div style={styles.lessonCardTitle}>{lesson.title}</div><div style={styles.lessonCardSub}>{lesson.subtitle}</div></div></div>
            <div style={styles.lessonCardRight}>{lesson.free?<span style={styles.freeBadge}>{t.free}</span>:isSubscribed?<span style={styles.freeBadge}>✓</span>:<span style={styles.lockBadge}><LockIcon /> {t.subscribe}</span>}<ChevronRight /></div>
          </div>
        ))}
        <h3 style={{...styles.listHeading, marginTop:28}}>{t.mod3}</h3>
        {LESSONS.filter(l => l.id>=41).map(lesson => (
          <div key={lesson.id} style={styles.lessonCard} onClick={() => onSelect(lesson)}>
            <div style={styles.lessonCardLeft}><span style={styles.lessonCardNum}>{lesson.id<10?`0${lesson.id}`:lesson.id}</span><div><div style={styles.lessonCardTitle}>{lesson.title}</div><div style={styles.lessonCardSub}>{lesson.subtitle}</div></div></div>
            <div style={styles.lessonCardRight}>{lesson.free?<span style={styles.freeBadge}>{t.free}</span>:isSubscribed?<span style={styles.freeBadge}>✓</span>:<span style={styles.lockBadge}><LockIcon /> {t.subscribe}</span>}<ChevronRight /></div>
          </div>
        ))}
      </div>
      <div id="pricing-section" style={styles.pricingBox}>
        <div style={styles.pricingTitle}>{t.unlockTitle}</div>
        <p style={styles.pricingText}>{t.unlockText}</p>
        <div style={styles.pricingOptions}>
          <div style={styles.pricingOpt}><span style={styles.pricingPrice}>$3</span><span style={styles.pricingPer}>/month</span></div>
          <div style={styles.pricingDivider}>or</div>
          <div style={styles.pricingOpt}><span style={styles.pricingPrice}>$30</span><span style={styles.pricingPer}>/year</span><span style={styles.pricingSave}>Save 17%</span></div>
          <div style={styles.pricingDivider}>or</div>
          <div style={styles.pricingOpt}><span style={styles.pricingPrice}>$49</span><span style={styles.pricingPer}>lifetime</span><span style={styles.pricingSaveBest}>Best Value</span></div>
        </div>
        <div style={styles.pricingButtons}>
          <button style={styles.ctaBtn} onClick={() => handleCheckout("monthly")}>{t.monthly}</button>
          <button style={styles.ctaBtn} onClick={() => handleCheckout("yearly")}>{t.yearly}</button>
          <button style={{...styles.ctaBtn, background:"#B8860B"}} onClick={() => handleCheckout("lifetime")}>{t.lifetime}</button>
        </div>
      </div>
      <div style={styles.footer}>
        <span style={styles.footerLink} onClick={() => onLegal("privacy")}>Privacy Policy</span>
        <span style={styles.footerDot}>·</span>
        <span style={styles.footerLink} onClick={() => onLegal("terms")}>Terms of Service</span>
        <span style={styles.footerDot}>·</span>
        <span style={styles.footerText}>© 2026 Parlissimo</span>
      </div>
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, onAuth, t }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit() {
    setLoading(true); setMessage("");
    if (mode==="login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message); else onAuth();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message); else setMessage("Check your email to confirm your account!");
    }
    setLoading(false);
  }

  async function handleReset() {
    if (!email.trim()) { setMessage("Enter your email above first."); return; }
    if (resetSent) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo:"https://parlissimo.live" });
    if (error) setMessage(error.message); else setResetSent(true);
    setLoading(false);
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <button style={styles.modalClose} onClick={onClose}>×</button>
        <h2 style={styles.modalTitle}>{mode==="login"?t.welcome:t.create}</h2>
        <input style={styles.authInput} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.authInput} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter" && handleSubmit()} />
        {message && <div style={styles.authMessage}>{message}</div>}
        <button style={styles.ctaBtn} onClick={handleSubmit} disabled={loading}>{loading?"...":mode==="login"?t.login:t.create}</button>
        <div style={styles.authSwitch}>
          {mode==="login" ? (
            <div>
              <div style={{marginBottom:8}}>{t.noAccount} <span style={styles.authLink} onClick={() => setMode("signup")}>{t.signUp}</span></div>
              {resetSent?<div style={{color:"#2E7D32",fontSize:12}}>✓ {t.resetSent}</div>:<div>{t.forgot} <span style={styles.authLink} onClick={handleReset}>{t.sendReset}</span></div>}
            </div>
          ) : (<span>{t.haveAccount} <span style={styles.authLink} onClick={() => setMode("login")}>{t.login}</span></span>)}
        </div>
      </div>
    </div>
  );
}

// ── Reset Password Page ───────────────────────────────────────────────────────
function ResetPasswordPage({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  async function handleReset() {
    if (password.length < 6) { setMessage("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setMessage("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(error.message);
    else { setDone(true); setTimeout(() => { if (onDone) onDone(); }, 2000); }
    setLoading(false);
  }

  return (
    <div style={styles.shell}>
      <div style={styles.container}>
        <div style={{paddingTop:60, maxWidth:380, margin:"0 auto"}}>
          <h2 style={styles.modalTitle}>Create new password</h2>
          {done ? (
            <div style={{color:"#2E7D32", marginBottom:20, fontFamily:"sans-serif", fontSize:14}}>
              ✓ Password updated! <a href="https://parlissimo.live" style={{color:"#C4622D"}}>Go to Parlissimo</a>
            </div>
          ) : (
            <div>
              <input style={styles.authInput} type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
              <input style={styles.authInput} type="password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key==="Enter" && handleReset()} />
              {message && <div style={styles.authMessage}>{message}</div>}
              <button style={styles.ctaBtn} onClick={handleReset} disabled={loading}>{loading?"...":"Update password"}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Legal Pages ───────────────────────────────────────────────────────────────
function LegalPage({ type, onClose }) {
  return (
    <div style={styles.shell}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={onClose}>← Back to Parlissimo</button>
        <div style={styles.legalWrap}>
          {type==="privacy" ? <PrivacyPolicy /> : <TermsOfService />}
        </div>
      </div>
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <div>
      <h1 style={styles.legalTitle}>Privacy Policy</h1>
      <p style={styles.legalDate}>Last updated: May 2026</p>
      <p style={styles.legalText}>Parlissimo ("we", "us", "our") operates parlissimo.live. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
      <h2 style={styles.legalH2}>1. Information We Collect</h2>
      <p style={styles.legalText}><strong>Account information:</strong> When you register, we collect your email address and encrypted password. <strong>Payment information:</strong> Payments are processed by Stripe. We do not store your credit card details. <strong>AI conversations:</strong> Messages you send to the AI practice chat are processed by Anthropic's API. We do not permanently store your conversation history.</p>
      <h2 style={styles.legalH2}>2. How We Use Your Information</h2>
      <p style={styles.legalText}>We use your information to provide and maintain the service, process payments, send transactional emails, and improve our content. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
      <h2 style={styles.legalH2}>3. Data Storage and Security</h2>
      <p style={styles.legalText}>Your account data is stored securely using Supabase. Payment data is handled exclusively by Stripe, a PCI-DSS compliant payment processor.</p>
      <h2 style={styles.legalH2}>4. Cookies</h2>
      <p style={styles.legalText}>Parlissimo uses minimal cookies and local browser storage strictly necessary for authentication and session management. We do not use tracking cookies or third-party advertising cookies.</p>
      <h2 style={styles.legalH2}>5. Third-Party Services</h2>
      <p style={styles.legalText}>We use: Supabase (authentication and database), Stripe (payment processing), Anthropic (AI conversation practice), Vercel (hosting). Each has their own Privacy Policy.</p>
      <h2 style={styles.legalH2}>6. Your Rights</h2>
      <p style={styles.legalText}>You have the right to access, correct, or delete your personal data. Contact us at: hello@parlissimo.live</p>
      <h2 style={styles.legalH2}>7. Contact</h2>
      <p style={styles.legalText}>For privacy-related questions: <strong>hello@parlissimo.live</strong></p>
    </div>
  );
}

function TermsOfService() {
  return (
    <div>
      <h1 style={styles.legalTitle}>Terms of Service</h1>
      <p style={styles.legalDate}>Last updated: May 2026</p>
      <p style={styles.legalText}>By accessing or using Parlissimo, you agree to be bound by these terms.</p>
      <h2 style={styles.legalH2}>1. Service Description</h2>
      <p style={styles.legalText}>Parlissimo is an Italian language learning platform. The first lesson is free. All lessons and AI practice require a paid subscription.</p>
      <h2 style={styles.legalH2}>2. Subscriptions and Payments</h2>
      <p style={styles.legalText}><strong>Monthly:</strong> $3.00/month, automatically renewed. <strong>Annual:</strong> $30.00/year, automatically renewed. <strong>Lifetime:</strong> $49.00 one-time payment. All payments are processed securely by Stripe.</p>
      <h2 style={styles.legalH2}>3. Cancellation and Refunds</h2>
      <p style={styles.legalText}>You may cancel your subscription at any time through the Manage option in the app. You retain access until the end of your current billing period. No refunds are provided for partial billing periods.</p>
      <h2 style={styles.legalH2}>4. AI Practice — Acceptable Use</h2>
      <p style={styles.legalText}>The AI feature is provided solely for Italian language practice. Misuse may result in immediate suspension without refund. AI practice is limited to 20 messages per lesson per day.</p>
      <h2 style={styles.legalH2}>5. Intellectual Property</h2>
      <p style={styles.legalText}>All content on Parlissimo is protected by copyright. You may not reproduce or distribute our content without prior written permission.</p>
      <h2 style={styles.legalH2}>6. Contact</h2>
      <p style={styles.legalText}>For questions: <strong>hello@parlissimo.live</strong></p>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeLesson, setActiveLesson] = useState(null);
  const [legalPage, setLegalPage] = useState(null);
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("parlissimo_lang") || "en"; } catch { return "en"; } });
  const t = UI[lang] || UI.en;
  function changeLang(code) { setLang(code); try { localStorage.setItem("parlissimo_lang", code); } catch {} }

  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const isResetModeRef = useRef(false);
  useEffect(() => { isResetModeRef.current = isResetMode; }, [isResetMode]);

  useEffect(() => {
    try {
      const h = new URLSearchParams(window.location.hash.replace("#","?"));
      if (h.get("type") === "recovery") { setIsResetMode(true); setLoadingAuth(false); return; }
    } catch {}
    if (isResetModeRef.current) { setLoadingAuth(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkSubscription(session.user.id); else setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event==="PASSWORD_RECOVERY") { setIsResetMode(true); setLoadingAuth(false); return; }
      if (event==="USER_UPDATED") { setIsResetMode(false); try { window.location.hash=""; } catch {} setLoadingAuth(false); return; }
      if (isResetModeRef.current) return;
      setUser(session?.user ?? null);
      if (session?.user) checkSubscription(session.user.id);
      else { setIsSubscribed(false); setLoadingAuth(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); setShowInstallBanner(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome==="accepted") setShowInstallBanner(false);
  }

  async function checkSubscription(userId) {
    const { data } = await supabase.from("subscriptions").select("*").eq("user_id", userId).eq("status","active").single();
    setIsSubscribed(!!data); setLoadingAuth(false);
  }

  async function handleManageSubscription() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch("/api/customer-portal", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ userId:session?.user?.id }) });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch { alert("Something went wrong. Please try again."); }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null); setIsSubscribed(false); setActiveLesson(null);
  }

  function handleLessonSelect(lesson) {
    if (!lesson.free && !isSubscribed) { try { document.getElementById("pricing-section")?.scrollIntoView({ behavior:"smooth" }); } catch {} return; }
    setActiveLesson(lesson);
  }

  const isIOS = () => { try { return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone; } catch { return false; } };

  if (isResetMode) return <ResetPasswordPage onDone={() => { setIsResetMode(false); try { window.location.hash=""; } catch {} }} />;
  if (legalPage) return <LegalPage type={legalPage} onClose={() => setLegalPage(null)} />;
  if (loadingAuth) return (<div style={{...styles.shell, display:"flex", alignItems:"center", justifyContent:"center"}}><div style={{color:"#C4622D", fontSize:14, fontFamily:"sans-serif"}}>{t.loading}</div></div>);

  return (
    <div style={styles.shell}>
      <div style={styles.container}>
        {showInstallBanner && (
          <div style={styles.installBanner}>
            <span style={styles.installBannerText}>{t.install}</span>
            <div style={styles.installBannerButtons}>
              <button style={styles.installBtn} onClick={handleInstall}>{t.installBtn}</button>
              <button style={styles.installDismiss} onClick={() => setShowInstallBanner(false)}>✕</button>
            </div>
          </div>
        )}
        {!installPrompt && isIOS() && (<div style={{...styles.iosHint, display:"block"}}>{t.iosHint}</div>)}
        <div style={styles.topBar}>
          <div style={styles.topBarRow1}>
            <span style={styles.topBarLogo}>Parlissimo</span>
            <div style={styles.langSelector}>
              {LANGUAGES.map(code => (<button key={code} style={{...styles.langBtn,...(lang===code?styles.langBtnActive:{})}} onClick={() => changeLang(code)}>{UI[code].flag}</button>))}
            </div>
          </div>
          {user ? (
            <div style={styles.topBarRight}>
              <span style={styles.topBarEmail}>{user.email}</span>
              {isSubscribed && <span style={styles.topBarBadge}>✓ Active</span>}
              {isSubscribed && <button style={styles.topBarBtn} onClick={handleManageSubscription}>{t.manage}</button>}
              <button style={styles.topBarBtn} onClick={handleLogout}>{t.logout}</button>
            </div>
          ) : (
            <button style={styles.topBarBtn} onClick={() => setShowAuth(true)}>{t.login}</button>
          )}
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={() => setShowAuth(false)} t={t} />}
        {activeLesson
          ? <LessonView lesson={activeLesson} onBack={() => setActiveLesson(null)} isSubscribed={isSubscribed} t={t} />
          : <Home onSelect={handleLessonSelect} isSubscribed={isSubscribed} onLegal={setLegalPage} t={t} />}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const C = { cream:"#FAF7F2", sand:"#EDE8DF", terracotta:"#C4622D", terracottaLight:"#E8835A", brown:"#3D2B1F", brownMid:"#6B4C3B", gold:"#B8860B", white:"#FFFFFF", offWhite:"#F5F0E8", border:"#D9D0C4", textMuted:"#9A8A7A" };

const styles = {
  shell:{ minHeight:"100vh", background:C.cream, fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif", color:C.brown },
  container:{ maxWidth:560, margin:"0 auto", padding:"0 16px 60px" },
  home:{},
  hero:{ textAlign:"center", padding:"48px 16px 32px", borderBottom:`1px solid ${C.border}`, marginBottom:32 },
  heroTag:{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:C.terracotta, marginBottom:16, fontFamily:"'Gill Sans','Optima',sans-serif" },
  heroTitle:{ fontSize:52, fontWeight:700, margin:"0 0 12px", letterSpacing:"-0.02em", lineHeight:1, color:C.brown },
  heroAccent:{ color:C.terracotta },
  heroSub:{ fontSize:15, color:C.brownMid, lineHeight:1.6, maxWidth:360, margin:"0 auto", fontStyle:"italic" },
  listHeading:{ fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:C.textMuted, marginBottom:14, fontFamily:"'Gill Sans','Optima',sans-serif", fontWeight:400 },
  lessonList:{ marginBottom:36 },
  lessonCard:{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px", background:C.white, border:`1px solid ${C.border}`, borderRadius:4, marginBottom:8, cursor:"pointer" },
  lessonCardLeft:{ display:"flex", alignItems:"center", gap:16 },
  lessonCardNum:{ fontSize:22, color:C.border, fontWeight:300, minWidth:32, fontFamily:"'Palatino Linotype',Georgia,serif" },
  lessonCardTitle:{ fontSize:16, fontWeight:600, color:C.brown, marginBottom:2 },
  lessonCardSub:{ fontSize:12, color:C.textMuted, fontStyle:"italic" },
  lessonCardRight:{ display:"flex", alignItems:"center", gap:10, color:C.textMuted },
  freeBadge:{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", background:"#E8F5E9", color:"#2E7D32", padding:"3px 8px", borderRadius:20, fontFamily:"sans-serif" },
  lockBadge:{ fontSize:11, color:C.textMuted, display:"flex", alignItems:"center", gap:4, fontFamily:"sans-serif" },
  pricingBox:{ background:C.brown, borderRadius:6, padding:"32px 28px", textAlign:"center", color:C.cream },
  pricingTitle:{ fontSize:20, fontWeight:600, marginBottom:8 },
  pricingText:{ fontSize:13, color:C.sand, fontStyle:"italic", marginBottom:24, lineHeight:1.5 },
  pricingOptions:{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, marginBottom:24 },
  pricingOpt:{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 },
  pricingPrice:{ fontSize:32, fontWeight:700, color:C.white },
  pricingPer:{ fontSize:12, color:C.sand, fontFamily:"sans-serif" },
  pricingSave:{ fontSize:10, background:C.terracotta, color:C.white, padding:"2px 7px", borderRadius:10, letterSpacing:"0.06em", fontFamily:"sans-serif" },
  pricingSaveBest:{ fontSize:10, background:C.gold, color:C.white, padding:"2px 7px", borderRadius:10, letterSpacing:"0.06em", fontFamily:"sans-serif" },
  pricingDivider:{ color:C.textMuted, fontSize:12, fontStyle:"italic" },
  pricingButtons:{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 },
  ctaBtn:{ background:C.terracotta, color:C.white, border:"none", borderRadius:3, padding:"13px 36px", fontSize:14, fontFamily:"'Gill Sans','Optima',sans-serif", letterSpacing:"0.08em", cursor:"pointer", fontWeight:600 },
  lessonWrap:{ paddingTop:24 },
  backBtn:{ background:"none", border:"none", color:C.terracotta, fontSize:13, cursor:"pointer", padding:0, marginBottom:24, fontFamily:"'Gill Sans','Optima',sans-serif", letterSpacing:"0.06em" },
  lessonHeader:{ marginBottom:28, paddingBottom:20, borderBottom:`1px solid ${C.border}` },
  lessonNum:{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:C.terracotta, fontFamily:"sans-serif", display:"block", marginBottom:6 },
  lessonTitle:{ fontSize:32, fontWeight:700, margin:"0 0 4px", color:C.brown },
  lessonSubtitle:{ fontSize:15, fontStyle:"italic", color:C.brownMid, margin:0 },
  tabs:{ display:"flex", gap:4, marginBottom:24, background:C.sand, borderRadius:4, padding:4 },
  tab:{ flex:1, padding:"8px 4px", border:"none", background:"none", color:C.textMuted, fontSize:11, cursor:"pointer", fontFamily:"'Gill Sans','Optima',sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", borderRadius:3 },
  tabActive:{ flex:1, padding:"8px 4px", border:"none", background:C.white, color:C.terracotta, fontSize:11, cursor:"pointer", fontFamily:"'Gill Sans','Optima',sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", borderRadius:3, boxShadow:"0 1px 4px rgba(0,0,0,0.08)", fontWeight:600 },
  card:{ background:C.white, border:`1px solid ${C.border}`, borderRadius:6, padding:28 },
  kwCount:{ fontSize:11, color:C.textMuted, letterSpacing:"0.1em", marginBottom:24, fontFamily:"sans-serif" },
  kwItalian:{ fontSize:36, fontWeight:700, color:C.brown, marginBottom:10, letterSpacing:"-0.01em" },
  kwEnglish:{ fontSize:16, color:C.brownMid, fontStyle:"italic", marginBottom:24 },
  speakBtn:{ display:"inline-flex", alignItems:"center", gap:8, background:C.cream, border:`1px solid ${C.border}`, borderRadius:3, padding:"9px 18px", cursor:"pointer", fontSize:12, color:C.brownMid, fontFamily:"'Gill Sans','Optima',sans-serif", letterSpacing:"0.06em", marginBottom:24 },
  kwNav:{ display:"flex", gap:10, marginBottom:8 },
  navBtn:{ width:42, height:42, borderRadius:"50%", border:`1px solid ${C.border}`, background:C.cream, cursor:"pointer", fontSize:20, color:C.brownMid, display:"flex", alignItems:"center", justifyContent:"center" },
  nextStepBtn:{ marginTop:20, display:"inline-flex", alignItems:"center", gap:8, background:C.terracotta, color:C.white, border:"none", borderRadius:3, padding:"11px 22px", fontSize:12, cursor:"pointer", fontFamily:"'Gill Sans','Optima',sans-serif", letterSpacing:"0.08em" },
  sectionLabel:{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:C.textMuted, fontFamily:"sans-serif", fontWeight:400, marginBottom:20 },
  dialogueWrap:{ marginBottom:20 },
  dialogueLine:{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.sand}` },
  dialogueSpeaker:{ minWidth:52, fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:C.terracotta, fontFamily:"sans-serif" },
  dialogueText:{ fontSize:15, color:C.brown, lineHeight:1.5, marginBottom:2 },
  dialogueTranslation:{ fontSize:12, color:C.textMuted, fontStyle:"italic" },
  speakSmall:{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", padding:4, display:"flex", alignItems:"center" },
  flashcard:{ background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:6, padding:28, cursor:"pointer", minHeight:140, marginBottom:20, transition:"background 0.3s", display:"flex", alignItems:"center", justifyContent:"center" },
  flashcardFlipped:{ background:C.sand },
  flashFront:{ fontSize:22, fontWeight:600, color:C.brown, textAlign:"center", marginBottom:12 },
  flashHint:{ fontSize:11, color:C.textMuted, textAlign:"center", fontStyle:"italic", fontFamily:"sans-serif" },
  grammarRow:{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` },
  grammarIT:{ fontSize:15, fontWeight:600, color:C.brown },
  grammarEN:{ fontSize:13, color:C.brownMid, fontStyle:"italic" },
  grammarNote:{ fontSize:12, color:C.textMuted, marginTop:14, lineHeight:1.6, fontStyle:"italic", fontFamily:"sans-serif" },
  chatWrap:{ background:C.white, border:`1px solid ${C.border}`, borderRadius:6, overflow:"hidden" },
  chatHeader:{ background:C.brown, color:C.cream, padding:"14px 20px", fontSize:13, display:"flex", alignItems:"center", gap:10, fontFamily:"'Gill Sans','Optima',sans-serif", letterSpacing:"0.04em" },
  chatHeaderDot:{ width:8, height:8, borderRadius:"50%", background:C.terracottaLight, display:"inline-block" },
  chatMessages:{ padding:20, minHeight:260, maxHeight:340, overflowY:"auto", background:C.offWhite },
  bubbleAI:{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"4px 16px 16px 16px", padding:"10px 14px", fontSize:14, color:C.brown, maxWidth:"82%", lineHeight:1.55 },
  bubbleUser:{ background:C.terracotta, color:C.white, borderRadius:"16px 4px 16px 16px", padding:"10px 14px", fontSize:14, maxWidth:"82%", lineHeight:1.55 },
  typingDots:{ color:C.textMuted, letterSpacing:3 },
  chatInput:{ display:"flex", borderTop:`1px solid ${C.border}`, background:C.white },
  chatInputField:{ flex:1, border:"none", outline:"none", padding:"14px 18px", fontSize:14, color:C.brown, background:"transparent", fontFamily:"'Palatino Linotype',Georgia,serif" },
  chatSend:{ border:"none", background:C.terracotta, color:C.white, width:52, fontSize:20, cursor:"pointer" },
  installBanner:{ background:C.brown, color:C.cream, padding:"12px 16px", borderRadius:6, marginBottom:12, display:"flex", flexDirection:"column", gap:8 },
  installBannerText:{ fontSize:13, lineHeight:1.4, fontFamily:"sans-serif" },
  installBannerButtons:{ display:"flex", gap:8, alignItems:"center" },
  installBtn:{ background:C.terracotta, color:C.white, border:"none", borderRadius:3, padding:"7px 16px", fontSize:12, cursor:"pointer", fontFamily:"sans-serif", fontWeight:600 },
  installDismiss:{ background:"none", border:"none", color:C.sand, fontSize:16, cursor:"pointer", padding:"4px 8px" },
  iosHint:{ background:C.sand, color:C.brownMid, padding:"10px 14px", borderRadius:6, marginBottom:12, fontSize:12, fontFamily:"sans-serif", lineHeight:1.5 },
  langSelector:{ display:"flex", gap:4, alignItems:"center" },
  langBtn:{ background:"none", border:"none", fontSize:18, cursor:"pointer", padding:"2px 4px", borderRadius:4, opacity:0.4 },
  langBtnActive:{ opacity:1, background:C.sand },
  topBar:{ display:"flex", flexDirection:"column", alignItems:"center", padding:"14px 0", borderBottom:`1px solid ${C.border}`, marginBottom:24, gap:8 },
  topBarRow1:{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%" },
  topBarLogo:{ fontSize:18, fontWeight:700, color:C.terracotta, letterSpacing:"-0.01em" },
  topBarRight:{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, flexWrap:"wrap" },
  topBarEmail:{ fontSize:11, color:C.textMuted, fontFamily:"sans-serif" },
  topBarBadge:{ fontSize:10, background:"#E8F5E9", color:"#2E7D32", padding:"2px 8px", borderRadius:20, fontFamily:"sans-serif" },
  topBarBtn:{ background:"none", border:`1px solid ${C.border}`, borderRadius:3, padding:"6px 14px", fontSize:11, cursor:"pointer", color:C.brownMid, fontFamily:"sans-serif", letterSpacing:"0.06em" },
  modalOverlay:{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 },
  modal:{ background:C.white, borderRadius:8, padding:32, width:"90%", maxWidth:380, position:"relative" },
  modalClose:{ position:"absolute", top:12, right:16, background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.textMuted },
  modalTitle:{ fontSize:22, fontWeight:700, color:C.brown, marginBottom:20 },
  authInput:{ width:"100%", padding:"11px 14px", border:`1px solid ${C.border}`, borderRadius:3, fontSize:14, marginBottom:12, boxSizing:"border-box", fontFamily:"'Palatino Linotype',Georgia,serif", color:C.brown, background:C.cream, outline:"none" },
  authMessage:{ fontSize:12, color:C.terracotta, marginBottom:12, fontFamily:"sans-serif" },
  authSwitch:{ marginTop:16, fontSize:12, color:C.textMuted, textAlign:"center", fontFamily:"sans-serif" },
  authLink:{ color:C.terracotta, cursor:"pointer", textDecoration:"underline" },
  legalWrap:{ padding:"24px 0 60px" },
  legalTitle:{ fontSize:28, fontWeight:700, color:C.brown, marginBottom:4 },
  legalDate:{ fontSize:12, color:C.textMuted, fontFamily:"sans-serif", marginBottom:28, fontStyle:"italic" },
  legalH2:{ fontSize:16, fontWeight:600, color:C.brown, marginTop:28, marginBottom:8 },
  legalText:{ fontSize:13, color:C.brownMid, lineHeight:1.7, marginBottom:10, fontFamily:"sans-serif" },
  footer:{ textAlign:"center", padding:"32px 0 16px", borderTop:`1px solid ${C.border}`, marginTop:32, display:"flex", justifyContent:"center", alignItems:"center", gap:8, flexWrap:"wrap" },
  footerLink:{ fontSize:11, color:C.textMuted, cursor:"pointer", fontFamily:"sans-serif", textDecoration:"underline", letterSpacing:"0.04em" },
  footerDot:{ fontSize:11, color:C.border },
  footerText:{ fontSize:11, color:C.textMuted, fontFamily:"sans-serif" },
};


/*import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
      { speaker: "A", line: "Buongiorno! Salve.", translation: "Good morning! Hello." },
      { speaker: "B", line: "Ciao! Come stai?", translation: "Hi! How are you?" },
      { speaker: "A", line: "Tutto bene, grazie. E tu?", translation: "All good, thank you. And you?" },
      { speaker: "B", line: "Bene, grazie!", translation: "Well, thank you!" },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian language tutor. The student just learned Lesson 1: Greetings. Help them practice by having a short greeting conversation in Italian. Keep it simple — only use words from this lesson: Ciao, Salve, Buongiorno, Buonasera, Arrivederci, Tutto bene, Come stai, Come va. After each student reply, gently correct mistakes if any, then continue the conversation. Always respond in a warm, encouraging tone. Keep responses short.",
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
      { speaker: "A", line: "Ciao! Sono Paolo.", translation: "Hi! I'm Paolo." },
      { speaker: "B", line: "Ciao, Paolo. Sono Monica. Piacere!", translation: "Hi, Paolo. I'm Monica. Nice to meet you!" },
      { speaker: "A", line: "Piacere mio. Di dove sei?", translation: "Nice to meet you too. Where are you from?" },
      { speaker: "B", line: "Sono di Firenze. E tu?", translation: "I'm from Florence. And you?" },
      { speaker: "A", line: "Sono di Milano.", translation: "I'm from Milan." },
    ],
    grammar: {
      title: "Essere — The Verb \"To Be\"",
      points: [
        { italian: "Io sono", english: "I am" },
        { italian: "Tu sei", english: "You are (informal)" },
        { italian: "Lei è", english: "You are (formal) / She is" },
        { italian: "Lui è", english: "He is" },
        { italian: "Noi siamo", english: "We are" },
        { italian: "Voi siete", english: "You guys are" },
        { italian: "Loro sono", english: "They are" },
      ],
      note: "In Italian you rarely need to say \"io\" (I) — the verb ending tells you who is speaking.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor. The student learned Lesson 2: Introducing yourself. Practice introductions with them. Use only: Mi chiamo, Sono, Piacere, Di dove sei, Sono di. Gently correct mistakes and keep it short and warm.",
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
      { speaker: "Cliente", line: "Buongiorno! Un caffè, per favore.", translation: "Good morning! A coffee, please." },
      { speaker: "Barista", line: "Subito! Vuole anche un cornetto?", translation: "Right away! Would you like a croissant too?" },
      { speaker: "Cliente", line: "Sì, grazie. Quanto costa?", translation: "Yes, thank you. How much is it?" },
      { speaker: "Barista", line: "Un euro e cinquanta, prego.", translation: "One euro fifty, please." },
      { speaker: "Cliente", line: "Ecco. Grazie mille!", translation: "Here you go. Thank you very much!" },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a barista. The student is practicing ordering at an Italian café. Use only lesson 3 vocabulary. Be warm, correct gently, keep it short.",
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
      { speaker: "Cliente", line: "Buonasera! Vorrei un gelato.", translation: "Good evening! I would like an ice cream." },
      { speaker: "Gelataio", line: "Certo! Cono o coppetta?", translation: "Of course! Cone or cup?" },
      { speaker: "Cliente", line: "Cono, grazie. Posso assaggiare il pistacchio?", translation: "Cone please. Can I taste the pistachio?" },
      { speaker: "Gelataio", line: "Certo, ecco a lei.", translation: "Of course, here you go." },
      { speaker: "Cliente", line: "Mmm, che buono! Pistacchio e cioccolato, per favore.", translation: "Mmm, how delicious! Pistachio and chocolate, please." },
      { speaker: "Gelataio", line: "Piccolo, medio o grande?", translation: "Small, medium or large?" },
      { speaker: "Cliente", line: "Medio. Quanto costa?", translation: "Medium. How much is it?" },
      { speaker: "Gelataio", line: "Due euro e cinquanta.", translation: "Two euros fifty." },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a gelateria worker in Italy. The student is practicing ordering gelato. Use vocabulary from lesson 4: gelato, gusti, cono, coppetta, assaggiare, buono. Be playful and warm, correct gently, keep responses short.",
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
      { speaker: "Turista", line: "Scusi! Dov'è il Colosseo?", translation: "Excuse me! Where is the Colosseum?" },
      { speaker: "Passante", line: "Allora… vada sempre dritto, poi a destra.", translation: "Go straight ahead, then turn right." },
      { speaker: "Turista", line: "È lontano?", translation: "Is it far?" },
      { speaker: "Passante", line: "No, è vicino. Cinque minuti a piedi.", translation: "No, it's nearby. Five minutes on foot." },
      { speaker: "Turista", line: "Grazie mille!", translation: "Thank you very much!" },
      { speaker: "Passante", line: "Prego! Buona visita!", translation: "You're welcome! Enjoy your visit!" },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a local Roman. The student needs directions in Italian. Use lesson 5 vocabulary: dov'è, destra, sinistra, dritto, vicino, lontano, scusi. Give directions to famous places. Correct gently and keep it short.",
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
      { speaker: "Agente", line: "Buongiorno! Il passaporto, per favore.", translation: "Good morning! Your passport, please." },
      { speaker: "Passeggero", line: "Eccolo. Ho anche un bagaglio da imbarcare.", translation: "Here it is. I also have a bag to check in." },
      { speaker: "Agente", line: "Quanti bagagli ha?", translation: "How many bags do you have?" },
      { speaker: "Passeggero", line: "Solo uno. Il volo è in orario?", translation: "Just one. Is the flight on time?" },
      { speaker: "Agente", line: "Sì, parte alle undici. Gate B7.", translation: "Yes, it departs at eleven. Gate B7." },
      { speaker: "Passeggero", line: "Grazie mille!", translation: "Thank you very much!" },
    ],
    grammar: {
      title: "Avere — The Verb \"To Have\"",
      points: [
        { italian: "Io ho", english: "I have" },
        { italian: "Tu hai", english: "You have (informal)" },
        { italian: "Lei ha", english: "You have (formal) / She has" },
        { italian: "Lui ha", english: "He has" },
        { italian: "Noi abbiamo", english: "We have" },
        { italian: "Voi avete", english: "You guys have" },
        { italian: "Loro hanno", english: "They have" },
      ],
      note: "\"Avere\" is one of the two most important verbs in Italian (with \"essere\"). It's also used to express age: \"ho trent'anni\" = I am thirty years old.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing an airport check-in agent in Italy. The student is practicing airport Italian from lesson 6. Use: volo, passaporto, bagaglio, gate, in ritardo, in orario, avere. Be professional but warm, correct gently.",
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
      { speaker: "Cliente", line: "Buonasera! Un tavolo per due, per favore.", translation: "Good evening! A table for two, please." },
      { speaker: "Cameriere", line: "Certo, prego. Ecco il menù.", translation: "Of course. Here is the menu." },
      { speaker: "Cliente", line: "Grazie. Sono vegetariana — cosa consiglia?", translation: "Thank you. I'm vegetarian — what do you recommend?" },
      { speaker: "Cameriere", line: "Ottime le tagliatelle ai funghi!", translation: "The tagliatelle with mushrooms is excellent!" },
      { speaker: "Cliente", line: "Perfetto. E il coperto è compreso?", translation: "Perfect. Is the cover charge included?" },
      { speaker: "Cameriere", line: "Sì, è già incluso. Buon appetito!", translation: "Yes, it's included. Enjoy your meal!" },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a restaurant waiter in Italy. The student is practicing dining out in Italian. Use lesson 7 vocabulary: tavolo, menù, primo, secondo, vegetariano, coperto, mi piace. Be elegant and warm, correct gently, keep it real.",
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
      { italian: "Accettate carte di credito?", english: "Do you accept credit cards?" },
    ],
    dialogue: [
      { speaker: "Cliente", line: "Buongiorno! Posso provare questa giacca?", translation: "Good morning! Can I try on this jacket?" },
      { speaker: "Commessa", line: "Certo! Che taglia porta?", translation: "Of course! What size do you wear?" },
      { speaker: "Cliente", line: "La media, grazie.", translation: "Medium, thank you." },
      { speaker: "Cliente", line: "Hmm… quanto costa?", translation: "Hmm… how much does it cost?" },
      { speaker: "Commessa", line: "Centoventi euro. C'è il 20% di sconto oggi!", translation: "One hundred and twenty euros. There's 20% off today!" },
      { speaker: "Cliente", line: "Perfetto, lo prendo! Accettate carte?", translation: "Perfect, I'll take it! Do you accept cards?" },
      { speaker: "Commessa", line: "Sì, certo.", translation: "Yes, of course." },
    ],
    grammar: {
      title: "Potere — Can / To be able to",
      points: [
        { italian: "Posso provarlo?", english: "Can I try it on?" },
        { italian: "Puoi aiutarmi?", english: "Can you help me?" },
        { italian: "Maria non può rispondere", english: "Maria cannot reply / get the phone" },
        { italian: "Non potete fumare", english: "You (plural) cannot smoke" },
        { italian: "Possiamo pagare con la carta?", english: "Can we pay by card?" },
        { italian: "Possono giocare qui i bambini?", english: "Can kids play here?" },
      ],
      note: "\"Potere\" is a modal verb — it pairs with the infinitive of another verb. It's your key to asking permission and expressing ability.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a shop assistant in an Italian boutique. The student is practicing shopping in Italian. Use lesson 8 vocabulary: provare, taglia, caro, sconto, prendere, carte, potere. Be helpful and stylish, correct gently.",
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
      { speaker: "Ospite", line: "Buonasera! Ho una prenotazione. Mi chiamo Rossi.", translation: "Good evening! I have a reservation. My name is Rossi." },
      { speaker: "Receptionist", line: "Benvenuto! Sì, camera doppia per tre notti.", translation: "Welcome! Yes, double room for three nights." },
      { speaker: "Ospite", line: "Perfetto. La colazione è inclusa?", translation: "Perfect. Is breakfast included?" },
      { speaker: "Receptionist", line: "Sì, dalle sette alle dieci. C'è anche il wifi gratuito.", translation: "Yes, from seven to ten. There's also free wifi." },
      { speaker: "Ospite", line: "Ottimo. A che ora è il check-out?", translation: "Excellent. What time is check-out?" },
      { speaker: "Receptionist", line: "Alle undici. Ecco la sua chiave. Buona permanenza!", translation: "At eleven. Here is your key. Enjoy your stay!" },
    ],
    grammar: {
      title: "Prepositions: a, di, da, in",
      points: [
        { italian: "Sono a Roma", english: "I am in Rome (location)" },
        { italian: "Vengo da Londra", english: "I come from London (origin)" },
        { italian: "Vado in Italia", english: "I'm going to Italy (countries)" },
        { italian: "La chiave di Maria", english: "Maria's key (possession)" },
        { italian: "Sei con Luca?", english: "Are you with Luca? (company)" },
        { italian: "Roma è tra Firenze e Napoli", english: "Rome is between Florence and Naples (position)" },
      ],
      note: "Italian prepositions don't always match English ones. \"In\" is used with countries, \"a\" with cities — this small rule saves a lot of confusion.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a hotel receptionist in Italy. The student is checking in and asking questions in Italian. Use lesson 9 vocabulary: prenotazione, camera, check-out, colazione, wifi, chiave. Be professional and warm, correct gently.",
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
      { speaker: "Viaggiatore", line: "Buongiorno! Un biglietto per Venezia, per favore.", translation: "Good morning! A ticket to Venice, please." },
      { speaker: "Bigliettaio", line: "Andata e ritorno?", translation: "Return trip?" },
      { speaker: "Viaggiatore", line: "Solo andata. A che ora arriva?", translation: "One way only. What time does it arrive?" },
      { speaker: "Bigliettaio", line: "Alle tredici e venti. Binario 4.", translation: "At thirteen twenty. Platform 4." },
      { speaker: "Viaggiatore", line: "Grazie. È occupato questo posto?", translation: "Thank you. Is this seat taken?" },
      { speaker: "Passeggero", line: "No, si accomodi!", translation: "No, please sit down!" },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a train station ticket agent and fellow passenger in Italy. The student is buying a train ticket and finding their seat. Use lesson 10 vocabulary: biglietto, andata e ritorno, binario, occupato, orario, ritardo. Correct gently.",
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
      { speaker: "Cliente", line: "Buongiorno! Questi pomodori sono freschi?", translation: "Good morning! Are these tomatoes fresh?" },
      { speaker: "Venditore", line: "Freschissimi! Di stagione. Quanti ne vuole?", translation: "Very fresh! In season. How many do you want?" },
      { speaker: "Cliente", line: "Me ne dà un chilo, per favore.", translation: "Give me a kilo, please." },
      { speaker: "Cliente", line: "E anche mezzo chilo di mozzarella.", translation: "And also half a kilo of mozzarella." },
      { speaker: "Venditore", line: "Basta così?", translation: "Is that all?" },
      { speaker: "Cliente", line: "Sì, grazie. Ecco cinque euro.", translation: "Yes, thank you. Here's five euros." },
      { speaker: "Venditore", line: "Ecco il resto. Grazie, a presto!", translation: "Here's the change. Thank you, see you soon!" },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a market vendor in an Italian outdoor market. The student is buying produce and food. Use lesson 11 vocabulary: quanto pesa, chilo, fresco, stagione, basta così, resto, ne. Be lively and authentic, correct gently.",
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
      { speaker: "Turista", line: "Scusi! Ho bisogno di aiuto.", translation: "Excuse me! I need help." },
      { speaker: "Passante", line: "Cosa succede?", translation: "What's happening?" },
      { speaker: "Turista", line: "Mi fa molto male la testa. Ho la febbre.", translation: "My head hurts a lot. I have a fever." },
      { speaker: "Passante", line: "C'è una farmacia qui vicino.", translation: "There's a pharmacy nearby." },
      { speaker: "Turista", line: "Sono allergico alla penicillina.", translation: "I'm allergic to penicillin." },
      { speaker: "Passante", line: "Lo dica al farmacista. Venga, l'accompagno.", translation: "Tell the pharmacist. Come, I'll take you there." },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor helping a student practice emergency and health vocabulary from lesson 12. Role-play as a helpful local Italian. Use: aiuto, medico, mi fa male, ambulanza, farmacia, allergico. Be calm and reassuring, correct gently.",
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
      { speaker: "Cliente", line: "Buongiorno. Ho bisogno di qualcosa per il mal di testa.", translation: "Good morning. I need something for a headache." },
      { speaker: "Farmacista", line: "Ha la ricetta?", translation: "Do you have a prescription?" },
      { speaker: "Cliente", line: "No, è senza ricetta.", translation: "No, it's over the counter." },
      { speaker: "Farmacista", line: "Allora le do queste compresse. Due volte al giorno.", translation: "Then I'll give you these tablets. Twice a day." },
      { speaker: "Cliente", line: "Grazie. Ho anche la tosse.", translation: "Thank you. I also have a cough." },
      { speaker: "Farmacista", line: "Prenda questo sciroppo, tre volte al giorno dopo i pasti.", translation: "Take this syrup, three times a day after meals." },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a pharmacist in Italy. The student needs medication and advice. Use lesson 13 vocabulary: bisogno, ricetta, mal di testa, tosse, qualcosa per, volte al giorno. Be professional and helpful, correct gently, keep it real.",
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
      { speaker: "A", line: "Pronto?", translation: "Hello?" },
      { speaker: "B", line: "Buongiorno! Posso parlare con la signora Bianchi?", translation: "Good morning! Can I speak with Mrs Bianchi?" },
      { speaker: "A", line: "Sono io. Con chi parlo?", translation: "Speaking. Who am I talking to?" },
      { speaker: "B", line: "Sono Marco Rossi, chiamo per la prenotazione.", translation: "I'm Marco Rossi, calling about the reservation." },
      { speaker: "A", line: "Un momento, la metto in attesa.", translation: "One moment, I'll put you on hold." },
      { speaker: "B", line: "Grazie.", translation: "Thank you." },
      { speaker: "A", line: "Mi dispiace, la linea è occupata. Può richiamare?", translation: "I'm sorry, the line is busy. Can you call back?" },
      { speaker: "B", line: "Certo, richiamo più tardi. Grazie!", translation: "Of course, I'll call back later. Thank you!" },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor role-playing phone call scenarios with the student. Use lesson 14 vocabulary: pronto, con chi parlo, posso parlare con, un momento, richiamare, occupato. Practice both answering and making calls. Correct gently and keep it natural.",
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
      { speaker: "Cliente", line: "Buongiorno! Vorrei spedire questo pacco in Inghilterra.", translation: "Good morning! I'd like to send this parcel to England." },
      { speaker: "Impiegato", line: "Per via aerea o normale?", translation: "By airmail or standard?" },
      { speaker: "Cliente", line: "Aerea. Quanto ci vuole?", translation: "Airmail. How long does it take?" },
      { speaker: "Impiegato", line: "Circa cinque giorni lavorativi.", translation: "About five working days." },
      { speaker: "Cliente", line: "Va bene. E vorrei anche tre francobolli.", translation: "That's fine. And I'd also like three stamps." },
      { speaker: "Impiegato", line: "Vuole la raccomandata per il pacco?", translation: "Would you like registered mail for the parcel?" },
      { speaker: "Cliente", line: "Sì, meglio. Quanto costa in tutto?", translation: "Yes, better. How much is it in total?" },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a post office clerk in Italy. The student needs to send mail and parcels. Use lesson 15 vocabulary: spedire, pacco, lettera, aerea, francobollo, raccomandata, ci vuole. Be helpful and patient, correct gently.",
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
      { speaker: "Cliente", line: "Buongiorno! Vorrei noleggiare un'auto per tre giorni.", translation: "Good morning! I'd like to rent a car for three days." },
      { speaker: "Agente", line: "Certo. Ha la patente con sé?", translation: "Of course. Do you have your licence with you?" },
      { speaker: "Cliente", line: "Sì, eccola. L'assicurazione è inclusa?", translation: "Yes, here it is. Is insurance included?" },
      { speaker: "Agente", line: "Sì, quella base è inclusa. Vuole quella completa?", translation: "Yes, the basic one is included. Would you like full coverage?" },
      { speaker: "Cliente", line: "Sì, meglio. Il serbatoio è pieno?", translation: "Yes, better. Is the tank full?" },
      { speaker: "Agente", line: "Sì, e deve riconsegnare l'auto col pieno.", translation: "Yes, and you must return the car with a full tank." },
      { speaker: "Cliente", line: "Capito. I chilometri sono illimitati?", translation: "Understood. Are the kilometres unlimited?" },
      { speaker: "Agente", line: "Sì, nessun limite.", translation: "Yes, no limit." },
    ],
    grammar: {
      title: "Dovere — Must / To have to",
      points: [
        { italian: "Devo riconsegnare l'auto", english: "I must return the car" },
        { italian: "Devi pagare un deposito", english: "You must pay a deposit" },
        { italian: "Deve avere la patente", english: "He/She/You (polite) must have a licence" },
        { italian: "Dobbiamo fare il pieno", english: "We must fill the tank" },
        { italian: "Non dovete dimenticare la cintura!", english: "You guys must not forget the seatbelt!" },
        { italian: "I bambini devono usare il seggiolino!", english: "Kids must use a child seat!" },
      ],
      note: "\"Dovere\" expresses obligation — pair it with an infinitive. It's one of the three key modal verbs in Italian: potere (can), volere (want), dovere (must).",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a car rental agent in Italy. The student is renting a car. Use lesson 16 vocabulary: noleggiare, patente, pieno, assicurazione, chilometri, riconsegnare, dovere. Be professional and clear, correct gently.",
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
      { speaker: "Turista", line: "Buongiorno! Vorrei un ombrellone e due sdraio.", translation: "Good morning! I'd like a beach umbrella and two sun loungers." },
      { speaker: "Bagnino", line: "Certo! Prima fila o seconda?", translation: "Of course! First row or second?" },
      { speaker: "Turista", line: "Seconda va bene. Si può fare il bagno?", translation: "Second is fine. Can we swim?" },
      { speaker: "Bagnino", line: "Sì, il mare è calmo oggi. Attenzione però al sole — che caldo!", translation: "Yes, the sea is calm today. But watch out for the sun — it's so hot!" },
      { speaker: "Turista", line: "Sì! Ha una crema solare da comprare?", translation: "Yes! Do you have sun cream to buy?" },
      { speaker: "Bagnino", line: "Sì, al chiosco là. Buona giornata!", translation: "Yes, at the kiosk over there. Have a great day!" },
    ],
    grammar: {
      title: "Fare — The Verb \"To Do / To Make\"",
      points: [
        { italian: "Faccio una passeggiata", english: "I go for a walk" },
        { italian: "Fai il bagno?", english: "Are you having a swim?" },
        { italian: "Fa caldo / fa freddo", english: "It's hot / it's cold (weather)" },
        { italian: "Facciamo una passeggiata", english: "We go for a walk" },
        { italian: "Cosa fate?", english: "What are you guys doing?" },
        { italian: "Fanno un castello di sabbia", english: "They make a sand castle" },
      ],
      note: "\"Fare\" is one of the most versatile Italian verbs. It appears in dozens of fixed expressions — weather, activities, actions. Learn these phrases as blocks.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a beach attendant in Italy. The student is spending a day at the beach. Use lesson 17 vocabulary: ombrellone, sdraio, crema solare, mare mosso, fare il bagno, caldo, fare. Be relaxed and sunny, correct gently.",
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
      { speaker: "A", line: "Sei sposato?", translation: "Are you married?" },
      { speaker: "B", line: "Sì, ho una moglie e due figli. E tu?", translation: "Yes, I have a wife and two children. And you?" },
      { speaker: "A", line: "Sono fidanzata. Ci sposiamo l'anno prossimo!", translation: "I'm engaged. We're getting married next year!" },
      { speaker: "B", line: "Congratulazioni! Hai fratelli o sorelle?", translation: "Congratulations! Do you have brothers or sisters?" },
      { speaker: "A", line: "Ho una sorella. I miei genitori vivono a Napoli.", translation: "I have a sister. My parents live in Naples." },
      { speaker: "B", line: "Bella città! La mia famiglia è di Roma.", translation: "Beautiful city! My family is from Rome." },
    ],
    grammar: {
      title: "Possessives — My, Your, His/Her",
      points: [
        { italian: "Il mio gatto", english: "My cat" },
        { italian: "Il tuo gelato", english: "Your ice-cream" },
        { italian: "La sua mamma e il suo papà", english: "His/her mum and his/her dad" },
        { italian: "I nostri vicini", english: "Our neighbours" },
        { italian: "Il vostro computer", english: "Your guys' computer" },
        { italian: "Le loro sorelle", english: "Their sisters" },
      ],
      note: "Italian possessives agree in gender and number with the noun, not the owner. Words ending in O (i for plural) are masculine, words ending in A (e for plural) are feminine.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor having a friendly conversation about family with the student. Use lesson 18 vocabulary: marito, moglie, figli, fratello, sorella, genitori, sposato, possessives. Be warm and curious, correct gently, keep it natural.",
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
      { speaker: "Paziente", line: "Buongiorno, ho un appuntamento con il dottor Marini.", translation: "Good morning, I have an appointment with Doctor Marini." },
      { speaker: "Receptionist", line: "Prego, si accomodi. Come si sente?", translation: "Please, have a seat. How are you feeling?" },
      { speaker: "Paziente", line: "Non molto bene. Ho mal di stomaco e la nausea.", translation: "Not very well. I have a stomach ache and nausea." },
      { speaker: "Dottore", line: "Da quanto tempo ha questi sintomi?", translation: "How long have you had these symptoms?" },
      { speaker: "Paziente", line: "Da due giorni. Ho anche un po' di febbre.", translation: "For two days. I also have a slight fever." },
      { speaker: "Dottore", line: "Le misuro la pressione. Respiri profondamente.", translation: "I'll take your blood pressure. Breathe deeply." },
      { speaker: "Dottore", line: "Non è grave. Le scrivo una ricetta.", translation: "It's not serious. I'll write you a prescription." },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a doctor in Italy. The student is at a medical appointment. Use lesson 19 vocabulary: appuntamento, da quanto tempo, nausea, pressione, visita, diagnosi, da + time. Be calm and professional, correct gently.",
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
      { speaker: "A", line: "Allora, andiamo a ballare stasera?", translation: "So, shall we go dancing tonight?" },
      { speaker: "B", line: "Sì! Conosco un bel locale in centro.", translation: "Yes! I know a nice venue in the centre." },
      { speaker: "A", line: "C'è la fila di solito?", translation: "Is there usually a queue?" },
      { speaker: "B", line: "A volte sì, ma entriamo con la lista.", translation: "Sometimes yes, but we're on the guest list." },
      { speaker: "A", line: "Perfetto. Prendiamo qualcosa prima?", translation: "Perfect. Shall we get something first?" },
      { speaker: "B", line: "Certo! Un aperitivo — offro io!", translation: "Of course! An aperitif — my treat!" },
      { speaker: "A", line: "Grazie! Che serata!", translation: "Thank you! What a night!" },
    ],
    grammar: {
      title: "Andare — To Go (+ places)",
      points: [
        { italian: "Vado al bar", english: "I'm going to the bar" },
        { italian: "Vai a casa?", english: "Are you going home?" },
        { italian: "Va bene!", english: "It's fine! / OK! (literally: it goes well)" },
        { italian: "Andiamo a ballare", english: "Let's go dancing" },
        { italian: "Andate via?", english: "Are you leaving? (lit. do you go away?)" },
      ],
      note: "\"Andiamo\" (let's go) is one of the most useful words in Italian social life. \"Va bene\" is used constantly — you'll hear it dozens of times a day in Italy.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a friend planning a night out in Italy. Use lesson 20 vocabulary: ballare, locale, fila, offro io, fare tardi, che serata, andare. Be energetic and fun, correct gently, keep it lively.",
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
      { speaker: "A", line: "Stai cucinando? Che profumo!", translation: "Are you cooking? What a lovely smell!" },
      { speaker: "B", line: "Sto facendo la pasta al pomodoro. Vuoi la ricetta?", translation: "I'm making tomato pasta. Do you want the recipe?" },
      { speaker: "A", line: "Sì! Quali ingredienti usi?", translation: "Yes! What ingredients do you use?" },
      { speaker: "B", line: "Pomodori freschi, aglio, basilico e olio d'oliva.", translation: "Fresh tomatoes, garlic, basil and olive oil." },
      { speaker: "A", line: "Semplice! Quanto ci vuole?", translation: "Simple! How long does it take?" },
      { speaker: "B", line: "Venti minuti. Aggiungi il sale, mescola e aspetta.", translation: "Twenty minutes. Add the salt, stir and wait." },
      { speaker: "A", line: "È pronto? Ho fame!", translation: "Is it ready? I'm hungry!" },
    ],
    grammar: {
      title: "Stare + Gerundio — Present Continuous",
      points: [
        { italian: "Sto cucinando", english: "I am cooking (right now)" },
        { italian: "Stai bevendo", english: "You are drinking (right now)" },
        { italian: "Sta mangiando", english: "He/she is eating" },
        { italian: "Stiamo aspettando", english: "We are waiting" },
        { italian: "Cosa state facendo?", english: "What are you guys doing?" },
        { italian: "Stanno arrivando", english: "They are coming" },
      ],
      note: "Italian has a present continuous formed with \"stare\" + gerund (-ando/-endo). Use it for things happening right now. For general habits, just use the present tense.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a friend cooking an Italian meal and sharing the recipe. Use lesson 21 vocabulary: ricetta, ingredienti, cucinare, aggiungere, mescolare, pronto, stare + gerund. Be enthusiastic about food, correct gently.",
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
      { speaker: "Cliente", line: "Buongiorno. Vorrei prelevare dei contanti.", translation: "Good morning. I'd like to withdraw some cash." },
      { speaker: "Impiegato", line: "Si accomodi allo sportello tre.", translation: "Please go to counter three." },
      { speaker: "Cliente", line: "Grazie. Qual è il tasso di cambio oggi?", translation: "Thank you. What is today's exchange rate?" },
      { speaker: "Impiegato", line: "Per la sterlina, è uno virgola diciassette.", translation: "For the pound, it's one point seventeen." },
      { speaker: "Cliente", line: "Bene. Posso anche fare un bonifico?", translation: "Good. Can I also make a bank transfer?" },
      { speaker: "Impiegato", line: "Certo. Ha il codice IBAN del destinatario?", translation: "Of course. Do you have the recipient's IBAN code?" },
      { speaker: "Cliente", line: "Sì, eccolo.", translation: "Yes, here it is." },
    ],
    grammar: {
      title: "Numbers",
      points: [
        { italian: "Uno, due, tre, quattro, cinque, sei, sette, otto, nove, dieci", english: "1-10" },
        { italian: "Undici, dodici, tredici, quattordici, quindici, sedici, diciassette, diciotto, diciannove, venti", english: "11-20" },
        { italian: "Trenta, quaranta, cinquanta, sessanta, settanta, ottanta, novanta", english: "30-90" },
        { italian: "Cento / duecento", english: "One hundred / two hundred" },
        { italian: "Mille / duemila / tremila", english: "One thousand / two thousand / three thousand" },
        { italian: "Un milione", english: "One million" },
        { italian: "Virgola", english: "Decimal point (comma in Italian)" },
      ],
      note: "In Italian, decimals use a comma, not a point: \"1,17\" is read as \"uno virgola diciassette\". Thousands use a period: \"1.000\" = one thousand. The opposite of English!",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a bank teller in Italy. The student needs to handle banking tasks. Use lesson 22 vocabulary: conto, bancomat, prelevare, tasso di cambio, bonifico, sportello, numbers. Be precise and professional, correct gently.",
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
      { speaker: "A", line: "Sei libera sabato?", translation: "Are you free on Saturday?" },
      { speaker: "B", line: "Sì! Che ne dici di andare al museo?", translation: "Yes! What do you think about going to the museum?" },
      { speaker: "A", line: "Mi va! A che ora ci vediamo?", translation: "Sounds good! What time shall we meet?" },
      { speaker: "B", line: "Alle dieci davanti all'ingresso?", translation: "At ten in front of the entrance?" },
      { speaker: "A", line: "Perfetto. Non vedo l'ora!", translation: "Perfect. I can't wait!" },
      { speaker: "B", line: "Anch'io! Ah, e dopo pranziamo insieme?", translation: "Me neither! Oh, and shall we have lunch together after?" },
      { speaker: "A", line: "Certo! Conosco un ottimo posto.", translation: "Of course! I know a great place." },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor playing a friend making weekend plans with the student. Use lesson 23 vocabulary: libero, che ne dici, mi va, ci vediamo, rimandare, non vedo l'ora, future tense. Be friendly and spontaneous, correct gently.",
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
      { speaker: "A", line: "Che tempo fa oggi?", translation: "What's the weather like today?" },
      { speaker: "B", line: "È nuvoloso stamattina, ma nel pomeriggio c'è il sole.", translation: "It's cloudy this morning, but sunny in the afternoon." },
      { speaker: "A", line: "E domani? Hai visto le previsioni?", translation: "And tomorrow? Have you seen the forecast?" },
      { speaker: "B", line: "Sì, piove di mattina. Porta l'ombrello!", translation: "Yes, it rains in the morning. Bring an umbrella!" },
      { speaker: "A", line: "Che peccato. Volevo andare al mare.", translation: "What a shame. I wanted to go to the beach." },
      { speaker: "B", line: "Va meglio il weekend. Fa caldo e c'è il sole.", translation: "It gets better at the weekend. It's warm and sunny." },
      { speaker: "A", line: "Ottimo! Andiamo sabato allora.", translation: "Excellent! Let's go on Saturday then." },
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
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated — images, other topics, other AI tools, general questions — reply only: 'Let us stick to this lesson! Try using the Italian words you just learned.' Never break character or these rules. Always reply in English, but use Italian words and phrases from the lesson in your responses. Correct the student gently in English. You are an Italian tutor having a conversation about the weather and making plans based on it. Use lesson 24 vocabulary: che tempo fa, piove, nevica, sole, afoso, previsioni, ombrello, imperfetto. Be conversational and natural, correct gently.",
  },
  {
    id: 25,
    title: "At the Park",
    subtitle: "Al Parco",
    free: false,
    keywords: [
      { italian: "Il fiore", english: "The flower" },
      { italian: "L'albero", english: "The tree" },
      { italian: "Il cane", english: "The dog" },
      { italian: "La panchina", english: "The bench" },
      { italian: "Bello / bella", english: "Beautiful / lovely" },
      { italian: "Guarda!", english: "Look!" },
    ],
    dialogue: [
      { speaker: "A", line: "Guarda quel cane!", translation: "Look at that dog!" },
      { speaker: "B", line: "Che bello! E' tuo?", translation: "How lovely! Is it yours?" },
      { speaker: "A", line: "No, ma vorrei averne uno.", translation: "No, but I'd love to have one." },
      { speaker: "B", line: "Mi piace quel fiore rosso la'.", translation: "I like that red flower over there." },
      { speaker: "A", line: "Si', e quegli alberi sono bellissimi.", translation: "Yes, and those trees are gorgeous." },
      { speaker: "B", line: "Sediamoci sulla panchina?", translation: "Shall we sit on the bench?" },
    ],
    grammar: {
      title: "I Colori — Colours",
      points: [
        { italian: "Rosso / rossa", english: "Red (m/f)" },
        { italian: "Verde", english: "Green" },
        { italian: "Blu", english: "Blue (invariable)" },
        { italian: "Giallo / gialla", english: "Yellow (m/f)" },
        { italian: "Bianco / nero", english: "White / black" },
        { italian: "Un fiore rosso", english: "A red flower (adjective follows noun)" },
      ],
      note: "In Italian, colours are adjectives and must agree with the noun: una rosa rossa (a red rose), un cielo blu (a blue sky). Blu and rosa are exceptions — they never change.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor taking a walk in an Italian park with the student. Practice colours and park vocabulary: fiore, albero, cane, panchina, bello, guarda, colours. Be warm and observational, correct gently.",
  },
  {
    id: 26,
    title: "Talking About People",
    subtitle: "Parlare delle Persone",
    free: false,
    keywords: [
      { italian: "Alto / basso", english: "Tall / short" },
      { italian: "Magro / robusto", english: "Thin / sturdy" },
      { italian: "Simpatico / antipatico", english: "Friendly / unfriendly" },
      { italian: "Timido / estroverso", english: "Shy / outgoing" },
      { italian: "I capelli", english: "The hair" },
      { italian: "Gli occhi", english: "The eyes" },
    ],
    dialogue: [
      { speaker: "A", line: "Conosci Marco?", translation: "Do you know Marco?" },
      { speaker: "B", line: "Si'! E' alto e molto simpatico.", translation: "Yes! He's tall and very friendly." },
      { speaker: "A", line: "Ha i capelli scuri, vero?", translation: "He has dark hair, right?" },
      { speaker: "B", line: "Si', e gli occhi verdi. E' bello.", translation: "Yes, and green eyes. He's handsome." },
      { speaker: "A", line: "E sua sorella?", translation: "And his sister?" },
      { speaker: "B", line: "Lei e' timida ma molto simpatica.", translation: "She's shy but very friendly." },
    ],
    grammar: {
      title: "Essere + Adjectives for Descriptions",
      points: [
        { italian: "E' alto e magro", english: "He is tall and slim" },
        { italian: "E' simpatica", english: "She is friendly" },
        { italian: "Sono timidi", english: "They are shy (plural)" },
        { italian: "Ha i capelli biondi", english: "She/he has blonde hair" },
        { italian: "Ha gli occhi azzurri", english: "She/he has blue eyes" },
      ],
      note: "Physical descriptions use essere (to be) for qualities and avere (to have) for features like hair and eyes. Adjectives agree in gender and number with the noun they describe.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor helping the student describe people in Italian. Use: alto, basso, magro, robusto, simpatico, timido, capelli, occhi, essere plus adjectives. Be conversational, correct gently.",
  },
  {
    id: 27,
    title: "Talking with the Neighbours",
    subtitle: "Con i Vicini",
    free: false,
    keywords: [
      { italian: "Come va?", english: "How's it going?" },
      { italian: "Stanco / stanca", english: "Tired (m/f)" },
      { italian: "Come mai?", english: "How come? / Why?" },
      { italian: "Ho dormito poco", english: "I slept little" },
      { italian: "Tutto bene?", english: "Everything OK?" },
      { italian: "La settimana", english: "The week" },
    ],
    dialogue: [
      { speaker: "A", line: "Buongiorno! Come va?", translation: "Good morning! How's it going?" },
      { speaker: "B", line: "Un po' stanca oggi.", translation: "A bit tired today." },
      { speaker: "A", line: "Come mai?", translation: "How come?" },
      { speaker: "B", line: "Ho dormito poco stanotte.", translation: "I slept little last night." },
      { speaker: "A", line: "Mi dispiace. E' stata una settimana difficile?", translation: "I'm sorry. Has it been a tough week?" },
      { speaker: "B", line: "Abbastanza. Ma domani e' venerdi'!", translation: "Quite. But tomorrow is Friday!" },
      { speaker: "A", line: "Meno male! Buona giornata!", translation: "Thank goodness! Have a good day!" },
    ],
    grammar: {
      title: "Everyday Conversational Expressions",
      points: [
        { italian: "Come va?", english: "How's it going? (set phrase)" },
        { italian: "Come mai?", english: "How come? / Why is that?" },
        { italian: "Meno male!", english: "Thank goodness! / What a relief!" },
        { italian: "Abbastanza", english: "Quite / fairly / enough" },
        { italian: "Mi dispiace", english: "I'm sorry / I'm sad about it" },
      ],
      note: "Come mai is softer than perche' — it expresses mild surprise rather than a direct question. Meno male literally means less bad and is one of the most satisfying Italian expressions to use.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor playing a friendly neighbour in Italy. Practice polite small talk: come va, stanco, come mai, ho dormito poco, tutto bene, settimana. Be warm and casual, correct gently.",
  },
  {
    id: 28,
    title: "Talking About Your Day",
    subtitle: "Parlare della Giornata",
    free: false,
    keywords: [
      { italian: "Ieri / oggi / domani", english: "Yesterday / today / tomorrow" },
      { italian: "Stamattina / stasera", english: "This morning / this evening" },
      { italian: "Ho lavorato", english: "I worked (past)" },
      { italian: "Sono partito/a", english: "I left / departed (past)" },
      { italian: "Cosa hai fatto?", english: "What did you do?" },
      { italian: "Tutto il giorno", english: "All day long" },
    ],
    dialogue: [
      { speaker: "A", line: "Cosa hai fatto ieri?", translation: "What did you do yesterday?" },
      { speaker: "B", line: "Ho lavorato tutto il giorno.", translation: "I worked all day." },
      { speaker: "A", line: "E la sera?", translation: "And in the evening?" },
      { speaker: "B", line: "Sono andato al cinema con Marco.", translation: "I went to the cinema with Marco." },
      { speaker: "A", line: "Bello! E domani?", translation: "Nice! And tomorrow?" },
      { speaker: "B", line: "Domani partiamo per Roma.", translation: "Tomorrow we leave for Rome." },
      { speaker: "A", line: "Che bello! Buon viaggio!", translation: "How lovely! Have a good trip!" },
    ],
    grammar: {
      title: "Passato Prossimo — The Recent Past",
      points: [
        { italian: "Ho lavorato", english: "I worked (avere + past participle)" },
        { italian: "Ho mangiato", english: "I ate" },
        { italian: "Sono andato/a", english: "I went (essere + past participle)" },
        { italian: "Sei partito/a?", english: "Did you leave?" },
        { italian: "Abbiamo fatto", english: "We did" },
      ],
      note: "The passato prossimo is formed with avere or essere plus the past participle. Motion verbs take essere, and the participle must agree with the subject. Most other verbs take avere.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor having a conversation about what the student did yesterday and plans for tomorrow. Practice: ieri, oggi, domani, stamattina, stasera, passato prossimo. Be curious and encouraging, correct gently.",
  },
  {
    id: 29,
    title: "Asking for Explanations",
    subtitle: "Chiedere Spiegazioni",
    free: false,
    keywords: [
      { italian: "Perche'?", english: "Why?" },
      { italian: "Come mai?", english: "How come?" },
      { italian: "Allora", english: "So / then / well" },
      { italian: "Quindi", english: "Therefore / so" },
      { italian: "Non capisco", english: "I don't understand" },
      { italian: "Uno sciopero", english: "A strike" },
    ],
    dialogue: [
      { speaker: "A", line: "Perche' il treno e' in ritardo?", translation: "Why is the train delayed?" },
      { speaker: "B", line: "Perche' c'e' uno sciopero.", translation: "Because there's a strike." },
      { speaker: "A", line: "Ah, capisco. E quindi quando parte?", translation: "Ah, I understand. So when does it depart?" },
      { speaker: "B", line: "Non lo so. Forse tra un'ora.", translation: "I don't know. Maybe in an hour." },
      { speaker: "A", line: "Non capisco — c'e' un altro treno?", translation: "I don't understand — is there another train?" },
      { speaker: "B", line: "Allora, provi l'autobus.", translation: "Well then, try the bus." },
    ],
    grammar: {
      title: "Perche' — Why and Because",
      points: [
        { italian: "Perche' sei in ritardo?", english: "Why are you late? (question)" },
        { italian: "Perche' c'e' traffico", english: "Because there's traffic (answer)" },
        { italian: "Quindi / allora", english: "So / therefore (consequence)" },
        { italian: "Non lo so", english: "I don't know" },
        { italian: "Forse", english: "Maybe / perhaps" },
      ],
      note: "Perche' is both why and because in Italian — the same word does both jobs. Allora is one of the most heard words in Italian conversation — it fills pauses and signals a conclusion.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor role-playing situations where things go wrong and explanations are needed. Use: perche', come mai, allora, quindi, non capisco. Be patient and clear, correct gently.",
  },
  {
    id: 30,
    title: "Dreams & Wishes",
    subtitle: "Sogni e Desideri",
    free: false,
    keywords: [
      { italian: "Vorrei...", english: "I would like... / I wish..." },
      { italian: "Mi piacerebbe", english: "I would like (lit. it would please me)" },
      { italian: "Magari", english: "Maybe / if only / I wish" },
      { italian: "Forse", english: "Perhaps / maybe" },
      { italian: "Un giorno", english: "One day / someday" },
      { italian: "Davvero?", english: "Really?" },
    ],
    dialogue: [
      { speaker: "A", line: "Vorrei vivere in Italia.", translation: "I would like to live in Italy." },
      { speaker: "B", line: "Davvero? In quale citta'?", translation: "Really? In which city?" },
      { speaker: "A", line: "Firenze. Mi piacerebbe molto.", translation: "Florence. I would really like that." },
      { speaker: "B", line: "Magari vengo anch'io!", translation: "Maybe I'll come too!" },
      { speaker: "A", line: "Forse un giorno si puo'.", translation: "Perhaps one day it's possible." },
      { speaker: "B", line: "Si'! Magari!", translation: "Yes! If only!" },
    ],
    grammar: {
      title: "Conditional — Vorrei and Mi piacerebbe",
      points: [
        { italian: "Vorrei andare a Roma", english: "I would like to go to Rome" },
        { italian: "Vorresti venire?", english: "Would you like to come?" },
        { italian: "Mi piacerebbe molto", english: "I would like that very much" },
        { italian: "Magari!", english: "If only! / I wish! (expresses longing)" },
        { italian: "Sarebbe bello", english: "It would be lovely" },
      ],
      note: "Magari is one of the most Italian words in existence. It can mean maybe, if only, or I wish — all depending on tone. Magari! alone as a reply expresses wistful longing. Learn it and use it — Italians love it.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor having a dreamy conversation about wishes and plans. Use: vorrei, mi piacerebbe, magari, forse, un giorno. Be warm and imaginative, correct gently.",
  },
  {
    id: 31,
    title: "At Home",
    subtitle: "A Casa",
    free: false,
    keywords: [
      { italian: "Il soggiorno", english: "The living room" },
      { italian: "La cucina", english: "The kitchen" },
      { italian: "Il divano", english: "The sofa" },
      { italian: "Cucinare", english: "To cook" },
      { italian: "Pulire", english: "To clean" },
      { italian: "Rilassarsi", english: "To relax" },
    ],
    dialogue: [
      { speaker: "A", line: "Sei a casa?", translation: "Are you at home?" },
      { speaker: "B", line: "Si', sto cucinando in cucina.", translation: "Yes, I'm cooking in the kitchen." },
      { speaker: "A", line: "Che profumo! Cosa fai?", translation: "What a lovely smell! What are you making?" },
      { speaker: "B", line: "Una pasta al forno. Poi devo pulire il soggiorno.", translation: "A baked pasta. Then I need to clean the living room." },
      { speaker: "A", line: "Dopo ti rilassi un po'?", translation: "Will you relax a bit afterwards?" },
      { speaker: "B", line: "Spero! Mi butto sul divano.", translation: "I hope so! I'm going to throw myself on the sofa." },
    ],
    grammar: {
      title: "Reflexive Verbs — Verbi Riflessivi",
      points: [
        { italian: "Mi rilasso", english: "I relax (myself)" },
        { italian: "Ti svegli?", english: "Do you wake up?" },
        { italian: "Si chiama", english: "He/she is called" },
        { italian: "Ci divertiamo", english: "We enjoy ourselves" },
        { italian: "Mi butto sul divano", english: "I throw myself on the sofa" },
      ],
      note: "Reflexive verbs use a pronoun (mi, ti, si, ci, vi, si) referring back to the subject. They are used for actions done to oneself: getting dressed, waking up, relaxing. Very common in Italian daily life.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor having a cosy conversation about being at home. Use: soggiorno, cucina, divano, cucinare, pulire, rilassarsi, reflexive verbs. Be warm and homely, correct gently.",
  },
  {
    id: 32,
    title: "Daily Routine",
    subtitle: "La Routine Quotidiana",
    free: false,
    keywords: [
      { italian: "Mi sveglio", english: "I wake up" },
      { italian: "Faccio colazione", english: "I have breakfast" },
      { italian: "Mi vesto", english: "I get dressed" },
      { italian: "Torno a casa", english: "I come back home" },
      { italian: "Di solito", english: "Usually" },
      { italian: "Mi addormento", english: "I fall asleep" },
    ],
    dialogue: [
      { speaker: "A", line: "A che ora ti svegli di solito?", translation: "What time do you usually wake up?" },
      { speaker: "B", line: "Mi sveglio alle sette. Faccio colazione e poi mi vesto.", translation: "I wake up at seven. I have breakfast and then get dressed." },
      { speaker: "A", line: "E a che ora torni a casa?", translation: "And what time do you get home?" },
      { speaker: "B", line: "Verso le sei. Poi cucino e mi rilasso.", translation: "Around six. Then I cook and relax." },
      { speaker: "A", line: "E vai a letto tardi?", translation: "And do you go to bed late?" },
      { speaker: "B", line: "No, mi addormento verso le undici.", translation: "No, I fall asleep around eleven." },
    ],
    grammar: {
      title: "Reflexive Verbs — Daily Life",
      points: [
        { italian: "Mi sveglio alle 7", english: "I wake up at 7" },
        { italian: "Mi lavo", english: "I wash myself" },
        { italian: "Mi vesto", english: "I get dressed" },
        { italian: "Mi trucco", english: "I put on makeup" },
        { italian: "Mi addormento", english: "I fall asleep" },
      ],
      note: "Daily routine in Italian is full of reflexive verbs. Notice the pattern: mi (me), ti (you), si (he/she), ci (we), vi (you all), si (they). Always place the pronoun before the conjugated verb.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor asking the student about their daily routine. Use reflexive verbs: svegliarsi, vestirsi, lavarsi, addormentarsi, fare colazione. Be friendly and curious, correct gently.",
  },
  {
    id: 33,
    title: "At the Supermarket",
    subtitle: "Al Supermercato",
    free: false,
    keywords: [
      { italian: "Il carrello", english: "The trolley / cart" },
      { italian: "Il reparto", english: "The aisle / department" },
      { italian: "La cassa", english: "The checkout" },
      { italian: "Mezzo chilo", english: "Half a kilo" },
      { italian: "In offerta", english: "On offer / on sale" },
      { italian: "Dov'e' il reparto...?", english: "Where is the... aisle?" },
    ],
    dialogue: [
      { speaker: "A", line: "Scusi, dov'e' il reparto latticini?", translation: "Excuse me, where is the dairy aisle?" },
      { speaker: "B", line: "E' in fondo a destra.", translation: "It's at the back on the right." },
      { speaker: "A", line: "Grazie. E il pane?", translation: "Thank you. And the bread?" },
      { speaker: "B", line: "Al reparto panetteria, vicino all'entrata.", translation: "At the bakery section, near the entrance." },
      { speaker: "A", line: "Questo formaggio e' in offerta?", translation: "Is this cheese on offer?" },
      { speaker: "B", line: "Si', prenda due e risparmia il 20%.", translation: "Yes, take two and save 20%." },
    ],
    grammar: {
      title: "Partitives — Expressing Some",
      points: [
        { italian: "Un chilo di pasta", english: "A kilo of pasta" },
        { italian: "Mezzo litro di latte", english: "Half a litre of milk" },
        { italian: "Una confezione di biscotti", english: "A packet of biscuits" },
        { italian: "Del pane", english: "Some bread (partitive)" },
        { italian: "Delle mele", english: "Some apples (partitive)" },
      ],
      note: "Italian uses del/della/dei/delle (partitives) to mean some. Vorrei del pane = I'd like some bread. This is different from English but very natural once you get used to it.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor playing a supermarket assistant. Help the student find products and understand quantities. Use: carrello, reparto, cassa, offerta, partitives. Be helpful and practical, correct gently.",
  },
  {
    id: 34,
    title: "On the Bus",
    subtitle: "Sull'Autobus",
    free: false,
    keywords: [
      { italian: "Il biglietto", english: "The ticket" },
      { italian: "La fermata", english: "The stop" },
      { italian: "Scendere", english: "To get off" },
      { italian: "Salire", english: "To get on" },
      { italian: "Quante fermate?", english: "How many stops?" },
      { italian: "Devo cambiare?", english: "Do I need to change?" },
    ],
    dialogue: [
      { speaker: "A", line: "Scusi, questo autobus va al centro?", translation: "Excuse me, does this bus go to the centre?" },
      { speaker: "B", line: "Si', ma deve cambiare alla fermata San Marco.", translation: "Yes, but you need to change at San Marco stop." },
      { speaker: "A", line: "Quante fermate sono?", translation: "How many stops is it?" },
      { speaker: "B", line: "Quattro fermate. Poi scende e aspetta il 14.", translation: "Four stops. Then get off and wait for the 14." },
      { speaker: "A", line: "Grazie! Dove compro il biglietto?", translation: "Thank you! Where do I buy the ticket?" },
      { speaker: "B", line: "Deve comprarlo alla tabaccheria.", translation: "You need to buy it at the tobacconist." },
    ],
    grammar: {
      title: "Dovere + Infinitive on Public Transport",
      points: [
        { italian: "Devo scendere qui", english: "I need to get off here" },
        { italian: "Deve cambiare", english: "You need to change (formal)" },
        { italian: "Posso salire?", english: "Can I get on?" },
        { italian: "Non posso aspettare", english: "I can't wait" },
        { italian: "Devi comprare il biglietto", english: "You need to buy a ticket" },
      ],
      note: "On public transport, dovere (must) and potere (can) are essential. They always pair with an infinitive verb. Remember: devo for I must, deve for he/she/you (formal) must.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor playing a fellow passenger on an Italian bus. Help the student navigate public transport. Use: biglietto, fermata, scendere, salire, dovere, potere. Be helpful and clear, correct gently.",
  },
  {
    id: 35,
    title: "Free Time",
    subtitle: "Il Tempo Libero",
    free: false,
    keywords: [
      { italian: "Leggere", english: "To read" },
      { italian: "Guardare un film", english: "To watch a film" },
      { italian: "Passeggiare", english: "To go for a walk" },
      { italian: "Ascoltare musica", english: "To listen to music" },
      { italian: "Nel tempo libero", english: "In my free time" },
      { italian: "Mi annoio", english: "I'm bored" },
    ],
    dialogue: [
      { speaker: "A", line: "Cosa fai nel tempo libero?", translation: "What do you do in your free time?" },
      { speaker: "B", line: "Mi piace leggere e ascoltare musica.", translation: "I like reading and listening to music." },
      { speaker: "A", line: "Guardi film italiani?", translation: "Do you watch Italian films?" },
      { speaker: "B", line: "Si'! E' il modo migliore per imparare.", translation: "Yes! It's the best way to learn." },
      { speaker: "A", line: "E quando ti annoi?", translation: "And when you're bored?" },
      { speaker: "B", line: "Vado a passeggiare. Mi rilassa molto.", translation: "I go for a walk. It really relaxes me." },
    ],
    grammar: {
      title: "Infinitive Verbs as Nouns",
      points: [
        { italian: "Mi piace leggere", english: "I like reading" },
        { italian: "Preferisco guardare film", english: "I prefer watching films" },
        { italian: "Adoro cucinare", english: "I love cooking" },
        { italian: "Odio aspettare", english: "I hate waiting" },
        { italian: "Ho voglia di uscire", english: "I feel like going out" },
      ],
      note: "In Italian, when talking about activities you like or dislike, use the infinitive directly after mi piace, preferisco, adoro etc. No need for -ing forms — the infinitive does that job.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor having a relaxed chat about hobbies and free time. Use: leggere, guardare film, passeggiare, ascoltare musica, mi piace plus infinitive. Be casual and curious, correct gently.",
  },
  {
    id: 36,
    title: "Making and Refusing Invitations",
    subtitle: "Inviti e Rifiuti",
    free: false,
    keywords: [
      { italian: "Ti va di...?", english: "Do you fancy...? / Feel like...?" },
      { italian: "Volentieri!", english: "With pleasure! / Love to!" },
      { italian: "Non posso", english: "I can't" },
      { italian: "Peccato", english: "What a shame" },
      { italian: "Un'altra volta", english: "Another time" },
      { italian: "Magari la prossima", english: "Maybe next time" },
    ],
    dialogue: [
      { speaker: "A", line: "Ti va di venire a cena stasera?", translation: "Do you fancy coming to dinner tonight?" },
      { speaker: "B", line: "Volentieri! A che ora?", translation: "Love to! What time?" },
      { speaker: "A", line: "Alle otto. E Marco, viene?", translation: "At eight. And Marco, is he coming?" },
      { speaker: "B", line: "Gli chiedo. Lui di solito non puo' il venerdi'.", translation: "I'll ask him. He usually can't on Fridays." },
      { speaker: "A", line: "Se non puo', peccato — un'altra volta.", translation: "If he can't, what a shame — another time." },
      { speaker: "B", line: "Si', magari la prossima settimana.", translation: "Yes, maybe next week." },
    ],
    grammar: {
      title: "Modal Verbs — Invitations and Refusals",
      points: [
        { italian: "Non posso venire", english: "I can't come" },
        { italian: "Vuoi uscire?", english: "Do you want to go out?" },
        { italian: "Dovrei restare", english: "I should stay" },
        { italian: "Potremmo andare", english: "We could go" },
        { italian: "Ti va di...?", english: "Do you feel like...? (set phrase)" },
      ],
      note: "Ti va di...? is one of the most useful Italian invitation phrases — casual and warm. Volentieri is the perfect positive response. For refusals, peccato softens the disappointment beautifully.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor role-playing invitations — sometimes accepting, sometimes politely refusing. Use: ti va, volentieri, non posso, peccato, un'altra volta. Be warm and social, correct gently.",
  },
  {
    id: 37,
    title: "My City",
    subtitle: "La Mia Città",
    free: false,
    keywords: [
      { italian: "Ciò che mi piace di più", english: "What I like most" },
      { italian: "La cosa più interessante", english: "The most interesting thing" },
      { italian: "Quello che non mi piace tanto", english: "What I don't like much" },
      { italian: "Il quartiere", english: "The neighbourhood" },
      { italian: "Vivace / tranquillo", english: "Lively / quiet" },
      { italian: "Mi manca", english: "I miss it" },
    ],
    dialogue: [
      { speaker: "A", line: "Di dove sei?", translation: "Where are you from?" },
      { speaker: "B", line: "Sono di Napoli. Tu conosci?", translation: "I'm from Naples. Do you know it?" },
      { speaker: "A", line: "Un po'. Cosa ti piace di più?", translation: "A little. What do you like most about it?" },
      { speaker: "B", line: "Ciò che mi piace di più è il mare e il cibo.", translation: "What I like most is the sea and the food." },
      { speaker: "A", line: "E la cosa più interessante?", translation: "And the most interesting thing?" },
      { speaker: "B", line: "La storia. È una città antichissima.", translation: "The history. It's a very ancient city." },
      { speaker: "A", line: "C'è qualcosa che non ti piace tanto?", translation: "Is there anything you don't like much?" },
      { speaker: "B", line: "Il traffico! Quello che non sopporto è il caos.", translation: "The traffic! What I can't stand is the chaos." },
    ],
    grammar: {
      title: "Relative Clauses — Ciò che / Quello che",
      points: [
        { italian: "Ciò che mi piace", english: "What I like (that which pleases me)" },
        { italian: "Quello che voglio", english: "What I want" },
        { italian: "La cosa che preferisco", english: "The thing that I prefer" },
        { italian: "Non è quello che pensavo", english: "It's not what I thought" },
        { italian: "Tutto ciò che sai", english: "Everything you know" },
      ],
      note: "Ciò che and quello che both mean what in the sense of the thing that. They introduce relative clauses and are interchangeable. Use them to express preferences, opinions, and descriptions in a sophisticated way.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor having a conversation about Italian cities and what the student likes or dislikes about where they live. Use: cio' che mi piace, la cosa piu' interessante, quello che non mi piace, quartiere, vivace, tranquillo. Be curious and engaging, correct gently.",
  },
  {
    id: 38,
    title: "In a Hurry",
    subtitle: "Di Fretta",
    free: false,
    keywords: [
      { italian: "Siamo in ritardo!", english: "We're late!" },
      { italian: "Aspettami!", english: "Wait for me!" },
      { italian: "Forza!", english: "Come on! / Hurry up!" },
      { italian: "Sbrigati!", english: "Hurry up!" },
      { italian: "Prendo la valigia", english: "I'll grab the suitcase" },
      { italian: "Corri!", english: "Run!" },
    ],
    dialogue: [
      { speaker: "A", line: "Sbrigati! Siamo in ritardo!", translation: "Hurry up! We're late!" },
      { speaker: "B", line: "Aspettami, prendo la valigia.", translation: "Wait for me, I'll grab the suitcase." },
      { speaker: "A", line: "Prendila e vieni, forza!", translation: "Grab it and come, come on!" },
      { speaker: "B", line: "Aiutami con questa borsa!", translation: "Help me with this bag!" },
      { speaker: "A", line: "Dai, corri! Il treno parte tra cinque minuti.", translation: "Come on, run! The train leaves in five minutes." },
      { speaker: "B", line: "Ok ok, vengo! Non perdere la calma!", translation: "OK OK, I'm coming! Don't lose your cool!" },
    ],
    grammar: {
      title: "Informal Imperative — Commands with Pronouns",
      points: [
        { italian: "Aspetta! / Aspettami!", english: "Wait! / Wait for me!" },
        { italian: "Sbrigati!", english: "Hurry up! (reflexive imperative)" },
        { italian: "Corri!", english: "Run!" },
        { italian: "Prendila!", english: "Take it! (pronoun attached to verb)" },
        { italian: "Aiutami!", english: "Help me!" },
      ],
      note: "In informal commands, object pronouns attach to the end of the verb: prendila (take it), aspettami (wait for me), aiutami (help me). This is very common in fast-paced real conversation.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor role-playing a rushed situation — catching a train, running late. Practice urgent commands: sbrigati, aspettami, forza, corri, prendila. Be energetic, correct gently.",
  },
  {
    id: 39,
    title: "Sunday with Friends",
    subtitle: "Domenica con gli Amici",
    free: false,
    keywords: [
      { italian: "Vi va di...?", english: "Do you all fancy...?" },
      { italian: "Preferirei", english: "I would prefer" },
      { italian: "L'agriturismo", english: "Country restaurant / farm stay" },
      { italian: "E' affollato", english: "It's crowded" },
      { italian: "Non si trova parcheggio", english: "You can't find parking" },
      { italian: "Che ne dite?", english: "What do you all think?" },
    ],
    dialogue: [
      { speaker: "A", line: "Vi va di andare al mare domenica?", translation: "Do you fancy going to the sea on Sunday?" },
      { speaker: "B", line: "Preferirei andare a mangiare in un agriturismo.", translation: "I'd prefer to go eat at a country restaurant." },
      { speaker: "C", line: "Anch'io — la spiaggia e' sempre affollata.", translation: "Me too — the beach is always crowded." },
      { speaker: "A", line: "E' vero, e non si trova mai parcheggio.", translation: "True, and you can never find parking." },
      { speaker: "B", line: "Conosco un posto bellissimo in collina. Che ne dite?", translation: "I know a beautiful place in the hills. What do you think?" },
      { speaker: "C", line: "Perfetto! Prenotiamo?", translation: "Perfect! Shall we book?" },
    ],
    grammar: {
      title: "Si Impersonale — The Impersonal Si",
      points: [
        { italian: "Non si trova parcheggio", english: "You can't find parking (one can't find)" },
        { italian: "Si mangia bene qui", english: "One eats well here / the food is good here" },
        { italian: "Come si dice?", english: "How do you say? (lit. how does one say?)" },
        { italian: "Si puo' prenotare?", english: "Can one book? / Is it possible to book?" },
        { italian: "Non si sa mai", english: "You never know" },
      ],
      note: "The impersonal si is used when there's no specific subject — like one, you, or people in English. Come si dice? is one of the most useful phrases for language learners!",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor role-playing a group of friends planning a Sunday outing. Practice: vi va, preferirei, affollato, si impersonale, che ne dite. Be social and fun, correct gently.",
  },
  {
    id: 40,
    title: "It Seems and I Remember",
    subtitle: "Mi Sembra e Mi Ricordo",
    free: false,
    keywords: [
      { italian: "Mi sembra che", english: "It seems to me that" },
      { italian: "Mi pare", english: "It appears / it seems" },
      { italian: "Ti ricordi?", english: "Do you remember?" },
      { italian: "Mi ricordo", english: "I remember" },
      { italian: "Non mi ricordo", english: "I don't remember" },
      { italian: "Mi sembra ieri", english: "It seems like yesterday" },
    ],
    dialogue: [
      { speaker: "A", line: "Ti ricordi di quella vacanza a Capri?", translation: "Do you remember that holiday in Capri?" },
      { speaker: "B", line: "Certo! Mi sembra ieri.", translation: "Of course! It seems like yesterday." },
      { speaker: "A", line: "Ti ricordi quel ristorante sul mare?", translation: "Do you remember that restaurant by the sea?" },
      { speaker: "B", line: "Mi pare di si', ma non mi ricordo il nome.", translation: "I think so, but I don't remember the name." },
      { speaker: "A", line: "Mi sembrava cosi' romantico.", translation: "It seemed so romantic to me." },
      { speaker: "B", line: "Si'! Dobbiamo tornarci un giorno.", translation: "Yes! We must go back there one day." },
    ],
    grammar: {
      title: "Reflexive Verbs — Memory and Perception",
      points: [
        { italian: "Mi ricordo", english: "I remember (lit. I recall to myself)" },
        { italian: "Ti ricordi?", english: "Do you remember?" },
        { italian: "Si ricorda", english: "He/she remembers (also formal you)" },
        { italian: "Mi sembra / mi pare", english: "It seems to me (interchangeable)" },
        { italian: "Mi sembra ieri", english: "It seems like yesterday" },
      ],
      note: "Ricordarsi is reflexive: mi ricordo, ti ricordi, si ricorda, ci ricordiamo, vi ricordate, si ricordano. Mi sembra and mi pare are interchangeable — use them to soften statements and sound more natural.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor having a nostalgic conversation about shared memories. Practice: mi ricordo, ti ricordi, mi sembra, mi pare. Be warm and reflective, correct gently.",
  },
  {
    id: 41,
    title: "Talking About the Past",
    subtitle: "Parlare del Passato",
    free: false,
    keywords: [
      { italian: "Ho fatto", english: "I did / I have done" },
      { italian: "Ho mangiato", english: "I ate / I have eaten" },
      { italian: "Sono andato/a", english: "I went" },
      { italian: "Siamo arrivati", english: "We arrived" },
      { italian: "L'anno scorso", english: "Last year" },
      { italian: "La settimana scorsa", english: "Last week" },
    ],
    dialogue: [
      { speaker: "A", line: "Come hai passato il weekend?", translation: "How did you spend the weekend?" },
      { speaker: "B", line: "Sono andato a Venezia con mia moglie.", translation: "I went to Venice with my wife." },
      { speaker: "A", line: "Che bello! Avete mangiato bene?", translation: "How lovely! Did you eat well?" },
      { speaker: "B", line: "Benissimo! Ho mangiato il miglior risotto della mia vita.", translation: "Wonderfully! I ate the best risotto of my life." },
      { speaker: "A", line: "E siete arrivati senza problemi?", translation: "And did you arrive without problems?" },
      { speaker: "B", line: "Si', il treno era in orario per una volta!", translation: "Yes, the train was on time for once!" },
    ],
    grammar: {
      title: "Passato Prossimo — Avere vs Essere",
      points: [
        { italian: "Ho mangiato (avere)", english: "I ate — most verbs use avere" },
        { italian: "Sono andato/a (essere)", english: "I went — motion verbs use essere" },
        { italian: "Siamo arrivati (essere)", english: "We arrived — participle agrees with subject" },
        { italian: "Hai fatto?", english: "Did you do? / Have you done?" },
        { italian: "Non ho capito", english: "I didn't understand" },
      ],
      note: "Verbs of motion (andare, venire, arrivare, partire) and reflexive verbs use essere. Everything else uses avere. With essere, the past participle changes: andato (m), andata (f), andati (m pl), andate (f pl).",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor asking the student about things they did recently. Practice passato prossimo with avere and essere. Be conversational and encouraging, correct gently.",
  },
  {
    id: 42,
    title: "Childhood Memories",
    subtitle: "Ricordi d'Infanzia",
    free: false,
    keywords: [
      { italian: "Quando ero piccolo/a", english: "When I was young" },
      { italian: "Giocavo", english: "I used to play" },
      { italian: "La scuola", english: "School" },
      { italian: "D'estate", english: "In the summer" },
      { italian: "Ogni giorno", english: "Every day" },
      { italian: "Mi piaceva", english: "I used to like" },
    ],
    dialogue: [
      { speaker: "A", line: "Com'era la tua infanzia?", translation: "What was your childhood like?" },
      { speaker: "B", line: "Bellissima! D'estate giocavo sempre fuori.", translation: "Wonderful! In summer I always played outside." },
      { speaker: "A", line: "E la scuola? Ti piaceva?", translation: "And school? Did you like it?" },
      { speaker: "B", line: "Abbastanza. Mi piaceva la matematica.", translation: "Quite. I liked maths." },
      { speaker: "A", line: "Quando ero piccola, volevo fare la ballerina.", translation: "When I was young, I wanted to be a dancer." },
      { speaker: "B", line: "Davvero? Anch'io avevo grandi sogni!", translation: "Really? I had big dreams too!" },
    ],
    grammar: {
      title: "Imperfetto — Habits and States in the Past",
      points: [
        { italian: "Giocavo ogni giorno", english: "I used to play every day" },
        { italian: "Quando ero piccolo...", english: "When I was young..." },
        { italian: "Mi piaceva la scuola", english: "I used to like school" },
        { italian: "Volevo fare...", english: "I wanted to be / do..." },
        { italian: "Era bellissimo", english: "It was wonderful" },
      ],
      note: "The imperfetto describes ongoing past states, habits, and emotions. Compare: Ho mangiato la pizza (I ate pizza once) vs Mangiavo la pizza ogni venerdi (I used to eat pizza every Friday).",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor having a nostalgic conversation about childhood memories. Practice the imperfetto: giocavo, ero, mi piaceva, volevo. Be warm and nostalgic, correct gently.",
  },
  {
    id: 43,
    title: "Expressing Opinions",
    subtitle: "Esprimere Opinioni",
    free: false,
    keywords: [
      { italian: "Secondo me", english: "In my opinion" },
      { italian: "Penso che", english: "I think that" },
      { italian: "Mi sembra", english: "It seems to me" },
      { italian: "Mi pare", english: "It appears to me (same as mi sembra)" },
      { italian: "Sono d'accordo", english: "I agree" },
      { italian: "Hai ragione", english: "You're right" },
    ],
    dialogue: [
      { speaker: "A", line: "Secondo te, qual e' la citta' piu' bella d'Italia?", translation: "In your opinion, which is the most beautiful city in Italy?" },
      { speaker: "B", line: "Secondo me, Firenze. Mi sembra unica.", translation: "In my opinion, Florence. It seems unique to me." },
      { speaker: "A", line: "Penso che Roma sia piu' interessante.", translation: "I think Rome is more interesting." },
      { speaker: "B", line: "Hai ragione, Roma e' straordinaria.", translation: "You're right, Rome is extraordinary." },
      { speaker: "A", line: "Sei d'accordo che il cibo e' meglio al sud?", translation: "Do you agree that the food is better in the south?" },
      { speaker: "B", line: "Assolutamente! Non c'e' dubbio.", translation: "Absolutely! There's no doubt." },
    ],
    grammar: {
      title: "Opinion Structures",
      points: [
        { italian: "Secondo me...", english: "In my opinion... (lit. according to me)" },
        { italian: "Mi sembra che", english: "It seems to me that" },
        { italian: "Mi pare che", english: "It appears to me that (same as mi sembra)" },
        { italian: "Ti ricordi?", english: "Do you remember? (reflexive)" },
        { italian: "Sono / non sono d'accordo", english: "I agree / I disagree" },
      ],
      note: "Secondo me is the easiest way to give an opinion. Mi sembra and mi pare are interchangeable and very common. Ti ricordi? is a useful reflexive — mi ricordo (I remember), ti ricordi (you remember), si ricorda (he/she remembers).",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor having a lively discussion about Italian cities, food, and culture. Practice: secondo me, mi sembra, mi pare, ti ricordi, sono d'accordo. Be engaging, correct gently.",
  },
  {
    id: 44,
    title: "Giving Advice",
    subtitle: "Dare Consigli",
    free: false,
    keywords: [
      { italian: "Dovresti", english: "You should" },
      { italian: "Ti consiglio di", english: "I advise you to" },
      { italian: "E' meglio che", english: "It's better that" },
      { italian: "Al posto tuo", english: "In your position / if I were you" },
      { italian: "Perche' non...?", english: "Why don't you...?" },
      { italian: "Prova a", english: "Try to" },
    ],
    dialogue: [
      { speaker: "A", line: "Non riesco a dormire bene.", translation: "I can't sleep well." },
      { speaker: "B", line: "Dovresti andare a letto prima.", translation: "You should go to bed earlier." },
      { speaker: "A", line: "Ho provato, ma non funziona.", translation: "I've tried, but it doesn't work." },
      { speaker: "B", line: "Ti consiglio di evitare il caffe' la sera.", translation: "I advise you to avoid coffee in the evening." },
      { speaker: "A", line: "Al posto tuo, cosa faresti?", translation: "If you were me, what would you do?" },
      { speaker: "B", line: "Perche' non provi una camomilla prima di dormire?", translation: "Why don't you try chamomile before sleeping?" },
    ],
    grammar: {
      title: "Conditional for Advice",
      points: [
        { italian: "Dovresti riposare", english: "You should rest" },
        { italian: "Potresti provare", english: "You could try" },
        { italian: "Al posto tuo, andrei", english: "In your position, I would go" },
        { italian: "Perche' non parli con lui?", english: "Why don't you talk to him?" },
        { italian: "Ti consiglio di aspettare", english: "I advise you to wait" },
      ],
      note: "Dovresti (you should) and potresti (you could) are conditional forms — perfect for giving advice without being too forceful. Al posto tuo literally means in your place and is a very natural way to frame advice.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor playing a wise friend giving advice. Practice: dovresti, ti consiglio, e' meglio, al posto tuo, perche' non. Be warm and helpful, correct gently.",
  },
  {
    id: 45,
    title: "Real and Hypothetical",
    subtitle: "Reale e Ipotetico",
    free: false,
    keywords: [
      { italian: "Se ho i soldi, vado", english: "If I have the money, I'll go (real possibility)" },
      { italian: "Se avessi i soldi, andrei", english: "If I had the money, I would go (hypothetical)" },
      { italian: "Magari potessi!", english: "If only I could!" },
      { italian: "Nel caso in cui", english: "In the event that" },
      { italian: "Dipende da", english: "It depends on" },
      { italian: "Chissà", english: "Who knows / maybe someday" },
    ],
    dialogue: [
      { speaker: "A", line: "Cosa fai a luglio?", translation: "What are you doing in July?" },
      { speaker: "B", line: "Se ho i soldi, vado in Sicilia.", translation: "If I have the money, I'll go to Sicily." },
      { speaker: "A", line: "E se non li hai?", translation: "And if you don't have them?" },
      { speaker: "B", line: "Resto a casa. Ma tu?", translation: "I'll stay home. But you?" },
      { speaker: "A", line: "Io sogno in grande — se avessi i soldi, andrei in Giappone!", translation: "I dream big — if I had the money, I'd go to Japan!" },
      { speaker: "B", line: "Magari potessi anch'io! Chissà, un giorno.", translation: "If only I could too! Who knows, one day." },
      { speaker: "A", line: "Se vincessi alla lotteria, ci andremmo insieme!", translation: "If I won the lottery, we'd go together!" },
    ],
    grammar: {
      title: "Conditionals — Real vs Hypothetical",
      points: [
        { italian: "Se ho tempo, vengo", english: "If I have time, I'll come (real — present + present/future)" },
        { italian: "Se avessi tempo, verrei", english: "If I had time, I would come (hypothetical — imperfect subjunctive + conditional)" },
        { italian: "Se fosse possibile", english: "If it were possible" },
        { italian: "Se vincessi alla lotteria", english: "If I won the lottery" },
        { italian: "Chissà", english: "Who knows (expresses uncertainty about the future)" },
      ],
      note: "Italian has two main conditional structures. Real: se + present tense = something that might actually happen. Hypothetical: se + imperfect subjunctive (avessi, fossi, potessi) + conditional (andrei, verrei) = something unlikely or imaginary. The second is very elegant and worth learning.",
    },
    aiPrompt: "STRICT RULES: Only discuss vocabulary and grammar from this specific lesson. If asked about anything unrelated reply only: Let us stick to this lesson! Never break character. Always reply in English, using Italian words from the lesson. You are an Italian tutor exploring real and hypothetical situations with the student — travel plans, dreams, what-ifs. Practice: se ho... vado, se avessi... andrei, magari potessi, chissà. Be imaginative and warm, correct gently.",
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
  const DAILY_LIMIT = 20;
  const storageKey = `msgCount_${lesson.id}_${new Date().toDateString()}`;
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Ciao! Ready to practise "${lesson.title}"? Let's go! 😊 (${DAILY_LIMIT} messages available today)` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(() => parseInt(localStorage.getItem(storageKey) || "0"));
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    if (msgCount >= DAILY_LIMIT) {
      setMessages(prev => [...prev, { role: "assistant", content: "You have reached your 20 message daily limit for this lesson. Come back tomorrow to keep practising! 🇮🇹" }]);
      return;
    }
    const userMsg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const newCount = msgCount + 1;
    setMsgCount(newCount);
    localStorage.setItem(storageKey, newCount.toString());
    if (lesson.free) {
      await new Promise(r => setTimeout(r, 600));
      setMessages(prev => [...prev, { role: "assistant", content: "AI conversation practice is unlocked with a subscription. Subscribe from $3/month to practise live with your AI Italian tutor! 🇮🇹" }]);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
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
                <div style={{flex: 1}}>
                  <div style={styles.dialogueText}>{line.line}</div>
                  {line.translation && <div style={styles.dialogueTranslation}>{line.translation}</div>}
                </div>
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

// ── Checkout ─────────────────────────────────────────────────────────────────
async function handleCheckout(plan) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, userId }),
    });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
  } catch (error) {
    alert("Something went wrong. Please try again.");
  }
}

// ── Home / Lesson List ────────────────────────────────────────────────────────
function Home({ onSelect, user, isSubscribed, onAuthClick, onLegal }) {
  return (
    <div style={styles.home}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroTag}>Crash Course · Learn Fast · Only What You Need</div>
        <h1 style={styles.heroTitle}>Parli<span style={styles.heroAccent}>ssimo</span></h1>
        <p style={styles.heroSub}>
          Situational Italian in minutes — real conversations, essential grammar, nothing extra.
        </p>
      </div>

      {/* Lessons */}
      <div style={styles.lessonList}>
        <h3 style={styles.listHeading}>Module 1 — Travel · Viaggiare</h3>
        {LESSONS.filter(l => l.id <= 20).map(lesson => (
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
                ? <span style={styles.freeBadge}>Free</span>
                : isSubscribed
                  ? <span style={styles.freeBadge}>✓</span>
                  : <span style={styles.lockBadge}><LockIcon /> Subscribe</span>}
              <ChevronRight />
            </div>
          </div>
        ))}
        <h3 style={{...styles.listHeading, marginTop: 28}}>Module 2 — Everyday Life · La Vita Quotidiana</h3>
        {LESSONS.filter(l => l.id >= 21 && l.id <= 40).map(lesson => (
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
                ? <span style={styles.freeBadge}>Free</span>
                : isSubscribed
                  ? <span style={styles.freeBadge}>✓</span>
                  : <span style={styles.lockBadge}><LockIcon /> Subscribe</span>}
              <ChevronRight />
            </div>
          </div>
        ))}
        <h3 style={{...styles.listHeading, marginTop: 28}}>Module 3 — Deeper Conversations · Conversazioni Più Profonde</h3>
        {LESSONS.filter(l => l.id >= 41).map(lesson => (
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
                ? <span style={styles.freeBadge}>Free</span>
                : isSubscribed
                  ? <span style={styles.freeBadge}>✓</span>
                  : <span style={styles.lockBadge}><LockIcon /> Subscribe</span>}
              <ChevronRight />
            </div>
          </div>
        ))}
      </div>

      {/* Pricing nudge */}
      <div id="pricing-section" style={styles.pricingBox}>
        <div style={styles.pricingTitle}>Unlock the Full Course</div>
        <p style={styles.pricingText}>
          All 45 lessons, AI conversation practice, and grammar flashcards.
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
        <div style={styles.pricingButtons}>
          <button style={styles.ctaBtn} onClick={() => handleCheckout("monthly")}>Monthly — $3</button>
          <button style={styles.ctaBtn} onClick={() => handleCheckout("yearly")}>Yearly — $30</button>
          <button style={{...styles.ctaBtn, background: "#B8860B"}} onClick={() => handleCheckout("lifetime")}>Lifetime — $49</button>
        </div>

      </div>
      <div style={styles.footer}>
        <span style={styles.footerLink} onClick={() => onLegal("privacy")}>Privacy Policy</span>
        <span style={styles.footerDot}>·</span>
        <span style={styles.footerLink} onClick={() => onLegal("terms")}>Terms of Service</span>
        <span style={styles.footerDot}>·</span>
        <span style={styles.footerText}>© 2026 Parlissimo</span>
      </div>
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setMessage("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else onAuth();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage("Check your email to confirm your account!");
    }
    setLoading(false);
  }

  async function handleReset() {
    if (!email.trim()) { setMessage("Enter your email above first."); return; }
    if (resetSent) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://parlissimo.live",
    });
    if (error) setMessage(error.message);
    else setResetSent(true);
    setLoading(false);
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <button style={styles.modalClose} onClick={onClose}>×</button>
        <h2 style={styles.modalTitle}>{mode === "login" ? "Welcome back" : "Create account"}</h2>
        <input
          style={styles.authInput}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.authInput}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
        />
        {message && <div style={styles.authMessage}>{message}</div>}
        <button style={styles.ctaBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : mode === "login" ? "Log in" : "Sign up"}
        </button>
        <div style={styles.authSwitch}>
          {mode === "login" ? (
            <div>
              <div style={{marginBottom: 8}}>No account? <span style={styles.authLink} onClick={() => setMode("signup")}>Sign up free</span></div>
              {resetSent
                ? <div style={{color: "#2E7D32", fontSize: 12}}>✓ Reset link sent — check your email if it is associated with a Parlissimo account.</div>
                : <div>Forgot password? <span style={styles.authLink} onClick={handleReset}>Send reset link</span></div>}
            </div>
          ) : (
            <span>Have an account? <span style={styles.authLink} onClick={() => setMode("login")}>Log in</span></span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Reset Password Page ───────────────────────────────────────────────────────
function ResetPasswordPage({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  async function handleReset() {
    if (password.length < 6) { setMessage("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setMessage("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(error.message);
    else { setDone(true); setTimeout(() => { if (onDone) onDone(); }, 2000); }
    setLoading(false);
  }

  return (
    <div style={styles.shell}>
      <div style={styles.container}>
        <div style={{paddingTop: 60, maxWidth: 380, margin: "0 auto"}}>
          <h2 style={styles.modalTitle}>Create new password</h2>
          {done ? (
            <div>
              <div style={{color: "#2E7D32", marginBottom: 20, fontFamily: "sans-serif", fontSize: 14}}>
                ✓ Password updated! <a href="https://parlissimo.live" style={{color: "#C4622D"}}>Go to Parlissimo</a>
              </div>
            </div>
          ) : (
            <div>
              <input
                style={styles.authInput}
                type="password"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <input
                style={styles.authInput}
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleReset()}
              />
              {message && <div style={styles.authMessage}>{message}</div>}
              <button style={styles.ctaBtn} onClick={handleReset} disabled={loading}>
                {loading ? "..." : "Update password"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Legal Pages ───────────────────────────────────────────────────────────────
function LegalPage({ type, onClose }) {
  const isPrivacy = type === "privacy";
  return (
    <div style={styles.shell}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={onClose}>← Back to Parlissimo</button>
        <div style={styles.legalWrap}>
          {isPrivacy ? <PrivacyPolicy /> : <TermsOfService />}
        </div>
      </div>
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <div>
      <h1 style={styles.legalTitle}>Privacy Policy</h1>
      <p style={styles.legalDate}>Last updated: May 2026</p>

      <p style={styles.legalText}>Parlissimo ("we", "us", "our") operates the website parlissimo.live. This Privacy Policy explains how we collect, use, and protect your personal information when you use our service.</p>

      <h2 style={styles.legalH2}>1. Information We Collect</h2>
      <p style={styles.legalText}><strong>Account information:</strong> When you register, we collect your email address and encrypted password.</p>
      <p style={styles.legalText}><strong>Payment information:</strong> Payments are processed by Stripe. We do not store your credit card details. Stripe may collect and store payment data in accordance with their own Privacy Policy.</p>
      <p style={styles.legalText}><strong>Usage data:</strong> We may collect anonymous data about how you interact with the app (lessons viewed, session duration) to improve our service.</p>
      <p style={styles.legalText}><strong>AI conversations:</strong> Messages you send to the AI practice chat are processed by Anthropic's API. We do not permanently store your conversation history.</p>

      <h2 style={styles.legalH2}>2. How We Use Your Information</h2>
      <p style={styles.legalText}>We use your information to: provide and maintain the service; process payments and manage your subscription; send transactional emails (account confirmation, password reset); respond to support requests; improve our content and service.</p>
      <p style={styles.legalText}>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

      <h2 style={styles.legalH2}>3. Data Storage and Security</h2>
      <p style={styles.legalText}>Your account data is stored securely using Supabase, which uses industry-standard encryption. Payment data is handled exclusively by Stripe, a PCI-DSS compliant payment processor. We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, or destruction.</p>

      <h2 style={styles.legalH2}>4. Cookies</h2>
      <p style={styles.legalText}>Parlissimo uses minimal cookies and local browser storage strictly necessary for authentication and session management. We do not use tracking cookies or third-party advertising cookies.</p>

      <h2 style={styles.legalH2}>5. Third-Party Services</h2>
      <p style={styles.legalText}>We use the following third-party services: Supabase (authentication and database), Stripe (payment processing), Anthropic (AI conversation practice), Vercel (hosting). Each of these services has their own Privacy Policy governing the data they process.</p>

      <h2 style={styles.legalH2}>6. Your Rights</h2>
      <p style={styles.legalText}>You have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your account and associated data; withdraw consent at any time; lodge a complaint with your local data protection authority.</p>
      <p style={styles.legalText}>To exercise any of these rights, contact us at: hello@parlissimo.live</p>

      <h2 style={styles.legalH2}>7. Data Retention</h2>
      <p style={styles.legalText}>We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or financial compliance purposes.</p>

      <h2 style={styles.legalH2}>8. Children's Privacy</h2>
      <p style={styles.legalText}>Parlissimo is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal data, please contact us immediately.</p>

      <h2 style={styles.legalH2}>9. Changes to This Policy</h2>
      <p style={styles.legalText}>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or via a notice on the app. Continued use of the service after changes constitutes acceptance of the updated policy.</p>

      <h2 style={styles.legalH2}>10. Contact</h2>
      <p style={styles.legalText}>For any privacy-related questions, contact us at: <strong>hello@parlissimo.live</strong></p>
    </div>
  );
}

function TermsOfService() {
  return (
    <div>
      <h1 style={styles.legalTitle}>Terms of Service</h1>
      <p style={styles.legalDate}>Last updated: May 2026</p>

      <p style={styles.legalText}>Please read these Terms of Service carefully before using Parlissimo. By accessing or using our service, you agree to be bound by these terms.</p>

      <h2 style={styles.legalH2}>1. Service Description</h2>
      <p style={styles.legalText}>Parlissimo is an online Italian language learning platform offering structured lessons, grammar guides, audio pronunciation, and AI-powered conversation practice. The first lesson is available free of charge. Access to all lessons and AI practice requires a paid subscription.</p>

      <h2 style={styles.legalH2}>2. Account Registration</h2>
      <p style={styles.legalText}>To access paid features, you must create an account with a valid email address. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You must not share your account with others.</p>

      <h2 style={styles.legalH2}>3. Subscriptions and Payments</h2>
      <p style={styles.legalText}><strong>Monthly subscription:</strong> $3.00 USD per month, billed monthly and automatically renewed until cancelled.</p>
      <p style={styles.legalText}><strong>Annual subscription:</strong> $30.00 USD per year, billed annually and automatically renewed until cancelled.</p>
      <p style={styles.legalText}><strong>Lifetime access:</strong> $49.00 USD, one-time payment, permanent access with no recurring charges.</p>
      <p style={styles.legalText}>All payments are processed securely by Stripe. By subscribing, you authorise us to charge your payment method on a recurring basis until you cancel. Prices may be subject to local taxes.</p>

      <h2 style={styles.legalH2}>4. Cancellation and Refunds</h2>
      <p style={styles.legalText}>You may cancel your subscription at any time through the "Manage" option in the app. Upon cancellation, you will retain access until the end of your current billing period. No refunds are provided for partial billing periods.</p>
      <p style={styles.legalText}>Lifetime access purchases are non-refundable once made, except where required by applicable consumer protection law.</p>
      <p style={styles.legalText}>If you experience a technical issue that prevents access to the service, please contact us at hello@parlissimo.live and we will resolve it or offer a fair remedy at our discretion.</p>

      <h2 style={styles.legalH2}>5. AI Practice — Acceptable Use</h2>
      <p style={styles.legalText}>The AI conversation feature is provided solely for Italian language practice related to the lesson content. You agree not to use the AI chat to: request content unrelated to the lesson; attempt to circumvent content restrictions; generate harmful, offensive, or illegal content; probe for vulnerabilities or attempt prompt injection attacks.</p>
      <p style={styles.legalText}>Misuse of the AI feature may result in immediate suspension of your account without refund.</p>

      <h2 style={styles.legalH2}>6. Daily Usage Limits</h2>
      <p style={styles.legalText}>AI conversation practice is limited to 20 messages per lesson per day. This limit resets daily and is designed to ensure fair access and sustainable service operation.</p>

      <h2 style={styles.legalH2}>7. Intellectual Property</h2>
      <p style={styles.legalText}>All content on Parlissimo — including lesson texts, dialogues, grammar explanations, audio, and design — is the intellectual property of Parlissimo and is protected by copyright law. You may not reproduce, distribute, or create derivative works from our content without prior written permission.</p>

      <h2 style={styles.legalH2}>8. Disclaimer of Warranties</h2>
      <p style={styles.legalText}>Parlissimo is provided "as is" without warranty of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that it will meet your specific language learning goals. Language learning outcomes depend on individual effort and practice.</p>

      <h2 style={styles.legalH2}>9. Limitation of Liability</h2>
      <p style={styles.legalText}>To the fullest extent permitted by law, Parlissimo and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability to you shall not exceed the amount you paid us in the 12 months preceding the claim.</p>

      <h2 style={styles.legalH2}>10. Modifications to the Service</h2>
      <p style={styles.legalText}>We reserve the right to modify, suspend, or discontinue any part of the service at any time. We will provide reasonable notice of significant changes. Continued use of the service after changes constitutes acceptance of the modified terms.</p>

      <h2 style={styles.legalH2}>11. Governing Law</h2>
      <p style={styles.legalText}>These Terms shall be governed by and construed in accordance with applicable law. Any disputes shall be resolved through good-faith negotiation. If unresolved, disputes shall be subject to the jurisdiction of the courts of the country in which the operator is based.</p>

      <h2 style={styles.legalH2}>12. Contact</h2>
      <p style={styles.legalText}>For any questions regarding these Terms, contact us at: <strong>hello@parlissimo.live</strong></p>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeLesson, setActiveLesson] = useState(null);
  const [legalPage, setLegalPage] = useState(null);
  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isResetMode, setIsResetMode] = useState(() => {
    const hash = new URLSearchParams(window.location.hash.replace("#", "?"));
    return hash.get("type") === "recovery";
  });
  const isResetModeRef = useRef(false);
  useEffect(() => { isResetModeRef.current = isResetMode; }, [isResetMode]);

  useEffect(() => {
    // If we are in reset mode, don't set up normal auth flow
    if (isResetModeRef.current) {
      setLoadingAuth(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkSubscription(session.user.id);
      else setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsResetMode(true);
        setLoadingAuth(false);
        return;
      }
      if (event === "USER_UPDATED") {
        setIsResetMode(false);
        window.location.hash = "";
        setLoadingAuth(false);
        return;
      }
      if (isResetModeRef.current) return;
      setUser(session?.user ?? null);
      if (session?.user) checkSubscription(session.user.id);
      else { setIsSubscribed(false); setLoadingAuth(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setShowInstallBanner(false);
  }

  async function checkSubscription(userId) {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();
    setIsSubscribed(!!data);
    setLoadingAuth(false);
  }

  async function handleManageSubscription() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch("/api/customer-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setIsSubscribed(false);
    setActiveLesson(null);
  }

  function handleLessonSelect(lesson) {
    if (!lesson.free && !isSubscribed) {
      // Scroll to pricing section
      document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setActiveLesson(lesson);
  }

  if (isResetMode) return <ResetPasswordPage onDone={() => { setIsResetMode(false); window.location.hash = ""; }} />;

  if (loadingAuth) return (
    <div style={{...styles.shell, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div style={{color: "#C4622D", fontSize: 14, fontFamily: "sans-serif"}}>Loading...</div>
    </div>
  );

  return (
    <div style={styles.shell}>
      <div style={styles.container}>
        {showInstallBanner && (
          <div style={styles.installBanner}>
            <span style={styles.installBannerText}>📲 Add Parlissimo to your home screen for the best experience!</span>
            <div style={styles.installBannerButtons}>
              <button style={styles.installBtn} onClick={handleInstall}>Install App</button>
              <button style={styles.installDismiss} onClick={() => setShowInstallBanner(false)}>✕</button>
            </div>
          </div>
        )}
        {!installPrompt && (
          <div style={{...styles.iosHint, display: /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone ? "block" : "none"}}>
            📲 On iPhone: tap <strong>Share ↑</strong> then <strong>Add to Home Screen</strong> to install Parlissimo as an app!
          </div>
        )}
        <div style={styles.topBar}>
          <span style={styles.topBarLogo}>Parlissimo</span>
          {user ? (
            <div style={styles.topBarRight}>
              <span style={styles.topBarEmail}>{user.email}</span>
              {isSubscribed && <span style={styles.topBarBadge}>✓ Active</span>}
              {isSubscribed && <button style={styles.topBarBtn} onClick={handleManageSubscription}>Manage</button>}
              <button style={styles.topBarBtn} onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <button style={styles.topBarBtn} onClick={() => setShowAuth(true)}>Log in</button>
          )}
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={() => setShowAuth(false)} />}
        {activeLesson
          ? <LessonView lesson={activeLesson} onBack={() => setActiveLesson(null)} isSubscribed={isSubscribed} />
          : <Home onSelect={handleLessonSelect} user={user} isSubscribed={isSubscribed} onAuthClick={() => setShowAuth(true)} onLegal={setLegalPage} />}
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

  pricingDivider: { color: C.textMuted, fontSize: 12, fontStyle: "italic" },
  pricingButtons: {
    display: "flex", flexDirection: "column", gap: 10, marginBottom: 16,
  },
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
  dialogueText: { fontSize: 15, color: C.brown, lineHeight: 1.5, marginBottom: 2 },
  dialogueTranslation: { fontSize: 12, color: C.textMuted, fontStyle: "italic" },
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
  installBanner: {
    background: C.brown, color: C.cream, padding: "12px 16px",
    borderRadius: 6, marginBottom: 12,
    display: "flex", flexDirection: "column", gap: 8,
  },
  installBannerText: { fontSize: 13, lineHeight: 1.4, fontFamily: "sans-serif" },
  installBannerButtons: { display: "flex", gap: 8, alignItems: "center" },
  installBtn: {
    background: C.terracotta, color: C.white, border: "none",
    borderRadius: 3, padding: "7px 16px", fontSize: 12, cursor: "pointer",
    fontFamily: "sans-serif", fontWeight: 600,
  },
  installDismiss: {
    background: "none", border: "none", color: C.sand,
    fontSize: 16, cursor: "pointer", padding: "4px 8px",
  },
  iosHint: {
    background: C.sand, color: C.brownMid, padding: "10px 14px",
    borderRadius: 6, marginBottom: 12, fontSize: 12,
    fontFamily: "sans-serif", lineHeight: 1.5, display: "none",
  },
  topBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 24,
  },
  topBarLogo: { fontSize: 18, fontWeight: 700, color: C.terracotta, letterSpacing: "-0.01em" },
  topBarRight: { display: "flex", alignItems: "center", gap: 10 },
  topBarEmail: { fontSize: 11, color: C.textMuted, fontFamily: "sans-serif" },
  topBarBadge: {
    fontSize: 10, background: "#E8F5E9", color: "#2E7D32", padding: "2px 8px",
    borderRadius: 20, fontFamily: "sans-serif",
  },
  topBarBtn: {
    background: "none", border: `1px solid ${C.border}`, borderRadius: 3,
    padding: "6px 14px", fontSize: 11, cursor: "pointer", color: C.brownMid,
    fontFamily: "sans-serif", letterSpacing: "0.06em",
  },
  modalOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 100,
  },
  modal: {
    background: C.white, borderRadius: 8, padding: 32, width: "90%", maxWidth: 380,
    position: "relative",
  },
  modalClose: {
    position: "absolute", top: 12, right: 16, background: "none", border: "none",
    fontSize: 22, cursor: "pointer", color: C.textMuted,
  },
  modalTitle: { fontSize: 22, fontWeight: 700, color: C.brown, marginBottom: 20 },
  authInput: {
    width: "100%", padding: "11px 14px", border: `1px solid ${C.border}`,
    borderRadius: 3, fontSize: 14, marginBottom: 12, boxSizing: "border-box",
    fontFamily: "'Palatino Linotype', Georgia, serif", color: C.brown,
    background: C.cream, outline: "none",
  },
  authMessage: { fontSize: 12, color: C.terracotta, marginBottom: 12, fontFamily: "sans-serif" },
  authSwitch: { marginTop: 16, fontSize: 12, color: C.textMuted, textAlign: "center", fontFamily: "sans-serif" },
  authLink: { color: C.terracotta, cursor: "pointer", textDecoration: "underline" },
  legalWrap: { padding: "24px 0 60px" },
  legalTitle: { fontSize: 28, fontWeight: 700, color: C.brown, marginBottom: 4 },
  legalDate: { fontSize: 12, color: C.textMuted, fontFamily: "sans-serif", marginBottom: 28, fontStyle: "italic" },
  legalH2: { fontSize: 16, fontWeight: 600, color: C.brown, marginTop: 28, marginBottom: 8 },
  legalText: { fontSize: 13, color: C.brownMid, lineHeight: 1.7, marginBottom: 10, fontFamily: "sans-serif" },
  footer: {
    textAlign: "center", padding: "32px 0 16px",
    borderTop: `1px solid ${C.border}`, marginTop: 32,
    display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
    flexWrap: "wrap",
  },
  footerLink: {
    fontSize: 11, color: C.textMuted, cursor: "pointer", fontFamily: "sans-serif",
    textDecoration: "underline", letterSpacing: "0.04em",
  },
  footerDot: { fontSize: 11, color: C.border },
  footerText: { fontSize: 11, color: C.textMuted, fontFamily: "sans-serif" },
  chatSend: {
    border: "none", background: C.terracotta, color: C.white,
    width: 52, fontSize: 20, cursor: "pointer",
  },
};
