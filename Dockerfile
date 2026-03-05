FROM nginx:alpine
# 빌드된 정적 파일들을 Nginx 기본 경로로 복사
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]