const fs = require('fs');
const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'borzi-v2' }),
  puppeteer: {
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', qr => {
  qrcode.toFile('./qrcode.png', qr, {
    color: {
      dark: '#000',
      light: '#FFF',
    },
  }, function (err) {
    if (err) {
      console.error('❌ Erro ao gerar QR Code:', err);
    } else {
      console.log('✅ QR Code gerado como imagem: qrcode.png');
      console.log('📱 Abra esse arquivo para escanear com o WhatsApp!');
    }
  });
});

client.on('ready', () => {
  console.log('✅ Tudo certo! WhatsApp conectado.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('message', async msg => {
  if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) && msg.from.endsWith('@c.us')) {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname;

    await delay(2000);
    await chat.sendStateTyping();
    await delay(2000);

    await client.sendMessage(msg.from,
      `Olá, ${name.split(" ")[0]}! 🙌\n\nSou a assistente virtual do *Mentor de Alta Performance, André Borzi*! Digite uma opção para continuar:\n\n` +
      `1 - Conheça o Mentor André Borzi\n` +
      `2 - Agendar uma sessão on-line com André Borzi\n` +
      `3 - Realizar a Análise de Perfil Comportamental\n` +
      `4 - Baixar e-books para auto-desenvolvimento\n` +
      `5 - Cancelar uma sessão agendada`
    );
  }

  if (msg.body === '1') {
    await client.sendMessage(msg.from,
      '👨‍🏫 *Quem é André Borzi:*\n\nCasado com Aline e pai da Beatriz, fundou a CoHE Institute nos EUA após especialização em Coaching e Gestão. Atua desde 2005 em liderança e é apaixonado por transformar vidas com fé, planejamento e dedicação.'
    );
  }

  if (msg.body === '2') {
    await client.sendMessage(msg.from,
      '📅 *Agende sua sessão:*\n\nClique no link para marcar:\nhttps://calendly.com/andreborzi/30min'
    );
  }

  if (msg.body === '3') {
    await client.sendMessage(msg.from,
      '🧠 *Análise de Perfil Comportamental:*\n\nClique no link para preencher o formulário:\nForm.google.com'
    );
  }

  if (msg.body === '4') {
    await client.sendMessage(msg.from,
      '📚 *E-books de Auto-Desenvolvimento:*\n\nEscolha o material que te ajudará:\nKwifi.com'
    );
  }

  if (msg.body === '5') {
    await client.sendMessage(msg.from,
      '❌ *Cancelar Sessão:*\n\nAcesse o e-mail cadastrado no agendamento e clique em *Cancelar Agendamento*.'
    );
  }
});