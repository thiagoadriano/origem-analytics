/*!
 * Biblioteca Trackeamento Google Analytics v 1.0
 *
 * Desenvolvida por: Thiago Adriano
 * Twitter: @titoadri
 * Copyright 2015 
 *
 * Date: 28/04/2015
 */

var GA = GA || {};

GA.UTM = (function() {   
    var URL = {
        URLFull: window.location,
        HOST: window.location.host,
        PAGE: window.location.pathname,
        PROTOCOL: window.location.protocol,
        PARAMS: window.location.search
    };
    var nextID = undefined;
    var objName = undefined;
    var data = new Date();
    var UTM = {};
    var obj = {};
    var objeto_parse = null ;
    var storage = window.localStorage;
    
    function _observable() {
        if (URL.PARAMS !== "") {
            _splitParams();
            _controlID();
            _save();
        }
    };

    function _isValidparameter(){
        return UTM.source !== undefined && 
                UTM.medium !== undefined && 
                UTM.campaign !== undefined;
    }
    
    function _controlID() {
        if (storage) {
            var nameId = storage.getItem("UTM_ID");
            if (nameId !== null && _isValidparameter()) {
                var parse = JSON.parse(nameId);
                nextID = parseFloat(parse[parse.length - 1].id) + 1;
                objName = "UTM_" + nextID;
                
                var newObj = {
                    "id": nextID,
                    "name": objName
                };
                
                parse.push(newObj);
                
                storage.setItem("UTM_ID", JSON.stringify(parse));
            
            } else {
                if(_isValidparameter()){
                    var arrayObj = [];
                    nextID = 0;
                    objName = "UTM_" + nextID;
                    var obj = {
                        "id": nextID,
                        "name": objName
                    };
                    arrayObj.push(obj);

                    storage.setItem("UTM_ID", JSON.stringify(arrayObj));
                }
            }
        }
    }
    
    function _splitParams() {
        if (URL.PARAMS !== "" && /utm_/g.test(URL.PARAMS)) {
            var parametros = URL.PARAMS.replace("?", "");
            var arrayParametros = (parametros.indexOf("&amp;") > -1 ? parametros.split("&amp;") : parametros.split("&"));
            for (var i = 0; i < arrayParametros.length; i++) {
                var atual = arrayParametros[i];
                if (atual.indexOf("utm_") > -1) {
                    atual = atual.replace(/^utm_/g, "");
                    atual = atual.split("=");
                    atual[1] = decodeURIComponent(atual[1]);
                    UTM[atual[0]] = atual[1];
                }
            }
        
        }
    };
    
    function _save() {
        if ( _isValidparameter() ) {
            obj.id = Date.now();
            obj.data = data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();
            obj.paginaAcesso = URL.PAGE === "/" ? "home" : URL.PAGE.replace(/\//g, " > ").replace(/^( > ){1}/, "").replace(/.(html|php|htm)$/, "");
            obj.UTM = UTM;
            
            storage.setItem(objName, JSON.stringify(obj));
        }
    
    
    };

    
    
    function _getParametros(config, idsForm) {
        var config = config;
        var idsForm = idsForm || null;
        function checkParameters(parameter) {
            if (config === undefined) {
                return false;
            } else {
                if(Array.isArray(config) && config.length > 0){
                    for(var i in config){
                        if(config[i] === parameter){
                            return true;
                        }else{
                            continue;
                        }
                    }
               }    
           }
                
            return false;
        };
        
        try {
            if (storage.UTM_ID) {
                var pAtivos = {
                    source: checkParameters("source"),
                    medium: checkParameters("medium"),
                    term: checkParameters("term"),
                    content: checkParameters("content"),
                    campaign: checkParameters("campaign")
                };
                
                var ids = JSON.parse(storage.getItem("UTM_ID"));
                var templates = "";
                
                for (var i = 0, totalIds = ids.length; i < totalIds; i++) {
                    var objAtual = JSON.parse(storage.getItem(ids[i].name));
                    
                    var obj = {
                        data: objAtual.data,
                        pagina: objAtual.paginaAcesso
                    };
                    
                    if (pAtivos.source)
                        obj.origem = objAtual.UTM.source;
                    if (pAtivos.medium)
                        obj.midia = objAtual.UTM.medium;
                    if (pAtivos.term)
                        obj.termo = objAtual.UTM.term;
                    if (pAtivos.content)
                        obj.conteudo = objAtual.UTM.content;
                    if (pAtivos.campaign)
                        obj.campanha = objAtual.UTM.campaign;
                    
                    var template = "<input type='hidden' name='listUTM[]' value='" + JSON.stringify(obj) + "'>";
                    
                    templates += template;
                }
                
                
                if(Array.isArray(idsForm)){
                    for(var i in idsForm){
                        if (document.querySelector("#" + idsForm[i])) {
                            var form = document.querySelector("#" + idsForm[i]);
                            var content = form.innerHTML;
                            form.innerHTML = templates + content;
                            return;
                        };
                    };
                };
                
            }
        } catch (e) {
            console.error("Não foi iniciado nenhum dado de UTM. \n" + e.error + "\n" + e.message);
        }
    
    };
    
    function clearObject(){        
        if(storage.getItem('UTM_ID')){
            var objsParse = JSON.parse(storage.getItem('UTM_ID'));
            for(var i = 0, totalObj = objsParse.length; i < totalObj; i++){
                storage.removeItem(objsParse[i].name);
            } 
            storage.removeItem('UTM_ID');
        }
    };
    
    return {
        observe: _observable,
        get: _getParametros,
        clear: clearObject
    };

}
)();

GA.UTM.observe();