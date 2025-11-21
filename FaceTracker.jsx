import React, { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import "./FaceTracker.css";
const FaceTracker = () => {
  const containerRef = useRef(null); //用来拿头像那个圆圈的实际位置
  const [images, setImages] = useState([]); //存所有图片和它们的眼光指向坐标
  const [current, setCurrent] = useState(null); //当前真正要显示的那一张图
  //读取index.csv，把每张图的坐标加载进来
  useEffect(() => {
    fetch("/faces/index.csv") //去public/faces下面拿索引表
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true, // sv第一行是表头
          complete: (result) => {
            const data = result.data.map((row) => ({
              filename: row.filename,       //图的名字
              x: parseFloat(row.pupil_x),   //水平方向偏移（生成器算的）
              y: parseFloat(row.pupil_y),   //垂直方向偏移
            }));

            setImages(data);      // 把所有图片数据塞进state
            setCurrent(data[0]);  //初始就显示第一张
          },
        });
      });
  }, []);

  //跟踪鼠标，根据鼠标位置挑最接近的一张图显示
  useEffect(() => {
    const handleMove = (e) => {
      if (!containerRef.current || images.length === 0) return;

      //拿到头像那个圆圈在页面上的坐标
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;  //圆心 X
      const centerY = rect.top + rect.height / 2;  //圆心 Y

      //鼠标相对圆心的位置
      const dx = e.clientX - centerX;
      const dy = centerY - e.clientY; 

      //遍历所有图片，找距离鼠标方向最接近的那张
      const nearest = images.reduce(
        (best, img) => {
          //把鼠标方向和图片方向比距离，选最近的
          const dist = Math.hypot(dx - img.x, dy - img.y);
          return dist < best.dist ? { img, dist } : best;
        },
        { img: null, dist: Infinity }
      );

      //找到就切换图片
      if (nearest.img) setCurrent(nearest.img);
    };

    //注册全局鼠标监听
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [images]);

  //真实渲染部分（只负责把当前那张图放进圆圈里）
  return (
    <div className="face-wrapper">
      <div className="face-container" ref={containerRef}>
        {current && (
          <img
            src={`/faces/${current.filename}`} //显示当前选中的那张图
            alt="avatar"
            className="face-image"
          />
        )}
      </div>
    </div>
  );
};

export default FaceTracker;
