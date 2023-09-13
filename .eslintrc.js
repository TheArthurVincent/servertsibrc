module.exports = {
    env: {
      node: true, // Define o ambiente como Node.js
      es6: true, // Ativa recursos do ES6
    },
    extends: 'eslint:recommended', // Usa um conjunto de regras recomendadas
    parserOptions: {
      ecmaVersion: 2018, // Especifica a versão do ECMAScript (ES6)
    },
    rules: {
      // Aqui você pode adicionar ou modificar regras específicas do ESLint
      'no-console': 'off', // Permite o uso de console.log
      'indent': ['error', 2], // Define a indentação para 2 espaços
      // Adicione outras regras conforme necessário
    },
  };
  