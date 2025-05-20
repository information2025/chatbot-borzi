const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'borzi' }),
  puppeteer: {
    headless: false, // Mostrar o navegador para escanear o QR code
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot Borzi conectado com sucesso!');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

async function responder(chat, to, mensagem) {
  await delay(2000);
  await chat.sendStateTyping();
  await delay(2000);
  await client.sendMessage(to, mensagem);
}

async function mostrarMenu(chat, nome, to) {
  const menu = `Olá, ${nome}! 👋\n\nSou a assistente virtual do *Mentor de Alta Performance, André Borzi*! 💼\n\nDigite a opção abaixo para que eu possa te ajudar:\n\n` +
    '1 - Conheça o Mentor André Borzi\n' +
    '2 - Agendar uma sessão on-line com André Borzi\n' +
    '3 - Realizar a Análise de Perfil Comportamental com devolutiva de 1 hora com André Borzi\n' +
    '4 - Baixar os e-books para auto-desenvolvimento\n' +
    '5 - Cancelar uma sessão agendada';

  await responder(chat, to, menu);
}

const respostas = {
  '1': '👨‍🏫 *Quem é André Borzi?*\n\nCasado com a Aline e pai da Beatriz, fundei a CoHE Institute nos EUA após uma especialização em Coaching e Gestão nos Estados Unidos. Percebi a carência de treinamentos em português para brasileiros vivendo fora do Brasil.\n\nAtuei em grandes empresas no setor de tecnologia, liderei equipes desde o início da minha carreira e sou formado pela Universidade Presbiteriana Mackenzie. Tenho pós-graduação em Gestão de Pessoas, além de formação em PNL, Leadership Empowerment e Coaching.\n\nSou cristão, apaixonado por Jesus, e acredito que todo projeto de Deus merece planejamento e dedicação! 🙏',
  '2': '📅 *Agendamento de Sessão Online:*\n\nClique no link abaixo e marque o dia e horário que for melhor para você:\n👉 https://calendly.com/andreborzi/30min',
  '3': '🧠 *Análise de Perfil Comportamental:*\n\nClique no link e preencha o formulário:\n👉 Form.google.com',
  '4': '📚 *Baixar e-books para auto-desenvolvimento:*\n\nClique no link e escolha o material ideal para você:\n👉 kwifi.com',
  '5': '❌ *Cancelar sessão agendada:*\n\nAcesse o e-mail cadastrado no agendamento e clique em *cancelar agendamento*. Caso tenha dúvidas, me avise por aqui.'
};

client.on('message', async msg => {
  console.log("Recebido:", msg.body);

  const chat = await msg.getChat();
  const isPrivate = msg.from.endsWith('@c.us');
  const contact = await msg.getContact();
  const name = contact.pushname || 'amigo(a)';
  const content = msg.body.trim();

  if (/^(menu|oi|olá|ola|bom dia|boa tarde|boa noite)$/i.test(content) && isPrivate) {
    console.log("Entrou no menu");
    await mostrarMenu(chat, name.split(" ")[0], msg.from);
    return;
  }

  if (respostas[content] && isPrivate) {
    await responder(chat, msg.from, respostas[content]);
  }
});
