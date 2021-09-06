import {PseudoReferenceInput} from './input'

export const pseudoReferenceType = {
  type: 'object',
  name: 'pseudoReference',
  title: 'Pseudo reference',
  inputComponent: PseudoReferenceInput,
  fields: [
    {
      type: 'string',
      name: 'documentId',
      title: 'Document ID',
    },
  ],
}
