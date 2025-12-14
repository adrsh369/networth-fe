import * as SQLite from 'expo-sqlite';

// Use the same database instance
let db = null;

const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('finance.db');
  }
  return db;
};

// Insert new Mutual Fund investment
export const insertMutualFund = async (data) => {
  try {
    const database = await getDB();
    const {
      investmentType,
      currentValue,
      investedValue,
      totalFunds,
      frequencyType,
      sipAmount,
      sipDate,
    } = data;

    const result = await database.runAsync(
      `INSERT INTO mutual_funds 
      (investment_type, current_value, invested_value, total_funds, frequency_type, sip_amount, sip_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        investmentType,
        currentValue,
        investedValue,
        totalFunds || 0,
        frequencyType || null,
        sipAmount || null,
        sipDate || null,
      ]
    );
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Insert MF Error:', error);
    throw error;
  }
};

// Get all Mutual Fund investments
export const getAllMutualFunds = async () => {
  try {
    const database = await getDB();
    const result = await database.getAllAsync('SELECT * FROM mutual_funds ORDER BY created_at DESC;');
    return result || [];
  } catch (error) {
    console.error('Get All MF Error:', error);
    return [];
  }
};

// Get single Mutual Fund by ID
export const getMutualFundById = async (id) => {
  try {
    const database = await getDB();
    const result = await database.getFirstAsync('SELECT * FROM mutual_funds WHERE id = ?;', [id]);
    return result || null;
  } catch (error) {
    console.error('Get MF By ID Error:', error);
    return null;
  }
};

// Get total summary (sum of all investments)
export const getMutualFundSummary = async () => {
  try {
    const database = await getDB();
    const result = await database.getFirstAsync(`
      SELECT 
        COALESCE(SUM(current_value), 0) as total_current,
        COALESCE(SUM(invested_value), 0) as total_invested,
        COALESCE(SUM(total_funds), 0) as total_funds
      FROM mutual_funds;
    `);
    return result || { total_current: 0, total_invested: 0, total_funds: 0 };
  } catch (error) {
    console.error('Get MF Summary Error:', error);
    return { total_current: 0, total_invested: 0, total_funds: 0 };
  }
};

// Update Mutual Fund investment
export const updateMutualFund = async (id, data) => {
  try {
    const database = await getDB();
    const {
      investmentType,
      currentValue,
      investedValue,
      totalFunds,
      frequencyType,
      sipAmount,
      sipDate,
    } = data;

    await database.runAsync(
      `UPDATE mutual_funds 
      SET investment_type = ?, 
          current_value = ?, 
          invested_value = ?, 
          total_funds = ?,
          frequency_type = ?,
          sip_amount = ?,
          sip_date = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;`,
      [
        investmentType,
        currentValue,
        investedValue,
        totalFunds || 0,
        frequencyType || null,
        sipAmount || null,
        sipDate || null,
        id,
      ]
    );
  } catch (error) {
    console.error('Update MF Error:', error);
    throw error;
  }
};

// Delete Mutual Fund investment
export const deleteMutualFund = async (id) => {
  try {
    const database = await getDB();
    await database.runAsync('DELETE FROM mutual_funds WHERE id = ?;', [id]);
  } catch (error) {
    console.error('Delete MF Error:', error);
    throw error;
  }
};

// Delete all Mutual Fund investments
export const deleteAllMutualFunds = async () => {
  try {
    const database = await getDB();
    await database.execAsync('DELETE FROM mutual_funds;');
  } catch (error) {
    console.error('Delete All MF Error:', error);
    throw error;
  }
};