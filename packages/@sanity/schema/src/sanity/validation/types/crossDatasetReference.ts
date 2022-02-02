import {flatten, isPlainObject} from 'lodash'
import {error, HELP_IDS} from '../createValidationResult'
import {getDupes} from '../utils/getDupes'
import {ValidationResult} from '../../typedefs'

function normalizeToProp(typeDef) {
  if (Array.isArray(typeDef.to)) {
    return typeDef.to
  }
  return typeDef.to ? [typeDef.to] : typeDef.to
}

const VALID_DATASET = /^[a-z0-9~][-_a-z0-9]+$/
export function isValidDatasetName(name: string): string | true {
  const isValid = name.length >= 2 && name.toLowerCase() === name && VALID_DATASET.test(name)
  return (
    isValid ||
    `The provided dataset "${name}" doesn't look like a valid dataset. Dataset names must be more than 2 characters, can only contain lowercase characters, numbers, underscores and dashes and can not start with a dash or an underscore`
  )
}

const VALID_TOKEN_ID = /^[a-zA-Z0-9_][a-zA-Z0-9_-]+$/
export function isValidTokenId(tokenId: string): string | true {
  const isValid = tokenId.length >= 2 && VALID_TOKEN_ID.test(tokenId)
  return (
    isValid ||
    `The provided tokenId "${tokenId}" is invalid. The tokenId must be a string made up of at least 2 characters in the a-zA-Z0-9_- range and cannot start with a - (dash) character`
  )
}

export default (typeDef, visitorContext) => {
  const isValidTo = Array.isArray(typeDef.to) || isPlainObject(typeDef.to)
  const normalizedTo = normalizeToProp(typeDef)

  const problems = flatten([
    isValidTo
      ? getDupes(normalizedTo, (t) => `${t.name};${t.type}`).map((dupes) =>
          error(
            `Found ${dupes.length} members with same type, but not unique names "${dupes[0].type}" in reference. This makes it impossible to tell their values apart and you should consider naming them`,
            HELP_IDS.CROSS_DATASET_REFERENCE_INVALID
          )
        )
      : error(
          'The cross dataset reference type is missing or having an invalid value for the required "to" property. It should be an array of accepted types.',
          HELP_IDS.CROSS_DATASET_REFERENCE_INVALID
        ),
  ])

  if (isValidTo && normalizedTo.length === 0) {
    problems.push(
      error(
        'The cross dataset reference type should define at least one referenced type. Please check the "to" property.',
        HELP_IDS.CROSS_DATASET_REFERENCE_INVALID
      )
    )
  }

  if (typeof typeDef.tokenId === 'string') {
    const validationResult = isValidTokenId(typeDef.tokenId)
    if (validationResult !== true) {
      problems.push(error(validationResult, HELP_IDS.CROSS_DATASET_REFERENCE_INVALID))
    }
  } else {
    problems.push(
      error(
        'A `tokenId` must be specified for a cross dataset reference',
        HELP_IDS.CROSS_DATASET_REFERENCE_INVALID
      )
    )
  }

  if (typeof typeDef.projectId !== 'string') {
    problems.push(
      error(
        'A cross dataset reference must specify a `projectId`',
        HELP_IDS.CROSS_DATASET_REFERENCE_INVALID
      )
    )
  }
  if (typeof typeDef.dataset === 'string') {
    const datasetValidation = isValidDatasetName(typeDef.dataset)
    if (datasetValidation !== true) {
      problems.push(error(datasetValidation, HELP_IDS.CROSS_DATASET_REFERENCE_INVALID))
    }
  } else {
    problems.push(
      error(
        'A cross dataset reference must specify a `dataset`',
        HELP_IDS.CROSS_DATASET_REFERENCE_INVALID
      )
    )
  }

  problems.push(...getOptionErrors(typeDef))

  return {
    ...typeDef,
    _problems: problems,
  }
}

function getOptionErrors(typeDef: any): ValidationResult[] {
  const {options} = typeDef
  const problems = [] as ValidationResult[]

  problems.push(
    ...['filter', 'filterParams']
      .filter((key) => key in typeDef)
      .map((key) =>
        error(
          `\`${key}\` is not allowed on a reference type definition - did you mean \`options.${key}\`?`,
          HELP_IDS.REFERENCE_INVALID_OPTIONS_LOCATION
        )
      )
  )

  if (!options) {
    return problems
  }

  if (!isPlainObject(options)) {
    return problems.concat(
      error(
        'The reference type expects `options` to be an object',
        HELP_IDS.REFERENCE_INVALID_OPTIONS
      )
    )
  }

  if (typeof options.filter === 'function' && typeof options.filterParams !== 'undefined') {
    return problems.concat(
      error(
        '`filterParams` cannot be used if `filter` is a function. Either statically define `filter` as a string, or return `params` from the `filter`-function.',
        HELP_IDS.REFERENCE_INVALID_FILTER_PARAMS_COMBINATION
      )
    )
  }

  if (typeof options.filter === 'function' || (!options.filter && !options.filterParams)) {
    return problems
  }

  if (typeof options.filter !== 'string') {
    return problems.concat(
      error(`If set, \`filter\` must be a string. Got ${typeof options.filter}`)
    )
  }

  if (typeof options.filterParams !== 'undefined' && !isPlainObject(options.filterParams)) {
    return problems.concat(error(`If set, \`filterParams\` must be an object.`))
  }

  if (options.filterParams) {
    return problems.concat(
      Object.keys(options.filterParams)
        .filter((key) => key.startsWith('__') || key.startsWith('$'))
        .map((key) => error(`Filter parameter cannot be prefixed with "$" or "__". Got ${key}".`))
    )
  }

  return problems
}
