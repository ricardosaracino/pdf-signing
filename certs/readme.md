
https://stackoverflow.com/questions/14459078/unable-to-load-config-info-from-usr-local-ssl-openssl-cnf-on-windows
https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl
https://raw.githubusercontent.com/openssl/openssl/master/apps/openssl.cnf


openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout example.key -out example.crt  -config "C:\openssl\openssl.cnf"

openssl pkcs12 -export -out certificate.pfx -inkey example.key -in example.crt 

password: test