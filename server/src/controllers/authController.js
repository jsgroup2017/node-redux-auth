import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt-nodejs';
import User from '../models/user';
import { tokenForUser } from '../helpers/token';

/**
 * Sign in
 */
export const signin = (req, res) => {
  const { firstname, lastname, email } = req.user;

  res.json({ token: tokenForUser(req.user), firstname, lastname, email });
};

/**
 * Sign up
 */
export const signup = (req, res, next) => {
  const { firstname, lastname, username, email, password } = req.body;

  if (!firstname || !lastname || !username || !email || !password) {
    return res.status(422).send({ error: "all fields are required" });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err) { return next(err); }

    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }
    User.findOne({ username }, (err, existingUser) => {
      if (err) { return next(err); }

      if (existingUser) {
        return res.status(422).send({ error: "Username is in use" });
      }
      const user = new User({ firstname, lastname, username, email, password });
      user.save((err) => {
        if (err) { return next(err); }
        res.json({ token: tokenForUser(user), email, firstname, lastname });
      });
    });
  });
};
