/// <summary>
/// Jenkinsfile genérico y robusto para despliegue automático del frontend Angular.
/// Detecta el entorno desde el archivo `.env` raíz (ENVIRONMENT=staging|qa|prod|develop)
/// y usa los archivos dentro de devops/{entorno}/
/// </summary>
pipeline {
    agent any

    environment {
        DOTNET_NOLOGO = '1'
    }

    stages {

        // ============================================================
        // 1️⃣ CHECKOUT
        // ============================================================
        stage('Checkout código fuente') {
            steps {
                echo "📥 Clonando repositorio del frontend..."
                checkout scm
            }
        }

        // ============================================================
        // 2️⃣ DETECTAR ENTORNO DESDE .ENV RAÍZ
        // ============================================================
        stage('Detectar entorno') {
            steps {
                script {
                    echo "🔍 Verificando existencia del archivo .env raíz..."
                    def envFileRoot = '.env'

                    if (!fileExists(envFileRoot)) {
                        error "❌ No existe el archivo .env raíz en el proyecto."
                    }

                    echo "📖 Leyendo archivo .env..."
                    def raw = readFile(envFileRoot)
                        .replaceAll('\uFEFF', '')   // elimina BOM
                        .replaceAll('\r', '')       // elimina retorno de carro
                        .trim()

                    echo "📄 Contenido del .env:\n${raw}"

                    def environmentLine = raw.readLines()
                        .find { it.trim().startsWith("ENVIRONMENT=") }

                    if (!environmentLine) {
                        error "❌ No se encontró ENVIRONMENT en el archivo .env raíz (asegúrate de tener 'ENVIRONMENT=staging')"
                    }

                    // ✅ Usa env."VAR" para asegurar persistencia real en Jenkins
                    env."ENVIRONMENT" = environmentLine.split("=")[1].trim()
                    env."ENV_DIR" = "devops/${env.ENVIRONMENT}"
                    env."ENV_FILE" = "${env.ENV_DIR}/.env"
                    env."COMPOSE_FILE" = "${env.ENV_DIR}/docker-compose.yml"
                    env."IMAGE_NAME" = "appointments-front-${env.ENVIRONMENT}"

                    echo """
                    ✅ Configuración detectada:
                    🌍 Entorno: ${env.ENVIRONMENT}
                    📁 Directorio: ${env.ENV_DIR}
                    📄 Archivo env: ${env.ENV_FILE}
                    🐳 Compose: ${env.COMPOSE_FILE}
                    🧱 Imagen: ${env.IMAGE_NAME}
                    """
                }
            }
        }

        // ============================================================
        // 3️⃣ BUILD ANGULAR
        // ============================================================
        stage('Construir imagen Angular') {
            steps {
                script {
                    sh '''
                        echo "🧱 Construyendo imagen Angular (${ENVIRONMENT})..."
                        if [ ! -f "${ENV_FILE}" ]; then
                            echo "❌ No se encontró el archivo de entorno: ${ENV_FILE}"
                            exit 1
                        fi

                        API_BASE_URL=$(grep API_BASE_URL ${ENV_FILE} | cut -d "=" -f2)
                        echo "🌐 API_BASE_URL=${API_BASE_URL}"

                        docker build -t ${IMAGE_NAME}:latest \
                            --build-arg NODE_ENV=${ENVIRONMENT} \
                            --build-arg API_BASE_URL=${API_BASE_URL} \
                            -f Dockerfile .
                    '''
                }
            }
        }

        // ============================================================
        // 4️⃣ DEPLOY ANGULAR (corregido: sin rutas duplicadas)
        // ============================================================
        stage('Desplegar contenedor Angular') {
            steps {
                script {
                    echo "🚀 Desplegando entorno ${env.ENVIRONMENT}..."

                    sh """
                        docker compose \
                            --file ${env.COMPOSE_FILE} \
                            --env-file ${env.ENV_FILE} \
                            down || true

                        docker compose \
                            --file ${env.COMPOSE_FILE} \
                            --env-file ${env.ENV_FILE} \
                            up -d --build
                    """
                }
            }
        }
    }

    // ============================================================
    // 5️⃣ POST ACTIONS
    // ============================================================
    post {
        success {
            echo "✅ Despliegue completado correctamente (${env.ENVIRONMENT})"
        }
        failure {
            echo "💥 Error durante el despliegue del frontend (${env.ENVIRONMENT})"
        }
        always {
            echo "🧹 Limpieza final completada."
        }
    }
}
