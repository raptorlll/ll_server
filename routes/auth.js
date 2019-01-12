const mongoose = require('mongoose');
const passport = require('passport');
const _ = require("lodash");
require('../config/passport');
const auth = require('./helpers/jwt');
const userFields = require('../models/users/common').fieldsForUserType;

const User = mongoose.model('User');

const checkUserFields = (user, fields) => {
  return !_.difference(fields, Object.keys(user)).length;
};

const createUserObject = async (user) => {
  if (checkUserFields(user, userFields.teacher)) {
    const TeacherModel = mongoose.model('Teacher');
    const teacher = new TeacherModel(_.pick(user, ["email",]));
    teacher.setPassword(user.password);

    await Promise.all([
      teacher.setCountry(user.country),
      teacher.setLanguages(user.languages)
    ]);

    return Promise.resolve(teacher);
  }

  if (checkUserFields(user, userFields.pupil)) {
    const PupilModel = mongoose.model('Pupil');
    const pupilModel = new PupilModel(_.pick(user, ["email", "birthday",]));
    pupilModel.setPassword(user.password);


    await Promise.all([
      pupilModel.setCountry(user.country),
      pupilModel.setLanguages(user.languages)
    ]);

    return Promise.resolve(pupilModel);
  }

  return Promise.reject();
};

const getValidationErrorObject = (user) => {
  return {
    errors: {
      generic: "Check that you have send proper fields"
    }
  };
};

const authRoutes = (app) => {
  app.post('/', auth.optional, async (req, res, next) => {
    const { body: { user } } = req;
    let userObject

    try {
      userObject = await createUserObject(user)
    } catch (e) {
      return res.status(422).json(getValidationErrorObject(user));
    }

    return userObject.save()
      .then(() => {
        return res.json({ user: userObject.toAuthJSON() })
      })
      .catch((error) => {
        return res.status(422).json(error);
      });
  });

  //POST login route (optional, everyone has access)
  app.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if(!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if(err) {
        return next(err);
      }

      if(passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();

        return res.json({ user: user.toAuthJSON() });
      }

      return status(400).info;
    })(req, res, next);
  });


  app.get('/current', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return User.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }

        return res.json({ user: user.toAuthJSON() });
      });
  });
};

module.exports = authRoutes;
