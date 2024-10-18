import app from './index';
import swaggerSetup from './swagger';

const PORT = process.env.PORT || 3000;
swaggerSetup(app);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});