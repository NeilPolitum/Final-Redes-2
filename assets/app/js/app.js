
const inputImagen = document.getElementById("fileUploader");
const imagenOriginal = document.getElementById("originalImage");
const Comprimir=document.getElementById("btn-compress");

const outputFormat= "jpg";
const fileName= "compressed";

this.slider=this.getSlider();


inputImagen.addEventListener('change', (event)=> {
    console.log(event);
    var fileUploader = $(event.target),
        file;
    if (fileUploader[0].files && fileUploader[0].files[0]) {
        file = fileUploader[0].files[0];
        console.log(fileUploader[0]);
        var reader = new FileReader();
        reader.onload = this.imageIsLoaded;
        reader.readAsDataURL(file);
        console.log(file);  
        console.log('Tamaño original: ', file.size);
        document.getElementById("infoOriginal").innerHTML = file.size + ' bytes';
        if (file.type == "image/png") {
            this.outputFormat = "png";
        }
        //this.fileName = file.name.substring(0, file.name.length - this.outputFormat.length - 1);
        document.getElementById("handle").classList.remove("hidden")
        this.$(".compressed-image-container").addClass("hidden");
        this.$("#btn-compress").prop("disabled", false);
    }
});

Comprimir.addEventListener('click',(e)=>{
    var quality = this.slider.val();
    var compressed = jic.compress(document.getElementById("originalImage"), quality, this.outputFormat);
    console.log(compressed.src);
    var img = new Image();
    //console.log("Tamaño de la imagen",document.getElementById("originalImage").fileSize);
    img.src = compressed.src;
    var file = this.dataURLtoFile(compressed.src, 'comprimida.jpg')
    this.$("#compressedImage").attr("src", compressed.src);
    document.getElementById("imagenComprimida").src = compressed.src;
    //this.$("#imagenComprimida").attr("src", img);
    this.$(".compressed-image-container").removeClass("hidden");
    document.getElementById("Resultado").style.visibility = 'visible';
    document.getElementById("infoComprimida").innerHTML = file.size + ' bytes';
    var buttonDownload = document.getElementById("descargarComprimida");
    buttonDownload.href = compressed.src;
    buttonDownload.download = this.fileName + "-compressed." + this.outputFormat;
    console.log('imagen:', img);
    console.log('file:', file)
})


function imageIsLoaded(e) {
    $('#originalImage').attr('src', e.target.result);
    $('#imagenOriginal').attr('src', e.target.result);
}

function getSlider() {
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
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}



