<?php
//download.php
header("Content-type:text/html;charset=utf-8");

$pwd = $_GET['pwd'];
$dir = '../fileRepo/' . $pwd . '/';
$allFiles = lsDir($dir);
// downloadFile($allFiles['0']);

    // $path = __DIR__."/../fileRepo/".$pwd.'/'.$fileName;


// 页面加载的时候就调用
foreach($allFiles as $fileItem){
    $fileName = basename($fileItem);//获取文件名
    downloadFile($fileItem);
}


//遍历目录 返回所有文件名
function lsDir($dir){
    $result = array();
    if (is_dir($dir)){
        $file_dir = scandir($dir);
        foreach($file_dir as $file){
            if ($file == '.' || $file == '..'){
                continue;
            }
            elseif (is_dir($dir.$file)){
                $result = array_merge($result, list_dir($dir.$file.'/'));
            }
            else{
                array_push($result, $dir.$file);
            }
        }
    }
    return $result;
}

//$filePath是服务器的文件地址
function downloadFile($filePath){
    
    $fileName = basename($filePath);//获取文件名

    //r: 以只读方式打开，b: 强制使用二进制模式
    $fileHandle=fopen($filePath,"rb");    
    if($fileHandle===false){
        echo "Can not find file: $filePath\n";
        exit;
    }
    
    header('Content-Type:octet-stream'); //指定下载文件类型
    header('Content-Disposition: attachment; filename="'.$fileName.'"'); //指定下载文件的描述
    header('Content-Length:'.filesize($filePath)); //指定下载文件的大小
    readfile($filePath);
    
    // while(!feof($fileHandle)) {
    
    //     //从文件指针 handle 读取最多 length 个字节
    //     echo fread($fileHandle, 32768);    
    // }
    // fclose($fileHandle);
}

/*
content-type的含义代表文件MIME类型是文件流格式。如果在Apache配置里面把文件的MIME类型设为application/octet-stream（如add application/octet-stream .xxx.rar），那么浏览器（客户端）就会知道，这是一个文件流格式的文件并提示用户下载。Accept-Ranges是一个响应头标，它允许服务器指明将在给定的偏移和长度处，为资源组成部分的接受请求，该头标的值被理解为请求范围的度量单位。Content-Length是指定包含于请求或响应中数据的字节长度，例如，Content-Length:382。Content-Disposition:attachment是用来告诉浏览器，文件是可以当做附件被下载，下载后的文件名称为$file_name该变量的值。

*/

?>

