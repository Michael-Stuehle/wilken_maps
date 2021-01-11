module.exports = {
    formatAsHtmlTable : function(result, fields){
        return formatSqlHtml(result, fields);
	},
	formatAsNormalResult: function(result){
		return tableSyle() + '<p>' + result + '</p>';
	}
}


var formatRow = function(row, fields){
	var str = "";
	for (let index = 0; index < fields.length; index++) {
		let temp = row[fields[index].name]
		if (temp == null) {
			temp = "";
		}
		str += "<td title=\""+temp.toString().split('"').join("'")+"\">" +temp + "</td>";		
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
	return '<link rel="stylesheet" href="/sqlInterface.css"><script src="/script.js"></script>';	
}