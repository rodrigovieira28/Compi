# Compi

IDE de Portugol com terminal interativo, projetos e comunidade. Pronto para GitHub + Vercel.

## Publicar

1. Extraia este ZIP e envie **o conteúdo** para a raiz de um repositório GitHub. O `package.json` precisa ficar na raiz.
2. Na Vercel, escolha **Add New → Project**, importe o repositório e clique em **Deploy**. O framework é **Next.js**; mantenha os comandos e diretório padrão.
3. Para seu domínio, abra **Settings → Domains**, adicione o domínio e configure os registros DNS indicados pela Vercel.

O editor, a execução de Portugol, os exemplos, a inspeção de variáveis e a importação/exportação funcionam sem variáveis de ambiente.

## Ativar contas, projetos salvos e comunidade

Esses recursos precisam de um banco compartilhado para lembrar os dados entre acessos.

1. No painel do projeto Vercel, abra **Storage** e crie/conecte a integração **Neon (Postgres)**. Se não aparecer nessa aba, procure Neon no Marketplace.
2. Conecte o banco ao projeto em **Production**. A integração deve adicionar `DATABASE_URL` ou `POSTGRES_URL`; o Compi aceita as duas.
3. Faça **Redeploy** para aplicar a conexão.
4. Abra o Compi e clique em **Entrar → Criar conta**. As tabelas são criadas automaticamente na primeira operação com o banco.

Não é necessário criar tabelas manualmente, configurar OAuth ou obter uma chave de API. Escolha o plano de banco apropriado no painel; o pacote não contrata serviços.

### Cadastro apenas para a turma (opcional)

Em **Settings → Environment Variables**, adicione `CLASS_INVITE_CODE` com um código escolhido por você e faça Redeploy. Quem criar uma conta precisará informar esse código. Contas já criadas continuam funcionando. Deixe a variável ausente se quiser cadastro aberto.

## Recursos

- Editor com cores, autocompletar, busca e substituição, indentação, abas e desfazer.
- Terminal interativo, execução passo a passo, variáveis e erros por linha.
- Vetores, matrizes, registros, funções, procedimentos e passagem por referência.
- Projetos individuais, salvamento automático e até 30 versões anteriores.
- Publicações, comentários, favoritos, links e cópias editáveis.
- Onze exemplos das aulas, referência, temas, modo foco e atalhos.

As publicações da comunidade são visíveis a quem está conectado. Cada projeto pessoal pertence à sua conta. Senhas são armazenadas como hashes com salt; as sessões usam cookies HttpOnly. O autor das publicações e dos comentários é determinado no servidor.

## Executar no computador

Requer Node.js 22.14 ou superior (linha 22).

```sh
npm ci
npm run dev
```

Abra `http://localhost:3000`. Para testar contas e comunidade localmente, copie `.env.example` para `.env.local` e informe a conexão de um banco Neon. Sem conexão, o editor continua funcionando.

## Verificar

```sh
npm run typecheck
npm run test:interpreter
npm run build
```

A conversão foi testada com compilação de produção Next.js e testes do interpretador. Cadastro, login, convites, hashes, sessões, expiração, permissões e consultas foram testados usando PostgreSQL local em WASM, com o transporte Neon simulado. Não foi realizado um deploy em uma conta Vercel nem um teste com banco Neon real, pois essas contas não foram fornecidas.

## Arquivos principais

- `app/page.tsx`: interface.
- `app/editor.tsx`: CodeMirror.
- `lib/portugol.ts`: interpretador sem eval.
- `lib/database.ts`: PostgreSQL, criação de tabelas e limites de tentativas.
- `lib/auth.ts`: senhas e sessões.
- `app/api/auth/route.ts`: cadastro, entrada e saída.
- `app/api/data/route.ts`: projetos e comunidade.

## Dialeto

Baseado em `Algoritmo`, `Declare`, `Inicio`, `<-` e `Fim Algoritmo` do material da disciplina. Não executa a sintaxe `programa { }` do Portugol Studio. Escreva/Escreval acrescentam uma quebra de linha. Não suporta arquivos ou conjuntos. Limites impedem laços infinitos e saídas excessivas.

## Limitações das contas

O cadastro usa usuário e senha, sem verificação por email e sem recuperação automática de senha. Use uma senha própria do Compi. Projetos e contas da versão anterior não são importados automaticamente.
