import express from 'express';
import dotenv from 'dotenv';
import v1Routes from './routes/v1';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middlewares/authMiddleware';
import { setupSwagger } from './utils/swagger';
//import { authorize } from './middlewares/rbacMiddleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// app.use(authMiddleware); use only on auth routes

app.use('/api/v1', v1Routes);
//app.get('/admin-data', authorize(['ADMIN']), someAdminController); // ✅ Only ADMINs can access


// ✅ Initialize Swagger UI
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`📄 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
