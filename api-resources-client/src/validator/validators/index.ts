import { DateValidator } from './DateValidator.js'
import { IntValidator } from './IntValidator.js'
import { LinkManyValidator } from './LinkManyValidator.js'
import { LinkOneValidator } from './LinkOneValidator.js'
import { NumberValidator } from './NumberValidator.js'
import { SetValidator } from './SetValidator.js'
import { StringValidator } from './StringValidator.js'
import { TextValidator } from './TextValidator.js'

export const validators = {
  'Afeefa.StringValidator': new StringValidator(),
  'Afeefa.TextValidator': new TextValidator(),
  'Afeefa.LinkOneValidator': new LinkOneValidator(),
  'Afeefa.LinkManyValidator': new LinkManyValidator(),
  'Afeefa.NumberValidator': new NumberValidator(),
  'Afeefa.IntValidator': new IntValidator(),
  'Afeefa.DateValidator': new DateValidator(),
  'Afeefa.SetValidator': new SetValidator()
}
