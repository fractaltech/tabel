module.exports = {
  db: {
    client: 'postgresql',
    connection: {
      database: 'tabel_test',
      host: 'localhost',
      port: 5432,
      user: 'dev',
      password: 'dev'
    },
    migrations: 'knex_migrations'
  },
  redis: {
    host: 'localhost',
    port: '6379',
    keyPrefix: 'test.tabel.',
    password: '28890c0b3a775ebd22755c0a1a35b9f4'
  }
};
