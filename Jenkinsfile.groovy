pipeline {
    agent any

    stages {
        stage('Clone') {

            steps {
                echo "Running ${env.GIT_BRANCH} on ${env.JENKINS_URL}"
                echo 'Clone ${env.GIT_BRANCH}, ${env.JENKINS_URL}, '
                git branch: "${env.GIT_BRANCH}", credentialsId: 'test2', url: 'https://lab.ssafy.com/s08-final/S08P31A307.git'
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

        stage('Sonar Analysis') {
            steps {
                echo 'Sonar Analysis...'
            }
        }
        stage('Docker FE Rm') {
            when {
                anyOf{
                    allOf{
                        expression { env.gitlabActionType == 'PUSH' }
                        branch 'master'
                    }
                    allOf{
                        branch 'develop-fe'
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
                        branch 'master'
                    }
                    allOf{
                        branch 'develop-be'
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
        stage('BE Build') {
            when {
                anyOf{
                    branch 'develop-be'
                    branch 'master'
                }
            }
            steps {

                sh '''
                cd Backend/ifIDieTomorrow
                chmod +x gradlew
                ./gradlew clean build
                '''
            }
        }

        stage('FE Dockerizing'){
            when {
                anyOf{
                    allOf{
                        expression { env.gitlabActionType == 'PUSH' }
                        branch 'master'
                    }
                    allOf{
                        branch 'develop-fe'
                        expression { env.gitlabActionType == 'PUSH' }
                    }
                }

            }
            steps{
                sh 'echo " Image Bulid Start"'
                sh '''
                cd Frontend/frontend
                docker build -t front-react -f ./DockerFile .
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
                        branch 'master'
                    }
                    allOf{
                        branch 'develop-be'
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
                        branch 'master'
                    }
                    allOf{
                        branch 'develop-be'
                        expression { env.gitlabActionType == 'PUSH' }
                    }
                }

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
                        branch 'master'
                    }
                    allOf{
                        branch 'develop-fe'
                        expression { env.gitlabActionType == 'PUSH' }
                    }
                }

            }
            steps {
                sh 'docker run -d -p 3000:3000 --name front-react --network my-network front-react'
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