import * as http from "http";
import * as url from "url";
import * as path from 'path';
import * as fs from 'fs';
import * as mime from 'mime';

import { IncomingMessage, ServerResponse } from "http";

export class HttpGetRequestHandler {

  public handle(request: IncomingMessage, response: ServerResponse) : void {
    console.log("[%s] - %s", request.method, request.url);

    // common http headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length');
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

    if(request.method === 'OPTIONS') {
      response.statusCode = 200;
      response.end();
    }

    if(request.method === 'GET') {

      let uri = url.parse(request.url).pathname;

      // TODO-FIXME: index.html is visible in browser url with this :(
      if (uri === '/') { // redirect to /index.html
        response.writeHead(302, { 'Location': '/index.html' });
        response.end();
      }

      if(response.finished) { return; }

      let filename = path.join(process.cwd(), uri);

      fs.exists(filename, function(exists) {
          response.statusCode = exists ? 200 : 404;

          if(exists){
            // TODO-FIXME: should first check supported encodings by client
            fs.exists(filename + '.gz', function(exists) {
              if(exists) {
                filename += '.gz';
                response.setHeader('Content-Encoding', 'gzip');
              }

              let lastModified = fs.statSync(filename).mtime;

              response.setHeader('Content-Type', mime.lookup(filename));
              response.setHeader("Last-Modified", lastModified.toUTCString());

              let ifModifiedSince = request.headers["if-modified-since"];

              if(ifModifiedSince) {
                if(Math.floor(new Date(ifModifiedSince).getTime()/1000) === Math.floor(lastModified.getTime()/1000)){
                  response.statusCode = 304;
                }
              }

              fs.createReadStream(filename).pipe(response);
            });
          } else {
            response.end();
          }
      });
    }
  }
}
