# ---- Build stage ----
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /workspace

# 1) Copy only what's needed to cache dependencies first
COPY pom.xml ./

# Prefetch dependencies (go offline)
RUN mvn -B -DskipTests dependency:go-offline

# 2) Copy sources and build
COPY src ./src

# Can be overridden at build time but set to true since tests run separately in CI
ARG SKIP_TESTS=true
RUN mvn -B clean package -DskipTests=${SKIP_TESTS}

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Can be overridden to inject java opts
ENV JAVA_OPTS=""

RUN addgroup -S app && adduser -S app -G app
COPY --from=build /workspace/target/hjulverkstan.jar /app/hjulverkstan.jar
EXPOSE 8080

HEALTHCHECK --interval=5s --timeout=3s --retries=12 \
  CMD wget -qO- http://localhost:8080/actuator/health | grep -q '"status":"UP"'

USER app
CMD ["sh","-c","java $JAVA_OPTS -jar /app/hjulverkstan.jar"]