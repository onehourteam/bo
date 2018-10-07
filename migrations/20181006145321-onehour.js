'use strict';

var dbm;
var type;
var seed;
var async = require('async');
var dataType = require('db-migrate-shared').dataType;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  async.series([
    db.createTable.bind(db, 'users', {
      id: { type: dataType.INTEGER, primaryKey: true },
      first_name: dataType.STRING,
      last_name: dataType.STRING,
      email: { type: dataType.CHAR, notNull: true },
      descriptions: dataType.CHAR,
      status: { type: dataType.SMALLINT, notNull: true },
      data: dataType.BLOB,
      created_time: { type: dataType.DATE_TIME, notNull: true },
      updated_time: dataType.DATE_TIME,
    }),
    db.createTable.bind(db, 'books', {
      id: { type: dataType.INTEGER, primaryKey: true },
      title: { type: dataType.CHAR, notNull: true },
      author: dataType.CHAR,
      description: dataType.CHAR,
    }),
    db.createTable.bind(db, 'users_books', {
      id: { type: dataType.INTEGER, primaryKey: true },
      user_id: { type: dataType.INTEGER, notNull: true },
      book_id: { type: dataType.INTEGER, notNull: true },
      description: dataType.CHAR,
      message: dataType.CHAR, // message for borrower
      duration: dataType.INTEGER, // time to read (store in minute)
    }),
    db.createTable.bind(db, 'locations', {
      id: { type: dataType.INTEGER, primaryKey: true },
      location: { type: dataType.CHAR, notNull: true },
    }),
    db.createTable.bind(db, 'transactions', {
      id: { type: dataType.INTEGER, primaryKey: true },
      lender_id: { type: dataType.INTEGER, notNull: true },
      borrower_id: { type: dataType.INTEGER, notNull: true },
      user_book_id: { type: dataType.INTEGER, notNull: true },
      status: { type: dataType.SMALLINT, notNull: true },
      from_location_id: dataType.INTEGER, // use edges.id
      to_location_id: dataType.INTEGER, // use edges.id
      duration: dataType.INTEGER,
      created_time: { type: dataType.DATE_TIME, notNull: true },
      updated_time: dataType.DATE_TIME,
    }),
    db.createTable.bind(db, 'transaction_revisions', {
      id: { type: dataType.INTEGER, primaryKey: true },
      transaction_id: { type: dataType.INTEGER, notNull: true },
      revision_data: { type: dataType.BLOB, notNull: true },
      created_time: { type: dataType.DATE_TIME, notNull: true },
    }),
    // Reader testimonial
    db.createTable.bind(db, 'feedback', {
      id: { type: dataType.INTEGER, primaryKey: true },
      actor_id: { type: dataType.INTEGER, notNull: true },
      transaction_id: { type: dataType.INTEGER, notNull: true },
      feedback: { type: dataType.CHAR, notNull: true },
    }),
    // Edges
    // users < locations
    // users < books (book owner)
    db.createTable.bind(db, 'edges', {
      id: { type: dataType.INTEGER, primaryKey: true },
      source_id: { type: dataType.INTEGER, notNull: true },
      target_id: { type: dataType.INTEGER, notNull: true },
      status: { type: dataType.SMALLINT, notNull: true },
      created_time: { type: dataType.DATE_TIME, notNull: true },
      updated_time: dataType.DATE_TIME,
    }),
    db.addForeignKey.bind(db, 'users_books', 'users', 'users_books_users_id_foreign',
      {
        'user_id': 'id'
      },
      {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      }),
    db.addForeignKey.bind(db, 'users_books', 'books', 'users_books_books_id_foreign',
      {
        'book_id': 'id'
      },
      {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      }),
    db.addForeignKey.bind(db, 'transactions', 'users_books', 'transactions_users_books_id_foreign',
      {
        'user_book_id': 'id'
      },
      {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      }),
    db.addForeignKey.bind(db, 'transactions', 'users', 'transactions_users_lender_id_foreign',
      {
        'lender_id': 'id'
      },
      {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      }),
    db.addForeignKey.bind(db, 'transactions', 'users', 'transactions_users_borrower_id_foreign',
      {
        'borrower_id': 'id'
      },
      {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      }),
  ], callback);
};

exports.down = function (db, callback) {
  async.series([
    db.removeForeignKey.bind(db, 'users_books', 'users_books_users_id_foreign',
      {
        dropIndex: true,
      }),
    db.removeForeignKey.bind(db, 'users_books', 'users_books_books_id_foreign',
      {
        dropIndex: true,
      }),
    db.removeForeignKey.bind(db, 'transactions', 'transactions_users_books_id_foreign',
      {
        dropIndex: true,
      }),
    db.removeForeignKey.bind(db, 'transactions', 'transactions_users_lender_id_foreign',
      {
        dropIndex: true,
      }),
    db.removeForeignKey.bind(db, 'transactions', 'transactions_users_borrower_id_foreign',
      {
        dropIndex: true,
      }),
    db.dropTable.bind(db, 'users'),
    db.dropTable.bind(db, 'books'),
    db.dropTable.bind(db, 'users_books'),
    db.dropTable.bind(db, 'locations'),
    db.dropTable.bind(db, 'transactions'),
    db.dropTable.bind(db, 'transaction_revisions'),
    db.dropTable.bind(db, 'feedback'),
    db.dropTable.bind(db, 'edges'),
  ], callback);
};

exports._meta = {
  "version": 1
};
