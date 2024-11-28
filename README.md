Digital Ocean password

123456789CBS

# joe-server install

git clone https://github.com/mwndigi/joe-server.git

cd joe-server

npm install

node app.js

## Node.js install

[Link til dokumentation](https://github.com/nodesource/distributions?tab=readme-ov-file#using-ubuntu-nodejs-18)

sudo apt-get install -y curl

curl -fsSL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh

sudo -E bash nodesource_setup.sh

sudo apt-get install -y nodejs

node -v

## pm2 install

[Link til dokumentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

sudo npm install pm2@latest -g

pm2 start app.js

pm2 startup systemd

sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /home/root

pm2 save

sudo systemctl start pm2-root

systemctl status pm2-root

## pm2 kommandoer

[Link til dokumentation](https://pm2.keymetrics.io/docs/usage/process-management/)

pm2 list

pm2 start node_file.js

pm2 stop app_name_or_id

pm2 restart app_name_or_id

pm2 delete app_name_or_id

pm2 info app_name

pm2 save

## Nginx install

[Link til dokumentation](https://nginx.org/en/docs/)

sudo apt update 

sudo apt install nginx

sudo nginx -v

systemctl status nginx

## Nginx konfiguration

sudo ufw app list

sudo ufw allow 'Nginx HTTP'

ufw allow OpenSSH

sudo ufw enable

sudo ufw status

sudo nano /etc/nginx/sites-available/default

```
server { 
... 
	location / { 
		proxy_pass http://localhost:3000; 
		proxy_http_version 1.1; 
		proxy_set_header Upgrade $http_upgrade; 
		proxy_set_header Connection 'upgrade'; 
		proxy_set_header Host $host; 
		proxy_cache_bypass $http_upgrade; 
	} 
... 
}
```

Gem ændringerne i konfigurationen med CTRL+X og Y for Yes og Enter.

sudo nginx -t

sudo systemctl restart nginx

## Nginx kommandoer

sudo systemctl start nginx

sudo systemctl stop nginx

sudo systemctl restart nginx

sudo systemctl reload nginx

sudo systemctl disable nginx

sudo systemctl enable nginx

## Linux kommandoer

[Link til oversigt](https://www.geeksforgeeks.org/linux-commands-cheat-sheet/)


