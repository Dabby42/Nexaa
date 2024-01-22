import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FacebookService {
  async getUserPages(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(`https://graph.facebook.com/v13.0/me/accounts`, {
        params: { access_token: accessToken },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user pages:', error);
      throw error;
    }
  }

  async postToPageFeed(accessToken: string, pageId: string, data: any): Promise<any> {
    try {
      const response = await axios.post(`https://graph.facebook.com/v13.0/${pageId}/feed`, {
        ...data,
        access_token: accessToken,
      });
      return response.data;
    } catch (error) {
      console.error('Error posting to page feed:', error);
      throw error;
    }
  }
}
