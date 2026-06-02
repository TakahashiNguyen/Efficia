import type { GlobalConfig } from "semantic-release";

const config: GlobalConfig = {
  tagFormat: "v${version}",
  repositoryUrl: "https://github.com/TakahashiNguyen/Efficia",
  branches: ["main", {
    name: "dev-*", prerelease: "${name.replace('dev-', '')}",
    channel: "${name.replace('dev-', '')}",
  }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/npm", { npmPublish: false }],
    "@semantic-release/github",
  ],
};

export default config;