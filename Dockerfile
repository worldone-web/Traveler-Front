# Node.js 14 버전 사용
FROM node:14

# 애플리케이션을 위한 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json 및 package-lock.json 파일을 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 프로젝트 소스 파일 복사
COPY . .

# 환경 변수 설정 (필요하다면 .env 파일도 복사)
# ENV NODE_ENV=production

# 서버가 사용할 포트를 열어줌(Docker 내부에서 사용할 포트)
EXPOSE 8080

# 서버 실행 명령어
CMD ["node", "server.js"]
