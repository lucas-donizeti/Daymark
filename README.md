# Daymark

Um gerenciador de tarefas simples, criado como projeto educativo para praticar React, JavaScript e CSS.

Os dados ficam salvos no navegador, sem necessidade de criar uma conta ou configurar um servidor.

## Funcionalidades

- Criar tarefas com título, observação, data limite e prioridade.
- Marcar tarefas como concluídas ou reativá-las.
- Excluir tarefas.
- Filtrar por todas, hoje, próximas, concluídas e atrasadas.
- Buscar tarefas pelo título ou pela observação.
- Salvar os dados automaticamente no `localStorage`.
- Usar atalhos de teclado: `N` para abrir o formulário de nova tarefa e `/` para focar a busca.
- Acessar a interface em telas de desktop e dispositivos móveis.

## Tecnologias

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- JavaScript (ES Modules)
- CSS
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)

## Executar localmente

### Requisitos

- Node.js compatível com o Vite 8 (Node.js `20.19+` ou `22.12+`).
- npm.

### Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd <PASTA_DO_REPOSITORIO>
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra no navegador o endereço local indicado pelo Vite no terminal.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com atualização automática. |
| `npm run build` | Gera a versão de produção na pasta `dist/`. |
| `npm run preview` | Executa localmente uma prévia da versão de produção. |
| `npm run lint` | Analisa o código com Oxlint. |

Para conferir a versão de produção:

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```text
.
├── index.html
├── package.json
├── src/
│   ├── App.css       # Estilos da interface e layout responsivo
│   ├── App.jsx       # Componentes e lógica do gerenciador
│   ├── index.css     # Estilos globais
│   └── main.jsx      # Inicialização da aplicação React
└── public/           # Arquivos estáticos
```

## Persistência dos dados

As tarefas são armazenadas no `localStorage` do navegador com a chave `daymark-tasks`. Elas permanecem disponíveis após recarregar a página, mas não são sincronizadas entre navegadores ou dispositivos. Limpar os dados do site no navegador também remove as tarefas salvas.

## O que este projeto permite estudar

- Componentes funcionais e composição de interface em React.
- Gerenciamento de estado com `useState`.
- Efeitos colaterais e persistência com `useEffect` e `localStorage`.
- Derivação e filtragem de dados com `useMemo`.
- Formulários controlados e eventos.
- CSS responsivo, estados de interação e acessibilidade básica.

## Inspiração visual

A direção visual minimalista em preto e branco foi inspirada na apresentação de [Hookbook no CSS Design Awards](https://www.cssdesignawards.com/sites/hookbook/50382/). Este projeto é uma implementação independente, feita para fins de estudo.

## Licença

Este repositório ainda não declara uma licença. Antes de reutilizar ou redistribuir o código, consulte o autor ou adicione ao projeto uma licença que corresponda à forma como deseja compartilhá-lo.
