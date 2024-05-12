import { Body, Controller, Logger, Param, Post, Req } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Request } from 'express';

@Controller('webhook')
export class WebhookController {
  private logger = new Logger('WebhookController');

  constructor(private webhookService: WebhookService) { }

  @Post(':botUsername')
  async handleUpdate(@Req() request: Request, @Body() update, @Param('botUsername') botUsername: string) {
    this.logger.log(`Received update for bot: ${botUsername}`);

    const bot = this.webhookService.findBotByUsername(botUsername);
    if (bot) {
      await bot.handleUpdate(update);
      this.logger.log(`Update handled for bot: ${botUsername}`);
    } else {
      this.logger.error(`Bot not found for username: ${botUsername}`);
    }

    return { ok: true };
  }
}