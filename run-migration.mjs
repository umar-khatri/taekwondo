import pg from 'pg'
import fs from 'fs'

const { Client } = pg

const connectionString = "postgresql://postgres.hsxfwtibypfnvfzyyopp:farooqsclub123@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

const client = new Client({
  connectionString,
})

async function runMigration() {
  try {
    await client.connect()
    const sql = fs.readFileSync('/Users/umarkhatri/.gemini/antigravity-ide/brain/c13785a8-fec4-4457-8985-94c251d70c69/scratch/alter_announcements.sql', 'utf8')
    await client.query(sql)
    console.log("Migration successful!")
  } catch (error) {
    console.error("Migration failed:", error)
  } finally {
    await client.end()
  }
}

runMigration()
