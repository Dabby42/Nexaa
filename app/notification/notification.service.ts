import * as OAuth2 from "konga-oauth2";
import * as provide from "konga-accesstoken-provider";
import * as Hermes from "konga-hermes";
import { Injectable } from "@nestjs/common";
import { config } from "../config/config";
import { CacheService } from "../cache/cache.service";

@Injectable()
export class NotificationService {
  hermesClient: Hermes;
  constructor(private cacheService: CacheService) {
    const oauth = new OAuth2(config.oauth.url, config.oauth.client_id, config.oauth.client_secret, cacheService, config.oauth);
    const provider = provide.create(oauth, config.hermes.scope, "hermes");
    this.hermesClient = new Hermes(config.hermes.url, provider);
  }

  async send(medium: string, template_name: string, recipient: string, subject: string, sender: string, sender_id: string, params: any) {
    const data = {
      medium,
      name: template_name,
      recipient,
      subject,
      sender,
      sender_id,
      params,
    };

    return new Promise((resolve, reject) => {
      this.hermesClient.sendNotification(data, (err) => {
        /**
         * Hermes client only returns data when there is an error while trying to send the notification.
         * If the operation was successful, it does not return anything.
         * The data return is just a string about the error, so it does not provide enough context to
         * categorize the errors properly.
         */
        if (!err) {
          resolve(true);
        } else {
          console.log(err);
          if (/TemplateValidationError/.test(err)) {
            reject(new Error("Unable to send notification due to invalid template."));
          }

          reject(new Error("Unable to send notification."));
        }
      });
    });
  }
}
