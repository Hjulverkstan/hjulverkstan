# Setup local development

## Prerequisite overview

- Node.js v22 (minimum)
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

### Configure the environment variables 

Copy the `.env.template` to `.env`, it should be plug and play except for s3 functionality, for this you will need to acuire the AWS secrets by a permitted developer.

> If using IntelliJ IDEA Ultimate the .idea folder will already have a run configuration configured that will read automatically from the .env file.

## Run the project

### IntelliJ IDEA Ultimate

**1.** Install [IDEA Ultimate](https://www.jetbrains.com/idea/download/) for your OS of choice and activate your licence.

**2.** Open cloned repository in IDEA

**3.** Navigate to the file `main/src/main/java/se/hjulverkstan/main/MainApplication` and install the JDK from the banner in the code editor. (this way you do not have to do it manually. In case you lose this banner you can always create a new java project in IDEA and install the JDK from there).

**4.** Run the backend and frontend from the run toolbar.

### IntelliJ IDEA Comunity Edition

In community edition there is no built-in run configuration for spring but using the maven runner works fine. We do not have one commited to the `.idea` directory but should be straight forward to setup. Remember to:

- set the spring profile to `dev`
- apply the environment variables

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

From bash (or git bash on windows):

```bash
export $(grep -v '^#' .env | xargs)
```

This will populate the environment variables configured in the previous [step](#configure-the-environment-variables-).

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
