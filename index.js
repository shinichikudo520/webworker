console.log('index.js...')
// webworker：Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。
// 1. 注册
var worker = new Worker('./worker.js');

// 2. 主线程和worker通讯
// postMessage()参数可以是各种数据类型，包括二进制数据
// 2.1 主线程
// 2.1.1 发送消息
worker.postMessage({cmd:'start',info:'hello worker!from index.js!'});

// 2.1.2 接收消息
worker.onmessage = function (e){
	console.log('index.js:' + e.data);
	doSomething();
}
function doSomething(){
	// 接收到worker传过来的数据，执行任务
	// doSomething...
	worker.postMessage({info:'Worker done!form index.js!'});
}

// 3. 关闭worker
// 3.1 在主线程关闭worker
// worker.terminate();


// 5. 主线程可以监听worker是否发生错误
worker.onerror = function(e){
	console.log('The worker made a mistake!',e)
};

// 6. 通讯规则
// 6.1：通讯时传输的数据时拷贝关系，即是传值而不是传址，worker对通信内容的修改，不会影响主线程
// 6.2：如果传输的是二进制数据，一旦将二进制数据转移给子线程，主线程就无法再使用这些二进制数据了，目的是为了防止多个线程同时修改数据的麻烦局面
var uInt8Array = new Uint8Array(new ArrayBuffer(10));
for (let i = 0;i < uInt8Array.length;i++) {
	uInt8Array[i] = i * 2; // [0,2,4,6,8,...]
}
worker.postMessage({cmd:'ArrayBuffer',info:uInt8Array})
// 6.3 直接转移数据的控制权
var ab = new ArrayBuffer(1);
worker.postMessage(ab,[ab]);

// 7. 一般worker的载入是一个单独的js脚本文件，也可载入与主线程在同一网页的代码
var blob = new Blob([document.getElementById('worker').textContent]);
var url = window.URL.createObjectURL(blob);
var worker2 = new Worker(url);

// 8. 实例：worker完成轮询
// 浏览器需要轮询服务器状态，以便第一时间得知状态的改变，这个工作可以放在worker里面
function createWorker(f){
	let blob = new Blob(['(' + f.toString() + ')()' ]);
	let url = window.URL.createObjectURL(blob);
	let worker = new Worker(url); 
	return worker;
}
var worker3 = createWorker(function(){
	var cache; // 缓存数据
	let api = 'https://api.apiopen.top/getJoke?page=1&count=2&type=video';
	setInterval(() => {
		// AJAX请求
		fetch(api).then(function (res) {
		  return res.json();
		}).then(data => {
			console.log('fetch结果：' + data)
			if (data.code === 200) {
				cache = data;
				self.postMessage(data);
			}
		}).catch(err =>{
			console.log('fetch失败:' + err);
		})
	},60000)
});
worker3.onmessage = function(e){
	// render data
	console.log('index.js：在worker3中轮询ajax请求得到的结果：',e.data);
}

// 9. onmessageerror
// 指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
worker.onmessageerror = function(){
	// dosomething...
}



