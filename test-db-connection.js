#!/usr/bin/env node

/**
 * Script de prueba de conexión a BD
 * Ejecutar con: node test-db-connection.js
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'readzzi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('\n' + '='.repeat(60));
console.log('🔍 PRUEBA DE CONEXIÓN A BASE DE DATOS');
console.log('='.repeat(60) + '\n');

console.log('📋 Configuración:');
console.log(`  Host:     ${dbConfig.host}`);
console.log(`  Usuario:  ${dbConfig.user}`);
console.log(`  Contraseña: ${dbConfig.password ? '***' : '(sin contraseña)'}`);
console.log(`  BD:       ${dbConfig.database}`);
console.log('\n');

async function testConnection() {
  try {
    console.log('⏳ Intentando conectar...\n');
    
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    
    console.log('✅ CONEXIÓN EXITOSA\n');
    
    // Prueba 1: Versión de MySQL
    try {
      const [rows] = await connection.execute('SELECT VERSION() as version');
      console.log(`✅ MySQL Version: ${rows[0].version}`);
    } catch (e) {
      console.log(`❌ Error obteniendo versión: ${e.message}`);
    }
    
    // Prueba 2: Usuario actual
    try {
      const [rows] = await connection.execute('SELECT USER() as user');
      console.log(`✅ Usuario actual: ${rows[0].user}`);
    } catch (e) {
      console.log(`❌ Error obteniendo usuario: ${e.message}`);
    }
    
    // Prueba 3: Cambiar a BD readzzi
    try {
      await connection.execute(`USE ${dbConfig.database}`);
      console.log(`✅ BD ${dbConfig.database} disponible`);
    } catch (e) {
      console.log(`❌ BD ${dbConfig.database} NO disponible: ${e.message}`);
    }
    
    // Prueba 4: Tabla users existe
    try {
      const [rows] = await connection.execute(`
        SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '${dbConfig.database}' AND TABLE_NAME = 'users'
      `);
      if (rows[0].count > 0) {
        console.log(`✅ Tabla 'users' existe`);
      } else {
        console.log(`❌ Tabla 'users' NO existe`);
      }
    } catch (e) {
      console.log(`❌ Error verificando tabla: ${e.message}`);
    }
    
    // Prueba 5: Columna role existe
    try {
      const [rows] = await connection.execute(`
        SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '${dbConfig.database}' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
      `);
      if (rows[0].count > 0) {
        console.log(`✅ Columna 'role' en tabla users`);
      } else {
        console.log(`❌ Columna 'role' NO existe en tabla users`);
      }
    } catch (e) {
      console.log(`❌ Error verificando columna role: ${e.message}`);
    }
    
    // Prueba 6: Contar usuarios
    try {
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
      console.log(`✅ Total de usuarios: ${rows[0].count}`);
    } catch (e) {
      console.log(`❌ Error contando usuarios: ${e.message}`);
    }
    
    // Prueba 7: Ver usuarios (primeros 5)
    try {
      const [rows] = await connection.execute('SELECT id, email, alias, role FROM users LIMIT 5');
      if (rows.length > 0) {
        console.log(`✅ Usuarios encontrados:`);
        rows.forEach(user => {
          console.log(`    - ${user.email} (${user.role})`);
        });
      } else {
        console.log(`⚠️  No hay usuarios en la BD`);
      }
    } catch (e) {
      console.log(`❌ Error obteniendo usuarios: ${e.message}`);
    }
    
    connection.release();
    await pool.end();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ PRUEBA COMPLETADA SIN ERRORES CRÍTICOS');
    console.log('='.repeat(60) + '\n');
    
    process.exit(0);
    
  } catch (error) {
    console.log('\n❌ ERROR DE CONEXIÓN\n');
    console.log(`Código:    ${error.code}`);
    console.log(`Mensaje:   ${error.message}`);
    console.log(`Errno:     ${error.errno}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('SOLUCIONES COMUNES:');
    console.log('='.repeat(60));
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔴 MySQL NO ESTÁ CORRIENDO');
      console.log('   1. Abre: Win+R → services.msc');
      console.log('   2. Busca: MySQL (o MySQL80)');
      console.log('   3. Click derecho → Start');
    }
    
    if (error.code === 'ER_ACCESS_DENIED_FOR_USER') {
      console.log('\n🔴 CONTRASEÑA O USUARIO INCORRECTOS');
      console.log('   1. Verifica .env.local');
      console.log(`   2. DB_USER debe ser: ${dbConfig.user}`);
      console.log(`   3. DB_PASSWORD debe ser: ${dbConfig.password ? '(tu contraseña)' : '(vacío)'}`);
    }
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n🔴 BASE DE DATOS NO EXISTE');
      console.log(`   1. Crea la BD: CREATE DATABASE ${dbConfig.database};`);
      console.log('   2. Ejecuta: SETUP_COMPLETO_BD_Y_USUARIOS.sql');
    }
    
    console.log('\n');
    process.exit(1);
  }
}

testConnection();
