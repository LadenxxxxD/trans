function $(selector) {
    return document.querySelector(selector);
}

const dragItem = $("#fileIcon");
var isDownloadDrag = false;
var uploadFiles = [];

dragItem.addEventListener("dragstart", function (event) {
    event.target.style.opacity = "0.4";
    isDownloadDrag = true;
});
dragItem.addEventListener("drag", function (event) {
});
dragItem.addEventListener("dragend", function (event) {
    event.target.style.opacity = "1";
    isDownloadDrag = false;
});

//当被鼠标拖动的对象进入其容器范围内时触发此事件
document.addEventListener("dragenter", function (event) {
    event.preventDefault();
    event.stopPropagation();
});
//当某被拖动的对象在另一对象容器范围内拖动时触发此事件
document.addEventListener("dragover", function (event) {
    event.preventDefault();//为了ondrop起作用
    event.stopPropagation();
});
//当被鼠标拖动的对象离开其容器范围内时触发此事件
document.addEventListener("dragleave", function (event) {
    event.preventDefault();
    event.stopPropagation();
});


//在一个拖动过程中，释放鼠标键时触发此事件
document.addEventListener("drop", function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.target.id == "root" && isDownloadDrag) {
        let pwd = getFilePWD();
        download(pwd);
    }
    if (event.target.id == "content" && !isDownloadDrag) {
        getLocalFile();
        ajaxUpload();
        console.log(uploadFiles);
    }
});

$("#file").addEventListener("change", function () {
    let files = $("#file").files;
    for (let i = 0; i < files.length; i++) {
        uploadFiles.push(file);
    }
})

function getFilePWD() {
    return prompt("请输入提取密码");
}

function getLocalFile() {
    let dt = event.dataTransfer;

    //这里chrome获取文件用items对象 需要判断浏览器兼容
    if (dt.items !== undefined) {
        for (let i = 0; i < dt.items.length; i++) {
            let item = dt.items[i];

            //用webkitGetAsEntry禁止上传目录文件
            if (item.kind == "file" && item.webkitGetAsEntry().isFile) {
                let file = item.getAsFile();
                uploadFiles.push(file);
            }
        }
    } else {
        for (let i = 0; i < dt.files.length; i++) {
            uploadFiles.push(dt.files[i]);
        }
    }
    return uploadFiles;
}

var xhr;
//上传文件方法
function ajaxUpload() {

    // let url = "http://trans.zhencai.xyz" + "/api/uploadFile.php"; // 接收上传文件的后台地址
    let url = window.location.href + "api/uploadFile.php";

    let form = new FormData(); // FormData 对象
    uploadFiles.forEach(
        (item, index) => form.append("file" + index, item)
    );

    xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
    xhr.onreadystatechange = function () { // 状态发生变化时，函数被回调
        if (xhr.readyState === 4) { // 成功完成
            // 判断响应结果:
            if (xhr.status === 200) {
                // 成功，通过responseText拿到响应的文本:
                console.log(xhr.responseText);
            } else {
                // 失败，根据响应码判断失败原因:
            }
        } else {
            // HTTP请求还在继续...
        }
    }
    xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
    xhr.send(form); //开始上传，发送form数据
}

function download(pwd) {
    // let url = "http://trans.zhencai.xyz" + "/api/downloadFile.php?pwd=" + pwd;
    let url = window.location.href + "api/downloadFile.php?pwd=" + pwd;
    window.location.href = url;
}