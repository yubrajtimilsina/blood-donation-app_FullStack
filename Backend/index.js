const app = require('./app');
const dotenv = require('dotenv');
const dbConnection = require('./utils/db');


dotenv.config();

// Port from env with fallback
const PORT = process.env.PORT || 3000


//Server setup
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    dbConnection();
}); 