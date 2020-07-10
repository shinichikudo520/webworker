console.log('worker.js...');

// 2.2 worker
// 2.2.1 接收主线程的消息
// self：代表子线程自身，即子线程的全局对象
self.addEventListener('message',function(e){
	const data = e.data;
	console.log('worker：' + (data.info || data));
	// 模拟异步：有些数据的异步请求可以放在worker中进行，减少主线程的压力
	setTimeout(() => {
		switch(data.cmd){
			// 2.2.2 子线程发消息给主线程
			case 'start':
				self.postMessage('worker started!from worker.js');
			break;
			case 'stop':
				self.postMessage('worker stopped!from worker.js');
			break;
			case 'ArrayBuffer':
				// self.postMessage();
			break;
			default:
				// self.postMessage('');
				console.log('unknown command!',data.cmd);
			break;
		}
	},1000)
},false)
// 也可以写成下面的形式：
/**
// 写法一
this.addEventListener('message', function (e) {
  console.log('worker：' + e.data);
}, false);

// 写法二
addEventListener('message', function (e) {
  console.log('worker：' + e.data);
}, false);
// 写法三
self.onmessage = function (e) {
  console.log('worker：' + e.data);
}
 */

// 3.2 在woker里关闭worker
// self.close();

// 4. 在worker中加载脚本：importScripts()
importScripts('./script1.js');
// importScripts('./script1.js'，'./script2.js',...); // 可以同时加载多个脚本

