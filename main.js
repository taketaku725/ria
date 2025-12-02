let clickCount = 0;
const imgRi = document.getElementById("imgRi");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");

imgRi.addEventListener('click', function() {
  clickCount++;
  console.log("クリック数:", clickCount);

  if (clickCount >= 5) {
    popup.style.display = "flex";
  }
});

closeBtn.addEventListener('click', () => {
  popup.style.display = "none";
  clickCount = 0;
});


function AnswerCheck(form){
  try{
    // 連打を防止するために、送信ボタンを無効化する
    $(form).find('button[type=submit]').prop('disabled', true);
    // 入力欄に入っている文字列を拾う
    send_text = $(form).children("input[type=text]").val().trim();
    // console.log("./answer/"+form.name+send_text+".txt");
    // 入力欄が空のとき、送信せず、エラーメッセージを出す
    if(send_text.length == 0){
      // $(form).next(".result").text("入力欄が空です");
      $(form).find('button[type=submit]').prop('disabled', false);
      return false;
    }

    $.ajax({
      url: "./answer/"+form.name+send_text+".txt",
      type: "GET",
      dataType: "json",
      timeout: 3000,
    })
    .done(function(resp){
      // answers/{send_text}が存在する
      $(form).next(".result").text('');
      if(resp["type"] == "move"){  // 遷移
        window.location.href = resp["value"];
      }else if(resp["type"] == "alert"){  // アラート
        alert(resp["value"]);
      }else if(resp["type"] == "uftext"){  // フォーム下テキスト
        $(form).next(".result").text(resp["value"]);
      }else if(resp["type"] == "function"){  // 関数実行
        tmpFn[resp["value"]](form);
      }
    })
    .fail(function(){
        // ./answer/{form.name}{send_text}.txtが存在しない
        $(form).next(".result").text("「"+send_text+"」は不正解です。");
    })
    .always(function(){
        // 送信が完了したら、送信ボタンを有効化する
        $(form).find('button[type=submit]').prop('disabled', false);
    });
  } catch(error){
    console.error(error);
  }
}
