const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// 서버 실행
app.listen(PORT, () => {
    console.log(`Neostream GIG 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});