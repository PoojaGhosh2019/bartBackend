const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  //console.log("url = ", req.url)
  var bartUrl = ""
  var temp1 = req.url.split("?")
  if (temp1[0] === '/stations') {
	console.log("stations requested ...")
	bartUrl = 'http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y'
  } else if (temp1[0] === '/station') {
	if (temp1.length === 2) {  
		var temp2 = temp1[1].split("&")
		var temp3 = temp2[0].split("=")
		if (temp3.length === 2)
			bartUrl = 'http://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=' + temp3[1] + '&key=MW9S-E7SL-26DU-VV8V&json=y'
	}
  } else if (temp1[0] === '/trips') {
	console.log("trips requested ...")
	if (temp1.length === 2) {
		var temp2 = temp1[1].split("&")
		if (temp2.length === 2) {
			var temp3 = temp2[0].split("=")
			var temp4 = temp2[1].split("=")
			if (temp3.length === 2 && temp4.length === 2)
				bartUrl = 'http://api.bart.gov/api/sched.aspx?cmd=arrive&orig=' + temp3[1] + '&dest=' + temp4[1] + '&key=MW9S-E7SL-26DU-VV8V&json=y'
		}
	}		
  } else {
	console.log("unknown request: ", temp1[0])
  }
  
  if (bartUrl === "") {
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.end("Invalid Request!");
  } else {
	  http.get(bartUrl, (resp) => {
		  let data = '';
		  // A chunk of data has been recieved.
		  resp.on('data', (chunk) => {
			data += chunk;
		  });
		  // The whole response has been received. Print out the result.
		  resp.on('end', () => {
			  res.statusCode = 200;
			  res.setHeader('Content-Type', 'text/plain');
			  if(req.headers.origin !== undefined)
				res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
			  res.end(data);
		  });
		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
  }
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
