import { config } from "app/config/config";
import { DataSource, DataSourceOptions } from "typeorm";

export const magentoDataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: config.mysql.magento.connection.host,
  username: config.mysql.magento.connection.user,
  password: config.mysql.magento.connection.password,
  database: config.mysql.magento.connection.database,
  logging: true,
};
const dataSource = new DataSource(magentoDataSourceOptions);

export default dataSource;
