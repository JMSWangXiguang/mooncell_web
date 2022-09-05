# dst_path=/home/work/web/mooncell/web    #医生地址
dst_path=/home/work/dev/mooncell/web     #测试地址
tmp_path=/tmp/dist  #上传临时目录
server_ip=192.168.8.122  #服务器地址
server_user=work #服务器用户名

npm run build:prod  #前端打包
scp -r dist work@${server_ip}:${tmp_path} #上传
ssh ${server_user}@${server_ip} cp -f ${dst_path}/config.js ${tmp_path} #复制配置文件
ssh ${server_user}@${server_ip} rm -rf ${dst_path} #删除旧包
ssh ${server_user}@${server_ip} mv ${tmp_path} ${dst_path} #把新包放在服务器地址下
# 输入.\sb.sh 执行这个文件

