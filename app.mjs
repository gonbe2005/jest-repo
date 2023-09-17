import { createServer } from 'http';
import { parse } from 'url';
import { stringify } from 'querystring';

const PORT = 3000;

const handleRequest = (req, res) => {
  const { method, url } = req;
  const parsedUrl = parse(url, true);

  if (method === 'POST' && parsedUrl.pathname === '/return') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const requestBody = JSON.parse(body);

      const responseBody = {
        proCode: requestBody.proCode,
        batteryId: requestBody.batteryId,
        slotNo: requestBody.slotNo,
        rDt: new Date().toISOString()
      };

      res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify(responseBody));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});