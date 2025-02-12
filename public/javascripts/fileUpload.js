FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )
FilePond.setOptions({
    stylePanelAspectRatio: 150/100, //inside the documentation https://pqina.nl/filepond/docs/api/instance/properties/
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
}) 

FilePond.parse(document.body)//all into filepond objects