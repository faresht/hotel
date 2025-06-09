#!/bin/bash

# Ensure we're using Java 17 for compilation
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
echo "Current Java version: $java_version"

if [[ $java_version != 17* ]]; then
  echo "Warning: You are not using Java 17. This may cause compatibility issues."
  echo "Please install Java 17 and set it as your default Java version."
  echo "Continuing with current Java version, but this may not work correctly."
fi

# Make the Maven wrapper executable
chmod +x ./mvnw

# Clean and package the application
echo "Building the application with Maven Wrapper..."
./mvnw clean package -DskipTests

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful! The JAR file is in the target directory."
else
  echo "Build failed. Please check the error messages above."
fi
