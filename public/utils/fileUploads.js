
/*
We want to preview images, so we need to register the Image Preview plugin
*/
FilePond.registerPlugin(
  
	// previews dropped images
  FilePondPluginImagePreview,
	// encodes the file as base64 data
  FilePondPluginFileEncode,
	
  FilePondPluginImageResize,

	// validates the size of the file
	// FilePondPluginFileValidateSize,
	
	// corrects mobile image orientation
	// FilePondPluginImageExifOrientation,
	
);

FilePond.parse(document.body);
// Select the file input and use create() to turn it into a pond
FilePond.create(document.querySelector('input[type="file"]'));

