import * as OAuth2 from "konga-oauth2";
import * as provide from "konga-accesstoken-provider";
import * as Hermes from "konga-hermes";
import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { config } from "../config/config";

@Injectable()
export class NotificationService {
  hermesClient: Hermes;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    const oauth = new OAuth2(config.oauth.url, config.oauth.client_id, config.oauth.client_secret, cacheManager, config.oauth);
    const provider = provide.create(oauth, config.hermes.scope, "hermes");
    this.hermesClient = new Hermes("https://staging-hermes.igbimo.com", provider);
  }

  async send(medium: string, name: string, recipient: string, subject: string, sender: string, sender_id: string, params: any) {
    const data = {
      medium,
      name,
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
