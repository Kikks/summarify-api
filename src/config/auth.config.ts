import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../db/models/User.model';

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
