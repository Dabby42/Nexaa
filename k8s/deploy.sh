#!/bin/sh

cd -P -- "$(dirname -- "$0")"/..

docker build -t acrkongastage.azurecr.io/hera_be:latest -f Dockerfile.k8s . && \
docker -- push acrkongastage.azurecr.io/hera_be:latest && \
kubectl delete -f k8s/production/deployment.yaml && \
kubectl create -f k8s/production/deployment.yaml
