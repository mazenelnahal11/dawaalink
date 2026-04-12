FROM maven:3.9-eclipse-temurin-17-alpine as build
WORKDIR /app

# Copy pom and resolve dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src src
RUN mvn package -DskipTests

# Production image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# V-19: Run as non-root user for defense-in-depth
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

COPY --from=build /app/target/*.jar app.jar
RUN chown appuser:appgroup app.jar

USER appuser

# Expose standard Spring Boot port
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
