import { useState, useEffect, useRef, createContext, useContext, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ── i18n ──────────────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", cc: "EN", flag: "us", name: "English" },
  { code: "fr", cc: "FR", flag: "🇫🇷", name: "Français" },
  { code: "es", cc: "ES", flag: "🇪🇸", name: "Español" },
  { code: "pt", cc: "PT", flag: "🇧🇷", name: "Português" },
  { code: "de", cc: "DE", flag: "🇩🇪", name: "Deutsch" },
];

// ── Lesson imports ───────────────────────────────────────────────────────────
import { LESSONS as LESSONS_EN } from "./lessons/en.js";
import { LESSONS as LESSONS_ES } from "./lessons/es.js";
import { LESSONS as LESSONS_FR } from "./lessons/fr.js";
import { LESSONS as LESSONS_PT } from "./lessons/pt.js";
import { LESSONS as LESSONS_DE } from "./lessons/de.js";

function getLessons(lang) {
  switch (lang) {
    case "es": return LESSONS_ES;
    case "fr": return LESSONS_FR;
    case "pt": return LESSONS_PT;
    case "de": return LESSONS_DE;
    default:   return LESSONS_EN;
  }
}

const T = {
  en: {
    heroTag: "Crash Course · Learn Fast · Only What You Need",
    heroSub: "Situational Italian in minutes — real conversations, essential grammar, nothing extra.",
    module1: "Module 1 — Travel · Viaggiare",
    module2: "Module 2 — Everyday Life · La Vita Quotidiana",
    module3: "Module 3 — Deeper Conversations · Conversazioni Più Profonde",
    unlockTitle: "Unlock the Full Course",
    unlockText: "All 45 lessons, AI conversation practice, and grammar flashcards.",
    monthly: "Monthly — $3",
    yearly: "Yearly — $30",
    lifetime: "Lifetime — $49",
    save: "Save 17%",
    bestValue: "Best Value",
    perMonth: "/month",
    perYear: "/year",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    logIn: "Log in",
    logOut: "Log out",
    manage: "Manage",
    active: "✓ Active",
    subscribe: "Subscribe",
    free: "Free",
    allLessons: "← All Lessons",
    lesson: "Lesson",
    words: "Words",
    dialogue: "Dialogue",
    grammar: "Grammar",
    aiPractice: "AI Practice",
    listenAll: "Listen All",
    listen: "Listen",
    tapForExamples: "Tap to see examples",
    nextDialogue: "Next: Dialogue",
    nextGrammar: "Next: Grammar",
    nextAI: "Next: AI Practice",
    aiHeader: "AI Practice",
    aiWelcome: (title, limit) => `Ciao! Ready to practise "${title}"? Let's go! 😊 (${limit} messages available today)`,
    aiLimitReached: "You have reached your 20 message daily limit for this lesson. Come back tomorrow to keep practising! 🇮🇹",
    aiSubscribePrompt: "AI conversation practice is unlocked with a subscription. Subscribe from $3/month to practise live with your AI Italian tutor! 🇮🇹",
    aiPlaceholder: "Type in Italian…",
    aiError: "Connection error. Please try again!",
    loginTitle: "Welcome back",
    signupTitle: "Create account",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    loginBtn: "Log in",
    signupBtn: "Sign up",
    noAccount: "No account?",
    signUpFree: "Sign up free",
    haveAccount: "Have an account?",
    forgotPassword: "Forgot password?",
    sendResetLink: "Send reset link",
    resetSent: "✓ Reset link sent — check your email if it is associated with a Parlissimo account.",
    newPassword: "Create new password",
    newPasswordPlaceholder: "New password",
    confirmPasswordPlaceholder: "Confirm new password",
    updatePassword: "Update password",
    passwordUpdated: "✓ Password updated!",
    goToParlissimo: "Go to Parlissimo",
    passwordShort: "Password must be at least 6 characters.",
    passwordMismatch: "Passwords do not match.",
    enterEmailFirst: "Enter your email above first.",
    loading: "Loading...",
    installBannerText: "📲 Add Parlissimo to your home screen for the best experience!",
    installApp: "Install App",
    iosHint: "📲 On iPhone: tap Share ↑ then Add to Home Screen to install Parlissimo as an app!",
    or: "or",
    checkoutError: "Something went wrong. Please try again.",
    copyright: "© 2026 Parlissimo",
    translating: "Translating lesson…",
  },
  fr: {
    heroTag: "Cours Intensif · Apprenez Vite · L'Essentiel Seulement",
    heroSub: "L'italien situationnel en quelques minutes — vraies conversations, grammaire essentielle, rien de superflu.",
    module1: "Module 1 — Voyages · Viaggiare",
    module2: "Module 2 — Vie Quotidienne · La Vita Quotidiana",
    module3: "Module 3 — Conversations Approfondies · Conversazioni Più Profonde",
    unlockTitle: "Accéder au Cours Complet",
    unlockText: "45 leçons, entraînement à la conversation avec l'IA et cartes de grammaire.",
    monthly: "Mensuel — 3 $",
    yearly: "Annuel — 30 $",
    lifetime: "À vie — 49 $",
    save: "Économisez 17 %",
    bestValue: "Meilleur Prix",
    perMonth: "/mois",
    perYear: "/an",
    privacy: "Politique de Confidentialité",
    terms: "Conditions d'Utilisation",
    logIn: "Connexion",
    logOut: "Déconnexion",
    manage: "Gérer",
    active: "✓ Actif",
    subscribe: "S'abonner",
    free: "Gratuit",
    allLessons: "← Toutes les Leçons",
    lesson: "Leçon",
    words: "Mots",
    dialogue: "Dialogue",
    grammar: "Grammaire",
    aiPractice: "Pratique IA",
    listenAll: "Tout Écouter",
    listen: "Écouter",
    tapForExamples: "Appuyez pour voir les exemples",
    nextDialogue: "Suivant : Dialogue",
    nextGrammar: "Suivant : Grammaire",
    nextAI: "Suivant : Pratique IA",
    aiHeader: "Pratique IA",
    aiWelcome: (title, limit) => `Ciao ! Prêt(e) à pratiquer "${title}" ? Allons-y ! 😊 (${limit} messages disponibles aujourd'hui)`,
    aiLimitReached: "Vous avez atteint la limite de 20 messages quotidiens pour cette leçon. Revenez demain ! 🇮🇹",
    aiSubscribePrompt: "La pratique conversationnelle IA est débloquée avec un abonnement. Abonnez-vous dès 3 $/mois ! 🇮🇹",
    aiPlaceholder: "Écrivez en italien…",
    aiError: "Erreur de connexion. Veuillez réessayer !",
    loginTitle: "Bon retour",
    signupTitle: "Créer un compte",
    emailPlaceholder: "E-mail",
    passwordPlaceholder: "Mot de passe",
    loginBtn: "Se connecter",
    signupBtn: "S'inscrire",
    noAccount: "Pas de compte ?",
    signUpFree: "Inscription gratuite",
    haveAccount: "Déjà un compte ?",
    forgotPassword: "Mot de passe oublié ?",
    sendResetLink: "Envoyer le lien",
    resetSent: "✓ Lien envoyé — vérifiez votre e-mail.",
    newPassword: "Créer un nouveau mot de passe",
    newPasswordPlaceholder: "Nouveau mot de passe",
    confirmPasswordPlaceholder: "Confirmer le mot de passe",
    updatePassword: "Mettre à jour",
    passwordUpdated: "✓ Mot de passe mis à jour !",
    goToParlissimo: "Aller sur Parlissimo",
    passwordShort: "Le mot de passe doit comporter au moins 6 caractères.",
    passwordMismatch: "Les mots de passe ne correspondent pas.",
    enterEmailFirst: "Entrez d'abord votre e-mail ci-dessus.",
    loading: "Chargement…",
    installBannerText: "📲 Ajoutez Parlissimo à votre écran d'accueil pour la meilleure expérience !",
    installApp: "Installer",
    iosHint: "📲 Sur iPhone : appuyez sur Partager ↑ puis Ajouter à l'écran d'accueil pour installer Parlissimo !",
    or: "ou",
    checkoutError: "Une erreur s'est produite. Veuillez réessayer.",
    copyright: "© 2026 Parlissimo",
    translating: "Traduction de la leçon en cours…",
  },
  es: {
    heroTag: "Curso Intensivo · Aprende Rápido · Solo lo Esencial",
    heroSub: "Italiano situacional en minutos — conversaciones reales, gramática esencial, nada más.",
    module1: "Módulo 1 — Viajes · Viaggiare",
    module2: "Módulo 2 — Vida Cotidiana · La Vita Quotidiana",
    module3: "Módulo 3 — Conversaciones Profundas · Conversazioni Più Profonde",
    unlockTitle: "Desbloquear el Curso Completo",
    unlockText: "45 lecciones, práctica de conversación con IA y tarjetas de gramática.",
    monthly: "Mensual — $3",
    yearly: "Anual — $30",
    lifetime: "De por vida — $49",
    save: "Ahorra 17 %",
    bestValue: "Mejor Precio",
    perMonth: "/mes",
    perYear: "/año",
    privacy: "Política de Privacidad",
    terms: "Términos de Servicio",
    logIn: "Iniciar sesión",
    logOut: "Cerrar sesión",
    manage: "Gestionar",
    active: "✓ Activo",
    subscribe: "Suscribirse",
    free: "Gratis",
    allLessons: "← Todas las Lecciones",
    lesson: "Lección",
    words: "Palabras",
    dialogue: "Diálogo",
    grammar: "Gramática",
    aiPractice: "Práctica IA",
    listenAll: "Escuchar Todo",
    listen: "Escuchar",
    tapForExamples: "Toca para ver ejemplos",
    nextDialogue: "Siguiente: Diálogo",
    nextGrammar: "Siguiente: Gramática",
    nextAI: "Siguiente: Práctica IA",
    aiHeader: "Práctica IA",
    aiWelcome: (title, limit) => `¡Ciao! ¿Listo/a para practicar "${title}"? ¡Vamos! 😊 (${limit} mensajes disponibles hoy)`,
    aiLimitReached: "Has alcanzado el límite de 20 mensajes diarios. ¡Vuelve mañana! 🇮🇹",
    aiSubscribePrompt: "La práctica conversacional con IA se desbloquea con una suscripción. ¡Suscríbete desde $3/mes! 🇮🇹",
    aiPlaceholder: "Escribe en italiano…",
    aiError: "Error de conexión. ¡Inténtalo de nuevo!",
    loginTitle: "Bienvenido/a de nuevo",
    signupTitle: "Crear cuenta",
    emailPlaceholder: "Correo electrónico",
    passwordPlaceholder: "Contraseña",
    loginBtn: "Iniciar sesión",
    signupBtn: "Registrarse",
    noAccount: "¿Sin cuenta?",
    signUpFree: "Regístrate gratis",
    haveAccount: "¿Ya tienes cuenta?",
    forgotPassword: "¿Olvidaste tu contraseña?",
    sendResetLink: "Enviar enlace",
    resetSent: "✓ Enlace enviado — revisa tu correo.",
    newPassword: "Crear nueva contraseña",
    newPasswordPlaceholder: "Nueva contraseña",
    confirmPasswordPlaceholder: "Confirmar contraseña",
    updatePassword: "Actualizar",
    passwordUpdated: "✓ ¡Contraseña actualizada!",
    goToParlissimo: "Ir a Parlissimo",
    passwordShort: "La contraseña debe tener al menos 6 caracteres.",
    passwordMismatch: "Las contraseñas no coinciden.",
    enterEmailFirst: "Introduce primero tu correo arriba.",
    loading: "Cargando…",
    installBannerText: "📲 ¡Añade Parlissimo a tu pantalla de inicio para la mejor experiencia!",
    installApp: "Instalar",
    iosHint: "📲 En iPhone: toca Compartir ↑ y luego Añadir a pantalla de inicio.",
    or: "o",
    checkoutError: "Algo salió mal. Inténtalo de nuevo.",
    copyright: "© 2026 Parlissimo",
    translating: "Traduciendo la lección…",
  },
  pt: {
    heroTag: "Curso Intensivo · Aprenda Rápido · Só o Essencial",
    heroSub: "Italiano situacional em minutos — conversas reais, gramática essencial, nada a mais.",
    module1: "Módulo 1 — Viagens · Viaggiare",
    module2: "Módulo 2 — Vida Cotidiana · La Vita Quotidiana",
    module3: "Módulo 3 — Conversas Aprofundadas · Conversazioni Più Profonde",
    unlockTitle: "Desbloquear o Curso Completo",
    unlockText: "45 lições, prática de conversação com IA e cartões de gramática.",
    monthly: "Mensal — $3",
    yearly: "Anual — $30",
    lifetime: "Vitalício — $49",
    save: "Economize 17%",
    bestValue: "Melhor Valor",
    perMonth: "/mês",
    perYear: "/ano",
    privacy: "Política de Privacidade",
    terms: "Termos de Serviço",
    logIn: "Entrar",
    logOut: "Sair",
    manage: "Gerenciar",
    active: "✓ Ativo",
    subscribe: "Assinar",
    free: "Grátis",
    allLessons: "← Todas as Lições",
    lesson: "Lição",
    words: "Palavras",
    dialogue: "Diálogo",
    grammar: "Gramática",
    aiPractice: "Prática IA",
    listenAll: "Ouvir Tudo",
    listen: "Ouvir",
    tapForExamples: "Toque para ver exemplos",
    nextDialogue: "Próximo: Diálogo",
    nextGrammar: "Próximo: Gramática",
    nextAI: "Próximo: Prática IA",
    aiHeader: "Prática IA",
    aiWelcome: (title, limit) => `Ciao! Pronto/a para praticar "${title}"? Vamos lá! 😊 (${limit} mensagens disponíveis hoje)`,
    aiLimitReached: "Você atingiu o limite de 20 mensagens diárias desta lição. Volte amanhã! 🇮🇹",
    aiSubscribePrompt: "A prática conversacional com IA é desbloqueada com uma assinatura. Assine a partir de $3/mês! 🇮🇹",
    aiPlaceholder: "Escreva em italiano…",
    aiError: "Erro de conexão. Tente novamente!",
    loginTitle: "Bem-vindo(a) de volta",
    signupTitle: "Criar conta",
    emailPlaceholder: "E-mail",
    passwordPlaceholder: "Senha",
    loginBtn: "Entrar",
    signupBtn: "Cadastrar",
    noAccount: "Sem conta?",
    signUpFree: "Cadastre-se grátis",
    haveAccount: "Já tem conta?",
    forgotPassword: "Esqueceu a senha?",
    sendResetLink: "Enviar link",
    resetSent: "✓ Link enviado — verifique seu e-mail.",
    newPassword: "Criar nova senha",
    newPasswordPlaceholder: "Nova senha",
    confirmPasswordPlaceholder: "Confirmar senha",
    updatePassword: "Atualizar",
    passwordUpdated: "✓ Senha atualizada!",
    goToParlissimo: "Ir para o Parlissimo",
    passwordShort: "A senha deve ter pelo menos 6 caracteres.",
    passwordMismatch: "As senhas não coincidem.",
    enterEmailFirst: "Digite seu e-mail acima primeiro.",
    loading: "Carregando…",
    installBannerText: "📲 Adicione o Parlissimo à sua tela inicial para a melhor experiência!",
    installApp: "Instalar",
    iosHint: "📲 No iPhone: toque em Compartilhar ↑ e depois em Adicionar à Tela de Início.",
    or: "ou",
    checkoutError: "Algo deu errado. Tente novamente.",
    copyright: "© 2026 Parlissimo",
    translating: "Traduzindo a lição…",
  },
  de: {
    heroTag: "Intensivkurs · Schnell Lernen · Nur das Wesentliche",
    heroSub: "Situatives Italienisch in Minuten — echte Gespräche, wesentliche Grammatik, nichts Überflüssiges.",
    module1: "Modul 1 — Reisen · Viaggiare",
    module2: "Modul 2 — Alltag · La Vita Quotidiana",
    module3: "Modul 3 — Tiefere Gespräche · Conversazioni Più Profonde",
    unlockTitle: "Den Vollständigen Kurs Freischalten",
    unlockText: "Alle 45 Lektionen, KI-Konversationsübungen und Grammatikkarten.",
    monthly: "Monatlich — 3 $",
    yearly: "Jährlich — 30 $",
    lifetime: "Lebenslang — 49 $",
    save: "17 % sparen",
    bestValue: "Bestes Angebot",
    perMonth: "/Monat",
    perYear: "/Jahr",
    privacy: "Datenschutzrichtlinie",
    terms: "Nutzungsbedingungen",
    logIn: "Anmelden",
    logOut: "Abmelden",
    manage: "Verwalten",
    active: "✓ Aktiv",
    subscribe: "Abonnieren",
    free: "Kostenlos",
    allLessons: "← Alle Lektionen",
    lesson: "Lektion",
    words: "Wörter",
    dialogue: "Dialog",
    grammar: "Grammatik",
    aiPractice: "KI-Übung",
    listenAll: "Alles Anhören",
    listen: "Anhören",
    tapForExamples: "Tippen für Beispiele",
    nextDialogue: "Weiter: Dialog",
    nextGrammar: "Weiter: Grammatik",
    nextAI: "Weiter: KI-Übung",
    aiHeader: "KI-Übung",
    aiWelcome: (title, limit) => `Ciao! Bereit, „${title}" zu üben? Los geht's! 😊 (${limit} Nachrichten heute verfügbar)`,
    aiLimitReached: "Sie haben das Tageslimit von 20 Nachrichten für diese Lektion erreicht. Kommen Sie morgen wieder! 🇮🇹",
    aiSubscribePrompt: "KI-Konversationsübungen werden mit einem Abonnement freigeschaltet. Ab 3 $/Monat! 🇮🇹",
    aiPlaceholder: "Auf Italienisch schreiben…",
    aiError: "Verbindungsfehler. Bitte erneut versuchen!",
    loginTitle: "Willkommen zurück",
    signupTitle: "Konto erstellen",
    emailPlaceholder: "E-Mail",
    passwordPlaceholder: "Passwort",
    loginBtn: "Anmelden",
    signupBtn: "Registrieren",
    noAccount: "Kein Konto?",
    signUpFree: "Kostenlos registrieren",
    haveAccount: "Haben Sie ein Konto?",
    forgotPassword: "Passwort vergessen?",
    sendResetLink: "Link senden",
    resetSent: "✓ Link gesendet — prüfen Sie Ihre E-Mail.",
    newPassword: "Neues Passwort erstellen",
    newPasswordPlaceholder: "Neues Passwort",
    confirmPasswordPlaceholder: "Passwort bestätigen",
    updatePassword: "Aktualisieren",
    passwordUpdated: "✓ Passwort aktualisiert!",
    goToParlissimo: "Zu Parlissimo",
    passwordShort: "Das Passwort muss mindestens 6 Zeichen lang sein.",
    passwordMismatch: "Die Passwörter stimmen nicht überein.",
    enterEmailFirst: "Geben Sie zuerst Ihre E-Mail-Adresse ein.",
    loading: "Wird geladen…",
    installBannerText: "📲 Fügen Sie Parlissimo Ihrem Startbildschirm hinzu!",
    installApp: "Installieren",
    iosHint: "📲 Auf iPhone: Tippen Sie auf Teilen ↑ und dann auf Zum Home-Bildschirm.",
    or: "oder",
    checkoutError: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
    copyright: "© 2026 Parlissimo",
    translating: "Lektion wird übersetzt…",
  },
};

const LangContext = createContext({ lang: "en", t: T.en });
const useLang = () => useContext(LangContext);

// ── Text-to-Speech ────────────────────────────────────────────────────────────

// ── Text-to-Speech ────────────────────────────────────────────────────────────
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6" /></svg>
);
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
);

// ── Language Selector ─────────────────────────────────────────────────────────
function LangSelector({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const ccStyle = {
    fontSize: 10, fontWeight: 700, fontFamily: "sans-serif",
    background: C.terracotta, color: C.white,
    padding: "2px 5px", borderRadius: 3, letterSpacing: "0.04em",
    lineHeight: 1.4,
  };
  return (
    <div style={{ position: "relative" }}>
      <button style={styles.langBtn} onClick={() => setOpen(o => !o)} title="Change language">
        <span style={ccStyle}>{current.cc}</span>
        <span style={{ fontSize: 11, fontFamily: "sans-serif", letterSpacing: "0.04em", color: C.brownMid }}>{current.name}</span>
        <span style={{ fontSize: 9, color: C.textMuted }}>▾</span>
      </button>
      {open && (
        <div style={styles.langDropdown}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              style={{
                ...styles.langOption,
                background: l.code === lang ? C.sand : "transparent",
                fontWeight: l.code === lang ? 700 : 400,
              }}
              onClick={() => { setLang(l.code); setOpen(false); }}
            >
              <span style={ccStyle}>{l.cc}</span>
              <span style={{ fontSize: 12, fontFamily: "sans-serif" }}>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AI Chat Component ─────────────────────────────────────────────────────────
function AiChat({ lesson }) {
  const { t } = useLang();
  const DAILY_LIMIT = 20;
  const storageKey = `msgCount_${lesson.id}_${new Date().toDateString()}`;
  const [messages, setMessages] = useState([
    { role: "assistant", content: t.aiWelcome(lesson.title, DAILY_LIMIT) }
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
      setMessages(prev => [...prev, { role: "assistant", content: t.aiLimitReached }]);
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
      setMessages(prev => [...prev, { role: "assistant", content: t.aiSubscribePrompt }]);
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
      const reply = data.content?.find(b => b.type === "text")?.text || t.aiError;
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: t.aiError }]);
    }
    setLoading(false);
  }

  return (
    <div style={styles.chatWrap}>
      <div style={styles.chatHeader}>
        <span style={styles.chatHeaderDot} />
        {t.aiHeader} — {lesson.title}
      </div>
      <div style={styles.chatMessages}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={m.role === "user" ? styles.bubbleUser : styles.bubbleAI}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
            <div style={styles.bubbleAI}><span style={styles.typingDots}>●&nbsp;●&nbsp;●</span></div>
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
          placeholder={t.aiPlaceholder}
        />
        <button style={styles.chatSend} onClick={sendMessage} disabled={loading}>
          {loading ? "…" : "→"}
        </button>
      </div>
    </div>
  );
}

// ── Lesson View ───────────────────────────────────────────────────────────────
function LessonView({ lessonId, lang, onBack }) {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [kwIndex, setKwIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const lesson = getLessons(lang).find(l => l.id === lessonId);
  if (!lesson) return <div style={{ padding: 32 }}>Lesson not found</div>;

  const steps = [t.words, t.dialogue, t.grammar, t.aiPractice];

  return (
    <div style={styles.lessonWrap}>
      <button style={styles.backBtn} onClick={onBack}>{t.allLessons}</button>
      <div style={styles.lessonHeader}>
        <span style={styles.lessonNum}>{t.lesson} {lesson.id}</span>
        <h2 style={styles.lessonTitle}>{lesson.title}</h2>
        <p style={styles.lessonSubtitle}>{lesson.subtitle}</p>
      </div>
      <div style={styles.tabs}>
        {steps.map((s, i) => (
          <button key={i} style={i === step ? styles.tabActive : styles.tab}
            onClick={() => { setStep(i); setKwIndex(0); setFlipped(false); }}>
            {s}
          </button>
        ))}
      </div>

      {/* KEYWORDS */}
      {step === 0 && (
        <div style={styles.card}>
          <div style={styles.kwCount}>{kwIndex + 1} / {lesson.keywords.length}</div>
          <div style={styles.kwItalian}>{lesson.keywords[kwIndex].italian}</div>
          <div style={styles.kwEnglish}>{lesson.keywords[kwIndex].english}</div>
          <button style={styles.speakBtn} onClick={() => speak(lesson.keywords[kwIndex].italian)}>
            <PlayIcon /> {t.listen}
          </button>
          <div style={styles.kwNav}>
            <button style={styles.navBtn} onClick={() => setKwIndex(i => Math.max(0, i - 1))} disabled={kwIndex === 0}>‹</button>
            <button style={styles.navBtn} onClick={() => setKwIndex(i => Math.min(lesson.keywords.length - 1, i + 1))} disabled={kwIndex === lesson.keywords.length - 1}>›</button>
          </div>
          {kwIndex === lesson.keywords.length - 1 && (
            <button style={styles.nextStepBtn} onClick={() => setStep(1)}>
              {t.nextDialogue} <ChevronRight />
            </button>
          )}
        </div>
      )}

      {/* DIALOGUE */}
      {step === 1 && (
        <div style={styles.card}>
          <h3 style={styles.sectionLabel}>{t.dialogue}</h3>
          <div style={styles.dialogueWrap}>
            {lesson.dialogue.map((line, i) => (
              <div key={i} style={styles.dialogueLine}>
                <span style={styles.dialogueSpeaker}>{line.speaker}</span>
                <div style={{ flex: 1 }}>
                  <div style={styles.dialogueText}>{line.line}</div>
                  {line.translation && <div style={styles.dialogueTranslation}>{line.translation}</div>}
                </div>
                <button style={styles.speakSmall} onClick={() => speak(line.line)} title={t.listen}><PlayIcon /></button>
              </div>
            ))}
          </div>
          <button style={styles.speakBtn} onClick={() => lesson.dialogue.forEach((l, i) => setTimeout(() => speak(l.line), i * 2200))}>
            <PlayIcon /> {t.listenAll}
          </button>
          <button style={styles.nextStepBtn} onClick={() => setStep(2)}>
            {t.nextGrammar} <ChevronRight />
          </button>
        </div>
      )}

      {/* GRAMMAR */}
      {step === 2 && (
        <div style={styles.card}>
          <h3 style={styles.sectionLabel}>{t.grammar}</h3>
          <div style={{ ...styles.flashcard, ...(flipped ? styles.flashcardFlipped : {}) }} onClick={() => setFlipped(f => !f)}>
            {!flipped ? (
              <div>
                <div style={styles.flashFront}>{lesson.grammar.title}</div>
                <div style={styles.flashHint}>{t.tapForExamples}</div>
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
            {t.nextAI} <ChevronRight />
          </button>
        </div>
      )}

      {/* AI CHAT */}
      {step === 3 && <AiChat lesson={lesson} />}
    </div>
  );
}

// ── Checkout ──────────────────────────────────────────────────────────────────
async function handleCheckout(plan, errorMsg) {
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
  } catch {
    alert(errorMsg);
  }
}

// ── Home ──────────────────────────────────────────────────────────────────────
function Home({ onSelect, user, isSubscribed, onAuthClick, onLegal }) {
  const { lang, t } = useLang();
  const lessons = getLessons(lang);
  return (
    <div style={styles.home}>
      <div style={styles.hero}>
        <div style={styles.heroTag}>{t.heroTag}</div>
        <h1 style={styles.heroTitle}>Parli<span style={styles.heroAccent}>ssimo</span></h1>
        <p style={styles.heroSub}>{t.heroSub}</p>
      </div>

      <div style={styles.lessonList}>
        <h3 style={styles.listHeading}>{t.module1}</h3>
        {lessons.filter(l => l.id <= 20).map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} onSelect={onSelect} isSubscribed={isSubscribed} t={t} />
        ))}
        <h3 style={{ ...styles.listHeading, marginTop: 28 }}>{t.module2}</h3>
        {lessons.filter(l => l.id >= 21 && l.id <= 40).map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} onSelect={onSelect} isSubscribed={isSubscribed} t={t} />
        ))}
        <h3 style={{ ...styles.listHeading, marginTop: 28 }}>{t.module3}</h3>
        {lessons.filter(l => l.id >= 41).map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} onSelect={onSelect} isSubscribed={isSubscribed} t={t} />
        ))}
      </div>

      <div id="pricing-section" style={styles.pricingBox}>
        <div style={styles.pricingTitle}>{t.unlockTitle}</div>
        <p style={styles.pricingText}>{t.unlockText}</p>
        <div style={styles.pricingOptions}>
          <div style={styles.pricingOpt}>
            <span style={styles.pricingPrice}>$3</span>
            <span style={styles.pricingPer}>{t.perMonth}</span>
          </div>
          <div style={styles.pricingDivider}>{t.or}</div>
          <div style={styles.pricingOpt}>
            <span style={styles.pricingPrice}>$30</span>
            <span style={styles.pricingPer}>{t.perYear}</span>
            <span style={styles.pricingSave}>{t.save}</span>
          </div>
          <div style={styles.pricingDivider}>{t.or}</div>
          <div style={styles.pricingOpt}>
            <span style={styles.pricingPrice}>$49</span>
            <span style={styles.pricingPer}>lifetime</span>
            <span style={styles.pricingSaveBest}>{t.bestValue}</span>
          </div>
        </div>
        <div style={styles.pricingButtons}>
          <button style={styles.ctaBtn} onClick={() => handleCheckout("monthly", t.checkoutError)}>{t.monthly}</button>
          <button style={styles.ctaBtn} onClick={() => handleCheckout("yearly", t.checkoutError)}>{t.yearly}</button>
          <button style={{ ...styles.ctaBtn, background: "#B8860B" }} onClick={() => handleCheckout("lifetime", t.checkoutError)}>{t.lifetime}</button>
        </div>
      </div>

      <div style={styles.footer}>
        <span style={styles.footerLink} onClick={() => onLegal("privacy")}>{t.privacy}</span>
        <span style={styles.footerDot}>·</span>
        <span style={styles.footerLink} onClick={() => onLegal("terms")}>{t.terms}</span>
        <span style={styles.footerDot}>·</span>
        <span style={styles.footerText}>{t.copyright}</span>
      </div>
    </div>
  );
}

function LessonCard({ lesson, onSelect, isSubscribed, t }) {
  return (
    <div style={styles.lessonCard} onClick={() => onSelect(lesson)}>
      <div style={styles.lessonCardLeft}>
        <span style={styles.lessonCardNum}>{lesson.id < 10 ? `0${lesson.id}` : lesson.id}</span>
        <div>
          <div style={styles.lessonCardTitle}>{lesson.title}</div>
          <div style={styles.lessonCardSub}>{lesson.subtitle}</div>
        </div>
      </div>
      <div style={styles.lessonCardRight}>
        {lesson.free
          ? <span style={styles.freeBadge}>{t.free}</span>
          : isSubscribed
            ? <span style={styles.freeBadge}>✓</span>
            : <span style={styles.lockBadge}><LockIcon /> {t.subscribe}</span>}
        <ChevronRight />
      </div>
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, onAuth }) {
  const { t } = useLang();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit() {
    setLoading(true); setMessage("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message); else onAuth();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage("Check your email to confirm your account!");
    }
    setLoading(false);
  }

  async function handleReset() {
    if (!email.trim()) { setMessage(t.enterEmailFirst); return; }
    if (resetSent) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "https://parlissimo.live" });
    if (error) setMessage(error.message); else setResetSent(true);
    setLoading(false);
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <button style={styles.modalClose} onClick={onClose}>×</button>
        <h2 style={styles.modalTitle}>{mode === "login" ? t.loginTitle : t.signupTitle}</h2>
        <input style={styles.authInput} type="email" placeholder={t.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.authInput} type="password" placeholder={t.passwordPlaceholder} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        {message && <div style={styles.authMessage}>{message}</div>}
        <button style={styles.ctaBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : mode === "login" ? t.loginBtn : t.signupBtn}
        </button>
        <div style={styles.authSwitch}>
          {mode === "login" ? (
            <div>
              <div style={{ marginBottom: 8 }}>{t.noAccount} <span style={styles.authLink} onClick={() => setMode("signup")}>{t.signUpFree}</span></div>
              {resetSent
                ? <div style={{ color: "#2E7D32", fontSize: 12 }}>{t.resetSent}</div>
                : <div>{t.forgotPassword} <span style={styles.authLink} onClick={handleReset}>{t.sendResetLink}</span></div>}
            </div>
          ) : (
            <span>{t.haveAccount} <span style={styles.authLink} onClick={() => setMode("login")}>{t.logIn}</span></span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Reset Password Page ───────────────────────────────────────────────────────
function ResetPasswordPage({ onDone }) {
  const { t } = useLang();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  async function handleReset() {
    if (password.length < 6) { setMessage(t.passwordShort); return; }
    if (password !== confirm) { setMessage(t.passwordMismatch); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(error.message);
    else { setDone(true); setTimeout(() => { if (onDone) onDone(); }, 2000); }
    setLoading(false);
  }

  return (
    <div style={styles.shell}>
      <div style={styles.container}>
        <div style={{ paddingTop: 60, maxWidth: 380, margin: "0 auto" }}>
          <h2 style={styles.modalTitle}>{t.newPassword}</h2>
          {done ? (
            <div style={{ color: "#2E7D32", marginBottom: 20, fontFamily: "sans-serif", fontSize: 14 }}>
              {t.passwordUpdated} <a href="https://parlissimo.live" style={{ color: C.terracotta }}>{t.goToParlissimo}</a>
            </div>
          ) : (
            <div>
              <input style={styles.authInput} type="password" placeholder={t.newPasswordPlaceholder} value={password} onChange={e => setPassword(e.target.value)} />
              <input style={styles.authInput} type="password" placeholder={t.confirmPasswordPlaceholder} value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === "Enter" && handleReset()} />
              {message && <div style={styles.authMessage}>{message}</div>}
              <button style={styles.ctaBtn} onClick={handleReset} disabled={loading}>{loading ? "..." : t.updatePassword}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Legal Pages ───────────────────────────────────────────────────────────────
function LegalPage({ type, onClose }) {
  const { t } = useLang();
  return (
    <div style={styles.shell}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={onClose}>← {type === "privacy" ? t.privacy : t.terms}</button>
        <div style={styles.legalWrap}>
          {type === "privacy" ? <PrivacyPolicy /> : <TermsOfService />}
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
      <p style={styles.legalText}><strong>Payment information:</strong> Payments are processed by Stripe. We do not store your credit card details.</p>
      <p style={styles.legalText}><strong>AI conversations:</strong> Messages you send to the AI practice chat are processed by Anthropic's API. We do not permanently store your conversation history.</p>
      <h2 style={styles.legalH2}>2. How We Use Your Information</h2>
      <p style={styles.legalText}>We use your information to provide and maintain the service, process payments and manage your subscription, send transactional emails, and improve our content. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
      <h2 style={styles.legalH2}>3. Contact</h2>
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
      <p style={styles.legalText}>The AI conversation feature is provided solely for Italian language practice related to the lesson content. You agree not to use the AI chat to request content unrelated to the lesson, attempt to circumvent content restrictions, generate harmful or offensive content, or probe for vulnerabilities. Misuse may result in immediate suspension of your account without refund.</p>

      <h2 style={styles.legalH2}>6. Daily Usage Limits</h2>
      <p style={styles.legalText}>AI conversation practice is limited to 20 messages per lesson per day. This limit resets daily and is designed to ensure fair access and sustainable service operation.</p>

      <h2 style={styles.legalH2}>7. Intellectual Property</h2>
      <p style={styles.legalText}>All content on Parlissimo — including lesson texts, dialogues, grammar explanations, audio, and design — is the intellectual property of Parlissimo and is protected by copyright law. You may not reproduce, distribute, or create derivative works from our content without prior written permission.</p>

      <h2 style={styles.legalH2}>8. Disclaimer of Warranties</h2>
      <p style={styles.legalText}>Parlissimo is provided "as is" without warranty of any kind. We do not guarantee that the service will be uninterrupted or error-free, or that it will meet your specific language learning goals. Language learning outcomes depend on individual effort and practice.</p>

      <h2 style={styles.legalH2}>9. Limitation of Liability</h2>
      <p style={styles.legalText}>To the fullest extent permitted by law, Parlissimo and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability to you shall not exceed the amount you paid us in the 12 months preceding the claim.</p>

      <h2 style={styles.legalH2}>10. Modifications and Discontinuation of Service</h2>
      <p style={styles.legalText}>We reserve the right to modify, suspend, or discontinue any part of the service at any time, including discontinuing the service entirely.</p>
      <p style={styles.legalText}>In the event of a full discontinuation of Parlissimo: monthly or annual subscribers will receive at least 30 days notice and will not be charged beyond their current billing period — unused portions of annual subscriptions will be refunded pro-rata. Lifetime access holders will receive at least 30 days notice; as a courtesy we will endeavour to offer a partial refund at our discretion, but by purchasing lifetime access you acknowledge that "lifetime" refers to the lifetime of the service, not the lifetime of the user. All user data will be deleted within 60 days of discontinuation.</p>
      <p style={styles.legalText}>Notice will be sent to your registered email address and posted on the app.</p>

      <h2 style={styles.legalH2}>11. Governing Law</h2>
      <p style={styles.legalText}>These Terms shall be governed by and construed in accordance with applicable law. Any disputes shall be resolved through good-faith negotiation. If unresolved, disputes shall be subject to the jurisdiction of the courts of the country in which the operator is based.</p>

      <h2 style={styles.legalH2}>12. Contact</h2>
      <p style={styles.legalText}>For any questions regarding these Terms, contact us at: <strong>hello@parlissimo.live</strong></p>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("parlissimo_lang") || "en");
  const t = T[lang] || T.en;

  useEffect(() => {
    localStorage.setItem("parlissimo_lang", lang);
  }, [lang]);

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
    if (isResetModeRef.current) { setLoadingAuth(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkSubscription(session.user.id);
      else setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") { setIsResetMode(true); setLoadingAuth(false); return; }
      if (event === "USER_UPDATED") { setIsResetMode(false); window.location.hash = ""; setLoadingAuth(false); return; }
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
    if (outcome === "accepted") setShowInstallBanner(false);
  }

  async function checkSubscription(userId) {
    const { data } = await supabase.from("subscriptions").select("*").eq("user_id", userId).eq("status", "active").single();
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
    } catch { alert(t.checkoutError); }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null); setIsSubscribed(false); setActiveLesson(null);
  }

  function handleLessonSelect(lesson) {
    if (!lesson.free && !isSubscribed) {
      document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setActiveLesson(lesson);
  }

  if (isResetMode) return (
    <LangContext.Provider value={{ lang, t }}>
      <ResetPasswordPage onDone={() => { setIsResetMode(false); window.location.hash = ""; }} />
    </LangContext.Provider>
  );

  if (loadingAuth) return (
    <div style={{ ...styles.shell, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.terracotta, fontSize: 14, fontFamily: "sans-serif" }}>{t.loading}</div>
    </div>
  );

  return (
    <LangContext.Provider value={{ lang, t }}>
      <div style={styles.shell}>
        <div style={styles.container}>
          {showInstallBanner && (
            <div style={styles.installBanner}>
              <span style={styles.installBannerText}>{t.installBannerText}</span>
              <div style={styles.installBannerButtons}>
                <button style={styles.installBtn} onClick={handleInstall}>{t.installApp}</button>
                <button style={styles.installDismiss} onClick={() => setShowInstallBanner(false)}>✕</button>
              </div>
            </div>
          )}
          {!installPrompt && (
            <div style={{ ...styles.iosHint, display: /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone ? "block" : "none" }}>
              {t.iosHint}
            </div>
          )}

          {/* TOP BAR — row 1: logo + language, row 2: account (wraps naturally on mobile) */}
          <div style={styles.topBar}>
            {/* Row 1 */}
            <div style={styles.topBarRow1}>
              <span style={styles.topBarLogo} onClick={() => { setActiveLesson(null); setLegalPage(null); }} role="button">
                Parlissimo
              </span>
              <LangSelector lang={lang} setLang={setLang} />
            </div>
            {/* Row 2 */}
            <div style={styles.topBarRow2}>
              {user ? (
                <>
                  <span style={styles.topBarEmail}>{user.email}</span>
                  {isSubscribed && <span style={styles.topBarBadge}>{t.active}</span>}
                  {isSubscribed && <button style={styles.topBarBtn} onClick={handleManageSubscription}>{t.manage}</button>}
                  <button style={styles.topBarBtn} onClick={handleLogout}>{t.logOut}</button>
                </>
              ) : (
                <button style={styles.topBarBtn} onClick={() => setShowAuth(true)}>{t.logIn}</button>
              )}
            </div>
          </div>

          {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={() => setShowAuth(false)} />}

          {legalPage
            ? <LegalPage type={legalPage} onClose={() => setLegalPage(null)} />
            : activeLesson
              ? <LessonView lessonId={activeLesson.id} lang={lang} onBack={() => setActiveLesson(null)} isSubscribed={isSubscribed} />
              : <Home onSelect={handleLessonSelect} user={user} isSubscribed={isSubscribed} onAuthClick={() => setShowAuth(true)} onLegal={setLegalPage} />
          }
        </div>
      </div>
    </LangContext.Provider>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const C = {
  cream: "#FAF7F2", sand: "#EDE8DF", terracotta: "#C4622D", terracottaLight: "#E8835A",
  brown: "#3D2B1F", brownMid: "#6B4C3B", gold: "#B8860B", white: "#FFFFFF",
  offWhite: "#F5F0E8", border: "#D9D0C4", textMuted: "#9A8A7A",
};

const styles = {
  shell: { minHeight: "100vh", background: C.cream, fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", color: C.brown },
  container: { maxWidth: 560, margin: "0 auto", padding: "0 16px 60px" },
  home: {},
  hero: { textAlign: "center", padding: "48px 16px 32px", borderBottom: `1px solid ${C.border}`, marginBottom: 32 },
  heroTag: { fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.terracotta, marginBottom: 16, fontFamily: "'Gill Sans', 'Optima', sans-serif" },
  heroTitle: { fontSize: 52, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1, color: C.brown },
  heroAccent: { color: C.terracotta },
  heroSub: { fontSize: 15, color: C.brownMid, lineHeight: 1.6, maxWidth: 360, margin: "0 auto", fontStyle: "italic" },
  listHeading: { fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textMuted, marginBottom: 14, fontFamily: "'Gill Sans', 'Optima', sans-serif", fontWeight: 400 },
  lessonList: { marginBottom: 36 },
  lessonCard: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 8, cursor: "pointer" },
  lessonCardLeft: { display: "flex", alignItems: "center", gap: 16 },
  lessonCardNum: { fontSize: 22, color: C.border, fontWeight: 300, minWidth: 32, fontFamily: "'Palatino Linotype', Georgia, serif" },
  lessonCardTitle: { fontSize: 16, fontWeight: 600, color: C.brown, marginBottom: 2 },
  lessonCardSub: { fontSize: 12, color: C.textMuted, fontStyle: "italic" },
  lessonCardRight: { display: "flex", alignItems: "center", gap: 10, color: C.textMuted },
  freeBadge: { fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", background: "#E8F5E9", color: "#2E7D32", padding: "3px 8px", borderRadius: 20, fontFamily: "sans-serif" },
  lockBadge: { fontSize: 11, color: C.textMuted, display: "flex", alignItems: "center", gap: 4, fontFamily: "sans-serif" },
  pricingBox: { background: C.brown, borderRadius: 6, padding: "32px 28px", textAlign: "center", color: C.cream },
  pricingTitle: { fontSize: 20, fontWeight: 600, marginBottom: 8 },
  pricingText: { fontSize: 13, color: C.sand, fontStyle: "italic", marginBottom: 24, lineHeight: 1.5 },
  pricingOptions: { display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 24 },
  pricingOpt: { display: "flex", alignItems: "baseline", gap: 4, flexDirection: "column", alignItems: "center" },
  pricingPrice: { fontSize: 32, fontWeight: 700, color: C.white },
  pricingPer: { fontSize: 12, color: C.sand, fontFamily: "sans-serif" },
  pricingSave: { fontSize: 10, background: C.terracotta, color: C.white, padding: "2px 7px", borderRadius: 10, letterSpacing: "0.06em", fontFamily: "sans-serif" },
  pricingSaveBest: { fontSize: 10, background: C.gold, color: C.white, padding: "2px 7px", borderRadius: 10, letterSpacing: "0.06em", fontFamily: "sans-serif" },
  pricingDivider: { color: C.textMuted, fontSize: 12, fontStyle: "italic" },
  pricingButtons: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  ctaBtn: { background: C.terracotta, color: C.white, border: "none", borderRadius: 3, padding: "13px 36px", fontSize: 14, fontFamily: "'Gill Sans', 'Optima', sans-serif", letterSpacing: "0.08em", cursor: "pointer", fontWeight: 600 },
  lessonWrap: { paddingTop: 24 },
  backBtn: { background: "none", border: "none", color: C.terracotta, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "'Gill Sans', 'Optima', sans-serif", letterSpacing: "0.06em" },
  lessonHeader: { marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.border}` },
  lessonNum: { fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.terracotta, fontFamily: "sans-serif", display: "block", marginBottom: 6 },
  lessonTitle: { fontSize: 32, fontWeight: 700, margin: "0 0 4px", color: C.brown },
  lessonSubtitle: { fontSize: 15, fontStyle: "italic", color: C.brownMid, margin: 0 },
  tabs: { display: "flex", gap: 4, marginBottom: 24, background: C.sand, borderRadius: 4, padding: 4 },
  tab: { flex: 1, padding: "8px 4px", border: "none", background: "none", color: C.textMuted, fontSize: 11, cursor: "pointer", fontFamily: "'Gill Sans', 'Optima', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 3 },
  tabActive: { flex: 1, padding: "8px 4px", border: "none", background: C.white, color: C.terracotta, fontSize: 11, cursor: "pointer", fontFamily: "'Gill Sans', 'Optima', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontWeight: 600 },
  card: { background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: 28 },
  kwCount: { fontSize: 11, color: C.textMuted, letterSpacing: "0.1em", marginBottom: 24, fontFamily: "sans-serif" },
  kwItalian: { fontSize: 36, fontWeight: 700, color: C.brown, marginBottom: 10, letterSpacing: "-0.01em" },
  kwEnglish: { fontSize: 16, color: C.brownMid, fontStyle: "italic", marginBottom: 24 },
  speakBtn: { display: "inline-flex", alignItems: "center", gap: 8, background: C.cream, border: `1px solid ${C.border}`, borderRadius: 3, padding: "9px 18px", cursor: "pointer", fontSize: 12, color: C.brownMid, fontFamily: "'Gill Sans', 'Optima', sans-serif", letterSpacing: "0.06em", marginBottom: 24 },
  kwNav: { display: "flex", gap: 10, marginBottom: 8 },
  navBtn: { width: 42, height: 42, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.cream, cursor: "pointer", fontSize: 20, color: C.brownMid, display: "flex", alignItems: "center", justifyContent: "center" },
  nextStepBtn: { marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, background: C.terracotta, color: C.white, border: "none", borderRadius: 3, padding: "11px 22px", fontSize: 12, cursor: "pointer", fontFamily: "'Gill Sans', 'Optima', sans-serif", letterSpacing: "0.08em" },
  sectionLabel: { fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMuted, fontFamily: "sans-serif", fontWeight: 400, marginBottom: 20 },
  dialogueWrap: { marginBottom: 20 },
  dialogueLine: { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.sand}` },
  dialogueSpeaker: { minWidth: 52, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.terracotta, fontFamily: "sans-serif" },
  dialogueText: { fontSize: 15, color: C.brown, lineHeight: 1.5, marginBottom: 2 },
  dialogueTranslation: { fontSize: 12, color: C.textMuted, fontStyle: "italic" },
  speakSmall: { background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 4, display: "flex", alignItems: "center" },
  flashcard: { background: C.offWhite, border: `1px solid ${C.border}`, borderRadius: 6, padding: 28, cursor: "pointer", minHeight: 140, marginBottom: 20, transition: "background 0.3s", display: "flex", alignItems: "center", justifyContent: "center" },
  flashcardFlipped: { background: C.sand },
  flashFront: { fontSize: 22, fontWeight: 600, color: C.brown, textAlign: "center", marginBottom: 12 },
  flashHint: { fontSize: 11, color: C.textMuted, textAlign: "center", fontStyle: "italic", fontFamily: "sans-serif" },
  grammarRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` },
  grammarIT: { fontSize: 15, fontWeight: 600, color: C.brown },
  grammarEN: { fontSize: 13, color: C.brownMid, fontStyle: "italic" },
  grammarNote: { fontSize: 12, color: C.textMuted, marginTop: 14, lineHeight: 1.6, fontStyle: "italic", fontFamily: "sans-serif" },
  chatWrap: { background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" },
  chatHeader: { background: C.brown, color: C.cream, padding: "14px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 10, fontFamily: "'Gill Sans', 'Optima', sans-serif", letterSpacing: "0.04em" },
  chatHeaderDot: { width: 8, height: 8, borderRadius: "50%", background: C.terracottaLight, display: "inline-block" },
  chatMessages: { padding: 20, minHeight: 260, maxHeight: 340, overflowY: "auto", background: C.offWhite },
  bubbleAI: { background: C.white, border: `1px solid ${C.border}`, borderRadius: "4px 16px 16px 16px", padding: "10px 14px", fontSize: 14, color: C.brown, maxWidth: "82%", lineHeight: 1.55 },
  bubbleUser: { background: C.terracotta, color: C.white, borderRadius: "16px 4px 16px 16px", padding: "10px 14px", fontSize: 14, maxWidth: "82%", lineHeight: 1.55 },
  typingDots: { color: C.textMuted, letterSpacing: 3 },
  chatInput: { display: "flex", borderTop: `1px solid ${C.border}`, background: C.white },
  chatInputField: { flex: 1, border: "none", outline: "none", padding: "14px 18px", fontSize: 14, color: C.brown, background: "transparent", fontFamily: "'Palatino Linotype', Georgia, serif" },
  chatSend: { border: "none", background: C.terracotta, color: C.white, width: 52, fontSize: 20, cursor: "pointer" },
  installBanner: { background: C.brown, color: C.cream, padding: "12px 16px", borderRadius: 6, marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 },
  installBannerText: { fontSize: 13, lineHeight: 1.4, fontFamily: "sans-serif" },
  installBannerButtons: { display: "flex", gap: 8, alignItems: "center" },
  installBtn: { background: C.terracotta, color: C.white, border: "none", borderRadius: 3, padding: "7px 16px", fontSize: 12, cursor: "pointer", fontFamily: "sans-serif", fontWeight: 600 },
  installDismiss: { background: "none", border: "none", color: C.sand, fontSize: 16, cursor: "pointer", padding: "4px 8px" },
  iosHint: { background: C.sand, color: C.brownMid, padding: "10px 14px", borderRadius: 6, marginBottom: 12, fontSize: 12, fontFamily: "sans-serif", lineHeight: 1.5 },
  topBar: { padding: "12px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 24 },
  topBarRow1: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 },
  topBarRow2: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" },
  topBarLogo: { fontSize: 18, fontWeight: 700, color: C.terracotta, letterSpacing: "-0.01em", cursor: "pointer" },
  topBarEmail: { fontSize: 11, color: C.textMuted, fontFamily: "sans-serif" },
  topBarBadge: { fontSize: 10, background: "#E8F5E9", color: "#2E7D32", padding: "2px 8px", borderRadius: 20, fontFamily: "sans-serif" },
  topBarBtn: { background: "none", border: `1px solid ${C.border}`, borderRadius: 3, padding: "6px 14px", fontSize: 11, cursor: "pointer", color: C.brownMid, fontFamily: "sans-serif", letterSpacing: "0.06em" },
  // Language selector
  langBtn: { display: "flex", alignItems: "center", gap: 6, background: C.cream, border: `1px solid ${C.border}`, borderRadius: 3, padding: "5px 10px", cursor: "pointer", color: C.brownMid, fontFamily: "sans-serif" },
  langDropdown: { position: "absolute", top: "calc(100% + 6px)", right: 0, background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", zIndex: 200, minWidth: 140, overflow: "hidden" },
  langOption: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 14px", border: "none", cursor: "pointer", color: C.brown, textAlign: "left" },
  translatingBanner: { display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: C.sand, borderRadius: 4, marginBottom: 16, fontSize: 12, color: C.brownMid, fontFamily: "sans-serif", fontStyle: "italic" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: C.white, borderRadius: 8, padding: 32, width: "90%", maxWidth: 380, position: "relative" },
  modalClose: { position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.textMuted },
  modalTitle: { fontSize: 22, fontWeight: 700, color: C.brown, marginBottom: 20 },
  authInput: { width: "100%", padding: "11px 14px", border: `1px solid ${C.border}`, borderRadius: 3, fontSize: 14, marginBottom: 12, boxSizing: "border-box", fontFamily: "'Palatino Linotype', Georgia, serif", color: C.brown, background: C.cream, outline: "none" },
  authMessage: { fontSize: 12, color: C.terracotta, marginBottom: 12, fontFamily: "sans-serif" },
  authSwitch: { marginTop: 16, fontSize: 12, color: C.textMuted, textAlign: "center", fontFamily: "sans-serif" },
  authLink: { color: C.terracotta, cursor: "pointer", textDecoration: "underline" },
  legalWrap: { padding: "24px 0 60px" },
  legalTitle: { fontSize: 28, fontWeight: 700, color: C.brown, marginBottom: 4 },
  legalDate: { fontSize: 12, color: C.textMuted, fontFamily: "sans-serif", marginBottom: 28, fontStyle: "italic" },
  legalH2: { fontSize: 16, fontWeight: 600, color: C.brown, marginTop: 28, marginBottom: 8 },
  legalText: { fontSize: 13, color: C.brownMid, lineHeight: 1.7, marginBottom: 10, fontFamily: "sans-serif" },
  footer: { textAlign: "center", padding: "32px 0 16px", borderTop: `1px solid ${C.border}`, marginTop: 32, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" },
  footerLink: { fontSize: 11, color: C.textMuted, cursor: "pointer", fontFamily: "sans-serif", textDecoration: "underline", letterSpacing: "0.04em" },
  footerDot: { fontSize: 11, color: C.border },
  footerText: { fontSize: 11, color: C.textMuted, fontFamily: "sans-serif" },
};
