const express = require('express');
const fs = require('fs').promises; // 파일 시스템 promise 버전 사용
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // 배포 플랫폼이 지정하는 포트 사용

// JSON 요청 본문을 파싱하고, public 폴더의 정적 파일을 제공
app.use(express.json());
app.use(express.static('public'));

const messagesFilePath = path.join(__dirname, 'messages.json');

// 메시지 목록 가져오기 (GET 요청)
app.get('/api/messages', async (req, res) => {
    try {
        const data = await fs.readFile(messagesFilePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ message: "메시지를 불러올 수 없습니다." });
    }
});

// 새 메시지 추가하기 (POST 요청)
app.post('/api/messages', async (req, res) => {
    try {
        const newMessage = {
            id: Date.now(),
            content: req.body.content,
        };

        const data = await fs.readFile(messagesFilePath, 'utf8');
        const messages = JSON.parse(data);
        messages.push(newMessage);

        await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2));
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "메시지 저장에 실패했습니다." });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});