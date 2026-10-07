import { cookies } from 'next/headers';
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { isDatabaseConfigured, query } from './database';
const scrypt=promisify(scryptCallback);
export const cookieName='compi_session';
export function tokenHash(token:string){return createHash('sha256').update(token).digest('hex')}
export async function hashPassword(password:string){const salt=randomBytes(16).toString('hex');const key=await scrypt(password,salt,64) as Buffer;return salt+':'+key.toString('hex')}
export async function verifyPassword(password:string,hash:string){const [salt,digest]=hash.split(':');if(!salt||!digest)return false;const key=await scrypt(password,salt,64) as Buffer;const stored=Buffer.from(digest,'hex');return key.length===stored.length&&timingSafeEqual(key,stored)}
export async function getCurrentUser(){if(!isDatabaseConfigured())return null;const token=(await cookies()).get(cookieName)?.value;if(!token||!/^[a-f0-9]{64}$/.test(token))return null;const rows=await query(`SELECT u.id,u.username,u.name FROM compi_sessions s JOIN compi_users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires>$2`,[tokenHash(token),Date.now()]);const u=rows[0];return u?{userId:u.id,displayName:u.name,username:u.username}:null}
export async function createSession(userId:string){const token=randomBytes(32).toString('hex');await query('DELETE FROM compi_sessions WHERE expires<$1',[Date.now()]);await query('INSERT INTO compi_sessions(token_hash,user_id,expires) VALUES($1,$2,$3)',[tokenHash(token),userId,Date.now()+30*24*60*60*1000]);return token}
export function sessionCookie(token:string,secure:boolean){return `${cookieName}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${token?30*24*60*60:0}${secure?'; Secure':''}`}
