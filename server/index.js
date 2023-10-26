const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const WEBSITE_URL = "http://localhost:3000";
function serveHtml(res, filename) {
  const home = fs.readFileSync(
    path.join(__dirname, "..", "public", `${filename}.html`),
    { encoding: "utf8" },
  );
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(home);
}
function notFound(res) {
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Not Found!" }));
}
const contentTypeDefault = {
  ".css": "text/css",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpg",
  ".png": "image/png",
  ".js": "text/javascript",
};
function getURL(req) {
  const url = new URL(`${WEBSITE_URL}${req.url}`);
  return url;
}
const server = http.createServer((req, res) => {
  var _a;
  const reqUrl = (_a = req.url) !== null && _a !== void 0 ? _a : "";
  const url = getURL(req);
  if (req.method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Berhasil Ditambahkan!" }));
    return;
  }
  const publicFolder = ["css", "images", "scripts"];
  const isAccesingPublicFolder = publicFolder.some((folder) =>
    reqUrl.includes(folder),
  );
  if (isAccesingPublicFolder) {
    const fileText = fs.readFileSync(
      path.join(__dirname, "..", "public", reqUrl),
    );
    const extName = path.extname(reqUrl);
    res.writeHead(200, { "Content-Type": contentTypeDefault[extName] });
    res.end(fileText);
    return;
  }
  switch (url.pathname) {
    case "/":
      serveHtml(res, "index");
      break;
    case "/cars":
      serveHtml(res, "cars");
      break;
    default:
      notFound(res);
  }
});
server.listen(3000);
