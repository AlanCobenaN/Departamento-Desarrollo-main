import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 4000;
const nodeEnv = process.env.NODE_ENV || "development";
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const publicAssetsDir = process.env.PUBLIC_ASSETS_DIR || "../assets";

const env = {
  port,
  nodeEnv,
  isProd: nodeEnv === "production",
  clientOrigin,
  publicAssetsDir,
};

export default env;
