document.addEventListener('DOMContentLoaded', () => {
    const serverUrlInput = document.getElementById('serverUrl');
    const rtspUrlInput = document.getElementById('rtspUrl');
    const connectBtn = document.getElementById('connectBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    const statusText = document.getElementById('statusText');
    const video = document.getElementById('video');

    let webRtcStreamer = null;

    // 连接按钮点击事件
    connectBtn.addEventListener('click', () => {
        const serverUrl = serverUrlInput.value.trim();
        const rtspUrl = rtspUrlInput.value.trim();

        if (!serverUrl) {
            alert('请输入WebRTC服务器地址');
            return;
        }

        if (!rtspUrl) {
            alert('请输入RTSP地址');
            return;
        }

        // 禁用连接按钮，启用断开按钮
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;
        statusText.textContent = '状态: 正在连接...';

        // 创建WebRTC流实例
        webRtcStreamer = new WebRtcStreamer('video', serverUrl);
        
        // 连接视频流
        webRtcStreamer.connect(rtspUrl, null, "rtptransport=tcp");

        // 监听视频加载事件
        video.onloadedmetadata = () => {
            statusText.textContent = '状态: 已连接';
        };

        // 监听视频错误事件
        video.onerror = () => {
            statusText.textContent = '状态: 连接失败';
            connectBtn.disabled = false;
            disconnectBtn.disabled = true;
        };
    });

    // 断开按钮点击事件
    disconnectBtn.addEventListener('click', () => {
        if (webRtcStreamer) {
            webRtcStreamer.disconnect();
            webRtcStreamer = null;
        }

        // 启用连接按钮，禁用断开按钮
        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
        statusText.textContent = '状态: 已断开';
    });

    // 初始状态
    disconnectBtn.disabled = true;
}); 