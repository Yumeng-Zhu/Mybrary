const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue ('--book-cover-width-large') != null &&  rootStyles.getPropertyValue('--book-cover-width-large') !== '') {
  ready()
} else{
  document.getElementById('main-css').addEventListener('load',ready)
}
// check whether main.css is loaded

function ready(){
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'))
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
  const coverHeight = coverWidth / coverAspectRatio
    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode,
      )
      
    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverAspectRatio, //inside the documentation https://pqina.nl/filepond/docs/api/instance/properties/
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    }) 

    FilePond.parse(document.body)//all into filepond objects
}

  