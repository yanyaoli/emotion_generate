const { getImageFileList, writeFile, copyDir } = require('./utils/index')
const generateUtils = require('./utils/generate')
const imagePathList = require('./config')

imagePathList.forEach((item) => {
  const imageList = getImageFileList(item.path)

  const artalk = generateUtils.artalk(imageList, item)
  writeFile(`artalk`, item.path, JSON.stringify(artalk))
  // collect link for combined artalk (use baseUrl if provided, otherwise relative path)
  let artalkLink = ''
  if (item.baseUrl) {
    artalkLink = item.baseUrl.replace(/\/image\/?$/, '') + '/artalk.json'
  } else {
    artalkLink = `./${item.path}/artalk.json`
  }
  // push link string
  if (typeof global.combinedArtalk === 'undefined') global.combinedArtalk = []
  global.combinedArtalk.push(artalkLink)

  const valine = generateUtils.valine(imageList, item)
  writeFile(`valine`, item.path, JSON.stringify(valine))

  const twikoo = generateUtils.twikoo(imageList, item)
  writeFile(`twikoo`, item.path, JSON.stringify(twikoo))

  const waline = generateUtils.waline(imageList, item)
  writeFile(`waline`, item.path, JSON.stringify(waline))
  writeFile(`info`, item.path, JSON.stringify(waline))

  const discuss = generateUtils.discuss(imageList, item)
  writeFile(`discuss`, item.path, JSON.stringify(discuss))

  copyDir(`${item.path}`, `${item.path}`)
})

// 写入总的 artalk.json 到 dist 根目录，格式为链接数组，包含每个分组的 artalk.json 地址
try {
  const list = global.combinedArtalk || []
  writeFile(`artalk`, ``, JSON.stringify(list, null, 2))
} catch (e) {
  console.error('write combined artalk error', e)
}
