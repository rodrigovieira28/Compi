import { isSameOrigin } from '@/lib/request-security';
import { randomUUID,createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { cookieName,createSession,hashPassword,verifyPassword,sessionCookie,tokenHash } from '@/lib/auth';
import { isDatabaseConfigured,query,rateLimit } from '@/lib/database';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const json=(body:any,status=200,token?:string,secure=false)=>Response.json(body,{status,headers:token!==undefined?{'Set-Cookie':sessionCookie(token,secure),'Cache-Control':'no-store'}:{'Cache-Control':'no-store'}});
export async function POST(req:Request){try{
 if(!isSameOrigin(req))return json({error:'Origem não autorizada.'},403);
 if(!isDatabaseConfigured())return json({error:'As contas ainda não foram ativadas neste site.',configured:false},503);
 const text=await req.text();if(text.length>5000)return json({error:'Requisição muito grande.'},413);const b=JSON.parse(text);const secure=new URL(req.url).protocol==='https:';
 if(b.action==='logout'){const token=(await cookies()).get(cookieName)?.value;if(token)await query('DELETE FROM compi_sessions WHERE token_hash=$1',[tokenHash(token)]);return json({ok:true},200,'',secure)}
 if(!['login','register'].includes(b.action))return json({error:'Ação inválida.'},400);
 const username=typeof b.username==='string'?b.username.trim().toLowerCase():'';const password=b.password;
 if(!/^[a-z0-9_]{3,24}$/.test(username)||typeof password!=='string'||password.length<8||password.length>128)return json({error:'Use um usuário de 3 a 24 letras, números ou _, e uma senha de 8 a 128 caracteres.'},400);
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'local';const ipKey=createHash('sha256').update(ip).digest('hex');
 if(!await rateLimit('auth:'+ipKey,30,15*60*1000)||!await rateLimit('auth-user:'+username,10,15*60*1000))return json({error:'Muitas tentativas. Aguarde 15 minutos.'},429);
 let user:any;
 if(b.action==='register'){
  const invite=process.env.CLASS_INVITE_CODE;
  if(invite&&b.invite!==invite)return json({error:'Código da turma incorreto.'},403);
  const name=typeof b.name==='string'?b.name.trim():'';if(!name||name.length>60)return json({error:'Informe seu nome (até 60 caracteres).'},400);
  const rows=await query('INSERT INTO compi_users(id,username,name,password_hash,created) VALUES($1,$2,$3,$4,$5) ON CONFLICT(username) DO NOTHING RETURNING id,name,username',[randomUUID(),username,name,await hashPassword(password),Date.now()]);
  if(!rows.length)return json({error:'Esse usuário já está em uso.'},409);user=rows[0];
 }else{
  user=(await query('SELECT id,name,username,password_hash FROM compi_users WHERE username=$1',[username]))[0];
  if(!user){await hashPassword(password);return json({error:'Usuário ou senha incorretos.'},401)}
  if(!await verifyPassword(password,user.password_hash))return json({error:'Usuário ou senha incorretos.'},401)
 }
 const token=await createSession(user.id);return json({user:{id:user.id,name:user.name,username:user.username}},200,token,secure);
 }catch(e){console.error('auth',e instanceof Error?e.message:'error');return json({error:'Não foi possível entrar. Tente novamente.'},503)}}
