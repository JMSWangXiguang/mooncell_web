<template>
  <div v-if="editor" style="width: 100vw">
    <bubble-menu :tippy-options="{ duration: 100 }" :editor="editor">
      <el-button-group>
        <el-button
          size="mini"
          type="danger"
          @click="editor.chain().focus().setStrike().run()"
        >
          删除
        </el-button>
        <el-button
          size="mini"
          @click="editor.chain().focus().unsetStrike().run()"
        >
          取消
        </el-button>
      </el-button-group>
    </bubble-menu>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Strike from "@tiptap/extension-strike";
export default {
  components: {
    EditorContent,
    BubbleMenu,
  },

  props: {
    value: {
      type: String,
      default: () => "",
    },
    color: {
      type: String,
      default: () => "#ffff00",
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },

  data() {
    return {
      editor: null,
      deletable: true,
      interval: null,
    };
  },
  computed: {
    isStrike() {
      if (this.editor) {
        return this.editor.isActive("strike");
      }
      return false;
    },
  },

  watch: {
    isStrike() {
      if (this.isStrike) {
        this.interval = window.setInterval(() => {
          let text = "";
          if (window.getSelection) {
            text = window.getSelection().toString();
          } else if (
            document.selection &&
            document.selection.type !== "Control"
          ) {
            text = document.selection.createRange().text;
          }
          console.log(text);
          if ((text || "").length === 0) {
            this.editor.chain().focus().unsetStrike().run();
            console.log("触发取消");
          }
        }, 100);
      } else {
        if (this.interval !== null) window.clearInterval(this.interval);
      }
    },
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(value, false);
    },
    color() {
      this.editor.commands.toggleHighlight({ color: this.color });
    },
  },

  mounted() {
    const handlePaste = (view, event, slice) => {
      console.log(view, event, slice);
      // this.editor.commands.setHighlight({ color: this.color });
    };
    const handleKeyDown = (view, evt) => {
      try {
        const { $anchor, $from, $to } = view.state.tr.curSelection;
        const { parentOffset, nodeBefore } = $anchor;
        if (
          evt.keyCode === 13 || //判断回车及
          $from !== $to //选区中有内容且不为复制时 不走高亮
        ) {
          return false;
        }
        if (
          (parentOffset === 0 || //判断为段落开头
            !nodeBefore?.marks.length || //判断前一个节点不为mark
            nodeBefore?.marks[0].type.name === "strike" ||
            nodeBefore?.marks[0]?.attrs.userid) && //判断当前mark不为该用户
          ((47 < evt.keyCode && evt.keyCode < 58) || // 判断数字
            (64 < evt.keyCode && evt.keyCode < 91) || // 判断字母
            (95 < evt.keyCode && evt.keyCode < 108) || // 判断小数字
            evt.keyCode === 229 || // 判断输入法
            evt.keyCode === 32) // 判断空格
        ) {
          this.editor.commands.toggleHighlight({ color: this.color });
        }
        if (evt.keyCode === 8 && nodeBefore.textContent.length === 1) {
          console.log("删完");
          setTimeout(() => {
            var sel,
              el = document.getElementsByClassName("ProseMirror")[0];
            sel = window.getSelection();
            sel.collapse(el, 0);
            el.focus();
          }, 100);
        }
        if (
          (evt.keyCode === 8 && !nodeBefore?.marks.length) ||
          (evt.keyCode === 8 && nodeBefore?.marks[0].type.name === "strike")
        ) {
          this.deletable = false;
        } else {
          this.deletable = true;
        }
      } catch (error) {
        console.error(error);
      }
    };
    this.editor = new Editor({
      content: this.value,
      injectCSS: true,
      extensions: [
        StarterKit,
        Strike,
        Highlight.configure({ multicolor: true }),
        Extension.create({
          name: "custom-handler",
          addProseMirrorPlugins: () => {
            return [
              new Plugin({
                key: new PluginKey("customHandler"),
                props: {
                  handleKeyDown,
                  handlePaste,
                  handleClick: () => (this.deletable = true),
                },
                filterTransaction: () => this.deletable,
              }),
            ];
          },
        }),
      ],
      editable: !this.disabled,
      onUpdate: () => {
        // HTML
        this.$emit("input", this.editor.getHTML());

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    });
  },

  beforeDestroy() {
    this.editor.destroy();
    this.editor = null;
  },
};
</script>
<style lang="scss">
s {
  background-color: red;
}
</style>
