const app = require('./app');
const connectToDB = require('./config/db.config');
const PORT = process.env.PORT || 5000;

connectToDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
