export const is: SmartPlaylistOperator = {
  operator: 'is',
  label: '等于',
}

export const isNot: SmartPlaylistOperator = {
  operator: 'isNot',
  label: '不等于',
}

export const contains: SmartPlaylistOperator = {
  operator: 'contains',
  label: '包含',
}

export const notContain: SmartPlaylistOperator = {
  operator: 'notContain',
  label: '不包含',
}

export const isBetween: SmartPlaylistOperator = {
  operator: 'isBetween',
  label: '介于',
  inputs: 2,
}

export const isGreaterThan: SmartPlaylistOperator = {
  operator: 'isGreaterThan',
  label: '大于',
}

export const isLessThan: SmartPlaylistOperator = {
  operator: 'isLessThan',
  label: '小于',
}

export const beginsWith: SmartPlaylistOperator = {
  operator: 'beginsWith',
  label: '开始于',
}

export const endsWith: SmartPlaylistOperator = {
  operator: 'endsWith',
  label: '结尾',
}

export const inLast: SmartPlaylistOperator = {
  operator: 'inLast',
  label: 'in the last',
  type: 'number', // overriding
  unit: 'days',
}

export const notInLast: SmartPlaylistOperator = {
  operator: 'notInLast',
  label: 'not in the last',
  type: 'number', // overriding
  unit: 'days',
}

export default [
  is,
  isNot,
  contains,
  notContain,
  isBetween,
  isGreaterThan,
  isLessThan,
  beginsWith,
  endsWith,
  inLast,
  notInLast,
]
