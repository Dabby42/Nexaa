import { config } from "app/config/config";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: config.mysql.connection.host,
  username: config.mysql.connection.user,
  password: config.mysql.connection.password,
  database: config.mysql.connection.database,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/app/db/migrations/*.js"],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
