/// <summary>
/// Jenkinsfile genérico para despliegue automático del frontend Angular.
/// Detecta el entorno desde el archivo `.env` raíz (ENVIRONMENT=staging|qa|prod|develop)
/// y usa los archivos dentro de devops/{entorno}/
/// </summary>
pipeline {
    agent any

    environment {
        DOTNET_NOLOGO = '1'
        ENVIRONMENT = ''         // Se llenará dinámicamente
        ENV_DIR = ''
        ENV_FILE = ''
        COMPOSE_FILE = ''
        IMAGE_NAME = ''
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
                    def envFileRoot = '.env'
                    if (fileExists(envFileRoot)) {
                        def envLines = readFile(envFileRoot).split("\n")
                        for (line in envLines) {
                            if (line.startsWith("ENVIRONMENT=")) {
                                env.ENVIRONMENT = line.split("=")[1].trim()
                                break
                            }
                        }
                    }
                    if (!env.ENVIRONMENT?.trim()) {
                        error "❌ No se encontró ENVIRONMENT en el archivo .env raíz"
                    }

                    env.ENV_DIR = "devops/${env.ENVIRONMENT}"
                    env.ENV_FILE = "${env.ENV_DIR}/.env"
                    env.COMPOSE_FILE = "${env.ENV_DIR}/docker-compose.yml"
                    env.IMAGE_NAME = "appointments-front-${env.ENVIRONMENT}"

                    echo """
                    ✅ Entorno detectado: ${env.ENVIRONMENT}
                    📁 Archivo env: ${env.ENV_FILE}
                    📄 Archivo compose: ${env.COMPOSE_FILE}
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
        // 4️⃣ DEPLOY ANGULAR
        // ============================================================
        stage('Desplegar contenedor Angular') {
            steps {
                dir("${env.ENV_DIR}") {
                    sh '''
                        echo "🚀 Desplegando entorno ${ENVIRONMENT}..."
                        docker compose --env-file .env down || true
                        docker compose --env-file .env up -d --build
                    '''
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
