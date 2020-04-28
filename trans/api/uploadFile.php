<?php
    header("Content-Type:text/html;charset=UTF-8");

    //准备工作
    $pwd = pwd(); //下载密码
    $dir = '../fileRepo/' . $pwd . '/';//文件存放目录
    $ext = pathinfo($_FILES['file0']['name'])['extension'];//后缀名 可以用来判断上传类型 暂时不用
    $name = $_FILES['file0']['name'];//原文件名
    $pathname = $dir . $name;//储存地址
    $info = [
        'result' => 'fail',//上传成功或失败
        'errorCode' => $_FILES['file0']['error'],//上传成功或失败
        'errorInfo' => errorAnalysis(),//上传成功或失败
        'password' => $pwd,//上传成功或失败
    ];

    //上传逻辑
    if ($_FILES['file0']['error'] == 0) {
        if (!file_exists($dir)) {
        mkdir($dir, 0777, TRUE);
        chmod($dir, 0777);
        }
    }else{
        // echo errorAnalysis();
    }
    if (is_uploaded_file($_FILES['file0']['tmp_name'])) {
        if (move_uploaded_file($_FILES['file0']['tmp_name'], $pathname)) {
            $info['result']='succeed';
        }else{
            echo errorAnalysis();
        }
    }else{
        $info['errorCode']='-1';
        $info['errorInfo']='文件不是通过HTTP POST上传';
        // die('文件不是通过HTTP POST上传');
    }

function errorAnalysis(){
    switch ($_FILES['file0']['error']) {
        case 0 :
        return '上传成功';
        case 1 :
        return '文件超出了php.ini中upload_maxfilesize限制的值';
        break;
        case 2 :
        return '文件超出了HTML表单MAX_FILE_SIZE限制的大小';
        break;
        case 3 :
        return '文件部分被上传';
        break;
        case 4 :
        return '没有选择上传的文件';
        break;
        case 6 :
        return '没有找到临时目录';
        break;
        case 7 :
        case 8 :
        return '系统错误！';
        break;
    }
}

function pwd(){
   return  rand(1111,9999);
}

print_r($info);
?>