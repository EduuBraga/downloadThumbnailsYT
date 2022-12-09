const form = document.querySelector('#form')
const containerThumbnails = document.querySelector('.container-thumbnails')
const imgThumbnail = document.querySelector('.img-thumbnail')

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

const getUrlThumbnails = thumbnails => {
  const sizesThumbails = ['default', 'medium', 'high', 'standard', 'maxres']
  const URLs = []

  sizesThumbails.forEach(type => {
    const sizeExists = thumbnails[type] !== undefined

    if(sizeExists){
      URLs.push({[type]: thumbnails[type].url})
    }
  })

  return URLs
}

const showContainerThumbnails = thumbnails => {
  containerThumbnails.style = 'display: grid'

  const URLS = getUrlThumbnails(thumbnails)

  const urlThumbnailMaxres = thumbnails.maxres.url //1280 x 720
  imgThumbnail.src = urlThumbnailMaxres
}

form.addEventListener('submit', async event => {
  event.preventDefault()

  const link = event.target.search.value
  const idVideo = getIdVideo(link)

  const thumbnails = await getThumbnailsVideo(idVideo)

  if(!thumbnails){
    console.log('thumbnails não existente')
    return
  }

  showContainerThumbnails(thumbnails)
})