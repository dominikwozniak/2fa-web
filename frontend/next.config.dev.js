module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'file-upload-bucket-public.s3.eu-central-1.amazonaws.com',
    ],
  },
};
