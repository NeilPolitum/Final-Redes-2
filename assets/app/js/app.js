
const inputImagen = document.getElementById("fileUploader");
const imagenOriginal = document.getElementById("originalImage");
const Comprimir=document.getElementById("btn-compress");

this.outputFormat= "jpg";
this.fileName= "comprimida";

this.sizeOriginal=0;
this.sizeComprimida=0;
this.porcReducida=0;

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
        //console.log('Tamaño original: ', file.size);
        this.sizeOriginal=file.size;
        this.fileName=file.name.split('.')[0];
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
    var buttonDownload = document.getElementById("descargarComprimida");
    buttonDownload.href = compressed.src;
    buttonDownload.download = this.fileName + "-comprimida." + this.outputFormat;
    this.sizeComprimida=file.size;
    this.porcReducida=Math.round(((this.sizeOriginal-this.sizeComprimida)*100)/this.sizeOriginal);
    console.log('Porcentaje reducido:',this.porcReducida,' sizeOriginal:', this.sizeOriginal,'sizeComprimida:',this.sizeComprimida);
    document.getElementById("infoTamañoOriginal").innerHTML = this.reducirBytes(this.sizeOriginal);
    document.getElementById("infoTamañoComprimida").innerHTML = this.reducirBytes(this.sizeComprimida);
    document.getElementById("infoPorcComprimida").innerHTML = this.porcReducida + '%';
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

function reducirBytes(number){
    console.log(number, number.toString().length)
    console.log(number.toString().length<7)
    var respuesta;
    var length=number.toString().length
    if(length<4){
        respuesta=number+' B'
    }else if(length <7){
        console.log('entro')
        respuesta= (number/1000)+' kB'
    }else{
        respuesta=(number/1000000)+' MB'
    }
    return respuesta;
}


