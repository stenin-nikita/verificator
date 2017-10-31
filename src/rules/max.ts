import requireParameterCount from '../helpers/requireParameterCount'
import getSize from '../helpers/getSize'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean => {
    requireParameterCount(1, parameters, 'max')

    // TODO
    // if (value instanceof UploadedFile && ! $value->isValid()) {
    //     return false;
    // }

    const [ max ] = parameters

    return getSize(attribute, value, validator) <= Number(max)
}

export default validate