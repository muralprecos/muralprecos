FROM eclipse-temurin:11-jdk
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
RUN bash -c 'touch /app.jar'

# JAVA_OPTS pode ser sobrescrito no deploy. Padrões:
#  - MaxRAMPercentage=75: usa 75% da memória do container como heap (ajuste o limite do container).
#  - ExitOnOutOfMemoryError: em vez de virar zumbi com o pool/threads mortos, o processo
#    encerra e o orquestrador reinicia o container.
#  - HeapDumpOnOutOfMemoryError: despeja o heap em /tmp para diagnóstico.
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp"

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar"]
