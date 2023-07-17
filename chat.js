let talk = 0; //発言相手の判別
let Talk_count = 0; //トーク数
let MyTalk_count = 0; //既読待ち
let Time_delay = 0; //時間変更
let Time_set = 0; //時間変更表示有無
let Read_count = 0; //読んだトーク数

//Enterで送信
document.addEventListener( "keydown", (e)=>{
    if (e.keyCode === 13) { Add_talk();}
} );

//発言相手変更
Change_talk = (id) => {
	if (talk==0){talk=1;document.getElementById(id).innerHTML="×";}
	else {talk=0;document.getElementById(id).innerHTML="+";}
}

//送信時、作成モードか読むモードか判定。あとディレイ
Add_talk = () => {
	setTimeout(()=>{if(Talk_count>Read_count)
		{read_talk();} else {push_talk();}
	},400);
}

//読むモード
const read_talk = () => {
	document.getElementById("input_text").value = "";
	Read_count++;
	document.getElementById("talk"+Read_count).style.display = "block";
	//既読を再表示
	const elements = document.getElementsByClassName("talk"+Read_count);
	for(j=0;j<elements.length;j++){
		elements[j].style.display = "block";
	}
	scrollBy(0,500);
	setTimeout(()=>{
	if (document.getElementById("talk"+(Read_count+1))!==null){
		const NT = document.getElementById("talk"+(Read_count+1))
		if (NT.getElementsByClassName('name')[0]== null){
			document.getElementById("input_text").value = NT.getElementsByClassName('text')[0].textContent;
		}else{
			Add_talk();
		}	
	}
	}	,1000);	
}		
const all_read_talk = () => {
	Read_count = Talk_count;
	for (let i = 1; i <= Talk_count; i++){
		document.getElementById("talk"+i).style.display = "block";
		const elements = document.getElementsByClassName("talk"+i);
		for(j=0;j<elements.length;j++){
			elements[j].style.display = "block";
		}
	}
	
}
const push_talk = () => {
		const IT = document.getElementById("input_text").value;
		const TA = document.getElementById("talk_area");
		Talk_count ++;Read_count++;
		document.getElementById("talk_count").innerText=Talk_count;
		if (IT!==""){
			if (talk == 0){
				MyTalk_count ++;
				TA.insertAdjacentHTML('beforeend', '<div id="talk' + Talk_count +'" class="line__right">\n<div class="text">'
				+ IT +'</div>\n'
				+ '<span class="date" id="date' + Talk_count +'">' + Data_scan() + '</span>'
				+'</div>\n\n\n');
				document.getElementById("input_text").value="";
			} else {
				TA.insertAdjacentHTML('beforeend', 
				'<div id="talk' + Talk_count +'" class="line__left">\n'
				+ '<figure><img src="icon.png" /></figure>\n'
				+ '<div class="line__left-text">\n<div class="name">'
				+ Chara + '</div>\n<div class="text">'
				+ IT + '</div>\n'
				+ '<span class="date"><br>' + Data_scan() + '</span></div></div>\n\n\n');
				document.getElementById("input_text").value="";
				Read_add();
			}
		} else {
			if (talk == 0){
				TA.insertAdjacentHTML('beforeend', '<div id="talk' + Talk_count +'" class="line__right">\n<div class="tell"><img src="images/tell.png" /><br/>応答なし</div>\n'
				+ '<span class="date" id="date' + Talk_count +'">' + Data_scan() + '</span>'
				+'</div>\n\n\n');
			} else {
				TA.insertAdjacentHTML('beforeend', 
				'<div id="talk' + Talk_count +'" class="line__left">\n'
				+ '<figure><img src="icon.png" /></figure>\n'
				+ '<div class="line__left-text">\n<div class="name">'
				+ Chara + '</div>\n<img class="text" src="images/tell.png" />\n'
				+ '<span class="date"><br>' + Data_scan() + '</span></div></div>\n\n\n');
			}
		}
}

Add_img = () => {
	const img = document.getElementById("file_img").files[0].name;
	Send_img(img);
}
Send_img = (img) => {
	const TA = document.getElementById("talk_area");
	Talk_count ++;Read_count++;
	document.getElementById("talk_count").innerText=Talk_count;
	if (talk == 0){
		MyTalk_count ++;
		TA.insertAdjacentHTML('beforeend', 
			'<div id="talk' + Talk_count +'" class="line__right">\n'
			+ '<a class="stamp" href="'
			+ img_path + img + '"><img src="'
			+ img_path + img + '" /></a>\n'
			+ '<span class="date" id="date' + Talk_count +'">' + Data_scan() + '</span></div>\n\n');
	} else {
		TA.insertAdjacentHTML('beforeend', 
			'<div id="talk' + Talk_count +'" class="line__left">\n'
			+ '<figure><img src="icon.png" /></figure>\n'
			+ '<div class="line__left-text">\n<div class="name">'
			+ Chara + '</div>\n<a class="stamp" href="'
			+ img_path + img + '"><img src="'
			+ img_path + img + '" /></a>'
			+ '<span class="date"><br>' + Data_scan() + '</span></div></div>\n\n');
		Read_add();
	}
	$(".stamp").colorbox({rel:'stamp',maxHeight:"100%"})
}

Trash_talk = () => {
		const TA = document.getElementById("talk"+Talk_count);
		TA.remove();
		Talk_count --;
		document.getElementById("talk_count").innerText=Talk_count;
		if (talk == 0 && MyTalk_count > 0) MyTalk_count--;
}

Read_add = () => {
	while (MyTalk_count > 0){
		DI = document.getElementById("date"+(Talk_count-MyTalk_count));
		DI.insertAdjacentHTML('afterbegin', '<p class="talk' + Talk_count +'">既読</p>');
		MyTalk_count--;
	}
		
}

let Data_scan = () => {
	const date1 = new Date();
	let time1 = 0;
	if (Time_set==1) {time1 = Number(document.getElementById("time_changer").value);}
	if (time1 < 0) {time1 = time1 + 2360;}
	const dateM =( '00' + (date1.getMinutes() + time1%100)%60 ).slice( -2 );
	const dateH =(date1.getHours() + Math.floor(time1/100) + Math.floor((date1.getMinutes() + time1%100)/60) )%24; 
	const DT = dateH + ':' + dateM;
	return (DT);
}

time_setup = () => {
	if (Time_set ==0){
		Time_set = 1; document.getElementById('time_changer').style.display = "block";
		document.getElementById('icon_time').src="images/time.png";
	} else {
		Time_set = 0; document.getElementById('time_changer').style.display = "none";
		document.getElementById('icon_time').src="images/menu.png";
	}
}

window.onload = () => {
	$(".stamp").colorbox({rel:'stamp',maxHeight:"100%"})
	Talk_count = Number(document.getElementById("talk_count").textContent);
	document.getElementById("room_name").textContent=room_name;
	for (let i = 1; i <= Talk_count; i++){
		document.getElementById("talk"+i).style.display = "none";
		const elements = document.getElementsByClassName("talk"+i);
		for(j=0;j<elements.length;j++){
			elements[j].style.display = "none";
		}
	}
}

download = () => {
    // テキストエリアから入力内容を取得する
	var content = document.getElementById("HTML").innerHTML;
	
	content = '<html lang="ja" id="HTML">\n' + content + '\n</html>';
    // テキストファイルをBlob形式に変換する
    let blob = new Blob([content]);

    // Blobデータに対するURLを発行する
    let blobURL = window.URL.createObjectURL(blob);
	
    // URLをaタグに設定する
    let a = document.createElement('a');
    a.href = blobURL;

    // download属性でダウンロード時のファイル名を指定
    a.download = Chara + '.html';

    // Firefoxの場合は、実際にDOMに追加しておく必要がある
    document.body.appendChild(a);

    // CLickしてダウンロード
    a.click();

    // 終わったら不要なので要素を削除
    a.parentNode.removeChild(a);
	console.log(content);
}

//画像のドラッグ&ドロップ
    window.addEventListener( "DOMContentLoaded" , ()=> {
 
        const ddarea = document.getElementById("input_text");
 
            // ドラッグされたデータが有効かどうかチェック
        const isValid = e => e.dataTransfer.types.indexOf("Files") >= 0;
 
        const ddEvent = {
            "dragover" : e=>{
                e.preventDefault(); // 既定の処理をさせない
                if( !e.currentTarget.isEqualNode( ddarea ) ) {
                        // ドロップエリア外ならドロップを無効にする
                    e.dataTransfer.dropEffect = "none";return;
                }
                e.stopPropagation(); // イベント伝播を止める
 
                if( !isValid(e) ){
                        // 無効なデータがドラッグされたらドロップを無効にする
                    e.dataTransfer.dropEffect = "none";return;
                }
                        // ドロップのタイプを変更
                e.dataTransfer.dropEffect = "copy";
                ddarea.classList.add("ddefect");
            },
            "dragleave" : e=>{
                if( !e.currentTarget.isEqualNode( ddarea ) ) {
                    return;
                }
                e.stopPropagation(); // イベント伝播を止める
                ddarea.classList.remove("ddefect");
            },
            "drop":e=>{
                e.preventDefault(); // 既定の処理をさせない
                e.stopPropagation(); // イベント伝播を止める
 
                const files = e.dataTransfer.files;
				Send_img(files[0].name);
                ddarea.classList.remove("ddefect");
            }
        };
 
        Object.keys( ddEvent ).forEach( e=>{
            ddarea.addEventListener(e,ddEvent[e]);
            document.body.addEventListener(e,ddEvent[e])
        });
 
    });

