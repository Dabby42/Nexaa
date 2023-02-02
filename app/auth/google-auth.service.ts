import { OAuth2Client } from "google-auth-library";

import { config } from "../config/config";
import { UnauthorizedException } from "@nestjs/common";

export class GoogleAuthService {
  oauthClient: OAuth2Client;
  constructor() {
    const clientID = config.social_login.google.client_id;
    const clientSecret = config.social_login.google.client_secret;
    this.oauthClient = new OAuth2Client(clientID, clientSecret);
  }

  async authenticate(token: string) {
    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: config.social_login.google.client_id,
      });

      const payload = ticket.getPayload();
      return payload.email;
    } catch (err) {
      throw new UnauthorizedException("Invalid credentials");
    }
  }
}
