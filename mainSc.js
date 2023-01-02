//Variables gloabales
let array;//array que guarda el diccionario, ordenador por lenght(de mas a menos)
let arrayBloque1 = [false,false,false,false,false,false,false,false,false,false,false,false];//comprueba en todo momento si las casillas(las palabras) son correctas o no lo son
let mostrado = [false, false];//para que solo muestre una vez si el bloque ha sido resuelto
const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};//para los acentos
//MODO ACENTOS SI

//Obtencion del fichero diccionario, ASINCRONAMENTE y lo guarda en array ordenadodo por tamaño.
function GetD(){
    var url = "https://ordenalfabetix.unileon.es/aw/diccionario.txt";
    fetch(url,
        {
        method:"GET"
     })
    .then(data => data.text())
    .then(fileData => {
        let vector = fileData.split("\n");
        //hardcoreado
        vector.push("nace");
        vector.push("nací");
        vector.push("remato");
        vector.push("tolero");
        //enDiccionario
        array = vector.sort((a,b)=>{
        return a.length - b.length;
        });
    })
}


///////////////////PARTE DE LA DERECHA//////////////////////////

//funcion que resuleve el ejercicio, esta en cada elemento input text, en su metodo onChange
function resolver(esto){

let elementoThis = esto;
let name = elementoThis.getAttribute("name");//el nombre, por ejemplo 0,1,2,...

if(document.getElementById("alm").checked == true){
    localStorage.setItem(`cuadro${(Number(name))}`,elementoThis.value);//guarda la casilla persistentemente
}

let max = Number(name);//id
//primer bloque
if(max<100){
while(max % 4 != 0){
    max--;
}
let target = max;//name, que empieza en 0
resolvertComplemento(max,target,4,true);
//segundo bloque
}else{
    let nuevoMax = "";
    if(max <110){
         nuevoMax = String(max).charAt(2);
    }else{
         nuevoMax = String(max).charAt(1) + String(max).charAt(2);
    }
    nuevoMax = Number(nuevoMax);
    while(nuevoMax % 6 != 0){
        max--;
        nuevoMax--;
    }
    let target = max;//name
    //el nuevo mas lo uso para poder trabajar con 100 mas facilmente, aunque luego no hago nada con el
    //si no que envio otra vez el 100,101...
    resolvertComplemento(max,target,6,true);
    }
}
//funcion simplificada, para abstraerse de las dos implmentaciones de los bloques
function resolvertComplemento(max,target,casillas,noBucle){
//max empieza en 1, serie el id.
//target empiza en 0, seria el name.
let palabra ="";
let palabraAnterior =""; 
//encuentra la palabra actual, emprezando en el primer bloque
for(let x = max;x<max + casillas;x++){
    let elemento = document.getElementById(`cuadro${x}`);
    palabra += elemento.value;
    }
//encuentro la palabra siguiente al actual
if((target != 0 && casillas==4) || (casillas == 6 && target != 100)){
    for(let x = max - casillas;x<max;x++){
        let elemento = document.getElementById(`cuadro${x}`);
        palabraAnterior += elemento.value;
    }
}
    palabra = palabra.toLocaleLowerCase();// a minuscula
    palabraAnterior = palabraAnterior.toLocaleLowerCase();//a minuscula
 
    //palabra = palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");//IMPORTANTE, les quito el acento para comparar
    //palabraAnterior = palabraAnterior.normalize("NFD").replace(/[\u0300-\u036f]/g, "");//IMPORTANTE, les quito el acento para comparar
    //solo las palabras del bloque 1, es decir, 4 silabas
    if(palabra.length == casillas && casillas == 4){
        //Si no esta la palabra en el dicionario, alerta indicandolo
        if(enDicionario(palabra)){
            palabra = palabra.split('').map( letra => acentos[letra] || letra).join('').toString();	
            palabraAnterior = palabraAnterior.split('').map( letra => acentos[letra] || letra).join('').toString();	
            //primera palabra
            if(target == 0){
                //tiene que ser la misma palabra
                if(palabra == "clan"){
                
                if(noBucle){
                alert("La palabra 1 es correcta!!.");
                    }
                //siempre compruebo que no cambio la casilla
                arrayBloque1[0] = true;
                }else{
                //si ha cambiado la casilla, marco false
                arrayBloque1[0] = false;
                }
            //Ultima casilla del bloque(4 + 4 + 4 + 4 + 4 + 4)
            }else if(target == 20 ){
                if(palabra=="pena"){
                if(noBucle){
                alert("La palabra 2 es correcta!!.");
                }
                arrayBloque1[1] = true;
                }else{
                arrayBloque1[1] = false;
                }
            //palabras intermedias
            }else{
                //La tercera casilla, es decir la 8 y 16 que son mod 8 = 0
                if(target % 8 == 0){
                //la comprobacion de que esta palabra y su siguientes sea un anagrama puro
                if(anagrams1(palabra,palabraAnterior,palabra.length)){
                    switch(target){
                        case 8: arrayBloque1[2] = true;
                        if(noBucle){
                        alert("La palabra intermedia es correcta!!.");
                        }
                        break;
                        //el 16, pero ademas comprueba que la palabra superior suya que es la ultima tambien esta bien
                        default:
                            let margen = 1;
                            for(let x = 0;x<palabra.length;x++){
                                if(palabra.charAt(x) != "pena".charAt(x)){
                                    margen--;
                                }
                            }
                            //LO QUE PASA AQUI, tengo que comprobar que cambio un solo simbolo de esta palabra comparado con PENA, ya que pena al ser la ultima no la compruebo
                            if(margen == 0){
                             arrayBloque1[3] = true;
                             if(noBucle){
                             alert("La palabra intermedia es correcta!!.");
                             }
                            }
                    }
                }else{
                    switch(target){
                        case 8: arrayBloque1[2] = false;
                        break;
                        default: arrayBloque1[3] = false;
                    }
                }


                //El resto de las posiciones que quedan, es decir la 4 y 12
                //solo cambia un simbolo
                 }else{
                    let margen = 1;
                    for(let x = 0;x<palabra.length;x++){
                        if(palabra.charAt(x) != palabraAnterior.charAt(x)){
                            margen--;
                        }
                    }
                    //si solo cambia un simbolo
                    if(margen == 0){
                        switch(target){
                            case 4: arrayBloque1[4] = true;
                            if(noBucle){
                            alert("La palabra intermedia es correcta!!.");
                            }
                            break;
                            default: arrayBloque1[5] = true;
                            if(noBucle){
                            alert("La palabra intermedia es correcta!!.");
                        }

                        }
                        //si no es correcta
                        }else{
                            switch(target){
                                case 4: arrayBloque1[4] = false;
                                break;
                                default: arrayBloque1[5] = false;
                            }
                        }
                
                }


            }
        //checkea si esta resulto, todo el arrayBloque1 = true    
        resuelto();
        //compruena cada vez que intrucucimos una palabra, ya sea correcta o no, si el resto de palabras son correctas o no
        if(noBucle){
        update(casillas);//las llamadas a este metodo vuelven a llamar a este metodo pero con noBucle a false
        }
        //En el caso de que la palabra no este en el diccionario
        }else{
        if(noBucle){
        alert("La palabra no existe.");//para no molestar todo el rato al usuario de que la palabra no existe
        }
        }
    //en el caso de que sea el bloque 2
    }else if(palabra.length == casillas && casillas == 6){
        if(enDicionario(palabra)){
            palabra = palabra.split('').map( letra => acentos[letra] || letra).join('').toString();	
            palabraAnterior = palabraAnterior.split('').map( letra => acentos[letra] || letra).join('').toString();	
            //prierma palabra
            if(target == 100){
                if(palabra == "remato"){
                if(noBucle){
                alert("La palabra 3 es correcta!!.");
                }
                arrayBloque1[6] = true;
                }else{
                arrayBloque1[6] = false;
                }
            //ultima palabra
            }else if(target == 130){
                if(palabra=="torero"){
                if(noBucle){
                alert("La palabra 4 es correcta!!.");
                }
                arrayBloque1[7] = true;
                }else{
                    arrayBloque1[7] = false;

                }
            }else{
                let nuevoTarget = "";
                    //para trabajar mas comodo, serai como empezar de 0
                    if(target <110){
                    nuevoTarget = String(target).charAt(2);
                  }else{
                    nuevoTarget = String(target).charAt(1) + String(target).charAt(2);
                     }
                nuevoTarget = Number(nuevoTarget);
                target = nuevoTarget;
                //mover
                //la tercera y pernultima, tiene que ser anagrama perfecto del anterior
                if(target % 12 == 0){
                if(anagrams1(palabra,palabraAnterior,palabra.length)){
                    switch(target){
                        case 12: arrayBloque1[8] = true;
                        if(noBucle){
                        alert("La palabra intermedia es correcta!!.");
                        }
                        break;
                        default:
                            let margen = 1;
                            for(let x = 0;x<palabra.length;x++){
                                if(palabra.charAt(x) != "torero".charAt(x)){
                                    margen--;
                                }
                            }
                            //aqui lo mismo, compruebo que solo cambio un simbolo con respecto a torero, ya uqe torero no la compruebo
                            if(margen == 0){
                             arrayBloque1[9] = true;
                             if(noBucle){
                             alert("La palabra intermedia es correcta!!.");
                             }
                            }
                    }
                }else{
                    switch(target){
                        case 12: arrayBloque1[8] = false;
                        break;
                        default: arrayBloque1[9] = false;
                    }
                }


                //cambiar una letra, tiene que cambiar una letra con la anterior, para la 2 y 4 palabra
                }else{
                    let margen = 1;
                    for(let x = 0;x<palabra.length;x++){
                        if(palabra.charAt(x) != palabraAnterior.charAt(x)){
                            margen--;
                        }
                    }
                    if(margen == 0){
                        //si es correcto
                        switch(target){
                            case 6: arrayBloque1[10] = true;
                            if(noBucle){
                            alert("La palabra intermedia es correcta!!.");
                            }
                            break;
                            default: arrayBloque1[11] = true;
                            if(noBucle){
                            alert("La palabra intermedia es correcta!!.");
                            }

                        }
                        }else{
                            //si no
                            switch(target){
                                case 6: arrayBloque1[10] = false;
                                break;
                                default: arrayBloque1[11] = false;
                            }
                        }
                
                }


            }
        resuelto();//resolver si el bloque esta completo
        if(noBucle){
        update(casillas);//por si acaso cambio alguna
        }
        }else{
            if(noBucle){
        alert("La palabra no existe.");//si la palabra no esta en el diccionario
            }
        }
    } 
}

//actualizo en el caso de que haya algo de por medio, por ejemplo si empiezo por el otro lado y no por el principio
function update(casillas){
    //bloque 1
    if(casillas == 4){
        let max = 0;//id
        let target = 0;//name
        for(let x = 1;x<=6;x++){
            resolvertComplemento(max,target,casillas,false);
            max = max + 4;
            target = target + 4;
        }
    //bloque2
    }else if(casillas == 6){
        let max = 100;//id
        let target = 100;//name
        for(let x = 1;x<=6;x++){
            resolvertComplemento(max,target,casillas,false);
            max = max + 6;
            target = target + 6;
        }
    }
}

//Funcion que comprueba que todo casa bien y que cada bloque esta resuelto, en caso de exito, solo avisa una vez por sesion y lo indica.
function resuelto(){

let contador1= 0;//bloque 1
let contador2 = 0;//bloque 2
let i = 1;
 for(let x of arrayBloque1){
     if(x == true && i<=6){
        contador1++;
     }
     if(x == true && i >6){
        contador2++;
     }
  i++;
 }
//para no repetir en cada momento que se complete una palabra que el bloque esta resuelto, solo se muestra 1 vez
if(contador1 == 6 && mostrado[0] == false){
alert("Bloque 1 resuelto");
mostrado[0] = true;
document.getElementById("estatusbloque1").innerHTML = "Resuelto!!.";
localStorage.setItem("estatusbloque1" , document.getElementById("estatusbloque1").innerHTML);
}
if(contador2 == 6 && mostrado[1] == false){
alert("Bloque 2 resuleto");
mostrado[1] = true;
document.getElementById("estatusbloque2").innerHTML = "Resuelto!!.";
localStorage.setItem("estatusbloque2" , document.getElementById("estatusbloque2").innerHTML);

}


}


//Almacenamiento local del tablero y aledaños, opcional info del estado de la resolucion
function almacenar(){
let elemento = document.getElementById("alm");

//si es true, pues bindeo todas las casillas del tablero alas cockies
if(elemento.checked == true){
    localStorage.setItem("alm",elemento.checked);
    let max = 0;//id del primer del BLOQUE 1
    for(let i = 1;i<=6;i++){
        for(let x = 1;x<=4;x++){
            let elemento = document.getElementById(`cuadro${max}`);
            localStorage.setItem(`cuadro${max}`,elemento.value);
            max++;
            }
        }
     max = 100;//id del primero del BLOQUE 2
    for(let i = 1;i<=6;i++){
           for(let x = 1;x<=6;x++){
              let elemento = document.getElementById(`cuadro${max}`);
              localStorage.setItem(`cuadro${max}`,elemento.value);
              max++;
                }
            }
    localStorage.setItem("estatusbloque1" , document.getElementById("estatusbloque1").innerHTML);
    localStorage.setItem("estatusbloque2" , document.getElementById("estatusbloque2").innerHTML);

    //si es false, si estaban vindeadas las casillas, pues borro todo el almacenamiento que tenia
    }else{
        localStorage.removeItem("alm");
        let max = 0;//id del primer del BLOQUE 1
        for(let i = 1;i<=6;i++){
            for(let x = 1;x<=4;x++){
                let elemento = document.getElementById(`cuadro${max}`);
                localStorage.removeItem(`cuadro${max}`,elemento.value);
                max++;
                }
            }
            max = 100;//id del primero del BLOQUE 2
            for(let i = 1;i<=6;i++){
                for(let x = 1;x<=6;x++){
                    let elemento = document.getElementById(`cuadro${max}`);
                    localStorage.removeItem(`cuadro${max}`,elemento.value);
                    max++;
                    }
                }
            localStorage.removeItem("estatusbloque1");
            localStorage.removeItem("estatusbloque2");


    }
}

//recupera la infor del tablero y aledaños, opcional el del estaod de la completitud del bloque
function recuperar(){

    let alm = localStorage.getItem("alm");//el boolean se almaceno como un String 
    //si la casilla esta true, recuperamos
    if(alm == "true"){
    document.getElementById("alm").checked = true;
    let max = 0;//id primero bloque 1
    for(let i = 1;i<=6;i++){
        for(let x = 1;x<=4;x++){
            let elemento = document.getElementById(`cuadro${max}`);
            let contenido = localStorage.getItem(`cuadro${max}`);
            max++;
            elemento.value = contenido;
            }
        }
     max = 100;//id primer bloque 2
    for(let i = 1;i<=6;i++){
        for(let x = 1;x<=6;x++){
            let elemento = document.getElementById(`cuadro${max}`);
            let contenido = localStorage.getItem(`cuadro${max}`);
            max++;
            elemento.value = contenido;
            }
        }
        document.getElementById("estatusbloque1").innerHTML = localStorage.getItem("estatusbloque1");
        document.getElementById("estatusbloque2").innerHTML = localStorage.getItem("estatusbloque2");

    }

}

//pregunta al usuario si quiere almacenaniento el local, si es asi, lo hace
function mensajeCockies(){
    let elem = localStorage.getItem("alm");
    //si tenia almacenamiento persistene no preguntamos
    if(elem != "true"){
        
    setTimeout(() => {
        let msj = confirm("Deseas almacenar el Pasatiempo en Local?\nPD: Prodras desactivar/activar esta caracteristica en una CheckBox.")
        if(msj == true){
            document.getElementById("alm").checked = true;//marcamos la casilla como true
            almacenar();
            }
    }, 2);
    }
}

//crea el tablero utilizando unicamente JS
function crearTablero(){

    let tabla = document.getElementById("tabla");
    let corClase = 0;
    let corId = 0;
    let numerico = 1;
    let span, nodo;
    ///////////////
    //Primer bloque
    //cada iteracion es una palabra
    for(let i = 0;i<6;i++){
        let row =  document.createElement("tr");

        //bloque INUSUO para que empieze en la seguna columna y no en la primera
        span = document.createElement("p");
        nodo = document.createTextNode("");
        span.appendChild(nodo);
        row.appendChild(span);      
    //los inputs de una palabra
    for(let j = 0;j<4;j++){
            let column = document.createElement("td");
            let inp = document.createElement("input");
            inp.setAttribute("class","cuadro");
            inp.setAttribute("id",`cuadro${corId++}`);
            inp.setAttribute("name",`${corClase++}`);
            inp.setAttribute("maxlength","1");
            inp.setAttribute("onchange","resolver(this)");
            column.appendChild(inp);
            row.appendChild(column);
           
            
    }
    //los labels 1 y 2
    if(i == 0 || i == 5){
        span = document.createElement("p");
        nodo = document.createTextNode(`${numerico++}`);
        span.style.paddingLeft = "15px";
        span.style.fontWeight = "bold";
        span.appendChild(nodo);
        row.appendChild(span);

    }
    tabla.appendChild(row);
}



    corClase = 100;
    corId = 100;
    ////////////////
    //Segundo bloque
    for(let i = 0;i<6;i++){
    let row =  document.createElement("tr");
    
    //las labels 3 y 4
    if(i == 0 || i == 5){
        span = document.createElement("p");
        nodo = document.createTextNode(`${numerico++}`);
        span.style.paddingRight = "15px";
        span.style.fontWeight = "bold";
        span.appendChild(nodo);
        row.appendChild(span);

    }else{
        //bloque INUSUO para que empieze en la segunda columna
        span = document.createElement("p");
        nodo = document.createTextNode("");
        span.appendChild(nodo);
        row.appendChild(span);  
    }
    //los inputs de una palabra del bloque 2
    for(let j = 0;j<6;j++){
            let column = document.createElement("td");
            let inp = document.createElement("input");
            inp.setAttribute("class","cuadro");
            inp.setAttribute("id",`cuadro${corId++}`);
            inp.setAttribute("name",`${corClase++}`);
            inp.setAttribute("maxlength","1");
            inp.setAttribute("onchange","resolver(this)");
            column.appendChild(inp);
            row.appendChild(column);
            
    }
   
    tabla.appendChild(row);
}
}

//limpiar pasatiempos
function limpiar(){
    let max = 0;//id del primer del BLOQUE 1
    for(let i = 1;i<=6;i++){
        for(let x = 1;x<=4;x++){
            document.getElementById(`cuadro${max}`).value = "";
            localStorage.removeItem(`cuadro${max}`);
            max++;
            }
        }
     max = 100;//id del primero del BLOQUE 2
    for(let i = 1;i<=6;i++){
           for(let x = 1;x<=6;x++){
              document.getElementById(`cuadro${max}`).value = "";
              localStorage.removeItem(`cuadro${max}`);
              max++;
                }
            }

document.getElementById("estatusbloque1").innerHTML = "No Resuelto";
document.getElementById("estatusbloque2").innerHTML = "No Resuelto";
localStorage.setItem("estatusbloque1" , document.getElementById("estatusbloque1").innerHTML);
localStorage.setItem("estatusbloque2" , document.getElementById("estatusbloque2").innerHTML);

}

///////////////////PARTE DE LA IZQUIERDA//////////////////////////
//Parte de las pistas, 3.
function mostrarPista(event){
    event.preventDefault();//en el caso de que le de a enter en la form
    let contador = document.getElementById("contadorIntentos");
    let num = contador.innerHTML;

    //si tengo intentos
    if(num > 0){
    let palabra  = document.getElementById("textPista");//palabra introducida en la pista
    palabra = palabra.value.toLowerCase().split('').map( letra => acentos[letra] || letra).join('').toString();
   
    //
    let versionPura = true;
    let arrayResult = [];
    //
    
    //Version 2!Mas pura!(Si quiero un anagrama perfecto uso anagrams1 y comento version2 y cambio en el forEach el arrayRe por arrayLenght)
    if(versionPura){
    arrayResult = array.filter(element => {
         if(anagrams1(element,palabra,palabra.length)){
                return element;
                
            }       
    });
    }else{
   //version 1, anagrama mas impurto
      let arrayR = [];
      array.forEach(element =>{
      if(element.length >= palabra.length){
      let ini = -1;
      for(let p = 0;p<element.length;p++){
      let strReg = "";
      let strin = palabra;
      ini++;
      let elementC = element;
      element = element.split('').map( letra => acentos[letra] || letra).join('').toString();
      let started = false;
      for(let a = ini; a < element.length; a++){
         //console.log(element+ " aqui con " +ini);
          if(element.charAt(a).search(new RegExp("["+`${strin}`+"]")) >= 0){
              strReg +=elementC.charAt(a);
              let nuevo = "";
              for(let j = 0;j<strin.length;j++){
                if((strin.charAt(j) == element.charAt(a))){
                    for(let l = 0;l<strin.length;l++){
                        if(l != j){
                            nuevo += strin.charAt(l);
                        }
                    }
                    break;
                }
            }
          strin = nuevo;
          started = true;
          }else if(started){
              break;
          } 
      if(strReg.length >= palabra.length){
        arrayR.push(strReg);
        }
    }
}
}
   })
   //2
   let arrayRe = [];
   arrayR.forEach(element=>{
      if(anagrams1(element,palabra)){
          arrayRe.push(element);
      } 
   });
   //3
   arrayResult = removeDuplicates(arrayRe);
   //terminacion version1
}

let str = ""; 
//depende del modo, comento version1, y cambio arrayRe por arrayLength
arrayResult.forEach(element => {
str += element +"\n";
});
    document.getElementById("textAreaPista").textContent = str;
    contador.innerHTML = --num;
     //Si no tengo intentos
     }else{
            alert("No tienes mas pistas disponibles.");
            document.getElementById("textAreaPista").textContent = "No hay mas pistas en esta sesion."
        }
}

//Remueve duplicados
function removeDuplicates(arrayPasado) {
    return arrayPasado.filter((a, b) => arrayPasado.indexOf(a) === b)
  };


//el uno, anagrama exacto(puro)
function anagrams1(stringA, stringB,tam) {

    return cleanString(stringA,tam) === cleanString(stringB,tam);
   
}


function cleanString(str,tam) {
       /*
    for(let i = 0; i<str.length;i++){
        if(str.charAt(i) == ' '){
            tam--;
        }
    }
   return str.replace(/[^\w]{tam,tamA}/g,'').toLowerCase().split('').sort().join('')
    */
   //por si tiene espacios, que este incluida
   str = str.split('').map( letra => acentos[letra] || letra).join('').toString();
   let strNew =  str.replace(/[^\w]{tam}/g,'').toLowerCase().split('').sort().join('');
   return strNew;
   }

//el dos, palabras que contienen todas las letas, de todos los tamaños.[ACTUALMENTE NO SE USA]
function anagrams2(stringA,stringB,tam){
    let exp = new RegExp(cleanString(stringB));
    if(cleanString(stringA).search(exp) >= 0){
        return true;
    }
    return false;
}

//la tres, palabras que contienen esas letras en el medio, principio... solo esa parte.


//si la palabra esta en el diccionario, es decir, si esta al menos justo esa parte en una palabra del diccionario
function enDicionario(palabra){
    let word = String(palabra);
    
    let exp = new RegExp(word);//si tiene esa palabra contenida en una palabra del diccionario ha de ser >= 0
    for(let x of array){
        //si no fuese de este modo, solo habira que hacer que x == palabra
        /*
        if(x.search(exp) >= 0){
            return true;
        }
        */
        if(x === palabra){
            return true;
        }
        
    }
    return false;
}