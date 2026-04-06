# 用于放置临时文件，上传到kaggle使用

## 使用方法
创建临时文件，然后复制到kaggle云主机下，以达到修改的目的  
因为kaggle的console不能用，在notebook中修改代码不方便，所以使用此方法  

## 命令
%cd /kaggle/working/  
!git clone https://github.com/LIKE9426334946/file_temp.git  
!cp file_temp/eval.py whdld1/eval.py  
