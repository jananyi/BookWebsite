#!/bin/bash
set -e

DEST="/home/ec2-user/notes-app"
cd $DEST

# install dependencies on EC2 (fresh copy)
npm ci

# ensure permissions
chown -R ec2-user:ec2-user $DEST
