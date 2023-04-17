import { BadRequestException, Body, Controller, Logger, Post } from "@nestjs/common";
import { ContactUsDto } from "./dto/contact_us.dto";
import { NotificationService } from "../notification/notification.service";
import { sendSuccess } from "../utils/helpers/response.helpers";
import { config } from "../config/config";

@Controller("contact-us")
export class ContactUsController {
  private readonly logger = new Logger("ContactUsService");
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async sendContactUs(@Body() contactUsDto: ContactUsDto) {
    try {
      await this.notificationService.send(
        "email",
        config.hermes.contact_us.template_name,
        config.hermes.contact_us.recipient,
        config.hermes.contact_us.subject,
        config.hermes.contact_us.sender,
        config.hermes.contact_us.sender_id,
        contactUsDto
      );

      return sendSuccess(null, "Contact message received.");
    } catch (e) {
      this.logger.log(e);
      throw new BadRequestException("Unable to submit contact us request");
    }
  }
}
