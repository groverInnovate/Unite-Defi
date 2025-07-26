## The General Workflow 

### 1. Sync Your Local Repository

Make sure your local copy of the main branch is up-to-date with the remote repository on GitHub/GitLab, before starting


```
# Switch to your main branch
git checkout main

# Pull the latest changes from the remote
git pull origin main
```


### 2. Create a New Branch

Create a new branch for your work.


```
# Create and switch to a new branch in one command
git checkout -b <your-branch-name>
```

### 3. Commit your work

### 4. Push your branch to the remote

```
# The -u flag sets the upstream branch for future pushes
git push -u origin <your-branch-name>

```

### 5. Open a pull request

### 6. Review and Merge


