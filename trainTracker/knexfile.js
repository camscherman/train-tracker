const sharedConfig = {
  client: 'postgresql',
  migrations: {
    tableName: 'knex_migrations',
    directory: './db/migrations'
  }
}

module.exports = {
  development: {
    ...sharedConfig, // 👈 Will add all properties of sharedConfig to its parent object
    connection: {
      database: 'trainTracker_dev'
    }
  },

  staging: {
    ...sharedConfig, // 👈 Will add all properties of sharedConfig to its parent object
    connection: {
      database: 'trainTracker_sta'
    }
  },

  production: {
    ...sharedConfig, // 👈 Will add all properties of sharedConfig to its parent object
    connection: {
      database: 'trainTracker_pro'
    }
  }

};
