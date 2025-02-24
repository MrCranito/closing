export interface IAppConfig {
  name: string;
  version: string;
  port: number;
  uptime: () => number;
}

const config: IAppConfig = {
  name: 'Closing Api',
  version: '1.0.0',
  port: parseInt(process.env.API_PORT) || 8080,
  uptime: process.uptime,
};

export default () => ({
  app: config,
});
