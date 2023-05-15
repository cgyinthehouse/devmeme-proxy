import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "dotenv";
import cors from "cors";
config();

const app = express();
const port = process.env.PORT || 3000;
const apikey = process.env.APIKEY || "";
const server = process.env.MEME_API_SERVER || "";

app.use(cors());

app.use(
  "/api",
  createProxyMiddleware({
    target: server,
    changeOrigin: true,
    pathRewrite: { "^/api": "/rest/v1/memes" },
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader("apikey", apikey);
      const queries: {
        [quries: string]: string;
      } = {
        select: "*",
        offset: "0",
        order: "id.asc",
        limit: req.query.limit?.toString() || "100",
      };
      const queryString = Object.keys(queries)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(queries[key])}`
        )
        .join("&");
      proxyReq.path += `?${queryString}`;
    },
  })
);

app.listen(port, () => console.log(`server started on port ${port}`));
