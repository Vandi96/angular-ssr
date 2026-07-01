import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { createProductResponse, getProductById } from './app/products/product.repository';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

app.get('/api/products', (_req, res) => {
  setTimeout(() => {
    res.json(createProductResponse('Express API'));
  }, 900);
});

app.get('/api/products/:id', (req, res) => {
  setTimeout(() => {
    const product = getProductById(Number(req.params['id']));

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  }, 500);
});

app.post('/api/contact', (req, res) => {
  const body = req.body as Partial<{ email: string; message: string; name: string; topic: string }>;

  if (!body.name || !body.email || !body.message || !body.topic) {
    res.status(400).json({ message: 'Every field is required.' });
    return;
  }

  setTimeout(() => {
    res.status(201).json({
      message: `Thanks, ${body.name}! Your message has entered orbit.`,
      receivedAt: new Date().toISOString(),
    });
  }, 700);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
