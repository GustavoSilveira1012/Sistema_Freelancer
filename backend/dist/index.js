"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const activity_routes_1 = __importDefault(require("./routes/activity.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const client_routes_1 = __importDefault(require("./routes/client.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
// Global middlewares
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Feature routes
app.use('/auth', auth_routes_1.default);
app.use('/clients', client_routes_1.default);
app.use('/projects', project_routes_1.default);
app.use('/tasks', task_routes_1.default);
app.use('/activities', activity_routes_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'FreelaFloww API rodando com sucesso!' });
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Centralized error handling must be registered after routes
app.use(error_middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
