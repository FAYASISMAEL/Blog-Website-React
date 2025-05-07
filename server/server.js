import express from 'express';
import cors from 'cors';
import connection from './connection.js';
import dotenv from 'dotenv';
import url from 'url'
import path, { dirname,join } from "path"
import blog_routes from './routes/blog_routes.js';

dotenv.config();

const app = express();
const port =  3000;
const file_name = url.fileURLToPath(import.meta.url)
const __dirname = dirname(file_name)

app.use(express.json({ limit: '100mb' }));
app.use(cors())
app.use('/api', blog_routes);
app.use("/images",express.static(path.join(__dirname,"images")))

connection().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
});
