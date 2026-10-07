import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
export const isDatabaseConfigured=()=>Boolean(process.env.DATABASE_URL||process.env.POSTGRES_URL);
const schema=[
`CREATE TABLE IF NOT EXISTS compi_users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password_hash TEXT NOT NULL, created BIGINT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS compi_sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES compi_users(id) ON DELETE CASCADE, expires BIGINT NOT NULL)`,
`CREATE INDEX IF NOT EXISTS compi_sessions_user ON compi_sessions(user_id)`,
`CREATE TABLE IF NOT EXISTS compi_rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires BIGINT NOT NULL)`,
`CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, owner TEXT NOT NULL REFERENCES compi_users(id), title TEXT NOT NULL, code TEXT NOT NULL, updated BIGINT NOT NULL)`,
`CREATE INDEX IF NOT EXISTS projects_owner ON projects(owner)`,
`CREATE TABLE IF NOT EXISTS revisions (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, code TEXT NOT NULL, created BIGINT NOT NULL)`,
`CREATE INDEX IF NOT EXISTS revisions_project ON revisions(project_id)`,
`CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, owner TEXT NOT NULL REFERENCES compi_users(id), author TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, code TEXT NOT NULL, tag TEXT NOT NULL, created BIGINT NOT NULL)`,
`CREATE INDEX IF NOT EXISTS posts_created ON posts(created)`,
`CREATE TABLE IF NOT EXISTS stars (post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE, owner TEXT NOT NULL REFERENCES compi_users(id), PRIMARY KEY (post_id,owner))`,
`CREATE TABLE IF NOT EXISTS comments (id TEXT PRIMARY KEY, post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE, owner TEXT NOT NULL REFERENCES compi_users(id), author TEXT NOT NULL, body TEXT NOT NULL, created BIGINT NOT NULL)`,
`CREATE INDEX IF NOT EXISTS comments_post ON comments(post_id)`
];
let client:NeonQueryFunction<false,false>|null=null,initialized:Promise<void>|null=null;
function sql(){const url=process.env.DATABASE_URL||process.env.POSTGRES_URL;if(!url)throw new Error('DATABASE_NOT_CONFIGURED');return client??=neon(url)}
export async function ensureDatabase(){if(!initialized){initialized=(async()=>{await sql().transaction([sql().query('SELECT pg_advisory_xact_lock(724196015)'),...schema.map(s=>sql().query(s))]);})().catch(e=>{initialized=null;throw e})}await initialized}
export async function query(sqlText:string,params:any[]=[]):Promise<any[]>{await ensureDatabase();return normalize(await sql().query(sqlText,params))}
function normalize(rows:any[]):any[]{return rows.map(row=>Object.fromEntries(Object.entries(row).map(([k,v])=>[k,['created','updated','expires','stars','comments','count'].includes(k)&&v!==null?Number(v):v])))}
class Statement{
 values:any[]=[];text:string;
 constructor(text:string){let n=0;this.text=text.replace(/\?/g,()=>'$'+(++n))}
 bind(...args:any[]){this.values=args;return this}
 async first(){return (await query(this.text,this.values))[0]||null}
 async all(){return {results:await query(this.text,this.values)}}
 async run(){await query(this.text,this.values);return {success:true}}
}
export function database(){return {prepare:(s:string)=>new Statement(s),batch:async(statements:Statement[])=>{await ensureDatabase();return sql().transaction(statements.map(s=>sql().query(s.text,s.values)))}}}
export async function rateLimit(key:string,max:number,windowMs:number){const now=Date.now();const rows=await query(`INSERT INTO compi_rate_limits(key,count,expires) VALUES($1,1,$2) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN compi_rate_limits.expires<$3 THEN 1 ELSE compi_rate_limits.count+1 END,expires=CASE WHEN compi_rate_limits.expires<$3 THEN $2 ELSE compi_rate_limits.expires END RETURNING count`,[key,now+windowMs,now]);return rows[0].count<=max}
