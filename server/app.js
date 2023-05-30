import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import categoriesRouter from './routes/categories.js';
import transactionRouter from './routes/transactions.js';
import statisticsRouter from './routes/statistics.js';

const app = express();
app.use(express.json());

app.use(cors());

app.get('/api', (req, res) => {
    res.json({message: 'Hello from node server! TEST!'});
});

app.use('/api/auth', userRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/statistics', statisticsRouter);

app.use((req, res) => {
    res.status(404).json({message: 'Not found'});
});

app.use((err, req, res, next) => {
    res.status(500).json({message: err.message});
});

export default app;
