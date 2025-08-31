/* eslint-disable no-console */
'use strict';

const http = require('node:http');

function createServer() {
  const server = http.createServer((req, res) => {
    const sanitizedUrl = new URL(req.url, `http://${req.headers.host}`);
    const urlParts = sanitizedUrl.pathname
      .replace(/\/+/g, '/')
      .split('/')
      .filter(Boolean);
    const searchParams = new Set(sanitizedUrl.searchParams.keys());
    const searchParamsResult = {};

    for (const key of searchParams) {
      const values = sanitizedUrl.searchParams.getAll(key);

      searchParamsResult[key] = values.length > 1 ? values : values[0];
    }

    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', 'application/json');

    res.end(
      JSON.stringify({
        parts: urlParts,
        query: searchParamsResult,
      }),
    );
  });

  return server;
}

module.exports = {
  createServer,
};
