# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /workspace

# 1) Cache dependencies separately (fast rebuilds)
COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -DskipTests dependency:go-offline

# 2) Copy sources and build
COPY src ./src

# Can be overridden at build time but set to true since tests run separately in CI
ARG SKIP_TESTS=true

RUN --mount=type=cache,target=/root/.m2 \
    mvn -B clean package -DskipTests=${SKIP_TESTS}

# 3) Sanity-check the artifact in the build image
RUN test -s target/hjulverkstan.jar

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Can be overridden to inject extra JVM opts at runtime
ENV JAVA_OPTS=""

RUN apk add --no-cache curl
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /workspace/target/hjulverkstan.jar /app/hjulverkstan.jar
EXPOSE 8080

HEALTHCHECK --interval=5s --timeout=3s --retries=12 \
  CMD curl -fsS http://localhost:8080/actuator/health | grep -q '"status":"UP"' || exit 1

USER app

CMD ["sh","-c","java $JAVA_OPTS -jar /app/hjulverkstan.jar"]