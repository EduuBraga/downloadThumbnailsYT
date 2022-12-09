const form = document.querySelector('#form')
const containerResult = document.querySelector('.container-result')
const cardsThumbnails = document.querySelector('.cards-thumbnails')

const namesSizeThumbnails = ['medium', 'high', 'standard', 'maxres']
const sizesThumbnails = [
  '320 x 180',
  '480 x 360',
  '640 x 480',
  '1280 x 720'
]

const getThumbnailsVideo = async idVideo => {
  const KEYapi = "AIzaSyBNtmsQjdd06IEHyNCTv0A5XRmez7_tIHw"
  const URL = `https://www.googleapis.com/youtube/v3/videos?id=${idVideo}&key=${KEYapi}&part=snippet`

  try {
    const response = await fetch(URL)

    if (!response.ok) {
      throw new Error('video não encontrado')
    }

    const video = await response.json()

    return video.items[0].snippet.thumbnails
  } catch (error) {
    console.log(error.message)
  }
}

const getIdVideo = link => {
  const firstCut = link.lastIndexOf('v=') + 2
  const lastIndex = link.length

  //retornando id do vídeo
  return link.slice(firstCut, lastIndex)
}

const showContainerResult = thumbnails => {
  containerResult.style = 'display: grid'

  namesSizeThumbnails.forEach((nameSize, index) => {
    const sizeCurrent = sizesThumbnails[index]
    const cardThumbCurrent = document.querySelector(`.card-thumb${index + 1}`)
    const URLExists = thumbnails[nameSize] !== undefined

    if (URLExists) {
      const URLcurrent = thumbnails[nameSize].url

      cardThumbCurrent.innerHTML = `
        <p>${sizeCurrent}</p>
        <img 
          src="${URLcurrent}" 
          alt="Thumbnail ${sizeCurrent}"
        > 
      `
    }
  })
}

form.addEventListener('submit', async event => {
  event.preventDefault()

  const link = event.target.search.value
  const idVideo = getIdVideo(link)

  const thumbnails = await getThumbnailsVideo(idVideo)

  if (!thumbnails) {
    console.log('thumbnails não existente')
    return
  }

  showContainerResult(thumbnails)
})