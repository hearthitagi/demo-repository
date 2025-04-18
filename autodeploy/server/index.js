import express from 'express';
import bodyParser from 'body-parser';
import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
import cors from 'cors';
import Docker from 'dockerode';

const app = express();
const port = 3000;
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'));

// 环境变量配置
const envVars = {
    HOST_IPADDRESS: '192.168.10.14',
    APP_PORT: 8080,
    SSL_PORT: 8443,
    FTP_VOLUME: '/home/demo-vsftpd/ftp_user/pulong/',
    MAP_VOLUME: '/home/demo-map',
    FTP_PORT: 8887,
    UPLOAD_PATH: '/home/demo-upload',
    NETWORK: 'demo-backend',
    GRPC_PORT: 9000,
    LOG_PATH: '/app/logs',
    FRONTEND_PORT: 3001,
    BACKEND_IP: '192.168.2.14'
};

// 关键步骤列表
const CRITICAL_STEPS = [
    'step-clone', 
    'step-checkout', 
    'step-build',
    'step-remove-image',
    'step-build-image',
    'step-remove-container',
    'step-start-container',
    'step-cleanup'
];

// 部署接口
app.post('/deploy', async (req, res) => {
    const { composeName, composeData, dbIP } = req.body;
    
    if (!composeName || !composeData || !dbIP) {
        res.write(`data: ${JSON.stringify({ status: 'failed', message: '组合名称、数据和部署IP不能为空' })}\n\n`);
        res.end();
        return;
    }

    // 设置响应头，启用SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let backendTempDir = '';
    let frontendTempDir = '';

    try {
        // 创建临时目录
        backendTempDir = path.join(os.tmpdir(), `temp_backend_${Date.now()}`);
        frontendTempDir = path.join(os.tmpdir(), `temp_frontend_${Date.now()}`);
        
        await executeCommand(`mkdir -p ${backendTempDir}`, res, 'step-clone', '创建后端临时目录...');
        await executeCommand(`mkdir -p ${frontendTempDir}`, res, 'step-clone', '创建前端临时目录...');
        
        // 克隆后端仓库
        await executeCommand(`cd ${backendTempDir} && git clone -b ${composeData.backendBranch} ${composeData.backendRepo} .`, res, 'step-clone', '正在克隆后端仓库...');
        
        // 克隆前端仓库
        await executeCommand(`cd ${frontendTempDir} && git clone -b ${composeData.frontendBranch} ${composeData.frontendRepo} .`, res, 'step-clone', '正在克隆前端仓库...');

        // 构建后端
        try {
            await executeCommand(
                `cd ${backendTempDir} && sed -i "s/192.168.10.14/${dbIP}/g" ./src/main/resources/application.yml && mvn clean package --settings /opt/apache-maven-3.9.8/conf/settings.xml '-Dmaven.test.skip=true'`, 
                res, 
                'step-build', 
                '正在构建后端...'
            );

            // 验证jar文件是否生成
            const jarPath = path.join(backendTempDir, 'target', 'robot-manage-platform-1.0-SNAPSHOT.jar');
            if (!fs.existsSync(jarPath)) {
                throw new Error('后端构建失败：未找到生成的jar文件');
            }
            res.write(`data: ${JSON.stringify({ status: 'active', message: '后端构建成功，jar文件已生成' })}\n\n`);
        } catch (err) {
            console.error('后端构建失败:', err);
            throw new Error(`后端构建失败: ${err.message}`);
        }

        // 检查并删除同名后端容器
        try {
            const existingBackendContainer = docker.getContainer('backend');
            const containerInfo = await existingBackendContainer.inspect();
            if (containerInfo.State.Running) {
                await existingBackendContainer.stop();
                res.write(`data: ${JSON.stringify({ status: 'active', message: '正在停止旧的后端容器...' })}\n\n`);
                // 等待容器完全停止
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            await existingBackendContainer.remove({ force: true });
            res.write(`data: ${JSON.stringify({ status: 'active', message: '已删除旧的后端容器' })}\n\n`);
        } catch (err) {
            // 容器不存在时忽略错误
        }

        // 检查并删除同名前端容器
        try {
            const existingFrontendContainer = docker.getContainer('frontend');
            const containerInfo = await existingFrontendContainer.inspect();
            if (containerInfo.State.Running) {
                await existingFrontendContainer.stop();
                res.write(`data: ${JSON.stringify({ status: 'active', message: '正在停止旧的前端容器...' })}\n\n`);
                // 等待容器完全停止
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            await existingFrontendContainer.remove({ force: true });
            res.write(`data: ${JSON.stringify({ status: 'active', message: '已删除旧的前端容器' })}\n\n`);
        } catch (err) {
            // 容器不存在时忽略错误
        }

        // 等待确保容器完全删除
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 删除同名后端镜像
        try {
            const backendImage = docker.getImage('backend:latest');
            await backendImage.remove();
            res.write(`data: ${JSON.stringify({ status: 'active', message: '删除旧的后端镜像...' })}\n\n`);
        } catch (err) {
            if (err.statusCode === 404) {
                // 镜像不存在，这是正常情况
            } else {
                console.error('删除后端镜像失败:', err);
                throw new Error(`删除后端镜像失败: ${err.message}`);
            }
        }

        // 删除同名前端镜像
        try {
            const frontendImage = docker.getImage('frontend:latest');
            await frontendImage.remove();
            res.write(`data: ${JSON.stringify({ status: 'active', message: '删除旧的前端镜像...' })}\n\n`);
        } catch (err) {
            if (err.statusCode === 404) {
                // 镜像不存在，这是正常情况
            } else {
                console.error('删除前端镜像失败:', err);
                throw new Error(`删除前端镜像失败: ${err.message}`);
            }
        }

        // 使用dockerode生成后端镜像
        res.write(`data: ${JSON.stringify({ status: 'active', message: '正在生成后端镜像...' })}\n\n`);
        try {
            // 确保Dockerfile存在
            const dockerfilePath = path.join(backendTempDir, 'Dockerfile');
            if (!fs.existsSync(dockerfilePath)) {
                throw new Error('Dockerfile不存在');
            }

            // 检查jar文件是否存在
            const jarPath = path.join(backendTempDir, 'target', 'backend-1.0-SNAPSHOT.jar');
            if (!fs.existsSync(jarPath)) {
                throw new Error(`JAR文件不存在: ${jarPath}`);
            }

            // 创建构建上下文
            const buildContext = {
                context: `${backendTempDir}`,
                src: [
                    'Dockerfile',
                    'target/backend-1.0-SNAPSHOT.jar'
                ]
            };

            const backendBuildStream = await docker.buildImage(buildContext, { 
                t: 'backend:latest',
                buildargs: {
                    HOST_IPADDRESS: envVars.HOST_IPADDRESS
                }
            });

            await new Promise((resolve, reject) => {
                let buildOutput = '';
                docker.modem.followProgress(backendBuildStream, (err, stream) => {
                    if (err) {
                        console.error('生成后端镜像失败:', err);
                        reject(err);
                    } else {
                        resolve(stream);
                    }
                }, (event) => {
                    if (event.stream) {
                        buildOutput += event.stream;
                        console.log('构建输出:', event.stream);
                    }
                    if (event.error) {
                        console.error('构建错误:', event.error);
                        reject(new Error(`构建错误: ${event.error}`));
                    }
                });
            });
            res.write(`data: ${JSON.stringify({ status: 'active', message: '后端镜像已生成' })}\n\n`);
        } catch (err) {
            console.error('生成后端镜像失败:', err);
            throw new Error(`生成后端镜像失败: ${err.message}`);
        }

        // 验证后端镜像是否构建成功
        try {
            const backendImage = docker.getImage('backend:latest');
            await backendImage.inspect();
        } catch (err) {
            console.error('后端镜像不存在:', err);
            throw new Error('后端镜像构建失败，请检查构建日志');
        }

        // 构建前端
        try {
            await executeCommand(
                `cd ${frontendTempDir} && npm install`, 
                res, 
                'step-build', 
                '正在安装前端依赖...'
            );
            
            await executeCommand(
                `cd ${frontendTempDir} && npm run build`, 
                res, 
                'step-build', 
                '正在构建前端...'
            );

            // 验证dist目录是否存在
            const distPath = path.join(frontendTempDir, 'dist');
            if (!fs.existsSync(distPath)) {
                throw new Error('前端构建失败：未找到dist目录');
            }

            // 验证dist目录是否为空
            const distFiles = fs.readdirSync(distPath);
            if (distFiles.length === 0) {
                throw new Error('前端构建失败：dist目录为空');
            }

            res.write(`data: ${JSON.stringify({ status: 'active', message: '前端构建成功，dist目录已生成' })}\n\n`);
        } catch (err) {
            console.error('前端构建失败:', err);
            throw new Error(`前端构建失败: ${err.message}`);
        }

        // 使用dockerode构建前端镜像
        res.write(`data: ${JSON.stringify({ status: 'active', message: '正在构建前端镜像...' })}\n\n`);
        try {
            // 确保Dockerfile存在
            const dockerfilePath = path.join(frontendTempDir, 'Dockerfile');
            if (!fs.existsSync(dockerfilePath)) {
                throw new Error('前端Dockerfile不存在');
            }

            // 确保nginx配置文件存在
            const nginxConfPath = path.join(frontendTempDir, 'nginx', 'conf.d', 'nginx.conf');
            if (!fs.existsSync(nginxConfPath)) {
                throw new Error('nginx配置文件不存在');
            }

            // 确保dist目录存在
            const distPath = path.join(frontendTempDir, 'dist');
            if (!fs.existsSync(distPath)) {
                throw new Error('dist目录不存在');
            }

            // 创建构建上下文
            const buildContext = {
                context: `${frontendTempDir}`,
                src: [
                    'Dockerfile',
                    'dist',
                    'nginx'
                ]
            };

            const frontendBuildStream = await docker.buildImage(buildContext, { 
                t: 'frontend:latest'
            });

            await new Promise((resolve, reject) => {
                let buildOutput = '';
                docker.modem.followProgress(frontendBuildStream, (err, stream) => {
                    if (err) {
                        console.error('构建前端镜像失败:', err);
                        reject(err);
                    } else {
                        resolve(stream);
                    }
                }, (event) => {
                    if (event.stream) {
                        buildOutput += event.stream;
                    }
                    if (event.error) {
                        console.error('构建错误:', event.error);
                        reject(new Error(event.error));
                    }
                });
            });
            res.write(`data: ${JSON.stringify({ status: 'active', message: '前端镜像构建完成' })}\n\n`);
        } catch (err) {
            console.error('构建前端镜像失败:', err);
            throw new Error(`构建前端镜像失败: ${err.message}`);
        }

        // 验证前端镜像是否构建成功
        try {
            const frontendImage = docker.getImage('frontend:latest');
            await frontendImage.inspect();
        } catch (err) {
            console.error('前端镜像不存在:', err);
            throw new Error('前端镜像构建失败，请检查构建日志');
        }

        // 等待确保容器完全删除
        await new Promise(resolve => setTimeout(resolve, 1000));

        const backendContainer = await docker.createContainer({
            name: 'backend',
            Image: 'backend:latest',
            HostConfig: {
                PortBindings: {
                    [`${envVars.APP_PORT}/tcp`]: [{ HostPort: `${envVars.APP_PORT}` }],
                    [`${envVars.GRPC_PORT}/tcp`]: [{ HostPort: `${envVars.GRPC_PORT}` }]
                },
                Binds: [
                    `${envVars.UPLOAD_PATH}:${envVars.UPLOAD_PATH}`,
                    `${envVars.LOG_PATH}:/app/logs`,
                    `${envVars.FTP_VOLUME}:/home/vsftpd`,
                    `${envVars.MAP_VOLUME}:${envVars.MAP_VOLUME}`
                ],
                NetworkMode: envVars.NETWORK
            }
        });

        const frontendContainer = await docker.createContainer({
            name: 'frontend',
            Image: 'frontend:latest',
            HostConfig: {
                PortBindings: {
                    [`${envVars.FRONTEND_PORT}/tcp`]: [{ HostPort: `${envVars.FRONTEND_PORT}` }]
                },
                NetworkMode: envVars.NETWORK
            }
        });

        await backendContainer.start();
        res.write(`data: ${JSON.stringify({ status: 'active', message: '后端容器启动成功' })}\n\n`);
        
        await frontendContainer.start();
        res.write(`data: ${JSON.stringify({ status: 'active', message: '前端容器启动成功' })}\n\n`);

        // 清理临时文件
        res.write(`data: ${JSON.stringify({ status: 'active', message: '正在清理临时文件...' })}\n\n`);
        try {
            if (backendTempDir && fs.existsSync(backendTempDir)) {
                await executeCommand(`rm -rf ${backendTempDir}`, res, 'step-cleanup', '清理后端临时文件...');
            }
            if (frontendTempDir && fs.existsSync(frontendTempDir)) {
                await executeCommand(`rm -rf ${frontendTempDir}`, res, 'step-cleanup', '清理前端临时文件...');
            }
        } catch (err) {
            console.error('清理临时文件失败:', err);
            throw new Error(`清理临时文件失败: ${err.message}`);
        }

        // 部署完成
        res.write(`data: ${JSON.stringify({ status: 'completed', message: '部署完成' })}\n\n`);
        res.end();
    } catch (error) {
        console.error('部署失败:', error);
        res.write(`data: ${JSON.stringify({ status: 'failed', message: '部署失败: ' + error.message })}\n\n`);
        
        // 清理临时文件
        // try {
        //     if (backendTempDir && fs.existsSync(backendTempDir)) {
        //         await executeCommand(`rm -rf ${backendTempDir}`, res, null, '正在清理后端临时文件...');
        //     }
        //     if (frontendTempDir && fs.existsSync(frontendTempDir)) {
        //         await executeCommand(`rm -rf ${frontendTempDir}`, res, null, '正在清理前端临时文件...');
        //     }
        // } catch (cleanupError) {
        //     console.error('清理临时文件失败:', cleanupError);
        // }
        
        res.write(`data: ${JSON.stringify({ status: 'failed', message: '部署失败，已清理临时文件' })}\n\n`);
        res.end();
    }
});

// 目录选择接口
app.post('/select-directory', async (req, res) => {
    try {
        // 使用 zenity 创建目录选择对话框
        const childProcess = spawn('zenity', [
            '--file-selection',
            '--directory',
            '--title=选择保存目录'
        ], {
            shell: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        childProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        childProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        childProcess.on('close', (code) => {
            if (code === 0) {
                const selectedPath = stdout.trim();
                if (selectedPath) {
                    res.json({ success: true, directory: selectedPath });
                } else {
                    res.json({ success: false, message: '未选择目录' });
                }
            } else {
                // code 1 表示用户取消了选择
                res.json({ success: false, message: '用户取消了选择' });
            }
        });

        childProcess.on('error', (error) => {
            res.json({ success: false, message: `启动文件选择器失败: ${error.message}` });
        });

    } catch (error) {
        res.json({ success: false, message: `选择目录失败: ${error.message}` });
    }
});

// 保存镜像接口
app.post('/save-images', async (req, res) => {
    const { composeName, composeData, saveDirectory } = req.body;
    
    if (!composeName || !composeData || !saveDirectory) {
        res.write(`data: ${JSON.stringify({ status: 'failed', message: '参数不完整' })}\n\n`);
        res.end();
        return;
    }

    // 设置响应头，启用SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        // 使用dockerode保存后端镜像
        const backendImage = docker.getImage('backend:latest');
        const backendStream = await backendImage.get();
        const backendWriteStream = fs.createWriteStream(path.join(saveDirectory, 'backend.tar'));
        
        backendStream.pipe(backendWriteStream);
        
        await new Promise((resolve, reject) => {
            backendWriteStream.on('finish', resolve);
            backendWriteStream.on('error', reject);
        });

        // 设置后端镜像文件权限为755
        await fs.promises.chmod(path.join(saveDirectory, 'backend.tar'), 0o755);

        res.write(`data: ${JSON.stringify({ status: 'active', message: '后端镜像保存成功' })}\n\n`);

        // 使用dockerode保存前端镜像
        const frontendImage = docker.getImage('frontend:latest');
        const frontendStream = await frontendImage.get();
        const frontendWriteStream = fs.createWriteStream(path.join(saveDirectory, 'frontend.tar'));
        
        frontendStream.pipe(frontendWriteStream);
        
        await new Promise((resolve, reject) => {
            frontendWriteStream.on('finish', resolve);
            frontendWriteStream.on('error', reject);
        });

        // 设置前端镜像文件权限为755
        await fs.promises.chmod(path.join(saveDirectory, 'frontend.tar'), 0o755);

        res.write(`data: ${JSON.stringify({ status: 'active', message: '前端镜像保存成功' })}\n\n`);
        res.write(`data: ${JSON.stringify({ status: 'completed', message: '所有镜像保存完成' })}\n\n`);
        res.end();
    } catch (error) {
        console.error('保存镜像失败:', error);
        res.write(`data: ${JSON.stringify({ status: 'failed', message: '保存镜像失败: ' + error.message })}\n\n`);
        res.end();
    }
});

// 执行命令的辅助函数
function executeCommand(command, res, step, message) {
    return new Promise((resolve, reject) => {
        // 只在关键步骤开始时显示消息
        if (step && CRITICAL_STEPS.includes(step)) {
            res.write(`data: ${JSON.stringify({ status: 'active', message })}\n\n`);
        }
        
        const process = spawn(command, {
            shell: true,
            maxBuffer: 1024 * 1024 * 10, // 10MB
            stdio: ['ignore', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        process.on('close', (code) => {
            if (code !== 0) {
                const errorMessage = `执行失败: ${stderr || '未知错误'}\n命令: ${command}`;
                if (step) {
                    res.write(`data: ${JSON.stringify({ status: 'failed', message: errorMessage })}\n\n`);
                }
                reject(new Error(errorMessage));
                return;
            }
            resolve(stdout);
        });

        process.on('error', (error) => {
            const errorMessage = `执行失败: ${error.message}\n命令: ${command}`;
            if (step) {
                res.write(`data: ${JSON.stringify({ status: 'failed', message: errorMessage })}\n\n`);
            }
            reject(new Error(errorMessage));
        });
    });
}

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
}); 