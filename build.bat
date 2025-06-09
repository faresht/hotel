@echo off
echo Checking Java version...
java -version 2>&1 | findstr "version"

echo Building the application with Maven Wrapper...
mvnw.cmd clean package -DskipTests

if %ERRORLEVEL% == 0 (
    echo Build successful! The JAR file is in the target directory.
) else (
    echo Build failed. Please check the error messages above.
)
