import { config } from "app/config/config";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: config.mysql.connection.host || "127.0.0.1",
  username: config.mysql.connection.user || "root",
  password: config.mysql.connection.password || "Daberechukwu42$",
  database: config.mysql.connection.database || "hera",
  port: config.mysql.connection.port,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/app/db/migrations/*.js"],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
