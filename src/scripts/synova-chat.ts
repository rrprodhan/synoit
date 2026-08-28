type KnowledgeEntry = {
  id: string;
  kind: string;
  title: string;
  answer: string;
  keywords: string[];
  url?: string;
};

type KnowledgePayload = {
  version: number;
  entries: KnowledgeEntry[];
};

type ReplyLink = { label: string; url: string };
type Reply = { text: string; links?: ReplyLink[]; offerContact?: boolean };

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'about', 'can', 'could', 'did', 'do', 'does', 'for', 'from',
  'have', 'how', 'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'our', 'please',
  'tell', 'that', 'the', 'this', 'to', 'we', 'what', 'which', 'with', 'you', 'your',
  'build', 'create', 'make', 'need', 'offer', 'provide', 'use', 'using', 'want',
  'work', 'working', 'wit'
]);

const PHRASE_ALIASES: Array<[RegExp, string]> = [
  [/\be[\s-]?commerce\b/g, 'ecommerce'],
  [/\bweb[\s-]?site(s)?\b/g, 'web'],
  [/\bweb[\s-]?app(s)?\b/g, 'webapp'],
  [/\bmobile application(s)?\b/g, 'mobile app'],
  [/\bap{1,2}lication(s)?\b/g, 'app'],
  [/\bartificial intelligence\b/g, 'ai'],
  [/\bmachine learning\b/g, 'ai'],
  [/\bsearch engine optimi[sz]ation\b/g, 'seo'],
  [/\bhealth[\s-]?care\b/g, 'healthcare'],
  [/\bfront[\s-]?end\b/g, 'frontend'],
  [/\bback[\s-]?end\b/g, 'backend'],
  [/\buser experience\b/g, 'ux'],
  [/\buser interface\b/g, 'ui'],
  [/\bprice(s)?|\brate(s)?|\bcost(s)?|\bbudget(s)?/g, 'pricing'],
  [/\bsector(s)?|\bvertical(s)?/g, 'industry'],
  [/\bframework(s)?|\blanguage(s)?/g, 'technology'],
  [/\bshop(s)?|\bonline store(s)?/g, 'ecommerce'],
  [/\bchat bot(s)?\b/g, 'chatbot']
];

const normalize = (value: string) => {
  let normalized = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9+#.\s-]/g, ' ');
  PHRASE_ALIASES.forEach(([pattern, replacement]) => { normalized = normalized.replace(pattern, replacement); });
  return normalized.replace(/[-_/]+/g, ' ').replace(/\s+/g, ' ').trim();
};

const meaningfulTokens = (value: string) => normalize(value)
  .split(' ')
  .map((token) => token.endsWith('s') && token.length > 4 ? token.slice(0, -1) : token)
  .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

const bigrams = (value: string) => {
  const padded = ` ${value} `;
  const result: string[] = [];
  for (let index = 0; index < padded.length - 1; index += 1) result.push(padded.slice(index, index + 2));
  return result;
};

const diceSimilarity = (left: string, right: string) => {
  if (left === right) return 1;
  if (left.length < 3 || right.length < 3) return 0;
  const leftPairs = bigrams(left);
  const rightPairs = bigrams(right);
  const counts = new Map<string, number>();
  leftPairs.forEach((pair) => counts.set(pair, (counts.get(pair) ?? 0) + 1));
  let intersection = 0;
  rightPairs.forEach((pair) => {
    const count = counts.get(pair) ?? 0;
    if (count > 0) {
      intersection += 1;
      counts.set(pair, count - 1);
    }
  });
  return (2 * intersection) / (leftPairs.length + rightPairs.length);
};

const entryTerms = (entry: KnowledgeEntry) => meaningfulTokens([
  entry.title,
  entry.kind,
  ...(entry.keywords ?? [])
].join(' '));

const scoreEntry = (query: string, entry: KnowledgeEntry) => {
  const normalizedQuery = normalize(query);
  const queryTokens = meaningfulTokens(query);
  const title = normalize(entry.title);
  const keywordText = normalize((entry.keywords ?? []).join(' '));
  const answerText = normalize(entry.answer);
  const haystack = `${title} ${keywordText} ${answerText}`;
  const terms = entryTerms(entry);
  let score = 0;
  let matched = 0;

  if (title === normalizedQuery) score += 24;
  else if (title.includes(normalizedQuery) || normalizedQuery.includes(title)) score += 12;
  if (normalizedQuery.length > 3 && keywordText.includes(normalizedQuery)) score += 10;
  if (normalizedQuery.length > 5 && haystack.includes(normalizedQuery)) score += 5;

  queryTokens.forEach((token) => {
    let tokenScore = 0;
    if (title.split(' ').includes(token)) tokenScore = 7;
    else if (title.includes(token)) tokenScore = 5;
    else if (keywordText.split(' ').includes(token)) tokenScore = 4.5;
    else if (keywordText.includes(token)) tokenScore = 3.2;
    else if (answerText.split(' ').includes(token)) tokenScore = 1.5;
    else {
      let best = 0;
      terms.forEach((term) => {
        if (token.length >= 3 && term.length >= 3 && (term.startsWith(token) || token.startsWith(term))) {
          best = Math.max(best, .82);
        } else if (token.length >= 4 && term.length >= 4) {
          best = Math.max(best, diceSimilarity(token, term));
        }
      });
      if (best >= .82) tokenScore = 3;
      else if (best >= .68) tokenScore = 1.7;
    }
    if (tokenScore > 0) matched += 1;
    score += tokenScore;
  });

  const coverage = queryTokens.length ? matched / queryTokens.length : 0;
  score += coverage * 4;
  score -= Math.max(0, queryTokens.length - matched) * 1.2;
  if (coverage === 1 && queryTokens.length > 1) score += 3;
  return { entry, score, coverage };
};

const directIntent = (query: string) => {
  const value = normalize(query);
  const intents: Array<[RegExp, string]> = [
    [/\b(all|what|which|explore|offer).*\bservice|\bservice.*\b(offer|provide|available)/, 'services-overview'],
    [/\bwhat.*\b(build|make|create)\b/, 'services-overview'],
    [/\b(which|what|all|your).*\b(technology|tech stack|tool)|\btechnology stack\b/, 'technologies-overview'],
    [/\b(which|what|all|your).*\bindustry|\bindustry experience\b/, 'industries-overview'],
    [/\b(pricing|how much|estimate|quote|package)\b/, 'pricing-overview'],
    [/\b(how long|timeline|duration|deadline|delivery time)\b/, 'project-timeline'],
    [/\b(how.*work|your process|project process|delivery process)\b/, 'delivery-process'],
    [/\b(portfolio|case study|case studies|past work|project example)\b/, 'portfolio'],
    [/\b(contact|email|phone|whatsapp|talk to (a )?human|book (a )?call)\b/, 'contact-synoit'],
    [/\b(where.*located|location|office|headquarter)\b/, 'locations'],
    [/\b(get started|start (a )?project|send (a )?brief)\b/, 'start-project'],
    [/\b(dedicated team|staff augmentation|extend.*team|hire developer)\b/, 'dedicated-team'],
    [/\b(after launch|post launch|maintenance|ongoing support)\b/, 'post-launch-support']
  ];
  return intents.find(([pattern]) => pattern.test(value))?.[1];
};

const buildReply = (query: string, knowledge: KnowledgePayload): Reply => {
  const normalizedQuery = normalize(query);
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|hiya|yo)\b/.test(normalizedQuery)) {
    return { text: 'Hello — good to meet you. Tell me what you want to build, improve, automate, or grow, and I’ll point you to the most relevant SynoIT capability.' };
  }
  if (/^(thanks|thank you|great|perfect|helpful|got it)\b/.test(normalizedQuery)) {
    return { text: 'You’re welcome. If you share your goal, timeline, and current setup, I can narrow the recommendation further.', offerContact: true };
  }

  const intentId = directIntent(query);
  const directMatch = intentId ? knowledge.entries.find((entry) => entry.id === intentId) : undefined;
  if (directMatch) {
    return {
      text: directMatch.answer,
      links: directMatch.url ? [{ label: `Explore ${directMatch.title}`, url: directMatch.url }] : undefined,
      offerContact: ['contact-synoit', 'pricing-overview', 'start-project'].includes(directMatch.id)
    };
  }

  const ranked = knowledge.entries
    .map((entry) => scoreEntry(query, entry))
    .sort((left, right) => right.score - left.score);
  const best = ranked[0];

  if (!best || best.score < 5.8 || best.coverage < .34) {
    return {
      text: 'I don’t have a verified website answer for that yet. A SynoIT specialist can give you a precise response based on your goals and constraints.',
      links: [{ label: 'Contact SynoIT', url: '/contact/' }],
      offerContact: true
    };
  }

  const links: ReplyLink[] = [];
  if (best.entry.url) links.push({ label: `View ${best.entry.title}`, url: best.entry.url });
  const related = ranked.find((candidate) => candidate.entry.id !== best.entry.id
    && candidate.entry.title !== best.entry.title
    && candidate.score >= Math.max(6.2, best.score * .72)
    && candidate.coverage >= .34);
  if (related?.entry.url && related.entry.url !== best.entry.url) links.push({ label: `Also: ${related.entry.title}`, url: related.entry.url });

  return {
    text: best.entry.answer,
    links: links.slice(0, 2),
    offerContact: best.entry.kind === 'pricing' || best.entry.id.includes('contact')
  };
};

const initSynova = (root: HTMLElement) => {
  const launcher = root.querySelector<HTMLButtonElement>('[data-synova-launcher]');
  const panel = root.querySelector<HTMLElement>('[data-synova-panel]');
  const closeButton = root.querySelector<HTMLButtonElement>('[data-synova-close]');
  const voiceButton = root.querySelector<HTMLButtonElement>('[data-synova-voice]');
  const conversation = root.querySelector<HTMLElement>('[data-synova-conversation]');
  const contactPanel = root.querySelector<HTMLElement>('[data-synova-contact]');
  const contactOpen = root.querySelector<HTMLButtonElement>('[data-synova-show-contact]');
  const contactBack = root.querySelector<HTMLButtonElement>('[data-synova-contact-back]');
  const contactForm = root.querySelector<HTMLFormElement>('[data-synova-contact-form]');
  const composer = root.querySelector<HTMLFormElement>('[data-synova-composer]');
  const input = root.querySelector<HTMLInputElement>('[data-synova-input]');
  const messages = root.querySelector<HTMLElement>('[data-synova-messages]');
  const starters = root.querySelector<HTMLElement>('[data-synova-starters]');
  const note = root.querySelector<HTMLElement>('.synova__note');
  const knowledgeUrl = root.dataset.knowledgeUrl ?? '/synova-knowledge.json';
  if (!launcher || !panel || !closeButton || !voiceButton || !conversation || !contactPanel || !contactForm || !composer || !input || !messages) return;

  let knowledgePromise: Promise<KnowledgePayload> | null = null;
  let busy = false;
  let welcomed = false;
  let voiceEnabled = true;
  try { voiceEnabled = localStorage.getItem('synova-voice') !== 'off'; } catch { /* storage may be disabled */ }

  const updateVoiceButton = () => {
    voiceButton.classList.toggle('is-muted', !voiceEnabled);
    voiceButton.setAttribute('aria-pressed', String(!voiceEnabled));
    voiceButton.setAttribute('aria-label', voiceEnabled ? 'Turn Synova voice off' : 'Turn Synova voice on');
    voiceButton.title = voiceEnabled ? 'Turn voice off' : 'Turn voice on';
  };
  updateVoiceButton();

  const loadKnowledge = () => {
    if (!knowledgePromise) {
      knowledgePromise = fetch(knowledgeUrl, { headers: { Accept: 'application/json' } })
        .then((response) => {
          if (!response.ok) throw new Error(`Knowledge request failed: ${response.status}`);
          return response.json() as Promise<KnowledgePayload>;
        })
        .then((payload) => {
          if (!Array.isArray(payload.entries)) throw new Error('Invalid knowledge payload');
          return payload;
        });
    }
    return knowledgePromise;
  };

  const scrollConversation = () => requestAnimationFrame(() => {
    conversation.scrollTo({ top: conversation.scrollHeight, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  const addMessage = (role: 'assistant' | 'user', text: string, reply?: Reply) => {
    const article = document.createElement('article');
    article.className = `synova__message synova__message--${role}`;
    if (role === 'assistant') {
      const avatar = document.createElement('span');
      avatar.className = 'synova__message-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = 'S';
      article.append(avatar);
    }
    const bubble = document.createElement('div');
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    bubble.append(paragraph);

    if (role === 'assistant' && reply && ((reply.links?.length ?? 0) > 0 || reply.offerContact)) {
      const actions = document.createElement('div');
      actions.className = 'synova__message-links';
      reply.links?.forEach((link) => {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.label;
        actions.append(anchor);
      });
      if (reply.offerContact) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Send a project brief';
        button.addEventListener('click', () => showContact());
        actions.append(button);
      }
      bubble.append(actions);
    }
    article.append(bubble);
    messages.append(article);
    while (messages.children.length > 36) messages.firstElementChild?.remove();
    scrollConversation();
    return article;
  };

  const addTyping = () => {
    const article = document.createElement('article');
    article.className = 'synova__message synova__message--assistant synova__typing';
    article.setAttribute('aria-hidden', 'true');
    const avatar = document.createElement('span');
    avatar.className = 'synova__message-avatar';
    avatar.textContent = 'S';
    const bubble = document.createElement('div');
    bubble.append(document.createElement('i'), document.createElement('i'), document.createElement('i'));
    article.append(avatar, bubble);
    messages.append(article);
    scrollConversation();
    return article;
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const preferred = [
      /samantha/i, /zira/i, /jenny/i, /aria/i, /ava/i, /victoria/i,
      /google uk english female/i, /female/i, /english.*united kingdom/i
    ];
    utterance.voice = preferred.map((pattern) => voices.find((voice) => pattern.test(voice.name))).find(Boolean)
      ?? voices.find((voice) => /^en[-_]/i.test(voice.lang))
      ?? null;
    utterance.lang = utterance.voice?.lang || 'en-US';
    utterance.rate = .98;
    utterance.pitch = 1.08;
    utterance.volume = .9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  function showContact() {
    conversation.hidden = true;
    composer.hidden = true;
    if (note) note.hidden = true;
    contactPanel.hidden = false;
    requestAnimationFrame(() => contactForm.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true }));
  }

  const hideContact = () => {
    contactPanel.hidden = true;
    conversation.hidden = false;
    composer.hidden = false;
    if (note) note.hidden = false;
    input.focus({ preventScroll: true });
    scrollConversation();
  };

  const openChat = () => {
    panel.hidden = false;
    root.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    panel.focus({ preventScroll: true });
    loadKnowledge().catch(() => { knowledgePromise = null; });
    if (!welcomed) {
      welcomed = true;
      window.setTimeout(() => speak('Hi, I’m Synova. What can I help you build today?'), 120);
    }
  };

  const closeChat = () => {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    panel.hidden = true;
    root.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus({ preventScroll: true });
  };

  const submitQuery = async (rawQuery: string) => {
    const query = rawQuery.trim().slice(0, 360);
    if (!query || busy) return;
    busy = true;
    composer.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled = true;
    addMessage('user', query);
    input.value = '';
    starters?.remove();
    const typing = addTyping();

    try {
      const knowledge = await loadKnowledge();
      const reply = buildReply(query, knowledge);
      await new Promise((resolve) => window.setTimeout(resolve, 240));
      typing.remove();
      addMessage('assistant', reply.text, reply);
    } catch {
      typing.remove();
      addMessage('assistant', 'I can’t reach my website knowledge right now. You can still contact SynoIT directly and the team will help.', {
        text: '',
        links: [{ label: 'Contact SynoIT', url: '/contact/' }],
        offerContact: true
      });
      knowledgePromise = null;
    } finally {
      busy = false;
      composer.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled = false;
      input.focus({ preventScroll: true });
    }
  };

  launcher.addEventListener('click', openChat);
  closeButton.addEventListener('click', closeChat);
  voiceButton.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    try { localStorage.setItem('synova-voice', voiceEnabled ? 'on' : 'off'); } catch { /* storage may be disabled */ }
    updateVoiceButton();
    if (voiceEnabled) speak('Synova voice is on.');
    else if ('speechSynthesis' in window) speechSynthesis.cancel();
  });
  contactOpen?.addEventListener('click', showContact);
  contactBack?.addEventListener('click', hideContact);
  composer.addEventListener('submit', (event) => {
    event.preventDefault();
    void submitQuery(input.value);
  });
  root.querySelectorAll<HTMLButtonElement>('[data-synova-query]').forEach((button) => {
    button.addEventListener('click', () => void submitQuery(button.dataset.synovaQuery ?? button.textContent ?? ''));
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const company = String(data.get('company') ?? '').trim();
    const service = String(data.get('service') ?? 'Not sure yet').trim();
    const message = String(data.get('message') ?? '').trim();
    const subject = `Project enquiry from ${name} — ${service}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || 'Not provided'}`,
      `Service interest: ${service}`,
      '',
      'Project or question:',
      message,
      '',
      'Prepared with Synova on synoit.com'
    ].join('\n');
    window.location.href = `mailto:support@synoit.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    hideContact();
    addMessage('assistant', 'Your email app should now have a prepared message. Review it, add any files or context, and send when ready.', {
      text: '',
      links: [{ label: 'Other contact options', url: '/contact/' }]
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      if (!contactPanel.hidden) hideContact();
      else closeChat();
    }
  });
};

document.querySelectorAll<HTMLElement>('[data-synova-root]').forEach(initSynova);
