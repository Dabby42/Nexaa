"use strict";

const appName = "hera-be";

export const config = {
  appName,
  environment: process.env.NODE_ENV,
  web: {
    port: process.env.APP_PORT,
  },
  logging: {
    file: process.env.LOG_PATH,
    level: process.env.LOG_LEVEL,
    console: process.env.LOG_ENABLE_CONSOLE || true,
  },
  salt: Number(process.env.SALT_WORK_FACTOR),
  baseUrl: process.env.BASE_URL,
  mysql: {
    connection: {
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT) || 3306,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      debug: process.env.DATABASE_DEBUG || false,
    },
    pool: {
      min: process.env.DATABASE_POOL_MIN ? Number(process.env.DATABASE_POOL_MIN) : 2,
      max: process.env.DATABASE_POOL_MAX ? Number(process.env.DATABASE_POOL_MAX) : 2,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    db: Number(process.env.REDIS_DB) || 0,
  },
  social_login: {
    google: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY,
  },
  oauth: {
    client_id: process.env.OAUTH_CLIENT_ID,
    client_secret: process.env.OAUTH_CLIENT_SECRET,
    cache_key: appName,
    url: process.env.OAUTH_URL,
    timeout: parseInt(process.env.OAUTH_REQUEST_TIMEOUT),
    retry: {
      count: parseInt(process.env.OAUTH_RETRY_COUNT),
      delay: parseInt(process.env.OAUTH_RETRY_DELAY),
    },
  },
  hermes: {
    url: process.env.HERMES_API_URL,
    scope: process.env.HERMES_SCOPE,
    contact_us: {
      template_name: process.env.CONTACT_US_TEMPLATE_NAME,
      recipient: process.env.CONTACT_US_RECIPIENT,
      sender: process.env.CONTACT_US_SENDER,
      subject: process.env.CONTACT_US_SUBJECT,
      sender_id: process.env.CONTACT_US_SENDER_ID,
    },
  },
};
