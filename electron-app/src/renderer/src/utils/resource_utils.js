import config from '../config/config'

const r = (relativePath) => {
    //去掉路径前后空格
    let trimedPath = relativePath ? relativePath.trim() : '';
    //如果路径为null、空字符串或只包含空格，返回默认图片
    if (!trimedPath) {
        trimedPath = '/src/assets/images/default-image.png'
    } else if (trimedPath.startsWith('http')) {
        //如果路径以"http"或者"https"开头，直接返回该路径
        return trimedPath
    } else if (trimedPath.startsWith('r')) {
        return `${config.MY_RESOURCE_ENDPOINT}${trimedPath}`
    }

    //否则拼接为绝对路径
    return `${config.MY_RESOURCE_ENDPOINT}${trimedPath}`
}

export default {
    r
}