# GitHub Guidelines for OrgSpace

This document outlines Git and GitHub conventions, commit message standards, branch naming rules, and essential commands for contributing to the OrgSpace project.

## 📝 Commit Message Conventions

### Format
```
<type>: <description>

[optional body]

[optional footer]
```

### Types

| Type | Purpose | Example |
|-------|---------|---------|
| **feat** | New feature | `feat: add user profile page` |
| **fix** | Bug fix | `fix: resolve crash on login` |
| **docs** | Documentation only | `docs: update README setup steps` |
| **style** | Formatting, no logic change | `style: format code with prettier` |
| **refactor** | Code change, no new feature or bug fix | `refactor: simplify order service` |
| **perf** | Performance improvement | `perf: optimize query for orders` |
| **test** | Add or update tests | `test: add auth service tests` |
| **chore** | Tooling, config, dependencies | `chore: update eslint config` |
| **ci** | CI/CD changes | `ci: add github actions workflow` |
| **build** | Build system or dependencies | `build: upgrade vite to v5` |

### Examples

#### Good Commit Messages
```bash
feat: add organization management module
- Add organization CRUD operations
- Implement organization listing page
- Add organization creation form

fix: resolve authentication redirect issue
Users were being redirected to wrong page after login

docs: update API documentation
Add new endpoints for organization management

refactor: extract user service logic
Separate business logic from controller layer
```

#### Bad Commit Messages
```bash
fixed stuff
add files
bug fix
update
wip
```

## 🌿 Branch Naming Conventions

### Format
```
<type>: <feature-name>
```

### Types
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions
- `chore:` - Maintenance tasks

### Examples
```bash
feat: organization-module
feat: user-authentication
fix: login-validation
docs: api-documentation
refactor: user-service
test: auth-tests
chore: update-dependencies
```

### Branch Rules
- **Never push directly to `main`**
- **All changes require Pull Request**
- **Lead Developer approval required for `main` merge**
- **Delete feature branches after merge**
- **Keep branches up-to-date with main**

## 🔄 Essential Git Commands

### Basic Workflow
```bash
# Clone repository
git clone <repository-url>

# Check current branch
git branch

# Switch to branch
git checkout <branch-name>

# Create new branch
git checkout -b feat:your-feature-name

# Check status
git status

# Add files to staging
git add .
git add <specific-file>

# Commit changes
git commit -m "feat: add your feature description"

# Push to remote
git push origin feat:your-feature-name
```

### Synchronization
```bash
# Fetch latest changes from remote
git fetch

# Pull latest changes from main
git pull origin main

# Update current branch with latest main
git rebase origin main

# Merge main into current branch
git merge main
```

### Branch Management
```bash
# List all branches (local and remote)
git branch -a

# Delete local branch
git branch -d <branch-name>

# Delete remote branch
git push origin --delete <branch-name>

# Rename branch
git branch -m <old-name> <new-name>
```

### History & Logs
```bash
# Show commit history
git log

# Show commit history with graph
git log --graph --oneline --all

# Show specific commit details
git show <commit-hash>

# Show file changes in commit
git show --name-only <commit-hash>
```

### Undo & Reset
```bash
# Unstage files
git reset

# Reset to specific commit (keep changes)
git reset --soft <commit-hash>

# Reset to specific commit (discard changes)
git reset --hard <commit-hash>

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard unstaged changes
git checkout -- <file>
```

## 🔄 Pull Request Process

### 1. Create Pull Request
```bash
# Ensure branch is up-to-date
git fetch origin
git rebase origin main

# Push your branch
git push origin feat:your-feature-name

# Create PR on GitHub with:
# - Clear title following commit convention
# - Detailed description
# - Link to related issues
```

### 2. PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested manually
- [ ] Unit tests pass
- [ ] Integration tests pass

## Checklist
- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

### 3. Review Process
- **Code Review**: Required from at least one team member
- **Lead Approval**: Required for `main` branch merge
- **CI/CD**: All checks must pass
- **Conflict Resolution**: Resolve before merge

## 🚨 Repository Rules

### Branch Protection
- **`main` branch**: Protected
- **Required approvals**: Lead Developers
- **Required status checks**: CI/CD pipeline
- **Force pushes**: Disabled
- **Deletions**: Disabled

### Pull Request Requirements
- **Minimum reviewers**: 1
- **Required approvals**: Lead Developer
- **Dismiss stale reviews**: Enabled
- **Auto-merge**: Disabled

## 🛠️ Git Configuration

### Setup
```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set default editor
git config --global core.editor "code --wait"
```

### Aliases (Optional)
```bash
# Common aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
git config --global alias.cm "commit -m"
git config --global alias.unstage "reset HEAD --"
git config --global alias.last "log -1 HEAD"
git config --global alias.graph "log --graph --oneline --all"
```

## 📋 Pre-commit Checklist

Before committing, ensure:

- [ ] Code follows [FileStructure.md](./FileStructure.md) conventions
- [ ] Commit message follows convention
- [ ] Tests pass locally
- [ ] No console errors
- [ ] Documentation updated if needed
- [ ] Sensitive data not committed
- [ ] Branch is up-to-date with main

## 🔄 Workflow Example

### Feature Development
```bash
# 1. Start new feature
git checkout main
git pull origin main
git checkout -b feat:user-profile

# 2. Make changes
# ... develop feature ...

# 3. Commit changes
git add .
git commit -m "feat: add user profile page
- Add profile information display
- Implement profile editing
- Add profile picture upload"

# 4. Keep branch updated
git fetch origin
git rebase origin main

# 5. Push and create PR
git push origin feat:user-profile
# Create PR on GitHub

# 6. After merge
git checkout main
git pull origin main
git branch -d feat:user-profile
```

## 🚨 Common Issues & Solutions

### Merge Conflicts
```bash
# During rebase or merge
git status
# Resolve conflicts in files
git add .
git rebase --continue  # or git commit for merge
```

### Force Push (Avoid if possible)
```bash
# Only when necessary (e.g., after rebase)
git push --force-with-lease origin feat:branch-name
```

### Undo Last Push
```bash
# Remove last commit from remote
git reset --hard HEAD~1
git push --force-with-lease
```

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [OrgSpace File Structure](./FileStructure.md)

---

**Remember**: Clean commits, clear messages, and proper branching make collaboration easier for everyone!
