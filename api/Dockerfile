# Use the official OpenJDK image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy the application JAR
COPY target/*.jar /app/release.jar

# Expose the application port
EXPOSE 8080

# Run the Java application
CMD ["java", "-jar", "/app/release.jar"]
