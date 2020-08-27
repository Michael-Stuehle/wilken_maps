module.exports = {
    formatAsHtmlTable : function(result, fields){
        return formatSqlHtml(result, fields);
    }
}


var formatRow = function(row, fields){
	var str = "";
	for (let index = 0; index < fields.length; index++) {
		str += "<td>" +row[fields[index].name] + "</td>";		
	}
	return str;
}

var formatHeaders = function(fields){
	var str = "";
	for (let index = 0; index < fields.length; index++) {
		str += "<th>" + fields[index].name + "</th>";
	}
	return str;
}

var formatSqlHtml = function(result, fields){
    if (fields) {
        var str = tableSyle() + '<table id="result">'
        str += formatHeaders(fields);
        for (let index = 0; index < result.length; index++) {
            str += 	"<tr>" + formatRow(result[index], fields) + "</tr>";		
        }		
        str += "</table>" ;
        return str;
    }else{
        return JSON.stringify(result);
    }
	
}

var tableSyle = function(){
	return '<style>'+
		'body {margin: 0}' +
		'#result {'+
			'font-family: "Open Sans", Helvetica, Arial, sans-serif;'+
			'border-collapse: collapse;'+
			'width: 100%;'+
			'margin: 0px;' +
  		'}'+

  		'#result td, #result th {'+
			'border: 1px solid #ddd;'+
			'padding: 8px;'+
		'}'+

		'#result tr:nth-child(even){background-color: #f2f2f2;}'+

		'#result tr:hover {background-color: #ddd;}'+

		'#result th {'+
			'padding-top: 12px;'+
			'padding-bottom: 12px;'+
			'text-align: left;'+
			'background-color: #0069b4;'+
			'color: white;'+
		'}'+
	'</style>';
}