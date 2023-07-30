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
  magento: {
    connection: {
      host: process.env.MAGENTO_DATABASE_HOST,
      database: process.env.MAGENTO_DATABASE_NAME,
      user: process.env.MAGENTO_DATABASE_USERNAME,
      password: process.env.MAGENTO_DATABASE_PASSWORD,
    },
    pool: {
      min: Number(process.env.MAGENTO_DATABASE_POOL_MIN) || 2,
      max: Number(process.env.MAGENTO_DATABASE_POOL_MAX) || 5,
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
  amqp: {
    connection: {
      hostname: process.env.AMQP_HOST,
      port: process.env.AMQP_PORT,
      login: process.env.AMQP_USER,
      username: process.env.AMQP_USER,
      password: process.env.AMQP_PASSWORD,
      connectionTimeout: parseInt(process.env.AMQP_TIMEOUT),
      heartbeat: parseInt(process.env.AMQP_HEARTBEAT),
      appId: appName,
      vhost: "/",
    },
    consumers: {
      order_sync: {
        queueName: process.env.AMQP_ORDER_SYNC_QUEUE,
      },
      clicked_link: {
        queueName: process.env.AMQP_CLICKED_LINK_QUEUE,
      },
    },
  },
  hermes: {
    url: process.env.HERMES_API_URL,
    use_queue: process.env.HERMES_USE_QUEUE === "true",
    generic: {
      sender: process.env.GENERIC_EMAIL_SENDER,
      sender_id: process.env.GENERIC_EMAIL_SENDER_ID,
    },
    contact_us: {
      template_name: process.env.CONTACT_US_TEMPLATE_NAME,
      recipient: process.env.CONTACT_US_RECIPIENT,
      sender: process.env.CONTACT_US_SENDER,
      subject: process.env.CONTACT_US_SUBJECT,
      sender_id: process.env.CONTACT_US_SENDER_ID,
    },
    forgot_password: {
      template_name: process.env.FORGOT_PASSWORD_TEMPLATE_NAME,
      sender: process.env.FORGOT_PASSWORD_SENDER,
      sender_id: process.env.FORGOT_PASSWORD_SENDER_ID,
    },
  },
};
