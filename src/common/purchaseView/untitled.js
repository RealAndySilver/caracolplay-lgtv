var source = {};
source.quantity = 1;
source.text = 'test';

var result = [];

for(var i in source) {
	var obj = {};
	obj[i] = source[i];
	result.push(obj);
}

var json = JSON.stringify(result);