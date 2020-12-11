import { RawEditorSettings } from 'tinymce';

// export const EDITOR_SETTINGS: RawEditorSettings = {
//     plugins: [
//       'lists link image paste help wordcount bbcode fullpage tabfocus spellchecker code'
//     ],
//     images_upload_url: 'notes/image',
//     images_upload_handler: function (blobInfo, success, failure) {
//       console.log(blobInfo)
//       setTimeout(() => {
//         /* no matter what you upload, we will turn it into TinyMCE logo :)*/
//         success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png');
//       }, 2000);
//     },
//     height: '100%',
//     branding: false,
//     skin: 'MATERIAL',
//     selector: 'textarea',
//     content_css: "/assets/skins/content/MATERIAL/content.css",
//     skin_url: '/assets/skins/ui/MATERIAL',
//     base_url: '/tinymce',
//     suffix: '.min',
//     content_style: 'body { font-family:Roboto,Arial,sans-serif; font-size:14px }'
//   }

  export const EDITOR_SETTINGS: RawEditorSettings = {
        height: '100%',
    branding: false,
    skin: 'MATERIAL',
    selector: 'textarea',
    content_css: "/assets/skins/content/MATERIAL/content.css",
    skin_url: '/assets/skins/ui/MATERIAL',
    base_url: '/tinymce',
    suffix: '.min',
    paste_data_images: true,
    plugins: [
      "advlist autolink lists link image charmap print preview hr anchor pagebreak",
      "searchreplace wordcount visualblocks visualchars code fullscreen",
      "insertdatetime media nonbreaking save table contextmenu directionality",
      "emoticons template paste textcolor colorpicker textpattern"
    ],
    toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
    toolbar2: "print preview media | forecolor backcolor emoticons",
    image_advtab: true,
    templates: [{
      title: 'Test template 1',
      content: 'Test 1'
    }, {
      title: 'Test template 2',
      content: 'Test 2'
    }]
};