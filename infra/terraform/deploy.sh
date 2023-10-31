#!/bin/bash

# 引数を取得
account_id=$1
region=$2
workspace=$3

# 入力の確認
if [ -z "$account_id" ] || [ -z "$region" ] || [ -z "$workspace" ]; then
  echo "Usage: ./deploy.sh <account_id> <region> <workspace>"
  exit 1
fi

# terraform initを実行
terraform init
if [ $? -ne 0 ]; then
  echo "Error: terraform init failed"
  exit 1
fi

# terraform planを実行
terraform plan -var="account_id=${account_id}" -var="region=${region}"
if [ $? -ne 0 ]; then
  echo "Error: terraform plan failed"
  exit 1
fi

# terraform applyを実行
terraform apply -var="account_id=${account_id}" -var="region=${region}" -var="workspace=${workspace}" -auto-approve
if [ $? -ne 0 ]; then
  echo "Error: terraform apply failed"
  exit 1
fi

