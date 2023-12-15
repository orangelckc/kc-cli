import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['bun.lockb', '*.yml'],
  rules: {
    'no-console': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
},
)
