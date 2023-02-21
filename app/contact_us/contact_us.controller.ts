import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ContactUsDto } from "./dto/contact_us.dto";
import { NotificationService } from "../notification/notification.service";
import { sendSuccess } from "../utils/helpers/response.helpers";

@Controller("contact-us")
export class ContactUsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async sendContactUs(@Body() contactUsDto: ContactUsDto) {
    try {
      await this.notificationService.send("email", "hermes", "olamide.aboyeji@konga.com", "yes", "help@konga.com", "Konga Affiliate", contactUsDto);

      return sendSuccess(null, "Contact message received.");
    } catch {
      throw new BadRequestException("Unable to submit contact us request");
    }
  }
}
