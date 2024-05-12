import { Module } from "@nestjs/common";
// import { AppController } from "./app.controller";
// import { AppService } from "./app.service";
import { WebhookController } from "./webhook/webhook.controller";
import { WebhookService } from "./webhook/webhook.service";

@Module({
  imports: [],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class AppModule { }
