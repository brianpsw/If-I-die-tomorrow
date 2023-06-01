def getGitHub() {
    return github(endpoint: 'https://api.github.com', credentialsId: 'github2')
}

def updateGitHubStatus(status) {
    def github = getGitHub()
    def sha = env.GITHUB_SHA

    github.createCommitStatus(
        env.ghprbActualCommit,
        status,
        context: 'Jenkins CI',
        description: "Jenkins build ${status}",
        targetUrl: env.BUILD_URL
    )
}


pipeline {
    agent any
    stages {
        stage('Checkout') {

            steps {
                echo "Branch Name: ${env.BRANCH_NAME} ${env.CHANGE_TARGET} ${env.CHANGE_BRANCH} test8"
                git credentialsId: 'github2', url: 'https://github.com/brianpsw/If-I-die-tomorrow.git'
            }
        }
        
        stage('Sonar Analysis-fe') {
            when {
                allOf {
                    expression { env.CHANGE_TARGET == 'develop-fe' }
                    expression { env.BRANCH_NAME ==~ /^PR-.*/ }
                }
            }
            environment {
                SCANNER_HOME = tool 'a307'
            }
          
            steps {
                
                sh """
                git checkout -b ${env.CHANGE_BRANCH} origin/${env.CHANGE_BRANCH} || true
                git switch ${env.CHANGE_BRANCH}
                git pull
                git checkout -b ${env.CHANGE_TARGET} origin/${env.CHANGE_TARGET} || true
                git switch ${env.CHANGE_TARGET}
                git pull
                git tag v1
                git merge ${env.CHANGE_BRANCH}
                """     
                
                withSonarQubeEnv('SonarQube-local'){
              
                    sh '''
                    ${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=${PROJECT_KEY_FE} \
                    -Dsonar.sources=Frontend/ \
                    -Dsonar.host.url=${SONAR_URL} \
                    -Dsonar.login=${SONAR_TOKEN_FE}
                    '''
                }
            }
            post {
                failure {
                    sh """
                    git reset --hard v1
                    git tag -d v1
                    """
                }
            }
        }

        stage('Sonar Analysis-be') {
            when {
                allOf {
                    expression { env.CHANGE_TARGET == 'develop-be' }
                    expression { env.BRANCH_NAME ==~ /^PR-.*/ }
                }
            }
            environment {
                SCANNER_HOME = tool 'a307'
            }
          
            steps {
                
                sh """
                git checkout -b ${env.CHANGE_BRANCH} origin/${env.CHANGE_BRANCH} || true
                git switch ${env.CHANGE_BRANCH}
                git pull
                git checkout -b ${env.CHANGE_TARGET} origin/${env.CHANGE_TARGET} || true
                git switch ${env.CHANGE_TARGET}
                git pull
                git tag v1
                git merge ${env.CHANGE_BRANCH}
                """                
                withSonarQubeEnv('SonarQube-local'){
              
                    sh '''
                    ${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=${PROJECT_KEY} \
                    -Dsonar.sources=. \
                    -Dsonar.java.binaries=./Backend/ifIDieTomorrow/build/classes/java/ \
                    -Dsonar.host.url=${SONAR_URL} \
                    -Dsonar.login=${SONAR_TOKEN}
                    '''
                }
            }
            post {
                failure {
                    sh """
                    git reset --hard v1
                    git tag -d v1
                    """
                }
            }
        }

        stage('BE Test') {
            when {
                allOf {
                    expression { env.CHANGE_TARGET == 'develop-be' }
                    expression { env.BRANCH_NAME ==~ /^PR-.*/ }
                }
            }
            steps {
                echo 'BE Testing...'
                sh """
                cd Backend/ifIDieTomorrow
                chmod +x gradlew
                ./gradlew clean test
                """
            }
            post {
                always {
                    sh """
                    git reset --hard v1
                    git tag -d v1
                    """
                    junit 'Backend/ifIDieTomorrow/build/test-results/**/*.xml'
                }
            }
        }

        stage('FE Test') {
            when {
                allOf {
                    expression { env.CHANGE_TARGET == 'develop-fe' }
                    expression { env.BRANCH_NAME ==~ /^PR-.*/ }
                }
            }
            steps {
                echo 'FE Testing...'
                sh """
                git status
                cd Frontend/frontend
                npm install --force && CI= npm run build
                """
            }
            post {
                always {
                    sh """
                    git reset --hard v1
                    git tag -d v1
                    """
                }
            }
        }
  

        stage('SonarQube Quality Gate'){
            when {
                branch 'PR-*'
            }
            steps{
                timeout(time: 1, unit: 'MINUTES') {
                    script{
                        echo "Start~~~~"
                        def qg = waitForQualityGate()
                        echo "Status: ${qg.status}"
                        if(qg.status != 'OK') {
                            echo "NOT OK Status: ${qg.status}"
                            updateGithubStatus('failure')
                            error "Pipeline aborted due to quality gate failure: ${qg.status}"
                        } else{
                            echo "OK Status: ${qg.status}"
                            updateGithubStatus('success')
                        }
                        echo "End~~~~"
                    }
                }
            }
        }
   
        stage('FE Dockerizing'){
            when {
                branch 'develop-fe'
            }
            steps{
                sh 'echo " Image Bulid Start"'
                sh '''
                git checkout -b develop-fe origin/develop-fe
                git pull
                cd Frontend/frontend
                docker build -t front-react .
                '''
            }
            post {
                success {
                    sh 'echo "Bulid FE Docker Image Success"'
                }

                failure {
                    sh 'echo "Bulid FE Docker Image Fail"'
                }
            }
        }

        stage('BE Dockerizing'){
            when {
                branch 'develop-be'
            }
            steps{
                sh 'echo " Image Bulid Start"'
                sh '''
                git checkout -b develop-be origin/develop-be
                git pull
                cd Backend/ifIDieTomorrow
                docker build -t back-springboot -f ./DockerFile .
                '''
            }
            post {
                success {
                    sh 'echo "Bulid BE Docker Image Success"'
                }

                failure {
                    sh 'echo "Bulid BE Docker Image Fail"'
                }
            }
        }
        
        stage('Docker FE Rm') {
            when {
                branch 'develop-fe'
            }
            steps {
                sh 'echo "Docker FE Rm Start"'
                sh """
                docker stop front-react || true
                docker rm front-react || true
                """
            }

            post {
                success {
                    sh 'echo "Docker FE Rm Success"'
                }
                failure {
                    sh 'echo "Docker FE Rm Fail"'
                }
            }
        }
        stage('Docker BE Rm') {
            when {
                branch 'develop-be'
            }
            steps {
                sh 'echo "Docker BE Rm Start"'
                sh """
                docker stop back-springboot || true
                docker rm back-springboot || true
                """
            }

            post {
                success {
                    sh 'echo "Docker BE Rm Success"'
                }
                failure {
                    sh 'echo "Docker BE Rm Fail"'
                }
            }
        }
        
        

        stage('BE Deploy') {
            when {
                branch 'develop-be'
            }
            steps {
                sh 'docker run -d -p 8000:8443 --name back-springboot --env-file .env -e TZ=Asia/Seoul --network my-network back-springboot'
            }

            post {
                success {
                    echo 'success'
                }

                failure {
                    echo 'failed'
                }
            }
        }

        stage('FE Deploy') {
            when {
                branch 'develop-fe'
            }
            steps {
                sh 'docker run -d -p 3000:3000 --name front-react --env-file .env -e TZ=Asia/Seoul --network my-network front-react'
            }

            post {
                success {
                    echo 'success'
                }

                failure {
                    echo 'failed'
                }
            }
        }
    }
}
