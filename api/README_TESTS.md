# Test Instructions - Hjulverkstan API

Due to environment-specific conflicts between Maven Surefire and the Windows filesystem (such as file-locking and intermittent `NoSuchFileException` during test compilation), a specific two-step execution procedure is recommended to ensure build stability.

## Standard Execution Procedure

To run the full test suite reliably, execute the following two commands in sequence from the `api/` directory:

### Step 1: Clean and Compile
```powershell
.\mvnw.cmd clean compile
```

### Step 2: Execute Tests
```powershell
.\mvnw.cmd test "-Dmaven.main.skip=true" "-DforkCount=0" "-DreuseForks=false"
```

## Flag Explanation

The following flags are used to bypass local environment build conflicts and ensure stable execution on Windows:

| Flag | Purpose |
| :--- | :--- |
| `-Dmaven.main.skip=true` | Bypasses the main compilation phase during the test lifecycle to prevent the compiler from intermittently deleting or locking class files that were already built in Step 1. |
| `-DforkCount=0` | Runs tests in the same process as Maven. This prevents the creation of "zombie" Java processes and avoids Windows file-locking issues associated with separate JVM forks. |
| `-DreuseForks=false` | Ensures a clean environment for test execution by disabling fork reuse, further reducing the risk of shared resource conflicts. |

## Exception Handling Note

During the execution of `ExceptionsControllerTest`, you will see `ERROR` logs appearing in the console. These are **expected and intentional**. They confirm that the global error-handling logic is correctly catching and logging simulated failures as part of the validation process.

## Target Result

A successful run should result in:
- **Pass Rate**: 100% (typically 276+ tests).
- **Final Message**: `BUILD SUCCESS`

Following this procedure ensures that the static metamodels and application classes remain accessible throughout the entire test suite discovery and execution phases.
