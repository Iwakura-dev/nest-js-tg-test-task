import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import crypto from 'crypto';

const botTokens = ["7102331609:AAGnUAIWRo5X9LWiBJl5uKr_F2PuFXDOuHM", "7172614039:AAHK7Fltpr4eT4H7iOTzoyLc7QNqEWEEoz8"];

@Injectable()
export class WebhookService {
  private logger = new Logger('WebhookService');
  private bots = [];

  constructor() {
    botTokens.forEach(token => {
      const bot = new Telegraf(token);
      bot.telegram.getMe().then(botInfo => {
        this.bots.push({ bot, botInfo, token });
        this.setWebhook(bot, botInfo, token);
        this.logger.log(`Bot added: ${botInfo.username}`);
      });
      bot.command('start', (ctx) => ctx.reply(`Привет! Я ${ctx.botInfo.username}`));
    });
  }

  findBotByUsername(username: string) {
    this.logger.log(`Finding bot by username: ${username}`);
    const bot = this.bots.find(({ botInfo }) => botInfo.username === username);
    if (bot) {
      this.logger.log(`Bot found: ${bot.botInfo.username}`);
    } else {
      this.logger.error(`Bot not found for username: ${username}`);
    }
    return bot?.bot;
  }

  private async setWebhook(bot: Telegraf, botInfo, token: string) {
    const url = `https://25f0-151-249-160-17.ngrok-free.app/webhook/${botInfo.username}`;
    await axios.post(`https://api.telegram.org/bot${token}/setWebhook?url=${url}`);
    this.logger.log(`Webhook set for bot: ${botInfo.username}`);
  }

  verifyUpdate(update: any, signature: string, secret: string): boolean {
    const hash = crypto.createHmac('sha256', secret).update(JSON.stringify(update)).digest('hex');
    return hash === signature;
  }
}