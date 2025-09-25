const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // ✅ Import path
const sequelize = require('./src/config/db')
const test = require('./src/models/Test');
// Import routes
const authRoutes = require('./src/routes/authRoutes');
const departmentRoutes = require('./src/routes/departmentRoutes');
const rightsRoutes = require('./src/routes/rightsRoute');
const rolesRoutes = require('./src/routes/rolesRoute');
const employeeRoutes = require('./src/routes/employeeRoutes');
// const userRoutes = require('./src/routes/userRoutes'); // 👈 Add this
const profileRoutes = require('./src/routes/profileRoutes');
 const documentRoutes = require('./src/routes/documentRoutes');
const workflowRoutes = require('./src/routes/workflowRoutes');
const workflowStepRoutes = require('./src/routes/workflowStepRoutes');
const userRoutes = require('./src/routes/userRoutes');
const roleRightsRoute = require('./src/routes/roleRightsRoute');
const customerRoutes = require('./src/routes/customerRoutes');
const brandRoutes = require('./src/routes/brandRoutes');
const fgNameRoutes = require('./src/routes/fgNameRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const authMiddleware =require('./src/middlewares/auth/authMiddleware')
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/rights', rightsRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/users', userRoutes); //
app.use('/api/profile', profileRoutes);
app.use('/api/documents', documentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/workflows', workflowRoutes);
app.use('/api/workflow-steps', workflowStepRoutes);
app.use('/api/roleRights', roleRightsRoute);
app.use('/api/customers', customerRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/fg-name', fgNameRoutes);
app.use('/api/order', orderRoutes);


// (async () => {   
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Database connection established successfully.');

//     // Sync all models
//     await sequelize.sync({ force: true }); 
//     console.log('✅ All models were synchronized successfully.');
//   } catch (error) {
//     console.error('❌ Unable to connect to the database:', error);
//   }
// })();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
