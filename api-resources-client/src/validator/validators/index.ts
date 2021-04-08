import { registerValidator } from '../ValidatorRegistry'
import { VarcharValidator } from './VarcharValidator'

registerValidator('Afeefa.VarcharValidator', new VarcharValidator())
