/* TRINO PRODUTORA - CHAT ENGINE V5 (IA EDITION) */

let leadContext = {
    servico: "",
    detalhe: ""
};

let chatOpen = false;
let chatStarted = false;

// Configuração de Personalidade e Fluxos
const botData = {
    greetings: {
        morning: "Bom dia! Sou a Ana, da Trino. Que bom ter você por aqui! ☀️",
        afternoon: "Boa tarde! Ana aqui, da Trino. Como está seu dia? ☕",
        night: "Boa noite! Sou a Ana. Mesmo a essa hora, a Trino não para. Como posso te ajudar? 🌙",
        generic: "Olá! Sou a Ana, assistente virtual da Trino. Prazer em te conhecer! ⚡"
    },
    flow: {
        welcome: "Estou aqui para acelerar seu atendimento e levar seu negócio para o próximo nível. O que você busca hoje?",
        options: ["Tráfego Pago 🚀", "Audiovisual 🎬", "Falar com Humano 📲", "Ver Valores 💰"],
        
        "trafego": {
            text: "Dominamos Meta e Google Ads com foco em ROI real. Para eu te direcionar melhor: qual o seu faturamento mensal atual?",
            replies: ["Iniciante", "R$ 10k - R$ 50k", "Acima de R$ 100k"]
        },
        "audiovisual": {
            text: "Cinema aplicado ao marketing. Criamos vídeos que prendem a atenção e convertem. O que você precisa?",
            replies: ["Vídeos para Anúncios", "Vídeos para Lançamento", "Portfólio"]
        },
        "agendar": {
            text: "Excelente escolha. Vou te conectar com um de nossos estrategistas agora mesmo para uma consultoria gratuita.",
            action: (ctx) => goToWhatsapp(`Olá Ana, vim do site. Quero agendar uma análise sobre: ${ctx}`)
        }
    }
};

// --- Funções de Interface ---

function toggleChat() {
    const win = document.getElementById('chatWindow');
    chatOpen = !chatOpen;
    win.classList.toggle('open', chatOpen);
    
    // Controle de ícones do gatilho (opcional se usar apenas o ícone do WA)
    const iconOpen = document.getElementById('chatIconOpen');
    const iconClose = document.getElementById('chatIconClose');
    if(iconOpen) iconOpen.style.display = chatOpen ? 'none' : 'flex';
    if(iconClose) iconClose.style.display = chatOpen ? 'flex' : 'none';

    // Dispara a Ana apenas na primeira vez que abre
    if (chatOpen && !chatStarted) {
        chatStarted = true;
        initChat();
    }
}

function initChat() {
    const hour = new Date().getHours();
    let welcomeNote = botData.greetings.generic;

    // IA decide a saudação pelo horário
    if (hour >= 5 && hour < 12) welcomeNote = botData.greetings.morning;
    else if (hour >= 12 && hour < 18) welcomeNote = botData.greetings.afternoon;
    else welcomeNote = botData.greetings.night;

    showTyping(() => {
        addBotMessage(welcomeNote);
        setTimeout(() => {
            showTyping(() => addBotMessage(botData.flow.welcome, botData.flow.options));
        }, 1000);
    });
}

// --- Inteligência de Resposta ---

function handleInput(text) {
    addUserMessage(text);
    const input = text.toLowerCase().trim();

    showTyping(() => {
        // Reconhece saudações soltas
        if (input.match(/^(oi|olá|ola|hey|bom dia|boa tarde|boa noite)/)) {
            addBotMessage("Olá! 😊 Como posso ajudar a Trino a escalar seu negócio hoje?", botData.flow.options);
        }
        // Identifica palavras-chave (IA de Intenção)
        else if (input.match(/(trafego|tráfego|anuncio|ads|google|meta)/)) {
            addBotMessage(botData.flow["trafego"].text, botData.flow["trafego"].replies);
        }
        else if (input.match(/(video|vídeo|audiovisual|produção|cinema)/)) {
            addBotMessage(botData.flow["audiovisual"].text, botData.flow["audiovisual"].replies);
        }
        else if (input.match(/(preço|valor|quanto|custa|investimento|orçamento)/)) {
            addBotMessage("Nossos projetos são personalizados. Quer falar com um especialista para um orçamento sob medida?", ["Sim, agora!", "Ver Serviços"]);
        }
        else if (input.match(/(agendar|falar|humano|consultoria|sim|quero)/) || input.includes("r$")) {
            addBotMessage(botData.flow.agendar.text);
            botData.flow.agendar.action(text);
        }
        else {
            addBotMessage("Ainda estou aprendendo, mas a Trino pode te ajudar! 🚀 Quer falar direto com um estrategista?", ["Falar com Estrategista", "Ver Serviços"]);
        }
    });
}

// --- Funções de Mensagem (Auxiliares) ---

function showTyping(callback) {
    const msgs = document.getElementById('chatMessages');
    const typing = document.createElement('div');
    typing.className = 'msg msg-bot typing';
    typing.id = 'temp-typing';
    typing.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;

    setTimeout(() => {
        if(document.getElementById('temp-typing')) document.getElementById('temp-typing').remove();
        callback();
    }, 1200);
}

function addBotMessage(text, replies = []) {
    const msgs = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg msg-bot';
    div.innerHTML = text.replace(/\n/g, '<br>');
    div.innerHTML += `<div class="msg-time">${getTime()}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    setReplies(replies);
}

function addUserMessage(text) {
    const msgs = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg msg-user';
    div.innerHTML = `${text}<div class="msg-time">${getTime()}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    setReplies([]);
}

function setReplies(replies) {
    const qr = document.getElementById('quickReplies');
    qr.innerHTML = '';
    replies.forEach(r => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply';
        btn.textContent = r;
        btn.onclick = () => handleInput(r);
        qr.appendChild(btn);
    });
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    handleInput(text);
}

function goToWhatsapp(msg) {
    const phone = "5521966957715";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    setTimeout(() => window.open(url, '_blank'), 1500);
}

function getTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
}


function handleInput(text) {
    addUserMessage(text);
    const input = text.toLowerCase().trim();

    showTyping(() => {
        // 1. Captura o Serviço
        if (input.match(/(trafego|tráfego|anuncio|ads|google|meta)/)) {
            leadContext.servico = "Tráfego Pago";
            addBotMessage(botData.flow["trafego"].text, botData.flow["trafego"].replies);
        }
        else if (input.match(/(video|vídeo|audiovisual|produção|cinema)/)) {
            leadContext.servico = "Audiovisual";
            addBotMessage(botData.flow["audiovisual"].text, botData.flow["audiovisual"].replies);
        }
        
        // 2. Captura Detalhes (Faturamento ou Tipo de Vídeo)
        else if (input.match(/(iniciante|r\$|acima de|vídeos para|portfólio)/)) {
            leadContext.detalhe = text; // Salva o valor clicado (ex: "Acima de R$ 100k")
            addBotMessage(botData.flow.agendar.text);
            
            // Monta o resumo final
            const resumo = `Serviço: ${leadContext.servico} | Perfil: ${leadContext.detalhe}`;
            botData.flow.agendar.action(resumo);
        }

        // 3. Outros fluxos...
        else if (input.match(/^(oi|olá|ola|hey|bom dia|boa tarde|boa noite)/)) {
            addBotMessage("Olá! 😊 Como posso ajudar a Trino a escalar seu negócio hoje?", botData.flow.options);
        }
        else if (input.match(/(preço|valor|quanto|custa|investimento|orçamento)/)) {
            addBotMessage("Nossos projetos são personalizados. Quer falar com um especialista para um orçamento?", ["Sim, agora!", "Ver Serviços"]);
        }
        else if (input.match(/(agendar|falar|humano|consultoria|sim|quero)/)) {
            const resumo = leadContext.servico ? `Interesse em ${leadContext.servico}` : "Interesse Geral";
            addBotMessage(botData.flow.agendar.text);
            botData.flow.agendar.action(resumo);
        }
        else {
            addBotMessage("Ainda estou aprendendo, mas a Trino pode te ajudar! 🚀 Quer falar direto com um estrategista?", ["Falar com Estrategista", "Ver Serviços"]);
        }
    });
}

function goToWhatsapp(resumoLead) {
    const phone = "5521966957715";
    
    // Formatação Profissional para o Consultor
    const mensagemFinal = `Olá! Vim pelo chat do site. ⚡
    
--- 📋 RESUMO DO LEAD ---
📌 Objetivo: ${resumoLead}
-------------------------

Quero agendar minha consultoria estratégica!`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(mensagemFinal)}`;
    
    // Pequeno delay para o usuário ler a última mensagem da Ana antes de sair
    setTimeout(() => window.open(url, '_blank'), 1200);
}