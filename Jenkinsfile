pipeline {
    agent any

    environment {
        NODE_ENV = ''
        IMAGE_NAME = ''
        ENV_DIR = ''
        ENV_FILE = ''
        COMPOSE_FILE = ''
        ENVIRONMENT = ''
    }

    stages {

        stage('Checkout código fuente') {
            steps {
                echo "📥 Clonando repositorio del frontend..."
                checkout scm
            }
        }

        stage('Detectar entorno') {
            steps {
                script {
                    // ✅ 1. Intentar leer el .env raíz si existe
                    def envFileRoot = '.env'
                    if (fileExists(envFileRoot)) {
                        def envContent = readFile(envFileRoot).trim()
                        for (line in envContent.split('\n')) {
                            if (line.startsWith('ENVIRONMENT=')) {
                                env.ENVIRONMENT = line.replace('ENVIRONMENT=', '').trim()
                            }
                        }
                    }

                    // ✅ 2. Si sigue vacío, usar rama o fallback
                    if (!env.ENVIRONMENT?.trim()) {
                        def branch = env.BRANCH_NAME ?: 'staging'
                        switch (branch) {
                            case 'main':    env.ENVIRONMENT = 'prod'; break
                            case 'qa':      env.ENVIRONMENT = 'qa'; break
                            case 'staging': env.ENVIRONMENT = 'staging'; break
                            default:        env.ENVIRONMENT = 'develop'; break
                        }
                    }

                    // ✅ 3. Variables derivadas
                    env.ENV_DIR = "devops/${env.ENVIRONMENT}"
                    env.ENV_FILE = "${env.ENV_DIR}/.env"
                    env.COMPOSE_FILE = "${env.ENV_DIR}/docker-compose.yml"
                    env.IMAGE_NAME = "appointments-front-${env.ENVIRONMENT}"

                    echo """
                    ✅ Rama detectada: ${env.BRANCH_NAME ?: 'null'}
                    🌍 Entorno asignado: ${env.ENVIRONMENT}
                    📄 Archivo compose: ${env.COMPOSE_FILE}
                    📁 Archivo env: ${env.ENV_FILE}
                    🧱 Imagen: ${env.IMAGE_NAME}
                    """
                }
            }
        }

        stage('Construir imagen Angular') {
            steps {
                script {
                    sh '''
                        echo "🧱 Construyendo imagen Angular (${ENVIRONMENT})..."
                        API_BASE_URL=$(grep API_BASE_URL ${ENV_FILE} | cut -d "=" -f2)
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
