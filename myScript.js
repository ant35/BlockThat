document.getElementById("butt").addEventListener("click",buttonClick);

function addToList(site, d){
	//init values
	if (site == "Enter a URL if you want to block it.") return;
	var table = document.getElementById("myTab");
	
	//create containers
	var tr = document.createElement("tr");
	var td1 = document.createElement("td");
	var td2 = document.createElement("td");
	var txt = document.createTextNode(site);
	var d_and_t = document.createTextNode(d+ " " + time);
	
	//assign to proper place
	td1.appendChild(txt);
	td2.appendChild(d_and_t);
	tr.appendChild(td1);
	tr.appendChild(td2);
	table.appendChild(tr);
}
function blockSite(site){
	var d=new Date()
	var time=d.getHours()
	addToList(site,d);
	chrome.storage.sync.set(site:d,function() { 
		alert(site + " and all related to it will be blocked forever.");
		}
	);
}
function checkSiteForAccess(){
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
	    var curr_tab= tabs[0].url;
	    alert("The current webpage is: " + curr_tab);
	});
}
function buttonClick(){
	var textbox = document.getElementById("url");
 	var text = textbox.value;
	
	if (text == "") {
	  textbox.value = "Enter a URL if you want to block it.";
	} else {
	if (chrome.storage.sync.get([text],function() {
		
	});
	  blockSite(text);
  	}

}