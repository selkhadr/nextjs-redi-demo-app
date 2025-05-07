#!/bin/bash

# This script sets up and runs the Next.js Redis Demo application

# Print colorful messages
print_message() {
  echo -e "\e[1;34m==>\e[0m \e[1m$1\e[0m"
}

print_success() {
  echo -e "\e[1;32m==>\e[0m \e[1m$1\e[0m"
}

print_error() {
  echo -e "\e[1;31m==>\e[0m \e[1m$1\e[0m"
}