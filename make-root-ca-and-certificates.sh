#!/bin/bash
FQDN=$1

# Modified from https://github.com/coolaj86/nodejs-self-signed-certificate-example

# make directories to work from
mkdir -p certs/{server,client,ca,tmp}

# Create your very own Root Certificate Authority
openssl genrsa \
  -out certs/ca/root-ca.key.pem \
  2048

# Self-sign your Root Certificate Authority
# Since this is private, the details can be as bogus as you like
openssl req \
  -x509 \
  -new \
  -nodes \
  -key certs/ca/root-ca.key.pem \
  -days 500000 \
  -out certs/ca/root-ca.crt.pem \
  -subj "/C=US/ST=Utah/L=Provo/O=ACME Signing Authority Inc/CN=rootca"

# Create a Device Certificate for each domain,
# such as example.com, *.example.com, awesome.example.com
# NOTE: You MUST match CN to the domain name or ip address you want to use
openssl genrsa \
  -out certs/server/server.key.pem \
  2048

# Create a request from your Device, which your Root CA will sign
openssl req -new \
  -key certs/server/server.key.pem \
  -out certs/tmp/server.csr.pem \
  -subj "/C=US/ST=Utah/L=Provo/O=ACME Tech Inc/CN=localhost"

# Sign the request from Device with your Root CA
# -CAserial certs/ca/root-ca.srl
openssl x509 \
  -req -in certs/tmp/server.csr.pem \
  -CA certs/ca/root-ca.crt.pem \
  -CAkey certs/ca/root-ca.key.pem \
  -CAcreateserial \
  -out certs/server/server.crt.pem \
  -days 500000

# Create a public key, for funzies
# see https://gist.github.com/coolaj86/f6f36efce2821dfb046d
openssl rsa \
  -in certs/server/server.key.pem \
  -pubout -out certs/client/server.pub


# create self signed client certs
openssl genrsa \
  -out certs/client/client.key.pem \
  2048

openssl req -new \
    -key certs/client/client.key.pem \
    -out certs/tmp/client.csr.pem \
    -subj "/C=US/ST=Utah/L=Provo/O=ACME Tech Inc/CN=USER"

openssl x509 \
  -req -in certs/tmp/client.csr.pem \
  -CA certs/ca/root-ca.crt.pem \
  -CAkey certs/ca/root-ca.key.pem \
  -CAcreateserial \
  -out certs/client/client.crt.pem \
  -days 500000
# Create a .p12 out of the client components
openssl pkcs12 -export \
    -inkey certs/client/client.key.pem \
    -in certs/client/client.crt.pem \
    -certfile certs/ca/root-ca.crt.pem \
    -out certs/client/client.p12

# Put things in their proper place
rsync -a certs/ca/root-ca.crt.pem certs/server/
rsync -a certs/ca/root-ca.crt.pem certs/client/
