import express from 'express';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'project-management-api',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
