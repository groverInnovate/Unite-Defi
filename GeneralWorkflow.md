## The General Workflow 

### 1. Sync Your Local Repository

```
# Switch to your main branch
git checkout main

# Pull the latest changes from the remote
git pull origin main
```


### 2. Create a New Branch


```
# Create and switch to a new branch in one command
git checkout -b <your-branch-name>
```

### 3. Commit your work & Keep pulling main branch

```
git commit -m ""
git pull origin main

```

### 4. Push your branch to the remote

```
# The -u flag sets the upstream branch for future pushes

git push -u origin <your-branch-name>

```

### 5. Open a pull request

### 6. Review and Merge


### 7. Clean Up


```
# Switch back to the main branch
git checkout main

# Pull the newly merged changes
git pull origin main

```