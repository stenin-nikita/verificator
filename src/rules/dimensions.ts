import requireParameterCount from '../helpers/requireParameterCount'
import isFile from '../helpers/isFile'
import parseNamedParameters from '../helpers/parseNamedParameters'
import failsBasicDimensionChecks from '../helpers/failsBasicDimensionChecks'
import failsRatioCheck from '../helpers/failsRatioCheck'

const validate = (attribute: string, value: any, parameters: any[], validator: any): boolean|Promise<boolean> => {
    requireParameterCount(1, parameters, 'dimensions')

    if (!isFile(value)) {
        return false
    }

    const file: File = value instanceof FileList ? value[0] : value

    if (! /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(file.name)) {
        return false
    }

    return new Promise(resolve => {
        const image = new Image()
        const imageParameters = parseNamedParameters(parameters)

        image.onerror = () => resolve(false)
        image.onload = () => {
            if (failsBasicDimensionChecks(imageParameters, image.width, image.height) ||
                failsRatioCheck(imageParameters, image.width, image.height)) {
                resolve(false)
            } else {
                resolve(true)
            }
        }

        image.src = URL.createObjectURL(file)
    })
}

export default validate