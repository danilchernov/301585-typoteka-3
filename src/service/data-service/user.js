"use strict";

const bcrypt = require(`bcrypt`);

const SALT_ROUNDS = 10;

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);

    userData.passwordHash = passwordHash;
    delete userData.password;
    delete userData.repeteadPassword;

    const count = await this._User.count();
    userData.admin = count === 0;

    const user = await this._User.create(userData);

    return user.get();
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: { email },
    });

    return user && user.get();
  }
}

module.exports = UserService;
