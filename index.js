const form = document.querySelector('#form')
const containerResult = document.querySelector('.container-result')
const feedbackError = document.querySelector('.feedback-error')
const titleThumbnails = document.querySelector('.title-thumbnails')

const namesSizeThumbnails = ['medium', 'high', 'standard', 'maxres']
const sizesThumbnails = ['320 x 180', '480 x 360', '640 x 480', '1280 x 720']

const getDataVideo = async idVideo => {
  const KEYapi = "AIzaSyBNtmsQjdd06IEHyNCTv0A5XRmez7_tIHw"
  const URL = `https://www.googleapis.com/youtube/v3/videos?id=${idVideo}&key=${KEYapi}&part=snippet`

  try {
    const response = await fetch(URL)
    const dataVideoParsing = await response.json()
    const isDataVideoNotFound = dataVideoParsing.items.length === 0

    if (isDataVideoNotFound) {
      throw new Error('video não encontrado')
    }

    const dataVideo = dataVideoParsing.items[0].snippet

    return dataVideo
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

const showContainerResult = (thumbnails, title) => {
  containerResult.style = 'display: grid'
  titleThumbnails.textContent = `Thumbnails do vídeo: ${title}`

  namesSizeThumbnails.forEach((nameSize, index) => {
    const sizeCurrent = sizesThumbnails[index]
    const cardThumbCurrent = document.querySelector(`.card-thumb${index + 1}`)
    const URLExists = thumbnails[nameSize] !== undefined

    if (URLExists) {
      const URLcurrent = thumbnails[nameSize].url

      cardThumbCurrent.innerHTML = `
        <p>${sizeCurrent}</p>
        <img src="${URLcurrent}" alt="Thumbnail ${sizeCurrent}"> 
      `
    }
  })
}

const showFeedbackError = () => {
  feedbackError.style = 'display: block'
  feedbackError.textContent = "URL inválida"
  form.search.classList.add('border-error')
  containerResult.style = 'display: none'
}

const hiddenFeedbackError = () => {
  const elementError = document.querySelector('.border-error')

  if (elementError) {
    feedbackError.style = 'display: none'
    feedbackError.textContent = ''
    form.search.classList.remove('border-error')
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault()
  const URLInput = event.target.search.value

  const idVideo = getIdVideo(URLInput)
  const dataVideo = await getDataVideo(idVideo)

  //Remove feedback de erro (caso existente)
  hiddenFeedbackError()

  //Mostra feedback de erro quando requisição for mal sucedida
  if (!dataVideo) {
    showFeedbackError()
    return
  }

  //Mostra resultado da requisição
  showContainerResult(dataVideo.thumbnails, dataVideo.title)
})