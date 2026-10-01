// Local dev server (no Vercel CLI needed): serves index.html and runs
// api/config.js with ARCGIS_API_KEY loaded from .env.local.
// Usage: node dev-server.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const envFile = path.join(__dirname, ".env.local");
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

const configHandler = require("./api/config.js");
const port = process.env.PORT || 3000;

http.createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;

  if (pathname === "/api/config") {
    res.send = (body) => res.end(body);
    return configHandler(req, res);
  }

  const page = pathname === "/" ? "index.html" : pathname.slice(1);
  if (page === "index.html" || page === "on-hold.html") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return fs.createReadStream(path.join(__dirname, page)).pipe(res);
  }

  res.statusCode = 404;
  res.end("Not found");
}).listen(port, "127.0.0.1", () => {
  console.log(`Fibre network planner running at http://localhost:${port}`);
  if (!process.env.ARCGIS_API_KEY) {
    console.warn("ARCGIS_API_KEY is not set - add it to .env.local");
  }
});
