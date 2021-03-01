let item_data = [];   // 全部 data 的詳細資訊
let photo_data = [];
let searchStyle = document.getElementById('search_style');
let num = document.getElementById('num');
let btn = document.getElementById('btn');
let in_vu = document.getElementById("in_vu");   // 取得input
let icon = document.getElementById("icon");
let model = document.getElementById('model');

fetch('sitetype.json', { method: 'GET' })
    .then((response) => {
        return response.json();
    })
    .then((jsonData) => {
        // console.log(jsonData);

        for (let i in jsonData) {
            // console.log(jsonData[i].item.name);
            item_data.push(jsonData[i].item);
            photo_data.push(jsonData[i].detail.image);
        }
        // console.log(item_data);
        // console.log(photo_data);

        for (let i = 0; i < item_data.length; i++) {
            let model_li = document.createElement("div");
            model_li.setAttribute("class", "shop_box");
            model_li.setAttribute("data-index", item_data[i].name);
            model_li.innerHTML += `<img src="${photo_data[i]}">
                        <h5>${item_data[i].name}</h5>`;
            model.appendChild(model_li);
            num.textContent = item_data.length;
        }

    })



function autocomplete(in_vu, arr) {
    let entFocus;  // focus數值

    in_vu.addEventListener("input", function (e) {
        // console.log(this);
        let val = this.value;
        let str;

        removeLists();

        if (!val) {
            searchStyle.innerHTML = "";
            num.textContent = item_data.length;
            return;
        };

        entFocus = -1;   // focus起始值設-1
        searchStyle.innerHTML = `.shop_box:not([data-index*="${val}"]) { display: none; }`;   // 符合便寫入 searchStyle CSS

        let box = document.createElement("div");            // 建立符合輸入值的項目框
        box.setAttribute("id", this.id + "auto-list");
        box.setAttribute("class", "auto-items");

        // console.log(this.parentNode);
        this.parentNode.appendChild(box);          // 加到input框之下
        let data_arr = [];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name.match(val)) {    // 關鍵字串中有符合的字詞就列出
                // console.log(arr[i].match(val));

                data_arr.push(arr[i].name);
                num.textContent = data_arr.length;


                let box_li = document.createElement("div");     // 項目

                box_li.innerHTML += arr[i].name;
                box_li.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";   // 建立隱藏起來並包含value的input

                box_li.addEventListener("click", function (e) {
                    // console.log(this);
                    in_vu.value = this.getElementsByTagName("input")[0].value;        // 監控點擊的項目，取值

                    removeLists();        // 移除條列字串
                });

                box.appendChild(box_li);    // 將符合的項目加入項目框
            }
        }
    });




    in_vu.addEventListener("keydown", function (e) {              // 監控輸入框的輸入
        let a = document.getElementById(this.id + "auto-list");   // 項目框
        let b;                                                    // 符合的項目

        if (a) {                                                  // 如果項目框有建立     
            b = a.getElementsByTagName("div");
        };

        if (e.keyCode == 40) {
            entFocus++;      // focus值++
            addActive(b);    // 上色

        } else if (e.keyCode == 38) {
            entFocus--;     // focus值--
            addActive(b);

        } else if (e.keyCode == 13) {      // 防止enter即跳轉
            e.preventDefault();

            if (entFocus > -1) {
                b[entFocus].click();      // 選定項目
                btn.click();
            }
        }
    });

    btn.addEventListener('click', function (e) {         // 搜尋鈕
        let vue = in_vu.value;

        for (let i = 0; i < item_data.length; i++) {
            if (vue == item_data[i].name) {
                searchStyle.innerHTML = `.shop_box:not([data-index*="${vue}"]) { display: none; }`;
            }
        }
        num.textContent = `1`;
    });


    function addActive(vu) {       // 選項上色
        if (!vu) { return; };

        removeActive(vu);       // 先取消所有選項上色

        if (entFocus >= vu.length) {    // 當focus值大於條列字串長度，回到第一項
            entFocus = 0;
        };

        if (entFocus < 0) {            // 當focus值小於條列字串長度，回到最後一項
            entFocus = (vu.length - 1);
        };

        vu[entFocus].classList.add("active");    // 加上上色className
    }

    function removeActive(vu) {               // 取消上色
        for (let i = 0; i < vu.length; i++) {
            vu[i].classList.remove("active");
        }
    }

    function removeLists(ele) {
        let vu_items = document.getElementsByClassName("auto-items");   // 取得條列字串們

        for (var i = 0; i < vu_items.length; i++) {
            if (ele != vu_items[i] && ele != in_vu) {                   // 遍歷，不符合即移除
                vu_items[i].parentNode.removeChild(vu_items[i]);
            }
        }
    }
}

autocomplete(in_vu, item_data);