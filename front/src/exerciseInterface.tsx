import keyWordTransformationInterface from './keyWordTransformationInterface'
import openClozeInterface from './openClozeInterface'

export default interface exerciseInterface {
  id: number
  name: string
  data: openClozeInterface | keyWordTransformationInterface
}
