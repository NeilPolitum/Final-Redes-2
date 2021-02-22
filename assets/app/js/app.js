
var CompressorView = Backbone.View.extend({
    outputFormat: "jpg",
    fileName: "compressed",
    initialize: function() {
        this.slider = this.getSlider();
        this.render();
    },
    render: function() {
        return this;
    },
    events: {
        "change #fileUploader": "uploadOriginalFile",
        "click #btn-compress": "compressImage"
    },
    getSlider: function() {
        return $('.slider-input').jRange({
            from: 1,
            to: 100,
            step: 1,
            scale: [],
            format: '%s',
            width: 'auto',
            showLabels: true,
            theme: "theme-blue"
        });
    },
    uploadOriginalFile: function(e) {
        console.log(e.target);
        var fileUploader = $(e.target),
            file;
        if (fileUploader[0].files && fileUploader[0].files[0]) {
            file = fileUploader[0].files[0];
            console.log(fileUploader[0]);
            var reader = new FileReader();
            reader.onload = this.imageIsLoaded;
            reader.readAsDataURL(file);
            console.log(file);
            console.log('Tamaño original: ',file.size);
            document.getElementById("infoOriginal").innerHTML=file.size+' bytes';
            if (file.type == "image/png") {
                this.outputFormat = "png";
            }
            this.fileName = file.name.substring(0, file.name.length - this.outputFormat.length - 1);
            this.$(".compressed-image-container").addClass("hidden");
            this.$("#btn-compress").prop("disabled", false);
        }
    },
    getBase64Image:function(img) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
    
        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
    
        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to guess the
        // original format, but be aware the using "image/jpg" will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");
    
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    },
    dataURLtoFile: function(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
    },
    compressImage: function (e) {
        var quality = this.slider.val();
        var compressed = jic.compress(document.getElementById("originalImage"), quality, this.outputFormat);
        console.log(compressed.src);
        var img= new Image();
        //console.log("Tamaño de la imagen",document.getElementById("originalImage").fileSize);
        img.src=compressed.src; 
        var file=this.dataURLtoFile(compressed.src,'comprimida.jpg')
        this.$("#compressedImage").attr("src", compressed.src);
        document.getElementById("imagenComprimida").src=compressed.src;
        //this.$("#imagenComprimida").attr("src", img);
        this.$(".compressed-image-container").removeClass("hidden");
        document.getElementById("Resultado").style.visibility='visible';
        document.getElementById("infoComprimida").innerHTML=file.size+' bytes';
        var buttonDownload=document.getElementById("descargarComprimida");
        buttonDownload.href=compressed.src;
        buttonDownload.download=this.fileName + "-compressed." + this.outputFormat;
        console.log('imagen:',img);
        console.log('file:',file)
    },
    imageIsLoaded: function(e) {
        $('#originalImage').attr('src', e.target.result);
        $('#imagenOriginal').attr('src', e.target.result);
    },
    
});

$(document).ready(function() {
    var compressorView = new CompressorView({
        el: '#compressor-image-container'
    });
});
