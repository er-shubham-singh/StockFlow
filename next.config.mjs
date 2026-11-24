import fs from "fs";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push({
        apply(compiler) {
          compiler.hooks.afterEmit.tap("SyncServerChunksPlugin", () => {
            try {
              // Only copy from .next/server/chunks to .next/server if chunks exist
              const projectRoot = compiler.context;
              const chunksDir = path.join(projectRoot, ".next", "server", "chunks");
              const serverDir = path.join(projectRoot, ".next", "server");

              if (fs.existsSync(chunksDir)) {
                const files = fs.readdirSync(chunksDir);
                for (const file of files) {
                  // Only copy top-level chunk .js files (like 422.js)
                  if (file.endsWith(".js")) {
                    const src = path.join(chunksDir, file);
                    const dest = path.join(serverDir, file);
                    // Do not overwrite existing files
                    if (!fs.existsSync(dest)) {
                      fs.copyFileSync(src, dest);
                    }
                  }
                }
              }
            } catch (e) {
              // silent
            }
          });
        },
      });
    }
    return config;
  },
};

export default nextConfig;
