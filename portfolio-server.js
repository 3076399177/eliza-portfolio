const fs = require("fs");
const http = require("http");
const path = require("path");

const root = process.cwd();
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".webp": "image/webp",
};

const sendFile = (request, response, filePath) => {
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    const range = request.headers.range;

    if (range) {
      const match = /bytes=(\d*)-(\d*)/.exec(range);
      const start = match && match[1] ? Number(match[1]) : 0;
      const end = match && match[2] ? Number(match[2]) : stats.size - 1;

      if (start >= stats.size || end >= stats.size) {
        response.writeHead(416, { "Content-Range": `bytes */${stats.size}` });
        response.end();
        return;
      }

      response.writeHead(206, {
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Content-Type": contentType,
      });
      fs.createReadStream(filePath, { start, end }).pipe(response);
      return;
    }

    response.writeHead(200, {
      "Accept-Ranges": "bytes",
      "Content-Length": stats.size,
      "Content-Type": contentType,
    });
    fs.createReadStream(filePath).pipe(response);
  });
};

http
  .createServer((request, response) => {
    const requestPath = decodeURIComponent(request.url.split("?")[0]);

    const externalMatch = /^\/external\/([A-Za-z])\/(.+)$/.exec(requestPath);
    if (externalMatch) {
      const [, drive, externalPath] = externalMatch;
      sendFile(request, response, `${drive}:\\${externalPath.replace(/\//g, "\\")}`);
      return;
    }

    const filePath = path.join(root, requestPath === "/" ? "index.html" : requestPath);

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    sendFile(request, response, filePath);
  })
  .listen(5500, "127.0.0.1", () => {
    console.log("http://127.0.0.1:5500/");
  });
