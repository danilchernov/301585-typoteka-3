"use strict";

const passwordUtils = require(`../lib/password`);

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    const passwordHash = await passwordUtils.hash(userData.password);

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

  async checkPassword(password, passwordHash) {
    return await passwordUtils.compare(password, passwordHash);
  }
}

module.exports = UserService;
