const failsBasicDimensionChecks = (parameters: { [key:string]:string }, width: number, height: number): boolean => {
    return ('width' in parameters && Number(parameters.width) != width) ||
           ('min_width' in parameters && Number(parameters.min_width) > width) ||
           ('max_width' in parameters && Number(parameters.max_width) < width) ||
           ('height' in parameters && Number(parameters.height) != height) ||
           ('min_height' in parameters && Number(parameters.min_height) > height) ||
           ('max_height' in parameters && Number(parameters.max_height) < height)
}

export default failsBasicDimensionChecks