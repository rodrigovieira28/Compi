export const examples=[
{title:'Olá, mundo',tag:'Primeiros passos',description:'Entrada e saída com Leia e Escreva.',code:`Algoritmo OlaMundo;
Declare
    nome: literal;
Inicio
    Escreva("Como você se chama?");
    Leia(nome);
    Escreva("Olá, ", nome, "! Bem-vindo ao Compi.");
Fim Algoritmo.`},
{title:'Conversor de temperatura',tag:'Procedimentos',description:'Celsius para Fahrenheit e Kelvin. Trabalho prático, exercício 1.',code:`Algoritmo Temperatura;
Declare
    celsius: real;

Procedimento converter(c: real)
Declare
    fahrenheit, kelvin: real;
Inicio
    fahrenheit <- c * 1.8 + 32;
    kelvin <- c + 273.15;
    Escreva("Fahrenheit: ", fahrenheit, " °F");
    Escreva("Kelvin: ", kelvin, " K");
Fim procedimento;

Inicio
    Escreva("Digite a temperatura em Celsius:");
    Leia(celsius);
    converter(celsius);
Fim Algoritmo.`},
{title:'Caixa eletrônico',tag:'Procedimentos',description:'Divisão inteira e resto para distribuir as cédulas.',code:`Algoritmo CaixaEletronico;
Declare
    valor: inteiro;

Procedimento sacar(valor: inteiro)
Declare
    quantidade, resto: inteiro;
Inicio
    Se (valor <= 0) ou (valor mod 10 <> 0) entao
        Escreva("Valor inválido para saque");
    Senao
        quantidade <- valor div 100;
        resto <- valor mod 100;
        Escreva(quantidade, " de R$ 100");
        quantidade <- resto div 50;
        resto <- resto mod 50;
        Escreva(quantidade, " de R$ 50");
        quantidade <- resto div 20;
        resto <- resto mod 20;
        Escreva(quantidade, " de R$ 20");
        Escreva(resto div 10, " de R$ 10");
    Fim se;
Fim procedimento;

Inicio
    Escreva("Quanto deseja sacar?");
    Leia(valor);
    sacar(valor);
Fim Algoritmo.`},
{title:'Média de notas',tag:'Condições',description:'Média aritmética e aprovação a partir de 7.',code:`Algoritmo Media;
Declare
    nota1, nota2, media: real;
Inicio
    Escreva("Primeira nota:");
    Leia(nota1);
    Escreva("Segunda nota:");
    Leia(nota2);
    media <- (nota1 + nota2) / 2;
    Escreva("Média: ", media);
    Se media >= 7 entao
        Escreva("Aprovado");
    Senao
        Escreva("Reprovado");
    Fim se;
Fim Algoritmo.`},
{title:'Tabuada',tag:'Repetições',description:'Laço Para com contador automático.',code:`Algoritmo Tabuada;
Declare
    numero, i: inteiro;
Inicio
    Escreva("Tabuada de qual número?");
    Leia(numero);
    Para i <- 1 ate 10 faca
        Escreva(numero, " × ", i, " = ", numero * i);
    Fim para;
Fim Algoritmo.`},
{title:'Soma de um vetor',tag:'Vetores',description:'Cinco posições, índices de 1 a 5 e um acumulador.',code:`Algoritmo SomaVetor;
Declare
    valores: vetor [1..5] de inteiro;
    i, soma: inteiro;
Inicio
    soma <- 0;
    Para i <- 1 ate 5 faca
        Escreva("Valor ", i, ":");
        Leia(valores[i]);
        soma <- soma + valores[i];
    Fim para;
    Escreva("Soma: ", soma);
Fim Algoritmo.`},
{title:'Diagonal da matriz',tag:'Matrizes',description:'Preenche uma matriz 3×3 e soma a diagonal principal.',code:`Algoritmo Diagonal;
Declare
    matriz: vetor [1..3;1..3] de inteiro;
    i, j, soma: inteiro;
Inicio
    soma <- 0;
    Para i <- 1 ate 3 faca
        Para j <- 1 ate 3 faca
            matriz[i,j] <- i * j;
        Fim para;
        soma <- soma + matriz[i,i];
    Fim para;
    Escreva("Soma da diagonal: ", soma);
Fim Algoritmo.`},
{title:'Cadastro de pessoa',tag:'Registros',description:'Campos de tipos diferentes em um registro.',code:`Algoritmo Cadastro;
Tipo pessoa: Registro
    nome: literal;
    idade: inteiro;
    cpf: literal;
Fim Registro;
Declare
    aluno: pessoa;
Inicio
    Escreva("Nome:");
    Leia(aluno.nome);
    Escreva("Idade:");
    Leia(aluno.idade);
    Escreva("CPF:");
    Leia(aluno.cpf);
    Escreva(aluno.nome, " tem ", aluno.idade, " anos.");
Fim Algoritmo.`},
{title:'Quadrado e raiz',tag:'Funções',description:'Retorno de função e alteração de parâmetro por referência.',code:`Algoritmo QuadradoRaiz;
Declare
    numero, quadrado: real;
Funcao calcular(var x: real): real
Declare
    resultado: real;
Inicio
    resultado <- x * x;
    x <- x^(1/2);
    Retorne resultado;
Fim funcao;
Inicio
    Escreva("Digite um número positivo:");
    Leia(numero);
    quadrado <- calcular(numero);
    Escreva("Quadrado: ", quadrado);
    Escreva("Raiz: ", numero);
Fim Algoritmo.`},
{title:'Contagem com Enquanto',tag:'Repetições',description:'Condição de continuidade antes de cada repetição.',code:`Algoritmo Contagem;
Declare
    i: inteiro;
Inicio
    i <- 1;
    Enquanto i <= 5 faca
        Escreva(i);
        i <- i + 1;
    Fim enquanto;
Fim Algoritmo.`},
{title:'Menu com Repita',tag:'Condições',description:'Escolha/Caso dentro de um laço com condição de parada.',code:`Algoritmo Menu;
Declare
    opcao: inteiro;
Inicio
    Repita
        Escreva("1: Olá | 2: Hora de estudar | 0: Sair");
        Leia(opcao);
        Escolha opcao
            Caso 1: Escreva("Olá!");
            Caso 2: Escreva("Abra seu caderno.");
            Caso 0: Escreva("Até logo!");
            Caso contrario: Escreva("Opção inválida");
        Fim escolha;
    Ate opcao = 0;
Fim Algoritmo.`}
];
export const blank=`Algoritmo NovoProjeto;\nDeclare\n    \nInicio\n    Escreva("Olá, mundo!");\nFim Algoritmo.`;
export const docs=[
{title:'Estrutura do algoritmo',body:'O Compi usa a notação das aulas. Declare as variáveis antes de Inicio e termine com Fim Algoritmo. Palavras-chave aceitam maiúsculas, minúsculas e acentos.',code:'Algoritmo Exemplo;\nDeclare\n    numero: inteiro;\nInicio\n    numero <- 10;\n    Escreva(numero);\nFim Algoritmo.'},
{title:'Entrada e saída',body:'Leia espera uma resposta no terminal. Escreva aceita vários valores separados por vírgula. No Compi, cada chamada de Escreva ou Escreval termina uma linha. Use ponto nos decimais do código; o terminal também aceita vírgula.',code:'Escreva("Digite sua idade:");\nLeia(idade);\nEscreva("Idade: ", idade);'},
{title:'Operadores',body:'Atribuição: <- ou ←. Comparação: =, <>, <, >, <= e >=. Lógicos: e, ou e nao. Aritméticos: +, -, *, /, ^, div e mod. Parênteses definem a prioridade.',code:'resto <- numero mod 2;\nquociente <- numero div 10;\nraiz <- numero^(1/2);'},
{title:'Condições e laços',body:'Se usa Entao, Senao e Fim se. Enquanto continua quando a condição é verdadeira. Repita termina quando a condição após Ate é verdadeira. Para já incrementa o contador: não some 1 manualmente.',code:'Para i <- 1 ate 10 faca\n    Escreva(i);\nFim para;'},
{title:'Procedimentos e funções',body:'Procedimentos executam uma tarefa. Funções devolvem um valor com Retorne. Declare as rotinas antes do Inicio do programa principal. Parâmetros com var alteram a variável original.',code:'Funcao quadrado(x: real): real\nInicio\n    Retorne x * x;\nFim funcao;'},
{title:'Vetores, matrizes e registros',body:'Os índices respeitam os limites declarados. Matrizes aceitam intervalos separados por ponto e vírgula ou vírgula. Registros são declarados com Tipo e seus campos são acessados com ponto.',code:'valores: vetor [1..10] de inteiro;\nmatriz: vetor [1..5;1..5] de real;\n// Acesso: valores[1], matriz[2,3], aluno.nome'},
{title:'Compatibilidade',body:'Este é o dialeto Compi, baseado no PDF da disciplina. Não executa a sintaxe com programa { } do Portugol Studio. Funções disponíveis: raiz, raizq, abs, int, trunc, arred, sen, cos, potencia, comprimento, maiusculo e minusculo. Arquivos e conjuntos ainda não são suportados. O modo passo a passo mostra o estado antes da linha indicada.',code:'// Comentário de uma linha\n{ Comentário em bloco }\n// Limites: 100 mil instruções e 100 chamadas aninhadas.'}
];
