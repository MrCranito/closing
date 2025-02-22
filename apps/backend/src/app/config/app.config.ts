export interface IAppConfig {
  name: string;
  version: string;
  port: number;
  uptime: () => number;
}

const config: IAppConfig = {
  name: process.env.npm_package_name,
  version: process.env.npm_package_version,
  port: parseInt(process.env.PORT) || 8080,
  uptime: process.uptime,
};

export default () => ({
  app: config,
});
