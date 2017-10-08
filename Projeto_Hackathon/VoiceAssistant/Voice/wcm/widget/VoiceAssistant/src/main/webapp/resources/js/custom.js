WCMAPI.loadJS("/webdesk/vcXMLRPC.js");
WCMAPI.loadJS("https://code.responsivevoice.org/responsivevoice.js");

// Fazemos que o código só funcione apos o carregamento completo da pagina
//window.addEventListener('DOMContentLoaded', function(){
function habilitaMicrofone(){
	var resultado;
	$("#btnVoice").attr("src","/VoiceAssistant/resources/images/mic.gif");
  // Instanciamos o nosso botão
  var btn_gravacao = document.querySelector('#btnVoice');
  // Crio a variavel que amarzenara a transcrição do audio
  var transcricao_audio =  '';
  // Seto o valor false para a variavel esta_gravando para fazermos a validação se iniciou a gravação
  var esta_gravando = false;
  // Verificamos se o navegador tem suporte ao Speech API
  if(window.SpeechRecognition || window.webkitSpeechRecognition){
    // Como não sabemos qual biblioteca usada pelo navegador 
    // Atribuimos a api retornada pelo navegador
    var speech_api = window.SpeechRecognition || window.webkitSpeechRecognition;
     // Criamos um novo objeto com a API Speech
    var recebe_audio = new speech_api();
    // Defino se a gravação sera continua ou não
    // Caso deixamos ela definida como false a gravação tera um tempo estimado 
    // de 4 a 5 segundos
    recebe_audio.continuous = true;
    // Especifico se o resultado final pode ser alterado ou não pela compreenção da api
    recebe_audio.interimResults = true;
    // Especifico o idioma utilizado pelo usuario
    recebe_audio.lang = "pt-BR";
    // uso o metodo onstart para setar a minha variavel esta_gravando como true
    // e modificar o texto do botão
    recebe_audio.onstart = function(){
      esta_gravando = true;
      btn_gravacao.innerHTML = 'Gravando! Parar gravação.';
      resultado = "";
      document.getElementById('texto').value = resultado;
      $("#btnVoice").attr("src","/VoiceAssistant/resources/images/mic-animate.gif");
      var audio = new Audio('https://grupo12.fluig.com/volume/stream/Rmx1aWc=/P3Q9MSZ2b2w9RGVmYXVsdCZpZD0xMSZ2ZXI9MTAwMCZmaWxlPWJlZXAud2F2JmNyYz0xMTU2NzgxODQ3JnNpemU9MC4wNjMyMTMmdUlkPTMmZlNJZD0xJnVTSWQ9MSZkPWZhbHNl.wav');
      audio.play();
    };
     // uso o metodo onend para setar a minha variavel esta_gravando como false
    // e modificar o texto do botão
    recebe_audio.onend = function(){
      esta_gravando = false;
      btn_gravacao.innerHTML = 'Iniciar Gravação';
      processa(resultado);
      $("#btnVoice").attr("src","/VoiceAssistant/resources/images/mic.gif");
      var audio = new Audio('https://grupo12.fluig.com/volume/stream/Rmx1aWc=/P3Q9MSZ2b2w9RGVmYXVsdCZpZD0xMSZ2ZXI9MTAwMCZmaWxlPWJlZXAud2F2JmNyYz0xMTU2NzgxODQ3JnNpemU9MC4wNjMyMTMmdUlkPTMmZlNJZD0xJnVTSWQ9MSZkPWZhbHNl.wav');
      audio.play();
    };


    recebe_audio.onerror = function(event){
      console.log(event.error);
    };
    
    // Com o metodo onresult posso capturar a transcrição do resultado 
    recebe_audio.onresult = function(event){
      // Defino a minha variavel interim_transcript como vazia
      var interim_transcript = '';
      
      // Utilizo o for para contatenar os resultados da transcrição 
      for(var i = event.resultIndex; i < event.results.length; i++){
           // verifico se o parametro isFinal esta setado como true com isso identico se é o final captura
          if(event.results[i].isFinal){
            // Contateno o resultado final da transcrição
            transcricao_audio += event.results[i][0].transcript;
          }else{
            // caso ainda não seja o resultado final vou contatenado os resultados obtidos
            interim_transcript += event.results[i][0].transcript;
          }
          // Verifico qual das variaveis não esta vazia e atribuo ela no variavel resultado
          resultado = transcricao_audio || interim_transcript;
          // Escrevo o resultado no campo da textarea
         document.getElementById('texto').value = resultado;
         console.log("Mensagem informada: " + resultado);     
          
      }
      transcricao_audio = '';

    };
    
    // Capturamos a ação do click no botão e iniciamos a gravação ou a paramos
    // dependendo da variavel de controle esta_gravando
    btn_gravacao.addEventListener('click', function(e){
      // Verifico se esta gravando ou não
      if(esta_gravando){
        // Se estiver gravando mando parar a gravação
        recebe_audio.stop();
        // Dou um retun para sair da função
        return;
      }
      // Caso não esteja capturando o audio inicio a transcrição
      recebe_audio.start();
    }, false);
    
    shortcut.add("f2",function(e){
      // Verifico se esta gravando ou não
      if(esta_gravando){
        // Se estiver gravando mando parar a gravação
        recebe_audio.stop();
        // Dou um retun para sair da função
        return;
      }
      // Caso não esteja capturando o audio inicio a transcrição
      recebe_audio.start();
    });
    
  }else{
    // Caso não o navegador não apresente suporte ao Speech API apresentamos a seguinte mensagem
    console.log('navegador não apresenta suporte a web speech api');

  }
}
//}, false);

function processa(resultado){
	
	//VALIDA DE A STRING COMEÇA COM "INICIAR" PARA BUSCAR OS PROCESSOS
	if(resultado.toUpperCase().indexOf("INICIAR") == 0){
		
		var novoResultado = resultado.toUpperCase().replace("INICIAR ","");
		var cActive = DatasetFactory.createConstraint("active","true","true",ConstraintType.MUST);
		var cProcesso = DatasetFactory.createConstraint("processDescription",novoResultado,novoResultado,ConstraintType.MUST);
		var dsProcesso = DatasetFactory.getDataset("processDefinition",null,[cActive,cProcesso],null);
		console.log(dsProcesso.values);
		
		//BUSCA ID ID PROCESSO ATRAVES DA DESCRICAO INFORMADA
		if (dsProcesso.values.length > 0){
			window.open("https://grupo12.fluig.com/portal/p/1/pageworkflowview?processID="+dsProcesso.values[0]["processDefinitionPK.processId"]);
		}else{
			responsiveVoice.speak("O processo " + novoResultado + " não foi encontrado","Portuguese Female");
		}
	
	//EFETUA BUSCA DO CONTEUDO NO FLUIG
	}else if(resultado.toUpperCase().indexOf("PESQUISAR") == 0){
		var novoResultado = resultado.toUpperCase().replace("PESQUISAR ","");
		window.open("https://grupo12.fluig.com/portal/p/1/searchresult?text=" + escape(novoResultado));
	
	//ABRE A CENTRAL DE TAREFAS
	}else if(resultado.toUpperCase().indexOf("CENTRAL DE TAREFAS") == 0){
		window.open("https://grupo12.fluig.com/portal/p/1/pagecentraltask");

	//ABRE DOCUMENTOS 
	}else if(resultado.toUpperCase().indexOf("DOCUMENTOS") == 0){
		window.open("https://grupo12.fluig.com/portal/p/1/ecmnavigation");
	
	//ABRE PAINEL DE CONTROLE
	}else if(resultado.toUpperCase().indexOf("PAINEL DE CONTROLE") == 0){
		window.open("https://grupo12.fluig.com/portal/p/1/cpaneladmin");

	//VOLTA PARA A HOME
	}else if(resultado.toUpperCase().indexOf("HOME") == 0){
		window.open("https://grupo12.fluig.com/portal/p/1/home");
		
	//EDITAR PERFIL DO USUARIO
	}else if(resultado.toUpperCase().indexOf("EDITAR PERFIL") == 0){
		window.open("https://grupo12.fluig.com/portal/p/1/wcmuserpreferences");
	}
	
	//ABRE COMUNIDADES
	else if(resultado.toUpperCase().indexOf("COMUNIDADES") == 0){
		window.open("https://grupo12.fluig.com/portal/p/1/connections/fluig/all-communities");
	}
	//PALMEIRAS
	else if(resultado.toUpperCase().indexOf("O PALMEIRAS TEM MUNDIAL") >= 0){
		responsiveVoice.speak("Não, o palmeiras não tem mundial!","Portuguese Female");
	}
	
	
	//MENSAGEM PARA RETORNO INVALIDO
	else{
		responsiveVoice.speak("Não entendi seu comando, favor repetir","Portuguese Female");
	}
}

function carregaCabecalho(){
	var htmlText = '<div id="TESTE1" slot="true" class="slotint slot-header-actions">';                                       
	htmlText+='                      <div id="TESTE2" appcode="suggestsearch">'; 
	htmlText+='                                      <div id="TESTE3" class="wcm_widget">';            
	htmlText+='                                                      <div class="wcm_corpo_widget_single">';        
	htmlText+='                                                                     <script type="text/javascript">';             
	htmlText+='                                                                                     document.addEventListener(\'DOMContentLoaded\', function(ev) {'; 
	htmlText+='                                                                                                     $.feedback({';   
	htmlText+='                                                                                                                    ajaxURL: WCMAPI.getContextPath() + "/api/rest/wcm/rest/feedback/postfeedback",';           
	htmlText+='                                                                                                                    onClose: function() {';   
	htmlText+='                                                                                                                                    window.location.reload();';        
	htmlText+='                                                                                                                    }';            
	htmlText+='                                                                                                     });';         
	htmlText+='                                                                                     }, false);';            
	htmlText+='                                                                     </script>';           
	htmlText+='                                                                     <div id="TESTE4" class="fluig-style-guide suggest-search clearfix super-widget" data-params="SearchSuggest.instance({\'openNewTab\': \'false\'})">';              
	htmlText+='                                                                                     <form role="form" data-submit-search="">';
	htmlText+='                                                                                                                                    <div class="media">';
	htmlText+='                                                                                                                                                    <img class="media-object fs-cursor-pointer" id="btnVoice" width="40" height="40" >';
	htmlText+='                                                                                                                                    </div>  ';
	htmlText+='                                                                                                     <div class="input-group">';        
	htmlText+='                                                                                                     </div>';                
	htmlText+='                                                                                     </form>';            
	htmlText+='                                                                                     <script type="text/template" class="suggest-search-see-all-template">';      
	htmlText+='                                                                                                     <li class="see-all-results">';       
	htmlText+='                                                                                                                    <a href="#" onclick="suggestSearch_1456.seeAllResults(this, event);">Ver todos os resultados</a>';         
	htmlText+='                                                                                                     </li>';    
	htmlText+='                                                                                     </script>';           
	htmlText+='                                                                     </div>';                
	htmlText+='                                                      </div>';                
	htmlText+='                                      </div>';                
	htmlText+='                      </div>';                
	htmlText+='       </div> ';
	$( ".header-grouper-right" ).prepend(htmlText);

}

shortcut = {
		'all_shortcuts':{},//All the shortcuts are stored in this array
		'add': function(shortcut_combination,callback,opt) {
			//Provide a set of default options
			var default_options = {
				'type':'keydown',
				'propagate':false,
				'disable_in_input':false,
				'target':document,
				'keycode':false
			}
			if(!opt) opt = default_options;
			else {
				for(var dfo in default_options) {
					if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
				}
			}

			var ele = opt.target
			if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
			var ths = this;
			shortcut_combination = shortcut_combination.toLowerCase();

			//The function to be called at keypress
			var func = function(e) {
				e = e || window.event;
				
				if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
					var element;
					if(e.target) element=e.target;
					else if(e.srcElement) element=e.srcElement;
					if(element.nodeType==3) element=element.parentNode;

					if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
				}
		
				//Find Which key is pressed
				if (e.keyCode) code = e.keyCode;
				else if (e.which) code = e.which;
				var character = String.fromCharCode(code).toLowerCase();
				
				if(code == 188) character=","; //If the user presses , when the type is onkeydown
				if(code == 190) character="."; //If the user presses , when the type is onkeydown
		
				var keys = shortcut_combination.split("+");
				//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
				var kp = 0;
				
				//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
				var shift_nums = {
					"`":"~",
					"1":"!",
					"2":"@",
					"3":"#",
					"4":"$",
					"5":"%",
					"6":"^",
					"7":"&",
					"8":"*",
					"9":"(",
					"0":")",
					"-":"_",
					"=":"+",
					";":":",
					"'":"\"",
					",":"<",
					".":">",
					"/":"?",
					"\\":"|"
				}
				//Special Keys - and their codes
				var special_keys = {
					'esc':27,
					'escape':27,
					'tab':9,
					'space':32,
					'return':13,
					'enter':13,
					'backspace':8,
		
					'scrolllock':145,
					'scroll_lock':145,
					'scroll':145,
					'capslock':20,
					'caps_lock':20,
					'caps':20,
					'numlock':144,
					'num_lock':144,
					'num':144,
					
					'pause':19,
					'break':19,
					
					'insert':45,
					'home':36,
					'delete':46,
					'end':35,
					
					'pageup':33,
					'page_up':33,
					'pu':33,
		
					'pagedown':34,
					'page_down':34,
					'pd':34,
		
					'left':37,
					'up':38,
					'right':39,
					'down':40,
		
					'f1':112,
					'f2':113,
					'f3':114,
					'f4':115,
					'f5':116,
					'f6':117,
					'f7':118,
					'f8':119,
					'f9':120,
					'f10':121,
					'f11':122,
					'f12':123
				}
		
				var modifiers = { 
					shift: { wanted:false, pressed:false},
					ctrl : { wanted:false, pressed:false},
					alt  : { wanted:false, pressed:false},
					meta : { wanted:false, pressed:false}	//Meta is Mac specific
				};
	                        
				if(e.ctrlKey)	modifiers.ctrl.pressed = true;
				if(e.shiftKey)	modifiers.shift.pressed = true;
				if(e.altKey)	modifiers.alt.pressed = true;
				if(e.metaKey)   modifiers.meta.pressed = true;
	                        
				for(var i=0; k=keys[i],i<keys.length; i++) {
					//Modifiers
					if(k == 'ctrl' || k == 'control') {
						kp++;
						modifiers.ctrl.wanted = true;

					} else if(k == 'shift') {
						kp++;
						modifiers.shift.wanted = true;

					} else if(k == 'alt') {
						kp++;
						modifiers.alt.wanted = true;
					} else if(k == 'meta') {
						kp++;
						modifiers.meta.wanted = true;
					} else if(k.length > 1) { //If it is a special key
						if(special_keys[k] == code) kp++;
						
					} else if(opt['keycode']) {
						if(opt['keycode'] == code) kp++;

					} else { //The special keys did not match
						if(character == k) kp++;
						else {
							if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
								character = shift_nums[character]; 
								if(character == k) kp++;
							}
						}
					}
				}

				if(kp == keys.length && 
							modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
							modifiers.shift.pressed == modifiers.shift.wanted &&
							modifiers.alt.pressed == modifiers.alt.wanted &&
							modifiers.meta.pressed == modifiers.meta.wanted) {
					callback(e);
		
					if(!opt['propagate']) { //Stop the event
						//e.cancelBubble is supported by IE - this will kill the bubbling process.
						e.cancelBubble = true;
						e.returnValue = false;
		
						//e.stopPropagation works in Firefox.
						if (e.stopPropagation) {
							e.stopPropagation();
							e.preventDefault();
						}
						return false;
					}
				}
			}
			this.all_shortcuts[shortcut_combination] = {
				'callback':func, 
				'target':ele, 
				'event': opt['type']
			};
			//Attach the function with the event
			if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
			else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
			else ele['on'+opt['type']] = func;
		},

		//Remove the shortcut - just specify the shortcut and I will remove the binding
		'remove':function(shortcut_combination) {
			shortcut_combination = shortcut_combination.toLowerCase();
			var binding = this.all_shortcuts[shortcut_combination];
			delete(this.all_shortcuts[shortcut_combination])
			if(!binding) return;
			var type = binding['event'];
			var ele = binding['target'];
			var callback = binding['callback'];

			if(ele.detachEvent) ele.detachEvent('on'+type, callback);
			else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
			else ele['on'+type] = false;
		}
	}