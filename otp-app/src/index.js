const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const otpRoutes = require('./routes/otpRoutes');

const app = express();
app.use(bodyParser.json());

// Set up routes
app.use('/api', otpRoutes);

// Sync database and start server
sequelize.sync({force:false}).then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
