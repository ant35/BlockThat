/*--------------Helper functions----------------------*/
/*stores a count variable to act like a static counter*/
function counter() {
	if ( typeof counter.count == 'undefined' ) {
        // It has not... perform the initialization
        	counter.count= 0;
    }
	counter.count++;
	return counter.count;
}

/*Grab host name of url*/
function grabDomain(url) {
	return url.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];
}
/*------------------Animation-------------------------------------*/
//animateTrash() controls the animation of the doodle on the popup.
//Since javascript is a one-thread language, this is quite annoying (as you can see) to implement.
function animateTrash(){
	setTimeout(function() {
		animateTrash2();
		setTimeout(function() {
			animateTrash3();
			setTimeout(function() {
				animateTrash4();
				setTimeout(function(){
					animateTrash5();
					setTimeout(function(){
						animateTrash1();
					},500);
				},250);
			},250);
		},250);
	},250);
	
}
function animateTrash1(){
	var pic = document.getElementById("throw_away_animation");
	pic.src = "one.png";

}
function animateTrash2(){
	var pic = document.getElementById("throw_away_animation");
	pic.src = "two.png";

}
function animateTrash3(){
	var pic = document.getElementById("throw_away_animation");
	pic.src = "three.png";

}
function animateTrash4(){
	var pic = document.getElementById("throw_away_animation");
	pic.src = "four.png";

}
function animateTrash5(){
	var pic = document.getElementById("throw_away_animation");
	pic.src = "five.png";

}
/*----------------Monitoring URL changes--------------------------*/
//Checks the url bar to see if it contains a blocked site. If so, it closes the window. 
function queryBlock(){
	chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function (d) { //get current webpage
		var curr = d[0].url;	
		var domain = curr;
		if (curr.substring(0,3)!="www") {
			domain = grabDomain(curr); //grab hostname
		}
		chrome.storage.sync.get(domain,function(items) { 
			if (items[domain]==domain) { //if it is in the storage database then redirect
				if (d[0].status == "loading") {
					chrome.tabs.remove(d[0].id, function() {
						
						if (counter()==1) {
							alert("BlockThat says no."); //only display this message once
							c++;
						}
					});
				}
			}
			counter.count = 0; // reset counter
			
		});
	});
}

/*Event listener for url bar updates*/
chrome.tabs.onUpdated.addListener(function(tabid,changeInfo,tab) {
		queryBlock(); //decide whether to block or not
	}
);

/*-----------------------Button functionality---------------------------*/

document.getElementById("block_that_button").addEventListener("click",buttonClick);
document.getElementById("blocked_sites_button").addEventListener("click",showSites);
document.getElementById("animate").addEventListener("click",animateTrash);

/*Shows the currently blocked sites*/
function showSites() {
	var str = "";
	chrome.storage.sync.get(null,function(sites) {
		for (site in sites) {
			str = str + sites[site] + "\n";
		}
		str = (str == "") ? "None so far...": str;

	alert("My blocked sites: \n" + str);
	});
}

/*Adds site to chrome.storage.sync and prevents user from visiting again*/
function blockSite(site){
	var d=new Date();
	var time=d.getHours();
	
	chrome.storage.sync.set({[site]:site},function(items) { 
		alert( site + " and all related to it will be blocked forever.");
	});

	queryBlock(); //decide whether to block site or not
}

/*Defines behaviour of button in extension GUI*/
function buttonClick(){
	var textbox = document.getElementById("url");
 	var text = textbox.value;
	
	//Only allow sites that begin with http protocol
	if (text.substring(0,4) == "http") {
	  //Isolate the hostname.
	  text = grabDomain(text);
	} else {
		textbox.value = "Url must start with 'http' or 'https'";
		return;
	}
	
	  chrome.storage.sync.get(text,function(items) {
		if (items[text] != text) {
			//confirm choice to block
			var msg = "Are you sure you want to block " + text + " and all associated sites?.\n This cannot be undone...";
			if (confirm(msg)) blockSite(text);
		} else {
			//Site has already been registered in chrome.storage.sync
			alert("Site is already blocked.");
		}
	  });
}
