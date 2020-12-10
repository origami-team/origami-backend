const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const userNameRequirementsText =
  "Parameter name must consist of at least 4 and up to 40 alphanumerics (a-zA-Z0-9), dot (.), dash (-), underscore (_) and spaces.";

const nameValidRegex = /^[^~`!@#$%^&*()+=£€{}[\]|\\:;"'<>,?/\n\r\t\s][^~`!@#$%^&*()+=£€{}[\]|\\:;"'<>,?/\n\r\t]{1,39}[^~`!@#$%^&*()+=£€{}[\]|\\:;"'<>,?/\n\r\t\s]$/;

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: [4, userNameRequirementsText],
      maxlength: [40, userNameRequirementsText],
      validate: {
        validator: function (v) {
          return nameValidRegex.test(v);
        },
        message: userNameRequirementsText,
      },
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      required: true,
      default: ["user"],
      enum: ["user", "contentAdmin", "trackAccess", "admin"],
    },
    language: {
      type: String,
      default: "de_DE",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    emailConfirmationToken: { type: String, default: uuidv4() },
    unconfirmedEmail: { type: String },
    emailIsConfirmed: { type: Boolean, default: false, required: true },
    refreshToken: { type: String },
    refreshTokenExpires: { type: Date },
  },
  { timestamps: true }
);

UserSchema.methods.mail = function mail(template, data) {
  //   return mails.sendMail(template, this, data);
};

UserSchema.methods.checkPassword = function checkPassword(plaintextPassword) {
  return bcrypt
    .compare(plaintextPassword, this.password)
    .then(function (passwordIsCorrect) {
      if (passwordIsCorrect === false) {
        throw new ModelError("Password incorrect", { type: "ForbiddenError" });
      }
      return true;
    })
    .catch(() => {
      return false;
    });
};

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.getUserById = function (id, callback) {
  User.findById(id).exec(callback);
};

module.exports.getUserByUsername = function (username, callback) {
  const query = { username: username };
  User.findOne(query).exec(callback);
};

module.exports.addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = function (password, hash, callback) {
  bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) callback(err, false);
    callback(null, isMatch);
  });
};

module.exports.changePassword = function (password, user, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user.save(callback);
    });
  });
};

module.exports.confirmEmail = function (token, email) {
  return User.findOne({
    $and: [
      { $or: [{ unconfirmedEmail: email }] },
      { emailConfirmationToken: token },
    ],
  })
    .exec()
    .then(function (user) {
      if (!user) {
        throw new Error("invalid email confirmation token", {
          type: "ForbiddenError",
        });
      }

      // set email to email address from request
      user.set("email", email);
      // mark user as confirmed
      user.set("emailConfirmationToken", undefined);
      user.set("emailIsConfirmed", true);
      user.set("unconfirmedEmail", undefined);
      return user.save();

      // User.updateMany({unconfirmedEmail: email}, {unconfirmedEmail: null} ,function(err, users){

      // });

      // return user;
    });
};

module.exports.initPasswordReset = function (email) {
  return this.findOne({ email: email.toLowerCase() })
    .exec()
    .then(function (user) {
      if (!user) {
        throw new Error("Password reset for this user not possible", {
          type: "ForbiddenError",
        });
      }
      user.resetPasswordToken = uuidv4();
      user.resetPasswordExpires = Date.now() + 12 * 60 * 60 * 1000;

      return user.save().then(function (savedUser) {
        return savedUser.mail("shop/passwordReset");
      });
    });
};

module.exports.resetPassword = function resetPassword(password, token) {
  return this.findOne({ resetPasswordToken: token })
    .exec()
    .then(function (user) {
      if (!user) {
        throw new Error("Password reset for this user not possible", {
          type: "ForbiddenError",
        });
      }

      if (Date.now() > user.resetPasswordExpires) {
        throw new Error("Password reset token expired", {
          type: "ForbiddenError",
        });
      }
      if (!password.length > 7) {
        throw new Error("Password must be at least 8 characters long", {
          type: "ForbiddenError",
        });
      }

      user.resetPasswordToken = "";
      user.resetPasswordExpires = Date.now();

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          return user.save();
        });
      });
    });
};

module.exports.changeMail = function changeMail(user, mail) {
  return this.findOne({ _id: user._id }).exec(function (err, user) {
    if (!user) {
      throw new Error("Cant change Mail for this user", {
        type: "ForbiddenError",
      });
    }
    user.emailConfirmationToken = uuidv4();
    user.unconfirmedEmail = mail;
    console.info(
      "%s  just requested email change, id: %s",
      user.email,
      user._id
    );
    user.mail("shop/confirmEmail");
    return user.save();
  });

  //   });
};

module.exports.deleteUser = function (user) {
  return User.remove({ _id: user._id })
    .exec()
    .then(function (user) {
      if (!user) {
        throw new Error("Can not delete this user", { type: "ForbiddenError" });
      }
      return "User removed";
    });
};
