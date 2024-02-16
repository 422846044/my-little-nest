<template>
  <div>
    <Editor v-model="myValue" :init="init" :disabled="disabled" :placeholder="placeholder" :id="tinymceId"></Editor>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, defineEmits, watch, inject } from "vue";
import Editor from "@tinymce/tinymce-vue";
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver";
import "tinymce/themes/silver/theme";
import "tinymce/models/dom";
import "tinymce/icons/default";
import "tinymce/icons/default/icons";
// 引入编辑器插件
import "tinymce/plugins/code"; //编辑源码
import "tinymce/plugins/image"; //插入编辑图片
import "tinymce/plugins/media"; //插入视频
import "tinymce/plugins/link"; //超链接
import "tinymce/plugins/preview"; //预览
import "tinymce/plugins/template"; //模板
import "tinymce/plugins/table"; //表格
import "tinymce/plugins/pagebreak"; //分页
import "tinymce/plugins/lists"; //列
import "tinymce/plugins/advlist"; //列
import "tinymce/plugins/quickbars"; //快速工具条
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/skins/content/default/content.css";

//引入七牛云
import * as qiniu from 'qiniu-js'

//引入uuid
import { v4 as uuidv4 } from 'uuid'

//上传图片 首先调取接口获取七牛云的token
function uploadFile(file, resolve) {
  const indexOfSuffix = file.name.lastIndexOf("."); //后缀名
  const suffix = indexOfSuffix >= 0 ? file.name.substr(indexOfSuffix) : "";
  var prefix = uuidv4().replace('-', '')
  const filename = prefix + suffix; // uuid+后缀名
  if (file) {
    axios.get('http://127.0.0.1:8080/common/qiniu/getUploadToken').then(res => {
      if (res.data.result === true) {
        const putExtra = { fname: "", params: {}, git: null };
        const config = { useCdnDomain: true, region: qiniu.region.z2 };
        let observable = qiniu.upload(
          file, //要上传的文件对象。
          filename, //上传到七牛云后的文件名或路径(也就是图片的后缀)。
          res.data.data, //从服务器获取的七牛云上传凭证。
          putExtra, //额外的设置参数，包括文件名、自定义参数和自定义变量。
          config //配置参数，设置是否使用CDN加速和所选的七牛云存储区域。
        );
        observable.subscribe({
          next: ((response) => {
            if (response.total.percent >= 100) {
              console.log('上传成功');
            }
          }),
          error: ((err) => {
            console.log(err)
            console.log('上传失败,请稍后再试');
          }),
          complete: ((res) => {
            resolve('http://tuchuang.dfwx.fun/' + res.key)
          })
        })
      }
    })
  }
}

var axios = inject('$axios')
const emits = defineEmits(["updateEditor"]);
const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  height: {
    type: Number,
    default: 500,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  plugins: {
    type: [String, Array],
    default:
      "code image media link preview table quickbars template pagebreak lists advlist",
  },
  toolbar: {
    type: [String, Array],
    default:
      "undo redo codesample bold italic underline strikethrough link alignleft aligncenter alignright alignjustify \
      bullist numlist outdent indent removeformat forecolor backcolor |formatselect fontselect fontsizeselect | \
      blocks fontfamily fontsize pagebreak lists image media table template preview | code selectall",
  },
  templates: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
    default: () => { },
  },
});
//用于接收外部传递进来的富文本
const myValue = ref(props.value);
const tinymceId = ref(
  "vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + "")
);
const init = reactive({
  selector: "#" + tinymceId.value, //富文本编辑器的id,
  language_url: "/tinymce/langs/zh-Hans.js", // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
  language: "zh-Hans", //语言
  promotion: false, //隐藏右上角Upgrade 按钮
  skin_url: "/tinymce/skins/ui/oxide", // skin路径，具体路径看自己的项目
  content_css: "/tinymce/skins/content/default/content.css",
  menubar: true, //顶部菜单栏显示
  statusbar: true, // 底部的状态栏
  plugins: props.plugins,
  toolbar: props.toolbar,
  toolbar_mode: "sliding",
  font_formats:
    "Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;", //字体
  paste_convert_word_fake_lists: false, // 插入word文档需要该属性
  font_size_formats: "12px 14px 16px 18px 22px 24px 36px 72px", //文字大小
  height: props.height, //编辑器高度
  placeholder: props.placeholder,
  branding: false, //是否禁用“Powered by TinyMCE”
  image_dimensions: false, //去除宽高属性
  paste_webkit_styles: "all",
  paste_merge_formats: true,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: false,
  paste_data_images: true, // 允许图片粘贴
  file_picker_types: "file",
  resize: true,
  elementpath: true,
  content_style: ` * { padding:0; margin:0; }	img {max-width:100% !important }`,
  templates: props.templates,
  quickbars_selection_toolbar:
    "forecolor backcolor bold italic underline strikethrough link",
  quickbars_image_toolbar: "alignleft aligncenter alignright",
  quickbars_insert_toolbar: false,
  image_caption: true,
  image_advtab: true,
  convert_urls: false,
  images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
    let file = new File([blobInfo.blob()], '1.jpg', { type: blobInfo.type })
    uploadFile(file, resolve)
  }),
  setup: function (editor) {
    editor.on("init", function () {
      this.getBody().style.fontSize = "14px";
    });
    editor.on("OpenWindow", function (e) {
      //FIX 编辑器在el-drawer中，编辑器的弹框无法获得焦点
      var D = document.querySelector(".el-drawer.open");
      var E = e.target.editorContainer;
      if (D && D.contains(E)) {
        var nowDA = document.activeElement;
        setTimeout(() => {
          document.activeElement.blur();
          nowDA.focus();
        }, 0);
      }
    });
  },
  ...props.options,
});
//监听外部传递进来的的数据props.value变化
watch(
  () => props.value,
  () => {
    myValue.value = props.value;
    //emits("updateEditor", myValue.value);
  }
);
//监听富文本中的数据myValue.value变化
watch(
  () => myValue.value,
  () => {
    emits("updateEditor", myValue.value);
  }
);
//在onMounted中初始化编辑器
onMounted(() => {
  tinymce.init({});
});
</script>
<style></style>
