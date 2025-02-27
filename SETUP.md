# Setup local development

## Prerequisite overview

- Node.js v20
- Postgres v14
- JDK v21
- Git

## Prerequisite steps

### Postgres


Run the [Postgres Installer](https://www.postgresql.org/download/):

1. Proceed by clicking next.
2. Speficy a password and write it down.
3. Unclick the Stack Builder.
4. Finnish the installer.

Create the database:

1. Open psql, on windows it is a seperate program, on linux/mac you can run `psql -U root -p`
2. Enter the password you specified in the installer
3. Create the database by running in the prompt:
   ```sql
   CREATE DATABASE hjulverkstan;
   ```
4. Verify that the table exists
   ```sql
   \l
   ```
   
### Node.js

Run the [Node Installer](https://nodejs.org/en)

### Git

On Windows you need to install [git for Windows/git bash](https://git-scm.com/downloads/win) yourself .

## Setup git repository

### Clone the repo

On Windows open Git Bash, for linux/mac just use the terminal of choice.

```bash
git clone https://github.com/Hjulverkstan/hjulverkstan.git
```

### Set git config [important!]

Run the setup shell script:

```bash
sh ./setup.sh
```

### Configure the database connection variables

Copy the `main/env.properties.template` to `main/env.properties` and make sure the values match your postgres configuration.

## Run the project

### IntelliJ IDEA Ultimate

**1.** Install [IDEA Ultimate](https://www.jetbrains.com/idea/download/) for your OS of choice and activate your licence.

**2.** Open cloned repository in IDEA

**3.** Navigate to the file `main/src/main/java/se/hjulverkstan/main/MainApplication` and install the JDK from the banner in the code editor. (this way you do not have to do it manually. In case you lose this banner you can always create a new java project in IDEA and install the JDK from there).

**4.** Run the backend and frontend from the run toolbar.

### From terminal

#### Install JDK

#### Windows

Install OpenJDK v21 from Command Prompt / Powershell using the built in Windows package manager:

```bash
winget install --name EclipseAdoptium.Temurin.21.JDK
```

#### MacOS

Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

And then OpenJDK v21

```bash
brew install openjdk@21
```

#### Linux

Download and install from [JDK Archive](https://jdk.java.net/archive/)

### Run the stack

#### Backend

```bash
cd main
./mvn spring-boot:run -D spring-boot.run.profiles=dev
```

#### Frontend

```bash
cd web
npm run dev
```

Click on the link that has the form of http://localhost:5173
The hjulverkstan page will open up.
Click on 'Go to Portal' to log into the Portal.
Use admin as username and password as password.