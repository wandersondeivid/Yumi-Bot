# YUMI BOT

Projeto organizado com comandos separados por categoria.

## Estrutura dos comandos

- `comandos/dono/`: comandos exclusivos dos proprietários
- `comandos/adm/`: comandos administrativos
- `comandos/gerais/`: comandos gerais e menus públicos
- `comandos/jogos/`: jogos
- `comandos/diversao/`: brincadeiras e entretenimento
- `comandos/midia/`: imagens, vídeos e figurinhas

O carregador procura arquivos `.js` recursivamente dentro de `comandos/` e monitora as subpastas para recarga automática.

## Instalação no Termux

1. Entre na pasta do projeto.
2. Execute `npm install`.
3. Inicie com `npm start`.

A pasta `node_modules` e arquivos de sessão não são incluídos neste ZIP. A sessão do WhatsApp será criada novamente pelo Baileys na primeira conexão.

## Proprietários

O dono principal está configurado em `config.js`. Proprietários adicionais ficam em `banco-de-dados/donos.json`.

Comandos:
- `?adddono NUMERO`
- `?tirardono NUMERO`
- `?listdonos`

Somente o dono principal pode adicionar, remover ou listar proprietários adicionais.
