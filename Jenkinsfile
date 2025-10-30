pipeline {
    agent any

    environment {
        DOTNET_NOLOGO = '1'
        ENVIRONMENT = ''
        ENV_DIR = ''
        ENV_FILE = ''
        COMPOSE_FILE = ''
        IMAGE_NAME = ''
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
                    def envFileRoot = '.env'
                    
                    echo "🔍 Verificando existencia del archivo .env raíz..."
                    if (!fileExists(envFileRoot)) {
                        error "❌ No existe el archivo .env raíz en el proyecto."
                    }

                    echo "📖 Leyendo archivo .env..."
                    def rawContent = readFile(envFileRoot)
                    echo "📄 Contenido del .env:\n${rawContent}"
                    
                    // Limpiar contenido
                    def cleanContent = rawContent
                        .replaceAll('\uFEFF', '')
                        .replaceAll('\r', '')
                        .trim()

                    echo "🧹 Contenido limpio:\n${cleanContent}"

                    // Buscar ENVIRONMENT
                    def matcher = cleanContent =~ /(?m)^\s*ENVIRONMENT\s*=\s*([^\s#]+)/
                    
                    if (matcher.find()) {
                        def detectedEnv = matcher.group(1).trim()
                        echo "✅ ENVIRONMENT encontrado: '${detectedEnv}'"
                        
                        // Validar que sea un entorno válido
                        if (detectedEnv in ['staging', 'qa', 'prod', 'develop']) {
                            env.ENVIRONMENT = detectedEnv
                        } else {
                            error "❌ ENVIRONMENT='${detectedEnv}' no es válido. Use: staging, qa, prod o develop"
                        }
                    } else {
                        error "❌ No se encontró ENVIRONMENT en .env. Formato esperado: ENVIRONMENT=staging"
                    }

                    // Configurar rutas
                    env.ENV_DIR = "devops/${env.ENVIRONMENT}"
                    env.ENV_FILE = "${env.ENV_DIR}/.env"
                    env.COMPOSE_FILE = "${env.ENV_DIR}/docker-compose.yml"
                    env.IMAGE_NAME = "appointments-front-${env.ENVIRONMENT}"

                    echo """
                    ✅ Configuración del entorno:
                    🎯 Entorno: ${env.ENVIRONMENT}
                    📁 Directorio: ${env.ENV_DIR}
                    📄 Archivo env: ${env.ENV_FILE}
                    🐳 Compose: ${env.COMPOSE_FILE}
                    🧱 Imagen: ${env.IMAGE_NAME}
                    """

                    // Verificar que existan los archivos del entorno
                    if (!fileExists(env.ENV_FILE)) {
                        error "❌ No existe ${env.ENV_FILE}"
                    }
                    if (!fileExists(env.COMPOSE_FILE)) {
                        error "❌ No existe ${env.COMPOSE_FILE}"
                    }
                }
            }
        }

        stage('Construir imagen Angular') {
            steps {
                script {
                    echo "🧱 Construyendo imagen Angular (${env.ENVIRONMENT})..."
                    
                    sh """
                        set -e
                        echo "📋 Verificando archivo ${ENV_FILE}..."
                        cat ${ENV_FILE}
                        
                        echo "🔍 Extrayendo API_BASE_URL..."
                        API_BASE_URL=\$(grep '^API_BASE_URL' ${ENV_FILE} | cut -d '=' -f2 | tr -d ' "')
                        
                        if [ -z "\$API_BASE_URL" ]; then
                            echo "⚠️  API_BASE_URL vacío, usando valor por defecto"
                            API_BASE_URL="http://localhost:8080"
                        fi
                        
                        echo "🌐 API_BASE_URL=\$API_BASE_URL"
                        echo "🧱 Imagen: ${IMAGE_NAME}:latest"
                        
                        docker build -t ${IMAGE_NAME}:latest \
                            --build-arg NODE_ENV=${ENVIRONMENT} \
                            --build-arg API_BASE_URL=\$API_BASE_URL \
                            -f Dockerfile .
                    """
                }
            }
        }

        stage('Desplegar contenedor Angular') {
            steps {
                dir("${env.ENV_DIR}") {
                    sh """
                        set -e
                        echo "🚀 Desplegando entorno ${ENVIRONMENT}..."
                        echo "📂 Directorio actual: \$(pwd)"
                        echo "📄 Archivos disponibles:"
                        ls -la
                        
                        docker compose --env-file .env down || true
                        docker compose --env-file .env up -d --build
                        
                        echo "✅ Contenedores desplegados:"
                        docker compose --env-file .env ps
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