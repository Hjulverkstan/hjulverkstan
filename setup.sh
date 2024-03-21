echo "Configuring our git hooks"
git config core.hooksPath .hooks

echo "Common LF endings in project"
git config --global core.autocrlf false
git config --global core.eol lf