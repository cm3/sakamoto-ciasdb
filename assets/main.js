/* 一枚前の写真ページに遷移 */
var prev = function(){
	idnum = document.URL.match(/\d+$/);
	if(idnum=='0001'){ /* 最初の写真の場合、遷移しない */
		prevObj = document.getElementById("link_prev")
		prevObj.innerHTML="最初の写真です";
		prevObj.style.cursor = "default";
		prevObj.style.pointerEvents = "none";
		prevObj.style.color = "grey";
		return undefined;
	}
	location.href = 'http://app.cias.kyoto-u.ac.jp/sakamoto/photoid/IMG-'+('000'+String(Number(idnum)-1)).slice(-4);
}

/* 一枚後の写真ページに遷移 */
var next = function(){
	idnum = document.URL.match(/\d+$/);
	if(idnum=='0492'){ /* 最後の写真の場合、遷移しない */
		prevObj = document.getElementById("link_next")
		prevObj.innerHTML="最後の写真です";
		prevObj.style.cursor = "default";
		prevObj.style.pointerEvents = "none";
		prevObj.style.color = "grey";
		return undefined;
	}
	location.href = 'http://app.cias.kyoto-u.ac.jp/sakamoto/photoid/IMG-'+('000'+String(Number(idnum)+1)).slice(-4);
}

/* 日付を . で区切って表現 */
var adddot = function(_str){
	if(_str.length==8){
		return _str.substring(0, 4)+"."+_str.substring(4, 6)+"."+_str.substring(6, 8)
	}else{
		return _str;
	}
}

/* 縦の写真が来たときと横の写真が来た時でレイアウトを調整する */
var resize_column = function(_imgObj){
    if(_imgObj.width < _imgObj.height){
        document.getElementById("col_img").classList.add("six");
        document.getElementById("col_map").classList.add("six");
    }else{
        document.getElementById("col_img").classList.add("eight");
        document.getElementById("col_map").classList.add("four");
    }
}

/* Loading 終了後、Loading レイヤーを除去する関数 */
var fade_out = function(_el){
    _el.style.opacity = 0.9;
    (function fade() {
    if ((_el.style.opacity -= .05) < 0) {
      _el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

/* leafletjs × mapbox */
var gen_map = function(_lat, _lng){
    var mymap = L.map('map').setView([_lat, _lng], 5);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'cm3.0d2nhino',
        accessToken: 'pk.eyJ1IjoiY20zIiwiYSI6ImNpcGViNDcxNjAwNHN0em5ocHZnNHFyMG0ifQ.2ydnJ72ZsTRNnz2akss1BA'
    }).addTo(mymap);
    var marker = L.marker([_lat, _lng]).addTo(mymap);
}

/* キー操作やスワイプでページ遷移するためのリスナー */
var init_listeners = function(){
    document.addEventListener("keyup", function(e){
      if(e.keyCode==37){prev();}
      else if(e.keyCode==39){next();}
    });

    var imgObj = document.getElementById("img");
    hammerObj = new Hammer(imgObj);
    hammerObj.get("swipe").set({ enable: true });
    hammerObj.on("swipeleft", function(event){next();});
    hammerObj.on("swiperight", function(event){prev();});
}

/* DOM が準備で来たら何をするか、手続き的なリスト */
document.addEventListener("DOMContentLoaded", function() {
    init_listeners();

/* 写真の ID を取得 */
id = document.URL.match(/[^/]+$/);
if(!id){location.href="http://app.cias.kyoto-u.ac.jp/infolib/meta_pub/G0000281Ethiopia";}
else{id = id[0]}
console.log(id);

/* 写真の ID を元に API から情報を取得 */
apiurl = "http://app.cias.kyoto-u.ac.jp/api/sru/json/G0000281Ethiopia?operation=searchRetrieve&version=1.2&query=(mods:relatedItem=%22"+id+".JPG%22)&recordSchema=original&startRecord=1&maximumRecords=1";
axios.get(apiurl)
    .then(function(json){
    var data;
    try{data = json["data"]["soapenv:Body"]["searchRetrieveResponse"]["records"]["record"]["recordData"][0];}
    catch(e){console.log(e);}
    //console.log(data);
    finally{
    if(!data){
        document.getElementById("noteid").textContent = "???";
        document.getElementById("description").textContent = "INVALID DATA";
        document.getElementById("rawdata").textContent = JSON.stringify(data);
    }else{ /* データが取得できた場合の処理 */
        document.getElementById("rawdata").textContent = JSON.stringify(data);
        document.getElementById("noteid").textContent = "NOTE ID: "+data["c1"];
        document.getElementById("photoid").textContent = "PHOTO ID: "+id;
        var timeObj = document.getElementById("timestamp")
        timeObj.textContent = adddot(data["c2"]);
        var descObj = document.getElementById("description");
        descObj.innerHTML = data["c5"].replace("\n","<br />\n");
        descObj.insertBefore(timeObj, descObj.firstChild);

        var imgObj = document.getElementById("img");
        imgObj.setAttribute("src","http://app.cias.kyoto-u.ac.jp/sakamoto/imgs/"+id+".JPG");
        imgObj.onload = function(){
            resize_column(imgObj);
            gen_map(Number(data["c3"]),Number(data["c4"]));
            fade_out(document.getElementById("loading"));
        }
    }} //finally
    }) //then
    .catch(function (error) {
        console.log(error);
    });
}); //DOMContentLoaded
