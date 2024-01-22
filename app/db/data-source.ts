import { config } from "app/config/config";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: config.mysql.connection.host || "mysql-399394b2-nwafordabere-5cc0.a.aivencloud.com",
  username: config.mysql.connection.user || "avnadmin",
  password: config.mysql.connection.password || "AVNS_euIHtMjYRMyHxm1Uxfm",
  database: config.mysql.connection.database || "defaultdb",
  port: config.mysql.connection.port || 24967,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/app/db/migrations/*.js"],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
