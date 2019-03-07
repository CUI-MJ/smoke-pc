#!/usr/bin/expect -f
set USER root
set IP 172.16.20.220
set PATH /usr/local/bbox-VSM
set PASSWORD 123.com

#ssh login server and unzip package
spawn ssh $USER@$IP
expect "password:"
send "$PASSWORD\r"
expect "*#"
send "cd $PATH\r"
send_user "Hello BeeBoxer\r"
interact
expect eof