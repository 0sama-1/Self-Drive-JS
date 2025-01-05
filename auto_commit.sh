#!/bin/bash

# Check if a commit message is passed as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <commit_message>"
  exit 1
fi

# Store the commit message
commit_message="$1"

# Add all changes to the staging area
git add --all

# Commit the changes with the provided message
git commit -m "$commit_message"

# Push the changes to the remote repository
git push

# Notify the user
echo "All changes have been committed and pushed with the message: '$commit_message'."
