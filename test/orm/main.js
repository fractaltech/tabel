/**
 * The process we are gonna follow to "test" the orm layer of the system
 * is to basically construct a schema (using knex, which is a tested library)
 * which can stand against all features offered by this orm.
 *
 * The first test we run, we define our tables, so now they are available in all
 * subsequent tests.
 *
 * The second test that we run is our test for insertion, using which we populate our tables.
 * We check if tables got populated via knex. And knex is what we use to match our results
 * for all subsequent tests.
 */

const assert = require('assert');

const Tabel = require('../../src/Orm');

const config = require('../config');

const testTableDefinitions = require('./testTableDefinitions');
const testInsert = require('./testInsert');
const testQueryBuilding = require('./testQueryBuilding');
const testUpdate = require('./testUpdate');
const testDelete = require('./testDelete');
const testEagerLoads = require('./testEagerLoads');
const testScopesAndJoints = require('./testScopesAndJoints');
const testRelationJoints = require('./testRelationJoints');
const testReduce = require('./testReduce');
const testMap = require('./testMap');
const testShape = require('./testShape');
const testCache = require('./testCache');
const testAutoIncrementIdTables = require('./testAutoIncrementIdTables');

// handle promise errors
process.on('unhandledRejection', err => { throw err; });

runTests(...process.argv.slice(2));

function runTests() {
  return (() => {
    const orm = new Tabel(config);

    return teardownTables(orm).then(() => setupTables(orm))
      .then(() => [
        testTableDefinitions,
        testInsert,
        testQueryBuilding,
        testUpdate,
        testDelete,
        testEagerLoads,
        testScopesAndJoints,
        testRelationJoints,
        testReduce,
        testMap,
        testShape,
        testCache,
      ].reduce((chain, test) => chain.then(() => test(assert, orm)), Promise.resolve()))
      .then(() => teardownTables(orm))
      .then(() => orm.close())
    ;
  })().then(() => {
    const orm = new Tabel(config);
    return teardownAutoIncrementingTables(orm)
      .then(() => setupAutoIncrementingTables(orm))
      .then(() => testAutoIncrementIdTables(assert, orm))
      .then(() => teardownAutoIncrementingTables(orm))
      .then(() => orm.close())
    ;
  })
}

function setupTables({knex}) {
  return Promise.all([
    knex.schema.createTable('users', (t) => {
      t.uuid('id').primary();
      t.string('username');
      t.string('password');
      t.timestamps();
    }),

    knex.schema.createTable('roles', (t) => {
      t.uuid('id').primary();
      t.string('name').unique();
      t.timestamps();
    }),

    knex.schema.createTable('user_role', (t) => {
      t.uuid('user_id');
      t.uuid('role_id');
      t.timestamps();

      t.primary(['user_id', 'role_id']);
    }),

    knex.schema.createTable('posts', (t) => {
      t.uuid('id').primary();
      t.uuid('user_id');
      t.string('title');
      t.text('body');
      t.timestamp('published_on').nullable().defaultTo(null);
      t.timestamps();
    }),

    knex.schema.createTable('comments', (t) => {
      t.uuid('id').primary();
      t.uuid('user_id');
      t.uuid('post_id');
      t.string('text', 500);
      t.boolean('is_flagged').defaultTo(false);
      t.timestamps();
    }),

    knex.schema.createTable('photos', (t) => {
      t.uuid('id').primary();
      t.string('doc_type');
      t.uuid('doc_id');
      t.string('url');
      t.timestamps();

      t.index(['doc_type', 'doc_id']);
    }),

    knex.schema.createTable('photo_details', (t) => {
      t.uuid('photo_id').primary();
      t.string('title');
      t.string('about', 1000);
      t.timestamps();
    }),

    knex.schema.createTable('tags', (t) => {
      t.uuid('id').primary();
      t.string('name').unique();
      t.timestamps();
    }),

    knex.schema.createTable('tagable_tag', (t) => {
      t.string('tagable_type');
      t.uuid('tagable_id');
      t.uuid('tag_id');
      t.timestamps();

      t.primary(['tagable_type', 'tagable_id', 'tag_id']);
    })
  ]);
}

function teardownTables({knex}) {
  return Promise.all([
    'users', 'roles', 'user_role', 'posts', 'comments', 'photos',
    'photo_details', 'tags', 'tagable_tag'
  ].map((t) => knex.schema.dropTableIfExists(t)));
}

function setupAutoIncrementingTables({knex}) {
  return Promise.all([
    knex.schema.createTable('products', (t) => {
      t.increments('id');
      t.integer('category_id').unsigned();
      t.string('name');
      t.timestamps();
    }),

    knex.schema.createTable('categories', (t) => {
      t.increments('id');
      t.string('name');
      t.timestamps();
    }),

    knex.schema.createTable('sellers', (t) => {
      t.increments('id');
      t.string('name');
      t.timestamps();
    }),

    knex.schema.createTable('product_seller', (t) => {
      t.integer('product_id').unsigned();
      t.integer('seller_id').unsigned();

      t.primary(['product_id', 'seller_id']);
    })
  ]);
}

function teardownAutoIncrementingTables({knex}) {
  return Promise.all(['products', 'categories', 'sellers', 'product_seller'].map(t => knex.schema.dropTableIfExists(t)));
}
