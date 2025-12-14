import * as SQLite from 'expo-sqlite';

let db;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync('finance.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS mutual_funds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      investment_type TEXT NOT NULL,
      current_value REAL NOT NULL,
      invested_value REAL NOT NULL,
      total_funds INTEGER DEFAULT 0,
      frequency_type TEXT,
      sip_amount REAL,
      sip_date INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const insertUser = async (name) => {
  await db.runAsync(
    'INSERT INTO user (name) VALUES (?);',
    [name]
  );
};

export const getUser = async () => {
  const result = await db.getFirstAsync(
    'SELECT * FROM user LIMIT 1;'
  );
  return result ?? null;
};


export const deleteUser = async () => {
  await db.execAsync('DELETE FROM user;');
};
