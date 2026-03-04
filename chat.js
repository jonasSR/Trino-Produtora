/* TRINO PRODUTORA - CHAT ENGINE V8 */

// ============================================================
// ESTADO GLOBAL
// ============================================================
let leadContext   = { servico: "", detalhe: "", nome: "" };
let chatOpen      = false;
let chatStarted   = false;
let msgCount      = 0;
let waitingForName = false;
let waitingForFaturamento = false;
let waitingForDetalheAV   = false;
let waitingForDetalheSite  = false;
let waitingForDetalheSis   = false;

// ============================================================
// VARIAÇÕES — a Ana nunca repete a mesma frase
// ============================================================
const V = {
    receberNome: [
        "Que nome bonito! 😄 Prazer, {{nome}}!",
        "Oi, {{nome}}! Boa de conhecer você 😊",
        "{{nome}}, que ótimo! Seja muito bem-vindo(a)!",
        "Prazer, {{nome}}! Vou fazer o possível pra te ajudar hoje 🚀"
    ],
    concordar: [
        "Entendido! 👍",
        "Faz sentido!",
        "Anotado aqui!",
        "Perfeito!",
        "Boa escolha!"
    ],
    naoEntendeu: [
        "Hmm, não captei direito. Pode reformular?",
        "Peraí — pode explicar melhor? Quero te ajudar certo!",
        "Não entendi muito bem, mas a Trino com certeza resolve! Que tal falar com alguém?",
        "Acho que não entendi, mas temos um estrategista que vai adorar te ouvir 😊"
    ],
    despedida: [
        "Foi um prazer, {{nome}}! Qualquer coisa é só chamar 😊",
        "Até logo, {{nome}}! A Trino está aqui sempre que precisar 🚀",
        "Tchau, {{nome}}! Se precisar de algo, é só abrir o chat."
    ]
};

// ============================================================
// CONTEÚDO DOS FLUXOS
// ============================================================
const FLUXOS = {

    menuPrincipal: ["Tráfego Pago 📈", "Audiovisual 🎬", "Sites & Landing Pages 🌐", "Sistemas & Softwares ⚙️", "Ver Valores 💰", "Falar com Estrategista 📲"],

    trafego: {
        intro: `Tráfego pago bem feito é o motor de escala de qualquer negócio. 🎯\n\nAqui na Trino, a gente trabalha com *Meta Ads* e *Google Ads* — sempre com foco em ROI real, sem achismo.\n\nPra montar a estratégia certa pra você: qual é o faturamento mensal atual da sua empresa?`,
        opcoes: ["Estou começando agora 🌱", "Entre R$ 10k e R$ 50k/mês", "Entre R$ 50k e R$ 100k/mês", "Acima de R$ 100k/mês 🚀"],

        respostas: {
            "iniciando": `Ótimo momento para começar! 🌱\n\nPara quem está no início, a gente monta uma estratégia enxuta e inteligente — investimento certo no lugar certo, sem desperdício.\n\nVou te conectar com um estrategista pra bater um papo sem compromisso. Pode ser?`,
            "10k":       `Esse é um faturamento com bom potencial de escala! 📈\n\nNessa faixa, a gente costuma focar em *campanhas de conversão* bem segmentadas pra multiplicar o que já está funcionando.\n\nQuer agendar uma análise gratuita com um dos nossos especialistas?`,
            "50k":       `Excelente estágio! Com essa base, tráfego pago estratégico pode escalar muito. 🚀\n\nA gente vai analisar seus criativos, público e estrutura de campanha pra identificar onde está o maior potencial.\n\nPosso te conectar com um estrategista agora?`,
            "100k":      `Negócio robusto! Esse é exatamente o perfil que mais atendemos. 💼\n\nNessa escala, a conversa é sobre *eficiência de verba*, testes A/B avançados e integração entre canais.\n\nVou reservar um horário com um de nossos sêniores pra você. Pode ser agora?`
        }
    },

    audiovisual: {
        intro: `Vídeo é o formato que mais vende — e a Trino une qualidade de *cinema* com inteligência de marketing. 🎬\n\nNossos criativos são pensados para parar o scroll e converter de verdade.\n\nO que você precisa agora?`,
        opcoes: ["Criativos para Anúncios 📱", "Vídeos para Lançamento 🚀", "Vídeo Institucional 🏢", "Ver o Portfólio"],

        respostas: {
            "anuncios":      `Criativos para anúncios é uma das nossas especialidades! 📱\n\nA gente produz vídeos no formato certo para cada plataforma — Reels, Stories, Feed — otimizados para *baixo CPL* e *alta taxa de conversão*.\n\nQuer ver alguns exemplos ou já falar com um consultor?`,
            "lancamento":    `Lançamentos são onde a gente brilha! 🚀\n\nProduzimos toda a *sequência audiovisual* de um lançamento: vídeos de aquecimento, CPL, lives e conteúdo de autoridade.\n\nQuer conversar com um especialista para entender como ficaria o seu?`,
            "institucional": `Vídeo institucional de qualidade posiciona sua marca no mercado de outra forma. 🏢\n\nA gente cuida de tudo: roteiro, produção e edição com identidade visual da sua empresa.\n\nVou te conectar com um consultor para discutir o projeto?`,
            "portfolio":     `Claro! Dá uma olhada nos nossos projetos mais recentes:\n\n👉 *trino.com.br/portfolio*\n\nSe quiser comentar sobre algum projeto específico ou já partir para o orçamento, é só falar!`
        }
    },

    sites: {
        intro: `Sua presença digital começa com uma página que *converte*. 🌐\n\nDesenvolvemos Landing Pages e Sites com design profissional, carregamento rápido e otimização para SEO.\n\nO que você está precisando?`,
        opcoes: ["Landing Page de Vendas", "Site Institucional", "E-commerce", "Otimizar site que já tenho"],

        respostas: {
            "landing":       `Landing Pages de conversão são essenciais para campanhas de tráfego que funcionam de verdade! 📊\n\nA gente projeta com foco em *CRO* — taxa de conversão acima da média do mercado.\n\nQuer falar com um especialista sobre o seu projeto?`,
            "institucional": `Um site institucional bem feito passa credibilidade e gera autoridade pra sua marca. 🏢\n\nTrabalhamos com design personalizado, responsivo e otimizado para os mecanismos de busca.\n\nPosso te conectar com um consultor agora?`,
            "ecommerce":     `E-commerce exige uma combinação de *performance técnica* e *UX de vendas*. 🛒\n\nA gente desenvolve com plataformas robustas, integração de pagamento e layout pensado para converter.\n\nQuer um bate-papo com um especialista?`,
            "otimizar":      `Ótimo! Muitas vezes o site já tem potencial, só precisa de ajustes de velocidade, SEO e conversão. ⚙️\n\nFazemos uma análise completa e um plano de melhoria personalizado.\n\nPosso agendar isso com um consultor pra você?`
        }
    },

    sistemas: {
        intro: `Tecnologia sob medida é o que transforma operações medianas em máquinas de escala. ⚙️\n\nDesenvolvemos softwares, CRMs, dashboards e automações personalizadas.\n\nQual é o seu objetivo principal?`,
        opcoes: ["Automação de Processos", "Desenvolvimento de Software", "CRM / Sistema de Gestão", "Dashboard e Relatórios"],

        respostas: {
            "automacao":  `Automação libera tempo e elimina erros humanos. 🤖\n\nMapeamos seus processos e criamos fluxos automatizados que trabalham enquanto você dorme.\n\nQuer conversar com um especialista sobre o que pode ser automatizado no seu negócio?`,
            "software":   `Cada negócio tem necessidades únicas — e software genérico raramente resolve tudo. 💻\n\nDesenvolvemos do zero, com metodologia ágil e entregas contínuas.\n\nVou te conectar com um dos nossos desenvolvedores para uma conversa inicial?`,
            "crm":        `Um CRM bem configurado muda completamente a gestão do seu pipeline comercial. 📋\n\nTrabalhamos com implementação, personalização e treinamento de equipe.\n\nQuer agendar uma demonstração?`,
            "dashboard":  `Dados sem visualização são só números. Um bom dashboard transforma isso em *decisões inteligentes*. 📊\n\nCriamos painéis em tempo real integrados às suas fontes de dados.\n\nQuer falar com um especialista?`
        }
    },

    valores: `Entendo que planejamento financeiro é fundamental! 💰\n\nNossos projetos são 100% personalizados — o valor depende do escopo, prazo e objetivos.\n\nO melhor caminho é uma *consultoria gratuita* de 15 minutos com um dos nossos estrategistas. Sem compromisso, só para entender o que faz sentido pra você.\n\nFecho esse encontro agora?`,

    agendarTexto: (nome) => `Perfeito${nome ? ", " + nome : ""}! 🙌\n\nEstou te redirecionando para o WhatsApp agora. Um dos nossos estrategistas vai te atender em breve!\n\nAté já! 👋`
};

// ============================================================
// HELPERS
// ============================================================
function getRandom(arr)    { return arr[Math.floor(Math.random() * arr.length)]; }
function withName(str)     { return str.replace(/{{nome}}/g, leadContext.nome || ""); }
function nameTag()         { return leadContext.nome ? `, ${leadContext.nome}` : ""; }
function capitalize(str)   { return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); }
function getTime() {
    const n = new Date();
    return `${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}`;
}
function getTypingDelay(text) {
    return Math.min(700 + text.length * 15, 2500);
}

// ============================================================
// EXTRAIR NOME
// ============================================================
function tryExtractName(text) {
    const m = text.match(/(?:meu nome é|me chamo|sou o?a?\s+|pode me chamar de)\s+([A-Za-zÀ-ÿ]+)/i);
    return m ? capitalize(m[1]) : null;
}
function extractRawName(text) {
    const t = text.trim();
    if (t.split(" ").length > 4)   return null;
    if (t.includes("?"))           return null;
    if (/^(sim|não|nao|ok|quero|ver|oi|olá|ola)/i.test(t)) return null;
    return capitalize(t.split(" ")[0]);
}

// ============================================================
// INTERFACE
// ============================================================
function toggleChat() {
    const win = document.getElementById("chatWindow");
    chatOpen = !chatOpen;
    win.classList.toggle("open", chatOpen);

    const iOpen  = document.getElementById("chatIconOpen");
    const iClose = document.getElementById("chatIconClose");
    if (iOpen)  iOpen.style.display  = chatOpen ? "none" : "flex";
    if (iClose) iClose.style.display = chatOpen ? "flex" : "none";

    if (chatOpen && !chatStarted) { chatStarted = true; initChat(); }
}

function initChat() {
    const h = new Date().getHours();
    let saudacao = "Olá! Sou a Ana, assistente da Trino. Prazer em te conhecer! ⚡";
    if (h >= 5  && h < 12) saudacao = "Bom dia! ☀️ Sou a Ana, da Trino. Que bom ter você por aqui!";
    if (h >= 12 && h < 18) saudacao = "Boa tarde! ☕ Ana aqui, da Trino. Tudo bem por aí?";
    if (h >= 18 || h < 5)  saudacao = "Boa noite! 🌙 Sou a Ana da Trino — a gente não para nem à noite. 😄";

    showTyping(() => {
        addBotMessage(saudacao);
        setTimeout(() => showTyping(() => {
            addBotMessage("Antes de começar, posso saber com quem estou falando? 😊");
            waitingForName = true;
        }), 1100);
    });
}

// ============================================================
// ENVIAR MENSAGEM
// ============================================================
function sendMessage() {
    const inp = document.getElementById("chatInput");
    const txt = inp.value.trim();
    if (!txt) return;
    inp.value = "";
    handleInput(txt);
}

// ============================================================
// NÚCLEO DE INTELIGÊNCIA
// ============================================================
function handleInput(text) {
    addUserMessage(text);
    msgCount++;
    const raw   = text.trim();
    const input = raw.toLowerCase();

    // ── 1. ESPERANDO NOME ────────────────────────────────────
    if (waitingForName) {
        waitingForName = false;
        const nome = tryExtractName(raw) || extractRawName(raw);

        if (nome) {
            leadContext.nome = nome;
            const saudacao = withName(getRandom(V.receberNome));
            showTyping(() => {
                addBotMessage(saudacao);
                setTimeout(() => showTyping(() => {
                    addBotMessage(`Estou aqui pra te ajudar a levar o negócio para o próximo nível, ${nome}! 🚀\n\nO que você está buscando hoje?`, FLUXOS.menuPrincipal);
                }), 900);
            });
        } else {
            showTyping(() => addBotMessage("Tudo bem, pode seguir! 😄 Como posso te ajudar?", FLUXOS.menuPrincipal));
        }
        return;
    }

    // ── 2. AGUARDANDO FATURAMENTO (dentro de Tráfego) ────────
    if (waitingForFaturamento) {
        waitingForFaturamento = false;
        leadContext.detalhe = raw;

        let resposta = "";
        if      (input.match(/iniciando|começ|inicio|iníc/))    resposta = FLUXOS.trafego.respostas["iniciando"];
        else if (input.match(/10k|10\.000|entre r\$/))          resposta = FLUXOS.trafego.respostas["10k"];
        else if (input.match(/50k|50\.000/))                     resposta = FLUXOS.trafego.respostas["50k"];
        else if (input.match(/100k|100\.000|acima/))             resposta = FLUXOS.trafego.respostas["100k"];
        else                                                      resposta = FLUXOS.trafego.respostas["10k"]; // fallback

        showTyping(() => addBotMessage(resposta, ["Sim, quero falar com estrategista! 📲", "Tenho mais dúvidas"]), getTypingDelay(resposta));
        return;
    }

    // ── 3. AGUARDANDO DETALHE AUDIOVISUAL ────────────────────
    if (waitingForDetalheAV) {
        waitingForDetalheAV = false;
        leadContext.detalhe = raw;

        let resposta = "";
        if      (input.match(/anuncio|anúncio|ad|criativo/))  resposta = FLUXOS.audiovisual.respostas["anuncios"];
        else if (input.match(/lançamento|lancamento/))         resposta = FLUXOS.audiovisual.respostas["lancamento"];
        else if (input.match(/institucional/))                 resposta = FLUXOS.audiovisual.respostas["institucional"];
        else if (input.match(/portf/))                         resposta = FLUXOS.audiovisual.respostas["portfolio"];
        else                                                   resposta = FLUXOS.audiovisual.respostas["anuncios"];

        const ehPortfolio = input.match(/portf/);
        const botoes = ehPortfolio
            ? ["Quero um orçamento!", "Tenho dúvidas"]
            : ["Sim, quero falar com estrategista! 📲", "Tenho mais dúvidas"];

        showTyping(() => addBotMessage(resposta, botoes), getTypingDelay(resposta));
        return;
    }

    // ── 4. AGUARDANDO DETALHE SITES ──────────────────────────
    if (waitingForDetalheSite) {
        waitingForDetalheSite = false;
        leadContext.detalhe = raw;

        let resposta = "";
        if      (input.match(/landing|vendas/))     resposta = FLUXOS.sites.respostas["landing"];
        else if (input.match(/institucional/))       resposta = FLUXOS.sites.respostas["institucional"];
        else if (input.match(/ecommerce|loja/))      resposta = FLUXOS.sites.respostas["ecommerce"];
        else if (input.match(/otimiz|atual/))        resposta = FLUXOS.sites.respostas["otimizar"];
        else                                         resposta = FLUXOS.sites.respostas["landing"];

        showTyping(() => addBotMessage(resposta, ["Sim, quero falar com especialista! 📲", "Tenho mais dúvidas"]), getTypingDelay(resposta));
        return;
    }

    // ── 5. AGUARDANDO DETALHE SISTEMAS ───────────────────────
    if (waitingForDetalheSis) {
        waitingForDetalheSis = false;
        leadContext.detalhe = raw;

        let resposta = "";
        if      (input.match(/automa/))              resposta = FLUXOS.sistemas.respostas["automacao"];
        else if (input.match(/software|desenvolvimento/)) resposta = FLUXOS.sistemas.respostas["software"];
        else if (input.match(/crm|gestão|gestao/))   resposta = FLUXOS.sistemas.respostas["crm"];
        else if (input.match(/dashboard|relatório/)) resposta = FLUXOS.sistemas.respostas["dashboard"];
        else                                         resposta = FLUXOS.sistemas.respostas["software"];

        showTyping(() => addBotMessage(resposta, ["Sim, quero falar com especialista! 📲", "Tenho mais dúvidas"]), getTypingDelay(resposta));
        return;
    }

    // ── 6. INTENÇÃO DE AGENDAR — só palavras realmente de agendamento ──
    const querAgendar = input.match(/\b(quero falar com|falar com estrategista|agendar|quero agendar|falar com especialista|sim, quero falar|quero um orçamento)\b/);

    if (querAgendar) {
        const resumo = leadContext.servico
            ? `Serviço: ${leadContext.servico}${leadContext.detalhe ? " | Detalhe: " + leadContext.detalhe : ""}`
            : "Interesse Geral";

        addBotMessage(FLUXOS.agendarTexto(leadContext.nome));
        goToWhatsapp(resumo);
        return;
    }

    // ── 7. MENU PRINCIPAL ────────────────────────────────────
    showTyping(() => {

        // TRÁFEGO PAGO
        if (input.match(/tráfego|trafego|anuncio|anúncio|\bads\b|google ads|meta ads|facebook ads|instagram ads|tráfego pago/)) {
            leadContext.servico = "Tráfego Pago";
            waitingForFaturamento = true;
            addBotMessage(FLUXOS.trafego.intro, FLUXOS.trafego.opcoes);
        }

        // AUDIOVISUAL
        else if (input.match(/audiovisual|vídeo|video|cinema|filmagem|reels|criativo|criativos/)) {
            leadContext.servico = "Audiovisual";
            waitingForDetalheAV = true;
            addBotMessage(FLUXOS.audiovisual.intro, FLUXOS.audiovisual.opcoes);
        }

        // SITES
        else if (input.match(/site|landing page|landing|página|pagina|ecommerce|loja virtual|presença digital/)) {
            leadContext.servico = "Sites & Landing Pages";
            waitingForDetalheSite = true;
            addBotMessage(FLUXOS.sites.intro, FLUXOS.sites.opcoes);
        }

        // SISTEMAS
        else if (input.match(/sistema|software|automação|automacao|crm|dashboard|erp|tecnologia/)) {
            leadContext.servico = "Sistemas & Softwares";
            waitingForDetalheSis = true;
            addBotMessage(FLUXOS.sistemas.intro, FLUXOS.sistemas.opcoes);
        }

        // VALORES
        else if (input.match(/valor|preço|preco|quanto|custa|investimento|orçamento|orcamento|plano/)) {
            addBotMessage(FLUXOS.valores, ["Sim, agendar agora! 📲", "Quero ver os serviços primeiro"]);
        }

        // VER SERVIÇOS
        else if (input.match(/serviço|servico|ver serviços|menu|opção|opcao|voltar/)) {
            addBotMessage(`Claro${nameTag()}! Veja o que a Trino oferece:`, FLUXOS.menuPrincipal);
        }

        // PORTFÓLIO
        else if (input.match(/portf|trabalhos?|cases?|exemplos?|clientes?/)) {
            addBotMessage(`Confira nossos cases e projetos:\n\n👉 *trino.com.br/portfolio*\n\nQualquer dúvida sobre um projeto específico, pode perguntar${nameTag()}!`, ["Quero um orçamento 📲", "Ver Serviços"]);
        }

        // SOBRE A TRINO
        else if (input.match(/trino|quem vocês|o que vocês|sobre vocês|o que fazem/)) {
            addBotMessage(`A Trino é uma produtora digital full-service. Atuamos em quatro frentes:\n\n📈 *Tráfego Pago* — Meta e Google Ads com foco em ROI\n🎬 *Audiovisual* — Vídeos de cinema aplicados ao marketing\n🌐 *Sites & LPs* — Páginas que convertem\n⚙️ *Sistemas* — Software e automação sob medida\n\nEm resumo${nameTag()}: a gente faz seu negócio *aparecer e crescer*. 💡`, FLUXOS.menuPrincipal);
        }

        // QUEM É A ANA
        else if (input.match(/você é|quem é você|robô|robo|ia|inteligência artificial|humana/)) {
            addBotMessage(`Sou a Ana, assistente virtual da Trino! 🤖✨\n\nNão sou humana, mas faço o meu melhor pra te ajudar — e quando precisar de alguém de carne e osso, conecto você na hora com um dos nossos estrategistas!\n\nComo posso te ajudar${nameTag()}?`, FLUXOS.menuPrincipal);
        }

        // SAUDAÇÃO ISOLADA
        else if (input.match(/^(oi|olá|ola|hey|e aí|eai|tudo bem|tudo bom|bom dia|boa tarde|boa noite)(\s.*)?$/)) {
            addBotMessage(`Oi${nameTag()}! 😊 Tudo ótimo por aqui. Como posso te ajudar hoje?`, FLUXOS.menuPrincipal);
        }

        // CONFIRMAÇÃO CURTA
        else if (input.match(/^(ok|okay|certo|entendi|ta|tá|blz|beleza|legal|sim)$/)) {
            addBotMessage(`${getRandom(V.concordar)} Posso te ajudar com mais alguma coisa${nameTag()}?`, FLUXOS.menuPrincipal);
        }

        // DESPEDIDA
        else if (input.match(/tchau|até logo|até mais|obrigad|valeu|foi bom/)) {
            addBotMessage(withName(getRandom(V.despedida).replace("{{nome}}", leadContext.nome || "")) + " 👋");
        }

        // FRUSTRAÇÃO
        else if (input.match(/não entendi|confuso|complicado|não tô entendendo|me perdi/)) {
            addBotMessage(`Desculpa a confusão${nameTag()}! 😅 Que tal falar direto com um dos nossos estrategistas? Eles explicam tudo com calma.`, ["Sim, quero falar! 📲", "Tentar de novo"]);
        }

        // FALLBACK
        else {
            const msg = msgCount >= 3
                ? `${getRandom(V.naoEntendeu)}\n\nJá que você está aqui, que tal falar com um dos nossos especialistas${nameTag()}? Eles vão te ajudar na hora! 😊`
                : getRandom(V.naoEntendeu);
            addBotMessage(msg, msgCount >= 3
                ? ["Falar com Especialista 📲", "Ver Serviços"]
                : ["Falar com Estrategista 📲", "Ver Serviços"]);
        }

    }, getTypingDelay(raw));
}

// ============================================================
// MENSAGENS
// ============================================================
function showTyping(callback, delay = 1200) {
    const msgs = document.getElementById("chatMessages");
    document.getElementById("temp-typing")?.remove();

    const dot = document.createElement("div");
    dot.className = "msg msg-bot typing";
    dot.id = "temp-typing";
    dot.innerHTML = "<span>.</span><span>.</span><span>.</span>";
    msgs.appendChild(dot);
    msgs.scrollTop = msgs.scrollHeight;

    setTimeout(() => {
        document.getElementById("temp-typing")?.remove();
        callback();
    }, delay);
}

function addBotMessage(text, replies = []) {
    const msgs = document.getElementById("chatMessages");
    const div  = document.createElement("div");
    div.className = "msg msg-bot";
    div.innerHTML = text
        .replace(/\n/g, "<br>")
        .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
        + `<div class="msg-time">${getTime()}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    setReplies(replies);
}

function addUserMessage(text) {
    const msgs = document.getElementById("chatMessages");
    const div  = document.createElement("div");
    div.className = "msg msg-user";
    div.innerHTML = `${text}<div class="msg-time">${getTime()}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    setReplies([]);
}

function setReplies(replies) {
    const qr = document.getElementById("quickReplies");
    qr.innerHTML = "";
    replies.forEach(r => {
        const btn = document.createElement("button");
        btn.className = "quick-reply";
        btn.textContent = r;
        btn.onclick = () => handleInput(r);
        qr.appendChild(btn);
    });
}

// ============================================================
// PROATIVO — 25s sem interagir
// ============================================================
let proactiveTimer = null;

document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById("chatTrigger")
                 || document.querySelector('[onclick="toggleChat()"]');
    if (trigger) {
        trigger.addEventListener("click", () => {
            clearTimeout(proactiveTimer);
            proactiveTimer = setTimeout(() => {
                if (chatOpen && chatStarted && msgCount === 0) {
                    showTyping(() => addBotMessage(
                        "Ei, ainda está por aí? 😊 Se tiver alguma dúvida, pode perguntar — estou aqui!",
                        ["Ver Serviços", "Falar com Estrategista 📲"]
                    ), 800);
                }
            }, 25000);
        });
    }
});

// ============================================================
// WHATSAPP
// ============================================================
function goToWhatsapp(resumo) {
    const phone = "5521966957715";
    const nomeTag = leadContext.nome ? `\n👤 Nome: ${leadContext.nome}` : "";

    const msg = `Olá! Vim pelo chat do site da Trino. ⚡\n\n--- 📋 RESUMO ---${nomeTag}\n📌 Interesse: ${resumo}\n-----------------\n\nGostaria de agendar uma consultoria!`;

    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
    const w = window.open(url, "_blank");
    if (!w || w.closed || typeof w.closed === "undefined") window.location.href = url;
}