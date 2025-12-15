import * as SQLite from 'expo-sqlite';

let db = null;

const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('finance.db');
  }
  return db;
};

// Insert new Fixed Deposit
export const insertFixedDeposit = async (data) => {
  try {
    const database = await getDB();
    const {
      organizationName,
      investmentAmount,
      annualRate,
      startDate,
      tenureYears,
      tenureMonths,
      tenureDays,
      depositType,
      compoundingFrequency,
    } = data;

    const result = await database.runAsync(
      `INSERT INTO fixed_deposits 
      (organization_name, investment_amount, annual_rate, start_date, tenure_years, tenure_months, tenure_days, deposit_type, compounding_frequency) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        organizationName,
        investmentAmount,
        annualRate,
        startDate,
        tenureYears || 0,
        tenureMonths || 0,
        tenureDays || 0,
        depositType,
        compoundingFrequency,
      ]
    );
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Insert FD Error:', error);
    throw error;
  }
};

// Get all Fixed Deposits
export const getAllFixedDeposits = async () => {
  try {
    const database = await getDB();
    const result = await database.getAllAsync('SELECT * FROM fixed_deposits ORDER BY created_at DESC;');
    return result || [];
  } catch (error) {
    console.error('Get All FD Error:', error);
    return [];
  }
};

// Get single Fixed Deposit by ID
export const getFixedDepositById = async (id) => {
  try {
    const database = await getDB();
    const result = await database.getFirstAsync('SELECT * FROM fixed_deposits WHERE id = ?;', [id]);
    return result || null;
  } catch (error) {
    console.error('Get FD By ID Error:', error);
    return null;
  }
};

// Get total summary
export const getFixedDepositSummary = async () => {
  try {
    const database = await getDB();
    const result = await database.getFirstAsync(`
      SELECT 
        COALESCE(SUM(investment_amount), 0) as total_invested,
        COUNT(*) as total_deposits
      FROM fixed_deposits;
    `);
    return result || { total_invested: 0, total_deposits: 0 };
  } catch (error) {
    console.error('Get FD Summary Error:', error);
    return { total_invested: 0, total_deposits: 0 };
  }
};

// Update Fixed Deposit
export const updateFixedDeposit = async (id, data) => {
  try {
    const database = await getDB();
    const {
      organizationName,
      investmentAmount,
      annualRate,
      startDate,
      tenureYears,
      tenureMonths,
      tenureDays,
      depositType,
      compoundingFrequency,
    } = data;

    await database.runAsync(
      `UPDATE fixed_deposits 
      SET organization_name = ?, 
          investment_amount = ?, 
          annual_rate = ?, 
          start_date = ?,
          tenure_years = ?,
          tenure_months = ?,
          tenure_days = ?,
          deposit_type = ?,
          compounding_frequency = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;`,
      [
        organizationName,
        investmentAmount,
        annualRate,
        startDate,
        tenureYears || 0,
        tenureMonths || 0,
        tenureDays || 0,
        depositType,
        compoundingFrequency,
        id,
      ]
    );
  } catch (error) {
    console.error('Update FD Error:', error);
    throw error;
  }
};

// Delete Fixed Deposit
export const deleteFixedDeposit = async (id) => {
  try {
    const database = await getDB();
    await database.runAsync('DELETE FROM fixed_deposits WHERE id = ?;', [id]);
  } catch (error) {
    console.error('Delete FD Error:', error);
    throw error;
  }
};

// Delete all Fixed Deposits
export const deleteAllFixedDeposits = async () => {
  try {
    const database = await getDB();
    await database.execAsync('DELETE FROM fixed_deposits;');
  } catch (error) {
    console.error('Delete All FD Error:', error);
    throw error;
  }
};