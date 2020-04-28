<?php
    header("Content-type: text/html; charset=utf-8");

    const AIM_PATH = "../fileRepo/";

    ignore_user_abort(); //客户端断开时，可以让脚本继续在后台执行
    set_time_limit(0);   //忽略php.ini设置的脚本运行时间限制
    $interval = 2*60*60;      //设置执行周期，单位为秒，2小时

    //执行
    while(1){
        echo '正在运行'；
        clearDir();
        sleep($interval);
    }


    function delDir($foldPath){
        //如果是文件夹 就进入
        if(is_dir($foldPath)){
            //剔除.和.. 剩下的就是文件
            $allFile = array_diff(scandir($foldPath),array('.','..'));
            foreach($allFile as $fileItem){
                //如果它还是文件夹 就递归 项目中不能传文件夹用不到 以防万一
                if(is_dir($fileItem)){
                    delDir($foldPath.$fileItem.'/');
                }else{
                    //删除文件
                    $a = unlink($foldPath.$fileItem);
                } 
            }
            rmdir($foldPath);
        }
    }

    function clearDir(){
        opendir(AIM_PATH);
        $allFold = array_diff(scandir(AIM_PATH),array('.','..'));
        foreach($allFold as $Item){
            $createTime = filectime(AIM_PATH.'/'.$Item);//获取文件创建时间
            // echo time()-$createTime."\n";
            //如果超过24小时就删除86400
            if(time()-$createTime >= 86400){
                delDir(AIM_PATH.'/'.$Item.'/');
            }
        }
        closedir(AIM_PATH);
    }


?>