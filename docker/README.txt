Pasos para instalar

docker build -f .\Dockerfile-cap -t cap72w .
docker run -p 880:80 -p 8443:443  -v E:/Trabajos/goautodial_llamadas/goautodial.callcenter/:/var/www/html --restart=always -d -it --name callmarket cap72w

FIN