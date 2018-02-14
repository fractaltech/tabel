# Tabel - node.js ORM for PostgreSQL

## A simple orm for PostgreSQL, built over [knex.js](http://knexjs.org/) which works with simple javascript objects and arrays.

#### MIT License

`npm install --save tabel`

[Read the docs](http://tabel.fractaltech.in).

Following tests are available:
1. `npm run test.orm`
2. `npm run test.collisions`
3. `npm run test.migrator`
4. `npm run test.migrate.cli`

Before running tests, copy `test/config.sample.js` to `test/config.js`.

Todo:

1. Implement a better caching story.
2. Decide whether to expose orm's meta-capabilities to devs.
