pipeline {
    agent any

    options { 
        skipDefaultCheckout()
        gitLabConnection('gitlab') 
    }
    stages {
        stage('Clone') {

            steps {
                echo "Running ${env.gitlabSourceBranch} on ${env.gitlabTargetBranch}"
                echo "Clone ${env.gitlabActionType} ,   "
                git branch: "${env.gitlabSourceBranch}", credentialsId: 'test2', url: 'https://lab.ssafy.com/s08-final/S08P31A307.git'
            }
        }

        stage('BE Test') {
            when {
                anyOf{
                    expression { env.gitlabTargetBranch == 'develop-be' }
                    expression { env.gitlabTargetBranch == 'master' }
                }
            }
            steps {
                echo 'BE Testing...'
                sh """
                git checkout ${env.gitlabTargetBranch}
                git merge ${env.gitlabSourceBranch}
                cd Backend/ifIDieTomorrow
                chmod +x gradlew
                ./gradlew clean test
                git reset --hard HEAD~1
                """
            }
            post {
                always {
                    junit 'Backend/ifIDieTomorrow/build/test-results/**/*.xml'
                }
            }
        }

        stage('FE Test') {
            when {
                anyOf{
                    expression { env.gitlabTargetBranch == 'develop-fe' }
                    expression { env.gitlabTargetBranch == 'master' }
                }
            }
            steps {
                echo 'FE Testing...'
            }
        }

        stage('Sonar Analysis-fe') {
            when {
                anyOf{
                    expression { env.gitlabTargetBranch == 'develop-fe' }
                    expression { env.gitlabTargetBranch == 'master' }
                }
            }
            environment {
                SCANNER_HOME = tool 'a307'
            }
          
            steps {
                withSonarQubeEnv('SonarQube-local'){
              
                    sh '''
                    ${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=${PROJECT_KEY_FE} \
                    -Dsonar.sources=. \
                    -Dsonar.java.binaries=./Backend/ifIDieTomorrow/build/classes/java/ \
                    -Dsonar.host.url=${SONAR_URL} \
                    -Dsonar.login=${SONAR_TOKEN_FE}
                    '''
                }
            }
        }

        stage('Sonar Analysis-be') {
            when {
                anyOf{
                    expression { env.gitlabTargetBranch == 'develop-be' }
                    expression { env.gitlabTargetBranch == 'master' }
                }
            }
            environment {
                SCANNER_HOME = tool 'a307'
            }
          
            steps {
                withSonarQubeEnv('SonarQube-local'){
              
                    sh '''
                    ${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=${PROJECT_KEY} \
                    -Dsonar.sources=Backend/ \
                    -Dsonar.java.binaries=./Backend/ifIDieTomorrow/build/classes/java/ \
                    -Dsonar.host.url=${SONAR_URL} \
                    -Dsonar.login=${SONAR_TOKEN}
                    '''
                }
            }
        }

        stage('SonarQube Quality Gate'){
            when {
                anyOf{
                    expression { env.gitlabTargetBranch == 'develop-fe' }
                    expression { env.gitlabTargetBranch == 'develop-be' }
                    expression { env.gitlabTargetBranch == 'master' }
                }
            }
            steps{
                timeout(time: 1, unit: 'MINUTES') {
                    script{
                        echo "Start~~~~"
                        def qg = waitForQualityGate()
                        echo "Status: ${qg.status}"
                        if(qg.status != 'OK') {
                            echo "NOT OK Status: ${qg.status}"
                            updateGitlabCommitStatus(name: "SonarQube Quality Gate", state: "failed")
                            error "Pipeline aborted due to quality gate failure: ${qg.status}"
                        } else{
                            echo "OK Status: ${qg.status}"
                            updateGitlabCommitStatus(name: "SonarQube Quality Gate", state: "success")
                        }
                        echo "End~~~~"
                    }
                }
            }
        }
   
        
        stage('Docker FE Rm') {
            when {
                anyOf{
                    allOf{
                        expression { env.gitlabActionType == 'PUSH' }
                        expression { env.gitlabTargetBranch == 'master' }
                    }
                    allOf{
                        expression { env.gitlabTargetBranch == 'develop-fe' }
                        expression { env.gitlabActionType == 'PUSH' }
                    }
                }

            }
            steps {
                sh 'echo "Docker FE Rm Start"'
                sh """
                docker stop front-react || true
                docker rm front-react || true
                docker rmi -f front-react || true
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
                anyOf{
                    allOf{
                        expression { env.gitlabActionType == 'PUSH' }
                        expression { env.gitlabTargetBranch == 'master' }
                    }
                    allOf{
                        expression { env.gitlabTargetBranch == 'develop-be' }
                        expression { env.gitlabActionType == 'PUSH' }
                    }
                }

            }
            steps {
                sh 'echo "Docker BE Rm Start"'
                sh """
                docker stop back-springboot || true
                docker rm back-springboot || true
                docker rmi -f back-springboot || true
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
        
        stage('FE Dockerizing'){
            when {
                anyOf{
                    allOf{
                        expression { env.gitlabActionType == 'PUSH' }
                        expression { env.gitlabTargetBranch == 'master' }
                    }
                    allOf{
                        expression { env.gitlabTargetBranch == 'develop-fe' }
                        expression { env.gitlabActionType == 'PUSH' }
                    }
                }

            }
            steps{
                sh 'echo " Image Bulid Start"'
                sh '''
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
                anyOf{
                    allOf{
                        expression { env.gitlabActionType == 'PUSH' }
                        expression { env.gitlabTargetBranch == 'master' }
                    }
                    allOf{
                        expression { env.gitlabTargetBranch == 'develop-be' }
                        expression { env.gitlabActionType == 'PUSH' }
                    }
                }

            }
            steps{
                sh 'echo " Image Bulid Start"'
                sh '''
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

        stage('BE Deploy') {
            when {
                anyOf{
                    allOf{
                        expression { env.gitlabActionType == 'PUSH' }
                        expression { env.gitlabTargetBranch == 'master' }
                    }
                    allOf{
                        expression { env.gitlabTargetBranch == 'develop-be' }
                        expression { env.gitlabActionType == 'PUSH' }
                    }
                }

            }
            steps {
                sh 'docker run -d -p 8000:8443 --name back-springboot --env-file .env --network my-network back-springboot'
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
                anyOf{
                    allOf{
                        expression { env.gitlabActionType == 'PUSH' }
                        expression { env.gitlabTargetBranch == 'master' }
                    }
                    allOf{
                        expression { env.gitlabTargetBranch == 'develop-fe' }
                        expression { env.gitlabActionType == 'PUSH' }
                    }
                }

            }
            steps {
                sh 'docker run -d -p 3000:3000 --name front-react --env-file .env --network my-network front-react'
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
