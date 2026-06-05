import mysql from 'mysql2/promise';

declare global {
  var dbConnectionLogged: boolean;
}

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'readzzi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true
};

export const pool = mysql.createPool(dbConfig);

// Verificar conexión inicial una sola vez
if (!global.dbConnectionLogged) {
  global.dbConnectionLogged = true;
  pool.getConnection()
    .then(conn => {
      console.log('[DB] ✅ Conexión a BD establecida correctamente');
      conn.release();
    })
    .catch(err => {
      console.error('[DB] ❌ Error de conexión inicial:', {
        code: err.code,
        message: err.message,
        errno: err.errno
      });
    });
}

export async function query(sql: string, params: any[] = []) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}