import express from 'express';
import userroute from './routes/userroute';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/user', userroute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});