---
title: 前端解决pdf分页问题
cover: /bac10.png
date: 2024-06-11
tags:
 - git
 
categories: 
 - 前端技术

---
::: tip 介绍
前端下载pdf进行分页处理<br>
:::

   最近在解决业务问题的时候发现有前端下载pdf的需求并且需要把批量下载pdf，并把页面中的附件进行打包，然后把每个单据进行单独文件夹处理最后进行一个zip的打包，心想这不是好整，直接拿插件html2canvas+jsPDF+JSZip
   
```js
​    html2canvas(el, {

​      allowTaint: true,

​      scale: 1.2

​    }).then(function (canvas) {

​      console.log("canvas: ", canvas);

​      var contentWidth = canvas.width;

​      var contentHeight = canvas.height;

​      // 一页pdf显示html页面生成的canvas高度;

​      var pageHeight = (contentWidth / 592.28) * 841.89;

​      // 未生成pdf的html页面高度

​      var leftHeight = contentHeight;

​      // pdf页面偏移

​      var position = 0;

​      // html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）

​      var imgWidth = 595.28;

​      var imgHeight = (imgWidth / contentWidth) * contentHeight;



​      var pageData = canvas.toDataURL("image/jpeg", 1.0);

​      var pdf = new jsPDF("", "pt", "a4", true);



​      // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)

​      // 当内容未超过pdf一页显示的范围，无需分页



​      if (leftHeight < pageHeight) {

​        pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);

​      } else {

​        while (leftHeight > 0) {

​          pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight)

​          leftHeight -= pageHeight;

​          position -= 841.89;

​          // 避免添加空白页

​          if (leftHeight > 0) {

​            pdf.addPage();

​          }

​        }

​      }

​      resolve(pdf);

​    });
```

但是会出现一个问题，就是内容是不固定高度的，可能会出现分页时切割文字的问题，谷歌搜了很多方法，发现很多都是根据自己的业务场景简单的处理并不能满足需求，所以自己需要自己造轮子


## 下面的优化后的方案

对页面节点进行标记,下面是示例内容

```xml
	<div ref="pdfRef" id="print-zone" class="pdf-template-wrap">
			<div class="header-title pdf-cont">xxxxx</div>
			<div class="content-wrap">
				<ItemInfo class="pdf-cont" title="xxxxx"> {{ props.data?.reportInfo.correctiveEmployeeName }} </ItemInfo>
				<ItemInfo class="pdf-cont" title="xxxxx"> {{ props.data?.reportInfo.correctiveDeptName || "--" }} </ItemInfo>
				<ItemInfo class="pdf-cont" title="xxxxx"> {{ props.data?.reportInfo.planExpectFinishDate || "--" }} </ItemInfo>
				<ItemInfo class="pdf-cont" title="xxxxx"> {{ props.data?.reportInfo.correctiveExpectFinishDate || "--" }} </ItemInfo>
			</div>
	</div>
```
```js
    //父组件调用
	const pdf = await getPdfPromiseMeta(pdfRef.value);
	const files = urlList
	emit("pdfBlob", { pdf: pdf, pdfName: `不符合事件处置单-${props.data?.reportInfo.id}.pdf`,attachments:files });
```
```ts
//重点~  实现pdf监测分页方法
export const getPdfPromiseMeta = (el: any): Promise<jsPDF> => {
	console.log('调用');
	return new Promise((resolve, reject) => {
		// 计算页面
		const A4_WIDTH = 592.28;
		const A4_HEIGHT = 841.89;
		let target = document.getElementById('print-zone');
		let H_page = target.scrollWidth
		let pageHeight = H_page / A4_WIDTH * A4_HEIGHT - 7;
		const isSplit = (nodes:any, index:any, pageHeight:any) => {
			// 计算当前这块dom是否跨越了a4大小，以此分割
			if (nodes[index].offsetTop + nodes[index].offsetHeight  < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight) {
				return true;
			}
			return false;
		}
		let lableListID = target.getElementsByClassName('pdf-cont');
		for (let i = 0; i < lableListID.length; i++) {
			let multiple = Math.ceil((lableListID[i].offsetTop + lableListID[i].offsetHeight) / pageHeight);
			if (isSplit(lableListID, i, multiple * pageHeight)) {
				let divParent = lableListID[i].parentNode; // 获取该div的父节点
				let newNode = document.createElement('div');
				newNode.className = 'emptyDiv';
				let _H = multiple * pageHeight - (lableListID[i].offsetTop + lableListID[i].offsetHeight);
				newNode.style.height = _H + 36 + 'px';
				newNode.style.width = '100%';
				let next = lableListID[i].nextSibling;
				if (next) {
					divParent.insertBefore(newNode, next);
				} else {
					// 不存在则直接添加到最后,appendChild默认添加到divParent的最后
					divParent.appendChild(newNode);
				}
			}
		}

		// 生成canvas
		html2canvas(el, {
			allowTaint: true,
			scale: 1.2
		}).then(function (canvas) {
			console.log("canvas: ", canvas);
			var contentWidth = canvas.width;
			var contentHeight = canvas.height;
			// 一页pdf显示html页面生成的canvas高度;
			var pageHeight = (contentWidth / 592.28) * 841.89;
			// 未生成pdf的html页面高度
			var leftHeight = contentHeight;
			// pdf页面偏移
			var position = 0;
			// html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
			var imgWidth = 595.28;
			var imgHeight = (imgWidth / contentWidth) * contentHeight;

			var pageData = canvas.toDataURL("image/jpeg", 1.0);
			var pdf = new jsPDF("", "pt", "a4", true);

			// 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
			// 当内容未超过pdf一页显示的范围，无需分页

			if (leftHeight < pageHeight) {
				pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
			} else {
				while (leftHeight > 0) {
					pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight)
					leftHeight -= pageHeight;
					position -= 841.89;
					// 避免添加空白页
					if (leftHeight > 0) {
						pdf.addPage();
					}
				}
			}
			resolve(pdf);
		});
	});
};
```

```TS
//此方法为将文件进行分文件夹打包成zip
interface PDFMetadata {
	pdfName: string;
	pdf: any;
	attachments?: File[];
}
const downloadAndAddAttachment = async (attachmentURL: any, folder: any, index: any) => {
    try {
        const response = await fetch(`${getFileUrl()}${attachmentURL.url}`);
		console.log('attachmentURL',attachmentURL);
        const blob = await response.blob();
        folder?.file(`${attachmentURL.id}-${attachmentURL.name}`, blob); // 将附件添加到文件夹中
    } catch (error) {
        console.error(`Error downloading attachment: ${attachmentURL}`, error);
    }
};
export const useMeatListDownloadPdf = (pdfMeatList: PDFMetadata[], callback?: () => void) => {
	try {
		// pdf转zip
		const downloadPromises: Promise<void>[] = [];
		const zip = new JSZip();
		pdfMeatList.forEach((pdfMeta:any) => {
			const folder = zip.folder(pdfMeta.pdfName); // 创建文件夹-子文件夹
			folder?.file(`${pdfMeta.pdfName}.pdf`, pdfMeta.pdf.output("blob")); // 子文件夹中创建一个pdf文件
			if (pdfMeta.attachments && pdfMeta.attachments.length > 0) {
				const attachmentFolder = folder?.folder('附件');
				pdfMeta.attachments.forEach((attachment:any, index:any) => {
					downloadPromises.push(downloadAndAddAttachment(attachment, attachmentFolder,index)); // 将下载附件的 Promise 添加到数组中
				});
			}
		});
		Promise.all(downloadPromises).then(() => {
			zip.generateAsync({ type: "blob" }).then((content) => {
				FileSaver.saveAs(content, "不符合事件处置单.zip");
			});
		});
		callback?.();
	} catch (err) {
		callback?.();
		console.log(["下载错误日志", err]);
	}
};
```


原理就是进行有高度的节点进行标记，动态计算节点高度是否跨页，跨页就新增一个emptyDiv的高度进行撑开