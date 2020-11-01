window.onload = function() {
    // Initialize
    generate_photolist();
    var bLazy = new Blazy();
}

/*
var idf = IdFactory("IMG-0001"); のようにして初期化することで、
idf.next() や idf.prev() で前後の id を取得できる
*/
var IdFactory = function(_currentid) {
    var localnum = Number(_currentid.match(/\d+$/));
    var lowerlimit = 1;
    var upperlimit = 492;
    return {
        "prev" : function() {
            if(localnum == lowerlimit){return undefined;}
            else{
                localnum -= 1;
                return 'IMG-'+('000'+String(localnum)).slice(-4);
            }
        },
        "current" : function(){
            return 'IMG-'+('000'+String(localnum)).slice(-4);
        },
        "next" : function() {
            if(localnum == upperlimit){return undefined;}
            else{
                localnum += 1;
                return 'IMG-'+('000'+String(localnum)).slice(-4);
            }
        }
    }
}

/*
IdFactory のインスタンスを与えて
var df = DivFactory(idf);
のように初期化することで、df.generate() で次々に div タグを生み出せる
*/
var DivFactory = function(_idf){// _idf : instance of IdFactory
    var idf = _idf;
    var nextid = idf.current();
    return {
        "generate" : function(){
            if(!nextid){return undefined;}
            else{
                var div1=document.createElement('div');
                div1.className='three columns';
                div1.innerHTML = "<a href=\"./photoid/"+nextid+"\"><img src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-src=\"./imgs/"+nextid+".JPG\" class=\"b-lazy\" /></a>";
                nextid = idf.next();
                //console.log("nextid: "+nextid)
                return div1;
            }
        }
    }
}

/*
DivFactory のインスタンスを与えて
var rf = RowFactory(df);
のように初期化することで、rf.generate() で次々に div タグを生み出せる
*/
var RowFactory = function(_df){// _idf : instance of IdFactory
    var df = _df;
    return {
        "generate" : function(){
            var div1=document.createElement('div');
            div1.className='row';
            for (var i = 0; i < 4; i++){
                tempc = df.generate();
                //console.log(tempc);
                if(tempc){
                    div1.appendChild(tempc);
                }else if(i==0){
                    return undefined;
                }else{
                    return div1;
                }
            }
            return div1;
        }
    }
}

var generate_photolist = function(){
    var div1=document.getElementById('photogrid');
    var rf = RowFactory(DivFactory(IdFactory('IMG-0001')));
    var tempr = rf.generate();
    for(var i = 0;i < 10000;i++){
        if(!tempr){
            return div1;
        }else{
            div1.appendChild(tempr);
            tempr = rf.generate();
            //console.log(tempr);
        }
    }
}
