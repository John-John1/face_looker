#### 复现
 复现步骤
1. 克隆仓库
git clone https://github.com/kylan02/face_looker
cd face_looker

2. 安装 Python 依赖（使用 uv）
uv pip install -r requirements.txt

3. 设置 Replicate API 密钥（PowerShell）
$env:REPLICATE_API_TOKEN = "你的API_Key"

4. 运行 Python 生成视线图像
python main.py \
  --image ./my_face.jpg \
  --out ./out \
  --min -15 \
  --max 15 \
  --step 3 \
  --size 256 \
  --skip-existing

 React 动态网页

React 用来生成动态网页，使人脸能够跟随鼠标移动视线。

1. 在项目目录创建 React 应用
npx create-react-app react

2. 安装依赖
npm install

3. 将生成的图片拷贝到 React 公共目录
cp -r ./out/faces path/to/your-react-app/public/faces

4. 创建 Hooks 和组件目录
mkdir src/hooks
mkdir src/components

5. 添加以下文件

放到 src/hooks：

FaceTracker.css

FaceTracker.jsx

FaceTracker_beck.jsx

Page.css

Page.jsx

useGazeTracking.js

6. 修改 app.js
import Page from "./components/Page"; 
export default function App() {
  return (
    <div className="App">
      <Page />
    </div>
  );
}

启动项目

运行：

npm start


npm start 做的事情：
它会调用 package.json → "scripts": { "start": ... } 里的那条 start 命令。
