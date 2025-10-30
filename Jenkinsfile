/// <summary>
/// Jenkinsfile unificado para el frontend Angular.
/// Detecta automáticamente el entorno según la rama (develop, qa, staging, prod)
/// o desde el archivo .env raíz, y despliega usando los archivos dentro de devops/{entorno}.
/// </summary>

pipeline {
    agent any

    environment {
        DOTNET_NOLOGO = '1'
        NODE_ENV = ''
        IMAGE_NAME = ''
        ENV_DIR = ''
        ENV_FILE = ''
        COMPOSE_FILE = ''
        ENVIRONMENT = ''
    }

    stages {

        // =======================================================
        // 1️⃣ CHECKOUT
        // =======================================================
        stage('Checkout código fuente') {
            steps {
                echo "📥 Clonando repositorio del frontend..."
                checkout scm
            }
        }

        // =======================================================
        // 2️⃣ DETECTAR ENTORNO
        // =======================================================
        stage('Detectar entorno') {
            steps {
                script {
                    // 🔹 Intentar leer archivo .env raíz (si existe)
                    def envFileRoot = '.env'
                    if (fileExists(envFileRoot)) {
                        def envVars = readProperties file: envFileRoot
                        if (envVars['ENVIRONMENT']) {
                            env.ENVIRONMENT = envVars['ENVIRONMENT']
                        }
                    }

                    // 🔹 Si no hay ENVIRONMENT definido, usar la rama
                    if (!env.ENVIRONMENT?.trim()) {
                        switch (env.BRANCH_NAME) {
                            case 'main':    env.ENVIRONMENT = 'prod'; break
                            case 'staging': env.ENVIRONMENT = 'staging'; break
                            case 'qa':      env.ENVIRONMENT = 'qa'; break
                            default:        env.ENVIRONMENT = 'develop'; break
                        }
                    }

                    // 🔹 Variables derivadas
                    env.ENV_DIR = "devops/${env.ENVIRONMENT}"
                    env.ENV_FILE = "${env.ENV_DIR}/.env"
                    env.COMPOSE_FILE = "${env.ENV_DIR}/docker-compose.yml"
                    env.IMAGE_NAME = "appointments-front-${env.ENVIRONMENT}"

                    echo """
                    ✅ Rama detectada: ${env.BRANCH_NAME}
                    🌍 Entorno asignado: ${env.ENVIRONMENT}
                    📄 Archivo compose: ${env.COMPOSE_FILE}
                    📁 Archivo env: ${env.ENV_FILE}
                    🧱 Imagen: ${env.IMAGE_NAME}
                    """
                }
            }
        }

        // =======================================================
        // 3️⃣ CONSTRUIR IMAGEN ANGULAR
        // =======================================================
        stage('Construir imagen Angular') {
            steps {
                sh """
                    echo "🧱 Construyendo imagen Angular (${env.ENVIRONMENT})..."
                    docker build -t ${env.IMAGE_NAME}:latest \
                        --build-arg NODE_ENV=${env.ENVIRONMENT} \
                        --build-arg API_BASE_URL=$(grep API_BASE_URL ${env.ENV_FILE} | cut -d '=' -f2) \
                        -f Dockerfile .
                """
            }
        }

        // =======================================================
        // 4️⃣ DESPLEGAR CONTENEDOR
        // =======================================================
        stage('Desplegar contenedor Angular') {
            steps {
                dir("${env.ENV_DIR}") {
                    sh """
                        echo "🚀 Desplegando entorno ${env.ENVIRONMENT}..."
                        docker compose --env-file ${env.ENV_FILE} down || true
                        docker compose --env-file ${env.ENV_FILE} up -d --build
                    """
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
