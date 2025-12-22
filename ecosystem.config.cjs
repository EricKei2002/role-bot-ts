module.exports = {
  apps: [
    {
      name: "role-bot",
      script: "./dist/index.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
