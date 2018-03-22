import passport from 'passport';
import { signin, signup } from './controllers/authController';
import { fetchUsers } from './controllers/usersController';
import passportService from './services/passport';

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const router = (app) => {
  app.get('/', requireAuth, fetchUsers);
  app.post('/signup', signup);
  app.post('/signin', requireSignin, signin);
};

export default router;
