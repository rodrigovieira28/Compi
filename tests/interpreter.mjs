import assert from 'node:assert/strict';
import {runPortugol,Parser} from '../lib/portugol.ts';
import {examples} from '../lib/examples.ts';
const inputs=[['Villyan'],['25'],['380'],['8','6'],['7'],['1','2','3','4','5'],[],['Ana','20','01234567890'],['9'],[],['2','0']];
const expect=['Olá, Villyan!','77 °F','3 de R$ 100','Aprovado','7 × 10 = 70','Soma: 15','Soma da diagonal: 14','Ana tem 20 anos.','Raiz: 3','5','Até logo!'];
for(let i=0;i<examples.length;i++){let out='',values=[...inputs[i]];await runPortugol(examples[i].code,{write:s=>out+=s,read:async()=>{assert.ok(values.length,'unexpected read');return values.shift()}});assert.ok(out.includes(expect[i]),examples[i].title+': '+out);console.log('PASS '+examples[i].title)}
async function run(code){let out='';await runPortugol(code,{write:s=>out+=s,read:async()=>'',limit:100});return out}
assert.equal(await run('Algoritmo Teste;\nDeclare\n x: inteiro;\nInicio\n x <- 2^3^2; Escreva(x);\nFim Algoritmo.'),'512\n');
assert.equal(await run('Algoritmo Teste;\nDeclare\n x: inteiro;\nInicio\n Para x <- 3 ate 1 passo -1 faca\n Escreva(x);\n Fim para;\nFim Algoritmo.'),'3\n2\n1\n');
await assert.rejects(()=>run('Algoritmo T;\nInicio\n Enquanto verdadeiro faca\n Fim enquanto;\nFim Algoritmo.'),/Limite de instruções/);
await assert.rejects(()=>run('Algoritmo T; Declare v: vetor [1..2] de inteiro; Inicio Escreva(v[0]); Fim Algoritmo.'),/fora dos limites/);
await assert.rejects(()=>run('Algoritmo T; Inicio Escreva(4 / 0); Fim Algoritmo.'),/Divisão por zero/);
await assert.rejects(()=>run('Algoritmo T; Inicio x <- 1; Fim Algoritmo.'),/não declarada/);
assert.throws(()=>new Parser('Algoritmo T; Inicio Escreva("abc); Fim Algoritmo.').parse(),/aspas/);
console.log('PASS limites, condições de erro, precedência e contagem regressiva');
assert.equal(await run(`Algoritmo Recursao;
Declare n: inteiro;
Funcao fatorial(n: inteiro): inteiro
Inicio
 Se n <= 1 entao
  Retorne 1;
 Senao
  Retorne n * fatorial(n-1);
 Fim se;
Fim funcao;
Inicio
 Escreva(fatorial(5));
Fim Algoritmo.`),'120\n');
assert.equal(await run(`Algoritmo Pessoas;
Tipo pessoa: Registro
 nome: literal;
 idade: inteiro;
Fim Registro;
Declare grupo: vetor [1..2] de pessoa;
Inicio grupo[1].nome <- "Ana"; grupo[1].idade <- 21; Escreva(grupo[1].nome, grupo[1].idade); Fim Algoritmo.`),'Ana21\n');
await assert.rejects(()=>run('Algoritmo T; Declare x: inteiro; Inicio x <- 1.5; Fim Algoritmo.'),/decimal/);
console.log('PASS recursividade, vetor de registros e validação de tipos');
