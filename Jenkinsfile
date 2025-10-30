/// <summary>
/// Jenkinsfile para despliegue automático del frontend Angular.
/// Usa entorno "staging" por defecto (sin depender de rama ni .env raíz)
/// </summary>
pipeline {
    agent any

    environment {
        ENVIRONMENT = 'staging'              // 🔹 Forzamos staging
        ENV_DIR = "devops/staging"
        ENV_FILE = "devops/staging/.env"
        COMPOSE_FILE = "devops/staging/docker-compose.yml"
        IMAGE_NAME = "appointments-front-staging"
    }

    stages {

        stage('Checkout código fuente') {
            steps {
                echo "📥 Clonando repositorio del frontend..."
                checkout scm
            }
        }

        stage('Mostrar configuración detectada') {
            steps {
                echo """
                🌍 Entorno: ${ENVIRONMENT}
                📁 Archivo env: ${ENV_FILE}
                📄 Archivo compose: ${COMPOSE_FILE}
                🧱 Imagen: ${IMAGE_NAME}
                """
            }
        }

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

        stage('Desplegar contenedor Angular') {
            steps {
                dir("${env.ENV_DIR}") {
                    sh '''
                        echo "🚀 Desplegando entorno ${ENVIRONMENT}..."
                        docker compose --env-file ${ENV_FILE} down || true
                        docker compose --env-file ${ENV_FILE} up -d --build
                    '''
                }
            }
        }
    }

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
