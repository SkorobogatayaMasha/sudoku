const express = require('express');

function BaseController(service, promiseHandler) {
    const self = this;

    this.registerRoutes = registerRoutes;
    this.router = express.Router();
    this.routes = {
        '/': [{ method: 'get', cb: readAll }],
        '/create': [{ method: 'post', cb: create }]
    };

    function readAll(req, res) {
        promiseHandler(res, service.readChunk(req.params));
    }

    function create(req, res) {
        promiseHandler(res, service.create(req.body));
    }

    function registerRoutes() {
        for (const route in self.routes) {
            if (!self.routes.hasOwnProperty(route)) {
                continue;
            }

            const handlers = self.routes[route];

            if (handlers === undefined) continue;

            for (const handler of handlers) {
                self.router[handler.method](route, handler.cb);
            }
        }
    }
}

module.exports = BaseController;