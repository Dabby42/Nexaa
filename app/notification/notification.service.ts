import { Injectable } from "@nestjs/common";
import { config } from "../config/config";
import { HttpService } from "@nestjs/axios";
import { AxiosError } from "axios";
import { catchError, firstValueFrom } from "rxjs";

@Injectable()
export class NotificationService {
  constructor(private readonly httpService: HttpService) {}

  async send(medium: string, template_name: string, recipient: string, subject: string, sender: string, sender_id: string, params: any) {
    const formData = {
      medium,
      name: template_name,
      recipient,
      subject,
      sender,
      sender_id,
      params,
    };
    let url = config.hermes.url;
    if (!config.hermes.use_queue) url += "?no_queue=true";
    const { data } = await firstValueFrom(
      this.httpService.post(url, formData).pipe(
        catchError((error: AxiosError) => {
          throw error.response.data;
        })
      )
    );
    return data;
  }
}
