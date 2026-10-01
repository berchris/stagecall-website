// Landing page copy in both languages. Dutch is the primary language (served at `/`), English lives at `/en`.
// Theatre terms such as "call" and the call names are deliberately left in English in the Dutch copy.

export const LOCALES = ['nl', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const LANG_COOKIE = 'lang'
export const localePath = (lang: Locale) => (lang === 'nl' ? '/' : '/en')

const en = {
  meta: {
    title: 'StageCall — Every call, on time. Every time.',
    description:
      'StageCall keeps your production on schedule. Countdown timers and instant alerts for every crew team, delivered the moment they need them.',
    ogDescription: 'Countdown timers and instant alerts for every crew team.',
  },
  nav: {
    howItWorks: 'How it works',
    features: 'Features',
    cta: 'Save my seat',
    ctaShort: 'Save seat',
    menu: 'Toggle menu',
    language: 'Language',
    sections: 'Page sections',
    home: 'Start',
    roles: 'Roles',
    short: { home: 'Start', howItWorks: 'How', features: 'Features', roles: 'Roles' },
  },
  hero: {
    badge: 'Built for live productions',
    titleStart: 'Every call, ',
    titleAccent: 'on time.',
    titleEnd: 'Every time.',
    body: 'StageCall keeps your production on schedule. Countdown timers and instant alerts for every crew team, delivered the moment they need them.',
    primary: 'Save my seat',
    secondary: 'See how it works',
  },
  how: {
    label: 'How it works',
    title: ['Simple for managers.', 'Effortless for crew.'],
    sub: 'Set it up once. StageCall handles the rest — from load-in to curtain up.',
    step: 'Step',
    steps: [
      { title: 'Create a production', body: 'Add your show details, set up your teams — Sound, Lighting, Wardrobe, Stage Manager — and invite crew by email or phone.' },
      { title: 'Build your call schedule', body: 'Set up all your calls with how many minutes before show each fires. "Half hour", "Overture call", "Places" — set once, runs forever.' },
      { title: 'Run the show', body: 'Crew get alerts at the right moment. One acknowledgment clears the call for the entire team. No chasing, no repeating yourself.' },
    ],
  },
  features: {
    label: 'Features',
    title: 'Everything your production needs',
    sub: 'Designed for the realities of live theater — fast, reliable, and built for the chaos of tech week.',
    items: [
      { title: 'Team-specific alerts', body: "Calls go only to the teams that need them. Sound doesn't get Wardrobe's alerts. Each team sees exactly their schedule, nothing more." },
      { title: 'Group acknowledgment', body: 'One tap from any team member clears the call for the whole team. No chasing everyone for individual confirmations.' },
      { title: 'Full timeline view', body: 'See every call across all teams in chronological order. Know exactly where you are in the schedule at a glance.' },
      { title: 'Team peek', body: "Managers and Stage Managers can view any team's call schedule in read-only mode without leaving the app." },
      { title: 'Live editing', body: 'Need to adjust a call mid-show? Managers can edit or delete calls on the fly. Changes reflect instantly for all crew.' },
      { title: 'Alert history', body: 'Full log of every alert that fired — acknowledged by whom and when. Perfect for post-show review.' },
    ],
  },
  roles: {
    label: 'Roles',
    title: 'Right access for every role',
    sub: 'No configuration needed. Crew only see what they need. Managers control everything.',
    manager: {
      role: 'Production Manager',
      title: 'In full control',
      items: ['Create and manage productions', 'Add and remove crew members', 'Build, edit and delete calls', "View all teams' schedules", 'See full alert and ack history'],
    },
    crew: {
      role: 'Crew Member',
      title: 'Focused on their job',
      items: ["See only their team's calls", 'Get alerted at the right moment', 'One-tap acknowledgment for the team', "Peek at other teams' schedules", 'View the full production timeline'],
    },
  },
  cta: {
    badge: 'Launching soon',
    titleStart: 'Be the first ',
    titleAccent: 'on stage.',
    lead: "StageCall is in active development. Join the early access list and we'll reach out when it's ready.",
    note: 'No spam. Just a heads-up when we launch.',
  },
  form: {
    placeholder: 'your@email.com',
    submit: 'Notify me',
    loading: 'Saving…',
    successTitle: "You're on the list!",
    successBody: "We'll reach out when early access opens.",
    error: 'Something went wrong. Please try again.',
  },
  footer: '© 2026 StageCall. Built for the people who make shows happen.',
  mockup: {
    nextCall: 'Next Call',
    newCall: '+ New Call',
    callAdded: '✓ Call added',
    allTeams: 'All Teams',
    soundLighting: 'Sound · Lighting',
    wardrobe: 'Wardrobe',
    stageManager: 'Stage Manager',
    mins: '15 mins',
    passed: 'passed',
  },
}

export type Dictionary = typeof en

const nl: Dictionary = {
  meta: {
    title: 'StageCall — Elke call, op tijd. Elke keer.',
    description:
      'StageCall houdt je productie op schema. Afteltimers en directe meldingen voor elk crewteam, precies op het moment dat ze nodig zijn.',
    ogDescription: 'Afteltimers en directe meldingen voor elk crewteam.',
  },
  nav: {
    howItWorks: 'Hoe het werkt',
    features: 'Functies',
    cta: 'Reserveer je plek',
    ctaShort: 'Reserveer',
    menu: 'Menu openen of sluiten',
    language: 'Taal',
    sections: 'Onderdelen van de pagina',
    home: 'Start',
    roles: 'Rollen',
    short: { home: 'Start', howItWorks: 'Werking', features: 'Functies', roles: 'Rollen' },
  },
  hero: {
    badge: 'Gemaakt voor live producties',
    titleStart: 'Elke call, ',
    titleAccent: 'op tijd.',
    titleEnd: 'Elke keer.',
    body: 'StageCall houdt je productie op schema. Afteltimers en directe meldingen voor elk crewteam, precies op het moment dat ze nodig zijn.',
    primary: 'Reserveer je plek',
    secondary: 'Bekijk hoe het werkt',
  },
  how: {
    label: 'Hoe het werkt',
    title: ['Eenvoudig voor managers.', 'Moeiteloos voor de crew.'],
    sub: 'Eén keer instellen. StageCall regelt de rest, van load-in tot doek op.',
    step: 'Stap',
    steps: [
      { title: 'Maak een productie aan', body: 'Vul de gegevens van je voorstelling in, stel je teams samen (Geluid, Licht, Kostuum, Stage Manager) en nodig je crew uit via e-mail of telefoon.' },
      { title: 'Bouw je call-schema', body: 'Stel per call in hoeveel minuten voor aanvang hij afgaat. "Half hour", "Overture call", "Places": één keer instellen, daarna loopt het vanzelf.' },
      { title: 'Draai de show', body: 'De crew krijgt een melding op het juiste moment. Eén bevestiging handelt de call af voor het hele team. Niemand achterna zitten, niets herhalen.' },
    ],
  },
  features: {
    label: 'Functies',
    title: 'Alles wat je productie nodig heeft',
    sub: 'Ontworpen voor de praktijk van live theater: snel, betrouwbaar en bestand tegen de chaos van de montageweek.',
    items: [
      { title: 'Meldingen per team', body: 'Calls gaan alleen naar de teams die ze nodig hebben. Geluid krijgt niet de meldingen van Kostuum. Elk team ziet precies zijn eigen schema, niets meer.' },
      { title: 'Bevestigen als team', body: 'Eén tik van een teamlid handelt de call af voor het hele team. Je hoeft niet bij iedereen apart om bevestiging te vragen.' },
      { title: 'Volledige tijdlijn', body: 'Bekijk alle calls van alle teams in chronologische volgorde. Zie in één oogopslag waar je bent in het schema.' },
      { title: 'Meekijken met teams', body: 'Managers en stage managers kunnen het call-schema van elk team inzien, alleen-lezen en zonder de app te verlaten.' },
      { title: 'Live aanpassen', body: 'Moet een call tijdens de show worden aangepast? Managers wijzigen of verwijderen calls direct. Wijzigingen zijn meteen zichtbaar voor de hele crew.' },
      { title: 'Meldingsgeschiedenis', body: 'Volledig logboek van elke melding die is afgegaan: door wie bevestigd en wanneer. Ideaal voor de evaluatie na de show.' },
    ],
  },
  roles: {
    label: 'Rollen',
    title: 'De juiste toegang voor elke rol',
    sub: 'Geen configuratie nodig. De crew ziet alleen wat nodig is. Managers houden de regie.',
    manager: {
      role: 'Productiemanager',
      title: 'Volledige regie',
      items: ['Producties aanmaken en beheren', 'Crewleden toevoegen of verwijderen', 'Calls maken, wijzigen, verwijderen', "Schema's van alle teams inzien", 'Volledige meldingshistorie'],
    },
    crew: {
      role: 'Crewlid',
      title: 'Focus op het eigen werk',
      items: ['Alleen calls van het eigen team', 'Melding op het juiste moment', 'Met één tik bevestigen voor het team', 'Meekijken met andere teams', 'De volledige productietijdlijn'],
    },
  },
  cta: {
    badge: 'Binnenkort live',
    titleStart: 'Sta als eerste ',
    titleAccent: 'op het podium.',
    lead: 'StageCall is volop in ontwikkeling. Schrijf je in voor early access en we laten het je weten zodra het zover is.',
    note: 'Geen spam. Alleen een bericht bij de lancering.',
  },
  form: {
    placeholder: 'jouw@email.nl',
    submit: 'Houd me op de hoogte',
    loading: 'Bezig…',
    successTitle: 'Je staat op de lijst!',
    successBody: 'We laten het je weten zodra early access opent.',
    error: 'Er ging iets mis. Probeer het opnieuw.',
  },
  footer: '© 2026 StageCall. Voor de mensen die voorstellingen maken.',
  mockup: {
    nextCall: 'Volgende call',
    newCall: '+ Nieuwe call',
    callAdded: '✓ Call toegevoegd',
    allTeams: 'Alle teams',
    soundLighting: 'Geluid · Licht',
    wardrobe: 'Kostuum',
    stageManager: 'Stage Manager',
    mins: '15 min',
    passed: 'voorbij',
  },
}

export const dictionaries: Record<Locale, Dictionary> = { nl, en }
