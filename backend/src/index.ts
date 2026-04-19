import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import activityRoutes from './routes/activity.routes';
import {errorHandler} from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Global middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Feature routes
app.use('/auth', authRoutes);
app.use('/clients', clientRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/activities', activityRoutes);


app.get('/', (req, res) => {
    res.json({message: 'FreelaFloww API rodando com sucesso!'})
});

// Centralized error handling must be registered after routes
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})