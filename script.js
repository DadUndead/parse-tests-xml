var fs = require('fs');
var parse = require('xml-parser');
var files = fs.readdirSync('./docs/');

var inspect = require('util').inspect;
var fileSave = require('file-save');
var jsonQuery = require('json-query')

for (var i in files){
	console.log('Model Loaded: ' + files[i]);
	var xml = fs.readFileSync('docs/'+files[i], 'utf8');
	convertAndSave(xml, files[i]);
}

function convertAndSave(file, fileName){
	
	var obj = parse(file);
	
	var $quests = jsonQuery('children[*name=quest].children[*name=question]', {
	  data: obj.root
	})

	var newFile = '';

	for (var i=0; i<$quests.value.length; i++){
		
		var quest = $quests.value[i];
		
		//console.log('quest==>',quest.attributes.t);
		
		newFile+='-------------------------------------\r\n'
		newFile+=quest.attributes.t+'\r\n';
		
		var $answers = jsonQuery('children[*name=ans].attributes.t',{
			data:quest
		})
		
		//console.log('$answers ',$answers );
		for(var j=0; j<$answers.value.length; j++){
			var ans = $answers.value[j];
			newFile+=ans+'\r\n';
		}
	} 

	fileSave('out/'+fileName+'.txt').write(newFile);

	console.log(inspect(xml, { colors: true, depth: Infinity }));

	console.log('newFile',newFile);
}

