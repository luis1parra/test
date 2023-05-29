import { GLTFLoader } from "./threeLibraries/GLTFLoader.js";
import { OrbitControls } from "./threeLibraries/OrbitControls.js";
import { DragControls } from "./threeLibraries/DragControls.js";
import { TransformControls } from "./threeLibraries/TransformControls.js";
import * as CubeControl from './cubeControl.js';
import { dragStartFunc, allowDropFunc, clickedFunc, dropFunc,controlChanged,clickedItemFunc} from "./pruebaFuncionExterna.js";


import { crearLamparas, cameraFlash, ponerEnvmap, borrarTV , loadImageTexture , crearPaneleria , crearPaneleriaPared , crearTruss, loader ,onProgress, onError, loadPaneleria,groupPaneleriaIzq,groupPaneleriaDer,groupPaneleriaTra ,loadTruss ,cargarPabellon,pintarGrid , groupPaneleriaPared, groupTruss, pabellon, groupLamparas} from "./functions.js";

window.clickedFunc = clickedFunc;
window.dragStartFunc = dragStartFunc;
window.dropFunc = dropFunc;
window.allowDropFunc = allowDropFunc;
window.controlChanged = controlChanged;
window.clickedItemFunc = clickedItemFunc;

let camera, orbitControl, dragControl,  scene, renderer,posy;
let object=new THREE.Object3D(), objectClicked = null, objectDrag=null,  objectClickedFlag = "0",objectCounter = null;

var container,objects=[],objects1=[],objectsExport=[],objectsAtras=[],objectsModulos=[];
let exportButton;
let box;
var tomandoFoto=false;
var vieneAtras=false;
var mouseUpGeneral=false;
var cargoModuloEscena=false;
var actualizandoModulo=false;
var graficoGeneralOffMod=false;

let imgsArray=[];
let titulosLeng=[];
var controlsT=[];

var acciones=[];

var jsonCarga={};
let jsonEsqIzq={};
let jsonEsqDer={};
let jsonMedianero={};
let jsonPunta={};
let jsonIsla={};

var standBase="";

let paredizq,paredder,piso,paredtrasera,banner,metal,puertaizq,puertader,puertatrasera;
let banneratras,bannerfrente,bannerder,bannerizq,banneratras2,bannerfrente2,bannerder2,bannerizq2;
let matparedizq,matparedatras,matparedder;
let matbannerfrente,matbannerizq,matbanneratras,matbannerder;
let paredtraseraStand,paredDerStand,paredIzqStand;


let planetrasera;

var modulo=null, objStand={"stand":{},"header":{},"objetos":{}}
var heightMax=3,widthMax=10.01,deepMax=10;
var height=3,width=10.01,deep=10;
var conteoModulos = 0;
let limitePantallazos = 5;
let pantallazosTomados = 0;
let cantLamparasTra = 0;
let cantLamparasDer = 0;
let cantLamparasIzq = 0;
var wallMat, positionObjHover;
const gridHelper = new THREE.Group();
var header;
let stand;
var groupMetalIzq= new THREE.Group(),groupMetalDer= new THREE.Group(),groupMetalTra= new THREE.Group(),groupMetalFre = new THREE.Group();



var raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const sceneMeshes = new Array();

let hoveredObject;

let TransformControlspos=-1;

    var interv = setInterval(function () {
      if (document.getElementById("renderer3D")) {
        clearInterval(interv);
        loadedFrame();
        animate();
      }
    }, 500);


    function getObjectsStand(jsonPrimeraCarga=false)
    {
      //Metodo usado para crear un objeto con la configuracion del stand,
      //el objeto que se genera, esta dividivo de 4 secciones: general, header, stand y objetos
        let objectexport=[];

        if(typeof objStand.general === "undefined")
                objStand.general=new Object();
        if(typeof objStand.header === "undefined")
                objStand.header=new Object();
        if(typeof objStand.stand === "undefined")
                objStand.stand=new Object();
        if(typeof objStand.modulos === "undefined")
                objStand.modulos=new Array();





        if(typeof objStand.stand.piso != "undefined")
        {

              if(typeof objStand.stand.perimetral == "undefined")objStand.stand.piso.valor=piso.visible;
                else {
                    //console.log(objStand.stand.piso.valor);
                    if(!objStand.stand.piso.valor)objStand.stand.perimetral ="undefined";


                 }

        }

        if(typeof objStand.stand.tarimado != "undefined")
        {
          //console.log("PIROOOOO",objStand.stand.tarimado.valor);
            objStand.stand.tarimado.valor=objStand.stand.tarimado.valor;
            //piso.visible;
        }//else objStand.stand.tarimado.valor=piso.visible;

        if(typeof objStand.general !== "undefined")objStand.general.cargaInicial.valor=jsonPrimeraCarga;

        //console.log(objStand.general);

        let jsonStand={
            "general":objStand.general,
            "header":objStand.header,
            "stand":objStand.stand

        };

        jsonStand.stand.paredpos={"componente": "stand","propiedad": "paredpos","valor": paredtrasera.visible };
        jsonStand.stand.paredizq={"componente": "stand","propiedad": "paredizq","valor": paredizq.visible };
        jsonStand.stand.paredder={"componente": "stand","propiedad": "paredder","valor": paredder.visible };

        for(let i = 0;i<objectsExport.length;i++)
        {
          //console.log(objectsExport[i]);
            if(objectsExport[i].visible)
            {
              //if(objectsExport[i].data1.id=="30")console.log("COUNTER JSON",objectsExport[i]);
              objectexport.push({
                "position": objectsExport[i].position,
                "rotation": objectsExport[i].rotation,
                "type1": objectsExport[i].type,
                "file1": objectsExport[i].file1,
                "drag": objectsExport[i].drag,
                "data1":objectsExport[i].data1,
                "data2":(typeof objectsExport[i].data2!=="undefined")?objectsExport[i].data2:"",
                "name":objectsExport[i].name,



              });
            }
        }


        jsonStand.objetos=objectexport;
        //objStand.objetos=jsonStand.objetos;
        //console.log("getObjects",jsonStand);
        return jsonStand;
    }



    function pintarCounterBrand(frenteObjCounter,event)//se pinta la cara frontal del brandeo, counter blanco
    {

      loadImageTexture(frenteObjCounter,event.valor.imagen,event.valor.despHorizontal,event.valor.despVertical,event.valor.zoom, false, true);

    }

    function cargoModulo()
    {
      return cargoModuloEscena;

    }

    function actualizarControlesPos()
    {
      for (var i = 0;i<controlsT.length;i++)
      {
        for (var j = 0;j<objects.length;j++)
        {
          //if(objects[j].data1.tipo=="modulos")
          //{

            if(controlsT[i].objformControlsuuid==objects[j].uuid)
            {
              //console.log("controlsT",i);
              objects[j].TransformControlspos=i;


            }

          //}
        }
      }
    }

    function buscarModulo(uuid)
    {
          let objMod=scene.getObjectByProperty ( "uuid", uuid );

            if(typeof objMod ==="undefined")
            {
                objMod=scene.getObjectByProperty ( "name", uuid );

            }


          return objMod;

    }

    function apagarModulos()
    {

      for(let i=0;i<objects.length;i++)
          {
            if(objects[i].data1.tipo=="modulos")
              {
                  callAngularFunction({"uuid":objects[i].name,"enable":false,"data":objects[i].data1,"data2":objects[i].data2});
              }

          }
    }



    function actualizarModulos(uuid="")
    {
      //Actualizo los módulos cuando se cambia  la altura
      let objAct=(JSON.parse(JSON.stringify(objects)));
      objectsModulos = [];
      conteoModulos = 0;


      apagarModulos();

      let objOne = scene.getObjectByProperty ( "uuid", uuid);

      if(typeof objOne !== "undefined"&& uuid!="")
      {

        setTimeout(function(){

          objOne.data2.general.altura= objStand.stand.height.valor.toString();
          callAngularFunction({"uuid":objOne.name,"enable":true,"data":objOne.data1,"data2":objOne.data2});
        },200)


      }else {


        for(let i=0;i<objAct.length;i++)
        {

          let obj = scene.getObjectByProperty ( "uuid", objAct[i].object.uuid );

          if(typeof obj !== "undefined")
          {
            //console.log("Modulos INI",obj);
            if(obj.data1.tipo=="modulos")
            {
              if(!obj.data2.actualizacion&&obj.visible)objectsModulos.push(obj);

            }
          }
        }
          //console.log("Modulos",objectsModulos);
          if(objectsModulos.length>0){
            conteoModulos++;
            objectsModulos[conteoModulos-1].data2.general.altura= objStand.stand.height.valor.toString();
            callAngularFunction({"uuid":objectsModulos[conteoModulos-1].name,"enable":true,"data":objectsModulos[conteoModulos-1].data1,"data2":objectsModulos[conteoModulos-1].data2});

          }
      }

    }

    function actualizarNuevoModulo()
    {

      conteoModulos++;


      if(objectsModulos.length == conteoModulos-1)
      {
        objectsModulos = [];
        conteoModulos=0;
        }else {

          let objModulo = objectsModulos[conteoModulos-1];

            setTimeout(function()
            {
              objModulo.data2.general.altura= objStand.stand.height.valor.toString();
            callAngularFunction({"uuid":objModulo.name,"enable":true,"data":objModulo.data1,"data2":objModulo.data2});
          },0)
        }
            //console.log("vamos nuevo", conteoModulos);
    }

    function armarModulo(val)
    {
      //En la primera carga de un módulo se pintan TVs y texturas

    callAngularFunction({"uuid":val.name,"enable":true,"data":val.data1,"data2":val.data2});
    }

    function crearObjetos(json,reg=true,objP=null,objT=null) //detalle - se crean los objetos en escena
    {
        let obj;


        for(let i=0;i<json.length;i++)
        {
          //json[i].file1= json[i].file1.replace('http', 'https');
            let group = new THREE.Group();
            loader.load(
                json[i].file1,
                function (gltf) {
                    object = gltf.scene;

                    object.position.x = 0;
                    object.position.y = 0;
                    object.position.z = 0;
                    //cambiarMatVidrio(object)
                    object.receiveShadow = true;
                    object.castShadow = true;
                    sceneMeshes.push(object);



                    object.traverse( function ( child ) {
                        //if ( child.isMesh )
                        {
                            if(typeof child.material!=="undefined")
                            {

                                if(child.material.name=="VIDRIO" || child.material.name=="VIDRIO 2")
                                {
                                    if(typeof child.material.transparent!=="undefined")
                                        child.material.transparent=true;
                                    if(typeof child.material.opacity!=="undefined")
                                        child.material.opacity= 0.2;
                                    if(typeof child.material.roughness!=="undefined")
                                        child.material.roughness= 0.25;
                                    if(typeof child.material.color!=="undefined")
                                        child.material.color={r:247,g:242,b:252};

                                    return true;
                                }

                                if(child.material.name=="METAL" || child.material.name=="ALUMINIO")
                                {

                                  child.material.color= new THREE.Color(3, 3, 3);
                                  //child.material.emissive= new THREE.Color(3, 3, 3);
                                  //child.material.emissiveIntensity=.09;

                                    if(typeof child.material.roughness!=="undefined")
                                        child.material.roughness= 0.2;

                                    if(typeof child.material.metalness!=="undefined")
                                        child.material.metalness= .9;

                                    ponerEnvmap(child,renderer,2);

                                    //console.log("Metal",child);
                                }
                            }
                        }
                    });




                    group.add( object );
                    //console.log(group);
                    //detalle - Limites por objeto


                    //box = new THREE.BoxHelper( objtmp, 0x008FC7 );
                    let _boxLimits = new THREE.Box3();
                    _boxLimits.setFromObject(group);

                    ancho = (_boxLimits.max.x-_boxLimits.min.x)-(_boxLimits.max.x-_boxLimits.min.x)/2.1;
                    profundo = (_boxLimits.max.z-_boxLimits.min.z)-(_boxLimits.max.z-_boxLimits.min.z)/2.1;

                    //console.log("Limites",group,_boxLimits,ancho,profundo);
                    //Faltan los TVs
                    if(obj1.data1.tipo=="modulos")
                    {


                      //obj1.name=obj1.uuid;
                      //console.log(obj1);
                      //console.log("reajuste altura",obj1.data2.actualizacion,objStand.stand.height.valor);
                      if((!obj1.data2.actualizacion&&objStand.stand.height.valor!=2.5&&reg))//||(!reg)
                      {
                        actualizarModulos(obj1.uuid);
                      }else obj1.data2.actualizacion=false;


                      if(!reg&&obj1.data2.rePintar){

                        actualizarModulos(obj1.uuid);
                      }





                      //_boxLimits.setFromObject(group.children[0]);
                       ancho=(_boxLimits.max.x-_boxLimits.min.x)/1.95;//-(_boxLimits.max.x-_boxLimits.min.x)/2.1;
                       profundo=(_boxLimits.max.z-_boxLimits.min.z)-(_boxLimits.max.z-_boxLimits.min.z)/2.1;//+.02;



                       //_boxLimits.material.color.set( 0x008FC7 );
                       //scene.add( _boxLimits );
                       let desfaceX = ((_boxLimits.max.x-obj1.position.x)-(obj1.position.x-_boxLimits.min.x))/2;
                       let desfaceZ = ((_boxLimits.max.z-obj1.position.z)-(obj1.position.z-_boxLimits.min.z))/2;
                       //console.log("Limites",group,desfaceX);
                       group.children[0].position.x-=desfaceX;
                       group.children[0].position.z-=desfaceZ;
                       //children.length

                         cargoModuloEscena=true;
                          if(obj1.data2.instanciaInicial)
                          {

                            armarModulo(obj1);
                            obj1.data2.instanciaInicial=false;


                          }
                       //cargoModulo(true);


                    }




                    if(typeof group.getObjectByName("BRANDEABLE")!=="undefined")
                    {

                      //console.log(obj1);
                      let frenteCounter=group.getObjectByName("BRANDEABLE");
                      group.data1.brandeable=true;

                      pintarCounterBrand(frenteCounter,group.data2.frente);

                    }

                    //console.log("alto",group.name);


                    object.traverse( function ( child ) {

                    if ( child.isMesh ) {

                      child.material.shading = THREE.SmoothShading;
                      child.castShadow = true;
                      child.receiveShadow = true;
                    }
                  });


                },
                function(xhr)
                {
                },
                onProgress,
                onError
              );



                group.receiveShadow = true;
                group.castShadow = true;

                if(json[i].hasOwnProperty('name'))
                {
                  //console.log("NAME",json[i].name);
                    group.name=json[i].name;
                 }
                //else
                if(json[i].data1.tipo=="modulos"&&json[i].data2.instanciaInicial)
                {
                   //console.log("MOMO",json[i].file1);
                    group.name=group.uuid;
                } else if(json[i].data1.id=="30"||json[i].data1.id=="51"||json[i].data1.id=="44")
                {
                  group.name=group.uuid;

                }



                if(json[i].hasOwnProperty('visible'))
                    group.visible=json[i].visible;

                if(json[i].hasOwnProperty('padre'))
                    group.padre=json[i].padre;


                group.type1=json[i].type1;
                group.file1=json[i].file1;
                group.data1=json[i].data1;

                if(json[i].hasOwnProperty('data2'))
                    group.data2=json[i].data2;

                let ancho=0;
                let profundo=0;
                let alto=0.18;




                let obj1=group;


                let xx=0;
                let zz=0;
                //if(obj1.name == "tvposterior" || obj1.name == "tvderecha" || obj1.name == "tvizquierdo" )

                if(obj1.name.indexOf("tv")>=0)
                {
                    alto=json[i].position.y;
                    //console.log("tv",obj1);
                }




                xx=((width/2)-ancho);
                zz=((deep/2)-profundo);

                if(json[i].drag==2)
                {
                    alto=15;
                    xx=20;
                    zz=20;
                }




                //if(json[i].drag!=0)
                {

                  obj1.userData.setDimensiones = function (_ancho,_profundo) {
                      ancho=_ancho;
                      profundo=_profundo;
                      //console.log(ancho);
                    }

                    obj1.userData.getDimensiones = function () {
                        let objDimensions = [];
                        objDimensions.push(ancho);
                        objDimensions.push(profundo);
                        return objDimensions;
                        //console.log(ancho);
                      }

                    obj1.userData.update = function(){


                    obj1.position.clamp(
                            new THREE.Vector3( -( (width/2)-ancho ), alto, -((deep/2)-profundo) ),
                            new THREE.Vector3( ( (width/2)-ancho ), alto, ((deep/2)-profundo))
                            );
                          }

                objects1.push(obj1);


                    let transformControls;
                    //if(objT!=null)
                    {

                        transformControls = new TransformControls(camera, renderer.domElement);
                        transformControls.size=2.5;
                    //transformControls.setMode("local");
                        scene.add(transformControls);
                        transformControls.showY=false;
                        transformControls.addEventListener( 'dragging-changed', onDrag  );
                        transformControls.children[0].position.y+=1.0;
                        transformControls.children[0].position.x+=-1;
                    }

                    transformControls.attach(obj1);


                    group.TransformControlspos=controlsT.length;
                    group.TransformControlsuuid=transformControls.uuid;
                    group.TransformControlsname=transformControls.name;

                    transformControls.objformControlsuuid=group.uuid;
                    transformControls.objformControlsname=group.name;
                    controlsT.push(transformControls);
                    transformControls.enabled=false;
                    transformControls.visible=false;

                    objects.push(group);
                }

                if(objP!=null)
                    objP.add(group);
                else
                    scene.add( group );

                //console.log(json[i].position);
                group.position.x = json[i].position.x;
                group.position.y = json[i].position.y;
                group.position.z = json[i].position.z;

                group.rotation.x = json[i].rotation._x;
                group.rotation.y = json[i].rotation._y;
                group.rotation.z = json[i].rotation._z;



                group.drag=json[i].drag;





                if(reg==true)
                {


                    if(obj1.name.indexOf("tv")<0)acciones.push({"accion":"crearobjeto","uuid":group.uuid});
               }


                objectsExport.push(group);
                obj=group;


        }
        return obj;

    }


    function onDrag( event ) {

            orbitControl.enabled = ! event.value;


    }

window.clickedItemFunc = function(event, item)
{
  //Metodo usado al instanciar el objeto del menu hacia la escena en dispositivos touch, se captura el objeto enviado y con la informacion recibida se pinta en 3D.

  if(matchMedia('(hover: none)').matches){//Si es un dispositivo touch
       //console.log("clickedItemFunc", event, item);
       event.preventDefault();

       var elementDragged = JSON.parse(item);
       pintarObjetoEscena(elementDragged);

     }


}

window.dropFunc= function(event)
    {
      //Metodo usado en el arrastre del objeto del menu hacia la escena, se captura el objeto enviado y con la informacion recibida se pinta en 3D.
        event.preventDefault();

        var elementDragged = JSON.parse(event.dataTransfer.getData("Text"));

        pintarObjetoEscena(elementDragged);

    }

  function pintarObjetoEscena(elementDragged)
  {

    var modulo = "";

    if(elementDragged.render){
          modulo = elementDragged.modelo;
    }
    else
        return;

    let x=(event.x*100)/container.offsetWidth;
    x=(x*width)/100;
    if(x<(width/2))
    {
        x=x-(width/2);
    }
    else
    {
        x=x-(width/2);
    }

    if(x>(width/2))
        x=(width/2)-0.2;

    if(x<(-width/2))
        x=-(width/2)-0.2;

  let data2tmp=
        {
        "data2": {
            "general": {"modelo": modulo},
            "frente":{
                  "componente": "muebles",
                  "propiedad": "counter",
                  "uuid": "A78279C1-96A5-4A3B-9738-4EB6816054CC",
                  "valor": {
                      "grafico": true,
                      "imagen": "./assets/imagenes/brandeo/counter.jpg",
                      "despHorizontal": 0.5,
                      "despVertical": 0.5,
                      "zoom": 0.5
                  }
              },
            "derecha": "",
            "izquierda": ""
          }
        }

        let data2Modulo=
              {

                "actualizacion": false,
                "instanciaInicial": true,
                "accionAtras":false,
                "rePintar":false,
                "pared": "general",
              "general": {

                    "modelo": modulo,
                    "altura": objStand.stand.height.valor.toString(),
                   "ubicacionPuertaPared": "DER",
                   "ubicacionPuertaPosicion": "DER"

                },
                  "frente":"",
                  "posterior":"",
                  "derecha": "",
                  "izquierda": ""

              }



    let jsontmp=[
             {
   "position": {
     "x": x,
     "y": 0.06,
     "z": 1//container.offsetHeight/event.y
   },
   "rotation": {
     "_x": 0,
     "_y": 0,
     "_z": 0,
     "order": "XYZ"
   },
   "type": "Group",
   "type1": "gltf",
   "file1": modulo,
   "drag": 1,
   "data1":elementDragged,
   "data2":{"general":{"modelo":modulo} ,"frente":"","derecha":"","izquierda":""}

 }];

 let reg = true;



 //console.log(objtmp.data1.id);
 if(elementDragged.id=="30"||elementDragged.id=="51"||elementDragged.id=="44")
   {
     jsontmp[0].data2=data2tmp.data2;

     if(elementDragged.id=="51")jsontmp[0].data2.frente.valor.imagen="./assets/imagenes/brandeo/vitrina.png"
     else if(elementDragged.id=="44")jsontmp[0].data2.frente.valor.imagen="./assets/imagenes/brandeo/estanteria.png"


   }

 if(elementDragged.tipo=="modulos")
 {
   //reg = false;
   jsontmp[0].data2=data2Modulo;
 }
     crearObjetos(jsontmp,reg);

     enviarElementosStandFunction(getObjectsStand());
     //vidrio();
     dragControl.setObjects(objects1);
  }


  function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

  function loadDragControl(obj) {//detalle - se manejan controles

    dragControl = new DragControls(
      obj,
      camera,
      renderer.domElement
    );
    dragControl.transformGroup = true;

    dragControl.addEventListener("drag", function (event) {

      //console.log("drag",objectClicked);
      if(objectClicked!=null)
      {
        event.object.position.y = 0.2;
        document.getElementById("menu").style.display = "none";

        objectDrag=0;


        let objtmp=objectClicked;
        while(!objtmp.file1)
        {
            objtmp=objtmp.parent;
        }

        var _box = /*@__PURE__*/new THREE.Box3();
        var _box2 = /*@__PURE__*/new THREE.Box3();
        _box.setFromObject(objtmp);


        box.material.color.set( 0x008FC7 );

        let puntos=new Array();
        puntos[0]={x:_box.max.x,z:_box.max.z};
        puntos[1]={x:_box.max.x,z:_box.min.z};
        puntos[2]={x:_box.min.x,z:_box.min.z};
        puntos[3]={x:_box.min.x,z:_box.max.Z};
        for(let i=0; i<objects1.length;i++ )
        {
            if(objects1[i].uuid!=event.object && objects1[i].visible==true)
            {
                _box2.setFromObject(objects1[i]);
                for(let o=0;o<puntos.length;o++)
                {
                    if(puntos[o].x>_box2.min.x &&  puntos[o].x<_box2.max.x )
                    {
                        if(puntos[o].z>_box2.min.z &&  puntos[o].z<_box2.max.z )
                        {
                            box.material.color.set( 0xff0000 );
                            break;
                        }
                    }
                }
            }
        }
        box.update();
      }
    });

    

    dragControl.addEventListener("dragstart", function (event) {

      //console.log("objectClicked ", objectClicked);

      if(objectClicked!=null)
      { //El problema es que pierde la referencia al objeto siendo movido


        posy=event.object.position.y;
        document.getElementById("menu").style.display = "none";
        document.getElementById("editor").style.display = "none";
        orbitControl.enabled = false;
        gridHelper.visible = true;
        let objtmp=objectClicked;
        //console.log("MOMO 2",objtmp);//acá no esta llegando el modelo
        while(!objtmp.file1)
        {
            objtmp=objtmp.parent;
        }

        objectClicked=objtmp;

        //console.log("dragstart",objectClicked);
        box.update();


      }

    });

    dragControl.addEventListener("dragend", function (event) {

        //console.log("dragend",event);

        event.object.position.y =posy;
        orbitControl.enabled = true;
        gridHelper.visible=false;
        document.getElementById("menu").style.display = "none";
        document.getElementById("editor").style.display = "none";

        let objtmp=event.object;
        if(objtmp!=null)
        {
          while(!objtmp.file1 )
          {
              objtmp=objtmp.parent;
          }
          if(box!=null)box.update();//Es porque el box no se ha creado
        }
        objectClickedFlag=1;
    });

    dragControl.addEventListener("hoveron", dragControlHoveron);


    dragControl.addEventListener("hoveroff", function (event) {

      //console.log("hoveroff",objectClickedFlag);
      touchEnd(event);

    });

    function dragControlHoveron(event){

      //console.log("dragControlHoveron event", event);

        //objectClickedFlag!=1 &&
        if(objectClickedFlag<3)
        {
            let objtmp=event.object;

            if(objtmp != null)
            {

                while(!objtmp.file1 )
                {
                    objtmp=objtmp.parent;
                }
                //positionObjHover=objtmp.position;
                TransformControlspos=objtmp.TransformControlspos;

                if(objtmp )
                {
                    //console.log("hoveron PC",objtmp);
                    if(objtmp.visible==true && objtmp.drag=="1")
                    {
                        box = new THREE.BoxHelper( objtmp, 0x008FC7 );
                        box.name=box.uuid;
                        box.position.y+=1;

                        scene.add( box );
                        event.object.box=box.name;
                        objectClicked = event.object;
                        objectClickedFlag = 1;


                        if(typeof controlsT[TransformControlspos]!=="undefined")
                            controlsT[TransformControlspos].enabled=true;
                        return;
                    }
                }
            }
        }

    }




    function touchEnd(event)
    {
      //console.log("hoveroff",objectClickedFlag);
      //console.log("touchEnd event", event);

      if(event.object)//&& objectClickedFlag<3
      {

          let objecttmp = scene.getObjectByName( event.object.box, true );
          scene.remove( objecttmp );
          objectClickedFlag = 2;
          event.object.box="";
      }


      if(typeof controlsT[TransformControlspos] !=="undefined")
      {
          //controlsT[TransformControlspos].children[0].position.y+=1.2;
          if(controlsT[TransformControlspos].worldPosition.x>2.5)
              controlsT[TransformControlspos].children[0].position.x=-1.0;
          else if(controlsT[TransformControlspos].worldPosition.x<2.5)
              controlsT[TransformControlspos].children[0].position.x=-.6;
          else
              controlsT[TransformControlspos].children[0].position.x=-0.8;
      }
      for(let i=0;i<controlsT.length;i++)
          controlsT[i].enabled=false;
      TransformControlspos=-1;

    }


    document.addEventListener("touchend", function(event) {

      //console.log("hoveroff Mobile",objectClickedFlag);
      //touchEnd(event);

    });

    document.addEventListener("touchmove", function(event) {

      //console.log("touchmove",objectClicked);
      //touchMove(event);



    });

    document.addEventListener("touchstart", function(event) {
      //event.preventDefault();

      //Acá toca detectar si estoy encima de un objeto y hacer la lógica de hover on en mouse
      //console.log("touchstart",event);

      const draggableObjects = dragControl.getObjects();
      //console.log("draggableObjects", draggableObjects);

      mouse.x = ( event.changedTouches[0].clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.changedTouches[0].clientY / window.innerHeight ) * 2 + 1;

      raycaster.setFromCamera( mouse, camera );

      const intersections = raycaster.intersectObjects( draggableObjects, true );

      //console.log("intersections", intersections);

      if(intersections.length>0){
        if(!hoveredObject){
          hoveredObject = intersections[0];
          dragControlHoveron(intersections[0]);
        }

      }else{
        if(hoveredObject){
          touchEnd(hoveredObject);
          hoveredObject = null;
        }

      }


      //hoverOn(event);

      //touchDown(event);


    });

    function hoverOn(event)
    {

    }


    document.addEventListener("mousedown",  function(event) {


      touchDown(event);
    });


    function touchDown(event)
    {


      objectDrag=1;

      let objclick="";

      if(typeof event.explicitOriginalTarget !== "undefined")
      {
          objclick=event.explicitOriginalTarget.localName;
      }
      else if(typeof event.path !== "undefined")
      {
          objclick=event.path[0].localName;
      }

      //console.log("mousedown",event,objclick,objectClickedFlag);
      if(event.target.className!="aPop")
      {
          document.querySelector('#editor2').style.display="none";

      }
      //console.log("mousedown",objectClickedFlag,objclick);
      //console.log(objectClicked);
      if(objectClicked!=null)
      {
        let objPos=objectClicked;
        while(!objPos.file1 )
        {
            objPos=objPos.parent;
        }
        positionObjHover=(JSON.parse(JSON.stringify(objPos.position)));
      }

     if (objectClickedFlag == 3 && objclick== "canvas") {

          let box=scene.getObjectByProperty("type","BoxHelper");
          scene.remove( box );
          let objecttmp = scene.getObjectByName( objectClicked.box, true );
          scene.remove( objecttmp );
          //objectClickedFlag = 2;
          objectClicked.box="";
          objectClickedFlag = 0;
          let objtmp=objectClicked;
          while(!objtmp.file1 )
          {
              objtmp=objtmp.parent;
          }

          if(objtmp.data1.tipo=="modulos")
          {

          callAngularFunction({"uuid":objtmp.name,"enable":false,"data":objtmp.data1,"data2":objtmp.data2});

        }else if(objtmp.data1.id=="30"||objtmp.data1.id=="51"||objtmp.data1.id=="44"){

            counterControlFunction({"uuid":objtmp.uuid,"enable":false,"data1":objtmp.data1,"data2":objtmp.data2});
          }


      }
    }

    document.addEventListener("mouseup",  function(event) {


    });

    container.addEventListener("click", function (evento) {

      //console.log("CLICK",objectClicked);
      CubeControl.onClickCube(evento,container,mouse,camera,orbitControl);

      if(objectClicked!=null)
      {


      let objtmp=objectClicked;
      while(!objtmp.file1 )
      {
          objtmp=objtmp.parent;
      }




        if (objectClickedFlag == 1) {



            if(objtmp.data1.tipo=="modulos")
            {

                //callAngularFunction({"uuid":objtmp.uuid,"enable":false,"data":objtmp.data1,"data2":objtmp.data2});
                objectClickedFlag=3;
                //Se cometa linea (al final de esta frase) para activar el menu completo al darle clic a los módulos // document.querySelector('#menu .option1').style.display="none";
                document.querySelector('#menu .option1').style.display="block";

                let data2Temp=JSON.parse(JSON.stringify(objtmp.data2));

                //console.log(data2Temp);


                  callAngularFunction({"uuid":objtmp.name,"enable":true,"data":objtmp.data1,"data2":data2Temp});

            } else if(objtmp.data1.id=="30"||objtmp.data1.id=="51"||objtmp.data1.id=="44")
              {

                //console.log(objtmp);
                  objectClickedFlag=3;
                  document.querySelector('#menu .option1').style.display="block";

                  //console.log("Counter 002",{"uuid":objtmp.uuid,"enable":true,"data1":objtmp.data1,"data2":objtmp.data2});
                  counterControlFunction({"uuid":objtmp.uuid,"enable":true,"data1":objtmp.data1,"data2":objtmp.data2});
              }
            else
            {
                document.querySelector('#menu .option1').style.display="block";
            }


            if(objectDrag!=0)
            {


                let menu = document.getElementById("menu");
                menu.style.display = "block";
                menu.style.left = evento.clientX + "px";
                menu.style.top = evento.clientY - 100 + "px";


            }else{


              if(objtmp.position.x!=positionObjHover.x&&objtmp.position.z!=positionObjHover.z)
                  {
                    acciones.push({"accion":"moverobjeto","uuid":objtmp.uuid,"valor":{x:positionObjHover.x,y:positionObjHover.y,z:positionObjHover.z}});
                  }
            }
            //console.log("click",objectDrag,acciones);
            //

            if(objectClickedFlag<3)
                objectClickedFlag = 0;

        } else if (objectClickedFlag == 2) {



          document.getElementById("menu").style.display = "none";
          document.getElementById("editor").style.display = "none";
          objectClicked = null;
          objectClickedFlag = 0;
          apagarModulos();

        }

      }else apagarModulos();

    });
  }


function loadedFrame() {
  /*
  Este Metodo crea el contexto 3D, agrega la camara, escena, carga pabellon, carga stand,
  llama el metodo de crear Grid, agrega el control de orbit a la escena, hace los llamados
  al menu contextual de los objetos;
  */
  container = document.getElementById("renderer3D");


  ///////////////CAMERA//////////////////
  camera = new THREE.PerspectiveCamera(
    53,
    container.offsetWidth / container.offsetHeight,
            0.2,
    1200
  );

  camera.position.set(0, 5, 15);
  //camera.setFocalLength(80);
  //console.log(camera);
  /////////////////SCENE////////////////
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);
  //scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  ///////////////LIGHTS/////////////////


var ambientLight= new THREE.AmbientLight( 0xFDFFF4, 0.7 )
scene.add(ambientLight);

/*var frontLight  = new THREE.DirectionalLight(0xFFD7A0, 0.3)
frontLight.position.set(0.5, 2, 0.5)
frontLight.castShadow = true;

scene.add( frontLight )

var backLight   = new THREE.DirectionalLight(0xFFD7A0, 0.3)
backLight.position.set(-0.5, 2, -0.5);
backLight.castShadow = true;
scene.add( backLight )
*/
//frontLight.shadowMapSize = new THREE.Vector2( 512, 512 )
//frontLight.shadowCamera = new THREE.OrthographicCamera( 0, 0, 0, 0, 0.5, 500 )

var pointLight  = new THREE.PointLight(0xFFD7A0, 0.8,100)
pointLight.position.set(0,18,0);
//pointLight.castShadow = true;
//pointLight.penumbra = 0.05;
//pointLight.shadow.mapSize.width = 2048;
//pointLight.shadow.mapSize.height = 2048;
scene.add( pointLight );

//console.log("pointLight",pointLight);
//console.log("ambientLight",ambientLight);



/*const pointLight = new THREE.PointLight( 0xFFD7A0, 1.9, 3 );
pointLight.position.set(-0.0048, 14.995, 0.384);//( 10, 10, 10 );
scene.add( pointLight );
*/



//cargarPabellon(scene,renderer);
//loadTruss();

  /************************************************************************/




/*const bodyMaterial = new THREE.MeshPhysicalMaterial( {
            color: 0xff0000, metalness: 0.6, roughness: 0.4, clearcoat: 0.05, clearcoatRoughness: 0.05
    } );

    const texture = new THREE.TextureLoader().load( '../assets/textures/hardwood2_roughness.jpg' );

// immediately use the texture for material creation
    const material = new THREE.MeshBasicMaterial( { map: texture } );

*/






let jsonStand={
    "header":{
        "visible":true,
        "fro"   : {"activo" : true},
        "pos" :{"activo" : false},
        "izq" :{"activo": false},
        "der"   :  {"activo": false}
    },
    "stand":{
        "paredpos":true,
        "paredizq":true,
        "paredder":true
    }
};



function loadScene(Json)
{

 

    loader.load(
        "../assets/modelos3D/HEADER.glb",
        function (gltf) {

            header = gltf.scene;

            scene.add( header );
            header.visible=Json.header.visible;

            //console.log(header);

            let b=header.getObjectByName( 'TRUSS' );
            b.removeFromParent ();

            b=header.getObjectByName( 'TRUSS001' );
            b.removeFromParent ();

            b=header.getObjectByName( 'TRUSS002' );
            b.removeFromParent ();

            b=header.getObjectByName( 'TRUSS003' );
            b.removeFromParent ();

            banneratras=header.getObjectByName( 'stand002' );
            bannerfrente=header.getObjectByName( 'stand004' );
            bannerder=header.getObjectByName( 'stand005' );
            bannerizq=header.getObjectByName( 'stand003' );


            banneratras2=header.getObjectByName( 'stand006' );
            bannerfrente2=header.getObjectByName( 'stand001' );
            bannerder2=header.getObjectByName( 'stand008' );
            bannerizq2=header.getObjectByName( 'stand007' );

            banneratras.visible=Json.header.pos.activo;
            bannerfrente.visible=Json.header.fro.activo;
            bannerder.visible=Json.header.der.activo;
            bannerizq.visible=Json.header.izq.activo;

            banneratras2.visible=Json.header.pos.activo;
            bannerfrente2.visible=Json.header.fro.activo;
            bannerder2.visible=Json.header.der.activo;
            bannerizq2.visible=Json.header.izq.activo;


            matbannerfrente=bannerfrente.children[0].material;
            matbannerizq=bannerizq.children[0].material;
            matbanneratras=banneratras.children[0].material;
            matbannerder=bannerder.children[0].material;

        },
        onProgress,
        onError
    );


loader.load(
    "../assets/modelos3D/MEDIANERO.glb",
    function (gltf) {

        stand = gltf.scene;
        piso=stand.getObjectByName( 'stand' );


        paredtrasera=stand.getObjectByName( 'stand001' );

        paredder=stand.getObjectByName( 'stand002' );
        paredizq=stand.getObjectByName( 'stand003' );
        banner=stand.getObjectByName( 'stand004' );
        banner.removeFromParent ();

        metal=stand.getObjectByName( 'TRUSS' );

        stand.remove( metal );



        stand.getObjectByName( 'Plane001' ).removeFromParent();
        stand.getObjectByName( 'Plane002' ).removeFromParent();
        stand.getObjectByName( 'Plane' ).removeFromParent();


        crearPaneleria(paredizq,paredder,width,deep,renderer);
        stand.add( groupPaneleriaIzq );
        stand.add( groupPaneleriaDer );
        stand.add( groupPaneleriaTra );
        stand.add( groupLamparas );
        

        paredtraseraStand=stand.children[6];
        paredDerStand=stand.children[5];
        paredIzqStand=stand.children[4];



        stand.position.y=stand.position.y-0.09999990463256836;
        stand.receiveShadow = true;
        stand.castShadow = true;

        piso.receiveShadow = true;
        paredtrasera.receiveShadow = true;
        paredder.receiveShadow = true;
        paredizq.receiveShadow = true;
        scene.add( stand );

        paredder.visible=Json.stand.paredder;

        paredtrasera.visible=Json.stand.paredpos;
        paredizq.visible=Json.stand.paredizq;


        stand.traverse( function ( child ) {

            if ( child.isMesh ) {
                child.material.shading = THREE.SmoothShading;
                child.receiveShadow = true;
                child.castShadow = true;
            }
          });

        paredtrasera.traverse( function ( child ) {

            if ( child.isMesh ) {
              child.material.shading = THREE.SmoothShading;
              child.receiveShadow = true;
              child.castShadow = true;
            }
          });

        paredizq.traverse( function ( child ) {

            if ( child.isMesh ) {
              child.material.shading = THREE.SmoothShading;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

        paredder.traverse( function ( child ) {

            if ( child.isMesh ) {
              child.material.shading = THREE.SmoothShading;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          matparedatras=paredtrasera.children[0].material;
          matparedizq=paredizq.children[0].material;
          matparedder=paredder.children[0].material;



    },
    onProgress,
    onError
  );


}



  renderer = new THREE.WebGLRenderer( { antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);

 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = THREE.PCFSoftShadowMap;

 loadPaneleria(renderer);
 loadScene(jsonStand);




 pintarGrid(gridHelper,width,deep);

 scene.add( gridHelper );

 gridHelper.visible=false;

 //renderer.toneMapping = THREE.ACESFilmicToneMapping;
 //renderer.outputEncoding = THREE.sRGBEncoding;
 //renderer.toneMappingExposure = 0.3;


 
 cargarPabellon(scene,renderer);
 loadTruss(renderer);

  container.appendChild(renderer.domElement);

  /////////////////CONTROLS////////////////
    orbitControl = new OrbitControls(camera, renderer.domElement);
    orbitControl.listenToKeyEvents(window); // optional
    //orbitControl.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    orbitControl.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    orbitControl.dampingFactor = 0.05;
    orbitControl.screenSpacePanning = false;
    orbitControl.minDistance = 5;
    orbitControl.maxDistance = 18.4;
    orbitControl.maxPolarAngle = Math.PI /2.3;//2.45;
    orbitControl.keys = { LEFT: 0, RIGHT: 0, UP: 0, BOTTOM: 0 }


    orbitControl.autoRotateSpeed=1;

    renderer.setAnimationLoop(()=>{
    	objects1.forEach(o => {
                o.userData.update();
            })
    	renderer.render(scene, camera);
    })

    let menuBorrarObj = document.getElementById("del");
    let menuGirarObj = document.getElementById("rotate");
    let menuDuplicarObj = document.getElementById("copy");
    let menuEditarObj = document.getElementById("edit");

    function blurPage() {
        document.body.style.filter = "blur(10px)";
        setTimeout(function() {
          unblurPage();
        }, 5000);
      }

      function unblurPage() {
        document.body.style.filter = "none";
      }


    document.addEventListener('keydown', function(event) {
         // Checking for Backspace 8 and Delete 46.
         //console.log("tecla menu ",event.shiftKey,event.keyCode);
        if (event.key === 'Backspace' || event.key === 'Delete') {
            //.log("Backspace ",objectDrag);

            if(objectClicked != null && objectClicked.file1&&objectDrag!=0)
            {
              accionBorrar(objectClicked);
              document.getElementById("menu").style.display = "none";
            }
         }
         // Si se oprime la tecla de print screen toda la plataforma se pone en blur
         // Windows key combinations
           if (event.code === 'PrintScreen' ) {//|| event.shiftKey == true
             blurPage();
           }
           // Mac key combinations
         
           else if (event.key === 'MetaLeft' || event.key === 'MetaRight'){
             blurPage();
           }

           CubeControl.vistasCamera(camera,orbitControl,event.key);

     });



    function accionBorrar(objBorrar=null,reg=true)
    {
      let uuid="";

      let objtmp;


      if(objBorrar!=null)objtmp=objBorrar;
      else objtmp=objectClicked;

        while(!objtmp.file1 )
        {
            objtmp=objtmp.parent;
        }
        uuid=objtmp.uuid;

        /*objtmp.removeFromParent();
        scene.remove(objtmp);*/


        //console.log(objectsExport,objects.length);
        for(let i=0;i<objects.length;i++)
        {
            if(objects[i].uuid==uuid)
            {
                objects[i].visible=false;



                if(reg){
                  if(objects[i].data1.tipo=="modulos")objects[i].data2.instanciaInicial=false;

                  let data1tmp = JSON.parse(JSON.stringify(objects[i].data1));
                  let data2tmp = JSON.parse(JSON.stringify(objects[i].data2));
                  acciones.push({"accion":"borrarobjeto","jsonObj":[{position:objects[i].position, rotation:objects[i].rotation,name:objects[i].name,data1:data1tmp,data2:data2tmp,file1:objects[i].file1,type:objects[i].type,type1:objects[i].type1,drag:objects[i].drag }]});

                  if(data1tmp.tipo=="modulos")callAngularFunction({"uuid":objects[i].name,"enable":false,"data":objects[i].data1,"data2":objects[i].data2});
                }



                let objecttmp;

                //if(objectClicked!=null)objecttmp = scene.getObjectByName( objectClicked.box, true );
                //else objecttmp = scene.getObjectByName( objtmp.box, true );

                objecttmp = scene.getObjectByName( objtmp.box, true );
                scene.remove( objecttmp );

                for(let j=0;j<controlsT.length;j++)
                    controlsT[j].enabled=false;



                let transform=scene.getObjectByProperty ( "uuid", objects[i].TransformControlsuuid );
                transform.detach();

                //scene.remove(transform);

                scene.remove(objects[i]);

                scene.remove(controlsT[i]);

                //if(objects[i].data1.tipo=="modulos")
                //{
                objects.splice(i, 1);
                controlsT.splice(i, 1);
                 //}

                objects1.splice(i, 1);
                objectsExport.splice(i, 1);


                TransformControlspos=-1;


                objectClickedFlag = 2;

                //if(objectClicked!=null)objectClicked.box="";

                  objtmp.box="";

                objectClicked=null;
                if(box!= null)box.removeFromParent();

                actualizarControlesPos();
                //render();
                break;
            }
        }

        dragControl.setObjects(objects1);
        //console.log(objectsExport,objects.length);
    }

    menuBorrarObj.addEventListener("click", function(event){
      document.getElementById("menu").style.display = "none";
        if(objectClicked!=null)
          {
          accionBorrar(objectClicked);
          enviarElementosStandFunction(getObjectsStand());
          }
    });

    menuGirarObj.addEventListener("click", function(event){
        let objtmp=objectClicked;
        while(!objtmp.file1 )
        {
            objtmp=objtmp.parent;
        }
        acciones.push({"accion":"girarobjeto","uuid":objtmp.uuid,"valor":objtmp.rotation.y});
        objtmp.rotation.y += Math.PI * 0.25;

        box.update();

        let _boxLimits = new THREE.Box3();
        _boxLimits.setFromObject(objtmp);

        let ancho = (_boxLimits.max.x-_boxLimits.min.x)-(_boxLimits.max.x-_boxLimits.min.x)/2.1;
        let profundo = (_boxLimits.max.z-_boxLimits.min.z)-(_boxLimits.max.z-_boxLimits.min.z)/2.1;
        //console.log("userData",objtmp);
        //console.log(objtmp.userData.testAncho(ancho,profundo));
        objtmp.userData.setDimensiones(ancho,profundo)
        //console.log("Limites",objtmp,_boxLimits,ancho,profundo);
    });

    menuDuplicarObj.addEventListener("click", function(event){

      let objtmp=objectClicked;
      while(!objtmp.file1 )
      {
          objtmp=objtmp.parent;
      }



let jsontmp=[{
    "position": {
      "x": objtmp.position.x+0.2,
      "y": 0.06,
      "z": objtmp.position.z+0.2
    },
    "rotation": {
      "_x": objtmp.rotation.x,
      "_y": objtmp.rotation.y,
      "_z": objtmp.rotation.z,
      "order": "XYZ"
    },
    "type": "Group",
    "type1": objtmp.type1,
    "file1": objtmp.file1,
    "drag": 1,
    "data1":objtmp.data1
  }];

  let data2tmp=
        {
        "data2": {
            "general": {"modelo": objtmp.file1},
            "frente":{
                  "componente": "muebles",
                  "propiedad": "counter",
                  "uuid": "A78279C1-96A5-4A3B-9738-4EB6816054CC",
                  "valor": {
                      "grafico": true,
                      "imagen": "./assets/imagenes/brandeo/counter.jpg",
                      "despHorizontal": 0.5,
                      "despVertical": 0.5,
                      "zoom": 0.5
                  }
              },
            "derecha": "",
            "izquierda": ""
          }
        }

  let reg = true;

  if(objtmp.data1.id=="30"||objtmp.data1.id=="51"||objtmp.data1.id=="44")
    {
      jsontmp[0].data2=data2tmp.data2;

      if(objtmp.data1.id=="51")jsontmp[0].data2.frente.valor.imagen="./assets/imagenes/brandeo/vitrina.png"
      else if(objtmp.data1.id=="44")jsontmp[0].data2.frente.valor.imagen="./assets/imagenes/brandeo/estanteria.png"

    }

  if(objtmp.data1.tipo=="modulos")jsontmp[0].data2=JSON.parse(JSON.stringify(objtmp.data2));

  crearObjetos(jsontmp,reg);
  enviarElementosStandFunction(getObjectsStand());

  dragControl.setObjects(objects1);




    });

    menuEditarObj.addEventListener("click", function(event){//detalle - menu editar objetos

        let menu=document.getElementById("menu");
        menu.style.display = "none";


        let objtmp=objectClicked;
        while(!objtmp.file1 )
        {
            objtmp=objtmp.parent;
        }

        objectCounter=objectClicked;




        let containerEditor = document.getElementById("editor2");
        containerEditor.style.display = "block";
        containerEditor.style.left = menu.style.left
        containerEditor.style.top = menu.clientY;

        document.querySelector('#editor2 .stituloPop').innerHTML=objtmp.data1.nombre[0];

        //Falta preguntar si es USD o COP para el fotmato de la puntiación
        let formatter = new Intl.NumberFormat('es-CO');
        let preciomueble_formato = formatter.format(objtmp.data1.precio_mueble_cop);
        
        if(objtmp.data1.tipo=="modulos")preciomueble_formato = formatter.format(objtmp.data1.precio_cop);

        document.querySelector('#editor2 .descripcionPop').innerHTML=objtmp.data1.descripcion[0]+"<br>"+"$"+preciomueble_formato+"<br>"+objtmp.data1.dimensiones;

        //Toca cambiar el id 30 por la variabel data1.brandeable == true
        if(objtmp.data1.id=="30"||objtmp.data1.id=="51"||objtmp.data1.id=="44")
        {
            document.querySelector('#editor2 .info-div').style.display="block";
            document.querySelector('#editor2 .container-slidersPop').style.display="block";
          }
        else
        {
            document.querySelector('#editor2 .info-div').style.display="none";
            document.querySelector('#editor2 .container-slidersPop').style.display="none";
         }


    });


    function cargarStandJson(jsonCargaIni, cargaInicial=false) //detalle - Metodo para recargar los objetos a la escena.
    {

        //destroy(jsonCarga);
        if(cargaInicial)CubeControl.createCube(scene); //Crea el cubo para manejar las vistas en 3D
        vieneAtras=false;

        acciones=[];
        jsonCarga = null;



        jsonCarga = (JSON.parse(JSON.stringify(jsonCargaIni)));

        //console.log("STAND INICIAL",jsonCargaIni,jsonCarga);


        bannerfrente.children[0].material=matbannerfrente;
        bannerizq.children[0].material=matbannerizq;
        banneratras.children[0].material=matbanneratras;
        bannerder.children[0].material=matbannerder;

        paredizq.children[0].material=matparedizq;
        paredtrasera.children[0].material=matparedatras;
        paredder.children[0].material=matparedder;



        objStand={"general":{},"stand":{},"header":{},"objetos":{}};
        groupTruss.remove(...groupTruss.children);
        groupPaneleriaPared.remove(...groupPaneleriaPared.children);
//        console.log("CSJ:objStand",objStand);
//        console.log("CSJ:jsonCarga",jsonCarga);
        objStand.general=jsonCarga.general;

        //console.log(objStand.general);

        Object.values(jsonCarga.header).forEach(val => {

            if(val.propiedad=="altoTruss")
            {
                objStand.header.altoTruss=val;
                bannerder.position.y=val.valor;
                bannerizq.position.y=val.valor;
                bannerfrente.position.y=val.valor;
                banneratras.position.y=val.valor;

                bannerder2.position.y=val.valor;
                bannerizq2.position.y=val.valor;
                bannerfrente2.position.y=val.valor;
                banneratras2.position.y=val.valor;

            }else if(val.propiedad=="frente")
            {
                objStand.header.frente=val;
                changeObj(val,false,cargaInicial);
            }/*else if(val.propiedad=="posterior") // por alguna razón al habilitar esta parte la pared de atras no sale
            {
                console.log("posterior",val);
                objStand.header.posterior=val;

            }*/else if(val.propiedad=="izquierda")
            {
              //console.log("izquierda",val);
                objStand.header.izquierda=val;
                changeObj(val,false,cargaInicial);
            }else if(val.propiedad=="derecha")
            {
                objStand.header.derecha=val;
                changeObj(val,false,cargaInicial);
            }
            else
            {

                changeObj(val,false,cargaInicial);
                //changeObj(val,true);

            }
        });

        //et alto=5;

        //console.log("STAND INICIAL Antes",jsonCarga.stand.deep.valor);
        crearTruss(bannerizq,bannerder,banneratras,bannerfrente,jsonCarga,jsonCarga.header.derecha.valor.ancho,jsonCarga.header.altoTruss.valor,jsonCarga.header.frente.valor.ancho);
        //console.log("STAND INICIAL Después",jsonCarga.stand.deep.valor);

          //crearTruss(bannerizq,bannerder,banneratras,bannerfrente,objStand,deep,alto,width);
        //crearTruss(bannerizq,bannerder,banneratras,bannerfrente,width,deep,alto);
        scene.add( groupTruss );


        crearObjetoInvisible();
        //console.log("OBJETOS",jsonCarga.objetos);
        crearObjetos(jsonCarga.objetos,false);
        dragControl.setObjects(objects1);


        //Se pinta el stand
        //console.log("STAND INICIAL Final Final",jsonCarga);
        Object.values(jsonCarga.stand).forEach(val => {
            if(val.propiedad=="paredpos")
            {
                objStand.stand.paredpos=val;
                paredtrasera.visible=val.valor;
                groupPaneleriaTra.visible=val.valor;
            }
            else if(val.propiedad=="paredizq")
            {
                objStand.stand.paredpos=val;
                paredizq.visible=val.valor;
                groupPaneleriaIzq.visible=val.valor;

            }
            else if(val.propiedad=="paredder")
            {
                objStand.stand.paredpos=val;
                paredder.visible=val.valor;
                groupPaneleriaDer.visible=val.valor;
            }
            else if(val.propiedad=="profundo")
            {
                objStand.stand.deep=val;
            }
            else if(val.propiedad=="altura")
            {
                objStand.stand.height=val;
            }
            else if(val.propiedad=="ancho")
            {
                objStand.stand.width=val;
            }
            else
            {
                //typeof val.paneleria!=="undefined"&&
                if(val.tipo=="BASTIDORES"&&typeof val.paneleria!=="undefined"&&!cargaInicial)
                {
                  changeObj(val.paneleria,false,cargaInicial);
                  
                }

                changeObj(val,false,cargaInicial);
                //changeObj(val,true);
            }
        });

        redimensionarStand(objStand.stand.width.valor,objStand.stand.height.valor,objStand.stand.deep.valor,cargaInicial);

        if(cargaInicial)enviarElementosStandFunction(getObjectsStand(cargaInicial));

          //console.log("envio de elementos Cargar",cargaInicial);


        //console.log("acciones iniciales",acciones);
      setTimeout(function(){
        cargandoFunction(false);
      },1200)//detalle - apagar loader inicial
   

    }





    function redimensionarStand(widthnew,heightnew,deepnew,esPrimeraRedim=false)
    {

        // No se exactemte porque se hace esto
        if(widthnew!=width)widthnew+=0.01;

        let widthtmp=widthnew/width;
        let widthdif=widthnew-width;

        let heighttmp=heightnew/height;

        let bastidorAltura=.14;//0.135;

        //bastidorAltura-=(heightnew/3)*.05;

        if(heightnew==10.0)bastidorAltura=-0.25;
        else if(heightnew==6.0)bastidorAltura=-0.02;
        else if(heightnew==5.0)bastidorAltura=0.02;
        else if(heightnew==4.5)bastidorAltura=0.046;
        else if(heightnew==4.0)bastidorAltura=0.066;
        else if(heightnew==3.5)bastidorAltura=0.086;
        else if(heightnew==3.0)bastidorAltura=0.106;
        else if(heightnew==2.5)bastidorAltura=0.135;



        let deeptmp=deepnew/deep;
        let deepdif=deepnew-deep;


        piso.scale.x=piso.scale.x*widthtmp;
        piso.position.z*=deeptmp;
        piso.scale.z=piso.scale.z*deeptmp;




        if(piso.material.map !== null)
        {
          if(typeof objStand.stand.texturaPiso!=="undefined")
          {
            let scaleX = piso.scale.x/.5;
            let scaleZ = piso.scale.z/.5;

          if(objStand.stand.texturaPiso.tipo=="ALFOMBRA")piso.material.map.repeat.set(50,50 );//piso.scale.x, piso.scale.z
          else if(objStand.stand.texturaPiso.tipo=="TEXTURA")piso.material.map.repeat.set(scaleX, scaleZ );//1,1
          }
        }


        /*Ajustar modulos altura*/

        if(heightnew!=height)actualizarModulos();


        /*TODO textura piso*/


        //Perimetral

        let perimetral=scene.getObjectByName( "Perimetral", true );

        if(typeof perimetral !== "undefined")
        {
            let children=perimetral.getObjectByName( "frente", true );
            if(typeof children !== "undefined")
            {
                children.scale.x=children.scale.x*widthtmp;
                children.position.z+=(deepdif/2);
                children.position.x=children.position.x*widthtmp;
            }

            children=perimetral.getObjectByName( "atras", true );
            if(typeof children !== "undefined")
            {
                children.scale.x=children.scale.x*widthtmp;
                children.position.z+=-(deepdif/2);
                children.position.x=children.position.x*widthtmp;
            }

            children=perimetral.getObjectByName( "izq", true );
            if(typeof children !== "undefined")
            {

                children.scale.y=children.scale.y*deeptmp;
                children.position.x+=-(widthdif/2);

            }

            children=perimetral.getObjectByName( "der", true );
            if(typeof children !== "undefined")
            {

                children.scale.y=children.scale.y*deeptmp;
                children.position.x+=(widthdif/2);
                //children.position.x=children.position.x*widthtmp;

            }
        }

        //----Pared trasera 

        paredtrasera.children[0].scale.x=paredtrasera.children[0].scale.x*widthtmp;
        paredtrasera.children[1].scale.x=paredtrasera.children[1].scale.x*widthtmp;

        paredtrasera.position.z=paredtrasera.position.z-(deepdif/2);


        paredtrasera.children[0].scale.z*=heighttmp;
        paredtrasera.children[1].scale.z*=heighttmp;


        paredtrasera.position.y=bastidorAltura;

      


        let tvpos=scene.getObjectByName("tvposterior",true);
        if(typeof tvpos !== "undefined")
        {
           tvpos.position.z-=(deepdif/2);
           //console.log("tvpos",tvpos.position.z);
        }
        
        //-----Pared Derecha


        paredder.children[0].scale.x=paredder.children[0].scale.x*deeptmp;
        paredder.children[1].scale.x=paredder.children[1].scale.x*deeptmp;

        paredder.children[0].scale.z=paredder.children[0].scale.z*heighttmp;
        paredder.children[1].scale.z=paredder.children[1].scale.z*heighttmp;

        paredder.position.x+=(widthdif/2);
        //console.log(paredder);
        paredder.position.y=bastidorAltura;
        //paredder.position.y=.135;

        let tvder=scene.getObjectByName("tvderecha",true);
        if(typeof tvder !== "undefined")
        {
           tvder.position.x+=(widthdif/2);
        }


        //---- Pared Izquierda

        paredizq.children[0].scale.x=paredizq.children[0].scale.x*deeptmp;
        paredizq.children[1].scale.x=paredizq.children[1].scale.x*deeptmp;

        paredizq.children[0].scale.z=paredizq.children[0].scale.z*heighttmp;
        paredizq.children[1].scale.z=paredizq.children[1].scale.z*heighttmp;

        paredizq.position.x-=(widthdif/2);
        paredizq.position.y=bastidorAltura;

        let tvizq=scene.getObjectByName("tvizquierda",true);
        if(typeof tvizq !== "undefined")
        {
           tvizq.position.x-=(widthdif/2);
        }

        //-----

        if(objStand.stand.hasOwnProperty('bastidores'))
        {
        
          changeObj(objStand.stand.bastidores,false,esPrimeraRedim);


        }else {
          if(typeof crearLamparas!="undefined"&&groupLamparas.children.length>=0)
          { 
            
            if(paredtrasera.visible)crearLamparas(scene,paredtrasera,heightnew, widthnew,cantLamparasTra);
            if(paredizq.visible)crearLamparas(scene,paredizq,heightnew, deepnew,cantLamparasIzq);
            if(paredder.visible)crearLamparas(scene,paredder,heightnew, deepnew,cantLamparasDer);
          }
        }

        
        //------ Header -------


        objStand.header.frente.valor.posicion="CEN";
        objStand.header.posterior.valor.posicion="CEN";
        objStand.header.izquierda.valor.posicion="CEN";
        objStand.header.derecha.valor.posicion="CEN";
        //console.log(bannerfrente,deepdif);
        bannerder.position.x=(widthnew/2);//bannerder.position.x+=(widthdif/2);
        bannerizq.position.x=-(widthnew/2);//widthdif
        bannerfrente.position.z=(deepnew/2);//(deepdif/2)
        banneratras.position.z=-(deepnew/2);//banneratras.position.z-=(deepdif/2);

        bannerder2.position.x=(widthnew/2);//(widthdif/2);
        bannerizq2.position.x=-(widthnew/2);//(widthdif/2);
        bannerfrente2.position.z=(deepnew/2);//(deepdif/2);
        banneratras2.position.z=-(deepnew/2);//(deepdif/2);

        if(objStand.header.frente.valor.activo)
        {
          if(objStand.header.frente.valor.ancho>widthnew){
            objStand.header.frente.valor.ancho=widthnew;


          }
          changeObj(objStand.header.frente,false,esPrimeraRedim);
        }
         //(width+0.01)/width;

         if(objStand.header.posterior.valor.activo)
         {
           if(objStand.header.posterior.valor.ancho>widthnew){
             objStand.header.posterior.valor.ancho=widthnew;


           }
             changeObj(objStand.header.posterior,false,esPrimeraRedim);

         }
         //banneratras.scale.x*=widthtmp;
         if(objStand.header.derecha.valor.activo)
         {
           if(objStand.header.derecha.valor.ancho>deepnew){
             objStand.header.derecha.valor.ancho=deepnew;

           }
             changeObj(objStand.header.derecha,false,esPrimeraRedim);

         }
         //bannerder.scale.x*=deeptmp;
         if(objStand.header.izquierda.valor.activo)
         {
          if(objStand.header.izquierda.valor.ancho>deepnew){
             objStand.header.izquierda.valor.ancho=deepnew;

           }
           //console.log(objStand.header.izquierda.valor.ancho);
             //bannerizq.children[0].scale.x=objStand.header.izquierda.valor.ancho/3;
             //bannerizq.children[1].scale.x=objStand.header.izquierda.valor.ancho/3;
             changeObj(objStand.header.izquierda,false,esPrimeraRedim);


         }
         //------ Fin Header -------
    


        metal.scale.x=metal.scale.x*widthtmp;
        metal.position.z=metal.position.z+(deepdif/2);

        deep=deepnew;
        width=widthnew;
        height=heightnew;

        gridHelper.remove(...gridHelper.children);
        pintarGrid(gridHelper,width,deep);

        gridHelper.visible=false;

      if(heightnew>3.0)heighttmp=1;
      else if(heightnew==2.5)heighttmp=0.8333333333333334;
      else if (heightnew==3.0)heighttmp=1;

        if(objStand.stand.hasOwnProperty('paneleria')||wallMat!=null)
        {
          

            groupPaneleriaPared.remove(...groupPaneleriaPared.children);
            crearPaneleriaPared(paredizq,paredder,paredtrasera,width,deep,heighttmp,wallMat,renderer);


        }else {

          
          //Entra en esta parte del codigo solo cuando no se ha activado la paneleria sola, después
          //Solo entra al ir de ariba
          groupPaneleriaIzq.remove(...groupPaneleriaIzq.children);
          groupPaneleriaDer.remove(...groupPaneleriaDer.children);
          groupPaneleriaTra.remove(...groupPaneleriaTra.children);

          crearPaneleria(paredizq,paredder,width,deep,heighttmp,renderer);

     

        }
        
       



        //groupTruss.remove(...groupTruss.children);
        //crearTruss(bannerizq,bannerder,banneratras,bannerfrente,objStand,deep,objStand.header.altoHeader.valor,width);


    }

    function pasoBaseAtras(accionNueva)
    {

    }

    function insertAt(array, index, ...elementsArray) {
    array.splice(index, 0, ...elementsArray);
    }

    function changeObj(event,reg=false,esPrimeraCarga=false,ejecutar=true)
    {
      //console.log("Evento Change",event);
      //detalle - Metodo donde se ajustan las  configuraciones del stand, enviadas por el evento de la ventana,
      //capturada por el metodo de window.controlChanged, aquí se evaluan  y se realiza la operación para cada opcion.
      let tiempoObjeto = 0;

        if(ejecutar==false)
            return;

        let opcaccion;
        let grabarPaso=true;
        let mouseUp=true;

        /*
        Se revisa si el mouse fue o no oprimido en los controles de scroll del menú y se verifica
        si se esta moviendo el scroll para no grabar el paso atras, sumado a esto se verifica si paso
        de un scroll a otro sin hacer otra acción con la variable mouseUpGeneral que cambia cuando se levanta el dedo del mouse.
        */
        if( typeof event.mouseup !== "undefined" && event.mouseup!=="" && acciones.length>0)
        {

         if (typeof acciones[acciones.length - 1].event.mouseup )//!== "undefined" 
         {
            mouseUp=false;

            if(mouseUpGeneral && !event.mouseup)
            {
              mouseUpGeneral=false;
              mouseUp=true;
            }

          }

          if(event.mouseup)mouseUpGeneral=true;
        }

        //console.log(mouseUp);
        if(reg==true&&mouseUp) //**me falta poner que si llega del 2D una variable para no grabar, no dejarlo entrar al if
        {
            //detalle - devolver, se graba el paso anteior para poder volver después

            //opcaccion={"accion":"change","event":event};
            opcaccion={"accion":"change","event":(JSON.parse(JSON.stringify(event)))};
            pasoBaseAtras(opcaccion);
            //console.log("acciones",acciones,event);
            if(opcaccion.accion=="change")
            {
              let propiedad=opcaccion.event.propiedad;
              let componente=opcaccion.event.componente;

              if(componente=="stand")
              {

              if(propiedad=="ancho")opcaccion.event.valor=objStand.stand.width.valor;
              else if(propiedad=="profundo")opcaccion.event.valor=objStand.stand.deep.valor;
              else if(propiedad=="altura")opcaccion.event.valor=objStand.stand.height.valor;
              else if(propiedad=="tarimado")opcaccion.event.valor=objStand.stand.tarimado.valor;
              else if(propiedad=="piso")opcaccion.event.valor=objStand.stand.piso.valor;
              else if(propiedad=="texturaPiso"){
                //console.log("Propiedad",opcaccion.event,objStand.stand.texturaPiso);
                if(typeof objStand.stand.texturaPiso !== "undefined")
                {
                  opcaccion.event=objStand.stand.texturaPiso;
                } else opcaccion.event=objStand.stand.perimetral;

              //  "ALFOMBRA" "PERIMETRAL" opcaccion.event.tipo

              }
              else if(propiedad=="texturaPared"){
              //console.log(opcaccion.event,objStand.stand.bastidores);
                if(opcaccion.event.tipo=="BASTIDORES"&& typeof objStand.stand.bastidores === "undefined")opcaccion.event=objStand.stand.paneleria;
                else if(opcaccion.event.tipo=="BASTIDORES"&& typeof objStand.stand.bastidores !== "undefined")
                {


                  if(opcaccion.event.valor.general.grafico!=objStand.stand.bastidores.valor.general.grafico)grabarPaso=false;


                  if(!opcaccion.event.valor.general.grafico)
                  {
                  if(standBase=="Esquinero Derecho")if(!opcaccion.event.valor.derecha.grafico&&!opcaccion.event.valor.posterior.grafico)objStand.stand.bastidores.valor.general.grafico=true;
                  else if(standBase=="Esquinero Izquierdo")if(!opcaccion.event.valor.izquierda.grafico&&!opcaccion.event.valor.posterior.grafico)objStand.stand.bastidores.valor.general.grafico=true;
                  else if(standBase=="Punta")if(!opcaccion.event.valor.posterior.grafico)objStand.stand.bastidores.valor.general.grafico=true;
                  else if(!opcaccion.event.valor.derecha.grafico&&!opcaccion.event.valor.izquierda.grafico&&!opcaccion.event.valor.posterior.grafico)objStand.stand.bastidores.valor.general.grafico=true;

                  }

                  opcaccion.event=objStand.stand.bastidores;

                }
                else if(opcaccion.event.tipo=="PANELERIA"&& typeof objStand.stand.paneleria === "undefined")opcaccion.event=objStand.stand.bastidores;
                else if(opcaccion.event.tipo=="PANELERIA"&& typeof objStand.stand.paneleria !== "undefined")opcaccion.event=objStand.stand.paneleria;
                //opcaccion.event.valor=objStand.stand.bastidores.valor;
              }
            }else if(componente=="header")
            {
                if(propiedad=="header")opcaccion.event=objStand.header.general;
                else if(propiedad=="altoTruss")opcaccion.event=objStand.header.altoTruss;
                else if(propiedad=="frente")opcaccion.event=objStand.header.frente;
                else if(propiedad=="posterior")opcaccion.event=objStand.header.posterior;
                else if(propiedad=="izquierda")opcaccion.event=objStand.header.izquierda;
                else if(propiedad=="derecha")opcaccion.event=objStand.header.derecha;
                else if(propiedad=="altoHeader"){
                  opcaccion.event=objStand.header.altoHeader;

                  if(acciones[acciones.length-1].event.valor==5.1){
                    grabarPaso=false;
                    insertAt(acciones,acciones.length-1,opcaccion);
                     }
                }

            }else if(componente=="modulo")
            {


              let objMod=buscarModulo(event.uuid);

              if(objMod!=null)
                {


                  let estadoIncial;




                    if(typeof objMod.data2[event.pared].valor ==="undefined")
                    {
                        //../assets/imagenes/PANELERIA/BLANCO.png
                        //console.log("GRABO aca",event);
                        if(!event.valor.grafico)opcaccion.event.valor.grafico=true;//!event.valor.grafico;
                        else opcaccion.event.valor.imagen = "../assets/imagenes/PANELERIA/BLANCO.png";

                        if(event.valor.televisor)opcaccion.event.valor.televisor=false;



                    }else
                    {

                      estadoIncial=JSON.parse(JSON.stringify(objMod.data2[event.pared].valor));
                      opcaccion.event.valor=estadoIncial;
                    }

                    //console.log(objMod.data2.accionAtras,graficoGeneralOffMod);
                    if(objMod.data2.accionAtras){

                      if(!graficoGeneralOffMod)objMod.data2.accionAtras=false;
                      grabarPaso=false;
                       }
                    //console.log("acciones",acciones,event,estadoIncial);


                }

            }

            }

            if(grabarPaso)acciones.push(opcaccion);
          //  console.log("accion",acciones);
        }

        if(event.componente=="header") //detalle - header
        {
          let deltaFront=10;
          let movDobleCara=.003;

            if(typeof objStand.header === "undefined")
                objStand.header=new Object();

            if(event.propiedad=="header")
            {
                objStand.header.general=event;
                header.visible=event.valor;
                //metal.visible=event.valor;
                groupTruss.visible=event.valor;
            }

            if(event.propiedad=="altoTruss")
            {

                objStand.header.altoTruss=event;
                let tmp=0;

                //groupTruss.position.y=event.valor;
                bannerder.position.y=event.valor;
                bannerizq.position.y=event.valor;
                bannerfrente.position.y=event.valor;
                banneratras.position.y=event.valor;

                bannerder2.position.y=event.valor;
                bannerizq2.position.y=event.valor;
                bannerfrente2.position.y=event.valor;
                banneratras2.position.y=event.valor;


                let alto = event.valor;
                if(alto=="" || alto =="undefined" || alto == null || alto < 4)
                    alto=5;
                //console.log("alto",alto);
                groupTruss.remove(...groupTruss.children);

                //objStand.header
                crearTruss(bannerizq,bannerder,banneratras,bannerfrente,objStand,deep,alto,width);
                //crearTruss(bannerizq,bannerder,banneratras,bannerfrente,width,deep,alto);
                //scene.add( groupTruss );
                //console.log(groupTruss);
                //header.position.y=event.valor
                /*for(let i=0;i<metal.children.length;i++)
                {
                    if(i==0)
                        tmp=metal.children[i].position.y;

                    let dif=metal.children[i].position.y-event.valor;
                    metal.children[i].position.y=event.valor;
                    header.position.y-=dif;
                }*/

                /*if(reg==true)
                    acciones[acciones.length-1].event.valor=tmp;*/

            }else if(event.propiedad=="altoHeader")
            {
                objStand.header.altoHeader=event;
                let tmp=bannerfrente.scale.z*2;
                if(event.valor=="1.5")
                    header.position.y=-0.3420562744140625;

                if(event.valor=="1")
                    header.position.y=-0.01;

                bannerfrente.children[0].scale.z=event.valor/1.5;
                bannerfrente.children[1].scale.z=event.valor/1.5;

                bannerizq.children[0].scale.z=event.valor/1.5;
                bannerizq.children[1].scale.z=event.valor/1.5;

                bannerder.children[0].scale.z=event.valor/1.5;
                bannerder.children[1].scale.z=event.valor/1.5;

                banneratras.children[0].scale.z=event.valor/1.5;
                banneratras.children[1].scale.z=event.valor/1.5;

                bannerfrente2.children[0].scale.z=event.valor/1.5;
                bannerfrente2.children[1].scale.z=event.valor/1.5;

                bannerizq2.children[0].scale.z=event.valor/1.5;
                bannerizq2.children[1].scale.z=event.valor/1.5;

                bannerder2.children[0].scale.z=event.valor/1.5;
                bannerder2.children[1].scale.z=event.valor/1.5;

                banneratras2.children[0].scale.z=event.valor/1.5;
                banneratras2.children[1].scale.z=event.valor/1.5;

                //bannerizq.scale.z=event.valor/2;
                //bannerder.scale.z=event.valor/2;
                //banneratras.scale.z=event.valor/2;


              if(typeof objStand.header.frente !=="undefined")
              {
              if(objStand.header.frente.valor.imagen!="")
                {
                    loadImageTexture(bannerfrente.children[0],objStand.header.frente.valor.imagen,objStand.header.frente.valor.despHorizontal,objStand.header.frente.valor.despVertical,objStand.header.frente.valor.zoom);
                }
              if(objStand.header.frente.valor.imagenDoble!="")
                {
                    loadImageTexture(bannerfrente2.children[0],objStand.header.frente.valor.imagenDoble,objStand.header.frente.valor.despHorizontalDoble,objStand.header.frente.valor.despVerticalDoble,objStand.header.frente.valor.zoomDoble);
                }
              }

              if(typeof objStand.header.posterior !=="undefined")
              {
              if(objStand.header.posterior.valor.imagen!="")
                {
                    loadImageTexture(banneratras.children[0],objStand.header.posterior.valor.imagen,objStand.header.posterior.valor.despHorizontal,objStand.header.posterior.valor.despVertical,objStand.header.posterior.valor.zoom);
                }
              if(objStand.header.posterior.valor.imagenDoble!="")
                {
                    loadImageTexture(banneratras2.children[0],objStand.header.posterior.valor.imagenDoble,objStand.header.posterior.valor.despHorizontalDoble,objStand.header.posterior.valor.despVerticalDoble,objStand.header.posterior.valor.zoomDoble);
                }
              }

              if(typeof objStand.header.derecha !=="undefined")
              {
              if(objStand.header.derecha.valor.imagen!="")
                {
                    loadImageTexture(bannerder.children[0],objStand.header.derecha.valor.imagen,objStand.header.derecha.valor.despHorizontal,objStand.header.derecha.valor.despVertical,objStand.header.derecha.valor.zoom);
                }
              if(objStand.header.derecha.valor.imagenDoble!="")
                {
                    loadImageTexture(bannerder2.children[0],objStand.header.derecha.valor.imagenDoble,objStand.header.derecha.valor.despHorizontalDoble,objStand.header.derecha.valor.despVerticalDoble,objStand.header.derecha.valor.zoomDoble);
                }
              }

              if(typeof objStand.header.izquierda !=="undefined")
              {
              if(objStand.header.izquierda.valor.imagen!="")
                {
                    loadImageTexture(bannerizq.children[0],objStand.header.izquierda.valor.imagen,objStand.header.izquierda.valor.despHorizontal,objStand.header.izquierda.valor.despVertical,objStand.header.izquierda.valor.zoom);
                }
              if(objStand.header.izquierda.valor.imagenDoble!="")
                {
                    loadImageTexture(bannerizq2.children[0],objStand.header.izquierda.valor.imagenDoble,objStand.header.izquierda.valor.despHorizontalDoble,objStand.header.izquierda.valor.despVerticalDoble,objStand.header.izquierda.valor.zoomDoble);
                }
              }


                //


                /*if(reg==true)
                    acciones[acciones.length-1].event.valor=tmp;*/

            }else if(event.propiedad=="frente")
            {


                objStand.header.frente=event;

                bannerfrente.visible=event.valor.activo;
                bannerfrente2.visible=event.valor.graficoDoble;
                if(!event.valor.activo)bannerfrente2.visible=false;

                bannerfrente2.position.z=bannerfrente.position.z-movDobleCara;

                let tmp;

                //if(reg==true)
                tmp={"valor":{"ancho":bannerfrente.children[0].scale.x*deltaFront}};
                //let tmp={"valor":{"ancho":bannerfrente.scale.x*2}};
                //bannerfrente.scale.x=event.valor.ancho/2;

                bannerfrente.children[0].scale.x=event.valor.ancho/deltaFront;
                bannerfrente.children[1].scale.x=event.valor.ancho/deltaFront;

                //bannerfrente2.scale.x=event.valor.ancho/2;

                bannerfrente2.children[0].scale.x=event.valor.ancho/deltaFront;
                bannerfrente2.children[1].scale.x=event.valor.ancho/deltaFront;

                tmp.valor.positionx=bannerfrente.position.x;

                //console.log(bannerfrente2,bannerfrente,deltaFront);
                if(event.valor.posicionx)
                {
                    bannerfrente.position.x=event.valor.posicionx;
                    bannerfrente2.position.x=event.valor.posicionx;
                }
                else if(event.valor.posicion=="IZQ")
                {
                    bannerfrente.position.x=(-width/2)+(event.valor.ancho/2);
                    bannerfrente2.position.x=(-width/2)+(event.valor.ancho/2);
                }
                else if(event.valor.posicion=="CEN")
                {
                    bannerfrente.position.x=0;
                    bannerfrente2.position.x=0;
                }
                else if(event.valor.posicion=="DER")
                {
                    bannerfrente.position.x=(width/2)-(event.valor.ancho/2);
                    bannerfrente2.position.x=(width/2)-(event.valor.ancho/2);
                }

                if(event.valor.hasOwnProperty('material'))
                {
                    if(event.valor.material!="undefined")
                        bannerfrente.children[0].material=event.valor.material;
                    delete objStand.header.frente.valor.material;
                }
                else if(event.valor.imagen!="")
                {
                    tmp.valor["material"]=bannerfrente.children[0].material;

                    loadImageTexture(bannerfrente.children[0],event.valor.imagen,event.valor.despHorizontal,event.valor.despVertical,event.valor.zoom);
                }

                if(event.valor.hasOwnProperty('material2'))
                {
                    if(event.valor.material2!="undefined")
                        bannerfrente2.children[0].material=event.valor.material;
                    delete objStand.header.frente.valor.material2;
                }
                else if(event.valor.imagenDoble!="")
                {
                    tmp.valor["material2"]=bannerfrente2.children[0].material;
                    loadImageTexture(
                            bannerfrente2.children[0],
                            event.valor.imagenDoble,
                            event.valor.despHorizontalDoble ,
                            event.valor.despVerticalDoble ,
                            event.valor.zoomDoble
                        );
                }


                //console.log(objStand.header.altoTruss.valor);
                groupTruss.remove(...groupTruss.children);
                crearTruss(bannerizq,bannerder,banneratras,bannerfrente,objStand,deep,objStand.header.altoTruss.valor,width);

                //crearTruss(bannerizq,bannerder,banneratras,bannerfrente,event.valor.ancho,deep,"");
            }
            else if(event.propiedad=="posterior")
            {

                banneratras2.position.z=banneratras.position.z+movDobleCara;

                objStand.header.posterior=event;
                banneratras.visible=event.valor.activo;
                banneratras2.visible=event.valor.graficoDoble;
                if(!event.valor.activo)banneratras2.visible=false;
                let tmp={"valor":{"ancho":banneratras.children[0].scale.x*deltaFront}};

                //banneratras.scale.x=event.valor.ancho/2;

                banneratras.children[0].scale.x=event.valor.ancho/deltaFront;
                banneratras.children[1].scale.x=event.valor.ancho/deltaFront;

                //banneratras2.scale.x=event.valor.ancho/2;

                banneratras2.children[0].scale.x=event.valor.ancho/deltaFront;
                banneratras2.children[1].scale.x=event.valor.ancho/deltaFront;

                tmp.positionx=banneratras.position.x;


                if(event.valor.posicionx)
                {
                    banneratras.position.x=(-width/2)+(event.valor.ancho/2);
                    banneratras2.position.x=(-width/2)+(event.valor.ancho/2);
                }
                else if(event.valor.posicion=="IZQ")
                {
                    banneratras.position.x=((width/2)-(event.valor.ancho/2));
                    banneratras2.position.x=((width/2)-(event.valor.ancho/2));
                }
                else if(event.valor.posicion=="CEN")
                {
                    banneratras.position.x=0;
                    banneratras2.position.x=0;
                }
                else if(event.valor.posicion=="DER")
                {
                  //bannerfrente.position.x=(width/2)-((event.valor.ancho+0.3)/2);
                    banneratras.position.x=-((width/2)-(event.valor.ancho/2));
                    banneratras2.position.x=-((width/2)-(event.valor.ancho/2));
                }

                if(event.valor.hasOwnProperty('material'))
                {
                    if(event.valor.material!="undefined")
                        banneratras.children[0].material=event.valor.material;
                    delete objStand.header.posterior.valor.material;
                }
                else if(event.valor.imagen!="")
                {
                    tmp.valor["material"]=banneratras.children[0].material;
                    loadImageTexture(banneratras.children[0],event.valor.imagen,event.valor.despHorizontal,event.valor.despVertical,event.valor.zoom);
                }

                if(event.valor.hasOwnProperty('material2'))
                {
                    if(event.valor.material2!="undefined")
                        banneratras2.children[0].material=event.valor.material2;
                    delete objStand.header.posterior.valor.material2;
                }
                else if(event.valor.imagenDoble!="")
                {
                    tmp.valor["material2"]=banneratras2.children[0].material2;
                    loadImageTexture(
                            banneratras2.children[0],
                            event.valor.imagenDoble,
                            event.valor.despHorizontalDoble,
                            event.valor.despVerticalDoble,
                            event.valor.zoomDoble
                        );
                }

                //console.log("bannerposterior 001",bannerfrente,objStand.header.posterior.valor.ancho);

                /*if(reg==true)
                {
                    if(tmp.valor.hasOwnProperty('material'))
                        acciones[acciones.length-1].event.valor.material=tmp.valor.material;
                    if(tmp.valor.hasOwnProperty('material2'))
                        acciones[acciones.length-1].event.valor.material2=tmp.valor.material2;
                    acciones[acciones.length-1].event.valor.positionx=tmp.valor.positionx;
                    acciones[acciones.length-1].event.valor.ancho=tmp.valor.ancho;
                }*/
                groupTruss.remove(...groupTruss.children);

                //console.log("bannerposterior 002",bannerfrente,objStand.header.posterior.valor.ancho);

                crearTruss(bannerizq,bannerder,banneratras,bannerfrente,objStand,deep,objStand.header.altoTruss.valor,width);
                //crearTruss(bannerizq,bannerder,banneratras,bannerfrente,width,deep,"");
            }
            else if(event.propiedad=="izquierda")
            {

                bannerizq2.position.x=bannerizq.position.x+movDobleCara;
                //console.log(bannerizq);
                objStand.header.izquierda=event;
                bannerizq.visible=event.valor.activo;
                bannerizq2.visible=event.valor.graficoDoble;
                if(!event.valor.activo)bannerizq2.visible=false;
                //console.log("evento izquierda",event);
                let tmp={"valor":{"ancho":bannerizq.children[0].scale.x*deltaFront}};
                //bannerizq.scale.x=event.valor.ancho/2;

                bannerizq.children[0].scale.x=event.valor.ancho/deltaFront;
                bannerizq.children[1].scale.x=event.valor.ancho/deltaFront;

                //bannerizq2.scale.x=event.valor.ancho/2;

                bannerizq2.children[0].scale.x=event.valor.ancho/deltaFront;
                bannerizq2.children[1].scale.x=event.valor.ancho/deltaFront;

                tmp.positionx=bannerizq.position.x;

                if(event.valor.posicionx)
                {
                    bannerizq.position.x=(-width/2)+((event.valor.ancho+0.3)/2);
                    bannerizq2.position.x=(-width/2)+((event.valor.ancho+0.3)/2);
                }
                else if(event.valor.posicion=="IZQ")
                {
                    bannerizq.position.z=(-deep/2)+((event.valor.ancho)/2);
                    bannerizq2.position.z=(-deep/2)+((event.valor.ancho)/2);
                }
                else if(event.valor.posicion=="CEN")
                {
                    bannerizq.position.z=0;
                    bannerizq2.position.z=0;
                }
                else if(event.valor.posicion=="DER")
                {
                    bannerizq.position.z=(deep/2)-((event.valor.ancho)/2);
                    bannerizq2.position.z=(deep/2)-((event.valor.ancho)/2);
                }


                if(event.valor.hasOwnProperty('material'))
                {
                    if(event.valor.material!="undefined")
                        bannerizq.children[0].material=event.valor.material;
                    delete objStand.header.izquierda.valor.material;
                }
                else if(event.valor.imagen!="")
                {
                    tmp.valor["material"]=bannerizq.children[0].material;
                    loadImageTexture(bannerizq.children[0],event.valor.imagen,event.valor.despHorizontal,event.valor.despVertical,event.valor.zoom);
                    //loadImageTexture(bannerizq.children[0],"../assets/imagenes/LOGO_ATMOS_EXPERIENCE.svg",event.valor.despHorizontal,event.valor.despVertical,event.valor.zoom);
                }

                if(event.valor.hasOwnProperty('material2'))
                {
                    if(event.valor.material2!="undefined")
                        bannerizq2.children[0].material=event.valor.material2;
                    delete objStand.header.izquierda.valor.material2;
                }
                else if(event.valor.imagenDoble!="")
                {
                    tmp.valor["material2"]=bannerizq2.children[0].material2;
                    loadImageTexture(bannerizq2.children[0],event.valor.imagenDoble ,event.valor.despHorizontalDoble ,event.valor.despVerticalDoble ,event.valor.zoomDoble);
                }

                /*if(reg==true)
                {
                    if(tmp.valor.hasOwnProperty('material'))
                        acciones[acciones.length-1].event.valor.material=tmp.valor.material;

                    if(tmp.valor.hasOwnProperty('material2'))
                        acciones[acciones.length-1].event.valor.material2=tmp.valor.material2;

                    acciones[acciones.length-1].event.valor.positionx=tmp.positionx;
                    acciones[acciones.length-1].event.valor.ancho=tmp.valor.ancho;
                }*/
                groupTruss.remove(...groupTruss.children);

                crearTruss(bannerizq,bannerder,banneratras,bannerfrente,objStand,deep,objStand.header.altoTruss.valor,width);
                //crearTruss(bannerizq,bannerder,banneratras,bannerfrente,width,deep,"");
            }
            else if(event.propiedad=="derecha")
            {

                bannerder2.position.x=bannerder.position.x-movDobleCara;

                objStand.header.derecha=event;
                bannerder.visible=event.valor.activo;
                bannerder2.visible=event.valor.graficoDoble;
                if(!event.valor.activo)bannerder2.visible=false;

                let tmp={"valor":{"ancho": bannerder.children[0].scale.x*deltaFront}};
                //bannerder.scale.x=event.valor.ancho/2;

                bannerder.children[0].scale.x=event.valor.ancho/deltaFront;
                bannerder.children[1].scale.x=event.valor.ancho/deltaFront;

                //bannerder2.scale.x=event.valor.ancho/2;

                bannerder2.children[0].scale.x=event.valor.ancho/deltaFront;
                bannerder2.children[1].scale.x=event.valor.ancho/deltaFront;

                tmp.positionx=bannerder.position.x;

                if(event.valor.posicionx)
                {
                    bannerder.position.x=(-width/2)+((event.valor.ancho+0.3)/2);
                    bannerder2.position.x=(-width/2)+((event.valor.ancho+0.3)/2);
                }
                else if(event.valor.posicion=="IZQ")
                {
                    bannerder.position.z=(deep/2)-((event.valor.ancho)/2);
                    bannerder2.position.z=(deep/2)-((event.valor.ancho)/2);
                }
                else if(event.valor.posicion=="CEN")
                {
                    bannerder.position.z=0;
                    bannerder2.position.z=0;
                }
                else if(event.valor.posicion=="DER")
                {
                    bannerder.position.z=(-deep/2)+((event.valor.ancho)/2);
                    bannerder2.position.z=(-deep/2)+((event.valor.ancho)/2);
                }

                if(event.valor.hasOwnProperty('material'))
                {
                    if(event.valor.material!="undefined")
                        bannerder.children[0].material=event.valor.material;
                    delete objStand.header.derecha.valor.material;
                }
                else if(event.valor.imagen!="")
                {
                    tmp.valor["material"]=bannerder.children[0].material;
                    loadImageTexture(bannerder.children[0],event.valor.imagen,event.valor.despHorizontal,event.valor.despVertical,event.valor.zoom);
                }

                if(event.valor.hasOwnProperty('material2'))
                {
                    if(event.valor.material2!="undefined")
                        bannerder2.children[0].material=event.valor.material2;
                    delete objStand.header.derecha.valor.material2;
                }
                else if(event.valor.imagenDoble!="")
                {
                    tmp.valor["material2"]=bannerder2.children[0].material2;
                    loadImageTexture(bannerder2.children[0],event.valor.imagenDoble ,event.valor.despHorizontalDoble ,event.valor.despVerticalDoble ,event.valor.zoomDoble);
                }


                /*if(reg==true)
                {
                    if(tmp.valor.hasOwnProperty('material'))
                        acciones[acciones.length-1].event.valor.material=tmp.valor.material;
                    if(tmp.valor.hasOwnProperty('material2'))
                        acciones[acciones.length-1].event.valor.material2=tmp.valor.material2;
                    acciones[acciones.length-1].event.valor.positionx=tmp.positionx;
                    acciones[acciones.length-1].event.valor.ancho=tmp.valor.ancho;
                }*/
                groupTruss.remove(...groupTruss.children);

                crearTruss(bannerizq,bannerder,banneratras,bannerfrente,objStand,deep,objStand.header.altoTruss.valor,width);
                //crearTruss(bannerizq,bannerder,banneratras,bannerfrente,width,deep,"");
            }


        }
        else if(event.componente=="stand")
        {
          //console.log("perimetral",event);

            if(typeof objStand.stand === "undefined")
                objStand.stand=new Object();
            if(event.propiedad=="tarimado")
            {
              //console.log("TARIMADO",piso,pabellon);

                objStand.stand.tarimado=event;
                if(event.valor==false)
                {

                    piso.scale.y=0.001;   //y: 0.05000000074505806
                    piso.position.y=0.27; // 0.09999990463256836


                    if(typeof pabellon!=="undefined")
                        pabellon.position.y=0.15;//-0.02;
                }
                else
                {
                    piso.scale.y=0.05000000074505806;
                    piso.position.y=0.09999990463256836;


                    if(typeof pabellon!=="undefined")
                        pabellon.position.y=0.05;//-0.15;
                }
                if(reg==true)
                {
                   let onOff=!event.valor;
                    //acciones[acciones.length-1].event.valor=onOff;
                }


            }
            else if(event.propiedad=="piso")//&&typeof objStand.stand.perimetral == "undefined"
            {

              //console.log("event PISO",event);
                objStand.stand.piso=event;

                piso.visible=event.valor;
                if(piso.visible==false)
                {
                    let Perimetral=scene.getObjectByName( "Perimetral", true );
                    if(Perimetral!=="undefined")
                        scene.remove(Perimetral);
                    piso.scale.y=0.001;   //y: 0.05000000074505806
                    piso.position.y=0.09999990463256836; //0.27; 
                    if(typeof pabellon!=="undefined")
                        pabellon.position.y=0.15;//-0.02;
                }
                else
                {
                    if(typeof objStand.stand.perimetral != "undefined")
                    {
                        piso.visible = false;
               

                    }else{

                            piso.scale.y=0.05000000074505806;
                            piso.position.y=0.09999990463256836;
                            if(typeof pabellon!=="undefined")
                                pabellon.position.y=0.05;//0.15;

                            if(typeof objStand.stand.tarimado !== "undefined")
                            {
                                //console.log("tarimado",objStand.stand.tarimado);
                                changeObj(objStand.stand.tarimado,false);
                            }

                    }

                }
             
            }
            else if(event.propiedad=="texturaPiso")
            {

                if(event.tipo!="PERIMETRAL")
                {



                  if(reg==true)
                  {
                    let tmp=piso.material;

                      //acciones[acciones.length-1].event=objStand.stand.texturaPiso;
                      //acciones[acciones.length-1].event.mat=tmp;

                  }

                    objStand.stand.texturaPiso=event;
                    delete objStand.stand.perimetral;
                    piso.visible=true;



                    let Perimetral=scene.getObjectByName( "Perimetral", true );
                    if(Perimetral!=="undefined")
                        scene.remove(Perimetral);


                    let floorMat = new THREE.MeshStandardMaterial( {
                            roughness: 0.8,
                            color: 0xffffff,
                            metalness: 0.2,
                            bumpScale: 0.0005,
                    } );

                    let textureLoader = new THREE.TextureLoader();

                    textureLoader.load( event.valor.replace("src",".."), function ( map ) {

                            map.wrapS = THREE.RepeatWrapping;
                            map.wrapT = THREE.RepeatWrapping;
                            //map.(sourceWidth*zoom*2)/obj.scale.x;
                            let scaleX = piso.scale.x/.5;
                            let scaleZ = piso.scale.z/.5;
                            //console.log("alfombra",scaleX, scaleZ);
                            map.anisotropy = 4;
                            if(event.tipo=="ALFOMBRA")map.repeat.set(50,50);//piso.scale.x, piso.scale.z
                            else if(event.tipo=="TEXTURA")map.repeat.set( scaleX, scaleZ);//1,1

                            map.needsUpdate = true;
                            floorMat.map = map;
                            floorMat.needsUpdate = true;
                    } );



                    if(event.hasOwnProperty('mat'))
                    {
                        piso.material=event.mat;
                    }
                    else
                    {
                        piso.material=floorMat;
                    }
                    /*
                    piso.material.map.wrapS = THREE.RepeatWrapping;
                    piso.material.map.wrapT = THREE.RepeatWrapping;
                    piso.material.map.anisotropy = 4;
                    piso.material.map.repeat.set( 50, 50 );
                    piso.material.needsUpdate = true;

                    console.log(piso,event.valor.replace("src",".."));
                    loadImageTexture(piso,event.valor.replace("src",".."),1,1,1);
                      */

                    delete objStand.stand.texturaPiso.mat;

                }

                if(event.tipo=="PERIMETRAL")
                {

                    objStand.stand.perimetral=event;
                    delete objStand.stand.texturaPiso;
                    piso.visible=false;

                    if(piso.visible==false)
                    {
                        piso.scale.y=0.001;   //y: 0.05000000074505806
                        piso.position.y=0.27; // 0.09999990463256836
                        if(typeof pabellon!=="undefined")
                            pabellon.position.y=0.15;//-0.02;
                    }
                    else
                    {
                        piso.scale.y=0.05000000074505806;
                        piso.position.y=0.09999990463256836;
                        if(typeof pabellon!=="undefined")
                            pabellon.position.y=0.05;
                    }

                    let Perimetral=scene.getObjectByName( "Perimetral", true );

                    let tmp="",uuid="";
                    if(typeof Perimetral !== "undefined")
                    {
                        tmp=Perimetral.children[0].material;
                        uuid=Perimetral.uuid;
                    }
                    else{
                        tmp="crearobjeto";
                    }
                    scene.remove(Perimetral);
                    let groundMaterial;
                    if(event.hasOwnProperty('material'))
                    {
                        groundMaterial=event.material;

                    }
                    else{

                        let groundTexture = new THREE.TextureLoader().load( event.valor.replace("src","..") );
                            groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
                            groundTexture.repeat.set( 50, 50 );//50,50
                            groundTexture.anisotropy = 4;

                        groundMaterial = new THREE.MeshStandardMaterial( { map: groundTexture } );

                    }
                    var groupPerimetral = new THREE.Group();

                    let posini=-(width/2);
                    posini=0;
                    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( width, 0.5 ), groundMaterial );
                   
                        mesh.position.x = posini;
                        mesh.position.y = 0.16;
                        mesh.position.z = (deep/2)-0.25;

                        mesh.rotation.x = - Math.PI / 2;
                        mesh.name="frente";
                        groupPerimetral.add( mesh );


                    if(!paredtrasera.visible)
                    {
                        var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( width, 0.5 ), groundMaterial );
                        mesh.position.x = posini;
                        mesh.position.y = 0.16;
                        mesh.position.z = -(deep/2)+0.25;

                        mesh.rotation.x = - Math.PI / 2;
                        mesh.name="atras";
                        groupPerimetral.add( mesh );
                    }
                    if(!paredizq.visible)
                    {
                        var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(  0.5 , deep ), groundMaterial );
                            mesh.position.x = -(width/2)+0.25;
                            mesh.position.y = 0.16;
                            mesh.position.z = posini;

                            mesh.rotation.x = - Math.PI / 2;
                            mesh.name="izq";
                            groupPerimetral.add( mesh );
                    }

                    if(!paredder.visible)
                    {
                        var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(  0.5 , deep ), groundMaterial );
                            mesh.position.x = (width/2)-0.25;
                            mesh.position.y = 0.16;
                            mesh.position.z = posini;

                            mesh.rotation.x = - Math.PI / 2;
                            mesh.name="der";
                            groupPerimetral.add( mesh );
                    }

                    groupPerimetral.name="Perimetral";
                    if(uuid!="")
                        groupPerimetral.uuid=uuid;
                    scene.add( groupPerimetral );
                    //console.log(groupPerimetral)
                   
                    delete objStand.stand.perimetral.material;

                }
            }
            else if(event.propiedad=="texturaPared")
            {
                if(event.tipo=="PANELERIA")
                {
                      //"stand003" el error esta al cambiar paneleria y cambiar de stand

                    paredtraseraStand.visible = paredIzqStand.visible = paredDerStand.visible = false;

                    //console.log("scene",stand,paredtraseraStand,paredIzqStand,paredDerStand);

                    paredtrasera.children[0].visible= paredtrasera.children[1].visible =false;
                    paredizq.children[0].visible= paredizq.children[1].visible =false;
                    paredder.children[0].visible= paredder.children[1].visible =false;


                    //"PANEL_BLANCO"
                    //console.log("PANELERIA",event);

                    objStand.stand.paneleria=event;
                    delete objStand.stand.bastidores;


                      //
                    wallMat = new THREE.MeshStandardMaterial( {
                            roughness: 0.8,
                            color: 0xffffff,
                            metalness: 0.2,
                            bumpScale: 0.0005
                    } );

                    let textureLoader = new THREE.TextureLoader();

                    textureLoader.load( event.valor.replace("src",".."), function ( map ) {
                            map.wrapS = THREE.RepeatWrapping;
                            map.wrapT = THREE.RepeatWrapping;
                            map.anisotropy = 4;
                            //paredAtrasBase.material = map;
                            //paredAtrasBase.material.needsUpdate = true;
                            wallMat.map = map;
                            wallMat.needsUpdate = true;
                    } );

                    
                    let alturaPaneleria=paredtrasera.children[0].scale.z;

                    if(alturaPaneleria>1)alturaPaneleria=1;

                  

                    groupPaneleriaPared.remove(...groupPaneleriaPared.children);
                    crearPaneleriaPared(paredizq,paredder,paredtrasera,width,deep,alturaPaneleria,wallMat,renderer);
                    scene.add( groupPaneleriaPared );
                    
                    delete objStand.stand.paneleria.mattras;
                    delete objStand.stand.paneleria.matizq;
                    delete objStand.stand.paneleria.matder;

                    //console.log("Lamparas Paneleria",groupPaneleriaPared,event);

                  

                }
                else if(event.tipo=="BASTIDORES")
                {

                    //console.log("BASTIDORES",event);
                    objStand.stand.bastidores=event;
                    //console.log("paneleria",objStand.stand.bastidores);
                    if(typeof objStand.stand.paneleria!=="undefined")objStand.stand.bastidores.paneleria=objStand.stand.paneleria;

                    delete objStand.stand.paneleria;

                    //groupPaneleriaPared.remove(...groupPaneleriaPared.children);

                    let paredes=event.valor;

                    //----- TV Posterior ------
                    let tvpos=scene.getObjectByName("tvposterior",true);

                    let tmp;

                    if( typeof paredes.posterior!=="undefined")
                    {


                    if(paredes.posterior.televisor==true )
                    {


                        if(typeof tvpos !== "undefined")
                        {

                          //console.log("TVVVV INICIALLLL",tvpos);

                            if(paredes.posterior.pulgadasTV!=tvpos.data1 )
                            {
                              tvpos.visible=false;
                              borrarTV(tvpos,objects,scene,controlsT,acciones,reg);

                                //console.log("modulo 0",modulo);
                                if(paredes.posterior.pulgadasTV !="" && paredes.posterior.pulgadasTV !="--")
                                {
                                  //
                                  //console.log("modulo 1",modulo);
                                    let modulo="../assets/modelos3D/TV "+paredes.posterior.pulgadasTV+" PARED.glb";
                                    let jsontmp=[
                                    {
                                        "position": {
                                          "x": ((width)*paredes.posterior.despHorizontalTV)-((width)/2),
                                          "y": 1.3,
                                          "z": -((deep/2)-0.07)
                                        },
                                        "rotation": {
                                          "_x": 0,
                                          "_y": 0,
                                          "_z": 0,
                                          "_order": "XYZ"
                                        },
                                        "type": "Group",
                                        "type1": "gltf",
                                        "file1": modulo,
                                        "drag": 0,
                                        "name":"tvposterior",
                                        "data1":paredes.posterior.pulgadasTV
                                      }
                                    ];
                                    //setTimeout(function(){crearObjetos(jsontmp){},1000);
                                    crearObjetos(jsontmp,reg)
                                }
                            }
                            else
                            {

                                let x=((width)*paredes.posterior.despHorizontalTV)-((width)/2);

                                let anchoTV=1.4;//tv 50
                                if(x>((width-anchoTV)/2))
                                    x=(width-anchoTV)/2;
                                else if(x<-((width-anchoTV)/2))
                                    x=-(width-anchoTV)/2;
                                tvpos.position.x=x;
                                //console.log("ajuste tvpos",tvpos,tvpos.position);
                            }

                        }
                        else
                        {
                            if(paredes.posterior.pulgadasTV !="" && paredes.posterior.pulgadasTV !="--")
                            {
                                let modulo="../assets/modelos3D/TV "+paredes.posterior.pulgadasTV+" PARED.glb";
                                //console.log(((deep/2)-0.10));
                                let jsontmp=[
                                {
                                    "position": {
                                      "x": ((width)*paredes.posterior.despHorizontalTV)-((width)/2),
                                      "y": 1.3,
                                      "z": -((deep/2)-0.07)
                                    },
                                    "rotation": {
                                      "_x": 0,
                                      "_y": 0,
                                      "_z": 0,
                                      "_order": "XYZ"
                                    },
                                    "type": "Group",
                                    "type1": "gltf",
                                    "file1": modulo,
                                    "drag": 0,
                                    "name":"tvposterior",
                                    "data1":paredes.posterior.pulgadasTV
                                  }
                                ];
                                if(reg==true)acciones[acciones.length-1].event.valor.posterior.televisor=!paredes.posterior.televisor;
                                //setTimeout(function(){crearObjetos(jsontmp,reg)},10);
                                crearObjetos(jsontmp,reg);
                            }
                        }



                    }
                    else
                    {

                      //console.log("TV BORRADO");
                      if(typeof tvpos !== "undefined")
                      {

                        //objStand.stand.bastidores.valor.posterior.televisor=false;

                        paredes.posterior.televisor=false;

                        tvpos.visible=false;
                        borrarTV(tvpos,objects,scene,controlsT,acciones,reg);
                        //console.log("TV BORRADO",acciones[acciones.length-1].event);
                        if(reg==true)acciones[acciones.length-1].event.valor.posterior.televisor=!paredes.posterior.televisor;
                        //  objectClicked = tvpos;

                      }

                     }
                    }

                    //----- TV Izquierda ------
                    let tvizq=scene.getObjectByName("tvizquierda",true);


                    if(typeof paredes.izquierda !=="undefined")
                    {

                     if(paredes.izquierda.televisor==true )
                      {

                        if(typeof tvizq !== "undefined")
                        {
                            if(paredes.izquierda.pulgadasTV!=tvizq.data1 )
                            {
                                tvizq.visible=false;
                                borrarTV(tvizq,objects,scene,controlsT,acciones,reg);
                                //scene.remove(tvpos);
                                if(paredes.izquierda.pulgadasTV !="" && paredes.izquierda.pulgadasTV !="--")
                                {

                                    let modulo="../assets/modelos3D/TV "+paredes.izquierda.pulgadasTV+" PARED.glb";
                                    let jsontmp=[
                                    {
                                        "position": {
                                          "x": -(width/2)+.07,
                                          "y": 1.3,
                                          "z": 0
                                        },
                                        "rotation": {
                                          "_x": 0,
                                          "_y": Math.PI / 2,
                                          "_z": 0,
                                          "_order": "XYZ"
                                        },
                                        "type": "Group",
                                        "type1": "gltf",
                                        "file1": modulo,
                                        "drag": 0,
                                        "name":"tvizquierda",
                                        "data1":paredes.izquierda.pulgadasTV
                                      }
                                    ];
                                    crearObjetos(jsontmp,reg);

                                  }


                          }else {
                                let z=((deep)*paredes.izquierda.despHorizontalTV)-((deep)/2);
                                let ancho=1.4;//tv 50
                                if(z>((deep-ancho)/2))
                                    z=(deep-ancho)/2;
                                else if(z<-((deep-ancho)/2))
                                    z=-(deep-ancho)/2;
                                tvizq.position.z=z*-1;

                                //console.log("ajuste tvizq",tvizq.position);
                            }
                        } else {
                          if(paredes.izquierda.pulgadasTV !="" && paredes.izquierda.pulgadasTV !="--")
                          {
                            let modulo="../assets/modelos3D/TV "+paredes.izquierda.pulgadasTV+" PARED.glb";
                            let jsontmp=[
                            {
                                "position": {
                                  "x": -(width/2)+.07,
                                  "y": 1.3,
                                  "z": 0
                                },
                                "rotation": {
                                  "_x": 0,
                                  "_y": Math.PI / 2,
                                  "_z": 0,
                                  "_order": "XYZ"
                                },
                                "type": "Group",
                                "type1": "gltf",
                                "file1": modulo,
                                "drag": 0,
                                "name":"tvizquierda",
                                "data1":paredes.izquierda.pulgadasTV
                              }
                            ];
                            //if(reg==true)acciones[acciones.length-1].event.valor.izquierda.televisor=!paredes.izquierda.televisor;
                            //setTimeout(function(){crearObjetos(jsontmp,reg)},20);
                            crearObjetos(jsontmp,reg);
                          }
                        }

                        }
                        else
                        {
                            if(typeof tvizq !== "undefined")
                            {
                              paredes.izquierda.televisor=false;
                              tvizq.visible=false;
                              borrarTV(tvizq,objects,scene,controlsT,acciones,reg);

                              //if(reg==true)acciones[acciones.length-1].event.valor.izquierda.televisor=!paredes.izquierda.televisor;

                                //objStand.stand.bastidores.valor.izquierda.televisor=false;




                            }


                        }
                      }
                    //----- TV derecha ------
                    //if(typeof paredes.derecha!="undefined")
                    //{
                    let tvder=scene.getObjectByName("tvderecha",true);

                    if(typeof paredes.derecha!=="undefined")
                    {

                     if(paredes.derecha.televisor==true )
                     {
                        if(typeof tvder !== "undefined")
                        {
                            if(paredes.derecha.pulgadasTV!=tvder.data1 )
                            {
                                tvder.visible=false;
                                borrarTV(tvder,objects,scene,controlsT,acciones,reg);
                                //scene.remove(tvpos);


                              if(paredes.derecha.pulgadasTV !="" && paredes.derecha.pulgadasTV !="--")
                              {
                                //let modulo="../assets/modelos3D/GLFT TV 50 PARED.gltf"
                                let modulo="../assets/modelos3D/TV "+paredes.derecha.pulgadasTV+" PARED.glb";

                                let jsontmp=[
                                {
                                    "position": {
                                      "x": (width/2)-.07,
                                      "y": 1.3,
                                      "z": 0
                                    },
                                    "rotation": {
                                      "_x": 0,
                                      "_y": -Math.PI / 2,
                                      "_z": 0,
                                      "_order": "XYZ"
                                    },
                                    "type": "Group",
                                    "type1": "gltf",
                                    "file1": modulo,
                                    "drag": 0,
                                    "name":"tvderecha",
                                    "data1":paredes.derecha.pulgadasTV
                                  }
                                ];
                                crearObjetos(jsontmp,reg);
                              }
                              }else {
                                    let z=((deep)*paredes.derecha.despHorizontalTV)-((deep)/2);

                                    let ancho=1.4;//tv 50
                                      if(z>((deep-ancho)/2))
                                      z=(deep-ancho)/2;
                                      else if(z<-((deep-ancho)/2))
                                      z=-(deep-ancho)/2;
                                    tvder.position.z=z;

                                    //console.log("ajuste tvder",tvder.position);
                                }
                              } else {
                                if(paredes.derecha.pulgadasTV !="" && paredes.derecha.pulgadasTV !="--")
                                {
                                  //let modulo="../assets/modelos3D/GLFT TV 50 PARED.gltf"
                                  let modulo="../assets/modelos3D/TV "+paredes.derecha.pulgadasTV+" PARED.glb";

                                  let jsontmp=[
                                  {
                                      "position": {
                                        "x": (width/2)-.07,
                                        "y": 1.3,
                                        "z": 0
                                      },
                                      "rotation": {
                                        "_x": 0,
                                        "_y": -Math.PI / 2,
                                        "_z": 0,
                                        "_order": "XYZ"
                                      },
                                      "type": "Group",
                                      "type1": "gltf",
                                      "file1": modulo,
                                      "drag": 0,
                                      "name":"tvderecha",
                                      "data1":paredes.derecha.pulgadasTV
                                    }
                                  ];
                                  //if(reg==true)acciones[acciones.length-1].event.valor.derecha.televisor=!paredes.derecha.televisor;
                                  crearObjetos(jsontmp,reg);
                                  //setTimeout(function(){crearObjetos(jsontmp,reg)},20);
                                }
                            }


                        }
                        else
                        {
                            if(typeof tvder !== "undefined")
                            {

                                //objStand.stand.bastidores.valor.derecha.televisor=false;
                                paredes.derecha.televisor=false;
                                tvder.visible=false;
                                borrarTV(tvder,objects,scene,controlsT,acciones,reg);
                                //if(reg==true)acciones[acciones.length-1].event.valor.derecha.televisor=!paredes.derecha.televisor;

                            }

                          }
                      }

                    //----- Fin TV -------
                    //------ Inicio paredes ------
              
                    if(typeof paredes.posterior!="undefined")
                    {
                      cantLamparasTra = event.valor.posterior.cantidadLamparas;

                        if(paredes.posterior.hasOwnProperty('material'))
                        {
                            paredtrasera.children[0].material=paredes.posterior.material;

                        }
                        else if(paredes.posterior.imagen!="")
                        {

                            event.valor.posterior.material=paredtrasera.children[0].material;
                            loadImageTexture(paredtrasera.children[0],paredes.posterior.imagen,paredes.posterior.despHorizontal,paredes.posterior.despVertical,paredes.posterior.zoom);

                        }

                        paredtrasera.children[0].visible=paredes.posterior.grafico;
                        paredtrasera.children[1].visible=paredes.posterior.grafico;
                        
                        if(typeof crearLamparas!="undefined"&&typeof cantLamparasTra!="undefined")
                        { 
                          if(cantLamparasTra>=0)crearLamparas(scene,paredtrasera,objStand.stand.height.valor,objStand.stand.width.valor ,cantLamparasTra);
                        }
                      

                    }


                    if(typeof paredes.izquierda!="undefined")
                    {
                      cantLamparasIzq = event.valor.izquierda.cantidadLamparas;

                        if(paredes.izquierda.hasOwnProperty('material'))
                        {
                            paredizq.children[0].material=paredes.izquierda.material;
                        }
                        else if(paredes.izquierda.imagen!="")
                        {
                            event.valor.izquierda.material=paredizq.children[0].material;
                            loadImageTexture(paredizq.children[0],paredes.izquierda.imagen,paredes.izquierda.despHorizontal,paredes.izquierda.despVertical,paredes.izquierda.zoom);
                        }


                        paredizq.children[0].visible=paredes.izquierda.grafico;
                        paredizq.children[1].visible=paredes.izquierda.grafico;

                        if(typeof crearLamparas!="undefined"&&typeof cantLamparasIzq!="undefined")
                        { 
                          if(cantLamparasIzq>=0)crearLamparas(scene,paredizq,objStand.stand.height.valor, objStand.stand.deep.valor,cantLamparasIzq);
                        }

                        
                    }

                    if(typeof paredes.derecha!="undefined")
                    {
                      cantLamparasDer = event.valor.derecha.cantidadLamparas;

                        if(paredes.derecha.hasOwnProperty('material'))
                        {
                            paredder.children[0].material=paredes.derecha.material;
                        }
                        else if(paredes.derecha.imagen!="")
                        {
                            event.valor.derecha.material=paredder.children[0].material;
                            loadImageTexture(paredder.children[0],paredes.derecha.imagen,paredes.derecha.despHorizontal,paredes.derecha.despVertical,paredes.derecha.zoom);
                        }
                
                        paredder.children[0].visible=paredes.derecha.grafico;
                        paredder.children[1].visible=paredes.derecha.grafico;

                        if(typeof crearLamparas!="undefined"&&typeof cantLamparasDer!="undefined")
                        { 
                          if(cantLamparasDer>=0)crearLamparas(scene,paredder,objStand.stand.height.valor, objStand.stand.deep.valor,cantLamparasDer);
                        }

                        
                    }


                    if(typeof objStand.stand.bastidores.valor.posterior!="undefined")
                    {
                        if(typeof objStand.stand.bastidores.valor.posterior.material!="undefined")
                            delete objStand.stand.bastidores.valor.posterior.material;
                    }

                    if(typeof objStand.stand.bastidores.valor.izquierda!="undefined")
                    {
                        if(typeof objStand.stand.bastidores.valor.izquierda.material!="undefined")
                            delete objStand.stand.bastidores.valor.izquierda.material;
                    }

                    if(typeof objStand.stand.bastidores.valor.derecha!="undefined")
                    {
                        if(typeof objStand.stand.bastidores.valor.derecha.material!="undefined")
                            delete objStand.stand.bastidores.valor.derecha.material;
                    }

                    //------ Fin paredes ------


                }
            }
            else
            {
                //console.log("Stand Change 001",deep,width);
                let widthnew=width;
                let deepnew=deep;
                let heightnew=height;

                //acciones[acciones.length-1].event.valor=!event.valor;
                let val;
                if(event.propiedad=="ancho")
                {
                    objStand.stand.width=event;
                    widthnew=event.valor;
                    val=width;
                }
                if(event.propiedad=="profundo")
                {
                    objStand.stand.deep=event;
                    deepnew=event.valor;
                    val=deep;
                }
                if(event.propiedad=="altura")
                {
                    objStand.stand.height=event;
                    heightnew=event.valor;
                    val=height;
                }

           
                //console.log("height",objStand.stand.height.valor);
                redimensionarStand(widthnew,heightnew,deepnew);


            }
        }
        else if(event.componente=="modulo") // detalle - modulos
        {



            let modeloViejo="";
            let obj=scene.getObjectByProperty ( "name", event.uuid );

            if(typeof obj ==="undefined")
            {

                obj=scene.getObjectByProperty ( "uuid", event.uuid );

            }

            if(typeof obj !=="undefined")modeloViejo=obj.file1;


            if(event.pared=="general")
            {


              //console.log(event.valor.modelo,modeloViejo,actualizandoModulo);

              if(event.valor.modelo!=modeloViejo&&!actualizandoModulo)
              {

                actualizandoModulo = true;
                obj=null;
                let objChange;

                objChange = scene.getObjectByProperty ( "name", event.uuid );
                if(typeof objChange ==="undefined")objChange = scene.getObjectByProperty ( "uuid", event.uuid );


                let modulo=event.valor.modelo;

                //console.log("data2 General",event,objChange);

                objChange.data2.actualizacion=true;

                objChange.data2.general.valor=JSON.parse(JSON.stringify(event.valor));
                //objChange.data2.general=JSON.parse(JSON.stringify(event.valor));



                let jsontmp=[
                {
                    "position": {
                      "x": objChange.position.x,
                      "y": objChange.position.y,
                      "z": objChange.position.z
                    },
                    "rotation": {
                      "_x": objChange.rotation._x,
                      "_y": objChange.rotation._y,
                      "_z": objChange.rotation._z,
                      "_order": "XYZ"
                    },
                    "type": "Group",
                    //"type1": "gltf",
                    "type1": "Group",
                    //"type2": "modulo",
                    "file1": modulo,
                    "drag": 1,
                    "name":event.uuid,
                    "data1":JSON.parse(JSON.stringify(objChange.data1)),
                    "data2":JSON.parse(JSON.stringify(objChange.data2))//{"general":event.valor,"frente":"","derecha":"","izquierda":""}//
                }];

                  document.getElementById("menu").style.display = "none";


                  if(objChange!=null)accionBorrar(objChange,false);


                objChange=null;

                //regMod=reg;
                //if(objChange.data2.modeloCargado<2)regMod=false;

                objChange=crearObjetos(jsontmp,false);//,null,transform

                // la variable acionAtras me sirve para que no se generen dos acciones repetidas de boton atras al usar la funcion
                // callAngularFunction ya que este devuelve info del modulo si le llega diferente.
                if(!reg){
                  objChange.data2.accionAtras=true;

                  callAngularFunction({"uuid":objChange.name,"enable":true,"data":objChange.data1,"data2":objChange.data2});
                   }



                //console.log("Nuevo MODELO",acciones);
                //
              let cargaModulos = setInterval(function () {

                    if(cargoModulo())
                    {

                      //if(typeof objChange.data2.izquierda != "undefined")
                      if(objChange.data2.frente != "")
                      {
                        event = objChange.data2.frente;
                        ponerPropiedadesModulos(objChange,reg,event,0);
                      }
                      if(objChange.data2.izquierda != "")
                      {
                        event = objChange.data2.izquierda;
                        ponerPropiedadesModulos(objChange,reg,event,0);
                      }
                      if(objChange.data2.derecha != "")
                      {
                        event = objChange.data2.derecha;
                        ponerPropiedadesModulos(objChange,reg,event,0);
                      }
                      if(objChange.data2.posterior != "")
                      {
                        event = objChange.data2.posterior;
                        ponerPropiedadesModulos(objChange,reg,event,0);
                      }


                      //if(!reg)callAngularFunction({"uuid":objChange.name,"enable":true,"data":objChange.data1,"data2":objChange.data2});

                      clearInterval(cargaModulos);
                      actualizarControlesPos();
                      setTimeout(function(){
                        cargoModuloEscena = false;
                        actualizandoModulo = false;
                        if(conteoModulos>0)actualizarNuevoModulo();
                      },100)




                    }
                }, 1000);

                  //dragControl.setObjects(objects1);


                } else {

                  obj.data2.general.valor=JSON.parse(JSON.stringify(event.valor));
                  if(obj.data2.rePintar);
                      {
                        obj.data2.rePintar=false;

                        if(obj.data2.frente != "")
                        {
                          event = obj.data2.frente;
                          ponerPropiedadesModulos(obj,reg,event,0);
                        }
                        if(obj.data2.izquierda != "")
                        {
                          event = obj.data2.izquierda;
                          ponerPropiedadesModulos(obj,reg,event,0);
                        }
                        if(obj.data2.derecha != "")
                        {
                          event = obj.data2.derecha;
                          ponerPropiedadesModulos(obj,reg,event,0);
                        }
                        if(obj.data2.posterior != "")
                        {
                          event = obj.data2.posterior;
                          ponerPropiedadesModulos(obj,reg,event,0);
                        }
                      }

                     // console.log("graficoGeneralOffMod",graficoGeneralOffMod);
                      if(graficoGeneralOffMod)graficoGeneralOffMod=false;
                      if(!reg){
                        obj.data2.accionAtras=true;
                        callAngularFunction({"uuid":obj.name,"enable":true,"data":obj.data1,"data2":obj.data2});
                         }
                  }

            }
            else
            {

              //console.log("MODELO Actual",event,obj);
              ponerPropiedadesModulos(obj,reg,event,0);
              if(!reg){
                obj.data2.accionAtras=true;
                callAngularFunction({"uuid":obj.name,"enable":true,"data":obj.data1,"data2":obj.data2});
                 }




            }

            if(event.propiedad=="propiedadesModulo")
            {

              ponerPropiedadesModulos(obj,reg,event,0);

              if(!reg){
                obj.data2.accionAtras=true;
                callAngularFunction({"uuid":obj.name,"enable":true,"data":obj.data1,"data2":obj.data2});
                 }

            }

            //

        }
        else if(event.componente=="muebles") // detalle - Se manejan counter
        {

            let objCounter=scene.getObjectByProperty ( "uuid", event.uuid )


            if(typeof objCounter ==="undefined")
            {
              objCounter=scene.getObjectByProperty ( "name", event.uuid );

              //objCounter=objCounter.parent.parent;
            }

            //console.log("COUNTER 30",objCounter,event);

            if(typeof objCounter !=="undefined")
            {
              if(event.propiedad=="counter")
              {


                  objCounter.data2.frente={"componente":"counter","propiedad": "frente","uuid":objCounter.uuid,"valor": {
                      "grafico": true,
                      "imagen": event.valor.imagen,
                      "despHorizontal": event.valor.despHorizontal,
                      "despVertical": event.valor.despVertical,
                      "zoom": event.valor.zoom,
                  }}



                 pintarCounterBrand(objCounter.getObjectByName("BRANDEABLE"),event);

              }

            }
        }
        //console.log(tiempoObjeto);
          if(!esPrimeraCarga)setTimeout(function(){
            enviarElementosStandFunction(getObjectsStand(esPrimeraCarga))
          },tiempoObjeto);


            //console.log("envio de elementos",esPrimeraCarga);



    }

    function ponerPropiedadesModulos(obj,reg,event,tiempoCarga)
    {

      //console.log("LOAD MOD",obj,event);

      obj.data2[event.pared]=event;

      setTimeout(function(){



          let lado=event.pared;
          var paredSelect;

          switch(lado)
          {
              case "frente":

                  paredSelect="FRENTE";//0
                  break;
              case "derecha":

                  paredSelect="DERECHA";
                  break;
              case "posterior":

                  paredSelect="POSTERIOR";
                  break;
              case "izquierda":

                  paredSelect="IZQUIERDA";
                  break;
          }

          let objtmp1=obj.children[0].children.find(element => element.name  == paredSelect);

          //Esto es para buscar la pared con puerta y así ajust los TVs que estan en la pared perpendicular
          let objIzq=obj.children[0].children.find(element => element.name  == "IZQUIERDA");
          let objPost=obj.children[0].children.find(element => element.name  == "POSTERIOR");
          let objDer=obj.children[0].children.find(element => element.name  == "DERECHA");
          let objFrente=obj.children[0].children.find(element => element.name  == "FRENTE");

          //obj.children[0].children[i];
          var target = new THREE.Vector3();
          obj.children[0].children[0].getWorldPosition(target);

          target = new THREE.Vector3();
          obj.getWorldPosition(target);


          if(typeof event.valor !== "undefined")
          {

            if(event.valor.grafico==true)
            {
                if(event.valor.hasOwnProperty('material'))
                {
                    if(event.material!="undefined")
                    {
                        objtmp1.children[0].material=event.material;
                    }
                }
                else if(event.valor.imagen!="")
                {
                  //console.log("MOMO",objtmp1);
                    loadImageTexture( objtmp1.children[1] , event.valor.imagen ,event.valor.despHorizontal ,event.valor.despVertical , event.valor.zoom);
                }
            }else if(!event.valor.grafico)
              {
                    event.valor.imagen = "../assets/imagenes/PANELERIA/BLANCO.png";
                    loadImageTexture(objtmp1.children[1] , event.valor.imagen ,event.valor.despHorizontal ,event.valor.despVertical , event.valor.zoom);
               }



            if(event.valor.televisor==true)
            {
                let objtv=scene.getObjectByName ( "tv_"+lado+"_"+obj.name );

                var _box = new THREE.Box3();
                _box.setFromObject(obj);
                //console.log(_box);

                if(typeof objtv === "undefined")
                {

                  crearTV(obj,reg,_box,objtv,lado,event,target,objtmp1);


                  }else if(event.valor.pulgadasTV!=objtv.data1 )
                  {
                      //console.log("creo doble");
                      objtv.visible=false;
                      borrarTV(objtv,objects,scene,controlsT,acciones,reg);
                      crearTV(obj,reg,_box,objtv,lado,event,target,objtmp1);

                  }
                  else
                  {
                    if(lado=="derecha")
                    {
                        let deepModulo=obj.userData.getDimensiones()[1]*2;

                        if(objFrente.children.length>=3||objPost.children.length>=3)deepModulo-=.4;

                        let z=((deepModulo)*event.valor.despHorizontalTV)-((deepModulo)/2);
                        let anchoTV=objtv.userData.getDimensiones()[1]*2;
                        if(z>((deepModulo-anchoTV)/2))
                            z=(deepModulo-anchoTV)/2;
                        else if(z<-((deepModulo-anchoTV)/2))
                            z=-(deepModulo-anchoTV)/2;

                        if(objFrente.children.length>=3)z+=.2;
                        else if(objPost.children.length>=3)z-=.2;

                        objtv.position.z=-z;


                    }else if(lado=="frente"){

                       let widthModulo=obj.userData.getDimensiones()[0]*2;
                       if(objIzq.children.length>=3||objDer.children.length>=3)widthModulo-=.2;


                        let x=((widthModulo)*event.valor.despHorizontalTV)-((widthModulo)/2);
                        let anchoTV=objtv.userData.getDimensiones()[0]*2;

                        if(x>((widthModulo-anchoTV)/2))
                            x=(widthModulo-anchoTV)/2;
                        else if(x<-((widthModulo-anchoTV)/2))
                            x=-(widthModulo-anchoTV)/2;

                        if(objIzq.children.length>=3||objDer.children.length>=3)x-=.1;
                        objtv.position.x=x;

                    }else if(lado=="izquierda"){

                        let deepModulo=obj.userData.getDimensiones()[1]*2;

                        if(objFrente.children.length>=3||objPost.children.length>=3)deepModulo-=.4;

                        let z=((deepModulo)*event.valor.despHorizontalTV)-((deepModulo)/2);
                        let anchoTV=objtv.userData.getDimensiones()[1]*2;
                        if(z>((deepModulo-anchoTV)/2))
                            z=(deepModulo-anchoTV)/2;
                        else if(z<-((deepModulo-anchoTV)/2))
                            z=-(deepModulo-anchoTV)/2;

                        if(objFrente.children.length>=3)z-=.2;
                        else if(objPost.children.length>=3)z+=.2;
                        objtv.position.z=z;

                    } else if(lado=="posterior"){

                      let widthModulo=obj.userData.getDimensiones()[0]*2;

                       if(objIzq.children.length>=3||objDer.children.length>=3)widthModulo-=.2;

                      let x=-(((widthModulo)*event.valor.despHorizontalTV)-((widthModulo)/2));
                      let anchoTV=objtv.userData.getDimensiones()[0]*2;
                      if(x>((widthModulo-anchoTV)/2))
                          x=(widthModulo-anchoTV)/2;
                      else if(x<-((widthModulo-anchoTV)/2))
                          x=-(widthModulo-anchoTV)/2;


                      if(objIzq.children.length>=3||objDer.children.length>=3)x-=.1;
                      objtv.position.x=x;


                    }
                }
            }

          else
          {
              let objtv=scene.getObjectByName ( "tv_"+lado+"_"+obj.name );
              if( typeof objtv !=="undefined"){
                  //console.log("Borro TV");
                  objtv.visible=false;
                  borrarTV(objtv,objects,scene,controlsT,acciones,reg);//objtv.removeFromParent();

                }
             }
          }

          //if(!reg&&obj!=null)callAngularFunction({"uuid":obj.name,"enable":true,"data":obj.data1,"data2":obj.data2});

      }, tiempoCarga);

      delete obj.data2[event.pared].material;

    }


    function crearTV (obj,reg,_box,objtv,lado,event,target,objPared)
    {
      let modulo="../assets/modelos3D/TV "+event.valor.pulgadasTV+" PARED.glb";
      //console.log(modulo);
      //console.log(target,_box,_box.max.x-_box.min.x,(_box.max.z-_box.min.z)/2);
      let pos={},rot={};
      if(lado=="derecha")
      {


          pos.x=(_box.max.x-_box.min.x)/2;
          pos.y=1.5;
          pos.z=0;

          rot._x=0;
          rot._y=Math.PI / 2;
          rot._z=0;

          if(objPared.children.length>=3)pos.x-=.2;

      }else if(lado=="frente"){


          pos.x=0;
          pos.y=1.5;
          pos.z=(_box.max.z-_box.min.z)/2;

          rot._x=0;
          rot._y=0;
          rot._z=0;
          //console.log(objPared);
          if(objPared.children.length>=3)pos.z-=.3;//pos.z-=objPared.children[1].position.z;//


      }else if(lado=="izquierda"){

          pos.x=-(_box.max.x-_box.min.x)/2;
          pos.y=1.5;
          pos.z=0;

          rot._x=0;
          rot._y=-Math.PI / 2;
          rot._z=0;

          if(objPared.children.length>=3)pos.x+=.2;
      }else if(lado=="posterior"){

        pos.x=0;
        pos.y=1.5;
        pos.z=-(_box.max.z-_box.min.z)/2;

        rot._x=0;
        rot._y=Math.PI;
        rot._z=0;

        if(objPared.children.length>=3)pos.z+=.3;
      }

      let jsontmp=[
      {
          "position": pos,
          "rotation": rot,
          "type": "Group",
          "type1": "gltf",
          "file1": modulo,
          "drag": 0,
          "name":"tv_"+lado+"_"+obj.name,
          "data1":event.valor.pulgadasTV,
          "padre":obj.name
        }
      ];

      //console.log("TV Nombre", jsontmp);
      crearObjetos(jsontmp,reg,obj);
    }

    function borrarObjetos()//detalle - se borran los elementos (mobiliario) y se reinician los de los mismos
    {

        let tv=scene.getObjectByName("tvposterior",true);
        if(typeof tv !=="undefined")
        {
          if(typeof objStand.stand.bastidores!="undefined")objStand.stand.bastidores.valor.posterior.televisor=false;
            //tv.visible=false;
            tv.removeFromParent();
              //console.log("BTTV",tv);
            //tv.removeFromParent();
            scene.remove(tv);
        }

        tv=scene.getObjectByName("tvderecha",true);
        if(typeof tv !=="undefined"){

            if(typeof objStand.stand.bastidores!="undefined")objStand.stand.bastidores.valor.derecha.televisor=false;
            //tv.visible=false;
            tv.removeFromParent();
//                        console.log(tv);
            //tv.removeFromParent();
            scene.remove(tv);
        }

        tv=scene.getObjectByName("tvizquierda",true);
        if(typeof tv !=="undefined"){

          if(typeof objStand.stand.bastidores!="undefined")objStand.stand.bastidores.valor.izquierda.televisor=false;
            //tv.visible=false;
            tv.removeFromParent();
//                        console.log(tv);
            //tv.removeFromParent();
            scene.remove(tv);
        }
        objectsAtras=[];
        for(let c=0;c<objects.length;c++)
        {

            //objects[c].visible=false;
            //objects[c].parent.visible=false;
            scene.remove( controlsT[c] );
            scene.remove( objects[c] );

            objectsAtras.push(objects[c]);
            //controlsT[c].removeFromParent ();
            //objects[c].removeFromParent();
        }

        //if(typeof objStand.stand.paneleria!=="undefined")delete objStand.stand.paneleria;
        wallMat=null;

        acciones.push({"accion":"borrarObjetos","objetos":objectsAtras});


        objects=[],objects1=[],controlsT=[],objectsExport=[];



        TransformControlspos=-1;

        //groupPaneleriaPared.remove(...groupPaneleriaPared.children);
        render();
    }

    function crearObjetoInvisible()
    {
      crearObjetos([{
          "position": {
            "x": -15,
            "y": 15,
            "z": -15
          },
          "rotation": {
              "_x": 0,
              "_y": 0.7853981633974483,
              "_z": 0,
              "_order": "XYZ"
          },
          "type1": "Group",
          "file1": "https://atmos.pressstartevolution.com/admin/uploads/photo/GLTF_SILLA_TIPO_HUEVO_BLANCA1.gltf",
          "drag": 1,
          "visible":false,
          "data1": {
              "id": "14",
              "id_categoria": "1",
              "nombre": [
                  "SILLA TIPO HUEVO BLANCA",
                  "WHITE EGG TYPE CHAIR"
              ],
              "render": "https://atmos.pressstartevolution.com/admin/uploads/photo/SILLA-TIPO-HUEVO.png",
              "descripcion": [
                  "Descripción Silla Tipo Huevo Blanca",
                  "White Egg Type Chair Description"
              ],
              "precio_mueble_cop": "100000",
              "precio_mueble_usd": "25",
              "modelo": "https://atmos.pressstartevolution.com/admin/uploads/photo/GLTF_SILLA_TIPO_HUEVO_BLANCA1.gltf",
              "textura": "https://atmos.pressstartevolution.com/admin/uploads/photo/QUINTUPLEX1.jpg",
              "dimensiones": "50 x 50",
              "tipo": "muebles"
          }
      }],false);
    }

    window.controlChanged = function(event)
    {
          //console.log("EMPIEZA Evento",event);
          //detalle - se captura la información enviada desde el 2D (ventana)
        if(event.componente=="general")
        {
          if(event.propiedad=="standsBase")//detalle - llegan del admin los stands base
            {


             
         let jsonVariables = ['jsonEsqDer', 'jsonEsqIzq', 'jsonPunta', 'jsonMedianero', 'jsonIsla'];
          let cleanedJsons = {};
          
          for (let i = 0; i < jsonVariables.length; i++) {
              let json_string = event.valor[i].contenido;
              let cleaned_json_string = json_string;
              cleanedJsons[jsonVariables[i]] = cleaned_json_string;
          }
          
         
          jsonEsqDer = cleanedJsons.jsonEsqDer;
          jsonEsqIzq = cleanedJsons.jsonEsqIzq;
          jsonPunta = cleanedJsons.jsonPunta;
          jsonMedianero = cleanedJsons.jsonMedianero;
          jsonIsla = cleanedJsons.jsonIsla;
            
      
            }else if(event.propiedad=="borrarTodo")//detalle - se inicia la borrar desde el botón en la parte izquierda de la interfaz
            {

                if(event.valor==true)
                {
                  vieneAtras=false;
                  borrarObjetos();


                    crearObjetoInvisible();
                    dragControl.setObjects(objects1);


                enviarElementosStandFunction(getObjectsStand());

               }
            }
            else if(event.propiedad=="devolverPaso")
            {
              //console.log("acciones",acciones);

              if(acciones.length>0)
              {


                let accionTemp=JSON.parse(JSON.stringify(acciones));
                //console.log("propiedad",accionTemp);

                  if(acciones[acciones.length-1].accion=="borrarObjetos")
                  {
                    //console.log(acciones[acciones.length-1].objetos);
                    crearObjetos(acciones[acciones.length-1].objetos,false);

                    //if(obj.data1.tipo=="modulos")
                    acciones.splice(acciones.length-1, 1);


                  }
                  else if(acciones[acciones.length-1].accion=="crearobjeto")
                  {
                        let obj=scene.getObjectByProperty ( "uuid", acciones[acciones.length-1].uuid )



                        if(typeof obj ==="undefined")obj = scene.getObjectByProperty ( "name", acciones[acciones.length-1].uuid );


                        if(obj.data1.tipo=="modulos")callAngularFunction({"uuid":obj.name,"enable":false,"data":obj.data1,"data2":obj.data2});

                        accionBorrar(obj,false);
                        acciones.splice(acciones.length-1, 1);
                    }
                    else if(acciones[acciones.length-1].accion=="borrarobjeto")
                    {
                      //console.log(acciones[acciones.length-1]);
                      if(acciones[acciones.length-1].jsonObj[0].data1.tipo=="modulos")acciones[acciones.length-1].jsonObj[0].data2.rePintar=true;

                      crearObjetos(acciones[acciones.length-1].jsonObj,false);
                      acciones.splice(acciones.length-1, 1);


                    }
                    else if(acciones[acciones.length-1].accion=="change")
                    {



                        if(typeof acciones[acciones.length-1].event!=="undefined")
                        {
                          //console.log("Paso atras change",acciones[acciones.length-1].event);


                          if(acciones[acciones.length-1].event.componente=="modulo"&&acciones.length>5)
                          {

                              if(acciones[acciones.length-5].event.pared=="general"&& acciones[acciones.length-4].event.pared=="frente"&&acciones[acciones.length-3].event.pared=="izquierda"&&acciones[acciones.length-2].event.pared=="derecha"&&acciones[acciones.length-1].event.pared=="posterior")
                              {

                                for(let i=1;i<6;i++)
                                {
                                  //console.log("accion apago grafico modulo ",acciones[acciones.length-1].event);
                                  setTimeout(function(){
                                    graficoGeneralOffMod=true;
                                    changeObj(acciones[acciones.length-1].event,false);
                                    acciones.splice(acciones.length-1, 1);

                                  },0);

                                }

                            }else {
                              changeObj(acciones[acciones.length-1].event,false);
                              acciones.splice(acciones.length-1, 1);
                            }

                          }else {
                          changeObj(acciones[acciones.length-1].event,false);
                          acciones.splice(acciones.length-1, 1);
                          }

                        }



                    }
                    else if(acciones[acciones.length-1].accion=="girarobjeto")
                    {
                        let objtmp=scene.getObjectByProperty("uuid",acciones[acciones.length-1].uuid);
                        objtmp.rotation.y =acciones[acciones.length-1].valor;
                        acciones.splice(acciones.length-1, 1);
                    }
                    else if(acciones[acciones.length-1].accion=="moverobjeto")
                    {
                        let objtmp=scene.getObjectByProperty("uuid",acciones[acciones.length-1].uuid);


                        if(typeof objtmp ==="undefined")objtmp = scene.getObjectByProperty ( "name", acciones[acciones.length-1].uuid );

                        if(typeof objtmp !=="undefined")
                        {
                          objtmp.position.set(acciones[acciones.length-1].valor.x, acciones[acciones.length-1].valor.y, acciones[acciones.length-1].valor.z);

                        }

                        acciones.splice(acciones.length-1, 1);
                    }

                  enviarElementosStandFunction(getObjectsStand());

                } else recargarStand(standBase);

                vieneAtras=true;
            }
            else if(event.propiedad=="tipoStand")//detalle - llega un nuevo tipo de stand base para empezar diseño
            {

                recargarStand(event.valor);

                setTimeout(onWindowResize,50);
            }
            else if(event.propiedad=="tipoStandSeleccionado")
            {

                if(event.resize==true)
                {

                    setTimeout(onWindowResize,50);
                }
            }
            else if(event.propiedad=="tomarFoto")
            {

                let alturaCam = 16 + deep/2;
                let profunCam = 10 + deep/1.5;
                let zoomCam = 1;
                let alturaFoco = 3;
                
                //console.log(objStand.header.frente.activo,objStand.header.posterior.activo);
                if(objStand.header.general.valor==false){
                  zoomCam=1.5;
                  alturaFoco=1;
                }else if(objStand.header.frente.valor.activo==false && objStand.header.posterior.valor.activo==false&&objStand.header.derecha.valor.activo==false&&objStand.header.izquierda.valor.activo==false)
                {
                  //console.log(objStand.header);
                  zoomCam=1.5;
                  alturaFoco=1;
                }
                //zoomCam=1.5;
            
          
                titulosLeng.length=0;
                titulosLeng.push("Vista Frontal","Front View");
                
                let newImage = {
                  "img1": takeScreenshot(0, 3, profunCam, zoomCam, alturaFoco),
                  "titulo": [...titulosLeng],
                  "cantidad": imgsArray.length + 1
                };
                imgsArray.push(newImage);
                
                titulosLeng.length=0;
                titulosLeng.push("Vista Superior","Top View");
                
                newImage = {
                  "img2": takeScreenshot(0, alturaCam, 0, (zoomCam - 0.2),0),
                  "titulo": [...titulosLeng],
                  "cantidad": imgsArray.length + 1
                };
                imgsArray.push(newImage);
                
                titulosLeng.length=0;
                titulosLeng.push("Perspectiva Izquierda","Left Perspective");
                
                newImage = {
                  "img3": takeScreenshot(-13, 2, profunCam, zoomCam, alturaFoco),
                  "titulo": [...titulosLeng],
                  "cantidad": imgsArray.length + 1
                };
                imgsArray.push(newImage);
            //
              titulosLeng.length=0;
              titulosLeng.push("Perspectiva Derecha","Right Perspective");

              newImage = {
                "img4": takeScreenshot(13, 6, profunCam,zoomCam,alturaFoco),
                "titulo": [...titulosLeng],
                "cantidad":imgsArray.length+1
              };
              imgsArray.push(newImage);
          //
            titulosLeng.length=0;
            titulosLeng.push("Imagen 5","Image 5");

            newImage = {
              "img5": takeScreenshot(13, 6, profunCam,zoomCam,alturaFoco),
              "titulo": [...titulosLeng],
              "cantidad":imgsArray.length+1
            };
            imgsArray.push(newImage);
            //
            titulosLeng.length=0;
            titulosLeng.push("Imagen 6","Image 6");

              newImage = {
                "img6": takeScreenshot(13, 6, profunCam,zoomCam,alturaFoco),
                "titulo": [...titulosLeng],
                "cantidad":imgsArray.length+1
              };
              imgsArray.push(newImage);
          //
            
                              
                for (let i = 0; i < imgsArray.length; i++) {
                  imgsArray[i].cantidad=imgsArray.length;
                  enviarImagenesPDFFunction(imgsArray[i]);
              }

              pantallazosTomados = 0;
              imgsArray.length=0;

                camera.position.set(0, 5, 13);
                camera.lookAt(0,0,0);
                tomandoFoto=false;
                camera.zoom=1;
                camera.updateProjectionMatrix();
                renderer.render(scene, camera);
                orbitControl.enabled =true;

            }else if(event.propiedad=="tomarPantallazo"&&pantallazosTomados<limitePantallazos)
            {
              
              pantallazosTomados++;

              const cameraX = camera.position.x;
              const cameraY = camera.position.y;
              const cameraZ = camera.position.z;
              const cameraZoom = camera.zoom;
              
            
              titulosLeng.length=0;
              titulosLeng.push("Captura de pantalla","Screenshot");
              let imgIndex = imgsArray.length+7;
              let newImage = {
                [`img${imgIndex}`]: takeScreenshot(cameraX, cameraY, cameraZ, cameraZoom,0),
                "titulo": [...titulosLeng],
                "cantidad":imgsArray.length+1
              };
              
                   
              cameraFlash();
              
              imgsArray.push(newImage);
                tomandoFoto=false;
                orbitControl.enabled =true;

                
                
              
            }
            else if(event.propiedad=="abrirProyecto")//detalle - se abre nuevo proyecto
            {

                //console.log(event.valor);
                let objTmp=[];
                for(let i=0;i<event.valor.objetos.length;i++)
                {

                  if(event.valor.objetos[i].name.indexOf("tv")>=0)
                  {
                      //console.log(event.valor.objetos[i]);
                      //event.valor.objetos.splice(i, 1);
                  }else objTmp.push(event.valor.objetos[i]);

                }
                event.valor.objetos=[];
                event.valor.objetos=objTmp;
                borrarObjetos();
                cargarStandJson(event.valor);
                setTimeout(onWindowResize,50);
            }
        }
        else
        {
          console.log("Nuevo Evento menu derecho",event);
          vieneAtras=false;
          if(event.componente=="header")
          {
            if(objStand.header.general.valor)
            {
              console.log("Entro",objStand.header,event);
              if(event.propiedad=="frente"&&(objStand.header.frente.valor.activo||event.valor.activo))changeObj(event,true);
              else if(event.propiedad=="posterior"&&(objStand.header.posterior.valor.activo||event.valor.activo))changeObj(event,true);
              else if(event.propiedad=="derecha"&&(objStand.header.derecha.valor.activo||event.valor.activo))changeObj(event,true);
              else if(event.propiedad=="izquierda"&&(objStand.header.izquierda.valor.activo||event.valor.activo))changeObj(event,true);
              else if(event.propiedad=="altoTruss"||event.propiedad=="altoHeader"||event.propiedad=="header")changeObj(event,true);

            }else if(event.propiedad=="header"&&event.valor)changeObj(event,true);

          }else changeObj(event,true);


        }
    }

    

    function recargarStand(tipoStand)
    {
      borrarObjetos();

      let geometry = new THREE.BoxGeometry( 1, 1, 1 );
      let material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      let mesh = new THREE.Mesh( geometry, material );
      mesh.visible=false;
      scene.add( mesh );
      objects1.push(mesh);
      dragControl.setObjects([mesh]);
      objects=[],objects1=[],controlsT=[],objectsExport=[];
      TransformControlspos=-1;
      render();


      standBase = tipoStand;

      if(standBase=="Esquinero Izquierdo")
      {
          //console.log("jsonStandEsqIzq",jsonStandEsqIzq);
          cargarStandJson(jsonEsqIzq,true);
      }
      else if(standBase=="Esquinero Derecho")
      {
//        console.log("jsonStandEsqDer",jsonStandEsqDer);
          cargarStandJson(jsonEsqDer,true);
      }
      else if(standBase=="Medianero")
      {
          //console.log("jsonStandMedianero",jsonStandMedianero);

          
          cargarStandJson(jsonMedianero,true);

      }
      else if(standBase=="Punta")
      {
          //console.log("jsonStandPunta",jsonStandPunta);
          cargarStandJson(jsonPunta,true);
      }
      else if(standBase=="Isla")
      {

          //console.log("jsonStandPunta",jsonStandIsla);

          cargarStandJson(jsonIsla,true);
      }

      //groupPaneleriaPared.remove(...groupPaneleriaPared.children);

    }


  loadDragControl(objects1);
  //Se carga la configucarión del stand inicial una vez el header y stand base estén cargados
    let cargaIniInter = setInterval(function () {
      console.log("jsonMedianero",Object.keys(jsonMedianero).length > 0);
      if (paredder!=null&&bannerder!=null&&Object.keys(jsonMedianero).length > 0) {
        clearInterval(cargaIniInter);
        standBase="Medianero";
        //cargarStandJson(jsonStandMedianero, true);
        cargarStandJson(jsonMedianero, true);
        
      }
    }, 1500);


    window.addEventListener("resize", onWindowResize);
    window.addEventListener( 'mousemove', onMouseMove, false );
}


function cambiarMatVidrio(obj)
{

    if(typeof obj !== "undefined")
    {
        if(obj.hasOwnProperty('material'))
        {
            if(obj.material.name=="VIDRIO" || obj.material.name=="VIDRIO 2")
            {
                if(typeof obj.material.transparent!=="undefined")
                    obj.material.transparent=true;
                if(typeof obj.material.opacity!=="undefined")
                    obj.material.opacity= 0.2;
                if(typeof obj.material.roughness!=="undefined")
                    obj.material.roughness= 0.25;
                if(typeof obj.material.color!=="undefined")
                    obj.material.color={r:247,g:242,b:252};

                return true;
            }
            else if(obj.material.name=="METAL" || obj.material.name=="ALUMINIO")
            {
                if(typeof obj.material.roughness!=="undefined")
                    obj.material.roughness= 0.1;

                if(typeof obj.material.metalness!=="undefined")
                    obj.material.metalness= 0.9;



            }
        }

        for(let i=0 ; i < obj.children.length ; i++)
        {
            cambiarMatVidrio(obj.children[i]);
        }
        return false;
    }
}


function takeScreenshot(x,y,z,zoomCam,alturaFoco) {

    tomandoFoto=true;
    orbitControl.enabled =false;
    camera.position.set(x, y, z);
    camera.zoom=zoomCam;
    camera.lookAt( 0, alturaFoco, 0 );

    camera.updateProjectionMatrix();
   
    
    //camera.fov=50;
    //camera.setFocalLength(50);
    renderer.render(scene, camera);

    //console.log(camera);
    //console.log(renderer.domElement.toDataURL());
    return renderer.domElement.toDataURL();
}
function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);

}




function animate() {


  if(!tomandoFoto)orbitControl.update();

  CubeControl.updateCubePosition();
  render();
  requestAnimationFrame(animate);
}




function render() {
  renderer.render(scene, camera);
}
