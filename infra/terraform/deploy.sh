#!/bin/bash

# Retrieve arguments
account_id=$1
region=$2
vendor=$3
project=$4
purpose=$5

# Input validation
if [ -z "$account_id" ] || [ -z "$region" ] || [ -z "$vendor" ] || [ -z "$project" ] || [ -z "$purpose" ]; then
  echo "Usage: ./deploy.sh <account_id> <region> <vendor> <project> <purpose>"
  exit 1
fi

# Execute terraform init
terraform init
if [ $? -ne 0 ]; then
  echo "Error: terraform init failed"
  exit 1
fi

# Execute terraform plan
terraform plan \
  -var="account_id=$account_id" \
  -var="region=$region" \
  -var="vendor=$vendor" \
  -var="project=$project" \
  -var="purpose=$purpose"
if [ $? -ne 0 ]; then
  echo "Error: terraform plan failed"
  exit 1
fi

# Execute terraform apply
terraform apply \
  -var="account_id=$account_id" \
  -var="region=$region" \
  -var="vendor=$vendor" \
  -var="project=$project" \
  -var="purpose=$purpose" \
  -auto-approve
if [ $? -ne 0 ]; then
  echo "Error: terraform apply failed"
  exit 1
fi
